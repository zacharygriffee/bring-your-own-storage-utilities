import {firstValueFrom} from "rxjs";
import {toArray, defaultIfEmpty, map} from "rxjs/operators";
import {findUpMultiple$} from "./find-up.js";


/**
 * Find package.json files into the parent directories.
 * @param source A storage source
 * @param config see findUpMultiple$.config
 * @todo change this to emit each file individually when found instead of array.
 * @returns an observable that emits the array of all packages <- should change to emit each file individually
 */
export function findPackageJson$(source, config = {}) {
    return findUpMultiple$(source, "package.json", config).pipe(
        map(p => p.flat() || undefined)
    )
}

/**
 * Convenience async version of findPackageJson$. Will return an array of all packages found.
 */
export async function findPackageJson(source, config = {}) {
    return firstValueFrom(
        findPackageJson$(
            source, config
        ).pipe(
            toArray(),
            map(p => p.flat()),
            defaultIfEmpty(null)
        )
    );
}