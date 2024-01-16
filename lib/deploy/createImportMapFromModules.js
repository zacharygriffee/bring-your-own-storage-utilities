import mapValues from "lodash-es/mapValues.js";
import {each} from "../util/each.js";
import {collectModules$} from "../resolve/collectModules.js";
import {createDataUri} from "./createDataUri.js";
import {firstValueFrom, identity} from "rxjs";
import {map as rxMap} from "rxjs/operators";

const rx = {firstValueFrom, identity, map: rxMap};
/**
 * Create an import map that utilizes data-uri scripts from the module list specified.
 * For greatest success, each package.json of the library specifier in the list should have a browser field
 * that has a minified/bundled version of it. This will detect the exports conditions and choose the correct import
 * for the browser.
 *
 * @example
 * createImportMapFromModules$(myDrive, ["your-minified-library1", "your-minified-library2"], {
 *     includeBook: {
 *         "lodash-es": "https://esm.run/lodash-es"
 *     },
 *     createScriptEle: true
 * }).subscribe(
 *      (result) => {
 *          result =
 *              `
 *                  <script type="importmap">
 *                      {
 *                          imports: {
 *                              "yourMinifiedLibrary1": "...dataUri",
 *                              "yourMinifiedLibrary2": "...dataUri",
 *                              "lodash-es": "...dataUriOfLodash"
 *                          }
 *                      }
 *                  </script>>
 *              `
 *      }
 * );
 *
 * @param source storage source
 * @param list a list of module specifiers to use
 * @param config
 * @param [config.createScriptEle=false] Create the script element for html template file.
 * @param [config.entryName='imports'] Maybe you're not using this for html, create a different name for the 'imports' field
 *                           of the import map.
 * @param [config.includeBook={}] Include additional uri or urls for the import map. Good place to add cdn links if necessary.
 * @param [config.exportConditions=["browser", "default", "main"]] {@link https://nodejs.org/api/packages.html#conditional-exports Read about conditional exports of package.json}
 * @param [config.nameFormatHandler=x => camelCase(x)] To mutate the name of the package to something else in the returned object.
 * @param [config.cwd] The working directory
 * @returns {*}
 */
export function createImportMapFromModules$(source, list, config = {})
{
    const {
        createScriptEle = false,
        includeBook = {},
        entryName = "imports"
    } = config;

    return collectModules$(source, list, config)
        .pipe(
            rx.map(
                o => mapValues(o, createDataUri)
            ),
            rx.map(
                o => {
                    if (includeBook) {
                        each(includeBook, (v, k) => o[k] = v)
                    }
                    return o;
                }
            ),
            createScriptEle ? rx.map(
                o => `<script type='importmap'>{"${entryName}": ${JSON.stringify(o)}}<\/script>`
            ) : rx.identity
        )
}

export function createImportMapFromModules(source, list, config = {}) {
    return rx.firstValueFrom(createImportMapFromModules$(source, list, config));
}

