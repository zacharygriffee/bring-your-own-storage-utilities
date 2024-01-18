import {terser} from "./terser.js";

/**
 * Terser plugin that works with browser.
 * @param [comments=false] Whether comments are left in.
 * @memberof Deploy
 */
export function rollupTerserBrowserPlugin(comments = false) {
    return {
        async transform(code) {
            return (await terser(code, comments)).code
        }
    }
}