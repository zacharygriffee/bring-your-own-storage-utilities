/**
 * Built in to deploy.pack but it tells you what id doesn't resolve in the case of error.
 * This is especially helpful when building in browser.
 * @example
 * couldntResolve((result) => {
 *     console.error("Couldn't resolve id", result.id, result.from, result);
 * })
 * @param cb You handle how to display or communicate the id that doesn't resolve.
 */
export function couldntResolve(cb) {
    return {
        resolveId(id, from, config) {
            cb({id, from, ...config});
        }
    }
}