import {startsWith} from "../util/index.js";

/**
 * Simple method to determine absolute path.
 * @param x
 * @returns {boolean}
 */
export function isAbsolute(x) {
    return startsWith(x, "/");
}
