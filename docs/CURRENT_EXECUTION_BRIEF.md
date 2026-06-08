# Current Execution Brief - Phase 4K-2 Open

Status: `Batch 4K-1 -> 4K-3: QA-Only Recognizable Corridor Anchor Proof` is open. Batu approved this bounded packet on 2026-06-08 after the completed 4J-3 Batu review gate.

Completed precondition:

- 4J-3 is complete and committed at `cbbaea7`.
- 4J-1 is complete and verified.
- 4J-2 is complete and verified.
- 4J-3 is complete and verified.
- 4O provides 26 QA-only spatial scaffold records.
- 4J provides 22 QA-only frontage/bay candidates mapped to 10 existing 4O anchors.
- `git status --short` was clean before opening 4K.

4K-1 is complete and verified.

Current executable batch: `Batch 4K-2: QA Runtime Recognizable Anchor Overlay`.

Completed batch: `Batch 4K-1: Recognizable Anchor Cue Contract + Fixture`.

Pre-authorized queue: `Batch 4K-3: Local Recognizability Review Pack`.

Self-advance allowed: yes, from 4K-2 to 4K-3 only if 4K-2 completes cleanly, verification passes, docs are reconciled, and no hard stop condition intervenes.

Hard Batu gate: stop after 4K-3. Do not start 4L, 4P, evidence intake, business/source linkage, source access, source download/cache/ingestion/conversion, normal-mode exposure, production/public claims, public interfaces, package/tooling changes, renderer replacement, architecture changes, or claim promotion without later Batu approval and an updated current brief or explicit pre-authorized queue.

Owner boundary: Batu owns whether the QA-only recognizable corridor anchor proof is useful enough, whether later evidence-backed facade cue intake or geometry/evidence planning may open, and whether any claim class may promote. Codex owns tactical implementation inside the approved 4K packet only.

## Active Batch

### Batch 4K-2: QA Runtime Recognizable Anchor Overlay

Goal:

- Render recognizable anchor cues in QA mode only, layered over the existing 4O/4J scaffold/frontage guides.

Allowed scope:

- Add QA-only runtime overlay/readouts for 4K cue records.
- Make endpoint/corner cues and corridor identity easier to inspect with generic material/color-family bands, facade rhythm marks, corner emphasis markers, sidewalk/street/subway/street-furniture cue markers where supported by existing data, and blocked-claim readouts.
- Add lightweight filters/readouts by cue category.
- Preserve normal mode behavior.
- Add verifier coverage proving 4K overlay is QA-only, filters/readouts use only allowed cue categories, no cue appears in normal mode, and no business/factual claim fields are promoted.
- Add a concise 4K-2 report.
- Reconcile execution docs, run relevant verification, and commit 4K-2.

Blocked:

- No new external source access, source download/cache/ingestion/conversion, evidence intake, image analysis, image paths, source paths, business/source linkage, business/tenant/storefront inference, exact frontage, exact facade, exact sign, entrance, exact address, exact height, roof, production/public claim, normal-mode exposure, public interface, new dependency, package/tooling change, renderer replacement, or architecture change.

## Completed Batch

### Batch 4K-1: Recognizable Anchor Cue Contract + Fixture

What changed:

- Added `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4k-1-qa-recognizable-anchor-cues.v0.1.json`.
- Added `scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`.
- Added `docs/reports/phase-4k-1-recognizable-anchor-cue-contract-fixture.md`.
- Created 18 QA-only cue records mapped to existing 4O/4J lineage, with existing 4E cue ID references where available.
- Preserved normal mode with zero records and no claim promotion.

## Preserved Boundaries

- 4K does not infer businesses, tenants, exact storefronts, exact frontage, exact facades, signs, entrances, exact addresses, exact heights, or roof forms.
- 4K does not add source access, downloads, cache, ingestion, conversion, imagery access, source-backed claims, or new evidence intake.
- 4K uses existing repo assets/data/evidence only.
- 4K records are QA-only, review-only, non-promoted, and blocked from normal mode.
- 4K does not add production/public claims, public UI, new dependencies, package tooling, renderer replacement, or architecture changes.

## Verification Completed

- `git status --short` before 4K: clean.
- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `git diff --check`

## Unresolved Decisions For Batu

- Whether the QA-only recognizable anchor layer makes the corridor more locally recognizable than 4J alone.
- Whether later evidence-backed facade cue intake or source-backed geometry/evidence planning may open.
- What evidence is required before any frontage, storefront, facade, sign, entrance, address, business, active-status, exact height, roof, production, or public claim can promote.
