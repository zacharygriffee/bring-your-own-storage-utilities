var specials = ['watermelon margarita'];

function makeAMargarita(shake = true, double = false, up = false) {
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

function snackPicks() {
    return Promise.resolve().then(function () { return snacksInMargarita$1; }).then(({default: snacks}) => snacks);
}

var snacksInMargarita = [
    "chips",
    "pretzels",
    "olives",
    "french fries"
];

var snacksInMargarita$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: snacksInMargarita
});

export { specials as Specials, makeAMargarita, snackPicks };
