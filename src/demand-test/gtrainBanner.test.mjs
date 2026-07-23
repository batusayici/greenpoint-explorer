import test from "node:test";
import assert from "node:assert/strict";
import { GTRAIN_WINDOW, bannerPhase } from "./gtrainBanner.js";

// The 2026-07-21 live-page bug: a hard-coded "through Fri Jul 17" banner was
// still showing on Jul 21. The banner must derive its state from the sourced
// window and disappear on its own.
const W = {
  startsAt: "2026-08-07T21:45:00-04:00",
  endsAt: "2026-08-10T05:00:00-04:00",
};

// 2026-07-23 (UX eval F24, decision A): prominence follows proximity — a
// closure 16 days out is a one-line chip, the final week gets the full
// banner, the closure weekend is the alert.
test("more than 7 days before the window → distant (compact chip)", () => {
  assert.equal(bannerPhase(new Date("2026-07-23T12:00:00-04:00"), W), "distant");
  assert.equal(bannerPhase(new Date("2026-07-31T21:44:00-04:00"), W), "distant");
});

test("within 7 days of the start → near (full banner)", () => {
  assert.equal(bannerPhase(new Date("2026-07-31T21:46:00-04:00"), W), "near");
  assert.equal(bannerPhase(new Date("2026-08-07T12:00:00-04:00"), W), "near");
});

test("shortDates carries the chip-sized wording for the sourced window", () => {
  assert.equal(GTRAIN_WINDOW.shortDates, "Aug 7–10");
});

test("inside the window → active (including the exact start instant)", () => {
  assert.equal(bannerPhase(new Date("2026-08-08T02:00:00-04:00"), W), "active");
  assert.equal(bannerPhase(new Date("2026-08-07T21:45:00-04:00"), W), "active");
});

test("at and after the end → null (banner hides itself)", () => {
  assert.equal(bannerPhase(new Date("2026-08-10T05:00:00-04:00"), W), null);
  assert.equal(bannerPhase(new Date("2026-08-11T09:00:00-04:00"), W), null);
});

test("shipped window is the MTA-sourced Aug 7–10 closure, frozen", () => {
  assert.equal(GTRAIN_WINDOW.startsAt, "2026-08-07T21:45:00-04:00");
  assert.equal(GTRAIN_WINDOW.endsAt, "2026-08-10T05:00:00-04:00");
  assert.ok(Object.isFrozen(GTRAIN_WINDOW));
});
