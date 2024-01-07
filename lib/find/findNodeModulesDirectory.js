import {findUp$} from "./find-up.js";
import {firstValueFrom} from "rxjs";

/**
 * Find the closest node module directory from a nested cwd directory to the stopAt/root from source.
 *
 * @see findUpMultiple$ for additional configuration.
 * @param source A hyper source.
 * @param config Either a string representing cwd or a config.
 * @param config.cwd The nested directory to begin traversing up to find node directory
 * @param [config.stopAt=root] The directory to stop traversing up to. Default is the root of the source.
 * @param [config.trimPath=true] Will trim any paths of any slashes or dots. Not thoroughly tested.
 * @returns {*}
 */
export function findNodeModulesDirectory$(source, config = {}) {
    return findUp$(source, "node_modules", undefined, config)
}

/**
 * Find the closest module directory from a nested cwd directory to the stopAt/root from source.
 * @see findUpMultiple$ for additional configuration.
 * @param source A hyper source.
 * @param config Either a string representing cwd or a config.
 * @param config.cwd The nested directory to begin traversing up to find node directory.
 * @param [config.stopAt=root] The directory to stop traversing up to. Default is the root of the source.
 * @param [config.trimPath=true] Will trim any paths of any slashes or dots. Not thoroughly tested.
 * @returns {*}
 */
export async function findNodeModulesDirectory(source, config = {}) {
    return firstValueFrom(
        findNodeModulesDirectory$(source, config)
    )
}