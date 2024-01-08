import {test, solo} from "brittle";
import RAM from "random-access-memory";
import codec from "codecs";
import b4a from "b4a";
import {fromRandomAccess, fromRandomAccessCollection} from "../lib/adapt/fromRandomAccess.js";
import {findDown} from "../lib/find/find-down.js";
import {findPackageJson, readdir} from "../lib/find/index.js";
import {loadPackageJson} from "../lib/resolve/index.js";
import {from, toArray, firstValueFrom} from "rxjs";
import {hasFile} from "./hasFile-test-helper.js";

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
    const files = fromRandomAccessCollection(fileObject);
    const howtoMakeWatermelonMargarita = await files.get("margarita/watermelon.txt", { encoding: codec("hex") });
    t.is(howtoMakeWatermelonMargarita, b4a.toString(b4a.from("tequila, triple sec, sour, watermelon puree"), "hex"),
        "get and encoding works! pow");

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

test("Using a randomAccess creation function", async (t) => {
    const fileObject = {};
    const make = (file, buf) => fileObject[file] = new RAM(buf)
    const ramFolder = (file) => fileObject[file];

    make("/martini/vodkaMartini", b4a.from("vodka,vermouth"));
    make("/martini/ginMartini", b4a.from("gin,vermouth"));
    make("/snacks", b4a.from("pretzels, chips, olives, fries"));
    make("/martini/package.json", b4a.from(`
{
  "name": "in-memory-package-json-for-martini"
}
`));

    const files = fromRandomAccess(ramFolder, from(Object.keys(fileObject)));

    const howToMakeGinMartini = await files.get("/martini/ginMartini", { encoding: codec("hex") });
    t.is(howToMakeGinMartini, b4a.toString(b4a.from("gin,vermouth"), "hex"),
        "get and encoding works! pow");

    const doWeHaveSnacks = await files.exists("snacks.txt");
    const doWeHaveSlashSnacks = await files.exists("/snacks.txt");

    t.ok(doWeHaveSlashSnacks === doWeHaveSnacks, "Don't need leading slash to be absolute path, but its always recommended.");

    const doWeHaveMargaritas = await files.exists("margarita.txt");
    t.absent(doWeHaveMargaritas, "We don't have margarita here.");

    const [vodkaMartini, nothingElse] = await findDown(files, ["vodka*"]);
    t.is(vodkaMartini, "/martini/vodkaMartini", "This library will coerce file names with root slash.");
    t.absent(nothingElse);
    const dir = await readdir(files, {recursive: true});
    t.is(dir.length, Object.values(fileObject).length, "We just list all files recursively");
    const [martiniHasAJsonFile] = await findPackageJson(files, {cwd: "/martini/"});
    t.is(martiniHasAJsonFile, "/martini/package.json", "We found that martini has a package.json");
    const loadJson = await loadPackageJson(files, {cwd: "/martini/"});
    t.is(loadJson.name, "in-memory-package-json-for-martini", "We can read the json file.");

    const foundFiles = await readdir(files, {cwd: "/martini/",recursive: false});
    t.ok(hasFile(foundFiles, "ginMartini") && foundFiles.length === 3, "Test cwd scopes things correctly returning the file name without slashes.");
});