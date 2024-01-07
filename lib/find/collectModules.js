import * as rx from "rxjs";
import * as _ from "lodash-es";
import path from "tiny-paths";
import b4a from "b4a";
import {findNodeModule} from "./findNodeModule.js";
import {resolveExports} from "./resolvePackageExportsImports.js";
import {parseModuleSpecifier} from "./parseModuleSpecifier.js";

/**
 * Convenience async method for collectModules$
 */
export function collectModules(source, list, config = {}) {
    return rx.firstValueFrom(collectModules$(source, list, config));
}

/**
 * Finds module specifiers in list through node_modules in parent directories. Returns an object that contains the
 * main entry files (utf8 raw code) of the specified module where the key of this object is mapped by config.nameFormatHandler
 * @todo Handle different file encodings.
 * @see findUpMultiple$ and findNodeModule for additional configuration.
 * @param source a storage source with a (async or sync) get function
 * @param list an array of {@link parseModuleSpecifier module specifiers}
 * @param config
 * @param [config.exportConditions=["browser", "default", "main"]] {@link https://nodejs.org/api/packages.html#conditional-exports Read about conditional exports of package.json}
 * @param [config.nameFormatHandler=x => camelCase(x)] To mutate the name of the package to something else in the returned object.
 * @param [config.cwd] The working directory
 * @returns The entry points of each module of list.
 */
export function collectModules$(source, list, config = {}) {
    const {
            exportConditions = ["browser", "default", "main"],
            nameFormatHandler = (x) => _.camelCase(x),
            cwd
        } = config
    ;
    return rx.from(
        findNodeModule(source, list, config)
    ).pipe(
        rx.switchMap(
            paths => {
                return rx.concat(
                    paths
                ).pipe(
                    rx.concatMap(
                        (_path, i) => rx.from(source.get(_path + "/package.json"))
                            .pipe(
                                rx.map(
                                    (o) => {
                                        const pkg = JSON.parse(o);
                                        let file;

                                        try {
                                            if (pkg.exports) {
                                                [file] = resolveExports(
                                                    pkg.exports,
                                                    _.trimStart(parseModuleSpecifier(list[i]).pathName, "./"),
                                                    exportConditions
                                                )
                                            }
                                        } catch (e) {
                                        }

                                        if (!file) {
                                            file = pkg[_.find(exportConditions, s => pkg[s])];
                                        }

                                        return [nameFormatHandler(list[i]), path.resolve(_path, file)];
                                    }
                                ),
                                rx.concatMap(
                                    ([name, fileName]) =>
                                        rx.from(
                                            source.get(fileName)
                                        )
                                            .pipe(
                                                rx.map(
                                                    o => b4a.toString(o, "utf8")
                                                ),
                                                rx.map(
                                                    code => ({name, code})
                                                )
                                            )
                                )
                            )
                    ),
                    rx.reduce(
                        (acc, subject) => {
                            acc[subject.name] = subject.code;
                            return acc;
                        },
                        {}
                    )
                )
            }
        )
    )
}