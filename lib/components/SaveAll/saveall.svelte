<script>
    import {Styles, Icon, Tooltip, Button} from "@sveltestrap/sveltestrap";
    import streamSaver from "streamsaver";
    import {ZipWriter} from "@zip.js/zip.js";
    import {toWeb} from "streamx-webstream";
    import {createReadStream, pathDetail$} from "../../../dist/query.min.js";
    import {of} from "rxjs";
    import {concatMap, mergeAll, map, mergeMap, filter} from "rxjs/operators";
    import {operators} from "../../etc.js";
    import {findDownMultiple$} from "../../../dist/find.min.js";

    const {
        takeSync
    } = operators;

    export let source;
    export let keys$;
    export let theme = "dark";
    export let color = "primary";
    export let size = "lg";
    export let updated = 0;
    export let readStreamConfig = {};
    export let downloadName = "sourceFiles.zip";
    export let state$;
    export let cwd;

    let keysCount;

    export let keyMutateFunction = (key, cwd) => {
        return cwd ? key.slice(cwd.length) : key;
    };

    if (!source) {
        throw new Error("props.source must be defined.");
    }

    function changeState(state) {
        if (state$?.next) {
            state$.next(state);
        }
    }

    function triggerDownload() {
        const _source = source;
        const writeStream = streamSaver.createWriteStream(downloadName);
        let zipWriter = new ZipWriter(writeStream);
        let writeCount = 0;

        keys$.pipe(
            takeSync(),
            concatMap((detail) => {
                if (detail.isFolder) {
                    return findDownMultiple$(_source, detail.fullPath + "/**")
                        .pipe(
                            mergeAll(),
                            mergeAll(),
                            mergeMap(path => pathDetail$(_source, path).pipe(
                                filter(detail => detail.isFile),
                                map(detail => ({...detail, fullPath: path})))
                            )
                        )
                } else {
                    return of(detail);
                }
            }),
            concatMap(async ({fullPath}) => {
                const stream = toWeb(
                    createReadStream(_source, fullPath, readStreamConfig)
                );
                await zipWriter.add(
                    keyMutateFunction(fullPath, cwd),
                    stream
                );
                writeCount++;
            }),
        ).subscribe(
            {
                complete() {
                    if (writeCount > 0) {
                        zipWriter.close().then(
                            () => {
                                console.log("Wrote ", writeCount, " files")
                            }
                        )
                    } else {
                        writeStream.abort();
                        changeState({
                            count: writeCount,
                            downloading: false,
                            aborted: true
                        });
                    }
                }
            }
        );
    }
</script>
<Styles {theme}/>

<slot {triggerDownload}>
    {#key updated}
        <Button {color} {size} id="fileDownloadButton" on:click={triggerDownload}>
            <Icon size="lg" name="download"/>
        </Button>
        <Tooltip target="fileDownloadButton">Download Zip</Tooltip>
    {/key}
</slot>
