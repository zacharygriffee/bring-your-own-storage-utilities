import trimStart from "lodash-es/trimStart.js";
/**
 * Turns a path absolute, removing any prefixes and adding 'sep' as a prefix
 * @param path path to turn absolute
 * @param [sep="/"] a separator to use for prefixing.
 * @returns {string}
 */
export function coercePathAbsolute(path, sep = "/") {
    return (sep || "") + trimStart(path, sep);
}