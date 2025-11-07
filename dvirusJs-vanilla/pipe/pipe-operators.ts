// Pipe Operators and Flow Control System

export type PipeOperator<T, R> = (value: T) => R;
export type PipePredicate<T> = (value: T) => boolean;
export type PipeEffect<T> = (value: T) => void;

export interface PipeContext<T> {
  value: T;
  stopped: boolean;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface PipeManager<T> {
  // Core state
  readonly context: PipeContext<T>;
  readonly isStopped: boolean;
  readonly hasError: boolean;
  
  // Flow control
  stop(): PipeManager<T>;
  resume(): PipeManager<T>;
  reset(): PipeManager<T>;
  
  // Operators
  map<U>(operator: PipeOperator<T, U>): PipeManager<U>;
  tap(effect: PipeEffect<T>): PipeManager<T>;
  filter(predicate: PipePredicate<T>): PipeManager<T>;
  catch<U>(handler: (error: Error, value: T) => U): PipeManager<U>;
  retry(times: number): PipeManager<T>;
  timeout(ms: number): PipeManager<T>;
  
  // Conditional operators
  when<U>(condition: PipePredicate<T>, operator: PipeOperator<T, U>): PipeManager<T | U>;
  unless<U>(condition: PipePredicate<T>, operator: PipeOperator<T, U>): PipeManager<T | U>;
  switch<U>(cases: Array<{ condition: PipePredicate<T>; operator: PipeOperator<T, U> }>, defaultOperator?: PipeOperator<T, U>): PipeManager<U>;
  
  // Collection operators
  mapMany<U>(operator: PipeOperator<T, U[]>): PipeManager<U[]>;
  filterMany(predicate: PipePredicate<T>): PipeManager<T[]>;
  reduce<U>(operator: (acc: U, value: T) => U, initial: U): PipeManager<U>;
  
  // Async operators
  mapAsync<U>(operator: (value: T) => Promise<U>): Promise<PipeManager<U>>;
  tapAsync(effect: (value: T) => Promise<void>): Promise<PipeManager<T>>;
  
  // Utility
  log(message?: string): PipeManager<T>;
  debug(): PipeManager<T>;
  toValue(): T;
  toPromise(): Promise<T>;
}

export class PipeManagerImpl<T> implements PipeManager<T> {
  constructor(private _context: PipeContext<T>) {}

  get context(): PipeContext<T> {
    return { ...this._context };
  }

  get isStopped(): boolean {
    return this._context.stopped;
  }

  get hasError(): boolean {
    return !!this._context.error;
  }

  private createContext<U>(value: U, stopped = false, error?: Error, metadata?: Record<string, any>): PipeContext<U> {
    return { value, stopped, error, metadata };
  }

  private createManager<U>(context: PipeContext<U>): PipeManager<U> {
    return new PipeManagerImpl(context);
  }

  stop(): PipeManager<T> {
    return this.createManager({
      ...this._context,
      stopped: true
    });
  }

  resume(): PipeManager<T> {
    return this.createManager({
      ...this._context,
      stopped: false,
      error: undefined
    });
  }

  reset(): PipeManager<T> {
    return this.createManager({
      value: this._context.value,
      stopped: false,
      error: undefined,
      metadata: undefined
    });
  }

  map<U>(operator: PipeOperator<T, U>): PipeManager<U> {
    if (this._context.stopped || this._context.error) {
      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: this._context.stopped,
        error: this._context.error
      });
    }

    try {
      const result = operator(this._context.value);
      return this.createManager({
        value: result,
        stopped: false,
        error: undefined,
        metadata: this._context.metadata
      });
    } catch (error) {
      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: true,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  tap(effect: PipeEffect<T>): PipeManager<T> {
    if (!this._context.stopped && !this._context.error) {
      try {
        effect(this._context.value);
      } catch (error) {
        return this.createManager({
          ...this._context,
          stopped: true,
          error: error instanceof Error ? error : new Error(String(error))
        });
      }
    }
    return this.createManager(this._context);
  }

  filter(predicate: PipePredicate<T>): PipeManager<T> {
    if (this._context.stopped || this._context.error) {
      return this.createManager(this._context);
    }

    try {
      if (predicate(this._context.value)) {
        return this.createManager({
          ...this._context,
          stopped: false
        });
      } else {
        return this.createManager({
          ...this._context,
          stopped: true
        });
      }
    } catch (error) {
      return this.createManager({
        ...this._context,
        stopped: true,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  catch<U>(handler: (error: Error, value: T) => U): PipeManager<U> {
    if (this._context.error) {
      try {
        const result = handler(this._context.error, this._context.value);
        return this.createManager({
          value: result,
          stopped: false,
          error: undefined,
          metadata: this._context.metadata
        });
      } catch (newError) {
        return this.createManager({
          value: this._context.value as unknown as U,
          stopped: true,
          error: newError instanceof Error ? newError : new Error(String(newError))
        });
      }
    }
    return this.createManager({
      value: this._context.value as unknown as U,
      stopped: this._context.stopped,
      error: this._context.error,
      metadata: this._context.metadata
    });
  }

  retry(times: number): PipeManager<T> {
    if (this._context.stopped && this._context.error && times > 0) {
      return this.createManager({
        ...this._context,
        stopped: false,
        error: undefined
      }).retry(times - 1);
    }
    return this.createManager(this._context);
  }

  timeout(ms: number): PipeManager<T> {
    return new Promise<PipeManager<T>>((resolve) => {
      const timer = setTimeout(() => {
        resolve(this.createManager({
          ...this._context,
          stopped: true,
          error: new Error(`Operation timed out after ${ms}ms`)
        }));
      }, ms);

      // If not stopped and no error, clear timeout and resolve
      if (!this._context.stopped && !this._context.error) {
        clearTimeout(timer);
        resolve(this.createManager(this._context));
      }
    }) as any;
  }

  when<U>(condition: PipePredicate<T>, operator: PipeOperator<T, U>): PipeManager<T | U> {
    if (this._context.stopped || this._context.error) {
      return this.createManager({
        value: this._context.value as unknown as T | U,
        stopped: this._context.stopped,
        error: this._context.error
      });
    }

    try {
      if (condition(this._context.value)) {
        const result = operator(this._context.value);
        return this.createManager({
          value: result,
          stopped: false,
          error: undefined,
          metadata: this._context.metadata
        });
      }
      return this.createManager({
        value: this._context.value as unknown as T | U,
        stopped: this._context.stopped,
        error: this._context.error,
        metadata: this._context.metadata
      });
    } catch (error) {
      return this.createManager({
        value: this._context.value as unknown as T | U,
        stopped: true,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  unless<U>(condition: PipePredicate<T>, operator: PipeOperator<T, U>): PipeManager<T | U> {
    return this.when((value) => !condition(value), operator);
  }

  switch<U>(cases: Array<{ condition: PipePredicate<T>; operator: PipeOperator<T, U> }>, defaultOperator?: PipeOperator<T, U>): PipeManager<U> {
    if (this._context.stopped || this._context.error) {
      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: this._context.stopped,
        error: this._context.error
      });
    }

    try {
      for (const { condition, operator } of cases) {
        if (condition(this._context.value)) {
          const result = operator(this._context.value);
          return this.createManager({
            value: result,
            stopped: false,
            error: undefined,
            metadata: this._context.metadata
          });
        }
      }

      if (defaultOperator) {
        const result = defaultOperator(this._context.value);
        return this.createManager({
          value: result,
          stopped: false,
          error: undefined,
          metadata: this._context.metadata
        });
      }

      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: true,
        error: new Error('No matching case found in switch statement')
      });
    } catch (error) {
      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: true,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  mapMany<U>(operator: PipeOperator<T, U[]>): PipeManager<U[]> {
    return this.map(operator);
  }

  filterMany(predicate: PipePredicate<T>): PipeManager<T[]> {
    return this.map((value) => predicate(value) ? [value] : []);
  }

  reduce<U>(operator: (acc: U, value: T) => U, initial: U): PipeManager<U> {
    return this.map((value) => operator(initial, value));
  }

  async mapAsync<U>(operator: (value: T) => Promise<U>): Promise<PipeManager<U>> {
    if (this._context.stopped || this._context.error) {
      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: this._context.stopped,
        error: this._context.error
      });
    }

    try {
      const result = await operator(this._context.value);
      return this.createManager({
        value: result,
        stopped: false,
        error: undefined,
        metadata: this._context.metadata
      });
    } catch (error) {
      return this.createManager({
        value: this._context.value as unknown as U,
        stopped: true,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  async tapAsync(effect: (value: T) => Promise<void>): Promise<PipeManager<T>> {
    if (!this._context.stopped && !this._context.error) {
      try {
        await effect(this._context.value);
      } catch (error) {
        return this.createManager({
          ...this._context,
          stopped: true,
          error: error instanceof Error ? error : new Error(String(error))
        });
      }
    }
    return this.createManager(this._context);
  }

  log(message?: string): PipeManager<T> {
    const logMessage = message ? `${message}: ` : '';
    const value  = `${JSON.stringify(this._context.value)}`;
    const numVal = isNaN(Number(value)) ? value : Number(value);
    console.log(`${logMessage}`,numVal);
    return this.createManager(this._context);
  }

  debug(): PipeManager<T> {
    console.log('Pipe Debug:', {
      value: this._context.value,
      stopped: this._context.stopped,
      error: this._context.error,
      metadata: this._context.metadata
    });
    return this.createManager(this._context);
  }

  toValue(): T {
    return this._context.value;
  }

  toPromise(): Promise<T> {
    if (this._context.error) {
      return Promise.reject(this._context.error);
    }
    return Promise.resolve(this._context.value);
  }
}

// Factory function
export function createPipe<T>(value: T): PipeManager<T> {
  return new PipeManagerImpl({
    value,
    stopped: false,
    error: undefined,
    metadata: undefined
  });
}

// Convenience function
export function pipe1<T>(value: T): PipeManager<T> {
  return createPipe(value);
}

// // Export the interface for external use
// export type { PipeManager };
