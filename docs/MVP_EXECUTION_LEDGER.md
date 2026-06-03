# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-06-03

## Purpose

This ledger records MVP execution batches and keeps `docs/PLAN.md` and `docs/CURRENT_EXECUTION_BRIEF.md` from drifting.

It is not a roadmap and does not authorize work by itself:

- `docs/PLAN.md` defines current phase and remaining MVP phases.
- `docs/CURRENT_EXECUTION_BRIEF.md` defines the next executable or proposed Codex task.
- This ledger records what happened, what changed, what was verified, and what pointer should be used next.

## Mandatory Reconciliation Rule

After every successful Codex batch, Codex must update all three documents before final response:

- `docs/PLAN.md`: update current phase, phase status, blockers, pending decisions, and next-task pointer only. Do not turn it into batch history.
- `docs/CURRENT_EXECUTION_BRIEF.md`: replace the completed task with the next approved/proposed executable task, or explicitly mark that the next task is pending Batu/ChatGPT approval.
- `docs/MVP_EXECUTION_LEDGER.md`: append one new entry with outcome, files changed, verification, unresolved decisions, and next pointer.

If these documents cannot be reconciled, Codex must stop and report the conflict instead of leaving stale instructions.

## Ledger Entry Template

Use this structure for future entries:

```markdown
### YYYY-MM-DD - Short Task Name

Status:
- Complete / Partial / Blocked / Proposed

Scope:
- Brief summary of authorized scope.

Files changed:
- `path`

Verification:
- Command or review performed.

Outcome:
- What changed and what did not change.

Unresolved decisions:
- Decision owner and pending decision.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to ...
```

## Current Control State

- Current phase: Phase 2DTR - Data-to-Raster MVP Proof is the active Phase 2 sub-track. MVP-29E remains the current manually composed four-corner raster baseline/reference.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next state: `docs/CURRENT_EXECUTION_BRIEF.md` records the Phase 2DTR scope/plan realignment and points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice. Future batches should build visible MVP proof first and preserve gates as constraints. Product-copy readiness, promotion weakening, exact geometry claims, raster asset edits, normal-mode code-native primary world art, broader app refactor, scraping, external app-code API calls, package/tooling changes, package-script/CI additions, source-vendor decisions, full MVP-29G screenshot QA, and MVP-30 QA/demo freeze remain blocked unless a later brief explicitly opens them.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

### 2026-06-03 - Plan Scope Summary Tightening

Status:
- Complete.

Scope:
- Docs-only pass requested by Batu to simplify `docs/PLAN.md`, remove duplicated MVP scope detail from the roadmap, and reduce the plan's length before implementation.

Files changed:
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- Lightweight Markdown link check
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/PLAN.md` now keeps a short MVP scope pointer instead of repeating detailed MVP boundaries already owned by `docs/MVP_SCOPE.md`.
- The old detailed phase table was replaced with a compact roadmap summary and focused Phase 2DTR outcome plan.
- Phase 2DTR-1 remains the next executable task, Phase 3 remains future Neighborhood Scale Validation, and production/public-readiness gates remain unchanged.

Unresolved decisions:
- Batu still owns acceptance of this simplified roadmap and any later scope, phase, visual, production, or public-readiness changes.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Pre-Implementation Docs Cleanup

Status:
- Complete.

Scope:
- Docs-only cleanup requested by Batu after reviewing whether the project docs were clean enough before implementation.
- Simplify active control docs, retire stale auto-advance language, fix stale visual-reference pointers, and archive old ledger history without changing source/app behavior.

Files changed:
- `docs/AGENT_HANDOFF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PHASE_2_PLAN.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/approved-reference-corpus/ASSET_CORPUS_SCAN.md`
- `docs/DECISION_LOG.md`
- `docs/ARCHITECTURE.md`
- `docs/SCENE_MANIFEST_SCHEMA.md`
- `docs/DATA_SOURCES.md`
- `docs/PROVENANCE_AND_QA.md`

Verification:
- `git diff --check`
- Lightweight Markdown link check
- `git status --short`
- `git diff --stat`

Outcome:
- Active planning authority remains concentrated in `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and the slim active ledger.
- `docs/AGENT_HANDOFF.md` is now a historical stub and no longer authorizes auto-advance.
- Older ledger entries are preserved in `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md` so the active ledger stays readable before Phase 2DTR-1 implementation.
- Stale Phase 2AD-style/overlay-polish and pre-DTR current-gate language was replaced with Phase 2DTR orientation.
- No app source, data fixtures, assets, screenshots, package files, package tooling, scripts, public interfaces, production gates, or Phase 2DTR scope were changed.

Unresolved decisions:
- Batu still owns any later deletion of historical docs, production/public-readiness gates, public interfaces, architecture boundaries, visual direction, and Phase 2DTR acceptance.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Phase 2 Plan Authority Simplification

Status:
- Complete.

Scope:
- Docs-only simplification requested by Batu to reduce future planning confusion.
- Convert `docs/PHASE_2_PLAN.md` from an active plan into a historical stub and make `docs/PLAN.md` the single active roadmap.

Files changed:
- `docs/PHASE_2_PLAN.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/PHASE_2_PLAN.md` is now retained only to avoid dangling references.
- `docs/PLAN.md` remains the active roadmap, phase-control document, and next-task pointer source.
- `docs/CURRENT_EXECUTION_BRIEF.md` remains the active task handoff and still points to Phase 2DTR-1.
- `docs/MVP_SCOPE.md` remains the durable MVP scope authority.
- `docs/MVP_EXECUTION_LEDGER.md` remains the batch-history and reconciliation record.
- No app source, data fixtures, assets, screenshots, package files, package tooling, scripts, public interfaces, production gates, or Phase 2DTR scope were changed.

Unresolved decisions:
- Batu still owns acceptance of this simplified doc model and any later archival/deletion decisions for obsolete docs.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

### 2026-06-03 - Phase 2DTR Scope / Plan Realignment

Status:
- Complete.

Scope:
- Docs-only planning/scope update to realign the MVP around a focused data-to-raster proof track inside Phase 2.
- No app source, data fixtures, assets, screenshots, package files, or scripts were edited.

Files changed:
- `docs/MVP_SCOPE.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/PHASE_2_PLAN.md`

Verification:
- `git diff --check`
- Lightweight docs validation search: no dedicated docs validator was present.
- `git status --short`

Outcome:
- Created Phase 2DTR - Data-to-Raster MVP Proof as the focused Phase 2 sub-track.
- Recorded the MVP proof path as source inputs to structured scene/facade/geometry fields to deterministic generated raster/spec artifact to review-only isometric scene output to QA/status comparison.
- Summarized Phase 2A through Phase 2AC as completed exploratory/source/QA groundwork.
- Confirmed MVP-29E remains the current manually composed raster baseline/reference, not the final proof of the pipeline.
- Recorded Batu-supplied reference photos as approved for MVP-only review/source facade imagery and facade-field extraction.
- Preserved strict promotion/public-readiness gates, no scraping/live API calls, no Google/Street View/3D Tiles extraction, no production asset approval, and no production schema/interface approval.
- Confirmed Phase 3 remains reserved for Neighborhood Scale Validation.

Unresolved decisions:
- Batu still owns visual acceptance, product/public readiness, exact facade/frontage/address/station claims, production source policy, production assets, architecture/public-interface approval, and whether later Phase 2DTR outputs are accepted or revised.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.

## Archived History

Older entries before 2026-06-03 are preserved at `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`. Use that archive for batch archaeology only; current execution authority remains the source-of-truth order in `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and this active ledger.
