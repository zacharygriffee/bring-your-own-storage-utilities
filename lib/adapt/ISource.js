import {createContainer, asFunction, asValue} from "../awilix.js";
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

const sourceContainer = createContainer();

sourceContainer.register({
    factory: asFunction(({source}) => {
        if (isString(source.factory)) {
            return source.factory;
        }
        return null;
    }).scoped(),
    id: asFunction(({source, ready}) => {
        if (source.id) {
            return source.id;
        }
        return null;
    }).scoped(),
    get: asFunction(({source}) => {
        if (source.get) {
            return async (key, config) => {
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
        if (source.entry) {
            return source.entry.bind(source);
        }

        return null;
    }).scoped(),
    createReadStream: asFunction(({source}) => {
        if (source.createReadStream || source.get) {
            return createReadStream.bind(null, source);
        }
        return null;
    }).scoped(),
    createReadStream$: asFunction(({source}) => {
        if (source.createReadStream$) {
            return source.createReadStream$.bind(source);
        }
        if (source.createReadStream || source.get) {
            return createReadStream$.bind(null, source);
        }
        return null;
    }).scoped(),
    put: asFunction(({source}) => {
        if (source.put) {
            return (key, buffer, config) => put(source, key, buffer, config);
        }
        return null;
    }).scoped(),
    put$: asFunction(({source, put}) => {
        if (source.put$) {
            return source.put$.bind(source);
        }
        if (put) {
            return (key, buff, config) => put$(source, key, buff, config);
        }
        return null;
    }),
    del: asFunction(({source}) => {
        if (source.del) {
            return (key) => source.del(key)
        }
        return null;
    }).scoped(),
    append: asFunction(({source}) => {
        if (source.append) {
            return (buf, config) => append(source, buf, config);
        }
        return null;
    }).scoped(),
    length: asFunction(({source}) => {
        if (source.length || source.length === 0) {
            return length(source)
        }
        return null;
    }).transient(),
    ready: asFunction(({source}) => {
        return (config) => ready(source, config);
    }).scoped(),
    exists: asFunction(({get, source}) => {
        if (source.exists || get) {
            return source.exists?.bind(source) || (async (key, config) => !!await get(key, config));
        }
        return null;
    }).scoped(),
    readdir: asFunction(({source}) => {
        if (source.readdir) {
            return (path, config = {}) => readdir(source, {cwd: path, ...config});
        }
        return null;
    }).scoped(),
    readdir$: asFunction(({source}) => {
        if (source.readdir$) {
            return source.readdir$.bind(source);
        }
        if (source.readdir || source.list) {
            return readdir$.bind(null, source);
        }
        return null;
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
        return null;
    }).scoped(),
    list$: asFunction(({source, ready}) => {
        if (source.list$) {
            return source.list$.bind(null);
        }
        if (source.list || source.readdir) {
            return list$.bind(null, source);
        }
        return null;
    }),
    readable: asFunction(({get, ready}) => {
        return !!get;
    }).scoped(),
    writable: asFunction(  ({put, append, ready}) => {
        return !!put || !!append
    }).scoped(),
    appendable: asFunction(({append, ready}) => {
        return !!append
    }).scoped()
});

/**
 * Utilize this source interface to make it easier and safer for this library to handle your
 * source. Any area where library function accepts a 'source', pass a wrapped source for best
 * results.
 * @param source
 * @param [meta] Just meta data to send along with the container that wraps the source.
 * @returns {any}
 * @memberOf Adapt
 */
export function ISource(source, meta = {}) {
    return sourceContainer.createScope().register({
        source: asValue(source),
        meta: asValue(meta)
    }).cradle;
}