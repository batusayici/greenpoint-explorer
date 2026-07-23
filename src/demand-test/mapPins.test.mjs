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

