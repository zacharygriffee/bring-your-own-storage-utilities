import path from "../tiny-paths.js";

import {
    startsWith,
    endsWith,
    each,
    map,
    trim,
    trimStart
} from "../util/index.js";

/**
 * Parses a npm module specifier.
 *
 * @example
 * {
 *     type,        // npm, gh only supply this if you're using cdn to build the paths list
 *     path         // /@someScope/someModule@5.5.5/somePath/index
 *     pathName     // /somePath/index
 *     namespace    // someScope
 *     scope        // someScope
 *     version      // 5.5.5
 *     module       // @someScope/someModule@5.5.5
 *     name         // someModule
 *
 *                  // Paths will only include the host if the host is supplied
 *                  // Please try hard to supply filenames and extensions for all requires and imports in your modules
 *                  // this parser handles them but if you use a cdn or other those are network calls to would not be necessary.
 *                  // Most cases, this list will only contain one entry, but in case you come across bad behavior module specifier,
 *                  // which occurs in a lot of old libraries, you will have to try each.
 *
 *     paths        // Array(6) [
 *                  //      // Example if host is defined.
 *                  //      https://unpkg.com/@someScope/someModule@5.5.5/somePath/index,
 *                  //      https://unpkg.com/@someScope/someModule@5.5.5/somePath/index.js,
 *                  //      // Example if type is defined which wouldn't work for unpkg.
 *                  //      https://unpkg.com/npm/@someScope/someModule@5.5.5/somePath/index.cjs,
 *                  //      https://unpkg.com/npm/@someScope/someModule@5.5.5/somePath/index.mjs,
 *                  //      // Example if host not defined for all paths of this list..
 *                  //      @someScope/someModule@5.5.5/somePath/index.json,
 *                  //      @someScope/someModule@5.5.5/somePath/index/
 *                  // ]
 * } = parseModuleSpecifier("@someScope/someModule@5.5.5/somePath/index", { host : "https://unpkg.com", type: "" });
 *
 * @param moduleId Any npm module specifier.
 * @param config
 * @param [config.host] If using a cdn, add a host to prefix to all possible paths.
 * @param [config.version] If you want to return a specific version regardless of whether a version is used in specifier.
 * @param [config.path] If you want to add a path, regardless of the path used in specifier
 * @param [config.type] If using a cdn, this will be put between the host and the specifier e.g. cdn.jsdelivr.net/[type]/[specifier] .
 * @param [config.mapPath] Optional mapping function for each path. Some cdn like jsdelivr suffix a +esm or unpkg suffix ?module to the path to get a different parsing of the module. Use map to add that if
 * you need to.
 * @returns
 * Will return an object with various parts of the module specifier including a list of paths you could use, especially in the case where no extension is supplied
 *
 * @memberof Find
 */
export function parseModuleSpecifier(moduleId, config = {}) {
    let {
        host,
        version = "",
        path: _path = "",
        type = "",
        mapPath
    } = config;

    if (startsWith(trim(moduleId, "/."), "node_modules")) {
        const x1 = trim(moduleId, "/.").split("/");
        x1.shift();
        moduleId = x1.join("/")
    }

    if (version === null) version = "";
    const declaredVersion = version;

    let resultPath = "";
    let namespace = "";

    if (type) {
        if (startsWith(moduleId, `/${type}/`)) {
            moduleId = moduleId.slice(`/${type}/`.length);
        }
        if (startsWith(moduleId, `${type}/`)) {
            moduleId = moduleId.slice(`${type}/`.length);
        }

        if (endsWith(moduleId, "/+esm")) {
            moduleId = moduleId.slice(0, -5);
        }
    }

    let p1, p2;
    if (startsWith(moduleId, "@")) {
        [, moduleId, version = version] = moduleId.split("@", 3);
        [version = version, ...p1] = version.split("/");
        [namespace, moduleId, ...p2] = moduleId.split("/");
    } else {
        [moduleId, version = version] = moduleId.split("@", 2);
        [version = version, ...p1] = version.split("/");
        [moduleId, ...p2] = moduleId.split("/");
    }

    if (!trim(moduleId, "./")) {
        return null;
    }

    if (p1.length > 0 && p2.length > 0) {
        // I set this here just in case this pops up.
        // I don't think it's possible ?
        debugger;
    }

    if (_path) {
        resultPath = _path;
    } else if (p1.length > 0) {
        resultPath = p1.join("/");
    } else if (p2.length > 0) {
        resultPath = p2.join("/");
    }

    version = declaredVersion ? declaredVersion : version;

    const module = `${namespace ? "@" + namespace + "/" : ""}${moduleId}${version ? "@" + version : ""}`;
    const pathName = `${resultPath ? "/" + trimStart(resultPath, "/") : ""}`;

    let paths = [`${module}${pathName}`];

    if (pathName) {
        const ext = path.extname(pathName);

        if (!ext) {
            each([".js", ".cjs", ".mjs", ".json", "/"], (ext) => {
                let path = `${module}${pathName}${ext}`;
                paths.push(path);
            });
        }
    }

    if (host) {
        paths = map(paths, p => {
            return `${host}${type ? "/" + type : ""}/${p}`;
        });
    }

    if (mapPath) paths = paths.map(mapPath);

    return {
        nodeModulesPath: `node_modules/${module}`,
        // npm, gh, etc
        type,
        // Path to module without hostname
        path: `/${module}${pathName}`,
        pathName,
        // namespace if module specifier has it
        namespace,
        // what npm really calls it
        scope: namespace,
        // version of the module, 'latest' if default.
        version,
        // The module specifier without the path
        module: `${module}`,
        // Name of the module
        name: moduleId,
        // All the possible paths with the varying extensions to try.
        paths
    };
}