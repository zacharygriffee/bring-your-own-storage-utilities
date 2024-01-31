import { derived, writable } from 'svelte/store';
import { createStore } from './createStore.js';
import { createEdgeStore } from './createEdgeStore.js';
import { cursorPositionRaw } from '../../stores/CursorStore.js';
import { createDerivedCursorStore } from './createDerivedCursoreStore.js';
import { createBoundsStore } from './createBoundsStore.js';
import { calculateViewportCenter } from '../calculators/calculateViewPortCenter.js';
export function createGraph(id, config) {
    const { zoom, editable, translation: initialTranslation, direction, locked, edge } = config;
    const translation = writable({
        x: initialTranslation?.x || 0,
        y: initialTranslation?.y || 0
    });
    const dimensions = writable({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 });
    const scale = writable(zoom);
    const mounted = writable(false);
    const nodes = createStore();
    const bounds = createBoundsStore(nodes, dimensions, scale, translation);
    const center = derived([dimensions, translation, scale], ([$dimensions, $translation, $scale]) => {
        return calculateViewportCenter($dimensions, $translation, $scale);
    });
    const graph = {
        id,
        nodes,
        edges: createEdgeStore(),
        transforms: {
            translation,
            scale
        },
        maxZIndex: writable(2),
        dimensions,
        bounds,
        center,
        mounted,
        direction: direction || 'LR',
        editable: editable || false,
        edge: edge || null,
        editing: writable(null),
        cursor: createDerivedCursorStore(cursorPositionRaw, dimensions, translation, scale),
        locked: writable(locked || false),
        groups: writable({
            selected: { parent: writable(null), nodes: writable(new Set()) },
            hidden: { parent: writable(null), nodes: writable(new Set()) }
        }),
        groupBoxes: createStore(),
        activeGroup: writable(null),
        initialNodePositions: writable([])
    };
    return graph;
}
