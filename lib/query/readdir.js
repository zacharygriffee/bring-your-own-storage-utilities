import {getEntry$} from "./index.js";
import {defer, firstValueFrom, from, of} from "rxjs";
import {concatMap, filter, map, mergeMap, toArray} from "rxjs/operators";
import {isString, startsWith, trim} from "../util/index.js";

const rx = {
    defer,
    firstValueFrom,
    from,
    filter,
    map,
    mergeMap,
    toArray,
    of,
    concatMap
};
/**
 * readdir. By default, lists all files and folders by their name without a path, from the `config.cwd`.
 *
 * readdir will coerce a source to be listable (config.list = true). So even if a source doesn't have list function,
 * it still will work 99% of cases, still tests need to be done to ensure that.
 *
 * the readdir of the source can be a `cold observable` an `async iterable` an `array of keys` an `async generator`,
 * anything that {@link https://rxjs.dev/api/index/function/from rxjs.from} will accept. You could also design the source
 * as an interface like in this pseudocode example
 *
 * @example
 * const sourceInterface = (source, defaultProps) => ({
 *       exists(filePath) {
 *           // Having an exist function will help speed up
 *           // some find and query functions
 *           return !!source.exists(filePath);
 *       }.
 *       get(filePath, config = {}) {
 *           return source.get(filePath, {...(defaultProps.getProps ?? {}), ... config});
 *       },
 *     * readdir(path, config = {}) {
 *         for (const file of source.pathKeys) {
 *             yield file;
 *         }
 *     }
 * });
 *
 * const sourceInstance = new WhateverSource();
 * readdir$(sourceInterface(sourceInstance, { getProps }));
 *
 * @param source source with functions readdir, get or entry
 * @param config These configuration options apply to the readdir$ AND they are passed to the source.readdir second argument
 * @param [config.cwd=/] Current working directory of the source.
 * @param [config.list] Whether to get a detailed list of the files. A list is currently always recursive.
 * @param [config.recursive] Whether to recursively dig into folders only applies if config.list is true
 * @param [config.trimPath=true] To trim the path of any dots and slashes, a db may not start with the leading chars. This
 * is default true because Hyperdrive handles path prefixes
 *
 * @returns observable emits files from the source.
 * @memberof Query
 */
export function readdir$(source, config = {}) {
    if (isString(config)) config = {
        cwd: config
    };

    let {
        cwd,
        list = false,
        recursive = list,
        trimPath = true
    } = config;

    let dirStream$;

    if (source.list || source.readdir   /*is drive*/) {
        const func = (list ? source.list : source.readdir)?.bind(source);
        if (list && !source.list && !!source.readdir) {
            config.recursive = true;
            dirStream$ = rx.from(source.readdir(cwd, config)).pipe(
                rx.mergeMap(
                    file => getEntry$(source, file, config)
                )
            )
        } else {
            dirStream$ = rx.defer(
                () => {
                    return func(cwd, config);
                }
            ).pipe(
                rx.concatMap(o => {
                    if (Array.isArray(o)) return o;
                    return rx.of(o);
                })
            )
        }
    } else if (isHyperbeeInstance(source)  /*is hyperbee*/) {
        const {
            range,
            limit,
            reverse
        } = config;

        const db = source.snapshot();

        dirStream$ = rx.from(
            db.createReadStream(range, {limit, reverse})
        ).pipe(
            rx.map(
                entry => list ? entry : entry.key
            ),
            rx.filter(
                key => {
                    let k = list ? key.key : key;
                    k = trimPath ? trim(k, "./") : k;
                    if (startsWith(k, cwd ? cwd + "/" : "")) {
                        const l = cwd?.length || 0;
                        return recursive ? true : k.slice(l > 0 ? l+1 : 0).split("/").length <= 1;
                    }

                    return false;
                }
            )
        )
    } /*else if (source.isEntityCore      /!* Is EntityCore *!/) {
        dirStream$ = source.getFromTop$(null, {unpack: false}).pipe(
            rx.filter(
                entity => {
                    let k = entity[source.idKey];
                    k = trimPath ? trim(k, "./") : k;
                    if (startsWith(k, cwd ? cwd + "/" : "")) {
                        const l = cwd?.length || 0;
                        return recursive ? true : k.slice(l > 0 ? l+1 : 0).split("/").length <= 1;
                    }
                }
            ),
            rx.map(
                entity => list ? entity : entity[source.idKey]
            )
        )
    }*/

    return dirStream$;
}

/**
 * Stream version of readdir$. Returns array of the files and folders
 * @memberof Query
 */
export async function readdir(source, config = {}) {
    return rx.firstValueFrom(
        readdir$(
            source, config
        ).pipe(
            concatMap(
                o => Array.isArray(o) ? o : of(o)
            ),
            rx.toArray()
        )
    );
}

function isHyperbeeInstance(source) {
    return source.sub && source.batch && source.createHistoryStream
}