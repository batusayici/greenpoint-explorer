# Phase 2DTR-9 - Controlled Styled Raster From Geometry-First Adapter

Status: Complete for Batu review
Date: 2026-06-03
Scope: Review-only styled raster artifact generated from the DTR-8 geometry-first adapter

## Purpose

DTR-9 produces the first controlled styled raster after DTR-8 completed the missing hard geometry primitives. The primary source is the JSON geometry adapter, not a prose-only prompt.

No live scraping, Google/Street View/3D Tiles extraction, app source edit, package/tooling change, normal-mode replacement, production asset approval, or production/public exact-geometry claim was introduced.

## Dirty State Reconciliation

Before DTR-9 work began, the previously dirty file was restored to repository state:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`

It was not used as a DTR-9 source or reference. DTR-9 uses the DTR-8 adapter and supplied reference photos; DTR-6 is used only for comparison.

## Deliverables

- `generated/controlled-styled-raster.png` - selected review-only styled raster, 1672 x 941.
- `generated/controlled-styled-raster-qa-board.png` - visual QA board comparing DTR-8 fixture intent, DTR-9 raster output, fixture constraints, mismatch callouts, and scores.
- `generated/controlled-styled-raster-qa-report.json` - machine-readable QA report.
- `generate-dtr9-qa.py` - packet-local deterministic generator for the QA board and report.

## What Improved Versus DTR-6

- The output is meaningfully new at file/hash level and visually different from DTR-6.
- The road, intersection, sidewalk, and crosswalk structure more clearly follows the DTR-8 geometry adapter.
- The selected raster preserves one primary Greenpoint G cue instead of multiple ambiguous primary station cues.
- Address text is kept out of the scene body; exact address strings appear only in QA/footer metadata.
- The Dunkin `893` failure mode is avoided in the scene body, and the QA footer uses `893`.

## What Still Fails Or Remains Partial

- Facade/window/entrance placement is art-directed to the DTR-8 bounds but not pixel-exact to every geometry rectangle.
- Reference-photo fidelity is still partial, especially at small facade details and generated microtext.
- Small street-sign text and storefront microcopy still show image-generation artifacts.
- This does not prove deterministic rasterization; it proves a controlled geometry-first styled raster attempt suitable for MVP review.

## MVP Feedback Verdict

DTR-9 proves enough for MVP feedback, with limits.

It demonstrates that the DTR-8 geometry-first adapter can control a styled review raster enough to preserve target order, road/crosswalk structure, address policy, and one primary subway cue. It does not prove production/public exact geometry, deterministic pixel-perfect rendering, or final facade accuracy.

## Exact DTR-10 Recommendation

Phase 2DTR-10 should be one narrow corrective visual pass, not another readiness or geometry phase.

DTR-10 should use the DTR-8 blueprint as an overlay mask and focus only on:

- tightening facade/window/entrance/sign alignment,
- suppressing generated microtext artifacts,
- preserving the single primary Greenpoint G cue,
- preserving QA-only address policy,
- keeping the same DTR-8 geometry adapter as the source of truth.

## Self-Audit

- Intended artifact class: high-fidelity review-only styled raster plus QA board.
- Decision supported: whether the geometry-first adapter can drive a styled raster that is useful for MVP feedback.
- Required output format: PNG raster and PNG QA board.
- SVG status: not used as the primary visual artifact; DTR-8 SVG is represented as a deterministic blueprint panel in the QA board.
- Visual evidence: the raster follows the DTR-8 corner order, road/crosswalk layout, one-G policy, and address policy.
- Truth handling: review-only labels are present; unsupported exact claims remain omitted or constrained to QA metadata.
- Pass/fail: pass for controlled MVP feedback; partial for reference-photo and facade/entrance/window precision.
