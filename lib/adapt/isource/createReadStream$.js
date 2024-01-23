import {createReadStream$ as _createReadStream$} from "../../query/createReadStream.js";

export function createReadStream$(source) {
    if (source.createReadStream$) {
        return source.createReadStream$.bind(source);
    }
    if (source.createReadStream || source.get) {
        return _createReadStream$.bind(null, source);
    }
}