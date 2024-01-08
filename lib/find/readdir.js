import * as rx from "rxjs";
import {isString, trim, startsWith} from "lodash-es";
import b4a from "b4a";

/**
 * readdir that wraps either hyperdrive and hyperbee instance.
 * Aimed to handle hypercore and hyperbee. But, plan on support for more
 *
 * readdir will coerce a source to be listable (config.list = true). So even if a source doesn't have list function,
 * it still will work 99% of cases, still tests need to be done to ensure that.
 *
 * @param source source with functions readdir, get or entry
 * @param config
 * @param [config.cwd=/] Current working directory of the source.
 * @param [config.list] Whether to get a detailed list of the files.
 * @param [config.recursive] Whether to recursively dig into folders only applies if config.list is true
 * @param [config.trimPath=true] To trim the path of any dots and slashes, a db may not start with the leading chars. This
 * is default true because Hyperdrive handles path prefixes
 *
 * @returns observable emits files from the source.
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
        const func = list ? source.list : source.readdir;
        if (list && !source.list && !!source.readdir) {
            config.recursive = true;
            // todo: create a 'has getter' and 'has entry' function in query section.
            const getter = source.get?.bind(source);
            const enterer = source.entry?.bind(source);
            dirStream$ = rx.from(source.readdir(cwd, config)).pipe(
                rx.mergeMap(
                    file => rx.from((getter || enterer)(file)).pipe(
                        rx.map(
                            info => [file, info]
                        )
                    )
                ),
                rx.map(
                    ([file, info]) => {
                        // Todo move this query to 'query' section
                        let stat = {};
                        if (getter) {
                            stat.blob = {};
                            stat.blob.byteLength = b4a.byteLength(info);
                            stat.blob.byteOffset = 0;
                            stat.executable = false;
                            stat.metadata = null;
                        } else if (enterer) {
                            stat = info;
                        } else {
                            // source doesn't have anyway for us to query it.
                            stat = {};
                        }
                        return ({
                            seq: 1, // Just for compat
                            key: file,
                            value: stat
                        })
                    }
                )
            )
        } else {
            dirStream$ = rx.from(
                func.bind(source)(cwd, config)
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

export async function readdir(source, config = {}) {
    return rx.firstValueFrom(
        readdir$(
            source, config
        ).pipe(
            rx.toArray()
        )
    );
}

function isHyperbeeInstance(source) {
    return source.sub && source.batch && source.createHistoryStream
}