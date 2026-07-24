import test from "node:test";
import assert from "node:assert/strict";
import { todayPillNeeded } from "./todayPill.js";

// V3-B (first-visit test, 2026-07-24): chips preserve scroll, so a mid-scroll
// filter tap can open the new lens at an arbitrary day with today hidden above
// the viewport. The pill offers the way back; this rule decides when it earns
// its place.

test("desktop (list is its own scroller): pill appears once meaningfully scrolled", () => {
  assert.equal(todayPillNeeded({ ownScroller: true, scrollTop: 250 }), true);
  assert.equal(todayPillNeeded({ ownScroller: true, scrollTop: 40 }), false);
});

test("mobile page flow: pill appears when the feed top is above the anchored chrome", () => {
  assert.equal(todayPillNeeded({ ownScroller: false, listTop: -300, chromeBottom: 120 }), true);
  assert.equal(todayPillNeeded({ ownScroller: false, listTop: 400, chromeBottom: 120 }), false);
});

test("mobile: a feed top just at the chrome line does not trigger the pill", () => {
  assert.equal(todayPillNeeded({ ownScroller: false, listTop: 118, chromeBottom: 120 }), false);
});
