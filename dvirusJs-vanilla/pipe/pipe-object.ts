export type WithoutUndefined<T> = Exclude<T, undefined>;

export class PipeBox<T> {
  readonly value: T;
  private readonly stopped: boolean;

  constructor(value: T, stopped = false) {
    this.value = value;
    this.stopped = stopped;
  }

  map<U, A extends unknown[]>(cb: (value: T, ...args: A) => U, ...args: A): PipeBox<U> {
    if (this.stopped) {
      return new PipeBox(this.value as unknown as U, true);
    }
    return new PipeBox(cb(this.value, ...args), false);
  }

  tap<A extends unknown[]>(cb: (value: T, ...args: A) => void, ...args: A): PipeBox<T> {
    if (!this.stopped) {
      cb(this.value, ...args);
    }
    return new PipeBox(this.value, this.stopped);
  }

  filter(cb: (value: T) => boolean, clear = false): PipeBox<T> {
    if (this.stopped) {
      return new PipeBox(this.value, true);
    }
    if (cb(this.value)) {
      return new PipeBox(this.value, false);
    }
    return new PipeBox(clear ? undefined as any : this.value, true);
  }

  get isStopped(): boolean {
    return this.stopped;
  }

  static of<T>(value: T): PipeBox<T> {
    return new PipeBox(value);
  }
}

export function pipeValue<T>(value: T): PipeBox<T> {
  return PipeBox.of(value);
}
