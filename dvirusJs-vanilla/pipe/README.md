# RxJS-style Pipe Pattern

This module provides a flexible pipe pattern implementation that can be extended with custom operators, similar to RxJS.

## Features

- **Operator-based architecture**: Create reusable operators that can be composed
- **Type-safe**: Full TypeScript support with proper type inference
- **Extensible**: Easy to add custom operators
- **Error handling**: Built-in error handling and recovery mechanisms
- **Async support**: Handle asynchronous operations
- **Debugging**: Built-in debugging and logging capabilities

## Basic Usage

```typescript
import { createPipe, map, filter, tap } from './rx-pipe';

// Simple pipe with operators
const result = createPipe(5)
  .pipe(filter(n => n > 3))
  .pipe(map(n => n * 2))
  .pipe(tap(n => console.log('Result:', n)))
  .value();

console.log(result); // 10
```

## Using the pipe function for composition

```typescript
import { pipe, map, filter, tap } from './rx-pipe';

const processNumber = pipe(
  filter((n: number) => n > 0),
  map((n: number) => n * 2),
  tap((n: number) => console.log('Processed:', n))
);

const result = processNumber(5); // 10
```

## Creating Custom Operators

```typescript
import { Operator } from './rx-pipe';

// Simple operator
function multiply(factor: number): Operator<number, number> {
  return (value: number) => value * factor;
}

// Operator with side effects
function logWithTimestamp<T>(message?: string): Operator<T, T> {
  return (value: T) => {
    console.log(`[${new Date().toISOString()}] ${message || 'Value'}:`, value);
    return value;
  };
}

// Conditional operator
function conditional<T, U>(
  condition: (value: T) => boolean,
  trueOperator: Operator<T, U>,
  falseOperator: Operator<T, U>
): Operator<T, U> {
  return (value: T) => {
    return condition(value) ? trueOperator(value) : falseOperator(value);
  };
}
```

## Advanced Usage

### Error Handling

```typescript
import { createPipe, map, stop, error } from './rx-pipe';

const result = createPipe(5, { errorHandling: 'continue' })
  .pipe(map(n => {
    if (n === 5) throw new Error('Value 5 not allowed');
    return n * 2;
  }))
  .execute();

if (result.error) {
  console.log('Error occurred:', result.error.message);
}
```

### Async Operations

```typescript
import { createPipe, map } from './rx-pipe';

const asyncOperator: Operator<number, number> = async (value: number) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return value * 2;
};

const result = await createPipe(5)
  .pipe(asyncOperator)
  .toPromise();
```

### Debugging

```typescript
import { createPipe, map, filter } from './rx-pipe';

const result = createPipe(5, { debug: true })
  .pipe(filter(n => n > 3))
  .pipe(map(n => n * 2))
  .execute();
```

## Built-in Operators

- `map<T, U>(transform: (value: T) => U)`: Transform values
- `filter<T>(predicate: (value: T) => boolean)`: Filter values
- `tap<T>(effect: (value: T) => void)`: Perform side effects
- `take<T>(count: number)`: Take only the first N values
- `skip<T>(count: number)`: Skip the first N values
- `catchError<T, U>(handler: (error: Error, value: T) => U)`: Handle errors
- `retry<T>(times: number)`: Retry on error
- `delay<T>(ms: number)`: Add delay

## Utility Functions

- `pipeResult<T>(value: T, options?)`: Create a pipe result
- `stop<T>(value: T)`: Stop pipe execution
- `error<T>(value: T, error: Error)`: Continue with error
- `metadata<T>(value: T, metadata: Record<string, any>)`: Add metadata

## Configuration

```typescript
interface PipeConfig {
  debug?: boolean;           // Enable debug logging
  errorHandling?: 'stop' | 'continue' | 'retry';  // Error handling strategy
  maxRetries?: number;       // Maximum retry attempts
}
```

## Examples

See `rx-pipe-examples.ts` for comprehensive usage examples including:
- Custom operator creation
- Error handling patterns
- Async processing
- Performance testing
- Operator composition

## Extending the Library

The pipe pattern is designed to be easily extensible. You can:

1. Create custom operators by implementing the `Operator<T, R>` type
2. Add operator factories for parameterized operators
3. Create domain-specific operator libraries
4. Implement custom error handling strategies
5. Add specialized pipe configurations

This makes the library suitable for a wide range of use cases while maintaining a consistent and familiar API.

