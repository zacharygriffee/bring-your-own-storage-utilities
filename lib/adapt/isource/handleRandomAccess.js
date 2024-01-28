import b4a from "b4a";
import path from "../../tiny-paths.js";
import {firstValueFrom, Subject, defer, of} from "rxjs";
import {toArray, concatMap, catchError} from "rxjs/operators";
import {asValue} from "../../awilix.js";


let sourceContainer;
export default (x) => {
    sourceContainer = x;
}

export function handleRandomAccess(cradle) {
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
                       state, readable, writable, RandomAccessStorageClass
                   }, file, config) {

    if (!RandomAccessStorageClass) {
        throw new Error("You must Adapt.enableRandomAccess(!!RandomAccessStorageClass!!); before using iSource.randomAccess");
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
    if (directory) file = path.join(directory, path.resolve('/', filename).replace(/^\w+:\\/, ''));

    const queueJobs = new Subject();
    const queueHandler = queueJobs.pipe(
        concatMap(
            ({task, request}) => {
                return defer(async () => {
                    const result = await Promise.resolve(task());
                    await request.callback(null, result);
                }).pipe(
                    catchError(e => {
                        request.callback(e);
                        return of(undefined);
                    })
                )
            }
        )
    ).subscribe();

    return new (class extends RandomAccessStorageClass {
            _open(req) {
                queueJobs.next({
                    request: req,
                    async task() {
                        await ready();
                        const fileDetail = await entry(file, restConfig);
                        if (fileDetail.isFolder && !fileDetail.empty) {
                            return req.callback(new Error("Cannot do file ops on a directory."));
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

            _stat(req) {
                entry(file).then(
                    result => {
                        if (!result.isFile/* && !result.empty*/) {
                            const e = new Error("File doesn't exist.");
                            e.code = "ENOENT";
                            return req.callback(e, {size: 0});
                        }
                        req.callback(null, result);
                    }
                );
            }

            _close(req) {
                queueJobs.next(
                    {
                        request: req,
                        task() {
                            state.rasPool.delete(file);
                            queueJobs.complete();
                            queueHandler.unsubscribe();
                        }
                    }
                );
            }

            _read(req) {
                if (!_readable) return req.callback(new Error("Source is not readable."));
                queueJobs.next(
                    {
                        request: req,
                        async task() {
                            if (req.size === 0) return b4a.alloc(0);
                            const {size} = await entry(file, restConfig);
                            if (size < (req.offset + req.size)) throw new Error('Could not satisfy length');

                            const result = await firstValueFrom(
                                createReadStream$(file, {
                                    ...restConfig,
                                    start: req.offset,
                                    length: req.size
                                }).pipe(
                                    toArray()
                                )
                            );

                            return b4a.from(b4a.concat(result));
                        }
                    }
                );
            }

            _write(req) {
                if (!_writable) return req.callback(new Error("Source is not writable."));
                if (!put) return req.callback(new Error("Source does not support put/write."));
                queueJobs.next(
                    {
                        request: req,
                        async task() {
                            let buffer = await get(file, restConfig) ?? b4a.alloc(0);
                            if (req.size + req.offset > buffer.length) {
                                buffer = b4a.from(b4a.concat([buffer, b4a.alloc((req.offset + req.size) - buffer.length)]));
                            }
                            b4a.copy(req.data, buffer, req.offset, 0, req.size);
                            return put(file, buffer, restConfig);
                        }
                    }
                );
            }

            _truncate(req) {
                if (!_writable) return req.callback(new Error("Source is not truncateable."));
                if (!put) return req.callback(new Error("Source does not support truncate"));
                queueJobs.next(
                    {
                        request: req,
                        task: async () => {
                            const buf = await get(file, restConfig);
                            if (buf.length === req.offset) {
                                return null;
                            }
                            if (req.offset > buf.length) {
                                return put(
                                    file,
                                    b4a.from(
                                        b4a.concat([buf, b4a.alloc(req.offset - buf.length)])
                                    ),
                                    restConfig
                                );
                            } else {
                                const rem = buf.slice(0, req.offset);
                                return put(file, b4a.from(rem), restConfig);
                            }
                        }
                    }
                );
            }

            _del(req) {
                if (!_writable) return req.callback(new Error("Source is not deletable."));
                if (!put) throw new Error("Source does not support del");

                queueJobs.next(
                    {
                        request: req,
                        async task() {
                            const {size} = await entry(file, restConfig);
                            const buffer = await get(file, restConfig);
                            if (req.offset + req.size > size) {
                                return put(file, b4a.from(buffer.slice(0, req.offset)), restConfig);
                            } else {
                                b4a.fill(buffer, "\0", req.offset, req.offset + req.size);
                                return put(file, buffer, restConfig);
                            }
                        }
                    }
                );
            }
        }
    )();
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