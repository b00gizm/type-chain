# typed-chain

A type-safe way to combine interdependent functions into a callable chain.

```typescript
import { chain } from '@b00gizm/typed-chain'

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
import { chain } from '@b00gizm/typed-chain'

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
import { chain } from '@b00gizm/typed-chain'

const PREMIUM_DISCOUNT = 20

const discount = (
  price: number,
  context: { premiumUser: boolean },
): number => (context.premiumUser ? price * (100-PREMIUM_DISCOUNT)/100 : price)

const message = (
  price: number,
  context: { premiumUser: boolean },
): string =>
  context.premiumUser
    ? `Special offer: $${price} (${PREMIUM_DISCOUNT}% discount)`
    : `Price: $${price}`

const chained = chain(discount, message) // Typed as (price: number, context: { premiumUser: boolean }) => string
const result = chained(100, { premiumUser: true }) // "Special offer: $80 (20% discount)"
```

Please note that there cannot be any side-effects when using this method, eg. any changes you make to a potential context object **will not be passed** through to the next function in the chain.

### Asynchronous chains

It is also possible to chain asynchronous functions together using `asyncChain`. Here, the _awaited_ output type of each function must match the input type of the next function. Here is an asynchronous version of the previous example, where the discount percentage is asynchronously fetched from some API.

```typescript
import { asyncChain } from '@b00gizm/typed-chain'

const discount = async (
  price: number,
  context: { premiumUser: boolean },
): => {
  if (context.premiumUser) {
    // Asnychonously fetch discount percentage
    const response = await fetch('/discounts')
    const { percentage } = await response.json()

    return {
      price: (price * (100-percentage)/100), 
      discount: percentage
    }
  }

  return { price, discount: 0 }
}

const message = async (
  priceInfo: { price: number, discount: number },
  context: { premiumUser: boolean },
): Promise<string> => {
  if (context.premiumUser) {
    return `Special offer: $${priceInfo.price} (${priceInfo.discount} discount)`
  }

  return `Price: $${priceInfo.price}`
}

const chained = asyncChain(discount, message) // Typed as (price: number, context: { premiumUser: boolean }) => Promise<string>
const result = await chained(100, { premiumUser: true }) // "Special offer: $80 (20% discount)"
```

Please note that every function in the chain **must be declared as `async`**. Mixing synchronous and asynchronous functions is not supported for the time being.