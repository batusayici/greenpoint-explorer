# Current Execution Brief - 4M-R10C/R10D Franklin Map Truth Legibility Complete

Status: `4M-R10C/R10D Franklin Map Truth Legibility` is complete for Batu visual review on top of the current dirty R10/R10A/R10B state. R8/R9 remain complete, verified, and committed as `feb533f`; R10 remains a dirty, uncommitted QA-only GLB ingestion spike.

Current executable batch: none. Next implementation is pending Batu approval after R10C/R10D Franklin map-truth visual review.

Completed milestone: `4M-R10C/R10D Franklin Map Truth Legibility`.

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stopped after R10C/R10D Franklin / Greenpoint Ave map-truth legibility pass and top-down/oblique screenshot capture for Batu review. Do not self-open GLB tuning, hero-kit tuning, R11, R12, Manhattan work, broader asset work, production mode, facade polish, materials, or production visual-system work.

## Completed Outcome

R10C/R10D simplified the Franklin endpoint QA view before any further visual fidelity work:

- `Premier Organic / Franklin Organic` is mapped QA-only to source-backed footprint BIN `3322608`, on the `west_across_franklin` / south side, with rendered components `3322608` and `3322609`.
- `Sereneco` is mapped QA-only to source-backed footprint BIN `3337033`, on the `west_across_franklin` / north side.
- `Sonny's Corner` is mapped QA-only to source-backed footprint BIN `3064811`, on the `east_corridor_side` / south side.
- The R10B footprint-ID mapping is preserved because supplied screenshots and source-backed WGS84 centroid checks agree with the NW/SW/SE assignments.
- Franklin Ave is rendered as a real perpendicular QA-only cross-street slab through the shared Greenpoint endpoint, separating the west/across-Franklin cluster from the east/corridor-side Sonny's cluster.
- A dedicated `Franklin Truth` QA overlay suppresses corridor clutter and shows only Greenpoint Ave, Franklin Ave, the three target footprints, lightly ghosted same-BBL adjacent Premier/Franklin parts, compact footprint IDs, QA business labels, and orientation cues.
- Artificial lateral offsets are not used as the correction mechanism.
- The Franklin hero GLB binding remains unchanged at `assets/windows/Bay_Window_10K_texture.glb`.
- The procedural R9 scaffold remains available as fallback, including the R10 toggle path.

The QA business labels used during this reconciliation are placement-review labels only. They are not normal-mode, production, exact tenant, storefront, frontage, entrance, signage, address, material, active-status, or public/product claims.

## Objective

Make the Franklin x Greenpoint Ave intersection spatially truthful and immediately readable enough for Batu to judge whether Premier/Franklin Organic, Sereneco, and Sonny's Corner occupy the correct three-corner relationship before later GLB tuning, hero-kit tuning, R11 comparison, R12 standardization, Manhattan work, production mode, facade polish, materials, or asset-fidelity work.

## Allowed Scope

- Franklin / Greenpoint Ave spatial truth and legibility only.
- Existing source-backed footprint/manifest/cue records only.
- Existing QA facade cue, Franklin hero record, and repo-local reference evidence only.
- Existing R10 GLB binding only; no new asset ingestion.
- Existing runtime guard for the Franklin hero target.
- Small Franklin intersection mapping fixture and verifier coverage for the corrected three-corner relationship.
- Simplified Franklin Map Truth QA overlay mode for compact footprint IDs, QA business labels, street slabs/centerlines, and orientation cues.
- Top-down and oblique screenshot evidence.
- Required execution-control docs and one narrow report.

## Blocked Scope

- Further GLB placement/scale/orientation tuning beyond preserving the current binding.
- Hero-kit tuning, R11 comparison, or R12 standardization.
- Full Franklin building replacement.
- Manhattan implementation.
- PBR registry, texture atlas, UV mapping, Cesium, 3D Tiles, source expansion, new dependencies, production assets, normal-mode exposure, public UI, public/product claims, business/storefront linkage, exact storefront/frontage/entrance/signage/address/tenant/material/active-status claims, or broader renderer architecture changes.

## Success Criteria

- Correct Franklin / Greenpoint Ave QA mapping records the source-backed footprint IDs for Premier/Franklin Organic, Sereneco, and Sonny's Corner.
- Premier/Franklin Organic and Sereneco are recorded on the opposite side of Franklin Ave from Sonny's Corner.
- Franklin Ave is represented as a visible perpendicular cross-street slab/centerline condition, not only a label or marker.
- Top-down screenshot alone makes the NW/SW/SE three-corner relationship readable without the report.
- Verifier fails if Sonny is assigned to the wrong side of Franklin, if Premier/Sereneco share Sonny's Franklin side, if any target regresses to the wrong side of Greenpoint, if Franklin is not represented as a separating cross-street, or if artificial lateral offsets are used as the correction mechanism.
- Compact QA overlay can show footprint IDs, QA business labels, street slabs/centerlines, and north/south/east/west cues while suppressing corridor clutter.
- R10 GLB path remains unchanged.
- Procedural R9 fallback remains preserved.
- Verifiers, `npm run build`, and `git diff --check` pass, or any non-blocking verification limitation is documented.
- Stop at Batu visual review gate.

## Verification Completed For R10C/R10D

- `node scripts/verify-phase-4m-r10c-r10d-franklin-map-truth.mjs`
- `node scripts/verify-phase-4m-r10b-franklin-spatial-reconciliation.mjs`
- `node scripts/verify-phase-4m-r10-franklin-hero-asset-ingestion-spike.mjs`
- `node scripts/verify-phase-4m-r9-franklin-high-recognition-detail-modules.mjs`
- `node scripts/verify-phase-4m-r8-franklin-facade-record-assembly.mjs`
- `npm run build`
- `git diff --check`
- Browser top-down screenshot at `/?qa=1&qaLayerFocus=franklin_truth&camera=franklinTruthTopDown&r10HeroAsset=0`
- Browser oblique screenshot at `/?qa=1&qaLayerFocus=franklin_truth&camera=franklinTruthOblique&r10HeroAsset=0`

Review artifacts:

- `docs/reports/phase-4m-r10c-r10d-franklin-map-truth.md`
- `docs/review-screenshots/phase-4m-r10c-r10d-franklin-map-truth/franklin-map-truth-top-down-r10c.png`
- `docs/review-screenshots/phase-4m-r10c-r10d-franklin-map-truth/franklin-map-truth-oblique-r10d.png`

Known verification limitation: `node scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs` still contains a historical current-brief handoff assertion for the old 4L-Local gate and fails that assertion in the R10C/R10D brief context. The R10C/R10D map-truth verifier covers the corrected Franklin spatial relationship, and current R8/R9/R10 verifiers cover the preserved Franklin hero/GLB path.

Build note: Vite continues to report the expected large chunk/asset warning from directly importing the approximately 46 MB QA GLB. This remains non-blocking for the dirty R10 spike and should be considered during any later R11/R12 asset strategy review.
