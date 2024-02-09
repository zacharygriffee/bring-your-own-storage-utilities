import {test, solo} from "brittle";
import RAM from "random-access-memory";
import RAS from "random-access-storage";
import b4a from "b4a";
import {iSource, RandomAccessCollection, setPack, importMapSource} from "../dist/adapt.min.js";
// import {importMapSource} from "../lib/adapt/importMapSource.js";
// import {enableRandomAccess, iSource, RandomAccessCollection, setPack} from "../lib/adapt/index.js";
import {coercePathAbsolute, findDown, findPackageJson} from "../dist/find.min.js";
import {isAbsolute, readdir} from "../dist/query.min.js";
import {pack} from "../dist/deploy.min.js";
import Corestore from "corestore";


// import {iSource, enableRandomAccess, RandomAccessCollection, setPack} from "../lib/adapt/index.js";
// import {findDown, findPackageJson} from "../lib/find/index.js";
// import {list, readdir} from "../lib/query/index.js";
import {loadPackageJson} from "../dist/resolve.min.js";
import {trimEnd, trimStart} from "../lib/util/index.js";

// import Corestore from "corestore";

// import {loadPackageJson} from "../lib/resolve/index.js";
// import {from} from "rxjs";
// import {hasFile} from "./hasFile-test-helper.js";
// import {RandomAccessCollection, setPack} from "../lib/adapt/fromRandomAccessCollection.js";
setPack(pack);

const srcObj = {};
const src = iSource({
    id: "isource basic",
    async get(k) {
        // await new Promise(res => setTimeout(res, 0));
        if (isAbsolute(k)) k = k.slice(1);
        // if (k.endsWith("tree"))
        //     console.log("getting", k, srcObj[k]);
        return srcObj[k]
    },
    exists(k) {
        if (isAbsolute(k)) k = k.slice(1);
        return !!srcObj[k]
    },
    async put(k, v) {
        // await new Promise(res => setTimeout(res, 0));
        srcObj[k] = v;
        // debugger;
        // console.log("putting", k);
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
    },
    __contents: srcObj
});

const isNode = typeof process !== "undefined" && process?.versions?.node;

if (!isNode) {
    test("import map source", async t => {
        const source = importMapSource();
        const b4aLink = b4a.toString(await source.get("b4a"));
        t.is(b4aLink, "https://esm.run/b4a");
        const [first] = await source.readdir("@zacharygriffee");
        const idb = b4a.toString(await source.get(first));
        t.is(idb, "https://esm.run/@zacharygriffee/random-access-idb");
        await source.put("margarita", b4a.from("italian"));
        const marg = b4a.toString(await source.get("margarita"));
        t.is(marg, "italian");
        const exec = await source.exec("b4a");
        t.ok(typeof exec.module.default.isBuffer === "function");
    });
}

test("isource basic", async t => {
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

test("isource randomaccess", async t => {
    {
        // readable and writable
        await src.put("readableAndWritable", "123456789123456789123456789123456789123456789")
        const ras = src.randomAccess("readableAndWritable");
        const result1 = await promisify(ras, "read", 1, 4);
        t.is(b4a.toString(result1), "2345", 1);
        await promisify(ras, "write", 2, b4a.from("ab"));
        const result3 = await promisify(ras, "read", 1, 4);
        t.is(b4a.toString(result3), "2ab5", 2)
        await promisify(ras, "truncate", 5);
        await t.exception(() => promisify(ras, "read", 1, 6));
        await promisify(ras, "truncate", 10);
        const result4 = await promisify(ras, "read", 1, 6);
        t.is(b4a.toString(result4), "2ab5\0\0", 4);
        await promisify(ras, "write", 5, b4a.from("\0z"));
        const result5 = await promisify(ras, "read", 1, 7);
        t.is(b4a.toString(result5), "2ab5\0z\0", 5);
        await promisify(ras, "del", 1, 3);
        const result6 = await promisify(ras, "read", 0, 10);
        t.is(b4a.toString(result6), "1\0\0\0" + "5\0z\0\0\0", 6);
        // delete the file from the iSource perspective.
        await src.del("readableAndWritable");
        await promisify(ras, "write", 1, b4a.from("1234"));
        const newFile = await promisify(ras, "read", 0, 5);
        t.is(b4a.toString(newFile), "\0" + "1234", "Writing creates the file");
        await src.del("readableAndWritable");
    }

    {
        // Not writable option.
        await src.put("fileNotWritable", "123456789123456789123456789123456789123456789")
        const ras = src.randomAccess("fileNotWritable", {writable: false});
        await promisify(ras, "read", 1, 4);
        await t.exception(() => promisify(ras, "write", 2, b4a.from("ab")));
        await t.exception(() => promisify(ras, "truncate", 1000));
        await t.exception(() => promisify(ras, "del", 0, 5));
        const {size} = await promisify(ras, "stat");
        t.is(size, 45);
        await src.del("fileNotWritable");
    }

    {
        // Not readable option.
        await src.put("fileNotReadable", "123456789123456789123456789123456789123456789")
        const ras = src.randomAccess("fileNotReadable", {readable: false});
        await t.exception(() => promisify(ras, "read", 1, 4));
        await promisify(ras, "write", 2, b4a.from("ab"));
        t.is(b4a.toString(await src.get("fileNotReadable")), "12ab56789123456789123456789123456789123456789");
        await promisify(ras, "truncate", 100);
        t.is(b4a.toString((await src.get("fileNotReadable"))).length, 100);
        const {size} = await promisify(ras, "stat");
        t.is(size, 100);
        await src.del("fileNotReadable");
    }

    function promisify(o, m, ...args) {
        const p = new Promise((resolve, reject) => args.push((e, o) => e ? reject(e) : resolve(o)));
        o[m](...args);
        return p;
    }
});

test("readme example of isource", async t => {
    // Example using a standard javascript object as a source.
    const obj = {};
    const yourSource = iSource({
        async get(key) {
            // Our object is stored without an initial slash
            // make sure to trim it.
            return obj[trimStart(key, "/")];
        },
        async exists(key) {
            // Our object is stored without an initial slash
            // make sure to trim it.
            return !!obj[trimStart(key, "/")];
        },
        async put(key, buffer, config) {
            obj[key] = buffer;
        },
        async del(key) {
            if (obj[key]) {
                delete obj[key];
            }
        },
        * readdir(path) {
            // Rudimentary path iterator.
            path = trimEnd(coercePathAbsolute(path), "/") + "/";
            for (let key of Object.keys(obj)) {
                key = coercePathAbsolute(key);
                if (key.startsWith(path)) {
                    yield key.slice(path.length).split("/").shift();
                }
            }
        }
    });

    await yourSource.put("hello", "world");
    await yourSource.put("folder/answer", "42");
    t.alike(await yourSource.readdir("/"), ["hello", "folder"]);
    t.alike(await yourSource.readdir("/folder"), ["answer"]);
    t.is(b4a.toString(await yourSource.get("hello")), "world");
    const [one, two] = await yourSource.list("/");
    t.ok(((one.isFile && one.key === "/hello") || (one.isFolder && one.key === "/folder")));
    t.ok(((two.isFile && two.key === "/hello") || (two.isFolder && two.key === "/folder")));
    t.is(b4a.toString(await yourSource.get("folder/answer")), "42");
});

test("fromRandomAccessStorageCollection", {
    skip: typeof fetch === "undefined"
}, async t => {
    const fileObject = {
        ["snacks.txt"]: new RAM(b4a.from("pretzels, chips, olives, fries")),
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

test("test corestore", async t => {
    const corestore = new Corestore(src.randomAccess);
    const helloCore = await corestore.get({name: "helloCore"});
    await helloCore.ready();
    await helloCore.append(b4a.from("hello world"));
    await helloCore.append(b4a.from("hello world2"));
    await helloCore.append(b4a.from("hello world3"));
    const test1 = b4a.toString(await helloCore.get(0));
    const test2 = b4a.toString(await helloCore.get(1));
    const test3 = b4a.toString(await helloCore.get(2));

    t.is(test1 + test2 + test3, "hello worldhello world2hello world3");
});