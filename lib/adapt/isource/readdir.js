import {readdir as _readdir} from "../../query/readdir.js";

export function readdir(source) {
    if (source.readdir) {
        return (path, config = {}) => _readdir(source, {cwd: path, ...config});
    }
}