import b4a from "b4a";

export function jsonParse(json) {
    if (b4a.isBuffer(json)) json = b4a.toString(json);
    return JSON.parse(json);
}