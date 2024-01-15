<script>
	import { Icon } from "@sveltestrap/sveltestrap";

	export let detail;
	export let selected = false;
	export let icons;
	export let iconSize;
</script>

<style>
	button:hover {
		background-color: lightgray;
	}
</style>

<div>
	<button class:selected on:click>
		<Icon style="font-size: {iconSize}" name={!!detail.typeName ? "filetype-" + detail.typeName : 'file'}/>
<!--		<Icon data={ icons && icons(extension) || file } />-->
		{ detail.name }
	</button>
</div>
