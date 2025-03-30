/**
 * Type representing the available aggregation functions.
 */
type AggregatorFunc = "sum" | "avg" | "min" | "max" | "count";

/**
 * Record of aggregation functions.
 */
export const mathAggr: Record<AggregatorFunc, (values: any[]) => any> = {
    sum: (values) => values.reduce((a, b) => a + b, 0),
    avg: (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0),
    min: (values) => Math.min(...values),
    max: (values) => Math.max(...values),
    count: (values) => values.length,
};

/**
 * Interface representing an aggregation configuration.
 */
export interface Aggregation<K> {
    aggregator: AggregatorFunc;
    field: K;
    alias?: string;
}

export type Grouped<K, T> = { keys: K; items: T[] };

export type GroupKey = string | number;
// type GroupedData<T, K extends keyof T> = Record<string, { [P in K]: T[P] } & { items: T[] }>;

// type Grouped<T> = {
//     [key: string | number]: T[];
// };

type LinqJsType = string | number | boolean | Record<string, any>;

/**
 * Class representing a collection of items with LINQ-like operations.
 */
export class LinqJs<T extends LinqJsType> {
    private list: T[];

    /**
     * Creates an instance of LinqJs.
     * @param list - The initial list of items.
     */
    constructor(list: T[]) {
        this.list = list;
    }

    /**
     * Filters the list based on a predicate function.
     * @param predicate - The predicate function to filter items.
     * @returns The filtered LinqJs instance.
     */
    where(predicate: (item: T) => boolean): LinqJs<T> {
        this.list = this.list.filter(predicate);
        return this;
    }

    /**
     * Projects each element of the list into a new form.
     * @param selector - A transform function to apply to each element.
     * @returns A new LinqJs instance with the transformed elements.
     */
    select<R extends LinqJsType>(selector: (item: T) => R): LinqJs<R> {
        return new LinqJs<R>(this.list.map(selector));
    }

    /**
     * Sorts the list based on a key selector function.
     * @param keySelector - A function to extract the key for each element.
     * @param ascending - Whether to sort in ascending order (default is true).
     * @returns The sorted LinqJs instance.
     */
    orderBy(keySelector: (item: T) => any, ascending: boolean = true): LinqJs<T> {
        this.list = this.list.sort((a, b) => {
            const valueA = keySelector(a);
            const valueB = keySelector(b);
            if (typeof valueA === "number" && typeof valueB === "number") {
                return ascending ? valueA - valueB : valueB - valueA;
            }
            return ascending
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });
        return this;
    }

    /**
     * Takes the first n elements from the list.
     * @param count - The number of elements to take.
     * @returns A new LinqJs instance with the taken elements.
     */
    take(count: number): LinqJs<T> {
        this.list = this.list.slice(0, count);
        return this;
    }

    /**
     * Skips the first n elements from the list.
     * @param count - The number of elements to skip.
     * @returns A new LinqJs instance with the remaining elements.
     */
    skip(count: number): LinqJs<T> {
        this.list = this.list.slice(count);
        return this;
    }

    /**
     * Groups the list by a specified key.
     * @param keySelector - A function to extract the key for each element.
     * @returns A new LinqJs instance with grouped elements.
     */
    // groupBy<R extends string | number>(
    //     keySelector: (item: T) => R
    // ): LinqJs<{ key: R; items: T[] }> {
    //     const groupedData: Record<R, { key: R; items: T[] }> = this.list.reduce<
    //         Record<R, { key: R; items: T[] }>
    //     >((groups, item) => {
    //         const key = keySelector(item);
    //         if (!groups[key]) {
    //             groups[key] = { key, items: [] };
    //         }
    //         groups[key].items.push(item);
    //         return groups;
    //     }, {} as Record<R, { key: R; items: T[] }>);

    //     const value: { key: R; items: T[] }[] = Object.values(groupedData);
    //     return new LinqJs(value);
    // }
    groupBy<R extends GroupKey | GroupKey[]>(keySelector: (item: T) => R): LinqJs<Grouped<R, T>> {
        const groupedData: Record<string, Grouped<R, T>> = this.list.reduce<
            Record<string, Grouped<R, T>>
        >((groups, item) => {
            const _keyTuple = keySelector(item);
            const keyTuple = Array.isArray(_keyTuple) ? _keyTuple : [_keyTuple] as R;
            const compositeKey = JSON.stringify(keyTuple); // Use a stringified version of the tuple as the key
            if (!groups[compositeKey]) {
                groups[compositeKey] = {
                    keys: keyTuple,
                    items: [],
                };
            }
            groups[compositeKey].items.push(item);
            return groups;
        }, {} as Record<string, Grouped<R, T>>);

        const value: Grouped<R, T>[] = Object.values(groupedData);
        return new LinqJs(value);
    }

    // /**
    //  * Groups the list by specified keys.
    //  * @param keys - The keys to group by.
    //  * @returns A new LinqJs instance with grouped elements.
    //  */
    // groupByOnly<K extends keyof T | "">(keys: K[]): LinqJs<
    //     T extends Record<string, any>
    //         ? { [P in K]: T[P] } & { items: T[] }
    //         : never
    // > {
    //     if (typeof this.list[0] !== "object") {
    //         throw new Error("groupByOnly can only be used with objects.");
    //     }
    //     const groupedData = this.list.reduce((groups, item) => {
    //         const key = keys.map((k) => item[k]).join("|");
    //         if (!groups[key]) {
    //             groups[key] = {
    //                 ...keys.reduce(
    //                     (obj, k) => ({ ...obj, [k]: item[k] }),
    //                     {} as { [P in K]: T[P] }
    //                 ),
    //                 items: new Array<T>(),
    //             };
    //         }
    //         groups[key].items.push(item);
    //         return groups;
    //     }, {} as GroupedData<T, K>);

    //     return new LinqJs(Object.values(groupedData));
    // }

    /**
     * Applies aggregations to the grouped data.
     * @param aggregations - The aggregation configurations.
     * @returns A new LinqJs instance with aggregated data.
     */
    applyAggregations<TField extends string>(
        aggregations: Aggregation<TField> | Aggregation<TField>[]
    ): LinqJs<
        T extends Record<string, any> ? { [P in keyof T]: T[P] } & Record<string, any> : never
    > {
        if (!this.list.every((item) => typeof item === "object" && "items" in item)) {
            throw new Error("applyAggregations should be used after groupBy");
        }
        aggregations = Array.isArray(aggregations) ? aggregations : [aggregations];

        const result = this.list.map((group) => {
            const aggregated = aggregations.reduce((acc, { aggregator, field, alias }) => {
                acc[alias ?? field.toString()] =
                    mathAggr[aggregator]?.((group.items as any[]).map((i) => i[field])) ?? null;
                return acc;
            }, {} as Record<string, any>);

            const { items, ...groupData } = group as any;
            return { ...groupData, ...aggregated, items };
        });

        return new LinqJs(result);
    }

    /**
     * Sums the values of a specified field.
     * @param field - The field to sum.
     * @returns The sum of the field values.
     */
    sum(field?: keyof T): number {
        if (typeof this.list[0] === "object") {
            return this.list.reduce((acc, item) => acc + (item[field!] as number), 0);
        }
        return (this.list as number[]).reduce((acc, item) => acc + item, 0);
    }

    /**
     * Finds the minimum value of a specified field.
     * @param field - The field to find the minimum value of.
     * @returns The minimum value of the field.
     */
    min(field?: keyof T): number {
        if (typeof this.list[0] === "object") {
            return Math.min(...this.list.map((item) => item[field!] as number));
        }
        return Math.min(...(this.list as number[]));
    }

    /**
     * Finds the maximum value of a specified field.
     * @param field - The field to find the maximum value of.
     * @returns The maximum value of the field.
     */
    max(field?: keyof T): number {
        if (typeof this.list[0] === "object") {
            return Math.max(...this.list.map((item) => item[field!] as number));
        }
        return Math.max(...(this.list as number[]));
    }

    /**
     * Calculates the average value of a specified field.
     * @param field - The field to calculate the average value of.
     * @returns The average value of the field.
     */
    avg(field?: keyof T): number {
        return this.sum(field) / this.list.length;
    }

    /**
     * Counts the number of elements in the list.
     * @returns The number of elements in the list.
     */
    count(): number {
        return this.list.length;
    }

    /**
     * Gets the keys of the first element in the list.
     * @throws if the list is not an array of objects, an error is thrown.
     * @returns An array of keys.
     */
    keys(): string[] {
        if (typeof this.list[0] !== "object") {
            throw new Error("keys can only be used with objects.");
        }
        return Object.keys(this.list[0]);
    }

    /**
     * Converts the LinqJs instance to a list.
     * @returns The list of elements.
     */
    toList(): T[] {
        return this.list;
    }
}
