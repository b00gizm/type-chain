/* eslint-disable @typescript-eslint/no-explicit-any */

type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never
type ArgTypes<F> = F extends (...args: infer A) => unknown ? A : never
type FirstArgType<F> = F extends (arg: infer A, ...rest: any) => unknown
  ? A
  : never
type LookUp<T, K extends keyof any, Default = never> = K extends keyof T
  ? T[K]
  : Default
type LaxReturnType<F> = F extends (...args: any) => infer R ? R : never

type AnyFunc = (...arg: any) => any
type AnyAsyncFunc = (...arg: any) => Promise<any>
type IsAsyncFunc<F> = F extends (...args: any) => Promise<any> ? true : false

type Chain<
  FType extends AnyFunc | AnyAsyncFunc,
  Left extends [FType, ...FType[]],
  Right extends FType[] = Tail<Left>,
> = {
  [LKey in keyof Left]: (
    ...args: ArgTypes<Left[LKey]>
  ) => IsAsyncFunc<Left[LKey]> extends true
    ? Promise<FirstArgType<LookUp<Right, LKey, any>>>
    : FirstArgType<LookUp<Right, LKey, any>>
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
export function chain<LType extends [AnyFunc, ...AnyFunc[]]>(
  ...funcs: LType & Chain<AnyFunc, LType>
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

export function asyncChain<LType extends [AnyAsyncFunc, ...AnyAsyncFunc[]]>(
  ...funcs: LType & Chain<AnyAsyncFunc, LType>
): (
  ...args: ArgTypes<First<LType>>
) => Promise<Awaited<LaxReturnType<Last<LType>>>> {
  return async (
    ...args: ArgTypes<First<LType>>
  ): Promise<Awaited<LaxReturnType<Last<LType>>>> => {
    const [first] = await funcs.reduce(async (accumulator, nextFunc) => {
      const [first, ...rest] = await accumulator
      const result = await nextFunc(first, ...rest)
      return [result, ...rest]
    }, args as any)

    return first as Awaited<LaxReturnType<Last<LType>>>
  }
}
