import {createContainer, asFunction, asValue, aliasTo, asClass} from "../awilix.js";
import {
    createReadStream,
    createReadStream$,
    get,
    get$,
    list,
    list$,
    put$,
    readdir,
    readdir$,
    ready
} from "../query/index.js";
import {isString} from "../util/index.js";
import {put} from "../query/put.js";
import {append, length} from "../query/append.js";
import {rollupVirtualPlugin} from "../../lib/deploy/rollup-virtual-plugin.js";
import {rollupFromJsdelivr} from "../deploy/rollup-from-jsdelivr.js";
import {importCode} from "../resolve/index.js";
import isFunction from "lodash-es/isFunction.js";
import RandomAccessStorage from "random-access-storage";
import {firstValueFrom} from "rxjs";
import {toArray} from "rxjs/operators";
import b4a from "b4a";
import path from "../tiny-paths.js";
import {getEntry} from "../../dist/query.min.js";

let importingPack;
export let pack;

/**
 * Only necessary if you did not import the entire BYOSU namespace e.g. import * as BYOSU from "bring-your-own-storage-utilities";.
 *
 * IF constructing a iSource from a factory string, you must import a pack.
 * Either use setPack if you already have Deploy.pack loaded.
 * Or, use importPack to import your own or from BYOSU repo.
 *
 * **This is only ran once.
 *
 * Repeated calls will be ignored**
 *
 * @param _pack a preloaded Deploy.pack you have
 * @returns void
 * @memberOf Adapt
 */
export function setPack(_pack) {
    pack ||= _pack;
}

/**
 * Only necessary if you did not import the entire BYOSU namespace e.g. import * as BYOSU from "bring-your-own-storage-utilities";.
 *
 * IF constructing a iSource from a factory string, you must import a pack. Either use setPack if you already have
 * Deploy.pack loaded. Or, use importPack to import your own or from BYOSU repo.
 *
 * **This is only ran once.
 *
 * Repeated calls will be ignored**
 *
 * import errors should be caught by you
 *
 * @param [url] default is https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@0.0.1202/dist/deploy.min.js/+esm
 * @returns {Promise<void>}
 * @memberOf Adapt
 */
async function importPack(url = "https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@0.0.1202/dist/deploy.min.js/+esm") {
    if (importingPack) await importingPack;
    if (pack) return pack;
    importingPack = import(url).then(
        o => {
            pack = o.pack;
            importingPack = undefined;
        }
    );
    await importingPack;
}

const sourceContainer = createContainer();
sourceContainer.register({
    extensions: asFunction(() => (cont) => cont).scoped(),
    install: asFunction(({factory}) => {
        return (name, outputSource) =>
            Promise.resolve().then(
                async () => {
                    if (!pack) {
                        await importPack(typeof window === "undefined" ? "../deploy/pack.js" : undefined);
                    }

                    let code;
                    if (outputSource) {
                        code = await outputSource.get(name);
                    }

                    if (!code) {
                        const packOpts = {};
                        if (!name) name = "source";
                        (packOpts.plugins ||= []).unshift(
                            rollupVirtualPlugin({
                                [name]: await (factory?.() || factory)
                            })
                        );

                        packOpts.plugins.push(rollupFromJsdelivr());
                        const result = await pack(name, packOpts);
                        ({code} = result);
                        if (outputSource) await outputSource.put(name, code);
                    }

                    try {
                        if (code) {
                            const mod = await importCode(code);
                            const container = preFront(mod);
                            if (mod.extensions) {
                                await mod.extensions(container, {asFunction, asValue, aliasTo, asClass});
                            }
                            return container.cradle;
                        } else {
                            return false;
                        }
                    } catch (e) {
                        debugger;
                    }
                    return false;
                }
            );
    }).scoped(),
    factory: asFunction(({source}) => {
        if (isString(source.factory)) {
            return () => source.factory;
        }
        if (isFunction(source.factory)) {
            return Promise.resolve(source.factory());
        }
        return null;
    }),
    id: asFunction(({source, ready}) => {
        if (source.id) {
            return source.id;
        }
        return null;
    }).scoped(),
    open: asFunction(({source}) => {
        if (source.open) {
            return source.open.bind(source);
        }
        return () => Promise.resolve();
    }).scoped(),
    get: asFunction(({source, open}) => {
        if (source.get) {
            return async (key, config) => {
                if (open) {
                    await open(key, config);
                }
                return get(source, key, config);
            };
        }
        return null;
    }).scoped(),
    get$: asFunction(({source, get}) => {
        if (source.get$) {
            return source.get$.bind(source);
        }
        if (get) {
            return (key, config) => get$(source, key, config);
        }
    }).scoped(),
    entry: asFunction(({source}) => {
        return (path, config) => getEntry(source, path, config);
    }).scoped(),
    createReadStream: asFunction(({source}) => {
        if (source.createReadStream || source.get) {
            return createReadStream.bind(null, source);
        }
    }).scoped(),
    createReadStream$: asFunction(({source}) => {
        if (source.createReadStream$) {
            return source.createReadStream$.bind(source);
        }
        if (source.createReadStream || source.get) {
            return createReadStream$.bind(null, source);
        }
    }).scoped(),
    randomAccess: asFunction(({
                                  ready,
                                  createReadStream$, get, put, exists, entry,
                                  state, readable, writable
                              }) => {
        return (file, config = {}) => {
            if (b4a.isBuffer(config)) {
                config = {
                    buffer: config
                };
            }
            const {
                readable: _readable = readable,
                writable: _writable = writable,
                directory,
                buffer,
                truncate = false,
                size = buffer?.length || 0,
                offset = 0,
                ...restConfig
            } = config;
            if (directory) file = path.join(directory, path.resolve('/', filename).replace(/^\w+:\\/, ''))

            return new RandomAccessStorage({
                async open(req) {
                    await ready();
                    const fileDetail = await entry(file, config);
                    if (fileDetail.isFolder) {
                        return req.callback(new Error("Cannot do file ops on a directory."));
                    }
                    if (writable && (offset + size) > 0) {
                        let buff;
                        if (fileDetail.size) {
                            let buffs = [await get(file, config)];
                            if (truncate && fileDetail.size < (offset + size)) {
                                buffs.push(b4a.alloc((offset + size) - fileDetail.size));
                            } else if (truncate && fileDetail.size > offset + size) {
                                buffs[0] = b4a.from(buffs[0].slice(0, offset + size));
                            }
                            if (buffs.length === 1) buff = buffs[0]
                            else buff = b4a.concat(buffs);
                        } else {
                            buff = b4a.alloc(offset + size);
                        }

                        if (b4a.isBuffer(buffer)) {
                            b4a.copy(buffer, buff, offset, 0, offset + size);
                        }

                        await put(
                            file,
                            buff,
                            restConfig
                        );

                        return req.callback(null);
                    }

                    if (!!fileDetail.size && fileDetail.isFile)
                        req.callback(null)
                    else {
                        req.callback(new Error("File does not exist"));
                    }
                },
                async stat(req) {
                    try {
                        const size = (await get(file))?.length || 0;
                        req.callback(null, {size});
                    } catch (e) {
                        req.callback(e);
                    }
                },
                async close(req) {
                    setTimeout(() => req.callback(null), 0);
                },
                ..._readable ? {
                    async read(req) {
                        try {
                            this.stat(async (e, {size}) => {
                                if (e) return req.callback(e, null);
                                if (size < (req.offset + req.size)) {
                                    const error = new Error('Could not satisfy length');
                                    error.code = "ENOENT";
                                    return req.callback(error, null);
                                }

                                const result = await firstValueFrom(
                                    createReadStream$(file, {
                                        ...restConfig,
                                        start: req.offset,
                                        length: req.size
                                    }).pipe(
                                        toArray()
                                    )
                                );

                                const allOfIt = b4a.from(b4a.concat(result));
                                req.callback(null, allOfIt);

                            })
                        } catch (e) {
                            req.callback(e);
                        }
                    }
                } : {}
                ,
                ..._writable ? {
                    async write(req) {
                        if (!put) return req.callback(new Error("Source does not support put/write."));
                        try {
                            const buffer = await get(file, restConfig);
                            if (!buffer) return req.callback(new Error("File doesn't exist"));
                            b4a.copy(req.data, buffer, req.offset, 0, buffer.length)
                            await put(file, buffer, restConfig);
                            req.callback(null);
                        } catch (e) {
                            req.callback(e);
                        }
                    },
                    async truncate(req) {
                        if (!put) return req.callback(new Error("Source does not support truncate"));
                        try {
                            const buf = await get(file, restConfig);
                            if (buf.length === req.offset) {
                                return req.callback(null);
                            }
                            if (req.offset > buf.length) {
                                await put(
                                    file,
                                    b4a.from(
                                        b4a.concat([buf, b4a.alloc(req.offset - buf.length)])
                                    ),
                                    restConfig
                                );
                            } else {
                                await put(file, buf.slice(0, req.offset), restConfig);
                            }
                            req.callback(null);
                        } catch (e) {
                            req.callback(e);
                        }
                    },
                    async del(req) {
                        if (!put) throw new Error("Source does not support del");
                        try {
                            this.stat(async (e, {size}) => {
                                if (req.offset + req.size > size) {
                                    return this.truncate(req);
                                }
                                const buffer = await get(file, restConfig);
                                b4a.fill(buffer, "\0", req.offset, req.offset + req.size);
                                await put(file, buffer, restConfig);
                                req.callback(null);
                            });
                        } catch (e) {
                            req.callback(e);
                        }
                    }
                } : {}
            });
        }
    }),
    put: asFunction(({source}) => {
        if (source.put) {
            return (key, buffer, config) => put(source, key, buffer, config);
        }
    }).scoped(),
    put$: asFunction(({source, put}) => {
        if (source.put$) {
            return source.put$.bind(source);
        }
        if (put) {
            return (key, buff, config) => put$(source, key, buff, config);
        }
    }),
    del: asFunction(({source}) => {
        if (source.del) {
            return (key) => source.del(key)
        }
    }).scoped(),
    append: asFunction(({source}) => {
        if (source.append) {
            return (buf, config) => append(source, buf, config);
        }
    }).scoped(),
    length: asFunction(({source}) => {
        if (source.length || source.length === 0) {
            return length(source)
        }
    }).transient(),
    ready: asFunction(({source}) => {
        return (config) => ready(source, config);
    }).scoped(),
    exists: asFunction(({get, source}) => {
        if (source.exists || get) {
            return source.exists?.bind(source) || (async (key, config) => !!await get(key, config));
        }
    }).scoped(),
    readdir: asFunction(({source}) => {
        if (source.readdir) {
            return (path, config = {}) => readdir(source, {cwd: path, ...config});
        }
    }).scoped(),
    readdir$: asFunction(({source}) => {
        if (source.readdir$) {
            return source.readdir$.bind(source);
        }
        if (source.readdir || source.list) {
            return readdir$.bind(null, source);
        }
    }).scoped(),
    list: asFunction(({exists, source, entry, get}) => {
        if (source.list || source.readdir) {
            return list.bind(null, {
                exists,
                list: source.list?.bind(source),
                readdir: source.readdir?.bind(source),
                get,
                entry
            })
        }
    }).scoped(),
    list$: asFunction(({source, ready}) => {
        if (source.list$) {
            return source.list$.bind(null);
        }
        if (source.list || source.readdir) {
            return list$.bind(null, source);
        }
    }),
    readable: asFunction(({source, get}) => {
        if (typeof source.readable === "function") {
            return source.readable();
        }
        return source.readable || !!get;
    }).scoped(),
    writable: asFunction(({source, put}) => {
        if (typeof source.writable === "function") {
            return source.writable();
        }
        return source.writable || !!put
    }).scoped(),
    appendable: asFunction(({source, append}) => {
        if (typeof source.appendable === "function") {
            return source.appendable();
        }
        return source.appendable || !!append
    }).scoped()
});

function preFront(source, state = {}) {
    return sourceContainer.createScope().register({
        source: asValue(source),
        state: asValue(state)
    })
}

/**
 * @interface iSource
 * @description
 * Utilize this source interface to make it easier and safer for this library to handle your
 * source. Any area where library function accepts a 'source', pass a wrapped source for best
 * results.
 *
 * source can have any of these methods and properties:
 * <pre>
 * source = {
 *     // Methods
 *     get,                 // Get a buffer from the storage by key.
 *     get$,                // An observable version of get
 *     put,                 // Put a buffer at key into the source
 *     put$,                // An observable of put
 *     append,              // Append a buffer to a source
 *     append$,             // An observable of append
 *     entry,               // To retrieve details of entry at key of source
 *     del,                 // Del key at source.
 *     exists,              // Whether the key of source exists
 *     ready,               // Whether the source is ready to operate.
 *     readdir,             // Get an array of entries of the cwd of source
 *     list,                // Get an array of 'entry' details of the cwd of source
 *     createReadStream,    // Get a stream of data from a key of source.
 *     factory              // A function that returns a `string module` that defines how to
 *                          // install this storage source.
 *
 *     // Properties
 *     length               // For supporting sources, get the length. Not fully implemented.
 *     source               // the raw source iSource wraps.
 * };
 * </pre>
 *
 * @example // Example of factory
 * import {pack} from "bring-your-own-storage-utilities/deploy";
 * setPack(pack);
 *
 * const src = ISource({
 *     factory: `
 *         const obj = {};
 *         export function get(x) {
 *             return obj[x];
 *         }
 *         export function put(x, buf) {
 *             obj[x] = buf;
 *         }
 *         export function del(x) {
 *             if (obj[x]) {
 *                 delete obj[x];
 *             }
 *         }
 *     `
 * });
 * const installedSrc = await src.install();
 * await installedSrc.put("hello", "you");
 * await installedSrc.get("hello"); // buffer version of 'you'
 *
 * @example // You don't need factory to make, if you don't need portable source.
 *
 * const obj = {};
 * const src = ISource({
 *    get(x) {
 *        return obj[x];
 *    },
 *    async put(x, buf) {
 *        obj[x] = buf;
 *        await new Promise(resolve => setTimeout(resolve, 1000);
 *    },
 *    del(x) {
 *        if (obj[x]) {
 *            delete obj[x];
 *        }
 *    }
 * });
 *
 * @see Adapt.fromRandomAccessCollection for details on how to implement
 * @param source
 * @param state any state to be carried by the source
 * @returns {any}
 * @memberOf Adapt
 */
export function iSource(source, state = {}) {
    return preFront(source, state).cradle;
}


// await importPack();
//
// const src = ISource({
//     factory: `
//         const obj = {};
//         export function get(x) {
//             return obj[x];
//         }
//         export function put(x, buf) {
//             obj[x] = buf;
//         }
//         export function del(x) {
//             if (obj[x]) {
//                 delete obj[x];
//             }
//         }
//     `
// });
//
// const result = await src.install();
// await result.put("hey", "hello");
// console.log(await result.get("hey"));


