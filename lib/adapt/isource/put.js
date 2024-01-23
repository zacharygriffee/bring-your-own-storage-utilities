import {put as _put} from "../../query/put.js";

export function put(source) {
    if (source.put) {
        return (key, buffer, config) => _put(source, key, buffer, config);
    }
}