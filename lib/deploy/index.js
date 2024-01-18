/**
 * @namespace Deploy
 */

export * from "./pack.js";
export * from "./svelte-compile.js";
export * from "./rollup-external-globals-plugin.js";
export * from "./rollup-from-source-plugin.js";
export * from "./rollup-replace-these-plugin.js";
export * from "./rollup-couldnt-resolve-helper-plugin.js";
export * from "./rollup-virtual-plugin.js";
export * from "./rollup-terser-browser-plugin.js";
export * from "./rollup-svelte-plugin-noserver.js";
export * from "./rollup-from-jsdelivr.js";
export {terser} from "./terser.js";

// Backard compat, these are moved into resolve.
export * from "../resolve/createDataUri.js";
export * from "../resolve/createImportMapFromModules.js";
export * from "../resolve/importCode.js";