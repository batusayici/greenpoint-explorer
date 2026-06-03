# Current Execution Brief - Phase 2DTR-9 Review Hold

Status: Phase 2DTR-9 - Controlled Styled Raster From Geometry-First Adapter is complete for Batu review. The next executable task is pending Batu approval or revision direction.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Completed Context

- Phase 2DTR-1 produced a review-only Grillpoint/NW data-to-raster-spec packet.
- Phase 2DTR-2 produced a review-only four-target structured facade/source fixture packet.
- Phase 2DTR-3 produced a deterministic four-corner regenerated raster/spec attempt and visible comparison/spec board.
- Batu unblocked exact MVP review work for storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry.
- Phase 2DTR-4 produced a review-only exact geometry source map, target scene spec, reproducibility gap list, and visible source-map board.
- Phase 2DTR-5 produced a structured review-only exact geometry fixture, deterministic raster prompt adapter spec, adapter provenance map, and raster prompt text for the true-to-life Manhattan Ave / Greenpoint Ave MVP scene.
- Phase 2DTR-6 produced a visually strong review-only raster scene image and visual QA/contact-sheet board, but Batu identified that it did not prove source-data-driven rendering from the Phase 2DTR-5 fixture.
- Phase 2DTR-7 produced a deterministic black-and-white SVG blueprint and validation report from the Phase 2DTR-5 exact review geometry fixture.
- Phase 2DTR-8 produced review-only road, pedestrian/corner, storefront/building, address-label, subway-cue, render-order, and occlusion primitives plus a JSON-first styled-raster-ready geometry adapter and blueprint.
- Phase 2DTR-9 produced a controlled review-only styled raster from the DTR-8 geometry-first adapter, plus a visual QA board and machine-readable QA report.
- Phase 2 remains the active Data-Driven Scene MVP phase.
- Phase 3 remains reserved for future Neighborhood Scale Validation.
- MVP-29E remains the current manually composed four-corner raster baseline/reference. It is not treated as the final proof of the data-to-raster pipeline.
- Phase 2DTR-4 output packet: `docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/`.
- Phase 2DTR-5 output packet: `docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/`.
- Phase 2DTR-6 output packet: `docs/mvp-review/phase-2dtr-6-exact-review-geometry-raster-artifact-generation/`.
- Phase 2DTR-7 output packet: `docs/mvp-review/phase-2dtr-7-fixture-to-blueprint-scene-layout-validation/`.
- Phase 2DTR-8 output packet: `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/`.
- Phase 2DTR-9 output packet: `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/`.
- `docs/PHASE_2_PLAN.md` and `docs/AGENT_HANDOFF.md` are historical stubs only, while `docs/PLAN.md` remains the active roadmap.

## Phase 2DTR Objective

Phase 2DTR should prove this MVP path:

```text
source inputs
-> structured scene/facade/geometry fields
-> deterministic generated raster/spec artifact
-> review-only isometric scene output
-> QA/status comparison
```

The MVP proof is the real-data-to-isometric-raster-scene pipeline, not just screenshot appeal. The scene remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave.

## Current Review Hold

Batu review is required before the next implementation batch.

Review question:

- Accept, revise, or reject the Phase 2DTR-9 controlled styled raster as sufficient MVP feedback evidence.
- Decide whether the proposed Phase 2DTR-10 narrow corrective visual pass should open.

Review packet:

- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/README.md`
- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/generated/controlled-styled-raster.png`
- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/generated/controlled-styled-raster-qa-board.png`
- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/generated/controlled-styled-raster-qa-report.json`
- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/generate-dtr9-qa.py`

Findings to review:

- DTR-9 is meaningfully new at file/hash level versus DTR-6.
- DTR-9 preserves the DTR-8 storefront order and visible road/sidewalk/crosswalk structure.
- DTR-9 preserves one primary Greenpoint G cue.
- DTR-9 keeps exact address text out of the scene body and confines it to QA/footer metadata.
- DTR-9 remains partial on reference-photo fidelity and facade/entrance/window precision.
- DTR-9 proves a controlled geometry-first styled raster attempt for MVP feedback; it does not prove deterministic pixel-perfect rendering or production/public exact geometry.

No Phase 2DTR-10 implementation, app/source edit, public-interface/schema approval, package/tooling change, normal-mode raster replacement, or production/public-readiness change is authorized until Batu updates this brief or gives explicit direction.

## Proposed Next Task After Batu Review

Phase 2DTR-10 - Narrow Corrective Visual Pass From DTR-8 Overlay Mask.

Purpose:

- Produce one corrected review-only styled raster pass using the DTR-8 blueprint/adapter as an overlay mask.
- Tighten facade/window/entrance/sign alignment.
- Suppress generated microtext artifacts.
- Preserve one primary Greenpoint G cue.
- Preserve QA-only address policy.
- Avoid another readiness, planning, geometry, or schema phase unless a concrete blocker appears.

This is proposed, not opened. A later brief or Batu message must name the exact allowed files and acceptance criteria before implementation.

## Continuing Boundaries

- Review-only.
- No product-copy readiness change.
- No production/public readiness change.
- No Phase 2DTR-10 styled raster generation, app/source edits, public interfaces, package/tooling changes, normal-mode replacement, or production/public-readiness changes until explicitly opened.
- No live scraping, live API calls, Google/Street View/3D Tiles extraction, or external source acquisition.
- No package/tooling/CI changes unless later approved.
- No production asset, production asset pipeline, or public schema/interface approval.
- Exact storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry may be pursued and represented in review-only artifacts when supported by structured source/reference evidence and explicit status labels.
- No unsupported exact geometry claims and no production/public exact-geometry claims.
- No replacement of raster-first primary world art with SVG, canvas, CSS, DOM-drawn storefronts/buildings/roads/signs, or other code-generated primary world art.

## Recent Phase 2DTR-9 Changes

- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/`

## Verification For Phase 2DTR-9

- Generated styled raster PNG exists and dimensions are 1672 x 941.
- QA board PNG exists and dimensions are 2400 x 1600.
- JSON parse for `generated/controlled-styled-raster-qa-report.json`.
- DTR-9 raster compared against DTR-6 at file/hash level.
- Deterministic regeneration check for `generate-dtr9-qa.py`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting unsupported exact storefront/facade, entrance/frontage/order/window geometry, exact address placement, exact station/entrance geometry, exact parcel/building footprint, or production card claims.
- Treating NYC building footprints alone as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or exact station geometry.
- Treating Batu-supplied reference photos as production assets, public factual proof, training input, texture extraction source, or general source-policy approval.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets as production images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
