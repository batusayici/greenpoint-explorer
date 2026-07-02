import test from "node:test";
import assert from "node:assert/strict";
import { FILTERS, matchesFilter, isActiveOn, pinKind } from "./filterCards.js";
import { FILTER_IDS } from "./cardSchema.js";

test("FILTERS = 'all' + the spec's nine, in order, with display labels", () => {
  assert.equal(FILTERS[0].id, "all");
  assert.deepEqual(FILTERS.slice(1).map((f) => f.id), FILTER_IDS);
  assert.equal(FILTERS.find((f) => f.id === "g_train").label, "G-Train Support");
  assert.equal(FILTERS.find((f) => f.id === "food_drink").label, "Food & Drink");
  assert.equal(FILTERS.find((f) => f.id === "clubs_signups").label, "Clubs & Signups");
});

test("matchesFilter: 'all' passes everything; others check authored membership", () => {
  const card = { filters: ["new", "food_drink"] };
  assert.ok(matchesFilter(card, "all"));
  assert.ok(matchesFilter(card, "new"));
  assert.ok(matchesFilter(card, "food_drink"));
  assert.ok(!matchesFilter(card, "g_train"));
});

test("isActiveOn: undated cards always pass; dated cards pass only inside their window", () => {
  const jul2 = new Date("2026-07-02T12:00:00-04:00");
  const jul8 = new Date("2026-07-08T12:00:00-04:00");
  const undated = {};
  const tasting = { startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  const openEnded = { endsAt: "2026-07-19T23:59:00-04:00" };
  assert.ok(isActiveOn(undated, jul2));
  assert.ok(isActiveOn(tasting, jul2), "same-day event active on its day (even before start time)");
  assert.ok(!isActiveOn(tasting, jul8), "past event inactive");
  assert.ok(isActiveOn(openEnded, jul8), "running series active before endsAt");
  assert.ok(!isActiveOn(openEnded, new Date("2026-07-25T12:00:00-04:00")), "series over");
});

test("pinKind maps categories to the four pin treatments", () => {
  assert.equal(pinKind({ category: "new_business" }), "business");
  assert.equal(pinKind({ category: "service" }), "business");
  assert.equal(pinKind({ category: "event" }), "event");
  assert.equal(pinKind({ category: "subscription" }), "club");
  assert.equal(pinKind({ category: "g_train_support" }), "gtrain");
  assert.equal(pinKind({ category: "civic_action" }), "gtrain");
  assert.equal(pinKind({ category: "support_local" }), "gtrain");
});
