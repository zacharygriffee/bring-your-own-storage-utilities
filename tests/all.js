// if (typeof process !== "undefined" && process?.versions?.node) {
//     const {default: fetch} = await import("node-fetch".toString());
//     globalThis.fetch = fetch;
// }

await import("./find.js");
await import("./query.js");
await import("./deploy.js");
await import("./resolve.js");
await import("./adapt.js");
await import("./transport.js");