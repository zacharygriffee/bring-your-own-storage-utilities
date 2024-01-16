<script>
    import {Styles, Icon, Tooltip, Button} from "@sveltestrap/sveltestrap";
    import {nanoid} from "nanoid";
    import camelCase from "lodash-es/camelCase.js";
    import path from "path";
    import b4a from "b4a";

    let thisId = "u" + camelCase(nanoid());
    export let source;
    export let cwd = "/";
    export let color = "primary";
    export let theme = "dark";
    export let size = "lg";
    export let updated = 0;
    export let keyMutateFunction = (key) => {
        return key;
    };

    if (!source) {
        throw new Error("props.source must be defined.");
    }

    let uploaderElement;

    async function uploadTriggered() {
        for await (let file of uploaderElement.files) {
            const key = keyMutateFunction(path.resolve(cwd, file.name))
            const buf = b4a.from(await file.arrayBuffer());
            console.log("file upload", {fileName: key, buf});
            await source.put(key, buf);
        }
        updated++;
    }

    function registerFileUploadElement(ele) {
        uploaderElement = ele
    }
</script>

<Styles {theme}/>
{#if !!source.put}
    <slot {uploadTriggered} {registerFileUploadElement}>
        <Button disabled={!source.put} {color} {size} id="fileUploadLabel">
            <label style:cursor="pointer" for={thisId}>
                <Icon size="lg" name="upload"/>
            </label>
            <input use:registerFileUploadElement style="display: none" type="file" id={thisId} name="filename" multiple
                   on:change={uploadTriggered}/>
            <Tooltip target="fileUploadLabel">Upload Files</Tooltip>
        </Button>
    </slot>
{/if}