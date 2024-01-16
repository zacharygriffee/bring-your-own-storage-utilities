import {firstValueFrom} from "rxjs";
import {toArray} from "rxjs/operators"
import {readdir$} from "./readdir.js";
import {isString} from "../util/isString.js";

/**
 * Same as readdir$ but config.list = true
 * @see readdir$
 * @returns {*}
 */
export function list$(source, config = {}) {
    if (isString(config)) config = {
        cwd: config
    };

    return readdir$(source, {...config, list: true});
}

/**
 * Convenience async method for list$
 */
export async function list(source, config) {
    return firstValueFrom(
        list$(source, config)
            .pipe(
                toArray()
            )
    );
}