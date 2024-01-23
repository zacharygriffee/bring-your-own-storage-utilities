export function isAppendable({source, append}) {
    if (typeof source.appendable === "function") {
        return source.appendable();
    }
    return source.appendable || !!append
}