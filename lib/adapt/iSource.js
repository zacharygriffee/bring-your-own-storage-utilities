import * as Awilix from "../awilix.js";
import {createContainer, install as installSimplifiedAwilix} from "simplified-awilix";
import setSourceForRandomAccess, {handleRandomAccess} from "./isource/handleRandomAccess.js";
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
import {isExecutable} from "./isource/isExecutable.js";
import {execute} from "./isource/execute.js";
import {isInstallable} from "./isource/isInstallable.js";
import {install} from "./isource/install.js";
export {setPack, importPack} from "./isource/importPack.js";

await installSimplifiedAwilix({
    awilix: { get() { return Awilix;} }
});

const sourceContainer = createContainer();
setSourceForRandomAccess(sourceContainer);

sourceContainer
    .registerTransient({
        RandomAccessStorageClass: null,
        length,
        id,
        isReadable, readable: isReadable,
        isWritable, writable: isWritable,
        isAppendable, appendable: isAppendable,
        isExecutable, executable: isExecutable,
        isInstallable, installable: isInstallable
    })
    .registerScoped({
        // Queries
        //                  Promises             RxJS
                            readdir,             readdir$,
                            entry,
                            list,                list$,
                            ready,
                            open,
                            get,                 get$,

                            exists,
                            createReadStream,    createReadStream$,
                            put,                 put$,
                            del,

                            append,              append$,

                            execute,
                            exec: execute,

                            install,
        // Misc
        // Coming soon.
        extensions: () => (cont) => cont,
        // Make a random access storage out of the source.
        randomAccess: handleRandomAccess
    });

function preFront(source, state = {}) {
    return sourceContainer
        .createScope()
        .registerTransient({
            source,
            state
        })
}

/**
 * @interface iSource
 * @description
 * Utilize this source interface to make it easier and safer for this library to handle your
 * source. Any area where library function accepts a 'source', pass a wrapped source for best
 * results.
 *
 * @example
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
 * @namespace Adapt.iSource
 * @memberOf Adapt
 */
function iSource(source, state = {}) {
    return preFront(source, state).cradle;
}

export {iSource}