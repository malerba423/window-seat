import { describe, expect, it } from 'vitest'
import { zonedTimeToUtc } from './time'

describe('zonedTimeToUtc', () => {
  it('reads a summer time in Seattle as Pacific Daylight Time', () => {
    expect(zonedTimeToUtc('2026-07-01T12:00', 'America/Los_Angeles').toISOString()).toBe('2026-07-01T19:00:00.000Z')
  })

  it('reads a winter time in Seattle as Pacific Standard Time', () => {
    expect(zonedTimeToUtc('2026-01-15T12:00', 'America/Los_Angeles').toISOString()).toBe('2026-01-15T20:00:00.000Z')
  })

  it('handles zones without daylight saving', () => {
    expect(zonedTimeToUtc('2026-07-01T08:30', 'Pacific/Honolulu').toISOString()).toBe('2026-07-01T18:30:00.000Z')
    expect(zonedTimeToUtc('2026-07-01T08:30', 'America/Phoenix').toISOString()).toBe('2026-07-01T15:30:00.000Z')
  })

  it('rejects input that is not a date and time', () => {
    expect(() => zonedTimeToUtc('tomorrow', 'America/Los_Angeles')).toThrow()
  })
})
