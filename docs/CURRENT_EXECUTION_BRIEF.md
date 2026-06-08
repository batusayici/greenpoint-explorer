# Current Execution Brief - Phase 4J-2 Complete, 4J-3 Open

Status: `Batch 4J-1 -> 4J-3: QA-Only Storefront Bay / Frontage Candidate Layer` is open as a bounded Batu-approved packet on 2026-06-08 after acceptance of the completed 4O-18 -> 4O-20 spatial scaffold review packet.

Completed precondition:

- 4O-18 through 4O-20 are committed at `3ebb949`.
- `git status --short` was clean before opening 4J.
- 4J-1 is committed at `8987722`.

4J-1 is complete and verified.

4J-2 is complete and verified.

Current executable batch: `Batch 4J-3: Candidate Gap + Readiness Report`.

Completed batch: `Batch 4J-2: QA Runtime Frontage Candidate Overlay`.

Pre-authorized queue: none.

Self-advance allowed: no. Stop after 4J-3 at the hard Batu review gate.

Hard Batu gate: stop after 4J-3. Do not start 4K, 4P, evidence intake, business/source linkage, facade evidence linkage, source access, source download/cache/ingestion/conversion, normal-mode exposure, production/public claims, public interfaces, package/tooling changes, renderer replacement, architecture changes, or claim promotion without later Batu approval and an updated current brief or explicit pre-authorized queue.

Owner boundary: Batu owns whether the QA-only frontage/bay candidate layer is useful enough, whether later evidence/business linkage planning may open, whether any claim class may promote, and whether any source/evidence access may open. Codex owns tactical implementation inside the 4J packet only.

## Completed Batches

### Batch 4J-1: Frontage Candidate Contract + Fixture

Status: complete and verified.

What changed:

- Added `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4j-1-qa-frontage-candidates.v0.1.json`.
- Added `scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`.
- Added `docs/reports/phase-4j-1-frontage-candidate-contract-fixture.md`.
- Created 22 QA-only candidate records mapped to 10 existing 4O building anchors.
- Preserved normal mode with zero records and no claim promotion.

### Batch 4J-2: QA Runtime Frontage Candidate Overlay

Status: complete and verified.

What changed:

- Updated `src/Phase4BRuntimePreview.jsx`.
- Updated `src/styles.css`.
- Added `scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`.
- Added `docs/reports/phase-4j-2-qa-frontage-runtime-overlay.md`.
- Rendered generic 4J frontage/bay candidate guides behind QA mode only.
- Added candidate-type filters and readouts for candidate type, linked 4O anchor, QA-only status, and blocked claims.
- Preserved normal mode with zero records and no claim promotion.

## Current Batch

### Batch 4J-3: Candidate Gap + Readiness Report

Goal:

- Assess whether the QA-only frontage/bay candidate layer is useful enough for later evidence/business linkage planning.

Allowed scope:

- Add a concise 4J-3 readiness report covering candidate coverage, visible usefulness, normal-mode isolation, blocked fields, missing evidence, and what remains unsafe to promote.
- Classify gaps only with the approved bounded categories:
  - `missing_facade_photo_evidence`
  - `missing_frontage_segmentation_evidence`
  - `missing_entrance_evidence`
  - `missing_sign_band_evidence`
  - `missing_corner_wrap_evidence`
  - `missing_depth_or_setback_evidence`
  - `missing_business_source_linkage`
  - `insufficient_spatial_confidence`
- Recommend any next phase only as a proposal.
- Do not start evidence linkage.
- Add verifier coverage as needed proving 4J-3 is review/report only, no normal-mode promotion occurred, and no forbidden factual claims were introduced.
- Reconcile `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/phase-4-execution-roadmap.md`, and `docs/MVP_EXECUTION_LEDGER.md`.
- Run the full relevant verifier chain, `npm run build`, `git diff --check`, and final `git status --short`.
- Commit 4J-3 and stop at the Batu review gate.

## Preserved Boundaries

- 4J does not infer businesses, tenants, exact storefronts, exact frontage, facades, signs, entrances, exact addresses, exact heights, or roof forms.
- 4J does not add source access, downloads, cache, ingestion, conversion, or source-backed claims.
- 4J uses existing 4O scaffold anchors only.
- 4J records are QA-only, review-only, non-promoted, and blocked from normal mode.
- 4J does not add production/public claims, public UI, new dependencies, package tooling, renderer replacement, or architecture changes.

## Verification Required

For 4J-3:

- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- 4J-3 verifier.
- Relevant prior 4O/4I runtime and scaffold verifiers.
- `npm run build`
- `git diff --check`
- Final `git status --short`

## Unresolved Decisions For Batu

- Whether the QA-only frontage/bay candidate layer is spatially useful enough for later planning.
- Whether later evidence/business linkage planning may open.
- What evidence is required before any frontage, storefront, facade, sign, entrance, address, business, active-status, exact height, roof, production, or public claim can promote.
