import {ready as _ready} from "../../query/index.js";

/**
 * @var ready {Promise} A promise that resolves when source is ready. This also waits for iSource.open if available.
 * @memberOf Adapt.iSource
 */
function ready({source}) {
    return (config) => _ready(source, config);
}

export {ready};