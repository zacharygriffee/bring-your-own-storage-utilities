export function exec({source}) {
    if (source.exec) {
        return (key, config = {}) => source.exec(key, config)
    }
}