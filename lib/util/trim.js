import {trimStart} from "./trimStart.js";
import {trimEnd} from "./trimEnd.js";

export function trim(string, characters) {
    return trimEnd(trimStart(string, characters), characters);
}