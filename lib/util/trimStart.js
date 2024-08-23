export function trimStart(string, characters, join = true) {
    const characterMap = Array.isArray(characters) ? characters : characters.split("");
    if (characterMap.indexOf(string[0]) > -1) {
        const stringArr = Array.isArray(string) ? string : string.split("");
        for (;;) {
            if (characterMap.indexOf(stringArr[0]) > -1) {
                stringArr.shift();
            } else {
                break;
            }
        }

        return join ? stringArr.join("") : stringArr;
    }
    return string;
}