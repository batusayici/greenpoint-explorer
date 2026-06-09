# Phase 4M-R7 Franklin Hero Kit Extraction Report

Status: Complete; pending Batu review
Date: 2026-06-09
Scope: Franklin-only QA Visual POC hero kit extraction/render proof

## Summary

R7 extracted the Franklin-specific hero fidelity layer out of `src/Phase4BRuntimePreview.jsx` into `src/components/hero/FranklinHeroCorner.jsx`.

R6 proved hybrid recognizability but not benchmark render fidelity. R7 does not claim benchmark closure. It proves a cleaner authoring boundary:

- Measured trace = alignment.
- Hero kit = visual fidelity.
- Runtime = assembly, QA gating, placement, camera review, and regression checks.

## What Changed Vs R6

- Runtime no longer owns the Franklin hero fidelity sculpting functions.
- `Phase4BRuntimePreview.jsx` still computes the measured trace, bay spans, placement, material inputs, QA mode, Visual POC focus, and review cameras.
- `FranklinHeroCorner.jsx` owns the Franklin-specific R6/R5 hero kit modules:
  - low-poly fidelity overlay
  - hybrid fused massing shell
  - cornice/roof box
  - brick/window stack
  - wrapped storefront and awning
  - side-return grammar
  - street grounding kit
- R6 baseline render intent is preserved: the measured trace remains ghosted/alignment-first while the extracted Franklin hero modules remain visually dominant in Visual POC.

## Chosen Authoring Path

R7 keeps a dedicated Three.js module as the immediate safe extraction path, because it preserves the existing runtime and avoids a new dependency or asset-loader decision inside this packet.

Recommended next fidelity path: review-only Blender/DCC-authored GLB/GLTF loaded into the existing Visual POC placement lane.

Reason: JSX primitive tuning has plateaued. Benchmark-level fidelity likely needs authored bevels, material slots, baked AO/contact shadows, side-return detail, glass depth, storefront recesses, non-readable decals, and sidewalk clutter that are much faster and higher quality in a DCC asset workflow.

## Next Step To Hit Benchmark Fidelity

Proposed but not opened: `4M-R8 Franklin Review-Only GLB Hero Asset Placement`.

Suggested next implementation:

- Add or receive `src/assets/review-only/phase-4m-r8-franklin-hero-corner-review-only.glb`.
- Add a narrow GLB/GLTF loader only if Batu opens that batch.
- Use the R7 measured trace placement values for origin, scale, rotation, and QA-only gating.
- Keep the extracted Three.js Franklin module as fallback/reference.
- Capture the same Franklin close, side-return, street-level, corridor ghosted, Manhattan regression, and normal-mode protection views.
- Stop at Batu review.

## Reusable Pieces

- Runtime-to-hero-kit boundary: runtime passes measured placement and drawing primitives; hero kit owns visual fidelity.
- Review camera inventory and capture checklist.
- QA-only Visual POC gating pattern.
- Measured trace as alignment scaffold behind a higher-fidelity hero asset.
- Proposed GLB placement/origin contract from the workflow decision doc.

## Franklin-Specific Pieces

- Franklin red-brick massing proportions.
- Tan/green generic sign-band colors.
- Black awning/storefront wrap proportions.
- Franklin side-return depth and side-bay/fire-escape grammar.
- Franklin street grounding/clutter layout.
- Franklin material palette and storefront/window/cornice rhythm.

## Review Artifacts

- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/franklin-benchmark-close-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/franklin-side-return-corner-wrap-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/franklin-street-level-lower-oblique-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/corridor-oblique-ghosted-r7.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/manhattan-close-r7-shared-renderer-check.png`
- `docs/review-screenshots/phase-4m-r7-franklin-hero-kit-extraction/normal-mode-protection-smoke-r7.png`

## Verification

- `npm run build`: passed.
- Browser review: passed on `http://127.0.0.1:5176/`.
- PNG check: all R7 review screenshots are true PNG files.
- Normal-mode protection: smoke capture added; extracted Franklin hero remains QA/Visual POC gated.

## Preserved Boundaries

- No Manhattan expansion.
- No new source lane.
- No normal-mode Franklin hero exposure.
- No real logos, readable sign text, business identity, active-status, exact storefront/frontage/entrance/address claims, production assets, or public/product claims.
- No R8 opened.

## Batu Review Questions

- Does the extracted hero-kit boundary feel like the right workflow direction?
- Should the next Franklin fidelity batch use GLB/GLTF as recommended?
- Is the current Three.js extracted module adequate as fallback/placement proof while a DCC asset handles benchmark fidelity?
