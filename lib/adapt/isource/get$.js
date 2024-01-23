import {get$ as _get$} from "../../query/get.js";

export function get$(source, get) {
    if (source.get$) {
        return source.get$.bind(source);
    }
    if (get) {
        return (key, config) => _get$(source, key, config);
    }
}