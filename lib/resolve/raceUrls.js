import {
    operators
} from "../etc.js";

import {
    firstValueFrom, from, race, defer, EMPTY, of, merge
} from "rxjs";

import {
    filter, map as rxMap, catchError, defaultIfEmpty, mergeMap, tap, take, timeout, switchMap
} from "rxjs/operators";

import b4a from "b4a";
import codec from "codecs";
import {map} from "../util/map.js";

const {concatIfEmpty} = operators;
const rx = {
    from, defer, filter, map: rxMap, catchError, concatIfEmpty, defaultIfEmpty, tap, mergeMap, race, EMPTY, of, take, merge, timeout, switchMap
};

/**
 * Races urls and downloads the winner.
 * This can be used with one singular url.
 *
 * @todo Use 'header' http method if 'mustHaveDataToWin' is true instead of downloading each url.
 * @todo Add timeout configuration and status updates.
 * @todo swap to fetch instead of XMLHttpRequest
 *
 * @param urlArray an array of url paths.
 * @param config
 * @param [config.mustHaveDataToWin=true] Not Implemented yet. ~~Must have something in the 'data' key of the response object.~~
 * @param [config.mustHaveConditionToWin] Checks the download with the condition to determine whether it wins over other links.
 * @param [config.successCodes] The success codes that url must have to qualify to win.
 * @memberof Resolve
 */
export function raceUrls$(urlArray, config = {}) {
    let {
        method = "get",
        mustHaveDataToWin = method.toLowerCase() === "get",
        mustHaveSuccessCodeToWin = true, // mustHaveConditionToWin is SYNC
        mustHaveConditionToWin = () => true,
        successCodes = [200],
        timeout = 10000,
        ...restOptions
    } = config;

    method = method.toUpperCase();
    return rx.merge(
        urlArray
    ).pipe(
        rx.mergeMap(
            url => fetch(url, {...restOptions, method})
        ),
        rx.timeout(timeout),
        rx.filter(
            response => response.ok && successCodes.includes(response.status)
        ),
        rx.take(1),
        rx.switchMap(
            response => {
                if (method === "HEAD") return rx.of(response.headers);
                return rx.from(
                    response.text()
                ).pipe(
                    rx.map(
                        body => {
                            const buff = b4a.from(body);
                            try {
                                response.data = codec("json").decode(buff);
                            } catch (e) {
                                response.data = codec("utf8").decode(buff);
                            }
                            return response;
                        }
                    )
                )
            }
        ),
        rx.catchError((e) => rx.EMPTY)
    )
}

/**
 * Convenience async function for raceUrls$
 * @memberof Resolve
 */
export function raceUrls(urlArray, config = {}) {
    return firstValueFrom(raceUrls$(urlArray, config).pipe(rx.defaultIfEmpty([])))
}