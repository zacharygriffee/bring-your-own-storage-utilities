
# DEPLOY API

## Objects

<dl>
<dt><a href="#Deploy">Deploy</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#rollupTemplatePlugin">rollupTemplatePlugin(params, config)</a> ⇒ <code>Object</code> | <code>*</code></dt>
<dd><p>A templating similar to lodash-es/template but uses block-comment like deliminators
See tests for Deploy for examples, since jsdocs doesn&#39;t display it very well.</p>
</dd>
<dt><a href="#template">template(code, config)</a> ⇒ <code>Object</code> | <code>*</code></dt>
<dd><p>A templating similar to lodash-es/template but uses block-comment like deliminators
See tests for Deploy for examples, since jsdocs doesn&#39;t display it very well.</p>
</dd>
</dl>

<a name="Deploy"></a>

## Deploy : <code>object</code>
**Kind**: global namespace  

* [Deploy](#Deploy) : <code>object</code>
    * [.exports.ROLLUP](#Deploy.exports.ROLLUP)
    * [.exports.setRollup(rollup)](#Deploy.exports.setRollup) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.exports.rollup$(entry, config)](#Deploy.exports.rollup$)
    * [.exports.generate$(outputName, bundle$, outputConfig)](#Deploy.exports.generate$)
    * [.exports.pack$(entryName, [outputName], [config])](#Deploy.exports.pack$)
    * [.exports.pack()](#Deploy.exports.pack)
    * [.exports.couldntResolve(cb)](#Deploy.exports.couldntResolve)
    * [.rollupExternalGlobalsPlugin(globals, [config])](#Deploy.rollupExternalGlobalsPlugin)
    * [.exports.rollupFromSourcePlugin(source, config)](#Deploy.exports.rollupFromSourcePlugin)
    * [.exports.rollupReplaceThesePlugin(globBook)](#Deploy.exports.rollupReplaceThesePlugin) ⇒ <code>string</code> \| <code>Object</code>
    * [.exports.rollupSveltePluginNoServer(config)](#Deploy.exports.rollupSveltePluginNoServer) ⇒ <code>Object</code> \| <code>\*</code>
    * [.exports.rollupTerserBrowserPlugin([comments])](#Deploy.exports.rollupTerserBrowserPlugin)
    * [.exports.rollupVirtualPlugin(codeBook, config)](#Deploy.exports.rollupVirtualPlugin)
    * [.exports.rollupVirtualExports(entryName, exportBook, config)](#Deploy.exports.rollupVirtualExports) ⇒ <code>Object</code>
    * [.exports.setSvelteCompiler([svelteCompilerModule])](#Deploy.exports.setSvelteCompiler) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.exports.svelteCompile()](#Deploy.exports.svelteCompile)
    * [.exports.svelteCompile$(code, config)](#Deploy.exports.svelteCompile$)
    * [.exports.terser(code, [comments])](#Deploy.exports.terser) ⇒ <code>Promise.&lt;MinifyOutput&gt;</code>

<a name="Deploy.exports.ROLLUP"></a>

### Deploy.exports.ROLLUP
Once rollup is acquired through setRollup function, this will be the module.

**Kind**: static property of [<code>Deploy</code>](#Deploy)  
<a name="Deploy.exports.setRollup"></a>

### Deploy.exports.setRollup(rollup) ⇒ <code>Promise.&lt;void&gt;</code>
Set rollup module. Rollup has many different versions that may suit your needs better.

**You may only set rollup module once**

**Repeated calls will be ignored**

<pre>
     Use case:                        NPM Specifier
     For the browser:                 @rollup/browser@3.29.4
     For the browser utilizing wasm:  @rollup/browser@latest
     For node:                        rollup
</pre>

If you do not call this before using pack,` @rollup/browser@3.29.4` will be downloaded and used.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Type | Description |
| --- | --- | --- |
| rollup | <code>module</code> \| <code>string</code> | If string or nill, will be specifier to get rollup or `@rollup/browser@3.29.4` |

<a name="Deploy.exports.rollup$"></a>

### Deploy.exports.rollup$(entry, config)
Bundle rollup$. I add the deploy.couldntResolve plugin
for ease of development to determine what ids don't work. This maybe important to keep for peer to peer
development when sources may not be always available.

It uses rxjs to emit.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
**See**: https://rollupjs.org/javascript-api/  

| Param | Description |
| --- | --- |
| entry | the rollup config.input field. Multiple entry points not supported by byosu functions, so simply a string where to begin bundling. |
| config | https://rollupjs.org/javascript-api/ |

<a name="Deploy.exports.generate$"></a>

### Deploy.exports.generate$(outputName, bundle$, outputConfig)
After the 'rollup$' generate is next. Pipe what the rollup$ does to the generate$

e.g. rollup$.pipe(rx.switchMap((bundle) => generate$(bundle)));

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
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

<a name="Deploy.exports.pack$"></a>

### Deploy.exports.pack$(entryName, [outputName], [config])
This is a wrapper and convenience for the rollup$ and generate$ function.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Default | Description |
| --- | --- | --- |
| entryName |  | The entry point to begin bundling. Multiple entry points not supported and not planned to be supported. |
| [outputName] |  | Choose the output name, default is [entryName]-bundle.js |
| [config] |  | The [configuration for rollup](https://rollupjs.org/javascript-api/), in addition to the following. |
| [config.autoImport] | <code>false</code> | Will auto import the module into 'module' field. Make sure you trust the modules and source of modules as this can create similar security issues as `eval`. As well, turning this to true will make the result object not serializable. |
| [config.createUri] | <code>true</code> | Will automatically create [data-uri](createDataUri) of the bundle for you to share or pack up to an importmap or just execute it by const yourBundledModule = await import(bundleResult.uri). If your bundling something very large, you should probably turn this off, as this could be very taxing to memory and space. |
| [config.libraryName] |  | This is really metadata for end-user to add to the bundle result. This helped me to index in some situations. |

<a name="Deploy.exports.pack"></a>

### Deploy.exports.pack()
Convenience async method for pack$

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy.exports.couldntResolve"></a>

### Deploy.exports.couldntResolve(cb)
Built in to deploy.pack but it tells you what id doesn't resolve in the case of error.
This is especially helpful when building in browser.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Description |
| --- | --- |
| cb | You handle how to display or communicate the id that doesn't resolve. |

**Example**  
```js
couldntResolve((result) => {
    console.error("Couldn't resolve id", result.id, result.from, result);
})
```
<a name="Deploy.rollupExternalGlobalsPlugin"></a>

### Deploy.rollupExternalGlobalsPlugin(globals, [config])
Replace imports with a variable that is in global scope.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
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
<a name="Deploy.exports.rollupFromSourcePlugin"></a>

### Deploy.exports.rollupFromSourcePlugin(source, config)
Rollup scripts from a drive source that has `get` and `readdir` function.

Does not currently support code splitting which is something I am very adamant to support.

if config.asOutput=true and the source supports metadata e.g. source.put(key, value, { metadata })
result information of the bundle will be added there.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
**Todo**

- [ ] support code splitting


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | A source that has at least a `get` function |
| config |  |  |  |
| [config.asInput] |  | <code>true</code> | Whether this source serves as an input of scripts. |
| [config.asOutput] |  | <code>!!source.put</code> | Whether this source serves as an output of the bundle. Currently, only supports sources with a put function. Will automatically detect whether the source has put function. This will detect the output name from the rollup.output configuration. |
| [config.excludes] |  |  | Exclude ids / specifiers from being imported from this source. |
| [config.jsCode] |  |  | Mapper to handle post processing of code before being sent to the output source. |
| [config.outputNameHandler] | <code>function</code> |  | Handle with the arguments (chunkId, chunk) the output names of each chunk of the result. |

<a name="Deploy.exports.rollupReplaceThesePlugin"></a>

### Deploy.exports.rollupReplaceThesePlugin(globBook) ⇒ <code>string</code> \| <code>Object</code>
Will replace keys with ids.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Description |
| --- | --- |
| globBook | A key/value of glob in which to replace, and the id/moduleName to replace it with. |

<a name="Deploy.exports.rollupSveltePluginNoServer"></a>

### Deploy.exports.rollupSveltePluginNoServer(config) ⇒ <code>Object</code> \| <code>\*</code>
Compile svelte file. It must end with `**.svelte**` extension to be registered in this plugin.
So even if you use the virtual plugin, make sure your file ends with `.svelte`.

Yes, I hate global pollution too, but this only way I can efficiently get svelte to operate properly in browser without
a server.

This changes all imports referencing svelte to global. This keeps a svelte instance in global scope so that
each component knows about each other. There are plans to define different scopes, but for now, there is only one
svelte instance scope produced with this. Any security concerns you may have in this should be considered.

These will need to be in global scope for any scripts generated by this plugin to work only:
The critical ones are Svelte and SvelteInternal and in 90% of the time SvelteStore.
The others are only necessary if you have it in your code.

<pre>
[Specifier]                      = [Global Name]
svelte                           = SvelteInternal
svelte/compiler                  = SvelteCompiler
svelte/store                     = SvelteStore
svelte/internal                  = SvelteInternal
svelte/animate                   = SvelteAnimate
svelte/easing                    = SvelteEasing
svelte/motion                    = SvelteNotion
svelte/transition                = SvelteTransition

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
**Sveltestrap/sveltestrap**: = SvelteStrap
**This one is not optional**
svelte/internal/disclose-version = SvelteVersion
</pre>

There are two ways I suggest the developer to globalize svelte. In bring-your-own-storage-utilities/dist/svelte are
modified minification of svelte files that globalizes itself to match the global name in the above list.

Or you can import your own svelte files (e.g. import map or script ele tag) and ensure that you add them to global scope
under the names of the above list.  

| Param | Description |
| --- | --- |
| config | This is the same configuration as [svelteCompile$](svelteCompile$) including the following |
| [config.svelteCompiler] | See Deploy.setSvelteCompiler. This is a convenience function to set the compiler from here. However, if you've already set the compiler or have already run svelteCompiler function, this will do nothing. |

<a name="Deploy.exports.rollupTerserBrowserPlugin"></a>

### Deploy.exports.rollupTerserBrowserPlugin([comments])
Terser plugin that works with browser.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Default | Description |
| --- | --- | --- |
| [comments] | <code>false</code> | Whether comments are left in. |

<a name="Deploy.exports.rollupVirtualPlugin"></a>

### Deploy.exports.rollupVirtualPlugin(codeBook, config)
Rollup virtual code from an object of key/value where key is the module specifier or file name of the code, and value
is where the code of the module is. Imports work as well, where you can import from another virtual or from an id
from other parts of the rollup.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

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
<a name="Deploy.exports.rollupVirtualExports"></a>

### Deploy.exports.rollupVirtualExports(entryName, exportBook, config) ⇒ <code>Object</code>
Concatenation of exports.

Similar to rollupVirtual but takes an entryName and a book of key / values where key is the export name
and value is the module specifier to pull from. Sometimes all you need is to remap exports.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

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
                "default as theAnswer": "the-answer",   // If you got a cdn plugin 'above this plugin' you can pull from it.
                "* as _": `lodash-es`,            // This will add a _ export to the file
                "*": "rxjs",                 // The asterisk will pull everything.
                                             // Currently, this is only available for one export per plugin instance.
                                             // You can hack it by adding whitespace AFTER the astrisk.
                "yourModule": "./yourModuleFromVirtualPlugin.js"   // Your modules from elsewhere work too......
            }
        )
    ]
}
```
<a name="Deploy.exports.setSvelteCompiler"></a>

### Deploy.exports.setSvelteCompiler([svelteCompilerModule]) ⇒ <code>Promise.&lt;void&gt;</code>
Set the rollup compiler. Call this before any svelte actions including Deploy.rollupSveltePluginNoServer. If you do not
call this, the `dist/svelte-compiler.min.js` of BYOSU will be downloaded and used.

**You may only set compiler once**

**Repeated calls will be ignored**

You may also use the svelte/compiler module from the svelte repo see Deploy.svelteCompile for more information.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Type | Description |
| --- | --- | --- |
| [svelteCompilerModule] | <code>module</code> \| <code>string</code> \| <code>function</code> | If module is passed, no download will occur, and will use module.compile to compile svelte files. If a function is passed, will assume it is a svelte/compiler compile function. If a string is passed (browser only) will download the module and use it. If nothing is passed Will download `dist/svelte-compiler.min.js` from BYOSU repo. |

<a name="Deploy.exports.svelteCompile"></a>

### Deploy.exports.svelteCompile()
Convenience async function of svelteCompile$

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
<a name="Deploy.exports.svelteCompile$"></a>

### Deploy.exports.svelteCompile$(code, config)
Compile svelte code into javascript, css, and code map.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  
**See**: https://svelte.dev/docs/svelte-compiler  
**Todo**

- [ ] weigh the advantages between dom and ssr when working in p2p land. If using SSR than end user can use their
      own client side routing. Right now, the default config.generate is creating the dom.


| Param | Default | Description |
| --- | --- | --- |
| code |  | String svelte code. |
| config |  | The configuration is passed into [svelte compiler](https://svelte.dev/docs/svelte-compiler) with variation to default behavior below. |
| [config.name] |  | The name of the svelte component. By default, this will be randomly generated with a prefix of Component. |
| [config.status$] |  | Define this config with an InputObservable to receive status of the compiling svelte including warnings from aria. |
| [config.generate] | <code>dom</code> | How to generate. |
| [config.dev] | <code>false</code> | Whether to compile in dev mode (see svelte.compiler docs) |
| [config.accessors] | <code>true</code> | In svelte.compiler this is default false. To work between components from p2p land, accessors=true made it easier for me. |
| [config.injectCss] | <code>true</code> | Add an IIFE function right into the HTML that injects the CSS produced by this compiler into the DOM. If you are running a long term app, with many different changes, you might want to declare this false due to the  fact that, css is only appended to the doc, but never removed. So you may want to handle this differently if that is your use-case. |

<a name="Deploy.exports.terser"></a>

### Deploy.exports.terser(code, [comments]) ⇒ <code>Promise.&lt;MinifyOutput&gt;</code>
Exposure of terser plugin. Operates only on module.Leaves in 'debugger'.

**Kind**: static method of [<code>Deploy</code>](#Deploy)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| code | <code>string</code> |  | code |
| [comments] | <code>boolean</code> | <code>false</code> | Keep the comments around? |

<a name="rollupTemplatePlugin"></a>

## rollupTemplatePlugin(params, config) ⇒ <code>Object</code> \| <code>\*</code>
A templating similar to lodash-es/template but uses block-comment like deliminators
See tests for Deploy for examples, since jsdocs doesn't display it very well.

**Kind**: global function  

| Param | Description |
| --- | --- |
| params | The parameters to use in template processing. |
| config | see options of [lodash/template](https://lodash.com/docs/4.17.15#template) |

<a name="template"></a>

## template(code, config) ⇒ <code>Object</code> \| <code>\*</code>
A templating similar to lodash-es/template but uses block-comment like deliminators
See tests for Deploy for examples, since jsdocs doesn't display it very well.

**Kind**: global function  

| Param | Description |
| --- | --- |
| code | The code to process template |
| config | see options of [lodash/template](https://lodash.com/docs/4.17.15#template) |

