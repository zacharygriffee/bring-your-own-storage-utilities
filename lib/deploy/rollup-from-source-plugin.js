import {includes, values} from "../util/index.js";
import {nodeLikeResolver} from "../resolve/nodeLike.js";
import codec from "codecs";
import b4a from "b4a";

/**
 * Rollup scripts from a drive source that has `get` and `readdir` function.
 *
 * Does not currently support code splitting which is something I am very adamant to support.
 *
 * if config.asOutput=true and the source supports metadata e.g. source.put(key, value, { metadata })
 * result information of the bundle will be added there.
 *
 * @todo support code splitting
 * @param source A source that has at least a `get` function
 * @param config
 * @param [config.asInput=true] Whether this source serves as an input of scripts.
 * @param [config.asOutput=!!source.put] Whether this source serves as an output of the bundle. Currently, only supports
 * sources with a put function. Will automatically detect whether the source has put function. This will detect the
 * output name from the rollup.output configuration.
 * @param [config.excludes] Exclude ids / specifiers from being imported from this source.
 * @param [config.jsCode] Mapper to handle post processing of code before being sent to the output source.
 * @memberof Deploy
 */
export function rollupFromSourcePlugin(source, config = {}) {
    let {
        jsCode = entry => b4a.isBuffer(entry) ? codec("utf8").decode(entry) : entry,
        // Get input module files from this source
        asInput = true,
        // Save output files to the source
        asOutput = !!source.put,
        codeOnly = false,
        excludes = []
    } = config;

    if (!source.put) {
        throw new Error("deploy.rollupPlugin: Source does not have a way to put files.");
    }

    return {
        ...(
            asInput ? {
                async resolveId(id, from) {
                    // todo: better check for cdn.
                    if (id.includes("/npm/") || includes(excludes, id)) return;
                    const {success, id: refinedId} = await nodeLikeResolver(source, id, from, {...config, detailed: true});

                    if (success) {
                        return refinedId
                    }
                },
                async load(id) {
                    if (id.indexOf("\0") > -1) return;
                    if (includes(excludes, id)) return;
                    return jsCode(await source.get(id));
                }
            } : {}
        ),
        ...(
            asOutput ?
                {
                    generateBundle: (options, bundleInfo) => generateBundle.bind(this)(source, bundleInfo, options, {codeOnly})
                }
                :
                {}
        )
    }
}

async function generateBundle(source, bundleInfo, rollupOutputOptions = {}, otherOpts = {}) {
    const {
        name
    } = rollupOutputOptions;

    const chunks = values(bundleInfo);
     for await (const chunk of chunks) {
        const bundledFrom = chunk.facadeModuleId;
        let id = chunk.isEntry ? name : chunk.fileName;

        await source.put(id,
            codec("utf8").encode(chunk.code),
            {
                metadata: {
                    id,
                    bundledFrom,
                    ...chunk
                }
            }
        );
    }
}