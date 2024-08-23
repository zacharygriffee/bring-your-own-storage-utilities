import {defer, firstValueFrom} from "rxjs";
import b4a from "b4a";
import {defaultIfEmpty} from "rxjs/operators";
import codec from "codecs";

/**
 * Append data into a source.
 *
 * @example
 * // append into an array
 * const arr = [];
 * await append(
 *     {
 *         append(buf) { arr.push(buf) }
 *     },
 *     "hello",
 *     {test: "case"},
 *     {encoding: "json"} // To turn the object into a buffer
 *                        // the put operation can use.
 *                        // Set this to null, to pass value as is.
 * );
 * const [obj] = arr;
 * obj // {test: "case"}
 *
 * @param source
 * @param bufferValue The data to append. IF you don't want to pass a buffer to source, set `config.encoding=null`
 * @param [config] With the exception of the following, the config for the append operation.
 * @param {({encode, decode} | string | null)} [config.encoding=utf8] If `bufferValue`  is not a buffer, this encoding will be
 * applied.
 * @param [config.appender] Change the append operation. Helpful if you are appending to a source that does not handle buffer
 * operations or has a different argument signature or has a different function name.
 * Set this to 'null' to ignore encodings. Most of the BYOSU does not care about the encoding append into the source,
 * it cares about how it gets it with the `Query.get$`. Pass null to ignore encodings.
 * @returns {Observable<ObservedValueOf<Promise<unknown>>>}
 * @memberOf Query
 */
export function append$(source, bufferValue, config = {}) {
    if (typeof config === "string") config = { encoding: config };
    const {
        appender = (source, key, bufferValue, config) => {
            return source.append(bufferValue, config);
        },
        encoding = "binary",
        sourceEncoding = "binary",
        ...restConfig
    } = config;

    if (encoding !== null && !b4a.isBuffer(bufferValue)) {
        bufferValue = codec(encoding).encode(bufferValue);
    }

    return defer(() => Promise.resolve(appender(source, bufferValue, restConfig)));
}

/**
 * Convenience async method for append$
 *
 * Some `source.append` does not return anything after it's operation, in this case, this will return null.
 *
 * @memberOf Query
 */
export function append(source, bufferValue, config = {}) {
    return firstValueFrom(
        append$(source, bufferValue, config).pipe(
            defaultIfEmpty(null)
        )
    )
}

export function length(source) {
    return source.length;
}