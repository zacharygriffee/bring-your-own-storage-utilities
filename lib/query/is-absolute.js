import {startsWith} from "lodash-es";

/**
 * Simple method to determine absolute path.
 * @param x
 * @returns {boolean}
 */
export function isAbsolute(x) {
    return startsWith(x, "/");
}
