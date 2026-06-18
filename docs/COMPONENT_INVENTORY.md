# Component Inventory — Visual System (Phase 6.2.2)

Status: Active. The machine-readable companions are `src/visualSystem/treatmentMap.js`
(selection + material mapping) and `src/visualSystem/palette.js` (color tokens).
This doc is the human-readable map of *what the kit can draw, in which tier, on
which material, by which module*. The 6.2.3 conformance gate reads the same sources.

## Axes

- **visualTier** (curation authority — `curationTiers.js`): `hero` · `typological` · `graybox`.
- **materialFamily** (inferred — `buildingTypology.js`): `brick-prewar` · `painted-masonry`
  · `commercial-storefront` · `warehouse`. Today only **brick** is fully realized in
  the inked kit; Phase 7 adds clapboard/brownstone/modern + roof tone.

## Treatments (visualTier → render path)

| Treatment | When selected | Builder (`SceneView.jsx`) | Kit components |
|-----------|---------------|---------------------------|----------------|
| `hero` | curated hero **with built geometry** (`isHero && edges`) | `buildHeroBuilding` | textured facade, cornice, parapet, cast shadow, non-street walls |
| `inkedKit` | photo-grounded mid-block (`INKED_FACADE_REAL` match) | `decorateInkedWall` | inked wall, windows, storefront, glazing, awning, sign band, cornice |
| `typological` | block-extract or within context radius (~48 m) | `decorateTypologicalWall` | storey score-lines, punched windows, lintels |
| `graybox` | far context | — (massing only) | none |

Selection is centralized in `selectTreatment()` (`treatmentMap.js`); SceneView no
longer branches inline. `inkedKit` is a craft variant of typological that hangs the
generated component kit on photo-grounded buildings — its per-building colors are the
authored data in `INKED_FACADE_REAL` (6.2.1 allowlist), slated to move into a data
file keyed to this map.

## Kit components × material × module

| Component | Module / function | Material coverage | Color source |
|-----------|-------------------|-------------------|--------------|
| Textured facade (hero) | `buildHeroBuilding` + `facadeAssembly.buildFacadeAssembly` | per-hero bespoke texture | generated PNG; relief tones `FACADE_RELIEF` |
| Inked wall + windows | `decorateInkedWall` + `inkedFacadeCompose.composeInkedFacade` | brick (others Phase 7) | `BRICK_TONES`, `MASSING` |
| Storefront / glazing / sign / awning | `storefrontCompose`, `storefrontSigns`, `buildStorefrontAwnings` | trade-tinted | `TRADE_AWNING_TINT`, `MASSING.signBoardDefault`, `MASSING.transomBand` |
| Typological wall (storey lines, punched windows, lintels) | `decorateTypologicalWall` | all 4 families | `TYPOLOGY_PALETTE` via `resolveTypologyColor` |
| Cornice / reveals / joinery | `facadeAssembly` (`REVEAL`, bay cheeks, crown) | all | `FACADE_RELIEF` |
| Roof cap / parapet | `buildBuildings`, `buildHeroBuilding` | all | `MASSING.roofCap`, `MASSING.parapet` |
| Ground / curb / crosswalk / signals | `groundLayer`, `streetFurniture` | n/a | `II_PALETTE` |
| Debug rect overlay | `facadeAssembly` (dev) | n/a | `DEBUG_PALETTE` |

## Material → palette key (single source: `treatmentMap.MATERIAL_PALETTE_KEY`)

| materialFamily | palette key | token |
|----------------|-------------|-------|
| brick-prewar | `typological.brick` | `TYPOLOGY_PALETTE["typological.brick"]` |
| painted-masonry | `typological.painted` | `TYPOLOGY_PALETTE["typological.painted"]` |
| commercial-storefront | `typological.commercial` | `TYPOLOGY_PALETTE["typological.commercial"]` |
| warehouse | `typological.warehouse` | `TYPOLOGY_PALETTE["typological.warehouse"]` |

## Gaps tracked for later phases

- **Material families 2–4 + roof tone** — Phase 7 (`7.1`–`7.4`). Inventory rows above
  exist but only brick is realized in the inked kit.
- **`INKED_FACADE_REAL` → data file** — the per-building authored colors should become
  registry-linked data keyed to this map (removes the 6.2.1 allowlist).
- **Infill registry linkage** — block/context buildings key by BIN, not placeId, so they
  resolve treatment geometrically (radius) rather than via `visualTierFor`. Attaching
  registry linkage to infill is Phase 8 work.
