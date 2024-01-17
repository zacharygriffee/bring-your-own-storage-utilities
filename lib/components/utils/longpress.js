export function longpress(node, threshold = 500) {
    const handle_mousedown = (e) => {
        if (e.type === "touchStart") e.preventDefault();
        const timeout = setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress'));
        }, threshold);

        const cancel = () => {
            clearTimeout(timeout);
            node.removeEventListener('mousemove', cancel);
            node.removeEventListener('mouseup', cancel);

            node.removeEventListener("touchend", cancel);
            node.removeEventListener("touchmove", cancel);
        };

        node.addEventListener('mousemove', cancel);
        node.addEventListener('mouseup', cancel);

        node.addEventListener("touchend", cancel,{ passive: false });
        node.addEventListener("touchmove", cancel,{ passive: false });
    }

    node.addEventListener('mousedown', handle_mousedown);
    node.addEventListener("touchstart", handle_mousedown, { passive: false });
    return {
        destroy() {
            node.removeEventListener('mousedown', handle_mousedown);
            node.removeEventListener("touchstart", handle_mousedown)
        }
    };
}