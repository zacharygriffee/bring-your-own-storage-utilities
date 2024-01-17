export function longpress(node, threshold = 500) {
    const handle_mousedown = (e) => {
        const isTouch = e.type.startsWith("touch");
        e.preventDefault();
        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress', {detail: isTouch}));
        }, threshold);

        const cancel = () => {
            clearTimeout(timeout);
            if (isTouch) {
                node.removeEventListener("touchend", cancel);
                node.removeEventListener("touchmove", cancel);
            } else {
                node.removeEventListener('mousemove', cancel);
                node.removeEventListener('mouseup', cancel);
            }
        };

        if (isTouch) {
            node.addEventListener("touchend", cancel, {passive: false});
            node.addEventListener("touchmove", cancel, {passive: false});
        } else {
            node.addEventListener('mousemove', cancel);
            node.addEventListener('mouseup', cancel);
        }
    }

    node.addEventListener("touchstart", handle_mousedown, {passive: false});
    node.addEventListener('mousedown', handle_mousedown);

    return () => {
        node.removeEventListener('mousedown', handle_mousedown);
        node.removeEventListener("touchstart", handle_mousedown)
    };
}