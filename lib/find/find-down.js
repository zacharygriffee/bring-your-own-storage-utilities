import {traverseDownDirectory$} from "./traverseDownDirectory.js";
import {minimatch} from "minimatch";
import globParent from "glob-parent";
import path from "../tiny-paths.js";
import {toPath} from "./to-path.js";
import commonDir from "common-dir";
import {isAbsolute} from "../query/is-absolute.js";
import {isRelative} from "../query/is-relative.js";
import {firstValueFrom, identity} from "rxjs";
import {concatMap, defaultIfEmpty, filter, map as rxMap, reduce, take, takeWhile, toArray} from "rxjs/operators"

import {find, map, some, castArray} from "../util/index.js";

const rx = {
    firstValueFrom, identity, concatMap, defaultIfEmpty, filter, map: rxMap, reduce, take, takeWhile, toArray
};

/**
 * Convenience async version of findDown$
 */
export async function findDown(source, fileList, config = {}) {
    return rx.firstValueFrom(findDown$(source, fileList, config));
}

/**
 * Convenience findDownMultiple$ that returns only one by default. Files are also merged into one array.
 */
export function findDown$(source, fileList, config = {}) {
    const {
        count = 1
    } = config;

    return findDownMultiple$(source, fileList, config)
        .pipe(rx.concatMap(o => o.flat()), rx.take(count), rx.toArray(), rx.defaultIfEmpty(null));
}

/**
 * Traverses down directories of a source storage (child directories).
 *
 * Files found will be absolute paths to the source's root.
 *
 * @todo make config.readdir$ use this library readdir$ function
 * @param source A storage source.
 * @param fileList A list of files to find. Each can be a glob pattern. **Be warned**, the more files and greater complexity
 * warrants more search time.
 * @param config
 * @param [config.maxLevel=Infinity] Max folder depth to search.
 * @param [config.minLevel=0] Skip these many levels of directories.
 * @param [config.count=Infinity] Max amount of files to find.
 * @param [config.filter=null] Optional filter to apply to the file search.
 * @param [config.readdir$] An rxjs observable that returns a list of files and folders from the source. Default behavior is
 * to use source.readdir(path).
 * @param [config.cwd] The working directory to begin searching downward. If omitted or null,
 * will find the common dir in the fileList to begin.
 * @param [config.isFolderSelector] Predicate of what entries are folders and what are not. Default behavior to treat
 * any entry without an extension (e.g. .txt) a folder.
 * @returns [[first directory depth list], [second directory depth list] ...] Each LEVEL represents the directory depth.
 */
export function findDownMultiple$(source, fileList, config = {}) {
    let {
        maxLevel = Number.POSITIVE_INFINITY, minLevel = 0, count = Number.POSITIVE_INFINITY, filter, cwd = "/"
    } = config;

    fileList = map(castArray(fileList), x => {
        x = toPath(x);
        return x
    });
    // Shaves off traversal time.
    let adjustedCwd;

    if (some(fileList, x => !isAbsolute(x))) adjustedCwd = cwd; else adjustedCwd = globParent(path.dirname(commonDir(fileList)));

    return traverseDownDirectory$(source, {...config, cwd: adjustedCwd === "." ? "/" : adjustedCwd})
        .pipe(rx.filter(x => {
            return !!find(fileList, pattern => minimatch(x, (isAbsolute(pattern) || isRelative(pattern)) ? path.resolve(cwd, pattern) : "/**/" + pattern, {
                matchBase: true,
            }));
        }), filter ? rx.filter(filter) : rx.identity, rx.take(count), rx.takeWhile((x, i) => i <= maxLevel), rx.map(x => [x, path.dirname(x).split("/").length - 1]), rx.reduce((acc, [x, lvl]) => {
            if (lvl >= minLevel && lvl < maxLevel) {
                // Make sure lower arrays are filled with empty if not present.
                for (let i = 0; i <= lvl; i++) acc[i] ||= [];
                acc[lvl].push(x);
            }
            return acc;
        }, []));
}
