
# DEPLOY API

## Functions

<dl>
<dt><a href="#createDataUri">createDataUri(content, config)</a> ⇒ <code>string</code></dt>
<dd><p>Create a data uri from source. Default behavior is to create from javascript file</p>
</dd>
<dt><a href="#createImportMapFromModules$">createImportMapFromModules$(source, list, config)</a> ⇒ <code>*</code></dt>
<dd><p>Create an import map that utilizes data-uri scripts from the module list specified.
For greatest success, each package.json of the library specifier in the list should have a browser field
that has a minified/bundled version of it. This will detect the exports conditions and choose the correct import
for the browser.</p>
</dd>
<dt><a href="#importCode">importCode(code, config)</a> ⇒ <code>string</code></dt>
<dd><p>Import virtual javascript module from string.</p>
</dd>
<dt><a href="#rollup$">rollup$(entry, config)</a></dt>
<dd><p>Bundle rollup$. I add the deploy.couldntResolve plugin
for ease of development to determine what ids don&#39;t work. This maybe important to keep for peer to peer
development when sources may not be always available.</p>
<p>It uses rxjs to emit.</p>
</dd>
<dt><a href="#generate$">generate$(outputName, bundle$, outputConfig)</a></dt>
<dd><p>After the &#39;rollup$&#39; generate is next. Pipe what the rollup$ does to the generate$</p>
<p>e.g. rollup$.pipe(rx.switchMap((bundle) =&gt; generate$(bundle)));</p>
</dd>
<dt><a href="#pack$">pack$(entryName, [outputName], [config])</a></dt>
<dd><p>This is a wrapper and convenience for the rollup$ and generate$ function.</p>
</dd>
<dt><a href="#pack">pack()</a></dt>
<dd><p>Convenience async method for pack$</p>
</dd>
<dt><a href="#couldntResolve">couldntResolve(cb)</a></dt>
<dd><p>Built in to deploy.pack but it tells you what id doesn&#39;t resolve in the case of error.
This is especially helpful when building in browser.</p>
</dd>
<dt><a href="#rollupExternalGlobalsPlugin">rollupExternalGlobalsPlugin(globals, [config])</a></dt>
<dd><p>Replace imports with a variable that is in global scope.</p>
</dd>
<dt><a href="#rollupFromSourcePlugin">rollupFromSourcePlugin(source, config)</a></dt>
<dd><p>Rollup scripts from a drive source that has <code>get</code> and <code>readdir</code> function.</p>
<p>Does not currently support code splitting which is something I am very adamant to support.</p>
</dd>
<dt><a href="#rollupReplaceThesePlugin">rollupReplaceThesePlugin(globBook)</a> ⇒ <code>string</code> | <code>Object</code></dt>
<dd><p>Will replace keys with ids.</p>
</dd>
<dt><a href="#rollupVirtualPlugin">rollupVirtualPlugin(codeBook, config)</a></dt>
<dd><p>Rollup virtual code from an object of key/value where key is the module specifier or file name of the code, and value
is where the code of the module is. Imports work as well, where you can import from another virtual or from an id
from other parts of the rollup.</p>
</dd>
<dt><a href="#rollupVirtualExports">rollupVirtualExports(entryName, exportBook, config)</a> ⇒ <code>Object</code></dt>
<dd><p>Concatenation of exports.</p>
<p>Similar to rollupVirtual but takes an entryName and a book of key / values where key is the export name
and value is the module specifier to pull from. Sometimes all you need is to remap exports.</p>
</dd>
</dl>

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
<a name="importCode"></a>

## importCode(code, config) ⇒ <code>string</code>
Import virtual javascript module from string.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| code |  | data |
| config |  |  |
| [config.mimeType] | <code>&quot;text/javascript&quot;</code> | the data type. |
| [config.encodingString] | <code>&quot;base64&quot;</code> | encoding |
| [config.charset] | <code>&quot;utf-8&quot;</code> | the charset |

<a name="rollup$"></a>

## rollup$(entry, config)
Bundle rollup$. I add the deploy.couldntResolve plugin
for ease of development to determine what ids don't work. This maybe important to keep for peer to peer
development when sources may not be always available.

It uses rxjs to emit.

**Kind**: global function  
**See**: https://rollupjs.org/javascript-api/  

| Param | Description |
| --- | --- |
| entry | the rollup config.input field. Multiple entry points not supported by byosu functions, so simply a string where to begin bundling. |
| config | https://rollupjs.org/javascript-api/ |

<a name="generate$"></a>

## generate$(outputName, bundle$, outputConfig)
After the 'rollup$' generate is next. Pipe what the rollup$ does to the generate$

e.g. rollup$.pipe(rx.switchMap((bundle) => generate$(bundle)));

**Kind**: global function  
**Todo**

- [ ] support source maps

These rollup.option configurations **are not optional** for this to work with byosu and you won't be able to change
them here. If you absolutely need to, deploy exports vanilla rollup if you want to get it to work.

- inlineDynamicImports = true    // byosu doesn't support code splitting yet, so keep this true
- format = esm                   // this is a must for byosu . You should just stop with cjs, just saying.
- exports = "named"


| Param | Description |
| --- | --- |
| outputName | What name to output the bundle to. |
| bundle$ | Bundle from any rollup versions including deploy.rollup$. This can be either an observable, or just the bundle. |
| outputConfig | Output configuration https://rollupjs.org/javascript-api/ |

<a name="pack$"></a>

## pack$(entryName, [outputName], [config])
This is a wrapper and convenience for the rollup$ and generate$ function.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| entryName |  | The entry point to begin bundling. Multiple entry points not supported and not planned to be supported. |
| [outputName] |  | Choose the output name, default is [entryName]-bundle.js |
| [config] |  | The [configuration for rollup](https://rollupjs.org/javascript-api/), in addition to the following. |
| [config.autoImport] | <code>false</code> | Will auto import the module into 'module' field. Make sure you trust the modules and source of modules as this can create similar security issues as `eval`. As well, turning this to true will make the result object not serializable. |
| [config.createUri] | <code>true</code> | Will automatically create [data-uri](#createDataUri) of the bundle for you to share or pack up to an importmap or just execute it by const yourBundledModule = await import(bundleResult.uri). If your bundling something very large, you should probably turn this off, as this could be very taxing to memory and space. |
| [config.libraryName] |  | This is really metadata for end-user to add to the bundle result. This helped me to index in some situations. |

<a name="pack"></a>

## pack()
Convenience async method for pack$

**Kind**: global function  
<a name="couldntResolve"></a>

## couldntResolve(cb)
Built in to deploy.pack but it tells you what id doesn't resolve in the case of error.
This is especially helpful when building in browser.

**Kind**: global function  

| Param | Description |
| --- | --- |
| cb | You handle how to display or communicate the id that doesn't resolve. |

**Example**  
```js
couldntResolve((result) => {
    console.error("Couldn't resolve id", result.id, result.from, result);
})
```
<a name="rollupExternalGlobalsPlugin"></a>

## rollupExternalGlobalsPlugin(globals, [config])
Replace imports with a variable that is in global scope.

**Kind**: global function  
**See**: https://github.com/zacharygriffee/rollup-plugin-external-globals  

| Param | Description |
| --- | --- |
| globals | is a moduleId/variableName map. |
| [config] |  |
| [config.include] | is an array of glob patterns. If defined, only matched files would be transformed. |
| [config.exclude] | an array of glob patterns. Matched files would not be transformed. |
| [config.dynamicWrapper] | is used to specify dynamic imports. |

**Example**  
```js
{
    entry: "main.js",
    plugins: [
        rollupVirtual(
            {
                "the-answer": `
  import theAnswer from "some-mysterious-place";
  globalThis.deepThought = 42;
  export default theAnswer;
  `
            }
        ),
        externalGlobals(
            {
                // This replaces the import above with the global var deepThought
                "some-mysterious-place": "deepThought"
            }
        )
    ]
}
```
<a name="rollupFromSourcePlugin"></a>

## rollupFromSourcePlugin(source, config)
Rollup scripts from a drive source that has `get` and `readdir` function.

Does not currently support code splitting which is something I am very adamant to support.

**Kind**: global function  
**Todo**

- [ ] support code splitting


| Param | Default | Description |
| --- | --- | --- |
| source |  | A source that has at least a `get` and `readdir` function |
| config |  |  |
| [config.asInput] | <code>true</code> | Whether this source serves as an input of scripts. |
| [config.asOutput] | <code>!!source.put</code> | Whether this source serves as an output of the bundle. Currently, only supports sources with a put function. Will automatically detect whether the source has put function. This will detect the output name from the rollup.output configuration. |
| [config.excludes] |  | Exclude ids / specifiers from being imported from this source. |
| [config.jsCode] |  | Mapper to handle post processing of code before being sent to the output source. |

<a name="rollupReplaceThesePlugin"></a>

## rollupReplaceThesePlugin(globBook) ⇒ <code>string</code> \| <code>Object</code>
Will replace keys with ids.

**Kind**: global function  

| Param | Description |
| --- | --- |
| globBook | A key/value of glob in which to replace, and the id/moduleName to replace it with. |

<a name="rollupVirtualPlugin"></a>

## rollupVirtualPlugin(codeBook, config)
Rollup virtual code from an object of key/value where key is the module specifier or file name of the code, and value
is where the code of the module is. Imports work as well, where you can import from another virtual or from an id
from other parts of the rollup.

**Kind**: global function  

| Param | Description |
| --- | --- |
| codeBook | a key/value of module specifier / string code |
| config |  |

**Example**  
```js
{
    entry: "main.js",
    plugins: [
        rollupVirtual(
            {
                "the-answer": "default export 42",
                "main.js": `export {default as theAnswer} from 'the-answer';`
            }
        )
    ]
}
```
<a name="rollupVirtualExports"></a>

## rollupVirtualExports(entryName, exportBook, config) ⇒ <code>Object</code>
Concatenation of exports.

Similar to rollupVirtual but takes an entryName and a book of key / values where key is the export name
and value is the module specifier to pull from. Sometimes all you need is to remap exports.

**Kind**: global function  

| Param | Description |
| --- | --- |
| entryName | The module specifier you choose to name this concatenation of exports. |
| exportBook | A key/value object with exportName/moduleSpecifierSource. |
| config |  |
| [config.header] | Code to add before all the exports. |
| [config.footer] | Code to add after all the exports. |

**Example**  
```js
{
    plugins: [
        rollupVirtual(
            "bigBloatedExports.js"
            {
                "theAnswer": "the-answer",   // If you got a cdn plugin 'above this plugin' you can pull from it.
                "_": `lodash-es`,            // This will add a _ export to the file
                "*": "rxjs",                 // The asterisk will pull everything.
                                             // Currently, this is only available for one export per plugin instance.
                "yourModule": "./yourModuleFromVirtualPlugin.js"   // Your modules from elsewhere work too......
            }
        )
    ]
}
```
