# Phase 4M-R10A Franklin Placement Fix

Status: complete for Batu visual review

## Scope

R10A corrected Franklin QA placement mapping on top of the dirty R10 state. It did not tune the GLB, replace a full building, open Manhattan, create production assets, expose normal mode, broaden the asset pipeline, or make exact business/storefront/frontage/entrance/signage/address/tenant/material/active-status claims.

The Batu-supplied NW/SW/SE labels are used here only as QA placement references.

## Corrected Targets

| QA placement reference | Source-backed footprint | Runtime target |
| --- | --- | --- |
| Northwest cross-Franklin cluster | `nyc-footprint-bin-3337033` | `p4b-object-nyc-footprint-bin-3337033` |
| Southwest cross-Franklin cluster | `nyc-footprint-bin-3322608` | `p4b-object-nyc-footprint-bin-3322608` |
| Southeast corridor-side cluster | `nyc-footprint-bin-3064811` | `p4b-object-nyc-footprint-bin-3064811` |

## What Changed

- Added a source-backed Franklin cross-street review-context exception so footprint `3337033` can be included for northwest placement review.
- Regenerated the Phase 4B semantic scene manifest and Phase 4C geometry-only facade cues.
- Retargeted the three Franklin QA facade cue records and their 4L local cue enrichment records.
- Removed artificial Franklin lateral offsets from the corrected QA records.
- Retargeted the Franklin hero record to the corrected southwest cross-Franklin footprint.
- Preserved the R10 GLB binding at `assets/windows/Bay_Window_10K_texture.glb`.
- Preserved the procedural R9 scaffold fallback and the existing R10 toggle behavior.

## Verification

- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4m-r10a-franklin-placement-fix.mjs`
- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `node scripts/verify-phase-4m-r10-franklin-hero-asset-ingestion-spike.mjs`
- Browser overhead visual inspection at `/?qa=1&qaLayerFocus=visual_poc&camera=overhead&r10HeroAsset=0`

Known limitation: `node scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs` still contains a historical current-brief handoff assertion for the old 4L-Local gate and fails that assertion in the R10A brief context. The corrected target mapping is covered by the R10A verifier plus current R8/R9/R10 verifiers.

Browser limitation: the overhead placement view displayed successfully, but the browser tool could not save a PNG into the repo due filesystem permission denial. No R10A screenshot artifact is claimed.

## Review Ask

Review whether the corrected northwest, southwest, and southeast QA placement clusters are directionally right before any further GLB placement tuning, R11 comparison, or R12 hero-kit standardization.
