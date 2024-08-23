import {list$ as _list$} from "../../query/list.js";

/**
 * List details of the files of path
 *
 * Source needs a readdir function, or its own implementation of list
 *
 * @param {string} path Path to list
 * @param {object} config The configuration to be passed to the Query.list$.
 * @memberOf Adapt.iSource
 * @returns Observable<pathDetail> Each emit is a file, and its detail.
 */
function list$({source}) {
    if (source.list$) {
        return source.list$.bind(null);
    }
    if (source.list || source.readdir) {
        return _list$.bind(null, source);
    }
}

export {list$};