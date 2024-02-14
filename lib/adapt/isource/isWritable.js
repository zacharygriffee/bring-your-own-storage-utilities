
/**
 * @var isWritable {boolean} Whether a source is writable.
 * @memberOf Adapt.iSource
 */
function isWritable({source, put}) {
    if (typeof source.writable === "function") {
        return source.writable();
    }
    return source.writable || !!put
}

export {isWritable};