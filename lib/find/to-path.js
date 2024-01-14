import fileURLToPath from "./fileURLToPath.js";
/**
 * Converts a file:// to path if it is one.
 *
 * @param {string|buffer|URL} urlOrPath
 * @returns {string} A path
 */
export function toPath (urlOrPath) {
    if (urlOrPath instanceof URL || urlOrPath.indexOf("file://") > -1) {
        return fileURLToPath(urlOrPath);
    }
    return urlOrPath;
}