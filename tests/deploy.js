import {solo, test, skip} from "brittle";
import {fileURLToPath} from "../dist/find.min.js";
import path from "../lib/tiny-paths.js";
import LocalDrive from "localdrive";
import b4a from "b4a";
import {rollupTerserBrowserPlugin} from "../dist/deploy/rollup-terser-browser-plugin.js";
// import {template} from "../lib/deploy/template.js";
// import {rollupTemplatePlugin} from "../lib/deploy/index.js";
// import {rollupDynamicImports} from "../lib/deploy/rollup-dynamic-imports.js";
// import {exists} from "../lib/resolve/jsdelivr.js";
// WASM kicking my butt on being 'iso support'
// Will have to handle another time.
let deployPkg;
if (typeof process !== "undefined" && process?.versions?.node) {
    deployPkg = await import("../lib/deploy/index.js".toString());
} else {
    deployPkg = await import("../dist/deploy.min.js");
}

const {
    rollupFromSourcePlugin,
    rollupVirtualPlugin,
    rollupExternalGlobalsPlugin,
    pack,
    rollupSveltePluginNoServer,
    rollupFromJsdelivr,
    rollupVirtualExports,
    setSvelteCompiler,
    setRollup,
    rollupTemplatePlugin,
    template
} = deployPkg;

await setSvelteCompiler(await import("../dist/svelte/svelte-compiler.min.js"));
await setRollup();

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

test("Rollup with drive source from a nested folder", async t => {
    const result = await pack(
        "/tests/test-area/martini/martini.js",
        {
            plugins: [
                rollupVirtualPlugin({
                    "specials": "export default ['watermelon margarita'];"
                }),
                rollupFromSourcePlugin(projectFolder, {asInput: true})
            ]
        }
    );

    const { makeAMargarita, snacks } = await import(result.uri);

    t.alike(snacks, [
        "chips",
        "pretzels",
        "olives",
        "french fries"
    ]);

    const {
        tripleSec,
        tequila,
        ice
    } = makeAMargarita();

    t.is(tripleSec, 0.75);
    t.is(tequila, 1.5);
    t.is(ice, 1);
});

// New test: Rollup with absolute paths
test("Rollup with drive source using absolute paths", async (t) => {
    const absolutePath = path.resolve(projectFolder.basePath || "", "tests/test-area/absolute-path-test/test.js");
    const result = await pack(absolutePath, {
        plugins: [
            rollupFromSourcePlugin(projectFolder, { asInput: true }),
        ],
    });

    const { testFunc } = await import(result.uri);
    t.ok(testFunc(), "Absolute path test has passed.");
});

// New test: Rollup with relative paths within the source
test("Rollup with drive source using relative paths within source", async (t) => {
    const relativePath = "/tests/test-area/relative-path-test/test.js"; // Source-relative path
    const result = await pack(relativePath, {
        plugins: [
            rollupFromSourcePlugin(projectFolder, { asInput: true })
        ]
    });

    const { testFunc } = await import(result.uri);
    t.ok(testFunc(), "Relative path test with source-relative path has passed.");
});

// // New test: Rollup with source base path
// test("Rollup with source having different base path", async (t) => {
//     const customBasePath = path.resolve(projectFolder.basePath || "", "custom-base-path-test");
//     const customSource = new LocalDrive(customBasePath);
//     const result = await pack("test.js", {
//         plugins: [
//             rollupFromSourcePlugin(customSource, { asInput: true }),
//         ],
//     });
//
//     const { customBasePathTestFunc } = await import(result.uri);
//     t.ok(customBasePathTestFunc(), "Custom base path test has passed.");
// });

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

test("Rollup with JsDelivr", {
    skip: typeof fetch === "undefined"
}, async t => {
    try {
        const result = await pack(
            "bloatedLibrary",
            {
                plugins: [
                    rollupVirtualExports("bloatedLibrary", {
                        "default as theAnswer": "the-answer",
                        "default as path": "tiny-paths",
                        "default as SHA512, ready as SHA512Ready": "sha512-wasm@2.3.4"
                    }),
                    rollupFromJsdelivr()
                ],
                autoImport: true
            }
        );

        const {module: {theAnswer, path, SHA512, SHA512Ready}} = result;

        await SHA512Ready();

        const hexHash = SHA512()
            .update('hello')
            .update(' ')
            .update(b4a.from('world'))
            .digest('hex')

        t.is(theAnswer, 42, "We got an answer");
        t.is(hexHash, "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f",
            "We digested a sha512 from a library that has it's own imports");
        t.ok(path.posix, "We got a path module.");
    } catch (e) {
        debugger;
    }
});

test("template", async t => {
    const result = template("/*{print('hello ' + drinkChoice())}*/ and /*=hello*/ and /*-script*/ /*=drinkChoice()*/",
        {
            imports: {
                drinkChoice: () => 'whiskey'
            }
        })
    ({hello: "world", script: "<script>"});

    t.is(result, "hello whiskey and world and &lt;script&gt; whiskey");
    t.pass();
});

test("template plugin", async t => {
    const result = await pack("entry.js", {
        plugins: [
            rollupVirtualPlugin({
                "entry.js": `
                      /*{ if (cash > 99) { }*/
                      export const rich = true;
                      /*{ } else { }*/
                      export const poor = true;
                      /*{ } }*/
                
                      export const /*=hello*/ = '/*=hello*/'; 
                      export default "/*=hello*/";
                      export const escaped = "/*-escape*/";
                 `
            }),
            rollupTemplatePlugin({hello: "world", cash: 100, escape: "<html>"})
        ],
        autoImport: true
    });

    const {default: x, world, rich, poor, escaped} = result.module
    t.is(x, world);
    t.absent(poor);
    t.ok(rich);
    t.is(escaped, `&lt;html&gt;`);
});
