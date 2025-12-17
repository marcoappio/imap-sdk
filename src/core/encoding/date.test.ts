import { formatIMAPDate, formatIMAPDateTime, parseDate } from './date'

const DATETIME_PATTERN = /15-Mar-2024 \d{2}:\d{2}:45 [+-]\d{4}/

describe('formatIMAPDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-03-15T00:00:00.000Z')
    expect(formatIMAPDate(date)).toBe('15-Mar-2024')
  })

  it('should throw for invalid date', () => {
    expect(() => formatIMAPDate(new Date('invalid'))).toThrow('Invalid date')
  })
})

describe('formatIMAPDateTime', () => {
  it('should format datetime with timezone', () => {
    const date = new Date('2024-03-15T14:30:45.000Z')
    const result = formatIMAPDateTime(date)
    expect(result).toMatch(DATETIME_PATTERN)
  })

  it('should throw for invalid date', () => {
    expect(() => formatIMAPDateTime(new Date('invalid'))).toThrow('Invalid date')
  })
})

describe('parseDate', () => {
  it('should parse Date object', () => {
    const date = new Date('2024-03-15')
    expect(parseDate(date)).toEqual(date)
  })

  it('should parse date string', () => {
    const result = parseDate('2024-03-15')
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString().slice(0, 10)).toBe('2024-03-15')
  })

  it('should return undefined for invalid date string', () => {
    expect(parseDate('invalid')).toBeUndefined()
  })

  it('should return undefined for invalid Date object', () => {
    expect(parseDate(new Date('invalid'))).toBeUndefined()
  })

  it('should return undefined for non-date values', () => {
    expect(parseDate(123)).toBeUndefined()
    expect(parseDate(null)).toBeUndefined()
    expect(parseDate(undefined)).toBeUndefined()
  })
})
