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

// --- L11b: unreachable sources (2026-08-03 supply analysis) ----------------
// The 2026-08-03 Monday run could not reach 22 of 48 sources ("Chromium has no
// egress in this sandbox"), shipped 3 cards, and check-freshness reported
// FRESH — because a dense-enough feed hides a roster we cannot read. Expiry
// then ran anyway: 95 -> 75 cards over two weeks, silently. A run that cannot
// reach its sources is not fresh, however full the deck looks today.

const reach = (over) => ({
  generatedAt: "2026-07-28T09:00:00-04:00",
  sources: [],
  ...over,
});
const src = (id, status, method) => ({ id, status, ...(method ? { method } : {}) });

test("reachable roster: no new trips", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    fetchReport: reach({ sources: [src("a", "changed", "plain"), src("b", "unchanged", "browser")] }),
  });
  assert.equal(a.sourcesUnreachable, false);
  assert.equal(a.browserFetchDown, false);
  assert.equal(a.fresh, true);
  assert.equal(a.reach.errorRate, 0);
});

test("no fetch report: behaviour is unchanged (trips are false, feed still judged)", () => {
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:07:00-04:00", now: NOW, cards: manyUpcoming });
  assert.equal(a.sourcesUnreachable, false);
  assert.equal(a.browserFetchDown, false);
  assert.equal(a.reach, null);
  assert.equal(a.fresh, true);
});

test("sourcesUnreachable trips past the error-rate ceiling, even with a dense feed", () => {
  const sources = [
    ...Array.from({ length: 22 }, (_, i) => src(`err${i}`, "error")),
    ...Array.from({ length: 26 }, (_, i) => src(`ok${i}`, "unchanged", "plain")),
  ];
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    fetchReport: reach({ sources }),
  });
  assert.equal(a.sourcesUnreachable, true);
  assert.equal(a.fresh, false, "a dense deck must not mask an unreadable roster");
  assert.equal(a.reach.errored, 22);
  assert.equal(a.reach.attempted, 48);
});

test("a couple of dead sources is normal and does not trip", () => {
  const sources = [
    src("err0", "error"),
    src("err1", "error"),
    ...Array.from({ length: 46 }, (_, i) => src(`ok${i}`, "unchanged", "plain")),
  ];
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:07:00-04:00", now: NOW, cards: manyUpcoming, fetchReport: reach({ sources }) });
  assert.equal(a.sourcesUnreachable, false);
  assert.equal(a.fresh, true);
});

test("browserFetchDown: browser needed, zero browser fetches succeeded", () => {
  const sources = [
    src("needs-browser", "error"),
    ...Array.from({ length: 40 }, (_, i) => src(`ok${i}`, "unchanged", "plain")),
  ];
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    fetchReport: reach({ sources, browserRequired: true, playwright: true }),
  });
  assert.equal(a.browserFetchDown, true, "still reported — the run must say the browser path is down");
  assert.equal(a.sourcesUnreachable, false, "one error is under the rate ceiling");
  assert.equal(
    a.fresh,
    true,
    "a browser outage that costs 1 of 41 sources is not a stale deck (2026-08-05): " +
      "coverage is what matters, and the error-rate ceiling already measures it",
  );
});

test("a browser outage that DOES cost real coverage still fails, via the rate ceiling", () => {
  // The protection that matters is unchanged: lose enough of the roster and the
  // run is degraded regardless of which fetch path failed.
  const sources = [
    ...Array.from({ length: 9 }, (_, i) => src(`needs-browser${i}`, "error")),
    ...Array.from({ length: 31 }, (_, i) => src(`ok${i}`, "unchanged", "plain")),
  ];
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    fetchReport: reach({ sources, browserRequired: true, playwright: true }),
  });
  assert.equal(a.sourcesUnreachable, true, "9 of 40 errored is over the 15% ceiling");
  assert.equal(a.fresh, false);
});

test("browserFetchDown stays false when a browser fetch did succeed", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    fetchReport: reach({ sources: [src("a", "error"), src("b", "changed", "browser")], browserRequired: true, playwright: true }),
  });
  assert.equal(a.browserFetchDown, false);
});

test("browserFetchDown stays false when no source needed a browser", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:07:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    fetchReport: reach({ sources: [src("a", "changed", "plain")], browserRequired: false, playwright: true }),
  });
  assert.equal(a.browserFetchDown, false);
  assert.equal(a.fresh, true);
});

test("skipped_monthly sources are not counted as attempted or errored", () => {
  const sources = [src("m", "skipped_monthly"), src("a", "error"), src("b", "unchanged", "plain")];
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:07:00-04:00", now: NOW, cards: manyUpcoming, fetchReport: reach({ sources }) });
  assert.equal(a.reach.attempted, 2);
  assert.equal(a.reach.errored, 1);
});
