# Phase 4B Data-To-Scene Workflow

Status: Non-implementation planning only
Date: 2026-06-05
Name: Phase 4B: Reproducible Data-to-Scene + Storefront Anchor Foundation

## Purpose

Phase 4B should implement the smallest credible compiler-centered foundation only after Phase 4A recommends the lane and Batu approves the executable scope.

This document is a planning note. It does not approve schema files, compiler scripts, generated manifests, source fixtures, runtime refactors, package/tooling changes, public interfaces, asset-kit files, or production architecture.

## Intended Flow

```text
source truth
-> normalized source records
-> deterministic semantic scene manifest
-> style recipe + modular asset-kit interpretation
-> browser runtime presentation
-> QA/provenance inspection
```

Source data defines metric truth. The compiler produces semantic scene structure. Style recipe and asset-kit rules produce visual interpretation. Browser runtime presents the interactive scene.

Blender, screenshots, Figma, AI image generation, Cesium, splats, and manually composed scene files must not become the canonical source of truth.

## Conceptual Foundation

Phase 4B is expected to define, in implementation scope only after approval:

- A file-based source fixture for one corridor proof.
- A generated semantic scene manifest.
- Explicit storefront-anchor records with confidence levels.
- Stable ID rules for source, geometry, storefront, business, scene, card, and asset references.
- A style-recipe planning contract for visual interpretation.
- An asset-registry or asset-kit planning contract for modular GLB/glTF components.
- Versioned manual overrides.
- A primitive Python spatial compiler path.
- Node/schema verification where aligned with the existing repo.
- Optional browser manifest consumption only if that implementation boundary is explicitly opened.

These are planning contracts here, not files or scripts to create during Phase 4A.

## Storefront Anchoring

Storefront anchoring is the central unresolved Phase 4B problem.

Phase 4B must account for:

- Multi-tenant buildings where one footprint contains several businesses.
- POI coordinates that identify provider points, rooftops, parcel centroids, or approximate locations rather than storefront doors.
- Facade-edge detection as a separate claim from footprint geometry.
- Business matching assumptions and confidence levels.
- Manual review and overrides where source data is ambiguous.

Storefront anchors should be explicit semantic objects. They should not be inferred silently from business names, POI coordinates, address strings, or building footprints.

## Art Direction System

The art direction system should become modular and deterministic.

Expected later concepts:

- Blender-authored GLB/glTF kit-of-parts components.
- Metadata, pivots, anchor names, component families, style tags, and scale/orientation rules.
- Deterministic seeded variation.
- Runtime or build-time assembly from semantic scene objects.
- Hover/click/card styling governed by the same visual system.

The style recipe is not only colors and materials. It must describe how art-directed components attach to generated massing and storefront anchors.

## Reference Fidelity Lane

Reference imagery and capture outputs may support fidelity QA, facade recognition, and landmark review when usage is approved.

They must remain separate from canonical source truth unless a later source-policy gate explicitly changes that. Business/place facts, storefront anchors, and card content must remain semantic data, not pixels embedded in a raster or capture.

## Deferred Until Explicit Approval

- Phase 4B runtime implementation.
- Schema files or generated manifests.
- Compiler scripts.
- Asset-kit or GLB production files.
- PostGIS.
- Dynamic spatial streaming.
- Full-neighborhood scope.
- Splats/world models as canonical truth.
- Blender as layout source.
- Cesium as primary runtime.
