import test from "node:test";
import assert from "node:assert/strict";
import { cardsToAnnounce, nyDayKey, retiredToAnnounce, trimRetired } from "./indexNow.js";

// The bug this file exists to prevent shipped once and was caught in a build
// log, not by a test. Both failure modes are pinned below.

const card = (id, updatedAt) => ({ id, updatedAt, createdAt: "2026-07-01" });
const RUN = "2026-08-13T09:30:00-04:00"; // a real ingest run: 09:30 NY

test("nyDayKey reads an instant in New York, not UTC", () => {
  assert.equal(nyDayKey(RUN), "2026-08-13");
  // 00:30 NY on the 14th is 04:30 UTC the same day — but the trap is the other
  // direction: 21:00 NY on the 13th is already the 14th in UTC.
  assert.equal(nyDayKey("2026-08-13T21:00:00-04:00"), "2026-08-13");
  assert.equal(nyDayKey("nonsense"), null);
});

test("a card updated ON the run day IS announced", () => {
  // The regression that would have shipped: updatedAt is DATE-ONLY, so parsing
  // it as an instant puts it at UTC midnight — BEFORE a 13:30 UTC run — and
  // every same-day update sorts out of range. Measured at the time: 0 of 159.
  const picked = cardsToAnnounce([card("today", "2026-08-13")], { lastRunAt: RUN });
  assert.deepEqual(picked.map((c) => c.id), ["today"]);
});

test("cards from before the run are left alone", () => {
  const picked = cardsToAnnounce(
    [card("stale", "2026-08-11"), card("yesterday", "2026-08-12"), card("today", "2026-08-13")],
    { lastRunAt: RUN },
  );
  assert.deepEqual(picked.map((c) => c.id), ["today"]);
});

test("a code-only deploy announces NOTHING", () => {
  // The whole point. No ingest since the last run means no content changed, so
  // re-announcing is what earned a 403 the first time round.
  const picked = cardsToAnnounce(
    [card("a", "2026-08-11"), card("b", "2026-08-12")],
    { lastRunAt: "2026-08-13T09:30:00-04:00" },
  );
  assert.deepEqual(picked, []);
});

test("a later run day narrows the set further", () => {
  const cards = [card("a", "2026-08-13"), card("b", "2026-08-14")];
  assert.deepEqual(
    cardsToAnnounce(cards, { lastRunAt: "2026-08-14T09:30:00-04:00" }).map((c) => c.id),
    ["b"],
  );
});

test("no lastRunAt falls back to a day window rather than announcing everything", () => {
  const now = new Date("2026-08-13T12:00:00-04:00");
  const picked = cardsToAnnounce(
    [card("old", "2026-08-01"), card("recent", "2026-08-13")],
    { lastRunAt: null, now, fallbackDays: 1 },
  );
  assert.deepEqual(picked.map((c) => c.id), ["recent"]);
});

test("a card with no dates at all is never announced", () => {
  assert.deepEqual(cardsToAnnounce([{ id: "bare" }], { lastRunAt: RUN }), []);
});

test("a full timestamp in updatedAt is tolerated by taking its day", () => {
  const picked = cardsToAnnounce([card("ts", "2026-08-13T18:00:00-04:00")], { lastRunAt: RUN });
  assert.deepEqual(picked.map((c) => c.id), ["ts"]);
});

// ---- retired cards (2026-09-07) --------------------------------------------
// A card that expires has its page DELETED, so the URL starts answering 404.
// Until now nothing told anyone: the ping announced live cards only, so Bing
// and Yandex kept the dead URL until they happened to recrawl it. Google found
// the same staleness the harder way and mailed about it on 2026-09-06.

test("a card retired since the last run is announced", () => {
  assert.deepEqual(
    retiredToAnnounce([{ id: "gone", day: "2026-08-13" }], { lastRunAt: RUN }),
    ["gone"],
  );
});

test("a card retired before the last run is not re-announced", () => {
  assert.deepEqual(
    retiredToAnnounce([{ id: "old", day: "2026-08-12" }], { lastRunAt: RUN }),
    [],
  );
});

test("retirements use the same day-string cutoff as cards, not Date.parse", () => {
  // The 2026-08-13 bug in reverse: RUN is 09:30 NY = 13:30 UTC, so a same-day
  // retirement parsed as UTC midnight sorts BEFORE it and would vanish.
  assert.deepEqual(
    retiredToAnnounce([{ id: "sameday", day: "2026-08-13" }], { lastRunAt: RUN }),
    ["sameday"],
  );
});

test("a malformed or dateless retirement entry is skipped, not announced", () => {
  assert.deepEqual(
    retiredToAnnounce([{ id: "bare" }, { day: "2026-08-14" }, null], { lastRunAt: RUN }),
    [],
  );
});

test("no lastRunAt falls back to a day window", () => {
  const now = new Date("2026-08-13T12:00:00-04:00");
  assert.deepEqual(
    retiredToAnnounce(
      [{ id: "old", day: "2026-08-01" }, { id: "recent", day: "2026-08-13" }],
      { lastRunAt: null, now, fallbackDays: 1 },
    ),
    ["recent"],
  );
});

test("a missing retired list is empty, never a crash", () => {
  assert.deepEqual(retiredToAnnounce(undefined, { lastRunAt: RUN }), []);
});

// ---- the retention window --------------------------------------------------

test("retirements older than the window are dropped so the ledger cannot grow forever", () => {
  const kept = trimRetired(
    [
      { id: "ancient", day: "2026-01-01" },
      { id: "recent", day: "2026-09-01" },
    ],
    { now: new Date("2026-09-07T12:00:00-04:00") },
  );
  assert.deepEqual(kept.map((r) => r.id), ["recent"]);
});

test("trimming keeps one entry per id — a slug retired twice is announced once", () => {
  const kept = trimRetired(
    [
      { id: "dupe", day: "2026-09-01" },
      { id: "dupe", day: "2026-09-05" },
    ],
    { now: new Date("2026-09-07T12:00:00-04:00") },
  );
  assert.deepEqual(kept, [{ id: "dupe", day: "2026-09-05" }]);
});
