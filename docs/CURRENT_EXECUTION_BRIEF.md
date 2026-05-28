# Current Execution Brief

Status: Active implementation brief  
Date: 2026-05-28  
Authorized task: Phase 6.1 Constrained Raster Prototype Integration

This file is the single executable source of truth for Codex's next task. Supporting docs may provide context, but Codex must be able to execute Phase 6.1 from this file alone.

## Authorized Task

Phase 6.1 Constrained Raster Prototype Integration.

## Goal

Update the existing interactive prototype so its primary world surface uses one approved Phase 6 raster proof image, while preserving existing pan, zoom, hover, click, tap, selected-card, and mobile containment behavior.

This is a constrained review-only prototype integration batch. It is not production asset work, a production asset pipeline, broad Greenpoint coverage, real-place-card work, architecture expansion, a new renderer, routing, backend/CMS/persistence/analytics/deployment work, or public-interface approval.

## Primary Raster

Use this raster plate unless blocked:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/ui-integrated-recombination-v1.png`

Fallback only if the primary is too busy or cannot support interaction alignment:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

## Allowed Files To Change

Source/app files:

- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/placeholderScene.js`
- `src/styles.css`

Asset-copy allowance:

- Copy exactly one Phase 6 generated PNG into `src/assets/review-only/` if the app needs a served local raster asset.
- Do not move, overwrite, or edit the original Phase 6 generated image.
- Label the copied asset as review-only in implementation notes or a concise nearby code comment if useful.

Review screenshots:

- Create screenshots only under `docs/review-screenshots/phase-6-1-constrained-raster-prototype-integration/`.

## Files Off-Limits

Do not modify:

- package files
- build/config/CI files
- backend/CMS/persistence/analytics/deployment files
- `docs/approved-reference-corpus/`
- original Phase 6 proof files or generated images
- `docs/archive/`
- generated images outside the allowed copied review-only app asset
- screenshots outside the new Phase 6.1 review-screenshot folder

Do not stage or commit.

## Implementation Requirements

- Use the selected raster as the primary world surface.
- Do not draw storefronts, facades, awnings, sign bands, props, sidewalk/curb texture, or primary world art with SVG, CSS, DOM, canvas, or primitive code shapes.
- Preserve existing pan, zoom, hover, click, tap, selected-card, and mobile containment behavior.
- Define 3-5 fictional-safe interactive targets aligned to visible storefront areas in the raster.
- Use fictional placeholder place labels only.
- Do not introduce real businesses, exact addresses, factual place copy, exact facades, exact station geometry, live data, or real-place cards.
- Implement or preserve selected marker, selected building treatment, tether/card attachment, compact place card, compact controls, and optional compact place index.
- Keep product-facing UI aligned with the approved Inked Indie / Compact Corner paper-card direction.
- Keep QA/review-only labels visually secondary and separate from normal UI.
- Do not create a production asset pipeline, public module/interface contract, real data system, new renderer, routing, backend, CMS, persistence, analytics, deployment, or broad map coverage.

## Visual Alignment Rules

Preserve:

- Inked Indie hand-inked linework from the raster.
- Controlled hatching and local street texture.
- Muted warm palette with brick, dark green, ochre, muted red, charcoal ink, worn paper, and restrained blue accents.
- Storefront specificity and readable density.
- Product-facing selected marker hierarchy.
- Selected treatment attached to a visible storefront target.
- Slim tether/card connection.
- Paper/card UI integration without drifting into Phase 5.2 beige QA-harness styling.

## Public Interfaces And Module Boundaries

No public interfaces or module boundaries should change.

Small internal edits to existing placeholder scene data are allowed only if they remain private to this review-only prototype and do not claim production data status.

Stop before implementation if a public interface, new data contract, new renderer boundary, new asset-loading abstraction, package change, or build/config change appears necessary.

## Preflight Before Coding

Before editing source/app files, state:

- whether public interfaces or module boundaries will change; expected answer is none
- files expected to be touched
- feedback loop and screenshot evidence to verify the change
- decisions still reserved for Batu

## Screenshot Evidence

Start or use the existing local dev server if needed.

Capture these review screenshots:

- desktop default overview
- desktop hover/focus state
- desktop selected card state
- mobile selected-state containment
- pan/zoom stress view

Save screenshots under:

- `docs/review-screenshots/phase-6-1-constrained-raster-prototype-integration/`

## Verification Requirements

Run the fastest available app check. If no formal test/lint command exists or dependencies are unavailable, report that clearly.

Before final response, run:

- `git diff --stat`
- `git status --short`

Confirm:

- existing interactions were preserved
- the primary visual world surface is the selected Phase 6 raster
- no SVG/CSS/DOM/canvas/code-drawn storefront or primary world art was introduced
- only allowed files were changed
- no approved corpus files, original Phase 6 images, archived folders, package files, build/config/CI files, backend/CMS/persistence/analytics/deployment files were modified
- no staging or commit occurred

## Stop Conditions

Stop and report if:

- The Phase 6 raster image cannot be found.
- The raster cannot be loaded without package/build/config changes.
- Existing interactions cannot be preserved within the allowed files.
- Alignment would require code-drawn storefronts or primary world art.
- A public-interface/module-boundary change appears necessary.
- The implementation would require package/build/config/CI changes, a new renderer, routing, live data, backend, CMS, persistence, analytics, deployment, real business data, exact addresses, factual card copy, exact facades, or exact station geometry.
- The normal UI would drift toward Phase 5.2 beige QA-harness styling.
- More than one Phase 6 generated PNG would need to be copied into app assets.

## Acceptance Criteria

The batch is complete only if:

- The prototype uses one Phase 6 raster as the primary visual world surface.
- Existing pan/zoom and pointer/touch interaction behavior is preserved.
- 3-5 fictional-safe targets can be hovered/focused/selected.
- Selected state includes marker, selected treatment, tether, and card attachment.
- The place card uses fictional placeholder content only.
- Compact controls and optional place index are product-facing, not QA-harness styled.
- Desktop and mobile compositions remain contained and readable.
- Required screenshots are saved.
- Verification requirements are complete and reported.

## Final Response Required

Report:

- files changed
- copied raster asset path, if any
- screenshots created
- verification performed
- confirmation that existing interactions were preserved
- confirmation that no off-limits files were modified
- `git diff --stat`
- `git status --short`
- no commit
- no staging
