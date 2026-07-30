// Track V — the when-line formatter. One rule: show the date/time once. A card
// summary must not restate what this returns, and this must not repeat a date
// within itself. Sentinels from the card schema: a 00:00 start = "all day from
// this date", a 23:59 end = "through this date" — both render as bare dates so
// no fake clock value (12:00 AM / 11:59 PM) reaches the reader.
const TZ = "America/New_York";
const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: TZ });
const TIME = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const CLOCK = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
const MERIDIEM = new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: true, timeZone: TZ });
const DAYKEY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "numeric", timeZone: TZ });

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
