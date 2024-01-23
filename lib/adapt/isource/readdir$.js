import {readdir$ as _readdir$} from "../../query/readdir.js";

export function readdir$({source}) {
    if (source.readdir$) {
        return source.readdir$.bind(source);
    }
    if (source.readdir || source.list) {
        return _readdir$.bind(null, source);
    }
}