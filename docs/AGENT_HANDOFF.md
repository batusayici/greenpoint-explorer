# Greenpoint Explorer Agent Handoff

## Current Mode
Auto-advance active for local Phase 2 implementation batches.

Codex should continue across batches without Batu review when the next task is a narrow continuation of the already-approved Phase 2 direction and all verification passes. Codex should stop only for hard-stop conditions.

## Current Goal
Continue Phase 2 data-driven scene work without requiring Batu unless a gated decision is reached.

## Current Approved Direction
- Source-of-truth is repo docs and committed state.
- Do not return to docs-only busywork unless implementation is blocked.
- Keep work data-driven and evidence-aware.
- Do not invent exact storefront/frontage/address-placement claims without source support.
- Prefer small, committable batches.
- Preserve build/test hygiene.

## Overnight Task Queue
1. Read AGENTS.md, docs/PLAN.md, docs/CURRENT_EXECUTION_BRIEF.md, docs/MVP_EXECUTION_LEDGER.md, and latest git log.
2. Identify the next unblocked Phase 2 implementation task.
3. Execute only one bounded batch at a time.
4. Run verification.
5. Commit if verification passes.
6. Append a concise batch report to this file.
7. Continue to the next unblocked batch.
8. Continue across auto-advance-eligible batches. Stop only if a hard-stop condition is reached.

## Auto-Advance Rule
When Batu has authorized an overnight or multi-batch run, Codex may continue from one completed batch to the next without waiting for Batu if all of the following are true:

1. The previous batch completed cleanly.
2. Verification passed.
3. The repo is clean after commit.
4. The next batch is a narrow continuation of the already-approved Phase 2 direction.
5. The next batch does not require visual judgment, external source judgment, vendor/API choice, destructive refactor, or MVP scope change.
6. The next batch can be expressed as a small implementation or verification improvement.

In auto-advance mode, do not set `CURRENT_EXECUTION_BRIEF.md` to a human review hold after every batch. Instead, append a handoff report and open the next auto-advance-eligible batch.

Stop only when a hard stop condition is reached.

## Overnight Review-Hold Rule
If the repo is in a review hold but auto-advance mode is active, the previous committed batch completed cleanly, and the next step is a narrow continuation of the already-approved Phase 2 direction, Codex may open the next implementation brief itself. Codex should not treat historical batch-report review language as a blocker unless the latest current-mode section or current execution brief names a hard-stop condition.

## Control Doc Rule During Auto-Advance
During auto-advance mode, do not end `docs/CURRENT_EXECUTION_BRIEF.md` in a human review hold after each successful batch.

Instead, set it to:
- latest completed batch
- auto-advance active
- next candidate batch
- hard-stop conditions

## Hard Stop Conditions
Stop and write NEEDS_BATU if:
- Visual direction requires taste judgment.
- A real-world factual claim lacks evidence.
- The next step requires buying/API access/partner outreach.
- A large architectural pivot is needed.
- Build/test failures cannot be resolved locally.
- The task would delete or rewrite meaningful prior work.
- You are unsure whether the result still matches Greenpoint Explorer’s MVP intent.

## Required Batch Report Format

During auto-advance mode, do not write `Remaining` as “Batu must accept, revise, or reject...” unless a true hard-stop condition exists. For completed auto-advance batches, `Remaining` should say that auto-advance may continue if the next batch remains narrow, verified, and within the approved Phase 2 direction.

### Batch YYYY-MM-DD HH:MM
Status: complete | blocked | needs_batu
Commit: <hash or none>
Files changed:
- ...
Verification:
- ...
What changed:
- ...
Remaining:
- ...
Next recommended batch:
- ...

### Batch 2026-06-02 21:47
Status: complete
Commit: 286f31d
Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 1 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5`
- Grillpoint Phase 2N missing-evidence report contract check.
- Grillpoint-only category promotion check.
- Expanded drift guard with all three raw inputs, five expected evidence IDs, Phase 2H runtime fixture, and Phase 2D reviewed reference.
- False-promotion expected-fail check changing one generated record to `product_copy_ready`; it failed as intended because facade and geometry gates remained blocked.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted Phase 2M for continuation and opened/completed Phase 2N Single-Place Evidence Promotion Spike for Grillpoint.
- Added an explicit Grillpoint category-context raw claim and promoted only Grillpoint's category/business-type gate to `allowed`.
- Added a machine-readable Grillpoint missing-evidence contract for storefront/facade and entrance/frontage/geometry raw inputs.
- Preserved Phase 2D reviewed parity behavior through additive claim-mapping parity and did not change visual rendering.
Remaining:
- Auto-advance may continue only if the next batch remains narrow, verified, source-evidence focused, and within the approved Phase 2 direction.
- Product-copy readiness, production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, source-authority decisions, and broad coverage remain blocked.
Next recommended batch:
- A bounded follow-up for approved facade/reference raw-input provenance, app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, or a deliberately scoped source-evidence merge/review workflow.

### Batch 2026-06-02 22:03
Status: complete
Commit: pending
Files changed:
- `docs/AGENT_HANDOFF.md`
- Removed accidental duplicate `docs/approved-reference-corpus/AGENT_HANDOFF.md`
Verification:
- Read `AGENTS.md`, `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/AGENT_HANDOFF.md`, latest git log, and current git status.
- Inspected `docs/approved-reference-corpus/AGENT_HANDOFF.md`.
- Searched tracked repo docs/source for references to `docs/approved-reference-corpus/AGENT_HANDOFF.md`; none were found.
- `git diff --check`
What changed:
- Preserved Batu/user-side auto-advance rewrite in the real `docs/AGENT_HANDOFF.md`.
- Removed the misplaced approved-reference-corpus handoff duplicate.
- Added this cleanup report.
Remaining:
- Repo cleanup is complete; auto-advance may start only after the repo is clean and the next batch remains narrow, verified, and within the approved Phase 2 direction.
Next recommended batch:
- Start auto-advance mode from the current committed Phase 2N state, respecting the hard-stop conditions in `docs/AGENT_HANDOFF.md`.
