
import RPC from "protomux-rpc";
import cenc from "compact-encoding";
import {iSource} from "../../lib/adapt/index.js";
import {firstValueFrom, fromEvent} from "rxjs";
import {map, filter, defaultIfEmpty, concatMap} from "rxjs/operators";



/**
 * Serve a source over rpc. Is an observer to anything that produces sockets, so it can be used in a rxjs observable.
 *
 * @example
 * // Prevent put and del to a hacker
 * const server = serve(source, {
 *      firewall(socket, {action}) { socket.isHacker && (action === "put" || action === "del") },
 *      id: b4a.from("the-menu")
 * };
 * // Or just serve your source like a lunatic
 * const server = serve(source);
 *
 * server.next(socket);                        // next adds a socket that will use the serve source.
 * server.complete();                          // complete ends the service gracefully
 * server.error(new Error("You're a hacker")); // error ends the service abruptly
 *
 * // you may also iterate the current sockets
 * for (const socket of server) {
 *     // do ya thang.
 * }
 *
 * @see https://github.com/holepunchto/protomux-rpc
 * @param iSource
 * @param config Other than the following, config is passed to protomux-rpc
 * @param {function} [config.firewall] - Receives arguments (socket, {action: "get", handshake, ...otherInfo}). To block the peer from
 * connecting, return truthy. If you want to allow their access, return a falsy. action is one of the functions or properties of
 * iSource interface. Not all are supported yet, but will soon.
 * @returns {{next(*): void, error(*): Promise<void>, complete(): Promise<void>}}
 * @memberOf Transport.iNetworkSource
 */
export function serve(iSource, config = {}) {
    let _sockets = new Set();
    return {
        next(socket) {
            _serve(iSource, socket, config);
            _sockets.add(socket);
        },
        async error(e) {
            for await (const x of _sockets.values()) {
                await x.destroy(e);
            }
        },
        async complete() {
            for await (const x of _sockets.values()) {
                await x.end();
            }
        },
        * [Symbol.iterator]() {
            for (const x of _sockets.values()) yield x;
        }
    }
}

function _serve(iSource, socket, config = {}) {
    let handshake;
    const {
        firewall = () => false,
        handshake: _handshake = {},
        ...restConfig
    } = config;

    const rpc = new RPC(socket, {
        protocol: "bysou/v1/source",
        handshakeEncoding: cenc.json,
        handshake: _handshake,
        ...restConfig
    });

    rpc.once("open", hs => {
        handshake = hs;
    });

    rpc.respond("factory",
        {
            responseEncoding: cenc.utf8
        },
        async () => {
            if (!await firewall(socket, {action: "factory", handshake})) return iSource.factory;
            throw new AccessDeniedError();
        }
    );

    rpc.respond("get",
        {
            requestEncoding: getArgumentEncoding,
            responseEncoding: cenc.buffer
        },
        async ([key, config]) => {
            if (!await firewall(socket, {action: "get", handshake, key, config})) return iSource.get(key, config);
            throw new AccessDeniedError();
        }
    );

    rpc.respond("del", {
        requestEncoding: cenc.json
    }, async ([key]) => {
        if (!await firewall(socket, {action: "del", handshake, key, config})) return iSource.del(key, config);
        throw new AccessDeniedError();
    });

    rpc.respond("exists",
        {
            requestEncoding: getArgumentEncoding,
            responseEncoding: cenc.bool
        },
        async ([key, config]) => {
            if (!await firewall(socket, {action: "exists", handshake, key, config})) return iSource.exists(key, config);
            throw new AccessDeniedError();
        }
    );

    rpc.respond("put",
        {
            requestEncoding: putArgumentEncoding
        },
        async ([key, buffer, config]) => {
            if (!await firewall(socket, {action: "put", handshake, key, buffer, config})) return iSource.put(key, buffer, config);
            throw new AccessDeniedError();
        }
    );

    rpc.respond("readdir",
        {requestEncoding: cenc.json, responseEncoding: cenc.array(cenc.utf8)},
        async ([path, config]) => {
            if (!await firewall(socket, {action: "readdir", handshake, path, config})) return iSource.readdir(path, config);
            throw new AccessDeniedError();
        }
    );

    rpc.respond("ready",
        async () => {
            if (!await firewall(socket, {action: "ready", handshake}))
                return iSource.ready();

            throw new AccessDeniedError();
        }
    );

    ["writable", "readable", "appendable"].forEach(
        (x) => {
            rpc.respond(x, {responseEncoding: cenc.bool}, async () => {
                if (!await firewall(socket, {action: x, handshake})) return iSource[x];
                return false;
            })
        }
    );

}

/**
 * Connect to a source serve service.
 *
 * @example
 *  connect$(socket, {id: b4a.from("the-menu")})
 *      .pipe(
 *          concatMap(o => o.get("/beefFolder/hamburger.txt")),
 *          map(b4a.toString)
 *      )
 *      .subscribe(getHamburger);
 *
 *  function getHamburger(hamburgerTxt) {
 *      console.log(hamburgerTxt);
 *  }
 * @param socket socket or mux
 * @param config
 * @returns {Observable<ISource>}
 * @memberOf Transport.iNetworkSource
 */
export function connect$(socket, config = {}) {
    const {
        firewall = () => false,
        handshake: _handshake = {},
        ...restConfig
    } = config;

    const rpc = new RPC(socket, {
        protocol: "bysou/v1/source",
        handshakeEncoding: cenc.json,
        handshake: _handshake,
        ...restConfig
    });

    const preloadProperties = Promise.all([
        rpc.request("ready", undefined),
        rpc.request("readable", undefined, {responseEncoding: cenc.bool}),
        rpc.request("writable", undefined, {responseEncoding: cenc.bool}),
        rpc.request("appendable", undefined, {responseEncoding: cenc.bool}),
    ]);

    let resolvedProperties = {};

    const source = iSource(
        {
            factory: () => rpc.request("factory", undefined, {responseEncoding: cenc.utf8}),
            put: (key, buf, config) => rpc.request("put", [key, buf, config], {
                requestEncoding: putArgumentEncoding,
                responseEncoding: cenc.any
            }),
            get: (key, config) => rpc.request("get", [key, config], {
                requestEncoding: getArgumentEncoding,
                responseEncoding: cenc.buffer
            }),
            exists: (key, config) => rpc.request("exists", [key, config], {
                requestEncoding: getArgumentEncoding,
                responseEncoding: cenc.bool
            }),
            del: (key) => rpc.request("del", [key], {requestEncoding: cenc.json}),
            readdir: (path, config) => rpc.request("readdir", [path, config], {
                requestEncoding: cenc.json,
                responseEncoding: cenc.array(cenc.utf8)
            }),
            ready: () => Promise.resolve(resolvedProperties.ready ? null : rpc.request("ready", undefined)),
            get readable() {
                return resolvedProperties.readable
            },
            get writable() {
                return resolvedProperties.writable
            },
            get appendable() {
                return resolvedProperties.appendable
            }
        },
        {
            socket
        }
    );

    rpc.once("close",  () => {
        resolvedProperties.readable = false;
        resolvedProperties.writable = false;
        resolvedProperties.appendable = false;
    });

    return fromEvent(rpc, "open").pipe(
        map((hs) => {
            source.state.handshake = hs;
            return source;
        }),
        filter(o => !firewall(socket, o.state)),
        concatMap(
            async o => {
                resolvedProperties = await preloadProperties;
                resolvedProperties.ready = true;
                return o;
            }
        ),
        defaultIfEmpty(null)
    )
}

/**
 * Convenience async method for connect$
 * @param socket
 * @param config
 * @memberOf Transport.iNetworkSource
 */
export function connect(socket, config) {
    return firstValueFrom(
        connect$(socket, config)
    );
}

class AccessDeniedError extends Error {
    constructor(string = "Access is denied.") {
        super(string);
    }
}

const getArgumentEncoding = {
    preencode(state, [key, config = {}]) {
        cenc.json.preencode(state, config);
        cenc.any.preencode(state, key);
    },
    encode(state, [key, config = {}]) {
        cenc.json.encode(state, config);
        cenc.any.encode(state, key);
    },
    decode(state) {
        const config = cenc.json.decode(state);
        const key = cenc.any.decode(state);

        return [key, config];
    }
}

const putArgumentEncoding = {
    preencode(state, [key, buffer, config = {}]) {
        cenc.buffer.preencode(state, buffer);
        cenc.any.preencode(state, key);
        cenc.json.preencode(state, config);
    },
    encode(state, [key, buffer, config = {}]) {
        cenc.buffer.encode(state, buffer);
        cenc.any.encode(state, key);
        cenc.json.encode(state, config);
    },
    decode(state) {
        const buffer = cenc.buffer.decode(state);
        const key = cenc.any.decode(state);
        const config = cenc.json.decode(state);

        return [key, buffer, config];
    }
}