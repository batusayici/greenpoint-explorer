# Phase 2 Plan

Status: Active Phase 2 planning / not implementation approval
Date: 2026-06-03
Phase name: Data-Driven Scene MVP
Focused sub-track: Phase 2DTR - Data-to-Raster MVP Proof
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

Phase 2 proves that the Manhattan Ave x Greenpoint Ave MVP scene can be driven by traceable real-world inputs instead of remaining only a manually composed raster.

Phase 2 is not Neighborhood Scale Validation. Phase 3 remains reserved for that future scale test.

## Current Phase 2DTR Goal

```text
source inputs
-> structured scene/facade/geometry fields
-> deterministic generated raster/spec artifact
-> review-only isometric scene output
-> QA/status comparison
```

MVP-29E is the current manually composed four-corner raster baseline/reference. It is useful comparison evidence, but it is not the final proof of the data-to-raster pipeline by itself.

## Completed Groundwork Summary

Phase 2A through Phase 2AC are complete as exploratory/source/QA groundwork.

That work established:

- Manifest/source-evidence planning and local review-only source fixtures.
- Deterministic source-evidence generation and drift/negative-contract checks.
- Strict promotion/product-public-readiness gates.
- Draft real-data scene records and QA-mode rendering with field-level statuses.
- Active-target expansion for Grillpoint, McDonald's, Dunkin', Citizens, and Greenpoint G.
- NYC Open Data/building-footprint candidate comparison as scaffold geometry context only.
- QA layer controls and calmer comparison defaults.

That work does not approve production schemas, public interfaces, production source pipelines, production assets, production asset direction, exact geometry claims, public real-place cards, or neighborhood-scale validation.

## Phase 2DTR Source Model

Use the narrow MVP-only source model below:

- Business/source data provides identity, category, address, and source-evidence status.
- NYC Open Data/building footprints provide scaffold geometry context only; they do not provide storefront, facade, tenant-frontage, sign, window, entrance, active-business, exact-address, or station-geometry truth by themselves.
- Batu-supplied reference photos are approved for the MVP only as facade/source imagery for review-only scene generation and facade extraction.

Batu-supplied reference photos may support structured facade fields such as:

- Storefront layout.
- Sign band.
- Awning/canopy.
- Entrance cue.
- Window bays.
- Material/color notes.
- Visible props.
- Corner character.

This does not approve Google/Street View/3D Tiles extraction, third-party image scraping, live source acquisition, production reuse, production assets, production asset direction, training use, texture extraction, exact trade-dress reproduction, or a general production source policy.

Structured fields must preserve status values such as `verified`, `sourced`, `inferred`, `manual_draft`, `symbolic`, `blocked`, and `unknown`.

## Phase 2DTR Sequence

### Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice

Purpose:

- Prove the pipeline on Grillpoint/NW by generating a fresh review-only raster scene spec/art prompt from structured data rather than hand-authored prose/manual composition.

Required output for later implementation:

- Structured one-corner source object.
- Deterministic generated raster/spec artifact.
- Provenance/status mapping from each visual instruction back to structured source fields.
- Review comparison against the current MVP-29E manual raster.

Boundaries:

- Review-only.
- No product-copy readiness change.
- No live scraping/API calls.
- No package/tooling/CI changes unless later approved.
- No production asset or public schema approval.
- No exact storefront/frontage/entrance/facade/address/station claims without structured source/reference evidence and Batu approval.

### Phase 2DTR-2 - Four-Target Structured Facade Fixture

Purpose:

- Extend the structured facade/source fixture model to Grillpoint, McDonald's, Dunkin', Citizens, and Greenpoint G.
- Use available real business/source data, NYC footprint/building/parcel scaffold where available, and Batu-supplied reference photos for MVP facade/source imagery.
- Keep Greenpoint G symbolic/blocked where exact station geometry is unresolved.

### Phase 2DTR-3 - Four-Corner Regenerated Raster Attempt

Purpose:

- Generate a new four-corner raster/spec attempt from the structured scene manifest and compare it against MVP-29E.
- Test whether the manually composed raster can be reproduced or improved through structured source inputs.

### Phase 2DTR-4 - QA Acceptance / Gap Report

Purpose:

- Decide what is source-backed, what is inferred, what requires more reference photos/vendor data, and what is good enough for MVP demo.
- Produce a concise acceptance/gap report, not another broad governance reset.

## Guardrails

- No movement of this work to Phase 3.
- No full-neighborhood expansion in Phase 2.
- No hidden manual corrections.
- No unprovenanced real-world claims.
- No production/public-release data claims.
- No scraping, live API calls, backend services, CMS, automated refresh, or broad imports.
- No Google/Street View/3D Tiles extraction.
- No third-party image scraping.
- No production reuse, training, texture extraction, or production asset use from reference photos.
- No raster or visual revisions unless a later brief explicitly opens that scope.
- No app/source/data fixture/script/package edits unless a later implementation brief explicitly opens those files.
- No package/tooling/CI changes unless later approved.
- Generated truth, source truth, inferred values, manual drafts, symbolic cues, blocked fields, and unknown fields must remain distinct.
- The active-scene guardrail remains in force for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- The primary-world-art raster-first rule remains in force. Code-native graphics may support QA overlays, hit regions, markers, labels, controls, or alignment guides, but not primary world art.

## Phase 2DTR Exit Read

Phase 2DTR is successful if the current MVP scene can be evaluated through:

- Structured source/facade/geometry fields for the active target set.
- Deterministic generated raster/spec artifacts.
- Review-only isometric raster scene output.
- Provenance/status mapping from visual instructions back to source fields.
- QA comparison against MVP-29E.
- A concise acceptance/gap report that states what can support MVP demo, what remains inferred/manual, and what remains blocked.

Phase 2DTR is not successful if the scene only works through hidden hand-edits, untraceable prose prompts, unreviewed imagery, collapsed status categories, production/public overclaims, or another broad governance reset without visible pipeline evidence.
