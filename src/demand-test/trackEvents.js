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
});

const NAMES = new Set(Object.values(EVENTS));

let transport = null;

export function bindTransport(fn) {
  transport = fn;
}

export function trackEvent(name, data = {}) {
  if (!NAMES.has(name)) throw new Error(`unknown analytics event "${name}"`);
  for (const [key, value] of Object.entries(data)) {
    const t = typeof value;
    if (t !== "string" && t !== "number" && t !== "boolean") {
      throw new Error(`event "${name}": property "${key}" must be a primitive`);
    }
  }
  try {
    transport?.(name, data);
  } catch (error) {
    // A dead analytics endpoint must never break a tester's tap.
    console.error("[trackEvent]", error);
  }
}
