
# QUERY API

## Functions

<dl>
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
</dd>
<dt><a href="#isFile">isFile(driveSource, path)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Convenience async function for isFile$</p>
</dd>
<dt><a href="#isFolder">isFolder(driveSource, path)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Convenience async function for isFolder$. It will <strong>not</strong> test positive on some sources if the folder is empty.</p>
</dd>
<dt><a href="#isFolder$">isFolder$(driveSource, path)</a> ⇒ <code>Observable.&lt;boolean&gt;</code> | <code>Observable.&lt;boolean&gt;</code></dt>
<dd><p>Determines if from source this folder exists. It will <strong>not</strong> test positive on some sources if the folder is empty.</p>
</dd>
<dt><a href="#pathDetail$">pathDetail$(sourceDrive, absolutePath)</a> ⇒ <code>*</code></dt>
<dd><p>Returns entry, isFile and isFolder of a path.</p>
</dd>
<dt><a href="#pathDetail">pathDetail()</a></dt>
<dd><p>Async convenience method for pathDetail$</p>
</dd>
</dl>

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

**Kind**: global function  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="isFolder"></a>

## isFolder(driveSource, path) ⇒ <code>Promise.&lt;boolean&gt;</code>
Convenience async function for isFolder$. It will **not** test positive on some sources if the folder is empty.

**Kind**: global function  

| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="isFolder$"></a>

## isFolder$(driveSource, path) ⇒ <code>Observable.&lt;boolean&gt;</code> \| <code>Observable.&lt;boolean&gt;</code>
Determines if from source this folder exists. It will **not** test positive on some sources if the folder is empty.

**Kind**: global function  
**Todo**

- [ ] create a selector function to override default check
- [ ] incorporate readdir function from this library to support hyperbee file structures as well.


| Param | Description |
| --- | --- |
| driveSource | The source should have either an async/sync 'exists' function or an 'entry' function |
| path |  |

<a name="pathDetail$"></a>

## pathDetail$(sourceDrive, absolutePath) ⇒ <code>\*</code>
Returns entry, isFile and isFolder of a path.

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
         entry: {} // Depends on source.entry.
                   // Will also be empty object if source does not have entry function
     }
);
```
<a name="pathDetail"></a>

## pathDetail()
Async convenience method for pathDetail$

**Kind**: global function  