import {isFunction} from "awilix/lib/utils.js";

/**
 * @var {boolean} isExecutable Whether this source is executable.
 * @memberOf Adapt.iSource
 */
function isExecutable({source}) {
    if (isFunction(source.exec)) {
        return source.exec();
    }
}

export {isExecutable};