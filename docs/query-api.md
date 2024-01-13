
# QUERY API

## Functions

<dl>
<dt><a href="#createReadStream$">createReadStream$()</a> ⇒</dt>
<dd><p>Convenience &#39;rxjs.Observable&#39; that wraps around <code>createReadStream</code>.</p>
</dd>
<dt><a href="#createReadStream">createReadStream(source, key, [config])</a> ⇒ <code>Readable</code></dt>
<dd><p>Creates a streamx.Readable stream of source&#39;s readstream of a key. If the source does not have read stream
will try and use a get function to pull resource.</p>
<p>Backpressure is not completely ironed out nor tested in many cases, especially when pulling from a source that
does not have a native createReadStream function e.g. one that only has source.get.</p>
</dd>
<dt><a href="#getEntry$">getEntry$(source, path, [config])</a></dt>
<dd><p>Gets the entry details of the file</p>
<ul>
<li>source should have either a <code>get</code> or <code>entry</code> function.</li>
<li>source should have a <code>readdir</code> function</li>
</ul>
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
</pre></dd>
<dt><a href="#getType$">getType$(source, key)</a> ⇒ <code>Observable.&lt;string&gt;</code></dt>
<dd><p>Gets the mime type of the file. This function analyzes the first 100 bytes of the file for the magic bytes, if it
cannot be determined by the byte data, it will then be inferred from the extension of the key. If still it cannot
be determined a null will be returned.</p>
</dd>
<dt><a href="#getType">getType()</a></dt>
<dd><p>A convenience async function for getType$</p>
</dd>
<dt><a href="#isAbsolute">isAbsolute(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Simple method to determine absolute path.</p>
</dd>
<dt><a href="#isRelative">isRelative(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Simple method to determine relative path.</p>
</dd>
<dt><a href="#isRootFolder">isRootFolder([folder])</a> ⇒ <code>boolean</code></dt>
<dd><p>Determines if folder is root.</p>
</dd>
<dt><a href="#isFile$">isFile$(driveSource, path)</a> ⇒ <code>Observable.&lt;boolean&gt;</code> | <code>Observable.&lt;boolean&gt;</code></dt>
<dd><p>Determines if from source this file exists.</p>
<p>** this may return false for empty files (0 bytes) on some sources **</p>
</dd>
<dt><a href="#isFile">isFile(driveSource, path)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Convenience async function for isFile$</p>
<p>** this may return false for empty files (0 bytes) on some sources **</p>
</dd>
<dt><a href="#isFolder">isFolder(driveSource, path)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Convenience async function for isFolder$. It will <strong>not</strong> test positive on some sources if the folder is empty.</p>
<p>** Empty folders will return false here **</p>
</dd>
<dt><a href="#isFolder$">isFolder$(driveSource, path)</a> ⇒ <code>Observable.&lt;boolean&gt;</code> | <code>Observable.&lt;boolean&gt;</code></dt>
<dd><p>Determines if from source this folder exists. It will <strong>not</strong> test positive on some sources if the folder is empty.</p>
<p>** Empty folders will return false here **</p>
<ul>
<li><input disabled="" type="checkbox"> create a selector function to override default check</li>
<li><input checked="" disabled="" type="checkbox"> incorporate readdir function from this library to support hyperbee file structures as well.</li>
</ul>
</dd>
<dt><a href="#pathDetail$">pathDetail$(sourceDrive, absolutePath)</a> ⇒ <code>*</code></dt>
<dd><p>Returns entry, isFile and isFolder of a path.</p>
<p>If it is a file, the mime-type will be determined via getType$</p>
<pre>
**isFile may return false for empty files (0 bytes) on some sources**
**isFolder will return false here folders that are empty**
</pre></dd>
<dt><a href="#pathDetail">pathDetail()</a></dt>
<dd><p>Async convenience method for pathDetail$
** isFile may return false for empty files (0 bytes) on some sources **
** isFolder will return false here folders that are empty **</p>
</dd>
</dl>

<a name="createReadStream$"></a>

## createReadStream$() ⇒
Convenience 'rxjs.Observable' that wraps around `createReadStream`.

**Kind**: global function  
**Returns**: Observable<Buffer>  
<a name="createReadStream"></a>

## createReadStream(source, key, [config]) ⇒ <code>Readable</code>
Creates a streamx.Readable stream of source's readstream of a key. If the source does not have read stream
will try and use a get function to pull resource.

Backpressure is not completely ironed out nor tested in many cases, especially when pulling from a source that
does not have a native createReadStream function e.g. one that only has source.get.

**Kind**: global function  
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

<a name="getEntry$"></a>

## getEntry$(source, path, [config])
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

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | source |
| path | <code>string</code> |  | path from the cwd |
| [config] |  |  |  |
| [config.cwd] | <code>string</code> | <code>&quot;/&quot;</code> | cwd to resolve the path to |
| [config.entrySelector] |  |  | Use your own selector to return information about a file, the bare minimum should be what is shown above to best interface with the other functions of this library. The entrySelector function will have three arguments, (source, path, config). This function will be coerced async if it isn't already. The default selector requires the source to have either an entry function or a get function. A get function is literally getting the contents of the file and analyzing it while an entry file gets the details of the file. So, storages with entry function are way more performant in these queries. |

<a name="getType$"></a>

## getType$(source, key) ⇒ <code>Observable.&lt;string&gt;</code>
Gets the mime type of the file. This function analyzes the first 100 bytes of the file for the magic bytes, if it
cannot be determined by the byte data, it will then be inferred from the extension of the key. If still it cannot
be determined a null will be returned.

**Kind**: global function  

| Param | Description |
| --- | --- |
| source | The source |
| key | The key or filename or indexor of the resource. |

<a name="getType"></a>

## getType()
A convenience async function for getType$

**Kind**: global function  
<a name="isAbsolute"></a>

## isAbsolute(x) ⇒ <code>boolean</code>
Simple method to determine absolute path.

**Kind**: global function  

| Param |
| --- |
| x | 

<a name="isRelative"></a>

## isRelative(x) ⇒ <code>boolean</code>
Simple method to determine relative path.

**Kind**: global function  

| Param |
| --- |
| x | 

<a name="isRootFolder"></a>

## isRootFolder([folder]) ⇒ <code>boolean</code>
Determines if folder is root.

**Kind**: global function  

| Param | Default |
| --- | --- |
| [folder] | <code>&quot;/&quot;</code> | 

<a name="isFile$"></a>

## isFile$(driveSource, path) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
Determines if from source this file exists.

** this may return false for empty files (0 bytes) on some sources **

**Kind**: global function  
**Todo**

- [ ] create a selector function to override default check


| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="isFile"></a>

## isFile(driveSource, path) ⇒ <code>Promise.&lt;boolean&gt;</code>
Convenience async function for isFile$

** this may return false for empty files (0 bytes) on some sources **

**Kind**: global function  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="isFolder"></a>

## isFolder(driveSource, path) ⇒ <code>Promise.&lt;boolean&gt;</code>
Convenience async function for isFolder$. It will **not** test positive on some sources if the folder is empty.

** Empty folders will return false here **

**Kind**: global function  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="isFolder$"></a>

## isFolder$(driveSource, path) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
Determines if from source this folder exists. It will **not** test positive on some sources if the folder is empty.

** Empty folders will return false here **

- [ ] create a selector function to override default check
- [x] incorporate readdir function from this library to support hyperbee file structures as well.

**Kind**: global function  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="pathDetail$"></a>

## pathDetail$(sourceDrive, absolutePath) ⇒ <code>\*</code>
Returns entry, isFile and isFolder of a path.

If it is a file, the mime-type will be determined via getType$

<pre>
**isFile may return false for empty files (0 bytes) on some sources**
**isFolder will return false here folders that are empty**
</pre>

**Kind**: global function  

| Param | Description |
| --- | --- |
| sourceDrive |  |
| absolutePath | An absolute path to retrieve detail. |

**Example**  
```js
pathDetail$(drive, "/some/path/to/file.txt").subscribe(
     {
         isFolder: false,
         isFile: true,
         type: text/plain // if file, mime type, if folder, undefined
     }
);
```
<a name="pathDetail"></a>

## pathDetail()
Async convenience method for pathDetail$
** isFile may return false for empty files (0 bytes) on some sources **
** isFolder will return false here folders that are empty **

**Kind**: global function  
