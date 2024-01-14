import {skip, test, solo} from "brittle";

import {fileURLToPath} from "../dist/find.min.js";
import path from "../lib/tiny-paths.js";
import LocalDrive from "localdrive";
import {fetchHookOfSource} from "../dist/transport.min.js";

let __dirname;
let projectFolder;
if (globalThis.testHyperDrive) {
    __dirname = new URL(import.meta.url).pathname;
    projectFolder = globalThis.testHyperDrive
} else {
    const p = fileURLToPath(import.meta.url);
    __dirname = path.dirname(p);
    projectFolder = new LocalDrive(path.resolve(__dirname, "../"));
}

test("Hook for fetch to access source storage with special path modifier", async t => {
    fetchHookOfSource(projectFolder, "/public/:path+");
    const resp = await fetch("/public/tests/test-area/package.json");
    const txt = await resp.json();
    t.is(txt.name, "test-area-package");
});

test("Hook for fetch with special protocol", async t => {
    fetchHookOfSource(projectFolder, "/:path+", {
        protocol: "martini",
        mapper(match) {
            match.path = path.join("/tests/test-area/martini/", match.path);
            return match;
        }
    });
    const resp = await fetch("martini:///vodkaMartini.txt");
    const result = await resp.text();
    t.is(result, "2.5 vodka, 0.75 vermouth");
});