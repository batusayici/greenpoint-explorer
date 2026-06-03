# Current Execution Brief - Phase 2DTR Scope Realignment Complete

Status: Phase 2 data-to-raster MVP proof realignment is complete. This brief records the docs-only scope/plan update and sets the next recommended executable task.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Current Task - Scope / Plan Realignment

- This was a docs-only planning and scope update. It did not authorize or edit app source, data fixtures, assets, screenshots, package files, package tooling, or scripts.
- Phase 2 remains the active Data-Driven Scene MVP phase.
- Phase 3 remains reserved for future Neighborhood Scale Validation.
- Phase 2A through Phase 2AC are now summarized as completed exploratory/source/QA groundwork.
- Phase 2DTR - Data-to-Raster MVP Proof is created as the focused Phase 2 sub-track.
- MVP-29E remains the current manually composed four-corner raster baseline/reference. It is not treated as the final proof of the data-to-raster pipeline.

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

NYC Open Data/building footprints provide scaffold geometry context only. They do not provide storefront/facade/sign/window/entrance truth by themselves. Business/source data provides identity/category/address evidence. Structured field statuses must distinguish `verified`, `sourced`, `inferred`, `manual_draft`, `symbolic`, `blocked`, and `unknown`.

## Next Recommended Executable Task

Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

Purpose:

- Prove the pipeline on Grillpoint/NW by generating a fresh review-only raster scene spec/art prompt from structured data rather than hand-authored prose/manual composition.

Required output for the later implementation batch:

- Structured one-corner source object.
- Deterministic generated raster/spec artifact.
- Provenance/status mapping from each visual instruction back to structured source fields.
- Review comparison against the current MVP-29E manual raster.

The next implementation batch must produce visible pipeline evidence. It should not be only overlays, clearer explanation, verifier-only work, or governance cleanup.

## Phase 2DTR Sequence

1. Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.
2. Phase 2DTR-2 - Four-Target Structured Facade Fixture.
3. Phase 2DTR-3 - Four-Corner Regenerated Raster Attempt.
4. Phase 2DTR-4 - QA Acceptance / Gap Report.

## Boundaries For Phase 2DTR-1

- Review-only.
- No product-copy readiness change.
- No production/public readiness change.
- No live scraping, live API calls, or external source acquisition.
- No package/tooling/CI changes unless later approved.
- No app source, data fixture, or script edits unless a later implementation brief explicitly opens those files.
- No production asset, production asset pipeline, or public schema/interface approval.
- No exact storefront/frontage/entrance/facade/address/station claims unless supported by structured source/reference evidence and later approved.
- No Google/Street View/3D Tiles extraction.
- No third-party image scraping.
- No replacement of raster-first primary world art with SVG, canvas, CSS, DOM-drawn storefronts/buildings/roads/signs, or other code-generated primary world art.

## Files Changed In This Realignment

- `docs/MVP_SCOPE.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/PHASE_2_PLAN.md`

## Verification For This Realignment

Run before commit:

```sh
git diff --check
```

```sh
git status --short
```

Use any existing lightweight docs validation if present.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting exact storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, exact parcel/building footprint, or production card claims.
- Treating NYC building footprints as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or exact station geometry.
- Treating Batu-supplied reference photos as production assets, public factual proof, training input, texture extraction source, or general source-policy approval.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating production images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
