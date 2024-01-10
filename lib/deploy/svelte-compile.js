import {compile} from "svelte/compiler";
import {nanoid} from "nanoid";
import {camelCase} from "lodash-es";
import * as rx from "rxjs";

export function svelteCompile$(code, config = {}) {
    const {
        name = "Component" + camelCase(nanoid()),
        // declare the status$ observable to observe the state of the compiler
        // also communicates warnings and errors of the compilation.
        status$,
        generate = "dom",
        dev = false,
        filename = name + ".svelte",
        accessors = true,
        ...restConfig
    } = config;

    return rx.of(undefined)
        .pipe(
            rx.map(
                () => {
                    return compile(
                        code,
                        {
                            generate,
                            dev,
                            filename,
                            accessors,
                            ...restConfig
                        }
                    );
                }
            ),
            rx.tap(
                result => {
                    rx.from(result.warnings)
                        .pipe(
                            rx.map(
                                warning => ({
                                    message: warning.message,
                                    filename: warning.filename,
                                    start: warning.start,
                                    end: warning.end
                                })
                            )
                        )
                        .subscribe(warn => status$?.next(warn));

                }
            ),
            rx.map(result => {
                const css = result?.css?.code

                if (css) {
                    // TODO: do better.
                    result.js.code = `
                    ${result.js.code}
                        ;(() => {
if (typeof document !== "undefined") {
const styleSheet = document.createElement("style");
styleSheet.innerText = decodeURI(\`${encodeURI(css)}\`);
document.head.appendChild(styleSheet);
}
                        })();`;
                }

                return {code: result.js.code, map: result.js.map, css};
            })
        );
}