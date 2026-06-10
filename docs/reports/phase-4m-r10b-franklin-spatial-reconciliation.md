# Phase 4M-R10B Franklin Spatial Reconciliation

Status: Complete for Batu visual review  
Date: 2026-06-10

## Scope

R10B is a QA-only spatial reconciliation batch for the Franklin Ave x Greenpoint Ave intersection. It pauses GLB tuning, hero-kit tuning, R11 comparison, and R12 standardization until the map relationship is readable.

## Mapping

| QA place reference | Primary footprint BIN | Rendered object | Franklin Ave side | Greenpoint Ave side | Corner role |
| --- | --- | --- | --- | --- | --- |
| Premier Organic / Franklin Organic | `3322608` | `p4b-object-nyc-footprint-bin-3322608` | `west_across_franklin` | `south` | `southwest_across_franklin_corner` |
| Sereneco | `3337033` | `p4b-object-nyc-footprint-bin-3337033` | `west_across_franklin` | `north` | `northwest_across_franklin_corner` |
| Sonny's Corner | `3064811` | `p4b-object-nyc-footprint-bin-3064811` | `east_corridor_side` | `south` | `southeast_corridor_corner` |

The fixture records the Franklin separator as a QA-only derived cross-street condition because the current raw geometry packet contains Greenpoint Ave centerline segments but no Franklin Ave centerline. The separator is derived from the shared Greenpoint Ave endpoint and verified against WGS84 footprint centroids, not visual offsets.

## Artifacts

- Fixture: `src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10b-spatial-mapping.v0.1.json`
- Verifier: `scripts/verify-phase-4m-r10b-franklin-spatial-reconciliation.mjs`
- Overhead screenshot: `docs/review-screenshots/phase-4m-r10b-franklin-spatial-reconciliation/franklin-map-overhead-r10b.png`
- Oblique screenshot: `docs/review-screenshots/phase-4m-r10b-franklin-spatial-reconciliation/franklin-map-oblique-r10b.png`

## Verification

- `node scripts/verify-phase-4m-r10b-franklin-spatial-reconciliation.mjs`
- `npm run build`

## Boundaries Preserved

- R10 GLB binding remains preserved.
- R9 procedural fallback remains preserved.
- Normal mode remains protected.
- No GLB scale, materials, windows, facade detail, hero composition, PBR registry, texture atlas, Cesium, 3D Tiles, full building replacement, production asset direction, business verification, or public/product claims were added.

## Review Gate

Stop for Batu visual review of the corrected Franklin spatial mapping before any GLB tuning, R11 comparison, or R12 standardization resumes.
