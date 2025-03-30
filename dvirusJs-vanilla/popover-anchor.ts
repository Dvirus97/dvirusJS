type Position = "before" | "start" | "center" | "end" | "after";
const DELAY_SHOW = 100;
const DELAY_HIDE = 150;

const getOrCreateOverlay = (): HTMLElement => {
    let overlay = document.getElementById("popover-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "popover-overlay";
        overlay.style.position = "absolute";
        overlay.style.inset = "0";
        overlay.style.pointerEvents = "none"; // Prevent interference with the app
        overlay.style.zIndex = "1000";
        document.body.appendChild(overlay);
    }
    return overlay;
};

/**
 * Applies popover functionality to all elements with the [popover][tooltip] attributes.
 * ```ts
 * type Position = "before" | "start" | "center" | "end" | "after";
 * ```
 * # popover element attributes
    - popover 
    - tooltip
    - id="popover-id" (string)
    - popoverAnchorVertical="before" (Position)  
    - popoverAnchorHorizontal="center" (Position)
    - popoverOnHover="false" 
    - popoverFallback="true" 

# trigger element attributes
    - popovertarget="popover-id"
 */
export function applyAnchorOnAllPopovers() {
    const tooltips = document.querySelectorAll<HTMLDivElement>("[popover][tooltip]");

    tooltips.forEach((tooltip) => {
        const id = tooltip.getAttribute("id");
        if (!id) {
            throw new Error("add 'id' to popover element");
        }
        const trigger = document.querySelector<HTMLElement>(`[popovertarget="${id}"]`);
        if (!trigger) {
            throw new Error(`add 'popovertarget' to trigger popover ${id}`);
        }

        const anchorVertical = (tooltip.getAttribute("popoverAnchorVertical") ||
            "before") as Position;
        const anchorHorizontal = (tooltip.getAttribute("popoverAnchorHorizontal") ||
            "center") as Position;
        const onHover = tooltip.getAttribute("popoverOnHover") ?? 'false';
        const withFallback = tooltip.getAttribute("popoverFallback") ?? 'false';

        tooltip.style.margin = "0";
        tooltip.style.position = "absolute";

        const updatePosition = () => {
            setTimeout(() => {
                anchor(
                    trigger,
                    tooltip,
                    {
                        vertical: anchorVertical,
                        horizontal: anchorHorizontal,
                    },
                    { withFallback: withFallback != "false" }
                );
            }, 10);
        };

        updatePosition();

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);
        trigger?.addEventListener("click", updatePosition);

        if (onHover != "false") {
            addHoverListeners(trigger, tooltip, updatePosition);
        }
    });
}

/**
 * Adds hover event listeners to the trigger and tooltip elements.
 * @param trigger - The element that triggers the popover.
 * @param tooltip - The popover element.
 * @param updatePosition - Function to update the position of the popover.
 */
function addHoverListeners(trigger: HTMLElement, tooltip: HTMLElement, updatePosition: () => void) {
    let timer: number | any;
    trigger.addEventListener("mouseenter", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            tooltip.style.display = "block";
            updatePosition();
        }, DELAY_SHOW);
    });
    tooltip.addEventListener("mouseenter", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            tooltip.style.display = "block";
            updatePosition();
        }, DELAY_SHOW);
    });
    trigger.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            tooltip.style.display = "none";
        }, DELAY_HIDE);
    });
    tooltip.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            tooltip.style.display = "none";
        }, DELAY_HIDE);
    });
}

// prettier-ignore
const _positions: { vertical: Position; horizontal: Position }[] = [
    // ...position,                                         
    { vertical: "before",    horizontal: "center"     },  
    { vertical: "center",    horizontal: "before"     },   
    { vertical: "center",    horizontal: "after"      },   
    { vertical: "after",     horizontal: "center"     }, 

    { vertical: "before",    horizontal: "before"     },  
    { vertical: "before",    horizontal: "start"      },   
    { vertical: "before",    horizontal: "end"        },     
    { vertical: "before",    horizontal: "after"      },   

    { vertical: "start",     horizontal: "before"     },   
    { vertical: "start",     horizontal: "start"      },   
    { vertical: "start",     horizontal: "center"     },   
    { vertical: "start",     horizontal: "end"        },   
    { vertical: "start",     horizontal: "after"      },   
    
    { vertical: "center",    horizontal: "start"      },   
    { vertical: "center",    horizontal: "end"        },   
    
    { vertical: "end",       horizontal: "before"     },   
    { vertical: "end",       horizontal: "start"      },   
    { vertical: "end",       horizontal: "center"     },   
    { vertical: "end",       horizontal: "end"        },   
    { vertical: "end",       horizontal: "after"      },   
    
    { vertical: "after",     horizontal: "before"     }, 
    { vertical: "after",     horizontal: "start"      }, 
    { vertical: "after",     horizontal: "end"        }, 
    { vertical: "after",     horizontal: "after"      }, 
];

/**
 * Positions the popover element relative to the anchor element.
 * @param anchor - The element to which the popover is anchored.
 * @param popover - The popover element.
 * @param position - The preferred position(s) for the popover. Can be a single position or an array of positions.
 *                   Each position is an object with `vertical` and `horizontal` properties.
 * @param options - Additional options for positioning.
 */
export function anchor(
    anchor: HTMLElement,
    popover: HTMLElement,
    position?:
        | { vertical: Position; horizontal: Position }
        | { vertical: Position; horizontal: Position }[],
    options?: {
        /** @param options.margin - The margin between the popover and the anchor. Default is 10. */
        margin?: number;
        /** @param options.withFallback - Whether to allow fallback to alternative positions if the preferred position doesn't fit. Default is `true`.*/
        withFallback?: boolean;
    }
) {
    position = position
        ? Array.isArray(position)
            ? position
            : [position]
        : [{ vertical: "before", horizontal: "center" }];
    options = {
        ...{
            margin: 10,
            withFallback: true,
            // animation: 200
        },
        ...options,
    };

    // const overlay = getOrCreateOverlay();
    // if (!overlay.contains(popover)) {
    //     overlay.appendChild(popover);
    // }

    const rectAnchor = anchor.getBoundingClientRect();
    const rectPopover = popover.getBoundingClientRect();

    const positions = options.withFallback ? [...position, ..._positions] : position;

    const calculatePosition = (v: Position, h: Position) => {
        let top = rectAnchor.top + window.scrollY;
        let left = rectAnchor.left + window.scrollX;

        switch (v) {
            case "start":
                top = top;
                break;
            case "center":
                top += (rectAnchor.height - rectPopover.height) / 2;
                break;
            case "end":
                top += rectAnchor.height - rectPopover.height;
                break;
            case "before":
                top -= rectPopover.height + options.margin!;
                break;
            case "after":
                top += rectAnchor.height + options.margin!;
                break;
        }

        switch (h) {
            case "start":
                left = left;
                break;
            case "center":
                left += (rectAnchor.width - rectPopover.width) / 2;
                break;
            case "end":
                left += rectAnchor.width - rectPopover.width;
                break;
            case "before":
                left -= rectPopover.width + options.margin!;
                break;
            case "after":
                left += rectAnchor.width + options.margin!;
                break;
        }

        return { top, left };
    };

    const isWithinBounds = (top: number, left: number) => {
        return (
            top >= window.scrollY + options.margin! &&
            left >= window.scrollX + options.margin! &&
            top + rectPopover.height <= window.scrollY + window.innerHeight - options.margin! &&
            left + rectPopover.width <= window.scrollX + window.innerWidth - options.margin!
        );
    };

    let finalPosition = { top: 0, left: 0 };
    let foundPosition = false;

    for (const pos of positions) {
        const { top, left } = calculatePosition(pos.vertical, pos.horizontal);
        if (isWithinBounds(top, left)) {
            finalPosition = { top, left };
            foundPosition = true;
            break;
        }
    }

    // If no valid position is found, fallback to the first position (default behavior)
    if (!foundPosition) {
        const fallback = calculatePosition(_positions[0].vertical, _positions[0].horizontal);
        finalPosition = { top: fallback.top, left: fallback.left };
    }

    popover.style.position = "absolute";
    popover.style.top = `${finalPosition.top}px`;
    popover.style.left = `${finalPosition.left}px`;
}
