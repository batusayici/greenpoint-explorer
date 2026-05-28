# Prototype Translation Plan

Status: Recommended next implementation batch  
Date: 2026-05-28

## Exact Implementation Goal

Run a constrained raster prototype integration pass that uses one Phase 6 generated PNG as the primary review-only world plate, then aligns existing interactive behavior to it.

Recommended batch name:

Phase 6.1 Constrained Raster Prototype Integration

Goal:

Replace any generic/code-drawn primary scene surface in the current prototype with a review-only raster plate from Phase 6, while preserving existing pan, zoom, hover, click, tap, selected-card, and mobile containment behavior.

Recommended primary raster plate:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/ui-integrated-recombination-v1.png`

Fallback raster plate if the UI-integrated proof is too busy for interaction alignment:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

## Files Likely To Be Touched In The Later Batch

Expected source/app files:

- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/placeholderScene.js`
- `src/styles.css`

Expected asset file if the bundler needs a served local asset:

- `src/assets/review-only/phase-6-ui-integrated-recombination-v1.png`

The future batch may copy, not move or overwrite, the Phase 6 raster into `src/assets/review-only/` for prototype bundling. The copied asset must be labeled review-only in nearby code/comments or docs.

## Files Explicitly Off-Limits In The Later Batch

- package files
- build/config/CI files
- backend/CMS/persistence/analytics/deployment files
- `docs/approved-reference-corpus/`
- original Phase 6 proof files and generated images
- `docs/archive/`
- broad architecture docs unless the current brief explicitly asks for docs updates

## Allowed Asset Usage

Allowed:

- Copy exactly one Phase 6 generated PNG into `src/assets/review-only/` if required by the app.
- Use that raster as the primary world surface.
- Use Phase 6 asset-kit logic for overlay placement and behavior.
- Use approved corpus references as visual alignment targets.

Not allowed:

- New image generation.
- New SVG/code-drawn storefronts.
- Production asset extraction.
- Moving, overwriting, or editing approved references or Phase 6 proof images.
- Real business names, exact addresses, factual card copy, exact facades, exact station geometry, or live data.

## Implementation Shape

The future batch should:

- Preserve existing interaction behavior.
- Use the raster plate as one positioned world image.
- Define 3-5 fictional-safe targets aligned to visible storefront areas.
- Use existing event handling for hover/click/tap where possible.
- Style selected marker, selected outline, tether, place card, compact controls, and optional place index using Phase 6 rules.
- Keep QA/review-only indicators visually secondary and separate from product-facing UI.

The future batch should not:

- Introduce a new renderer.
- Introduce routing, live data, backend, CMS, persistence, analytics, CI, or deployment.
- Create a generalized asset pipeline.
- Create public module/interface contracts.
- Convert Phase 6 kit families into a production asset system.

## Public Interfaces / Module Boundaries

The recommended implementation should avoid public-interface or module-boundary changes.

If the future implementer finds that a public interface, new data contract, new renderer boundary, or new asset-loading abstraction is required, they must stop and report before implementation.

Small internal object-shape edits to existing placeholder scene data are acceptable only if they remain private to the current prototype and do not claim production data status.

## Acceptance Criteria

The future batch passes only if:

- The primary visual world surface is a raster asset from the approved Phase 6 package.
- No storefront world art is drawn with SVG, CSS, DOM, or canvas primitives.
- Existing pan/zoom and interaction behavior is preserved.
- 3-5 fictional-safe targets can be hovered/focused/selected.
- Selected state includes marker, selected treatment, tether, and card attachment.
- The place card uses fictional placeholder content only.
- Compact controls and optional place index are product-facing, not QA-harness styled.
- Desktop and mobile compositions remain contained and readable.
- No real businesses, addresses, factual copy, exact facades, exact station geometry, live data, routing, backend, CMS, persistence, analytics, deployment, package, or CI work is introduced.

## Screenshot / Evidence Requirements

The future batch should produce review screenshots:

- desktop default overview
- desktop hover/focus state
- desktop selected card state
- mobile selected-state containment
- pan/zoom stress view

Screenshots should be saved under a new review-only folder, for example:

- `docs/review-screenshots/phase-6-1-constrained-raster-prototype-integration/`

The future batch should also report:

- files changed
- copied raster asset path, if any
- verification command used
- whether source behavior was preserved
- `git status --short`
- `git diff --stat`

## Stop Conditions

Stop and report if:

- The Phase 6 generated raster cannot be found.
- The prototype cannot load a raster plate without package/build changes.
- Existing interactions cannot be preserved within the expected files.
- Alignment would require code-drawing storefronts or primary world art.
- The implementation would require public-interface/module-boundary changes.
- The implementation would require real data, addresses, factual card copy, routing, live data, backend, CMS, persistence, analytics, deployment, CI, package changes, or a new renderer.
- The output would drift toward Phase 5.2 beige QA-harness styling as normal product UI.

## Remaining Batu Decisions

Before broader implementation or production planning, Batu must still decide:

- whether the Phase 6 proof is visually strong enough to justify further production-pipeline planning
- which raster plate is preferred for the prototype integration pass
- whether the compact UI/index weight is acceptable
- whether symbolic edge/transit cues should remain in the prototype
- whether any real-place representation may be introduced later after source review
- whether separated asset extraction should be authorized in a later batch
