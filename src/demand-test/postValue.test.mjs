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
