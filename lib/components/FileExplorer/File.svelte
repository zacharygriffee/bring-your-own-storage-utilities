<script>
    import {longpress} from "../utils/longpress.js";
    const {onDestroy} = SvelteInternal;
    const {Icon, Button} = SvelteStrap;
    export let detail = {};

    export let addSelectVector = () => {
    };

    function open(e) {
        if (detail.swipeController) {
            detail.swipeController.nextItem()
        }
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
            const cleanupLongPress = longpress(inner, 300)
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

<Button outline={!detail.selected} bind:inner {...$$restProps}>
    <Icon {...$$restProps} name={!!detail.typeName ? "filetype-" + detail.typeName : 'file'}/>
    { detail.name }
</Button>