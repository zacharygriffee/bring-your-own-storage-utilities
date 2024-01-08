
# ADAPT API

## Functions

<dl>
<dt><a href="#fromRandomAccess">fromRandomAccess(randomAccessFunction, readdir$)</a></dt>
<dd><p>Wraps a function that makes random access storage instances. You have to supply the readdir mechanism here because
there is no standard for it.</p>
</dd>
<dt><a href="#fromRandomAccessCollection">fromRandomAccessCollection(collection)</a></dt>
<dd><p>Wraps a collection of random access storage instances to be used with this library.</p>
<p>Currently supported functions: exists, get, readdir,</p>
<p>It is <strong>not recommended</strong> to use with collections that have big files. For that, use
<a href="https://docs.holepunch.to/building-blocks/hypercore">hypercore</a>, or
<a href="https://docs.holepunch.to/helpers/corestore">corestore</a> or some other handler
of random-access-storage instances.</p>
</dd>
</dl>

<a name="fromRandomAccess"></a>

## fromRandomAccess(randomAccessFunction, readdir$)
Wraps a function that makes random access storage instances. You have to supply the readdir mechanism here because
there is no standard for it.

**Kind**: global function  
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

* [fromRandomAccess(randomAccessFunction, readdir$)](#fromRandomAccess)
    * [.get(file, [config])](#fromRandomAccess.get) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.exists(file, [config])](#fromRandomAccess.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="fromRandomAccess.get"></a>

### fromRandomAccess.get(file, [config]) ⇒ <code>Promise.&lt;\*&gt;</code>
Get the entire content of the file. **Careful** with big files.

**Kind**: static method of [<code>fromRandomAccess</code>](#fromRandomAccess)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| file | <code>string</code> |  | File name to get |
| [config] |  |  | as well as the configuration below, this is passed to the factory function. |
| [config.encoding] | <code>string</code> \| <code>Object</code> | <code>&quot;\&quot;utf8\&quot;&quot;</code> | Either a `string` or an object containing an `encode` and `decode` function. |

<a name="fromRandomAccess.exists"></a>

### fromRandomAccess.exists(file, [config]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Whether the file exists in collection. An empty file does not exist to this function.

**Kind**: static method of [<code>fromRandomAccess</code>](#fromRandomAccess)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | File name to check |
| [config] |  | a configuration object that is passed to the factory function |

<a name="fromRandomAccessCollection"></a>

## fromRandomAccessCollection(collection)
Wraps a collection of random access storage instances to be used with this library.

Currently supported functions: exists, get, readdir,

It is **not recommended** to use with collections that have big files. For that, use
[hypercore](https://docs.holepunch.to/building-blocks/hypercore), or
[corestore](https://docs.holepunch.to/helpers/corestore) or some other handler
of random-access-storage instances.

**Kind**: global function  
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

* [fromRandomAccessCollection(collection)](#fromRandomAccessCollection)
    * [.readdir([fromPath], [config])](#fromRandomAccessCollection.readdir) ⇒ <code>Readable</code>
    * [.exists(file)](#fromRandomAccessCollection.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.get(file, [config])](#fromRandomAccessCollection.get) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.readdir([fromPath], [config])](#fromRandomAccessCollection.readdir) ⇒ <code>Readable</code>

<a name="fromRandomAccessCollection.readdir"></a>

### fromRandomAccessCollection.readdir([fromPath], [config]) ⇒ <code>Readable</code>
Returns a readable stream of files in cwd

**Kind**: static method of [<code>fromRandomAccessCollection</code>](#fromRandomAccessCollection)  
**Returns**: <code>Readable</code> - A streamx readable stream that emits the values.  

| Param | Default | Description |
| --- | --- | --- |
| [fromPath] | <code>&quot;/&quot;</code> | A file path, defaults to root. |
| [config] |  |  |
| [config.cwd] |  | Same as fromPath |
| [config.recursive] | <code>false</code> | If true, cwd is ignored and all files in the collection are returned. |

<a name="fromRandomAccessCollection.exists"></a>

### fromRandomAccessCollection.exists(file) ⇒ <code>Promise.&lt;boolean&gt;</code>
Whether the file exists in collection. An empty file does not exist to this function.

**Kind**: static method of [<code>fromRandomAccessCollection</code>](#fromRandomAccessCollection)  

| Param | Type |
| --- | --- |
| file | <code>string</code> | 

<a name="fromRandomAccessCollection.get"></a>

### fromRandomAccessCollection.get(file, [config]) ⇒ <code>Promise.&lt;\*&gt;</code>
Get the entire content of the file. **Careful** with big files.

**Kind**: static method of [<code>fromRandomAccessCollection</code>](#fromRandomAccessCollection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| file | <code>string</code> |  |  |
| [config] |  |  |  |
| [config.encoding] | <code>string</code> \| <code>Object</code> | <code>&quot;\&quot;utf8\&quot;&quot;</code> | Either a `string` or an object containing an `encode` and `decode` function. |

<a name="fromRandomAccessCollection.readdir"></a>

### fromRandomAccessCollection.readdir([fromPath], [config]) ⇒ <code>Readable</code>
Returns a readable stream of files in cwd

**Kind**: static method of [<code>fromRandomAccessCollection</code>](#fromRandomAccessCollection)  
**Returns**: <code>Readable</code> - A streamx readable stream that emits the values.  

| Param | Default | Description |
| --- | --- | --- |
| [fromPath] | <code>&quot;/&quot;</code> | A file path, defaults to root. |
| [config] |  |  |
| [config.cwd] |  | Same as fromPath |
| [config.recursive] | <code>false</code> | If true, cwd is ignored and all files in the collection are returned. |

