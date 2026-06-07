# Current Execution Brief - Post-4D-3 Candidate POI QA Review

Status: Batu approved `Batch 4D-2: Claim ladder / matching contract`. `Batch 4D-3: Candidate POI QA fixture and overlay` is complete pending Batu review. The project now has a deterministic synthetic candidate-only POI fixture, verifier, QA-only runtime markers, and inspector labels without adding real POIs, businesses, facade imagery, storefront anchors, tenant frontage matches, active-status claims, or production cards.

Current executable batch: none.

Proposed next authorization: `Batch 4D-4: Batu-supplied facade evidence packet`, only after Batu reviews and accepts the 4D-3 candidate POI QA output or gives alternate direction.

Pre-authorized queue: none.

Hard Batu review gate: stop here for Batu review of 4D-3. Do not self-open 4D-4 or any later 4D batch.

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

## 4D-1 Output

4D-1 completed:

- Generated `src/data/geometry-validation/greenpoint-ave-manhattan-to-franklin.phase-4d-geometry-validation-report.v0.1.json`.
- Added `scripts/verify-phase-4d-geometry-validation.mjs`.
- Added QA-only runtime confidence visibility in the existing inspector and QA panel.
- Classified 142 rendered buildings: 126 `safe`, 14 `uncertain`, and 2 `blocked`.
- Preserved normal-mode protection: 4D confidence labels are hidden until QA is enabled.

Verification completed:

- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: QA off showed `QA off`; QA on showed `126 / 14 / 2`; selecting blocked record `p4b-object-nyc-footprint-bin-3064901` showed `blocked`, blocker reasons, gap status, and `blocked_until_geometry_resolved`; no browser console errors were reported.
- `git diff --check`

## 4D-2 Output

4D-2 completed:

- Added `docs/phase-4d-claim-ladder-matching-contract.md`.
- Defined claim states and nine claim levels: geometry container, address candidate, parcel/building association, POI candidate, tenant-at-address, storefront/frontage, entrance, facade/signage, and landmark/special-treatment.
- Defined allowed/disallowed evidence, runtime/QA rules, Batu evidence gates, matching rules, default blocked states, and promotion gates.
- Preserved the hard boundary that NYC/Open footprints do not prove business/storefront/frontage/entrance/signage claims.
- Preserved no POIs, no businesses, no facade imagery, no storefront anchors, no tenant frontage matches, no runtime visual changes, no source expansion, and no production claims.

Verification completed:

- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `git diff --check`

## 4D-3 Output

4D-3 completed:

- Added `src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json`.
- Added `scripts/verify-phase-4d-candidate-pois.mjs`.
- Added `docs/phase-4d-candidate-poi-qa-fixture.md`.
- Added six deterministic synthetic/manual placeholder candidate records generated from the 4D-1 geometry validation report.
- Added QA-only runtime candidate markers and inspector text. Normal mode hides candidate records and markers.
- Preserved the hard boundary: candidate POIs are not storefront assignments, active businesses, tenants, frontage, entrances, facades, signage, production cards, or source-backed real business truth.

Verification completed:

- `node scripts/verify-phase-4d-candidate-pois.mjs`
- `node scripts/verify-phase-4d-geometry-validation.mjs`
- `node scripts/verify-phase-4c-geometry-cues.mjs`
- `node scripts/verify-phase-4c-qa-facade-slice.mjs`
- `node scripts/verify-phase-4b-source-fixture.mjs`
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`
- `npm run build`
- Browser smoke on local preview: normal mode showed `Candidate POIs` as `QA off` and no candidate records; QA mode showed six candidates, `candidate_only`, `manual_review_required`, `blocked_insufficient_evidence`, `synthetic_manual_placeholder`, and `Not a storefront assignment.`
- `git diff --check`

## Proposed Phase 4D Sequence

1. `Batch 4D-1: Geometry validation and gap audit`
2. `Batch 4D-2: Claim ladder / matching contract`
3. `Batch 4D-3: Candidate POI QA fixture and overlay`
4. `Batch 4D-4: Batu-supplied facade evidence packet`
5. `Batch 4D-5: Evidence-backed facade/storefront anchors`
6. Asset registry / visual system work only after evidence and anchor models are defined.

## Proposed Batch: 4D-4

`Batch 4D-4: Batu-supplied facade evidence packet` is proposed only. It is not executable until Batu explicitly authorizes it.

Goal:

- Define or ingest a Batu-supplied/project-owned facade evidence packet with provenance, usage status, allowed uses, blocked uses, and candidate target geometry references.

Expected outputs if later authorized:

- A review-only facade evidence packet contract or fixture, only from Batu-supplied/project-owned or otherwise Batu-approved evidence.
- Provenance, source/access, usage, allowed-use, blocked-use, target-candidate, and ambiguity fields.
- Explicit separation from storefront anchors, production assets, exact facade claims, and visual-system work.

Acceptance bar if later authorized:

- Batu can review evidence readiness and usage boundaries before any evidence-backed facade/storefront anchors are created.

4D-4 must not include:

- Google/Street View/3D Tiles default stored or derived source-of-truth pipeline.
- Scraping, unprovenanced imagery, generated assets, or production assets.
- Storefront anchors.
- Tenant frontage, storefront order, entrance, facade, signage, active-status finality, or exact-address placement promotion.
- Asset registry or visual system work.
- New dependencies unless separately approved.
- Runtime, verifier, data, UI, package, source, or architecture changes unless Batu opens those boundaries in a later executable brief.

## Hard Stops

Stop and report before:

- Implementing 4D-4.
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

The Phase 4B/4C runtime, fixtures, verifiers, QA facade slice, 4D-1 geometry validation report, 4D-2 claim ladder contract, and 4D-3 synthetic candidate POI QA fixture remain preserved. No further 4D implementation work is open or queued.
