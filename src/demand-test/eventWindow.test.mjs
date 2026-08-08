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

// Punch-list P1 #3 corollary: the detail when-line renders for spans only.
test("isSpan: multi-day and open-ended windows are spans, same-day is not", async () => {
  const { isSpan } = await import("./eventWindow.js");
  assert.equal(isSpan({ startsAt: "2026-07-09T19:15:00-04:00", endsAt: "2026-07-09T20:30:00-04:00" }), false);
  assert.equal(isSpan({ startsAt: "2026-07-09T19:15:00-04:00" }), true);
  assert.equal(isSpan({ endsAt: "2026-08-15T23:59:00-04:00" }), true);
  assert.equal(isSpan({ startsAt: "2026-07-09T00:00:00-04:00", endsAt: "2026-08-15T23:59:00-04:00" }), true);
  assert.equal(isSpan({}), false);
});

// ── Recurrence (2026-08-08) ────────────────────────────────────────────────
// `recurring: true` was a bare boolean carrying two different meanings: a
// weekly event (has a day) and a standing offer (has none). Without a stated
// day the feed could not answer "what's on this Saturday", so every recurring
// card was shelved — burying the Saturday kids' events Batu reported missing.
// `recurrence.days` states the day; these tests pin what it must mean.
import { occursOn, nextOccurrence, RECURRENCE_DAYS, recurrenceLabel } from "./eventWindow.js";

// Real seed card: Saturday sewing camp, Aug 1–22, 11am–2pm.
const sewing = {
  startsAt: "2026-08-01T11:00:00-04:00",
  endsAt: "2026-08-22T14:00:00-04:00",
  recurring: true,
  recurrence: { days: ["sat"] },
};
// Real seed card: standing offer, no stated day.
const standingDeal = { endsAt: "2026-08-09T23:59:00-04:00", recurring: true };

const ny = (ymd) => new Date(`${ymd}T12:00:00-04:00`);

test("a weekly card occurs on its stated day inside the span", () => {
  assert.equal(occursOn(sewing, ny("2026-08-08")), true); // Saturday
  assert.equal(occursOn(sewing, ny("2026-08-15")), true); // Saturday
});

test("a weekly card does NOT occur on other days inside the span", () => {
  // The bug this fixes in the other direction: the Today pill passed every
  // recurring card unconditionally, so Tuesday yoga read as "today" on a Sat.
  assert.equal(occursOn(sewing, ny("2026-08-07")), false); // Friday
  assert.equal(occursOn(sewing, ny("2026-08-09")), false); // Sunday
});

test("a weekly card does not occur outside its span, even on the right day", () => {
  assert.equal(occursOn(sewing, ny("2026-07-25")), false); // Sat, before start
  assert.equal(occursOn(sewing, ny("2026-08-29")), false); // Sat, after end
});

test("a card with no stated days falls back to span containment", () => {
  // Standing offers keep the old meaning — available whenever, not on a day.
  assert.equal(occursOn(standingDeal, ny("2026-08-08")), true);
  assert.equal(occursOn(standingDeal, ny("2026-08-10")), false); // past endsAt
});

test("multi-day recurrence matches every stated day", () => {
  // hana-bottomless-makgeolli: "Thursdays 5–11pm, Sundays 2–8pm"
  const hana = { endsAt: "2026-08-22T23:59:00-04:00", recurring: true, recurrence: { days: ["thu", "sun"] } };
  assert.equal(occursOn(hana, ny("2026-08-13")), true); // Thu
  assert.equal(occursOn(hana, ny("2026-08-16")), true); // Sun
  assert.equal(occursOn(hana, ny("2026-08-14")), false); // Fri
});

test("nextOccurrence finds today first, then the following week", () => {
  assert.equal(nextOccurrence(sewing, ny("2026-08-08")), "2026-08-08"); // today counts
  assert.equal(nextOccurrence(sewing, ny("2026-08-09")), "2026-08-15");
  assert.equal(nextOccurrence(sewing, ny("2026-08-23")), null); // span exhausted
});

// 2026-08-08, Batu on stoopwise.com at 7:37pm: the Today group led with the
// McCarren Greenmarket (Saturdays 8am–3pm), the bird club (9–10am) and the
// runners (9:30–11am) — all finished that morning. A weekly card's endsAt is
// the end of its SPAN (Aug 29), so isExpiredCard can't retire one sitting;
// the occurrence's own window is the TIME OF DAY of startsAt…endsAt.
const at = (iso) => new Date(iso);

test("today's occurrence stops counting once its clock window closes", () => {
  // Sewing camp Saturdays 11am–2pm.
  assert.equal(nextOccurrence(sewing, at("2026-08-08T10:00:00-04:00")), "2026-08-08"); // before
  assert.equal(nextOccurrence(sewing, at("2026-08-08T13:00:00-04:00")), "2026-08-08"); // underway
  assert.equal(nextOccurrence(sewing, at("2026-08-08T19:37:00-04:00")), "2026-08-15"); // over → next week
});

test("a finished occurrence rolls forward even on the span's last day", () => {
  assert.equal(nextOccurrence(sewing, at("2026-08-22T19:00:00-04:00")), null);
});

test("an unsourced end time (23:59 sentinel) expires an hour past start", () => {
  // Matches isExpiredCard's grace for one-off cards: long enough to catch a
  // show you're late to, short enough that the evening feed isn't a list of
  // things already underway.
  const yoga = {
    startsAt: "2026-08-04T07:00:00-04:00",
    endsAt: "2026-08-25T23:59:00-04:00",
    recurring: true,
    recurrence: { days: ["tue"] },
  };
  assert.equal(nextOccurrence(yoga, at("2026-08-11T07:45:00-04:00")), "2026-08-11");
  assert.equal(nextOccurrence(yoga, at("2026-08-11T08:30:00-04:00")), "2026-08-18");
});

test("an all-day weekly card (00:00 start sentinel) runs to midnight", () => {
  // No stated clock means no claim about when it ends — the truth rules
  // forbid inventing one.
  const allDay = {
    startsAt: "2026-08-08T00:00:00-04:00",
    endsAt: "2026-08-29T23:59:00-04:00",
    recurring: true,
    recurrence: { days: ["sat"] },
  };
  assert.equal(nextOccurrence(allDay, at("2026-08-08T23:00:00-04:00")), "2026-08-08");
});

test("an occurrence crossing midnight is not retired at its start", () => {
  const lateSet = {
    startsAt: "2026-08-08T22:00:00-04:00",
    endsAt: "2026-08-29T01:00:00-04:00",
    recurring: true,
    recurrence: { days: ["sat"] },
  };
  assert.equal(nextOccurrence(lateSet, at("2026-08-08T23:30:00-04:00")), "2026-08-08");
});

test("recurrence days are validated tokens in week order", () => {
  assert.deepEqual(RECURRENCE_DAYS, ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]);
});

test("recurrenceLabel names the rhythm for the row, without a date", () => {
  assert.equal(recurrenceLabel(sewing), "Every Saturday");
  // Week order, not authored order — the label must not depend on how the
  // ingest happened to type the days.
  assert.equal(recurrenceLabel({ recurring: true, recurrence: { days: ["thu", "sun"] } }), "Sundays & Thursdays");
  assert.equal(recurrenceLabel(standingDeal), null); // no stated day, no claim
});
