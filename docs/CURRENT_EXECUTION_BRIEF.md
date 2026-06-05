# Current Execution Brief - Phase 4A Batch 4A-5 Gate

Status: `Batch 4A-5: Decision gate` is complete pending Batu review. Phase 4A now has a recommendation, and the Phase 4B gate remains closed. No Phase 4B batch is executable until Batu explicitly approves the next batch and this brief is updated.

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

## Current Gate

Name: `Batch 4A-5: Decision gate`

Execution rule:

- Agents must stop at the 4A-5 roadmap stop/decision gate.
- Use `docs/phase-4-execution-roadmap.md` as the operating plan.
- Do not self-advance into Phase 4B or any later Phase 4 batch without explicit Batu approval and an updated current brief.

Purpose:

- Review the Phase 4A recommendation now recorded in `docs/phase-4a-workflow-spike-plan.md`.
- Decide whether to approve a later Phase 4B planning/implementation batch, revise the Phase 4A recommendation, or pause before implementation.
- Keep Phase 4A as a decision workflow and keep Phase 4B non-executable until explicitly approved.

Expected output:

- Review of the 4A-5 recommendation now recorded in `docs/phase-4a-workflow-spike-plan.md`.
- Review of the recommendation summary in `docs/phase-4a-workflow-spike-decision-matrix.md`.
- No new Codex implementation until the next batch is approved or this brief is updated.

## Proposed Next Task Pending Approval

Name: `Batch 4B-1: Contract foundation`

Approval state:

- Pending Batu approval or updated current brief.
- Not executable from this brief as currently written.

Expected future output if approved:

- Lean planning contracts for source fixture, scene manifest, storefront anchors, stable IDs, manual overrides, style recipe, and asset registry.
- Contracts only; no runtime code, compiler code, generated manifests, package/tooling, broad data model, or asset production.
- Stop if public interfaces, module boundaries, schema ownership, source storage/attribution, or verifier scope need approval.

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
