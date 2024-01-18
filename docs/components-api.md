
# COMPONENTS API

<a name="Components"></a>

## Components : <code>object</code>
**Kind**: global namespace  

* [Components](#Components) : <code>object</code>
    * [.FileExplorer](#Components.FileExplorer)
    * [.SvelteStrap](#Components.SvelteStrap)
    * [.UploadTo](#Components.UploadTo)
    * [.SaveAll](#Components.SaveAll)
    * [.Delete](#Components.Delete)

<a name="Components.FileExplorer"></a>

### Components.FileExplorer
FileExplorer (Will be renamed to SourceExplorer)

**Kind**: static property of [<code>Components</code>](#Components)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | The source this component will act on. |
| [cwd] | <code>string</code> | <code>&quot;/&quot;</code> | The current working directory the component is on. |
| [iconSize] | <code>string</code> | <code>&quot;30px&quot;</code> | The icon size for the files in the explorer |
| [updated] | <code>number</code> | <code>0</code> | Bind and change this number to refresh. |

<a name="Components.SvelteStrap"></a>

### Components.SvelteStrap
SvelteStrap

This is a re-minification of @sveltestrap/sveltestrap to work with
the way BYOSU compiles svelte for browser use.

**Kind**: static property of [<code>Components</code>](#Components)  
**See**

- https://github.com/sveltestrap/sveltestrap
- https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs

<a name="Components.UploadTo"></a>

### Components.UploadTo
UploadTo

A component that enables you to upload a files using the browser's file upload
dialog, into your source that has a source.put(key, buffer, config) function

If the passed source does not support put function, the button will simply not appear.

Styles are mimicked like @sveltestrap/sveltestrap or bootstrap.js

**Kind**: static property of [<code>Components</code>](#Components)  
**See**

- https://github.com/sveltestrap/sveltestrap
- https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | The source this component will act on. |
| [writable] | <code>function</code> | <code>source.writable</code> | A check To see whether a source is writable. This is also a good place to ensure your source is ready to write. Defaults to checking the writable property on source. |
| [putter] | <code>function</code> | <code>source.put</code> | (source, key, buffer, config) => {} How to put the file. Data will always come in as a buffer. Default behavior is to use source.put |
| [putConfig] | <code>object</code> |  | Configuration to pass to the putter |
| [cwd] | <code>string</code> | <code>&quot;/&quot;</code> | The current working directory the component is on. Se this if you want a different upload destination in the source. |
| [updated] | <code>number</code> | <code>0</code> | Bind and change this number to refresh any connected components. |
| [keyMutateFunction] | <code>function</code> |  | Mutate the file name of the uploaded file to something else. Default is to use the filename as is. |

<a name="Components.SaveAll"></a>

### Components.SaveAll
SaveAll

A component that enables you to download files into a zip.

** This is not secure **
** Do not download security sensitive files **

**Kind**: static property of [<code>Components</code>](#Components)  
**See**

- https://github.com/sveltestrap/sveltestrap
- https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs
- https://github.com/gildas-lormeau/zip.js
- https://github.com/jimmywarting/StreamSaver.js

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | The source this component will act on. The source should have at least source.get preferably a native createReadStream and a readdir. |
| keys$ | <code>Observable.&lt;{fullPath: string, isFolder: boolean, isFile: boolean}&gt;</code> |  | A required property. The list of keys to download. The key object this observable emits should resemble the Query.pathDetail$ interface. It should at minimum have isFile, fullPath, and isFolder. |
| [findConfig] | <code>object</code> |  | When a directory is encountered when downloading, these are the options to supply. See Find.findDownMultiple$ for configuration options including limits and directory depths to set. |
| [readStreamConfig] | <code>object</code> | <code>{}</code> | The source will be queried by the Query.createReadStream function, and this is the configuration that will be passed into that query. |
| [downloadName] | <code>string</code> | <code>&quot;sourceFiles.zip&quot;</code> | The zip file name the files are zipped into and downloaded by user. |
| [state$] | <code>InputObservable.&lt;object&gt;</code> |  | Coming soon, a state object to get progress of how the download and zip process is going. |
| [updated] | <code>number</code> | <code>0</code> | Bind and change this number to refresh any connected components. |
| [keyMutateFunction] | <code>function</code> |  | Mutate the file names of the downloaded files. This will give the (fullPath, cwd) of the downloaded file being put into the zip file. The second argument, cwd ,is the directory the download was initiated in. |
| [cwd] | <code>string</code> |  | The current working directory of the component. This is only to be fed to keyMutateFunction, and has no other purpose yet. |

<a name="Components.Delete"></a>

### Components.Delete
Delete

A component that enables you to delete files of a compatible source.

** This is not secure **
** Do not download security sensitive files **

**Kind**: static property of [<code>Components</code>](#Components)  
**See**

- https://github.com/sveltestrap/sveltestrap
- https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | The source this component will act on. The source should have at least source.del and readdir. |
| keys$ | <code>Observable.&lt;{fullPath: string, isFolder: boolean, isFile: boolean}&gt;</code> |  | A required property. The list of keys to delete. The key object this observable emits should resemble the Query.pathDetail$ interface. It should at minimum have isFile, fullPath, and isFolder. |
| [findConfig] | <code>object</code> |  | When a directory is encountered when deleting, these are the options to supply. See Find.findDownMultiple$ for configuration options including limits and directory depths to set. |
| [state$] | <code>InputObservable.&lt;object&gt;</code> |  | Coming soon, a state object to get progress of how the download and zip process is going. |
| [updated] | <code>number</code> | <code>0</code> | Bind and change this number to refresh any connected components. |
| [cwd] | <code>string</code> |  | The current working directory of the component. This is only to be fed to keyMutateFunction, and has no other purpose yet. |

