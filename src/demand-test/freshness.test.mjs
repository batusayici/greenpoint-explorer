import test from "node:test";
import assert from "node:assert/strict";
import { assessFreshness } from "./freshness.js";

// L11 (DECISION_LOG 2026-07-28, pressure-test): the 7/27–28 outage was
// invisible because a silently-failing ingest is indistinguishable from a
// quiet week — expiry keeps running while sources go unreachable, so the
// feed empties itself with nothing complaining. Two independent trips:
// stale ingest (lastRunAt too old) and thin feed (dated upcoming below floor).

const NOW = new Date("2026-07-28T12:00:00-04:00");
const dated = (id, startsAt, endsAt) => ({ id, title: id, startsAt, endsAt });
const manyUpcoming = Array.from({ length: 12 }, (_, i) =>
  dated(`e${i}`, `2026-07-${29 + (i % 3)}T19:00:00-04:00`),
);

test("fresh: recent run and a dense week", () => {
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:07:00-04:00", now: NOW, cards: manyUpcoming });
  assert.equal(a.fresh, true);
  assert.equal(a.staleIngest, false);
  assert.equal(a.thinFeed, false);
  assert.equal(a.datedUpcoming, 12);
});

test("stale ingest trips at maxAgeHours regardless of feed density", () => {
  const a = assessFreshness({ lastRunAt: "2026-07-26T09:00:00-04:00", now: NOW, cards: manyUpcoming });
  assert.equal(a.staleIngest, true);
  assert.equal(a.fresh, false);
});

test("thin feed trips below the floor even when the run is recent", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming.slice(0, 4),
  });
  assert.equal(a.thinFeed, true);
  assert.equal(a.fresh, false);
  assert.equal(a.datedUpcoming, 4);
});

test("upcoming window: counts starts within 7 days, ongoing spans, and end-only cards; excludes past and far-future", () => {
  const cards = [
    dated("past", "2026-07-20T19:00:00-04:00"), // already over
    dated("today", "2026-07-28T19:00:00-04:00"),
    dated("in6", "2026-08-03T19:00:00-04:00"),
    dated("in9", "2026-08-06T19:00:00-04:00"), // outside 7-day window
    dated("ongoing", "2026-07-01T00:00:00-04:00", "2026-08-30T00:00:00-04:00"), // spans now
    dated("deal-ending", undefined, "2026-07-30T00:00:00-04:00"), // end-only within window
    { id: "undated", title: "undated" },
  ];
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards, minDatedUpcoming: 1 });
  assert.equal(a.datedUpcoming, 4); // today, in6, ongoing, deal-ending
});

test("verifiedThrough carries the run date for honest display", () => {
  const a = assessFreshness({ lastRunAt: "2026-07-27T14:30:00-04:00", now: NOW, cards: manyUpcoming });
  assert.equal(a.verifiedThrough, "2026-07-27T14:30:00-04:00");
});

test("missing or unparsable lastRunAt reads as stale, never as fresh", () => {
  assert.equal(assessFreshness({ lastRunAt: null, now: NOW, cards: manyUpcoming }).fresh, false);
  assert.equal(assessFreshness({ lastRunAt: "not-a-date", now: NOW, cards: manyUpcoming }).staleIngest, true);
});
