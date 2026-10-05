export interface LatLon {
  lat: number
  lon: number
}

export interface Airport extends LatLon {
  code: string
  city: string
  /** IANA time zone, used to read the departure time as local time at the origin. */
  tz: string
}

export type LandmarkKind = 'mountain' | 'water' | 'canyon' | 'coast' | 'city'

export interface Landmark extends LatLon {
  id: string
  name: string
  region: string
  kind: LandmarkKind
  /** How far away, in km, this is still worth looking for from cruise altitude. */
  visibleKm: number
  /** 1 = nice to see, 3 = worth choosing a seat for. */
  weight: 1 | 2 | 3
}

export type Side = 'left' | 'right'
export type Light = 'day' | 'twilight' | 'night'

export interface Sighting {
  landmark: Landmark
  /** 'overhead' means too close to the flight path to favor either side. */
  side: Side | 'overhead'
  distanceKm: number
  minutesAfterTakeoff: number
  light: Light
  /** False when it is too dark to see this landmark. */
  visible: boolean
  score: number
}

export interface SkyEvent {
  kind: 'sunrise' | 'sunset' | 'aurora'
  side: Side
  minutesAfterTakeoff: number
  score: number
}

export interface Recommendation {
  side: Side | 'either'
  leftScore: number
  rightScore: number
  distanceKm: number
  durationMin: number
  /** Ordered by when they come into view. */
  sightings: Sighting[]
  sky: SkyEvent[]
  /** Side the sun is on for most of the daylight part of the flight, if any. */
  sunSide: Side | null
}
