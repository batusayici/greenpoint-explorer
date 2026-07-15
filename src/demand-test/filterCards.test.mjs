import test from "node:test";
import assert from "node:assert/strict";
import { FILTERS, matchesFilter, isActiveOn, sortTodayFirst, pinKind, isExpiredDeal } from "./filterCards.js";
import { FILTER_IDS } from "./cardSchema.js";

test("FILTERS = 'all' + the spec's eleven, in order, with display labels", () => {
  assert.equal(FILTERS[0].id, "all");
  assert.deepEqual(FILTERS.slice(1).map((f) => f.id), FILTER_IDS);
  assert.equal(FILTERS.find((f) => f.id === "g_train").label, "G-Train Support");
  assert.equal(FILTERS.find((f) => f.id === "food_drink").label, "Food & Drink");
  // Renamed from "Clubs & Signups" 2026-07-08 — tester read "club" as nightclub.
  assert.equal(FILTERS.find((f) => f.id === "clubs_signups").label, "Memberships");
  // Limited-launch content types (2026-07-15).
  assert.equal(FILTERS.find((f) => f.id === "deals").label, "Deals");
  assert.equal(FILTERS.find((f) => f.id === "news").label, "News");
  assert.equal(FILTERS.find((f) => f.id === "live_music").label, "Live Music");
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

test("FILTERS[0] label is All", () => {
  assert.deepEqual(FILTERS[0], { id: "all", label: "All" });
});

test("sortTodayFirst: today's time-specific events lead, then live windows, then the rest (stable)", () => {
  const jul2 = new Date("2026-07-02T12:00:00-04:00");
  const shopA = { id: "shop-a" };
  const shopB = { id: "shop-b" };
  const tasting = { id: "tasting", startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  const series = { id: "series", startsAt: "2026-06-11T00:00:00-04:00", endsAt: "2026-07-19T23:59:00-04:00" };
  const openEnded = { id: "open", endsAt: "2026-07-19T23:59:00-04:00" };
  const notYet = { id: "not-yet", startsAt: "2026-07-04T00:00:00-04:00", endsAt: "2026-07-12T23:59:00-04:00" };
  const sorted = sortTodayFirst([shopA, notYet, openEnded, series, tasting, shopB], jul2);
  // tasting (2h) < open-ended (~30d constant) < series (38d window); undated +
  // not-yet-started keep authored order at the back
  assert.deepEqual(sorted.map((c) => c.id), ["tasting", "open", "series", "shop-a", "not-yet", "shop-b"]);
});

test("pinKind maps categories to the six pin treatments", () => {
  assert.equal(pinKind({ category: "new_business" }), "business");
  assert.equal(pinKind({ category: "service" }), "business");
  assert.equal(pinKind({ category: "event" }), "event");
  assert.equal(pinKind({ category: "subscription" }), "club");
  assert.equal(pinKind({ category: "g_train_support" }), "gtrain");
  assert.equal(pinKind({ category: "civic_action" }), "gtrain");
  assert.equal(pinKind({ category: "support_local" }), "gtrain");
  assert.equal(pinKind({ category: "discount" }), "deal");
  assert.equal(pinKind({ category: "news" }), "news");
});

test("isExpiredDeal: only a past-endsAt deal expires; events and undated cards never do", () => {
  const jul15 = new Date("2026-07-15T12:00:00-04:00");
  const liveDeal = { category: "discount", endsAt: "2026-07-20T23:59:00-04:00" };
  const deadDeal = { category: "discount", endsAt: "2026-07-10T23:59:00-04:00" };
  const pastEvent = { category: "event", endsAt: "2026-07-10T23:59:00-04:00" };
  assert.ok(!isExpiredDeal(liveDeal, jul15));
  assert.ok(isExpiredDeal(deadDeal, jul15));
  assert.ok(!isExpiredDeal(pastEvent, jul15), "events are purged by refresh, not hidden");
  assert.ok(!isExpiredDeal({ category: "new_business" }, jul15));
});
