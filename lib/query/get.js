import {defer, firstValueFrom} from "rxjs";
import {map} from "rxjs/operators";
import codec from "codecs";
import b4a from "b4a";

/**
 * A wrapper to get a key from a source.
 *
 * Unless using for something else, this should always return a binary buffer or uint8array.
 *
 * @example
 * // A get where the key is the result for example purposes.
 * // The key is a javascript object
 * // the encoding is 'json' to turn the result from get to a buffer.
 * get$({ get(k) { return k; } }, {test: "case"}, { encoding: "json" }).subscribe(buffer => {});
 *
 * @param source
 * @param key
 * @param {(object|string)} [config] Configuration passed to the source, except the following.
 * If a string is passed here, it will be inferred as the encoding.
 * @param {function} [config.getter] How to get from the source. This can be async. The default is source.get(key, config).
 * @param {({encode, decode}|string)} [config.encoding=utf8] An encoder object or description. Most of this API expects
 * the result to be in binary, including Query.createReadStream. So if your source returns a string or json object,
 * coerce the result into binary with this configuration. IF the source already returns a buffer, this will do nothing.
 * If you need to mutate the response further than this, use `config.getter`.
 * @returns {Observable<buffer>}
 * @memberOf Query
 */
export function get$(source, key, config = {}) {
    if (typeof config === "string") config = { encoding: config };
    const {
        getter = (source, key, config) => {
            return source.get(key, config);
        },
        encoding = codec("binary"),
        ... restConfig
    } = config;

    return defer(() => Promise.resolve(getter(source, key, restConfig)))
        .pipe(
            map(
                o => o && (b4a.isBuffer(o) ? o : codec(encoding).encode(o))
            )
        );
}

/**
 * Convenience async version of get$
 * @memberOf Query
 */
export function get(source, key, config = {}) {
    return firstValueFrom(get$(source, key, config));
}
