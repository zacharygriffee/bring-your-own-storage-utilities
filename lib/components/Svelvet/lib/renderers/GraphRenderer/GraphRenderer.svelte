<script>import GroupBoxRenderer from "../GroupBoxRenderer/GroupBoxRenderer.svelte";
import ZoomPanWrapper from "../../containers/ZoomPanWrapper/ZoomPanWrapper.svelte";
import { initialClickPosition, tracking } from "../../stores/CursorStore.js";
import { captureGroup, moveNodes } from "../../utils/movers/moveNodes.js";
import { getContext } from "svelte";
const graph = getContext("graph");
const snapTo = getContext("snapTo");
export let isMovable;
const activeGroup = graph.activeGroup;
const groups = graph.groups;
const initialNodePositions = graph.initialNodePositions;
const cursor = graph.cursor;
$:
  if ($activeGroup && $tracking) {
    moveNodes(graph, snapTo);
  }
function handleGroupClicked(event) {
  $tracking = true;
  const { groupName } = event.detail;
  $activeGroup = groupName;
  $initialClickPosition = $cursor;
  $initialNodePositions = captureGroup($groups[groupName].nodes);
}
</script>

<ZoomPanWrapper {isMovable}>
	<slot />
	<GroupBoxRenderer on:groupClick={handleGroupClicked} />
</ZoomPanWrapper>
