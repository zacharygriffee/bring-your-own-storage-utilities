import {test} from "brittle";
import * as rx from "rxjs";
import {getEntry} from "../lib/query/index.js";
import {hasFile} from "./hasFile-test-helper.js";
import fileURLToPath from "../lib/find/fileURLToPath.js";
import path from "tiny-paths";
import LocalDrive from "localdrive";

const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);

// const storageDrive = new LocalDrive(_.path.resolve(__dirname, ".."));
const projectFolder = new LocalDrive(path.resolve(__dirname, "../"))

test("Get entry test", async t => {
    const test = await getEntry(projectFolder,"/tests/test-area/martini/");
    t.ok(test.isFolder, "We have a martini folder. If a folder is empty, regardless of the source, will return false here");

    const test2 = await getEntry(projectFolder,"/tests/test-area/snacks-in-test-area.txt");

    t.is(test2.value.blob.byteLength, 0, "snacks in test area is empty!!!! Need to restock");
    t.is(test2.isFile, true, `Not all sources will flag an empty file as a file. This is from the file system
    so it works here. The guarantee is, any file greater than 0 bytes will be true here`);
});