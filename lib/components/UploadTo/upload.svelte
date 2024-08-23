<script>
    import {useHash} from "../SveltUIiComposables/index.js";
    import path from "path";
    import b4a from "b4a";
    const {Styles, Icon, Tooltip, Button} = SvelteStrap;
    const thisId = useHash("upload");
    const toolTipTargetId = "t" + thisId;
    export let source;
    export let cwd = "/";
    export let theme = "dark";
    export let updated = 0;
    export let writable = (source) => !!source.put && !!source.writable
    export let putter = (source, key, buf, config) => source.put(key, buf, config);
    export let putConfig = {};
    export let keyMutateFunction = (key) => {
        return key;
    };

    if (!source) {
        throw new Error("props.source must be defined.");
    }

    let uploaderElement;

    async function uploadTriggered() {
        const _source = source;
        for await (let file of uploaderElement.files) {
            const key = keyMutateFunction(path.resolve(cwd, file.name))
            const buf = b4a.from(await file.arrayBuffer());
            console.log("file upload", {fileName: key, buf});
            await Promise.resolve(putter(_source, key, buf, putConfig))
        }
        updated++;
    }

    function registerFileUploadElement(ele) {
        uploaderElement = ele
    }
</script>

<Styles {theme}/>
{#if !!writable(source)}
    <slot {uploadTriggered} {registerFileUploadElement}>
        <Button disabled={!writable(source)} {...$$restProps} id={toolTipTargetId}>
            <label style:cursor="pointer" for={thisId}>
                <Icon {...$$restProps} name="upload"/>
            </label>
            <input use:registerFileUploadElement style="display: none" type="file" id={thisId} name="filename" multiple
                   on:change={uploadTriggered}/>
            <Tooltip target={toolTipTargetId}>Upload Files</Tooltip>
        </Button>
    </slot>
{/if}