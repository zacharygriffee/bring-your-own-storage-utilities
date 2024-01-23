import {put$ as _put$} from "../../query/put.js";

export function put$({source, put}) {
    if (source.put$) {
        return source.put$.bind(source);
    }
    if (put) {
        return (key, buff, config) => _put$(source, key, buff, config);
    }
}