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
  // Aug 24 5 AM used to be the end of the list; the Sep 11–14 weekend now
  // follows it (added 2026-08-13 from the alerts feed).
  assert.equal(nextGtrainWindow(new Date("2026-08-24T06:00:00-04:00")), GTRAIN_WINDOWS[3]);
  // 2026-08-27: the alerts feed added two more — the Sep 14–18 overnights,
  // back-to-back with the Sep 11–14 weekend, and the Sep 25–28 weekend.
  assert.equal(nextGtrainWindow(new Date("2026-09-14T06:00:00-04:00")), GTRAIN_WINDOWS[4]);
  assert.equal(nextGtrainWindow(new Date("2026-09-18T06:00:00-04:00")), GTRAIN_WINDOWS[5]);
  assert.equal(nextGtrainWindow(new Date("2026-09-28T06:00:00-04:00")), null);
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
  // Sep 1: the Sep 11–14 window exists but is 10 days out — still silence.
  // The 7-day horizon is what keeps a known-but-distant closure off the slot.
  const t4 = new Date("2026-09-01T09:00:00-04:00");
  assert.equal(bannerPhase(t4, nextGtrainWindow(t4)), null);
  // Mon Sep 14, 9 AM: the Sep 11–14 weekend ended at 5 AM and the overnights
  // start at 9:45 PM the same day → near, the same back-to-back seam as
  // Aug 21 (added 2026-08-27).
  const t5 = new Date("2026-09-14T09:00:00-04:00");
  assert.equal(bannerPhase(t5, nextGtrainWindow(t5)), "near");
  // Fri Sep 18, 9 AM: overnights done, Sep 25–28 is 7.5 days out → silence.
  const t6 = new Date("2026-09-18T09:00:00-04:00");
  assert.equal(bannerPhase(t6, nextGtrainWindow(t6)), null);
  // After the LAST window → null for good.
  const t7 = new Date("2026-09-28T09:00:00-04:00");
  assert.equal(bannerPhase(t7, nextGtrainWindow(t7)), null);
});

// The Aug 24 → Sep 11 quiet stretch is a real state, not a bug: MTA has
// announced no Greenpoint closure in it, so the slot correctly frees up for
// the community alert / freshness tiers, then the G returns on its own.
test("the Aug 24 – Sep 11 gap is silent, and the Sep window wakes on its own ramp", () => {
  for (const iso of ["2026-08-25T09:00:00-04:00", "2026-08-31T09:00:00-04:00", "2026-09-03T09:00:00-04:00"]) {
    const t = new Date(iso);
    assert.equal(bannerPhase(t, nextGtrainWindow(t)), null, `${iso} must be quiet`);
  }
  // The horizon edge is INCLUSIVE (`untilStart > HORIZON_MS` → null): a minute
  // past 7 days is silent, exactly 7 days already shows the chip.
  const justOutside = new Date("2026-09-04T21:44:00-04:00");
  assert.equal(bannerPhase(justOutside, nextGtrainWindow(justOutside)), null);
  const exactly7d = new Date("2026-09-04T21:45:00-04:00");
  assert.equal(bannerPhase(exactly7d, nextGtrainWindow(exactly7d)), "distant");
  // Sep 5 → inside the week: chip.
  const chip = new Date("2026-09-05T12:00:00-04:00");
  assert.equal(bannerPhase(chip, nextGtrainWindow(chip)), "distant");
  // Sep 10 noon → inside 48h: full banner.
  const near = new Date("2026-09-10T12:00:00-04:00");
  assert.equal(bannerPhase(near, nextGtrainWindow(near)), "near");
  // Sat Sep 12 → live.
  const live = new Date("2026-09-12T12:00:00-04:00");
  assert.equal(bannerPhase(live, nextGtrainWindow(live)), "active");
});

test("bannerPhase with no window → null", () => {
  assert.equal(bannerPhase(new Date("2026-09-01T09:00:00-04:00"), null), null);
});

// Shipped windows are the MTA-sourced Greenpoint-closing closures (page
// updated Jul 23, sourced 2026-08-02), frozen, in chronological order.
test("shipped windows match the MTA source and are frozen", () => {
  assert.ok(Object.isFrozen(GTRAIN_WINDOWS));
  assert.equal(GTRAIN_WINDOWS.length, 6);
  assert.deepEqual(
    GTRAIN_WINDOWS.map((w) => [w.startsAt, w.endsAt]),
    [
      ["2026-08-07T21:45:00-04:00", "2026-08-10T05:00:00-04:00"],
      ["2026-08-17T21:45:00-04:00", "2026-08-21T05:00:00-04:00"],
      ["2026-08-21T21:45:00-04:00", "2026-08-24T05:00:00-04:00"],
      // Added 2026-08-13 from the MTA alerts feed (mta-g-alerts), which
      // carried it weeks before the G-line article page mentioned September.
      ["2026-09-11T21:45:00-04:00", "2026-09-14T05:00:00-04:00"],
      // Added 2026-08-27 from the same feed: a four-night overnight run
      // ("Structural maintenance") and the weekend after it ("We're
      // modernizing signals"). Both carry the Greenpoint stops G26/G28.
      ["2026-09-14T21:45:00-04:00", "2026-09-18T05:00:00-04:00"],
      ["2026-09-25T21:45:00-04:00", "2026-09-28T05:00:00-04:00"],
    ],
  );
  // Chronological, non-overlapping — nextGtrainWindow's find() assumes it.
  for (let i = 1; i < GTRAIN_WINDOWS.length; i++) {
    assert.ok(
      Date.parse(GTRAIN_WINDOWS[i].startsAt) >= Date.parse(GTRAIN_WINDOWS[i - 1].endsAt),
      `window ${i} must start no earlier than window ${i - 1} ends`,
    );
  }
  for (const w of GTRAIN_WINDOWS) {
    assert.ok(Object.isFrozen(w));
    assert.ok(Date.parse(w.endsAt) > Date.parse(w.startsAt));
    assert.ok(w.shortDates && w.dates && w.stops && w.shuttle);
  }
});
