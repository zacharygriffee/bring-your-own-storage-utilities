
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
                             "your-minified-library1": "...dataUri",
                             "your-minified-library2": "...dataUri",
                             "lodash-es": "...dataUriOfLodash"
                         }
                     }
                 </script>>
             `
     }
);
```
