import { createGraph, createNode } from '../creators/index.js';
import { createAnchor } from '../creators/createAnchor.js';
export function reloadStore(store) {
    const object = JSON.parse(store);
    const graph = createGraph(object.id, {
        ...object,
        initialZoom: object.transforms.scale
    });
    Object.entries(object.nodes).forEach(([id, node]) => {
        const nodeProps = node;
        const newNode = createNode(nodeProps);
        Object.entries(node.anchors).forEach(([id, anchor]) => {
            const newAnchor = createAnchor(newNode, id, anchor.position, { width: 0, height: 0 }, anchor.input, anchor.direction, anchor.dynamic);
            newNode.anchors.add(newAnchor, id);
        });
        graph.nodes.add(newNode, id);
    });
    Object.entries(object.edges).forEach(([id, edge]) => {
        graph.edges.add(edge, id);
    });
    return graph;
}
