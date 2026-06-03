# Greenpoint Explorer MVP Feedback Demo Package

Status: Review-only package for external MVP feedback
Date: 2026-06-03

## What This Is

Greenpoint Explorer is a proposed local discovery experience built around a compact, illustrated neighborhood scene. The current MVP slice focuses on Manhattan Ave and Greenpoint Ave in Greenpoint, Brooklyn.

The idea is not a broad map yet. It is a small authored corner that asks whether a place can feel worth exploring when real storefront/source/reference data is translated into a charming isometric scene with reviewable provenance.

## What To Review First

Hero scene:

![DTR-11 hero scene](generated/hero-reference-facade-fidelity-raster.png)

Facade before/after board:

![DTR-11 facade before after board](generated/facade-before-after-review-board.png)

Pipeline board:

![Compact pipeline board](generated/compact-pipeline-board.png)

## What This MVP Proof Demonstrates

- A four-corner Greenpoint scene can be visually distinctive enough to evaluate as a product direction.
- Structured geometry can control the scene better than prompt-only raster generation.
- The scene preserves storefront order, road/crosswalk layout, and one primary Greenpoint G cue.
- Batu-supplied facade/reference photos materially improve storefront specificity.
- QA boards can show what is source-backed, what is approximate, and what is still unresolved.

## What Remains Review-Only

- The raster scene is a review artifact, not a production asset.
- Business names, facade cues, geometry, address metadata, and subway cues are for MVP review only.
- Address text remains QA-only and should not be treated as public exact-address presentation.
- The DTR-8 blueprint/geometry adapter is review-coordinate geometry, not GIS/survey geometry.

## What Is Not Production/Public-Ready

- No production visual asset direction is approved by this package.
- No production/public exact-geometry claim is made.
- No exact facade, exact entrance, exact address, exact station, or exact parcel claim is approved for public use.
- No live data, scraping, Google/Street View extraction, 3D Tiles extraction, backend, CMS, deployment, analytics, or broad map coverage is included.
- This package does not approve normal-mode raster replacement or public product copy.

## Known Limitations

- Facade transfer is improved but not pixel-perfect.
- Full facade fidelity would require explicit masks, perspective warp, and path-level compositing.
- Small signage and window details remain stylized and approximate.
- Dunkin and Citizens still compress real facade detail at small scale.
- The scene is optimized for MVP feedback, not final art, production accuracy, or public release.

## What Feedback We Want

Use [feedback-script-checklist.md](feedback-script-checklist.md) during review sessions.

The most important questions are whether the scene feels worth exploring, whether it feels locally specific, whether the storefronts are recognizable enough, and what people want to click first.

## Pipeline Evidence

Primary package artifacts:

- `generated/hero-reference-facade-fidelity-raster.png`
- `generated/facade-before-after-review-board.png`
- `generated/compact-pipeline-board.png`
- `generated/demo-package-manifest.json`

Supporting evidence:

- `../phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/geometry-primitive-blueprint.svg`
- `../phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/generated/styled-raster-ready-geometry-adapter.json`
- `../phase-2dtr-10-narrow-corrective-styled-raster-pass/generated/corrected-styled-raster-qa-report.json`
- `../phase-2dtr-11-reference-image-facade-fidelity-pass/generated/reference-facade-fidelity-qa-report.json`

## Phase 2DTR Status

Phase 2DTR is complete for MVP-feedback purposes.

Do not open DTR-12. Do not reopen facade/raster correction unless external feedback shows facade fidelity is a decisive blocker.

Next step after this package is interactive demo/MVP acceptance audit or external feedback sessions.

## Carried-Forward Dirty State

The following repo state existed before this package work and remains out of scope:

- `AGENTS.md` modified
- `research/` untracked
