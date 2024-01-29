import _template from "lodash-es/template.js";

const templateDeliminators = {
    escape: /\/\*\-([\s\S]+?)\*\//g,
    evaluate: /\/\*\{([\s\S]+?)\}\*\//g,
    interpolate: /\/\*\=([\s\S]+?)\*\//g,
};

/**
 * A templating similar to lodash-es/template but uses block-comment like deliminators
 * See tests for Deploy for examples, since jsdocs doesn't display it very well.
 * @param code The code to process template
 * @param config see options of {@link https://lodash.com/docs/4.17.15#template lodash/template}
 * @returns {{transform(*): *}|*}
 */
export function template(code, config = {}) {
    const {
        imports,
        sourceURL
    } = config;

    const settings = {
        imports,
        sourceURL,
        ...templateDeliminators
    };

    return _template(code, settings);
}