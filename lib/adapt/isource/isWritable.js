export function isWritable({source, put}) {
    if (typeof source.writable === "function") {
        return source.writable();
    }
    return source.writable || !!put
}