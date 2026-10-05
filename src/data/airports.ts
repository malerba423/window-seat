import type { Airport } from '../core/types'

const PACIFIC = 'America/Los_Angeles'
const ALASKA = 'America/Anchorage'
const MOUNTAIN = 'America/Denver'
const CENTRAL = 'America/Chicago'
const EASTERN = 'America/New_York'
const HAWAII = 'Pacific/Honolulu'

export const airports: Airport[] = [
  { code: 'SEA', city: 'Seattle', lat: 47.4502, lon: -122.3088, tz: PACIFIC },
  { code: 'PAE', city: 'Everett', lat: 47.9063, lon: -122.2816, tz: PACIFIC },
  { code: 'BLI', city: 'Bellingham', lat: 48.7927, lon: -122.5375, tz: PACIFIC },
  { code: 'GEG', city: 'Spokane', lat: 47.6199, lon: -117.5338, tz: PACIFIC },
  { code: 'PDX', city: 'Portland', lat: 45.5898, lon: -122.5951, tz: PACIFIC },
  { code: 'RDM', city: 'Redmond / Bend', lat: 44.2541, lon: -121.15, tz: PACIFIC },
  { code: 'SMF', city: 'Sacramento', lat: 38.6954, lon: -121.5908, tz: PACIFIC },
  { code: 'SFO', city: 'San Francisco', lat: 37.6213, lon: -122.379, tz: PACIFIC },
  { code: 'SJC', city: 'San Jose', lat: 37.3639, lon: -121.9289, tz: PACIFIC },
  { code: 'LAX', city: 'Los Angeles', lat: 33.9416, lon: -118.4085, tz: PACIFIC },
  { code: 'PSP', city: 'Palm Springs', lat: 33.8303, lon: -116.5067, tz: PACIFIC },
  { code: 'SAN', city: 'San Diego', lat: 32.7338, lon: -117.1933, tz: PACIFIC },
  { code: 'LAS', city: 'Las Vegas', lat: 36.084, lon: -115.1537, tz: PACIFIC },

  { code: 'ANC', city: 'Anchorage', lat: 61.1743, lon: -149.9982, tz: ALASKA },
  { code: 'FAI', city: 'Fairbanks', lat: 64.8151, lon: -147.8561, tz: ALASKA },
  { code: 'JNU', city: 'Juneau', lat: 58.355, lon: -134.5763, tz: ALASKA },
  { code: 'SIT', city: 'Sitka', lat: 57.0471, lon: -135.3616, tz: ALASKA },
  { code: 'KTN', city: 'Ketchikan', lat: 55.3556, lon: -131.7137, tz: ALASKA },

  { code: 'HNL', city: 'Honolulu', lat: 21.3187, lon: -157.9225, tz: HAWAII },
  { code: 'OGG', city: 'Kahului, Maui', lat: 20.8986, lon: -156.4305, tz: HAWAII },
  { code: 'KOA', city: 'Kona', lat: 19.7388, lon: -156.0456, tz: HAWAII },
  { code: 'ITO', city: 'Hilo', lat: 19.7203, lon: -155.0485, tz: HAWAII },
  { code: 'LIH', city: 'Lihue, Kauai', lat: 21.976, lon: -159.339, tz: HAWAII },

  { code: 'BOI', city: 'Boise', lat: 43.5644, lon: -116.2228, tz: 'America/Boise' },
  { code: 'MSO', city: 'Missoula', lat: 46.9163, lon: -114.0906, tz: MOUNTAIN },
  { code: 'BZN', city: 'Bozeman', lat: 45.7775, lon: -111.153, tz: MOUNTAIN },
  { code: 'SLC', city: 'Salt Lake City', lat: 40.7899, lon: -111.9791, tz: MOUNTAIN },
  { code: 'DEN', city: 'Denver', lat: 39.8561, lon: -104.6737, tz: MOUNTAIN },
  { code: 'PHX', city: 'Phoenix', lat: 33.4342, lon: -112.0116, tz: 'America/Phoenix' },

  { code: 'DFW', city: 'Dallas', lat: 32.8998, lon: -97.0403, tz: CENTRAL },
  { code: 'ORD', city: 'Chicago', lat: 41.9742, lon: -87.9073, tz: CENTRAL },
  { code: 'JFK', city: 'New York', lat: 40.6413, lon: -73.7781, tz: EASTERN },
  { code: 'BOS', city: 'Boston', lat: 42.3656, lon: -71.0096, tz: EASTERN },
  { code: 'DCA', city: 'Washington, D.C.', lat: 38.8512, lon: -77.0402, tz: EASTERN },
  { code: 'MCO', city: 'Orlando', lat: 28.4312, lon: -81.3081, tz: EASTERN },
]

export const airportByCode = (code: string): Airport => {
  const airport = airports.find(a => a.code === code)
  if (!airport) throw new Error(`Unknown airport code "${code}"`)
  return airport
}
