import {minify} from "terser";

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

export function rollupTerserBrowserPlugin(comments = false) {
    return {
        async transform(code) {
            return (await terser(code, comments)).code
        }
    }
}