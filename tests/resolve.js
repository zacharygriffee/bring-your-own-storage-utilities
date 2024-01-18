import {skip, solo, test} from "brittle";
import * as rx from "rxjs";
import {firstValueFrom} from "rxjs";
import LocalDrive from "localdrive";
import path from "../lib/tiny-paths.js";
import {fileURLToPath} from "../dist/find.min.js";
import {
    collectModules$,
    createDataUri,
    importCode,
    JsDelivr,
    loadPackageJson$,
    nodeLikeResolver,
    nodeLikeResolver$,
    inferCodeUrlOrModuleSpecifier
} from "../dist/resolve.min.js";
import * as _ from "lodash-es";
import b4a from "b4a";

let projectFolder;
if (globalThis.testHyperDrive) {
    projectFolder = globalThis.testHyperDrive
} else {
    const p = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(p);
    projectFolder = new LocalDrive(path.resolve(__dirname, "../"));
}

test("node like resolve", async t => {
    const b4a = await rx.firstValueFrom(nodeLikeResolver$(projectFolder, "b4a", "/"));
    const rxjs = await rx.firstValueFrom(nodeLikeResolver$(projectFolder, "rxjs", "/"));

    t.ok(b4a.includes("bidirectionalIndexOf"), "b4q resolved from node_modules");
    t.ok(rxjs.includes("onErrorResumeNextWith"), "rxjs resolved from node_modules");
});

test("node like resolve async version", async t => {
    const b4a = await nodeLikeResolver(projectFolder, "b4a", "/");
    const rxjs = await nodeLikeResolver(projectFolder, "rxjs", "/");

    t.ok(b4a.includes("bidirectionalIndexOf"), "b4q resolved from node_modules");
    t.ok(rxjs.includes("onErrorResumeNextWith"), "rxjs resolved from node_modules");
});

test("Load all package.json root folder towards the specified cwd directory", async t => {
    const [pkg1, pkg2] = await rx.firstValueFrom(loadPackageJson$(projectFolder, {cwd: "/tests/test-area/martini/"}).pipe(rx.toArray()));

    t.is(pkg1["a-test-key"], "just-testing", "Loaded this library's package.json and read the test key inside.");
    t.is(pkg2["name"], "test-area-package", "Loaded the mock package.json in the test-area and read the name.");
});

test("Collect modules", async t => {
    const {
        lodashEs, rxjs
    } = await rx.firstValueFrom(collectModules$(projectFolder, ["lodash-es", "rxjs"]));

    t.ok(_.isString(lodashEs), "We should have lodash main entry code suitable for bundler");
    t.ok(_.isString(rxjs), "We should have rxjs main entry code suitable for bundler.");
});


test("createDataUri", async (t) => {
    const {default: theAnswer} = await import(createDataUri(`export default 42`));
    t.is(theAnswer, 42);
});

if (typeof fetch !== "undefined") {
    test("Test jsDelivr cdn module import", async t => {
        const {data: result} = await JsDelivr.get("the-answer");
        const {default: theAnswer} = await importCode(result);
        t.is(+theAnswer, 42);
    });

    test("Test jsDelivr cdn package.json import", async t => {
        const {description} = await JsDelivr.getPackageJson("the-answer");
        t.is(description, "The answer to the question of life, the universe and everything");
    });

    skip("Test jsDelivr cdn versions", {timeout: 60000}, async t => {
        // test at home, your results may very with this. I wouldn't depend on it especially in hot paths.
        t.comment("During testing I found jsDelivr versions feature to be erratic with connection, so" +
            "this may fail due to that.")
        const versions = await JsDelivr.getVersions("the-answer");

        t.is(versions[0].version, "1.0.0", "the-answer never changes versions");
        t.ok(versions[0].latest, "1.0.0 is the latest version of the answer. deepThought hasn't changed it's mind.");

        const {bandwidth} = await firstValueFrom(versions[0].links$.stats);

        t.ok(Number(bandwidth.total) > 0, "We checked the bandwidth that jsdelivr handles for the-answer.");
    });
} else {
    console.warn("Fetch not supported in your environment. Tests are disabled for transport.");
}

test("inferCodeUrlOrModuleSpecifier", async t => {
    t.ok(inferCodeUrlOrModuleSpecifier("the-answer").module);
    t.ok(inferCodeUrlOrModuleSpecifier("export default 42;'").code);
    t.ok(inferCodeUrlOrModuleSpecifier("Component.svelte").svelte);
});