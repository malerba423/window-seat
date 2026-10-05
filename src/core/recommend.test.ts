import { describe, expect, it } from 'vitest'
import { airportByCode } from '../data/airports'
import { landmarks } from '../data/landmarks'
import { flightMinutes, recommend } from './recommend'
import { zonedTimeToUtc } from './time'
import type { Airport, Landmark } from './types'

const SEA = airportByCode('SEA')
const PDX = airportByCode('PDX')
const summerNoon = zonedTimeToUtc('2026-07-01T12:00', SEA.tz)
const winterNight = zonedTimeToUtc('2026-12-15T23:30', SEA.tz)

const point = (code: string, lat: number, lon: number): Airport => ({ code, city: code, lat, lon, tz: 'UTC' })
const peak = (id: string, lat: number, lon: number): Landmark => ({
  id, name: id, region: 'test', kind: 'mountain', lat, lon, visibleKm: 150, weight: 2,
})

describe('flightMinutes', () => {
  it('adds climb and descent time to the cruise time', () => {
    expect(flightMinutes(800)).toBe(80)
    expect(flightMinutes(0)).toBe(20)
  })
})

describe('recommend: which side a landmark is on', () => {
  const south = point('S', 40, -100)
  const north = point('N', 44, -100)
  const noon = new Date('2026-06-21T19:00:00Z')

  it('puts a landmark east of a northbound flight on the right', () => {
    const rec = recommend({ from: south, to: north, departUtc: noon }, [peak('east', 42, -99.4)])
    expect(rec.sightings[0].side).toBe('right')
    expect(rec.side).toBe('right')
  })

  it('puts the same landmark on the left when the flight is reversed', () => {
    const rec = recommend({ from: north, to: south, departUtc: noon }, [peak('east', 42, -99.4)])
    expect(rec.sightings[0].side).toBe('left')
    expect(rec.side).toBe('left')
  })

  it('ignores landmarks beyond their visible distance', () => {
    const rec = recommend({ from: south, to: north, departUtc: noon }, [peak('far', 42, -95)])
    expect(rec.sightings).toHaveLength(0)
    expect(rec.side).toBe('either')
  })

  it('does not favor a side for a landmark directly under the flight path', () => {
    const rec = recommend({ from: south, to: north, departUtc: noon }, [peak('under', 42, -100)])
    expect(rec.sightings[0].side).toBe('overhead')
    expect(rec.leftScore).toBe(0)
    expect(rec.rightScore).toBe(0)
  })

  it('reports when a landmark comes into view', () => {
    const rec = recommend({ from: south, to: north, departUtc: noon }, [peak('east', 42, -99.4)])
    expect(rec.sightings[0].minutesAfterTakeoff).toBeGreaterThan(rec.durationMin * 0.4)
    expect(rec.sightings[0].minutesAfterTakeoff).toBeLessThan(rec.durationMin * 0.6)
  })

  it('says either side when both are about as good', () => {
    const rec = recommend({ from: south, to: north, departUtc: noon }, [peak('east', 42, -99.4), peak('west', 42, -100.6)])
    expect(rec.side).toBe('either')
  })
})

describe('recommend: Seattle and Portland', () => {
  it('seats you on the left heading south, facing the volcanoes', () => {
    const rec = recommend({ from: SEA, to: PDX, departUtc: summerNoon }, landmarks)
    const side = (id: string) => rec.sightings.find(s => s.landmark.id === id)?.side
    expect(side('rainier')).toBe('left')
    expect(side('st-helens')).toBe('left')
    expect(side('hood')).toBe('left')
    expect(rec.side).toBe('left')
  })

  it('seats you on the right heading north', () => {
    const rec = recommend({ from: PDX, to: SEA, departUtc: summerNoon }, landmarks)
    expect(rec.side).toBe('right')
  })

  it('lists sightings in the order you pass them', () => {
    const rec = recommend({ from: SEA, to: PDX, departUtc: summerNoon }, landmarks)
    const order = rec.sightings.map(s => s.landmark.id)
    expect(order.indexOf('rainier')).toBeLessThan(order.indexOf('st-helens'))
    expect(order.indexOf('st-helens')).toBeLessThan(order.indexOf('hood'))
  })
})

describe('recommend: light', () => {
  it('does not count mountains you cannot see in the dark', () => {
    const rec = recommend({ from: SEA, to: PDX, departUtc: winterNight }, landmarks)
    const rainier = rec.sightings.find(s => s.landmark.id === 'rainier')
    expect(rainier?.light).toBe('night')
    expect(rainier?.visible).toBe(false)
    expect(rainier?.score).toBe(0)
  })

  it('still counts city lights at night', () => {
    const city: Landmark = { ...peak('city', 42, -99.4), kind: 'city' }
    const midnight = new Date('2026-06-21T07:00:00Z')
    const rec = recommend({ from: point('S', 40, -100), to: point('N', 44, -100), departUtc: midnight }, [city])
    expect(rec.sightings[0].light).toBe('night')
    expect(rec.sightings[0].visible).toBe(true)
    expect(rec.side).toBe('right')
  })

  it('puts a sunset on the west side of a northbound evening flight', () => {
    // Equinox sunset at 122°W is a little after 02:15 UTC.
    const rec = recommend({ from: point('S', 40, -122), to: point('N', 45, -122), departUtc: new Date('2026-03-21T01:40:00Z') }, [])
    const sunset = rec.sky.find(e => e.kind === 'sunset')
    expect(sunset?.side).toBe('left')
    expect(rec.side).toBe('left')
  })

  it('reports which side the sun is on during a daytime flight', () => {
    // Late morning, flying north: the sun is in the southeast, behind and to the right.
    const rec = recommend({ from: point('S', 40, -100), to: point('N', 44, -100), departUtc: new Date('2026-06-21T16:00:00Z') }, [])
    expect(rec.sunSide).toBe('right')
    expect(rec.sky).toHaveLength(0)
  })

  it('points at the north side for a possible aurora on a far-north night flight', () => {
    const rec = recommend({ from: airportByCode('SEA'), to: airportByCode('FAI'), departUtc: zonedTimeToUtc('2026-12-15T21:00', SEA.tz) }, [])
    const aurora = rec.sky.find(e => e.kind === 'aurora')
    // Heading northwest, north is to the right.
    expect(aurora?.side).toBe('right')
  })
})
