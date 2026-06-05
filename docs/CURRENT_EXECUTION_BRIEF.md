# Current Execution Brief - Phase 4A Workflow Spike Planning

Status: Phase 3 is closed for planning purposes. The Phase 3D corridor style matte remains complete review evidence, and the next task is `Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference`, proposed unless repo docs already mark it approved.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, Phase 4A approval, Phase 4B implementation approval, and any later MVP gates.

## Current State

Phase 3 validated that real corridor geometry and business/source evidence matter, but it also exposed that artifact-specific rendering is not a scalable production workflow. The project should stop patching the current manually guided corridor artifact and move toward a production-shaped data-to-scene pipeline.

Preserved Phase 3 evidence:

- Phase 3D review matte: `src/assets/review-only/phase-3d-greenpoint-westward-corridor-matte-review-only.png`
- Phase 3D review package: `docs/mvp-review/phase-3d-corridor-style-matte-review/`
- Phase 3D deterministic screenshot: `docs/mvp-review/phase-3d-corridor-style-matte-review/generated/phase-3d-corridor-style-matte-default.png`
- Phase 3 closeout: `docs/phase-3-closeout.md`
- Phase 3 real corridor evidence inventory: `docs/phase-3-real-corridor-evidence-inventory.md`
- Phase 3 POI/business source ADR: `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- Phase 3 geometry-first corridor review package: `docs/mvp-review/phase-3-geometry-first-corridor-review/`

The final primary world surface for the completed Phase 3D review is a review-only raster PNG matte. Sourced geometry remains provenance/layout underlay. Truth-state overlays remain QA/provenance overlays, not the primary visual deliverable.

Brouwerij/business/frontage/facade/entrance/signage/active-status/exact-storefront/exact-address claims remain blocked unless separately authorized through evidence gates.

## Proposed Next Task

Name: `Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference`

Purpose:

- Compare three candidate workflow lanes on the same Greenpoint Ave Manhattan-to-Franklin corridor before Phase 4B implementation is opened.
- Evaluate deterministic compiler, 3D map/export shortcut, and reality-capture/reference lanes.
- Recommend which lane becomes core, which becomes reference/acceleration, and which is rejected or deferred.
- Identify the smallest proof needed before Phase 4B.

Phase 4A output should be a decision document and supporting notes. It should not create production systems, runtime code, schema files, compiler scripts, source fixtures, generated manifests, asset-kit files, public interfaces, package tooling, or production architecture.

Planning docs:

- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`

## Phase 4B Boundary

Phase 4B is `Reproducible Data-to-Scene + Storefront Anchor Foundation`.

Current Phase 4B docs are non-implementation planning only. They do not authorize schema files, compiler scripts, generated manifests, source fixtures, runtime refactors, package/tooling changes, public interfaces, asset-kit files, GLB production work, or production architecture.

Phase 4B implementation may begin only after Phase 4A produces a recommendation, Batu approves the architecture boundaries and public-interface implications, and a later `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens the narrow executable scope.

## Claim Discipline

- The DTR-11 west-anchor raster remains review-only and non-production.
- The Phase 3D corridor matte remains review-only and non-production.
- The Phase 3D reference packet informs general visual character only; it does not promote business identity, active status, exact frontage, exact entrance, exact address placement, exact facade claims, signage claims, Brouwerij claims, production/public claims, scraping, live APIs, or third-party imagery collection.
- NYC/Open geometry supports street/building context only. It does not prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Storefront anchoring and business-to-storefront matching remain first-class unresolved Phase 4 problems.
- Business/place facts must remain semantic data and must not be baked into image pixels.

## Stop Conditions

Stop and report before:

- Implementing Phase 4 runtime/code, schema files, compiler scripts, source fixtures, generated manifests, asset-kit files, GLB assets, package/tooling changes, or public interfaces.
- Calling Foursquare or another business/POI API without credentials plus recorded terms/cache/display approval.
- Scraping websites, directories, or imagery.
- Making splats, world models, Blender, screenshots, Figma, AI image generation, Cesium, or manually composed scene files the canonical source of truth.
- Treating export/capture/reference outputs as canonical Greenpoint truth.
- Inventing building footprints, parcels, tenant frontage, entrances, facade appearance, exact address placement, or business identity.
- Treating manual-draft sidewalk bands or stylized scene projection as sourced/exact geometry.
- Treating NYC/Open geometry as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Adding production/public readiness, backend/CMS/persistence/analytics, broad coverage, full-neighborhood scope, dynamic spatial streaming, PostGIS, full 3D runtime, or deployment.

## Verification Expectations For The Docs-Only Closeout Batch

- `git status --short` before and after.
- `git diff --stat`.
- Markdown/link sanity by inspection unless a repo check is present.
- JSON parse only if JSON files are touched.
- `git diff --check`.
