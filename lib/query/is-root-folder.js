/**
 * Determines if folder is root.
 * @param [folder="/"]
 * @returns {boolean}
 * @memberof Query
 */
export function isRootFolder(folder = "/") {
    return folder === "/" || folder === ""
}