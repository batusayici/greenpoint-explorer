# Phase 4M-R10C/R10D Franklin Map Truth Legibility

Status: Complete for Batu visual review  
Date: 2026-06-10

## Scope

R10C/R10D is a bounded QA-only Franklin intersection truth-and-legibility packet. It pauses GLB tuning, hero-kit tuning, R11 comparison, R12 standardization, Manhattan work, production mode, facade polish, materials, and asset fidelity work until the Franklin x Greenpoint Ave relationship is visually readable.

## Mapping Decision

The original R10B mapping is preserved. The supplied Franklin screenshot set and the repo-local WGS84 footprint centroid checks agree with the R10B fixture:

| QA place reference | Primary footprint BIN | Franklin Ave side | Greenpoint Ave side | Corner role |
| --- | --- | --- | --- | --- |
| Premier Organic / Franklin Organic | `3322608` | `west_across_franklin` | `south` | `southwest_across_franklin_corner` |
| Sereneco | `3337033` | `west_across_franklin` | `north` | `northwest_across_franklin_corner` |
| Sonny's Corner | `3064811` | `east_corridor_side` | `south` | `southeast_corridor_side_corner` |

The current source packet includes Greenpoint Ave centerline segments but no Franklin Ave centerline. R10C/R10D therefore renders Franklin Ave as a QA-only perpendicular cross-street slab through the shared Greenpoint endpoint, and verifies side assignments from source-backed WGS84 footprint centroids. This is a review separator, not a new production street model.

## Artifacts

- Fixture: `src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10c-r10d-map-truth.v0.1.json`
- Verifier: `scripts/verify-phase-4m-r10c-r10d-franklin-map-truth.mjs`
- Top-down screenshot: `docs/review-screenshots/phase-4m-r10c-r10d-franklin-map-truth/franklin-map-truth-top-down-r10c.png`
- Oblique screenshot: `docs/review-screenshots/phase-4m-r10c-r10d-franklin-map-truth/franklin-map-truth-oblique-r10d.png`

## Visual Result

The simplified Franklin Map Truth QA mode suppresses corridor clutter and shows only the Greenpoint Ave slab/centerline, Franklin Ave slab/centerline, the three target footprints, lightly ghosted same-BBL adjacent Premier/Franklin components, compact non-overlapping QA labels, footprint BINs, and orientation cues.

The top-down screenshot is the primary proof: Franklin Ave visibly crosses Greenpoint Ave, Sereneco reads northwest/across Franklin, Premier/Franklin Organic reads southwest/across Franklin, and Sonny's Corner reads southeast/corridor-side.

## Verification

- `node scripts/verify-phase-4m-r10c-r10d-franklin-map-truth.mjs`
- `node scripts/verify-phase-4m-r10b-franklin-spatial-reconciliation.mjs`
- `node scripts/verify-phase-4m-r10-franklin-hero-asset-ingestion-spike.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `npm run build`
- `git diff --check`

## Boundaries Preserved

- R10 GLB binding remains preserved.
- R9 procedural fallback remains preserved.
- Normal mode remains protected.
- No GLB scale/material/window/facade tuning was performed.
- No artificial lateral offsets are used as the primary correction mechanism.
- No PBR registry, texture atlas, Cesium, 3D Tiles, production asset direction, business verification, exact storefront/frontage/entrance/signage/address/tenant/material/active-status claim, or public/product claim was added.

## Review Gate

Stop for Batu visual review of the R10C/R10D Franklin Map Truth screenshots before any GLB tuning, hero-kit tuning, R11 comparison, R12 standardization, Manhattan work, production mode, facade polish, materials, or asset fidelity work resumes.
