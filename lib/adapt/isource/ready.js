import {ready as _ready} from "../../query/index.js";

export function ready({source}) {
    return (config) => _ready(source, config);
}