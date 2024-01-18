import b4a from "b4a";

/**
 * Parses a string or buffer to JSON.
 *
 * Node JSON.parse handles this properly, but some browsers do not, so this method makes sure that it does.
 *
 * @param {Buffer | String} json
 * @returns {object} THe parsed json.
 * @memberof Resolve
 */
export function jsonParse(json) {
    if (b4a.isBuffer(json)) json = b4a.toString(json);
    return JSON.parse(json);
}