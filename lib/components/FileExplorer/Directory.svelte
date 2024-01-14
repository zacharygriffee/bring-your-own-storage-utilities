<script>
	import Icon from 'svelte-awesome'
	import { caretRight, caretDown, folder, folderOpen } from 'svelte-awesome/icons'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let detail = {};
	export let opened = false
	let directory = detail.name;
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
	<Icon data={ opened ? caretDown : caretRight } class="caret" />
	<Icon data={ opened ? folderOpen : folder } class="folder" />
	{ directory }
</button>
