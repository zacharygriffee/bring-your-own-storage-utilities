import {length as _length} from "../../query/index.js";

export function length(source) {
    if (source.length || source.length === 0) {
        return _length(source)
    }
}