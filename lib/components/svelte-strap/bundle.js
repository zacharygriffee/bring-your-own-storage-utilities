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

export const name = "svelte-strap";
console.log(`bundling ${name}`);

await pack(
    `@sveltestrap/sveltestrap`,
    `./dist/svelte/${name}.min.js`,
    {
        plugins: [
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js",
            }),
            rollupFromSourcePlugin(projectFolder),
            rollupSveltePluginNoServer({svelteCompiler: compile}),
            rollupVirtualPlugin({
                "@sveltestrap/sveltestrap": `
                    import * as SvelteStrap from "/node_modules/@sveltestrap/sveltestrap/dist/index.js";
                    globalThis.SvelteStrap = SvelteStrap;
                    export * from "/node_modules/@sveltestrap/sveltestrap/dist/index.js";
                `
            }),
            commonjs(),
            terser()
        ],
        createUri: false,
    });

console.log(`bundled ${name}`);



