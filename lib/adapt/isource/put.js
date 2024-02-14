import {put as _put} from "../../query/put.js";

/**
 * Put a file into the source
 * @param {string} path Where to put file.
 * @param {buffer} buffer file buffer
 * @param {object} config The configuration to be passed to the Query.put$.
 * @memberOf Adapt.iSource
 * @returns Promise
 */
function put({source}) {
    if (source.put) {
        return (key, buffer, config) => _put(source, key, buffer, config);
    }
}

export {put};