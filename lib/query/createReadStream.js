import {defer} from "rxjs";
import {pipeline, Readable, Transform} from "streamx";
import b4a from "b4a";

/**
 * Convenience 'rxjs.Observable' that wraps around `createReadStream`.
 * @returns Observable<Buffer>
 */
export function createReadStream$(source, key, config = {}) {
    return defer(() => createReadStream(source, key, config));
}

/**
 * Creates a streamx.Readable stream of source's readstream of a key. If the source does not have read stream
 * will try and use a get function to pull resource.
 *
 * Backpressure is not completely ironed out nor tested in many cases, especially when pulling from a source that
 * does not have a native createReadStream function e.g. one that only has source.get.
 *
 * @param source A source
 * @param key A key to the resource
 * @param [config] Configuration is added to second parameter of the source.createReadStream or source.get
 * @param [config.map] Helper function to map what would result from the stream. Helpful to decode or if the resulting
 * stream is object, and you need to pull specific value from that object. Or in the case where the 'consumer'
 * needs a buffer, you can use this function to coerce the result to a buffer if it isn't already.
 * @param [config.start=0] The inclusive byte start of the read stream.
 * @param [config.end=data.length] Inclusive byte end of read stream.
 * @param [config.length] If config.end is not set, how many bytes from config.start not inclusive.
 * @param [config.highWaterMark] createReadStream will automatically chunkify to the highWaterMark any stream passed
 * through. This will help to control the flow.
 * @returns {Readable} Readable stream.
 */
export function createReadStream(source, key, config = {}) {
    const {
        map,
        highWaterMark,
        ...restConfig
    } = config;

    let streams = [];

    if (source.createReadStream) {
        streams.push(source.createReadStream(key, restConfig));
    } else if (source.get) {
        const readable = new Readable();
        streams.push(readable);
        Promise.resolve(
            source.get(
                key,
                restConfig
            )
        ).then(
            data => {
                if (data && b4a.isBuffer(data)) {
                    const byteLength = data.length;

                    restConfig.start ??= 0;
                    if (restConfig.length && !restConfig.end) {
                        restConfig.end = restConfig.length + (restConfig.start ?? 0);
                    } else if (restConfig.end) {
                        // Inclusive.
                        restConfig.end += 1;
                    } else {
                        restConfig.end = byteLength;
                    }

                    data = data.slice(restConfig.start, restConfig.end);
                    readable.push(b4a.from(data));
                }
                readable.push(null);
            }
        ).catch(
            e => readable.destroy(e)
        );
    }

    if (highWaterMark) {
        streams.push(chunkify(highWaterMark));
    }

    if (map) {
        streams.push(
            new Transform(
                {
                    async transform(from, cb) {
                        const self = this;
                        await Promise.resolve(map(from))
                            .then(
                                (val) => {
                                    self.push(val);
                                    cb(null);
                                }
                            )
                            .catch(
                                e => {
                                    cb(e);
                                }
                            )
                    }
                }
            )
        );
    }

    if (streams.length === 0) {
        throw new Error("createReadStream failed to infer from source.");
    }
    if (streams.length === 1) {
        return streams[0];
    }
    return pipeline(...streams);
}

function chunkify(size) {
    let lastChunk = b4a.alloc(0)
    const transform = function (chunk, callback) {
        const data = b4a.concat([lastChunk, chunk])
        const remainingLength = data.length % size

        let endIndex
        let ix = 0

        while ((endIndex = (ix + size)) <= data.length) {
            const chunkBuffer = data.subarray(ix, endIndex)
            this.push(chunkBuffer)
            ix += size
        }

        if (remainingLength > 0) {
            lastChunk = data.subarray(data.length - remainingLength, data.length)
        } else {
            lastChunk = null
        }

        callback()
    }

    return new Transform({
        transform,
        flush(cb) {
            if (lastChunk && lastChunk.length) {
                this.push(lastChunk)
            }
            cb()
        }
    })
}