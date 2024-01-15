export {FileExplorerComponent} from "./FileExplorer/index.js";
// Bundle added export
export * as Strap from "@sveltestrap/sveltestrap";

/**
 * FileExplorer (Will be renamed to SourceExplorer)
 *
 * @property source - The source this component will act on.
 * @property {string} [cwd=/] - The current working directory the component is on.
 * @property {string} [iconSize=30px] - The icon size for the files in the explorer
 * @property {number} [updated=0] - Bind and change this number to refresh.
 *
 */
let FileExplorer;


/**
 * SvelteStrap
 *
 * This is a re-minification of @sveltestrap/sveltestrap to work with
 * the way BYOSU compiles svelte for browser use.
 *
 * @see https://github.com/sveltestrap/sveltestrap
 * @see https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs
 */
let SvelteStrap;

/**
 * UploadTo
 *
 * A component that enables you to upload a file using the browser's file upload
 * dialog, into your source that has a source.put(key, buffer, config) function
 *
 * If the passed source does not support put function, the button will simply not appear.
 *
 * Styles are mimicked like @sveltestrap/sveltestrap or bootstrap.js
 *
 * @see https://github.com/sveltestrap/sveltestrap
 * @see https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs
 *
 * @property source - The source this component will act on.
 * @property {string} [color=primary] - The color of the button. See sveltestrap for info on what is available.
 * @property {string} [size=sm] - A choice between sm for small, and lg for large.
 * @property {string} [cwd=/] - The current working directory the component is on.
 * @property {number} [updated=0] - Bind and change this number to refresh any connected components.
 * @property {Function} [keyMutateFunction] - Mutate the file name of the uploaded file to something else.
 * Default is to use the filename as is.
 * @property {string} [theme=dark] - A choice between dark or light color theme
 *
 */
let UploadTo;