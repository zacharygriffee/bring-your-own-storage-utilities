export {externalGlobals as rollupExternalGlobalsPlugin} from "@zacharygriffee/rollup-plugin-external-globals";

/**
 * @function rollupExternalGlobalsPlugin
 * @description
 * Replace imports with a variable that is in global scope.
 *
 * @see https://github.com/zacharygriffee/rollup-plugin-external-globals
 * @example
 *
 * {
 *     entry: "main.js",
 *     plugins: [
 *         rollupVirtual(
 *             {
 *                 "the-answer": `
 *   import theAnswer from "some-mysterious-place";
 *   globalThis.deepThought = 42;
 *   export default theAnswer;
 *   `
 *             }
 *         ),
 *         externalGlobals(
 *             {
 *                 // This replaces the import above with the global var deepThought
 *                 "some-mysterious-place": "deepThought"
 *             }
 *         )
 *     ]
 * }
 *
 * @param globals is a moduleId/variableName map.
 * @param [config]
 * @param [config.include]  is an array of glob patterns. If defined, only matched files would be transformed.
 * @param [config.exclude]is an array of glob patterns. Matched files would not be transformed.
 * @param [config.dynamicWrapper]  is used to specify dynamic imports.
 * @memberof Deploy
 *
 */
