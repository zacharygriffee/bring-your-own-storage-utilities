import jsdoc2md from "jsdoc-to-markdown"
import path from "tiny-paths";
import LocalDrive from "localdrive";
import b4a from "b4a";
import {fileURLToPath} from "./index.js";
const p = fileURLToPath(import.meta.url);
const __dirname = path.dirname(p);

// const storageDrive = new LocalDrive(_.path.resolve(__dirname, ".."));
const projectFolder = new LocalDrive(path.resolve(__dirname, "./"));

for await (const lib of ["deploy", "find", "query", "resolve", "adapt"]) {
    await jsdoc2md.render({ files: `lib/${lib}/**.js` }).then(
        data => {
            data = `
# ${lib.toUpperCase()} API

${data}`;
            return projectFolder.put(`./docs/${lib}-api.md`, b4a.from(data));
        }
    );
}

console.log("Docs created.");