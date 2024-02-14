import {readdir$ as _readdir$} from "../../query/readdir.js";

/**
 * Read directory of source
 *
 * Source needs a readdir function, async generator, stream, observable, iterable, async iterable.
 *
 * @param {string} path Directory to read files returning shallow file and directory names of that directory.
 * @param {object} config The configuration to be passed to the Query.put$.
 * @memberOf Adapt.iSource
 * @returns Observable
 */
function readdir$({source}) {
    if (source.readdir$) {
        return source.readdir$.bind(source);
    }
    if (source.readdir || source.list) {
        return _readdir$.bind(null, source);
    }
}

export {readdir$};
