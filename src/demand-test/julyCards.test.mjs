import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateCard, inGreenpoint } from "./cardSchema.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/july-2026-cards.json", import.meta.url)), "utf8"),
);

test("seed has exactly 15 cards across the four layers", () => {
  // The two per-station G-closure cards were cut 2026-07-02 (Batu): redundant
  // with the always-visible closure banner. Closure context lives there; the
  // G-train layer keeps the action cards (adopt + advocacy).
  assert.equal(seed.cards.length, 15);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 8, "8 discovery cards");
  assert.equal(count((c) => c.category === "event"), 4, "4 event cards (incl. Dandelion Wine micro-event)");
  assert.equal(count((c) => c.category === "subscription"), 1, "1 subscription card (Falu House)");
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 2, "2 G-train action cards");
});

test("the hidden-engagement addendum cards carry their contract", () => {
  const tasting = seed.cards.find((c) => c.id === "dandelion-wine-tasting");
  assert.ok(tasting, "Dandelion Wine micro-event exists");
  assert.ok(tasting.startsAt && tasting.endsAt, "tasting has a Today-lens window");
  const club = seed.cards.find((c) => c.id === "falu-tinned-fish-club");
  assert.ok(club, "Falu House Tinned Fish Club exists");
  assert.ok(club.filters.includes("clubs_signups"));
  assert.ok(club.actions.some((a) => a.type === "join"), "club has a one-tap join action");
});

test("every card validates", () => {
  for (const card of seed.cards) {
    const r = validateCard(card);
    assert.deepEqual(r.errors, [], `card ${card.id}`);
  }
});

test("every card is geocoded inside Greenpoint (run scripts/geocode-demand-cards.mjs)", () => {
  for (const card of seed.cards) {
    assert.ok(inGreenpoint(card), `${card.id} has no derived coords`);
  }
});

test("world-cup cluster carries geocoded venues", () => {
  const wc = seed.cards.find((c) => c.id === "world-cup-watch");
  assert.ok(wc, "world-cup-watch card exists");
  assert.ok(wc.venues.length >= 6, "at least 6 of the 10 bars resolved");
  for (const v of wc.venues) {
    if (v.lat != null) assert.ok(inGreenpoint(v), `venue ${v.name}`);
  }
  assert.ok(wc.venues.filter((v) => v.lat != null).length >= 6, "at least 6 venues have coords");
});

test("ids are unique", () => {
  assert.equal(new Set(seed.cards.map((c) => c.id)).size, seed.cards.length);
});
