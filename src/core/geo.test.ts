import { describe, expect, it } from 'vitest'
import { bearingDeg, distanceKm, intermediatePoint, relativeBearing, samplePath } from './geo'

const SEA = { lat: 47.4502, lon: -122.3088 }
const ANC = { lat: 61.1743, lon: -149.9982 }

describe('distanceKm', () => {
  it('matches the published Seattle to Anchorage great-circle distance', () => {
    // 1,448 statute miles
    expect(distanceKm(SEA, ANC)).toBeGreaterThan(2315)
    expect(distanceKm(SEA, ANC)).toBeLessThan(2345)
  })

  it('is zero for the same point', () => {
    expect(distanceKm(SEA, SEA)).toBe(0)
  })
})

describe('bearingDeg', () => {
  it('points north, east, south and west', () => {
    expect(bearingDeg({ lat: 0, lon: 0 }, { lat: 10, lon: 0 })).toBeCloseTo(0)
    expect(bearingDeg({ lat: 0, lon: 0 }, { lat: 0, lon: 10 })).toBeCloseTo(90)
    expect(bearingDeg({ lat: 10, lon: 0 }, { lat: 0, lon: 0 })).toBeCloseTo(180)
    expect(bearingDeg({ lat: 0, lon: 10 }, { lat: 0, lon: 0 })).toBeCloseTo(270)
  })
})

describe('intermediatePoint', () => {
  it('returns the endpoints at 0 and 1', () => {
    const start = intermediatePoint(SEA, ANC, 0)
    const end = intermediatePoint(SEA, ANC, 1)
    expect(start.lat).toBeCloseTo(SEA.lat)
    expect(start.lon).toBeCloseTo(SEA.lon)
    expect(end.lat).toBeCloseTo(ANC.lat)
    expect(end.lon).toBeCloseTo(ANC.lon)
  })

  it('puts the midpoint the same distance from both ends', () => {
    const mid = intermediatePoint(SEA, ANC, 0.5)
    expect(distanceKm(SEA, mid)).toBeCloseTo(distanceKm(mid, ANC), 3)
  })
})

describe('relativeBearing', () => {
  it('is positive to the right and negative to the left', () => {
    expect(relativeBearing(0, 90)).toBe(90)
    expect(relativeBearing(0, 270)).toBe(-90)
    expect(relativeBearing(350, 10)).toBe(20)
    expect(relativeBearing(10, 350)).toBe(-20)
  })
})

//This test sets up the simplest possible flight, straight north along one line of longitude, because every correct answer for that flight is known in advance.
//The flight goes from latitude 0 to latitude 10, staying at longitude 0, so it is due north the whole way. The 10 asks for the route to be cut into 10 equal segments.
describe('samplePath', () => {
  it('starts at the origin, ends at the destination, and heads toward it', () => {
    const samples = samplePath({ lat: 0, lon: 0 }, { lat: 10, lon: 0 }, 10)
    expect(samples).toHaveLength(11) //10 segments have 11 endpoints, like a fence with 10 panels needing 11 posts. This catches an off-by-one mistake that drops the start or the end.
    expect(samples[0].fraction).toBe(0) //the first sample is at the very start of the route
    expect(samples[10].fraction).toBe(1) //the last sample is at the very end
    expect(samples[10].point.lat).toBeCloseTo(10) //the last sample really is at the destination's latitude. It uses toBeCloseTo because the position comes out of trigonometry and may be 9.9999999
    for (const s of samples) expect(relativeBearing(0, s.heading)).toBeCloseTo(0) //The loop checks that at every sample, the direction of travel is north
  })
})
