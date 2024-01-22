import {pack} from "../deploy/pack.js";
import {rollupFromJsdelivr, rollupFromSourcePlugin} from "../deploy/index.js";
import {fileURLToPath} from "../find/index.js";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import LocalDrive from "localdrive";
import path from "../tiny-paths.js";
import {rollupReplaceThesePlugin} from "../deploy/rollup-replace-these-plugin.js";
import {rollupVirtualPlugin} from "../deploy/rollup-virtual-plugin.js";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(path.resolve(__dirname, "../../"));

export const name = "adapt";
console.log(`bundling ${name}`);

export default await pack(
    `./lib/${name}/index.js`,
    `./dist/${name}.min.js`,
    {
        plugins: [
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js"
            }),
            rollupVirtualPlugin({
                "os": "export function platform() { return 'browser' }",
                "common-sequence": "export default function(n,t){for(var e=[],r=0;r<Math.min(n.length,t.length)&&n[r]===t[r];r++)e.push(n[r]);return e};"
            }),
            rollupFromSourcePlugin(projectFolder),
            rollupFromJsdelivr(),
            commonjs(),
            terser()
        ],
        createUri: false,
    });

console.log(`bundled ${name}`);



