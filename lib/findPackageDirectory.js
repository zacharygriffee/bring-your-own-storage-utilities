import path from "tiny-paths";
import {firstValueFrom, take, defaultIfEmpty, concatAll, map} from "rxjs";
import {findPackageJson$} from "./findPackageJson.js";

/**
 * Simply put, it basically this: dirname(findPackageJson$) || '/'
 * Find directories up package.json resides in.
 *
 * note: This emits each directory (the correct behavior) unlike the findPackageJson$ which is currently on todo list to change.
 * @param source A storage source
 * @param config see findUpMultiple$.config
 * @returns emits each directory found
 */
export function findPackageDirectory$(source, config = {}) {
    return findPackageJson$(source, config)
        .pipe(
            concatAll(),
            map(path.dirname),
            // o will be some sort of directory
            // so if it is empty it is the root directory.
            map(o => (!o && "/") || o)
        )
}

export async function findPackageDirectory(source, config = {}) {
    return firstValueFrom(
        findPackageDirectory$(source, config).pipe(
            take(1),
            defaultIfEmpty([])
        )
    );
}