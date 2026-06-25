// Phase 6.2.2 — declarative treatment map (the consistency engine's selector).
//
// A building's render treatment is a function of two axes:
//   visualTier     : hero | typological | graybox   (curation authority, from
//                    curationTiers.js / building-tiers.v0.1.json)
//   materialFamily : brick-prewar | painted-masonry | commercial-storefront |
//                    warehouse                       (inferred, buildingTypology.js)
//
// This module names every treatment and the kit components it draws, so the
// renderer selects via a lookup instead of an inline flag tree, and the
// conformance gate (6.2.3) + the component inventory can read the same source.
//
// Pure / Node-importable: no Three.js. The renderer maps each treatment's
// `builder` to a concrete function; this module only decides *which*.

import { visualTierFor } from "../curationTiers.js";
import { TYPOLOGY_PALETTE } from "./palette.js";

// The four concrete treatments the renderer implements. `builder` is the
// SceneView function that realizes it; `components` lists the kit pieces drawn.
export const TREATMENTS = {
  // Full bespoke inked facade from a generated elevation, built wall-by-wall.
  hero: {
    builder: "buildHeroBuilding",
    components: ["texturedFacade", "cornice", "parapet", "castShadow", "nonStreetWalls"],
  },
  // Inked component kit on a photo-grounded mid-block building (street faces
  // only): the INKED_FACADE_REAL path. A craft variant of typological.
  inkedKit: {
    builder: "decorateInkedWall",
    components: ["inkedWall", "windows", "storefront", "glazing", "awning", "signBand", "cornice"],
  },
  // Data-differentiated typological decoration: storey score-lines + punched
  // windows + lintels, tinted by material family.
  typological: {
    builder: "decorateTypologicalWall",
    components: ["storeyLines", "punchedWindows", "lintels"],
  },
  // Cheap massing only — far context. No decoration.
  graybox: {
    builder: null,
    components: [],
  },
};

// Material family → typological wall-tone palette key (resolved to a color
// token by resolveTypologyColor in palette.js). Single source for the mapping.
export const MATERIAL_PALETTE_KEY = {
  "brick-prewar": "typological.brick",
  "painted-masonry": "typological.painted",
  "commercial-storefront": "typological.commercial",
  warehouse: "typological.warehouse",
};

export function paletteKeyForMaterial(materialFamily) {
  return MATERIAL_PALETTE_KEY[materialFamily] ?? "typological.brick";
}

export function paletteHexForMaterial(materialFamily) {
  return TYPOLOGY_PALETTE[paletteKeyForMaterial(materialFamily)];
}

// Resolve the treatment KIND for a building. Preserves the established render
// behavior exactly, but expressed as one documented decision instead of an
// inline tree:
//   1. geometrically-built hero (registry authority + built edges) → hero
//   2. photo-grounded inked-kit building (INKED_FACADE_REAL match)  → inkedKit
//   3. block-extract or within the context radius                   → typological
//   4. otherwise                                                    → graybox
//
// `visualTier` is the curation authority; `building.isHero && building.edges`
// is the requirement that the hero geometry actually exists (a curated hero
// with no built geometry is simply not rendered as one yet — see
// heroesNotRenderable()). The two agree for every built hero.
export function selectTreatment({ building, dist, inkedParams, contextRadius }) {
  if (building?.isHero && building?.edges) return "hero";
  if (inkedParams) return "inkedKit";
  if (building?.fromBlockExtract || (Number.isFinite(dist) && dist <= contextRadius)) {
    return "typological";
  }
  return "graybox";
}

// The curation tier a building *should* carry, independent of what geometry
// exists. Used for cross-checks, the inventory, and the conformance gate.
export function curatedVisualTier(building) {
  return visualTierFor({ placeId: building?.placeId, name: building?.name });
}
