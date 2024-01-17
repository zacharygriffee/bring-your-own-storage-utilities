<script>
    import {Styles} from "@sveltestrap/sveltestrap";
    import Tree from './Tree.svelte'

    export let source
    export let cwd = "/";
    export let iconSize = "30px";
    export let updated = 0;
    export let theme = "dark";

    export let addSelectVector = () => {
    };

    if (!source) {
        throw new Error("props.source must be defined.");
    }

</script>

<Styles bind:theme/>
<div oncontextmenu={(e) => {
    e.preventDefault();
    return false;
}}>
    {#key updated}
        <main>
            <Tree
                    bind:source
                    bind:cwd
                    bind:iconSize
                    bind:updated
                    bind:theme
            />
        </main>
    {/key}
</div>

<style>
    main :global(ul) {
        list-style: none;
        margin: 0;
    }

    main :global(ul) {
        padding-left: 1rem;
    }

    main :global(> ul) {
        padding: 0;
    }

    main :global(*) {
        font-size: 1rem;
        font-family: monospace;
    }

    main :global(svg) {
        opacity: 50%;
    }

    main :global(button) {
        padding: 0.2rem 0;
        background-color: transparent;
        border: none;
        width: 100%;
        display: flex;
        align-items: center;
    }

    main :global(svg) {
        padding: 0.2rem 0.3rem 0.2rem 0.2rem;
    }
</style>
