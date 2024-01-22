
# FIND API

<a name="Find"></a>

## Find : <code>object</code>
**Kind**: global namespace  

* [Find](#Find) : <code>object</code>
    * [.exports.coercePathAbsolute(path, [sep])](#Find.exports.coercePathAbsolute) ⇒ <code>string</code>
    * [.exports.findDown()](#Find.exports.findDown)
    * [.exports.findDown$()](#Find.exports.findDown$)
    * [.exports.findDownMultiple$(source, fileList, config)](#Find.exports.findDownMultiple$) ⇒
    * [.exports.findUp()](#Find.exports.findUp)
    * [.exports.findUp$()](#Find.exports.findUp$)
    * [.exports.findUpMultiple$(source, fileList, [fromDir], config)](#Find.exports.findUpMultiple$) ⇒
    * [.exports.findNodeModule$(source, names, config)](#Find.exports.findNodeModule$) ⇒ <code>\*</code>
    * [.exports.findNodeModule(source, names, config)](#Find.exports.findNodeModule) ⇒ <code>\*</code>
    * [.exports.findNodeModulesDirectory$(source, config)](#Find.exports.findNodeModulesDirectory$) ⇒ <code>\*</code>
    * [.exports.findNodeModulesDirectory(source, config)](#Find.exports.findNodeModulesDirectory) ⇒ <code>\*</code>
    * [.exports.findPackageDirectory$(source, config)](#Find.exports.findPackageDirectory$) ⇒
    * [.exports.findPackageJson$(source, config)](#Find.exports.findPackageJson$) ⇒
    * [.exports.findPackageJson()](#Find.exports.findPackageJson)
    * [.exports.parseModuleSpecifier(moduleId, config)](#Find.exports.parseModuleSpecifier) ⇒
    * [.exports.toPath(urlOrPath)](#Find.exports.toPath) ⇒ <code>string</code>

<a name="Find.exports.coercePathAbsolute"></a>

### Find.exports.coercePathAbsolute(path, [sep]) ⇒ <code>string</code>
Turns a path absolute, removing any prefixes and adding 'sep' as a prefix

**Kind**: static method of [<code>Find</code>](#Find)  

| Param | Default | Description |
| --- | --- | --- |
| path |  | path to turn absolute |
| [sep] | <code>&quot;/&quot;</code> | a separator to use for prefixing. |

<a name="Find.exports.findDown"></a>

### Find.exports.findDown()
Convenience async version of findDown$

**Kind**: static method of [<code>Find</code>](#Find)  
<a name="Find.exports.findDown$"></a>

### Find.exports.findDown$()
Convenience findDownMultiple$ that returns only one by default. Files are also merged into one array.

**Kind**: static method of [<code>Find</code>](#Find)  
<a name="Find.exports.findDownMultiple$"></a>

### Find.exports.findDownMultiple$(source, fileList, config) ⇒
Traverses down directories of a source storage (child directories).

Files found will be absolute paths to the source's root.

**Kind**: static method of [<code>Find</code>](#Find)  
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
| [config.isFolderSelector] |  | Predicate of what entries are folders and what are not. Default behavior to treat any entry without an extension (e.g. .txt) a folder and a folder must also have at least one file somewhere as a dependent of it. e.g. empty folders with no files should **not** show up. |

<a name="Find.exports.findUp"></a>

### Find.exports.findUp()
Convenience async version of findUp$

**Kind**: static method of [<code>Find</code>](#Find)  
<a name="Find.exports.findUp$"></a>

### Find.exports.findUp$()
Convenience findUpMultiple$ that returns only one by default. Files are also merged into one array.

**Kind**: static method of [<code>Find</code>](#Find)  
<a name="Find.exports.findUpMultiple$"></a>

### Find.exports.findUpMultiple$(source, fileList, [fromDir], config) ⇒
Traverses up directories of a source storage (parent directories).

Files found will be absolute paths to the source's root.

**Kind**: static method of [<code>Find</code>](#Find)  
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

<a name="Find.exports.findNodeModule$"></a>

### Find.exports.findNodeModule$(source, names, config) ⇒ <code>\*</code>
Finds a module from a node_module folder that may exist between the source root and cwd. The node_module folder must
have a package.json inside it to qualify as a node_module.

**Kind**: static method of [<code>Find</code>](#Find)  
**See**: findUpMultiple$ for additional configuration.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A storage source. |
| names |  | A list of bare name specifiers to get their node_module path. |
| config |  | A config with cwd or a string of the nested directory to begin traversing up to find the node_module path. |
| [config.collapse] | <code>false</code> | Collapse results into single array still preserving order from the cwd down. |
| [config.cwd] |  | The working directory |

<a name="Find.exports.findNodeModule"></a>

### Find.exports.findNodeModule(source, names, config) ⇒ <code>\*</code>
Finds the node module paths of the inputted bare name specifiers.

**Kind**: static method of [<code>Find</code>](#Find)  

| Param | Description |
| --- | --- |
| source | A hyper source. |
| names | A list of bare name specifiers to get their node_module path. |
| config |  |
| [config.cwd] | the working directory |

<a name="Find.exports.findNodeModulesDirectory$"></a>

### Find.exports.findNodeModulesDirectory$(source, config) ⇒ <code>\*</code>
Find the closest node module directory from a nested cwd directory to the stopAt/root from source.

**Kind**: static method of [<code>Find</code>](#Find)  
**See**: findUpMultiple$ for additional configuration.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find node directory |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="Find.exports.findNodeModulesDirectory"></a>

### Find.exports.findNodeModulesDirectory(source, config) ⇒ <code>\*</code>
Find the closest module directory from a nested cwd directory to the stopAt/root from source.

**Kind**: static method of [<code>Find</code>](#Find)  
**See**: findUpMultiple$ for additional configuration.  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find node directory. |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="Find.exports.findPackageDirectory$"></a>

### Find.exports.findPackageDirectory$(source, config) ⇒
Simply put, it basically this: dirname(findPackageJson$) || '/'
Find directories up package.json resides in.

note: This emits each directory (the correct behavior) unlike the findPackageJson$ which is currently on todo list to change.

**Kind**: static method of [<code>Find</code>](#Find)  
**Returns**: emits each directory found  

| Param | Description |
| --- | --- |
| source | A storage source |
| config | see findUpMultiple$.config |

<a name="Find.exports.findPackageJson$"></a>

### Find.exports.findPackageJson$(source, config) ⇒
Find package.json files into the parent directories.

**Kind**: static method of [<code>Find</code>](#Find)  
**Returns**: an observable that emits the array of all packages <- should change to emit each file individually  
**Todo**

- [ ] change this to emit each file individually when found instead of array.


| Param | Description |
| --- | --- |
| source | A storage source |
| config | see findUpMultiple$.config |

<a name="Find.exports.findPackageJson"></a>

### Find.exports.findPackageJson()
Convenience async version of findPackageJson$. Will return an array of all packages found.

**Kind**: static method of [<code>Find</code>](#Find)  
<a name="Find.exports.parseModuleSpecifier"></a>

### Find.exports.parseModuleSpecifier(moduleId, config) ⇒
Parses a npm module specifier.

**Kind**: static method of [<code>Find</code>](#Find)  
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
<a name="Find.exports.toPath"></a>

### Find.exports.toPath(urlOrPath) ⇒ <code>string</code>
Converts a file:// to path if it is one.

**Kind**: static method of [<code>Find</code>](#Find)  
**Returns**: <code>string</code> - A path  

| Param | Type |
| --- | --- |
| urlOrPath | <code>string</code> \| <code>buffer</code> \| <code>URL</code> | 

