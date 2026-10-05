import SunCalc from 'suncalc'
import { toDeg } from './geo'
import type { LatLon, Light } from './types'

export interface SunPosition {
  /** Compass bearing to the sun, 0–360 with 0 = north. */
  bearing: number
  /** Degrees above the horizon; negative when the sun is down. */
  altitude: number
}

export function sunPosition(date: Date, at: LatLon): SunPosition {
  // SunCalc measures azimuth from south, turning west.
  const { azimuth, altitude } = SunCalc.getPosition(date, at.lat, at.lon)
  return { bearing: (toDeg(azimuth) + 180 + 360) % 360, altitude: toDeg(altitude) }
}

/** Civil twilight ends when the sun is 6° below the horizon. */
export function lightAt(sunAltitude: number): Light {
  if (sunAltitude > 0) return 'day'
  return sunAltitude > -6 ? 'twilight' : 'night'
}
