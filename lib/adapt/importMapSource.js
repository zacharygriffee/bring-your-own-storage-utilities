import {iSource} from "./iSource.js";
import b4a from "b4a";
import {isString, trimStart} from "../util/index.js";

let map;

/**
 * Get import map of the current page. If you cache the importMap, any mutations to the object does not
 * add imports to the page, but it will be accessible by the importMapSource().
 * @example
 * // HTML
 * <script type='importmap'>
 *     {
 *         imports: {
 *             "bring-your-own-storage-utilities": "https://esm.run/bring-your-own-storage-utilities"
 *         }
 *     }
 * </script>
 * // Using this function
 * const {imports} = getImportMap();
 * imports["bring-your-own-storage-utilities"]; // https://esm.run/bring-your-own-storage-utilities
 *
 * @param [defaultMap] If the page does not have an import map, you may supply what will be used instead. The import map
 * structure should be at least imports and scope key which is also the default.
 * @param [cache=true] Allow to cache the import map. This is fine for small import maps, but if your import maps are large
 * with a bunch of data uri's, you may not want that hanging out in memory.
 * @returns {{imports: {}, scope: {}}|*|{imports: {}, scope: {}}}
 * @memberOf Adapt
 */
function getImportMap(defaultMap = {imports: {}, scope: {}}, cache = true) {
    if (map && cache) return map;
    if (defaultMap === false || defaultMap === true) return getImportMap({imports: {}, scope: {}}, defaultMap);
    if (typeof document === "undefined") return map = defaultMap;
    let _map = defaultMap;
    try {
        _map = JSON.parse(
            document.querySelector("[type='importmap']").innerHTML
        );
    } catch (e) {}
    if (cache) map = _map;
    return _map;
}

/**
 * Supply your own import map, not using the webpage import map. IF you do this before executing Adapt.importMapSource or
 * Adapt.getImportMap with cache=true, they will use this instead of the page's import map. This will also makes it
 * possible to run in other environments instead of browser, like creating importmap on server.
 * @param [importMap] The import map should have at the very least 'imports' object. Default: imports and scope
 * @returns {{imports: {}, scope: {}}}
 * @memberOf Adapt
 */
function setImportMap(importMap = {imports: {}, scope: {}}) {
    return map = importMap;
}

/**
 * Create an iSource interface of the import map on the webpage.
 *
 * ** source.put does not add modules to the 'browser' importmap, but the source's internal cache that can
 * be used by other functions of this library.
 *
 * @example
 * // HTML
 * <script type='importmap'>
 *     {
 *         imports: {
 *             "bring-your-own-storage-utilities": "https://esm.run/bring-your-own-storage-utilities",
 *             "./a/path/to/resource": "<<data:uri>>"
 *         }
 *     }
 * </script>
 * // Using this function
 * const source = importMapSource();
 * const buff = await source.get("bring-your-own-storage-utilities");   // https://esm.run/bring-your-own-storage-utilities
 * const keys = await source.readdir("./a/path");                       // <<data:uri>>
 *
 * @param [cache=true] Allow to cache the import map. This is fine for small import maps, but if your import maps are large
 * with a bunch of data uri's, you may not want that hanging out in memory. If cache=false, this source will not be
 * writable and source.put will not be available.
 * @param [scope='imports'] The import map typically has at least the following format: imports and scope. The scope
 * here is `imports` and `scope`.
 * @memberOf Adapt
 */
function importMapSource(cache = true, scope = "imports") {
    const _getImportMap = () => getImportMap(undefined, cache)[scope];
    return iSource({
        async open() {
            if (cache) _getImportMap();
        },
        async exec(key, config) {
            const {
                handler = async (uri, config = {}) => {
                    const {pack, packConfig = {}} = config;
                    if (typeof pack === "function") {
                        if (packConfig.autoImport == null) packConfig.autoImport = true;
                        return pack(key, packConfig).then(o => o.key = key);
                    }
                    return import(uri).then(o => ({module: o, key, uri}));
                }
            } = config;
            const str = _getImportMap()[key];
            if (!str) {
                throw new Error("Not executable.");
            }
            return handler(str);
        },
        async get(key) {
            const str = _getImportMap()[key];
            if (b4a.isBuffer(str)) return str;
            if (isString("string")) return b4a.from(str);
            return null;
        },
        ... (cache ? {

                async put(key, uri) {
                    if (b4a.isBuffer(uri)) uri = b4a.toString(uri);
                    _getImportMap()[key] = uri;
                },
            } : {}
        ),
        async exists(key) {
            return !!_getImportMap()[key];
        },
        async * readdir(prefix) {
            prefix = trimStart(prefix, "/.");
            const keys = Object.keys(_getImportMap());
            for (const entry of keys) {
                let _entry = trimStart(entry, "/.");
                if (_entry.startsWith(prefix)) {
                    yield _entry;
                }
            }
        }
    })
}

export {getImportMap, setImportMap, importMapSource};