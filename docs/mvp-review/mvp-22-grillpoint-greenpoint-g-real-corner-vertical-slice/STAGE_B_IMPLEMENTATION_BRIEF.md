# MVP-22 Stage B Implementation Brief

Status: Prepared after Stage A approval-with-constraint; implementation not started
Date: 2026-05-30
Scope: One NW Grillpoint / Greenpoint Ave G raster-first real-corner vertical slice only

## Stage B Gate

Stage B may open as a raster-first real-corner vertical slice, but only after Batu explicitly opens implementation from this brief.

Stage B must not start if the approved raster output is missing, if the selected sign-label treatment changes, if the card copy or source URLs change without review, or if the task requires NE/SE/SW parked references.

## Exact Raster Asset Path Or Generation/Input Path

Stage B raster output path:

- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png`

Future app integration path, only after the raster output exists and is approved for review-only integration:

- `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png`

Approved Stage B input/reference paths:

- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpeg`
- `docs/mvp-reference-images/northwest-subwayA.jpeg`
- `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-A-ui-world-integration.png`
- `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-B-place-card-marker-hover-state.png`

Input limits:

- Use only the NW Grillpoint/subway field references listed above for real-corner source context.
- Do not use parked NE/SE/SW references.
- Do not use Google/Street View/3D Tiles-derived extraction, tracing, stored visual use, texture reuse, training input, generation input, or facade-reference use.
- Do not use LiveXYZ-derived facade/art use.
- Do not create code-native storefront, sign, facade, building, road, prop, or texture art as the primary world surface.

## Exact Public Sign-Label Treatment

Approved factual/card label:

- `Grillpoint Deli`

Review-only raster sign-label treatment:

- `GRILLPOINT DELI` may appear only as stylized, art-directed sign text for this one-corner review slice if Batu opens Stage B from this brief.
- The sign must not be a traced logo, exact facade reproduction, extracted texture, or production asset.
- If exact readable text creates fidelity or rights risk during implementation, fall back to `Grillpoint Deli` on the card and a non-readable deli sign cue in the raster.

Station/transit treatment:

- Use `Greenpoint Av G`, `G`, or a symbolic subway cue only as nearby/adjacent transit context.
- Do not state or imply the subway entrance is directly in front of Grillpoint unless stronger field/photo evidence supports that exact spatial relationship and Batu approves the claim.

## Factual Card Copy And Source URLs

Proposed Stage B card copy:

- Card title: `Grillpoint Deli`
- Category: `Deli / food retail`
- Address: `903 Manhattan Ave, Brooklyn, NY 11222`
- Description: `Deli at the northwest Manhattan Ave / Greenpoint Ave corner. Nearby Greenpoint Av G station context is shown as an authored, approximate diorama cue.`
- Source URL: `https://www.restaurantji.com/ny/brooklyn/grillpoint-deli-/`
- Supporting source URLs:
  - `https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible`
  - `https://www.mta.info/accessibility/stations`
- Internal/source reference labels:
  - `Batu-supplied NW field photo: northwest-grillpoint-deli-closeup.jpeg`
  - `Batu-supplied NW field photo: northwest-grillpoint-deli-wide.jpeg`
  - `Batu-supplied NW field photo: northwest-grillpoint-deli-facade.jpeg`
  - `Batu-supplied NW field photo: northwest-subwayA.jpeg`
- Last verified: `2026-05-30`
- Disclaimer: `Unofficial authored prototype. This card is not an official map, directory, real-time business listing, or exact facade/address/station-geometry claim.`

Copy limits:

- Do not say `open now`.
- Do not use ratings, reviews, promotional claims, hours, delivery claims, quality claims, popularity claims, ownership claims, or partnership language.
- Do not claim exact station geometry, exact address placement, exact storefront frontage/order, or that the subway entrance is directly in front of Grillpoint.

## Allowed Files

Stage B may touch only these paths if Batu opens implementation:

- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/`
- `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png`
- `src/mvpPlaceData.js`
- `src/PlaceholderWorld.jsx`
- `src/App.jsx`, only if selected-card or target-rail behavior needs minimal support
- `src/styles.css`, only for containment, card fit, or screenshot-safe layout polish
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Stop before touching any other file unless Batu approves an updated allowlist.

Public interface/module boundary changes:

- None approved.
- Stage B must preserve the existing interaction shell, target/card behavior, review disclaimer/status behavior, and module boundaries.

## Screenshot QA Requirements

If the local app/browser environment allows screenshots, Stage B must capture and save:

- Desktop default overview with the raster world plate visible.
- Desktop selected `Grillpoint Deli` card.
- Desktop hover/focus marker/card state.
- QA outline/hotspot state proving the selected target attachment is reviewable.
- Mobile selected-card containment state.
- Pan/zoom stress state showing the raster world plate remains framed and nonblank.

Suggested screenshot folder:

- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/`

If screenshot capture is blocked, record the blocker in the review packet and do not claim visual QA passed.

## Stop Conditions

Stop before implementation if:

- The raster output path does not exist or is not approved for review-only integration.
- Evidence changes or conflicts with Grillpoint identity, address, visible sign, or nearby Greenpoint Av G context.
- Stage B would require exact facade reproduction, exact address placement, exact storefront frontage/order, exact station geometry, or a direct `in front of Grillpoint` claim.
- Stage B would require NE/SE/SW corners, live data, scraping, backend, CMS, analytics, deployment, CI, broad map systems, or a new renderer/framework/package/tooling.
- Stage B would make production asset, production place-card, public-release, or production-readiness claims.
