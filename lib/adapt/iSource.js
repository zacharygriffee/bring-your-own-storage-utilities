import {asFunction, asValue, createContainer} from "../awilix.js";
import setPrefrontForInstall, {handleInstall} from "./isource/handleInstall.js";
import setSourceForRandomAccess, {enableRandomAccess, handleRandomAccess} from "./isource/handleRandomAccess.js";
import {isReadable} from "./isource/isReadable.js";
import {isWritable} from "./isource/isWritable.js";
import {isAppendable} from "./isource/isAppendable.js";
import {list$} from "./isource/list$.js";
import {list} from "./isource/list.js";
import {readdir$} from "./isource/readdir$.js";
import {readdir} from "./isource/readdir.js";
import {exists} from "./isource/exists.js";
import {ready} from "./isource/ready.js";
import {length} from "./isource/length.js";
import {append$} from "./isource/append$.js";
import {append} from "./isource/append.js";
import {del} from "./isource/del.js";
import {put$} from "./isource/put$.js";
import {put} from "./isource/put.js";
import {createReadStream$} from "./isource/createReadStream$.js";
import {createReadStream} from "./isource/createReadStream.js";
import {entry} from "./isource/entry.js";
import {get$} from "./isource/get$.js";
import {get} from "./isource/get.js";
import {open} from "./isource/open.js";
import {id} from "./isource/id.js";
import {factory} from "./isource/factory.js";

export {setPack, importPack} from "./isource/importPack.js";
export {enableRandomAccess};

const sourceContainer = createContainer();
setSourceForRandomAccess(sourceContainer);
setPrefrontForInstall(preFront);

sourceContainer.register({
    extensions: asFunction(() => (cont) => cont).scoped(),
    RandomAccessStorageClass: asValue(null),
    randomAccess: asFunction(handleRandomAccess).scoped(),
    install: asFunction(handleInstall).scoped(),
    factory: asFunction(factory).transient(),
    id: asFunction(id).scoped(),
    open: asFunction(open).scoped(),
    get: asFunction(get).scoped(),
    get$: asFunction(get$).scoped(),
    entry: asFunction(entry).scoped(),
    createReadStream: asFunction(createReadStream).scoped(),
    createReadStream$: asFunction(createReadStream$).scoped(),
    put: asFunction(put).scoped(),
    put$: asFunction(put$).scoped(),
    del: asFunction(del).scoped(),
    append$: asFunction(append$).scoped(),
    append: asFunction(append).scoped(),
    length: asFunction(length).transient(),
    ready: asFunction(ready).scoped(),
    exists: asFunction(exists).scoped(),
    readdir: asFunction(readdir).scoped(),
    readdir$: asFunction(readdir$).scoped(),
    list: asFunction(list).scoped(),
    list$: asFunction(list$).scoped(),
    readable: asFunction(isReadable).scoped(),
    writable: asFunction(isWritable).scoped(),
    appendable: asFunction(isAppendable).scoped()
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
 *                          // Your source should have an entry or get function to work
 *     del,                 // Del key at source.
 *     exists,              // Whether the key of source exists
 *                          // Your source should have an exists, entry, or get function for exists to work.
 *     ready,               // Whether the source is ready to operate.
 *     readdir,             // Get an array of entries of the cwd of source
 *     list,                // Get an array of 'entry' details of the cwd of source
 *                          // Your source should have a readdir function/generator/observable
 *     createReadStream,    // Get a stream of data from a key of source.
 *                          // Your source should have either a get or a native createReadStream(fileName, config)
 *
 *     factory              // A function that returns a `string module` that defines how to
 *                          // install this storage source to make the source portable.
 *     randomAccess         // Create a random access storage interface of the iSource.
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

