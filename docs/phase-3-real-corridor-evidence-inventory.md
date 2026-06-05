# Phase 3 Real Corridor Evidence Inventory

Status: Review-only intake inventory  
Date: 2026-06-05
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

This inventory separates repo-local real evidence from corridor gaps after the Phase 3 reset and sourced-geometry corridor pass. It does not authorize production claims, business/POI live retrieval, scraping, inferred frontage, inferred entrance placement, inferred facade appearance, exact address placement, or fictional storefront fill.

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

The repo contains NYC/Open geometry context scoped to the Manhattan Ave / Greenpoint Ave west anchor and the Greenpoint Ave corridor toward the Franklin endpoint:

- Geometry fixture: `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json`
- Initial corridor geometry context packet: `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3a.json`
- Phase 3B raw official geometry packet: `src/data/geometry-source/raw/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry.phase-3b.raw.json`
- Phase 3B normalized official geometry context packet: `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json`
- Candidate BINs surfaced for west-anchor comparison: `3064700`, `3064733`, `3064827`, `3422353`

Current slice coverage after the Phase 3B official geometry intake:

- Manhattan Ave / Greenpoint Ave west-anchor context: repo-local NYC/Open footprint records exist for contextual review.
- Greenpoint Ave mid-corridor between Manhattan Ave and Franklin endpoint: NYC Open Data Centerline/CSCL and Building Footprints now support sourced/contextual street-centerline and building-footprint review geometry.
- Franklin endpoint context: NYC Open Data Centerline/CSCL and Building Footprints now support sourced/contextual street/building endpoint geometry. The official source names the cross street Franklin St; project UI still uses the established Franklin Ave endpoint wording until Batu resolves naming text.
- Sidewalk bands and scene projection: still manual_draft/contextual because the current line/context retrieval does not promote exact sidewalk surface polygons or a GIS renderer.
- Brouwerij Lane business/POI relationship: blocked/source-retrieval candidate only because Foursquare/API credential and terms gates are unavailable; official geometry does not prove business identity, address, category, coordinates, frontage, entrances, facades, signage, active status, or raster readiness.

Current visual review surface after the Phase 3 westward geometry-to-massing correction pass:

- West anchor: sourced/contextual geometry state, grounded by the accepted DTR-11 west-anchor raster and existing repo-local NYC/Open footprint context. The DTR-11 raster is now positioned as the right-side style/baseline anchor for the westward correction.
- Mid-corridor: sourced/contextual street-centerline and selected building-footprint records are rendered west / left of DTR-11 as stylized paper/ink massing, with manual-draft sidewalk/context gaps quieted so Batu can review spatial recognizability before business/place overlays.
- Franklin endpoint: sourced/contextual street/building geometry is rendered as a west/left stylized corner massing moment. No Brouwerij/business/frontage/facade/entrance claim is implied.
- Brouwerij: blocked marker only; no identity/address/category/coordinate/source-response promotion occurred.
- Current screenshot evidence: `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-westward-geometry-to-massing-corridor-default.png`.

What the geometry packet can support later:

- West-anchor building-massing/context comparison against the accepted DTR-11 baseline.
- Corridor evidence review that clearly separates sourced official street/building geometry from manual sidewalk/scene-transform gaps and blocked business/facade/frontage/entrance claims.
- A deterministic merge target for future POI/business, facade/reference, frontage, and entrance evidence once source data is supplied or retrieval is authorized.

Claim limit: This supports contextual official street/building geometry review only. Filled massing is a stylized translation of selected footprint records, not a facade, storefront, frontage, entrance, exact-address, business, active-status, or raster-readiness claim. It does not prove tenant frontage, storefront order, entrance placement, facade appearance, exact address placement, business identity, active-business status, sidewalk surface polygons, Brouwerij POI claims, or raster readiness.

## Repo-Local Candidate / Blocked Items

### Greenpoint Ave Mid-Corridor

No approved repo-local business/address/category/facade/entrance/frontage/order record was found for a mid-corridor Phase 3 target between the west anchor and Franklin endpoint.

Current fixture state: street/building geometry is sourced/contextual from NYC Open Data; sidewalk surfaces and stylized scene projection remain manual_draft/contextual; business/address/category/facade/entrance/frontage/order/raster readiness remain unknown or blocked until sourced.

### Franklin Ave Endpoint

No approved repo-local Franklin endpoint business/address/category/facade/entrance/frontage/order/raster record was found for this batch.

Current fixture state: street/building geometry is sourced/contextual from NYC Open Data; business/address/category/facade/entrance/frontage/order/raster readiness remain blocked until sourced.

### Brouwerij Lane

Brouwerij Lane remains a blocked source-retrieval candidate only.

- Candidate record: `src/data/source-candidates/brouwerij-lane.phase-3-source-retrieval-spike.v0.1.json`
- Blocker report: `docs/phase-3-brouwerij-source-retrieval-spike.md`
- Foursquare blocker: `docs/phase-3-brouwerij-foursquare-credential-blocker.md`

Claim limit: Historical notes are not promoted to sourced identity, address, category, coordinates, frontage, facade, entrance, or raster readiness. Brouwerij remains blocked unless Batu supplies or approves deterministic evidence and a later brief authorizes the target packet.

## Missing Inputs Needed For Corridor Expansion

- Real business/address/category records for Greenpoint Ave between Manhattan Ave and Franklin Ave.
- Source records or source exports with allowed use, attribution, cache/display policy, and review-only fixture storage for business/POI claims.
- Batu-supplied or Batu-approved facade/reference imagery for mid-corridor and Franklin endpoint buildings.
- Approved evidence for storefront frontage/order and entrance placement.
- A corridor-specific review raster or reference surface after the data and facade imagery are supplied or approved.

## Blocked Claims

- No fictional businesses.
- No inferred tenant frontage.
- No inferred entrances.
- No exact storefront, frontage, entrance, facade, or address geometry unless source-supported.
- No exact station geometry.
- No raster readiness beyond the accepted west-anchor DTR-11 feedback/demo raster.
- No business/POI live retrieval, scraping, source-vendor integration, production assets, or public factual claims.
