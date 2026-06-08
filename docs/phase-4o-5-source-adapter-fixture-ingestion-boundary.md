# Phase 4O-5 Source Adapter And Fixture Ingestion Boundary

Status: Source-adapter / fixture-ingestion boundary complete; no source access, ingestion, runtime rendering, dependencies, or public interface
Date: 2026-06-08
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

4O-5 defines the next truth-first boundary after the deterministic placeholder scaffold manifest.

The purpose is to prepare how approved real source lanes may later feed scaffold fixture records and scaffold manifests, without fetching live data, downloading files, caching source packets, ingesting source records, converting geometry, rendering runtime geometry, adding dependencies, or making exact facade, business, tenant, frontage, entrance, sign, active-status, production, public, or product claims.

The truth-first order remains:

```text
Spatial scaffold first.
Facade recognizability second.
Art direction third.
```

## Public Interface And Module Boundary

4O-5 changes no public interfaces and no module boundaries.

The adapter contracts below are internal planning contracts only. They are not runtime schemas, app APIs, public contracts, production data pipelines, dependency approvals, source-access approvals, or ingestion scripts.

## Approved Input Readiness State

4O-5 may reason from existing repo-local planning artifacts only:

- `docs/phase-4o-1-truth-first-corridor-data-contract.md`
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json`
- `docs/phase-4o-3-deterministic-scaffold-generation-contract.md`
- `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-4-placeholder-scaffold-manifest.v0.1.json`
- source-lane planning notes in `docs/reference/DATA_SOURCES.md`
- source-policy boundaries in `docs/phase-4g-external-source-policy-coverage-audit-contract.md`

4O-5 does not add source fixture records and does not approve any source access path.

## Source-Adapter Lanes

### Building Container Lane

Candidate sources:

- NYC Building Footprints.
- PLUTO / MapPLUTO-style parcel, lot, building class, and floor-count context.

Future adapter role if Batu opens source access:

- Create building container inputs for scaffold building mass records.
- Preserve candidate source IDs, source version, retrieval date, attribution, and transformation notes.
- Link footprint/container records to height/massing fallback records only by explicit adapter IDs.
- Keep building mass/container truth separate from tenant truth.

Blocked claims:

- tenant truth;
- storefront order;
- storefront frontage;
- entrance location;
- facade appearance;
- active status;
- exact address placement;
- production/public exactness.

### Street / Sidewalk / Curb / Intersection Grounding Lane

Candidate sources:

- CSCL or equivalent street alignment data.
- Sidewalk, curb, and planimetric datasets.
- Explicit manual review notes only when provenance and status are recorded.

Future adapter role if Batu opens source access:

- Create corridor, intersection, sidewalk, curb, and pedestrian-realm grounding inputs.
- Preserve source lineage and transformation notes separately from rendered scene placement.
- Allow approximate grounding only when every affected field is explicitly labeled `approximate`, `manual_draft`, `symbolic`, or `not_verified`.

Blocked claims:

- entrance ownership;
- exact curb/sidewalk survey truth unless source/evidence supports it;
- storefront frontage;
- business placement;
- production/public exactness.

### Height / Massing Lane

Candidate sources:

- NYC 3-D Building Model / CityGML-style massing where available.
- PLUTO / MapPLUTO-style floor count or contextual fallback fields where approved.
- Explicit manual review overrides only when provenance and status are recorded.

Future adapter role if Batu opens source access:

- Create height/massing inputs for scaffold height/massing output records.
- Preserve height source class, unit assumptions, fallback method, confidence, and unresolved discrepancy notes.
- Keep exact height, exact roof, and exact setback claims blocked unless a later source-specific gate supports them.

Blocked claims:

- exact height without source-specific support;
- exact roof shape without source-specific support;
- facade appearance;
- storefront or tenant truth;
- production/public exactness.

### Facade Evidence And Manual Override Lane

Candidate sources:

- Batu-supplied or project-owned facade evidence records.
- Later approved facade-evidence records from Mapillary/KartaView-style lanes only if source policy and storage/display/extraction rules are approved.
- Manual override records with explicit provenance and supported/blocked claims.

Future adapter role if Batu opens the layer:

- Attach facade-evidence and manual override records as later layers over the spatial scaffold.
- Preserve evidence record ID, reviewer, date, usage status, supported claims, blocked claims, and override type.
- Keep facade recognizability secondary to the spatial scaffold and keep art-direction translation third.

Blocked claims:

- exact facade detail without evidence records;
- storefront frontage unless evidence-backed and promoted later;
- tenant frontage;
- entrance ownership;
- sign text, logo, trade dress, material, color, or active status unless supported by a later claim-specific gate;
- production/public exactness.

## Adapter Record Contract

Future source-adapter records should use this internal shape:

```json
{
  "adapterRecordId": "p4o5-adapter-record-placeholder",
  "sourceLane": "building_container",
  "candidateSource": "NYC Building Footprints",
  "sourceAccessStatus": "blocked_not_accessed",
  "retrievalStatus": "not_started",
  "storageCachePolicy": "blocked_until_batu_source_access_gate",
  "adapterOutputFamily": "building_container_input",
  "targetScaffoldFamily": "scaffold_building_mass",
  "supportedClaims": [
    "building_container_context"
  ],
  "blockedClaims": [
    "tenant_truth",
    "storefront_frontage",
    "exact_facade_detail",
    "entrance_location",
    "signage",
    "active_status",
    "exact_address_placement",
    "production_public_exactness"
  ],
  "statusLabelsRequired": [
    "review_only",
    "qa_only",
    "not_verified"
  ]
}
```

## Fixture Ingestion Boundary

A later source-fixture ingestion batch may proceed only if a future current brief explicitly states:

- exact source lane and source names;
- whether network, browser, API, file download, cache, or source conversion is allowed;
- allowed files/work areas;
- attribution, license, storage/cache, derivative, display, render, extraction, training, and production boundaries;
- adapter output record family and verifier expectations;
- status labels and claim boundaries;
- stop conditions and Batu review gate.

The first real fixture ingestion step should be small and lane-specific. It should not combine building containers, grounding, heights, facade evidence, and business linkage in one batch.

## Claim Boundary Rules

- Building mass/container truth is not tenant truth.
- Building footprint or parcel linkage does not prove storefront frontage, storefront order, entrance placement, signage, facade appearance, active status, business identity, or exact address placement.
- Frontage/classification is provisional unless evidence-backed and later promoted by Batu.
- Facade detail remains blocked until image/evidence records or manual override records exist with explicit provenance and supported/blocked claims.
- Grounding can be approximate only if every affected field is explicitly labeled `approximate`, `manual_draft`, `symbolic`, or `not_verified`.
- POI/business sources remain separate from geometry truth and must not define scaffold geometry, facade detail, storefront frontage, entrances, signage, or active status.
- No normal-mode exposure, production use, public/product claim, source promotion, or claim promotion occurs in 4O-5.

## Verification Plan

4O-5:

- Run `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`.
- Run `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`.
- Run `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`.
- Run `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`.
- Run `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`.
- Run `git diff --check`.

No build is required because 4O-5 does not touch runtime/source app files.

## Reserved Decisions

Batu retains all decisions about source access, source download/cache/conversion/render use, source promotion, first real fixture ingestion lane, runtime rendering, dependencies/tooling, architecture boundaries, public interfaces, spatial recognizability acceptance, facade evidence approval, storefront/frontage candidates, business linkage, exact claims, normal/product exposure, production assets, Blender/GLB override use, Mapillary/street-level metadata use, and art-direction translation timing.
