# Current Execution Brief - Phase 4K Complete At Review Gate

Status: `Batch 4K-1 -> 4K-3: QA-Only Recognizable Corridor Anchor Proof` is complete and verified. Batu approved this bounded packet on 2026-06-08 after the completed 4J-3 Batu review gate.

Completed precondition:

- 4J-3 is complete and committed at `cbbaea7`.
- 4J-1 is complete and verified.
- 4J-2 is complete and verified.
- 4J-3 is complete and verified.
- 4O provides 26 QA-only spatial scaffold records.
- 4J provides 22 QA-only frontage/bay candidates mapped to 10 existing 4O anchors.
- `git status --short` was clean before opening 4K.

4K-1 is complete and verified.

4K-2 is complete and verified.

4K-3 is complete and verified.

Current executable batch: none.

Completed batch: `Batch 4K-3: Local Recognizability Review Pack`.

Pre-authorized queue: none.

Self-advance allowed: no.

Hard Batu gate: stop. Do not start 4L, 4P, evidence intake, business/source linkage, source access, source download/cache/ingestion/conversion, normal-mode exposure, production/public claims, public interfaces, package/tooling changes, renderer replacement, architecture changes, or claim promotion without later Batu approval and an updated current brief or explicit pre-authorized queue.

Owner boundary: Batu owns whether the QA-only recognizable corridor anchor proof is useful enough, whether later evidence-backed facade cue intake or source-backed geometry/evidence planning may open, and whether any claim class may promote. Codex owns tactical implementation inside the completed 4K packet only.

## Completed Packet

### Batch 4K-1: Recognizable Anchor Cue Contract + Fixture

What changed:

- Added `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json`.
- Added `scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`.
- Added `docs/reports/phase-4k-1-recognizable-anchor-cue-contract-fixture.md`.
- Created 18 QA-only cue records mapped to existing 4O/4J lineage, with existing 4E cue ID references where available.
- Preserved normal mode with zero records and no claim promotion.

### Batch 4K-2: QA Runtime Recognizable Anchor Overlay

What changed:

- Updated `src/Phase4BRuntimePreview.jsx`.
- Updated `src/styles.css`.
- Added `scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs`.
- Added `docs/reports/phase-4k-2-qa-recognizable-anchor-runtime-overlay.md`.
- Rendered 18 QA-only cue records as generic 4K guide overlays with cue category filters/readouts.
- Preserved normal mode with zero records and no claim promotion.

### Batch 4K-3: Local Recognizability Review Pack

What changed:

- Added `docs/reports/phase-4k-3-local-recognizability-review-pack.md`.
- Added `scripts/verify-phase-4k-3-local-recognizability-review-pack.mjs`.
- Assessed whether the QA-only cue layer makes the corridor more recognizable than after 4J.
- Classified remaining recognizability gaps only with approved bounded 4K categories.
- Recommended any next phase only as a proposal.
- Stopped at Batu review.

## Preserved Boundaries

- 4K does not infer businesses, tenants, exact storefronts, exact frontage, exact facades, signs, entrances, exact addresses, exact heights, or roof forms.
- 4K does not add source access, downloads, cache, ingestion, conversion, imagery access, source-backed claims, or new evidence intake.
- 4K uses existing repo assets/data/evidence only.
- 4K records are QA-only, review-only, non-promoted, and blocked from normal mode.
- 4K does not add production/public claims, public UI, new dependencies, package tooling, renderer replacement, or architecture changes.
- 4K-3 did not start evidence-backed facade cue intake, source-backed geometry/evidence planning, business/source linkage, 4L, 4P, normal-mode promotion, or claim promotion.

## Verification Completed

- `git status --short` before 4K: clean.
- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4k-2-qa-recognizable-anchor-runtime-overlay.mjs`
- `node scripts/verify-phase-4k-3-local-recognizability-review-pack.mjs`
- `node scripts/verify-phase-4j-3-candidate-readiness-report.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-20-spatial-usefulness-review-pack.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4i-qa-runtime-legibility.mjs`
- `npm run build`
- `git diff --check`
- Final `git status --short`

## Unresolved Decisions For Batu

- Whether the QA-only recognizable anchor layer makes the corridor locally recognizable enough for later planning.
- Whether later evidence-backed facade cue intake or source-backed geometry/evidence planning may open.
- What evidence is required before any frontage, storefront, facade, sign, entrance, address, business, active-status, exact height, roof, production, or public claim can promote.
