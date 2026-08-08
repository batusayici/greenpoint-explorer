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

// Four rows is one phone-screen of feed at 375px — enough that the reader has
// judged whether this lens carries anything for them before being asked to
// subscribe to it.
export const FOLLOW_MIN_CARDS = 4;

// Where the static Follow row sits in the feed. Returns the index of the group
// AFTER which it renders, or -1 for no slot at all.
//
// It used to be hardcoded to group 0. That encoded the intent ("far enough down
// that the reader has passed real content") only for fat lenses: under All the
// first day carries ~13 cards, so the ask landed well past real content. But the
// ask is lens-only, and a thin lens inverts it — Family & Kids opened with a
// single card on 2026-08-08, so the ask fired after ONE row, which is the exact
// thing the static-slot decision was meant to prevent.
//
// Still static, still not a behavioural trigger: this reads only the lens's own
// groups, so the position is fixed the moment the lens is chosen and never moves
// in response to what the reader does.
//
// Below the minimum in total, it degenerates to the end of the feed — the same
// "you've read it, here's how to keep getting it" order the slot always had.
export function followSlotIndex(groups, minCards = FOLLOW_MIN_CARDS) {
  if (!groups || groups.length === 0) return -1;
  let seen = 0;
  for (let i = 0; i < groups.length; i += 1) {
    seen += groups[i].cards?.length ?? 0;
    if (seen >= minCards) return i;
  }
  return groups.length - 1;
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
