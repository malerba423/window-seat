import { useMemo, useState } from 'react'
import { recommend } from './core/recommend'
import { zonedTimeToUtc } from './core/time'
import type { Recommendation, Side, Sighting, SkyEvent } from './core/types'
import { airportByCode, airports } from './data/airports'
import { landmarks } from './data/landmarks'

const KM_TO_MILES = 0.621371

const sideName: Record<Side, string> = { left: 'left', right: 'right' }
const seatHint: Record<Side, string> = {
  left: 'Window seat A',
  right: 'The last letter in your row (F on a 737)',
}
const skyLabel: Record<SkyEvent['kind'], string> = {
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  aurora: 'Northern lights, if they are out',
}

function tomorrowAt(hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:00`
}

function afterTakeoff(minutes: number): string {
  const total = Math.round(minutes)
  if (total < 60) return `${total} min`
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, '0')} min`
}

type TimelineItem =
  | { at: number; kind: 'landmark'; sighting: Sighting }
  | { at: number; kind: 'sky'; event: SkyEvent }

function timeline(rec: Recommendation): TimelineItem[] {
  return [
    ...rec.sightings.map(s => ({ at: s.minutesAfterTakeoff, kind: 'landmark' as const, sighting: s })),
    ...rec.sky.map(e => ({ at: e.minutesAfterTakeoff, kind: 'sky' as const, event: e })),
  ].sort((a, b) => a.at - b.at)
}

function SideBadge({ side }: { side: Side | 'overhead' }) {
  if (side === 'overhead') return <span className="badge badge--none">in line with the flight</span>
  return <span className={`badge badge--${side}`}>{sideName[side]}</span>
}

function Verdict({ rec }: { rec: Recommendation }) {
  const best = Math.max(rec.leftScore, rec.rightScore) || 1
  return (
    <section className="verdict">
      <p className="eyebrow">Best view</p>
      {rec.side === 'either' ? (
        <>
          <h2>Either side</h2>
          <p className="hint">
            {rec.leftScore + rec.rightScore === 0
              ? 'Nothing on this route favors one side at that time.'
              : 'Both sides are about as good on this route.'}
          </p>
        </>
      ) : (
        <>
          <h2>Sit on the {sideName[rec.side]}</h2>
          <p className="hint">{seatHint[rec.side]}</p>
        </>
      )}
      <div className="bars" aria-hidden="true">
        {(['left', 'right'] as const).map(side => (
          <div className="bar" key={side}>
            <span className="bar__label">{sideName[side]}</span>
            <span className="bar__track">
              <span className={`bar__fill bar__fill--${side}`} style={{ width: `${(rec[`${side}Score`] / best) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
      <p className="meta">
        {Math.round(rec.distanceKm * KM_TO_MILES).toLocaleString()} miles · about {afterTakeoff(rec.durationMin)} in the air
        {rec.sunSide && ` · sun mostly on the ${sideName[rec.sunSide]}`}
      </p>
    </section>
  )
}

export default function App() {
  const [from, setFrom] = useState('SEA')
  const [to, setTo] = useState('ANC')
  const [depart, setDepart] = useState(() => tomorrowAt(10))

  const rec = useMemo(() => {
    if (from === to || !depart) return null
    const origin = airportByCode(from)
    return recommend({ from: origin, to: airportByCode(to), departUtc: zonedTimeToUtc(depart, origin.tz) }, landmarks)
  }, [from, to, depart])

  const items = rec ? timeline(rec) : []

  return (
    <main className="page">
      <header className="masthead">
        <h1>Which Side of the Plane?</h1>
        <p>Which side of the plane has the view? Pick a flight and find out what you will pass.</p>
      </header>

      <form className="flight" onSubmit={e => e.preventDefault()}>
        <label>
          From
          <select value={from} onChange={e => setFrom(e.target.value)}>
            {airports.map(a => <option key={a.code} value={a.code}>{a.code} · {a.city}</option>)}
          </select>
        </label>
        <button
          type="button"
          className="swap"
          onClick={() => { setFrom(to); setTo(from) }}
          aria-label="Swap origin and destination"
        >
          ⇄
        </button>
        <label>
          To
          <select value={to} onChange={e => setTo(e.target.value)}>
            {airports.map(a => <option key={a.code} value={a.code}>{a.code} · {a.city}</option>)}
          </select>
        </label>
        <label>
          Departs (local time)
          <input type="datetime-local" value={depart} onChange={e => setDepart(e.target.value)} />
        </label>
      </form>

      {!rec && <p className="empty">Choose two different airports and a departure time.</p>}

      {rec && <Verdict rec={rec} />}

      {rec && (
        <section className="timeline">
          <h3>What you will pass</h3>
          {items.length === 0 && <p className="empty">No landmarks from the list are close to this route.</p>}
          <ol>
            {items.map(item =>
              item.kind === 'sky' ? (
                <li key={item.event.kind} className="stop stop--sky">
                  <span className="stop__time">{afterTakeoff(item.at)}</span>
                  <span className="stop__name">{skyLabel[item.event.kind]}</span>
                  <SideBadge side={item.event.side} />
                </li>
              ) : (
                <li key={item.sighting.landmark.id} className={`stop${item.sighting.visible ? '' : ' stop--dark'}`}>
                  <span className="stop__time">{afterTakeoff(item.at)}</span>
                  <span className="stop__name">
                    {item.sighting.landmark.name}
                    <small>
                      {Math.round(item.sighting.distanceKm * KM_TO_MILES)} miles away
                      {!item.sighting.visible && ' · too dark to see'}
                      {item.sighting.visible && item.sighting.light === 'night' && ' · city lights'}
                    </small>
                  </span>
                  <SideBadge side={item.sighting.side} />
                </li>
              ),
            )}
          </ol>
        </section>
      )}

      <footer className="fine-print">
        <p>
          Times are minutes after takeoff. Results assume the direct path between the two airports; real flights bend
          for weather, traffic and runway direction, and clouds are not forecast.
        </p>
        <p>An unofficial fan project, not affiliated with any airline.</p>
      </footer>
    </main>
  )
}
