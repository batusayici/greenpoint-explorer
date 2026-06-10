# Phase 4M-R9 Franklin High-Recognition Detail Modules

Status: Complete and verified; pending Batu visual review.

## Scope

Batch 4M-R9 extends the completed R8 QA-only Franklin facade-record assembly. It remains Franklin-only, code-native, and JSON-driven. It does not introduce GLB/GLTF loading, Cesium, 3D Tiles, raster texture atlases, custom shaders, new dependencies, normal-mode exposure, production assets, business identity, tenant identity, exact storefront/frontage/signage/entrance/address/active-status claims, or whole-corridor refactoring.

## What Changed Visually

- Added a candidate side-return projecting bay/window column to break the flat side-wall silhouette.
- Added a lightweight fire-escape approximation with thin platforms, rail posts, and a simple ladder cue.
- Added AC/window utility modules on front and side windows plus small utility boxes.
- Added deterministic irregular facade rhythm overlays for varied trim depth, sill/header length, row offsets, and relief bands.
- Added code-native material/weathering bands: darker base course, under-cornice shadow, vertical weathering strips, and side shadow panels.
- Added stronger street grounding: darker asphalt strip, sidewalk scoring, crosswalk paint hints, pole/utility/bollard/bike/trash-like review props.

## Data-Driven Fields

All R9 additions are driven from `detailModules` in `src/data/facade-cues/franklin-hero-records.v0.1.json`:

- `bayWindowProjection`
- `fireEscape`
- `windowUtilities`
- `facadeRhythmVariation`
- `materialBands`
- `streetDressing`

The runtime continues to pass the matching QA facade record into `addFranklinHeroCorner()`. Franklin visual detail logic remains inside `src/components/hero/FranklinHeroCorner.jsx`.

## R9 vs R8 Visual Review Questions

- Is the side facade less flat? Yes, directionally. The side-return face now has more interrupting forms: a candidate projection, extra side utility/window beats, fire-escape density, and weathering panels. It still does not read as an exact real side facade.
- Is the building less toy-like? Somewhat. The added small-scale utility, rail, grime, trim variation, and street-contact modules reduce the clean procedural read, but the result remains visibly code-native and simplified.
- Are high-recognition details visible at the review camera distance? Yes for the fire escape, AC/utility boxes, stronger cornice/window rhythm, and side-return interruption. The details are still symbolic rather than benchmark-faithful.
- Does the scene feel better grounded to the street? Yes, slightly. The curb/asphalt strip, scoring, crosswalk hints, pole, and context props add more contact cues than R8.
- Does anything create false business/storefront/signage claims? No. The sign band remains abstract, with no real text, logo, tenant identity, storefront anchor, exact frontage, or production claim.

## Remaining Fidelity Gap

R9 improves local-recognition detail density, but it does not close the benchmark fidelity gap. The hero still reads as procedural/toy architecture rather than immediately recognizable Greenpoint because exact storefront divisions, true side-return geometry, real facade proportions, real fire-escape fabrication, exact material aging, and accurate street/curb/intersection layout remain missing or only candidate/QA approximations.

## Review Screenshots

- `docs/review-screenshots/phase-4m-r9-franklin-high-recognition-detail-modules/franklin-benchmark-close-r9.png`
- `docs/review-screenshots/phase-4m-r9-franklin-high-recognition-detail-modules/franklin-side-return-corner-wrap-r9.png`

## Verification

- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `npm run build`
- Browser review capture from local runtime review URLs
- PNG file-format check and visual disk inspection
- `git diff --check`

## Blocked Claims Preserved

- Business identity
- Tenant identity
- Storefront anchor
- Exact frontage
- Exact sign text
- Production asset
- Normal mode
- Active status
- Exact entrance
- Exact address
- Exact facade
- Logo or trade dress
- Public claim

## Stop Gate

Stop at Batu visual review gate. Do not open GLB work, Manhattan implementation, source expansion, or normal-mode/public/product work from this batch.
