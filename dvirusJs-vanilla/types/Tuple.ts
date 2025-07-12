export type Tuple<
    Length extends number,
    Type,
> = _Tuple<Length, Type, []>;

export type _Tuple<
    Length extends number,
    Type,
    Acc extends Type[] = []
> = Length extends Acc["length"] ? Readonly<Acc> : _Tuple<Length, Type, [Type, ...Acc]>;

function main() {
    const tuple: Tuple<2 | 3, string> = ["a", "b", "c"];
}
