export function exists(source, get) {
    if (source.exists || get) {
        return source.exists?.bind(source) || (async (key, config) => !!await get(key, config));
    }
}