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
    import {Swipe, SwipeItem} from "../../../dist/components/SvelteSwipe.min.js";
    import * as Query from "../../../dist/query.min.js";
    import UploadTo from "../../../dist/components/UploadTo.min.js"
    import SaveAll from "../../../dist/components/SaveAll.min.js";
    import Delete from "../../../dist/components/Delete.min.js";
    import Directory from './Directory.svelte';
    import File from './File.svelte';
    import {concatMap, map, reduce, filter, share, mergeAll} from "rxjs/operators";
    import path from "path";
    import {clickOutside} from "../utils/clickOutside.js";
    import {of} from "rxjs";

    const {
        Breadcrumb,
        BreadcrumbItem,
        Container,
        Row,
        Col,
        ButtonGroup,
        Button,
        Icon
    } = SvelteStrap;

    export let source;
    export let cwd;

    export let expanded
    export let selected
    export let iconSize;
    export let updated = 0;
    export let theme;
    export let buttonColors = "secondary";

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
                                    key$: of(type),
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
        <Col>
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
        <Col>
            <ul use:clickOutside on:click_outside={clearSelection}>
                {#each $files$ as detail, index}
                    {#if detail.isFile || detail.isFolder}
                        <li class="swipe-holder">
                            <Swipe bind:this={detail.swipeController}>
                                <SwipeItem>
                                    <Container>
                                        <Row>
                                            <Col xs="11">
                                                {#if detail.isFolder}
                                                    <Directory
                                                            addSelectVector={addSelectVector.bind(null, index)}
                                                            bind:detail
                                                            bind:cwd
                                                            size="lg"
                                                            style="pointer-events:fill; height:100%; font-size: x-large"
                                                            color={buttonColors}
                                                    />
                                                {:else}
                                                    <File
                                                            addSelectVector={addSelectVector.bind(null, index)}
                                                            bind:detail
                                                            size="lg"
                                                            style="pointer-events:fill; height:100%; font-size: x-large"
                                                            color={buttonColors}
                                                    />
                                                {/if}
                                            </Col>
                                            <Col xs="1">
                                                <Button
                                                        on:click={() => detail.swipeController.nextItem()}
                                                        style="pointer-events:fill; height:100%; font-size: x-large"
                                                >
                                                    <Icon name="arrow-bar-left" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </SwipeItem>
                                <SwipeItem>
                                    <ButtonGroup size="xl">
                                        <Button
                                                on:click={() => detail.swipeController.prevItem()}
                                                style="pointer-events:fill; height:100%; aspect-ratio: 1/1; font-size: x-large"
                                                size="lg"
                                        >
                                            <Icon name="arrow-bar-right" />
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup size="xl">
                                        <Delete
                                                bind:source
                                                bind:updated
                                                bind:theme
                                                keys$={detail.key$}
                                                size="lg"
                                                style="pointer-events:fill; height:100%; aspect-ratio: 1/1; font-size: x-large"
                                                color={buttonColors}
                                        />
                                        <SaveAll bind:source
                                                 bind:updated
                                                 bind:theme
                                                 bind:cwd
                                                 downloadName={detail.name + ".zip"}
                                                 keys$={detail.key$}
                                                 size="lg"
                                                 style="pointer-events:fill; height:100%; aspect-ratio: 1/1; font-size: x-large"
                                                 color={buttonColors}
                                        />
                                    </ButtonGroup>
                                </SwipeItem>
                            </Swipe>
                        </li>
                    {/if}
                {/each}
            </ul>
        </Col>
    </Row>
    <Row>
        <Col>
            <ButtonGroup>
                <UploadTo bind:cwd
                          bind:source
                          bind:updated
                          bind:theme
                          style="height:100%; aspect-ratio: 1/1; font-size: x-large"
                          color={buttonColors}/>
                <SaveAll bind:source
                         bind:updated
                         bind:theme
                         bind:cwd
                         style="height:100%; aspect-ratio: 1/1; font-size: x-large"
                         keys$={ selectedFileKeys$ }
                         color={buttonColors}/>
            </ButtonGroup>
        </Col>
    </Row>
</Container>

<style>
    .swipe-holder {
        height: 40px;
    }
</style>