import {list as _list} from "../../query/list.js";

/**
 * List details of the files of path
 * @param {string} path Path to list
 * @param {object} config The configuration to be passed to the Query.list$.
 * @memberOf Adapt.iSource
 * @returns Promise<Array>
 */
function list({source, exists, get, entry}) {
    if (source.list || source.readdir) {
        return _list.bind(null, {
            exists,
            list: source.list?.bind(source),
            readdir: source.readdir?.bind(source),
            get,
            entry
        })
    }
}

export {list};