/**
 * @namespace Resolve.JsDelivr
 */

import {parseModuleSpecifier} from "../find/index.js";
import {raceUrls$} from "./raceUrls.js";
import {importCode$} from "./importCode.js";
import mapValues from "lodash-es/mapValues.js";

import {defer, EMPTY, firstValueFrom, from, of} from "rxjs";

import {catchError, defaultIfEmpty, filter, map, switchMap, retry, toArray} from "rxjs/operators";

import {trimEnd} from "../util/index.js";

const filterNil = () => rx.filter(x => x != null);

const rx = {
    EMPTY,
    firstValueFrom,
    from,
    defer,
    of,
    catchError,
    defaultIfEmpty,
    map,
    switchMap,
    filterNil,
    filter,
    importCode$,
    raceUrls$,
    retry,
    toArray
};

const HOST = "https://cdn.jsdelivr.net";
const HOST_VERSIONS = "https://data.jsdelivr.com/v1/packages";
/**
 * Get a module code from jsdelivr.
 * @memberOf Resolve.JsDelivr
 * @param moduleId Specifier can be of formats: name@version/path @namespace/name@version/path and without path or specify the parts in the config.
 * @param config
 * @param config.version Version of the module
 * @param config.path Path of an aspect of the module.
 * @param [config.type="npm"] Either npm, gh, or other repos that jsdelivr supports
 * @param [config.timeout=60s] Not implemented yet.
 * @param [config.parseToESM=true] Whether to parse the module to ESM regardless of the javascript type.
 * @returns Observable<module>
 */
export function getModuleCode$(moduleId, config = {}) {
    config.host ||= HOST;
    config.type ||= "npm";
    config.mapPath ||= (path) => path = `${trimEnd(path, "/")}/+esm`;

    const module = parseModuleSpecifier(moduleId, config);
    return module ? rx.raceUrls$(module.paths) : rx.of(null);
}

/**
 * Will get the 'root' package.json for the module specifier.
 * Does not currently get the 'parent most package.json'
 * TODO: get the parent most package.json from path.
 * @param moduleId
 * @param config
 * @memberOf Resolve.JsDelivr
 */
export function getPackageJson$(moduleId, config = {}) {
    const {
        defaultIfNoPackageJson = null, ...restConfig
    } = config;

    restConfig.host ||= HOST;
    restConfig.type ||= "npm";
    restConfig.path = "package.json";
    const {paths} = parseModuleSpecifier(moduleId, restConfig);
    const [url] = paths;
    return rx.defer(() => fetch(url))
        .pipe(
            rx.switchMap(
                response => {
                    if (response.ok && response.headers.get("Content-Type").includes("application/json")) {
                        return response.json();
                    }
                    return rx.EMPTY;
                }
            )
        )

    // return rx.ajax(url).pipe(rx.map(o => o?.data),
    //     rx.filterNil(),
    //     rx.map(o => codec("json").decode(o)),
    //     rx.catchError(e => rx.EMPTY),
    //     rx.defaultIfEmpty(defaultIfNoPackageJson))
}

/**
 * Convenience async function of getPackageJson$
 * @memberOf Resolve.JsDelivr
 */
export function getPackageJson(moduleId, config = {}) {
    return rx.firstValueFrom(
        getPackageJson$(moduleId, config)
    )
}

export function getLicense$(moduleId, config = {}) {
    return getPackageJson$(moduleId, config)
        .pipe(rx.map(o => o.license))
}

/**
 * Import a module by specifier, url, identifier.
 * @memberOf Resolve.JsDelivr
 * @param moduleId Specifier can be of formats: name@version/path @namespace/name@version/path and without path or specify the parts in the config.
 * @param config
 * @param config.version Version of the module
 * @param config.path Path of an aspect of the module.
 * @param [config.type="npm"] Either npm, gh, or other repos that jsdelivr supports
 * @param [config.timeout=60s] Not implemented yet.
 * @param [config.parseToESM=true] Whether to parse the module to ESM regardless of the javascript type.
 * @returns Promise<module>
 * */
export function importModule$(moduleId, config = {}) {
    const {
        defaultIfNoWinner = null
    } = config;

    return getModuleCode$(moduleId, config)
        .pipe(rx.switchMap(code => rx.importCode$(code?.data)), rx.defaultIfEmpty(defaultIfNoWinner))
}

/**
 * Convenience async method for importModule$
 * @memberOf Resolve.JsDelivr
 * */
export function importModule(moduleId, config = {}) {
    return rx.firstValueFrom(importModule$(moduleId, config));
}

// /**
//  * Attempt to get a license of a module specifier.
//  * @param bareModuleSpecifiers
//  * @returns {*}
//  */
// export function getLicenses$(bareModuleSpecifiers) {
//     return rx.from(bareModuleSpecifiers)
//         .pipe(
//             rx.mergeMap(
//                 o => {
//                     const {paths} = parseModuleRequest(o);
//                     return rx.raceUrls$(paths);
//                 }
//             )
//         );
// }

/**
 * Get versions of a module by its specifier.
 *
 * This has a retry setting of every 3 seconds if connection fails up to 3 times. If it fails,
 * the observable will be emitted with empty array.
 *
 * @memberOf Resolve.JsDelivr
 * @param bareModuleSpecifier
 * @returns Observable<Object> An object containing the versions of this module.
 */
export function getVersions$(bareModuleSpecifier) {
    const moduleConfig = {
        host: HOST_VERSIONS,
        type: "npm",
        version: null
    }

    const {paths} = parseModuleSpecifier(bareModuleSpecifier, moduleConfig);
    const [url] = paths;

    return rx.defer(() => fetch(url)).pipe(rx.switchMap((response) => {
        if (!response.ok || !response.headers.get("Content-Type").includes("application/json")) {
            return rx.EMPTY;
        }
        return rx.from(response.json())
    }), rx.switchMap(json => {
        const versions = json?.versions ?? [];

        return rx.from(versions).pipe(rx.map(versions => {
            if (versions.version === json?.tags?.latest) {
                versions.latest = true;
            } else if (versions.version === json?.tags?.next) {
                versions.next = true;
            }

            if (versions.links) versions.links$ = mapValues(versions.links, s => rx.defer(() => fetch(s).then(r => r.json())));

            return versions;
        }));
    }), rx.retry({count: 3, delay: 3000, resetOnSuccess: true}), rx.catchError(e => {
        return rx.EMPTY
    }), rx.defaultIfEmpty([]));
}

export function getVersions(bareModuleSpecifier) {
    return rx.firstValueFrom(getVersions$(bareModuleSpecifier).pipe(rx.toArray(), rx.defaultIfEmpty(null)));
}

/**
 * Get a module by module specifier (id) from jsdelivr
 * @memberOf Resolve.JsDelivr
 * @param id module specifier
 * @returns {Observable<module>} The module
 */
export function get$(id) {
    return getModuleCode$(id);
}

/**
 * Convenience async method of get$
 * @memberOf Resolve.JsDelivr
 */
export function get(id) {
    return rx.firstValueFrom(get$(id).pipe(rx.defaultIfEmpty(null)));
}

