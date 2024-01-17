<script context="module">
    import {BehaviorSubject} from "rxjs";

    class SvelteSubject extends BehaviorSubject {
        set(value) {
            super.next(value);
        }

        lift(operator) {
            const result = new SvelteSubject();
            result.operator = operator;
            result.source = this;
            return result;
        }
    }
</script>

<script>
    import {
        Breadcrumb,
        BreadcrumbItem,
        Container,
        Row,
        Col,
        ButtonGroup
    } from "@sveltestrap/sveltestrap";
    import * as Query from "../../../dist/query.min.js";
    import UploadTo from "../../../dist/components/UploadTo.min.js"
    import SaveAll from "../../../dist/components/SaveAll.min.js";
    import Directory from './Directory.svelte';
    import File from './File.svelte';
    import {concatMap, map, reduce, filter, share, mergeAll} from "rxjs/operators";
    import path from "path";
    import {clickOutside} from "../utils/clickOutside.js";

    export let source;
    export let cwd;

    export let expanded
    export let selected
    export let iconSize;
    export let updated = 0;
    export let theme;

    const loaders = {}

    export const files$ = new SvelteSubject([]);
    export const selectedFiles$ = files$.pipe(
        mergeAll(),
        filter(o => o.selected),
    );

    const selectedFileKeys$ = selectedFiles$.pipe(
        share()
    );

    $: if (cwd) openCwd(cwd);
    $: if (updated) openCwd(cwd);

    let selectVector = [];

    function addSelectVector(x) {
        selectVector = [...selectVector, x];
        if (selectVector.length === 2) {
            const [x, y] = [Math.min(...selectVector), Math.max(...selectVector)];
            files$.getValue().forEach(
                (o, i) => {
                    if (i > x && i < y) o.select(true);
                }
            );
            selectVector.shift();
        }
    }

    function clearSelection() {
        // To ensure all consumers of files$ got the selected files
        // before clearing them.
        setTimeout(() => {
            selectVector = [];
            files$.getValue().forEach(
                o => o.select(false)
            );
        }, 12);
    }

    function breadcrumb(cwd = "") {
        const p = cwd.split("/").reduce(
            (acc, val) => {
                if (!val || !val.length) return acc || [];

                acc.push({
                    name: val,
                    fullPath: path.join("/", acc.map(o => o.name).join("/"), val)
                });

                return acc;
            }, []
        );

        p.unshift({name: "root", fullPath: "/"});
        return p;
    }

    function openCwd(cwd) {
        // console.log("opwnCwd triggered", cwd);
        // files$ = new SvelteSubject([]);
        Query.readdir$(source, cwd).pipe(
            concatMap(
                name => {
                    const fullPath = path.resolve(cwd, name);
                    return Query.pathDetail$(source, fullPath)
                        .pipe(
                            map(
                                type => ({
                                    ...(type ?? {}),
                                    dirname: path.dirname(fullPath),
                                    fullPath: fullPath,
                                    name,
                                    selected: false,
                                    select() { /* here until component initializes */
                                    }
                                })
                            )
                        )
                }
            ),
            reduce((acc, fileDetails) => {
                acc.push(fileDetails);
                console.log(fileDetails);
                return acc;
            }, []),
            map(
                o => o.sort((a, b) => a.isFolder > b.isFolder ? -1 : 1)
            )
        ).subscribe(
            files => files$.next(files)
        );
    }


</script>

<Container>
    <Row>
        <Col xs="12">
            <h3>
                <Breadcrumb divider="/">
                    {#each breadcrumb(cwd) as {name, fullPath}}
                        <BreadcrumbItem>
                            <a style:cursor="pointer" on:click={() => cwd = fullPath || "/"}>{name || ""}</a>
                        </BreadcrumbItem>
                    {/each}
                </Breadcrumb>
            </h3>
        </Col>
    </Row>
    <Row>
        <Col xs="12">
            <ul use:clickOutside on:click_outside={clearSelection}>
                {#each $files$ as detail, index}
                    {#if detail.isFile || detail.isFolder}
                        <li>
                            {#if detail.isFolder}
                                <Directory
                                        addSelectVector={addSelectVector.bind(null, index)}
                                        bind:detail
                                        bind:cwd
                                        bind:iconSize
                                />
                            {:else}
                                <File
                                        addSelectVector={addSelectVector.bind(null, index)}
                                        bind:detail
                                        bind:iconSize
                                />
                            {/if}
                        </li>
                    {/if}
                {/each}
            </ul>
        </Col>
    </Row>
    <Row>
        <Col xs="1">
                <ButtonGroup size="lg">
                    <UploadTo bind:cwd
                              bind:source
                              bind:updated
                              bind:theme
                              color="secondary"/>
                </ButtonGroup>
        </Col>
        <Col xs="1">
            <ButtonGroup size="lg">
                <SaveAll bind:source
                         bind:updated
                         bind:theme
                         bind:cwd
                         keys$={ selectedFileKeys$ }
                         color="secondary"/>
            </ButtonGroup>
        </Col>
    </Row>
</Container>

