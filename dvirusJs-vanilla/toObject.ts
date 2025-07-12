export function toObject<T extends Record<string, any>>(
    list: T[],
    keyGetter: (item: T) => string | number
): Record<string, T> {
    return list.reduce((acc, item) => {
        acc[keyGetter(item)] = item;
        return acc;
    }, {} as Record<string, T>);
}

export function toArray<T>(obj: T | T[] | undefined | null, defaultValue: T[] = []): T[] {
    if (obj === undefined || obj === null) return defaultValue;
    if (Array.isArray(obj)) return obj;
    return [obj];
}

function main() {
    const list = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
    ];
    const obj = toObject(list, (x) => x.name);
    console.log(obj); /* 
    { 
    John: 
        { name: 'John', age: 30 }, 
    Jane: 
        { name: 'Jane', age: 25 } 
    } 
    */
}
