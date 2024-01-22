
# RESOLVE API

<a name="Resolve"></a>

## Resolve : <code>object</code>
**Kind**: global namespace  

* [Resolve](#Resolve) : <code>object</code>
    * [.JsDelivr](#Resolve.JsDelivr) : <code>object</code>
        * [.exports.getModuleCode$(moduleId, config)](#Resolve.JsDelivr.exports.getModuleCode$) ⇒
        * [.exports.getPackageJson$(moduleId, config)](#Resolve.JsDelivr.exports.getPackageJson$)
        * [.exports.getPackageJson()](#Resolve.JsDelivr.exports.getPackageJson)
        * [.exports.exists$(moduleId, config)](#Resolve.JsDelivr.exports.exists$)
        * [.exports.exists()](#Resolve.JsDelivr.exports.exists)
        * [.exports.importModule$(moduleId, config)](#Resolve.JsDelivr.exports.importModule$)
        * [.exports.importModule()](#Resolve.JsDelivr.exports.importModule)
        * [.exports.getVersions$(bareModuleSpecifier)](#Resolve.JsDelivr.exports.getVersions$) ⇒
        * [.exports.get$(id)](#Resolve.JsDelivr.exports.get$) ⇒ <code>Observable.&lt;module&gt;</code>
        * [.exports.get()](#Resolve.JsDelivr.exports.get)
    * [.exports.collectModules()](#Resolve.exports.collectModules)
    * [.exports.collectModules$(source, list, config)](#Resolve.exports.collectModules$) ⇒
    * [.exports.createDataUri(content, config)](#Resolve.exports.createDataUri) ⇒ <code>string</code>
    * [.exports.createDataUri$()](#Resolve.exports.createDataUri$)
    * [.exports.createImportMapFromModules$(source, list, config)](#Resolve.exports.createImportMapFromModules$) ⇒ <code>\*</code>
    * [.exports.createImportMapFromModules()](#Resolve.exports.createImportMapFromModules)
    * [.exports.importCode(code, config)](#Resolve.exports.importCode) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.exports.importCode$()](#Resolve.exports.importCode$)
    * [.exports.inferCodeUrlOrModuleSpecifier(string)](#Resolve.exports.inferCodeUrlOrModuleSpecifier) ⇒ <code>Object</code>
    * [.exports.jsonParse(json)](#Resolve.exports.jsonParse) ⇒ <code>object</code>
    * [.exports.loadAllScopedPackageJson(source, config)](#Resolve.exports.loadAllScopedPackageJson) ⇒ <code>\*</code>
    * [.exports.loadPackageJson(source, config)](#Resolve.exports.loadPackageJson) ⇒ <code>\*</code>
    * [.exports.loadRootPackageJson(source, config)](#Resolve.exports.loadRootPackageJson) ⇒ <code>\*</code>
    * [.exports.loadPackageJson$(source, config)](#Resolve.exports.loadPackageJson$) ⇒ <code>\*</code>
    * [.exports.nodeLikeResolver$(sources, id, from, [config&#x3D;])](#Resolve.exports.nodeLikeResolver$) ⇒ <code>string</code> \| <code>config.state</code> \| <code>null</code>
    * [.exports.nodeLikeResolver()](#Resolve.exports.nodeLikeResolver)
    * [.exports.raceUrls$(urlArray, config)](#Resolve.exports.raceUrls$)
    * [.exports.raceUrls()](#Resolve.exports.raceUrls)

<a name="Resolve.JsDelivr"></a>

### Resolve.JsDelivr : <code>object</code>
**Kind**: static namespace of [<code>Resolve</code>](#Resolve)  

* [.JsDelivr](#Resolve.JsDelivr) : <code>object</code>
    * [.exports.getModuleCode$(moduleId, config)](#Resolve.JsDelivr.exports.getModuleCode$) ⇒
    * [.exports.getPackageJson$(moduleId, config)](#Resolve.JsDelivr.exports.getPackageJson$)
    * [.exports.getPackageJson()](#Resolve.JsDelivr.exports.getPackageJson)
    * [.exports.exists$(moduleId, config)](#Resolve.JsDelivr.exports.exists$)
    * [.exports.exists()](#Resolve.JsDelivr.exports.exists)
    * [.exports.importModule$(moduleId, config)](#Resolve.JsDelivr.exports.importModule$)
    * [.exports.importModule()](#Resolve.JsDelivr.exports.importModule)
    * [.exports.getVersions$(bareModuleSpecifier)](#Resolve.JsDelivr.exports.getVersions$) ⇒
    * [.exports.get$(id)](#Resolve.JsDelivr.exports.get$) ⇒ <code>Observable.&lt;module&gt;</code>
    * [.exports.get()](#Resolve.JsDelivr.exports.get)

<a name="Resolve.JsDelivr.exports.getModuleCode$"></a>

#### JsDelivr.exports.getModuleCode$(moduleId, config) ⇒
Get a module code from jsdelivr.

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
**Returns**: Observable<module>  

| Param | Default | Description |
| --- | --- | --- |
| moduleId |  | Specifier can be of formats: name@version/path @namespace/name@version/path and without path or specify the parts in the config. |
| config |  |  |
| config.version |  | Version of the module |
| config.path |  | Path of an aspect of the module. |
| [config.type] | <code>&quot;npm&quot;</code> | Either npm, gh, or other repos that jsdelivr supports |
| [config.timeout] | <code>60s</code> | Not implemented yet. |
| [config.parseToESM] | <code>true</code> | Whether to parse the module to ESM regardless of the javascript type. |

<a name="Resolve.JsDelivr.exports.getPackageJson$"></a>

#### JsDelivr.exports.getPackageJson$(moduleId, config)
Will get the 'root' package.json for the module specifier.
Does not currently get the 'parent most package.json'
TODO: get the parent most package.json from path.

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  

| Param |
| --- |
| moduleId | 
| config | 

<a name="Resolve.JsDelivr.exports.getPackageJson"></a>

#### JsDelivr.exports.getPackageJson()
Convenience async function of getPackageJson$

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
<a name="Resolve.JsDelivr.exports.exists$"></a>

#### JsDelivr.exports.exists$(moduleId, config)
Checks if the module exists on jsdelivr without downloading code.

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  

| Param | Type | Description |
| --- | --- | --- |
| moduleId | <code>string</code> | module specifier |
| config |  |  |

<a name="Resolve.JsDelivr.exports.exists"></a>

#### JsDelivr.exports.exists()
Convenience async method of checkModuleExists$

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
<a name="Resolve.JsDelivr.exports.importModule$"></a>

#### JsDelivr.exports.importModule$(moduleId, config)
Import a module by specifier, url, identifier.

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  

| Param | Default | Description |
| --- | --- | --- |
| moduleId |  | Specifier can be of formats: name@version/path @namespace/name@version/path and without path or specify the parts in the config. |
| config |  |  |
| config.version |  | Version of the module |
| config.path |  | Path of an aspect of the module. |
| [config.type] | <code>&quot;npm&quot;</code> | Either npm, gh, or other repos that jsdelivr supports |
| [config.timeout] | <code>60s</code> | Not implemented yet. |
| [config.parseToESM] | <code>true</code> | Whether to parse the module to ESM regardless of the javascript type. |

<a name="Resolve.JsDelivr.exports.importModule"></a>

#### JsDelivr.exports.importModule()
Convenience async method for importModule$

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
<a name="Resolve.JsDelivr.exports.getVersions$"></a>

#### JsDelivr.exports.getVersions$(bareModuleSpecifier) ⇒
Get versions of a module by its specifier.

This has a retry setting of every 3 seconds if connection fails up to 3 times. If it fails,
the observable will be emitted with empty array.

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
**Returns**: Observable<Object> An object containing the versions of this module.  

| Param |
| --- |
| bareModuleSpecifier | 

<a name="Resolve.JsDelivr.exports.get$"></a>

#### JsDelivr.exports.get$(id) ⇒ <code>Observable.&lt;module&gt;</code>
Get a module by module specifier (id) from jsdelivr

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
**Returns**: <code>Observable.&lt;module&gt;</code> - The module  

| Param | Description |
| --- | --- |
| id | module specifier |

<a name="Resolve.JsDelivr.exports.get"></a>

#### JsDelivr.exports.get()
Convenience async method of get$

**Kind**: static method of [<code>JsDelivr</code>](#Resolve.JsDelivr)  
<a name="Resolve.exports.collectModules"></a>

### Resolve.exports.collectModules()
Convenience async method for collectModules$

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
<a name="Resolve.exports.collectModules$"></a>

### Resolve.exports.collectModules$(source, list, config) ⇒
Finds module specifiers in list through node_modules in parent directories. Returns an object that contains the
main entry files (utf8 raw code) of the specified module where the key of this object is mapped by config.nameFormatHandler

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
**Returns**: The entry points of each module of list.  
**See**: findUpMultiple$ and findNodeModule for additional configuration.  
**Todo**

- [ ] Handle different file encodings.


| Param | Default | Description |
| --- | --- | --- |
| source |  | a storage source with a (async or sync) get function |
| list |  | an array of [module specifiers](parseModuleSpecifier) |
| config |  |  |
| [config.exportConditions] | <code>[&quot;browser&quot;, &quot;default&quot;, &quot;main&quot;]</code> | [Read about conditional exports of package.json](https://nodejs.org/api/packages.html#conditional-exports) |
| [config.nameFormatHandler] | <code>x &#x3D;&gt; camelCase(x)</code> | To mutate the name of the package to something else in the returned object. |
| [config.cwd] |  | The working directory |

<a name="Resolve.exports.createDataUri"></a>

### Resolve.exports.createDataUri(content, config) ⇒ <code>string</code>
Create a data uri from source. Default behavior is to create from javascript file

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| content |  | data |
| config |  |  |
| [config.mimeType] | <code>&quot;text/javascript&quot;</code> | the data type. |
| [config.encodingString] | <code>&quot;base64&quot;</code> | encoding |
| [config.charset] | <code>&quot;utf-8&quot;</code> | the charset |

<a name="Resolve.exports.createDataUri$"></a>

### Resolve.exports.createDataUri$()
Convenience rxjs observable for createDataUri

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
<a name="Resolve.exports.createImportMapFromModules$"></a>

### Resolve.exports.createImportMapFromModules$(source, list, config) ⇒ <code>\*</code>
Create an import map that utilizes data-uri scripts from the module list specified.
For greatest success, each package.json of the library specifier in the list should have a browser field
that has a minified/bundled version of it. This will detect the exports conditions and choose the correct import
for the browser.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | storage source |
| list |  | a list of module specifiers to use |
| config |  |  |
| [config.createScriptEle] | <code>false</code> | Create the script element for html template file. |
| [config.entryName] | <code>&#x27;imports&#x27;</code> | Maybe you're not using this for html, create a different name for the 'imports' field                           of the import map. |
| [config.includeBook=] |  | Include additional uri or urls for the import map. Good place to add cdn links if necessary. |
| [config.exportConditions] | <code>[&quot;browser&quot;, &quot;default&quot;, &quot;main&quot;]</code> | [Read about conditional exports of package.json](https://nodejs.org/api/packages.html#conditional-exports) |
| [config.nameFormatHandler] | <code>x &#x3D;&gt; camelCase(x)</code> | To mutate the name of the package to something else in the returned object. |
| [config.cwd] |  | The working directory |

**Example**  
```js
createImportMapFromModules$(myDrive, ["your-minified-library1", "your-minified-library2"], {
    includeBook: {
        "lodash-es": "https://esm.run/lodash-es"
    },
    createScriptEle: true
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
<a name="Resolve.exports.createImportMapFromModules"></a>

### Resolve.exports.createImportMapFromModules()
Convenience async method for createImportMapFromModules$

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
<a name="Resolve.exports.importCode"></a>

### Resolve.exports.importCode(code, config) ⇒ <code>Promise.&lt;\*&gt;</code>
Import virtual javascript module from string.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| code |  | data |
| config |  |  |
| [config.mimeType] | <code>&quot;text/javascript&quot;</code> | the data type. |
| [config.encodingString] | <code>&quot;base64&quot;</code> | encoding |
| [config.charset] | <code>&quot;utf-8&quot;</code> | the charset |

<a name="Resolve.exports.importCode$"></a>

### Resolve.exports.importCode$()
Convenience rxjs observable for importCode.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
<a name="Resolve.exports.inferCodeUrlOrModuleSpecifier"></a>

### Resolve.exports.inferCodeUrlOrModuleSpecifier(string) ⇒ <code>Object</code>
Get a module whether it is code, url, module specifier, path, svelte etc.

Cannot 'detect svelte code' can only detect whether url/path has an extension of '.svelte'.

Works almost all the time.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param |
| --- |
| string | 

<a name="Resolve.exports.jsonParse"></a>

### Resolve.exports.jsonParse(json) ⇒ <code>object</code>
Parses a string or buffer to JSON.

Node JSON.parse handles this properly, but some browsers do not, so this method makes sure that it does.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
**Returns**: <code>object</code> - THe parsed json.  

| Param | Type |
| --- | --- |
| json | <code>Buffer</code> \| <code>String</code> | 

<a name="Resolve.exports.loadAllScopedPackageJson"></a>

### Resolve.exports.loadAllScopedPackageJson(source, config) ⇒ <code>\*</code>
Loads all package.json between cwd and stopAt.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="Resolve.exports.loadPackageJson"></a>

### Resolve.exports.loadPackageJson(source, config) ⇒ <code>\*</code>
Loads the immediate package.json from the cwd directory,

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="Resolve.exports.loadRootPackageJson"></a>

### Resolve.exports.loadRootPackageJson(source, config) ⇒ <code>\*</code>
Loads the root-most package.json (closest to the config.stopAt path)

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |
| [config.query] | <code>source.exists || !!source.get</code> | How to query if the package.json exists from the source. |

<a name="Resolve.exports.loadPackageJson$"></a>

### Resolve.exports.loadPackageJson$(source, config) ⇒ <code>\*</code>
Loads package.json from immediate directories, each emission
a package.json parent to the former.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A hyper source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="Resolve.exports.nodeLikeResolver$"></a>

### Resolve.exports.nodeLikeResolver$(sources, id, from, [config&#x3D;]) ⇒ <code>string</code> \| <code>config.state</code> \| <code>null</code>
Resolve an id/from (files) from source storage.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
**Returns**: <code>string</code> \| <code>config.state</code> \| <code>null</code> - Observable<> The code from the resolution, [config.state](config.state) if [config.detailed](config.detailed)=true, or null,  
**Notes**: The behavior and config is modelled off of this pseudocode: https://nodejs.org/api/modules.html#all-together
Not supported yet: package.json imports field  

| Param | Default | Description |
| --- | --- | --- |
| sources |  | A list of sources to search for files. |
| id |  | The id of the file being imported |
| from |  | The id of the file that is importing 'id' |
| [config=] |  |  |
| [config.keyValueMode] |  | Not yet implemented ~~Set to true if the source is a key/value source or database that does not store keys like files. node_module resolution is disabled with this mode, and the default codec is changed to identity codec where the value of the key/value pair will be returned.~~ |
| [config.getter] | <code>source.get</code> | The getter to retrieve data/code from source. |
| [config.detailed] | <code>false</code> | If true, will return additional information about the resolution see: [config.state](config.state). |
| [config.state] |  | A mutable state object where additional information about the resolution will be added to and if [config.detailed](config.detailed) is true, state will be returned. The state will contain at very least success=true|undefined and the id that was resolved to |
| [config.encoding] |  | The encoding of the data/code from source. Defaults to utf8 ~~when keyValueMode=false, and to identity codec when keyValueMode=true~~. |
| [config.exportConditions] | <code>[&#x27;browser&#x27;, &#x27;default&#x27;]</code> | When resolving a directory with a package.json with an export field, what are the conditions for the export? |
| [config.tryExtensions] | <code>[&quot;&quot;, &quot;.js&quot;, &quot;.json&quot;, &quot;.mjs&quot;, &quot;/package.json&quot;]</code> | Suffixes and extensions in order will be tried in the resolution. |
| [config.tryIndex] | <code>[&quot;/index&quot;]</code> | If extensions and directories did not resolve, tryIndex + extensions |

<a name="Resolve.exports.nodeLikeResolver"></a>

### Resolve.exports.nodeLikeResolver()
Convenience async function for nodeLikeResolver$

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
<a name="Resolve.exports.raceUrls$"></a>

### Resolve.exports.raceUrls$(urlArray, config)
Races urls and downloads the winner.
This can be used with one singular url.

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
**Todo**

- [ ] Use 'header' http method if 'mustHaveDataToWin' is true instead of downloading each url.
- [ ] Add timeout configuration and status updates.
- [ ] swap to fetch instead of XMLHttpRequest


| Param | Default | Description |
| --- | --- | --- |
| urlArray |  | an array of url paths. |
| config |  |  |
| [config.mustHaveDataToWin] | <code>true</code> | Not Implemented yet. ~~Must have something in the 'data' key of the response object.~~ |
| [config.mustHaveConditionToWin] |  | Checks the download with the condition to determine whether it wins over other links. |
| [config.successCodes] |  | The success codes that url must have to qualify to win. |

<a name="Resolve.exports.raceUrls"></a>

### Resolve.exports.raceUrls()
Convenience async function for raceUrls$

**Kind**: static method of [<code>Resolve</code>](#Resolve)  
