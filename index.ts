/* eslint-disable @typescript-eslint/no-explicit-any */

type First<T extends any[]> = T extends [infer F, ...any] ? F : never
type Last<T extends unknown[]> = T extends [...any, infer L] ? L : never
type Tail<T extends unknown[]> = T extends [any, ...infer R] ? R : never
type ArgTypes<F> = F extends (...args: infer A) => any ? A : never
type FirstArgType<F> = F extends (arg: infer A, ...rest: any) => any ? A : never
type LookUp<T, K extends keyof any, Default = never> = K extends keyof T
  ? T[K]
  : Default
type LaxReturnType<F> = F extends (...args: any) => infer R ? R : never

type AnyFunc = (...arg: any) => any

type Chain<A extends [AnyFunc, ...AnyFunc[]], B extends AnyFunc[] = Tail<A>> = {
  [K in keyof A]: (...args: ArgTypes<A[K]>) => FirstArgType<LookUp<B, K, any>>
}

/**
 * Function to chain multiple functions together. The return type of each function
 * must match the (first) argument type of the next function in the chain.
 *
 * If there are more than one argument in the first function, the the second to
 * last arguments will be passed to the second function, and so on.
 *
 * @param {...functions} funcs - The functions to chain together
 * @returns {function} A function that will execute the chain of functions
 */
export default function <LType extends [AnyFunc, ...AnyFunc[]]>(
  ...funcs: LType & Chain<LType>
): (...args: ArgTypes<First<LType>>) => LaxReturnType<Last<LType>> {
  return (...args: ArgTypes<First<LType>>): LaxReturnType<Last<LType>> => {
    const [first] = funcs.reduce((accumulator, nextFunc) => {
      const [first, ...rest] = accumulator
      const result = nextFunc(first, ...rest)
      return [result, ...rest]
    }, args as any)

    return first as LaxReturnType<Last<LType>>
  }
}
