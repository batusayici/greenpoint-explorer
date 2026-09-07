// Track V — turn an iCalendar (.ics) feed into the same line-oriented text the
// rest of the ingest snapshots and diffs.
//
// Added 2026-09-07. The family/kids source audit found two real Greenpoint
// calendars the roster could not read at all: St. Stanislaus Kostka Academy's
// public Google Calendar (3,281 events) and Greenpoint Reformed Church's
// (1,586, of which 237 carry an RRULE). Both are the parish and church
// programming that a Polish-heritage neighborhood actually runs, and the only
// thing standing between them and the map was that `feed` throws on anything
// without <item>/<entry> elements.
//
// TWO PROPERTIES DO ALL THE WORK HERE, and both are about volume rather than
// parsing. A calendar like this is 99% history and internal housekeeping:
// windowing to the next N days takes St. Stans from 3,281 events to a handful,
// and `exclude` drops the i-Ready assessments and dress-down days that are real
// entries but not neighborhood supply. Without both, the snapshot is a decade
// of dismissal times, no run can read it, and the diff churns forever.
//
// Kept pure and separate from fetch-sources.mjs for the same reason
// sourceJson.js is: date handling and recurrence are exactly the kind of thing
// that degrades a snapshot silently rather than loudly.
import { htmlToText } from "./sourceText.js";

// RFC 5545 folds long lines at 75 octets, continuing with a leading space or
// tab. Read literally, a wrapped SUMMARY arrives cut in half — and since a
// card's sourceQuote is checked character-for-character against the snapshot,
// that would make honest quotes unverifiable.
export function unfoldIcs(raw) {
  const out = [];
  for (const line of String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
    if (/^[ \t]/.test(line) && out.length) out[out.length - 1] += line.slice(1);
    else if (line.length) out.push(line);
  }
  return out;
}

// Property values escape , ; and newlines. Newlines flatten to a space so the
// block stays one field per line and the line-based diff stays readable — the
// same choice sourceJson.js makes for HTML values.
// Values routinely carry HTML — Greenpoint Reformed Church wraps every
// description in <html-blob> and uses entities — so flatten it the way
// sourceJson.js does rather than leaving markup a card's quote must match.
const unescapeText = (v) =>
  htmlToText(v.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1"))
    .replace(/\s+/g, " ")
    .trim();

const splitProp = (line) => {
  const i = line.indexOf(":");
  if (i < 0) return null;
  return { key: line.slice(0, i), value: line.slice(i + 1) };
};
const propName = (key) => key.split(";")[0].toUpperCase();

// The three shapes these calendars emit: a UTC instant (…Z), a floating local
// time with a TZID, and a bare VALUE=DATE with no clock at all. The last one
// matters: an all-day entry given midnight UTC lands on the previous evening in
// New York, which is how a date silently moves a day.
export function parseIcsDate(key, value) {
  const v = String(value).trim();
  const dateOnly = /VALUE=DATE\b/i.test(key) || /^\d{8}$/.test(v);
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, hh = "00", mm = "00", ss = "00", z] = m;
  let ms;
  if (dateOnly || z) {
    ms = Date.UTC(+y, +mo - 1, +d, +hh, +mm, +ss);
  } else {
    // TZID (or a floating time). These calendars are Google exports and the
    // only zone they use for Greenpoint programming is America/New_York, so
    // resolve against it rather than pretending a floating time is UTC.
    const tzid = (key.match(/TZID=([^;:]+)/i) || [])[1] || "America/New_York";
    ms = zonedToUtcMs(+y, +mo - 1, +d, +hh, +mm, +ss, tzid);
  }
  const dt = new Date(ms);
  if (Number.isNaN(dt.getTime())) return null;
  dt.dateOnly = dateOnly;
  return dt;
}

// Resolve a wall-clock time in a named zone to a UTC instant, without pulling
// in a date library: guess UTC, ask Intl what that instant reads as in the
// zone, and correct by the difference. Two passes settle DST boundaries.
function zonedToUtcMs(y, mo, d, hh, mm, ss, tzid) {
  let guess = Date.UTC(y, mo, d, hh, mm, ss);
  for (let i = 0; i < 2; i++) {
    const seen = wallClockInZone(new Date(guess), tzid);
    const want = Date.UTC(y, mo, d, hh, mm, ss);
    const diff = want - seen;
    if (!diff) break;
    guess += diff;
  }
  return guess;
}

function wallClockInZone(date, tzid) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tzid,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(date);
  } catch {
    return date.getTime(); // unknown TZID — treat the value as already UTC
  }
  const get = (t) => Number(parts.find((p) => p.type === t)?.value);
  const hour = get("hour") === 24 ? 0 : get("hour");
  return Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));
}

const DAY_MS = 86400000;
const BYDAY = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

// Expand an RRULE to its occurrences INSIDE [from, to) only. The window is the
// bound, so an endless or malformed rule costs a bounded walk rather than
// spinning — `expandRecurrence` is tested against FREQ=DAILY from 2020 for
// exactly that reason. Supports the shapes these two calendars use: DAILY,
// WEEKLY (with BYDAY), MONTHLY and YEARLY, plus INTERVAL, COUNT and UNTIL.
export function expandRecurrence(start, rrule, exdates, from, to) {
  const rule = Object.fromEntries(
    String(rrule)
      .split(";")
      .map((p) => p.split("="))
      .filter((p) => p.length === 2)
      .map(([k, v]) => [k.toUpperCase(), v]),
  );
  const freq = (rule.FREQ || "").toUpperCase();
  const interval = Math.max(1, Number(rule.INTERVAL) || 1);
  const count = Number(rule.COUNT) || Infinity;
  const until = rule.UNTIL ? parseIcsDate("UNTIL", rule.UNTIL) : null;
  const days = rule.BYDAY ? rule.BYDAY.split(",").map((d) => BYDAY[d.slice(-2).toUpperCase()]).filter((n) => n != null) : [];
  const skip = new Set(exdates.map((d) => d.getTime()));

  const out = [];
  let emitted = 0;
  // A hard ceiling on iterations as well as on dates: whichever comes first.
  const MAX_STEPS = 5000;
  let cursor = new Date(start.getTime());
  const clockMs = start.getTime() - Date.UTC(
    start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(),
  );

  const push = (t) => {
    if (t >= from.getTime() && t < to.getTime() && !skip.has(t)) out.push(new Date(t));
  };

  for (let step = 0; step < MAX_STEPS && emitted < count; step++) {
    if (until && cursor.getTime() > until.getTime()) break;
    if (cursor.getTime() >= to.getTime()) break;

    if (freq === "WEEKLY" && days.length) {
      // Walk the week this cursor sits in and emit each named day.
      const weekStart = cursor.getTime() - cursor.getUTCDay() * DAY_MS;
      for (const dow of days) {
        const t = weekStart + dow * DAY_MS;
        if (t < start.getTime()) continue;
        if (until && t > until.getTime()) continue;
        if (emitted >= count) break;
        emitted++;
        push(t);
      }
      cursor = new Date(cursor.getTime() + 7 * interval * DAY_MS);
      continue;
    }

    emitted++;
    push(cursor.getTime());
    if (freq === "DAILY") cursor = new Date(cursor.getTime() + interval * DAY_MS);
    else if (freq === "WEEKLY") cursor = new Date(cursor.getTime() + 7 * interval * DAY_MS);
    else if (freq === "MONTHLY" || freq === "YEARLY") {
      const d = new Date(cursor.getTime());
      const base = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      const next = new Date(base);
      if (freq === "MONTHLY") next.setUTCMonth(next.getUTCMonth() + interval);
      else next.setUTCFullYear(next.getUTCFullYear() + interval);
      cursor = new Date(next.getTime() + clockMs);
    } else break; // unknown FREQ — the seed occurrence above is all we can honestly claim
  }
  return out.sort((a, b) => a - b);
}

// An all-day entry has no clock, and inventing one moves the date: midnight
// UTC is the previous evening in New York. Emit the bare date instead — the
// same honesty the card model's allDay flag exists for.
const render = (d, dateOnly) => (dateOnly ? d.toISOString().slice(0, 10) : d.toISOString());

const FIELDS = ["SUMMARY", "DTSTART", "DTEND", "LOCATION", "DESCRIPTION", "STATUS", "RRULE"];

// `cfg`: { windowDays = 21, include: [...], exclude: [...], fields: [...] }
// `now` is injectable so the tests do not drift with the wall clock.
export function icsToText(raw, cfg = {}, now = new Date()) {
  const lines = unfoldIcs(raw);
  const windowDays = Number.isFinite(cfg.windowDays) ? cfg.windowDays : 21;
  const from = new Date(now.getTime());
  const to = new Date(now.getTime() + windowDays * DAY_MS);
  const fields = cfg.fields?.length ? cfg.fields.map((f) => f.toUpperCase()) : FIELDS;
  const include = (cfg.include ?? []).map((s) => s.toLowerCase());
  const exclude = (cfg.exclude ?? []).map((s) => s.toLowerCase());

  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = { props: {}, exdates: [] }; continue; }
    if (line === "END:VEVENT") { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const p = splitProp(line);
    if (!p) continue;
    const name = propName(p.key);
    if (name === "EXDATE") {
      for (const v of p.value.split(",")) {
        const d = parseIcsDate(p.key, v);
        if (d) cur.exdates.push(d);
      }
      continue;
    }
    // First wins: a repeated property (Google emits DTSTAMP twice on occasion)
    // must not silently overwrite the value the event actually starts at.
    if (cur.props[name] === undefined) cur.props[name] = { key: p.key, value: p.value };
  }

  const rows = [];
  for (const ev of events) {
    const summary = ev.props.SUMMARY ? unescapeText(ev.props.SUMMARY.value) : "";
    const hay = summary.toLowerCase();
    if (include.length && !include.some((s) => hay.includes(s))) continue;
    if (exclude.length && exclude.some((s) => hay.includes(s))) continue;

    const dtstartProp = ev.props.DTSTART;
    if (!dtstartProp) continue;
    const start = parseIcsDate(dtstartProp.key, dtstartProp.value);
    if (!start) continue;
    const end = ev.props.DTEND ? parseIcsDate(ev.props.DTEND.key, ev.props.DTEND.value) : null;
    const durationMs = end ? end.getTime() - start.getTime() : 0;

    const starts = ev.props.RRULE
      ? expandRecurrence(start, ev.props.RRULE.value, ev.exdates, from, to)
      : start.getTime() >= from.getTime() && start.getTime() < to.getTime()
        ? [start]
        : [];

    for (const s of starts) {
      const out = [];
      for (const f of fields) {
        if (f === "DTSTART") { out.push(`DTSTART: ${render(s, start.dateOnly)}`); continue; }
        if (f === "DTEND") {
          if (end) out.push(`DTEND: ${render(new Date(s.getTime() + durationMs), end.dateOnly)}`);
          continue;
        }
        const prop = ev.props[f];
        if (!prop) continue;
        const val = f === "RRULE" ? prop.value : unescapeText(prop.value);
        if (val) out.push(`${f}: ${val}`);
      }
      rows.push({ t: s.getTime(), text: out.join("\n") });
    }
  }
  // Google exports in creation order, not date order. Sorting keeps the
  // snapshot stable across exports so the diff reports real change only.
  rows.sort((a, b) => a.t - b.t);
  return rows.map((r) => r.text).join("\n\n");
}
