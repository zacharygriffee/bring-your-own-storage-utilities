<script>import { Node, Svelvet, Anchor, Edge } from "../../index.js";
import { defaultNodePropsStore } from "./DrawerNode.svelte";
export let width = 0;
export let height = 0;
export let minimap = false;
export let translation = { x: 0, y: 0 };
export let controls = false;
export let edge = null;
export let edgeStyle = "bezier";
export let snapTo = 0;
export let editable = false;
export let fitView = false;
export let locked = false;
export let zoom = 1;
export let theme = "light";
export let mermaid = "";
export let mermaidConfig = {};
export let TD = false;
export let disableSelection = false;
export let raiseEdgesOnSelect = false;
export let modifier = "meta";
export let trackpadPan = false;
export let toggle = false;
const svelvetProps = {
  width,
  height,
  minimap,
  translation,
  controls,
  edge,
  edgeStyle,
  snapTo,
  editable,
  fitView,
  locked,
  zoom,
  theme,
  mermaid,
  mermaidConfig,
  TD,
  disableSelection,
  raiseEdgesOnSelect,
  modifier,
  trackpadPan,
  toggle
};
let defaultNodes = [];
let dropped_in;
const handleDragEnter = () => {
  if (!dropped_in)
    dropped_in = true;
};
const handleDragLeave = () => {
  dropped_in = false;
};
const onDragOver = (e) => {
  e.preventDefault();
  return false;
};
const handleDrop = (e) => {
  e.stopPropagation();
  const moveEvent = new MouseEvent("mousemove", {
    clientX: e.clientX,
    clientY: e.clientY,
    bubbles: true
  });
  const target = e.target;
  target.dispatchEvent(moveEvent);
  defaultNodes = $defaultNodePropsStore;
};
</script>

<div
	role="presentation"
	class="drop_zone"
	on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:dragover={onDragOver}
	on:drop={handleDrop}
>
	<Svelvet {...svelvetProps} drawer>
		{#each defaultNodes as { anchors, edgeProps, ...nodeProps }}
			{#if anchors}
				<Node {...nodeProps} drop="cursor">
					<slot slot="anchorWest">
						{#each anchors.left as leftAnchorProps}
							{#if edgeProps}
								<Anchor {...leftAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...leftAnchorProps} />
							{/if}
						{/each}
					</slot>
					<slot slot="anchorEast">
						{#each anchors.right as rightAnchorProps}
							{#if edgeProps}
								<Anchor {...rightAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...rightAnchorProps} />
							{/if}
						{/each}
					</slot>
					<slot slot="anchorNorth">
						{#each anchors.top as topAnchorProps}
							{#if edgeProps}
								<Anchor {...topAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...topAnchorProps} />
							{/if}
						{/each}
					</slot>
					<slot slot="anchorSouth">
						{#each anchors.bottom as bottomAnchorProps}
							{#if edgeProps}
								<Anchor {...bottomAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...bottomAnchorProps} />
							{/if}
						{/each}
					</slot>
					{#each anchors.self as anchorProps}
						{#if edgeProps}
							<Anchor {...anchorProps}>
								<Edge {...edgeProps} slot="edge" />
							</Anchor>
						{:else}
							<Anchor {...anchorProps} />
						{/if}
					{/each}
				</Node>
			{:else}
				<Node {...nodeProps} drop="cursor" />
			{/if}
		{/each}

		<slot />
		<slot name="minimap" slot="minimap" />
		<slot name="controls" slot="controls" />
		<!-- <slot name="background" slot='background'></slot>  -->
		<slot name="toggle" slot="toggle" />
	</Svelvet>
</div>
