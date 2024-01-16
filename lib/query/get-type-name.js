import {mimeTypes} from "./common-mime-types.js";
import {getType$} from "./get-type.js";
import {map} from "rxjs/operators";
import {firstValueFrom} from "rxjs";
const rx = {
    map, firstValueFrom
};

/**
 * Get the extension name of the file's mime type. That is, package.json === 'json' .
 * The extension name is inferred from the first 100 bytes of data from the file. IF the file is less-than 30 bytes,
 * it will be inferred by the key name's extension e.g. package`.json` . Thus, small files without an extension may not
 * be inferred properly to their extension type. It is best to name your keys, at least the small ones, with an extension
 * if you want a meaningful result here.
 * @param source source
 * @param key identifier for the file. See caution above about small files without extension.
 * @param config See Query.getType for config information.
 * @returns {Observable<any>}
 */
export function getTypeName$(source, key, config) {
    return getType$(source, key, config).pipe(
        rx.map(mimeTypeToName)
    );
}

/**
 * Convenience async function for getTypeName$
 */
export function getTypeName(source, key, config) {
    return rx.firstValueFrom(
        getTypeName$(source, key, config)
    );
}

/**
 * A simple function to determine what file typename is based on it's mimetype.
 *
 * @param type a mimetype to get the typename of the file.
 * @returns {null|*}
 */
export function mimeTypeToName(type) {
    if (!type) return null;
    return mimeTypes.find(({mimeType}) => mimeType === type)?.name;
}