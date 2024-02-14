
/**
 * @var {boolean} isInstallable Whether this source is installable.
 * @memberOf Adapt.iSource
 */
function isInstallable({source}) {
    return !!source.install
}

export {isInstallable};