import { includes, values } from "../util/index.js";
import { nodeLikeResolver } from "../resolve/nodeLike.js";
import codec from "codecs";
import b4a from "b4a";
import path from "path";

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
 * @param {function} [config.outputNameHandler] Handle with the arguments (chunkId, chunk) the output names
 * of each chunk of the result.
 * @memberof Deploy
 */
export function rollupFromSourcePlugin(source, config = {}) {
    let {
        jsCode = entry => (b4a.isBuffer(entry) ? codec("utf8").decode(entry) : entry),
        // Get input module files from this source
        asInput = true,
        // Save output files to the source
        asOutput = !!source.put,
        codeOnly = false,
        excludes = [],
        outputNameHandler = (id, chunk) => id
    } = config;

    if (asOutput && !source.put) {
        throw new Error("deploy.rollupPlugin: Source does not have a way to put files.");
    }

    return {
        ...(asInput
            ? {
                async resolveId(id, from) {
                    if (id?.trimStart().startsWith("\0")) {
                        return;
                    }
                    if (id.includes("/npm/") || includes(excludes, id)) return;

                    // Resolve the module ID using the source resolver
                    const resolveConfig = { ...config, detailed: true };
                    const { success, id: resolvedId } = await nodeLikeResolver(source, id, from, resolveConfig);

                    if (success) {
                        // Convert the resolved ID to a path relative to the source's root (/)
                        const sourceRelativePath = path.posix.resolve('/', resolvedId);
                        return sourceRelativePath;
                    }
                },
                async load(id) {
                    if (id?.trimStart().startsWith("\0")) return;
                    if (includes(excludes, id)) return;

                    // Ensure id is a path relative to the source's root (/)
                    const sourceRelativePath = path.posix.relative('/', id);
                    return jsCode(await source.get(`/${sourceRelativePath}`));
                }
            }
            : {}),
        ...(asOutput
            ? {
                generateBundle: (options, bundleInfo) =>
                    generateBundle.bind(this)(source, bundleInfo, options, { outputNameHandler })
            }
            : {})
    };
}

async function generateBundle(source, bundleInfo, rollupOutputOptions = {}, otherOpts = {}) {
    const { name } = rollupOutputOptions;
    const { outputNameHandler } = otherOpts;

    const chunks = values(bundleInfo);
    for await (const chunk of chunks) {
        const bundledFrom = chunk.facadeModuleId;
        let id = outputNameHandler(chunk.isEntry ? name : chunk.fileName, chunk);

        await source.put(
            id,
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