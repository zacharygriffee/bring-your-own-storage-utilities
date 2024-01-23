import b4a from "b4a";
import path from "../../tiny-paths.js";
import {firstValueFrom} from "rxjs";
import {toArray} from "rxjs/operators";
import {asValue} from "../../awilix.js";

let sourceContainer;
export default (x) => {
    sourceContainer = x;
}

export function handleRandomAccess({
                                       ready,
                                       createReadStream$, get, put, exists, entry,
                                       state, readable, writable, RandomAccessStorageClass
                                   }) {
    return (file, config = {}) => {
        if (!RandomAccessStorageClass) {
            throw new Error("You must Adapt.enableRandomAccess(!!RandomAccessStorageClass!!); before using iSource.randomAccess")
        }
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

        return new RandomAccessStorageClass({
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
                    req.callback(null);
                else {
                    req.callback(new Error("File does not exist"));
                }
            },
            async stat(req) {
                try {
                    req.callback(null, await entry(file));
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
}

/**
 * Enable random access storage support by passing the random-access-storage class
 * from npm -i random-access-storage
 * @param RandomAccessStorageClass
 * @memberOf Adapt
 */
export function enableRandomAccess(RandomAccessStorageClass) {
    sourceContainer.register({
        RandomAccessStorageClass: asValue(RandomAccessStorageClass)
    });
}