import {template as _template} from "./template.js";
import mapValues from "lodash-es/mapValues.js";
import b4a from "b4a";
import hash from "object-hash";

/**
 * A templating similar to lodash-es/template but uses block-comment like deliminators
 * See tests for Deploy for examples, since jsdocs doesn't display it very well.
 * @param params The parameters to use in template processing.
 * @param config see options of {@link https://lodash.com/docs/4.17.15#template lodash/template}
 * @returns {{transform(*): *}|*}
 */
export function rollupTemplatePlugin(params, config = {}) {
    params = mapValues(params, v => typeof v === "function" ? v + "" : v)
    const compiled = {};

    return {
        transform(code) {
            return (compiled[hash.MD5({code, config})] ||= _template(code, config))(params);
        }
    }
}