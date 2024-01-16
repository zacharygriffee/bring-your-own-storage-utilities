export function isString(str){
    if (str != null && typeof str.valueOf() === "string") {
        return true
    }
    return false
}