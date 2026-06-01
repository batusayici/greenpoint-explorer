# MVP-29E Four-Corner Raster Scene Production / App Integration

Status: Complete for Batu review
Date: 2026-06-01
Scope: Review-only raster production and existing-app integration
Verdict: `review-mvp-29e-output`

## Decision Summary

MVP-29E produced one review-only, raster-first four-corner Manhattan Ave x Greenpoint Ave scene and integrated it into the existing prototype shell.

Focused revision note, 2026-06-01:

- Batu kept the current MVP-29E direction and explicitly kept the real business names, signage, and logos moving forward.
- The raster plate was revised against the supplied bird's-eye intersection reference so Manhattan Ave and Greenpoint Ave read as a cleaner perpendicular four-corner crossing.
- The four crosswalks were corrected to connect corner-to-corner, with pedestrian/traffic signal cues oriented to the crossing directions.
- Greenpoint G entrance cues were repositioned to the Greenpoint Ave side next to Grillpoint, Dunkin', and Citizens at review/demo scale.
- Hover/selected/QA overlays now use place-specific outline paths in the spirit of ARC-003 `II-B-place-card-marker-hover-state.png`, rather than generic rectangular callout boxes.

This batch follows Batu's direct instruction to open MVP-29E as implementation after committing the accepted four-corner scope/reference reset. It does not approve production assets, production asset direction, exact facades, exact frontage/order, exact address placement, exact station geometry, live data, deployment, routing, backend services, CMS, analytics, accounts, persistence, CI, or broad map coverage.

Active candidate set:

- NW: Grillpoint Deli.
- NE: McDonald's.
- SW: Dunkin'.
- SE: Citizens Bank.
- Transit context: Greenpoint G subway, with the SE cue represented at review/demo scale and exact station geometry still blocked.

`Greenpoint Deli` remains archival / prior-conflicting language only. It is not the active NW label.

## Output Artifacts

Generated review raster:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`

Integrated app raster copy:

- `src/assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png`

App/data integration:

- `src/mvpPlaceData.js`

Basic review screenshots:

- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-overview.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-selected-card.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-hotspot-qa-outline.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/mobile-selected-card-containment.jpg`

## Artifact Class

- Intended artifact class: Level 4 review/prototype raster asset.
- Decision supported: whether Batu accepts this first review-only four-corner raster scene and app integration as the MVP-29E output, or requests raster/card/hotspot revisions before later QA/demo work.
- Required output format: PNG for the primary raster plate; JPG screenshots for review evidence.
- SVG status: SVG is disallowed for the primary world surface. The integrated app uses the raster plate as the normal world surface; code-driven graphics are limited to hotspots, markers, selected outlines, tethers, QA labels, and cards.

## Generation / Reference Discipline

Generation mode:

- Built-in `imagegen` raster generation.

Primary prompt goal:

- Produce a wide 16:9, authored, raster-first isometric diorama of Manhattan Ave x Greenpoint Ave with all four corners visible, preserving the Inked Indie / Compact Corner direction, keeping the real business names/signage/logos per Batu's revision instruction, correcting the perpendicular intersection/crosswalk/subway cue relationships, and leaving room for interaction overlays.

Visual inputs used as context:

- Batu-supplied bird's-eye Manhattan Ave x Greenpoint Ave intersection reference: `/Users/batusayici/Desktop/birdseye view.png`
- `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png`
- `docs/archive/visual-artifacts/phase-4-fictional-safe-identity-ui-integration-proof/generated/fictional-safe-street-slice.png`
- `docs/archive/visual-artifacts/phase-4-5-reusable-system-scalability-proof/generated/mini-street-slice-scalability-proof.png`
- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg`
- `docs/mvp-reference-images/northwest-subwayA.jpg`
- `docs/mvp-reference-images/northeast-mcdonalds-facadeA.jpg`
- `docs/mvp-reference-images/northeast-mcdonalds-wide.jpg`
- `docs/mvp-reference-images/southeast-citizens-facadeA.jpeg`
- `docs/mvp-reference-images/southeast-subwayB.jpg`

SW Dunkin handling:

- No Google-derived SW Dunkin image was used as generation input.
- The SW corner uses only the MVP-29D broad treatment rules: human-reviewed, stylized, truth-safe, non-production review/demo-scale approximation under Batu's narrow MVP-only exception.
- This does not approve production use, texture extraction, tracing, stored facade reuse, training input, generation input from SW Google-derived images, exact trade dress, or a general Google-derived source-policy change.

## Integrated App Behavior

The existing interaction shell is preserved:

- Raster-first Pixi world plate.
- Pan and zoom controls.
- Place rail.
- Hover/focus/selected marker feedback.
- Place-specific hover/selected outline paths based on the approved ARC-003 hover-state behavior.
- Tethers and selected card.
- Review/QA hotspot outlines.
- Mobile selected-card containment.

No new framework, package tooling, router, map system, backend, public module boundary, or production architecture was introduced.

The existing local `mvpScene` export remains the app integration surface. Its contents now represent the approved MVP-29E active set instead of the prior MVP-22 single-corner slice.

## Card / Data Treatment

Each business card includes:

- Name.
- Category.
- Address.
- Source URL through the reviewed source list.
- Last verified date.
- Unofficial-map disclaimer.

Cards intentionally omit:

- Ratings.
- Reviews.
- Open-now status.
- Hours.
- Endorsement.
- Partnership.
- Promotional claims.
- Cultural/community claims.
- Exact active-status finality beyond the reviewed source status.

Greenpoint G is included as a separate transit-context target. Its card uses station-area language and explicitly blocks exact station geometry and NW/SW cue claims.

## Truth-Status Summary

| Candidate / cue | MVP-29E treatment | Still blocked |
| --- | --- | --- |
| Grillpoint Deli | Real review card, real label/signage, approximate stylized NW deli/corner-store treatment, review-scale Greenpoint G cue next to it on the Greenpoint Ave side. | Exact facade, exact frontage/order, exact address placement, active-status finality, legal sameness with Greenpoint Deli, exact subway entrance coordinates/station geometry. |
| McDonald's | Real review card, real label/signage/logo cues, approximate simplified NE fast-food/storefront massing. | Production logo/trade-dress clearance, exact facade/frontage/order, endorsement/partnership, ratings, reviews, open-now status. |
| Dunkin' | Real review card, real label, stylized SW coffee/donut cue under Batu's narrow MVP-only exception. | Production use, tracing, texture extraction, generation input from Google-derived SW images, exact trade dress, exact facade/frontage/address/station geometry. |
| Citizens Bank | Real review card, real label/signage/logo cues, approximate simplified SE bank/branch treatment, review-scale Greenpoint G cue next to it on the Greenpoint Ave side. | Production logo/trade-dress clearance, ATM/service claims, exact branch entrance, exact facade/frontage/order, endorsement/partnership, exact subway entrance coordinates/station geometry. |
| Greenpoint G cues | Separate review target; cues represented at review/demo scale beside Grillpoint, Dunkin', and Citizens on the Greenpoint Ave side. | Exact station geometry, exact entrance coordinates, production transit accuracy, exact stair alignment/footprint. |

## Screenshot Evidence

Captured:

- Desktop overview.
- Desktop selected-card state.
- Desktop QA/hotspot outline state.
- Mobile selected-card containment.

This is basic MVP-29E review evidence only. It does not open or complete the later full MVP-29G screenshot QA phase.

## Visual Self-Audit

- Intended decision: Batu can judge whether this first four-corner raster scene and app integration are useful enough to proceed, or whether the raster/card/hotspot alignment needs revision.
- Fidelity level: Level 4 review/prototype asset.
- Required output format: Raster PNG primary plate, with JPG review screenshots.
- SVG status: Disallowed for primary world art; no SVG primary world surface was produced.
- Visual evidence: The raster visibly contains NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens, a cleaner perpendicular four-corner intersection, four connected crosswalks, oriented signal cues, and three Greenpoint G entrance cues on the Greenpoint Ave side.
- Truth handling: Business/place data is source-backed in cards; visual treatments are approximate; Dunkin remains MVP-exception-only; Greenpoint G cue placement is review/demo scale while exact station geometry remains blocked.
- Missing fidelity: Batu may still want raster revisions for storefront specificity, signal/crosswalk exactness, subway entrance exactness, or hotspot alignment before a later QA/demo gate.
- Pass/fail: Pass for MVP-29E review evidence; not a final visual approval, production asset approval, or MVP completion claim.
- Revision needed: Focused geometry/subway/hover revision completed for Batu review; Batu review is required before any later QA/demo freeze or production direction decision.

## Verification

- `npm run build`
- Local browser review at `http://127.0.0.1:5173/`
- Browser console review: no warnings or errors reported during screenshot capture.
- Desktop/mobile screenshots captured under `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/`.

## Unresolved Decisions

- Batu must accept, revise, or reject this MVP-29E raster/app integration output.
- Batu owns whether the raster needs another art pass before later QA.
- Batu owns whether simplified brand cues are acceptable or should be toned down further.
- Batu owns whether the next executable task is full MVP-29G screenshot QA recovery, a revision pass, or another gate review.
- Production visual assets, exact geometry, production data, public-release claims, and production pipeline decisions remain blocked.

## Next Pointer

`docs/CURRENT_EXECUTION_BRIEF.md` should move to Batu review of MVP-29E and hold later MVP-29G/full QA work pending acceptance or revision.
