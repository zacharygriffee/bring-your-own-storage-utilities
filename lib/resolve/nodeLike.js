import {
    loadPackageJson$,
    parseModuleSpecifier,
    resolveExports, // from find/resolvePackageExportsImports.js
    isAbsolute,
    isRelative,
    findNodeModule$
} from "../../index.js";


import * as _ from "lodash-es";
import * as rx from "rxjs";
// Import of concatIfEmpty not working right
import path from "tiny-paths";
import codec from "codecs";
const filterNil = () => rx.filter(x => x != null);

// rxjs-etc.concatIfEmpty export not working.
function concatIfEmpty(
    observable
) {
    return (source) =>
        source.pipe(
            rx.publish((sharedSource) =>
                rx.merge(
                    sharedSource,
                    sharedSource.pipe(
                        rx.isEmpty(),
                        rx.mergeMap((empty) => (empty ? observable : rx.EMPTY))
                    )
                )
            )
        );
}


/*
* https://nodejs.org/api/esm.html#resolution-algorithm &&
* https://nodejs.org/api/modules.html#all-together
* A node module like resolution algorithm that isn't perfect yet.
* Improvements needed
**/

function loadFile$(source, id, from = "/", config = {}) {
    const {
        tryExtensions = ["", ".js", ".json", ".mjs", "/package.json"],
        getter,
        encoding,
        ...restConfig
    } = config;

    const x = config.state.keyValueMode ? id : path.resolve(path.dirname(from) , id);

    const ids = config.state.type === "bare" ? [x] : _.reduce(tryExtensions, (acc, xt) => [...acc, x + xt], []);

    return rx.concat(ids).pipe(
        rx.concatMap(x => rx.defer(() => getter(source, config.state.id = x, restConfig))),
        // rx.tap(x => console.log("Got this", x, {source, id, from, config})),
        filterNil(),
        rx.map(encoding.decode),
        concatIfEmpty(rx.defer(() => loadDirectory$(source, x, {tryExtensions, getter, ...config}))),
        rx.catchError(
            e => {
                return rx.EMPTY;
            }
        )
    )
}

function loadDirectory$(source, id, config) {
    const {
        exportConditions = ["browser", "import", "es2015", "default"],
        state
    } = config;

    if (state.type !== "bare") {
        return loadIndex$(source, id, config);
    }

    return loadPackageJson$(source, {...config, cwd: id}).pipe(
        filterNil(),
        // Todo, this is a mess.
        rx.toArray(),
        rx.map(o => o.reverse()),
        rx.concatAll(),
        rx.concatMap(
            pkg => {
                // console.log(state.entryId, pkg?.main, id);
                if (!pkg || config.state.pkg) {
                    return rx.EMPTY;
                }
                const moduleInfo = parseModuleSpecifier(state.entryId);
                if (!moduleInfo) return rx.EMPTY;

                let main, resolvedMain;

                pkg.main ||= "index.js";


                const {name: moduleName, pathName: modulePath} = moduleInfo;
                const [prepath] = id.replace(moduleName, "|").split("|");

                try {
                    [main] = resolveExports(pkg.exports, _.trimStart(modulePath, "./"), exportConditions);
                    resolvedMain = path.join(...[prepath, moduleName, main].filter(o => !!o));
                } catch (e) {
                    try {
                        main = modulePath || pkg?.[["module", "browser", "main"].find(s => pkg[s])];
                        if (_.isObject(main)) {
                            [main] = resolveExports(main, pkg.main || modulePath || "", exportConditions);
                        }
                        resolvedMain = path.join(...[prepath, moduleName, modulePath || main].filter(o => !!o));
                    } catch (e) {
                        resolvedMain = pkg.main || "./index.js";
                    }
                }

                // console.log(config.state.debugId, "resolved to", {id, resolvedMain, pkg, prepath, modulePath}, config.state);

                config.state.pkg = pkg;
                config.state.resolvedTo = resolvedMain;

                return loadFile$(source, resolvedMain, undefined, config);
            }
        ),
        concatIfEmpty(rx.defer(() => loadIndex$(source, id, config))),
    )
}

function loadIndex$(source, x, config = {}) {
    const {
        tryExtensions,
        tryIndex = ["/index"],
        getter,
        encoding
    } = config;

    // console.log("loadIndex$", x, {source, config});

    if (x.endsWith("index"))
        return rx.of(null);

    const idsIndexes = _.map(tryIndex, index => _.map(tryExtensions, ext => path.resolve(x + index + ext))).flat();

    return rx.concat(idsIndexes)
        .pipe(
            rx.concatMap(x => getter(source, config.state.id = x, config)),
            filterNil(),
            rx.map(encoding.decode)
        )
}

/**
 * Resolve an id/from (files) from source storage.
 * @notes
 * The behavior and config is modelled off of this pseudocode: https://nodejs.org/api/modules.html#all-together
 * Not supported yet: package.json imports field
 * @param sources A list of sources to search for files.
 * @param id The id of the file being imported
 * @param from The id of the file that is importing 'id'
 * @param [config={}]
 * @param [config.keyValueMode] Not yet implemented ~~Set to true if the source is a key/value source or database that does not store keys like files. node_module resolution
 * is disabled with this mode, and the default codec is changed to identity codec where the value of the key/value pair will be returned.~~
 * @param [config.getter=source.get] The getter to retrieve data/code from source.
 * @param [config.detailed=false] If true, will return additional information about the resolution see: {@link config.state}.
 * @param [config.state] A mutable state object where additional information about the resolution will be added to and if {@link config.detailed} is true, state will be returned. The state will contain at very least success=true|undefined and the id that was resolved to
 * @param [config.encoding] The encoding of the data/code from source. Defaults to utf8 ~~when keyValueMode=false, and to identity codec when keyValueMode=true~~.
 * @param [config.exportConditions=['browser', 'default']] When resolving a directory with a package.json with an export field, what are the conditions for the export?
 * @param [config.tryExtensions=["", ".js", ".json", ".mjs", "/package.json"]] Suffixes and extensions in order will be tried in the resolution.
 * @param [config.tryIndex=["/index"]] If extensions and directories did not resolve, tryIndex + extensions
 *
 * @returns Observable<{string|config.state|null}> The code from the resolution, {@link config.state} if {@link config.detailed}=true, or null,
 */
export function nodeLikeResolver$(sources, id, from = "/", config = {}) {
    if (from && !_.isString(from)) {
        config = from;
        from = null;
    }

    if (_.isArray(sources)) {
        return rx.from(sources).pipe(
            rx.concatMap(
                source => nodeLikeResolver$(source, id, from, config)
            )
        )
    }

    if (!isAbsolute(from)) from = undefined;
    if (!isRelative(id)) from = undefined;
    if (isAbsolute(id)) from = undefined;

    const source = sources;

    let {
        // Will not treat this as a file system, all keys are files of value.
        keyValueMode = false,
        encoding = keyValueMode ? identityCodec() : codec("utf8"),
        getter = async (source, id, config = {}) => {
            // console.log("get", test, id, {source, config});
            return await source.get(id, config);
        },
        state = {},
        detailed = false
    } = config;

    config.state = {
        ...config.state ||= state,
        entryId: id,
        entryFrom: from,
        keyValueMode,
        debugId: _.uniqueId("resolve$")
    }

    let seqEvents = [];

    if (!isRelative(id) && !isAbsolute(id)) config.state.type = "bare";

    if (keyValueMode && config.state.type === "bare") {
        config.state.type = "absolute";
    }

    if (isRelative(id) && isAbsolute(from)) {
        id = path.resolve(path.dirname(from), id);
    }

    if (config.state.type === "bare") {
        seqEvents.push(
            rx.defer(() => findNodeModule$(source, config.state.id = id))
                .pipe(
                    filterNil(),
                    rx.concatMap(
                        x => loadFile$(source, x, undefined, {...config, encoding, getter})
                    ),
                    rx.defaultIfEmpty(null),
                )
        )
    } else {
        config.state.type ||= isAbsolute(id)  ? "absolute" : "relative"
        seqEvents.push(
            rx.defer(() => loadFile$(source, config.state.id = id, from, {...config, encoding, getter}))
        );
    }

    return rx.concat(
        ...seqEvents
    ).pipe(
        detailed ? rx.map(o => ({success: !!o, code: o, ...config.state})) : rx.identity
    )
}


/**
 * Convenience async function for nodeLikeResolver$
 */
export async function nodeLikeResolver(sources, id, from, config = {}) {
    return rx.firstValueFrom(
        nodeLikeResolver$(sources, id, from, config)
            .pipe(
                rx.take(1),
                rx.defaultIfEmpty(config.detailed ? {} : null)
            )
    );
}

/**
 * Does not encode nor decode; both encode and decode functions
 * returns the argument.
 * @private
 * @returns {{encode(*): *, decode(*): *}|*}
 */
function identityCodec() {
    return {
        encode(val) {
            return val;
        },
        decode(val) {
            return val;
        }
    }
}