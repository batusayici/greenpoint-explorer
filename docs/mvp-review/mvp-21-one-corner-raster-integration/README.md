# MVP-21 One-Corner Raster Integration / Visual Pass

Status: Accepted by Batu as reviewable-limited-fallback
Date: 2026-05-30
Artifact class: Review-only implementation notes and self-audit
Scope: NW deli target/card/source treatment only; no new renderer, framework, tooling, generated art, production assets, scraping, live data, staging, or commit

## Verdict

Verdict: `approved-reviewable-limited-fallback`.

Batu accepts MVP-21 only as a limited raster-first NW-corner fallback. The NW deli target is reviewable in the existing interaction shell as a generalized product-facing deli cue. The app keeps the current raster-first MVP-17 world plate as the primary world surface because no separate implementation-specific NW raster plate or layered export was supplied beyond the approved II-A / II-B reference roles.

This pass proves that one generalized, evidence-aware place card can attach to the raster world plate while preserving the interaction shell and truth/disclaimer behavior.

This pass does not prove final visual fidelity, real-place accuracy, address placement, facade translation, exact sign treatment, or production readiness. It does not claim a completed recognizable real-corner raster plate.

## What Changed

- The NW target remains `greenpoint-deli` internally for shell continuity, but the visible product-facing title is now `Corner Deli`.
- The selected card records `GRILLPOINT DELI` as internal/source evidence only.
- The card and evidence rows now state that exact sign, facade, address placement, active-status copy, storefront frontage/order, and station geometry remain unapproved.
- The scene frame now identifies the pass as MVP-21 and records the approved II-A / II-B raster reference paths.
- Non-NW targets remain unchanged.

## Raster / Reference Use

Primary app world surface:

- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`

Approved MVP-21 references recorded in app data:

- `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-A-ui-world-integration.png`
- `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-B-place-card-marker-hover-state.png`

Use limits:

- II-A and II-B were used as approved review references for direction and UI relationship only.
- No new primary world art was generated.
- No code-native storefront, building, road, sign, prop, or texture art was added.
- No texture extraction, tracing, exact sign reproduction, or production asset claim was introduced.

## Truth / Label Treatment

Product-facing visible treatment:

- `Corner Deli`

Internal/source evidence label:

- `GRILLPOINT DELI`

Blocked claims preserved:

- Exact `GRILLPOINT DELI` sign reproduction.
- Exact facade, address placement, storefront frontage/order, entrance position, station geometry, active-status copy, public-release card copy, and production real-place card claims.

## Parked References

Parked NE / SE / SW reference photos were not used or inspected for this implementation pass.

## Interaction Behavior

Preserved:

- Existing pan and zoom.
- Hover, click, tap, focus, and selected-card behavior.
- Target rail.
- Markers, tethers, outlines, and review hotspot mode.
- Review-only ribbon, disclaimer, source/status card behavior.

## Screenshot Status

- Local browser QA opened `http://127.0.0.1:5173/`.
- The selected `Corner Deli` state was captured through the in-app browser and visually checked.
- Screenshot saved into this MVP-21 review packet: `docs/mvp-review/mvp-21-one-corner-raster-integration/mvp-21-accepted-limited-fallback.jpg`.

![MVP-21 accepted limited fallback screenshot](mvp-21-accepted-limited-fallback.jpg)

## Acceptance Limits

Accepted:

- One generalized/evidence-aware NW place card can attach to the raster world plate.
- The existing interaction shell remains usable around the raster-first plate.
- Product-facing treatment stays generalized as `Corner Deli`.
- `GRILLPOINT DELI` remains internal/source evidence only.

Not proven or approved:

- Final visual fidelity.
- Real-place accuracy.
- Exact address placement.
- Facade translation.
- Exact sign, logo, or trade-dress reproduction.
- Production assets, production data, production place cards, or public-release readiness.

## Next Eligible Task

Next eligible task: limited MVP QA/demo freeze.

This is not approval for another renderer pass, visual production expansion, code-native storefront/sign/facade art, production assets, or broader real-corner integration.

## Remaining Batu Decisions

- Whether to supply or approve a separate implementation-specific NW raster plate, layered export, or raster sprite composition.
- Whether exact `GRILLPOINT DELI` sign text may ever appear in review-only art.
- Whether source data should later correct the internal target id/name or remain generalized.
- Whether public card copy or real-place production cards ever open.
- Whether MVP QA/demo freeze should open after reviewing this limited fallback.
