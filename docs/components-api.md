
# COMPONENTS API

## Members

<dl>
<dt><a href="#FileExplorer">FileExplorer</a></dt>
<dd><p>FileExplorer (Will be renamed to SourceExplorer)</p>
</dd>
<dt><a href="#SvelteStrap">SvelteStrap</a></dt>
<dd><p>SvelteStrap</p>
<p>This is a re-minification of @sveltestrap/sveltestrap to work with
the way BYOSU compiles svelte for browser use.</p>
</dd>
<dt><a href="#UploadTo">UploadTo</a></dt>
<dd><p>UploadTo</p>
<p>A component that enables you to upload a file using the browser&#39;s file upload
dialog, into your source that has a source.put(key, buffer, config) function</p>
<p>If the passed source does not support put function, the button will simply not appear.</p>
<p>Styles are mimicked like @sveltestrap/sveltestrap or bootstrap.js</p>
</dd>
</dl>

<a name="FileExplorer"></a>

## FileExplorer
FileExplorer (Will be renamed to SourceExplorer)

**Kind**: global variable  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | The source this component will act on. |
| [cwd] | <code>string</code> | <code>&quot;/&quot;</code> | The current working directory the component is on. |
| [iconSize] | <code>string</code> | <code>&quot;30px&quot;</code> | The icon size for the files in the explorer |
| [updated] | <code>number</code> | <code>0</code> | Bind and change this number to refresh. |

<a name="SvelteStrap"></a>

## SvelteStrap
SvelteStrap

This is a re-minification of @sveltestrap/sveltestrap to work with
the way BYOSU compiles svelte for browser use.

**Kind**: global variable  
**See**

- https://github.com/sveltestrap/sveltestrap
- https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs

<a name="UploadTo"></a>

## UploadTo
UploadTo

A component that enables you to upload a file using the browser's file upload
dialog, into your source that has a source.put(key, buffer, config) function

If the passed source does not support put function, the button will simply not appear.

Styles are mimicked like @sveltestrap/sveltestrap or bootstrap.js

**Kind**: global variable  
**See**

- https://github.com/sveltestrap/sveltestrap
- https://sveltestrap.js.org/?path=/docs/sveltestrap-overview--docs

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| source |  |  | The source this component will act on. |
| [color] | <code>string</code> | <code>&quot;primary&quot;</code> | The color of the button. See sveltestrap for info on what is available. |
| [size] | <code>string</code> | <code>&quot;sm&quot;</code> | A choice between sm for small, and lg for large. |
| [cwd] | <code>string</code> | <code>&quot;/&quot;</code> | The current working directory the component is on. |
| [updated] | <code>number</code> | <code>0</code> | Bind and change this number to refresh any connected components. |
| [keyMutateFunction] | <code>function</code> |  | Mutate the file name of the uploaded file to something else. Default is to use the filename as is. |
| [theme] | <code>string</code> | <code>&quot;dark&quot;</code> | A choice between dark or light color theme |

