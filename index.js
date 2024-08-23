import {setPack} from "./lib/adapt/index.js";
import {pack} from "./lib/deploy/index.js";

await setPack(pack);

export * as Find from "./lib/find/index.js";
export * as Query from "./lib/query/index.js";
export * as Resolve from "./lib/resolve/index.js"
export * as Deploy from "./lib/deploy/index.js";
export * as Adapt from "./lib/adapt/index.js";
export * as Transport from "./lib/transport/index.js";
export {default as path} from "tiny-paths";

