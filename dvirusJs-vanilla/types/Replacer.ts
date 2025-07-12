export type Replacer<T, Search, Replace> = {
    [Key in keyof T]: Search extends T[Key] ? Replace : Replacer<T[Key], Search, Replace>;
};


function main() {
    type ToReplace = {
        name: string;
        age: number;
        date: Date;
        address: {
            city: string;
            state: string;
        };
        friends: string[];
    };
    const o: Replacer<ToReplace, string, number> = {
        name: 123,
        age: 456,
        date: new Date(),
        address: {
            city: 456,
            state: 789,
        },
        friends: [101, 102, 103],
    };    
}
