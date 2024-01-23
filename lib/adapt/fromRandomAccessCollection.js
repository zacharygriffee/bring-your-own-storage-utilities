import {iSource} from "./iSource.js";

const factory = `
    import {Readable} from "streamx";
    import {coercePathAbsolute} from "bring-your-own-storage-utilities@latest/lib/find/coercePathAbsolute.js";
    import codec from "codecs";
    let collection;
    let defaultRandomAccess;
    
    function isRandomAccessCompatible(ras) {
        return ras.read && ras.write && ras.del
    }

    export function extensions(container, {asFunction}) {
        return container.register({
            setDefault: asFunction(() => {
                return (RAS) => {
                    defaultRandomAccess = RAS;
                }
            }),
            setCollection: asFunction(() => {
                return coll => collection ||= coll
            })
        });
    }
    
    export async function put(name, ras, config = {}) {
        const {
            overwrite = false,
        } = config;
        if (!collection) collection = {};
        if (!overwrite && !!collection[name]) {
            throw new Error("Cannot overwrite file. Set config.overwrite=true if you want files over-writable.");
        }
        if (!isRandomAccessCompatible(ras) && !defaultRandomAccess) {
            throw new Error("RandomAccessCollection.put(name, !!ras!!, config): either RandomAccessCollection.setDefault(!!RASClass!!) or pass a random access instance at !!ras!! ");
        } else if (!isRandomAccessCompatible(ras)) {
            ras = await Promise.resolve(defaultRandomAccess(name, ras, config));
        }
        if (!isRandomAccessCompatible(ras)) throw new Error("RandomAccessCollection.put(name, !!ras!!, config): !!ras!! is not RandomAccessCompatible.");
        collection[name] = ras;
    }

    export async function get(name, config = {}) {
        const ras = _get(name);
        return _readAll(ras, config);
    }
    
    export async function exists(name) {
        return _exists(_get(name))
    }
    
    export function readdir(fromPath, config = {}) {
        if (typeof fromPath === "object") {
                config = fromPath;
                fromPath = config.cwd || "/";
            }

            let {
                cwd = fromPath,
                recursive = false
            } = config;

            if (!cwd.endsWith("/")) {
                cwd = config.cwd += "/";
            }

            const readable = new Readable();
            const cwdParts = coercePathAbsolute(cwd).split("/");
            try {
                return readable;
            } finally {
                const cache = new Set();

                Object.keys(collection).forEach(key => {
                    key = coercePathAbsolute(key);
                    if (recursive) return readable.push(cache[key] = key);
                    const keyParts = (key || "/").split("/");
                    const scoped = keyParts[cwdParts.length - 1];
                    if (scoped && !cache.has(scoped)) {
                        cache.add(scoped);
                        readable.push(scoped);
                    }
                });

                readable.push(null);
            }
    }
    
    function _get(file) {
        return Object.entries(collection).find(([fileName]) => {
            return coercePathAbsolute(file) === coercePathAbsolute(fileName);
        })?.[1];
    }
    
    function _exists(ras) {
        return new Promise((resolve) => {
            if (!ras) return resolve(false);
            ras.stat((e, result) => e ? resolve(false) : resolve(!!result && !!result.size))
        });
    }
    
    function _readAll(ras, config) {
        if (!ras) {
            const e = new Error("File doesn't exist.");
            e.status = "ENOENT";
            return Promise.reject(e);
        }
        let {
            // To be compat with other tools that use valueEncoding.
            valueEncoding = "binary",
            encoding = valueEncoding
        } = config;
    
        return new Promise(
            (resolve, reject) => {
                ras.stat((e, stat) => {
                    if (e) return reject(e);
                    ras.read(0, stat.size, (e, buffer) => {
                        if (e) return reject(e);
                        resolve(encoding ? codec(encoding).decode(buffer) : buffer);
                    })
                });
            }
        )
    }

`;

/**
 * @name RandomAccessCollection
 * @description A ISource interface for a collection of random-access-storages
 * @example
 * // Install storage and get the Adapt.ISource interface.
 * const RAC = await RandomAccessCollection.install();
 *
 * RAC.setDefault((fileName, buff, config) => new RAM(buff));
 *
 * RAC.setCollection({
 *  preexistingFile: new RAM(),
 *  ["folder/preexistingFileInFolder.txt"]: new RAI()
 * });
 * await RAC.exists("folder/preexistingFileInFolder.txt"); // true
 *
 * @memberOf Adapt
 */

const source = iSource({
    factory
});

export {source as RandomAccessCollection};
export {setPack} from "./iSource.js";