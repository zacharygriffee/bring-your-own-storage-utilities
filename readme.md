# bring-your-own-storage-utilities (byosu)
### Utilities for storage devices you bring on your own

---

### Support the cause towards decentralization

bitcoin: bc1q9fpu6muvmg5fj76pyzg3ffjrmksnvfj3c0xva6

---
---

### `!! Alpha  Stage !!`

Currently, most functions are prototypes that need to be optimized and
attempt to reduce dependency. They work just fine right now, but more can be done.

> Originally designed for hyperdrive | localdrive but anything with certain functions will do.
> A more thorough documentation on how will come along soon

---
---

# I love rxjs

I am aiming to make most of the API rxjs compatible. However, all the functions also have a promise based variation.

---

# API

## find

The find api functions mainly encompass directory traversals, node_module and package.json resolutions, and typical
file operations on storage you bring. The first parameter of all functions will take a source storage.

### [API Documentation](./docs/find-api.md)

- collectModules
- createImportMapFromModules
- fileURLToPath
- find-down
- find-up
- findNodeModule
- findNodeModulesDirectory
- findPackageDirectory
- findPackageJson
- list
- loadPackageJson
- parseModuleSpecifier
- pathDetail
- readdir
- resolvePackageExportsImports
- findPackageJson
- and more... [API Documentation](./docs/find-api.md)

---

## Installation

```sh
npm install bring-your-own-storage-utilities --save
```

## Todo

```ecmascript 6
/**
     todo: rollup-plugin for this library 
           or make a separate library that utilizes
           these functions
     
     todo: make tree-shakable package.json

     todo: ensure browser support with tests
 
     todo: ensure rxjs traversals doesn't have memory leaks.
 
     todo: more tests
 */
```

## Test it

```sh
npm test
```


Distributed under the MIT license. See ``LICENSE`` for more information.

