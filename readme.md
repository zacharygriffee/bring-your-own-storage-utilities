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

## Demonstration

You can test this repo right now, in your browser. You can view the developer console (F12) when you enter to see the
very tests you can run in node. It takes a bit of startup time because of the supporting test tools.

[Live test in the browser](https://raw.githack.com/zacharygriffee/bring-your-own-storage-utilities/4dc361ab099aad1488879428cc6876e524d1fa65/browser-tests.html)

- Loads an in-memory drive source in the browser
- Tests every API listed below
- Rollup and Svelte both compile and run right in the browser.

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
#### `import * as BYOSU from "bring-your-own-storage-utilities"`
#### `import {Adapt, Deploy, Find, Query, Resolve} from "bring-your-own-storage-utilities"`

> Deploy makes the 'all import' above large. If you don't need deploy, import the ones below individually.

## `Find`
#### `import * as Find from "bring-your-own-storage-utilities/find"`


The find api functions mainly finding stuff in the source storage or making it easier to find stuff.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/find-api.md)

- Find files from a child directory up to the parents
- Find files from a parent to the child
- Find package.json file parent to the current working directory
- Find node_modules parent to current working directory
- List recursively or read directory shallow.

---
## `Query`
#### `import * as Query from "bring-your-own-storage-utilities/query"`

You could say this is pretty similar to find.
But, query is where you've found a resource now you need to understand that resource

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/query-api.md)


- Is it a file
- Is it a folder
- Get entry details of file

---

## `Resolve`
#### `import * as Resolve from "bring-your-own-storage-utilities/resolve"`

Have an id, specifier, import, name, extension, hash table, whatever, this section should be for resolving these 
identifiers and indexers to a resource.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/resolve-api.md)

- Resolve a bare module specifier and other files similar to node's `require` or es6's `import` 
- Collect modules from parent directories that have a `node_modules` folder
- Load all `package.json` from child directory up to root directory

---

## `Deploy`
#### `import * as Deploy from "bring-your-own-storage-utilities/deploy"`

You need to deploy something from your source to the end-user.


### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/deploy-api.md)

- [Rollup](https://rollupjs.org/) plugin to bundle files from your source
  - including pack(inputName, outputName, rollupConfig) function to make the entire process easier
- [Svelte](https://svelte.dev/) plugin to compile .svelte files from browser for sources in the browser.
- [Terser](https://terser.org/) plugin for rollup that works in browser.

> Deploy is like an SDK. So, of course it's going to be a large script.

---

## `Adapt`

Any adaptors that can help to use common sources. Or any adaptors to pipe the source to be consumed by other API.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/adapt-api.md)

- Wrap a collection of [random-access-storage](https://github.com/random-access-storage) instances. 

---

## Todo

- [ ] todo: examples for most functions
- [ ] todo: ensure rxjs traversals doesn't have memory leaks.
- [ ] todo: more coverage with tests including fails
- [ ] todo: adapter to transform source into a node:fs interface
- [ ] todo: support db like structures like hyperbee
- [ ] todo: document on how sources are consumed and interfaces they should have

## Test it

```sh
npm test
```


Distributed under the MIT license. See ``LICENSE`` for more information.

