import test from "node:test";
import assert from "node:assert/strict";
import { GTRAIN_WINDOWS, nextGtrainWindow, bannerPhase } from "./gtrainBanner.js";

// The 2026-07-21 live-page bug: a hard-coded "through Fri Jul 17" banner was
// still showing on Jul 21. The banner must derive its state from sourced
// windows and disappear on its own. The 2026-08-02 charter added the other
// half: it must also come BACK for the next sourced window, and never show
// anything more than 7 days out.
const W1 = {
  startsAt: "2026-08-07T21:45:00-04:00",
  endsAt: "2026-08-10T05:00:00-04:00",
};
const W2 = {
  startsAt: "2026-08-17T21:45:00-04:00",
  endsAt: "2026-08-21T05:00:00-04:00",
};

test("beyond the 7-day horizon → null (no banner, charter rule 2)", () => {
  assert.equal(bannerPhase(new Date("2026-07-23T12:00:00-04:00"), W1), null);
  assert.equal(bannerPhase(new Date("2026-07-31T21:44:00-04:00"), W1), null);
});

test("inside the week but outside 48h → distant (compact chip)", () => {
  assert.equal(bannerPhase(new Date("2026-07-31T21:46:00-04:00"), W1), "distant");
  assert.equal(bannerPhase(new Date("2026-08-05T21:44:00-04:00"), W1), "distant");
});

test("within 48h of the start → near (full banner)", () => {
  assert.equal(bannerPhase(new Date("2026-08-05T21:46:00-04:00"), W1), "near");
  assert.equal(bannerPhase(new Date("2026-08-07T12:00:00-04:00"), W1), "near");
});

test("inside the window → active (including the exact start instant)", () => {
  assert.equal(bannerPhase(new Date("2026-08-08T02:00:00-04:00"), W1), "active");
  assert.equal(bannerPhase(new Date("2026-08-07T21:45:00-04:00"), W1), "active");
});

test("at and after the end → null (banner hides itself)", () => {
  assert.equal(bannerPhase(new Date("2026-08-10T05:00:00-04:00"), W1), null);
  assert.equal(bannerPhase(new Date("2026-08-11T09:00:00-04:00"), W1), null);
});

// Multi-window: the banner tracks the NEXT window still in the future, and
// rolls over the moment one ends — including the back-to-back Fri Aug 21
// overnights→weekend seam.
test("nextGtrainWindow picks the first window whose end is still ahead", () => {
  assert.equal(nextGtrainWindow(new Date("2026-08-05T12:00:00-04:00")), GTRAIN_WINDOWS[0]);
  assert.equal(nextGtrainWindow(new Date("2026-08-10T06:00:00-04:00")), GTRAIN_WINDOWS[1]);
  assert.equal(nextGtrainWindow(new Date("2026-08-21T06:00:00-04:00")), GTRAIN_WINDOWS[2]);
  assert.equal(nextGtrainWindow(new Date("2026-08-24T06:00:00-04:00")), null);
});

test("after one window ends, the phase re-gates against the next (no dark gap, no early noise)", () => {
  // Mon Aug 10, 6 AM: Aug 7–10 just ended; Aug 17–21 nights start in ~7.7 days → silence.
  const t1 = new Date("2026-08-10T06:00:00-04:00");
  assert.equal(bannerPhase(t1, nextGtrainWindow(t1)), null);
  // Wed Aug 12: inside the week before the overnights → chip.
  const t2 = new Date("2026-08-12T12:00:00-04:00");
  assert.equal(bannerPhase(t2, nextGtrainWindow(t2)), "distant");
  // Fri Aug 21, 8 AM: overnights ended at 5 AM, weekend closure starts 9:45 PM → near.
  const t3 = new Date("2026-08-21T08:00:00-04:00");
  assert.equal(bannerPhase(t3, nextGtrainWindow(t3)), "near");
  // After the last window → null for good.
  const t4 = new Date("2026-09-01T09:00:00-04:00");
  assert.equal(bannerPhase(t4, nextGtrainWindow(t4)), null);
});

test("bannerPhase with no window → null", () => {
  assert.equal(bannerPhase(new Date("2026-09-01T09:00:00-04:00"), null), null);
});

// Shipped windows are the MTA-sourced Greenpoint-closing closures (page
// updated Jul 23, sourced 2026-08-02), frozen, in chronological order.
test("shipped windows match the MTA source and are frozen", () => {
  assert.ok(Object.isFrozen(GTRAIN_WINDOWS));
  assert.equal(GTRAIN_WINDOWS.length, 3);
  assert.deepEqual(
    GTRAIN_WINDOWS.map((w) => [w.startsAt, w.endsAt]),
    [
      ["2026-08-07T21:45:00-04:00", "2026-08-10T05:00:00-04:00"],
      ["2026-08-17T21:45:00-04:00", "2026-08-21T05:00:00-04:00"],
      ["2026-08-21T21:45:00-04:00", "2026-08-24T05:00:00-04:00"],
    ],
  );
  for (const w of GTRAIN_WINDOWS) {
    assert.ok(Object.isFrozen(w));
    assert.ok(Date.parse(w.endsAt) > Date.parse(w.startsAt));
    assert.ok(w.shortDates && w.dates && w.stops && w.shuttle);
  }
});
