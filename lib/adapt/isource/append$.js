import {append$ as _append$} from "../../query/append.js";

/**
 * Append a value to an appendable source.
 * @param {buffer} buf The buffer to append to the source.
 * @param {object} config The configuration to pass to the Query.append$.
 * @kind function
 * @memberOf Adapt.iSource
 * @returns Observable
 */
function append$({source}) {
    if (source.append) {
        return (buf, config) => _append$(source, buf, config);
    }
}

export {append$};