import {append} from "../../query/append.js";

export function append$(source) {
    if (source.append) {
        return (buf, config) => append(source, buf, config);
    }
}