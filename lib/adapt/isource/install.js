import {install as _install} from "../../query/install.js";

/**
 * Install from a file of the source.
 * @param {string} path Path of the installation
 * @param {object} config The configuration to be passed to the installation.
 * @memberOf Adapt.iSource
 */
function install({source, isInstallable}) {
    if (isInstallable) {
        return (path, config) => _install(source, path, config)
    }
}

export {install}