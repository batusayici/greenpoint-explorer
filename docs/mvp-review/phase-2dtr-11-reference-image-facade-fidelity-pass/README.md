# Phase 2DTR-11 - Reference-Image Facade Fidelity Pass

Status: Complete for Batu review
Date: 2026-06-03
Scope: Narrow reference-image-constrained facade/sign/window/entrance pass on the DTR-10 raster

## Purpose

DTR-11 answers one question:

Can the supplied real facade imagery materially improve the storefronts while preserving the DTR-10 geometry-first scene?

The answer is yes, partially. The DTR-11 raster is visibly more reference-constrained than DTR-10, especially for Grillpoint and McDonald's, and it preserves the DTR-10 roads, sidewalks, crosswalks, storefront order, camera, and one primary Greenpoint G cue. It does not prove full-fidelity deterministic facade reproduction.

## Sources

- `docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass/generated/corrected-styled-raster.png`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/geometry-primitive-fixture.json`
- `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/styled-raster-ready-geometry-adapter.json`
- `docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass/generated/corrected-styled-raster-qa-report.json`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg`
- `docs/mvp-reference-images/northeast-mcdonalds-facadeA.jpg`
- `docs/mvp-reference-images/northeast-mcdonalds-closeup.jpeg`
- `docs/mvp-reference-images/northeast-mcdonalds-wide.jpg`
- `docs/mvp-reference-images/southwest-dunkin-facadeA.jpeg`
- `docs/mvp-reference-images/southwest-subway-wide.jpeg`
- `docs/mvp-reference-images/southwest-subwayC.jpeg`
- `docs/mvp-reference-images/southeast-citizens-facadeA.jpeg`
- `docs/mvp-reference-images/southeast-citizens-facadeB.jpg`
- `docs/mvp-reference-images/southeast-citizens-wide.jpg`
- `docs/mvp-reference-images/southeast-subwayB.jpg`

No geometry adapter changes, new data sources, live scraping, Google/Street View extraction, 3D Tiles extraction, or third-party image scraping were used.

## Deliverables

- `generated/reference-facade-fidelity-raster.png` - DTR-11 facade-focused corrected raster, 1672 x 941.
- `generated/facade-extraction-specs.json` - per-storefront facade extraction/spec records.
- `generated/facade-fidelity-board.png` - reference crop, extracted spec, DTR-10 region, and desired correction notes for each storefront.
- `generated/dtr10-dtr11-before-after-facade-qa-board.png` - DTR-10/DTR-11 full-scene and close-up facade comparison board.
- `generated/reference-facade-fidelity-qa-report.json` - machine-readable QA report and scores.
- `generated/crops/` - generated reference, DTR-10, and DTR-11 comparison crops.
- `generate-dtr11-facade-qa.py` - packet-local deterministic board/spec/report generator.

## What Improved Versus DTR-10

- Grillpoint now has a stronger maroon sign, green G cue, black canopy, central entry, poster/window-display rhythm, and adjacent dark-doorway cue.
- McDonald's now better reflects the gray facade, dark glass rhythm, brown slat panels, yellow/white canopy edge, golden arch cue, and mural mass.
- Dunkin now has a clearer black/orange-pink sign band, side/corner sign cue, darker recessed entry, and beige corner mass.
- Citizens now has a stronger white/gray masonry read, green sign box, recessed entry, black railings/steps, and reddish-brown window-trim rhythm.
- The single primary Greenpoint G cue is preserved.
- Address text remains QA-only and is not painted into storefront bodies.

## Which Facades Remain Weak

- Dunkin remains the weakest reference match because the available facade image is wider, lower fidelity, and includes more street context than direct storefront detail.
- Citizens is improved, but the small scene scale still compresses the recessed entry and window-trim details.
- McDonald's and Grillpoint are materially improved, but still stylized rather than exact photo-derived facade transfers.

## Pipeline Verdict

DTR-11 partially proves the supplied-reference-image-to-facade-scene path.

It proves that supplied real facade imagery can materially improve the scene while preserving geometry-first layout. It does not prove full-fidelity deterministic facade reproduction because the built-in image-editing method still treats references as visual constraints, not as mask-locked, perspective-warped, pixel-addressable facade transfers.

## Method Bottleneck

The bottleneck is not a lack of reference imagery. It is control.

The current method can improve facade cues, but without explicit per-facade masks, perspective-warp controls, and deterministic crop-to-scene compositing, it cannot guarantee exact window/door/sign placement or eliminate small invented details.

## Recommendation

Proceed to MVP feedback packaging with DTR-11.

Only perform one more ultra-narrow facade correction if Batu rejects a specific storefront crop on the DTR-11 before/after board. Do not open another broad readiness or planning phase.

## Self-Audit

- Intended decision: Batu can decide whether supplied facade references materially improve the scene while preserving DTR-10 geometry.
- Fidelity level: Level 3 static styled raster review artifact plus crop boards.
- Required output format: PNG raster and PNG boards.
- SVG status: disallowed as primary output because the decision is visual facade fidelity.
- Visual evidence: DTR-10 and DTR-11 full-scene comparison, per-storefront reference crops, DTR-10 crops, DTR-11 crops, and extracted specs.
- Truth handling: review-only; unsupported exact claims are omitted or listed; address text remains QA-only; one primary G cue only.
- Missing fidelity: full deterministic facade transfer and production/public exact geometry remain unproven.
- Pass/fail: pass for MVP feedback; partial for full-fidelity facade reproduction.
