import codec from "codecs";
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
    return codec("json").decode(json);
}