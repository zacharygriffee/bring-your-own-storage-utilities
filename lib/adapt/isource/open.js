
/**
 * Some sources need to be opened before running. Adapt.iSource.ready waits for this to resolve.
 *
 * @memberOf Adapt.iSource
 * @returns Promise<void>
 */
function open({source}) {
    if (source.open) {
        return source.open.bind(source);
    }
    return () => Promise.resolve();
}

export {open};