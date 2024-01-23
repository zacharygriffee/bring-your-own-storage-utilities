import {get as _get} from "../../query/get.js";

export function get(source, open) {
    if (source.get) {
        return async (key, config) => {
            if (open) {
                await open(key, config);
            }
            return get(source, key, config);
        };
    }
    return null;
}