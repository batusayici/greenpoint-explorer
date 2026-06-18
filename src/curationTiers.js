// src/curationTiers.js
// Machine-readable encoding of the approved hero/landmark curation
// (docs/CURATION_TIERS.md). Pure lookups, no Three.js — runs in both the
// Vite browser bundle and `node --test`.
//
// Two independent axes (see the doc):
//   visualTier   : "hero" | "typological" | "graybox"  (how much inked craft)
//   landmarkTier : "tier1" | "tier1_5" | "tier2" | "hold" | null  (story content)
//
// Anything not listed falls back to defaults (typological / no landmark).
// Phase 6.2 will have the renderer/kit read visualTier from here instead of
// the current ad-hoc per-building paths.

import registry from "./data/curation/building-tiers.v0.1.json" with { type: "json" };

export const VISUAL_TIERS = ["hero", "typological", "graybox"];
export const LANDMARK_TIERS = ["tier1", "tier1_5", "tier2", "hold"];
export const BUILD_STATUSES = ["built", "planned", "data-missing"];

export const TIER_DEFAULTS = registry.defaults;
export const HERO_BUDGET = registry.heroBudget;

const byPlaceId = new Map();
const byMatchName = new Map();
for (const e of registry.entries) {
  if (e.placeId) byPlaceId.set(e.placeId, e);
  const match = e.matchName ?? (e.placeId ? null : e.name?.trim().toLowerCase());
  if (match) byMatchName.set(match, e);
}

function normName(name) {
  return typeof name === "string" ? name.trim().toLowerCase() : null;
}

// Resolve a building/business to its curation entry by placeId first, then by
// case-insensitive name. Returns null when unlisted (caller applies defaults).
export function tierEntryFor({ placeId, name } = {}) {
  if (placeId && byPlaceId.has(placeId)) return byPlaceId.get(placeId);
  const n = normName(name);
  if (n && byMatchName.has(n)) return byMatchName.get(n);
  return null;
}

export function visualTierFor(arg) {
  return tierEntryFor(arg)?.visualTier ?? TIER_DEFAULTS.visualTier;
}

export function landmarkTierFor(arg) {
  const e = tierEntryFor(arg);
  return e ? (e.landmarkTier ?? null) : TIER_DEFAULTS.landmarkTier;
}

export function isHero(arg) {
  return visualTierFor(arg) === "hero";
}

export function allTierEntries() {
  return registry.entries;
}

// Heroes that are designated but not yet safe to render (missing data or
// unverified). Callers must not render these as active places.
export function heroesNotRenderable() {
  return registry.entries.filter(
    (e) => e.visualTier === "hero" && e.buildStatus !== "built",
  );
}
