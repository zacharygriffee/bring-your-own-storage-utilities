import startsWith from "lodash-es/startsWith.js";

/**
 * Simple method to determine relative path.
 * @param x
 * @returns {boolean}
 */
export function isRelative(x) {
    return startsWith(x, "../") || startsWith(x, "./");
}