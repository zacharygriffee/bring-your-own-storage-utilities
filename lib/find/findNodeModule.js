import path from "../tiny-paths.js";
import {
    castArray,
    map as _map
} from "../util/index.js";

import {
    firstValueFrom, from
} from "rxjs";

import {
    map, defaultIfEmpty, toArray, concatAll, concatMap, filter, find,
} from "rxjs/operators";

import {findNodeModulesDirectory$} from "./findNodeModulesDirectory.js";
import {readdir$} from "../query/readdir.js";

const filterNil = () => filter(x => x != null);

/**
 * Finds a module from a node_module folder that may exist between the source root and cwd. The node_module folder must
 * have a package.json inside it to qualify as a node_module.
 * @see findUpMultiple$ for additional configuration.
 * @param source A storage source.
 * @param names A list of bare name specifiers to get their node_module path.
 * @param config A config with cwd or a string of the nested directory to begin traversing up to find the node_module path.
 * @param [config.collapse=false] Collapse results into single array still preserving order from the cwd down.
 * @param [config.cwd] The working directory
 * @returns {*}
 */
export function findNodeModule$(source, names, config = {}) {
    const {
        collapse = false
    } = config;

    // Have to find the directory using package.json due to limitation
    return findNodeModulesDirectory$(source, config)
        .pipe(// shareReplay(),
            concatMap(foundNodeModuleFolders => from(_map(castArray(names), moduleName => {
                if (moduleName.indexOf("/") > -1) {
                    const [mod, second] = moduleName.split("/");
                    moduleName = mod;
                    if (moduleName.startsWith("@")) {
                        moduleName += "/" + second;
                    }
                }

                return _map(foundNodeModuleFolders.flat(), nodeModuleFolder => path.join(nodeModuleFolder, moduleName));
            }))), filter(o => !!o && !!o.length), concatAll(), concatMap(file => {
                return readdir$(source, {cwd: file}).pipe(find(o => {
                    return o === "package.json";
                }), map(o => (o && file) || null), filterNil());
            }))
}

/**
 * Finds the node module paths of the inputted bare name specifiers.
 * @param source A hyper source.
 * @param names A list of bare name specifiers to get their node_module path.
 * @param config
 * @param [config.cwd] the working directory
 * @returns {*}
 */
export async function findNodeModule(source, names, config) {
    return firstValueFrom(findNodeModule$(source, names, config)
        .pipe(toArray(), defaultIfEmpty([])));
}
