# MVP-06 Corrective Scene Translation And Data Realignment

Status: Complete for review  
Date: 2026-05-29  
Verdict: `review-needed`

## Active Scene Confirmation

Current app/data active set after MVP-06:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

Known correction target resolved:

- The stale active app/data set from before MVP-06 was Greenpoint Av G, Peter Pan Donut & Pastry Shop, Sweetgreen Greenpoint, Former Meserole Theater Context, and Corner Infill Placeholder.
- MVP-06 replaced that active set with the corrected MVP-05 current scene/place set.

No second mismatch was found among the current brief, MVP-05 review artifact, plan/scope docs, and corrected active app data.

## Implementation Summary

- Replaced active `mvpScene.targets` with the corrected five-place current scene.
- Removed previous-scene businesses from active target/card/source data.
- Kept LiveXYZ links as identity/presence evidence only for the four business candidates.
- Kept Greenpoint G subway as a symbolic transit/context anchor only.
- Added visible evidence-status rows to selected cards.
- Dimmed the existing review raster at runtime and labeled it as scaffold-only so it does not read as approved facade evidence.
- Preserved existing pan/zoom, hover/focus, click/tap selection, target rail, selected card, and QA hotspot outline behavior.

## Evidence Status Self-Audit

| Visible place/card | MVP-05 evidence status | MVP-06 UI treatment | Remaining block |
| --- | --- | --- | --- |
| Greenpoint Deli | LiveXYZ identity/presence link supplied only. | Current-scene card labeled identity/presence only. | Address, active status finality, storefront frontage/order, entrance, facade/art reference, and production placement remain insufficient. |
| McDonald's | LiveXYZ identity/presence link supplied only. | Current-scene card labeled identity/presence only. | Address, active status finality, storefront frontage/order, entrance, facade/art reference, branded treatment, and production placement remain insufficient. |
| Dunkin' | LiveXYZ identity/presence link supplied only. | Current-scene card labeled identity/presence only. | Address, active status finality, storefront frontage/order, entrance, facade/art reference, branded treatment, and production placement remain insufficient. |
| Citizens Bank | LiveXYZ identity/presence link supplied only. | Current-scene card labeled identity/presence only. | Address, active status finality, storefront frontage/order, entrance, facade/art reference, branded treatment, and production placement remain insufficient. |
| Greenpoint G subway | MTA evidence supports Greenpoint Avenue station context. | Symbolic transit anchor, not a business card. | Exact stair, elevator, access-point, station-footprint, and production placement geometry remain unresolved. |

## Removed From Active Current-Scene UI/Data

- Peter Pan Donut & Pastry Shop.
- Sweetgreen Greenpoint.
- Former Meserole Theater Context.
- Captured Record Shop.
- Polka Dot.
- Karczma.
- Brouwerij Lane.
- Corner Infill Placeholder.

These names are no longer active targets, active cards, or active source links in `src/mvpPlaceData.js`.

## Truth-Safety Notes

- LiveXYZ links are identity/presence evidence only and are not treated as approved facade/art references.
- Google/Street View-style imagery remains blocked as facade evidence.
- No exact facades, storefront widths, storefront order, addresses, station geometry, active-business finality, or production placement are claimed.
- The scene remains a review-only prototype scaffold, not a production visual asset or public map.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is reviewed and accepted.

## Screenshots

- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/01-overview-corrected-active-scene.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/02-greenpoint-deli-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/03-mcdonalds-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/04-dunkin-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/05-citizens-bank-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/06-greenpoint-g-subway-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/07-qa-hotspots-corrected-set.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/08-mobile-greenpoint-deli-card.png`

## Verification

- `npm run build`
- Browser smoke check of corrected target rail and selected cards.
- Browser selected-state checks for Greenpoint Deli and Greenpoint G subway.
- QA hotspot outline screenshot.
- Mobile selected-card containment screenshot.
- Source scan confirmed stale previous-scene business names are absent from active app data/UI files.
