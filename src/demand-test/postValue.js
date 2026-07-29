// Limited launch (2026-07-15) — the post-value email prompt gate. The launch
// deliberately ships no accounts: the commitment signal is an email signup
// offered only AFTER a visitor has demonstrably gotten value — a 2nd card
// open or a 1st action tap — so a submission measures pull, not friction
// tolerance. Pure logic here (node --test); JulyApp owns the React wiring and
// localStorage persistence.
import { EVENTS } from "./trackEvents.js";
import { FILTERS } from "./filterCards.js";

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

// The Follow ask (DECISION_LOG 2026-07-28: Follow replaced the Monday digest
// as the resident CTA). §0 gives it one verb and two objects — a lens or a
// place — and the one-egg rule says it may only appear once, after value. So
// the object is taken from context rather than asked as an abstract question:
// whatever the reader was just doing is what we offer to follow.
//   active lens → that lens · all-lens → the place on the card that tripped
//   the gate · neither (the footer's ungated entry) → all of Greenpoint.
export function followTarget({ filterId = "all", card = null } = {}) {
  if (filterId && filterId !== "all") {
    const lens = FILTERS.find((f) => f.id === filterId);
    if (lens) return { kind: "lens", id: lens.id, label: lens.label };
  }
  if (card?.locationName) return { kind: "place", id: card.id, label: card.locationName };
  return { kind: "all", id: "all", label: "Greenpoint" };
}

// Wire form for the target: what rides into the Tally hidden field and the
// `object` property on the tap. R1 segments read off this (growth-engine §2);
// anyone who arrives without one is the digest control arm.
export function followRef(target) {
  return target.kind === "all" ? "all" : `${target.kind}:${target.id}`;
}
