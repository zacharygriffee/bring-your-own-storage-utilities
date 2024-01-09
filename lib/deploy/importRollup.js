let rollupPackage;
if (typeof process !== "undefined" && process?.versions?.node) {
    rollupPackage = await import("rollup");
} else {
    rollupPackage = await import("@rollup/browser");
}
const {
    VERSION,
    defineConfig,
    rollup,
    watch
} = rollupPackage;

export {
    VERSION,
    defineConfig,
    rollup,
    watch
};