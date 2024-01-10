import {solo, test} from "brittle";
import {createDataUri, importCode, rollupFromSourcePlugin, rollupVirtualPlugin, externalGlobals} from "../lib/deploy/index.js";
import fileURLToPath from "../lib/find/fileURLToPath.js";
import path from "../lib/tiny-paths.js";
import LocalDrive from "localdrive";
import {pack} from "../lib/deploy/pack.js";
import {svelteCompile$} from "../lib/deploy/svelte-compile.js";
import * as rx from "rxjs";

let projectFolder;
if (globalThis.testHyperDrive) {
    projectFolder = globalThis.testHyperDrive
} else {
    const p = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(p);
    projectFolder = new LocalDrive(path.resolve(__dirname, "../"));
}

test("Rollup from virtual", async t => {
    const result = await pack(
        "index.js",
        {
            plugins: [
                rollupVirtualPlugin({
                    "index.js": `
                    export default 42;
                `
                })
            ]
        });

    const {default: theAnswer} = await import(result.uri);
    t.is(theAnswer, 42);
});

test("Rollup with drive source.", async t => {
    const result = await pack(
        "/tests/test-area/margaritas/makeMargarita.js",
        "/tests/test-area/margaritas/makeMargarita-bundle.js",
        {
            plugins: [
                // Import string code to be usable in source plugin.
                rollupVirtualPlugin({
                    "specials": "export default ['watermelon margarita'];"
                }),
                rollupFromSourcePlugin(projectFolder, {asInput: true})
            ]
        }
    );

    // in snacks-in-margarita, we redefine default to "Specials"
    const {makeAMargarita, snackPicks, Specials} = await import(result.uri);
    const {tripleSec, tequila, ice, shakeIt, state} = makeAMargarita(true, true, true);

    t.absent(state.shaken, "It wasn't shaken");

    shakeIt();

    t.ok(state.shaken, "It was shaken");
    t.is(tripleSec, 1.5, "1.5 ounces of triple sec in up double margarita");
    t.is(tequila, 3, "3 ounces of tequila in up double margarita");
    t.is(ice, 0, "No ice in an up double margarita.");

    t.alike(await snackPicks(), [
        "chips",
        "pretzels",
        "olives",
        "french fries"
    ], "snackPicks has a a dynamic import");

    t.alike(Specials, ["watermelon margarita"], "Our scripts from source drive can import from the virtual plugin.");
    t.comment("You can view the bundled result at tests/test-area/maragritas/makeMargarita-bundle.js");
});

test("test externalGlobalsPlugin also test autoImport", async t => {
    const {module: {default: result}} = await pack(
        "the-answer",
        {
            plugins: [
                rollupVirtualPlugin({
                    "the-answer": `
                        import theAnswer from "some-mysterious-place";
                        globalThis.deepThought = 42;
                        export default theAnswer;
                    `
                }),
                externalGlobals({
                    "some-mysterious-place": "deepThought"
                }),
            ],
            autoImport: true
        }
    );

    t.is(result, 42, "Override an import with global and we auto import module to the module field..");
});

// solo("Compile svelte", async (t) => {
//
//
//     const compileInfo = await rx.firstValueFrom(
//         svelteCompile$(`
//             <script>
//                 export let x = 5;
//             </script>
//
//             <h1>The Number is {x}!</h1>
//         `)
//     );
//
//     debugger;
// });

test("createDataUri", async (t) => {
    const {default: theAnswer} = await import(createDataUri(`export default 42`));
    t.is(theAnswer, 42);
});

export function aTestExport() {
    return 42;
}