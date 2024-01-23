let importingPack;
export let pack;

/**
 * Only necessary if you did not import the entire BYOSU namespace e.g. import * as BYOSU from "bring-your-own-storage-utilities";.
 *
 * IF constructing a iSource from a factory string, you must import a pack.
 * Either use setPack if you already have Deploy.pack loaded.
 * Or, use importPack to import your own or from BYOSU repo.
 *
 * **This is only ran once.
 *
 * Repeated calls will be ignored**
 *
 * @param _pack a preloaded Deploy.pack you have
 * @returns void
 * @memberOf Adapt
 */
export function setPack(_pack) {
    pack ||= _pack;
}

/**
 * Only necessary if you did not import the entire BYOSU namespace e.g. import * as BYOSU from "bring-your-own-storage-utilities";.
 *
 * IF constructing a iSource from a factory string, you must import a pack. Either use setPack if you already have
 * Deploy.pack loaded. Or, use importPack to import your own or from BYOSU repo.
 *
 * **This is only ran once.
 *
 * Repeated calls will be ignored**
 *
 * import errors should be caught by you
 *
 * @param [url] default is https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@0.0.1202/dist/deploy.min.js/+esm
 * @returns {Promise<void>}
 * @memberOf Adapt
 */
export async function importPack(url = "https://cdn.jsdelivr.net/npm/bring-your-own-storage-utilities@0.0.1202/dist/deploy.min.js/+esm") {
    if (importingPack) await importingPack;
    if (pack) return pack;
    importingPack = import(url).then(
        o => {
            pack = o.pack;
            importingPack = undefined;
        }
    );
    await importingPack;
}