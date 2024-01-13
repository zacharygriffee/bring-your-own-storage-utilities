import {solo, test} from "brittle";
import {getEntry, createReadStream$, createReadStream, getType, getType$} from "../dist/query.min.js";
import {fileURLToPath} from "../dist/find.min.js";
import path from "../lib/tiny-paths.js";
import LocalDrive from "localdrive";
import {firstValueFrom} from "rxjs";
import b4a from "b4a";
import * as rx from "rxjs";

let projectFolder;
if (globalThis.testHyperDrive) {
    projectFolder = globalThis.testHyperDrive
} else {
    const p = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(p);
    projectFolder = new LocalDrive(path.resolve(__dirname, "../"));
}

test("Get entry test", async t => {
    const test = await getEntry(projectFolder, "/tests/test-area/martini/");
    t.ok(test.isFolder, "We have a martini folder. If a folder is empty, regardless of the source, will return false here");

    const test2 = await getEntry(projectFolder, "/tests/test-area/snacks-in-test-area.txt");

    t.is(test2.value.blob.byteLength, 0, "snacks in test area is empty!!!! Need to restock");
    t.is(test2.isFile, true, `Not all sources will flag an empty file as a file. This is from the file system
    so it works here. The guarantee is, any file greater than 0 bytes will be true here`);
});

test("createReadStream", async t => {
    const justGet = {
        get(path) {
            return projectFolder.get(path)
        }
    };

    const stream1$ = createReadStream$(projectFolder, "/tests/test-area/martini/vodkaMartini.txt");
    const result = b4a.toString(await firstValueFrom(stream1$));

    t.is(result, "2.5 vodka, 0.75 vermouth", "createReadStream$ gets the data from a source that has createReadStream");


    const stream2$ = createReadStream$(justGet, "/tests/test-area/martini/vodkaMartini.txt");
    const result2 = b4a.toString(await firstValueFrom(stream2$));

    t.is(result2, "2.5 vodka, 0.75 vermouth", "createReadStream$ gets the data from a source that has a get function but not createReadStream");

    const readableStream = createReadStream(projectFolder, "/tests/test-area/martini/vodkaMartini.txt");
    const result3 = b4a.toString(await new Promise(resolve => readableStream.once("data", resolve)));

    t.is(result3, "2.5 vodka, 0.75 vermouth", "createReadStream gets data from source that has createReadStream as a streamx.Readable stream");

    const readableStream2 = createReadStream(justGet, "/tests/test-area/martini/vodkaMartini.txt");
    const result4 = b4a.toString(await new Promise(resolve => readableStream2.once("data", resolve)));

    t.is(result4, "2.5 vodka, 0.75 vermouth", "createReadStream gets data from source that has only a 'get' function as a streamx.Readable stream");
});

test("createReadStream transform function", async t => {
    const readableStream = createReadStream(projectFolder, "/tests/test-area/martini/vodkaMartini.txt", {
        map(buffer) {
            return b4a.toString(buffer);
        }
    });

    const result3 = await new Promise(resolve => readableStream.once("data", resolve));

    t.is(result3, "2.5 vodka, 0.75 vermouth", "createReadStream gets data from source that has createReadStream as a streamx.Readable stream");
});

test("createReadStream$ chunks, start, end, highWaterMark", async t => {
    const justGet = {
        get(path) {
            return projectFolder.get(path)
        }
    };

    // Do both a natively supported createReadStream and one derived from get
    for (let [comment, source] of [["has native createReadStream", projectFolder], ["does not have native createReadStream", justGet]]) {
        t.comment(comment);
        const result1 = await firstValueFrom(
            createReadStream$(source, "/tests/test-area/martini/vodkaMartini.txt", {
                highWaterMark: 5
            }).pipe(rx.map(o => b4a.toString(o)), rx.toArray())
        );

        t.alike(
            result1,
            [
                "2.5 v",
                "odka,",
                " 0.75",
                " verm",
                "outh"
            ],
            "createReadStream$ via get with highWaterMark"
        );

        const result2 = await firstValueFrom(
            createReadStream$(source, "/tests/test-area/martini/vodkaMartini.txt", {
                length: 5
            }).pipe(rx.map(o => b4a.toString(o)), rx.toArray())
        );

        t.alike(
            result2,
            [
                "2.5 v"
            ],
            "createReadStream$ length no start"
        );

        const result3 = await firstValueFrom(
            createReadStream$(source, "/tests/test-area/martini/vodkaMartini.txt", {
                start: 5,
                length: 5
            }).pipe(rx.map(o => b4a.toString(o)), rx.toArray())
        );

        t.alike(
            result3,
            [
                "odka,"
            ],
            "createReadStream$ length with start"
        );

        const result4 = await firstValueFrom(
            createReadStream$(source, "/tests/test-area/martini/vodkaMartini.txt", {
                highWaterMark: 3,
                start: 5, // Start is inclusive
                end: 15 // End is inclusive.
            }).pipe(rx.map(o => b4a.toString(o)), rx.toArray())
        );

        t.alike(
            result4,
            [
                "odk",
                "a, ",
                "0.7",
                "5 "
            ],
            "createReadStream$ start, end, and highWaterMark; both start and end are inclusive"
        );
    }
});

test("get type of file", async t => {
    t.is(await firstValueFrom(getType$(projectFolder, "/package.json")), "application/json");
    t.is(await firstValueFrom(getType$(projectFolder, "/browser-tests.html")), "text/html");
    t.is(await getType(projectFolder, "/browser-tests.html"), "text/html");
    t.is(await getType(projectFolder, "/readme.md"), "text/markdown");
});