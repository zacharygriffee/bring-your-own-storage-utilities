import {test, solo} from "brittle";
import {nodeLikeResolver$, nodeLikeResolver} from "../lib/resolvers/nodeLike.js";
// import {resolve$ as cascadeResolve$} from "../cascade.js";
import * as rx from "rxjs";
import LocalDrive from "localdrive";
import path from "tiny-paths";
import fileURLToPath from "../lib/find/fileURLToPath.js";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);
const projectFolder = new LocalDrive(path.resolve(__dirname, "../"))

test("node like resolve",async t => {
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