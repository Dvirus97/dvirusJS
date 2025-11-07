/**
 * RxJS-style Pipe Pattern Implementation
 *
 * This module provides a flexible pipe pattern that can be extended with custom operators.
 * The pipe acts as a shell that receives operators as arguments, similar to RxJS.
 */

// ============================================================================
// CORE TYPES AND INTERFACES
// ============================================================================

/**
 * Base operator function type
 * Takes a value and returns a new value or a PipeResult
 */
export type Operator<T, R = T> = (value: T, context?: PipeContext<T>) => PipeResult<R>;

export type PipeResultOrValue<T> = T | PipeResult<T>;

/**
 * Pipe result that can contain either a value or control flow information
 */
export interface PipeResult<T> {
  value: T;
  stopped?: boolean;
  error?: Error;
  metadata?: Record<string, any>;
  debugName?: string;
}

/**
 * Pipe context that carries state through the operator chain
 */
export interface PipeContext<T> {
  value: T;
  stopped: boolean;
  error?: Error;
  metadata: Record<string, any>;
  index: number;
  total: number;
}

/**
 * Operator factory function that creates operators with configuration
 */
export type OperatorFactory<T, R, Config = any> = (config?: Config) => Operator<T, R>;

/**
 * Pipe configuration
 */
export interface PipeConfig {
  debug?: boolean;
  errorHandling?: "stop" | "continue" | "retry";
  maxRetries?: number;
}

// ============================================================================
// PIPE CLASS
// ============================================================================

export class Pipe<T> {
  private context: PipeContext<T>;
  private operators: Operator<any, any>[] = [];
  private config: PipeConfig;

  constructor(initialValue: T, config: PipeConfig = {}) {
    this.config = {
      debug: false,
      errorHandling: "stop",
      maxRetries: 3,
      ...config,
    };

    this.context = {
      value: initialValue,
      stopped: false,
      error: undefined,
      metadata: {},
      index: 0,
      total: 0,
    };
  }

  /**
   * Add an operator to the pipe chain
   */
  pipe<U>(...operator: Operator<T, U>[]): Pipe<U> {
    const newPipe = new Pipe<U>(this.context.value as unknown as U, this.config);
    newPipe.operators = [...this.operators, ...operator];
    newPipe.context = {
      ...this.context,
      value: this.context.value as unknown as U,
      total: this.operators.length + 1,
    };
    return newPipe;
  }

  /**
   * Execute the pipe with all operators
   */
  execute(): PipeResult<T> {
    const currentContext = { ...this.context };

    let currentValue: any = this.context.value;
    let oldValue = currentValue;
    let operatorName = "";

    const debugLog = (options: { index: number }) => {
      console.log(`%c Pipe step ${options.index + 1}:`, "color:#3f3a", {
        operator: operatorName,
        input: oldValue,
        output: currentValue,
        context: currentContext,
      });
    };

    for (let i = 0; i < this.operators.length; i++) {
      operatorName = "Operator " + (i + 1);

      currentContext.index = i;
      oldValue = currentValue;

      try {
        const result = this.operators[i](currentValue, currentContext);
        console.log("result", result);
        currentValue = result.value;0
        operatorName = result.debugName ?? operatorName;

        if (currentContext.stopped || result.stopped) {
          currentContext.stopped = true;
          currentValue = oldValue;
          if (this.config.debug) debugLog({ index: i });
          continue;
        }

        // if (result.stopped) {
        //   currentContext.stopped = true;
        // }
        if (result.error) {
          currentContext.error = result.error;
          if (this.config.errorHandling === "stop") {
            currentContext.stopped = true;
          }
        }
        if (result.metadata) {
          currentContext.metadata = { ...currentContext.metadata, ...result.metadata };
        }

        if (this.config.debug) debugLog({ index: i });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        currentContext.error = err;

        switch (this.config.errorHandling) {
          case "stop":
            currentContext.stopped = true;
          // return { value: undefined as T, stopped: true, error: err };
          case "continue":
          // return { value: undefined as T, error: err };
          case "retry":
            // return { value: undefined as T, error: err };
            break;
        }
      }
    }

    return {
      value: currentValue,
      stopped: currentContext.stopped,
      error: currentContext.error,
      metadata: currentContext.metadata,
    };
  }

  /**
   * Execute the pipe and return just the value
   */
  value(): T {
    const result = this.execute();
    if (result.error && this.config.errorHandling === "stop") {
      // throw result.error;
      console.log("error", result.error.message);
      return undefined as T;
    }
    return result.value;
  }

  /**
   * Execute the pipe and return a promise
   */
  async toPromise(): Promise<T> {
    const result = this.execute();
    if (result.error) {
      throw result.error;
      // console.log("error", result.error);
    }
    return result.value;
  }

  /**
   * Subscribe to pipe execution with callbacks
   */
  subscribe(onNext?: (value: T) => void, onError?: (error: Error) => void, onComplete?: () => void): void {
    try {
      const result = this.execute();

      if (result.error) {
        onError?.(result.error);
      } else {
        onNext?.(result.value);
        onComplete?.();
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  // /**
  //  * Check if a value is a PipeResult
  //  */
  // private isPipeResult(value: any): value is PipeResult<any> {
  //   return isPipeResult(value);
  // }

  /**
   * Get the current context (for debugging)
   */
  getContext(): PipeContext<T> {
    return { ...this.context };
  }

  /**
   * Get the number of operators in the pipe
   */
  get length(): number {
    return this.operators.length;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a new pipe with an initial value
 */
export function createPipe<T>(value: T, config?: PipeConfig): Pipe<T> {
  return new Pipe(value, config);
}

/**
 * Create a pipe from a value (shorthand)
 */
export function of<T>(value: T, config?: PipeConfig): Pipe<T> {
  return createPipe(value, config);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function isPipeResult(value: any): value is PipeResult<any> {
  return value && typeof value === "object" && "value" in value;
}

/**
 * Create a pipe result
 */
export function pipeResult<T>(value: T, options: Omit<PipeResult<T>, "value"> = {}): PipeResult<T> {
  return { value, ...options };
}

/**
 * Stop the pipe execution
 */
export function stop<T>(value: T): PipeResult<T> {
  return pipeResult(value, { stopped: true, debugName: `stop` });
}

/**
 * Continue with error
 */
export function error<T>(value: T, error: Error | string): PipeResult<T> {
  return pipeResult(value, { error: error instanceof Error ? error : new Error(String(error)), debugName: `error` });
}

/**
 * Add metadata to the pipe context
 */
export function metadata<T>(value: T, metadata: Record<string, any>): PipeResult<T> {
  return pipeResult(value, { metadata, debugName: `metadata` });
}

// ============================================================================
// BASIC OPERATORS (Examples)
// ============================================================================

/**
 * Map operator - transforms the value
 */
export function map<T, U>(transform: (value: T) => PipeResultOrValue<U>): Operator<T, U> {
  return (value: T) => {
    const res = transform(value);
    if (isPipeResult(res)) {
      return { ...res, debugName: `map / ${res.debugName}` } satisfies PipeResult<U>;
    }
    return pipeResult(res, { debugName: `map` });
  };
}

/**
 * Filter operator - filters values based on a predicate
 */
export function filter<T>(predicate: (value: T) => PipeResultOrValue<boolean>): Operator<T, T> {
  return (value: T) => {
    const res = predicate(value);
    if (isPipeResult(res) && res.value) {
      return pipeResult(value, { debugName: `filter` });
    }
    return { ...stop(value), debugName: `filter / stop` } satisfies PipeResult<T>;
  };
}

/**
 * Tap operator - performs side effects without changing the value
 */
export function tap<T>(effect: (value: T) => PipeResultOrValue<void>): Operator<T, T> {
  return (value: T) => {
    const res = effect(value);
    if (isPipeResult(res)) {
      return pipeResult(value, { ...res, debugName: `tap / ${res.debugName}` });
    }
    return pipeResult(value, { debugName: `tap` });
  };
}

/**
 * Catch operator - handles errors
 */
export function catchError<T, U = T>(handler?: (v: T) => PipeResultOrValue<U>): Operator<T, U> {
  return (value: T, context?: PipeContext<T>) => {
    console.log("context", context, context?.error?.message);
    if (!context?.error) {
      return pipeResult(value as unknown as U, { debugName: `catchError / no error` });
    }
    if (!handler)
      return pipeResult(value as unknown as U, {
        debugName: `catchError`,
        error: undefined,
        stopped: false,
      });

    const res = handler(value);
    if (isPipeResult(res)) {
      return pipeResult(res.value, { ...res, debugName: `catchError / ${res.debugName}` });
    }
    return pipeResult(res as unknown as U, {
      debugName: `catchError`,
      error: undefined,
      stopped: false,
    });
  };
}

export function throwError<T>(e: string): Operator<T, T> {
  return (value: T) => {
    return { ...error(value, e), debugName: `throwError` };
  };
}

/**
 * Retry operator - retries on error
 */
export function retry<T>(times: number = 3): Operator<T, T> {
  return (value: T) => {
    // This would be implemented with proper retry logic
    return pipeResult(value, { debugName: `retry` });
  };
}

/**
 * Delay operator - adds a delay
 */
// export function delay<T>(ms: number): Operator<T, T> {
//   return (value: T) => {
//     // This would be implemented with setTimeout/Promise
//     return pipeResult(value, { debugName: `delay` });
//   };
// }

/**
 * Take operator - takes only the first N values
 */
export function take<T>(count: number): Operator<T, T> {
  let taken = 0;
  return (value: T) => {
    taken++;
    if (taken <= count) {
      return pipeResult(value, { debugName: `take` });
    }
    return { ...stop(value), debugName: `take / stop` } satisfies PipeResult<T>;
  };
}

/**
 * Skip operator - skips the first N values
 */
export function skip<T>(count: number): Operator<T, T> {
  let skipped = 0;
  return (value: T) => {
    skipped++;
    if (skipped > count) {
      return pipeResult(value, { debugName: `skip` });
    }
    return { ...stop(value), debugName: `skip / stop` } satisfies PipeResult<T>;
  };
}

// ============================================================================
// OPERATOR COMPOSITION
// ============================================================================

/**
 * Compose multiple operators into a single operator
 * Overloads up to 20 operators using T1..T20 type parameters
 */
export function compose<T1, T2>(op1: Operator<T1, T2>): Operator<T1, T2>;
export function compose<T1, T2, T3>(op1: Operator<T1, T2>, op2: Operator<T2, T3>): Operator<T1, T3>;
export function compose<T1, T2, T3, T4>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>): Operator<T1, T4>;
export function compose<T1, T2, T3, T4, T5>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>): Operator<T1, T5>;
export function compose<T1, T2, T3, T4, T5, T6>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>): Operator<T1, T6>;
export function compose<T1, T2, T3, T4, T5, T6, T7>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>): Operator<T1, T7>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>): Operator<T1, T8>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>): Operator<T1, T9>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>): Operator<T1, T10>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>): Operator<T1, T11>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>): Operator<T1, T12>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>): Operator<T1, T13>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>): Operator<T1, T14>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>, op14: Operator<T14, T15>): Operator<T1, T15>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>, op14: Operator<T14, T15>, op15: Operator<T15, T16>): Operator<T1, T16>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>, op14: Operator<T14, T15>, op15: Operator<T15, T16>, op16: Operator<T16, T17>): Operator<T1, T17>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>, op14: Operator<T14, T15>, op15: Operator<T15, T16>, op16: Operator<T16, T17>, op17: Operator<T17, T18>): Operator<T1, T18>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>, op14: Operator<T14, T15>, op15: Operator<T15, T16>, op16: Operator<T16, T17>, op17: Operator<T17, T18>, op18: Operator<T18, T19>): Operator<T1, T19>;
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20>(op1: Operator<T1, T2>, op2: Operator<T2, T3>, op3: Operator<T3, T4>, op4: Operator<T4, T5>, op5: Operator<T5, T6>, op6: Operator<T6, T7>, op7: Operator<T7, T8>, op8: Operator<T8, T9>, op9: Operator<T9, T10>, op10: Operator<T10, T11>, op11: Operator<T11, T12>, op12: Operator<T12, T13>, op13: Operator<T13, T14>, op14: Operator<T14, T15>, op15: Operator<T15, T16>, op16: Operator<T16, T17>, op17: Operator<T17, T18>, op18: Operator<T18, T19>, op19: Operator<T19, T20>): Operator<T1, T20>;
export function compose(...operators: Operator<any, any>[]): Operator<any, any> {
  return (value: any) => {
    let isStopped = false;

    return operators.reduce((acc, operator) => {
      if (isStopped) return pipeResult(undefined, { debugName: `compose / stop` });

      const val = acc.value;
      const result = operator(val);

      // if (result.error) throw result.error;S
      if (result.stopped) isStopped = true;
      return pipeResult(result.value, { ...result, debugName: `${acc.debugName} / ${result.debugName}` });
    }, pipeResult(value, { debugName: `compose` }));
  };
}

/**
 * Pipe function that creates a composed operator
 */
// export function rxPipe<T>(...operators: Operator<any, any>[]): Operator<T, any> {
//   return (value: T) => {
//     return operators.reduce((acc, operator) => {
//       const result = operator(acc);
//       return result && typeof result === 'object' && 'value' in result ? result.value : result;
//     }, value);
//   };
// }
