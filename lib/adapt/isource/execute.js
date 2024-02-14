import {execute as _execute} from "../../query/execute.js";

/**
 * Execute a file from source
 * @param {string} path path The path to execute
 * @param {object} config The configuration to pass to the Query.execute.
 * @memberOf Adapt.iSource
 * @returns Promise
 */
function execute({source}) {
    if (source.exec) {
        return (key, config = {}) => _execute(source, key, config)
    }
}

export {execute};