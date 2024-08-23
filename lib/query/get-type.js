import {filetypemime} from "./magicBytes.js";
import {createReadStream$} from "./createReadStream.js";
import {mimeTypes} from "./common-mime-types.js";
import path from "../tiny-paths.js";
import {operators} from "../etc.js";
import {defer, firstValueFrom, of} from "rxjs";
import {catchError, filter, map} from "rxjs/operators";

const {
    concatIfEmpty
} = operators;

const rx = {
    defer, firstValueFrom, of, concatIfEmpty, catchError, filter, map
};

/**
 * Gets the mime type of the file. This function analyzes the first 100 bytes of the file for the magic bytes, if it
 * cannot be determined by the byte data, it will then be inferred from the extension of the key. If still it cannot
 * be determined a null will be returned.
 *
 * @param source The source
 * @param key The key or filename or indexor of the resource.
 * @param [config] Any additional configuration to pass to the createReadStream of the source. The start and length are
 * non-optional.
 * @param [config.wait=false] Some sources.createReadStream have this argument where they wait for the resource to be available. You
 * can override this behavior and wait, some sources also may have a timeout argument to limit the wait. You should view the
 * documentation for the source you pass. If you do decide to wait, some things may hang until the resource is available.
 * @returns {Observable<string>}
 * @memberof Query
 */
export function getType$(source, key, config = {}) {
    return createReadStream$(source, key, {wait: false, ...config, start: 0, end: 99})
        .pipe(rx.map(bytes => bytes.length > 30 ? filetypemime(bytes) : [inferFromExt(key) ?? null],),
            rx.filter(o => o.length),
            rx.map(([o]) => o),
            rx.concatIfEmpty(rx.defer(() => rx.of(inferFromExt(key)))),
            rx.catchError((e) => {
                return rx.of(null);
            }));
}

/**
 * A convenience async function for getType$
 * @memberof Query
 */
export function getType(source, key) {
    return rx.firstValueFrom(getType$(source, key));
}

function inferFromExt(key) {
    const ext = path.extname(key)?.toLowerCase();
    return mimeTypes.find(({extension}) => extension === ext)?.mimeType;
}