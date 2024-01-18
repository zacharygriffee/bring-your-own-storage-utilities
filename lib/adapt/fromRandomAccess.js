import {Readable} from "streamx";
import {coercePathAbsolute} from "../find/coercePathAbsolute.js";
import {endWith} from "rxjs";
import b4a from "b4a";
import codec from "codecs";

/**
 * Wraps a function that makes random access storage instances. You have to supply the readdir mechanism here because
 * there is no standard for it.
 *
 * @example
 * fromRandomAccess(
 *  (file, config) => {
 *      return fileStore[file] = makeARandomAccessStorageCompatibleFile(file, config);
 *  },
 *  rxjs.from(fileStore)
 * )
 *
 * @todo When this library supports put/write, can keep inner cache of the file hierarchy created to make readdir$
 *       function optional.
 * @param {AsyncFunction | Function} randomAccessFunction A function that creates random access file instances.
 * @param {Observable<string>} readdir$ A **cold** Observable source stream that emits filenames that exist in the filesystem scope you want.
 * @namespace Adapt.fromRandomAccess
 */
export function fromRandomAccess(randomAccessFunction, readdir$) {
    return {
        /**
         * Get the entire content of the file. **Careful** with big files.
         * @memberOf Adaot.fromRandomAccess
         * @param {string} file File name to get
         * @param [config] as well as the configuration below, this is passed to the factory function.
         * @param [config.encoding='binary'] Either a `string`, compact-encoding, or codec
         * @returns {Promise<*>}
         */
        async get(file, config = {}) {
            file = coercePathAbsolute(file);
            return _readAll(await Promise.resolve(randomAccessFunction(file, config)), config);
        },
        /**
         * Whether the file exists in collection. An empty file does not exist to this function.
         * @memberOf Adapt.fromRandomAccess
         * @param {string} file File name to check
         * @param [config] a configuration object that is passed to the factory function
         * @returns {Promise<boolean>}
         */
        async exists(file, config = {}) {
            return _exists(await Promise.resolve(randomAccessFunction(coercePathAbsolute(file), config)));
        },
        /**
         * Returns a readable stream of files in cwd.
         * @memberOf Adapt.fromRandomAccess
         * @param [fromPath="/"] A file path, defaults to root.
         * @param [config]
         * @param [config.cwd] Same as fromPath
         * @param [config.recursive=false] If true, cwd is ignored and all files in the collection are returned.
         * @returns {Readable} A streamx readable stream that emits the values.
         */
        readdir(fromPath = "/", config = {}) {
            if (typeof fromPath === "object") {
                config = fromPath;
                fromPath = config.cwd;
            }

            let {
                cwd = fromPath || "/",
                recursive = false
            } = config;

            if (!cwd.endsWith("/")) {
                cwd += "/";
                config.cwd = cwd;
            }

            const cwdParts = coercePathAbsolute(cwd).split("/");
            const readable = new Readable();

            try {
                return readable;
            } finally {
                const cache = new Set();

                readdir$.pipe(
                    endWith(null)
                ).subscribe(key => {
                    if (key === null) return readable.push(null)
                    key = coercePathAbsolute(key);
                    if (recursive) return readable.push(cache[key] = key);
                    const keyParts = (key || "/").split("/");
                    const scoped = keyParts[cwdParts.length - 1];
                    if (scoped && !cache.has(scoped)) {
                        cache.add(scoped);
                        readable.push(scoped);
                    }
                });
            }

        }
    }
}

/**
 * Wraps a collection of random access storage instances to be used with this library.
 *
 * Currently supported functions: exists, get, readdir,
 *
 * It is **not recommended** to use with collections that have big files. For that, use
 * {@link https://docs.holepunch.to/building-blocks/hypercore hypercore}, or
 * {@link https://docs.holepunch.to/helpers/corestore corestore} or some other handler
 * of random-access-storage instances.
 *
 * @example // Example
 * import RAM from "random-access-memory";
 * fromRandomAccessStorageCollection({
 *     ["/file"]: new RAM(),
 *     ["/folder/file2"]: new RAM()
 * });
 * @todo Support put, append, and other operations.
 * @param collection A key/value of fileNames/randomAccessStorage instances, mix it up if you want.
 * @namespace Adapt.fromRandomAccessCollection
 */
export function fromRandomAccessCollection(collection) {
    return {
        get collection() {
            return collection
        },
        /**
         * Whether the file exists in collection. An empty file does not exist to this function.
         * @memberOf Adapt.fromRandomAccessCollection
         * @param {string} file
         * @returns {Promise<boolean>}
         */
        exists(file) {
            return _exists(_get(file))
        },
        /**
         * Get the entire content of the file. **Careful** with big files.
         * @memberOf Adapt.fromRandomAccessCollection
         * @param {string} file
         * @param [config]
         * @param [config.encoding='binary'] Either a `string`, compact-encoding, or codec
         * @returns {Promise<*>}
         */
        get(file, config = {}) {
            const ras = _get(file);
            return _readAll(ras, config);
        },
        /**
         * Returns a readable stream of files in cwd
         * @memberOf fromRandomAccessCollection
         * @param [fromPath="/"] A file path, defaults to root.
         * @param [config]
         * @param [config.cwd] Same as fromPath
         * @param [config.recursive=false] If true, cwd is ignored and all files in the collection are returned.
         * @returns {Readable} A streamx readable stream that emits the values.
         */
        readdir(fromPath = "/", config = {}) {
            if (typeof fromPath === "object") {
                config = fromPath;
                fromPath = config.cwd;
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
    };

    function _get(file) {
        return Object.entries(collection).find(([fileName]) => {
            return coercePathAbsolute(file) === coercePathAbsolute(fileName);
        })?.[1];
    }
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
        valueEncoding,
        encoding = codec(valueEncoding)
    } = config;

    return new Promise(
        (resolve, reject) => {
            ras.stat((e, stat) => {
                if (e) return reject(e);
                ras.read(0, stat.size, (e, buffer) => {
                    if (e) return reject(e);
                    resolve(encoding ? encoding.decode(buffer) : buffer);
                })
            });
        }
    )
}
