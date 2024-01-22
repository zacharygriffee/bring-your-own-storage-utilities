
# ADAPT API

<a name="Adapt"></a>

## Adapt : <code>object</code>
**Kind**: global namespace  

* [Adapt](#Adapt) : <code>object</code>
    * [.iSource](#Adapt.iSource) ⇒ <code>any</code>
    * [.RandomAccessCollection](#Adapt.RandomAccessCollection)
    * [.exports.setPack(_pack)](#Adapt.exports.setPack) ⇒
    * [.importPack([url])](#Adapt.importPack) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="Adapt.iSource"></a>

### Adapt.iSource ⇒ <code>any</code>
Utilize this source interface to make it easier and safer for this library to handle your
source. Any area where library function accepts a 'source', pass a wrapped source for best
results.

source can have any of these methods and properties:
<pre>
source = {
    // Methods
    get,                 // Get a buffer from the storage by key.
    get$,                // An observable version of get
    put,                 // Put a buffer at key into the source
    put$,                // An observable of put
    append,              // Append a buffer to a source
    append$,             // An observable of append
    entry,               // To retrieve details of entry at key of source
    del,                 // Del key at source.
    exists,              // Whether the key of source exists
    ready,               // Whether the source is ready to operate.
    readdir,             // Get an array of entries of the cwd of source
    list,                // Get an array of 'entry' details of the cwd of source
    createReadStream,    // Get a stream of data from a key of source.

    // Properties
    length               // For supporting sources, get the length. Not fully implemented.
    factory              // A string module that defines how to
                         // install this storage source.
};
</pre>

**Kind**: static interface of [<code>Adapt</code>](#Adapt)  
**See**: Adapt.fromRandomAccessCollection for details on how to implement  

| Param | Description |
| --- | --- |
| source |  |
| [meta] | Just meta data to send along with the container that wraps the source. |

**Example**  
```js
// Example of factory
import {pack} from "bring-your-own-storage-utilities/deploy";
setPack(pack);

const src = ISource({
    factory: `
        const obj = {};
        export function get(x) {
            return obj[x];
        }
        export function put(x, buf) {
            obj[x] = buf;
        }
        export function del(x) {
            if (obj[x]) {
                delete obj[x];
            }
        }
    `
});
const installedSrc = await src.install();
await installedSrc.put("hello", "you");
await installedSrc.get("hello"); // buffer version of 'you'
```
**Example**  
```js
// You don't need factory to make, if you don't need portable source.

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
<a name="Adapt.RandomAccessCollection"></a>

### Adapt.RandomAccessCollection
A ISource interface for a collection of random-access-storages

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
<a name="Adapt.exports.setPack"></a>

### Adapt.exports.setPack(_pack) ⇒
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

