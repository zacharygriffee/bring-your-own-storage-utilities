import {pack} from "../../deploy/pack.js";
import {
    rollupFromSourcePlugin,
    rollupReplaceThesePlugin,
    rollupVirtualExports,
    rollupVirtualPlugin
} from "../../deploy/index.js";
import {fileURLToPath} from "../../find/index.js";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import LocalDrive from "localdrive";
import path from "../../tiny-paths.js";
// import {rollupVirtualPlugin} from "../deploy/rollup-virtual-plugin.js";
import {rollupSveltePluginNoServer} from "../../deploy/index.js";
import {compile} from "../../../dist/svelte/svelte-compiler.min.js";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(path.resolve(__dirname, "../../../"));

export const name = "svelvet";
console.log(`bundling ${name}`);

await pack(
    `./lib/components/Svelvet/lib/index.js`,
    `./dist/svelte/${name}.min.js`,
    {
        plugins: [
            // rollupVirtualPlugin({
            //     "os": "export function platform() { return 'browser' }"
            // }),
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js",
            }),
            rollupFromSourcePlugin(projectFolder),
            rollupSveltePluginNoServer({svelteCompiler: compile}),
            // commonjs(),
            terser()
        ],
        createUri: false,
    });

console.log(`bundled ${name}`);



