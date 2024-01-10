import {test, solo} from "brittle";
import * as rx from "rxjs";
import LocalDrive from "localdrive";
import path from "../lib/tiny-paths.js";
import {fileURLToPath} from "../dist/find.min.js";
import {
    collectModules$,
    loadPackageJson$,
    nodeLikeResolver,
    nodeLikeResolver$
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