<script>
	import { Icon } from "@sveltestrap/sveltestrap";
	import {longpress} from "../utils/longpress.js";

	export let detail = {};
	export let icons;
	export let iconSize;

	export let addSelectVector = () => {};

	function open(e) {
		console.log("file clicked to be opened", e)
	}

	export function select(choice = !detail.selected) {
		detail.selected = choice;
	}

	let selectIt = false;
	function onSelect(e) {
		if (selectIt || e.shiftKey || e.ctrlKey) {
			detail.selected = !detail.selected
			if (e.shiftKey) addSelectVector();
		} else open(e);
		selectIt = false;
	}

	detail.select = select;
</script>

{#key detail.selected}
	<div>
		<button use:longpress={300} class="{detail.selected ? 'selected' : ''} "
				on:click={ e => onSelect(e) }
				on:longpress={e => selectIt = true }>
			<Icon style="font-size: {iconSize}" name={!!detail.typeName ? "filetype-" + detail.typeName : 'file'}/>
			{ detail.name }
		</button>
	</div>
{/key}

<style>
	.selected {
		background-color: #0e6cf8;
	}
	button:hover {
		background-color: #1a1948;
	}
</style>
