// src/curationTiers.test.mjs
// Run: node --test src/curationTiers.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  visualTierFor,
  landmarkTierFor,
  isHero,
  tierEntryFor,
  allTierEntries,
  heroesNotRenderable,
  VISUAL_TIERS,
  LANDMARK_TIERS,
  BUILD_STATUSES,
  HERO_BUDGET,
  TIER_DEFAULTS,
} from "./curationTiers.js";
import { allPlaces } from "./placeData.js";

test("every entry is well-formed", () => {
  for (const e of allTierEntries()) {
    assert.ok(e.key, "entry has a key");
    assert.ok(e.name, `${e.key} has a name`);
    assert.ok(VISUAL_TIERS.includes(e.visualTier), `${e.key} visualTier valid`);
    assert.ok(
      e.landmarkTier === null || LANDMARK_TIERS.includes(e.landmarkTier),
      `${e.key} landmarkTier valid`,
    );
    assert.ok(BUILD_STATUSES.includes(e.buildStatus), `${e.key} buildStatus valid`);
  }
});

test("hero roster stays within the curated budget", () => {
  const heroes = allTierEntries().filter((e) => e.visualTier === "hero");
  assert.ok(heroes.length <= HERO_BUDGET, `${heroes.length} heroes <= ${HERO_BUDGET}`);
});

test("lookup resolves by placeId and by case-insensitive name", () => {
  assert.equal(visualTierFor({ placeId: "premier-franklin-organic" }), "hero");
  assert.equal(visualTierFor({ name: "Black Rabbit" }), "hero");
  assert.equal(visualTierFor({ name: "  black rabbit  " }), "hero");
  assert.equal(landmarkTierFor({ placeId: "premier-franklin-organic" }), "tier2");
});

test("unlisted buildings fall back to the typological default", () => {
  assert.equal(visualTierFor({ name: "Some Unlisted Bodega" }), TIER_DEFAULTS.visualTier);
  assert.equal(visualTierFor({ name: "Some Unlisted Bodega" }), "typological");
  assert.equal(landmarkTierFor({ name: "Some Unlisted Bodega" }), null);
  assert.equal(tierEntryFor({ name: "Some Unlisted Bodega" }), null);
});

test("buildings held typological are not heroes", () => {
  assert.equal(isHero({ name: "Threes Brewing" }), false);
  assert.equal(isHero({ name: "Maman" }), false);
  assert.equal(visualTierFor({ name: "Maman" }), "typological");
});

test("all placeData heroes are tagged hero in the registry", () => {
  for (const p of allPlaces()) {
    assert.equal(isHero({ placeId: p.placeId }), true, `${p.placeId} is hero`);
  }
});

test("designated-but-unrenderable heroes are flagged, not silently active", () => {
  const pending = heroesNotRenderable();
  const brouwerij = pending.find((e) => e.key === "brouwerij-lane");
  assert.ok(brouwerij, "Brouwerij Lane is flagged not-renderable (no scene geometry yet)");
  assert.equal(brouwerij.buildStatus, "data-missing");
  // Verified active (cited), but still has no scene geometry — not-renderable
  // is driven by buildStatus, not verification.
  assert.equal(brouwerij.verificationStatus, "verified");
  // Eberhard Faber + Astral are planned heroes, not yet built.
  assert.ok(pending.some((e) => e.key === "eberhard-faber"));
  assert.ok(pending.some((e) => e.key === "astral-apartments"));
});
