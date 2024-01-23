export function del(source) {
    if (source.del) {
        return (key) => source.del(key)
    }
}