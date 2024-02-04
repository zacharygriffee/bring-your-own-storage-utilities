
# ADAPT API

<a name="Adapt"></a>

## Adapt : <code>object</code>
**Kind**: global namespace  

* [Adapt](#Adapt) : <code>object</code>
    * [.iSource](#Adapt.iSource) ⇒ <code>any</code>
    * [.RandomAccessCollection](#Adapt.RandomAccessCollection)

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
                         // Your source should have an entry or get function to work
    del,                 // Del key at source.
    exists,              // Whether the key of source exists
                         // Your source should have an exists, entry, or get function for exists to work.
    ready,               // Whether the source is ready to operate.
    readdir,             // Get an array of entries of the cwd of source
    list,                // Get an array of 'entry' details of the cwd of source
                         // Your source should have a readdir function/generator/observable
    createReadStream,    // Get a stream of data from a key of source.
                         // Your source should have either a get or a native createReadStream(fileName, config)

    factory              // A function that returns a `string module` that defines how to
                         // install this storage source to make the source portable.
    randomAccess         // Create a random access storage interface of the iSource.
    
    // Properties
    length               // For supporting sources, get the length. Not fully implemented.
    source               // the raw source iSource wraps.
};
</pre>

**Kind**: static interface of [<code>Adapt</code>](#Adapt)  
**See**: Adapt.fromRandomAccessCollection for details on how to implement  

| Param | Description |
| --- | --- |
| source |  |
| state | any state to be carried by the source |

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
