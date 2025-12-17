export type OkResult<T> = { readonly ok: true; readonly value: T }
export type ErrResult<E extends Error> = { readonly ok: false; readonly error: E }
export type Result<T, E extends Error = Error> = OkResult<T> | ErrResult<E>

export const Ok = <T>(value: T): OkResult<T> => ({ ok: true, value })
export const Err = <E extends Error>(error: E): ErrResult<E> => ({ error, ok: false })

export const isOk = <T, E extends Error>(result: Result<T, E>): result is OkResult<T> => result.ok
export const isErr = <T, E extends Error>(result: Result<T, E>): result is ErrResult<E> => !result.ok

export const mapResult = <T, U, E extends Error>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
  result.ok ? Ok(fn(result.value)) : result

export const flatMapResult = <T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (result.ok ? fn(result.value) : result)

export const unwrap = <T, E extends Error>(result: Result<T, E>): T => {
  if (result.ok) {
    return result.value
  }
  throw result.error
}

export const unwrapOr = <T, E extends Error>(result: Result<T, E>, defaultValue: T): T =>
  result.ok ? result.value : defaultValue

export const trySync = <T>(fn: () => T): Result<T, Error> => {
  try {
    return Ok(fn())
  } catch (e) {
    return Err(e instanceof Error ? e : new Error(String(e)))
  }
}

export const tryAsync = async <T>(fn: () => Promise<T>): Promise<Result<T, Error>> => {
  try {
    return Ok(await fn())
  } catch (e) {
    return Err(e instanceof Error ? e : new Error(String(e)))
  }
}
