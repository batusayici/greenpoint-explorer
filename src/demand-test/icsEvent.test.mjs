import test from "node:test";
import assert from "node:assert/strict";
import { icsForCard } from "./icsEvent.js";

// V2-A (first-visit test, 2026-07-24): "save an event to go to" = hand the
// plan to the user's real calendar. Client-generated .ics, zero backend.

const NOW = new Date("2026-07-24T12:00:00Z");

const harborDay = {
  id: "city-of-water-day",
  title: "City of Water Day, at Transmitter Park",
  summary: "Harbor day: cleanup, oysters, movement.",
  address: "10 Greenpoint Ave, Brooklyn, NY 11222",
  startsAt: "2026-07-25T10:00:00-04:00",
  endsAt: "2026-07-25T13:00:00-04:00",
};

const URL_ = "https://greenpoint.life/e/city-of-water-day?src=share";

function lines(ics) {
  return ics.split("\r\n");
}

// Unfold RFC 5545 continuation lines (CRLF + single space) back into one line.
function unfolded(ics) {
  return ics.replace(/\r\n[ ]/g, "").split("\r\n");
}

test("a timed event renders start and end as UTC instants", () => {
  const ics = icsForCard(harborDay, { url: URL_, now: NOW });
  const l = unfolded(ics);
  assert.ok(l.includes("BEGIN:VCALENDAR"));
  assert.ok(l.includes("BEGIN:VEVENT"));
  assert.ok(l.includes("DTSTART:20260725T140000Z"));
  assert.ok(l.includes("DTEND:20260725T170000Z"));
  assert.ok(l.includes("UID:city-of-water-day@greenpoint.life"));
  assert.ok(l.includes("DTSTAMP:20260724T120000Z"));
  assert.ok(l.includes("END:VEVENT"));
  assert.ok(l.includes("END:VCALENDAR"));
});

test("text fields are escaped per RFC 5545 (commas, and the deep link survives)", () => {
  const l = unfolded(icsForCard(harborDay, { url: URL_, now: NOW }));
  assert.ok(l.includes("SUMMARY:City of Water Day\\, at Transmitter Park"));
  assert.ok(l.includes("LOCATION:10 Greenpoint Ave\\, Brooklyn\\, NY 11222"));
  assert.ok(l.some((x) => x.startsWith("DESCRIPTION:") && x.includes("Harbor day: cleanup\\, oysters\\, movement.") && x.includes(URL_)));
  assert.ok(l.includes(`URL:${URL_}`));
});

test("a missing end defaults to two hours after the start", () => {
  const l = unfolded(icsForCard({ ...harborDay, endsAt: null }, { url: URL_, now: NOW }));
  assert.ok(l.includes("DTSTART:20260725T140000Z"));
  assert.ok(l.includes("DTEND:20260725T160000Z"));
});

test("the 00:00 all-day sentinel becomes a date-value event", () => {
  const allDay = { ...harborDay, startsAt: "2026-07-25T00:00:00-04:00", endsAt: null };
  const l = unfolded(icsForCard(allDay, { url: URL_, now: NOW }));
  assert.ok(l.includes("DTSTART;VALUE=DATE:20260725"));
  assert.ok(l.includes("DTEND;VALUE=DATE:20260726"));
});

test("an all-day span through a 23:59 end sentinel gets an exclusive date end", () => {
  const span = {
    ...harborDay,
    startsAt: "2026-07-25T00:00:00-04:00",
    endsAt: "2026-07-27T23:59:00-04:00",
  };
  const l = unfolded(icsForCard(span, { url: URL_, now: NOW }));
  assert.ok(l.includes("DTSTART;VALUE=DATE:20260725"));
  assert.ok(l.includes("DTEND;VALUE=DATE:20260728"));
});

test("undated and recurring cards produce no calendar file", () => {
  assert.equal(icsForCard({ ...harborDay, startsAt: null }, { url: URL_, now: NOW }), null);
  assert.equal(icsForCard({ ...harborDay, recurring: true }, { url: URL_, now: NOW }), null);
});

test("no physical line exceeds 75 octets (folded with CRLF + space)", () => {
  const long = {
    ...harborDay,
    summary:
      "The 19th annual region-wide event from Waterfront Alliance and the NY-NJ Harbor & Estuary Program championing climate-resilient harbors — a longevity stick movement class, shoreline cleanup, oyster station monitoring, and more.",
  };
  for (const line of lines(icsForCard(long, { url: URL_, now: NOW }))) {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75, `line too long: ${line}`);
  }
});
