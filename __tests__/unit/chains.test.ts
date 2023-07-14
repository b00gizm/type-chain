import { expectTypeOf } from "expect-type"
import { asyncChain, chain } from "../../index"

describe("chain", () => {
  it("should be defined", () => {
    expect(chain).toBeInstanceOf(Function)
  })

  it("should combine interdependent functions into a chain function", () => {
    // Given
    const first = (x: boolean): number => (x ? 1 : 0)
    const second = (x: number): string => (x > 0 ? "yay!" : "meh")
    const third = (x: string) => ({ result: x })
    const forth = (x: { result: string }) => `The result is ${x.result}`

    // When
    const chained = chain(first, second, third, forth)

    // Then
    expect(chained).toBeInstanceOf(Function)
    expectTypeOf(chained).toEqualTypeOf<(x: boolean) => string>()
    expect(chained(true)).toBe("The result is yay!")
  })

  it("should combine interdependent functions with multiple arguments", () => {
    // Given
    const PREMIUM_DISCOUNT = 20

    const discount = (price: number, context: { premiumUser: boolean }) => {
      if (context.premiumUser) {
        return {
          price: (price * (100 - PREMIUM_DISCOUNT)) / 100,
          discount: PREMIUM_DISCOUNT,
        }
      }

      return {
        price,
        discount: 0,
      }
    }

    const message = (
      priceInfo: { price: number; discount: number },
      context: { premiumUser: boolean },
    ): string =>
      context.premiumUser
        ? `Special offer: $${priceInfo.price} (${priceInfo.discount}% discount)`
        : `Price: $${priceInfo.price}`

    // When
    const chained = chain(discount, message)

    // Then
    expect(chained).toBeInstanceOf(Function)
    expectTypeOf(chained).toEqualTypeOf<
      (x: number, y: { premiumUser: boolean }) => string
    >()
    expect(chained(100, { premiumUser: true })).toBe(
      "Special offer: $80 (20% discount)",
    )
  })

  it("should not compile if the functions are not chainable", () => {
    // Given
    const not = (x: boolean): number => (x ? 1 : 0)
    const chainable = (x: string): string => x

    // When / Then
    // @ts-expect-error - not chainable (number is not assignable to string)
    chain(not, chainable)
  })
})

describe("asyncChain", () => {
  it("should be defined", () => {
    expect(asyncChain).toBeInstanceOf(Function)
  })

  it("should combine interdependent async functions into a chain function", async () => {
    // Given
    const first = async (x: boolean): Promise<number> => (x ? 1 : 0)
    const second = async (x: number): Promise<string> =>
      x > 0 ? "yay!" : "meh"
    const third = async (x: string) => ({ result: x })
    const forth = async (x: { result: string }) => `The result is ${x.result}`

    // When
    const chained = asyncChain(first, second, third, forth)

    // Then
    expect(chained).toBeInstanceOf(Function)
    expectTypeOf(chained).toEqualTypeOf<(x: boolean) => Promise<string>>()
    expect(await chained(true)).toBe("The result is yay!")
  })

  it("should combine interdependent async functions with multiple arguments", async () => {
    // Given
    const PREMIUM_DISCOUNT = 20

    const discount = async (
      price: number,
      context: { premiumUser: boolean },
    ) => {
      if (context.premiumUser) {
        return {
          price: (price * (100 - PREMIUM_DISCOUNT)) / 100,
          discount: PREMIUM_DISCOUNT,
        }
      }

      return {
        price,
        discount: 0,
      }
    }

    const message = async (
      priceInfo: { price: number; discount: number },
      context: { premiumUser: boolean },
    ): Promise<string> =>
      context.premiumUser
        ? `Special offer: $${priceInfo.price} (${priceInfo.discount}% discount)`
        : `Price: $${priceInfo.price}`

    // When
    const chained = asyncChain(discount, message)

    // Then
    expect(chained).toBeInstanceOf(Function)
    expectTypeOf(chained).toEqualTypeOf<
      (x: number, y: { premiumUser: boolean }) => Promise<string>
    >()
    expect(await chained(100, { premiumUser: true })).toBe(
      "Special offer: $80 (20% discount)",
    )
  })

  it("should not compile if the async functions are not chainable", () => {
    // Given
    const not = async (x: boolean): Promise<number> => (x ? 1 : 0)
    const chainable = async (x: string): Promise<string> => x

    // When / Then
    // @ts-expect-error - not chainable (Promise<number> is not assignable to string)
    asyncChain(not, chainable)
  })
})
