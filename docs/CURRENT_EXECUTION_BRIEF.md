# Current Execution Brief - Phase 2DTR-8 Review Hold

Status: Phase 2DTR-8 - Fixture Geometry Primitive Completion For Styled Raster Readiness is complete for Batu review. The next executable task is pending Batu approval or revision direction.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Completed Context

- Phase 2DTR-1 produced a review-only Grillpoint/NW data-to-raster-spec packet.
- Phase 2DTR-2 produced a review-only four-target structured facade/source fixture packet.
- Phase 2DTR-3 produced a deterministic four-corner regenerated raster/spec attempt and visible comparison/spec board.
- Batu unblocked exact MVP review work for storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry.
- Commit `9b53b40` recorded the exact-review-geometry unblock and Phase 2DTR-1 through Phase 2DTR-3 packet state.
- Phase 2DTR-4 produced a review-only exact geometry source map, target scene spec, reproducibility gap list, and visible source-map board.
- Commit `0b7ea0b` recorded the Phase 2DTR-4 exact geometry source map and target scene spec packet.
- Phase 2DTR-5 produced a structured review-only exact geometry fixture, deterministic raster prompt adapter spec, adapter provenance map, and raster prompt text for the true-to-life Manhattan Ave / Greenpoint Ave MVP scene.
- Phase 2DTR-6 produced a visually strong review-only raster scene image and visual QA/contact-sheet board, but Batu identified that it did not prove source-data-driven rendering from the Phase 2DTR-5 fixture.
- Phase 2DTR-7 produced a deterministic black-and-white SVG blueprint and validation report from the Phase 2DTR-5 exact review geometry fixture. It does not use AI image generation or polished raster styling.
- Phase 2DTR-8 produced review-only road, pedestrian/corner, storefront/building, address-label, subway-cue, render-order, and occlusion primitives plus a JSON-first styled-raster-ready geometry adapter and blueprint.
- Phase 2 remains the active Data-Driven Scene MVP phase.
- Phase 3 remains reserved for future Neighborhood Scale Validation.
- MVP-29E remains the current manually composed four-corner raster baseline/reference. It is not treated as the final proof of the data-to-raster pipeline.
- Phase 2DTR-4 output packet: `docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/`.
- Phase 2DTR-5 output packet: `docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/`.
- Phase 2DTR-6 output packet: `docs/mvp-review/phase-2dtr-6-exact-review-geometry-raster-artifact-generation/`.
- Phase 2DTR-7 output packet: `docs/mvp-review/phase-2dtr-7-fixture-to-blueprint-scene-layout-validation/`.
- Phase 2DTR-8 output packet: `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/`.
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

- Accept, revise, or reject the Phase 2DTR-8 geometry primitive completion packet and its DTR-9 readiness verdict.

Review packet:

- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/README.md`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/geometry-primitive-fixture.json`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/styled-raster-ready-geometry-adapter.json`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/geometry-primitive-blueprint.svg`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/geometry-primitive-validation-report.json`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/styled-raster-geometry-prompt.txt`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generate-geometry-primitives.mjs`

No Phase 2DTR-9 implementation, polished/styled raster generation, AI image generation, app/source edit, public-interface/schema approval, package/tooling change, normal-mode raster replacement, or production/public-readiness change is authorized until Batu updates this brief or gives explicit direction.

## Proposed Next Task After Batu Review

Phase 2DTR-9 - Controlled Styled Raster From Geometry-First Adapter Output.

Purpose:

- Produce one controlled review-only styled raster attempt from the Phase 2DTR-8 JSON geometry adapter output.
- Use `generated/styled-raster-ready-geometry-adapter.json` and `generated/geometry-primitive-fixture.json` as the layout source of truth.
- Use supplied reference imagery only for facade styling cues after geometry placement is locked.
- Keep exact address text QA-only unless Batu explicitly reopens in-scene address labels.
- Render one primary Greenpoint G cue only.
- Preserve review-only/provenance labels and avoid production/public exact-geometry claims.

This is proposed, not opened. A later brief must name the exact allowed files and acceptance criteria before implementation.

## Continuing Boundaries

- Review-only.
- No product-copy readiness change.
- No production/public readiness change.
- No polished/styled raster generation or AI image generation until a later brief explicitly opens Phase 2DTR-9.
- No live scraping, live API calls, Google/Street View/3D Tiles extraction, or external source acquisition.
- No package/tooling/CI changes unless later approved.
- No app source, data fixture, visual asset, generated raster image, or script edits unless a later implementation brief explicitly opens those files.
- No production asset, production asset pipeline, or public schema/interface approval.
- Exact storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry may be pursued and represented in review-only artifacts when supported by structured source/reference evidence and explicit status labels.
- No unsupported exact geometry claims and no production/public exact-geometry claims.
- No replacement of raster-first primary world art with SVG, canvas, CSS, DOM-drawn storefronts/buildings/roads/signs, or other code-generated primary world art.

## Recent Phase 2DTR-8 Changes

- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/DECISION_LOG.md`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/`

## Verification For Phase 2DTR-8

- JSON parse for DTR-8 generated JSON artifacts.
- SVG exists and includes road, sidewalk, crosswalk, storefront, entrance, sign, address-policy, and subway-cue labels.
- Deterministic regeneration check for `generate-geometry-primitives.mjs`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting unsupported exact storefront/facade, entrance/frontage/order/window geometry, exact address placement, exact station/entrance geometry, exact parcel/building footprint, or production card claims.
- Treating NYC building footprints alone as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or exact station/entrance geometry.
- Treating Batu-supplied reference photos as production assets, public factual proof, training input, texture extraction source, or general source-policy approval.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating production images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
