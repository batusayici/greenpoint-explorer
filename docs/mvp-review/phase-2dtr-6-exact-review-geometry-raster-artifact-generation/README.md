# Phase 2DTR-6 - Exact Review Geometry Raster Artifact Generation

Status: Complete as a first review-only regenerated raster attempt
Date: 2026-06-03
Scope: Review-only MVP raster artifact, not production art, public exact geometry, or product/source approval

## Purpose

This packet uses the Phase 2DTR-5 exact review geometry fixture, raster prompt adapter spec, raster prompt, and supplied MVP reference photos to produce the first true-to-life, art-directed review-only raster attempt for the Manhattan Ave / Greenpoint Ave MVP scene.

The artifact is intentionally review-only. It may show real business names, address cues, storefront order, facade cues, and Greenpoint G station cues for MVP review, but it does not approve production assets, public exact-geometry claims, source/provenance promotion, live data, scraping, Google/Street View/3D Tiles extraction, texture extraction, tracing, training, or normal-mode replacement.

## Deliverables

- `generated/exact-review-geometry-raster-attempt.png` - 1672 x 941 review-only isometric raster scene generated from the Phase 2DTR-5 prompt/spec surface and supplied reference photos.
- `generated/exact-review-geometry-raster-qa-board.png` - 2200 x 1600 visual QA/contact-sheet board comparing the DTR-5 fixture intent, generated raster output, visible unresolved gaps, scores, and DTR-7 corrective deltas.

## What Improved Versus The Previous Raster

- The scene now visibly follows the real DTR-5 storefront order: NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens Bank, plus Greenpoint G station cues.
- The four named storefront anchors are more distinguishable than the previous manually composed MVP-29E baseline and the prompt-only DTR-5 packet.
- Facade cues are stronger: Grillpoint has a maroon deli sign band and food-window rhythm, McDonald's has gray/yellow frontage and corner glazing, Dunkin' has the orange/pink awning read, and Citizens Bank has green sign/recessed entry cues.
- The artifact is a coherent compact isometric scene rather than a flat map, generic illustration, collage, or docs-only packet.
- The QA board makes partial fidelity visible instead of hiding unresolved source and generation mismatches.

## What Is Still Wrong

- Generated micro-text is imperfect and must not be used as product or public factual signage.
- The SW Dunkin address cue appears wrong in the generated raster; the DTR-5 fixture intends 893 Manhattan Ave, while the raster visibly reads closer to 993.
- Reference-photo fidelity is partial: sign bands, facade bay proportions, window/entrance placement, and facade-specific details need a tighter corrective pass against the supplied photo crops.
- Greenpoint G cue placement is useful for review but too visually repeated/ambiguous; DTR-7 should keep the SE cue primary unless Batu confirms additional symbolic cues are acceptable.
- Exact review-coordinate alignment is not proven at production/public level. The raster is useful for MVP direction, not exact survey-like geometry.

## Does This Prove The Real-Data-To-Isometric-Scene Pipeline Direction?

Partially, yes.

The DTR-6 artifact proves the direction is viable enough to continue: structured fixture fields and the raster prompt surface can produce a single coherent isometric scene with the intended storefront order, named anchors, facade cues, intersection layout, and review-only status.

It does not yet prove exact facade/entrance/window/address/station fidelity. The pipeline now needs a corrective pass that locks the generated raster more tightly to the DTR-5 review-coordinate bounds and supplied reference-photo crops.

## QA Scores

| Criterion | Score | Verdict | DTR-7 corrective delta |
| --- | ---: | --- | --- |
| Art direction fidelity | 4/5 | Acceptable | Keep coherent isometric review-board look; reduce generated text noise. |
| Reference-photo fidelity | 3/5 | Partial | Lock facade bays, sign bands, entrance/window cues, and visible material cues from reference crops. |
| Storefront/order accuracy | 4/5 | Acceptable | Preserve NW/NE/SW/SE order and correct SW address cue. |
| Facade/entrance/window accuracy | 3/5 | Partial | Overlay DTR-5 bounds and retouch facade/entrance/window mismatches. |
| Subway cue placement | 3/5 | Partial | Keep SE Greenpoint G cue primary; remove or explicitly label extra symbolic cues if needed. |
| Overall MVP demo usefulness | 4/5 | Acceptable | Use as review proof only; do not promote to production/public-ready asset. |

## Exact Next Corrective Batch

Phase 2DTR-7 - Corrective Raster Alignment And Text Cleanup.

Purpose:

- Produce a targeted image-edit or overlay-corrected raster pass from the DTR-6 attempt.
- Correct the SW Dunkin address cue to 893 Manhattan Ave or omit the address from the raster body if text reliability remains weak.
- Lock storefront sign panels, entrance/window cues, and frontage lines to the DTR-5 review-coordinate bounds.
- Clarify Greenpoint G cue placement and remove extra ambiguity unless Batu approves multiple symbolic review cues.
- Regenerate the QA/contact sheet with before/after crops and updated scores.

## Self-Audit

- Intended decision: Batu can judge whether the DTR-5 fixture/prompt can drive a true-to-life isometric raster direction worth correcting.
- Fidelity level: Level 3 static style-frame/review raster.
- Required output format: PNG.
- SVG status: Disallowed for the primary scene because this is a high-fidelity raster review pass.
- Visual evidence: The output shows a full four-corner isometric scene, named storefronts, visible transit cues, intersection geometry, and a review-only footer.
- Truth handling: Real names and address cues are review-only; exact geometry remains a review candidate; unsupported station/facade precision is documented as partial.
- Pass/fail: Pass as a first DTR-6 review-only raster proof of direction and pipeline usefulness; partial for exact coordinate/facade fidelity.
- Revision needed: DTR-7 should correct SW address text, sign micro-text, stricter DTR-5 coordinate alignment, and subway cue ambiguity.
