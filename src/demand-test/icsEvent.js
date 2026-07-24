// V2-A (first-visit test, 2026-07-24): "Add to calendar" on every dated card.
// Client-generated RFC 5545 .ics — zero backend, works on the static site, and
// lands the plan where attendance is actually decided. Schema sentinels carry
// over from eventWindow: a 00:00 NY start = all-day, a 23:59 NY end = through
// that date; both become VALUE=DATE so no fake clock reaches a calendar.
const TZ = "America/New_York";
const CLOCK = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
const DAYKEY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ });

const isStartSentinel = (d) => CLOCK.format(d) === "00:00";
const isEndSentinel = (d) => CLOCK.format(d) === "23:59";

const utcStamp = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
const dateValue = (d) => DAYKEY.format(d).replace(/-/g, "");

// TEXT escaping per RFC 5545 §3.3.11: backslash, semicolon, comma, newline.
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Content lines fold at 75 octets with CRLF + one space (§3.1). Split on byte
// count, not code units, so multi-byte characters never straddle a fold.
// TextEncoder, not Buffer — this module runs in the browser.
const UTF8 = new TextEncoder();

function fold(line) {
  const out = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const b = UTF8.encode(ch).length;
    // Continuation lines start with a space, so their budget is 74.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + b > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += b;
  }
  out.push(current);
  return out.map((l, i) => (i === 0 ? l : ` ${l}`)).join("\r\n");
}

export function icsForCard(card, { url, now }) {
  if (card.startsAt == null || card.recurring) return null;
  const start = new Date(card.startsAt);
  const end = card.endsAt ? new Date(card.endsAt) : null;

  let dtstart;
  let dtend;
  if (isStartSentinel(start)) {
    // All-day event; DTEND is exclusive, so it names the day after the last day.
    const lastDay = end && isEndSentinel(end) ? end : start;
    dtstart = `DTSTART;VALUE=DATE:${dateValue(start)}`;
    dtend = `DTEND;VALUE=DATE:${dateValue(new Date(lastDay.getTime() + 86400000))}`;
  } else {
    const realEnd = end && !isEndSentinel(end) ? end : new Date(start.getTime() + 2 * 3600000);
    dtstart = `DTSTART:${utcStamp(start)}`;
    dtend = `DTEND:${utcStamp(realEnd)}`;
  }

  const description = [card.summary, url].filter(Boolean).join("\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Greenpoint Life//EN",
    "BEGIN:VEVENT",
    `UID:${card.id}@greenpoint.life`,
    `DTSTAMP:${utcStamp(now)}`,
    dtstart,
    dtend,
    `SUMMARY:${esc(card.title)}`,
    card.address || card.locationName ? `LOCATION:${esc(card.address ?? card.locationName)}` : null,
    description ? `DESCRIPTION:${esc(description)}` : null,
    url ? `URL:${url}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.map(fold).join("\r\n");
}
