type Separator = '_' | '-';

type UppercaseNext<T extends string, Check extends boolean> =
  Check extends true ? Uppercase<T> : T;

export type CamelCase<T extends string, uppercaseNext extends boolean = false, Save extends string = ''> =
  T extends `${infer head}${infer tail}`
    ? head extends Separator
      ? CamelCase<tail, true, Save>
      : CamelCase<tail,  false, `${Save}${UppercaseNext<head, uppercaseNext>}`>
    : Save;


function main(){   
    type SnakeCased = 'hello_youtube';
    
    type CamelCased = CamelCase<SnakeCased>;
    //   ^? 'helloYoutube'
}
