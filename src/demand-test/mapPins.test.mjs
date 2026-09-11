import test from "node:test";
import assert from "node:assert/strict";
import { groupByLocation } from "./mapPins.js";

// 2026-07-23 (UX eval F1): venues with event series used to render one marker
// per card at identical coordinates — only the top pin of each stack was ever
// tappable (8 cards at Eavesdrop, 7 at Troost). Pins now group by location;
// tapping a badged multi-card pin focuses the feed on that location.

test("groupByLocation: one group per exact coordinate, cards in authored order", () => {
  const a1 = { id: "a1", lat: 40.72, lng: -73.95 };
  const a2 = { id: "a2", lat: 40.72, lng: -73.95 };
  const b = { id: "b", lat: 40.73, lng: -73.96 };
  const groups = groupByLocation([a1, b, a2]);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["a1", "a2"]);
  assert.equal(groups[0].lat, 40.72);
  assert.deepEqual(groups[1].cards.map((c) => c.id), ["b"]);
});

test("groupByLocation: cards without coordinates are skipped, not grouped", () => {
  const groups = groupByLocation([{ id: "x", lat: null, lng: null }, { id: "y", lat: 40.7, lng: -73.9 }]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].cards[0].id, "y");
});


// ---- the peek's pin filter (2026-09-11) -------------------------------------
// Batu, on a phone: "when I open the family and kids cards, most of them do not
// show a mapped pin." Measured on production — 51 cards, 20 pins in the compact
// map, 29 once it is expanded.
//
// The filter itself is a deliberate crit decision (round 2, #7): the 203px peek
// rendered every pin at a size where the colour key cannot be read, so it keeps
// today's dated cards, recurring cards and undated venues, and drops the rest.
// What nobody weighed is what happens when you OPEN one of the dropped cards.
// The card expands, the map does not move, no pin lights up, and the reader
// concludes the place is not on the map. Kids events are mostly dated for a
// future day, so it read as "most of them".
//
// The density decision stands. A card the reader has actually opened is not
// density — it is the one pin they asked for.

import { peekMapCards } from "./mapPins.js";

const NOW = new Date("2026-09-11T12:00:00-04:00");
const at = (id, startsAt, endsAt, extra = {}) => ({ id, startsAt, endsAt, ...extra });

const today = at("today", "2026-09-11T10:00:00-04:00", "2026-09-11T11:00:00-04:00");
const sunday = at("sunday", "2026-09-13T11:00:00-04:00", "2026-09-13T23:59:00-04:00");
const weekly = at("weekly", "2026-07-04T09:00:00-04:00", "2026-09-19T10:00:00-04:00",
  { recurring: true, recurrence: { days: ["sat"] } });
const venue = at("venue", null, null);
const all = [today, sunday, weekly, venue];

test("the peek keeps today, recurring and undated, and drops a future date", () => {
  const ids = peekMapCards(all, null, NOW).map((c) => c.id);
  assert.deepEqual(ids, ["today", "weekly", "venue"]);
});

test("a card the reader has OPENED keeps its pin, whatever the peek would drop", () => {
  const ids = peekMapCards(all, "sunday", NOW).map((c) => c.id);
  assert.ok(ids.includes("sunday"), "the opened card had no pin — the bug Batu hit");
  assert.deepEqual(ids, ["today", "sunday", "weekly", "venue"], "and it keeps its place in order");
});

test("selecting a card the peek already kept does not duplicate it", () => {
  const ids = peekMapCards(all, "today", NOW).map((c) => c.id);
  assert.deepEqual(ids, ["today", "weekly", "venue"]);
});

test("a selection that is not in the lens adds nothing", () => {
  const ids = peekMapCards(all, "some-other-card", NOW).map((c) => c.id);
  assert.deepEqual(ids, ["today", "weekly", "venue"]);
});
