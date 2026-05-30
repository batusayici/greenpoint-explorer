# Current Execution Brief - Pending MVP-20 Review

Status: MVP-20 Real-Corner Translation Boundary is complete for Batu review with a `proceed-to-mvp-21` recommendation. No next task is approved yet.

Owner boundary: Batu owns the MVP-20 verdict, whether to accept the Greenpoint Deli / `GRILLPOINT DELI` reconciliation path, whether to approve exact or generalized sign treatment, whether to approve any source-data label correction, whether to approve the proposed MVP-21 implementation boundary, and any later visual or source implementation approval.

Codex must not proceed into MVP-21, source implementation, raster integration, visual generation, asset generation, renderer work, screenshots, staging, or commit unless Batu opens a later current brief.

## Current Outcome

Completed task:

- `MVP-20 Real-Corner Translation Boundary`

Artifact:

- `docs/mvp-review/mvp-20-real-corner-translation-boundary/README.md`

Verdict:

- `proceed-to-mvp-21`

Reason:

- MVP-19 supplied owned/non-Google northwest corner references for 903 Manhattan Ave.
- The references are strong enough to plan a recognizable one-corner translation.
- The references also reveal a required truth correction: visible storefront signage reads `GRILLPOINT DELI`, while current app/data and prior docs refer to Greenpoint Deli.
- MVP-20 defines the Place / Building / Storefront / MapAnchor boundary, allowed and blocked references, truth constraints, treatment recommendations, and a proposed downstream MVP-21 boundary.

MVP-17 remains accepted only as the product-facing raster interaction polish baseline. It is not accepted as a truthful or recognizable Greenpoint Ave x Manhattan Ave scene.

## Recommended Next State

Recommended next task, pending Batu approval:

- `MVP-21 One-Corner Raster Integration / Visual Pass`

MVP-21 must be a tightly scoped implementation brief only if Batu accepts MVP-20 and explicitly opens the boundary. It should focus on the NW 903 Manhattan Ave / `GRILLPOINT DELI` selected corner and minimal adjacent context.

MVP-21 must not open until Batu decides:

1. Whether the active target label remains Greenpoint Deli, changes to `GRILLPOINT DELI`, or becomes fictional-safe.
2. Whether exact `GRILLPOINT DELI` sign text may appear in review-only raster art.
3. Which supplied northwest reference files are approved for review-only visual translation.
4. What primary raster material will be supplied or approved for the MVP-21 world surface.
5. Which app/source files, if any, may be edited.
6. What screenshot/self-audit requirements apply.

This recommended next task is not approved until Batu explicitly opens it.

## Active Scene / Evidence State

Active scene/place set:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

Selected corner for downstream planning:

- NW selected corner at 903 Manhattan Ave.
- Current app/data label: Greenpoint Deli.
- Supplied field-reference sign text: `GRILLPOINT DELI`.
- Translation target status: proceed to a one-corner raster translation pass only after Batu approves the naming/sign-treatment boundary.

MVP-20 treatment state:

- `GRILLPOINT DELI` / 903 Manhattan Ave: first real-corner translation target, name manual-review-required.
- McDonald's: context-only or deferred for the first one-corner pass.
- Dunkin': deferred.
- Citizens Bank: deferred / fallback only.
- Greenpoint G subway: symbolic context anchor only; exact station geometry remains blocked.

## Still Forbidden Unless A Later Brief Opens Scope

- MVP-21 source implementation.
- App/source edits.
- Raster integration.
- Visual asset generation.
- Visual polish.
- Renderer work.
- Screenshots.
- New generated assets.
- Scraping.
- Live data pipeline.
- Google/Street View/3D Tiles-derived stored imagery, extraction, tracing, texture reuse, training input, generation input, or facade-reference use.
- LiveXYZ-derived facade/art use.
- Production/public-release claims.
- Real-place production cards.
- Exact facade, exact address-placement, exact storefront frontage/order, exact station-geometry, or final factual card-copy claims.
- Staging or commit.

## Decisions Reserved For Batu

- Accept, revise, or reject the MVP-20 `proceed-to-mvp-21` recommendation.
- Decide whether the active place label changes from Greenpoint Deli to `GRILLPOINT DELI`, remains Greenpoint Deli for now, or becomes fictional-safe.
- Decide whether exact `GRILLPOINT DELI` sign text may appear in a review-only raster pass.
- Decide whether public card copy remains blocked, becomes review-only, or is fictionalized.
- Decide what primary raster source, layered raster export, or approved raster sprite/asset-kit composition is allowed for MVP-21.
- Decide whether to open the future MVP-21 implementation boundary and which files it may touch.
