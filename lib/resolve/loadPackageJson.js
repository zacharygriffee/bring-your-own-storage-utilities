import {findPackageJson$} from "../find/findPackageJson.js";
import {isString} from "lodash-es";
import {toArray, concatAll, concatMap, map, defaultIfEmpty, take, firstValueFrom, takeLast, filter} from "rxjs";
const filterNil = () => filter(x => x != null);
/**
 * Loads all package.json between cwd and stopAt.
 * @param source A hyper source that has a getter.
 * @param config Either a string representing cwd or a config.
 * @param config.cwd The nested directory to begin traversing up to find package.json
 * @param [config.stopAt=root] The directory to stop traversing up to. Default is the root of the source.
 * @param [config.getter=source.get] The getter that retrieves the data from the source by the key resolved. {@link config.query} is whether the source has the file; {@link config.getter} actually loads the file data.
 * @param [config.predicate] A predicate to filter package.json files.
 * @param [config.trimPath=true] Will trim any paths of any slashes or dots. Not thoroughly tested.
 * @param [config.query=source.exists || !!source.get] How to query if the package.json exists from the source.
 * @returns {*}
 */
export async function loadAllScopedPackageJson(source, config = {}) {
    return firstValueFrom(
        loadPackageJson$(source, config)
            .pipe(
                toArray()
            )
    )
}

/**
 * Loads the immediate package.json from the cwd directory,
 * @param source A hyper source that has a getter.
 * @param config Either a string representing cwd or a config.
 * @param config.cwd The nested directory to begin traversing up to find package.json
 * @param [config.stopAt=root] The directory to stop traversing up to. Default is the root of the source.
 * @param [config.getter=source.get] The getter that retrieves the data from the source by the key resolved. {@link config.query} is whether the source has the file; {@link config.getter} actually loads the file data.
 * @param [config.predicate] A predicate to filter package.json files.
 * @param [config.trimPath=true] Will trim any paths of any slashes or dots. Not thoroughly tested.
 * @param [config.query=source.exists || !!source.get] How to query if the package.json exists from the source.
 * @returns {*}
 */
export async function loadPackageJson(source, config = {}) {
    return firstValueFrom(
        loadPackageJson$(source, config)
            .pipe(
                take(1)
            )
    )
}

/**
 * Loads the root-most package.json (closest to the config.stopAt path)
 * @param source A hyper source that has a getter.
 * @param config Either a string representing cwd or a config.
 * @param config.cwd The nested directory to begin traversing up to find package.json
 * @param [config.stopAt=root] The directory to stop traversing up to. Default is the root of the source.
 * @param [config.getter=source.get] The getter that retrieves the data from the source by the key resolved. {@link config.query} is whether the source has the file; {@link config.getter} actually loads the file data.
 * @param [config.predicate] A predicate to filter package.json files.
 * @param [config.trimPath=true] Will trim any paths of any slashes or dots. Not thoroughly tested.
 * @param [config.query=source.exists || !!source.get] How to query if the package.json exists from the source.
 * @returns {*}
 */
export async function loadRootPackageJson(source, config = {}) {
    return firstValueFrom(
        loadPackageJson$(source, config)
            .pipe(
                takeLast(1)
            )
    )
}

/**
 * Loads package.json from immediate directories, each emission
 * a package.json parent to the former.
 * @param source A hyper source that has a getter.
 * @param config Either a string representing cwd or a config.
 * @param config.cwd The nested directory to begin traversing up to find package.json
 * @param [config.getter=source.get] The getter that retrieves the data from the source by the key resolved. {@link config.query} is whether the source has the file; {@link config.getter} actually loads the file data.
 * @param [config.stopAt=root] The directory to stop traversing up to. Default is the root of the source.
 * @param [config.predicate] A predicate to filter package.json files.
 * @param [config.trimPath=true] Will trim any paths of any slashes or dots. Not thoroughly tested.
 * @param [config.query=source.exists || !!source.get] How to query if the package.json exists from the source.
 * @returns {*}
 */
export function loadPackageJson$(source, config = {}) {
    if (isString(config)) config = {cwd: config};
    const {
        getter = (source, key) => source.get(key, config)
    } = config;

    return findPackageJson$(source, config)
        .pipe(
            concatAll(),
            concatMap(
                o => getter(source, o)
            ),
            map(
                json => (json && JSON.parse(json)) || null
            ),
            filterNil(),
            defaultIfEmpty(null)
        )
}