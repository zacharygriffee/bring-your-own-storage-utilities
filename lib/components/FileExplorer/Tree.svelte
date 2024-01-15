<script>
    import * as Query from "../../../dist/query.min.js";
    import * as Find from "../../../dist/find.min.js";
    import Directory from './Directory.svelte';
    import File from './File.svelte';
    import * as rx from "rxjs";
    import path from "path";

    export let source;
    export let cwd;

    export let expanded
    export let selected
    export let iconSize;

    const loaders = {}
    const opened = {}

    let files$;
    $: files$ = openCwd(cwd);

    function breadcrumb(cwd = "") {
        return cwd.split("/").reduce(
            (acc, val) => {
                if (!val || !val.length) return acc || [];

                acc.push({
                    name: val,
                    fullPath: path.join("/", acc.map(o => o.name).join("/"), val)
                });

                console.log("Path change: ", acc);
                return acc;
            }, []
        );
    }

    function openCwd(cwd) {
        return Find.readdir$(source, cwd).pipe(
            rx.concatMap(
                name => {
                    const fullPath = path.resolve(cwd, name);
                    return Query.pathDetail$(source, fullPath)
                        .pipe(
                            rx.map(
                                type => ({
                                    ...(type ?? {}),
                                    dirname: path.dirname(fullPath),
                                    fullPath: fullPath,
                                    name
                                })
                            )
                        )
                }
            ),
            rx.reduce((acc, fileDetails) => {
                acc.push(fileDetails);
                console.log(fileDetails);
                return acc;
            }, [])
        )
    }

</script>
<section>
    <h3>
        <a style:cursor="pointer" on:click={() => cwd = "/"}>Root/</a>
        {#each breadcrumb(cwd) as {name, fullPath}}
            <a style:cursor="pointer" on:click={() => cwd = fullPath || "/"}>{name || ""}/</a>
        {/each}
    </h3>
    <ul>
        {#if $files$}
            {#each $files$ as detail, index}
                <li>
                    {#if detail.isFolder}
                        <Directory
                                opened={ opened[index] }
                                { detail }
                                on:open={ () => cwd = detail.fullPath }
                                on:close={ () => null }
                                { iconSize }
                        />
                    {:else}
                        <!-- TODO need to make sure File knows full path -->
                        <File
                                { selected }
                                { detail }
                                name={ detail.name }
                                on:click={ () => console.log("hello file") }
                                { iconSize }
                        />
                    {/if}
                </li>
            {/each}
        {/if}
    </ul>
</section>
