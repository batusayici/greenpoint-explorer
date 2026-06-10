# Phase 4M-R8 Franklin Data-Driven Facade Assembly Proof

Status: Complete and verified; pending Batu visual review.

Scope: Franklin hero only. This batch extends the existing QA-only Three.js Franklin hero kit so a structured facade record drives native geometry callbacks. It does not add Cesium, 3D Tiles, GLB/GLTF loading, raster texture atlases, source expansion, production assets, normal-mode exposure, exact storefront/frontage/signage/tenant/business claims, or a whole-corridor refactor.

## What Changed Visually

- The Franklin hero corner now has stronger physical depth in the close review camera: more tactile storefront bays, deeper glass pockets, projecting sign band, awning/canopy volume, recessed upper-window cells, projecting trims/sills/headers, layered cornice/parapet, side-return relief, sparse side windows, return storefront cues, and stronger contact grounding.
- The result is still code-native Three.js geometry, but the new geometry is assembled from a QA-only JSON facade record rather than only hard-coded procedural assumptions.
- R7 hero-kit modules remain in place; R8 adds a record-driven assembly layer on top of the working baseline.

## Data-Driven Features

Structured record: `src/data/facade-cues/franklin-hero-records.v0.1.json`.

Driven from record fields:

- `faces.front.groundFloor.bayCount`, `bayWidthRatios`, `glassBeatPattern`, and `candidateDoorBays` drive storefront bay spacing and glass/door rhythm.
- `hasSignBand.height` and `hasSignBand.projection` drive the projecting sign band.
- `hasAwning.depth` and `hasAwning.height` drive canopy volume.
- `storefrontRecess` and `mullionDepth` drive glass-pocket depth and mullion thickness.
- `upperFloors.rowCount`, `bayPattern`, `windowRecess`, `windowTrimProjection`, `sillProjection`, and `headerProjection` drive upper-floor window rows, columns, recesses, trim, sills, and headers.
- `roof.corniceLayerCount`, `corniceProjection`, and `hasBulkhead` drive layered cornice/parapet and candidate roof bulkhead geometry.
- `faces.sideReturn.visible`, `sideWallRelief`, `sparseWindowRows`, `sparseWindowColumns`, and `returnStorefrontBays` drive side-return/corner-wrap cues.

## Target Binding

The R8 record binds to the active Franklin hero object verified from current repo fixtures:

- Target cue: `p4e1-franklin-red-brick-cornice-corner`
- Target semantic ID: `p4b-object-nyc-footprint-bin-3064793`
- Target source record: `p4b-record-nyc-footprint-bin-3064793`
- BIN: `3064793`

The association remains `provisional_geometry_target_for_qa_render_only`.

## Blocked Claims

Still blocked:

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
- Public/product claim

## Remaining Gaps

- True storefront/frontage fidelity still needs evidence-backed measured extraction or a reviewed asset/reference path.
- Side-return depth, bay order, entrance placement, and frontage order remain candidate/manual-draft.
- The R8 record is a QA-only authoring contract, not a durable production facade schema.
- The visual result is still native low-poly geometry, not final art-direction raster/prototype asset work.

## Review Artifacts

- `docs/review-screenshots/phase-4m-r8-franklin-data-driven-facade-assembly-proof/franklin-benchmark-close-r8.png`
- `docs/review-screenshots/phase-4m-r8-franklin-data-driven-facade-assembly-proof/franklin-side-return-corner-wrap-r8.png`

## Verification

- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `npm run build`
- Browser review/capture from `http://127.0.0.1:5177/?qaLayerFocus=visual_poc&camera=franklinBenchmarkReview&r8=1`
- Browser review/capture from `http://127.0.0.1:5177/?qaLayerFocus=visual_poc&camera=franklinSideReturnReview&r8=1`
- PNG file-format check

## Visual Self-Audit

- Intended decision: whether data-driven facade records improve Franklin local recognition under the existing close isometric review camera.
- Fidelity level: runtime QA prototype review screenshot; not final art direction or production asset proof.
- Required output format: PNG screenshots from the actual runtime.
- SVG status: disallowed for this decision because the review depends on the real rendered scene depth and camera framing.
- Visual evidence: storefront bay rhythm, sign band, awning, recessed upper windows, trim, cornice/parapet, side-return relief, and contact grounding are visible directly.
- Truth handling: all facade/frontage/storefront/sign/business claims remain QA-only, provisional, candidate, blocked, or manual-draft.
- Missing fidelity: exact storefront/frontage/signage/entrance and final production asset quality.
- Pass/fail: pass for R8 QA review evidence; requires Batu visual review before any next lane opens.
