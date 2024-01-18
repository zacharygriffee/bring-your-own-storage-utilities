import {
    operators
} from "../etc.js";

import {
    firstValueFrom, from, race, defer
} from "rxjs";

import {
    filter, map as rxMap, catchError, defaultIfEmpty, concatMap
} from "rxjs/operators";

import b4a from "b4a";
import codec from "codecs";
import {map} from "../util/map.js";

const {concatIfEmpty} = operators;
const rx = {
    from, defer, filter, map: rxMap, catchError, concatIfEmpty, defaultIfEmpty, concatMap, race
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
    const {
        method = "get",
        mustHaveDataToWin = method.toLowerCase() === "get",
        mustHaveSuccessCodeToWin = true, // mustHaveConditionToWin is SYNC
        mustHaveConditionToWin = () => true,
        successCodes = [200],
    } = config;


    return rx.race(...map(urlArray, attempt => {
        return rx.defer(() => fetch(attempt))
            .pipe(rx.filter(response => {
                if (!response.ok) {
                    return false;
                }
                if (mustHaveSuccessCodeToWin && !successCodes.includes(response.status)) {
                    return false;
                }
                if (!mustHaveConditionToWin(response)) {
                    return false;
                    // throw new Error();
                }
                return response;
            }), rx.concatMap(o => rx.from(o.text()).pipe(rx.map(buff => {
                console.log();
                o.data = buff;
                return o
            }))), rx.map(o => {
                const buff = b4a.from(o.data);
                let data;
                try {
                    data = codec("json").decode(buff);
                } catch (e) {
                    data = codec("utf8").decode(buff);
                }

                o.data = data;
                if (o.data.includes("Couldn't")) {
                    console.log(structuredClone(o), urlArray);
                    debugger;
                }
                return o;
            }), rx.concatIfEmpty(() => rx.NEVER), rx.catchError((e) => {
                return rx.NEVER
            }));
    }));
}

/**
 * Convenience async function for raceUrls$
 * @memberof Resolve
 */
export function raceUrls(urlArray, config = {}) {
    return firstValueFrom(raceUrls$(urlArray, config).pipe(rx.defaultIfEmpty([])))
}