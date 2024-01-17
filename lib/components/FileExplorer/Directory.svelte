<script>
    import {longpress} from "../utils/longpress.js";
    const {onDestroy} = SvelteInternal;
    const {Icon, Button} = SvelteStrap;
    export let detail = {};
    export let cwd;
    export let addSelectVector = () => {};
    export function select(choice = !detail.selected) {
        detail.selected = choice;
    }

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
                inner.removeEventListener("longpress",eventFn)
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

    let selectIt = false;

    function onSelect(e) {
        if (selectIt || e.shiftKey || e.ctrlKey) {
            select();
            if (e.shiftKey) addSelectVector();
        } else cwd = detail.fullPath;
        selectIt = false;
    }

    detail.select = select;
</script>

<Button outline={!detail.selected} bind:inner  {...$$restProps}>
    <Icon {...$$restProps} name="folder"/>
    { detail.name }
</Button>