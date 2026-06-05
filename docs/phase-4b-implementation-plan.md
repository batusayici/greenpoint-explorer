# Phase 4B Implementation Plan

Status: Non-implementation planning only
Date: 2026-06-05
Name: Phase 4B: Reproducible Data-to-Scene + Storefront Anchor Foundation

## Implementation Gate

Do not implement Phase 4B from this document.

Phase 4B implementation may begin only after:

- Phase 4A produces a recommendation.
- Batu approves the architecture boundaries and public-interface implications.
- `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens the narrow executable scope.
- Required source, reference, and usage constraints are documented.

Until then, every schema/compiler/storefront/style/asset contract named here is planning-only.

## Smallest Credible Future Batch

The smallest later implementation batch should target one corridor proof, not the full neighborhood.

Expected future batch shape:

- Start with one approved file-based source fixture.
- Generate one deterministic semantic scene package.
- Include explicit storefront anchors and business-anchor confidence.
- Apply one versioned style recipe or asset-kit rule set.
- Keep manual overrides explicit and versioned.
- Verify determinism, missing references, source metadata, stable IDs, and blocked claims.

## Acceptance Criteria For A Later Approved Phase 4B Batch

- One command or clear script path can rebuild the generated scene package from source fixtures.
- Corridor orientation and next intersection are recognizable.
- Building massing comes from source geometry, not hand-composed scene art.
- Storefront anchors are explicit semantic objects.
- Business anchors are inspectable and include confidence levels.
- Business/place info is not baked into raster/image assets.
- Art direction is applied from versioned recipe/asset-kit rules.
- Hover, click, and business-card states connect to semantic IDs.
- Manual overrides are explicit and versioned.
- Reference imagery remains available for fidelity QA.
- QA verifies schema/shape, source metadata, stable IDs, missing references, blocked claims, and determinism.

## Near-Term Stack Stance

- File-based JSON/GeoJSON fixtures are acceptable for a one-corridor proof.
- Python is the likely spatial-compilation lane because of GeoPandas/Shapely/Fiona/NetworkX maturity.
- Node remains the likely verification/frontend-build lane where aligned with the current repo.
- Three.js / React Three Fiber remains a likely runtime direction after approval.
- GLB/glTF remains the likely runtime asset format after approval.
- Blender is an asset foundry or offline renderer, not the production layout source.

## Later Or Deferred

- PostGIS only when scale justifies it beyond the corridor proof.
- GDAL/ogr2ogr for serious spatial import/export after the local proof.
- glTF-Transform for asset optimization after GLB/glTF enters scope.
- Git LFS or object storage for larger assets after asset size demands it.
- GitHub Actions after reproducible builds are valuable.
- Google Photorealistic 3D Tiles, Marble/world-model outputs, Gaussian splats, and mobile capture remain reference/experimental unless separately approved.
- fVDB/OpenVDB, VLA models, robotics physics/sim-to-real stack, Cesium as primary runtime, and Houdini are deferred.

## Immediate Pre-Implementation Output From Phase 4A

Phase 4A should hand Phase 4B a short decision packet:

- Core lane.
- Reference lane.
- Rejected or deferred lanes.
- Smallest approved proof.
- Required source/reference approvals.
- Public-interface and module-boundary implications.
- Risks Batu must approve before implementation.
