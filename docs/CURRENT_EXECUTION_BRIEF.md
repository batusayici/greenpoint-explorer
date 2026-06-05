# Current Execution Brief - Phase 4A Workflow Spike Setup

Status: Phase 3 is closed for planning purposes. The Phase 3D corridor style matte remains complete review evidence. The immediate next task is `Batch 4A-1: Workflow spike setup`, proposed unless repo docs already mark it approved.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, Phase 4A approval, Phase 4B implementation approval, and any later MVP gates.

## Current State

Docs authority routing:

- `docs/DOCS_INDEX.md`
- `docs/phase-4-execution-roadmap.md`

Phase 4 now has one primary operational roadmap:

- `docs/phase-4-execution-roadmap.md`

Supporting detail docs:

- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/phase-3-closeout.md`

The Phase 3D review matte, app surface, screenshot evidence, reference inventory, self-audit, and evidence inventory remain preserved as review-only/non-production evidence. Sourced geometry remains provenance/layout underlay. Truth-state overlays remain QA/provenance overlays, not the primary visual deliverable.

Brouwerij/business/frontage/facade/entrance/signage/active-status/exact-storefront/exact-address claims remain blocked unless separately authorized through evidence gates.

## Proposed Next Task

Name: `Batch 4A-1: Workflow spike setup`

Purpose:

- Consolidate the Greenpoint Ave Manhattan-to-Franklin corridor target for Phase 4A.
- Confirm the inputs needed for the deterministic compiler lane, 3D map/export shortcut lane, and reality-capture/reference lane.
- Produce a ready-to-run spike checklist.
- Keep Phase 4A as a decision workflow, not a production system.

Expected output:

- A short 4A-1 checklist or update to existing Phase 4A supporting docs that makes the spike ready to run.
- No implementation beyond docs/checklist.

## Phase 4B Boundary

Phase 4B is `Reproducible Data-to-Scene + Storefront Anchor Foundation`.

Phase 4B remains post-spike and non-implementation until Phase 4A produces a recommendation, Batu approves the architecture boundaries and public-interface implications, and a later `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens the narrow executable scope.

Current Phase 4B docs are supporting planning detail only. They do not authorize schema files, compiler scripts, generated manifests, source fixtures, runtime refactors, package/tooling changes, public interfaces, asset-kit files, GLB production work, or production architecture.

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

## Verification Expectations For This Planning Cleanup Batch

- `git status --short` before and after.
- `git diff --stat`.
- Markdown/link sanity by inspection unless a repo check is present.
- JSON parse only if JSON files are touched.
- `git diff --check`.
