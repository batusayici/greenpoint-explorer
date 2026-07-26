import test from "node:test";
import assert from "node:assert/strict";
import { formatWindow } from "./eventWindow.js";

// The when-line owns the specific date/time; it must never repeat a date or
// show a sentinel clock value. Fixtures are the real seed windows (America/
// New_York). 00:00 = all-day start sentinel; 23:59 = end-of-day sentinel.

test("undated cards have no window", () => {
  assert.equal(formatWindow({}), null);
});

test("same-day start time + end-of-day sentinel shows a single instant, no repeated date", () => {
  // mt-carmel: was "Jul 8, 7:00 PM → Jul 8"
  assert.equal(
    formatWindow({ startsAt: "2026-07-08T19:00:00-04:00", endsAt: "2026-07-08T23:59:00-04:00" }),
    "Jul 8, 7:00 PM",
  );
});

test("same-day real start and end collapse to one date with a time range", () => {
  // move-meditate: was "Jul 9, 7:15 PM → Jul 9, 8:30 PM"
  assert.equal(
    formatWindow({ startsAt: "2026-07-09T19:15:00-04:00", endsAt: "2026-07-09T20:30:00-04:00" }),
    "Jul 9, 7:15–8:30 PM",
  );
  // community-pilates: shared AM meridiem
  assert.equal(
    formatWindow({ startsAt: "2026-07-12T08:45:00-04:00", endsAt: "2026-07-12T09:45:00-04:00" }),
    "Jul 12, 8:45–9:45 AM",
  );
});

test("multi-day all-day window drops both sentinel clocks", () => {
  // yoseka: was "Jul 4, 12:00 AM → Jul 12"
  assert.equal(
    formatWindow({ startsAt: "2026-07-04T00:00:00-04:00", endsAt: "2026-07-12T23:59:00-04:00" }),
    "Jul 4 → Jul 12",
  );
});

test("multi-day timed start keeps the start time, drops the end sentinel", () => {
  // womens-pinball: real 5 PM Friday start, runs through the weekend
  assert.equal(
    formatWindow({ startsAt: "2026-07-10T17:00:00-04:00", endsAt: "2026-07-12T23:59:00-04:00" }),
    "Jul 10, 5:00 PM → Jul 12",
  );
});

test("end-only card reads 'Through <date>'", () => {
  assert.equal(formatWindow({ endsAt: "2026-07-19T23:59:00-04:00" }), "Through Jul 19");
});

test("start-only card reads 'From <instant>'", () => {
  assert.equal(formatWindow({ startsAt: "2026-07-10T17:00:00-04:00" }), "From Jul 10, 5:00 PM");
});

// 2026-07-23 (UX eval F23, decision Q4-B): the header kicker becomes the
// edition date — the rolling week the feed actually covers, self-maintaining.
test("editionLabel: same-month week compresses, cross-month spells both", async () => {
  const { editionLabel } = await import("./eventWindow.js");
  assert.equal(editionLabel(new Date("2026-07-23T12:00:00-04:00")), "Jul 23–29");
  assert.equal(editionLabel(new Date("2026-07-30T12:00:00-04:00")), "Jul 30 – Aug 5");
});
