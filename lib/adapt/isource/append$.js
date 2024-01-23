import {append$ as _append$} from "../../query/append.js";

export function append$({source}) {
    if (source.append) {
        return (buf, config) => _append$(source, buf, config);
    }
}