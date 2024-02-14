/**
 * Check whether file exists of source.
 * @param {string} key Key of file.
 * @memberOf Adapt.iSource
 * @returns Promise
 */
function exists({source, get}) {
    if (source.exists || get) {
        return source.exists?.bind(source) || (async (key, config) => !!await get(key, config));
    }
}

export {exists}