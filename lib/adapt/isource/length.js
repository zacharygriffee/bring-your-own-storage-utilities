import {length as _length} from "../../query/index.js";

/**
 * @var length {number}
 * @description Some sources have a length property, something like how many files are in the source.
 * @memberOf Adapt.iSource
 */
function length({source}) {
    if (source.length || source.length === 0) {
        return _length(source)
    }
}

export {length};