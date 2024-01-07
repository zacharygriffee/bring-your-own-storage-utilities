import b4a from "b4a";
import fileURLToPath from "./fileURLToPath.js";
/**
 * Converts a file:// or buffer to path.
 *
 * @param {string|buffer|URL} urlOrPath
 * @returns {string} A path
 */
export function toPath (urlOrPath) {
    if (urlOrPath instanceof URL) {
        return fileURLToPath(urlOrPath);
    } else {
        if (b4a.isBuffer(urlOrPath)) {
            return b4a.toString(urlOrPath);
        } else {
            return urlOrPath;
        }
    }
};