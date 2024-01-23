import {getEntry} from "../../query/index.js";

export function entry(source) {
    return (path, config) => getEntry(source, path, config);
}