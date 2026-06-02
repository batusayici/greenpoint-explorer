# Greenpoint Explorer Agent Handoff

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
8. Stop if approval, source judgment, visual judgment, partnership decision, destructive change, or scope expansion is required.

## Overnight Review-Hold Rule
If the repo is in a review hold but the previous committed batch completed cleanly and the next step is a narrow continuation of the already-approved Phase 2 direction, Codex may open the next implementation brief itself.

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

### Batch 2026-06-01 20:31
Status: needs_batu
Commit: none
Files changed:
- `docs/AGENT_HANDOFF.md`
Verification:
- Read `AGENTS.md`, `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/AGENT_HANDOFF.md`, latest git log, and current git status.
- Confirmed latest commit is `633d0ed feat: add source evidence drift guard`.
- Confirmed current git status before this handoff note had `docs/AGENT_HANDOFF.md` untracked.
What changed:
- NEEDS_BATU: No implementation batch was started because `docs/CURRENT_EXECUTION_BRIEF.md` is a Phase 2I review hold and does not open a next Phase 2 implementation task.
Remaining:
- Batu must accept, revise, or reject the Phase 2I source-evidence drift guard before another bounded Phase 2 implementation batch can proceed.
- Current brief blocks package scripts, CI, expanded ingestion/parity coverage, scraping/API calls, raster/visual changes, production data, production assets, full MVP-29G screenshot QA, and broader Greenpoint coverage.
Next recommended batch:
- After Batu accepts or revises Phase 2I, open a new bounded brief for one specific Phase 2 task, such as generated fixture metadata refinement, package-script/CI discussion, generated-output inspection artifacts, raw-input expansion, fixture regression checks, or a deliberately scoped source-evidence merge/review workflow.

### Batch 2026-06-02 20:41
Status: complete
Commit: pending in git history for this batch
Files changed:
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`
Verification:
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output /tmp/source-evidence.coverage.phase-2j.verify.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3`
- Phase 2I drift guard against the Phase 2H runtime fixture and Phase 2D reviewed reference.
- Expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, which still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`
What changed:
- Accepted the Phase 2I review hold for continuation and opened/completed Phase 2J Source Evidence Coverage Inspector.
- Added a local review-only inspector that joins the current scene manifest with the Phase 2H generated runtime source-evidence fixture.
- Generated a deterministic coverage report showing 2 of 5 current targets with linked generated evidence and 3 manifest-source-only targets remaining as raw-input expansion candidates.
- Preserved the Phase 2D reviewed parity fixture and Phase 2H generated runtime fixture unchanged.
Remaining:
- Batu must accept, revise, or reject the Phase 2J coverage inspector and report.
- Production schemas/APIs, package scripts/CI, scraping/API calls, raster or visual work, exact storefront/frontage/address/station geometry claims, and broad coverage remain blocked.
Next recommended batch:
- If Phase 2J is accepted, open one bounded local raw-input expansion for a single manifest-source-only target, with parity and coverage updated afterward.
