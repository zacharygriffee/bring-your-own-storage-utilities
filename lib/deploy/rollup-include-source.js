import {isString} from "../util/index.js";
import {pack} from "./pack.js";
import {rollupVirtualPlugin} from "./rollup-virtual-plugin.js";
import {iSource} from "../adapt/index.js";
import {rollupFromJsdelivr} from "./rollup-from-jsdelivr.js";
import {rollupTerserBrowserPlugin} from "./rollup-terser-browser-plugin.js";


export async function rollupIncludeSource(sourceBook, plugins = []) {
    const entries = Object.entries(sourceBook);

    const sourcesWithFactory = entries.filter(([, source]) => isString(source.factory || source));

    let codes = {};
    for await (const [sourceName, source] of sourcesWithFactory) {
        let code = source.factory || source;
        ({code: codes[sourceName]} = await pack(
            sourceName,
            {
                plugins: [
                    rollupVirtualPlugin(
                        {
                            [sourceName]: code
                        }
                    ),
                    rollupTerserBrowserPlugin(),
                    ...plugins
                ]
            }
        ));
    }

    return {
        banner() {
            const code = ``;

        }
    }
}

const result = await rollupIncludeSource({
    "FunSource": iSource({
        factory: `
        import RAM from 'random-access-memory';
        export {RAM};
        `
    })
}, [
    rollupFromJsdelivr()
]);

debugger;