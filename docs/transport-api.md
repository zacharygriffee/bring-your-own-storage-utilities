
# TRANSPORT API

<a name="Transport"></a>

## Transport : <code>object</code>
**Kind**: global namespace  

* [Transport](#Transport) : <code>object</code>
    * [.exports.fetchHookOfSource(source, pathRegExp, [config])](#Transport.exports.fetchHookOfSource)
    * [.exports.addFetchHook(hook)](#Transport.exports.addFetchHook)

<a name="Transport.exports.fetchHookOfSource"></a>

### Transport.exports.fetchHookOfSource(source, pathRegExp, [config])
Create a hook into fetch to consume a source.

**Kind**: static method of [<code>Transport</code>](#Transport)  

| Param | Default | Description |
| --- | --- | --- |
| source |  | A source with get or createReadStream |
| pathRegExp |  | a [pathToRegExp](https://github.com/pillarjs/path-to-regexp) string. This function has a special parameter `path` from the source. e.g. `/somePrefix/:path*`. If `path` parameter does not exist in the path string, the whole path will be assumed for the resource key. see: https://github.com/pillarjs/path-to-regexp on how to incorporate your own path string here. |
| [config] |  |  |
| [config.protocol] | <code>&quot;&quot;</code> | The protocol for this source to be referred to. Default wise, there is no protocol. |
| [config.mapper] | <code>(match)&#x3D;&gt;match</code> | An async function mapper that will be triggered when a path match has been determined. the match argument will contain a path, an index, and other non-internal parameters (`:path` being the only internal param for now). Whatever modifications you make to the path will be carried to the source. |

<a name="Transport.exports.addFetchHook"></a>

### Transport.exports.addFetchHook(hook)
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

**Kind**: static method of [<code>Transport</code>](#Transport)  

| Param | Description |
| --- | --- |
| hook | (request, response) =>  See above description. |

