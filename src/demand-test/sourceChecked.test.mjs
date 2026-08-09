import test from "node:test";
import assert from "node:assert/strict";
import { sourceCheckedDate, formatChecked } from "./sourceChecked.js";

test("resolved cardChecked entry wins when newer than updatedAt", () => {
  const card = { id: "a", updatedAt: "2026-07-08" };
  assert.equal(sourceCheckedDate(card, { a: "2026-08-04" }), "2026-08-04");
});

test("updatedAt wins when newer than the resolved entry (hand edit after the sweep)", () => {
  const card = { id: "a", updatedAt: "2026-08-05" };
  assert.equal(sourceCheckedDate(card, { a: "2026-08-01" }), "2026-08-05");
});

test("no entry for this card id falls back to updatedAt", () => {
  const card = { id: "orphan", updatedAt: "2026-07-08" };
  assert.equal(sourceCheckedDate(card, { other: "2026-08-04" }), "2026-07-08");
});

test("null entry (resolveCardChecked found no roster-source hit) falls back to updatedAt", () => {
  const card = { id: "a", updatedAt: "2026-07-08" };
  assert.equal(sourceCheckedDate(card, { a: null }), "2026-07-08");
});

test("missing or empty cardChecked map still falls back to updatedAt", () => {
  const card = { id: "a", updatedAt: "2026-07-08" };
  assert.equal(sourceCheckedDate(card, null), "2026-07-08");
  assert.equal(sourceCheckedDate(card, {}), "2026-07-08");
});

test("no updatedAt and no resolved entry returns null", () => {
  assert.equal(sourceCheckedDate({ id: "a" }, {}), null);
});

test("formatChecked: month-day within the current year, year appended across years", () => {
  const now = new Date("2026-08-08T12:00:00-04:00");
  assert.equal(formatChecked("2026-08-06", now), "Aug 6");
  assert.equal(formatChecked("2025-12-30", now), "Dec 30, 2025");
  assert.equal(formatChecked(null, now), null);
  assert.equal(formatChecked("not-a-date", now), null);
});
