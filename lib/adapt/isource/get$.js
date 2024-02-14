import {get$ as _get$} from "../../query/get.js";

/**
 * Get a value to from a readable source.
 * @param {string} key The absolute filepath to get from the source.
 * @param {object} config The configuration to pass to the Query.get$.
 * @memberOf Adapt.iSource
 * @returns Observable
 */
function get$({source, get}) {
    if (source.get$) {
        return source.get$.bind(source);
    }
    if (get) {
        return (key, config) => _get$(source, key, config);
    }
}

export {get$}