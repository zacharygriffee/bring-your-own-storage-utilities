
/**
 * @var {boolean} isReadable Whether a source is readable.
 * @memberOf Adapt.iSource
 */
function isReadable({source, get}) {
    if (typeof source.readable === "function") {
        return source.readable();
    }
    return source.readable || !!get;
}

export {isReadable};