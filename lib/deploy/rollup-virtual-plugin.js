import {get, keys, map, camelCase, isObject} from "lodash-es";
import {nanoid} from "nanoid";
import {nodeLikeResolver} from "../resolve/nodeLike.js";

/**
 * Rollup virtual code from an object of key/value where key is the module specifier or file name of the code, and value
 * is where the code of the module is. Imports work as well, where you can import from another virtual or from an id
 * from other parts of the rollup.
 *
 * @example
 *
 * {
 *     entry: "main.js",
 *     plugins: [
 *         rollupVirtual(
 *             {
 *                 "the-answer": "default export 42",
 *                 "main.js": `export {default as theAnswer} from 'the-answer';`
 *             }
 *         )
 *     ]
 * }
 *
 * @param codeBook a key/value of module specifier / string code
 * @param config
 */
export function rollupVirtualPlugin(codeBook, config = {}) {
    const {
        // If codeBook is designed like a file system, specify false,
        // if the codeBook is designed with standard key value pairs
        // then set this to true.
        keyValueMode = true
    } = config;

    return {
        async resolveId(id, from) {
            if (id.indexOf("\0") > -1) return null;
            const {success, id: refinedId} = await nodeLikeResolver({
                async get(id) {
                    return get(codeBook, id);
                },
                * readdir(path) {
                    // TODO: get path/cwd working here.
                    for (let x of keys(codeBook)) {
                        yield x;
                    }
                }
            }, id, from, {detailed: true, keyValueMode});

            if (success) return refinedId;
        },
        load(id) {
            if (codeBook[id]) return codeBook[id];
        }
    }
}

/**
 * Concatenation of exports.
 *
 * Similar to rollupVirtual but takes an entryName and a book of key / values where key is the export name
 * and value is the module specifier to pull from. Sometimes all you need is to remap exports.
 *
 * @example
 *
 * {
 *     plugins: [
 *         rollupVirtual(
 *             "bigBloatedExports.js"
 *             {
 *                 "theAnswer": "the-answer",   // If you got a cdn plugin 'above this plugin' you can pull from it.
 *                 "_": `lodash-es`,            // This will add a _ export to the file
 *                 "*": "rxjs",                 // The asterisk will pull everything.
 *                                              // Currently, this is only available for one export per plugin instance.
 *                 "yourModule": "./yourModuleFromVirtualPlugin.js"   // Your modules from elsewhere work too......
 *             }
 *         )
 *     ]
 * }
 *
 * @param entryName  The module specifier you choose to name this concatenation of exports.
 * @param exportBook A key/value object with exportName/moduleSpecifierSource.
 * @param config
 * @param [config.header] Code to add before all the exports.
 * @param [config.footer] Code to add after all the exports.
 * @returns {{load(*): (*|undefined), resolveId(*, *): Promise<null|*|undefined>}}
 */
export function rollupVirtualExports(entryName, exportBook, config = {}) {
    const {
        header = ``,
        footer = ``
    } = config;
    const id = "v" + camelCase(nanoid());
    const exportStrings = map(exportBook, (value, name) => {
        if (name === "default") {
            return `export {default} from '${value}'`
        } else if (name === "*") {
            return `export * from '${value}'`;
        } else {
            return `export {${name}} from '${value}'`;
        }
    });
    return rollupVirtualPlugin(
        {
            ...(!!header ? {["header_"+id]: header} : {}),
            [entryName]: `
                ${header ? `import 'header_${id}';` : ''}
                ${exportStrings.length > 0 ? exportStrings.join(";") : ""}
                ${footer ? `import 'footer_${id}';` : ''}
            `,
            ...(!!footer ? {["footer_" + id]: footer} : {})
        }
    )
}