import {JsDelivr, inferCodeUrlOrModuleSpecifier} from "../../lib/resolve/index.js";

export function rollupFromJsdelivr(config = {}) {
    return {
        async resolveId(id, from) {
            // cjs or other things that shouldn't be processed
            if (id.indexOf("\0") > -1) return null;
            const repoType = ["gh", "npm", "wp"].find(o => id.startsWith(`/${o}/`));

            if (repoType) {
                id = id.slice(repoType.length + 2);
            }

            if (id.endsWith("/+esm")) {
                id = id.slice(0, id.length - 5);
            }

            try {
                const moduleInfo = inferCodeUrlOrModuleSpecifier(id);

                // console.log("Checking existence", id);
                if ((moduleInfo.module || moduleInfo.url) && await JsDelivr.exists(id)) {
                    // console.log("Exists", id);
                    return id
                }
                // console.log("Doesn't", id);
            } catch(e) {
                debugger;
            }
        },
        async load(id) {
            try {
                if (id?.indexOf("\0") > -1) return null;
                // console.log("Loading", id);
                const result = await JsDelivr.get(id);
                // console.log("Loaded", id);
                if (result && result.data) {
                    return result.data;
                }
            } catch(e) {debugger;}
        }
    }
}