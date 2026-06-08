# Phase 4O-1 Truth-First Corridor Data Contract

Status: Implementation contract complete; no data download, ingestion, runtime rendering, or asset work
Date: 2026-06-08
Scope: Greenpoint Ave from Manhattan Ave to Franklin Ave

## Purpose

4O-1 defines the first source-to-scaffold data contract for a truthful procedural Greenpoint Ave corridor scaffold.

The contract supports the truth-first hybrid priority:

```text
Spatial truth first.
Facade recognizability second.
Art direction third.
```

4O-1 does not download data, ingest data, add source fixtures, alter runtime rendering, add Blender/GLB assets, add Mapillary automation, or promote any source or claim. It defines the record shapes a later approved implementation batch may use when generating a procedural corridor scaffold.

## Public Interface And Module Boundary

4O-1 changes no public interfaces and no module boundaries.

The JSON examples below are planning-only / fixture-ready record shapes. They are not implemented public contracts, runtime schemas, source fixtures, generated manifests, or production interfaces until a later Batu-approved batch explicitly opens that work.

## Contract Layers

The future scaffold should keep these record layers separate:

- Building footprint records: source building outline, stable building identity, massing eligibility, source provenance, and blocked claim boundary.
- Street / sidewalk / curb grounding records: corridor path, street polygons or centerline-derived hints, sidewalk/curb geometry, intersections, pedestrian realm, and grounding confidence.
- Height / massing fallback records: preferred height source, fallback floor/attribute estimates, roof/setback availability, and massing confidence.
- Frontage / corner classification records: street-facing role, corner/midblock/side-return role, frontage classification confidence, and explicit non-claim boundary.
- Manual override slots: review-owned slots for later facade evidence, procedural detail overrides, or optional Blender/GLB override assets.

## Candidate Source Roles

- NYC Building Footprints: base geometry, building outlines, building IDs, massing, and footprint/frontage alignment.
- NYC 3-D Building Model / CityGML-style massing: heights, roof shapes, setbacks, and massing where available.
- CSCL: street alignment, corridor bounds, intersections, and street-width hints.
- Sidewalk/curb/planimetric datasets: sidewalks, curbs, pedestrian realm, and grounding.
- PLUTO/MapPLUTO: parcels, land use, building class, floors, year built, and zoning/context.
- User-supplied facade photos: evidence-backed manual overrides and facade cue validation.
- Mapillary/street-level metadata: experimental only; not reliable automatic facade truth.
- POI/business sources: separate from geometry truth; may inform later cards/business identity, but not facade geometry.

## Planning-Only Record Shapes

Building footprint record:

```json
{
  "recordType": "building_footprint",
  "buildingId": "bin_3064700",
  "sourceGeometryId": "nyc_building_footprint.bin_3064700",
  "generationMode": "procedural_massing",
  "footprintSource": "nyc_building_footprints_candidate",
  "heightSource": "pending_height_record",
  "massingConfidence": "pending",
  "frontageRole": "pending_classification",
  "facadeEvidenceStatus": "none",
  "overrideAssetId": null,
  "detailLevel": "massing_only",
  "claimBoundary": [
    "no_storefront_claim",
    "no_tenant_claim",
    "no_exact_facade_claim",
    "no_entrance_claim",
    "no_signage_claim",
    "no_active_status_claim",
    "no_exact_address_claim",
    "no_production_claim",
    "no_public_claim"
  ]
}
```

Street / sidewalk / curb grounding record:

```json
{
  "recordType": "corridor_grounding",
  "groundingId": "greenpoint_ave.manhattan_to_franklin.grounding.v0",
  "buildingId": null,
  "sourceGeometryId": "cscl.greenpoint_ave.segment_candidate",
  "streetSourceGeometryId": "cscl.greenpoint_ave.segment_candidate",
  "sidewalkSourceGeometryId": "nyc_planimetric_sidewalk.candidate",
  "curbSourceGeometryId": "nyc_planimetric_curb.candidate",
  "generationMode": "procedural_grounding",
  "heightSource": "not_applicable",
  "massingConfidence": "not_applicable",
  "frontageRole": "corridor_ground_plane",
  "facadeEvidenceStatus": "not_applicable",
  "overrideAssetId": null,
  "detailLevel": "street_sidewalk_curb_grounding",
  "claimBoundary": [
    "no_storefront_claim",
    "no_entrance_claim",
    "no_exact_address_claim",
    "no_production_claim",
    "no_public_claim"
  ]
}
```

Height / massing fallback record:

```json
{
  "recordType": "height_massing_fallback",
  "buildingId": "bin_3064700",
  "sourceGeometryId": "nyc_3d_building_model.bin_3064700.candidate",
  "generationMode": "procedural_massing",
  "heightSource": "nyc_3d_candidate_or_mappluto_floor_fallback",
  "heightValue": null,
  "floorCountFallback": null,
  "roofShapeSource": "pending",
  "setbackSource": "pending",
  "massingConfidence": "pending_source_review",
  "frontageRole": "pending_classification",
  "facadeEvidenceStatus": "none",
  "overrideAssetId": null,
  "detailLevel": "massing_only",
  "claimBoundary": [
    "no_exact_height_claim",
    "no_exact_roof_claim",
    "no_exact_facade_claim",
    "no_storefront_claim",
    "no_production_claim"
  ]
}
```

Frontage / corner classification record:

```json
{
  "recordType": "frontage_corner_classification",
  "buildingId": "bin_3064700",
  "sourceGeometryId": "nyc_building_footprint.bin_3064700",
  "generationMode": "procedural_classification",
  "heightSource": "linked_height_massing_record",
  "massingConfidence": "pending",
  "frontageRole": "corner_candidate",
  "streetFacingEdges": [
    "greenpoint_ave_candidate",
    "manhattan_ave_candidate"
  ],
  "facadeEvidenceStatus": "none",
  "overrideAssetId": null,
  "detailLevel": "classification_only",
  "claimBoundary": [
    "no_storefront_frontage_claim",
    "no_tenant_claim",
    "no_entrance_claim",
    "no_signage_claim",
    "no_active_status_claim",
    "no_exact_address_claim",
    "no_production_claim"
  ]
}
```

Manual override slot:

```json
{
  "recordType": "manual_override_slot",
  "buildingId": "bin_3064700",
  "sourceGeometryId": "nyc_building_footprint.bin_3064700",
  "generationMode": "procedural_massing",
  "heightSource": "linked_height_massing_record",
  "massingConfidence": "pending",
  "frontageRole": "corner_candidate",
  "facadeEvidenceStatus": "none",
  "overrideAssetId": null,
  "overrideStatus": "empty",
  "allowedOverrideTypes": [
    "manual_geometry_adjustment",
    "facade_evidence_annotation",
    "procedural_detail_override",
    "optional_blender_glb_asset_override"
  ],
  "detailLevel": "massing_only",
  "claimBoundary": [
    "override_does_not_promote_claims",
    "no_storefront_claim",
    "no_tenant_claim",
    "no_exact_facade_claim",
    "no_entrance_claim",
    "no_signage_claim",
    "no_active_status_claim",
    "no_exact_address_claim",
    "no_production_claim"
  ]
}
```

## Claim Boundary Rules

4O-1 preserves strict claim boundaries:

- Building footprints, heights, floor counts, parcels, streets, sidewalks, curbs, and frontage classification may support spatial scaffold review only.
- Geometry records must not become storefront, tenant, exact facade, entrance, signage, active-status, exact-address, production, or public claims.
- POI/business records remain separate from geometry truth and must not define facade geometry, storefront frontage, entrances, signage, active status, or exact placement.
- User-supplied facade photos may support later evidence-backed manual overrides only when provenance, usage status, reviewed date, supported claims, and blocked claims are explicit.
- Mapillary/street-level metadata remains experimental only and must not become automatic facade truth.
- Blender/GLB remains an optional override hook only and must not become the primary spatial scaffold.

## Future 4O-2 Candidate Boundary

A later Batu-approved 4O-2 may create the smallest fixture-ready data sample or verifier-backed source stub only if the current brief explicitly opens it.

4O-2 must still avoid data download, broad ingestion, runtime rendering, Blender/GLB assets, Mapillary automation, production claims, public claims, and exact storefront/frontage/entrance/address/signage/tenant/material/active-status claims unless the opening brief explicitly changes those boundaries.

## Verification Plan

4O-1:

- Run `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`.
- Run `git diff --check`.

No build is required because 4O-1 does not touch runtime/source app files.

## Reserved Decisions

Batu retains all decisions about 4O-2 opening, source access, source download/cache/conversion/render use, source promotion, dependencies/tooling, architecture boundaries, public interfaces, spatial recognizability acceptance, facade evidence approval, business linkage, exact claims, normal/product exposure, production assets, Blender/GLB override use, Mapillary/street-level metadata use, and art-direction translation timing.
