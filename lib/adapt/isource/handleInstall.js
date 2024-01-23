import {importCode} from "../../resolve/importCode.js";
import {rollupFromJsdelivr} from "../../deploy/rollup-from-jsdelivr.js";
import {rollupVirtualPlugin} from "../../deploy/rollup-virtual-plugin.js";
import {aliasTo, asClass, asFunction, asValue} from "../../awilix.js";
import {importPack, pack} from "./importPack.js";

let preFront;
export default (x) => {
    preFront = x;
}

export function handleInstall({factory}) {
    return (name, outputSource) =>
        Promise.resolve().then(
            async () => {
                if (!pack) {
                    await importPack(typeof window === "undefined" ? "../deploy/pack.js" : undefined);
                }

                let code;
                if (outputSource) {
                    code = await outputSource.get(name);
                }

                if (!code) {
                    const packOpts = {};
                    if (!name) name = "source";
                    (packOpts.plugins ||= []).unshift(
                        rollupVirtualPlugin({
                            [name]: await (factory?.() || factory)
                        })
                    );

                    packOpts.plugins.push(rollupFromJsdelivr());
                    const result = await pack(name, packOpts);
                    ({code} = result);
                    if (outputSource) await outputSource.put(name, code);
                }

                try {
                    if (code) {
                        const mod = await importCode(code);
                        const container = preFront(mod);
                        if (mod.extensions) {
                            await mod.extensions(container, {asFunction, asValue, aliasTo, asClass});
                        }
                        return container.cradle;
                    } else {
                        return false;
                    }
                } catch (e) {
                    debugger;
                }
                return false;
            }
        );
}