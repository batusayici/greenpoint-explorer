# Phase 4O-3 First Deterministic Scaffold Generation Contract

Status: Internal scaffold-generation contract complete; no generator, runtime rendering, source access, or public interface
Date: 2026-06-08
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

4O-3 defines the narrow internal contract for turning the 4O-2 fixture stub into a future deterministic placeholder scaffold manifest.

This is a contract only. It does not implement scaffold generation, access sources, download data, cache data, ingest data, convert data, render data, alter runtime behavior, add dependencies, add Blender/GLB assets, add Mapillary automation, or promote claims.

## Public Interface And Module Boundary

4O-3 changes no public interfaces and no module boundaries.

The record shapes below are internal, repo-local, review-only planning shapes for a later manifest batch. They are not runtime schemas, app APIs, public contracts, production assets, or source-ingestion interfaces.

## Input Contract

The only approved input for the next scaffold data step is:

```json
{
  "inputFixturePath": "src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-2-truth-first-corridor-fixture-stub.v0.1.json",
  "inputSchemaVersion": "phase-4o-2-truth-first-corridor-fixture-stub.v0.1",
  "inputStatusRequired": "fixture_ready_stub_planning_safe_no_source_data",
  "allowedInputCollections": [
    "buildingFootprintRecords",
    "groundingRecords",
    "heightMassingFallbackRecords",
    "frontageCornerClassificationRecords",
    "manualOverrideSlots"
  ],
  "blockedInputs": [
    "external_source_data",
    "downloaded_geometry",
    "cached_geometry",
    "ingested_imagery",
    "runtime_render_output",
    "business_or_poi_records",
    "production_assets"
  ]
}
```

## Output Contract

A later approved placeholder scaffold manifest may contain these internal record families only:

```json
{
  "manifestRecordFamilies": [
    "scaffold_building_mass",
    "scaffold_grounding_surface",
    "scaffold_height_massing_output",
    "scaffold_frontage_classification_output",
    "scaffold_override_slot_reference"
  ],
  "deterministicIdPolicy": "derive_from_4o2_record_ids_with_p4o4_scaffold_prefix",
  "allowedGeometryMode": "placeholder_symbolic_geometry_only",
  "coordinatesPolicy": "no_real_coordinates_until_source_access_gate",
  "runtimeUsePolicy": "blocked_no_runtime_consumer",
  "normalModeExposure": "blocked",
  "productionUsePolicy": "blocked"
}
```

## Required Field Families

Every future scaffold record must preserve:

- `recordType`
- `recordId`
- `derivedFromFixtureId`
- `derivedFromRecordId`
- `sourceReferenceIds`
- `sourceRecordStatus`
- `scaffoldStatus`
- `reviewOnly`
- `qaOnly`
- `normalModeExposure`
- `runtimeUsePolicy`
- `productionUsePolicy`
- `claimBoundary`

Building mass outputs must also preserve placeholder building identity, source footprint reference, height/massing fallback reference, classification reference, and manual override slot reference.

Grounding outputs must preserve placeholder corridor/intersection identity, street/sidewalk/curb source-reference IDs, and symbolic grounding role.

Height/massing outputs must preserve null height/floor values until source access is approved.

Frontage/classification outputs may carry `corner_candidate_review_only` or `midblock_candidate_review_only`, but must not create storefront or frontage claims.

Manual override references must preserve empty override status and optional Blender/GLB hook status without adding an asset.

## Claim Boundary

4O-3 requires every future scaffold record to include:

- `no_storefront_claim`
- `no_tenant_claim`
- `no_exact_facade_claim`
- `no_entrance_claim`
- `no_signage_claim`
- `no_active_status_claim`
- `no_exact_address_claim`
- `no_exact_height_claim`
- `no_exact_roof_claim`
- `no_production_claim`
- `no_public_claim`

## Determinism Rules

- Record IDs must be derived from 4O-2 record IDs.
- Record order must follow the 4O-2 collection order.
- No wall-clock timestamps, random values, live source lookups, environment-specific paths, or downloaded records may affect output.
- Summary counts must equal the manifest record-family counts.
- Re-running the later manifest step with the same 4O-2 fixture must produce byte-stable JSON after formatting.

## Verification Plan

4O-3:

- Run `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`.
- Run `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`.
- Run `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`.
- Run `git diff --check`.

No build is required because 4O-3 does not touch runtime/source app files.

## Reserved Decisions

Batu retains all decisions about source access, source download/cache/conversion/render use, scaffold generation beyond placeholder records, runtime rendering, dependencies/tooling, architecture boundaries, public interfaces, spatial recognizability acceptance, facade evidence approval, storefront/frontage candidates, business linkage, exact claims, normal/product exposure, production assets, Blender/GLB override use, Mapillary/street-level metadata use, and art-direction translation timing.
