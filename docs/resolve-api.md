
# RESOLVE API

## Functions

<dl>
<dt><a href="#collectModules">collectModules()</a></dt>
<dd><p>Convenience async method for collectModules$</p>
</dd>
<dt><a href="#collectModules$">collectModules$(source, list, config)</a> ⇒</dt>
<dd><p>Finds module specifiers in list through node_modules in parent directories. Returns an object that contains the
main entry files (utf8 raw code) of the specified module where the key of this object is mapped by config.nameFormatHandler</p>
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
<dt><a href="#nodeLikeResolver$">nodeLikeResolver$(sources, id, from, [config&#x3D;])</a> ⇒ <code>string</code> | <code>config.state</code> | <code>null</code></dt>
<dd><p>Resolve an id/from (files) from source storage.</p>
</dd>
<dt><a href="#nodeLikeResolver">nodeLikeResolver()</a></dt>
<dd><p>Convenience async function for nodeLikeResolver$</p>
</dd>
</dl>

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
| list |  | an array of [module specifiers](parseModuleSpecifier) |
| config |  |  |
| [config.exportConditions] | <code>[&quot;browser&quot;, &quot;default&quot;, &quot;main&quot;]</code> | [Read about conditional exports of package.json](https://nodejs.org/api/packages.html#conditional-exports) |
| [config.nameFormatHandler] | <code>x &#x3D;&gt; camelCase(x)</code> | To mutate the name of the package to something else in the returned object. |
| [config.cwd] |  | The working directory |

<a name="loadAllScopedPackageJson"></a>

## loadAllScopedPackageJson(source, config) ⇒ <code>\*</code>
Loads all package.json between cwd and stopAt.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A source that has a getter. |
| config |  | Either a string representing cwd or a config. |
| config.cwd |  | The nested directory to begin traversing up to find package.json |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

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
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="loadRootPackageJson"></a>

## loadRootPackageJson(source, config) ⇒ <code>\*</code>
Loads the root-most package.json (closest to the config.stopAt path)

**Kind**: global function  

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
| [config.getter] | <code>source.get</code> | The getter that retrieves the data from the source by the key resolved. |
| [config.stopAt] | <code>root</code> | The directory to stop traversing up to. Default is the root of the source. |
| [config.predicate] |  | A predicate to filter package.json files. |
| [config.trimPath] | <code>true</code> | Will trim any paths of any slashes or dots. Not thoroughly tested. |

<a name="nodeLikeResolver$"></a>

## nodeLikeResolver$(sources, id, from, [config&#x3D;]) ⇒ <code>string</code> \| <code>config.state</code> \| <code>null</code>
Resolve an id/from (files) from source storage.

**Kind**: global function  
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

<a name="nodeLikeResolver"></a>

## nodeLikeResolver()
Convenience async function for nodeLikeResolver$

**Kind**: global function  
