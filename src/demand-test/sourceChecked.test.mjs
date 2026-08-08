import test from "node:test";
import assert from "node:assert/strict";
import { sourceCheckedDate, formatChecked } from "./sourceChecked.js";

const pulse = {
  greenpointers: "2026-08-04",
  "hana-makgeolli-events": "2026-08-06",
  "hana-makgeolli-soolschool": "2026-07-30",
  "little-dance-school": "2026-08-05",
  "go-green-bk": "2026-08-07",
};

test("exact publisher slug match returns the pulse date", () => {
  const card = {
    updatedAt: "2026-07-08",
    sourceLinks: [{ publisher: "Greenpointers" }],
  };
  assert.equal(sourceCheckedDate(card, pulse), "2026-08-04");
});

test("prefix match: pulse keys extending the publisher slug all count, max wins", () => {
  const card = {
    updatedAt: "2026-07-01",
    sourceLinks: [{ publisher: "Hana Makgeolli" }],
  };
  // matches hana-makgeolli-events AND hana-makgeolli-soolschool; max is 08-06
  assert.equal(sourceCheckedDate(card, pulse), "2026-08-06");
});

test("leading 'the-' is ignored on the publisher side", () => {
  const card = {
    updatedAt: "2026-07-01",
    sourceLinks: [{ publisher: "The Little Dance School" }],
  };
  assert.equal(sourceCheckedDate(card, pulse), "2026-08-05");
});

test("no pulse match falls back to updatedAt", () => {
  const card = {
    updatedAt: "2026-07-08",
    sourceLinks: [{ publisher: "Shop Small Greenpoint" }],
  };
  assert.equal(sourceCheckedDate(card, pulse), "2026-07-08");
});

test("updatedAt newer than a matched pulse date wins (hand-verified after the sweep)", () => {
  const card = {
    updatedAt: "2026-08-05",
    sourceLinks: [{ publisher: "Greenpointers" }],
  };
  assert.equal(sourceCheckedDate(card, pulse), "2026-08-05");
});

test("near-miss slugs never fuzzy-match (go-green-bk vs Go Green Brooklyn)", () => {
  const card = {
    updatedAt: "2026-07-20",
    sourceLinks: [{ publisher: "Go Green Brooklyn" }],
  };
  // an invented match would claim a check that didn't happen — fall back
  assert.equal(sourceCheckedDate(card, pulse), "2026-07-20");
});

test("publisher missing uses title; nothing at all returns null", () => {
  assert.equal(
    sourceCheckedDate({ updatedAt: "2026-07-08", sourceLinks: [{ title: "Greenpointers" }] }, pulse),
    "2026-08-04",
  );
  assert.equal(sourceCheckedDate({ sourceLinks: [] }, pulse), null);
  assert.equal(sourceCheckedDate({ sourceLinks: [{ publisher: "Nobody" }] }, pulse), null);
});

test("missing or empty pulse still falls back to updatedAt", () => {
  const card = { updatedAt: "2026-07-08", sourceLinks: [{ publisher: "Greenpointers" }] };
  assert.equal(sourceCheckedDate(card, null), "2026-07-08");
  assert.equal(sourceCheckedDate(card, {}), "2026-07-08");
});

test("formatChecked: month-day within the current year, year appended across years", () => {
  const now = new Date("2026-08-08T12:00:00-04:00");
  assert.equal(formatChecked("2026-08-06", now), "Aug 6");
  assert.equal(formatChecked("2025-12-30", now), "Dec 30, 2025");
  assert.equal(formatChecked(null, now), null);
  assert.equal(formatChecked("not-a-date", now), null);
});
