import "./overlay.css";
import { EventListener } from "../../dvirusJs-vanilla";

class OverlayClass {
    private overlay: HTMLElement;
    private static instance: OverlayClass;
    
    constructor() {
        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay-container");
        document.body.appendChild(this.overlay);
    }

    // Singleton pattern to ensure only one overlay container
    static getInstance(): OverlayClass {
        if (!OverlayClass.instance) {
            OverlayClass.instance = new OverlayClass();
        }
        return OverlayClass.instance;
    }

    create(config?: OverlayConfig): OverlayRef {
        const overlayPanel = document.createElement("div");
        const overlayRef = new OverlayRef(overlayPanel, this.overlay, config);
        return overlayRef;
    }

    // Cleanup method for testing or when needed
    destroy(): void {
        this.overlay.remove();
        OverlayClass.instance = undefined as any;
    }
}

class OverlayRef {
    private overlayPanel: HTMLElement;
    private overlayContainer: HTMLElement;
    private overlayWrapper: HTMLElement;
    backdrop: HTMLElement | undefined;
    private childElement: HTMLElement | undefined;
    private eventListener = new EventListener();
    private _anchorFn: (() => void) | undefined;
    private _isDisposed = false;

    constructor(element: HTMLElement, overlayContainer: HTMLElement, config?: OverlayConfig) {
        config = { ...new OverlayConfig(), ...config };

        element.classList.add("overlay-panel");
        this.overlayPanel = element;
        this.overlayContainer = overlayContainer;

        this.overlayWrapper = createAndAppendElement(
            "div",
            this.overlayContainer,
            "overlay-wrapper"
        );
        this.overlayWrapper.appendChild(this.overlayPanel);

        this.handleOverlayConfig(config);

        this.eventListener.onMany(["attach", "detach"], (e) => {
            if (this.hasAttached()) {
                this.backdrop?.classList.add("show");
            } else {
                this.backdrop?.classList.remove("show");
            }
        });
    }

    /**
     * Add element to overlay panel
     * @param element the element to append
     */
    attach(element: HTMLElement): void {
        if (this._isDisposed) {
            console.warn("Cannot attach to disposed overlay");
            return;
        }
        
        if (this.overlayPanel && !this.overlayPanel.contains(element)) {
            this.overlayPanel.appendChild(element);
            this.childElement = element;
            this.eventListener.emit("attach", { element });
            if (this._anchorFn) {
                this._anchorFn();
                window.addEventListener("scroll", this._anchorFn);
                window.addEventListener("resize", this._anchorFn);
            }
        }
    }

    /**
     * Remove element from overlay panel
     */
    detach(): void {
        if (this._isDisposed) return;
        
        if (this.overlayPanel && this.childElement) {
            this.overlayPanel.removeChild(this.childElement);
            this.eventListener.emit("detach", { element: this.childElement });
            this.childElement = undefined;
            this.removeAnchorListeners();
        }
    }

    /**
     * Remove the overlay panel from the overlay (delete from the dom)
     */
    dispose(): void {
        if (this._isDisposed) return;
        
        this._isDisposed = true;
        this.removeAnchorListeners();
        
        if (this.overlayPanel) {
            this.overlayPanel.remove();
            this.eventListener.emit("dispose", this.overlayPanel);
        }
        
        if (this.backdrop) {
            this.backdrop.remove();
        }
    }

    private removeAnchorListeners(): void {
        if (this._anchorFn) {
            window.removeEventListener("scroll", this._anchorFn);
            window.removeEventListener("resize", this._anchorFn);
        }
    }

    /**
     * Add class to the overlay panel
     * @param classes the class to add. Can be a string or an array of strings
     */
    addPanelClass(classes: string | string[]): void {
        if (this._isDisposed) return;
        
        classes = toArray(classes);
        if (this.overlayPanel) {
            this.overlayPanel.classList.add(...classes);
            this.eventListener.emit("addPanelClass", classes);
        }
    }

    /**
     * Remove class from the overlay panel
     * @param classes the class to remove. Can be a string or an array of strings
     */
    removePanelClass(classes: string | string[]): void {
        if (this._isDisposed) return;
        
        classes = toArray(classes);
        if (this.overlayPanel) {
            this.overlayPanel.classList.remove(...classes);
            this.eventListener.emit("removePanelClass", classes);
        }
    }

    backdropClicked(cbFn: (event: MouseEvent) => void): void {
        this.backdrop?.addEventListener("click", cbFn);
    }

    detachBackdrop(): void {
        this.backdrop?.remove();
        this.backdrop = undefined;
    }

    hasAttached(): boolean {
        return this.overlayPanel.children.length !== 0;
    }

    isDisposed(): boolean {
        return this._isDisposed;
    }

    anchor(
        element: HTMLElement,
        position?:
            | { vertical: Position; horizontal: Position }
            | { vertical: Position; horizontal: Position }[],
        options?: {
            /** @param options.margin - The margin between the popover and the anchor. Default is 10. */
            margin?: number;
            /** @param options.withFallback - Whether to allow fallback to alternative positions if the preferred position doesn't fit. Default is `true`.*/
            withFallback?: boolean;
        }
    ): void {
        if (this._isDisposed) return;
        
        this.removeAnchorListeners();
        
        this._anchorFn = () => {
            anchor({
                popover: this.overlayPanel,
                anchor: element,
                position,
                ...options,
            });
            this.overlayWrapper.style.position = "absolute";
        };
        
        this._anchorFn();
        window.addEventListener("scroll", this._anchorFn);
        window.addEventListener("resize", this._anchorFn);
    }

    private handleOverlayConfig(config?: OverlayConfig): void {
        if (!config) return;

        if (config.panelClass) this.overlayPanel.classList.add(...toArray(config.panelClass));

        if (config.hasBackdrop) {
            this.backdrop = createAndAppendElement(
                "div",
                this.overlayContainer,
                "overlay-backdrop"
            );
            if (config.closeOnBackdropClick) {
                this.backdrop.addEventListener("click", () => this.detach());
            }
            if (config.backdropClass) {
                this.backdrop?.classList.add(...toArray(config.backdropClass));
            }
        }

        this.overlayPanel.style.width = toPx(config.width!);
        this.overlayPanel.style.height = toPx(config.height!);

        if (config.minWidth) this.overlayPanel.style.minWidth = toPx(config.minWidth);
        if (config.minHeight) this.overlayPanel.style.minHeight = toPx(config.minHeight);
        if (config.maxWidth) this.overlayPanel.style.maxWidth = toPx(config.maxWidth);
        if (config.maxHeight) this.overlayPanel.style.maxHeight = toPx(config.maxHeight);

        switch (config.position) {
            case "center":
                this.overlayWrapper.style.justifyContent = "center";
                this.overlayWrapper.style.alignItems = "center";
                break;
            case "start":
                this.overlayWrapper.style.justifyContent = "start";
                this.overlayWrapper.style.alignItems = "start";
                break;
            case "end":
                this.overlayWrapper.style.justifyContent = "end";
                this.overlayWrapper.style.alignItems = "end";
                break;
            case "before":
                this.overlayWrapper.style.justifyContent = "center";
                this.overlayWrapper.style.alignItems = "start";
                break;
            case "after":
                this.overlayWrapper.style.justifyContent = "center";
                this.overlayWrapper.style.alignItems = "end";
                break;
        }
        if (config.top) this.overlayPanel.style.top = toPx(config.top);
        if (config.left) this.overlayPanel.style.left = toPx(config.left);

        if (config.anchor) {
            this._anchorFn = () => {
                anchor({
                    popover: this.overlayPanel,
                    anchor: config.anchor?.anchor,
                    margin: config.anchor?.margin,
                    position: config.anchor?.position,
                    withFallback: config.anchor?.withFallback,
                });
                this.overlayWrapper.style.position = "absolute";
            };
            this._anchorFn();
        }
    }
}

type Position = "start" | "center" | "end" | "before" | "after";
type OverlayPosition = Position;

class OverlayConfig {
    panelClass?: string | string[];
    hasBackdrop?: boolean;
    backdropClass?: string | string[];
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    position?: OverlayPosition;
    top?: string | number;
    left?: string | number;
    closeOnBackdropClick?: boolean;
    anchor?: Omit<AnchorOptions, "popover">;

    constructor(config?: OverlayConfig) {
        this.panelClass = config?.panelClass ?? [];
        this.hasBackdrop = config?.hasBackdrop ?? true;
        this.backdropClass = config?.backdropClass ?? [];
        this.position = config?.position ?? "center";
        this.closeOnBackdropClick = config?.closeOnBackdropClick ?? true;
        this.anchor = config?.anchor;

        this.width = (config?.width != undefined) ? toPx(config.width) : 'fit-content'; 
        this.height = (config?.height != undefined) ? toPx(config.height) : 'fit-content';
        this.minWidth = (config?.minWidth != undefined) ? toPx(config.minWidth) : undefined;
        this.minHeight = (config?.minHeight != undefined) ? toPx(config.minHeight) : undefined;
        this.maxWidth = (config?.maxWidth != undefined) ? toPx(config.maxWidth) : undefined;
        this.maxHeight = (config?.maxHeight != undefined) ? toPx(config.maxHeight) : undefined;
        this.top = (config?.top != undefined) ? toPx(config.top) : undefined;
        this.left = (config?.left != undefined) ? toPx(config.left) : undefined;
    }
}

// Use singleton pattern
export const Overlay = OverlayClass.getInstance();

function toPx(value: string | number): string {
    return isNaN(+value) ? (value as string) : `${value}px`;
}

function toArray<T>(value?: T | T[] | undefined | null, ifEmpty?: T): T[] {
    return value ? (Array.isArray(value) ? value : [value]) : ifEmpty ? [ifEmpty] : [];
}

function createAndAppendElement(tag: string, parent: HTMLElement, classes: string | string[]) {
    const element = document.createElement(tag);
    element.classList.add(...toArray(classes));
    parent.appendChild(element);
    return element;
}

// prettier-ignore
const _positions: { vertical: Position; horizontal: Position }[] = [
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

type AnchorOptions = {
    /** @param options.margin - The margin between the popover and the anchor. Default is 10. */
    margin?: number;
    /** @param options.withFallback - Whether to allow fallback to alternative positions if the preferred position doesn't fit. Default is `true`.*/
    withFallback?: boolean;
    /**  */
    position?:
        | { vertical: Position; horizontal: Position }
        | { vertical: Position; horizontal: Position }[];
    anchor?: HTMLElement;
    popover?: HTMLElement;
};

/**
 * Positions the popover element relative to the anchor element.
 * @param options - Configuration options for positioning
 */
function anchor(options: AnchorOptions): void {
    options.margin ??= 10;
    options.withFallback ??= true;
    options.position ??= [{ vertical: "before", horizontal: "center" }];

    const position = toArray(options.position);
    const anchor = options.anchor;
    const popover = options.popover;
    
    if (!anchor || !popover) {
        console.warn("Anchor or popover element is missing");
        return;
    }

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
