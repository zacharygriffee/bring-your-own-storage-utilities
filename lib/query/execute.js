import {getEntry} from "./get-entry.js";
import {defer} from "rxjs";

/**
 * Execute an executable file.
 * @param source
 * @param filePath The absolute path to the file
 * @param config
 * @param [config.overrideExecutability = false] IF true, will not do any checks on whether the file is executable.
 * @param [config.executionHandler] Handle the execution of the file from the source. Default behavior is to use
 * source.exec or source.execute with the filePath and the remaining configuration passed to execute
 * @param [config.executabilityChecker] How to check if the file is executable from the source. Default behavior checks
 * the entry of the file whether it has a boolean value of executable. e.g. (await getEntry(source, filePath)).value.executable
 * unless overrideExecutability is true.
 * @memberOf Query
 */
export async function execute(source, filePath, config = {}) {
    const {
        overrideExecutability = false,
        executionHandler = async (source, filePath, config = {}) => {
            return (source?.exec || source?.execute)(filePath, config);
        } ,
        executabilityChecker = async (source, filePath, config = {}) => {
            return !!(await getEntry(source, filePath, config))?.value?.executable;
        },
        ... restConfig
    } = config;

    if (overrideExecutability || await executabilityChecker(source, filePath, restConfig)) {
        return executionHandler(source, filePath, restConfig);
    }
    throw new Error(`Could not execute ${filePath}`);
}

export function execute$(source, filePath, config = {}) {
    return defer(() => execute(source, filePath, config));
}