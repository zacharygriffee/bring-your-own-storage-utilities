## Functions

<dl>
<dt><a href="#nodeLikeResolver$">nodeLikeResolver$(sources, id, from, [config&#x3D;])</a> ⇒ <code>string</code> | <code>config.state</code> | <code>null</code></dt>
<dd><p>Resolve an id/from (files) from source storage.</p>
</dd>
<dt><a href="#nodeLikeResolver">nodeLikeResolver()</a></dt>
<dd><p>Convenience async function for nodeLikeResolver$</p>
</dd>
</dl>

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
