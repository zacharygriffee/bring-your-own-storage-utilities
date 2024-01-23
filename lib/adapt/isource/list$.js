import {list$ as _list$} from "../../query/list.js";

export function list$({source}) {
    if (source.list$) {
        return source.list$.bind(null);
    }
    if (source.list || source.readdir) {
        return _list$.bind(null, source);
    }
}