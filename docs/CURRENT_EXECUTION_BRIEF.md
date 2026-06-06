# Current Execution Brief - Phase 4C Batch 4C-1 Recognizable Facade Cue Planning Review Gate

Status: `Batch 4C-1: Recognizable facade cue planning` is complete as a docs-only planning batch. No implementation batch is authorized.

Current executable batch: none.

Proposed next batch for Batu review: `Batch 4C-2: Geometry-only facade cue fixture and QA overlay`.

Pre-authorized queue: none.

Hard Batu review gate: stop for Batu review of the 4C-1 planning output before any later batch.

Self-advance allowed: no. Codex must stop because the pre-authorized queue is empty and no next executable batch is authorized.

4C-1 defined the smallest truth-safe path from the committed deterministic Phase 4B graybox corridor toward recognizable Greenpoint Ave corridor identity. It added `docs/phase-4c-recognizable-facade-cue-plan.md` and reconciled the execution-control docs. It did not change runtime code, tune cameras, expand source fixtures, change the generated manifest, add dependencies, generate assets, call external APIs, add business/place overlays, implement storefront anchors, or verify facade/business detail.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, and any later MVP gates.

## Completed 4C-1 Output

Primary planning doc:

- `docs/phase-4c-recognizable-facade-cue-plan.md`

4C-1 answered:

- What facade/corridor identity cues are safe from source-backed geometry alone.
- What cues require Batu-supplied or Batu-approved visual/evidence references.
- What claims remain forbidden until stronger evidence exists.
- How landmark/special-treatment buildings should be handled.
- How future business/storefront anchors should depend on facade/frontage evidence.
- What smallest later implementation batch could improve recognizability without breaking truth safety.

Core strategy:

- Use geometry-only cues first: street-facing plane, building-width rhythm, height tier where already supported, corner/endpoint role, setback/depth tier, block breaks, side-of-corridor, and coverage status.
- Require approved evidence for facade-module layout, entrance cues, window bays, sign bands, awnings/canopies, material/color notes, local props, transit-entrance cues, and landmark identity treatment.
- Keep exact facade reproduction, storefront order, tenant frontage, entrance placement, sign/brand claims, exact address placement, active-business status, and production/public readiness blocked until later evidence and Batu approval.

## Proposed Next Step For Batu Review

Recommended next batch: `Batch 4C-2: Geometry-only facade cue fixture and QA overlay`.

Recommendation:

- Choose 4C-2 as the next implementation batch only if Batu wants visible MVP progress before evidence-approved facade work.
- Reason: geometry-only cues can improve corridor recognizability while preserving truth safety, because they attach to existing source-backed semantic building IDs and do not claim exact facade, storefront, business, sign, entrance, material, or address truth.
- Why not evidence-approved facade cues now: those require Batu-supplied or Batu-approved visual/evidence references, usage status, and manual review.
- Why not storefront/business anchors now: anchor semantics still depend on frontage/facade/entrance evidence that does not exist in the current 4B proof.
- Why not 4B-7 camera tuning now: M-to-F and F-to-M camera tuning remains a valid conditional follow-up, but it should stay a later narrow runtime batch only if Batu prioritizes it.

Proposed 4C-2 scope:

- Create one small cue fixture for existing 4B semantic building IDs using geometry-only cue classes.
- Add one verifier that checks cue provenance, claim status, blocked claims, and target ID resolution.
- Render only geometry-only cues in QA mode or a clearly status-labeled review layer.
- Preserve the existing runtime boundary, source fixture, generated manifest, package dependencies, and blocked business/storefront/facade claims.

Explicit non-scope for 4C-2 unless Batu revises the brief:

- No evidence-approved facade detail.
- No exact facade, storefront, frontage, entrance, sign, window, door, awning, material, color, address, active-business, or real-place card claims.
- No business/place overlays.
- No storefront-anchor implementation.
- No source acquisition, external APIs, scraping, capture workflows, generated assets, or dependency changes.
- No camera tuning unless Batu explicitly chooses a separate 4B-7 batch instead.

Acceptance criteria for opening 4C-2:

- Batu approves the cue fixture boundary and whether it is an implementation/public-interface change.
- Batu accepts geometry-only cue classes as review affordances, not facade truth.
- Batu confirms that evidence-approved facade cues, landmark identity treatment, storefront anchors, and business overlays remain blocked until later gates.

Stop gate:

- Stop for Batu review. `Batch 4C-2: Geometry-only facade cue fixture and QA overlay` is proposed only; it is not executable until Batu updates this brief or the pre-authorized queue.

## Current State

Docs authority routing:

- `docs/DOCS_INDEX.md`
- `docs/phase-4-execution-roadmap.md`

Phase 4 primary operational roadmap:

- `docs/phase-4-execution-roadmap.md`

Supporting detail docs:

- `docs/phase-4c-recognizable-facade-cue-plan.md`
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/phase-3-closeout.md`

The Phase 3D review matte, app surface, screenshot evidence, reference inventory, self-audit, and evidence inventory remain preserved as review-only/non-production evidence. Sourced geometry remains provenance/layout underlay. Truth-state overlays remain QA/provenance overlays, not the primary visual deliverable.

Brouwerij/business/frontage/facade/entrance/signage/active-status/exact-storefront/exact-address claims remain blocked unless separately authorized through evidence gates.

## Current Gate

Name: `Batch 4C-1: Recognizable facade cue planning review gate`

Execution state:

- Current executable batch: none.
- Pre-authorized queue: none.
- Hard Batu review gate: stop for Batu review of the 4C-1 planning output.
- Self-advance allowed: no.

Execution rule:

- 4B-6R cleared Batu visual review with result: CONDITIONAL PASS.
- 4C-1 is complete as documentation/planning only.
- There are no pre-authorized queued batches after 4C-1.
- Use `docs/phase-4-execution-roadmap.md` as the operating plan.
- Preserve the existing React + Vite + Three.js runtime boundary unless Batu later opens a specific implementation batch.
- Do not self-advance into 4C-2, 4B-7, evidence-approved facade work, anchor semantics, storefront work, business verification, art direction, source expansion, or any post-4C-1 work.

## Claim Discipline

- NYC/Open geometry may support source-backed contextual building massing, corridor-side labels, street-facing plane cues, width/depth/height tiers when already supported, block breaks, corner/endpoint roles, and coverage status.
- NYC/Open geometry does not prove tenant frontage, storefront order, entrance placement, facade appearance, signage, window/door/awning/material/color truth, active-business status, exact address placement, or raster readiness.
- Human-approved evidence is required before facade-module layout, entrance cues, window bays, sign bands, awnings/canopies, material/color notes, local props, transit-entrance cues, or landmark identity treatment can render as evidence-approved cues.
- Storefront anchoring and business-to-storefront matching remain first-class unresolved Phase 4 problems.
- Business/place facts must remain semantic data and must not be baked into image pixels.
- Geometry-only cues must be framed as deterministic graybox/review affordances, not sourced/exact facade, curb, sidewalk, frontage, entrance, address, business, or landmark truth.

## Stop Conditions

Stop and report before:

- Moving beyond 4C-1, because the pre-authorized queue is empty.
- Opening 4C-2, 4B-7, evidence-approved facade cues, landmark identity treatment, anchor semantics, storefront work, business verification, art direction, source expansion, or any later batch without Batu approval and an updated current brief/queue.
- Adding or broadening source data.
- Changing the source fixture or generated manifest.
- Adding package dependencies.
- Adding business verification, POI enrichment, APIs, scraping, external imagery, raster/generative/stock assets, GLB/glTF assets, routing, deployment, backend/CMS/persistence/analytics, or broad map systems.
- Calling Foursquare, LiveXYZ, local-directory sources, or another business/POI API.
- Inventing building footprints, parcels, tenant frontage, storefront anchors, entrances, facade appearance, signage, exact address placement, business identity, business active status, cross-streets, landmarks, or unsupported endpoint claims.
- Treating geometry-only cue classes as sourced/exact geometry beyond their documented status.
- Treating NYC/Open geometry as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Adding production/public readiness, full-neighborhood scope, dynamic spatial streaming, PostGIS, broad map systems, or full 3D runtime architecture.

## Execution Queue Template

Use this template for future execution-control updates:

```markdown
Current executable batch:

- [batch name]

Pre-authorized queue:

1. [optional next batch]
2. [optional next batch]

Hard review gate:

- [where Codex must stop]

Self-advance allowed:

- yes/no

Stop conditions:

- [list]
```

Queue rules:

- Codex may implement the current executable batch.
- Codex may self-open and execute the next queued batch only when the prior batch completed within scope, required verification passed or failures are documented as non-blocking, docs are updated to mark the prior batch complete, the next batch is already listed in the pre-authorized queue, and no hard Batu review gate intervenes.
- Codex must never invent a new batch, rename a batch, expand scope, skip a batch, or continue past a hard Batu review gate.
- Codex must stop and return results when the current batch says "stop at review gate", visual review by Batu is required, product/strategy judgment is required, source expansion is proposed, business verification is proposed, facade/storefront semantics are proposed for the first time, art direction is proposed, package/dependency addition is proposed, or the next step is not already in the pre-authorized queue.
