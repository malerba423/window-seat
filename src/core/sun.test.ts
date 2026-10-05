import { describe, expect, it } from 'vitest'
import { lightAt, sunPosition } from './sun'

const equator = { lat: 0, lon: 0 }

describe('sunPosition', () => {
  it('rises in the east on the equinox', () => {
    const sun = sunPosition(new Date('2026-03-20T06:30:00Z'), equator)
    expect(sun.bearing).toBeGreaterThan(80)
    expect(sun.bearing).toBeLessThan(100)
    expect(sun.altitude).toBeGreaterThan(0)
    expect(sun.altitude).toBeLessThan(15)
  })

  it('sets in the west on the equinox', () => {
    const sun = sunPosition(new Date('2026-03-20T17:45:00Z'), equator)
    expect(sun.bearing).toBeGreaterThan(260)
    expect(sun.bearing).toBeLessThan(280)
  })

  it('is high overhead at local noon and below the horizon at midnight', () => {
    expect(sunPosition(new Date('2026-03-20T12:07:00Z'), equator).altitude).toBeGreaterThan(85)
    expect(sunPosition(new Date('2026-03-20T00:00:00Z'), equator).altitude).toBeLessThan(-60)
  })
})

describe('lightAt', () => {
  it('splits day, twilight and night by sun altitude', () => {
    expect(lightAt(20)).toBe('day')
    expect(lightAt(-3)).toBe('twilight')
    expect(lightAt(-12)).toBe('night')
  })
})
