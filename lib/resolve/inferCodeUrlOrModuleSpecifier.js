import {parseModuleSpecifier} from "../find/index.js";

/**
 * Get a module whether it is code, url, module specifier, path, svelte etc.
 *
 * Cannot 'detect svelte code' can only detect whether url/path has an extension of '.svelte'.
 *
 * Works almost all the time.
 *
 * @param string
 * @returns {{svelte: boolean, path: string, virtual, module, url: string | boolean, hash: boolean, pathname, code}}
 * @memberOf Resolve
 */
export function inferCodeUrlOrModuleSpecifier(string) {
    let url, _path, pathname, module, virtual, svelte;
    const hash = string.startsWith("\0")

    if (!hash && string.split(" ").length === 1) {
        try {
            url = new URL(string);
            pathname = url.pathname;
            url = url.href;
        } catch (e) {
            url = false;

            if ((string.startsWith("/") || string.startsWith(".")) && (!string.startsWith("/npm") && !string.startsWith("/gh"))) {
                pathname = _path = string;
            } else {
                module = parseModuleSpecifier(string);
                if (module.name.indexOf(".") > -1) {
                    _path = pathname = "./" + module.name;
                    module = null;
                } else {
                    pathname = module?.path;
                }
            }
        }
    } else {
        virtual = string;
    }

    if (_path && _path.endsWith(".svelte")) {
        svelte = true;
    }

    return {
        url,
        module,
        virtual,
        code: virtual,
        path: _path,
        pathname,
        hash,
        svelte
    }
}