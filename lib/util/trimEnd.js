import {trimStart} from "./trimStart.js";

export function trimEnd(string, characters) {
    const revStr = (Array.isArray(string) ? string : string.split("")).reverse();
    return trimStart(revStr, characters, false).reverse().join("");
}

