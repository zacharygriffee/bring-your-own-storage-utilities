import * as rx from "rxjs";
import * as _ from "lodash-es";
import {collectModules$} from "../resolve/collectModules.js";
import {createDataUri} from "./createDataUri.js";

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
 *                              "your-minified-library1": "...dataUri",
 *                              "your-minified-library2": "...dataUri",
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
                o => _.mapValues(o, createDataUri)
            ),
            rx.map(
                o => {
                    if (includeBook) {
                        _.each(includeBook, (v, k) => o[k] = v)
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

