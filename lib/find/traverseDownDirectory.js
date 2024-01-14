import * as _ from "lodash-es";
import * as rx from "rxjs";
import path from "../tiny-paths.js";
import * as etc from "../etc.js";

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

    return etc.traverse(
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