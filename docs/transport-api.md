
# TRANSPORT API

## Functions

<dl>
<dt><a href="#fetchHookOfSource">fetchHookOfSource(source, pathRegExp, [config])</a></dt>
<dd><p>Create a hook into fetch to consume a source.</p>
</dd>
<dt><a href="#addFetchHook">addFetchHook(hook)</a></dt>
<dd><p>Very similar to connect middleware with some variations. the only argument of this function is a callback with
arguments (request, response). The request object will have request information you can mutate.</p>
<p>This is alpha stage function, these mechanics may change.
As well, hooks are irreversible for the app lifespan for now, but will be adding pause, stop, destroy mechanisms.</p>
<p>The request object has the standard headers object, among other typical <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request options</a>.</p>
<p>The response object has a few functions:</p>
<pre>
await response.next();             // awaits for the hooks added before this one, if any hooks above this one
                                   // finalize this promise should not resolve (this will probably change).

await response.end();              // submits the request, ends the chain, submits the fetch,
                                   // and any further middleware should not be called.

await response.respond(response); // respond with your own response, fetch is not called,
                                  // and any further middleware should not be called.

response.error(error)             // Cause the chain to fail. Any further middleware should not be called.

</pre></dd>
</dl>

<a name="fetchHookOfSource"></a>

## fetchHookOfSource(source, pathRegExp, [config])
Create a hook into fetch to consume a source.

**Kind**: global function  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A source with get or createReadStream |
| pathRegExp |  | a [pathToRegExp](https://github.com/pillarjs/path-to-regexp) string. This function has a special parameter `path` from the source. e.g. `/somePrefix/:path*`. If `path` parameter does not exist in the path string, the whole path will be assumed for the resource key. see: https://github.com/pillarjs/path-to-regexp on how to incorporate your own path string here. |
| [config] |  |  |
| [config.protocol] | <code>&quot;&quot;</code> | The protocol for this source to be referred to. Default wise, there is no protocol. |
| [config.mapper] | <code>(match)&#x3D;&gt;match</code> | An async function mapper that will be triggered when a path match has been determined. the match argument will contain a path, an index, and other non-internal parameters (`:path` being the only internal param for now). Whatever modifications you make to the path will be carried to the source. |

<a name="addFetchHook"></a>

## addFetchHook(hook)
Very similar to connect middleware with some variations. the only argument of this function is a callback with
arguments (request, response). The request object will have request information you can mutate.

This is alpha stage function, these mechanics may change.
As well, hooks are irreversible for the app lifespan for now, but will be adding pause, stop, destroy mechanisms.

The request object has the standard headers object, among other typical [Request options](https://developer.mozilla.org/en-US/docs/Web/API/Request).

The response object has a few functions:

<pre>
await response.next();             // awaits for the hooks added before this one, if any hooks above this one
                                   // finalize this promise should not resolve (this will probably change).

await response.end();              // submits the request, ends the chain, submits the fetch,
                                   // and any further middleware should not be called.

await response.respond(response); // respond with your own response, fetch is not called,
                                  // and any further middleware should not be called.

response.error(error)             // Cause the chain to fail. Any further middleware should not be called.

</pre>

**Kind**: global function  

| Param | Description |
| --- | --- |
| hook | (request, response) =>  See above description. |

