import {pack, pack$} from "./pack.js";
import {rollupFromJsdelivr, rollupFromSourcePlugin} from "../deploy/index.js";
import {fileURLToPath} from "../find/index.js";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import LocalDrive from "localdrive";
import path from "../tiny-paths.js";
import {rollupReplaceThesePlugin} from "./rollup-replace-these-plugin.js";
import {rollupVirtualPlugin} from "./rollup-virtual-plugin.js";
import {createDataUri} from "./index.js";
import * as rx from "rxjs";
import replace from "@rollup/plugin-replace";
import rollupPluginExternalGlobals from "@zacharygriffee/rollup-plugin-external-globals";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(path.resolve(__dirname, "../../"));

export const name = "deploy";
console.log(`bundling ${name}`);

// const wasmFile = await projectFolder.get("bindings_wasm_bg.wasm");
// const wasmForRollup = createDataUri(wasmFile, {
//     mimeType: "application/wasm",
//     charset: null
// });

await pack(
    "./lib/deploy/rollup-terser-browser-plugin.js",
    "./dist/deploy/rollup-terser-browser-plugin.js",
    {
        plugins: [
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js",
                // css tree has mixed es/cjs in node_modules
                // and rollup doesn't handle it very well.
                "css-tree": "./node_modules/css-tree/dist/csstree.esm.js"
            }),
            rollupFromSourcePlugin(projectFolder),
            commonjs({transformMixedEsModules: true})
        ]
    }
);

export default await pack(
    `./lib/${name}/index.js`,
    `./dist/${name}.min.js`,
    {
        output: {banner: `
        globalThis.process ||= {platform: "browser", cwd: () => "/"};
        globalThis.dequal ||= await import("data:text/javascript;charset=utf-8;base64,dmFyIHI9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtmdW5jdGlvbiB0KGUsbil7dmFyIGksbztpZihlPT09bilyZXR1cm4hMDtpZihlJiZuJiYoaT1lLmNvbnN0cnVjdG9yKT09PW4uY29uc3RydWN0b3Ipe2lmKGk9PT1EYXRlKXJldHVybiBlLmdldFRpbWUoKT09PW4uZ2V0VGltZSgpO2lmKGk9PT1SZWdFeHApcmV0dXJuIGUudG9TdHJpbmcoKT09PW4udG9TdHJpbmcoKTtpZihpPT09QXJyYXkpe2lmKChvPWUubGVuZ3RoKT09PW4ubGVuZ3RoKWZvcig7by0tJiZ0KGVbb10sbltvXSk7KTtyZXR1cm4tMT09PW99aWYoIWl8fCJvYmplY3QiPT10eXBlb2YgZSl7Zm9yKGkgaW4gbz0wLGUpe2lmKHIuY2FsbChlLGkpJiYrK28mJiFyLmNhbGwobixpKSlyZXR1cm4hMTtpZighKGkgaW4gbil8fCF0KGVbaV0sbltpXSkpcmV0dXJuITF9cmV0dXJuIE9iamVjdC5rZXlzKG4pLmxlbmd0aD09PW99fXJldHVybiBlIT1lJiZuIT1ufXQuZGVxdWFsID0gdDtleHBvcnR7dCBhcyBkZXF1YWx9O2V4cG9ydCBkZWZhdWx0IHQ7".toString());
        `},
        plugins: [
            rollupPluginExternalGlobals({
                // library that doesn't export right
               "dequal/lite": "dequal"
            }),
            rollupReplaceThesePlugin({
                "path": "./lib/tiny-paths.js",
                // css tree has mixed es/cjs in node_modules
                // and rollup doesn't handle it very well.
                "css-tree": "./node_modules/css-tree/dist/csstree.esm.js"
            }),
            rollupVirtualPlugin({
                "os": "export function platform() { return 'browser' }",
                "common-sequence": "export default function(n,t){for(var e=[],r=0;r<Math.min(n.length,t.length)&&n[r]===t[r];r++)e.push(n[r]);return e};"
            }),
            rollupFromSourcePlugin(projectFolder),
            rollupFromJsdelivr(),
            commonjs({transformMixedEsModules: true}),
            terser()
        ],
        createUri: false
    });


console.log(`bundled ${name}`);

{
const svelteProcessList = [];
for (const svelteType of ["Compiler", "Store", "Internal", "Animate", "Easing", "Motion", "Transition"]) {
    const specifier = "svelte" + (svelteType ? "/" + svelteType.toLowerCase() : "")
    const outputName = ("svelte" + (svelteType ? "-" + svelteType.toLowerCase() : "")) + ".min.js";
    const type = "Svelte" + (svelteType ?? "");
    svelteProcessList.push(
        pack$(svelteType, `./dist/svelte/${outputName}`, {
            plugins: [
                rollupVirtualPlugin({
                    [svelteType]: `
                    import * as ${type} from "${specifier}";
                    globalThis.${type} ||= ${type};
                    export * from "${specifier}";
                `
                }),
                svelteType === "Compiler" ? rollupReplaceThesePlugin({
                    "path": "./lib/tiny-paths.js",
                    // css tree has mixed es/cjs in node_modules
                    // and rollup doesn't handle it very well.
                    "css-tree": "./node_modules/css-tree/dist/csstree.esm.js"
                }) : {},
                rollupFromSourcePlugin(projectFolder),
                commonjs({transformMixedEsModules: true}),
                terser()
            ]
        })
    )
}

// // svelte and svelte/internal specifiers are the same.
// svelteProcessList.push(
//     pack$("svelte", `./dist/svelte/svelte.min.js`, {
//         plugins: [
//             rollupVirtualPlugin({
//                 svelte: `
//                     import * as Svelte from "svelte/internal";
//                     globalThis.Svelte ||= Svelte;
//                     export * from "svelte/internal";
//                 `
//             }),
//             svelteType === "Compiler" ? rollupReplaceThesePlugin({
//                 "path": "./lib/tiny-paths.js",
//                 // css tree has mixed es/cjs in node_modules
//                 // and rollup doesn't handle it very well.
//                 "css-tree": "./node_modules/css-tree/dist/csstree.esm.js"
//             }) : {},
//             rollupFromSourcePlugin(projectFolder),
//             commonjs({transformMixedEsModules: true}),
//             terser()
//         ]
//     })
// )

svelteProcessList.push(
    pack$("entry", `./dist/svelte/disclose-version.js`, {
        plugins: [
            rollupVirtualPlugin({
                "entry": `
                    import * as SvelteVersion from "svelte/internal/disclose-version";
                    globalThis.SvelteVersion ||= SvelteVersion;
                    export * from "svelte/internal/disclose-version";
                `
            }),
            rollupFromSourcePlugin(projectFolder),
            terser()
        ]
    })
)

    console.log("Bundling svelte.");
    const result = await rx.firstValueFrom(
        rx.merge(svelteProcessList).pipe(rx.mergeAll(), rx.toArray())
    );

    const codeBook = result.reduce((acc, output) => {
        if (output.facadeModuleId === "Compiler") return acc;
        acc[output.facadeModuleId] = output.code;
        return acc;
    }, {});

    const svelteRuntimeEntry = Object.keys(codeBook).map(o => `export * from '${o}'`).join(";");
    await pack("svelteRuntime", "./dist/svelte/runtime.min.js", {
        plugins: [
            rollupVirtualPlugin(
                {
                    ...codeBook,
                    svelteRuntime: svelteRuntimeEntry
                }
            ),
            terser(),
            rollupFromSourcePlugin(projectFolder, {asInput: false, asOutput: true})
        ]
    });

    console.log("svelte bundled");
}
/*
*
                    "svelte": "Svelte",
                    "svelte/compiler": "SvelteCompiler",
                    "svelte/store": "SvelteStore",
                    "svelte/internal": "SvelteInternal",
                    "svelte/animate": "SvelteAnimate",
                    "svelte/easing": "SvelteEasing",
                    "svelte/motion": "SvelteNotion",
                    "svelte/transition": "SvelteTransition",
                    "svelte/internal/disclose-version": "SvelteVersion"
*
* */






