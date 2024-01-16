import path from "../tiny-paths.js";
import {isString, isEmpty, map} from "../util/index.js";
import {from} from "rxjs";
import {map as rxMap, startWith, toArray} from "rxjs/operators";
import {traverse} from "../etc.js";
const _ = {
    map,
    isString,
    isEmpty
};

const rx = {
    from,
    map: rxMap,
    startWith,
    toArray,
    traverse
};

/**
 * @private
 */
export function traverseUpDirectory$(source, fromDownPath = "/", config = {}) {
    if (!_.isString(fromDownPath) && _.isEmpty(config)) {
        config = fromDownPath;
        fromDownPath = "/"
    }

    // TODO: add limit 'up'
    // TODO: Do tests to see whether this observable is closing correctly
    const {
        readdir$ = (source, folder) => rx.from(source.readdir(folder)),
        cwd
    } = config;

    let keepGoing = true;
    return rx.traverse({
        factory(marker = fromDownPath || cwd) {
            return rx.from(readdir$(source, marker))
                .pipe(
                    rx.toArray(),
                    rx.map(
                        nodes => {
                            const parent = path.dirname(marker) || "/";
                            try {
                                return ({
                                    markers: parent && marker !== "." && keepGoing ? [parent] : [],
                                    values: _.map(nodes, n => path.resolve(marker, n))
                                });
                            } finally {
                                keepGoing = !(parent === "/");
                            }
                        }
                    )
                )

        }
    }).pipe(
        rx.startWith("/")
    );
}