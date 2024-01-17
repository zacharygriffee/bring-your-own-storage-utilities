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
 * A component that enables you to upload a files using the browser's file upload
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
 * @property {Function} [writable=source.writable] - A check To see whether a source is writable. This is also a good place
 * to ensure your source is ready to write. Defaults to checking the writable property on source.
 * @property {Function} [putter=source.put] - (source, key, buffer, config) => {} How to put the file. Data will always
 * come in as a buffer. Default behavior is to use source.put
 * @property {object} [putConfig] - Configuration to pass to the putter
 * @property {string} [color=primary] - The color of the button. See sveltestrap for info on what is available.
 * @property {string} [size=sm] - A choice between sm for small, and lg for large.
 * @property {string} [cwd=/] - The current working directory the component is on. Se this if you want a different
 * upload destination in the source.
 * @property {number} [updated=0] - Bind and change this number to refresh any connected components.
 * @property {Function} [keyMutateFunction] - Mutate the file name of the uploaded file to something else.
 * Default is to use the filename as is.
 * @property {string} [theme=dark] - A choice between dark or light color theme
 *
 */
let UploadTo;

/**
 * SaveAll
 *
 * A component that enables you to download files into a zip.
 *
 * ** This is not secure **
 * ** Do not download security sensitive files **
 *
 * @see https://github.com/sveltestrap/sveltestrap
 * @see https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs
 * @see https://github.com/gildas-lormeau/zip.js
 * @see https://github.com/jimmywarting/StreamSaver.js
 *
 * @property source - The source this component will act on. The source should have at least source.get preferably
 * a native createReadStream and a readdir.
 * @property {Observable<{fullPath: string, isFolder: boolean, isFile: boolean}>} keys$ A required property.
 * The list of keys to download. The key object this observable emits should resemble the Query.pathDetail$ interface.
 * It should at minimum have isFile, fullPath, and isFolder.
 * @property {object} [findConfig] - When a directory is encountered when downloading, these are the options to supply.
 * See Find.findDownMultiple$ for configuration options including limits and directory depths to set.
 * @property {object} [readStreamConfig={}] - The source will be queried by the Query.createReadStream function, and this
 * is the configuration that will be passed into that query.
 * @property {string} [downloadName=sourceFiles.zip] The zip file name the files are zipped into and downloaded by user.
 * @property {InputObservable<object>} [state$] Coming soon, a state object to get progress of how the download and zip process is
 * going.
 * @property {string} [color=primary] - The color of the button. See sveltestrap for info on what is available.
 * @property {string} [size=sm] - A choice between sm for small, and lg for large.
 * @property {number} [updated=0] - Bind and change this number to refresh any connected components.
 * @property {Function} [keyMutateFunction] - Mutate the file names of the downloaded files. This will give the
 * (fullPath, cwd) of the downloaded file being put into the zip file. The second argument, cwd ,is the directory the
 * download was initiated in.
 * @property {string} [cwd] The current working directory of the component. This is only to be fed to keyMutateFunction,
 * and has no other purpose yet.
 * @property {string} [theme=dark] - A choice between dark or light color theme
 *
 */
let SaveAll;