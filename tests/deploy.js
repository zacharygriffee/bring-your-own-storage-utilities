import {solo, test} from "brittle";
import {fileURLToPath} from "../dist/find.min.js";
import path from "../lib/tiny-paths.js";
import LocalDrive from "localdrive";
import * as rx from "rxjs";
// WASM kicking my butt on being 'iso support'
// Will have to handle another time.
let deployPkg;
if (typeof process !== "undefined" && process?.versions?.node) {
    deployPkg = await import("../lib/deploy/index.js".toString());
} else {
    deployPkg = await import("../dist/deploy.min.js");
}

const {
    createDataUri,
    importCode,
    rollupFromSourcePlugin,
    rollupVirtualPlugin,
    rollupExternalGlobalsPlugin,
    pack,
    svelteCompile$,
    rollupSveltePluginNoServer,
    rollupTerserBrowserPlugin
} = deployPkg;

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
                rollupExternalGlobalsPlugin({
                    "some-mysterious-place": "deepThought"
                }),
            ],
            autoImport: true
        }
    );

    t.is(result, 42, "Override an import with global and we auto import module to the module field..");
});

test("Compile svelte", async (t) => {
    const result = await pack("entry.js", {
        plugins: [
            rollupVirtualPlugin({
                "component.svelte": `
                        <script context="module">
                            export function eatSnacks(snack) {
                                return \`You ate \${snack}\`
                            }
                        <\/script>
                        <script>
                            export let theAnswer = 5;
                        <\/script>
                        
                        <h1>deepThought says the answer is: {theAnswer}</h1>
                        <h2>Brought to you by svelte.</h2>
                 `,
                "entry.js": `
                    // This only really has to happen once per page/SPA, but adds around 40k bytes.
                    // See docs for rollupSveltePluginNoServer about how these specific minified versions add 
                    // Svelte to the global scope to keep the instances correct.
                    // to import these for each and every component like svelte does which is okay for normal operations
                    // but for p2p ops or in browser ops, component being small with a heavier 'initial' load is I feel better.
                    import "./dist/svelte/svelte-internal.min.js";
                    import "./dist/svelte/disclose-version.js";
                   
                    export {default, eatSnacks} from "component.svelte";
                `
            }),
            rollupSveltePluginNoServer(),
            // we not gonna have a physical copy of this stored so asOutput false
            rollupFromSourcePlugin(projectFolder, {asOutput: false}),
            // If you're going to use terser in browser, use this not rollup version.
            rollupTerserBrowserPlugin()
        ],
        autoImport: true
    });
    t.absent(result.code.includes("svelte/internal"), "Svelte imports internal files at top of each component, we don't do that here.");
    t.ok(result.module.eatSnacks('french fries'), "You ate french fries. Proof svelte is in.");
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        const ele = document.getElementById("placeToPutSvelteTestStuff");
        const {default: SvelteComponent} = result.module;

        const svelteInstance = new SvelteComponent({
            target: ele,
            props: {
                theAnswer: 42
            }
        });

        t.is(svelteInstance.theAnswer, 42);
    }
});

test("createDataUri", async (t) => {
    const {default: theAnswer} = await import(createDataUri(`export default 42`));
    t.is(theAnswer, 42);
});

export function aTestExport() {
    return 42;
}