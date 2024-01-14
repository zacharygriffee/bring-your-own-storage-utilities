import * as _ from "lodash-es";
import * as rx from "rxjs";
import * as etc from "../etc.js";
import path from "../tiny-paths.js";

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
    return etc.traverse({
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