export function isExecutable({source, exec}) {
    if (typeof source.exec === "function") {
        return source.exec();
    }
    return source.executable || !!exec
}