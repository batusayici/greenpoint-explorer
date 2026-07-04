import test from "node:test";
import assert from "node:assert/strict";
import { EVENTS, bindTransport, trackEvent } from "./trackEvents.js";

test("forwards a known event with its properties to the bound transport", () => {
  const calls = [];
  bindTransport((name, data) => calls.push({ name, data }));
  trackEvent(EVENTS.PIN_TAP, { cardId: "core-press", kind: "business" });
  assert.deepEqual(calls, [{ name: "pin_tap", data: { cardId: "core-press", kind: "business" } }]);
});

test("exposes the eight agreed tap events by stable wire name", () => {
  // related_tap + source_tap added 2026-07-03: the place-graph traversal and
  // the source-credibility link are go/no-go evidence, same as action taps.
  assert.deepEqual(EVENTS, {
    PIN_TAP: "pin_tap",
    CARD_OPEN: "card_open",
    FILTER_TAP: "filter_tap",
    TODAY_TOGGLE: "today_toggle",
    ACTION_TAP: "action_tap",
    CTA_TAP: "cta_tap",
    RELATED_TAP: "related_tap",
    SOURCE_TAP: "source_tap",
  });
});

test("throws on an unknown event name (typo guard)", () => {
  bindTransport(() => {});
  assert.throws(() => trackEvent("pin_tapp"), /unknown analytics event/);
});

test("throws on non-primitive event data (dashboard cardinality guard)", () => {
  bindTransport(() => {});
  assert.throws(() => trackEvent(EVENTS.CARD_OPEN, { card: { id: "x" } }), /primitive/);
});

test("is a safe no-op when no transport is bound", () => {
  bindTransport(null);
  trackEvent(EVENTS.CTA_TAP, { cta: "signup" }); // must not throw
});

test("a throwing transport never breaks the calling tap handler", () => {
  bindTransport(() => {
    throw new Error("network down");
  });
  trackEvent(EVENTS.FILTER_TAP, { filter: "events" }); // must not throw
});
