import test from "node:test";
import assert from "node:assert/strict";
import { EVENTS, bindTransport, trackEvent, setEventContext, onEvent } from "./trackEvents.js";

test("forwards a known event with its properties to the bound transport", () => {
  const calls = [];
  bindTransport((name, data) => calls.push({ name, data }));
  trackEvent(EVENTS.PIN_TAP, { cardId: "core-press", kind: "business" });
  assert.deepEqual(calls, [{ name: "pin_tap", data: { cardId: "core-press", kind: "business" } }]);
});

test("exposes the twelve agreed events by stable wire name", () => {
  // related_tap + source_tap added 2026-07-03: the place-graph traversal and
  // the source-credibility link are go/no-go evidence, same as action taps.
  // feedback_tap added 2026-07-15: the limited-launch feedback channel.
  // return_visit added 2026-07-26 (growth-engine R0): the retention sensor —
  // the PMF bar is denominated in it.
  // alert_tap added 2026-07-26: the community-alert banner tap (banner charter).
  // submit_tap added 2026-07-28 (L5): the business submission entry — the
  // supply-gate sensor (≥5 proactive actors, ops plan 3.3).
  // map_unavailable added 2026-08-13: fires when the map can't initialize and
  // the page degrades to the feed. The only sensor for how many readers ever
  // meet the no-map layout — without it we'd be guessing whether that path is
  // one unusual browser or a measurable slice worth designing harder for.
  assert.deepEqual(EVENTS, {
    PIN_TAP: "pin_tap",
    CARD_OPEN: "card_open",
    FILTER_TAP: "filter_tap",
    ACTION_TAP: "action_tap",
    CTA_TAP: "cta_tap",
    RELATED_TAP: "related_tap",
    SOURCE_TAP: "source_tap",
    FEEDBACK_TAP: "feedback_tap",
    RETURN_VISIT: "return_visit",
    ALERT_TAP: "alert_tap",
    SUBMIT_TAP: "submit_tap",
    MAP_UNAVAILABLE: "map_unavailable",
  });
});

test("event context (?src= channel) rides on every event; per-event data wins", () => {
  const calls = [];
  bindTransport((name, data) => calls.push({ name, data }));
  setEventContext({ src: "wave1", junk: { drop: "me" } });
  trackEvent(EVENTS.CARD_OPEN, { cardId: "core-press" });
  trackEvent(EVENTS.CTA_TAP, { cta: "signup", src: "override" });
  assert.deepEqual(calls, [
    { name: "card_open", data: { src: "wave1", cardId: "core-press" } },
    { name: "cta_tap", data: { cta: "signup", src: "override" } },
  ]);
  setEventContext({}); // reset for other tests
});

test("onEvent listeners observe events and a throwing listener never breaks a tap", () => {
  bindTransport(null);
  const seen = [];
  const off = onEvent((name, data) => seen.push({ name, data }));
  const offBroken = onEvent(() => {
    throw new Error("listener bug");
  });
  trackEvent(EVENTS.ACTION_TAP, { cardId: "x", actionType: "visit" });
  assert.deepEqual(seen, [{ name: "action_tap", data: { cardId: "x", actionType: "visit" } }]);
  off();
  offBroken();
  trackEvent(EVENTS.ACTION_TAP, { cardId: "y", actionType: "visit" });
  assert.equal(seen.length, 1, "unsubscribed listener stops observing");
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
