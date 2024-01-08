import b4a from "b4a";
import * as rx from "rxjs";
import {pathDetail$} from "./pathDetail.js";
import _path from "tiny-paths"
import {isAbsolute} from "./is-absolute.js";

/**
 * Gets the entry details of the file
 *
 * - source should have either a `get` or `entry` function.
 * - source should have a `readdir` function
 *
 * <pre>
 * getEntry$(someDrive, "\someFolder\someFile.txt")
 *  .subscribe(
 *      entry => {
 *          // The entry object
 *      }
 *  );
 *
 * entry object will have at least:
 * {
 *     isFile, // boolean
 *     isFolder, // boolean
 *     key, // the name of the file or null if it doesn't exist.
 *     value // details of the file, or undefined if it doesn't exist.
 * }
 * </pre>
 *
 * @param source source
 * @param {string} path path from the cwd
 * @param [config]
 * @param {string} [config.cwd=/] cwd to resolve the path to
 * @param [config.entrySelector] Use your own selector to return information about a file,
 * the bare minimum should be what is shown above to best interface with the other functions of this library.
 * The entrySelector function will have three arguments, (source, path, config).
 *
 * This function will be coerced async if it isn't already.
 *
 * The default selector requires the source to have either an entry function or a get function. A get function is literally
 * getting the contents of the file and analyzing it while an entry file gets the details of the file. So, storages with
 * entry function are way more performant in these queries.
 *
 */
export function getEntry$(source, path, config = {}) {
    const {
        cwd = "/",
        entrySelector = defaultEntrySelector
    } = config;

    if (!isAbsolute(path)) path = _path.resolve(path, cwd);
    return rx.from(
        entrySelector(source, path, config)
    )
        .pipe(
            rx.filter(o => !!o),
            rx.mergeMap(
                entry => {
                    return pathDetail$(source, path).pipe(
                        rx.map(
                            result => ({key: path, ...entry, ...result})
                        )
                    )
                }
            )
        )
}

export function getEntry(source, path, config = {}) {
    return rx.firstValueFrom(
        getEntry$(source, path, config).pipe(
            rx.take(1),
            rx.defaultIfEmpty({})
        )
    );
}

async function defaultEntrySelector(source, file, config) {
    const getter = source.get?.bind(source);
    const enterer = source.entry?.bind(source);
    let stat = {};
    if (getter || enterer) {
        const resource = await (enterer || getter)(file, config);
        if (!resource) return {};
        if (enterer) {
            stat = resource;
        } else {
            stat.value = {};
            stat.value.blob = {};
            stat.value.blob.byteLength = b4a.byteLength(resource);
            stat.value.blob.byteOffset = 0;
            stat.value.executable = false;
            stat.value.metadata = null;
        }
        return stat;
    }
    return stat;
}