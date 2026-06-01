# Current Execution Brief - MVP-29E Narrow Corrective Pass Review Hold

Status: MVP-29E Narrow Corrective Pass for hover outline geometry, crosswalk geometry, and Citizens/Dunkin subway placement is complete for Batu review; no further implementation or full screenshot-QA phase is opened by this brief.

Owner boundary: Batu directly opened this narrow corrective pass to preserve the current direction and fix only hover outline geometry, crosswalk geometry, and Citizens/Dunkin subway placement. Batu owns acceptance, revision, or rejection of the revised MVP-29E raster/app output; final scope approval; visual taste calls; production/public claims; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; brand/trade-dress decisions; and any later MVP-29G/full QA or demo-freeze gate.

Codex must not start another raster generation, app integration pass, full screenshot QA phase, QA/demo freeze, production asset pass, source expansion, package/tooling change, architecture change, public-interface change, or commit unless Batu explicitly opens that next scope.

## Purpose

Record the completed narrow MVP-29E corrective pass and hold the next task for Batu review.

MVP-29E now includes the narrow corrective pass to one review-only raster-first four-corner Manhattan Ave x Greenpoint Ave scene with:

- NW: Grillpoint Deli.
- NE: McDonald's.
- SW: Dunkin'.
- SE: Citizens Bank.
- Greenpoint G subway context with review-scale cues on the Greenpoint Ave side next to Grillpoint, Dunkin', and Citizens.
- Corrected crosswalk striping based on the bird's-eye reference and stronger prior generated target.
- Grillpoint subway cue preserved, with Citizens and Dunkin subway cues moved to the Greenpoint Ave side.
- Tighter place-specific hover/selected/QA outline geometry inspired by ARC-003.
- Existing app interaction shell preserved.
- Hotspots/cards aligned to the new four-corner raster.
- Truth-safe card/source treatment.
- Basic review screenshots captured.

## Completed MVP-29E Output

Review packet:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/README.md`

Generated review raster:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`

Integrated app asset:

- `src/assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png`

App/data integration:

- `src/mvpPlaceData.js`

Review screenshots:

- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-overview.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-selected-card.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-hotspot-qa-outline.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/mobile-selected-card-containment.jpg`

## Current Treatment Status

- Grillpoint Deli: real review card and approximate stylized NW deli treatment, with a review-scale G entrance cue next to it on the Greenpoint Ave side; exact facade, frontage/order, address placement, active-status finality, legal sameness with Greenpoint Deli, exact entrance coordinates, and exact station geometry remain blocked.
- McDonald's: real review card and approximate simplified NE fast-food/storefront treatment with review-scale signage/logo cues; production logo/trade-dress clearance, exact facade/frontage/order, endorsement/partnership, ratings, reviews, and open-now status remain blocked.
- Dunkin': real review card and stylized SW coffee/donut treatment only under Batu's narrow MVP-only exception; production use, tracing, texture extraction, generation input from Google-derived SW images, exact trade dress, exact facade/frontage/address/station geometry, and generalizing the exception remain blocked.
- Citizens Bank: real review card and approximate simplified SE bank/branch treatment with review-scale signage/logo cues and a review-scale G entrance cue next to it on the Greenpoint Ave side; production logo/trade-dress clearance, ATM/service claims, exact branch entrance, exact facade/frontage/order, endorsement/partnership, exact entrance coordinates, and exact station geometry remain blocked.
- Greenpoint G subway: separate transit-context target with cues next to Grillpoint, Dunkin', and Citizens on the Greenpoint Ave side at review/demo scale; exact station geometry, exact entrance coordinates, exact stair alignment, and production transit accuracy remain blocked.

## Verification State

MVP-29E narrow corrective pass verification completed:

- `npm run build`
- Local browser review at `http://127.0.0.1:5173/`
- Browser console review during screenshot capture: no warnings or errors reported.
- Basic desktop overview, selected-card, hotspot/QA outline, and mobile selected-card containment screenshots captured.

This verification is basic MVP-29E review evidence only. It does not open or complete the later full MVP-29G screenshot QA phase.

## Current Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Revising or regenerating the MVP-29E raster.
- Changing additional app files beyond a Batu-approved revision scope.
- Opening full MVP-29G screenshot QA.
- Opening MVP-30 QA/demo freeze.
- Making production/public-release claims.
- Treating the MVP-29E raster as production art, approved production asset direction, exact real-world representation, or MVP completion.
- Using Google/Street View/3D Tiles-derived images beyond the narrow SW Dunkin MVP-only review exception.
- Using SW Google-derived material as generation input, training input, texture source, tracing source, stored facade source, or exact trade-dress source.
- Adding live data, scraping, backend, CMS, analytics, deployment, CI, routing, accounts, persistence, or broad map coverage.
- Changing package tooling, source architecture, renderer architecture, public module boundaries, or public interfaces.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the narrow MVP-29E corrective pass output.

If Batu accepts MVP-29E:

- Batu may open a later full four-corner screenshot QA recovery phase, an MVP-29E revision-polish pass, or another explicitly bounded task.

If Batu requests revision:

- The next brief must name the specific raster, hotspot, card/data, screenshot, or containment changes allowed.

## Still Blocked

- MVP-30 QA/demo freeze before Batu accepts the four-corner raster/app output and opens any required QA recovery.
- Final MVP completion claim.
- Production visual assets, production asset direction, or production asset pipeline.
- Exact facade, exact frontage/order, exact address placement, exact branch/ATM placement, exact station geometry, ratings, reviews, `open now`, endorsement, partnership, official collaboration, or public-release claims.
- Live data, scraping, backend, CMS, analytics, deployment, CI, broad map coverage, accounts, persistence, or routing.

## Future Sequence

1. Batu review/acceptance or revision of MVP-29E.
2. Optional MVP-29E revision pass if Batu requests changes.
3. Full four-corner screenshot QA recovery only if Batu opens it.
4. MVP-30 MVP QA / Demo Freeze only after the four-corner scene and required QA evidence are accepted.
5. MVP-31 MVP Completion / Post-MVP Parking.
