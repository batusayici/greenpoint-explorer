# Phase 4M-R10E Franklin Scene Geometry Root-Cause Fix

Status: Complete for Batu visual review  
Date: 2026-06-10

## Scope

R10E is a QA-only Franklin scene-geometry correction batch. It stops GLB assessment, R11 comparison, R12 standardization, asset tuning, facade polish, Manhattan work, and production mode until the actual rendered Franklin scene geometry is reviewed.

## Diagnosis

| Symptom | Likely root cause | Responsible file / function / record | Proposed fix | Verifier / screenshot proof |
| --- | --- | --- | --- | --- |
| R10C/R10D labels were in the right quadrants, but the actual Visual POC / 4L target bodies did not read as Franklin x Greenpoint. | Runtime building bodies used the long Greenpoint corridor preview transform, not the Franklin-local map-truth frame. | `src/phase4bRuntimeScene.js:createTransform` / `toPreviewPoint` | Add a QA-only Franklin Scene Truth layer that renders target building bodies from source WGS84 footprints in the Franklin-local street frame. | `scripts/verify-phase-4m-r10e-franklin-scene-geometry-root-cause.mjs`; top-down R10E screenshot |
| Premier/Franklin and Sonny's rendered too close together in the old scene, while Sereneco read as a far-left corridor object. | The corridor transform compresses perpendicular street depth and orients around the Greenpoint centerline only. | `src/phase4bRuntimeScene.js:PERPENDICULAR_SCALE_MULTIPLIER`; manifest `stylized-scene-projection` | Project the three targets from WGS84 around the shared Franklin/Greenpoint endpoint. | Verifier compares projected scene positions and side assignments |
| Franklin Ave did not control target building placement. | Phase 3B has Greenpoint centerline records but no Franklin Ave centerline. | `src/data/geometry-source/...phase-3b.json` street centerline records | Keep Franklin as a bounded review-only derived cross-street slab through the shared endpoint and use it as QA scene control geometry. | R10E fixture records the data gap; screenshots show Franklin slab crossing Greenpoint |
| Centroid-only checks passed while frontage readability failed. | Prior verifier did not check the street-facing footprint edge. | `scripts/verify-phase-4m-r10c-r10d-franklin-map-truth.mjs` | Add frontage-aware nearest-edge validation and frontage ribbons in the scene. | R10E verifier checks frontage method and screenshots show yellow frontage edges |

## What Changed

- Added `src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json`.
- Added `scripts/verify-phase-4m-r10e-franklin-scene-geometry-root-cause.mjs`.
- Added `Franklin Scene` QA focus in the runtime.
- Rendered actual source-backed target footprint bodies in a Franklin-local WGS projection.
- Added Greenpoint Ave and Franklin Ave control slabs/centerlines in the same frame.
- Added frontage edge highlights for the Greenpoint-facing source footprint edge.
- Suppressed old stylized corridor target/clutter in Franklin Scene Truth focus.

## Result

The issue was runtime transform / scaffold placement plus centroid-only validation, not the R10B target BIN mapping.

The target IDs remain preserved:

| QA place reference | Primary footprint BIN | Franklin side | Greenpoint side | Frontage check |
| --- | --- | --- | --- | --- |
| Premier Organic / Franklin Organic | `3322608` | west/across Franklin | south | nearest Greenpoint-facing edge, facing north toward Greenpoint |
| Sereneco | `3337033` | west/across Franklin | north | nearest Greenpoint-facing edge, facing south toward Greenpoint |
| Sonny's Corner | `3064811` | east/corridor side | south | nearest Greenpoint-facing edge, facing north toward Greenpoint |

## Artifacts

- Top-down scene geometry screenshot: `docs/review-screenshots/phase-4m-r10e-franklin-scene-geometry-root-cause-fix/franklin-scene-truth-top-down-r10e.png`
- Oblique scene geometry screenshot: `docs/review-screenshots/phase-4m-r10e-franklin-scene-geometry-root-cause-fix/franklin-scene-truth-oblique-r10e.png`
- Frontage screenshot: `docs/review-screenshots/phase-4m-r10e-franklin-scene-geometry-root-cause-fix/franklin-scene-truth-frontage-r10e.png`

## Verification

- `node scripts/verify-phase-4m-r10e-franklin-scene-geometry-root-cause.mjs`
- `node scripts/verify-phase-4m-r10c-r10d-franklin-map-truth.mjs`
- `node scripts/verify-phase-4m-r10b-franklin-spatial-reconciliation.mjs`
- `node scripts/verify-phase-4m-r10a-franklin-placement-fix.mjs`
- `node scripts/verify-phase-4m-r10-franklin-hero-asset-ingestion-spike.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `npm run build`
- `git diff --check`

## Boundaries Preserved

- R10 GLB binding remains preserved and is not used to prove correctness.
- R9 procedural fallback remains preserved.
- Normal mode remains protected.
- Franklin Ave remains an explicitly bounded QA-only derived cross-street slab because the source packet lacks a Franklin centerline.
- No artificial lateral offsets, GLB tuning, hero-kit tuning, facade polish, material tuning, Manhattan work, source expansion, production asset direction, business/storefront/frontage/entrance/signage/address/tenant/material/active-status claim, or public/product claim was added.

## Review Gate

Stop for Batu visual review of the actual R10E Franklin Scene Truth geometry before any R11/R12/GLB/asset/facade/Manhattan/production work resumes.
