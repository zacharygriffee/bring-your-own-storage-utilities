import {operators} from "../etc.js";
import {match} from "./pathtoregexp.js";
import {castArray, trimEnd} from "../util/index.js";
import {parse} from "../fast-url-parser.js";
import {createReadStream} from "../query/index.js";
import {toWeb} from "streamx-webstream";
import {ReplaySubject} from "rxjs";
import {concatAll, ignoreElements, map, takeWhile, toArray} from "rxjs/operators";

const {takeSync, concatTap} = operators;
const rx = {ReplaySubject, concatAll, ignoreElements, map, takeWhile, toArray};

let hooks = new rx.ReplaySubject();
let _fetch, installed = false

function installFetchHookIfNotAlready() {
    if (installed) return;
    if (typeof Request === "undefined" || typeof fetch === "undefined") {
        throw new Error("Fetch not supported.");
    }
    _fetch = fetch;
    fetch = fetchHook;
    installed = true;
}

function fetchHook(request, config = {}) {
    let resolve, reject, awaitResolution = new Promise((res, rej) => {
        resolve = res;
        reject = rej
    });
    let afterwards = [];
    let rawRequest = {
        method: request.method ?? "GET",
        body: request.body ?? null,
        mode: request.mode ?? "cors",
        credentials: request.credentials ?? "same-origin",
        redirect: request.redirect ?? "follow",
        priority: request.priority ?? "auto",
        ...config,
        headers: {...(request.headers || {}), ...config}
    };

    if (typeof request === "string") {
        rawRequest.url = request;
    }

    const {
        response$,
        ...req
    } = rawRequest;

    hooks.pipe(
        takeSync(),
        rx.toArray(),
        rx.map(o => o.reverse()),
        rx.concatAll(),
        concatTap(
            async fn => {
                fn(req, {
                    request: req,
                    async next() {
                        let resolve, reject, promise = new Promise((res, rej) => {
                            resolve = res;
                            reject = rej
                        })
                        afterwards.unshift([resolve, reject]);
                        return promise;
                    },
                    async end() {
                        if (req.ended) return;
                        req.ended = true;
                        const request = new Request(req.url, req);
                        resolve(await _fetch(request));
                    },
                    respond(body, options = {}) {
                        if (req.ended) return;
                        req.ended = true;
                        options.status ||= 200;
                        if (typeof window !== "undefined" && !!body._readableState || !!body._writableState) {
                            body = toWeb(body);
                        }
                        console.log("Constructing response object from", {req, options})
                        resolve(body instanceof Response ? body : new Response(body, {...req, ...options}));
                    },
                    error(e) {
                        req.ended = true;
                        req.error = e;
                        return reject(e);
                    }
                });
            }
        ),
        rx.takeWhile(() => !req.ended),
        rx.ignoreElements(),
    ).subscribe(async () => {
        for await (const [resolve, reject] of afterwards) {
            if (req.error) {
                reject(req.error);
                continue;
            }
            resolve(req);
        }
        if (!req.ended) {
            req.ended = true;
            resolve(_fetch(request, config));
        }
    });

    return awaitResolution;
}

/**
 * Create a hook into fetch to consume a source.
 *
 * @param source A source with get or createReadStream
 * @param pathRegExp a {@link https://github.com/pillarjs/path-to-regexp pathToRegExp} string. This function has a special
 * parameter `path` from the source. e.g. `/somePrefix/:path*`. If `path` parameter does not exist in the
 * path string, the whole path will be assumed for the resource key. see: https://github.com/pillarjs/path-to-regexp on how
 * to incorporate your own path string here.
 * @param [config]
 * @param [config.protocol=""] The protocol for this source to be referred to. Default wise, there is no protocol.
 * @param [config.mapper=(match)=>match] An async function mapper that will be triggered when a path match has been determined.
 * the match argument will contain a path, an index, and other non-internal parameters (`:path` being the only internal param for now).
 * Whatever modifications you make to the path will be carried to the source.
 */
export function fetchHookOfSource(source, pathRegExp, config = {}) {
    installFetchHookIfNotAlready();
    if (config.protocol) {
        config.protocol = trimEnd(config.protocol || ":", ":") + ":";
    }

    const {
        protocol,
        mapper = async (match) => {
            return match;
        }
    } = config;

    const pathMatcher = match(pathRegExp);

    hooks.next(async (req, res) => {
        const {pathname, protocol: _protocol} = parse(req.url)
        if (protocol && protocol !== _protocol) return;

        let match = pathMatcher(pathname);
        if (!match) return;
        let {path, index, params} = match;
        if (params.path) {
            path = "/" + castArray(params.path).join("/");
            delete params.path;
        }

        const mapResult = await Promise.resolve(mapper({path, index, params}));
        if (mapResult == null) return;
        ({path} = mapResult);

        try {
            // console.log("content-type", req, req.headers["Content-Type"] ||= await getType(source, path));
            res.respond(createReadStream(source, path));
        } catch (e) {
            res.next();
        }
    });
}

/**
 * Very similar to connect middleware with some variations. the only argument of this function is a callback with
 * arguments (request, response). The request object will have request information you can mutate.
 *
 * This is alpha stage function, these mechanics may change.
 * As well, hooks are irreversible for the app lifespan for now, but will be adding pause, stop, destroy mechanisms.
 *
 * The request object has the standard headers object, among other typical {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Request options}.
 *
 * The response object has a few functions:
 *
 * <pre>
 * await response.next();             // awaits for the hooks added before this one, if any hooks above this one
 *                                    // finalize this promise should not resolve (this will probably change).
 *
 * await response.end();              // submits the request, ends the chain, submits the fetch,
 *                                    // and any further middleware should not be called.
 *
 * await response.respond(response); // respond with your own response, fetch is not called,
 *                                   // and any further middleware should not be called.
 *
 * response.error(error)             // Cause the chain to fail. Any further middleware should not be called.
 *
 * </pre>
 * @param hook (request, response) => {} See above description.
 */
export function addFetchHook(hook) {
    hooks.next(
        hook
    );
}