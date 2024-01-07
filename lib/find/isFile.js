import * as rx from "rxjs";
import {isRootFolder} from "./is-root-folder.js";

/**
 * Determines if from source this file exists.
 * @todo create a selector function to override default check
 * @param driveSource The source should have either an async/sync 'exists' function or an 'entry' function
 * @param path
 * @returns {Observable<boolean>|Observable<boolean>}
 */
export function isFile$(driveSource, path) {
    if (isRootFolder(path)) return rx.of(true);
    const exists = (driveSource.exists || driveSource.entry).bind(driveSource);
    return rx.defer(() => exists(path))
        .pipe(
            rx.catchError(() => rx.of(false))
        )
}

/**
 * Convenience async function for isFile$
 * @param driveSource The source should have either an async/sync 'exists' function or an 'entry' function
 * @param path
 * @returns {Promise<boolean>}
 */
export function isFile(driveSource, path) {
    return rx.firstValueFrom(
        isFile$(driveSource, path)
    )
}