import { createStore } from '../utils/creators/createStore.js';
import { writable } from 'svelte/store';
export const graphStore = createStore();
export const source = writable(null);
