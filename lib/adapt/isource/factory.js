import {isString} from "../../util/index.js";
import isFunction from "lodash-es/isFunction.js";

// Not implemented yet, possibly might get removed
function factory({source}) {
    if (isString(source.factory)) {
        return () => source.factory;
    }
    if (isFunction(source.factory)) {
        return Promise.resolve(source.factory());
    }
    return null;
}

export {factory}