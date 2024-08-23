export function makeAMargarita(shake = true, double = false, up = false) {
    let state = {
        shaken: false
    };

    const tripleSec = double ? 1.5 : 0.75;
    const tequila = double ? 3 : 1.5;
    const scoopIce = up ? 0 : double ? 0.5 : 1;
    const shakeIt = () => {
        state.shaken = true;
    };
    return {
        state,
        tripleSec,
        tequila,
        ice: scoopIce,
        shakeIt
    }
}

export function snackPicks() {
    return import("./snacks-in-margarita.js").then(({default: snacks}) => snacks);
}

export {default as Specials} from "specials";