export type ResolveFn<T> = (value: T) => void;
export type RejectFn<E> = (reason: E) => void;
export type FinallyFn<T, E> = (valueOrError: T | E) => void;

export type Executor<T, E> = (resolve: ResolveFn<T>, reject: RejectFn<E>) => void;

export class SimplePromise<T, E = unknown> {
    private _state: "pending" | "fulfilled" | "rejected" = "pending";
    private _value?: T;
    private _reason?: E;
    private _onFulfilled?: ResolveFn<T>;
    private _onRejected?: RejectFn<E>;
    private _onFinally?: FinallyFn<T, E>;
    private _executor: Executor<T, E>;

    private _resolve: ResolveFn<T> = (value) => {
        if (this._state === "pending") {
            this._state = "fulfilled";
            this._value = value;
            if (this._onFulfilled) {
                this._onFulfilled(value);
            }
            if (this._onFinally) {
                this._onFinally(value);
            }
        }
    };

    private _reject: RejectFn<E> = (reason) => {
        if (this._state === "pending") {
            this._state = "rejected";
            this._reason = reason;
            if (this._onRejected) {
                this._onRejected(reason);
            }
            if (this._onFinally) {
                this._onFinally(reason);
            }
        }
    };

    constructor(executor: Executor<T, E>) {
        this._executor = executor;
        try {
            executor(this._resolve, this._reject);
        } catch (err) {
            this._reject(err as E);
        }
    }

    then(onFulfilled?: ResolveFn<T>): Omit<SimplePromise<T, never>, "then"> {
        if (this._state === "fulfilled" && onFulfilled) {
            onFulfilled(this._value as T);
        } else {
            this._onFulfilled = onFulfilled;
        }
        return this as Omit<SimplePromise<T, never>, "then">;
    }
    catch(onRejected?: RejectFn<E>): Omit<SimplePromise<T, E>, "catch"> {
        if (this._state === "rejected" && onRejected) {
            onRejected(this._reason as E);
        } else {
            this._onRejected = onRejected;
        }
        return this as Omit<SimplePromise<T, E>, "catch">;
    }
    
    finally(onFinally: FinallyFn<T, E>): void {
        if (this._state !== "pending") {
            onFinally(this._value ?? (this._reason as T | E));
        } else {
            this._onFinally = onFinally;
        }
    }

    reload() {
        this._state = "pending";
        this._executor(this._resolve, this._reject);
    }
}
