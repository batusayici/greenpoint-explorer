import test from "node:test";
import assert from "node:assert/strict";
import { gcalEventUrl } from "./calendarLink.js";

// V2-A revision (Batu's phone test, 2026-07-25): a Google Calendar template
// link instead of an .ics download — opens the prefilled event screen, one tap
// from "I'm going" to saved, no file handling.

const harborDay = {
  id: "city-of-water-day",
  title: "City of Water Day at Transmitter Park",
  summary: "Harbor day: cleanup, oysters, movement.",
  address: "10 Greenpoint Ave, Brooklyn, NY 11222",
  startsAt: "2026-07-25T10:00:00-04:00",
  endsAt: "2026-07-25T13:00:00-04:00",
};

const LINK = "https://stoopwise.com/e/city-of-water-day?src=calendar";

function params(url) {
  assert.ok(url.startsWith("https://calendar.google.com/calendar/render?"), url);
  return new URL(url).searchParams;
}

test("a timed event prefills title, UTC window, location, and details", () => {
  const p = params(gcalEventUrl(harborDay, { url: LINK }));
  assert.equal(p.get("action"), "TEMPLATE");
  assert.equal(p.get("text"), "City of Water Day at Transmitter Park");
  assert.equal(p.get("dates"), "20260725T140000Z/20260725T170000Z");
  assert.equal(p.get("location"), "10 Greenpoint Ave, Brooklyn, NY 11222");
  assert.ok(p.get("details").includes("Harbor day: cleanup, oysters, movement."));
  assert.ok(p.get("details").includes(LINK));
});

test("a missing end defaults to two hours after the start", () => {
  const p = params(gcalEventUrl({ ...harborDay, endsAt: null }, { url: LINK }));
  assert.equal(p.get("dates"), "20260725T140000Z/20260725T160000Z");
});

test("the 00:00 all-day sentinel becomes a date range (exclusive end)", () => {
  const allDay = { ...harborDay, startsAt: "2026-07-25T00:00:00-04:00", endsAt: null };
  assert.equal(params(gcalEventUrl(allDay, { url: LINK })).get("dates"), "20260725/20260726");
});

test("an all-day span through a 23:59 end sentinel covers every day", () => {
  const span = { ...harborDay, startsAt: "2026-07-25T00:00:00-04:00", endsAt: "2026-07-27T23:59:00-04:00" };
  assert.equal(params(gcalEventUrl(span, { url: LINK })).get("dates"), "20260725/20260728");
});

test("no location falls back to the venue name; neither omits the param", () => {
  const p = params(gcalEventUrl({ ...harborDay, address: null, locationName: "Transmitter Park" }, { url: LINK }));
  assert.equal(p.get("location"), "Transmitter Park");
  const none = params(gcalEventUrl({ ...harborDay, address: null }, { url: LINK }));
  assert.equal(none.get("location"), null);
});

test("undated and recurring cards get no calendar link", () => {
  assert.equal(gcalEventUrl({ ...harborDay, startsAt: null }, { url: LINK }), null);
  assert.equal(gcalEventUrl({ ...harborDay, recurring: true }, { url: LINK }), null);
});
