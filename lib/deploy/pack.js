import {defer, firstValueFrom, isObservable, of, from} from "rxjs";
import {map, switchMap, tap, toArray} from "rxjs/operators";
import {isString} from "../util/isString.js";
import {createDataUri} from "../resolve/createDataUri.js";
import {importCode} from "../resolve/importCode.js";
import path from "../tiny-paths.js";
import {couldntResolve} from "./rollup-couldnt-resolve-helper-plugin.js";

const rx = {defer, firstValueFrom, isObservable, map, of, switchMap, tap, toArray, from};

/**
 * Once rollup is acquired through setRollup function, this will be the module.
 * @memberOf Deploy
 */
export let ROLLUP;

/**
 * Set rollup module. Rollup has many different versions that may suit your needs better.
 *
 * **You may only set rollup module once**
 *
 * **Repeated calls will be ignored**
 *
 * <pre>
 *      Use case:                        NPM Specifier
 *      For the browser:                 @rollup/browser@3.29.4
 *      For the browser utilizing wasm:  @rollup/browser@latest
 *      For node:                        rollup
 * </pre>
 *
 * If you do not call this before using pack,` @rollup/browser@3.29.4` will be downloaded and used.
 * @param {(module|string)} rollup If string or nill, will be specifier to get rollup or `@rollup/browser@3.29.4`
 * @returns {Promise<void>}
 * @memberOf Deploy
 */
export async function setRollup(rollup) {
    if (ROLLUP) return;
    if (!rollup || typeof rollup === "string") {
        if (typeof window !== "undefined" || typeof WorkerGlobalScope !== 'undefined') {
            rollup = await import(
                (rollup || "https://cdn.jsdelivr.net/npm/@rollup/browser@3.29.4/+esm")
                );
        } else {
            rollup = await import((rollup || "rollup"));
        }
    }
    ROLLUP = rollup;
}

/**
 * Bundle rollup$. I add the deploy.couldntResolve plugin
 * for ease of development to determine what ids don't work. This maybe important to keep for peer to peer
 * development when sources may not be always available.
 *
 * It uses rxjs to emit.
 *
 * @see https://rollupjs.org/javascript-api/
 * @param entry the rollup config.input field. Multiple entry points not supported by byosu functions, so simply a string where to begin bundling.
 * @param config https://rollupjs.org/javascript-api/
 * @memberof Deploy
 */
export function rollup$(entry, config = {}) {
    const {
        plugins = [],
        outputs,
        ...rollupConfig
    } = config;

    plugins.push(
        couldntResolve((result) => {
            console.error("Couldn't resolve id", result, entry, config);
        })
    );

    let startRx;
    if (!ROLLUP) {
        startRx = rx.from(
            setRollup()
        ).pipe(rx.map(() => ROLLUP.rollup))
    } else {
        startRx = of(ROLLUP.rollup);
    }

    return rx.defer(() => {
        return startRx.pipe(
            rx.switchMap(
                rollup => rollup({
                    input: entry,
                    plugins,
                    ...rollupConfig
                })
            )
        )
    })
}

/**
 * After the 'rollup$' generate is next. Pipe what the rollup$ does to the generate$
 *
 * e.g. rollup$.pipe(rx.switchMap((bundle) => generate$(bundle)));
 *
 * @todo support source maps
 *
 * These rollup.option configurations **are not optional** for this to work with byosu and you won't be able to change
 * them here. If you absolutely need to, deploy exports vanilla rollup if you want to get it to work.
 *
 * - inlineDynamicImports = true    // byosu doesn't support code splitting yet, so keep this true
 * - format = esm                   // this is a must for byosu . You should just stop with cjs, just saying.
 * - exports = "named"
 *
 * @param outputName What name to output the bundle to.
 * @param bundle$ Bundle from any rollup versions including deploy.rollup$. This can be either an observable, or just the bundle.
 * @param outputConfig Output configuration https://rollupjs.org/javascript-api/
 * @memberof Deploy
 */
export function generate$(outputName, bundle$, outputConfig = {}) {
    if (!rx.isObservable(bundle$)) bundle$ = rx.of(bundle$);

    return bundle$.pipe(
        rx.switchMap(
            bundle =>
                bundle.generate({
                    name: outputName,
                    sourcemap: false,
                    inlineDynamicImports: true,
                    ...outputConfig,
                    format: "esm",
                    exports: "named"
                })
        )
    );
}

/**
 * This is a wrapper and convenience for the rollup$ and generate$ function.
 * @param entryName The entry point to begin bundling. Multiple entry points not supported and not planned to be supported.
 * @param [outputName] Choose the output name, default is [entryName]-bundle.js
 * @param [config] The {@link https://rollupjs.org/javascript-api/ configuration for rollup}, in addition to the following.
 * @param [config.autoImport=false] Will auto import the module into 'module' field. Make sure you trust the modules and
 * source of modules as this can create similar security issues as `eval`. As well, turning this to true will make the result
 * object not serializable.
 * @param [config.createUri=true] Will automatically create {@link createDataUri data-uri} of the bundle for you to share or
 * pack up to an importmap or just execute it by const yourBundledModule = await import(bundleResult.uri). If your bundling
 * something very large, you should probably turn this off, as this could be very taxing to memory and space.
 * @param [config.libraryName] This is really metadata for end-user to add to the bundle result. This helped me to index in
 * some situations.
 * @memberof Deploy
 */
export function pack$(entryName, outputName, config = {}) {
    if (!!outputName && !isString(outputName)) {
        config = outputName;
        outputName = config?.output?.name ?? path.basename(entryName).split(".")[0] + ".bundle" + path.extname(entryName);
    }

    let {
        autoImport = false,
        createUri = true,
        libraryName,
        ...rollupConfig
    } = config;

    return rollup$(
        entryName, rollupConfig
    ).pipe(
        rx.switchMap(
            bundle => generate$(outputName, bundle, config.output)
        ),
        rx.map(
            ({output: [first, ...others]}) => others.length > 0 ? [first, ...others] : first
        ),
        rx.tap(
            chunk => {
                if (!chunk.length || chunk.length === 1) {
                    if (createUri) {
                        chunk.uri = createDataUri(chunk.code);
                    }
                } else {
                    autoImport = false;
                }
            }
        ),
        ...autoImport ? [
            rx.switchMap(
                (chunk) => rx.defer(() => importCode(chunk.code)).pipe(
                    rx.map(
                        module => ({...chunk, ...{module}})
                    )
                )
            )
        ] : [],
        ... libraryName ? [rx.tap(o => o.libraryName = libraryName)] : []
    )
}

/**
 * Convenience async method for pack$
 * @memberof Deploy
 */
export async function pack(entryName, outputName, config = {}) {
    return rx.firstValueFrom(
        pack$(...arguments)
    );
}

