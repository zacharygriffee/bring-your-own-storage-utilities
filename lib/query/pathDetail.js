import {firstValueFrom} from "rxjs";
import {isFolder$} from "./isFolder.js";
import {isFile$} from "./isFile.js";
import {zipObject} from "../etc.js";
import {getType$} from "./get-type.js";
import {getTypeName$} from "./get-type-name.js";

const rx = {firstValueFrom};

/**
 * Returns entry, isFile and isFolder of a path.
 *
 * If it is a file, the mime-type will be determined via getType$
 *
 * <pre>
 * **isFile may return false for empty files (0 bytes) on some sources**
 * **isFolder will return false here folders that are empty**
 * </pre>
 * @example
 * pathDetail$(drive, "/some/path/to/file.txt").subscribe(
 *      {
 *          isFolder: false,
 *          isFile: true,
 *          type: text/plain // if file, mime type, if folder, undefined
 *      }
 * );
 *
 * @param sourceDrive
 * @param absolutePath An absolute path to retrieve detail.
 * @returns {*}
 */
export function pathDetail$(sourceDrive, absolutePath) {
    return zipObject(
        {
            isFolder: isFolder$(sourceDrive, absolutePath),
            isFile: isFile$(sourceDrive, absolutePath),
            type: getType$(sourceDrive, absolutePath),
            typeName: getTypeName$(sourceDrive, absolutePath)
        }
    );
}

/**
 * Async convenience method for pathDetail$
 * ** isFile may return false for empty files (0 bytes) on some sources **
 * ** isFolder will return false here folders that are empty **
 */
export function pathDetail(sourceDrive, absolutePath) {
    return rx.firstValueFrom(
        pathDetail$(...arguments)
    );
}