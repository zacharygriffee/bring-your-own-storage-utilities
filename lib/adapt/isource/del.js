
/**
 * Delete a key of the source.
 * @param {string} key The key to delete of the source.
 * @memberOf Adapt.iSource
 * @returns Promise
 */
function del({source}) {
    if (source.del) {
        return (key) => source.del(key)
    }
}

export {del};