/** How far ahead of UTC a time zone is at a given instant, in ms. */
function zoneOffsetMs(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs))
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value)
  const wall = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return wall - Math.floor(utcMs / 1000) * 1000
}

/** Interprets a 'YYYY-MM-DDTHH:mm' wall-clock time in the given IANA zone. */
export function zonedTimeToUtc(local: string, tz: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local)
  if (!m) throw new Error(`Expected a date and time like 2026-07-01T12:00, got "${local}"`)
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])
  // Second pass corrects the guess when the first one lands on the other side of a DST change.
  const guess = wall - zoneOffsetMs(wall, tz)
  return new Date(wall - zoneOffsetMs(guess, tz))
}
