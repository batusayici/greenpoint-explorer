# Phase 4B Implementation Plan

Status: Supporting detail. Primary Phase 4 execution roadmap: `docs/phase-4-execution-roadmap.md`.
Date: 2026-06-05
Name: Phase 4B: Reproducible Data-to-Scene + Storefront Anchor Foundation

## Implementation Gate

Do not implement Phase 4B from this document.

Phase 4B implementation may begin only after:

- Phase 4A produces a recommendation.
- Batu approves the architecture boundaries and public-interface implications.
- `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens the narrow executable scope as the current executable batch or as the next batch in the pre-authorized queue.
- Required source, reference, and usage constraints are documented.

Until then, every schema/compiler/storefront/style/asset contract named here is planning-only.

## Current 4B-6R Corridor Frame Correction Review Gate

`Batch 4B-6: Graybox corridor recognizability QA` was reviewed by Batu with result: Partial pass. 4B-6 added deterministic review/debug affordances to the existing React + Vite + Three.js runtime, but the corridor frame needed a narrow correction before it was useful enough for corridor-place recognizability review. `Batch 4B-6R: Corridor frame and endpoint cue correction` has now cleared Batu visual review with result: CONDITIONAL PASS. `docs/CURRENT_EXECUTION_BRIEF.md` lists no pre-authorized queue and opens no next executable batch.

For the completed-pending-review 4B-6R output:

- The existing React + Vite app shell remains the app/build layer.
- The minimal `three` dependency remains the only authorized renderer.
- Three.js is only the renderer inside the existing shell.
- 4B-6R was a corrective runtime/docs batch only.
- The runtime strengthened corridor path hierarchy, added lightweight Manhattan Ave / Franklin Ave endpoint cues, added block/building rhythm cues from existing manifest/runtime/source-backed object boundaries, refined M-to-F/F-to-M/overhead/oblique camera presets, and improved selected-object inspector visibility.
- Expanded buildings remain graybox/context massing only and preserve one-side or both-side corridor coverage according to source geometry, not invention.
- Deterministic rendering, semantic IDs as the interaction source of truth, invisible pick targets tied to semantic object IDs, QA/provenance visibility, and blocked-claim visibility remain required.
- Conditional follow-up from 4B-6R: M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.
- Source fixture or generated manifest changes remain unauthorized unless a blocking defect is found, explicitly documented, and narrowly justified.
- React Three Fiber, Drei, Cesium, Mapbox, deck.gl, GLB/glTF pipelines/assets, raster/generated/stock/production assets, screenshot tooling dependencies, package dependencies without explicit authorization, backend/CMS/persistence/analytics, deployment tooling, broad map systems, business verification, POI enrichment, new APIs, scraping, LiveXYZ/Foursquare/local-directory calls, storefront segmentation, business cards, anchor/facade/storefront semantics, facade detail, art-direction work, generic procedural city generation, random generation, infinite wrapping, public/deployment work, Phase 4C, and self-advancing beyond 4B-6R remain unauthorized.

## Batch 4B-1 Planning Contracts

Status: Complete pending Batu review. These are implementation-ready planning contracts only; they do not create schemas, fixtures, compiler code, runtime interfaces, generated manifests, package/tooling, or assets.

4B-2 may translate these contracts into one approved source fixture and one verifier only after Batu approval and an updated current brief.

### Contract Boundary

- Public interface status: proposed planning contracts, not approved runtime/public APIs.
- Module boundary status: proposed file/verifier boundaries for 4B-2 only; compiler and runtime boundaries remain closed.
- Canonical truth: source fixture records are canonical only for the claims their source metadata allows; storefront/facade/frontage/entrance/business claims stay blocked unless explicitly evidenced and status-labeled.
- Required verifier stance: fail on missing source metadata, unstable IDs, hidden manual assumptions, missing provenance, invalid references, and promoted blocked claims.

### Contract Set

| Contract | Required shape for 4B-2 | Verifier duty for 4B-2 | Must not do |
| --- | --- | --- | --- |
| Source fixture | One file-based corridor packet with corridor ID, source packet metadata, source record IDs, geometry references, permitted claim classes, blocked claim classes, provenance, and raw/normalized hash fields. | Check required metadata, source traceability, geometry presence, stable IDs, allowed/blocked claims, and deterministic hash inputs. | Do not create broad ingestion, live API use, scraping, exact storefront/facade claims, or unapproved source storage. |
| Scene manifest | Planning target for a later generated package: corridor envelope, semantic object list, source references, QA/provenance flags, storefront anchors, business links, style recipe ID, and asset references. | For 4B-2, prepare reference checks only; generated manifests wait for 4B-3 approval. | Do not generate a manifest, approve a runtime API, or bake business/place facts into pixels. |
| Storefront anchors | Explicit semantic candidates with anchor ID, building or block-face reference, side/orientation, placement method, evidence status, confidence, and optional business-link candidates. | Check anchors are explicit, status-labeled, and not silently inferred from POI coordinates, address strings, business names, or footprints. | Do not claim tenant frontage, entrance, order, facade, or exact address placement without evidence approval. |
| Stable IDs | Deterministic IDs for corridor, source packet, source record, geometry object, storefront anchor, business link, override, style recipe, and asset reference. | Re-run ID derivation or fixture checks to confirm IDs are stable and references resolve. | Do not use display labels, array position alone, timestamps, random IDs, or hand-renamed IDs as identity. |
| Manual overrides | Versioned override records with target ID, field path, status, reason, evidence reference, author/reviewer, date, and replacement value or blocked marker. | Check every manual change is visible, versioned, justified, and attached to an existing target. | Do not hide manual fixes inside generated output, style rules, raster art, or compiler defaults. |
| Style recipe | Versioned visual-interpretation rules keyed by semantic type, truth/status class, scale band, interaction state, and asset family. | Check referenced style recipe IDs exist and do not mask QA/provenance states. | Do not approve production visual assets, new visual language, or runtime styling implementation. |
| Asset registry | Logical asset references with asset ID, family, semantic role, expected anchor/pivot names, status, source/license notes, and allowed use. | Check manifest/style references point to declared logical assets when assets enter scope later. | Do not produce GLB/glTF files, asset kits, production assets, or asset-pipeline tooling. |

### 4B-2 Entry Criteria

- Batu approves 4B-2 and the current brief names it executable.
- Source fixture path, allowed source classes, storage/attribution/cache/display rules, and verifier scope are approved.
- Schema-file ownership is either explicitly approved or the verifier stays structural and file-local.
- The 4B-2 batch remains limited to one corridor source fixture plus verifier; no compiler, runtime, generated manifest, assets, package/tooling changes, live APIs, scraping, or broad ingestion.

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

## First Visual Proof Contract

4B-2 remains fixture plus verifier only. 4B-3 may create a primitive compiler and deterministic semantic manifest only if Batu approves that exact compiler/generated-output boundary. The first renderer/visual-proof batch after 4B-3 must validate the actual 3D architecture.

Required visual proof:

- Deterministic, interactive 3D corridor scene, not a static raster, 2D mockup, hand-authored illustration, non-spatial manifest-only artifact, or manually arranged scene.
- Graybox/isometric fidelity: extruded building footprints or primitive massing, simple materials, and no production assets.
- Pan, zoom, and orbit/rotate camera controls.
- Corridor orientation recognizable, with the next intersection recognizable enough for QA.
- Building massing generated from source geometry and the semantic scene manifest, not hand-composed art.
- Semantic object IDs inspectable.
- Storefront-anchor placeholders visible only when evidence/status allows.
- Hover/click hooks resolving through semantic IDs.
- QA, provenance, and blocked-claim states inspectable.

Not part of the first visual proof:

- Final art direction.
- Exact facades.
- Exact storefront ordering/frontage claims unless separately evidenced and approved.
- Business cards.
- GLB/glTF assets or asset pipeline.
- Production styling.
- Polished hover/card visual language.

A future 4B visual batch fails the contract if it only produces a static image, 2D map, raster composition, manually arranged scene, or manifest with no navigable 3D proof.

## Near-Term Stack Stance

- File-based JSON/GeoJSON fixtures are acceptable for a one-corridor proof.
- Python is the likely spatial-compilation lane because of GeoPandas/Shapely/Fiona/NetworkX maturity.
- Node remains the likely verification/frontend-build lane where aligned with the current repo.
- For the completed 4B-4 proof, 4B-4R legibility revision, 4B-5 context coverage expansion, 4B-6 recognizability QA batch, and open 4B-6R correction batch, minimal Three.js is used only as a renderer inside the existing React + Vite shell.
- React Three Fiber, Drei, and GLB/glTF runtime asset pipelines are not authorized for 4B-4, 4B-4R, 4B-5, 4B-6, or 4B-6R.
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
