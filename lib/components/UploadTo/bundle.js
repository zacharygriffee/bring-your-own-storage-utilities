import {pack} from "../../deploy/pack.js";
import {rollupFromSourcePlugin, rollupReplaceThesePlugin, rollupVirtualExports} from "../../deploy/index.js";
import {fileURLToPath} from "../../find/index.js";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import LocalDrive from "localdrive";
import path from "../../tiny-paths.js";
// import {rollupVirtualPlugin} from "../deploy/rollup-virtual-plugin.js";
import {rollupSveltePluginNoServer} from "../../deploy/index.js";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(path.resolve(__dirname, "../../../"));

export const name = "UploadTo";
console.log(`bundling ${name}`);

const result = await pack(
    `./lib/components/${name}/index.js`,
    `./dist/components/${name}.min.js`,
    {
        plugins: [
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js",
                "@sveltestrap/sveltestrap":"/dist/components/SvelteStrap.min.js"
            }),
            rollupFromSourcePlugin(projectFolder),
            rollupSveltePluginNoServer(),
            commonjs(),
            terser()
        ],
        createUri: false,
    });
console.log(`bundled ${name}`);



