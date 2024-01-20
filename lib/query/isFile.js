import {isRootFolder} from "./is-root-folder.js";
import {defer, firstValueFrom, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

/**
 * Determines if from source this file exists.
 *
 * ** this may return false for empty files (0 bytes) on some sources **
 *
 * @todo create a selector function to override default check
 * @param driveSource The source should have either an async/sync 'exists' function or an 'entry' function
 * @param path
 * @returns {Observable<boolean>|Observable<boolean>}
 * @memberof Query
 */
export function isFile$(driveSource, path) {
    if (isRootFolder(path)) return of(false);
    const exists = (driveSource.exists || driveSource.entry).bind(driveSource);
    return defer(() => Promise.resolve(exists(path)))
        .pipe(
            map(n => !!n),
            catchError((e) => of(false))
        )
}

/**
 * Convenience async function for isFile$
 *
 * ** this may return false for empty files (0 bytes) on some sources **
 *
 * @param driveSource The source should have either an async/sync 'exists' function or an 'entry' function
 * @param path
 * @returns {Promise<boolean>}
 * @memberof Query
 */
export function isFile(driveSource, path) {
    return firstValueFrom(
        isFile$(driveSource, path)
    )
}