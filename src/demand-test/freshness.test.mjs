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

// ---------------------------------------------------------------------------
// L11c trend check (Batu, 2026-08-06, off the cycle-3 readout proposal 3).
//
// thinFeed is an ABSOLUTE FLOOR of 10. The deck slid 38 -> 27 dated-upcoming
// over two weeks and check-freshness reported FRESH the whole way, because 27
// is comfortably above 10. It would keep saying FRESH down to 11. The floor
// catches a cliff; nothing catches a slide.
//
// Compared SAME-WEEKDAY-to-SAME-WEEKDAY, not run-to-run. The feed sawtooths by
// design — weekends are thin — and the readout's own decision rule says a
// run-to-run comparison would fire on every ordinary trough. We already know
// the sawtooth is real (27 -> 38 -> 27), so shipping the naive version first
// would just be shipping the known-broken one.
//
// decliningFeed is REPORTED, never gates `fresh`, and never exits non-zero —
// the same call browserFetchDown got on 2026-08-05, for a stronger reason:
// JulyApp.jsx consumes assessFreshness for the CLIENT BANNER, so letting a
// supply trend gate `fresh` would change what residents are shown about the
// feed's honesty. A supply decline is an ops signal, not a product one.

const H = (date, datedUpcoming) => ({ date, datedUpcoming });

test("trend: the real 38 -> 27 slide the floor missed now fires", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    history: [H("2026-07-14", 38), H("2026-07-21", 33), H("2026-07-28", 27)],
    datedUpcomingOverride: 27,
  });
  // 33 -> 27 is only 18% week-over-week and does NOT clear the 20% bar — which
  // is the trap: the real decline was gradual, ~15-18% every week, so a purely
  // week-over-week check would have stayed silent the whole way down. The
  // 14-day window is what catches it: 38 -> 27 is 29%.
  assert.equal(a.decliningFeed, true, "the two-week window must catch a gradual slide");
  assert.equal(a.trend.spanDays, 14, "week-over-week alone would have missed this");
  assert.equal(a.trend.prior, 38);
  assert.equal(a.trend.priorDate, "2026-07-14");
  assert.equal(a.thinFeed, false, "the floor still says fine — that is the whole point");
  assert.equal(a.fresh, true, "trend must NOT gate fresh: the client banner reads this");
});

test("trend: an ordinary weekend sawtooth does not fire", () => {
  // Same weekday a week apart is flat; only the midweek/weekend swing differs.
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    history: [H("2026-07-21", 28), H("2026-07-25", 15), H("2026-07-28", 27)],
    datedUpcomingOverride: 27,
  });
  assert.equal(a.decliningFeed, false, "must compare to the same weekday, not the last run");
  assert.equal(a.trend.prior, 28);
});

test("trend: no baseline means no alarm", () => {
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards: manyUpcoming, history: [] });
  assert.equal(a.decliningFeed, false);
  assert.equal(a.trend, null, "absent evidence is not evidence of decline");
});

test("trend: falls back to 14 days when last week's same weekday is missing", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    history: [H("2026-07-14", 38)],
    datedUpcomingOverride: 27,
  });
  assert.equal(a.decliningFeed, true);
  assert.equal(a.trend.priorDate, "2026-07-14");
  assert.equal(a.trend.spanDays, 14);
});

test("trend: growth and small dips stay quiet", () => {
  const grow = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards: manyUpcoming,
    history: [H("2026-07-21", 20)], datedUpcomingOverride: 27,
  });
  assert.equal(grow.decliningFeed, false);
  const dip = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards: manyUpcoming,
    history: [H("2026-07-21", 30)], datedUpcomingOverride: 27,
  });
  assert.equal(dip.decliningFeed, false, "10% is noise, not decay");
});

// L11d (2026-08-06 supply investigation). The 8/3 analysis fixed the fetch
// layer — reach went to 41/44 and the deck recovered 75 -> 85 — and
// datedUpcoming7d did not move (38 -> 27, flat). Cause: every run filled the
// FRONT of the window and nothing filled the back. On 8/6 the feed held 27
// dated-upcoming and exactly 2 cards dated beyond the horizon, so 8/13 and
// 8/14 read zero while `.ingest-cache/troost.txt` sat on 38 uncarded nights
// of a Google Calendar feed. Every existing gate was green: reach was fine,
// the floor of 10 was not breached, and the trend had no baseline.
//
// The reservoir IS next week's window. Holding it to the same floor as
// thinFeed is the whole idea: a reservoir of 2 today is a thin feed in seven
// days, knowable a week before the floor trips.

test("reservoir: an empty next-week reservoir trips while the current window still looks healthy", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00",
    now: NOW,
    cards: manyUpcoming, // 12 in-window, nothing beyond the horizon
  });
  assert.equal(a.thinFeed, false, "the current window is above the floor");
  assert.equal(a.datedReservoir, 0);
  assert.equal(a.hollowReservoir, true, "no supply behind the window");
});

test("reservoir: counts cards dated in days 7-14, not the current window", () => {
  const cards = [
    ...manyUpcoming,
    ...Array.from({ length: 10 }, (_, i) => dated(`r${i}`, `2026-08-0${(i % 5) + 4}T19:00:00-04:00`)),
  ];
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards });
  assert.equal(a.datedReservoir, 10);
  assert.equal(a.hollowReservoir, false);
});

test("reservoir: reported but never gates fresh — the cards on the map are still true", () => {
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards: manyUpcoming });
  assert.equal(a.hollowReservoir, true);
  assert.equal(a.fresh, true, "a thin reservoir is an ops problem, not a client-banner honesty problem");
});

test("trend: falls back to 21 days so two missed record days do not blind the alarm", () => {
  const a = assessFreshness({
    lastRunAt: "2026-07-28T09:00:00-04:00",
    now: NOW,
    cards: manyUpcoming,
    history: [H("2026-07-07", 38)], // -7 and -14 both missing
    datedUpcomingOverride: 27,
  });
  assert.equal(a.decliningFeed, true);
  assert.equal(a.trend.priorDate, "2026-07-07");
  assert.equal(a.trend.spanDays, 21);
});

// L11e (Batu, 2026-08-07). The 2026-08-06 fill rule shipped with a per-venue
// cap of 2 dated cards inside the live window, sized against a 26% estimate
// that had been computed on the BROKEN 27-card window — the very baseline the
// fill rule existed to repair. Against a healthy window the real figure is
// 17%, and the Library already ran 14% uncapped because grouped day-cards were
// never subject to the count. So the cap suppressed 5 of Troost's 7 nights to
// prevent a concentration the Library was already exceeding. Batu spotted it
// from the outside: events on the venue's calendar, absent from the map.
//
// The count cap is replaced by the thing it was proxying for. A share check
// cannot be mis-sized by a bad baseline — it scales with the window.

test("concentration: a venue over the share ceiling is flagged", () => {
  const cards = [
    ...Array.from({ length: 7 }, (_, i) => ({ ...dated(`t${i}`, `2026-07-${29 + (i % 3)}T20:00:00-04:00`), locationName: "Troost" })),
    ...Array.from({ length: 3 }, (_, i) => ({ ...dated(`o${i}`, `2026-07-30T20:00:00-04:00`), locationName: `Other ${i}` })),
  ];
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards });
  assert.equal(a.concentration.topVenue, "Troost");
  assert.equal(a.concentration.topCount, 7);
  assert.equal(a.overConcentrated, true, "70% of the window from one venue");
});

test("concentration: a nightly venue at a normal share passes", () => {
  const cards = [
    ...Array.from({ length: 7 }, (_, i) => ({ ...dated(`t${i}`, `2026-07-${29 + (i % 3)}T20:00:00-04:00`), locationName: "Troost" })),
    ...Array.from({ length: 34 }, (_, i) => ({ ...dated(`o${i}`, `2026-07-30T20:00:00-04:00`), locationName: `Other ${i}` })),
  ];
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards });
  assert.equal(a.concentration.topCount, 7);
  assert.equal(a.overConcentrated, false, "7 of 41 is 17% — the case the count cap wrongly suppressed");
});

test("concentration: reported but never gates fresh", () => {
  const cards = Array.from({ length: 12 }, (_, i) => ({ ...dated(`t${i}`, `2026-07-${29 + (i % 3)}T20:00:00-04:00`), locationName: "Troost" }));
  const a = assessFreshness({ lastRunAt: "2026-07-28T09:00:00-04:00", now: NOW, cards });
  assert.equal(a.overConcentrated, true);
  assert.equal(a.fresh, true, "an unbalanced feed is an editorial problem, not a freshness lie");
});
