<script>
    import {of} from "rxjs";
    import {concatMap, mergeAll, map, mergeMap, filter} from "rxjs/operators";
    import {operators} from "../../etc.js";
    import {findDownMultiple$} from "../../../dist/find.min.js";
    import {pathDetail$} from "../../../dist/query.min.js";
        import {useHash} from "../SveltUIiComposables/index.js";
    const {
        takeSync
    } = operators;

    const {Styles, Icon, Tooltip, Button} = SvelteStrap;

    const thisId = useHash("delete");
    export let source;
    export let keys$;
    export let updated = 0;
    export let theme;
    export let findConfig = {};
    export let deletable = (source) => !!source.del && !!source.writable;
    export let deleter = (source, key, config) => source.del(key, config);

    function triggerDelete() {
        const _source = source;
        let deleteCount = 0;
        keys$.pipe(
            takeSync(),
            concatMap((detail) => {
                if (detail.isFolder) {
                    return findDownMultiple$(_source, detail.fullPath + "/**", findConfig)
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
                return deleter(_source, fullPath).then(
                    () => { deleteCount++ }
                );
            })
        ).subscribe({
            complete() {
                updated++;
            }
        });
    }
</script>

<Styles {theme}/>

{#key updated}
    <Button id={thisId} {...$$restProps} disabled={!deletable(source)} on:click={triggerDelete}>
        <Icon {...$$restProps} name="trash" />
    </Button>
    <Tooltip target={thisId}>Delete</Tooltip>
{/key}