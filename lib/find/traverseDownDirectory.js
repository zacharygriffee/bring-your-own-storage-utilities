import path from "../tiny-paths.js";

import {isString, map} from "../util/index.js";
import {from} from "rxjs";
import {map as rxMap, startWith} from "rxjs/operators";
import {traverse} from "../etc.js";

const _ = {
    map,
    isString
};

const rx = {
    from, map: rxMap , startWith, traverse
}

// TODO: Do tests to see whether this observable is closing correctly
/**
 * @private
 */
export function traverseDownDirectory$(source, config = {}) {
    if (_.isString(config)) {
        config = {cwd: config};
    }

    const {
        isFolderSelector = (x) => !path.extname(x),
        readdir$ = (source, folder) => rx.from(source.readdir(folder)),
        cwd = "/"
    } = config;

    return rx.traverse(
        {
            factory(marker = cwd) {
                return rx.from(readdir$(source, marker))
                    .pipe(
                        rx.map(
                            node => {
                                const isFolder = isFolderSelector(node);
                                const p = path.resolve(marker, node);

                                return ({
                                    markers: isFolder ? [p] : [],
                                    values: [p]
                                });
                            }
                        )
                    )
            }
        }
    ).pipe(
        rx.startWith(
            cwd
        )
    )
}