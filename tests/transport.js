import {skip, test, solo} from "brittle";

import {coercePathAbsolute, fileURLToPath} from "../dist/find.min.js";
import path from "../lib/tiny-paths.js";
import LocalDrive from "localdrive";
import {fetchHookOfSource, iNetworkSource} from "../dist/transport.min.js";
import {iSource} from "../dist/adapt.min.js";
import {trimEnd, trimStart} from "../lib/util/index.js";
import b4a from "b4a";
import duplexThrough from "duplex-through";

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

test("iNetworkSource", async t => {
    const obj = {};
    const yourSource = iSource({
        async factory() {
            return `
        export function get() { return "42"; }
        `
        },
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
            obj[key] = b4a.from(buffer);
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

    const [d1, d2] = duplexThrough();
    let serve = iNetworkSource.serve(yourSource, {
        firewall(socket, {handshake}) {
            return handshake !== "mustard";
        }, protocol: "first run", id: b4a.from("a")
    });
    serve.next(d1);
    const client = await iNetworkSource.connect(d2, {handshake: "mustard", protocol: "first run", id: b4a.from("a")});
    t.is(client.readable, true);
    t.is(client.writable, true);
    await client.put("hotdog", b4a.from("mustard"));
    const value = b4a.toString(await client.get("hotdog"));
    t.is(value, "mustard");
    await client.del("hotdog");
    t.is(await client.get("hotdog"), null);
    await serve.complete();
    await t.exception(() => client.get("hotdog"));
    await t.exception(() => client.put("hotdog", b4a.from("coleslaw")));
    const [d3, d4] = duplexThrough();

    serve = iNetworkSource.serve(yourSource, {
        firewall(socket, {handshake}) {
            return handshake !== "mustard";
        }, protocol: "second run", id: b4a.from("b")
    });
    serve.next(d3);
    // This is firewalled.
    await t.exception(async () => await iNetworkSource.connect(d4, {
        handshake: "ketchup",
        protocol: "second run",
        id: b4a.from("b")
    }));

});


test("Hook for fetch to access source storage with special path modifier", {
    skip: typeof fetch === "undefined"
}, async t => {
    fetchHookOfSource(projectFolder, "/public/:path+");
    const resp = await fetch("/public/tests/test-area/package.json");
    const txt = await resp.json();
    t.is(txt.name, "test-area-package");
});

test("Hook for fetch with special protocol", {
    skip: typeof fetch === "undefined"
}, async t => {
    try {
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
    } catch (e) {
        console.log("found this error: ", e.message);
    }
});
