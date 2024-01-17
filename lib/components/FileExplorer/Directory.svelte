<script>
	import { Icon } from "@sveltestrap/sveltestrap";
	import {longpress} from "../SveltUIiComposables/index.js";

	export let detail = {};
	export let iconSize;
	export let cwd;
	export let addSelectVector = () => {};

	export function select(choice = !detail.selected) {
		detail.selected = choice;
	}

	let selectIt = false;
	function onSelect(e) {
		e.preventDefault();
		if (selectIt || e.shiftKey || e.ctrlKey) {
			select();
			if (e.shiftKey) addSelectVector();
		} else cwd = detail.fullPath;
		selectIt = false;
	}

	detail.select = select;
</script>
{#key detail.selected}
	<button use:longpress={300}
			class="{detail.selected ? 'selected' : ''}"
			on:click={ e => onSelect(e) }
			on:longpress={e => selectIt = true}
	>
		<Icon style="font-size: {iconSize}" name="folder"/>
		{ detail.name }
	</button>
{/key}

<style>
	.selected {
		background-color: #0e6cf8;
	}
	button:hover {
		background-color: #1a1948;
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