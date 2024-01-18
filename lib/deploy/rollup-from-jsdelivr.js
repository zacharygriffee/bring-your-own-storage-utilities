import {JsDelivr, inferCodeUrlOrModuleSpecifier} from "../../lib/resolve/index.js";
import {firstValueFrom} from "rxjs";

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
                if (moduleInfo.module || moduleInfo.url) {
                    return id
                }
            } catch(e) {}
        },
        async load(id) {
            try {
                if (id.indexOf("\0") > -1) return null;
                const result = await JsDelivr.get(id);
                if (result && result.data) {
                    return result.data;
                }
            } catch(e) {debugger;}
        }
    }
}