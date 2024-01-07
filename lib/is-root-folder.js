/**
 * Determines if folder is root.
 * @param [folder="/"]
 * @returns {boolean}
 */
export function isRootFolder(folder = "/") {
    return folder === "/" || folder === ""
}