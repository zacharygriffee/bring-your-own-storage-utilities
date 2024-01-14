import startsWith from "lodash-es/startsWith.js";
/**
 * Simple method to determine absolute path.
 * @param x
 * @returns {boolean}
 */
export function isAbsolute(x) {
    return startsWith(x, "/");
}
