type MaybePromise<T> = T | Promise<T>;

// // Type-safe async pipe function
// export function pipeAsync<T>(value: MaybePromise<T>): Promise<T>;
// export function pipeAsync<T, R1>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>): Promise<R1>;
// export function pipeAsync<T, R1, R2>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>): Promise<R2>;
// export function pipeAsync<T, R1, R2, R3>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>): Promise<R3>;
// export function pipeAsync<T, R1, R2, R3, R4>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>): Promise<R4>;
// export function pipeAsync<T, R1, R2, R3, R4, R5>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>): Promise<R5>;
// export function pipeAsync<T, R1, R2, R3, R4, R5, R6>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>): Promise<R6>;
// export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>): Promise<R7>;
// export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>, fn8: (arg: R7) => MaybePromise<R8>): Promise<R8>;
// export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>, fn8: (arg: R7) => MaybePromise<R8>, fn9: (arg: R8) => MaybePromise<R9>): Promise<R9>;
// export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(value: MaybePromise<T>, fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>, fn8: (arg: R7) => MaybePromise<R8>, fn9: (arg: R8) => MaybePromise<R9>, fn10: (arg: R9) => MaybePromise<R10>): Promise<R10>;
// export async function pipeAsync<T>(value: MaybePromise<T>, ...fns: Array<(arg: any) => MaybePromise<any>>): Promise<any> {
//   let result = await value;
//   for (const fn of fns) {
//     result = await fn(result);
//   }
//   return result;
// }

// Type-safe async pipe function that returns a function
// export function pipeAsyncFn<T>(): (value: MaybePromise<T>) => Promise<T>;
// export function pipeAsyncFn<T, R1>(fn1: (arg: T) => MaybePromise<R1>): (value: MaybePromise<T>) => Promise<R1>;
// export function pipeAsyncFn<T, R1, R2>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>): (value: MaybePromise<T>) => Promise<R2>;
// export function pipeAsyncFn<T, R1, R2, R3>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>): (value: MaybePromise<T>) => Promise<R3>;
// export function pipeAsyncFn<T, R1, R2, R3, R4>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>): (value: MaybePromise<T>) => Promise<R4>;
// export function pipeAsyncFn<T, R1, R2, R3, R4, R5>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>): (value: MaybePromise<T>) => Promise<R5>;
// export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>): (value: MaybePromise<T>) => Promise<R6>;
// export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>): (value: MaybePromise<T>) => Promise<R7>;
// export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>, fn8: (arg: R7) => MaybePromise<R8>): (value: MaybePromise<T>) => Promise<R8>;
// export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>, fn8: (arg: R7) => MaybePromise<R8>, fn9: (arg: R8) => MaybePromise<R9>): (value: MaybePromise<T>) => Promise<R9>;
// export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(fn1: (arg: T) => MaybePromise<R1>, fn2: (arg: R1) => MaybePromise<R2>, fn3: (arg: R2) => MaybePromise<R3>, fn4: (arg: R3) => MaybePromise<R4>, fn5: (arg: R4) => MaybePromise<R5>, fn6: (arg: R5) => MaybePromise<R6>, fn7: (arg: R6) => MaybePromise<R7>, fn8: (arg: R7) => MaybePromise<R8>, fn9: (arg: R8) => MaybePromise<R9>, fn10: (arg: R9) => MaybePromise<R10>): (value: MaybePromise<T>) => Promise<R10>;
// export function pipeAsyncFn<T>(...fns: Array<(arg: any) => MaybePromise<any>>): (value: MaybePromise<T>) => Promise<any> {
//   return async (value: MaybePromise<T>): Promise<any> => {
//     let result = await value;
//     for (const fn of fns) result = await fn(result);
//     return result;
//   };
// }

// Type-safe async pipe function that returns a function
export function pipeAsyncFn<T>(): (value: MaybePromise<T>) => Promise<T>;
export function pipeAsyncFn<T, R1>(step1: PipeAsyncStep<T>): (value: MaybePromise<T>) => Promise<R1>;
export function pipeAsyncFn<T, R1, R2>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>): (value: MaybePromise<T>) => Promise<R2>;
export function pipeAsyncFn<T, R1, R2, R3>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>): (value: MaybePromise<T>) => Promise<R3>;
export function pipeAsyncFn<T, R1, R2, R3, R4>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>): (value: MaybePromise<T>) => Promise<R4>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>): (value: MaybePromise<T>) => Promise<R5>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>): (value: MaybePromise<T>) => Promise<R6>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>): (value: MaybePromise<T>) => Promise<R7>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>): (value: MaybePromise<T>) => Promise<R8>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>): (value: MaybePromise<T>) => Promise<R9>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>): (value: MaybePromise<T>) => Promise<R10>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>): (value: MaybePromise<T>) => Promise<R11>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>): (value: MaybePromise<T>) => Promise<R12>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>): (value: MaybePromise<T>) => Promise<R13>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>): (value: MaybePromise<T>) => Promise<R14>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14, R15>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>): (value: MaybePromise<T>) => Promise<R15>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14, R15, R16>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>): (value: MaybePromise<T>) => Promise<R16>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14, R15, R16, R17>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>): (value: MaybePromise<T>) => Promise<R17>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14, R15, R16, R17, R18>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>, step18: PipeAsyncStep<R17>): (value: MaybePromise<T>) => Promise<R18>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14, R15, R16, R17, R18, R19>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>, step18: PipeAsyncStep<R17>, step19: PipeAsyncStep<R18>): (value: MaybePromise<T>) => Promise<R19>;
export function pipeAsyncFn<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10,R11, R12, R13, R14, R15, R16, R17, R18, R19, R20>(step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>, step18: PipeAsyncStep<R17>, step19: PipeAsyncStep<R18>, step20: PipeAsyncStep<R19>): (value: MaybePromise<T>) => Promise<R20>;
export function pipeAsyncFn<T>(...steps: PipeAsyncStep<any>[]): (value: MaybePromise<T>) => Promise<any> {
  return async (value: MaybePromise<T>): Promise<any> => {
    let result = await value;

    for (const step of steps) {
      if (Array.isArray(step)) {
        // Run functions in parallel
        const results = await Promise.all(step.map((fn) => fn(result)));
        result = results as any;
      } else {
        // Sequential step
        result = await step(result);
      }
    }

    return result;
  };
}

export type AsyncPipeStep<T> = (arg: T) => MaybePromise<any>;
export type ParallelAsyncPipeStep<T> = Array<(arg: T) => MaybePromise<any>>;
export type PipeAsyncStep<T> = AsyncPipeStep<T> | ParallelAsyncPipeStep<T>;

export function pipeAsync<T>(value: MaybePromise<T>): Promise<T>;
export function pipeAsync<T, R1>(value: MaybePromise<T>, step1: PipeAsyncStep<T>): Promise<R1>;
export function pipeAsync<T, R1, R2>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>): Promise<R2>;
export function pipeAsync<T, R1, R2, R3>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>): Promise<R3>;
export function pipeAsync<T, R1, R2, R3, R4>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>): Promise<R4>;
export function pipeAsync<T, R1, R2, R3, R4, R5>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>): Promise<R5>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>): Promise<R6>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>): Promise<R7>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>): Promise<R8>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>): Promise<R9>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>): Promise<R10>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>): Promise<R11>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>): Promise<R12>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>): Promise<R13>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>): Promise<R14>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>): Promise<R15>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>): Promise<R16>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>): Promise<R17>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>, step18: PipeAsyncStep<R17>): Promise<R18>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>, step18: PipeAsyncStep<R17>, step19: PipeAsyncStep<R18>): Promise<R19>;
export function pipeAsync<T, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19, R20>(value: MaybePromise<T>, step1: PipeAsyncStep<T>, step2: PipeAsyncStep<R1>, step3: PipeAsyncStep<R2>, step4: PipeAsyncStep<R3>, step5: PipeAsyncStep<R4>, step6: PipeAsyncStep<R5>, step7: PipeAsyncStep<R6>, step8: PipeAsyncStep<R7>, step9: PipeAsyncStep<R8>, step10: PipeAsyncStep<R9>, step11: PipeAsyncStep<R10>, step12: PipeAsyncStep<R11>, step13: PipeAsyncStep<R12>, step14: PipeAsyncStep<R13>, step15: PipeAsyncStep<R14>, step16: PipeAsyncStep<R15>, step17: PipeAsyncStep<R16>, step18: PipeAsyncStep<R17>, step19: PipeAsyncStep<R18>, step20: PipeAsyncStep<R19>): Promise<R20>;
export async function pipeAsync<T>(value: MaybePromise<T>, ...steps: PipeAsyncStep<any>[]): Promise<any> {
  let result = await value;

  for (const step of steps) {
    if (Array.isArray(step)) {
      // Run functions in parallel
      const results = await Promise.all(step.map((fn) => fn(result)));
      result = results as any;
    } else {
      // Sequential step
      result = await step(result);
    }
  }

  return result;
}
