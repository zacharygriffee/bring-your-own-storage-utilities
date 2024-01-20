import {defer, firstValueFrom} from "rxjs";
import {defaultIfEmpty} from "rxjs/operators";

/**
 * To check if a resource is ready. This function first checks to see if resource has a 'ready' function
 * and resolve that way, if not, Promise.resolve will be used.
 *
 * @example
 * // We'll be ready in just a second. :)
 * await ready({
 *     ready() {
 *         return new Promise(resolve => {
 *             setTimeout(resolve, 1000)
 *         })
 *     }
 * });
 *
 * @param source
 * @param {(function|object)} [config] The only config is readier, so you could pass a function here as config.readier
 * @param {function} [config.readier] A hook to define how the source becomes ready. Return a null promise.
 * @returns {Observable<ObservedValueOf<Promise<unknown>>>}
 * @memberOf Query
 */
export function ready$(source, config = {}) {
    if (typeof config === "function") config = {readier: config};
    const {
        readier = (source) => {
            return source?.ready?.() || Promise.resolve()
        }
    } = config;
    return defer(() => Promise.resolve(readier(source)));
}

/**
 * Convenience async function for ready$
 * @memberOf Query
 */
export function ready(source, config = {}) {
    return firstValueFrom(
        ready$(source, config).pipe(
            defaultIfEmpty(null)
        )
    )
}