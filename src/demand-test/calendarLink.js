// V2-A, revised after Batu's 2026-07-25 phone test: the calendar action is a
// Google Calendar template link, not an .ics download — it opens the prefilled
// new-event screen, so "I'm going" is one tap with no file handling. Schema
// sentinels carry over from eventWindow: a 00:00 NY start = all-day, a 23:59
// NY end = through that date — both become bare date ranges so no fake clock
// reaches the calendar.
const TZ = "America/New_York";
const CLOCK = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
const DAYKEY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ });

const isStartSentinel = (d) => CLOCK.format(d) === "00:00";
const isEndSentinel = (d) => CLOCK.format(d) === "23:59";

const utcStamp = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
const dateValue = (d) => DAYKEY.format(d).replace(/-/g, "");

export function gcalEventUrl(card, { url } = {}) {
  if (card.startsAt == null || card.recurring) return null;
  const start = new Date(card.startsAt);
  const end = card.endsAt ? new Date(card.endsAt) : null;

  let dates;
  if (isStartSentinel(start)) {
    // Bare date range; the end date is exclusive, so name the day after.
    const lastDay = end && isEndSentinel(end) ? end : start;
    dates = `${dateValue(start)}/${dateValue(new Date(lastDay.getTime() + 86400000))}`;
  } else {
    const realEnd = end && !isEndSentinel(end) ? end : new Date(start.getTime() + 2 * 3600000);
    dates = `${utcStamp(start)}/${utcStamp(realEnd)}`;
  }

  const params = new URLSearchParams({ action: "TEMPLATE", text: card.title, dates });
  const details = [card.summary, url].filter(Boolean).join("\n\n");
  if (details) params.set("details", details);
  const location = card.address ?? card.locationName;
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
