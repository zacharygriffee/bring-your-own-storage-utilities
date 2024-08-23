import * as _ from "lodash-es";

export function hasFile(arr, file, equals, mapper = x => x) {
    return !!_.find(arr, (o) => equals ? file === mapper(o) : mapper(o.endsWith(file)));
}