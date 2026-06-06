# Current Execution Brief - Post-4C Geometry Confidence Direction

Status: Post-4C docs-only planning state. `Batch 4C-5: QA-mode street-feel facade tuning pass` is complete and committed as `eaf3418` (`Tune QA facade slice street feel`). 4C-4 and 4C-5 proved that the QA-only fictional facade slice can become more street-readable, but the generic fictional-facade tuning lane should now stop. The next recommended direction is Phase 4D geometry confidence and claim discipline.

Current executable batch: none.

Proposed next authorization: `Batch 4D-1: Geometry validation and gap audit`.

Pre-authorized queue: none.

Hard Batu review gate: stop here until Batu explicitly authorizes 4D-1 or a different next batch. Do not self-open 4D-1 or any later 4D batch.

Self-advance allowed: no.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, geometry-confidence acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, evidence-approved facade cue approval, art-direction approval, and any later MVP gates.

## Operating Model

Approval governs boundaries, not every action.

Batu approval should define the active work packet, allowed scope, hard stop conditions, truth gates, verification expectations, commit behavior, and final review gate. Codex executes inside those boundaries and stops when a boundary, truth gate, verification failure, dirty-tree issue, or unresolved ambiguity is hit.

Inside an approved bounded packet, Codex should not ask for approval after every small valid execution step. If a change is geometry-only, deterministic, verified, and inside the approved packet, Codex should proceed. If a change is QA-only, status-labeled, non-factual, verified, and inside the approved packet, Codex should proceed. Codex must not self-open new packets, phases, or claim classes without Batu approval.

Bounded work packets may contain one to four small sequential batches, must name allowed files or areas where possible, must define explicit stop conditions, may allow self-advance only through explicitly authorized steps after clean verification, and must end at a Batu review gate.

Truth gates remain strict: no real business/storefront/tenant/facade/frontage/entrance/signage claims without approved evidence, no source expansion without approval, and no claim-level escalation without approval.

Commit behavior is packet-scoped. Codex may commit after each successful batch only when the packet explicitly allows commit-after-batch behavior, only allowed files changed, verification passes, final status is clean except intended changes, and the commit message clearly names the batch.

QA mode remains the experimental product lab: it may contain draft, non-factual, status-labeled approximations, while normal mode remains protected. QA output must carry visible statuses such as `manual_draft`, `fictional_safe`, `not_verified`, or equivalent.

Implementation packets should produce visible scene progress, data/fixture progress, interaction/review progress, verifier/report progress, or deploy/review progress. Pure governance/docs-only batches should happen only when explicitly requested or when a next pointer/gate must be updated.

## Planning Decision

The next phase should shift from fictional facade tuning to geometry confidence and claim discipline.

Rationale:

- 4C-4 and 4C-5 proved the QA lane and draft street-feel facade grammar, but further fictional-facade tuning is not the highest-leverage next move.
- Before Foursquare, facade imagery, storefront anchors, or asset management, the project needs a reviewable geometry confidence layer.
- The core 4D-1 question is: can every rendered building be inspected and classified as safe, uncertain, or blocked for later POI and facade matching?
- "Correct geometry" means geometry confidence in a stylized/normalized runtime, not survey-grade correctness.
- Foursquare and local directories should later be treated as candidate business enrichment, not authoritative storefront assignment.
- Google/Street View must not become a default stored or derived source-of-truth asset pipeline without a separate terms/source-policy gate.
- Batu-supplied or project-owned storefront imagery remains the safest initial facade evidence path.

## Proposed Phase 4D Sequence

1. `Batch 4D-1: Geometry validation and gap audit`
2. `Batch 4D-2: Claim ladder / matching contract`
3. `Batch 4D-3: Candidate POI overlay`
4. `Batch 4D-4: Batu-supplied facade evidence packet`
5. `Batch 4D-5: Evidence-backed facade/storefront anchors`
6. Asset registry / visual system work only after evidence and anchor models are defined.

## Proposed Batch: 4D-1

`Batch 4D-1: Geometry validation and gap audit` is proposed only. It is not executable until Batu explicitly authorizes it.

Goal:

- Make the existing 4B/4C corridor geometry inspectable and confidence-labeled before attaching POIs, facade evidence, or storefront anchors.

Expected outputs if later authorized:

- A generated geometry validation/gap report for current rendered building masses.
- QA inspector or overlay improvements that show building identity and confidence.
- Per-building review fields such as rendered object ID, source footprint/building ID, corridor side, relative order/block position, source-backed/inferred/manual status, height/massing confidence, gap/block-break status, address/building ambiguity if known, POI matching eligibility, and facade evidence anchoring eligibility.

Acceptance bar if later authorized:

- Before adding businesses or facades, QA mode should let Batu inspect a building and understand what it is, where it came from, how confident the geometry is, what claims are allowed, what claims are blocked, and whether it is safe to use as a future POI/facade anchor.

4D-1 must not include:

- Foursquare or local-directory calls.
- POI overlays.
- Facade imagery ingestion.
- Storefront anchors.
- Asset registry or visual system work.
- New dependencies unless separately approved.
- Runtime, verifier, data, UI, package, source, or architecture changes unless Batu opens those boundaries in a later executable brief.

## Hard Stops

Stop and report before:

- Implementing 4D-1.
- Opening another generic fictional-facade tuning batch.
- Foursquare, local-directory, API, scraper, live-data, or source acquisition work.
- POI/business overlays or business-to-building matching.
- Facade imagery ingestion, Google/Street View/3D Tiles use, capture workflows, or automated extraction.
- Storefront-anchor implementation.
- Evidence-approved facade cues, exact facade, storefront, frontage, entrance, signage, window/door/awning/material/color, exact-address, active-business, or public/product-ready claims.
- Asset registry, visual system, art-direction pass, generated assets, raster assets, GLB/glTF assets, or production visual assets.
- Source fixture expansion beyond existing manifest/geometry support.
- New dependencies unless explicitly approved in a later brief.
- Any change that would require broad architecture, product, art-direction, public-interface, or source-policy decisions.
- Committing implementation unless Batu explicitly authorizes commit behavior in the prompt.

## Claim Discipline

- Sourced NYC/Open geometry supports contextual building massing, source footprint IDs, corridor-side labels, street-facing plane cues, width/depth/height tiers where supported, block breaks, corner/endpoint roles, and coverage status.
- Runtime geometry is stylized/normalized for review and must not be treated as survey-grade correctness.
- Geometry confidence must be visible before POI or facade matching.
- POI/business sources may support candidate identity, address, category, coordinates, and possibly freshness/status, but they do not prove facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- Google/Street View should not be treated as a default stored/derived source-of-truth asset pipeline without a separate terms/source-policy gate.
- Batu-supplied/project-owned storefront imagery is the preferred first facade evidence path.
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

The Phase 4B/4C runtime, fixtures, verifiers, and QA facade slice remain preserved. No 4D implementation work is open or queued.
