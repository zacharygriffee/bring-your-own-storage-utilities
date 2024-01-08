import {test} from "brittle";
import {createDataUri} from "../lib/deploy/index.js";

test("createDataUri",async (t) => {
    const {default: theAnswer} = await import(createDataUri(`export default 42`));
    t.is(theAnswer, 42);
});