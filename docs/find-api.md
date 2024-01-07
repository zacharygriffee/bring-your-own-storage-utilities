## Functions

<dl>
<dt><a href="#coercePathAbsolute">coercePathAbsolute(path, [sep])</a> ⇒ <code>string</code></dt>
<dd><p>Turns a path absolute, removing any prefixes and adding &#39;sep&#39; as a prefix</p>
</dd>
<dt><a href="#collectModules">collectModules()</a></dt>
<dd><p>Convenience async method for collectModules$</p>
</dd>
<dt><a href="#collectModules$">collectModules$(source, list, config)</a> ⇒</dt>
<dd><p>Finds module specifiers in list through node_modules in parent directories. Returns an object that contains the
main entry files (utf8 raw code) of the specified module where the key of this object is mapped by config.nameFormatHandler</p>
</dd>
<dt><a href="#createDataUri">createDataUri(content, config)</a> ⇒ <code>string</code></dt>
<dd><p>Create a data uri from source. Default behavior is to create from javascript file</p>
</dd>
<dt><a href="#createImportMapFromModules$">createImportMapFromModules$(source, list, config)</a> ⇒ <code>*</code></dt>
<dd><p>Create an import map that utilizes data-uri scripts from the module list specified.
For greatest success, each package.json of the library specifier in the list should have a browser field
that has a minified/bundled version of it. This will detect the exports conditions and choose the correct import
for the browser.</p>
</dd>
<dt><a href="#findDown">findDown()</a></dt>
<dd><p>Convenience async version of findDown$</p>
</dd>
<dt><a href="#findDown$">findDown$()</a></dt>
<dd><p>Convenience findDownMultiple$ that returns only one by default. Files are also merged into one array.</p>
</dd>
<dt><a href="#findDownMultiple$">findDownMultiple$(source, fileList, config)</a> ⇒</dt>
<dd><p>Traverses down directories of a source storage (child directories).</p>
<p>Files found will be absolute paths to the source&#39;s root.</p>
</dd>
<dt><a href="#findNodeModule$">findNodeModule$(source, names, config)</a> ⇒ <code>*</code></dt>
<dd><p>Finds a module from a node_module folder that may exist between the source root and cwd. The node_module folder must
have a package.json inside it to qualify as a node_module.</p>
</dd>
<dt><a href="#findNodeModule">findNodeModule(source, names, config)</a> ⇒ <code>*</code></dt>
<dd><p>Finds the node module paths of the inputted bare name specifiers.</p>
</dd>
<dt><a href="#findNodeModulesDirectory$">findNodeModulesDirectory$(source, config)</a> ⇒ <code>*</code></dt>
<dd><p>Find the closest node module directory from a nested cwd directory to the stopAt/root from source.</p>
</dd>
<dt><a href="#findNodeModulesDirectory">findNodeModulesDirectory(source, config)</a> ⇒ <code>*</code></dt>
<dd><p>Find the closest module directory from a nested cwd directory to the stopAt/root from source.</p>
</dd>
<dt><a href="#findPackageDirectory$">findPackageDirectory$(source, config)</a> ⇒</dt>
<dd><p>Simply put, it basically this: dirname(findPackageJson$) || &#39;/&#39;
Find directories up package.json resides in.</p>
<p>note: This emits each directory (the correct behavior) unlike the findPackageJson$ which is currently on todo list to change.</p>
</dd>
<dt><a href="#findPackageJson$">findPackageJson$(source, config)</a> ⇒</dt>
<dd><p>Find package.json files into the parent directories.</p>
</dd>
<dt><a href="#findPackageJson">findPackageJson()</a></dt>
<dd><p>Convenience async version of findPackageJson$. Will return an array of all packages found.</p>
</dd>
<dt><a href="#findUp">findUp()</a></dt>
<dd><p>Convenience async version of findUp$</p>
</dd>
<dt><a href="#findUp$">findUp$()</a></dt>
<dd><p>Convenience findUpMultiple$ that returns only one by default. Files are also merged into one array.</p>
</dd>
<dt><a href="#findUpMultiple$">findUpMultiple$(source, fileList, [fromDir], config)</a> ⇒</dt>
<dd><p>Traverses up directories of a source storage (parent directories).</p>
<p>Files found will be absolute paths to the source&#39;s root.</p>
</dd>
<dt><a href="#isAbsolute">isAbsolute(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Simple method to determine absolute path.</p>
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
<dt><a href="#isRelative">isRelative(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Simple method to determine relative path.</p>
</dd>
<dt><a href="#isRootFolder">isRootFolder([folder])</a> ⇒ <code>boolean</code></dt>
<dd><p>Determines if folder is root.</p>
</dd>
<dt><a href="#list$">list$()</a> ⇒ <code>*</code></dt>
<dd><p>Same as readdir$ but config.list = true</p>
</dd>
<dt><a href="#list">list()</a></dt>
<dd><p>Convenience async method for list$</p>
</dd>
<dt><a href="#loadAllScopedPackageJson">loadAllScopedPackageJson(source, config)</a> ⇒ <code>*</code></dt>
<dd><p>Loads all package.json between cwd and stopAt.</p>
</dd>
<dt><a href="#loadPackageJson">loadPackageJson(source, config)</a> ⇒ <code>*</code></dt>
<dd><p>Loads the immediate package.json from the cwd directory,</p>
</dd>
<dt><a href="#loadRootPackageJson">loadRootPackageJson(source, config)</a> ⇒ <code>*</code></dt>
<dd><p>Loads the root-most package.json (closest to the config.stopAt path)</p>
</dd>
<dt><a href="#loadPackageJson$">loadPackageJson$(source, config)</a> ⇒ <code>*</code></dt>
<dd><p>Loads package.json from immediate directories, each emission
a package.json parent to the former.</p>
</dd>
<dt><a href="#parseModuleSpecifier">parseModuleSpecifier(moduleId, config)</a> ⇒</dt>
<dd><p>Parses a npm module specifier.</p>
</dd>
<dt><a href="#pathDetail$">pathDetail$(sourceDrive, absolutePath)</a> ⇒ <code>*</code></dt>
<dd><p>Returns entry, isFile and isFolder of a path.</p>
</dd>
<dt><a href="#pathDetail">pathDetail()</a></dt>
<dd><p>Async convenience method for pathDetail$</p>
</dd>
<dt><a href="#readdir$">readdir$(source, config)</a> ⇒</dt>
<dd><p>readdir that wraps either  hyperdrive and hyperbee instance.
Aimed to handle hypercore and hyperbee. But, plan on support for more</p>
</dd>
<dt><a href="#toPath">toPath(urlOrPath)</a> ⇒ <code>string</code></dt>
<dd><p>Converts a file:// or buffer to path.</p>
</dd>
</dl>

<a name="coercePathAbsolute"></a>

## coercePathAbsolute(path, [sep]) ⇒ <code>string</code>
Turns a path absolute, removing any prefixes and adding 'sep' as a prefix

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| path |  | path to turn absolute |
| [sep] | <code>&quot;/&quot;</code> | a separator to use for prefixing. |

<a name="collectModules"></a>

## collectModules()
Convenience async method for collectModules$

**Kind**: global function  
<a name="collectModules$"></a>

## collectModules$(source, list, config) ⇒
Finds module specifiers in list through node_modules in parent directories. Returns an object that contains the
main entry files (utf8 raw code) of the specified module where the key of this object is mapped by config.nameFormatHandler

**Kind**: global function  
**Returns**: The entry points of each module of list.  
**See**: findUpMultiple$ and findNodeModule for additional configuration.  
**Todo**

- [ ] Handle different file encodings.


| Param | Default | Description |
| --- | --- | --- |
| source |  | a storage source with a (async or sync) get function |
| list |  | an array of [module specifiers](#parseModuleSpecifier) |
| config |  |  |
| [config.exportConditions] | <code>[&quot;browser&quot;, &quot;default&quot;, &quot;main&quot;]</code> | [Read about conditional exports of package.json](https://nodejs.org/api/packages.html#conditional-exports) |
| [config.nameFormatHandler] | <code>x &#x3D;&gt; camelCase(x)</code> | To mutate the name of the package to something else in the returned object. |
| [config.cwd] |  | The working directory |

<a name="createDataUri"></a>

## createDataUri(content, config) ⇒ <code>string</code>
Create a data uri from source. Default behavior is to create from javascript file

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| content |  | data |
| config |  |  |
| [config.mimeType] | <code>&quot;text/javascript&quot;</code> | the data type. |
| [config.encodingString] | <code>&quot;base64&quot;</code> | encoding |
| [config.charset] | <code>&quot;utf-8&quot;</code> | the charset |

<a name="createImportMapFromModules$"></a>

## createImportMapFromModules$(source, list, config) ⇒ <code>\*</code>
Create an import map that utilizes data-uri scripts from the module list specified.
For greatest success, each package.json of the library specifier in the list should have a browser field
that has a minified/bundled version of it. This will detect the exports conditions and choose the correct import
for the browser.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | storage source |
| list |  | a list of module specifiers to use |
| config |  |  |
| [config.createScriptEle] | <code>false</code> | Create the script element for html template file. |
| [config.entryName] | <code>&#x27;imports&#x27;</code> | Maybe you're not using this for html, create a different name for the 'imports' field                           of the import map. |
| [config.includeBook=] |  | Include additional uri or urls for the import map. Good place to add cdn links if necessary. |

**Example**  
```js
createImportMapFromModules$(myDrive, ["your-minified-library1", "your-minified-library2"], {
    includeBook: {
        "lodash-es": "https://esm.run/lodash-es"
    }
}).subscribe(
     (result) => {
         result =
             `
                 <script type="importmap">
                     {
                         imports: {
                             "yourMinifiedLibrary1": "...dataUri",
                             "yourMinifiedLibrary2": "...dataUri",
                             "lodash-es": "...dataUriOfLodash"
                         }
                     }
                 </script>>
             `
     }
);
```
<a name="findDown"></a>

## findDown()
Convenience async version of findDown$

**Kind**: global function  
<a name="findDown$"></a>

## findDown$()
Convenience findDownMultiple$ that returns only one by default. Files are also merged into one array.

**Kind**: global function  
<a name="findDownMultiple$"></a>

## findDownMultiple$(source, fileList, config) ⇒
Traverses down directories of a source storage (child directories).

Files found will be absolute paths to the source's root.

**Kind**: global function  
**Returns**: [[first directory depth list], [second directory depth list] ...] Each LEVEL represents the directory depth.  
**Todo**

- [ ] make config.readdir$ use this library readdir$ function


| Param | Default | Description |
| --- | --- | --- |
| source |  | A storage source. |
| fileList |  | A list of files to find. Each can be a glob pattern. **Be warned**, the more files and greater complexity warrants more search time. |
| config |  |  |
| [config.maxLevel] | <code>Infinity</code> | Max folder depth to search. |
| [config.minLevel] | <code>0</code> | Skip these many levels of directories. |
| [config.count] | <code>Infinity</code> | Max amount of files to find. |
| [config.filter] | <code></code> | Optional filter to apply to the file search. |
| [config.readdir$] |  | An rxjs observable that returns a list of files and folders from the source. Default behavior is to use source.readdir(path). |
| [config.cwd] |  | The working directory to begin searching downward. If omitted or null, will find the common dir in the fileList to begin. |
| [config.isFolderSelector] |  | Predicate of what entries are folders and what are not. Default behavior to treat any entry without an extension (e.g. .txt) a folder. |

<a name="findNodeModule$"></a>

## findNodeModule$(source, names, config) ⇒ <code>\*</code>
Finds a module from a node_module folder that may exist between the source root and cwd. The node_module folder must
have a package.json inside it to qualify as a node_module.

**Kind**: global function  
**See**: findUpMultiple$ for additional configuration.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A storage source. |
| names |  | A list of bare name specifiers to get their node_module path. |
| config |  | A config with cwd or a string of the nested directory to begin traversing up to find the node_module path. |
| [config.collapse] | <code>false</code> | Collapse results into single array still preserving order from the cwd down. |
| [config.cwd] |  | The working directory |

<a name="findNodeModule"></a>

## findNodeModule(source, names, config) ⇒ <code>\*</code>
Finds the node module paths of the inputted bare name specifiers.

**Kind**: global function  

| Param | Description |
| --- | --- |
| source | A hyper source. |
| names | A list of bare name specifiers to get their node_module path. |
| config |  |
| [config.cwd] | the working directory |

<a name="findNodeModulesDirectory$"></a>

## findNodeModulesDirectory$(source, config) ⇒ <code>\*</code>
Find the closest node module directory from a nested cwd directory to the stopAt/root from source.

**Kind**: global function  
**See**: findUpMultiple$ for additional configuration.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find node directory |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="findNodeModulesDirectory"></a>

## findNodeModulesDirectory(source, config) ⇒ <code>\*</code>
Find the closest module directory from a nested cwd directory to the stopAt/root from source.

**Kind**: global function  
**See**: findUpMultiple$ for additional configuration.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find node directory. |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="findPackageDirectory$"></a>

## findPackageDirectory$(source, config) ⇒
Simply put, it basically this: dirname(findPackageJson$) || '/'
Find directories up package.json resides in.

note: This emits each directory (the correct behavior) unlike the findPackageJson$ which is currently on todo list to change.

**Kind**: global function  
**Returns**: emits each directory found  

| Param | Description |
| --- | --- |
| source | A storage source |
| config | see findUpMultiple$.config |

<a name="findPackageJson$"></a>

## findPackageJson$(source, config) ⇒
Find package.json files into the parent directories.

**Kind**: global function  
**Returns**: an observable that emits the array of all packages <- should change to emit each file individually  
**Todo**

- [ ] change this to emit each file individually when found instead of array.


| Param | Description |
| --- | --- |
| source | A storage source |
| config | see findUpMultiple$.config |

<a name="findPackageJson"></a>

## findPackageJson()
Convenience async version of findPackageJson$. Will return an array of all packages found.

**Kind**: global function  
<a name="findUp"></a>

## findUp()
Convenience async version of findUp$

**Kind**: global function  
<a name="findUp$"></a>

## findUp$()
Convenience findUpMultiple$ that returns only one by default. Files are also merged into one array.

**Kind**: global function  
<a name="findUpMultiple$"></a>

## findUpMultiple$(source, fileList, [fromDir], config) ⇒
Traverses up directories of a source storage (parent directories).

Files found will be absolute paths to the source's root.

**Kind**: global function  
**Returns**: [[first directory list], [second directory list], [third directory list], ...]  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A storage source. |
| fileList |  | A list of files to find. Each can be a glob pattern. **Be warned**, the more files and greater complexity warrants more search time. |
| [fromDir] |  | The working directory to begin searching upward (fromDir ---> root directory). If omitted or null, will find the common dir in the fileList to begin. |
| config |  |  |
| [config.maxLevel] | <code>Infinity</code> | Max folder depth to search. |
| [config.minLevel] | <code>0</code> | Skip these many levels of directories. |
| [config.count] | <code>Infinity</code> | Max amount of files to find. |
| [config.filter] | <code></code> | Optional filter to apply to the file search. |
| [config.readdir$] |  | An rxjs observable that returns a list of files and folders from the source. Default behavior is to use source.readdir(path) |
| [config.cwd] |  | Alias to fromDir. The working directory to begin searching upward (fromDir ---> root directory). If omitted or null, will find the common dir in the fileList to begin. |

<a name="isAbsolute"></a>

## isAbsolute(x) ⇒ <code>boolean</code>
Simple method to determine absolute path.

**Kind**: global function  

| Param |
| --- |
| x | 

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

<a name="list$"></a>

## list$() ⇒ <code>\*</code>
Same as readdir$ but config.list = true

**Kind**: global function  
**See**: readdir$  
<a name="list"></a>

## list()
Convenience async method for list$

**Kind**: global function  
<a name="loadAllScopedPackageJson"></a>

## loadAllScopedPackageJson(source, config) ⇒ <code>\*</code>
Loads all package.json between cwd and stopAt.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. [config.query](config.query) is whether the source has the file; [config.getter](config.getter) actually loads the file data. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |
| [config.query] | <code>source.exists || !!source.get</code> | How to query if the package.json exists from the source. |

<a name="loadPackageJson"></a>

## loadPackageJson(source, config) ⇒ <code>\*</code>
Loads the immediate package.json from the cwd directory,

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. [config.query](config.query) is whether the source has the file; [config.getter](config.getter) actually loads the file data. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |
| [config.query] | <code>source.exists || !!source.get</code> | How to query if the package.json exists from the source. |

<a name="loadRootPackageJson"></a>

## loadRootPackageJson(source, config) ⇒ <code>\*</code>
Loads the root-most package.json (closest to the config.stopAt path)

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. [config.query](config.query) is whether the source has the file; [config.getter](config.getter) actually loads the file data. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |
| [config.query] | <code>source.exists || !!source.get</code> | How to query if the package.json exists from the source. |

<a name="loadPackageJson$"></a>

## loadPackageJson$(source, config) ⇒ <code>\*</code>
Loads package.json from immediate directories, each emission
a package.json parent to the former.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. [config.query](config.query) is whether the source has the file; [config.getter](config.getter) actually loads the file data. |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |
| [config.query] | <code>source.exists || !!source.get</code> | How to query if the package.json exists from the source. |

<a name="parseModuleSpecifier"></a>

## parseModuleSpecifier(moduleId, config) ⇒
Parses a npm module specifier.

**Kind**: global function  
**Returns**: Will return an object with various parts of the module specifier including a list of paths you could use, especially in the case where no extension is supplied  

| Param | Description |
| --- | --- |
| moduleId | Any npm module specifier. |
| config |  |
| [config.host] | If using a cdn, add a host to prefix to all possible paths. |
| [config.version] | If you want to return a specific version regardless of whether a version is used in specifier. |
| [config.path] | If you want to add a path, regardless of the path used in specifier |
| [config.type] | If using a cdn, this will be put between the host and the specifier e.g. cdn.jsdelivr.net/[type]/[specifier] . |
| [config.mapPath] | Optional mapping function for each path. Some cdn like jsdelivr suffix a +esm or unpkg suffix ?module to the path to get a different parsing of the module. Use map to add that if you need to. |

**Example**  
```js
{
    type,        // npm, gh only supply this if you're using cdn to build the paths list
    path         // /@someScope/someModule@5.5.5/somePath/index
    pathName     // /somePath/index
    namespace    // someScope
    scope        // someScope
    version      // 5.5.5
    module       // @someScope/someModule@5.5.5
    name         // someModule

                 // Paths will only include the host if the host is supplied
                 // Please try hard to supply filenames and extensions for all requires and imports in your modules
                 // this parser handles them but if you use a cdn or other those are network calls to would not be necessary.
                 // Most cases, this list will only contain one entry, but in case you come across bad behavior module specifier,
                 // which occurs in a lot of old libraries, you will have to try each.

    paths        // Array(6) [
                 //      // Example if host is defined.
                 //      https://unpkg.com/@someScope/someModule@5.5.5/somePath/index,
                 //      https://unpkg.com/@someScope/someModule@5.5.5/somePath/index.js,
                 //      // Example if type is defined which wouldn't work for unpkg.
                 //      https://unpkg.com/npm/@someScope/someModule@5.5.5/somePath/index.cjs,
                 //      https://unpkg.com/npm/@someScope/someModule@5.5.5/somePath/index.mjs,
                 //      // Example if host not defined for all paths of this list..
                 //      @someScope/someModule@5.5.5/somePath/index.json,
                 //      @someScope/someModule@5.5.5/somePath/index/
                 // ]
} = parseModuleSpecifier("@someScope/someModule@5.5.5/somePath/index", { host : "https://unpkg.com", type: "" });
```
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
<a name="readdir$"></a>

## readdir$(source, config) ⇒
readdir that wraps either  hyperdrive and hyperbee instance.
Aimed to handle hypercore and hyperbee. But, plan on support for more

**Kind**: global function  
**Returns**: observable emits files from the source.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | a hyperbee or hyperdrive (more coming) |
| config |  |  |
| [config.cwd] | <code>/</code> | Current working directory of the source. |
| [config.list] |  | Whether to get a detailed list of the files. |
| [config.recursive] |  | Whether to recursively dig into folders only applies if config.list is true |
| [config.trimPath] | <code>true</code> | To trim the path of any dots and slashes, a db may not start with the leading chars. This is default true because Hyperdrive handles path prefixes |

<a name="toPath"></a>

## toPath(urlOrPath) ⇒ <code>string</code>
Converts a file:// or buffer to path.

**Kind**: global function  
**Returns**: <code>string</code> - A path  

| Param | Type |
| --- | --- |
| urlOrPath | <code>string</code> \| <code>buffer</code> \| <code>URL</code> | 

