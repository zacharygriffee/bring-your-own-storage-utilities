import {solo, test} from "brittle";
import {createDataUri, rollupFromSourcePlugin} from "../lib/deploy/index.js";
import fileURLToPath from "../lib/find/fileURLToPath.js";
import path from "tiny-paths";
import LocalDrive from "localdrive";
import {rollupVirtualPlugin} from "../lib/deploy/rollup-virtual-plugin.js";
import {pack} from "../lib/deploy/pack.js";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(__dirname);


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
        "./test-area/margaritas/makeMargarita.js",
        "./test-area/margaritas/makeMargarita-bundle.js",
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

test("createDataUri",async (t) => {
    const {default: theAnswer} = await import(createDataUri(`export default 42`));
    t.is(theAnswer, 42);
});

export function aTestExport() {
    return 42;
}