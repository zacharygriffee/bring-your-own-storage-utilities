import unzip from "lodash-es/unzip.js";
import {findIndex, toPairs} from "../util/index.js";
import {minimatch} from "minimatch";

/**
 * Will replace keys with ids.
 * @param globBook A key/value of glob in which to replace, and the id/moduleName to replace it with.
 * @returns {string|{load(*): (string|undefined), resolveId(*): (string|undefined)}}
 */
export function rollupReplaceThesePlugin(globBook) {
    const [globs, values] = unzip(
        toPairs(globBook)
    );

    return {
        resolveId(specifier) {
            const i = findIndex(globs, o => minimatch(specifier, o));
            if (i > -1) {
                return values[i];
            }
            return null;
        }
    }
}