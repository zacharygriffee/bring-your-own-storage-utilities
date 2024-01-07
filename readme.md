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

> Originally designed for [hyperdrive](https://docs.holepunch.to/building-blocks/hyperdrive) |
> [localdrive](https://docs.holepunch.to/helpers/localdrive) but this library strives to be usable for any
> storage source that is available. 

---
---


## Installation

```sh
npm install bring-your-own-storage-utilities --save
```

---

# It starts with a source

Most functions currently have the ability to adapt to most source storages. For example,
the find-down by default will access source.readdir, but you can supply your own observable 
if you need specific way to list the files in the directory. Check the function on what ways 
you can adapt your source storage for it.

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

# Initial plan

- I am aiming to make most of the API rxjs compatible. However, all the functions also have a promise based variation.
- I am aiming to be completely browser-compatible.
- I am planning rollup and bundling from the browser.


---

## Todo

```ecmascript 6
/**
   
     todo: examples for most functions
     
     todo: rollup-plugin for this library 
           or make a separate library that utilizes
           these functions
     
     todo: make tree-shakable package.json

     todo: ensure browser support with tests
 
     todo: ensure rxjs traversals doesn't have memory leaks.
 
     todo: more tests
 
     todo: make random-access-storage adapter
 
     todo: test with hyperbee and make it more compatible
 */
```

## Test it

```sh
npm test
```


Distributed under the MIT license. See ``LICENSE`` for more information.

