import {createContainer, asFunction, asValue} from "../awilix.js";
import {createReadStream, createReadStream$, list, list$, readdir, readdir$} from "../query/index.js";
import {defer} from "rxjs";

const sourceContainer = createContainer();

sourceContainer.register({
    get: asFunction(({source}) => {
        if (source.get) {
            return source.get.bind(source)
        }
        return null;
    }).scoped(),
    get$: asFunction(({source, get}) => {
        if (source.get$) {
            return source.get$.bind(source);
        }
        if (get) {
            return (...args) => defer(() => Promise.resolve(get(...args)));
        }
    }),
    entry: asFunction(({source}) => {
        if (source.entry) {
            return source.entry.bind(source);
        }

        return null;
    }),
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
    put: asFunction(({source, appendable}) => {
        if (source.put) {
            return source.put.bind(source)
        }
        if (appendable) {
            return (buf, config) => source.append(buf, config)
        }
        return null;
    }).scoped(),
    del: asFunction(({source}) => {
        if (source.del) {
            return source.del.bind(source)
        }
        return null;
    }),
    append: asFunction(({source}) => {
        if (source.append) {
            return source.append.bind(source);
        }
        return null;
    }),
    exists: asFunction(({get, source}) => {
        if (source.exists || get) {
            return source.exists?.bind(source) || (async (key, config) => !!await get(key, config));
        }
        return null;
    }),
    readdir: asFunction(({source}) => {
        if (source.readdir) {
            return source.readdir.bind(source);
        }
        return null;
    }),
    readdir$: asFunction(({source}) => {
        if (source.readdir$) {
            return source.readdir$.bind(source);
        }
        if (source.readdir || source.list) {
            return readdir$.bind(null, source);
        }
        return null;
    }),
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
    }),
    list$: asFunction(({source}) => {
        if (source.list$) {
            return source.list$.bind(null);
        }
        if (source.list || source.readdir) {
            return list$.bind(null, source);
        }
        return null;
    }),
    readable: asFunction(({get}) => !!get),
    writable: asFunction(({put, append}) => !!put || !!append),
    appendable: asFunction(({append}) => !!append)
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