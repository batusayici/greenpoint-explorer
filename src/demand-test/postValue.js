// The Follow ask's object logic. Pure (node --test); CardPanel renders it and
// JulyApp holds the per-lens dismiss state.
//
// RETIRED 2026-07-30: the post-value gate (`createPostValueGate`, and the
// `july-postvalue-done` localStorage key). From 2026-07-15 the ask appeared
// only after a visitor demonstrated value — a 2nd card open or a 1st action
// tap — so a signup measured pull rather than friction tolerance. Batu killed
// it after using the built version: "too annoying once you use it. feels like
// a spammy popup." A behavioural trigger is what makes an element read as a
// popup, however quiet its styling, because it materialises in response to
// what the reader just did. The Follow row is now a static part of the lens.
//
// What that costs, stated plainly: a signup no longer proves the reader got
// value first, so the number is category interest rather than post-value pull.
// That is an acceptable trade while the ask is a personalization probe — the
// thing being measured IS category interest. If the gate is ever wanted back,
// it is in git history at 5412473.
import { FILTERS } from "./filterCards.js";

// The Follow ask (DECISION_LOG 2026-07-28: Follow replaced the Monday digest
// as the resident CTA). §0 gives it one verb and the one-egg rule says it may
// only appear once, after value.
//
// LENS-ONLY (Batu, 2026-07-30). The ask now takes exactly one object — the
// active category lens — and renders nothing at all when none is selected:
//
//   active lens → that lens · no lens → no ask (the footer's ungated
//   "Follow Greenpoint" is the broadcast arm and covers that reader).
//
// Two things drove the narrowing. First, purpose: this ask is now an interest
// probe for PERSONALIZATION, so every impression should carry a category the
// reader chose. A Greenpoint-wide follow mixed generic-digest intent into the
// same metric and made the signal unreadable.
//
// Second, place-follow was structurally unsound and is withdrawn. The
// 2026-07-29 category allowlist was necessary but not sufficient: a
// category-VALID card can still carry a locationName that is not a followable
// entity, because locationName does two jobs — venue display on the map (where
// "Rotating bar meetup — announced on Instagram" is genuinely useful) and
// follow object (where it is nonsense). Live examples that reached the ask:
// "Follow (eavesdrop)" (literal open-paren), "Follow The Little Dance School
// (Triskelion Arts)", and the 44-char rotating-meetup string. Rather than pile
// heuristics onto a field that was never a name, the place object is gone.
// Reinstating it needs a real venue-identity field, not a normalizer.
export function followTarget({ filterId = "all" } = {}) {
  if (filterId && filterId !== "all") {
    const lens = FILTERS.find((f) => f.id === filterId);
    if (lens) return { kind: "lens", id: lens.id, label: lens.label };
  }
  return null;
}

// Wire form for the target: what rides into the Tally hidden field and the
// `object` property on the tap. R1 segments read off this (growth-engine §2);
// anyone who arrives without one is the digest control arm.
// Since 2026-07-30 followTarget only ever yields a lens, so this returns
// "lens:<id>" in practice — the bare "all" branch stays because the footer's
// ungated CTA passes that ref literally, and R1 reads it as the control arm.
export function followRef(target) {
  return target.kind === "all" ? "all" : `${target.kind}:${target.id}`;
}
