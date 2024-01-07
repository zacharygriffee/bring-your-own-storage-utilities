import * as rx from "rxjs";
import {isRootFolder} from "./is-root-folder.js";
import {isFile$} from "./isFile.js";

// TODO: support bee and core filestructures.
/**
 *
 * Convenience async function for isFolder$. It will **not** test positive on some sources if the folder is empty.
 * @param driveSource The source should have either an async/sync 'exists' function or an 'entry' function
 * @param path
 * @returns {Promise<boolean>}
 */
export function isFolder(driveSource, path) {
    return rx.firstValueFrom(
        isFolder$(driveSource, path)
    )
}
/**
 * Determines if from source this folder exists. It will **not** test positive on some sources if the folder is empty.
 * @todo create a selector function to override default check
 * @todo incorporate readdir function from this library to support hyperbee file structures as well.
 * @param driveSource The source should have either an async/sync 'exists' function or an 'entry' function
 * @param path
 * @returns {Observable<boolean>|Observable<boolean>}
 */
export function isFolder$(driveSource, path) {
    // check if it actually exists as a file.
    // localdrive doesn't have 'exists' and hyperdrive does

    // Root is always a folder.
    if (isRootFolder(path)) return rx.of(true);

    return isFile$(driveSource, path).pipe(
        rx.switchMap(
            itsAFile => {
                if (!!itsAFile) {
                    return rx.of(false)
                }

                // Any entries of the path represents the path
                // being a container (folder) of files

                return rx.from(
                    driveSource.readdir(
                        path
                    )
                ).pipe(
                    rx.first(),
                    rx.instead(true)
                )
            }
        ),
        rx.catchError(() => rx.of(false))
    );
}