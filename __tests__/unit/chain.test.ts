import { expectTypeOf } from "expect-type"
import chain from "../../index"

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
