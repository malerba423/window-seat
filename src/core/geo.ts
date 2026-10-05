import type { LatLon } from './types'

const EARTH_RADIUS_KM = 6371

export const toRad = (deg: number) => (deg * Math.PI) / 180
export const toDeg = (rad: number) => (rad * 180) / Math.PI

/** Great-circle distance (haversine). */
export function distanceKm(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/** Initial compass bearing from a to b, 0–360 with 0 = north. */
export function bearingDeg(a: LatLon, b: LatLon): number {
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const dLon = toRad(b.lon - a.lon)
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/** Point a given fraction of the way along the great circle from a to b. */
export function intermediatePoint(a: LatLon, b: LatLon, fraction: number): LatLon {
  const delta = distanceKm(a, b) / EARTH_RADIUS_KM
  if (delta === 0) return { ...a }
  const lat1 = toRad(a.lat)
  const lon1 = toRad(a.lon)
  const lat2 = toRad(b.lat)
  const lon2 = toRad(b.lon)
  const A = Math.sin((1 - fraction) * delta) / Math.sin(delta)
  const B = Math.sin(fraction * delta) / Math.sin(delta)
  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
  const z = A * Math.sin(lat1) + B * Math.sin(lat2)
  return { lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), lon: toDeg(Math.atan2(y, x)) }
}

/** Where a bearing sits relative to a heading: positive = to the right, negative = to the left, range (-180, 180]. */
export function relativeBearing(heading: number, bearing: number): number {
  let diff = (bearing - heading) % 360
  if (diff > 180) diff -= 360
  if (diff <= -180) diff += 360
  return diff
}

export interface PathSample {
  point: LatLon
  /** 0 at the origin, 1 at the destination. */
  fraction: number
  /** Direction of travel at this point. */
  heading: number
}

/** Evenly spaced points along the great circle from a to b, including both ends. */
export function samplePath(a: LatLon, b: LatLon, segments: number): PathSample[] {
  const samples: PathSample[] = []
  for (let i = 0; i <= segments; i++) {
    const fraction = i / segments
    const point = intermediatePoint(a, b, fraction)
    const heading = i < segments ? bearingDeg(point, b) : samples[i - 1].heading
    samples.push({ point, fraction, heading })
  }
  return samples
}
