# bring-your-own-storage-utilities (byosu)

### Utilities for storage devices you bring on your own

---

### Support the cause towards decentralization

bitcoin: bc1q9fpu6muvmg5fj76pyzg3ffjrmksnvfj3c0xva6

---
---

### `!! Alpha  Stage !!`

Currently, most functions are prototypes that need to be optimized and attempt to reduce dependency. They work just fine
right now, but more can be done.

---
---

## Demonstration

You can test this repo right now, in your browser. You can view the developer console (F12) when you enter to see the
very tests you can run in node. It takes a bit of startup time because of the supporting test tools.

[Live test in the browser](https://raw.githack.com/zacharygriffee/bring-your-own-storage-utilities/8fb2b6ebbfed5b16a51db6bca928fd5e5889e5ba/browser-tests.html)

- Loads an in-memory drive source in the browser
- Tests every API listed below
- Rollup and Svelte both compile and run right in the browser.
- Shows alpha tests of wip source explorer component.

## Installation

```sh
npm install bring-your-own-storage-utilities --save
```

---

## It starts with a source that you bring

> You can use the Adapt.iSource interface or if your source resembles the interface
> at all, it will probably work. Using the interface will ensure that the source is adapted
> to the utilities of the BYOSU Apis.

```ecmascript 6 
    // Example using a standard javascript object as a source.
    import {Adapt} from "bring-your-own-storage-utilities";
    const obj = {};
    const yourSource = Adapt.iSource({
      async get(key) {
          return obj[key];
      }.
      async exists(key) {
          return !!obj[key];
      },
      async put(key, buffer, config) {
          obj[key] = buffer;
      },
      async del(key) {
          if (obj[key]) {
            delete obj[key];
          }
      },
      * readdir(path) {
        for (const key of Object.keys(obj)) {
          if (keys.startsWith(key)) {
            yield path;
          }
        }
      } 
    });
```

> Your source after the above example will magically acquire much of the query API methods 
> and can be used in any of the other api

# API

#### `import * as BYOSU from "bring-your-own-storage-utilities"`

#### `import {Adapt, Find, Query, Resolve, Transport, Deploy} from "bring-your-own-storage-utilities"`

## `Query`

#### `import * as Query from "bring-your-own-storage-utilities/query"`

You could say this is pretty similar to find. But, query is where you've found a resource now you need to understand
that resource

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/query-api.md)

- Is it a file
- Is it a folder
- Get entry details of file
- List recursively or read directory shallow.
- Get mime-type of file with magic bytes

---

## `Find`

#### `import * as Find from "bring-your-own-storage-utilities/find"`

The find api functions mainly finding stuff in the source storage or making it easier to find stuff.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/find-api.md)

- Find files from a child directory up to the parents
- Find files from a parent to the child
- Find package.json file parent to the current working directory
- Find node_modules parent to current working directory

---

## `Resolve`

#### `import * as Resolve from "bring-your-own-storage-utilities/resolve"`

Have an id, specifier, import, name, hash table, whatever, this section should be for resolving these
identifiers and indexers to a resource.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/resolve-api.md)

- Resolve a bare module specifier and other files similar to node's `require` or es6's `import`
- Collect modules from parent directories that have a `node_modules` folder
- Load all `package.json` from child directory up to root directory
- JsDelivr resolve of bare module specifiers
- Turn string code into module.
- Get dataUri of code or other resources

---

## `Adapt`

Any adaptors that can help to use common sources. Or any adaptors to pipe the source to be consumed by other API.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/adapt-api.md)

- Wrap a collection of [random-access-storage](https://github.com/random-access-storage) instances.

---
## `Transport`

You need data from your source to go from point A to point B. Transport will help.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/transport-api.md)

- Fetch hook to fetch from your source or to create your own hooks.

## `Deploy`

You need to deploy something from your source to the end-user.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/deploy-api.md)

- [Rollup](https://rollupjs.org/) plugin to bundle files from your source
  - Utilizing dependency injection techniques. You can supply a `rollup module`, or this library will download 
it when `Deploy.pack` is used. See Deploy.setRollup in the api.
- [Svelte](https://svelte.dev/) plugin to compile .svelte files from browser for sources in the browser. 
  - Utilizing dependency injection techniques. You can supply the compile function from svelte library or this library will
download one. See `Deploy.setSvelteCompiler` in the api.
- ~~ [Terser](https://terser.org/) plugin for rollup that works in browser ~~ Disabled for now.
- [jsdelivr](https://www.jsdelivr.com/) plugin that gets module specifier from CDN jsdelivr.
  This plugin will only resolve to module. Even if a module is cjs it will resolve as a module. If the module is
  natively esm module, you shouldn't have any problems with this plugin. MOST cjs just works.... but things can get dicey for some
  complex cjs javascript.

---
## API included separately

---

## `Components`

Svelte components for handling source storages.

### [API Documentation](https://github.com/zacharygriffee/bring-your-own-storage-utilities/blob/master/docs/components-api.md)

- File explorer (WIP)
- Upload file from browser into your source
- Download files from your source zipped.
- Bootstrap.js that works with the way this library handles svelte

---

## Todo

- [ ] todo: examples for most functions
- [ ] todo: ensure rxjs traversals doesn't have memory leaks.
- [ ] todo: more coverage with tests including fails
- [ ] todo: adapter to transform source into a node:fs interface
- [ ] todo: support db like structures like hyperbee
- [ ] todo: document on how sources are consumed and interfaces they should have
- [x] todo: separate very large deploy (currently 4mb) from the rest as a `sdk`
- [ ] todo: thoroughly test every edge case with JsDelivr plugin/resolver

## Test it

```sh
npm test
```

Distributed under the MIT license. See ``LICENSE`` for more information.

