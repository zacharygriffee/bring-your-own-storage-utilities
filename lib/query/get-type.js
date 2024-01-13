import {filetypemime} from "./magicBytes.js";
import {createReadStream$} from "./createReadStream.js";
import {mimeTypes} from "./common-mime-types.js";
import * as rx from "rxjs";
import path from "../tiny-paths.js";

/**
 * Gets the mime type of the file. This function analyzes the first 100 bytes of the file for the magic bytes, if it
 * cannot be determined by the byte data, it will then be inferred from the extension of the key. If still it cannot
 * be determined a null will be returned.
 * @param source The source
 * @param key The key or filename or indexor of the resource.
 * @returns {Observable<string>}
 */
export function getType$(source, key) {
    return createReadStream$(source, key, {start: 0, end: 99})
        .pipe(
            rx.map(
                bytes => filetypemime(bytes)
            ),
            rx.filter(o => o.length),
            rx.map(([o]) => o),
            concatIfEmpty(
                rx.defer(() => {
                        const ext = path.extname(key)?.toLowerCase();
                        return rx.of(mimeTypes.find(({extension}) => extension === ext)?.mimeType);
                    }
                )
            ),
            rx.catchError(() => rx.of(null))
        );
}

/**
 * A convenience async function for getType$
 */
export function getType(source, key) {
    return rx.firstValueFrom(
        getType$(source, key)
    );
}

// etc not importing properly.
function concatIfEmpty(
    observable
) {
    return (source) =>
        source.pipe(
            rx.publish((sharedSource) =>
                rx.merge(
                    sharedSource,
                    sharedSource.pipe(
                        rx.isEmpty(),
                        rx.mergeMap((empty) => (empty ? observable : rx.EMPTY))
                    )
                )
            )
        );
}