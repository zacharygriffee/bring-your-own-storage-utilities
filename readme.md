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

## `Find`

The find api functions mainly finding stuff in the source storage or making it easier to find stuff.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/find-api.md)

- Find files from a child directory up to the parents
- Find files from a parent to the child
- Find package.json file parent to the current working directory
- Find node_modules parent to current working directory
- List recursively or read directory shallow.

---
## `Query`

You could say this is pretty similar to find. But, query is more about `opening` and `loading` resources 
from the source storage.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/query-api.md)

- Is it a file
- Is it a folder

---

## `Resolve`

Have an id, specifier, import, name, extension, hash table, whatever, this section should be for resolving these 
identifiers and indexers to a resource.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/resolve-api.md)

- Resolve a bare module specifier and other files similar to node's `require` or es6's `import` 
- Collect modules from parent directories that have a `node_modules` folder
- Load all `package.json` from child directory up to root directory

---

## `Deploy`

You need to deploy something from your source to the end-user.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/deploy-api.md)

- Turn javascript code or any blob into `data uri`
- Create an import map of `data uri`'s collected by resolver for a webpage or other reasons.
- Coming soon: turn any javascript code into web worker baked by protocol channels.
- Coming soon: option to use `blob urls` as well as `data uri` 

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

