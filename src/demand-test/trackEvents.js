// Track V instrumentation — the one seam between UI taps and Vercel Web
// Analytics. The ~Jul 15 go/no-go needs *action* evidence (pin/filter/action/
// CTA taps), so event names are locked here: a typo'd name throws instead of
// silently creating a dashboard category nothing aggregates. The vendor import
// lives in main.jsx (bindTransport(track)) so this module runs under
// `node --test` and the transport stays swappable.
export const EVENTS = Object.freeze({
  PIN_TAP: "pin_tap",
  CARD_OPEN: "card_open",
  FILTER_TAP: "filter_tap",
  TODAY_TOGGLE: "today_toggle",
  ACTION_TAP: "action_tap",
  CTA_TAP: "cta_tap",
  RELATED_TAP: "related_tap",
  SOURCE_TAP: "source_tap",
  FEEDBACK_TAP: "feedback_tap",
  RETURN_VISIT: "return_visit",
});

const NAMES = new Set(Object.values(EVENTS));

let transport = null;

export function bindTransport(fn) {
  transport = fn;
}

// Session-wide event context (limited launch, 2026-07-15): main.jsx reads the
// invite link's ?src= channel tag once and sets it here, so every event a
// visitor fires carries its acquisition channel (wave1 vs perri vs …) without
// each call site knowing. Explicit per-event data wins on key collision.
let context = {};

export function setEventContext(ctx = {}) {
  context = {};
  for (const [key, value] of Object.entries(ctx)) {
    const t = typeof value;
    if (t === "string" || t === "number" || t === "boolean") context[key] = value;
  }
}

// In-page observers (post-value prompt gate). Listener errors must never
// break a tap, same contract as the transport.
const listeners = new Set();

export function onEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function trackEvent(name, data = {}) {
  if (!NAMES.has(name)) throw new Error(`unknown analytics event "${name}"`);
  for (const [key, value] of Object.entries(data)) {
    const t = typeof value;
    if (t !== "string" && t !== "number" && t !== "boolean") {
      throw new Error(`event "${name}": property "${key}" must be a primitive`);
    }
  }
  const payload = { ...context, ...data };
  try {
    transport?.(name, payload);
  } catch (error) {
    // A dead analytics endpoint must never break a tester's tap.
    console.error("[trackEvent]", error);
  }
  for (const listener of listeners) {
    try {
      listener(name, payload);
    } catch (error) {
      console.error("[trackEvent listener]", error);
    }
  }
}
