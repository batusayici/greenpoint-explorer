import test from "node:test";
import assert from "node:assert/strict";
import { cardsToAnnounce, nyDayKey } from "./indexNow.js";

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
