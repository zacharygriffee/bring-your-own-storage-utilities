import {put$ as _put$} from "../../query/put.js";

/**
 * Put a file into the source
 * @param {string} path Where to put file.
 * @param {buffer} buff file buffer
 * @param {object} config The configuration to be passed to the Query.put$.
 * @memberOf Adapt.iSource
 * @returns Observable
 */
function put$({source, put}) {
    if (source.put$) {
        return source.put$.bind(source);
    }
    if (put) {
        return (key, buff, config) => _put$(source, key, buff, config);
    }
}

export {put$};