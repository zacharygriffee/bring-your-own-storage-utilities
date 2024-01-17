<script>
    import {Icon, Button} from "@sveltestrap/sveltestrap";
    import {longpress} from "../utils/longpress.js";
    import {onDestroy} from "../../../dist/svelte/svelte-internal.min.js";

    export let detail = {};
    export let icons;
    export let iconSize;

    export let addSelectVector = () => {
    };

    function open(e) {
        console.log("file clicked to be opened", e)
    }

    export function select(choice = !detail.selected) {
        detail.selected = choice;
    }

    let selectIt = false;

    function onSelect(e) {
        if (selectIt || e.shiftKey || e.ctrlKey) {
            detail.selected = !detail.selected
            if (e.shiftKey) addSelectVector();
        } else open(e);
        selectIt = false;
    }

    detail.select = select;

    let inner;
    const cleanup = [];
    onDestroy(() => {
        for (let x of cleanup) {
            x();
        }
    });

    $: if (inner) {
        {
            const cleanupLongPress = longpress(inner, 250)
            const eventFn = (e) => {
                selectIt = true;
                e.detail && onSelect(e);
            };
            inner.addEventListener(
                "longpress",
                eventFn
            );

            cleanup.push(() => {
                inner.removeEventListener("longpress", eventFn)
                cleanupLongPress();
            });
        }

        {
            inner.addEventListener("click", onSelect);
            cleanup.push(() => {
                inner.removeEventListener("click", onSelect);
            })
        }

        {
            const preventDef = (e) => { e.preventDefault(); }
            inner.addEventListener("contextmenu", preventDef)
            cleanup.push(() => {
                inner.removeEventListener("contextmenu", preventDef);
            })
        }
    }
</script>

<Button outline={!detail.selected} bind:inner>
    <Icon style="font-size: {iconSize}" name={!!detail.typeName ? "filetype-" + detail.typeName : 'file'}/>
    { detail.name }
</Button>