# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-05-29

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

- Current phase: Static MVP Data Contract pending approval.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next recommended task: MVP-03 Static MVP Data Contract, pending Batu/ChatGPT approval.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

### 2026-05-29 - MVP Execution-Control Reconciliation

Status:
- Complete.

Scope:
- Update `docs/PLAN.md` into a stable roadmap through MVP completion and testing.
- Create this MVP execution ledger.
- Replace the stale Phase 6.1 implementation brief with the next recommended MVP task.
- Add mandatory plan/brief/ledger reconciliation rules to `AGENTS.md`.
- Avoid app/source/asset changes, visual artifact generation, staging, and commits.

Files changed:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Documentation search for stale Phase 6.1 active-task pointers.
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/PLAN.md` is now phase-oriented rather than batch-history-oriented.
- `docs/MVP_EXECUTION_LEDGER.md` now records batch outcomes and reconciliation rules.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to a proposed MVP-01 docs-only prototype state review and gap brief instead of stale Phase 6.1 implementation.
- `AGENTS.md` now requires plan/brief/ledger reconciliation after every successful Codex batch.
- `docs/TASKS.md` is converted to legacy orientation so it does not contradict the current brief.

Unresolved decisions:
- Batu/ChatGPT must approve or revise the proposed MVP-01 task before Codex executes it.
- Batu/ChatGPT must review existing Phase 6.1/Phase 6.2 prototype evidence before it can unlock broader MVP implementation.
- Real-place cards, production assets, architecture/public interfaces, and production pipeline remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - MVP Scope And Roadmap Role Reconciliation

Status:
- Complete.

Scope:
- Make `docs/MVP_SCOPE.md` the detailed MVP scope authority.
- Reduce `docs/PLAN.md` scope content to a concise summary and pointer.
- Tighten remaining MVP phase sequencing while preserving the pre-MVP review gate and proposed MVP-01 next task.
- Keep the cleanup docs-only with no app/source/asset edits, visual generation, staging, or commit.

Files changed:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/PLAN.md` now points to `docs/MVP_SCOPE.md` for detailed scope and focuses on roadmap, phase order, gates, blockers, and current state.
- `docs/MVP_SCOPE.md` now defines included scope, non-goals, demo-safe assets/data rules, Must-Have / Should-Have / Cuttable items, and MVP acceptance boundaries.
- Remaining MVP phases are sequenced as MVP Gap Review, Place Truth Packet, Static MVP Data Contract, MVP Interaction Integration, Visual Polish / Optional Ambient, MVP QA And Demo Freeze, and MVP Completion / Post-MVP Parking.
- Demo/static assets and data are explicitly allowed only as controlled review/demo-safe material, not as production/public-release asset or pipeline approval.
- `docs/CURRENT_EXECUTION_BRIEF.md` remains reconciled and still points to proposed MVP-01.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-01 before Codex executes it.
- Batu/ChatGPT must decide which Should-Have and Cuttable scope items survive after MVP Gap Review.
- Production/public-release assets, production asset pipeline, real-place production cards, public interfaces, architecture, deployment, and broad implementation remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - Archive Phase 5.1 Review-Only App Assets

Status:
- Complete.

Scope:
- Move lingering untracked Phase 5.1 review-only asset files out of `src/assets/review-only/` and into `docs/archive/` for historical preservation.
- Add archive README constraints.
- Avoid app/source code changes, visual generation, staging, and commits.

Files moved:
- `src/assets/review-only/ASSET_MANIFEST.md` to `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/ASSET_MANIFEST.md`
- `src/assets/review-only/phase-5-1-raster-scene-plate-review-only.png` to `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/phase-5-1-raster-scene-plate-review-only.png`

Files changed:
- `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/README.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`
- `find src/assets/review-only -maxdepth 2 -type f 2>/dev/null || true`
- `find docs/archive -path '*phase-5-1-raster-scene-plate*' -maxdepth 5 -type f`

Outcome:
- The two Phase 5.1 review-only files are no longer under `src/assets/review-only/`.
- The files are preserved under `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/`.
- The archive README identifies them as historical review-only assets, not active app assets, production assets, production asset direction, or production asset pipeline approval.
- No app/source code changed.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-01 before Codex executes it.
- Any future active prototype assets still require authorization through `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` remains the current next pointer and still points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - MVP-01 Prototype State Review And Gap Brief

Status:
- Complete.

Scope:
- Review the current repository state and existing review-only prototype evidence.
- Produce a concise docs-only MVP gap brief.
- Reconcile the plan, current brief, ledger, and legacy task tracker.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Source and archived screenshot inventory review.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-01 review packet records current prototype evidence, proof limits, missing MVP requirements, blocker classification, stale pointer review, and recommended next batch.
- Current prototype evidence is treated as review-only: one Phase 6 raster, fictional targets, placeholder cards, pan/zoom, hover/click/tap selection, selected card, controls, and basic mobile containment.
- Archived Phase 6.1/6.2 screenshots are treated as review history, not active execution authority.
- Remaining MVP gap is now centered on truth-safe real-place selection, static data boundaries, and later approved MVP interaction integration.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-02 Place Truth Packet.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-02 before Codex executes it.
- Batu/ChatGPT must decide whether the current review-only prototype evidence is sufficient to proceed into place-truth review.
- Real-place representation, static data contract, public interfaces, production assets, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-02 Place Truth Packet as a proposed next task pending approval.

### 2026-05-29 - MVP-02 Place Truth Packet

Status:
- Complete.

Scope:
- Produce a docs-only place-truth packet for the compact Manhattan Ave / Greenpoint Ave MVP scene.
- Identify candidate real places, source evidence, spatial coherence risks, copy/disclaimer constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.
- Reconcile the plan, MVP scope, current brief, ledger, and legacy task tracker.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Existing repo docs and source-policy evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-02 truth packet records the candidate review set, spatial coherence read, manual-verification requirements, and recommended symbolic/defer/omit/fictionalize treatment for Greenpoint Av G station, Peter Pan, Sweetgreen, former Meserole Theater, Captured Record Shop, Polka Dot, Karczma, and Brouwerij Lane.
- Copy constraints, unofficial-map disclaimer requirements, source metadata requirements, and conceptual static field recommendations are ready for Batu/ChatGPT review.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-03 Static MVP Data Contract.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-02 candidate recommendations.
- Batu must decide which candidates receive manual verification, which are omitted or fictionalized, and whether Karczma requires westward scene expansion.
- Batu/ChatGPT must approve or revise proposed MVP-03 before Codex executes it.
- Real-place representation, static data implementation, public interfaces, production assets, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-03 Static MVP Data Contract as a proposed next task pending approval.
