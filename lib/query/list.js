import {firstValueFrom, of} from "rxjs";
import {toArray, concatMap} from "rxjs/operators"
import {readdir$} from "./readdir.js";
import {isString} from "../util/isString.js";

/**
 * Same as readdir$ but config.list = true
 * @see readdir$
 * @returns {*}
 * @memberof Query
 */
export function list$(source, config = {}) {
    if (isString(config)) config = {
        cwd: config
    };

    return readdir$(source, {...config, list: true});
}

/**
 * Convenience async method for list$
 * @memberof Query
 */
export async function list(source, config) {
    return firstValueFrom(
        list$(source, config)
            .pipe(
                concatMap(
                    o => Array.isArray(o) ? o : of(o)
                ),
                toArray()
            )
    );
}