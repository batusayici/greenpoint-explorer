# Phase 2 Architecture

Status: Docs-only architecture planning / not implementation approval
Date: 2026-06-01
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

Current note:
- This is Phase 2A-era planning background. Phase 2DTR work is controlled by `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and `docs/MVP_SCOPE.md`; where this document conflicts with DTR scope, use the source-of-truth order in `AGENTS.md`.

## Purpose

This document defines the Phase 2 data-to-scene architecture direction for review.

It does not approve app implementation, source refactors, package tooling, ingestion scripts, production architecture, public module interfaces, live data, scraping, backend services, production assets, raster revisions, generated images, or MVP-29E implementation changes.

## Approved Architecture Flow

```text
Source adapters
-> normalized source records
-> canonical scene manifest
-> app rendering layer
-> debug/provenance/QA layer
```

Phase 2 proves whether the existing manually-authored MVP scene can be represented as a traceable manifest and later regenerated or updated from source records plus explicit review decisions.

LiveXYZ is preferred pending access, but the first Phase 2 implementation path starts with open/public/manual sources. LiveXYZ must not be treated as available until Batu confirms access and usage boundaries.

## Core Rule

```text
Generated truth and manual overrides must remain separate.
```

Generated source-derived records, human-authored corrections, visual composition decisions, and final review approvals must be stored as distinct layers. Manual corrections are allowed only when explicit, categorized, reversible, provenance-linked, and counted.

## Four Truth Layers

### 1. Geometry Truth

Geometry truth describes parcels, buildings, street centerlines/segments, intersections, address ranges, and source coordinate records.

It may come from LiveXYZ if available, NYC open data, official public records, OSM as supplemental context, or manual review notes. Geometry truth must preserve original source geometry and any normalization steps.

It does not solve storefront segmentation by itself and must not imply exact facade, frontage, entrance, or station geometry without supporting evidence and Batu approval.

### 2. Place / Business Truth

Place/business truth describes place identity, business identity, category, address, status confidence, source freshness, and source conflicts.

It must distinguish:

- Business identity.
- Physical address.
- Building or parcel relationship.
- Storefront or entrance relationship.
- Current-status confidence.
- Review/demo-safe card eligibility.

It must not infer active status, exact tenant position, endorsement, partnership, ratings, reviews, or promotional claims from weak or conflicting sources.

### 3. Visual-Reference Truth

Visual-reference truth describes evidence items used for facade, sign, storefront, station-cue, and context review.

Every image/evidence item must record provenance, owner/source, usage/licensing status, allowed use, blocked use, reviewed date, and any exception status.

Google/Street View/3D Tiles-derived imagery is fallback/reference only until licensing is resolved. The current narrow MVP-only SW Dunkin exception remains non-production and does not approve extraction, tracing, generation input, training input, texture reuse, exact trade-dress reproduction, or a general source-policy change.

### 4. Scene Truth

Scene truth describes authored/stylized placement inside the Greenpoint Isometric Explorer scene.

Scene coordinates are not real-world truth. They are an authored coordinate layer used for interaction, composition, card attachment, hit regions, and review/debug overlays.

Scene truth must link back to real-world geometry/place/visual-reference truth and must label every compression, symbolic cue, manual placement, omission, approximation, and blocked claim.

## Coordinate Layers

Phase 2 stores separate coordinate layers:

- WGS84 latitude/longitude for real-world source coordinates.
- Local projected geometry coordinates for normalized block/parcel/building/street work.
- Stylized scene coordinates for authored isometric composition and app interaction.

The app must never treat stylized scene coordinates as proof of exact real-world placement. Coordinate transforms must be documented in the manifest and visible in debug/provenance review.

## Manifest As App-Facing Source Of Truth

The Phase 2 direction uses a versioned per-scene manifest JSON as the app-facing source of truth.

The manifest should include:

- Source records and provenance.
- Normalized geometry.
- Places, businesses, addresses, storefronts, and confidence.
- Scene anchors, objects, assets, and coordinate transforms.
- Manual overrides.
- QA reports, missing-data reports, ambiguity reports, and approval state.

`docs/SCENE_MANIFEST_SCHEMA.md` defines the v0.1 planning contract. That contract is not a runtime schema or public interface until a later brief explicitly opens implementation and Batu approves the boundary.

## Source Adapter Boundary

Source adapters are future components that read external or manual source material and produce normalized source records.

Phase 2 planning recognizes these adapter classes:

- LiveXYZ adapter, pending access.
- NYC open data adapter for parcels, building footprints, address or public records.
- OSM adapter for supplemental street/POI context with attribution considerations.
- Manual evidence adapter for owned/team observations, field photos, and review notes.
- Restricted fallback/reference adapter for Google/Street View/Places where usage remains unresolved.

No adapter is implemented by this docs-only packet.

## Normalized Source Records

Normalized source records should preserve:

- Original source id or URL.
- Claim type.
- Original value.
- Normalized value.
- Geometry or coordinate reference, if any.
- Source timestamp or last-reviewed date.
- Licensing/usage notes.
- Confidence and conflict state.

Normalization must not hide conflicts, invent missing values, or collapse manually corrected values into generated records.

## App Rendering Layer Boundary

The app rendering layer may later consume the canonical scene manifest, but Phase 2A does not change app code.

When implementation is later opened, the app layer should:

- Render the same visual output initially for Phase 2D.
- Consume the manifest without changing MVP-29E visual behavior unless explicitly approved.
- Keep display/card behavior tied to truth status and provenance.
- Keep debug/provenance overlays separate from product-facing UI.

## Debug / Provenance / QA Layer Boundary

The debug/provenance/QA layer should make source alignment and manual corrections inspectable.

Expected capabilities are defined in `docs/PROVENANCE_AND_QA.md` and include source-data inspection, geometry overlays, match confidence, storefront evidence, generated/manual diffs, missing-data reports, ambiguity reports, override counts, screenshot regression expectations, and human approval checklists.

## What Remains Blocked

- Source implementation.
- App source refactor.
- New app components.
- Ingestion scripts.
- Generated scene data or mock data files.
- Package or lockfile changes.
- Raster or visual revisions.
- Screenshot work.
- Live data, scraping, backend services, CMS, analytics, deployment, CI, accounts, persistence, routing, or broad map coverage.
- Production architecture approval.
- Public module/interface approval.
- Production visual assets, production data, exact facades, exact addresses, exact storefront frontage/order, exact station geometry, endorsement, partnership, ratings, reviews, or public-release claims.
