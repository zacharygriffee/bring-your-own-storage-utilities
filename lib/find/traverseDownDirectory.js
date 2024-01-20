import path from "../tiny-paths.js";

import {isString, map} from "../util/index.js";
import {from, defer} from "rxjs";
import {map as rxMap, startWith} from "rxjs/operators";
import {traverse} from "../etc.js";
import {readdir$} from "../query/index.js";
import {isFolder} from "../query/index.js";

const _ = {
    map,
    isString
};

const rx = {
    defer, from, map: rxMap , startWith, traverse
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
        isFolderSelector = (x) => !path.extname(x) && isFolder(source, x),
        cwd = "/"
    } = config;

    return rx.traverse(
        {
            factory(marker = cwd) {
                return readdir$(source, {cwd: marker, recursive: false})
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