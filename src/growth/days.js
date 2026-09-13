// New York calendar days, computed in JS rather than in the query.
//
// The product is a New York product and its busiest hours are 8pm–midnight
// local, which in UTC belong to the next day. HogQL's `toDate(timestamp)`
// resolves in the PostHog project's timezone, which is UTC here: measured
// 2026-09-13, 54 people it bucketed into Sep 12 were Sep 11 in New York and 46
// it bucketed into Sep 13 were Sep 12. Every daily figure this project reported
// before that carried the shift.
//
// The fix is not a smarter query. Day arithmetic lives here, in JS, because
// `npm test` can reach it and cannot reach ClickHouse — so a regression fails a
// test instead of moving a number nobody re-derives.

export const ZONE = "America/New_York";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// An ISO instant (or Date) → the New York calendar day it falls on, YYYY-MM-DD.
export function nyDay(instant) {
  const d = instant instanceof Date ? instant : new Date(instant);
  if (Number.isNaN(d.getTime())) throw new TypeError(`not a date: ${instant}`);
  return dayFormatter.format(d);
}

// The UTC instant at which a New York calendar day begins. Used for query
// bounds, so a run at 9am and a rerun at 6pm cover exactly the same events.
// Offsets are found by probing rather than hardcoded, so DST needs no table.
export function nyDayStart(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new TypeError(`not a day: ${day}`);
  // Midnight NY is 04:00 or 05:00 UTC. Try both and keep the one that lands on
  // the right local day; the earlier candidate wins on the autumn repeat.
  for (const offsetHours of [4, 5]) {
    const candidate = new Date(`${day}T${String(offsetHours).padStart(2, "0")}:00:00Z`);
    if (nyDay(candidate) === day && nyDay(new Date(candidate.getTime() - 1)) !== day) {
      return candidate;
    }
  }
  throw new Error(`could not locate midnight for ${day}`);
}

export function nextDay(day) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Same weekday a week back. Trends compare like to like: the feed sawtooths
// (freshness-history.json says so) and so does traffic — the biggest day on
// record, 2026-09-12, was a Saturday. Day-over-day mostly measures the weekday.
export function sameWeekdayBefore(day, weeks = 1) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 7 * weeks);
  return d.toISOString().slice(0, 10);
}

// Today in New York, for a process that may be running under any TZ — the cloud
// routine runs UTC, `npm test` is pinned to New York, Batu's machine is local.
export function todayNY(now = new Date()) {
  return nyDay(now);
}

// The first day of a trailing window ending on `day`, inclusive both ends.
// windowDays = 7 ending 2026-09-13 starts on 2026-09-07.
export function windowStart(day, windowDays) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (windowDays - 1));
  return d.toISOString().slice(0, 10);
}
