import test from "node:test";
import assert from "node:assert/strict";

// The post-value gate that used to live here (createPostValueGate + the
// july-postvalue-done key, 2026-07-15) was RETIRED 2026-07-30 along with its
// tests: the Follow row no longer has a behavioural trigger at all. Batu's
// verdict on the built version was "too annoying once you use it. feels like a
// spammy popup" — an element that materialises in response to what the reader
// just did reads as a popup however quiet its styling. See postValue.js for
// what the retirement costs, and 5412473 for the implementation.

// Follow, LENS-ONLY since 2026-07-30 (Batu). The ask is now an interest probe
// for personalization, so it takes exactly one object — the category lens the
// reader chose — and renders nothing at all otherwise. A Greenpoint-wide
// follow mixed generic-digest intent into the same metric; the footer's
// ungated CTA carries that reader instead.
test("followTarget names the active lens when one is on", async () => {
  const { followTarget } = await import("./postValue.js");
  assert.deepEqual(followTarget({ filterId: "family_kids" }), {
    kind: "lens", id: "family_kids", label: "Family & Kids",
  });
});

// Place-follow is WITHDRAWN, not merely filtered. The 2026-07-29 category
// allowlist was necessary but not sufficient: a category-VALID card can still
// carry a locationName that is not a followable entity, because the field does
// double duty as map venue display. These four reached the live ask before the
// withdrawal — "Follow (eavesdrop)" with a literal open-paren, a 44-char
// rotating-meetup sentence, a parenthetical venue qualifier. Reinstating a
// place object needs a real venue-identity field, not a normalizer.
test("followTarget never returns a place, whatever the card carries", async () => {
  const { followTarget } = await import("./postValue.js");
  const cards = [
    { id: "falu-house-club", locationName: "Falu House", category: "subscription" },
    { id: "eavesdrop-gig", locationName: "(eavesdrop)", category: "event" },
    { id: "trash-club", locationName: "Rotating bar meetup — announced on Instagram", category: "subscription" },
    { id: "dance", locationName: "The Little Dance School (Triskelion Arts)", category: "subscription" },
    { id: "plume", locationName: "Meeker Avenue Plume area", category: "news" },
  ];
  for (const card of cards) {
    assert.equal(followTarget({ filterId: "all", card }), null, card.id);
  }
  // A lens still wins even when a card is passed — the card is simply ignored.
  assert.deepEqual(followTarget({ filterId: "news", card: cards[0] }), {
    kind: "lens", id: "news", label: "News",
  });
});

test("followTarget yields no ask at all when no lens is selected", async () => {
  const { followTarget } = await import("./postValue.js");
  assert.equal(followTarget(), null);
  assert.equal(followTarget({ filterId: "all" }), null);
  assert.equal(followTarget({ filterId: null }), null);
  // An unknown lens id must not invent an object either.
  assert.equal(followTarget({ filterId: "not_a_lens" }), null);
});

// Slot placement (design crit 2026-08-08). The slot was hardcoded to group 0,
// which encoded "far enough down that the reader has passed real content" only
// for fat lenses. Family & Kids opened with a single card that day, so the ask
// landed after ONE row — the very thing the static-slot decision existed to
// prevent. Placement now reads the lens's own groups; it is still static, since
// it never responds to what the reader does.
test("followSlotIndex clears the minimum before the ask, on a thin lens", async () => {
  const { followSlotIndex } = await import("./postValue.js");
  // The live Family & Kids shape: one card a day for several days.
  const thin = [
    { cards: [1] }, { cards: [1] }, { cards: [1] }, { cards: [1] }, { cards: [1] },
  ];
  // Group 3 is where the 4th card lands — not group 0.
  assert.equal(followSlotIndex(thin), 3);
});

test("followSlotIndex keeps the ask at the first group on a fat lens", async () => {
  const { followSlotIndex } = await import("./postValue.js");
  // All: the first day carries well past the minimum on its own, so the slot
  // stays exactly where it was — this fix must not move the fat-lens case.
  assert.equal(followSlotIndex([{ cards: Array(13).fill(1) }, { cards: [1, 1] }]), 0);
  // Exactly at the minimum still counts as cleared.
  assert.equal(followSlotIndex([{ cards: [1, 1, 1, 1] }, { cards: [1] }]), 0);
});

test("followSlotIndex degenerates to the feed's end below the minimum", async () => {
  const { followSlotIndex } = await import("./postValue.js");
  // A lens too thin to ever clear 4 rows: the ask goes last, which is the same
  // "you've read it, here's how to keep getting it" order.
  assert.equal(followSlotIndex([{ cards: [1] }, { cards: [1] }]), 1);
  // No groups at all is no slot — the empty state owns that screen.
  assert.equal(followSlotIndex([]), -1);
  assert.equal(followSlotIndex(undefined), -1);
});

test("followRef encodes the target as kind:id for the form's hidden field", async () => {
  const { followTarget, followRef } = await import("./postValue.js");
  assert.equal(followRef(followTarget({ filterId: "live_music" })), "lens:live_music");
  // The footer's ungated CTA passes this ref literally — R1's control arm.
  assert.equal(followRef({ kind: "all", id: "all" }), "all");
});
