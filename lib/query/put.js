import {defer, firstValueFrom} from "rxjs";
import b4a from "b4a";
import {defaultIfEmpty} from "rxjs/operators";
import codec from "codecs";

/**
 * Put data into a source.
 *
 * @example
 * // put into an object
 * const obj = {};
 * await put(
 *     {
 *         put(k, buf) { obj[k] = buf }
 *     },
 *     "hello",
 *     {test: "case"},
 *     {encoding: "json"} // To turn the object into a buffer
 *                        // the put operation can use.
 *                        // Set this to null, to pass value as is.
 * );
 *
 * @param source
 * @param key
 * @param bufferValue The data to put. IF you don't want to pass a buffer to source, set `config.encoding=null`
 * @param [config] With the exception of the following, the config for the put operation.
 * @param {({encode, decode} | string | null)} [config.encoding=utf8] If `bufferValue`  is not a buffer, this encoding will be
 * applied.
 * @param [config.putter] Change the put operation. Helpful if you are putting to a source that does not handle buffer
 * operations or has a different argument signature or has a different function name.
 * Set this to 'null' to ignore encodings. Most of the BYOSU does not care about the encoding put into the source,
 * it cares about how it gets it with the `Query.get$`. Pass null to ignore encodings.
 * @returns {Observable<ObservedValueOf<Promise<unknown>>>}
 * @memberOf Query
 */
export function put$(source, key, bufferValue, config = {}) {
    if (typeof config === "string") config = { encoding: config };
    const {
        putter = (source, key, bufferValue, config = {}) => {
            return source.put(key, bufferValue, config);
        },
        encoding = "binary",
        sourceEncoding = "binary",
        ...restConfig
    } = config;

    if (encoding !== null && !b4a.isBuffer(bufferValue)) {
        bufferValue = codec(encoding).encode(bufferValue);
    }

    return defer(() => Promise.resolve(putter(source, key, bufferValue, restConfig)));
}

/**
 * Convenience async method for put$
 *
 * Some `source.put` does not return anything after it's operation, in this case, this will return null.
 *
 * @memberOf Query
 */
export function put(source, key, bufferValue, config) {
    return firstValueFrom(
        put$(source, key, bufferValue, config).pipe(
            defaultIfEmpty(null)
        )
    )
}
