import {skip, solo, test} from "brittle";

import * as rx from "rxjs";
import {
    findDown,
    findDown$,
    findDownMultiple$,
    findNodeModule$,
    findPackageDirectory$,
    findPackageJson$,
    list$,
    parseModuleSpecifier,
    readdir$,
    findUp,
    findUp$,
    findUpMultiple$,
    fileURLToPath
} from "../dist/find.min.js";
import path from "../lib/tiny-paths.js";

import {hasFile} from "./hasFile-test-helper.js";

import LocalDrive from "localdrive";

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


test("Find one file up directory (into parent folders using glob (async version)", async t => {
    const [up1] = await findUp(projectFolder, ["*rules*"], "/tests/test-area/martini/");
    t.ok(up1.endsWith("standard-rules.txt"), "Async findUp found storage module's package.json with glob pattern.");
    t.pass();
});

test("Find one file up directory (into parent folders using glob (rxjs version)", async t => {
    const [up1] = await rx.firstValueFrom(findUp$(projectFolder, ["*rules*"], "/tests/test-area/martini/"));
    t.ok(up1.endsWith("standard-rules.txt"), "rxjs findUp found storage module's package.json with glob pattern.");
    t.pass();
});

test("find files up directory (into parent folders) using glob pattern", async t => {
    t.comment(`Searching from '${__dirname}' up into the test folders`);
    const [[firstUp], [secondUp], [thirdUp], [fourthUp], fifthUp] = await rx.firstValueFrom(findUpMultiple$(projectFolder, ["snack*"], "/tests/test-area/margaritas/"));

    t.absent(firstUp, "There are no snack files in the root directory.");
    t.ok(secondUp.endsWith("snacks-in-tests.ini"), "There are snacks in tests folder");
    t.ok(thirdUp.endsWith("snacks-in-test-area.txt"), "There are snacks in the test-area folder");
    t.ok(fourthUp.endsWith("snacks-in-margarita.js"), "There are snacks in the folder we started from, margaritas folder.");
    t.absent(fifthUp, "Although there are snacks in sub-folders of /tests/test-area/margaritas/ it is beyond the scope of the traversal.");
});

test("Find one file down directory (into sub folders) (async version)", async t => {
    const [up1] = await findDown(projectFolder, ["*rules*"]);
    t.ok(up1.endsWith("standard-rules.txt"), "Async findUp found storage module's package.json with glob pattern.");
    t.pass();
});

test("Find one file down directory (into sub folders) (rxjs version)", async t => {
    const [up1] = await rx.firstValueFrom(findDown$(projectFolder, ["*rules*"]));
    t.ok(up1.endsWith("standard-rules.txt"), "rxjs findUp found storage module's package.json with glob pattern.");
    t.pass();
});

skip("find files down directory (into sub folders)", async t => {
    // TODO THIS ISNT WORKING AS EXPECTED when creating the public folder
    t.comment(`Searching from '${__dirname}' module folder down (into child folders)`);

    const [[firstUp], [secondUp], [thirdUpA, thirdUpB], [fourthUpA, fourthUpB, fourthUpC], fiveUp] = await rx.firstValueFrom(findDownMultiple$(projectFolder, ["snacks*", "standard*"], {maxLevel: 4}));

    t.absent(firstUp, "There are no snack files in the root directory.");
    t.ok(secondUp.endsWith("snacks-in-tests.ini"), "There are snacks in tests folder");
    t.ok(hasFile([thirdUpA, thirdUpB], "snacks-in-test-area.txt") && hasFile([thirdUpA, thirdUpB], "standard-rules.txt"), "Third up contains two files.");

    t.ok(hasFile([fourthUpA, fourthUpB, fourthUpC], "snacks-in-margarita.js") && hasFile([fourthUpA, fourthUpB, fourthUpC], "standard-margarita.txt") && fourthUpC === undefined, "Fourth up contains two files");

    t.absent(fiveUp, "Although there are snacks in sub-folders we limit with maxLevel option of 4 folder levels");
});

test("Find packages (rxjs)", async t => {
    const packageFiles = await rx.firstValueFrom(findPackageJson$(projectFolder, {cwd: "/tests/test-area/martini/"}));

    t.ok(hasFile(packageFiles, "/package.json", true), "Found the root level package.json of this library");

    t.ok(hasFile(packageFiles, "/tests/test-area/package.json", true), "Found the mock package.json in the test-area folder");
});

test("Find package directory (rxjs)", async t => {
    const packageFiles = await rx.firstValueFrom(findPackageDirectory$(projectFolder, {cwd: "/tests/test-area/martini/"}).pipe(rx.toArray()));

    t.ok(hasFile(packageFiles, "/", true), "Found the root level package.json of this library");

    t.ok(hasFile(packageFiles, "/tests/test-area", true), "Found the mock package.json in the test-area folder");
});

test("Find node module (rxjs)", async t => {
    const packageFiles = await rx.firstValueFrom(findNodeModule$(projectFolder, ["lodash-es", "rxjs"]).pipe(rx.toArray()));

    t.ok(hasFile(packageFiles, "/node_modules/lodash-es", true), "Found the lodash-es dependency that this library uses");

    t.ok(hasFile(packageFiles, "/node_modules/rxjs", true), "Found rxjs dependency that this library uses");
});

skip("Find node module directory (rxjs)", async t => {
    // Run it at home, github don't like it
    // const nodeModulesDirectories = await rx.firstValueFrom(findNodeModulesDirectory$(projectFolder, {cwd: "/tests/test-area/martini/"}));

    // t.ok(
    //     hasFile(nodeModulesDirectories,  "/node_modules", true),
    //     "This won't pass on github, but installed, it will."
    // );

    // t.ok(
    //     hasFile(nodeModulesDirectories,  "/tests/test-area/node_modules", true),
    //     "Found our mock node_modules in the test-area"
    // );
});

test("Parse module specifier", async t => {
    t.alike(parseModuleSpecifier("@someScope/someModule@5.5.5/somePath/index", {host: "https://unpkg.com"}), {
        nodeModulesPath: "node_modules/@someScope/someModule@5.5.5",
        type: "",
        path: "/@someScope/someModule@5.5.5/somePath/index",
        pathName: "/somePath/index",
        namespace: "someScope",
        scope: "someScope",
        version: "5.5.5",
        module: "@someScope/someModule@5.5.5",
        name: "someModule",
        paths: ["https://unpkg.com/@someScope/someModule@5.5.5/somePath/index", "https://unpkg.com/@someScope/someModule@5.5.5/somePath/index.js", "https://unpkg.com/@someScope/someModule@5.5.5/somePath/index.cjs", "https://unpkg.com/@someScope/someModule@5.5.5/somePath/index.mjs", "https://unpkg.com/@someScope/someModule@5.5.5/somePath/index.json", "https://unpkg.com/@someScope/someModule@5.5.5/somePath/index/"]
    });

    // declared version takes precedence.
    // type declaration without host will not show in paths.
    t.alike(parseModuleSpecifier("@someScope/someModule@5.5.5/somePath/index", {type: "npm", version: "9.9.9"}), {
        nodeModulesPath: "node_modules/@someScope/someModule@9.9.9",
        type: "npm",
        path: "/@someScope/someModule@9.9.9/somePath/index",
        pathName: "/somePath/index",
        namespace: "someScope",
        scope: "someScope",
        version: "9.9.9",
        module: "@someScope/someModule@9.9.9",
        name: "someModule",
        paths: ["@someScope/someModule@9.9.9/somePath/index", "@someScope/someModule@9.9.9/somePath/index.js", "@someScope/someModule@9.9.9/somePath/index.cjs", "@someScope/someModule@9.9.9/somePath/index.mjs", "@someScope/someModule@9.9.9/somePath/index.json", "@someScope/someModule@9.9.9/somePath/index/"]
    });

    // mapPath option, and no version specified.
    t.alike(parseModuleSpecifier("@someScope/someModule/somePath/index.js", {mapPath: (x) => x + "#someSuffix"}), {
        nodeModulesPath: "node_modules/@someScope/someModule",
        type: "",
        path: "/@someScope/someModule/somePath/index.js",
        pathName: "/somePath/index.js",
        namespace: "someScope",
        scope: "someScope",
        version: "",
        module: "@someScope/someModule",
        name: "someModule",
        paths: ["@someScope/someModule/somePath/index.js#someSuffix"]
    });

    // A bare specifier with type npm
    t.alike(parseModuleSpecifier("someModule", {type: "npm"}), {
        nodeModulesPath: "node_modules/someModule",
        type: "npm",
        path: "/someModule",
        pathName: "",
        namespace: "",
        scope: "",
        version: "",
        module: "someModule",
        name: "someModule",
        paths: ["someModule"]
    });
});


test("List files", async t => {
    const packageFiles = await rx.firstValueFrom(list$(projectFolder, {cwd: "/tests/test-area/martini/"}).pipe(rx.toArray()));

    t.ok(hasFile(packageFiles, "/tests/test-area/martini/vermouth/vermouthTypes.txt", true, ({key}) => key), "Of the files, vermouthTypes.txt was part of the result.");

    t.ok(hasFile(packageFiles, "/tests/test-area/martini/standard-martini", true, ({key}) => key), "Of the files, standard-martini was part of the result.");
});

test("readdir files (reads shallow directory non-recursively both files and directories)", async t => {
    const packageFiles = await rx.firstValueFrom(readdir$(projectFolder, {cwd: "/tests/test-area/martini/"}).pipe(rx.toArray()));

    t.ok(hasFile(packageFiles, "vodkaMartini.txt", true), "Of the files, vodkaMartini.txt file was part of the result.");

    t.ok(hasFile(packageFiles, "vermouth", true), "Of the files, vermouth directory was part of the result.");
});