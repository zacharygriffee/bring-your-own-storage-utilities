import b4a from "b4a";
import path from "../../tiny-paths.js";
import {firstValueFrom} from "rxjs";
import {toArray} from "rxjs/operators";
import {promise as Q} from "../../fastq.js";


let sourceContainer;
export default (x) => {
    sourceContainer = x;
}
/**
 * Create a random access storage from the source.
 *
 * @param file {string} File path to create random-access-storage from.
 * @param config {object} configuration to be passed to the random-access-storage implementation.
 * @param {boolean} [config.readable=source.isReadable] Override whether this is readable. Can't make a non-readable source readable, but you can
 * make a readable source non-readable. If not readable: read function is not available.
 * @param {boolean} [config.writable=source.isWritable] Override whether this is writable. Can't make a non-writable source writable, but you can
 * make a writable source non-writable. If not writable: write, del, truncate are not available.
 * @param {string} [config.directory] The directory of the source to do file operations in.
 * @param {buffer} [config.buffer] The initial buffer to the file creation. So if you already have buffer and the source is writable.
 * @param {number} [config.size] How much of config.buffer should be written, maybe you don't want the whole file.
 * @param {boolean} [config.truncate] Create an initial truncation operation using config.offset. If it is a non-existing file,
 * will create the file with config.offset amount of zero-bytes.
 * @param {number} [config.offset] if config.buffer, write into the file at this offset. If config.truncate, where to truncate the file to.
 * @memberOf Adapt.iSource
 */

function handleRandomAccess(cradle) {
    const {state} = cradle;
    state.rasPool ||= new Map();
    return (file, config = {}) => {
        if (state.rasPool.has(file)) return state.rasPool.get(file);
        const ras = makeInstance(cradle, file, config);
        state.rasPool.set(file, ras);
        return ras;
    }
}
function makeInstance({
                       source,
                       ready,
                       createReadStream$, get, put, exists, entry,
                       state, readable, writable, id
                   }, file, config) {

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
    if (directory) file = path.join(directory, path.resolve('/', filename).replace(/^\w+:\\/, ''));

    class RandomAccess {
        constructor() {
            this._startQ();
        }

        _startQ() {
            if (this.queue) return;
            let timer, stallTimeout = 10000;
            this.queue ||= Q(
                async ({task, request}) => {
                    try {
                        timer = setTimeout(() => {
                            console.error("The queue stalled", {task, request});
                        }, stallTimeout);
                        const result = await Promise.resolve(task());
                        if (request.callback) await request.callback(null, result);
                        return result;
                    } catch (e) {
                        if (request.callback) return request.callback(e);
                        throw e;
                    } finally {
                        if (timer) clearTimeout(timer);
                    }
                }, 1
            );
        }

        open(cb = noop) {
            this.queue.push({
                request: {callback: cb},
                async task() {
                    await ready();
                    const fileDetail = await entry(file, restConfig);
                    if (fileDetail.isFolder && !fileDetail.empty) {
                        new Error("Cannot do file ops on a directory.");
                    }
                    if (writable && (offset + size) > 0) {
                        let buff;
                        if (fileDetail.size) {
                            let buffs = [await get(file, restConfig)];
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
                    }
                }
            });
        }

        stat(cb = noop) {
            entry(file).then(
                result => {
                    if (!result.isFile/* && !result.empty*/) {
                        const e = new Error("File doesn't exist.");
                        e.code = "ENOENT";
                        return cb(e, {size: 0});
                    }
                    cb(null, result);
                }
            );
        }

        close(cb = noop) {
            this.queue.push(
                {
                    request: {callback: cb},
                    task() {
                        state.rasPool.delete(file);
                    }
                }
            );
        }

        read(offset, size, cb = noop) {
            if (!_readable) return cb(new Error("Source is not readable."));
            this.queue.push(
                {
                    request: {callback: cb},
                    async task() {
                        if (size === 0) return b4a.alloc(0);
                        const entryStat = await entry(file, restConfig);
                        const {size: entrySize} = entryStat;
                        if (entrySize < (offset + size))
                            throw new Error('Could not satisfy length');

                        const result = await firstValueFrom(
                            createReadStream$(file, {
                                ...restConfig,
                                start: offset,
                                length: size
                            }).pipe(
                                toArray()
                            )
                        );

                        return b4a.from(b4a.concat(result));
                    }
                }
            );
        }

        write(offset, data, cb = noop) {
            if (!_writable) return cb(new Error("Source is not writable."));
            if (!put) return cb(new Error("Source does not support put/write."));
            this.queue.push(
                {
                    request: {callback: cb},
                    async task() {
                        let size = data.length;
                        let buffer = await get(file, {...restConfig, wait: false}) ?? b4a.alloc(0);
                        if (size + offset > buffer.length) {
                            buffer = b4a.from(b4a.concat([buffer, b4a.alloc((offset + size) - buffer.length)]));
                        }
                        b4a.copy(data, buffer, offset, 0, size);
                        return put(file, buffer, restConfig);
                    }
                }
            );
        }

        truncate(offset, cb = noop) {
            if (!_writable) return cb(new Error("Source is not truncateable."));
            this.queue.push(
                {
                    request: {callback: cb},
                    task: async () => {
                        const buf = await get(file, restConfig);
                        if (buf.length === offset) {
                            return null;
                        }
                        if (offset > buf.length) {
                            return put(
                                file,
                                b4a.from(
                                    b4a.concat([buf, b4a.alloc(offset - buf.length)])
                                ),
                                restConfig
                            );
                        } else {
                            const rem = buf.slice(0, offset);
                            return put(file, b4a.from(rem), restConfig);
                        }
                    }
                }
            );
        }

        del(offset, size, cb = noop) {
            if (!_writable) return cb(new Error("Source is not deletable."));
            if (!put) throw new Error("Source does not support del");

            this.queue.push(
                {
                    request: {callback: cb},
                    async task() {
                        const {size:entrySize} = await entry(file, restConfig);
                        const buffer = await get(file, restConfig);
                        if (offset + size > entrySize) {
                            return put(file, b4a.from(buffer.slice(0, offset)), restConfig);
                        } else {
                            b4a.fill(buffer, "\0", offset, offset + size);
                            return put(file, buffer, restConfig);
                        }
                    }
                }
            );
        }
    }

    return new RandomAccess();
}

function noop() {
    return () => null
}



/**
 * Enable random access storage support by passing the random-access-storage class
 * from npm -i random-access-storage
 * @param RandomAccessStorageClass
 * @deprecated
 * @memberOf Adapt
 */
function enableRandomAccess(RandomAccessStorageClass) {
    console.warn("enableRandomAccess no longer necessary.");
}

export {handleRandomAccess, enableRandomAccess};
