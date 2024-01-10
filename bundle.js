import path from "tiny-paths";
import LocalDrive from "localdrive";
import * as rx from "rxjs";
import {capitalize, camelCase} from "lodash-es";
import {nanoid} from "nanoid";
import {Find, Adapt, Deploy, Query, Resolve} from "./index.js";
import terser from "@rollup/plugin-terser";

const p = Find.fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);

const projectFolder = new LocalDrive(path.resolve(__dirname, "./"));

import {findDownMultiple$} from "./lib/find/index.js";

console.log("This takes roughly 6-7 minutes on my computer.");

findDownMultiple$(projectFolder, "bundle*.js")
    .pipe(
        rx.concatMap(o => o.flat()),
        rx.map(o => o && path.resolve(__dirname, "." + o)),
        rx.filter(o => o && !o.includes("node_modules") && o !== path.resolve(__dirname, "bundle.js")),
        rx.mergeMap(async o => await import(o)),
        rx.map(({default: module, name}) => [module.code, name]),
        rx.reduce((acc, [code, name]) => { acc[name] = code; return acc; }, {}),
        rx.switchMap(
            (codeBook) => {
                const entryName = "e" + camelCase(nanoid());
                const entry = Object.keys(codeBook).map(o => `export * as ${capitalize(camelCase(o))} from '${o}'`).join(";");
                return Deploy.pack(entryName, "./dist/all.min.js", {
                    plugins: [
                        Deploy.rollupVirtualPlugin(
                            {
                                ...codeBook,
                                [entryName]: entry
                            }
                        ),
                        terser(),
                        Deploy.rollupFromSourcePlugin(projectFolder, {asInput: false, asOutput: true})
                    ]
                })
            }
        )
    )
    .subscribe(
    result => {
        console.log("Bundle done. result", result);
    }
);