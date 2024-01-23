import {list as _list} from "../../query/list.js";

export function list({source, exists, get, entry}) {
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