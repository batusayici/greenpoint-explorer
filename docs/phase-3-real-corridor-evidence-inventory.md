# Phase 3 Real Corridor Evidence Inventory

Status: Review-only intake inventory  
Date: 2026-06-04  
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

This inventory separates repo-local real evidence from corridor gaps after the Phase 3 reset. It does not authorize live retrieval, production claims, exact geometry, inferred frontage, inferred entrance placement, or fictional storefront fill.

## Known / Sourced Repo-Local Evidence

### West Anchor: Manhattan Ave / Greenpoint Ave

The repo contains accepted review-only west-anchor visual and data context for the Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave MVP scene.

- Visual baseline: `src/assets/review-only/dtr-11-reference-facade-fidelity-interactive-demo-review-only.png`
- DTR-11 package source raster: `docs/mvp-review/mvp-feedback-demo-package/generated/hero-reference-facade-fidelity-raster.png`
- Scene manifest: `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- Real-data fixture: `src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json`
- DTR-11 facade evidence: `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/generated/facade-extraction-specs.json`

Repo-local reviewed place context includes:

- Grillpoint Deli, 903 Manhattan Ave, Brooklyn, NY 11222
- McDonald's, 904 Manhattan Ave, Brooklyn, NY 11222
- Dunkin', 893 Manhattan Ave, Brooklyn, NY 11222
- Citizens Bank, 896 Manhattan Avenue, Brooklyn, NY 11222
- Greenpoint Av G station-area context at Manhattan Ave / Greenpoint Ave

Claim limit: These records support review-only identity/address/category/context where already listed. They do not prove exact tenant frontage, storefront order, entrance placement, exact facade geometry, exact station geometry, active-business freshness beyond the recorded source status, corridor raster readiness, or public factual output.

### Geometry Context

The repo contains NYC/Open building-footprint context scoped to the Manhattan Ave / Greenpoint Ave west anchor:

- Geometry fixture: `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json`
- Candidate BINs surfaced for west-anchor comparison: `3064700`, `3064733`, `3064827`, `3422353`

Claim limit: This supports contextual west-anchor building-footprint QA only. It does not prove tenant frontage, storefront order, entrance placement, facade appearance, exact address placement, active-business status, Franklin endpoint geometry, or full corridor geometry.

## Repo-Local Candidate / Blocked Items

### Greenpoint Ave Mid-Corridor

No approved repo-local business/address/category/facade/entrance/frontage/order record was found for a mid-corridor Phase 3 target between the west anchor and Franklin endpoint.

Current fixture state: real-data intake / blocked until sourced.

### Franklin Ave Endpoint

No approved repo-local Franklin endpoint business/address/category/facade/entrance/frontage/order/raster record was found for this batch.

Current fixture state: real-data intake / blocked until sourced.

### Brouwerij Lane

Brouwerij Lane remains a blocked source-retrieval candidate only.

- Candidate record: `src/data/source-candidates/brouwerij-lane.phase-3-source-retrieval-spike.v0.1.json`
- Blocker report: `docs/phase-3-brouwerij-source-retrieval-spike.md`
- Foursquare blocker: `docs/phase-3-brouwerij-foursquare-credential-blocker.md`

Claim limit: Historical notes are not promoted to sourced identity, address, category, coordinates, frontage, facade, entrance, or raster readiness. Brouwerij remains blocked unless Batu supplies or approves deterministic evidence and a later brief authorizes the target packet.

## Missing Inputs Needed For Corridor Expansion

- Real business/address/category records for Greenpoint Ave between Manhattan Ave and Franklin Ave.
- Source records or source exports with allowed use, attribution, cache/display policy, and review-only fixture storage.
- NYC/Open or approved geometry context for the full Manhattan-to-Franklin corridor, not only the Manhattan/Greenpoint west anchor.
- Batu-supplied or Batu-approved facade/reference imagery for mid-corridor and Franklin endpoint buildings.
- Approved evidence for storefront frontage/order and entrance placement.
- A corridor-specific review raster or reference surface after the data and facade imagery are supplied or approved.

## Blocked Claims

- No fictional businesses.
- No inferred tenant frontage.
- No inferred entrances.
- No exact geometry unless source-supported.
- No exact station geometry.
- No raster readiness beyond the accepted west-anchor DTR-11 feedback/demo raster.
- No live retrieval, scraping, source-vendor integration, production assets, or public factual claims.
