export function map(obj, pred) {
    if (!Array.isArray(obj)) {
        const entries = Object.entries(obj);
        const resp = [];
        for (const [key, value] of entries) {
            resp.push(pred(value, key));
        }
        return resp;
    }
    return obj.map(pred);
}