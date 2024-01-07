import b4a from "b4a";

/**
 * Create a data uri from source. Default behavior is to create from javascript file
 *
 * @param content data
 * @param config
 * @param [config.mimeType="text/javascript"] the data type.
 * @param [config.encodingString="base64"] encoding
 * @param [config.charset="utf-8"] the charset
 * @returns {string}
 */
export function createDataUri(content, config = {}) {
    const {
        mimetype = "text/javascript",
        encodingString = "base64",
        charset = "utf-8"
    } = config;

    return `data:${mimetype};charset=${charset};${encodingString},${b4a.toString(b4a.from(content), encodingString)}`;
}