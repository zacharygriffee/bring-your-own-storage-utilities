
# QUERY API

<a name="Query"></a>

## Query : <code>object</code>
**Kind**: global namespace  

* [Query](#Query) : <code>object</code>
    * [.exports.createReadStream$()](#Query.exports.createReadStream$) ⇒
    * [.exports.createReadStream(source, key, [config])](#Query.exports.createReadStream) ⇒ <code>Readable</code>
    * [.exports.getEntry$(source, path, [config])](#Query.exports.getEntry$)
    * [.exports.getEntry()](#Query.exports.getEntry)
    * [.exports.getTypeName$(source, key, config)](#Query.exports.getTypeName$) ⇒ <code>Observable.&lt;any&gt;</code>
    * [.exports.getTypeName()](#Query.exports.getTypeName)
    * [.exports.mimeTypeToName(type)](#Query.exports.mimeTypeToName) ⇒ <code>null</code> \| <code>\*</code>
    * [.exports.getType$(source, key, [config])](#Query.exports.getType$) ⇒ <code>Observable.&lt;string&gt;</code>
    * [.exports.getType()](#Query.exports.getType)
    * [.exports.get$(source, key, [config])](#Query.exports.get$) ⇒ <code>Observable.&lt;buffer&gt;</code>
    * [.exports.get()](#Query.exports.get)
    * [.exports.isAbsolute(x)](#Query.exports.isAbsolute) ⇒ <code>boolean</code>
    * [.exports.isRelative(x)](#Query.exports.isRelative) ⇒ <code>boolean</code>
    * [.exports.isRootFolder([folder])](#Query.exports.isRootFolder) ⇒ <code>boolean</code>
    * [.exports.isFile$(driveSource, path)](#Query.exports.isFile$) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
    * [.exports.isFile(driveSource, path)](#Query.exports.isFile) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.exports.isFolder(driveSource, path)](#Query.exports.isFolder) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.exports.isFolder$(driveSource, path)](#Query.exports.isFolder$) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
    * [.exports.list$()](#Query.exports.list$) ⇒ <code>\*</code>
    * [.exports.list()](#Query.exports.list)
    * [.exports.pathDetail$(sourceDrive, absolutePath)](#Query.exports.pathDetail$) ⇒ <code>\*</code>
    * [.exports.pathDetail()](#Query.exports.pathDetail)
    * [.exports.put$(source, key, bufferValue, [config])](#Query.exports.put$) ⇒ <code>Observable.&lt;ObservedValueOf.&lt;Promise.&lt;unknown&gt;&gt;&gt;</code>
    * [.exports.put()](#Query.exports.put)
    * [.exports.readdir$(source, config)](#Query.exports.readdir$) ⇒
    * [.exports.readdir()](#Query.exports.readdir)

<a name="Query.exports.createReadStream$"></a>

### Query.exports.createReadStream$() ⇒
Convenience 'rxjs.Observable' that wraps around `createReadStream`.

**Kind**: static method of [<code>Query</code>](#Query)  
**Returns**: Observable<Buffer>  
<a name="Query.exports.createReadStream"></a>

### Query.exports.createReadStream(source, key, [config]) ⇒ <code>Readable</code>
Creates a streamx.Readable stream of source's readstream of a key. If the source does not have read stream
will try and use a get function to pull resource.

Backpressure is not completely ironed out nor tested in many cases, especially when pulling from a source that
does not have a native createReadStream function e.g. one that only has source.get.

**Kind**: static method of [<code>Query</code>](#Query)  
**Returns**: <code>Readable</code> - Readable stream.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A source |
| key |  | A key to the resource |
| [config] |  | Configuration is added to second parameter of the source.createReadStream or source.get |
| [config.map] |  | Helper function to map what would result from the stream. Helpful to decode or if the resulting stream is object, and you need to pull specific value from that object. Or in the case where the 'consumer' needs a buffer, you can use this function to coerce the result to a buffer if it isn't already. |
| [config.start] | <code>0</code> | The inclusive byte start of the read stream. |
| [config.end] | <code>data.length</code> | Inclusive byte end of read stream. |
| [config.length] |  | If config.end is not set, how many bytes from config.start not inclusive. |
| [config.highWaterMark] |  | createReadStream will automatically chunkify to the highWaterMark any stream passed through. This will help to control the flow. |
| [config.wait] | <code>false</code> | a common setting on network storage sources, unless you really want to wait, I have set the default automatically false to only queue locally cached resources. |

<a name="Query.exports.getEntry$"></a>

### Query.exports.getEntry$(source, path, [config])
Gets the entry details of the file

- source should have either a `get` or `entry` function.
- source should have a `readdir` function

<pre>
getEntry$(someDrive, "\someFolder\someFile.txt")
 .subscribe(
     entry => {
         // The entry object
     }
 );

entry object will have at least:
{
    isFile, // boolean
    isFolder, // boolean
    key, // the name of the file
    value // details of the file, or undefined if it doesn't exist.
}
</pre>

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | source |
| path | <code>string</code> |  | path from the cwd |
| [config] |  |  |  |
| [config.cwd] | <code>string</code> | <code>&quot;/&quot;</code> | cwd to resolve the path to |
| [config.entrySelector] |  |  | Use your own selector to return information about a file, the bare minimum should be what is shown above to best interface with the other functions of this library. The entrySelector function will have three arguments, (source, path, config). This function will be coerced async if it isn't already. The default selector requires the source to have either an entry function or a get function. A get function is literally getting the contents of the file and analyzing it while an entry file gets the details of the file. So, storages with entry function are way more performant in these queries. |

<a name="Query.exports.getEntry"></a>

### Query.exports.getEntry()
Convenience async method for getEntry$

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.getTypeName$"></a>

### Query.exports.getTypeName$(source, key, config) ⇒ <code>Observable.&lt;any&gt;</code>
Get the extension name of the file's mime type. That is, package.json === 'json' .
The extension name is inferred from the first 100 bytes of data from the file. IF the file is less-than 30 bytes,
it will be inferred by the key name's extension e.g. package`.json` . Thus, small files without an extension may not
be inferred properly to their extension type. It is best to name your keys, at least the small ones, with an extension
if you want a meaningful result here.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| source | source |
| key | identifier for the file. See caution above about small files without extension. |
| config | See Query.getType for config information. |

<a name="Query.exports.getTypeName"></a>

### Query.exports.getTypeName()
Convenience async function for getTypeName$

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.mimeTypeToName"></a>

### Query.exports.mimeTypeToName(type) ⇒ <code>null</code> \| <code>\*</code>
A simple function to determine what file typename is based on it's mimetype.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| type | a mimetype to get the typename of the file. |

<a name="Query.exports.getType$"></a>

### Query.exports.getType$(source, key, [config]) ⇒ <code>Observable.&lt;string&gt;</code>
Gets the mime type of the file. This function analyzes the first 100 bytes of the file for the magic bytes, if it
cannot be determined by the byte data, it will then be inferred from the extension of the key. If still it cannot
be determined a null will be returned.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | The source |
| key |  | The key or filename or indexor of the resource. |
| [config] |  | Any additional configuration to pass to the createReadStream of the source. The start and length are non-optional. |
| [config.wait] | <code>false</code> | Some sources.createReadStream have this argument where they wait for the resource to be available. You can override this behavior and wait, some sources also may have a timeout argument to limit the wait. You should view the documentation for the source you pass. If you do decide to wait, some things may hang until the resource is available. |

<a name="Query.exports.getType"></a>

### Query.exports.getType()
A convenience async function for getType$

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.get$"></a>

### Query.exports.get$(source, key, [config]) ⇒ <code>Observable.&lt;buffer&gt;</code>
A wrapper to get a key from a source.

Unless using for something else, this should always return a binary buffer or uint8array.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  |  |
| key |  |  |  |
| [config] | <code>object</code> \| <code>string</code> |  | Configuration passed to the source, except the following. If a string is passed here, it will be inferred as the encoding. |
| [config.getter] | <code>function</code> |  | How to get from the source. This can be async. The default is source.get(key, config). |
| [config.encoding] | <code>Object</code> \| <code>string</code> | <code>utf8</code> | An encoder object or description. Most of this API expects the result to be in binary, including Query.createReadStream. So if your source returns a string or json object, coerce the result into binary with this configuration. IF the source already returns a buffer, this will do nothing. If you need to mutate the response further than this, use `config.getter`. |

**Example**  
```js
// A get where the key is the result for example purposes.
// The key is a javascript object
// the encoding is 'json' to turn the result from get to a buffer.
get$({ get(k) { return k; } }, {test: "case"}, { encoding: "json" }).subscribe(buffer => {});
```
<a name="Query.exports.get"></a>

### Query.exports.get()
Convenience async version of get$

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.isAbsolute"></a>

### Query.exports.isAbsolute(x) ⇒ <code>boolean</code>
Simple method to determine absolute path.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param |
| --- |
| x | 

<a name="Query.exports.isRelative"></a>

### Query.exports.isRelative(x) ⇒ <code>boolean</code>
Simple method to determine relative path.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param |
| --- |
| x | 

<a name="Query.exports.isRootFolder"></a>

### Query.exports.isRootFolder([folder]) ⇒ <code>boolean</code>
Determines if folder is root.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Default |
| --- | --- |
| [folder] | <code>&quot;/&quot;</code> | 

<a name="Query.exports.isFile$"></a>

### Query.exports.isFile$(driveSource, path) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
Determines if from source this file exists.

** this may return false for empty files (0 bytes) on some sources **

**Kind**: static method of [<code>Query</code>](#Query)  
**Todo**

- [ ] create a selector function to override default check


| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="Query.exports.isFile"></a>

### Query.exports.isFile(driveSource, path) ⇒ <code>Promise.&lt;boolean&gt;</code>
Convenience async function for isFile$

** this may return false for empty files (0 bytes) on some sources **

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="Query.exports.isFolder"></a>

### Query.exports.isFolder(driveSource, path) ⇒ <code>Promise.&lt;boolean&gt;</code>
Convenience async function for isFolder$. It will **not** test positive on some sources if the folder is empty.

** Empty folders will return false here **

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="Query.exports.isFolder$"></a>

### Query.exports.isFolder$(driveSource, path) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
Determines if from source this folder exists. It will **not** test positive on some sources if the folder is empty.

** Empty folders will return false here **

- [ ] create a selector function to override default check
- [x] incorporate readdir function from this library to support hyperbee file structures as well.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="Query.exports.list$"></a>

### Query.exports.list$() ⇒ <code>\*</code>
Same as readdir$ but config.list = true

**Kind**: static method of [<code>Query</code>](#Query)  
**See**: readdir$  
<a name="Query.exports.list"></a>

### Query.exports.list()
Convenience async method for list$

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.pathDetail$"></a>

### Query.exports.pathDetail$(sourceDrive, absolutePath) ⇒ <code>\*</code>
Returns entry, isFile and isFolder of a path.

If it is a file, the mime-type will be determined via getType$

<pre>
**isFile may return false for empty files (0 bytes) on some sources**
**isFolder will return false here folders that are empty**
</pre>

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Description |
| --- | --- |
| sourceDrive |  |
| absolutePath | An absolute path to retrieve detail. |

**Example**  
```js
pathDetail$(drive, "/some/path/to/file.txt").subscribe(
     {
         fullPath: absolutePath // The absolutePath you passed in.
         isFolder: false,
         isFile: true,
         type: text/plain // if file, mime type, if folder, undefined
     }
);
```
<a name="Query.exports.pathDetail"></a>

### Query.exports.pathDetail()
Async convenience method for pathDetail$
** isFile may return false for empty files (0 bytes) on some sources **
** isFolder will return false here folders that are empty **

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.put$"></a>

### Query.exports.put$(source, key, bufferValue, [config]) ⇒ <code>Observable.&lt;ObservedValueOf.&lt;Promise.&lt;unknown&gt;&gt;&gt;</code>
Put data into a source.

**Kind**: static method of [<code>Query</code>](#Query)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  |  |
| key |  |  |  |
| bufferValue |  |  | The data to put. It should be coerced to a buffer. |
| [config] |  |  | With the exception of the following, the config for the put operation. |
| [config.encoding] | <code>Object</code> \| <code>string</code> | <code>utf8</code> | If `bufferValue  is not a buffer, this encoding will be applied. |
| [config.putter] |  |  | Change the put operation. Helpful if you are putting to a source that does not handle buffer operations or has a different argument signature or has a different function name. |

<a name="Query.exports.put"></a>

### Query.exports.put()
Convenience async method for put$

**Kind**: static method of [<code>Query</code>](#Query)  
<a name="Query.exports.readdir$"></a>

### Query.exports.readdir$(source, config) ⇒
readdir. By default, lists all files and folders by their name without a path, from the `config.cwd`.

readdir will coerce a source to be listable (config.list = true). So even if a source doesn't have list function,
it still will work 99% of cases, still tests need to be done to ensure that.

the readdir of the source can be a `cold observable` an `async iterable` an `array of keys` an `async generator`,
anything that [rxjs.from](https://rxjs.dev/api/index/function/from) will accept. You could also design the source
as an interface like in this pseudocode example

**Kind**: static method of [<code>Query</code>](#Query)  
**Returns**: observable emits files from the source.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | source with functions readdir, get or entry |
| config |  | These configuration options apply to the readdir$ AND they are passed to the source.readdir second argument |
| [config.cwd] | <code>/</code> | Current working directory of the source. |
| [config.list] |  | Whether to get a detailed list of the files. A list is currently always recursive. |
| [config.recursive] |  | Whether to recursively dig into folders only applies if config.list is true |
| [config.trimPath] | <code>true</code> | To trim the path of any dots and slashes, a db may not start with the leading chars. This is default true because Hyperdrive handles path prefixes |

**Example**  
```js
const sourceInterface = (source, defaultProps) => ({
      exists(filePath) {
          // Having an exist function will help speed up
          // some find and query functions
          return !!source.exists(filePath);
      }.
      get(filePath, config = {}) {
          return source.get(filePath, {...(defaultProps.getProps ?? {}), ... config});
      },
    * readdir(path, config = {}) {
        for (const file of source.pathKeys) {
            yield file;
        }
    }
});

const sourceInstance = new WhateverSource();
readdir$(sourceInterface(sourceInstance, { getProps }));
```
<a name="Query.exports.readdir"></a>

### Query.exports.readdir()
Stream version of readdir$. Returns array of the files and folders

**Kind**: static method of [<code>Query</code>](#Query)  
