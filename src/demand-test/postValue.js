// Limited launch (2026-07-15) — the post-value email prompt gate. The launch
// deliberately ships no accounts: the commitment signal is an email signup
// offered only AFTER a visitor has demonstrably gotten value — a 2nd card
// open or a 1st action tap — so a submission measures pull, not friction
// tolerance. Pure logic here (node --test); JulyApp owns the React wiring and
// localStorage persistence.
import { EVENTS } from "./trackEvents.js";

// One localStorage key covers both outcomes (signed up or dismissed): either
// way the prompt has spent its one chance for this browser.
export const POST_VALUE_DONE_KEY = "july-postvalue-done";

export function createPostValueGate({ done = false } = {}) {
  let opens = 0;
  let actions = 0;
  let spent = done;
  return {
    // Feed every tracked event through; returns true exactly once, at the
    // moment the value threshold is crossed.
    record(name) {
      if (spent) return false;
      if (name === EVENTS.CARD_OPEN) opens += 1;
      else if (name === EVENTS.ACTION_TAP) actions += 1;
      else return false;
      if (opens >= 2 || actions >= 1) {
        spent = true;
        return true;
      }
      return false;
    },
  };
}
