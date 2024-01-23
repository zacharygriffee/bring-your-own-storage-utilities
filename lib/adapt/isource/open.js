export function open({source}) {
    if (source.open) {
        return source.open.bind(source);
    }
    return () => Promise.resolve();
}