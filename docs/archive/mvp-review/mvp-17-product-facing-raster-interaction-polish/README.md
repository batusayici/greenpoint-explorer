# MVP-17 Product-Facing Raster Interaction Polish

Status: Accepted for MVP review baseline with evidence gap noted  
Date: 2026-05-30  
Artifact class: Product-facing raster interaction polish review packet  
Verdict: Accepted by Batu; mobile containment screenshot gap explicitly accepted

## Goal

MVP-17 polishes the accepted MVP-16B raster-first prototype so the default experience reads more like an exploratory product prototype and less like an internal review/debug board, while preserving the approved raster-first recovery model.

## What Changed

- Reduced the visual weight of the top metadata, review badge, scene note, target rail, and view controls.
- Shortened the default viewport copy so the raster scene is the clear hero.
- Renamed the visible shell from recovery/debug language toward product-facing review language.
- Kept truth and review caveats in card copy, data, and documentation rather than letting long caveats dominate the default viewport.
- Made target markers, tethers, and selected outlines subtler while keeping them readable.
- Adjusted selected-card sizing, shadow, opacity, and attachment treatment so it feels more integrated with the scene.
- Preserved mobile selected-card containment with lighter chrome.

## Intentionally Preserved From MVP-16B

- The approved raster plate remains the normal-mode primary world surface:
  - `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`
- The raster is imported and displayed as-is.
- Existing pan/zoom behavior is preserved.
- Existing hover/select behavior is preserved.
- Existing target rail and selected-card behavior are preserved.
- Transparent hit regions remain the interaction model.
- Marker, tether, hover outline, selected outline, and QA label treatments remain overlay-only.
- Business identity remains in structured data, cards, rail labels, accessible text, source links, and UI copy only.

## Screenshot Status

Supplied MVP-17 screenshot evidence:

- `desktop-default-overview`: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-default-overview.png`
- `desktop-hover-focus-state`: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-hover-focus-state.png`
- `desktop-selected-card-state`: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-store-card.png`
- `mobile-selected-state-containment`: missing; evidence gap explicitly accepted by Batu on 2026-05-30
- `pan-zoom-stress-view`: `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-zoom-view.png`

QA notes:

- Four supplied PNG files exist under `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/`.
- `desktop-store-card.png` is treated as the selected-card evidence by filename/content intent, but it does not use the originally requested `desktop-selected-card-state` slug.
- `desktop-zoom-view.png` is treated as the pan/zoom stress evidence by filename/content intent, but it does not use the originally requested `pan-zoom-stress-view` slug.
- The required mobile selected-state containment evidence is still missing from the supplied screenshot folder, and Batu explicitly accepted review with that evidence gap on 2026-05-30.

MVP-17 is accepted as the product-facing raster interaction polish baseline despite the missing mobile containment screenshot.

## Verification

- `npm run build`: passed.
- Active source scan for prior code-drawn scene renderer names: passed.
- `git diff --check`: passed.
- Screenshot file existence check: partial; four desktop PNGs found, mobile containment PNG missing and accepted as an evidence gap by Batu.

Build note:

- Vite still reports the existing large-chunk warning. No package/config/tooling changes were made.

## Self-Audit Against Raster-First Constraints

| Constraint | Result | Notes |
| --- | --- | --- |
| Approved raster remains primary world surface | Pass | MVP-17 did not alter `drawRasterPlate` or replace the raster source. |
| No code-drawn storefronts/buildings/roads/sidewalks/props/textures/signs | Pass | The batch adjusted overlay and CSS treatments only. |
| No new primary world art | Pass | No new art files or replacement raster were created. |
| No raster repaint/restyle/regeneration | Pass | The raster is still imported as-is with no tint, filter, wash, repaint, or generated replacement. |
| No real business identity baked into artwork | Pass | Real identity remains in cards, rail labels, source links, accessible text, and UI copy. |
| No exact real facade/address/station-geometry claims | Pass | Copy continues to identify anchors as review-only and non-production. |
| Preserve interaction shell | Accepted | Source preserves the same React/Pixi shell and target flow; desktop evidence is supplied. |
| Preserve mobile containment | Accepted with evidence gap | CSS keeps mobile selected-card containment, but the required mobile screenshot is missing from the supplied folder and Batu accepted the gap. |

## Limitations / Compromises

- This packet carries an accepted evidence gap: one required MVP-17 screenshot is missing, and Batu accepted review without it.
- Polish is intentionally restrained: no optional ambient motion was added because screenshot QA is unavailable and the current priority is making the existing raster interaction shell less review-heavy without widening scope.
- Plan/current-brief/ledger reconciliation should mark MVP-17 accepted and leave the next task pending Batu approval.

## Remaining Batu Decisions

- Whether to request additional product-facing polish after screenshot review.
- Whether any later brief should open optional ambient overlays.
- Whether current real business identity remains literal in UI/cards, becomes context-only, is fictionalized, or is omitted.
