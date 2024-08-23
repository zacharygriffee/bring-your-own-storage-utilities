import {minify} from "terser";

/**
 * Exposure of terser plugin. Operates only on module.Leaves in 'debugger'.
 * @param code {string} code
 * @param [comments=false] {boolean} Keep the comments around?
 * @returns {Promise<MinifyOutput>}
 * @memberof Deploy
 */
export function terser(code, comments = false) {
    return minify(code, {
        module: true,
        format: {
            comments
        },
        compress: {
            drop_debugger: false
        }
    });
}