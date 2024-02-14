
# ADAPT API

<a name="Adapt"></a>

## Adapt : <code>object</code>
**Kind**: global namespace  

* [Adapt](#Adapt) : <code>object</code>
    * [.RandomAccessCollection](#Adapt.RandomAccessCollection)
    * [.iSource](#Adapt.iSource) ⇒ <code>any</code>
        * [.id](#Adapt.iSource.id) : <code>boolean</code>
        * [.isAppendable](#Adapt.iSource.isAppendable) : <code>boolean</code>
        * [.isExecutable](#Adapt.iSource.isExecutable) : <code>boolean</code>
        * [.isInstallable](#Adapt.iSource.isInstallable) : <code>boolean</code>
        * [.isReadable](#Adapt.iSource.isReadable) : <code>boolean</code>
        * [.isWritable](#Adapt.iSource.isWritable) : <code>boolean</code>
        * [.length](#Adapt.iSource.length) : <code>number</code>
        * [.ready](#Adapt.iSource.ready) : <code>Promise</code>
        * [.append(buf, config)](#Adapt.iSource.append) ⇒
        * [.append$(buf, config)](#Adapt.iSource.append$) ⇒
        * [.createReadStream(path, config)](#Adapt.iSource.createReadStream) ⇒
        * [.createReadStream$(path, config)](#Adapt.iSource.createReadStream$) ⇒
        * [.del(key)](#Adapt.iSource.del) ⇒
        * [.entry(path, config)](#Adapt.iSource.entry) ⇒
        * [.execute(path, config)](#Adapt.iSource.execute) ⇒
        * [.exists(key)](#Adapt.iSource.exists) ⇒
        * [.get(key, config)](#Adapt.iSource.get) ⇒
        * [.get$(key, config)](#Adapt.iSource.get$) ⇒
        * [.handleRandomAccess(file, config)](#Adapt.iSource.handleRandomAccess)
        * [.install(path, config)](#Adapt.iSource.install)
        * [.list(path, config)](#Adapt.iSource.list) ⇒
        * [.list$(path, config)](#Adapt.iSource.list$) ⇒
        * [.open()](#Adapt.iSource.open) ⇒
        * [.put(path, buffer, config)](#Adapt.iSource.put) ⇒
        * [.put$(path, buff, config)](#Adapt.iSource.put$) ⇒
        * [.readdir(path, config)](#Adapt.iSource.readdir) ⇒
        * [.readdir$(path, config)](#Adapt.iSource.readdir$) ⇒
    * [.getImportMap([defaultMap], [cache])](#Adapt.getImportMap) ⇒ <code>Object</code> \| <code>\*</code> \| <code>Object</code>
    * [.setImportMap([importMap])](#Adapt.setImportMap) ⇒ <code>Object</code>
    * [.importMapSource([cache], [scope])](#Adapt.importMapSource)
    * ~~[.enableRandomAccess(RandomAccessStorageClass)](#Adapt.enableRandomAccess)~~
    * [.setPack(_pack)](#Adapt.setPack) ⇒
    * [.importPack([url])](#Adapt.importPack) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="Adapt.RandomAccessCollection"></a>

### Adapt.RandomAccessCollection
!! DO NOT USE YET, NOT IMPLEMENTED !! A ISource interface for a collection of random-access-storages

**Kind**: static property of [<code>Adapt</code>](#Adapt)  
**Example**  
```js
// Install storage and get the Adapt.ISource interface.
const RAC = await RandomAccessCollection.install();

RAC.setDefault((fileName, buff, config) => new RAM(buff));

RAC.setCollection({
 preexistingFile: new RAM(),
 ["folder/preexistingFileInFolder.txt"]: new RAI()
});
await RAC.exists("folder/preexistingFileInFolder.txt"); // true
```
<a name="Adapt.iSource"></a>

### Adapt.iSource ⇒ <code>any</code>
Utilize this source interface to make it easier and safer for this library to handle your
source. Any area where library function accepts a 'source', pass a wrapped source for best
results.

**Kind**: static namespace of [<code>Adapt</code>](#Adapt)  
**See**: Adapt.fromRandomAccessCollection for details on how to implement  

| Param | Description |
| --- | --- |
| source |  |
| state | any state to be carried by the source |

**Example**  
```js
const obj = {};
const src = ISource({
   get(x) {
       return obj[x];
   },
   async put(x, buf) {
       obj[x] = buf;
       await new Promise(resolve => setTimeout(resolve, 1000);
   },
   del(x) {
       if (obj[x]) {
           delete obj[x];
       }
   }
});
```

* [.iSource](#Adapt.iSource) ⇒ <code>any</code>
    * [.id](#Adapt.iSource.id) : <code>boolean</code>
    * [.isAppendable](#Adapt.iSource.isAppendable) : <code>boolean</code>
    * [.isExecutable](#Adapt.iSource.isExecutable) : <code>boolean</code>
    * [.isInstallable](#Adapt.iSource.isInstallable) : <code>boolean</code>
    * [.isReadable](#Adapt.iSource.isReadable) : <code>boolean</code>
    * [.isWritable](#Adapt.iSource.isWritable) : <code>boolean</code>
    * [.length](#Adapt.iSource.length) : <code>number</code>
    * [.ready](#Adapt.iSource.ready) : <code>Promise</code>
    * [.append(buf, config)](#Adapt.iSource.append) ⇒
    * [.append$(buf, config)](#Adapt.iSource.append$) ⇒
    * [.createReadStream(path, config)](#Adapt.iSource.createReadStream) ⇒
    * [.createReadStream$(path, config)](#Adapt.iSource.createReadStream$) ⇒
    * [.del(key)](#Adapt.iSource.del) ⇒
    * [.entry(path, config)](#Adapt.iSource.entry) ⇒
    * [.execute(path, config)](#Adapt.iSource.execute) ⇒
    * [.exists(key)](#Adapt.iSource.exists) ⇒
    * [.get(key, config)](#Adapt.iSource.get) ⇒
    * [.get$(key, config)](#Adapt.iSource.get$) ⇒
    * [.handleRandomAccess(file, config)](#Adapt.iSource.handleRandomAccess)
    * [.install(path, config)](#Adapt.iSource.install)
    * [.list(path, config)](#Adapt.iSource.list) ⇒
    * [.list$(path, config)](#Adapt.iSource.list$) ⇒
    * [.open()](#Adapt.iSource.open) ⇒
    * [.put(path, buffer, config)](#Adapt.iSource.put) ⇒
    * [.put$(path, buff, config)](#Adapt.iSource.put$) ⇒
    * [.readdir(path, config)](#Adapt.iSource.readdir) ⇒
    * [.readdir$(path, config)](#Adapt.iSource.readdir$) ⇒

<a name="Adapt.iSource.id"></a>

#### iSource.id : <code>boolean</code>
The id of source.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.isAppendable"></a>

#### iSource.isAppendable : <code>boolean</code>
Whether a source can be appended to.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.isExecutable"></a>

#### iSource.isExecutable : <code>boolean</code>
Whether this source is executable.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.isInstallable"></a>

#### iSource.isInstallable : <code>boolean</code>
Whether this source is installable.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.isReadable"></a>

#### iSource.isReadable : <code>boolean</code>
Whether a source is readable.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.isWritable"></a>

#### iSource.isWritable : <code>boolean</code>
Whether a source is writable.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.length"></a>

#### iSource.length : <code>number</code>
Some sources have a length property, something like how many files are in the source.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.ready"></a>

#### iSource.ready : <code>Promise</code>
A promise that resolves when source is ready. This also waits for iSource.open if available.

**Kind**: static property of [<code>iSource</code>](#Adapt.iSource)  
<a name="Adapt.iSource.append"></a>

#### iSource.append(buf, config) ⇒
Append a value to an appendable source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| buf | <code>buffer</code> | The buffer to append to the source. |
| config | <code>object</code> | The configuration to pass to the Query.append. |

<a name="Adapt.iSource.append$"></a>

#### iSource.append$(buf, config) ⇒
Append a value to an appendable source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Observable  

| Param | Type | Description |
| --- | --- | --- |
| buf | <code>buffer</code> | The buffer to append to the source. |
| config | <code>object</code> | The configuration to pass to the Query.append$. |

<a name="Adapt.iSource.createReadStream"></a>

#### iSource.createReadStream(path, config) ⇒
Create a read stream from a path of the source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to the file to create a read stream from. |
| config | <code>object</code> | The configuration to pass to the  Query.createReadStream. |

<a name="Adapt.iSource.createReadStream$"></a>

#### iSource.createReadStream$(path, config) ⇒
Create a read stream from a path of the source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Observable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to the file to create a read stream from. |
| config | <code>object</code> | The configuration to pass to the Query.createReadStream$ function. |

<a name="Adapt.iSource.del"></a>

#### iSource.del(key) ⇒
Delete a key of the source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to delete of the source. |

<a name="Adapt.iSource.entry"></a>

#### iSource.entry(path, config) ⇒
Get entry details of a path

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path |
| config | <code>object</code> | The configuration to pass to the entry. |

<a name="Adapt.iSource.execute"></a>

#### iSource.execute(path, config) ⇒
Execute a file from source

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path The path to execute |
| config | <code>object</code> | The configuration to pass to the Query.execute. |

<a name="Adapt.iSource.exists"></a>

#### iSource.exists(key) ⇒
Check whether file exists of source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key of file. |

<a name="Adapt.iSource.get"></a>

#### iSource.get(key, config) ⇒
Get a value to from a readable source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The absolute filepath to get from the source. |
| config | <code>object</code> | The configuration to pass to the Query.get. |

<a name="Adapt.iSource.get$"></a>

#### iSource.get$(key, config) ⇒
Get a value to from a readable source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Observable  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The absolute filepath to get from the source. |
| config | <code>object</code> | The configuration to pass to the Query.get$. |

<a name="Adapt.iSource.handleRandomAccess"></a>

#### iSource.handleRandomAccess(file, config)
Create a random access storage from the source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| file | <code>string</code> |  | File path to create random-access-storage from. |
| config | <code>object</code> |  | configuration to be passed to the random-access-storage implementation. |
| [config.readable] | <code>boolean</code> | <code>source.isReadable</code> | Override whether this is readable. Can't make a non-readable source readable, but you can make a readable source non-readable. If not readable: read function is not available. |
| [config.writable] | <code>boolean</code> | <code>source.isWritable</code> | Override whether this is writable. Can't make a non-writable source writable, but you can make a writable source non-writable. If not writable: write, del, truncate are not available. |
| [config.directory] | <code>string</code> |  | The directory of the source to do file operations in. |
| [config.buffer] | <code>buffer</code> |  | The initial buffer to the file creation. So if you already have buffer and the source is writable. |
| [config.size] | <code>number</code> |  | How much of config.buffer should be written, maybe you don't want the whole file. |
| [config.truncate] | <code>boolean</code> |  | Create an initial truncation operation using config.offset. If it is a non-existing file, will create the file with config.offset amount of zero-bytes. |
| [config.offset] | <code>number</code> |  | if config.buffer, write into the file at this offset. If config.truncate, where to truncate the file to. |

<a name="Adapt.iSource.install"></a>

#### iSource.install(path, config)
Install from a file of the source.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path of the installation |
| config | <code>object</code> | The configuration to be passed to the installation. |

<a name="Adapt.iSource.list"></a>

#### iSource.list(path, config) ⇒
List details of the files of path

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise<Array>  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to list |
| config | <code>object</code> | The configuration to be passed to the Query.list$. |

<a name="Adapt.iSource.list$"></a>

#### iSource.list$(path, config) ⇒
List details of the files of path

Source needs a readdir function, or its own implementation of list

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Observable<pathDetail> Each emit is a file, and its detail.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to list |
| config | <code>object</code> | The configuration to be passed to the Query.list$. |

<a name="Adapt.iSource.open"></a>

#### iSource.open() ⇒
Some sources need to be opened before running. Adapt.iSource.ready waits for this to resolve.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise<void>  
<a name="Adapt.iSource.put"></a>

#### iSource.put(path, buffer, config) ⇒
Put a file into the source

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Where to put file. |
| buffer | <code>buffer</code> | file buffer |
| config | <code>object</code> | The configuration to be passed to the Query.put$. |

<a name="Adapt.iSource.put$"></a>

#### iSource.put$(path, buff, config) ⇒
Put a file into the source

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Observable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Where to put file. |
| buff | <code>buffer</code> | file buffer |
| config | <code>object</code> | The configuration to be passed to the Query.put$. |

<a name="Adapt.iSource.readdir"></a>

#### iSource.readdir(path, config) ⇒
Read directory of source

Source needs a readdir function, async generator, stream, observable, iterable, async iterable.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Directory to read files returning shallow file and directory names of that directory. |
| config | <code>object</code> | The configuration to be passed to the Query.put$. |

<a name="Adapt.iSource.readdir$"></a>

#### iSource.readdir$(path, config) ⇒
Read directory of source

Source needs a readdir function, async generator, stream, observable, iterable, async iterable.

**Kind**: static method of [<code>iSource</code>](#Adapt.iSource)  
**Returns**: Observable  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Directory to read files returning shallow file and directory names of that directory. |
| config | <code>object</code> | The configuration to be passed to the Query.put$. |

<a name="Adapt.getImportMap"></a>

### Adapt.getImportMap([defaultMap], [cache]) ⇒ <code>Object</code> \| <code>\*</code> \| <code>Object</code>
Get import map of the current page. If you cache the importMap, any mutations to the object does not
add imports to the page, but it will be accessible by the importMapSource().

**Kind**: static method of [<code>Adapt</code>](#Adapt)  

| Param | Default | Description |
| --- | --- | --- |
| [defaultMap] |  | If the page does not have an import map, you may supply what will be used instead. The import map structure should be at least imports and scope key which is also the default. |
| [cache] | <code>true</code> | Allow to cache the import map. This is fine for small import maps, but if your import maps are large with a bunch of data uri's, you may not want that hanging out in memory. |

**Example**  
```js
// HTML
<script type='importmap'>
    {
        imports: {
            "bring-your-own-storage-utilities": "https://esm.run/bring-your-own-storage-utilities"
        }
    }
</script>
// Using this function
const {imports} = getImportMap();
imports["bring-your-own-storage-utilities"]; // https://esm.run/bring-your-own-storage-utilities
```
<a name="Adapt.setImportMap"></a>

### Adapt.setImportMap([importMap]) ⇒ <code>Object</code>
Supply your own import map, not using the webpage import map. IF you do this before executing Adapt.importMapSource or
Adapt.getImportMap with cache=true, they will use this instead of the page's import map. This will also makes it
possible to run in other environments instead of browser, like creating importmap on server.

**Kind**: static method of [<code>Adapt</code>](#Adapt)  

| Param | Description |
| --- | --- |
| [importMap] | The import map should have at the very least 'imports' object. Default: imports and scope |

<a name="Adapt.importMapSource"></a>

### Adapt.importMapSource([cache], [scope])
Create an iSource interface of the import map on the webpage.

** source.put does not add modules to the 'browser' importmap, but the source's internal cache that can
be used by other functions of this library.

**Kind**: static method of [<code>Adapt</code>](#Adapt)  

| Param | Default | Description |
| --- | --- | --- |
| [cache] | <code>true</code> | Allow to cache the import map. This is fine for small import maps, but if your import maps are large with a bunch of data uri's, you may not want that hanging out in memory. If cache=false, this source will not be writable and source.put will not be available. |
| [scope] | <code>&#x27;imports&#x27;</code> | The import map typically has at least the following format: imports and scope. The scope here is `imports` and `scope`. |

**Example**  
```js
// HTML
<script type='importmap'>
    {
        imports: {
            "bring-your-own-storage-utilities": "https://esm.run/bring-your-own-storage-utilities",
            "./a/path/to/resource": "<<data:uri>>"
        }
    }
</script>
// Using this function
const source = importMapSource();
const buff = await source.get("bring-your-own-storage-utilities");   // https://esm.run/bring-your-own-storage-utilities
const keys = await source.readdir("./a/path");                       // <<data:uri>>
```
<a name="Adapt.enableRandomAccess"></a>

### ~~Adapt.enableRandomAccess(RandomAccessStorageClass)~~
***Deprecated***

Enable random access storage support by passing the random-access-storage class
from npm -i random-access-storage

**Kind**: static method of [<code>Adapt</code>](#Adapt)  

| Param |
| --- |
| RandomAccessStorageClass | 

<a name="Adapt.setPack"></a>

### Adapt.setPack(_pack) ⇒
Only necessary if you did not import the entire BYOSU namespace e.g. import * as BYOSU from "bring-your-own-storage-utilities";.

IF constructing a iSource from a factory string, you must import a pack.
Either use setPack if you already have Deploy.pack loaded.
Or, use importPack to import your own or from BYOSU repo.

**This is only ran once.

Repeated calls will be ignored**

**Kind**: static method of [<code>Adapt</code>](#Adapt)  
**Returns**: void  

| Param | Description |
| --- | --- |
| _pack | a preloaded Deploy.pack you have |

<a name="Adapt.importPack"></a>

### Adapt.importPack([url]) ⇒ <code>Promise.&lt;void&gt;</code>
Only necessary if you did not import the entire BYOSU namespace e.g. import * as BYOSU from "bring-your-own-storage-utilities";.

IF constructing a iSource from a factory string, you must import a pack. Either use setPack if you already have
Deploy.pack loaded. Or, use importPack to import your own or from BYOSU repo.

**This is only ran once.

Repeated calls will be ignored**

import errors should be caught by you

**Kind**: static method of [<code>Adapt</code>](#Adapt)  

| Param | Default | Description |
| --- | --- | --- |
| [url] | <code>https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@0.0.1202/dist/deploy.min.js/+esm</code> | default is https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@0.0.1202/dist/deploy.min.js/+esm |

