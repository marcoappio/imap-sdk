import { describe, expect, it } from 'vitest'

import type { Brand } from './brand'
import { brand } from './brand'

describe('brand', () => {
  it('should create a branded number', () => {
    const userId = brand<number, 'UserId'>(42) satisfies Brand<number, 'UserId'>

    expect(userId).toBe(42)
    expect(typeof userId).toBe('number')
  })

  it('should create a branded string', () => {
    const email = brand<string, 'Email'>('test@example.com') satisfies Brand<string, 'Email'>

    expect(email).toBe('test@example.com')
    expect(typeof email).toBe('string')
  })

  it('should create a branded bigint', () => {
    const modseq = brand<bigint, 'ModSeq'>(BigInt(12_345)) satisfies Brand<bigint, 'ModSeq'>

    expect(modseq).toBe(BigInt(12_345))
    expect(typeof modseq).toBe('bigint')
  })

  it('should preserve the underlying value for arithmetic', () => {
    const count = brand<number, 'Count'>(10) satisfies Brand<number, 'Count'>

    expect(count + 5).toBe(15)
    expect(count * 2).toBe(20)
  })

  it('should preserve string methods on branded strings', () => {
    const path = brand<string, 'Path'>('/inbox/folder') satisfies Brand<string, 'Path'>

    expect(path.toUpperCase()).toBe('/INBOX/FOLDER')
    expect(path.split('/')).toEqual(['', 'inbox', 'folder'])
  })
})
