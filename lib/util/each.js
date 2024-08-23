export function each(array, pred) {
    if (!Array.isArray(array)) {
        throw new Error("Native each supports only array.");
    }
    return array.forEach(pred);
}