import {minimatch} from "minimatch"
import path from "../tiny-paths.js";
import {traverseUpDirectory$} from "./traverseUpDirectory.js";
import {isAbsolute} from "../query/is-absolute.js";
import {isRelative} from "../query/is-relative.js";
import commonDir from "common-dir";
import {castArray, isString, find} from "../util/index.js";
import {firstValueFrom, identity} from "rxjs";
import {concatMap, defaultIfEmpty, filter, map, reduce, take, toArray} from "rxjs/operators";

const rx = {
    firstValueFrom, identity, concatMap, defaultIfEmpty, filter, map, reduce, take, toArray
};

/**
 * Convenience async version of findUp$
 * @memberof Find
 */
export async function findUp(source, fileList, fromDir, config = {}) {
    return rx.firstValueFrom(findUp$(...arguments))
}

/**
 * Convenience findUpMultiple$ that returns only one by default. Files are also merged into one array.
 * @memberof Find
 */
export function findUp$(source, fileList, fromDir, config = {}) {
    const {
        // count = 1
    } = config;
    return findUpMultiple$(source, fileList, fromDir, config)
        .pipe(rx.concatMap(o => o.flat()), // rx.take(count),
            rx.toArray(), rx.defaultIfEmpty(null))
}

/**
 * Traverses up directories of a source storage (parent directories).
 *
 * Files found will be absolute paths to the source's root.
 *
 * @param source A storage source.
 * @param fileList A list of files to find. Each can be a glob pattern. **Be warned**, the more files and greater complexity
 * warrants more search time.
 * @param [fromDir] The working directory to begin searching upward (fromDir ---> root directory). If omitted or null,
 * will find the common dir in the fileList to begin.
 * @param config
 * @param [config.maxLevel=Infinity] Max folder depth to search.
 * @param [config.minLevel=0] Skip these many levels of directories.
 * @param [config.count=Infinity] Max amount of files to find.
 * @param [config.filter=null] Optional filter to apply to the file search.
 * @param [config.readdir$] An rxjs observable that returns a list of files and folders from the source. Default behavior is
 * to use source.readdir(path)
 * @param [config.cwd] Alias to fromDir. The working directory to begin searching upward (fromDir ---> root directory). If omitted or null,
 * will find the common dir in the fileList to begin.
 * @returns [[first directory list], [second directory list], [third directory list], ...]
 * @memberof Find
 */
export function findUpMultiple$(source, fileList, fromDir, config = {}) {
    if (!!fromDir && !isString(fromDir) && !arguments[3]) {
        config = fromDir;
        fromDir = null
    }

    fileList = castArray(fileList);

    const {
        cwd = fromDir || commonDir(fileList),
        maxLevel = Number.POSITIVE_INFINITY,
        minLevel = 0,
        count = Number.POSITIVE_INFINITY,
        filter
    } = config;

    config.cwd = cwd;

    return traverseUpDirectory$(source, cwd, config)
        .pipe(rx.filter(x => !!find(fileList, pattern => {
            // console.log({x, cwd, pattern, fileList, success})

            return minimatch(x, (isAbsolute(pattern) || isRelative(pattern)) ? path.resolve(cwd, pattern) : "/**/" + pattern, {matchBase: true});
        })), filter ? rx.filter(filter) : rx.identity, rx.take(count), rx.map(x => [x, path.dirname(x).split("/").length - 1]), rx.reduce((acc, [x, lvl]) => {
            if (lvl >= minLevel && lvl < maxLevel) {
                // Make sure lower arrays are filled with empty if not present.
                for (let i = 0; i <= lvl; i++) acc[i] ||= [];
                acc[lvl].push(x);
            }
            return acc;
        }, []));
}