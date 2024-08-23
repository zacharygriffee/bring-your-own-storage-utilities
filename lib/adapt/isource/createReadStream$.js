import {createReadStream$ as _createReadStream$} from "../../query/createReadStream.js";

/**
 * Create a read stream from a path of the source.
 * @param {string} path The path to the file to create a read stream from.
 * @param {object} config The configuration to pass to the Query.createReadStream$ function.
 * @memberOf Adapt.iSource
 * @returns Observable
 */
function createReadStream$({source}) {
    if (source.createReadStream$) {
        return source.createReadStream$.bind(source);
    }
    if (source.createReadStream || source.get) {
        return _createReadStream$.bind(null, source);
    }
}

export {createReadStream$};