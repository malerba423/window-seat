import { bearingDeg, distanceKm, relativeBearing, samplePath, toRad, type PathSample } from './geo'
import { lightAt, sunPosition, type SunPosition } from './sun'
import type { Airport, Landmark, Recommendation, Side, Sighting, SkyEvent } from './types'

const CRUISE_KMH = 800
/** Extra time for the slower climb and descent. */
const CLIMB_DESCENT_MIN = 20
const SAMPLE_SPACING_KM = 10
/** Closer than this to the flight path, a landmark is under the plane rather than out a window. */
const OVERHEAD_KM = 4
/** Within this many degrees of straight ahead or behind, something is not really on either side. */
const INLINE_DEG = 25
const TWILIGHT_DIMMING = 0.6
/** Sun this low is a sunrise or sunset worth watching; above it, it is just glare. */
const GLOW_MAX_ALTITUDE = 8
const GLOW_SCORE = 2.5
const AURORA_MIN_LATITUDE = 58
const AURORA_SCORE = 1
/** Sides within this share of each other are a toss-up. */
const TOSS_UP_MARGIN = 0.15

export interface FlightInput {
  from: Airport
  to: Airport
  departUtc: Date
}

export function flightMinutes(km: number): number {
  return (km / CRUISE_KMH) * 60 + CLIMB_DESCENT_MIN
}

const sideOf = (relative: number): Side => (relative > 0 ? 'right' : 'left')
const isInline = (relative: number) => Math.abs(relative) < INLINE_DEG || Math.abs(relative) > 180 - INLINE_DEG

interface Moment extends PathSample {
  minutes: number
  sun: SunPosition
}

function sightingFor(landmark: Landmark, moments: Moment[]): Sighting | null {
  let closest = moments[0]
  let closestKm = Infinity
  for (const m of moments) {
    const km = distanceKm(m.point, landmark)
    if (km < closestKm) {
      closest = m
      closestKm = km
    }
  }
  if (closestKm > landmark.visibleKm) return null

  const relative = relativeBearing(closest.heading, bearingDeg(closest.point, landmark))
  const atAnEnd = closest.fraction === 0 || closest.fraction === 1
  // The nearest sample can be a few km along the path from the landmark, so measure how far it sits off to the side.
  const offsetKm = closestKm * Math.abs(Math.sin(toRad(relative)))
  const side = offsetKm < OVERHEAD_KM || (atAnEnd && isInline(relative)) ? 'overhead' : sideOf(relative)

  const light = lightAt(closest.sun.altitude)
  const visible = light !== 'night' || landmark.kind === 'city'
  const closeness = 0.4 + 0.6 * (1 - closestKm / landmark.visibleKm)
  const dimming = light === 'twilight' && landmark.kind !== 'city' ? TWILIGHT_DIMMING : 1
  const score = visible && side !== 'overhead' ? landmark.weight * closeness * dimming : 0

  return { landmark, side, distanceKm: closestKm, minutesAfterTakeoff: closest.minutes, light, visible, score }
}

function skyEvents(moments: Moment[]): SkyEvent[] {
  const events: SkyEvent[] = []

  const glow = moments.filter(m => m.sun.altitude > -6 && m.sun.altitude < GLOW_MAX_ALTITUDE)
  if (glow.length > 0) {
    const mid = glow[Math.floor(glow.length / 2)]
    const relative = relativeBearing(mid.heading, mid.sun.bearing)
    if (!isInline(relative)) {
      events.push({
        kind: mid.sun.bearing < 180 ? 'sunrise' : 'sunset',
        side: sideOf(relative),
        minutesAfterTakeoff: mid.minutes,
        score: GLOW_SCORE,
      })
    }
  }

  const farNorthAtNight = moments.filter(m => lightAt(m.sun.altitude) === 'night' && m.point.lat >= AURORA_MIN_LATITUDE)
  if (farNorthAtNight.length > 0) {
    const northmost = farNorthAtNight.reduce((a, b) => (b.point.lat > a.point.lat ? b : a))
    const relative = relativeBearing(northmost.heading, 0)
    if (!isInline(relative)) {
      events.push({ kind: 'aurora', side: sideOf(relative), minutesAfterTakeoff: northmost.minutes, score: AURORA_SCORE })
    }
  }

  return events
}

function sunSide(moments: Moment[]): Side | null {
  let left = 0
  let right = 0
  for (const m of moments) {
    if (m.sun.altitude < GLOW_MAX_ALTITUDE) continue
    const relative = relativeBearing(m.heading, m.sun.bearing)
    if (isInline(relative)) continue
    if (relative > 0) right++
    else left++
  }
  if (left === right) return null
  return right > left ? 'right' : 'left'
}

export function recommend({ from, to, departUtc }: FlightInput, landmarks: Landmark[]): Recommendation {
  const km = distanceKm(from, to)
  const durationMin = flightMinutes(km)
  const segments = Math.max(20, Math.ceil(km / SAMPLE_SPACING_KM))

  const moments: Moment[] = samplePath(from, to, segments).map(sample => {
    const minutes = sample.fraction * durationMin
    const sun = sunPosition(new Date(departUtc.getTime() + minutes * 60_000), sample.point)
    return { ...sample, minutes, sun }
  })

  const sightings = landmarks
    .map(landmark => sightingFor(landmark, moments))
    .filter((s): s is Sighting => s !== null)
    .sort((a, b) => a.minutesAfterTakeoff - b.minutesAfterTakeoff)
  const sky = skyEvents(moments)

  const total = (side: Side) =>
    sightings.filter(s => s.side === side).reduce((sum, s) => sum + s.score, 0) +
    sky.filter(e => e.side === side).reduce((sum, e) => sum + e.score, 0)
  const leftScore = total('left')
  const rightScore = total('right')
  const best = Math.max(leftScore, rightScore)
  const tossUp = best === 0 || Math.abs(leftScore - rightScore) / best < TOSS_UP_MARGIN

  return {
    side: tossUp ? 'either' : leftScore > rightScore ? 'left' : 'right',
    leftScore,
    rightScore,
    distanceKm: km,
    durationMin,
    sightings,
    sky,
    sunSide: sunSide(moments),
  }
}
