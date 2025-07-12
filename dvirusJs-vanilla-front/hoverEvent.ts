export interface HoverEventListener extends MouseEvent {
    isHover: boolean;
}

/**
 * Adds hover event listeners (mouseenter and mouseleave) to the specified element(s).
 *
 * @param {HTMLElement | HTMLElement[]} elements - The element or array of elements to listen for hover events.
 * @param {(event: HoverEventListener) => void} callback - The callback function to be called when mouse hover the element(s).
 * @param {Object} options - The options for the hover event listeners.
 * @param {number} options.delayIn - The delay in milliseconds before the callback is called when mouse enters the element(s).
 * @param {number} options.delayOut - The delay in milliseconds before the callback is called when mouse leaves the element(s).
 * @returns {() => void} A cleanUp function to remove the hover event listeners.
 */
export function addHoverEventListener(
    elements: HTMLElement | HTMLElement[],
    callback: (event: HoverEventListener) => void,
    options?: { delayIn?: number; delayOut?: number }
): () => void {
    const els = Array.isArray(elements) ? elements : [elements];
    let timerRef: ReturnType<typeof setTimeout> | null = null;

    const handleEnter = (event: MouseEvent) => {
        if (timerRef) {
            clearTimeout(timerRef);
        }
        timerRef = setTimeout(() => callback({ ...event, isHover: true }), options?.delayIn ?? 0);
    };
    const handleLeave = (event: MouseEvent) => {
        if (timerRef) {
            clearTimeout(timerRef);
        }
        timerRef = setTimeout(() => callback({ ...event, isHover: false }), options?.delayOut ?? 0);
    };

    els.forEach((el) => {
        el.addEventListener("mouseenter", handleEnter);
        el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
        els.forEach((el) => {
            el.removeEventListener("mouseenter", handleEnter);
            el.removeEventListener("mouseleave", handleLeave);
        });
    };
}

function main() {
    const element = document.querySelector<HTMLElement>(".element");
    if (!element) return;
    const cleanUp = addHoverEventListener(element, (event) => {
        console.log("Hover event", event.isHover);
    });

    // clean up the listener
    cleanUp();
}
