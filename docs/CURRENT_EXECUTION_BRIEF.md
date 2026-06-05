# Current Execution Brief - Phase 4B Batch 4B-2 Gate

Status: `Batch 4B-2: Minimal source fixture + verifier` is complete pending Batu review. Batu approved opening 4B-2 on 2026-06-05; Codex created one file-based corridor source fixture plus one targeted verifier and stopped at the 4B-2 roadmap gate. No 4B-3 batch is executable until Batu explicitly approves it and this brief is updated.

Documentation clarification: before 4B-3 is opened, the Phase 4B docs now explicitly require the first visual proof after the primitive compiler to be a deterministic, navigable, interactive 3D graybox/isometric corridor scene. A static image, 2D map, raster composition, manually arranged scene, or manifest-only artifact does not satisfy the future visual-proof gate.

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

Name: `Batch 4B-2: Minimal source fixture + verifier`

Execution rule:

- Agents must stop at the 4B-2 roadmap stop/decision gate.
- Use `docs/phase-4-execution-roadmap.md` as the operating plan.
- Do not self-advance into 4B-3 or any later Phase 4 batch without explicit Batu approval and an updated current brief.

Purpose:

- Review the minimal corridor source fixture and targeted verifier created for 4B-2.
- Decide whether to approve `Batch 4B-3: Primitive compiler`, revise the 4B-2 fixture/verifier, or pause before compiler implementation.
- Keep 4B-3 non-executable until explicitly approved.

Expected output:

- Review of `src/data/source-fixtures/greenpoint-ave-manhattan-to-franklin.phase-4b-source-fixture.v0.1.json`.
- Review of `scripts/verify-phase-4b-source-fixture.mjs`.
- No compiler, runtime, generated manifest, schema file, package/tooling, asset, API, scraping, business/place enrichment, or production/public work until the next batch is approved or this brief is updated.

## Proposed Next Task Pending Approval

Name: `Batch 4B-3: Primitive compiler`

Approval state:

- Pending Batu approval or updated current brief.
- Not executable from this brief as currently written.

Expected future output if approved:

- Minimal compiler that consumes the approved 4B-2 source fixture and produces one deterministic semantic scene manifest only if Batu approves the compiler/generated-output boundary.
- Deterministic IDs, primitive massing inputs, storefront-anchor candidates only where explicit and status-labeled, confidence levels, and explicit manual overrides.
- 4B-3 remains compiler/manifest only if approved; the first renderer/visual-proof batch after 4B-3 must validate the actual 3D architecture with pan, zoom, orbit/rotate, semantic-ID inspection, hover/click hooks, QA/provenance visibility, and blocked-claim visibility.
- Stop if generated manifest ownership, public/runtime interface status, compiler boundary, schema ownership, or source/claim promotion rules are unresolved.

## Phase 4B Boundary

Phase 4B is `Reproducible Data-to-Scene + Storefront Anchor Foundation`.

Phase 4B is open only at the specific batch named in this brief. 4B-2 is complete pending Batu review. 4B-3 remains closed until Batu approves it and a later `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens the narrow executable scope.

Current Phase 4B docs are supporting planning detail only. The 4B-2 fixture/verifier prepare 4B-3, but they do not authorize compiler scripts beyond the approved verifier, generated manifests, runtime refactors, package/tooling changes, public interfaces, asset-kit files, GLB production work, production architecture, or 4B-3 execution without approval.

## Claim Discipline

- The DTR-11 west-anchor raster remains review-only and non-production.
- The Phase 3D corridor matte remains review-only and non-production.
- The Phase 3D reference packet informs general visual character only; it does not promote business identity, active status, exact frontage, exact entrance, exact address placement, exact facade claims, signage claims, Brouwerij claims, production/public claims, scraping, live APIs, or third-party imagery collection.
- NYC/Open geometry supports street/building context only. It does not prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Storefront anchoring and business-to-storefront matching remain first-class unresolved Phase 4 problems.
- Business/place facts must remain semantic data and must not be baked into image pixels.

## Stop Conditions

Stop and report before:

- Implementing Phase 4 runtime/code, schema files, compiler scripts beyond the approved 4B-2 verifier, additional or unapproved source fixtures, generated manifests, asset-kit files, GLB assets, package/tooling changes, or public interfaces.
- Calling Foursquare or another business/POI API without credentials plus recorded terms/cache/display approval.
- Scraping websites, directories, or imagery.
- Making splats, world models, Blender, screenshots, Figma, AI image generation, Cesium, or manually composed scene files the canonical source of truth.
- Treating export/capture/reference outputs as canonical Greenpoint truth.
- Inventing building footprints, parcels, tenant frontage, entrances, facade appearance, exact address placement, or business identity.
- Treating manual-draft sidewalk bands or stylized scene projection as sourced/exact geometry.
- Treating NYC/Open geometry as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Adding production/public readiness, backend/CMS/persistence/analytics, broad coverage, full-neighborhood scope, dynamic spatial streaming, PostGIS, full 3D runtime, or deployment.

## Verification Expectations For This 4B-2 Gate

- `git status --short` before and after.
- `git diff --stat`.
- Markdown/link sanity by inspection unless a repo check is present.
- JSON parse only if JSON files are touched.
- `git diff --check`.
