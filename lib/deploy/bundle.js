import {pack} from "./pack.js";
import {rollupFromSourcePlugin} from "../deploy/index.js";
import {fileURLToPath} from "../find/index.js";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import {wasm} from "@rollup/plugin-wasm";
import LocalDrive from "localdrive";
import path from "../tiny-paths.js";
import {rollupReplaceThesePlugin} from "./rollup-replace-these-plugin.js";
import {rollupVirtualPlugin} from "./rollup-virtual-plugin.js";
import {createDataUri} from "./index.js";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(path.resolve(__dirname, "../../"));

export const name = "deploy";
console.log(`bundling ${name}`);
// const wasmFile = await projectFolder.get("bindings_wasm_bg.wasm");
// const wasmForRollup = createDataUri(wasmFile, {
//     mimeType: "application/wasm"
// });

export default await pack(
    `./lib/${name}/index.js`,
    `./lib/${name}/index.bundle.js`,
    {
        plugins: [
            // {
            //     resolveId(id, from) {
            //         console.log({id, from});
            //         return null;
            //     }
            // },
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js"
            }),
            rollupVirtualPlugin({
                "os": "export function platform() { return 'browser' }",
                "rollup": "export * from '@rollup/browser';",
                "common-sequence": "export default function(n,t){for(var e=[],r=0;r<Math.min(n.length,t.length)&&n[r]===t[r];r++)e.push(n[r]);return e};"
            }),
            rollupFromSourcePlugin(projectFolder),
            wasm({
                targetEnv: "browser",
                maxFileSize: 0
            }),
            commonjs(),
            terser()
        ],
        createUri: false
    });

console.log(`bundled ${name}`);



