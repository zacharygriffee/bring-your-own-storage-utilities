import {test, solo} from "brittle";
import RAM from "random-access-memory";
import b4a from "b4a";
import {iSource, RandomAccessCollection} from "../dist/adapt.min.js";
import {findDown, findPackageJson} from "../dist/find.min.js";
import {isAbsolute, list, readdir} from "../dist/query.min.js";
import {pack} from "../dist/deploy.min.js";


// import {ISource, RandomAccessCollection} from "../lib/adapt/index.js";
// import {findDown, findPackageJson} from "../lib/find/index.js";
// import {list, readdir} from "../lib/query/index.js";

import {loadPackageJson} from "../dist/resolve.min.js";

// import {loadPackageJson} from "../lib/resolve/index.js";
// import {from} from "rxjs";
// import {hasFile} from "./hasFile-test-helper.js";
// import {RandomAccessCollection, setPack} from "../lib/adapt/fromRandomAccessCollection.js";


test("isource basic", async t => {
    const srcObj = {};
    const src = iSource({
        id: "isource basic",
        get(k) {
            if (isAbsolute(k)) k = k.slice(1);
            return srcObj[k]
        },
        exists(k) {
            if (isAbsolute(k)) k = k.slice(1);
            return !!srcObj[k]
        },
        put(k, v) {
            srcObj[k] = v;
        },
        get length() {
            return Object.keys(srcObj).length
        },
        * readdir(path) {
            for (const key of Object.keys(srcObj)) {
                yield key;
            }
        },
        del(k) {
            if (srcObj[k]) delete srcObj[k];
            return Promise.resolve();
        },
        ready() {
            return new Promise(r => setTimeout(r, 100))
        }
    });

    const start = Date.now();
    await src.ready();

    const readyTime = Date.now() - start;
    t.ok(readyTime > 75 && readyTime < 125, "about 100 ms to get ready");
    await src.put("x", "hello x");
    t.ok(b4a.equals(await src.get("x"), b4a.from("hello x")));
    for await (const x of src.createReadStream("x")) {
        t.ok(b4a.equals(x, b4a.from("hello x")))
    }
    const [xEntry] = await src.list("/");
    t.ok(xEntry.value.blob.byteLength === b4a.from("hello x").length);
    t.is(src.length, 1);
    t.is((await src.readdir())[0], "x");
    await src.del("x");
    t.is(src.length, 0);
    t.ok(src.writable);
});


test("fromRandomAccessStorageCollection", async t => {
    const fileObject = {
        ["snacks.txt"]:  new RAM(b4a.from("pretzels, chips, olives, fries")),
        ["margarita/standard.txt"]: new RAM(b4a.from("tequila, triple sec, sour")),
        ["margarita/watermelon.txt"]: new RAM(b4a.from("tequila, triple sec, sour, watermelon puree")),
        ["margarita/golden.txt"]: new RAM(b4a.from("tequila, triple sec, sour, orange juice")),
        ["margarita/package.json"]: new RAM(b4a.from(`
{
  "name": "in-memory-package-json-for-margarita"
}
`))
    };
    const storeOfStorageInstalls = {};
    const source = iSource({
        put(k, buf) {
            storeOfStorageInstalls[k] = buf;
        },
        get(k) {
            return storeOfStorageInstalls[k];
        }
    })
    const files = await RandomAccessCollection.install("RandomStorage", source);
    t.ok(storeOfStorageInstalls.RandomStorage)

    files.setCollection(fileObject);
    const howtoMakeWatermelonMargarita = await files.get("margarita/watermelon.txt");
    t.alike(howtoMakeWatermelonMargarita, b4a.from("tequila, triple sec, sour, watermelon puree"));

    const doWeHaveSnacks = await files.exists("snacks.txt");
    const doWeHaveSlashSnacks = await files.exists("/snacks.txt");

    t.ok(doWeHaveSlashSnacks === doWeHaveSnacks, "Don't need leading slash to be absolute path, but its always recommended.");

    const doWeHaveMartinis = await files.exists("martini.txt");
    t.absent(doWeHaveMartinis, "We don't have martinis here.");

    const [margaritaStandard, nothingElse] = await findDown(files, ["standard*"]);
    t.is(margaritaStandard, "/margarita/standard.txt", "This library will coerce file names with root slash.");
    t.absent(nothingElse);
    const dir = await readdir(files, {recursive: true});
    t.is(dir.length, Object.values(fileObject).length, "We just list all files recursively");
    const [margaritaHasAJsonFile] = await findPackageJson(files, {cwd: "/margarita/"});
    t.is(margaritaHasAJsonFile, "/margarita/package.json", "We found that margarita has a package.json");
    const loadJson = await loadPackageJson(files, {cwd: "/margarita/"});
    t.is(loadJson.name, "in-memory-package-json-for-margarita", "We can read the json file.");
});
//
// test("Using a randomAccess creation function", async (t) => {
//     const fileObject = {};
//     const make = (file, buf) => fileObject[file] = new RAM(buf)
//     const ramFolder = (file) => fileObject[file];
//
//     make("/martini/vodkaMartini", b4a.from("vodka,vermouth"));
//     make("/martini/ginMartini", b4a.from("gin,vermouth"));
//     make("/snacks", b4a.from("pretzels, chips, olives, fries"));
//     make("/martini/package.json", b4a.from(`
// {
//   "name": "in-memory-package-json-for-martini"
// }
// `));
//
//     const files = fromRandomAccess(ramFolder, from(Object.keys(fileObject)));
//
//     const howToMakeGinMartini = await files.get("/martini/ginMartini");
//     t.alike(howToMakeGinMartini, b4a.from("gin,vermouth"));
//
//     const doWeHaveSnacks = await files.exists("snacks.txt");
//     const doWeHaveSlashSnacks = await files.exists("/snacks.txt");
//
//     t.ok(doWeHaveSlashSnacks === doWeHaveSnacks, "Don't need leading slash to be absolute path, but its always recommended.");
//
//     const doWeHaveMargaritas = await files.exists("margarita.txt");
//     t.absent(doWeHaveMargaritas, "We don't have margarita here.");
//
//     const [vodkaMartini, nothingElse] = await findDown(files, ["vodka*"]);
//     t.is(vodkaMartini, "/martini/vodkaMartini", "This library will coerce file names with root slash.");
//     t.absent(nothingElse);
//     const dir = await readdir(files, {recursive: true});
//     t.is(dir.length, Object.values(fileObject).length, "We just list all files recursively");
//     const [martiniHasAJsonFile] = await findPackageJson(files, {cwd: "/martini/"});
//     t.is(martiniHasAJsonFile, "/martini/package.json", "We found that martini has a package.json");
//     const loadJson = await loadPackageJson(files, {cwd: "/martini/"});
//     t.is(loadJson.name, "in-memory-package-json-for-martini", "We can read the json file.");
//
//     const foundFiles = await readdir(files, {cwd: "/martini/",recursive: false});
//     t.ok(hasFile(foundFiles, "ginMartini") && foundFiles.length === 3, "Test cwd scopes things correctly returning the file name without slashes.");
//
//     const listOfFiles = await list(files);
//
//     t.is(listOfFiles.length, 4, "List works even though we don't have an explicit function yet for the adapter");
//     const {key, value: {blob}} = listOfFiles.find(({key}) => key === "/martini/ginMartini");
//
//     t.is(key, "/martini/ginMartini");
//     t.is(blob.byteLength, b4a.byteLength("gin,vermouth"), "Get size of the blob apart of the list.");
//
//     t.absent(hasFile(foundFiles, "someNonExistentFile.txt"));
// });

// setPack(pack);
// const coll1 = await RandomAccessCollection.install();
// await coll1.setDefault((name, buf) => new RAM(buf));
//
// solo("rac", async t => {
//     await coll1.put("fun", "world");
//     const fun = b4a.toString(await coll1.get("fun"));
//     t.is(fun, "world");
// });
//
