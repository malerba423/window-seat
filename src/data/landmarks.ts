import type { Landmark } from '../core/types'

// Hand-picked for being recognisable from a window seat. visibleKm is a judgment call:
// big, isolated peaks carry a long way; a city skyline or a single crater does not.
export const landmarks: Landmark[] = [
  // Cascades and Washington
  { id: 'rainier', name: 'Mount Rainier', region: 'Cascades', kind: 'mountain', lat: 46.8523, lon: -121.7603, visibleKm: 160, weight: 3 },
  { id: 'st-helens', name: 'Mount St. Helens', region: 'Cascades', kind: 'mountain', lat: 46.1914, lon: -122.1956, visibleKm: 110, weight: 3 },
  { id: 'adams', name: 'Mount Adams', region: 'Cascades', kind: 'mountain', lat: 46.2024, lon: -121.4909, visibleKm: 120, weight: 2 },
  { id: 'baker', name: 'Mount Baker', region: 'Cascades', kind: 'mountain', lat: 48.7768, lon: -121.8145, visibleKm: 120, weight: 2 },
  { id: 'glacier-peak', name: 'Glacier Peak', region: 'Cascades', kind: 'mountain', lat: 48.1125, lon: -121.1139, visibleKm: 90, weight: 1 },
  { id: 'olympics', name: 'Olympic Mountains', region: 'Washington', kind: 'mountain', lat: 47.8013, lon: -123.7108, visibleKm: 110, weight: 2 },
  { id: 'san-juans', name: 'San Juan Islands', region: 'Washington', kind: 'water', lat: 48.55, lon: -123.03, visibleKm: 60, weight: 1 },
  { id: 'hood', name: 'Mount Hood', region: 'Cascades', kind: 'mountain', lat: 45.3736, lon: -121.696, visibleKm: 130, weight: 3 },
  { id: 'jefferson', name: 'Mount Jefferson', region: 'Cascades', kind: 'mountain', lat: 44.6743, lon: -121.7996, visibleKm: 100, weight: 2 },
  { id: 'three-sisters', name: 'Three Sisters', region: 'Cascades', kind: 'mountain', lat: 44.1034, lon: -121.7692, visibleKm: 100, weight: 2 },
  { id: 'crater-lake', name: 'Crater Lake', region: 'Cascades', kind: 'water', lat: 42.9446, lon: -122.109, visibleKm: 80, weight: 3 },
  { id: 'shasta', name: 'Mount Shasta', region: 'Cascades', kind: 'mountain', lat: 41.4092, lon: -122.1949, visibleKm: 150, weight: 3 },
  { id: 'lassen', name: 'Lassen Peak', region: 'Cascades', kind: 'mountain', lat: 40.4882, lon: -121.5049, visibleKm: 90, weight: 1 },

  // Alaska
  { id: 'denali', name: 'Denali', region: 'Alaska', kind: 'mountain', lat: 63.0692, lon: -151.007, visibleKm: 250, weight: 3 },
  { id: 'redoubt', name: 'Mount Redoubt', region: 'Alaska', kind: 'mountain', lat: 60.4852, lon: -152.7438, visibleKm: 130, weight: 2 },
  { id: 'prince-william-sound', name: 'Prince William Sound', region: 'Alaska', kind: 'water', lat: 61.14, lon: -147.08, visibleKm: 90, weight: 2 },
  { id: 'wrangell', name: 'Wrangell Mountains', region: 'Alaska', kind: 'mountain', lat: 62.0059, lon: -144.0187, visibleKm: 150, weight: 2 },
  { id: 'st-elias', name: 'Mount Saint Elias', region: 'Alaska', kind: 'mountain', lat: 60.2931, lon: -140.9264, visibleKm: 180, weight: 3 },
  { id: 'malaspina', name: 'Malaspina Glacier', region: 'Alaska', kind: 'coast', lat: 59.92, lon: -140.53, visibleKm: 100, weight: 2 },
  { id: 'fairweather', name: 'Mount Fairweather and Glacier Bay', region: 'Alaska', kind: 'mountain', lat: 58.9064, lon: -137.5265, visibleKm: 130, weight: 2 },
  { id: 'juneau-icefield', name: 'Juneau Icefield', region: 'Alaska', kind: 'mountain', lat: 58.75, lon: -134.2, visibleKm: 80, weight: 2 },
  { id: 'edgecumbe', name: 'Mount Edgecumbe', region: 'Alaska', kind: 'mountain', lat: 57.0509, lon: -135.7611, visibleKm: 80, weight: 1 },
  { id: 'misty-fjords', name: 'Misty Fjords', region: 'Alaska', kind: 'coast', lat: 55.62, lon: -130.61, visibleKm: 70, weight: 1 },

  // California and Nevada
  { id: 'tahoe', name: 'Lake Tahoe', region: 'Sierra Nevada', kind: 'water', lat: 39.0968, lon: -120.0324, visibleKm: 100, weight: 3 },
  { id: 'yosemite', name: 'Yosemite Valley', region: 'Sierra Nevada', kind: 'canyon', lat: 37.7459, lon: -119.5332, visibleKm: 90, weight: 3 },
  { id: 'mono-lake', name: 'Mono Lake', region: 'Sierra Nevada', kind: 'water', lat: 38.0128, lon: -119.0093, visibleKm: 80, weight: 1 },
  { id: 'whitney', name: 'Mount Whitney', region: 'Sierra Nevada', kind: 'mountain', lat: 36.5785, lon: -118.2923, visibleKm: 100, weight: 2 },
  { id: 'death-valley', name: 'Death Valley', region: 'California', kind: 'canyon', lat: 36.5054, lon: -117.0794, visibleKm: 80, weight: 1 },
  { id: 'golden-gate', name: 'San Francisco Bay and the Golden Gate', region: 'California', kind: 'water', lat: 37.8199, lon: -122.4783, visibleKm: 60, weight: 3 },
  { id: 'channel-islands', name: 'Channel Islands', region: 'California', kind: 'coast', lat: 34.0, lon: -119.75, visibleKm: 80, weight: 1 },
  { id: 'lake-mead', name: 'Lake Mead and Hoover Dam', region: 'Nevada', kind: 'water', lat: 36.0161, lon: -114.7377, visibleKm: 60, weight: 1 },

  // Interior West
  { id: 'grand-canyon', name: 'Grand Canyon', region: 'Southwest', kind: 'canyon', lat: 36.1069, lon: -112.1129, visibleKm: 100, weight: 3 },
  { id: 'lake-powell', name: 'Lake Powell', region: 'Southwest', kind: 'water', lat: 37.07, lon: -111.24, visibleKm: 90, weight: 2 },
  { id: 'monument-valley', name: 'Monument Valley', region: 'Southwest', kind: 'canyon', lat: 36.998, lon: -110.0985, visibleKm: 70, weight: 2 },
  { id: 'zion', name: 'Zion Canyon', region: 'Southwest', kind: 'canyon', lat: 37.2982, lon: -113.0263, visibleKm: 70, weight: 1 },
  { id: 'great-salt-lake', name: 'Great Salt Lake', region: 'Rockies', kind: 'water', lat: 41.115, lon: -112.477, visibleKm: 110, weight: 2 },
  { id: 'tetons', name: 'Grand Teton', region: 'Rockies', kind: 'mountain', lat: 43.741, lon: -110.8024, visibleKm: 110, weight: 3 },
  { id: 'yellowstone-lake', name: 'Yellowstone Lake', region: 'Rockies', kind: 'water', lat: 44.4605, lon: -110.3725, visibleKm: 90, weight: 2 },
  { id: 'glacier-np', name: 'Glacier National Park', region: 'Rockies', kind: 'mountain', lat: 48.6967, lon: -113.7183, visibleKm: 100, weight: 2 },
  { id: 'hells-canyon', name: 'Hells Canyon', region: 'Rockies', kind: 'canyon', lat: 45.37, lon: -116.63, visibleKm: 60, weight: 1 },
  { id: 'longs-peak', name: 'Longs Peak and the Front Range', region: 'Rockies', kind: 'mountain', lat: 40.2549, lon: -105.616, visibleKm: 100, weight: 2 },

  // Hawaii
  { id: 'mauna-kea', name: 'Mauna Kea', region: 'Hawaii', kind: 'mountain', lat: 19.8207, lon: -155.4681, visibleKm: 150, weight: 3 },
  { id: 'mauna-loa', name: 'Mauna Loa', region: 'Hawaii', kind: 'mountain', lat: 19.4756, lon: -155.6054, visibleKm: 150, weight: 2 },
  { id: 'kilauea', name: 'Kīlauea', region: 'Hawaii', kind: 'mountain', lat: 19.4069, lon: -155.2834, visibleKm: 70, weight: 2 },
  { id: 'haleakala', name: 'Haleakalā', region: 'Hawaii', kind: 'mountain', lat: 20.7097, lon: -156.2533, visibleKm: 120, weight: 3 },
  { id: 'molokai-cliffs', name: 'Molokai sea cliffs', region: 'Hawaii', kind: 'coast', lat: 21.17, lon: -156.95, visibleKm: 60, weight: 2 },
  { id: 'diamond-head', name: 'Diamond Head', region: 'Hawaii', kind: 'coast', lat: 21.262, lon: -157.8059, visibleKm: 40, weight: 2 },
  { id: 'na-pali', name: 'Nā Pali Coast', region: 'Hawaii', kind: 'coast', lat: 22.17, lon: -159.64, visibleKm: 60, weight: 3 },

  // East
  { id: 'niagara', name: 'Niagara Falls', region: 'East', kind: 'water', lat: 43.0799, lon: -79.0747, visibleKm: 40, weight: 1 },

  // Cities, which are also worth a look after dark
  { id: 'seattle', name: 'Seattle skyline', region: 'Washington', kind: 'city', lat: 47.6062, lon: -122.3321, visibleKm: 50, weight: 2 },
  { id: 'los-angeles', name: 'Los Angeles basin', region: 'California', kind: 'city', lat: 34.0522, lon: -118.2437, visibleKm: 70, weight: 2 },
  { id: 'las-vegas', name: 'Las Vegas Strip', region: 'Nevada', kind: 'city', lat: 36.1147, lon: -115.1728, visibleKm: 60, weight: 2 },
  { id: 'chicago', name: 'Chicago and Lake Michigan', region: 'East', kind: 'city', lat: 41.8781, lon: -87.6298, visibleKm: 60, weight: 2 },
  { id: 'manhattan', name: 'Manhattan', region: 'East', kind: 'city', lat: 40.758, lon: -73.9855, visibleKm: 50, weight: 3 },
]
