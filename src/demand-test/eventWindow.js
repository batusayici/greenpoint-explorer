// Track V — the when-line formatter. One rule: show the date/time once. A card
// summary must not restate what this returns, and this must not repeat a date
// within itself. Sentinels from the card schema: a 00:00 start = "all day from
// this date", a 23:59 end = "through this date" — both render as bare dates so
// no fake clock value (12:00 AM / 11:59 PM) reaches the reader.
import { RECURRENCE_DAYS } from "./cardSchema.js";

const TZ = "America/New_York";
const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: TZ });
const TIME = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const CLOCK = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
const MERIDIEM = new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: true, timeZone: TZ });
// `day: "2-digit"` is load-bearing (2026-08-08): with "numeric" this emitted
// "2026-08-8", which is fine for the === comparisons it was written for but
// sorts AFTER "2026-08-22". The recurrence code below compares these keys with
// < and >, so the padding is what makes that legal.
const DAYKEY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ });

const isStartSentinel = (d) => CLOCK.format(d) === "00:00"; // all-day start
const isEndSentinel = (d) => CLOCK.format(d) === "23:59"; // end-of-day
const meridiem = (d) => MERIDIEM.format(d).replace(/[\d\s]/g, ""); // "AM" | "PM"

// A timed instant as "Jul 9, 7:15 PM"; a sentinel instant as just "Jul 9".
const instant = (d, sentinel) => (sentinel(d) ? DATE.format(d) : `${DATE.format(d)}, ${TIME.format(d)}`);

export function formatWindow(card) {
  const { startsAt, endsAt } = card;
  if (!startsAt && !endsAt) return null;
  const s = startsAt ? new Date(startsAt) : null;
  const e = endsAt ? new Date(endsAt) : null;

  if (s && e && DAYKEY.format(s) === DAYKEY.format(e)) {
    // Same calendar day — never repeat the date.
    if (isStartSentinel(s)) return DATE.format(s);
    if (isEndSentinel(e)) return instant(s, isStartSentinel); // point-in-time start
    // Real start and end times: "Jul 9, 7:15–8:30 PM", sharing the meridiem
    // when both fall in the same half of the day.
    const range =
      meridiem(s) === meridiem(e)
        ? `${TIME.format(s).replace(/\s?[AP]M$/, "")}–${TIME.format(e)}`
        : `${TIME.format(s)}–${TIME.format(e)}`;
    return `${DATE.format(s)}, ${range}`;
  }

  if (s && e) return `${instant(s, isStartSentinel)} → ${instant(e, isEndSentinel)}`;
  if (s) return `From ${instant(s, isStartSentinel)}`;
  return `Through ${instant(e, isEndSentinel)}`;
}

// Span test (2026-07-29 punch list, P1 #3 corollary): the detail's when-line
// only earns its row when the window says something the day header and the
// row's clock can't — a multi-day or open-ended span. A same-day timed card's
// "Jul 29, 7:00 PM" is the third restatement of one fact.
export function isSpan(card) {
  const { startsAt, endsAt } = card;
  if (!startsAt && !endsAt) return false;
  if (!startsAt || !endsAt) return true; // open-ended: "From …" / "Through …"
  return DAYKEY.format(new Date(startsAt)) !== DAYKEY.format(new Date(endsAt));
}

// ── Recurrence (2026-08-08) ───────────────────────────────────────────────
// `recurring: true` carried two meanings at once: a WEEKLY EVENT (Saturday
// sewing camp, Tuesday trivia) and a STANDING OFFER (Pooch's intro groom —
// available whenever they're open, on no particular day). Only the first has
// a day, and nothing in the card said which, so the feed couldn't place a
// weekly event on its calendar day and shelved all of them. That's what hid
// the Saturday kids' events: the day was stated in the kicker prose and
// nowhere a machine could read it.
//
// `recurrence.days` states it. Absent = the standing-offer meaning, and the
// old span-containment behaviour is preserved exactly — so a card without it
// is never silently reinterpreted.
export { RECURRENCE_DAYS };
const DAY_NAMES = {
  sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday",
  thu: "Thursday", fri: "Friday", sat: "Saturday",
};
const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ });

// The NY weekday token for an instant — NY, not local, so a late-evening card
// can't drift a day for a reader in another zone (same rule as DAYKEY above).
const dayTokenOf = (d) => WEEKDAY.format(d).toLowerCase().slice(0, 3);

const statedDays = (card) => {
  const days = card?.recurrence?.days;
  return Array.isArray(days) && days.length > 0 ? days : null;
};

// Does this card happen on `date`? Span containment is the floor in both
// branches: a stated day never reaches outside startsAt…endsAt.
export function occursOn(card, date) {
  const { startsAt, endsAt } = card;
  if (startsAt == null && endsAt == null) return true; // undated: always on
  const day = DAYKEY.format(date);
  if (startsAt != null && DAYKEY.format(new Date(startsAt)) > day) return false;
  if (endsAt != null && DAYKEY.format(new Date(endsAt)) < day) return false;
  const days = statedDays(card);
  return days ? days.includes(dayTokenOf(date)) : true;
}

// ── The occurrence clock (2026-08-08) ─────────────────────────────────────
// Batu on stoopwise.com at 7:37pm: the Today group led with the McCarren
// Greenmarket (Saturdays 8am–3pm), the McGolrick bird club (9–10am) and the
// Bandit run (9:30–11am) — three things that had finished that morning. A
// weekly card's `endsAt` is the end of its SPAN (Aug 29), not of any one
// sitting, so isExpiredCard — which reads endsAt — can never retire today's
// occurrence, and occursOn compares calendar days only. The sitting's real
// window is the TIME OF DAY of startsAt…endsAt, applied to the day it lands on.
const minutesOfDay = (d) => {
  const [h, m] = CLOCK.format(d).split(":");
  return Number(h) * 60 + Number(m);
};
const DAY_END = 23 * 60 + 59;
const OCCURRENCE_GRACE = 60; // minutes past start when no end time was sourced

// When this card's sitting is over, in NY minutes-of-day. The carve-outs
// mirror isExpiredCard exactly, so a recurring card and a one-off with the
// same clock retire at the same moment: an unsourced end (the 23:59 sentinel)
// expires an hour past start; an all-day card (00:00 start sentinel) states no
// clock and so runs to midnight; a window crossing midnight is never retired
// by a same-day comparison it would fail immediately.
function occurrenceEndMinutes(card) {
  if (card.startsAt == null || card.endsAt == null) return DAY_END;
  const startMin = minutesOfDay(new Date(card.startsAt));
  if (startMin === 0) return DAY_END;
  const endMin = minutesOfDay(new Date(card.endsAt));
  if (endMin === DAY_END) return Math.min(startMin + OCCURRENCE_GRACE, DAY_END);
  return endMin < startMin ? DAY_END : endMin;
}

// Day arithmetic in NY calendar days, not in milliseconds: noon at a fixed
// -05:00 is mid-day in New York whether it's EST or EDT, so a probe can never
// slip a day across a DST boundary (the old `from + i * 86400000` could, for a
// `from` near midnight in March or November).
const nyNoon = (ymd) => new Date(`${ymd}T12:00:00-05:00`);
const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// The first day on or after `from` that this card actually happens AND has not
// already finished, as "YYYY-MM-DD" (NY), or null if its span is exhausted.
// `from` is an instant, not a date: its clock is what decides whether today's
// sitting still counts. Bounded by eight days — a week past the first day
// examined, so a card whose sitting today is over can still find next week's.
export function nextOccurrence(card, from) {
  const today = DAYKEY.format(from);
  for (let i = 0; i < 8; i++) {
    const day = addDays(today, i);
    if (!occursOn(card, nyNoon(day))) continue;
    if (day === today && minutesOfDay(from) > occurrenceEndMinutes(card)) continue;
    return day;
  }
  return null;
}

// The rhythm, named for a row that is already sitting under a date — so it
// says "Every Saturday", never "Saturday, Aug 8" (the when-line owns that).
// No stated day = no claim, per the truth rules: a standing offer is not
// "every day" just because we don't know its schedule.
export function recurrenceLabel(card) {
  const days = statedDays(card);
  if (!days) return null;
  const ordered = RECURRENCE_DAYS.filter((d) => days.includes(d));
  if (ordered.length === 1) return `Every ${DAY_NAMES[ordered[0]]}`;
  const plural = ordered.map((d) => `${DAY_NAMES[d]}s`);
  return `${plural.slice(0, -1).join(", ")} & ${plural[plural.length - 1]}`;
}

// Header kicker (UX eval F23 / Q4-B): the edition date — the rolling week the
// feed covers, today through six days out. Self-maintaining, no data field.
const MONTH = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: TZ });
const DAYNUM = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: TZ });

export function editionLabel(date) {
  const end = new Date(date.getTime() + 6 * 86400000);
  const sameMonth = MONTH.format(date) === MONTH.format(end);
  return sameMonth
    ? `${MONTH.format(date)} ${DAYNUM.format(date)}–${DAYNUM.format(end)}`
    : `${DATE.format(date)} – ${DATE.format(end)}`;
}
