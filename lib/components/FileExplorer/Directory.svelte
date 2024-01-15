<script>
	import { Icon } from "@sveltestrap/sveltestrap";
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let detail = {};
	export let opened = false;
	export let iconSize;
</script>

<style>
	button:hover {
		background-color: #dddddd;
	}
	button :global(svg.caret) {
		width: 0.6rem;
		padding-right: 0;
	}
	button :global(svg.folder) {
		width: 1.2rem;
		height: 1rem;
	}
</style>

<button on:click={ () => dispatch(opened ? 'close' : 'open') }>
	<Icon style="font-size: {iconSize}" name="folder" />
<!--	<Icon data={ opened ? caretDown : caretRight } class="caret" />-->
<!--	<Icon data={ opened ? folderOpen : folder } class="folder" />-->
	{ detail.name }
</button>
