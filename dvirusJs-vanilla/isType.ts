/**
 * A map of JavaScript types to their corresponding TypeScript types.
 * @template TInner - The type of the inner elements for object and array types.
 */
export type JsTypeMap<TInner = unknown> = {
    string: string;
    number: number;
    bigint: bigint;
    boolean: boolean;
    symbol: symbol;
    undefined: undefined;
    object: TInner;
    array: TInner[];
    function: (...args: unknown[]) => unknown;
};

/**
 * Checks if the given object is of the specified JavaScript type, and convert its type.
 * @template T - The key of the JsTypeMap.
 * @template TInner - The type of the inner elements for object and array types.
 * @param {unknown} obj - The object to check.
 * @param {T} type - The type to check against.
 * @returns {obj is JsTypeMap<TInner>[T]} - True if the object is of the specified type, false otherwise.
 */
export function isType<T extends keyof JsTypeMap, TInner = unknown>(
    obj: unknown,
    type: T
): obj is JsTypeMap<TInner>[T] {
    if (type === "array") return Array.isArray(obj);
    if (type === "object") return obj !== null && typeof obj === "object" && !Array.isArray(obj);
    return typeof obj === type;
}

// usage example
function main() {
    const obj: unknown = { a: 1, b: 2 };
    if (isType<"object", { a: number }>(obj, "object")) {
        console.log("Object:", obj.a);
    }
    if (isType<"array", string>(obj, "array")) {
        console.log("Array:", obj);
    }
    if (isType(obj, "number")) {
        console.log("Number:", obj);
    }
}
