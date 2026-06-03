# Current Execution Brief - Phase 2DTR-3 Review Hold

Status: Phase 2DTR-3 - Four-Corner Regenerated Raster Attempt is complete for Batu review. The next executable task is pending Batu approval or revision direction.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Completed Context

- Phase 2DTR-1 produced a review-only Grillpoint/NW data-to-raster-spec packet.
- Phase 2DTR-2 produced a review-only four-target structured facade/source fixture packet.
- Batu accepted the Phase 2DTR-2 review hold and opened a narrow Phase 2DTR-3 review-only raster/spec attempt.
- Phase 2DTR-3 produced a deterministic four-corner regenerated raster/spec attempt and visible comparison/spec board. It did not produce or approve a true new production scene image.
- Phase 2 remains the active Data-Driven Scene MVP phase.
- Phase 3 remains reserved for future Neighborhood Scale Validation.
- Phase 2A through Phase 2AC are summarized as completed exploratory/source/QA groundwork.
- Phase 2DTR - Data-to-Raster MVP Proof is the focused Phase 2 sub-track.
- MVP-29E remains the current manually composed four-corner raster baseline/reference. It is not treated as the final proof of the data-to-raster pipeline.
- Phase 2DTR-1 output packet: `docs/mvp-review/phase-2dtr-1-one-corner-real-data-to-raster-reproduction-slice/`.
- Phase 2DTR-2 output packet: `docs/mvp-review/phase-2dtr-2-four-target-structured-facade-fixture/`.
- Phase 2DTR-3 output packet: `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/`.
- Batu has unblocked exact MVP review work for storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry. This opens evidence-backed review work for those fields; it does not approve unsupported claims, production/public readiness, production assets, live data, scraping, package/tooling changes, or broad coverage.
- `docs/PHASE_2_PLAN.md` and `docs/AGENT_HANDOFF.md` are historical stubs only, while `docs/PLAN.md` remains the active roadmap.
- Older ledger history is archived at `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`; the active `docs/MVP_EXECUTION_LEDGER.md` remains concise current history.

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

## MVP-Only Reference Photo Decision

For the MVP only, Batu-supplied reference photos are approved as facade/source imagery for review-only scene generation and facade extraction.

They may be used to derive structured facade fields such as:

- Storefront layout.
- Sign band.
- Awning/canopy.
- Entrance cue.
- Window bays.
- Material/color notes.
- Visible props.
- Corner character.

This does not approve production reuse, production assets, production asset direction, production asset pipeline, training use, texture extraction, exact trade-dress reproduction, third-party image scraping, Google/Street View/3D Tiles extraction, live API/source acquisition, or a general production source policy.

NYC Open Data/building footprints provide scaffold geometry context only. They do not provide storefront/facade/sign/window/entrance truth by themselves. Business/source data provides identity/category/address evidence. Exact MVP geometry fields are now allowed for review work when supported by structured source/reference evidence, provenance, and explicit status labels. Structured field statuses must distinguish `verified`, `sourced`, `inferred`, `manual_draft`, `symbolic`, `blocked`, and `unknown`.

## Current Review Hold

Batu review is required before the next implementation batch.

Review question:

- Accept, revise, or reject the Phase 2DTR-3 four-corner regenerated raster/spec attempt.

Review packet:

- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/README.md`
- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/generated/four-corner-regenerated-raster-attempt.json`
- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/generated/visual-instruction-provenance.json`
- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/generated/regeneration-gap-report.json`
- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/generated/four-corner-regenerated-raster-attempt-board.png`

No 2DTR-4 implementation, true regenerated image pass, app/source edit, public-interface/schema approval, package/tooling change, or production/public-readiness change is authorized until Batu updates this brief or gives explicit direction.

## Phase 2DTR Sequence

1. Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.
2. Phase 2DTR-2 - Four-Target Structured Facade Fixture.
3. Phase 2DTR-3 - Four-Corner Regenerated Raster Attempt.
4. Phase 2DTR-4 - QA Acceptance / Gap Report.

## Proposed Next Task After Batu Review

Phase 2DTR-4 - QA Acceptance / Gap Report.

Purpose:

- Decide what the Phase 2DTR-1 through 2DTR-3 packets prove, what remains source-backed, inferred, manual-draft, symbolic, blocked, photo/vendor-dependent, and whether this is enough for the MVP demo path or needs a true regenerated raster image pass first.

This is proposed, not opened. A later brief must name the exact allowed files and acceptance criteria before implementation.

## Continuing Boundaries

- Review-only.
- No product-copy readiness change.
- No production/public readiness change.
- No live scraping, live API calls, or external source acquisition.
- No package/tooling/CI changes unless later approved.
- No app source, data fixture, or script edits unless a later implementation brief explicitly opens those files.
- No production asset, production asset pipeline, or public schema/interface approval.
- Exact storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry may be pursued and represented in review-only artifacts when supported by structured source/reference evidence and explicit status labels.
- No unsupported exact geometry claims and no production/public exact-geometry claims.
- No Google/Street View/3D Tiles extraction.
- No third-party image scraping.
- No replacement of raster-first primary world art with SVG, canvas, CSS, DOM-drawn storefronts/buildings/roads/signs, or other code-generated primary world art.

## Recent Phase 2DTR-3 Changes

- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/`

## Verification For Phase 2DTR-3

- JSON parse for Phase 2DTR-3 generated artifacts.
- Raster file/dimension inspection for the comparison/spec board.
- Visual inspection of the comparison/spec board.
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
