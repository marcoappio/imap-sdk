import { Err, flatMapResult, isErr, isOk, mapResult, Ok, tryAsync, trySync, unwrap, unwrapOr } from './result'

describe('Result type', () => {
  describe('Ok', () => {
    it('should create a successful result', () => {
      const result = Ok(42)

      expect(result.ok).toBe(true)
      expect(result.value).toBe(42)
    })

    it('should work with different value types', () => {
      expect(Ok('hello').value).toBe('hello')
      expect(Ok({ foo: 'bar' }).value).toEqual({ foo: 'bar' })
      expect(Ok([1, 2, 3]).value).toEqual([1, 2, 3])
      expect(Ok(null).value).toBeNull()
      expect(Ok(undefined).value).toBeUndefined()
    })
  })

  describe('Err', () => {
    it('should create an error result', () => {
      const error = new Error('something went wrong')
      const result = Err(error)

      expect(result.ok).toBe(false)
      expect(result.error).toBe(error)
    })

    it('should work with custom error types', () => {
      class CustomError extends Error {
        code = 'CUSTOM'
      }
      const error = new CustomError('custom error')
      const result = Err(error)

      expect(result.ok).toBe(false)
      expect(result.error.code).toBe('CUSTOM')
    })
  })

  describe('isOk', () => {
    it('should return true for Ok results', () => {
      const result = Ok(42)
      expect(isOk(result)).toBe(true)
    })

    it('should return false for Err results', () => {
      const result = Err(new Error('error'))
      expect(isOk(result)).toBe(false)
    })

    it('should narrow the type', () => {
      const result = Ok(42) as ReturnType<typeof Ok<number>> | ReturnType<typeof Err<Error>>

      if (isOk(result)) {
        expect(result.value).toBe(42)
      }
    })
  })

  describe('isErr', () => {
    it('should return false for Ok results', () => {
      const result = Ok(42)
      expect(isErr(result)).toBe(false)
    })

    it('should return true for Err results', () => {
      const result = Err(new Error('error'))
      expect(isErr(result)).toBe(true)
    })

    it('should narrow the type', () => {
      const result = Err(new Error('test')) as ReturnType<typeof Ok<number>> | ReturnType<typeof Err<Error>>

      if (isErr(result)) {
        expect(result.error.message).toBe('test')
      }
    })
  })

  describe('mapResult', () => {
    it('should map Ok values', () => {
      const result = Ok(10)
      const mapped = mapResult(result, x => x * 2)

      expect(mapped.ok).toBe(true)
      if (mapped.ok) {
        expect(mapped.value).toBe(20)
      }
    })

    it('should not map Err values', () => {
      const error = new Error('error')
      const result = Err(error)
      const mapped = mapResult(result, () => 'never called')

      expect(mapped.ok).toBe(false)
      if (!mapped.ok) {
        expect(mapped.error).toBe(error)
      }
    })

    it('should transform value types', () => {
      const result = Ok('42')
      const mapped = mapResult(result, Number.parseInt)

      expect(mapped.ok).toBe(true)
      if (mapped.ok) {
        expect(mapped.value).toBe(42)
      }
    })
  })

  describe('flatMapResult', () => {
    it('should flatMap Ok values', () => {
      const result = Ok(10)
      const flatMapped = flatMapResult(result, x => (x > 5 ? Ok(x * 2) : Err(new Error('too small'))))

      expect(flatMapped.ok).toBe(true)
      if (flatMapped.ok) {
        expect(flatMapped.value).toBe(20)
      }
    })

    it('should return Err when flatMap function returns Err', () => {
      const result = Ok(3)
      const flatMapped = flatMapResult(result, x => (x > 5 ? Ok(x * 2) : Err(new Error('too small'))))

      expect(flatMapped.ok).toBe(false)
      if (!flatMapped.ok) {
        expect(flatMapped.error.message).toBe('too small')
      }
    })

    it('should not flatMap Err values', () => {
      const error = new Error('original error')
      const result = Err(error)
      const flatMapped = flatMapResult(result, () => Ok('never called'))

      expect(flatMapped.ok).toBe(false)
      if (!flatMapped.ok) {
        expect(flatMapped.error).toBe(error)
      }
    })
  })

  describe('unwrap', () => {
    it('should return value for Ok results', () => {
      const result = Ok(42)
      expect(unwrap(result)).toBe(42)
    })

    it('should throw for Err results', () => {
      const error = new Error('test error')
      const result = Err(error)

      expect(() => unwrap(result)).toThrow(error)
    })
  })

  describe('unwrapOr', () => {
    it('should return value for Ok results', () => {
      const result = Ok(42)
      expect(unwrapOr(result, 0)).toBe(42)
    })

    it('should return default value for Err results', () => {
      const result = Err(new Error('error'))
      expect(unwrapOr(result, 0)).toBe(0)
    })

    it('should work with different default value types', () => {
      const result = Err(new Error('error'))
      expect(unwrapOr(result, 'default')).toBe('default')
      expect(unwrapOr(result, null)).toBeNull()
    })
  })

  describe('trySync', () => {
    it('should return Ok for successful function execution', () => {
      const result = trySync(() => 42)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toBe(42)
      }
    })

    it('should return Err for thrown errors', () => {
      const result = trySync(() => {
        throw new Error('sync error')
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('sync error')
      }
    })

    it('should convert non-Error throws to Error', () => {
      const result = trySync(() => {
        // biome-ignore lint/style/useThrowOnlyError: testing non-Error throw handling
        throw 'string error'
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('string error')
      }
    })
  })

  describe('tryAsync', () => {
    it('should return Ok for successful async function execution', async () => {
      const result = await tryAsync(async () => 42)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toBe(42)
      }
    })

    it('should return Err for rejected promises', async () => {
      const result = await tryAsync(async () => {
        await Promise.resolve()
        throw new Error('async error')
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('async error')
      }
    })

    it('should convert non-Error throws to Error', async () => {
      const result = await tryAsync(async () => {
        await Promise.resolve()
        // biome-ignore lint/style/useThrowOnlyError: testing non-Error throw handling
        throw 'string error'
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('string error')
      }
    })

    it('should handle async operations', async () => {
      const result = await tryAsync(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'done'
      })

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toBe('done')
      }
    })
  })
})
