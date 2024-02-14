
/**
 * @var isAppendable {boolean} Whether a source can be appended to.
 * @memberOf Adapt.iSource
 */
function isAppendable({source, append}) {
    if (typeof source.appendable === "function") {
        return source.appendable();
    }
    return source.appendable || !!append
}

export {isAppendable};