# Current Execution Brief - Phase 4C Geometry-Only Facade Cue Work Packet

Status: `Batch 4C-2: Geometry-only facade cue fixture and QA overlay` is complete pending Batu review. The Phase 4C Geometry-Only Facade Cue Work Packet remains bounded to geometry-only facade/corridor cue work. It does not authorize evidence-approved facade cues, exact facade claims, storefront/business overlays, art-direction work, external APIs/scrapers, source expansion beyond existing manifest/geometry support, new dependencies, unrelated camera tuning, 4C-4, or any later batch.

Current executable batch: none. Stop for Batu review of 4C-2 output.

Pre-authorized queue:

1. `Batch 4C-3: Narrow geometry-only cue tuning pass`, only if Batu confirms a narrow geometry-only cue readability tuning need after reviewing 4C-2.

Hard Batu review gate: stop after 4C-3, or earlier if any stop condition is reached. Do not open 4C-4 or any later batch without Batu approval and an updated current brief/queue.

Self-advance allowed: no current self-advance remains. 4C-2 completed cleanly, but no required narrow 4C-3 tuning need was identified before this review gate.

4C-1 defined the truth-safe cue plan in `docs/phase-4c-recognizable-facade-cue-plan.md`. This packet now opens only the geometry-only implementation path described there.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, evidence-approved facade cue approval, art-direction approval, and any later MVP gates.

## Work Packet

Name: `Phase 4C Geometry-Only Facade Cue Work Packet`

Purpose:

- Create the smallest deterministic geometry-only facade/corridor cue fixture and QA overlay proof.
- Improve review recognizability using existing source-backed semantic building IDs and existing manifest/geometry support only.
- Preserve all blocked claims and make cue status inspectable.
- Avoid evidence-approved facade claims, storefront/business overlays, art-direction changes, source expansion, dependency changes, and unrelated camera tuning.

Authorized sequential batches:

1. `Batch 4C-2: Geometry-only facade cue fixture and QA overlay`
2. `Batch 4C-3: Narrow geometry-only cue tuning pass`, only if 4C-2 passes verification and stays within scope.

## Completed Batch: 4C-2

`Batch 4C-2: Geometry-only facade cue fixture and QA overlay` completed on 2026-06-06.

4C-2 output:

- Added a deterministic geometry-only cue fixture for the 142 existing 4B primitive building masses.
- Added a verifier that regenerates the fixture from the existing 4B manifest/runtime geometry and checks cue policy, deterministic IDs, geometry-only evidence inputs, and blocked claims.
- Added a QA-mode runtime overlay for geometry-derived review planes and cue tiers; normal mode does not render the cue layer.
- Preserved source fixture, generated manifest, dependencies, camera presets, business/storefront/facade blocked claims, and normal-mode claim protection.

4C-2 verification:

- Phase 4C cue fixture verifier passed.
- Phase 4B source fixture verifier passed.
- Phase 4B compiler determinism check passed.
- Frontend build passed.
- Browser smoke passed: QA toggled on, canvas rendered, `Geometry-only facade cues: 142` was visible, and no browser console errors were reported.
- `git diff --check` passed.

Stop condition:

- Stop for Batu review. 4C-3 was not started because no required narrow geometry-only cue tuning need was identified after 4C-2 verification.

## Historical 4C-2 Authorization

`Batch 4C-2: Geometry-only facade cue fixture and QA overlay` may:

- Inspect existing 4B manifest/runtime/source fixture shape before editing.
- Create one small geometry-only cue fixture for existing 4B semantic building IDs.
- Include only geometry-only cue classes from the 4C plan, such as street-facing plane, building-width rhythm, supported height/width tier, corner/endpoint role, setback/depth tier, block break, side-of-corridor, and coverage status.
- Add or update the smallest verifier needed to check cue provenance, claim status, blocked claims, deterministic IDs, and target ID resolution.
- Add a QA-mode or clearly status-labeled review overlay in the existing runtime boundary if needed for the proof.
- Preserve existing source fixture, generated manifest, package dependencies, runtime architecture, and blocked business/storefront/facade claims.
- Update docs and ledger to record the 4C-2 outcome and next pointer.

4C-2 must not:

- Add evidence-approved facade detail.
- Claim exact facade, storefront, frontage, entrance, sign, window, door, awning, material, color, address, active-business status, or real-place card readiness.
- Add business/place overlays.
- Implement storefront anchors.
- Acquire sources, call APIs, scrape, add capture workflows, generate assets, add dependencies, or tune cameras unrelated to cue review.
- Expand source fixtures beyond what existing manifest/geometry supports.
- Change production/public readiness, art direction, renderer, package tooling, backend, CMS, persistence, analytics, routing, deployment, or broad map systems.

4C-2 verification minimum:

- `git diff --check`.
- Cue verifier or fixture validation introduced/updated by the batch.
- Existing source fixture verifier and compiler determinism check if cue records reference existing source/manifest IDs.
- Frontend build and app/browser smoke if runtime code changes.

## Conditional Queued Batch: 4C-3

`Batch 4C-3: Narrow geometry-only cue tuning pass` is conditionally pre-authorized only after 4C-2 completes.

Codex may self-advance from 4C-2 to 4C-3 only if:

- 4C-2 verification passes.
- No source/evidence uncertainty appears.
- No product/visual decision is needed from Batu.
- Changes remain geometry-only and deterministic.
- Final 4C-3 scope is limited to small cue readability tuning.
- Docs are reconciled to mark 4C-2 complete and 4C-3 current before 4C-3 work starts.
- No hard stop condition intervenes.

4C-3 may:

- Make small cue readability tuning adjustments to the 4C-2 geometry-only fixture, verifier, or QA overlay.
- Improve label/status readability, cue grouping, cue counts, or geometry-only visual clarity.
- Preserve all 4C-2 source, claim, dependency, and runtime boundaries.
- Update docs and ledger to stop at the 4C packet review gate.

4C-3 must not:

- Add new cue families beyond geometry-only cue classes.
- Add evidence-approved facade cues, exact facade claims, storefront/business overlays, source expansion, art-direction changes, generated assets, new dependencies, unrelated camera tuning, 4C-4, or any later batch.

## Hard Stops

Stop and report before:

- Evidence-approved facade cues.
- Exact facade, storefront, frontage, entrance, signage, window/door/awning/material/color, exact-address, active-business, or public/product-ready claims.
- Business/place overlays or storefront-anchor implementation.
- Source fixture expansion beyond what existing manifest/geometry supports.
- Art-direction pass, generated assets, raster assets, GLB/glTF assets, or production visual assets.
- External APIs, scraping, capture workflows, automated extraction, or live data.
- New dependencies unless explicitly approved in a later brief.
- Camera tuning unrelated to cue review.
- 4C-4 or any later batch.
- A visual/product decision need.
- Verification failure.
- Missing source evidence or uncertainty about what existing geometry supports.
- Any change that would require broad architecture, product, art-direction, public-interface, or source-policy decisions.
- Committing implementation unless Batu explicitly authorizes commit behavior in the prompt.

## Claim Discipline

- Geometry-only cues are deterministic review affordances, not facade truth.
- NYC/Open geometry may support source-backed contextual building massing, corridor-side labels, street-facing plane cues, width/depth/height tiers when already supported, block breaks, corner/endpoint roles, and coverage status.
- NYC/Open geometry does not prove tenant frontage, storefront order, entrance placement, facade appearance, signage, window/door/awning/material/color truth, active-business status, exact address placement, or raster readiness.
- Human-approved evidence is required before facade-module layout, entrance cues, window bays, sign bands, awnings/canopies, material/color notes, local props, transit-entrance cues, or landmark identity treatment can render as evidence-approved cues.
- Storefront anchoring and business-to-storefront matching remain first-class unresolved Phase 4 problems.
- Business/place facts must remain semantic data and must not be baked into image pixels.

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
