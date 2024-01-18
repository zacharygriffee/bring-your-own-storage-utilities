
# ADAPT API

<a name="Adapt"></a>

## Adapt : <code>object</code>
**Kind**: global namespace  

* [Adapt](#Adapt) : <code>object</code>
    * [.fromRandomAccess](#Adapt.fromRandomAccess) : <code>object</code>
        * [.exists(file, [config])](#Adapt.fromRandomAccess.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.readdir([fromPath], [config])](#Adapt.fromRandomAccess.readdir) ⇒ <code>Readable</code>
    * [.fromRandomAccessCollection](#Adapt.fromRandomAccessCollection) : <code>object</code>
        * [.exists(file)](#Adapt.fromRandomAccessCollection.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.get(file, [config])](#Adapt.fromRandomAccessCollection.get) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="Adapt.fromRandomAccess"></a>

### Adapt.fromRandomAccess : <code>object</code>
Wraps a function that makes random access storage instances. You have to supply the readdir mechanism here because
there is no standard for it.

**Kind**: static namespace of [<code>Adapt</code>](#Adapt)  
**Todo**

- [ ] When this library supports put/write, can keep inner cache of the file hierarchy created to make readdir$
      function optional.


| Param | Type | Description |
| --- | --- | --- |
| randomAccessFunction | <code>AsyncFunction</code> \| <code>function</code> | A function that creates random access file instances. |
| readdir$ | <code>Observable.&lt;string&gt;</code> | A **cold** Observable source stream that emits filenames that exist in the filesystem scope you want. |

**Example**  
```js
fromRandomAccess(
 (file, config) => {
     return fileStore[file] = makeARandomAccessStorageCompatibleFile(file, config);
 },
 rxjs.from(fileStore)
)
```

* [.fromRandomAccess](#Adapt.fromRandomAccess) : <code>object</code>
    * [.exists(file, [config])](#Adapt.fromRandomAccess.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.readdir([fromPath], [config])](#Adapt.fromRandomAccess.readdir) ⇒ <code>Readable</code>

<a name="Adapt.fromRandomAccess.exists"></a>

#### fromRandomAccess.exists(file, [config]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Whether the file exists in collection. An empty file does not exist to this function.

**Kind**: static method of [<code>fromRandomAccess</code>](#Adapt.fromRandomAccess)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | File name to check |
| [config] |  | a configuration object that is passed to the factory function |

<a name="Adapt.fromRandomAccess.readdir"></a>

#### fromRandomAccess.readdir([fromPath], [config]) ⇒ <code>Readable</code>
Returns a readable stream of files in cwd.

**Kind**: static method of [<code>fromRandomAccess</code>](#Adapt.fromRandomAccess)  
**Returns**: <code>Readable</code> - A streamx readable stream that emits the values.  

| Param | Default | Description |
| --- | --- | --- |
| [fromPath] | <code>&quot;/&quot;</code> | A file path, defaults to root. |
| [config] |  |  |
| [config.cwd] |  | Same as fromPath |
| [config.recursive] | <code>false</code> | If true, cwd is ignored and all files in the collection are returned. |

<a name="Adapt.fromRandomAccessCollection"></a>

### Adapt.fromRandomAccessCollection : <code>object</code>
Wraps a collection of random access storage instances to be used with this library.

Currently supported functions: exists, get, readdir,

It is **not recommended** to use with collections that have big files. For that, use
[hypercore](https://docs.holepunch.to/building-blocks/hypercore), or
[corestore](https://docs.holepunch.to/helpers/corestore) or some other handler
of random-access-storage instances.

**Kind**: static namespace of [<code>Adapt</code>](#Adapt)  
**Todo**

- [ ] Support put, append, and other operations.


| Param | Description |
| --- | --- |
| collection | A key/value of fileNames/randomAccessStorage instances, mix it up if you want. |

**Example**  
```js
// Example
import RAM from "random-access-memory";
fromRandomAccessStorageCollection({
    ["/file"]: new RAM(),
    ["/folder/file2"]: new RAM()
});
```

* [.fromRandomAccessCollection](#Adapt.fromRandomAccessCollection) : <code>object</code>
    * [.exists(file)](#Adapt.fromRandomAccessCollection.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.get(file, [config])](#Adapt.fromRandomAccessCollection.get) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="Adapt.fromRandomAccessCollection.exists"></a>

#### fromRandomAccessCollection.exists(file) ⇒ <code>Promise.&lt;boolean&gt;</code>
Whether the file exists in collection. An empty file does not exist to this function.

**Kind**: static method of [<code>fromRandomAccessCollection</code>](#Adapt.fromRandomAccessCollection)  

| Param | Type |
| --- | --- |
| file | <code>string</code> | 

<a name="Adapt.fromRandomAccessCollection.get"></a>

#### fromRandomAccessCollection.get(file, [config]) ⇒ <code>Promise.&lt;\*&gt;</code>
Get the entire content of the file. **Careful** with big files.

**Kind**: static method of [<code>fromRandomAccessCollection</code>](#Adapt.fromRandomAccessCollection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| file | <code>string</code> |  |  |
| [config] |  |  |  |
| [config.encoding] |  | <code>&#x27;binary&#x27;</code> | Either a `string`, compact-encoding, or codec |

