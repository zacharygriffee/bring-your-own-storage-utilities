export function isReadable({source, get}) {
    if (typeof source.readable === "function") {
        return source.readable();
    }
    return source.readable || !!get;
}