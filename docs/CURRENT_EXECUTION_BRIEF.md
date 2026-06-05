# Current Execution Brief - Phase 3 Real Corridor Reset Review

Status: The Phase 3 real corridor reset implementation batch is complete pending Batu review. The app no longer uses the arbitrary Phase 6 fictional storefront raster as the normal Phase 3 review surface. It now wires the accepted Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave raster as the west-anchor visual baseline and shows the mid-corridor, Franklin endpoint, and Brouwerij Lane as real-data intake/blocked until deterministic evidence and Batu-approved facade imagery exist.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, and any later Phase 2, Phase 3, or MVP gates.

## Completed Correction

Batu approved the finding that the current Phase 3 screen is not an acceptable review target because:

- The app is loading `src/assets/review-only/phase-6-1-ui-integrated-recombination-review-only.png`, a review-only placeholder raster with fictional storefronts.
- The placeholder raster explicitly is not a factual Greenpoint representation.
- The overlay is scaffold/debug diagramming, not a real street surface.
- The accepted Phase 2 Manhattan Ave / Greenpoint Ave raster already exists and should be the west anchor reference, not arbitrary storefront art.
- Phase 3 should expand east along Greenpoint Ave toward Franklin Ave rather than re-review an invented Manhattan/Greenpoint placeholder surface.

## Completed Reset Batch

Phase 3 real corridor reset and evidence-backed scene foundation.

Purpose:

- Stop presenting arbitrary fictional storefront art as the Phase 3 review surface.
- Re-anchor the app/review path on the accepted Phase 2 Manhattan Ave / Greenpoint Ave raster for the west anchor.
- Reframe the Phase 3 scene data around the real Greenpoint Ave corridor from Manhattan Ave to Franklin Ave.
- Prepare the smallest implementation foundation for real corridor exploration using real data only where repo-local evidence exists.
- Make missing real geometry/business/facade inputs visible as blocked/intake needs instead of filling them with invented storefronts.

Expected output:

- Normal review mode does not show the arbitrary Phase 6 fictional storefront raster as the Phase 3 corridor scene.
- The west anchor uses the accepted Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave review raster.
- The Phase 3 fixture distinguishes:
  - accepted west-anchor real scene/raster context,
  - sourced real business/address/category records,
  - real geometry context,
  - missing/blocked mid-corridor and Franklin evidence,
  - facade imagery still pending Batu supply/approval.
- Franklin, Brouwerij Lane, and mid-corridor were not deepened with invented data.
- Evidence/QA overlays remain secondary support and not the main visible proof.

## Next State

No further implementation batch is authorized by this brief.

Next step is Batu review of the reset and/or Batu supply/approval of a corridor evidence packet before a later brief authorizes additional work. A future brief may propose a narrow real-corridor evidence intake batch for Greenpoint Ave between Manhattan Ave and Franklin Ave, including allowed source records, NYC/Open geometry for the full corridor, and Batu-supplied or Batu-approved facade imagery.

## Completed Files

The reset touched:

- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`
- `src/mvpPlaceData.js`
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- Existing review-only raster asset references already in the repo, especially the accepted Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave assets.
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

No new framework, renderer, map system, routing system, package tooling, build configuration, production architecture, backend service, CMS, persistence, analytics, CI, deployment, or public module/interface was added.

## Inputs To Use

Use repo-local inputs only unless Batu supplies new files in the workspace:

- Accepted Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave raster assets and scene records.
- Existing reviewed MVP business/place metadata for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint Ave G station context.
- Existing NYC/Open geometry context/sample for Manhattan Ave / Greenpoint Ave.
- Existing DTR-11/reference-photo-derived facade evidence for the Phase 2 west anchor.
- Existing Phase 3 POI/business source ADR and source-blocker records.
- Batu-supplied facade imagery when Batu adds it for the corridor.

Do not attempt live retrieval, scraping, Google/Street View/3D Tiles extraction, or source-vendor integration in this batch.

## Claim Discipline

- Real business identity, address, category, coordinates, and freshness/status require deterministic source evidence.
- Building/parcel geometry may be contextual when sourced, but it does not prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material.
- Missing facade imagery must be shown as pending/blocked, not replaced with arbitrary code-drawn storefronts.
- No exact tenant frontage, exact entrance placement, exact geometry, exact station geometry, production raster readiness, production/public factual claims, ratings, reviews, endorsements, or partnership claims.

## Boundaries

- Review-only.
- Real-corridor reset only; no broad neighborhood coverage.
- No arbitrary fictional storefront names in the normal Phase 3 review surface.
- No placeholder storefront raster as the product review surface.
- No final production raster replacement.
- No production visual assets, production asset direction, or production asset pipeline.
- No public schemas/interfaces.
- No live Foursquare retrieval. Foursquare remains optional future enrichment only after credential/terms/cache/display approvals.
- Do not deepen Brouwerij Lane, Franklin, or mid-corridor with unsourced or invented data.
- If required real corridor inputs are missing, stop or render an explicit blocked/intake state.

## Verification

Expected checks:

- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- `npm run build`.
- `git diff --check`.
- Browser smoke if available:
  - default load does not present arbitrary fictional storefront art as Phase 3 review target,
  - accepted Manhattan/Greenpoint west anchor is visible or explicitly blocked if not safely wired,
  - card click works,
  - QA overlay remains secondary/supporting,
  - mobile containment if the browser surface supports viewport checks.
- `git status --short`.

## Stop Conditions

Stop and report before:

- Replacing missing real corridor data/facade imagery with invented storefront art.
- Treating the Phase 6 fictional storefront raster as a Phase 3 corridor review surface.
- Claiming any Franklin, Brouwerij, or mid-corridor business/address/category/facade/entrance/frontage/geometry as sourced without approved deterministic evidence.
- Using POI/business data to infer facade, frontage/order, entrance, exact geometry, or raster readiness.
- Treating NYC/Open geometry as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Adding live retrieval, scraping, source-vendor integration, production/public readiness, package/tooling changes, backend/CMS/persistence/analytics, broad coverage, full 3D, or deployment.
