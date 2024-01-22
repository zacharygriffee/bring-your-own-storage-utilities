import {nanoid} from "nanoid";
import camelCase from "lodash-es/camelCase.js";
import {firstValueFrom, from, of} from "rxjs";
import {switchMap, tap, map} from "rxjs/operators";

const rx = {firstValueFrom, from, map, of, switchMap, tap};

let compile;

/**
 * Set the rollup compiler. Call this before any svelte actions including Deploy.rollupSveltePluginNoServer. If you do not
 * call this, the `dist/svelte-compiler.min.js` of BYOSU will be downloaded and used.
 *
 * **You may only set compiler once**
 *
 * **Repeated calls will be ignored**
 *
 * You may also use the svelte/compiler module from the svelte repo see Deploy.svelteCompile for more information.
 *
 * @param {(module|string|function)} [svelteCompilerModule] If module is passed, no download will occur,
 * and will use module.compile to compile svelte files. If a function is passed,
 * will assume it is a svelte/compiler compile function. If a string is passed (browser only) will download the module
 * and use it. If nothing is passed Will download `dist/svelte-compiler.min.js` from BYOSU repo.
 * @returns {Promise<void>}
 * @memberOf Deploy
 */
export async function setSvelteCompiler(svelteCompilerModule) {
    if (compile) return;
    if (!svelteCompilerModule || typeof svelteCompilerModule === "string") {
        const module = await import(svelteCompilerModule || "https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@latest/dist/svelte/svelte-compiler.min.js/+esm");
        svelteCompilerModule = module.compile;
    }
    compile = svelteCompilerModule.compile || svelteCompilerModule;
}

/**
 * Convenience async function of svelteCompile$
 * @memberof Deploy
 */
export function svelteCompile(code, config = {}) {
    return rx.firstValueFrom(
        svelteCompile$(code, config)
    );
}

/**
 * Compile svelte code into javascript, css, and code map.
 *
 * @todo weigh the advantages between dom and ssr when working in p2p land. If using SSR than end user can use their
 *       own client side routing. Right now, the default config.generate is creating the dom.
 * @see https://svelte.dev/docs/svelte-compiler
 * @param code String svelte code.
 * @param config The configuration is passed into {@link https://svelte.dev/docs/svelte-compiler svelte compiler}
 * with variation to default behavior below.
 * @param [config.name] The name of the svelte component. By default, this will be randomly
 * generated with a prefix of Component.
 * @param [config.status$] Define this config with an InputObservable to receive status of the
 * compiling svelte including warnings from aria.
 * @param [config.generate=dom] How to generate.
 * @param [config.dev=false] Whether to compile in dev mode (see svelte.compiler docs)
 * @param [config.accessors=true] In svelte.compiler this is default false. To work between components from p2p land,
 * accessors=true made it easier for me.
 * @param [config.injectCss=true] Add an IIFE function right into the HTML that injects the CSS produced by this
 * compiler into the DOM. If you are running a long term app, with many different changes, you might want to declare
 * this false due to the  fact that, css is only appended to the doc, but never removed. So you may want to handle
 * this differently if that is your use-case.
 * @memberof Deploy
 *
 */
export function svelteCompile$(code, config = {}) {
    let {
        name = "Component" + camelCase(nanoid()),
        // declare the status$ observable to observe the state of the compiler
        // also communicates warnings and errors of the compilation.
        status$,
        generate = "dom",
        dev = false,
        filename = name + ".svelte",
        accessors = true,
        injectCss = true,
        ...restConfig
    } = config;

    return rx.from(setSvelteCompiler())
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
            rx.switchMap(async result => {
                const css = result?.css?.code

                if (injectCss && css) {

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