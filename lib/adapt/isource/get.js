import {get as _get} from "../../query/get.js";

/**
 * Get a value to from a readable source.
 * @param {string} key The absolute filepath to get from the source.
 * @param {object} config The configuration to pass to the Query.get.
 * @memberOf Adapt.iSource
 * @returns Promise
 */
function get({source, open}) {
    if (source.get) {
        return async (key, config) => {
            if (open) {
                await open(key, config);
            }
            return _get(source, key, config);
        };
    }
    return null;
}

export {get}