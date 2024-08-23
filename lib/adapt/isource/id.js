
/**
 * @var {boolean} id The id of source.
 * @memberOf Adapt.iSource
 */
function id({source}) {
    if (source.id) {
        return source.id;
    }
    return null;
}

export {id};