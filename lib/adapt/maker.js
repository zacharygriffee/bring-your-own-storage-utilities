
export function maker(storageInterface = {}) {
    const {
        put,
        get,
        del,
        readdir,
        createReadStream,
        exists
    } = storageInterface;
}