# MVP-16B Raster-First Prototype Recovery

Status: Complete for Batu/ChatGPT review  
Date: 2026-05-29  
Artifact class: Browser QA screenshots and implementation review packet  
Verdict: Pending Batu/ChatGPT visual review

## Decision Context

MVP-16A is approved for recovery use only. This batch uses the supplied raster plate as the primary world surface:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

This is not final production art approval. The raster remains review-only, fictional-safe, non-production, and not a factual Greenpoint representation.

## Implementation Notes

- The active prototype imports the approved raster plate from `src/mvpPlaceData.js`.
- The active scene size now matches the raster plate: `1672 x 941`.
- `src/PlaceholderWorld.jsx` now renders the raster as the only primary world surface.
- The previous code-drawn perspective street/building/storefront renderer was removed from the active world component.
- Five transparent hit regions are mapped onto the raster and attached to the existing target rail/card flow.
- Markers, tethers, hover outlines, selected outlines, and QA hotspot labels are overlay-only treatments.
- Real business identity remains in structured data, cards, rail labels, source links, and UI copy only. It is not baked into the raster artwork.
- Pan, zoom, hover, focus, selected card, target rail, and mobile containment behavior are preserved through the existing shell.

## Screenshot Evidence

Required screenshots were captured under:

- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-default-overview.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-hover-focus-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-selected-card-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/mobile-selected-state-containment.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/pan-zoom-stress-view.png`

## Verification

- `npm run build`
- Browser render/screenshot QA against the local prototype
- `git diff --check`

## Self-Audit Against Hard Constraints

| Constraint | Result | Notes |
| --- | --- | --- |
| Raster image is the primary world surface | Pass | The active world renders the approved PNG as a Pixi sprite and no longer draws a street/building scene. |
| No code-drawn storefronts | Pass | Storefront drawing routines were removed from `src/PlaceholderWorld.jsx`. |
| No code-drawn buildings | Pass | Building/corner drawing routines were removed from the active renderer. |
| No code-drawn roads or sidewalks | Pass | Road, sidewalk, crosswalk, and street-object drawing routines were removed from the active renderer. |
| No new Pixi/SVG/CSS/canvas world-art renderer pass | Pass | Pixi is retained only to display the raster and allowed interaction overlays. |
| No visual repaint/restyle/improvement of raster | Pass | The raster is imported as-is with no tint, wash, repaint, filter, or generated replacement. |
| No real business identity baked into artwork | Pass | Real names appear only in cards, rail labels, source links, and UI copy. |
| 3-5 interactive zones | Pass | Five transparent hit regions are mapped to the raster. |
| Markers/tethers/selected outlines only as overlays | Pass | Target markers, tethers, hover outlines, selected outlines, and QA labels are overlay graphics. |
| No broad scaling/data/system work | Pass | Static local data was updated only for MVP-16B raster anchors and truth-safety copy. |
| No commit | Pass | No staging or commit was performed. |

## Compromises / Review Notes

- The temporary raster anchors do not represent exact Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, or Greenpoint G station facades, order, addresses, storefront widths, entrances, or station geometry.
- The approved raster already contains fictional storefront names and a symbolic transit cue; these are treated as review-only artwork, not factual place claims.
- Browser screenshot capture used the local prototype after the in-app browser render check. Screenshot files are review evidence only, not visual approval.

## Pending Decisions

- Batu/ChatGPT must accept, revise, or reject MVP-16B as a recovery baseline.
- Batu/ChatGPT must decide whether the next brief opens visual polish, asks for a raster-anchor revision, supplies a replacement raster plate, or holds for review.
