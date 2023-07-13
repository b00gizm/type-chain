# typed-chain

A type-safe way to combine interdependent functions into a callable chain.

```typescript
import chain from '@b00gizm/typed-chain';

const func1 = (x: boolean): number => x ? 1 : 0
const func2 = (x: number): string => x > 0 ? "yay!" : "meh"
const func3 = (x: string) => ({ result: x })
const func4 = (x: { result: string }): string => `Result: ${x.result}` 

const chained = chain(func1, func2, func3, func4) // Typed as (x: boolean) => string
console.log(chained(true)) // "Result: yay!"
```

## Install

For installation run:

```bash
yarn add @b00gizm/typed-chain
```

Or for npm:

```bash
npm install --save @b00gizm/typed-chain
```

## Examples

### Basic usage

```typescript
// The output type of each function *MUST* match the input type of the next function
const func1 = (x: boolean): number => x ? 1 : 0
const func2 = (x: number): string => x > 0 ? "yay!" : "meh"
const func3 = (x: string) => ({ result: x })
const func4 = (x: { result: string }): string => `Result: ${x.result}` 

// Chain functions together
const chained = chain(func1, func2, func3, func4) // Typed as (x: boolean) => string

// Call the chain
const result = chained(true) // "Result: yay!"

// It won't compile if functions are not compatible or in the wrong order
chain(func1, func3, func2) // Error (number is not assignable to string)
```

### Usage for functions with multiple arguments

It is possible to chain functions with multiple arguments, for example if you want to pass a context object to each function. Everything after the first argument will be passed through to each function in the chain.

```typescript
const discount = (
  price: number,
  context: { premiumUser: boolean },
): number => (context.premiumUser ? price * 0.8 : price)

const message = (
  price: number,
  context: { premiumUser: boolean },
): string =>
  context.premiumUser
    ? `Special offer: $${price} (20% discount)`
    : `Price: $${price}`

const chained = chain(discount, message) // Typed as (price: number, context: { premiumUser: boolean }) => string
const result = chained(100, { premiumUser: true }) // "Special offer: $80 (20% discount)"
```