<script>
    import { Styles, Icon } from "@sveltestrap/sveltestrap";
    import path from "path";
    import b4a from "b4a";
    export let source;
    export let cwd = "/";
    export let color = "primary";
    export let theme = "dark";
    export let size = "sm";
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

    function registerFileUploadElement(ele) { uploaderElement = ele }
</script>

<Styles {theme} />
{#if !!source.put}
    <label class="btn btn-{color} btn-{size}" for="myFile"><Icon name="upload" /></label>
    <input use:registerFileUploadElement style="display: none" type="file" id="myFile" name="filename" multiple on:change={uploadTriggered}/>
{/if}

<style>
    .button {
        display: inline-block;
        background: #000;
        border-radius: 4px;
        font-family: "arial-black";
        font-size: 14px;
        color: #FFF;
        padding: 8px 12px;
        cursor: pointer;
    }
</style>