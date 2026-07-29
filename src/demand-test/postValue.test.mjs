import test from "node:test";
import assert from "node:assert/strict";
import { createPostValueGate, POST_VALUE_DONE_KEY } from "./postValue.js";
import { EVENTS } from "./trackEvents.js";

test("fires once on the 2nd card open (value demonstrated by browsing)", () => {
  const gate = createPostValueGate();
  assert.equal(gate.record(EVENTS.CARD_OPEN), false, "1st open: not yet");
  assert.equal(gate.record(EVENTS.CARD_OPEN), true, "2nd open: prompt");
  assert.equal(gate.record(EVENTS.CARD_OPEN), false, "never twice");
});

test("fires once on the 1st action tap (value demonstrated by acting)", () => {
  const gate = createPostValueGate();
  assert.equal(gate.record(EVENTS.ACTION_TAP), true);
  assert.equal(gate.record(EVENTS.CARD_OPEN), false);
  assert.equal(gate.record(EVENTS.ACTION_TAP), false);
});

test("non-value events (filters, pins) never trigger it", () => {
  const gate = createPostValueGate();
  for (const name of [EVENTS.FILTER_TAP, EVENTS.PIN_TAP, EVENTS.CTA_TAP, EVENTS.SOURCE_TAP]) {
    assert.equal(gate.record(name), false, name);
  }
  assert.equal(gate.record(EVENTS.CARD_OPEN), false, "still only 1 open");
});

test("a browser that already saw it (localStorage done flag) never gets it again", () => {
  const gate = createPostValueGate({ done: true });
  assert.equal(gate.record(EVENTS.CARD_OPEN), false);
  assert.equal(gate.record(EVENTS.CARD_OPEN), false);
  assert.equal(gate.record(EVENTS.ACTION_TAP), false);
});

test("the storage key is stable (changing it would re-prompt every tester)", () => {
  assert.equal(POST_VALUE_DONE_KEY, "july-postvalue-done");
});

// Follow (DECISION_LOG 2026-07-28): the post-value ask names what the reader
// was just doing, so the object is concrete rather than an abstract "pick a
// topic". Active lens wins; otherwise the place of the card that tripped the
// gate; otherwise all of Greenpoint (the footer's ungated entry).
test("followTarget names the active lens when one is on", async () => {
  const { followTarget } = await import("./postValue.js");
  assert.deepEqual(followTarget({ filterId: "family_kids" }), {
    kind: "lens", id: "family_kids", label: "Family & Kids",
  });
});

test("followTarget falls back to the trigger card's place on the all lens", async () => {
  const { followTarget } = await import("./postValue.js");
  const card = { id: "falu-house-club", locationName: "Falu House" };
  assert.deepEqual(followTarget({ filterId: "all", card }), {
    kind: "place", id: "falu-house-club", label: "Falu House",
  });
});

test("followTarget falls back to all of Greenpoint with no lens and no card", async () => {
  const { followTarget } = await import("./postValue.js");
  assert.deepEqual(followTarget(), { kind: "all", id: "all", label: "Greenpoint" });
  assert.deepEqual(followTarget({ filterId: "all", card: null }), { kind: "all", id: "all", label: "Greenpoint" });
});

test("followRef encodes the target as kind:id for the form's hidden field", async () => {
  const { followTarget, followRef } = await import("./postValue.js");
  assert.equal(followRef(followTarget({ filterId: "live_music" })), "lens:live_music");
  assert.equal(followRef(followTarget({ filterId: "all", card: { id: "troost", locationName: "Troost" } })), "place:troost");
  assert.equal(followRef(followTarget()), "all");
});
