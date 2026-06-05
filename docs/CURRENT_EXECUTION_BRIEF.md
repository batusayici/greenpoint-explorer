# Current Execution Brief - Phase 3 Corridor Geometry Intake Review

Status: The Phase 3 full-corridor NYC/Open geometry intake batch is complete pending Batu review. The deterministic repo-local corridor geometry packet now exists at `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3a.json`. It carries through the existing Manhattan Ave / Greenpoint Ave west-anchor NYC/Open footprint records and explicitly marks mid-corridor, Franklin endpoint, and Brouwerij geometry coverage as missing/blocked until source data exists. The Phase 3 real corridor reset remains the visual baseline. Normal Phase 3 stays anchored on the accepted DTR-11 Manhattan Ave / Greenpoint Ave west-anchor raster.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, and any later Phase 3 or MVP gates.

## Completed Batch

Phase 3 full-corridor NYC/Open geometry intake for Greenpoint Ave from Manhattan Ave to Franklin Ave.

Purpose:

- Create a deterministic repo-local NYC/Open geometry context packet for the Manhattan-to-Franklin corridor slice.
- Reuse existing repo-local geometry-source conventions and records where possible.
- Define the exact corridor geometry scope: Greenpoint Ave between Manhattan Ave and Franklin Ave, both street sides where available, plus intersection/corner context at Manhattan Ave and Franklin Ave.
- Keep Brouwerij blocked unless already covered by repo-local geometry context.
- Update the real corridor evidence inventory so geometry context is separated from business identity, tenant frontage, entrances, facade imagery, and raster readiness.

## Next State

No further implementation batch is authorized by this brief.

Next step is Batu review of the geometry intake packet and updated evidence inventory. A future brief may authorize one of:

- supplied or approved NYC/Open geometry records for the missing mid-corridor and Franklin endpoint coverage,
- a narrow source/access batch for real business/address/category evidence,
- a Batu-supplied or Batu-approved facade/reference imagery intake batch,
- or a later corridor render preparation batch after geometry, business, and facade inputs are sufficiently available.

## Completed Files

The geometry-intake batch touched:

- `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3a.json`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

No visual scene files were changed.

No new framework, renderer, map system, routing system, package tooling, build configuration, production architecture, backend service, CMS, persistence, analytics, CI, deployment, or public module/interface was added.

## Inputs To Use

Use repo-local inputs only:

- Existing NYC/Open geometry context/sample for Manhattan Ave / Greenpoint Ave.
- Existing Phase 3 real corridor reset fixture and evidence inventory.
- Existing reviewed MVP business/place metadata only as separation/gap context, not as geometry proof.
- Existing Phase 3 source-policy and blocker docs.

Do not attempt live retrieval, scraping, Google/Street View/3D Tiles extraction, Foursquare, or source-vendor integration in this batch.

## Claim Discipline

- Building/parcel/footprint geometry may be contextual when sourced, but it does not prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, business identity, or raster readiness.
- Geometry must be source/provenance-labeled and status-labeled.
- Label all geometry as contextual unless exact source support exists.
- Do not attach tenant frontage, entrances, facade imagery, or business identity unless already supported by separate existing repo evidence.
- No exact tenant frontage, exact entrance placement, exact geometry, exact station geometry, production raster readiness, production/public factual claims, ratings, reviews, endorsements, or partnership claims.

## Boundaries

- Review-only data/documentation batch.
- Not a rendering batch.
- Normal Phase 3 visual scene remains anchored on the accepted DTR-11 Manhattan Ave / Greenpoint Ave west-anchor raster.
- Mid-corridor, Franklin endpoint, and Brouwerij remain real-data intake/blocked unless deterministic repo-local geometry context already covers a non-business geometry field.
- No fictional corridor fill.
- No Foursquare.
- No scraping.
- No live API call.
- No broad ingestion framework.

## Verification

Expected checks:

- Inspect existing repo-local geometry data/scripts.
- JSON parse for any new or edited geometry fixture.
- Run an existing geometry/source verifier if one is available and relevant.
- `npm run build` only if app/runtime files changed.
- `git diff --check`.
- `git status --short`.

## Stop Conditions

Stop and report before:

- Calling live APIs, scraping, or using Foursquare.
- Inventing building footprints, parcels, tenant frontage, entrances, facade appearance, exact address placement, or business identity.
- Treating NYC/Open geometry as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Changing the normal visual scene away from the accepted DTR-11 west-anchor baseline.
- Adding production/public readiness, package/tooling changes, backend/CMS/persistence/analytics, broad coverage, full 3D, or deployment.
