import * as rx from "rxjs";
import {isFolder$} from "./isFolder.js";
import {isFile$} from "./isFile.js";

function getEntry$(sourceDrive, absolutePath) {
    if (!sourceDrive?.entry) {
        return rx.of({});
    }
    return rx.from(sourceDrive.entry(absolutePath))
        .pipe(
            rx.map(
                o => !o ? {} : o
            )
        )
}

/**
 * Returns entry, isFile and isFolder of a path.
 *
 * @example
 * pathDetail$(drive, "/some/path/to/file.txt").subscribe(
 *      {
 *          isFolder: false,
 *          isFile: true,
 *          entry: {} // Depends on source.entry.
 *                    // Will also be empty object if source does not have entry function
 *      }
 * );
 *
 * @param sourceDrive
 * @param absolutePath An absolute path to retrieve detail.
 * @returns {*}
 */
export function pathDetail$(sourceDrive, absolutePath) {
    return rx.zipObject(
        {
            isFolder: isFolder$(sourceDrive, absolutePath),
            isFile: isFile$(sourceDrive, absolutePath),
            entry : getEntry$(sourceDrive, absolutePath)
        }
    );
}

/**
 * Async convenience method for pathDetail$
 */
export function pathDetail(sourceDrive, absolutePath) {
    return rx.firstValueFrom(
        pathDetail$(...arguments)
    );
}