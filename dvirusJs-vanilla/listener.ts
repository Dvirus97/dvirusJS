/**
 * A function type for listener callbacks.
 * @template TArgs - The type of the arguments passed to the listener function.
 * @param {TArgs} args - The arguments passed to the listener function.
 */
export type ListenerFn<TArgs> = (args: TArgs) => void;

/**
 * A class for managing event listeners.
 * @template TArgs - The type of the arguments passed to the listener functions.
 */
export class EventListener<TArgs> {
    private events: Record<string, { fn: ListenerFn<TArgs>; fnName?: string }[]> = {};

    /**
     * Registers a listener for a specific event.
     * @param {string} event - The name of the event.
     * @param {ListenerFn<TArgs>} listener - The listener function.
     * @param {string} [fnName] - An optional name for the listener function.
     */
    on(event: string, listener: ListenerFn<TArgs>, fnName?: string) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ fn: listener, fnName });
    }

    /**
     * Emits an event, calling all registered listeners with the provided arguments.
     * @param {string} event - The name of the event.
     * @param {TArgs} args - The arguments to pass to the listener functions.
     */
    emit(event: string, args: TArgs) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((listener) => {
            listener.fn(args);
        });
    }

    /**
     * Removes a listener for a specific event by its name.
     * @param {string} event - The name of the event.
     * @param {string} fnName - The name of the listener function to remove.
     */
    off(event: string, fnName: string) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter((l) => l.fnName != fnName);
    }
}

/**
 * A class for managing listeners with unique names.
 * @template TArgs - The type of the arguments passed to the listener functions.
 */
export class Listener<TArgs> {
    private map = new Map<string, ListenerFn<TArgs>>();

    /**
     * Registers a listener with an optional name.
     * @param {ListenerFn<TArgs>} listener - The listener function.
     * @param {string} [name] - An optional name for the listener function.
     */
    on(listener: ListenerFn<TArgs>, name?: string) {
        if (!name) {
            name = Math.random().toString(36).substring(7);
        }
        this.map.set(name, listener);
    }

    /**
     * Emits an event, calling all registered listeners with the provided arguments.
     * @param {TArgs} args - The arguments to pass to the listener functions.
     */
    emit(args: TArgs) {
        this.map.forEach((listener) => listener(args));
    }

    /**
     * Removes a listener by its name.
     * @param {string} name - The name of the listener function to remove.
     * @returns {boolean} - True if the listener was removed, false otherwise.
     */
    off(name: string): boolean {
        return this.map.delete(name);
    }
}

// usage
function main() {
    const eventLis = new EventListener<Record<string, unknown>>();
    eventLis.on("event1", (args) => {
        console.log(args);
    });

    eventLis.emit("event1", { a: "this is arg", b: 27 });

    const listener = new Listener<Record<string, unknown>>();
    listener.on((args) => {
        console.log(args);
    });

    listener.emit({ a: "this is arg", b: 27 });
}
