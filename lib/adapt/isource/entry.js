import {getEntry} from "../../query/index.js";


/**
 * Get entry details of a path
 * @param {string} path path
 * @param {object} config The configuration to pass to the entry.
 * @memberOf Adapt.iSource
 * @returns Promise
 */
function entry({source}) {
    return (path, config) => getEntry(source, path, config);
}

export {entry};