declare const __brand: unique symbol

export type Brand<T, B extends string> = T & { readonly [__brand]: B }

export const brand = <T, B extends string>(value: T): Brand<T, B> => value as Brand<T, B>
