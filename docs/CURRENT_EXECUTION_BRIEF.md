# Current Execution Brief

Status: Proposed next MVP task, pending Batu/ChatGPT approval
Date: 2026-05-29
Recommended task: MVP-02 Place Truth Packet

This file is the single next-task pointer for Codex. Because this brief is marked proposed, Codex should not execute it until Batu or ChatGPT explicitly approves it as the active task.

## Recommended Task

MVP-02 Place Truth Packet.

## Goal

Create a docs-only place-truth packet for the MVP scene. The packet should identify candidate real places, source evidence, spatial coherence risks, copy constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.

This is not app/source implementation, production data work, real-place-card implementation, live data, scraping, backend/CMS/persistence/analytics/deployment work, public-interface approval, architecture approval, production asset work, or broad map coverage.

## Context

MVP-01 reviewed the current repository evidence and concluded that a review-only fictional-target prototype exists, but the biggest remaining MVP blocker is the truth-safe transition from fictional placeholders to 4-6 source-backed real named places.

MVP-01 review packet:

- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`

## Allowed Files To Change

- `docs/mvp-review/` for the new MVP-02 place-truth packet
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/TASKS.md`, only if needed to prevent stale contradiction

## Files Off-Limits

Do not modify:

- `src/`
- `package.json`, lockfiles, build/config/CI files
- generated images
- review screenshots
- `docs/approved-reference-corpus/`
- original visual artifact proof images
- `docs/archive/`

Do not stage or commit.

## Required Review Questions

Answer from existing docs and source-policy evidence:

- Which real-place candidates are in scope for review?
- Which candidates appear spatially coherent for a compact Manhattan Ave / Greenpoint Ave scene?
- Which candidates need manual verification before MVP use?
- Which candidates should be deferred, omitted, fictionalized, or treated symbolically?
- What minimum static fields are needed for each approved place?
- What copy and disclaimer constraints must carry into the later static data contract?
- What decisions remain reserved for Batu?

## Public Interfaces And Module Boundaries

No public interfaces or module boundaries may change.

Do not create an implementation data contract in this batch. If field recommendations are useful, keep them conceptual and mark them as pending MVP-03 Static MVP Data Contract approval.

## Verification Requirements

Before final response, run:

- `git diff --check`
- `git diff --stat`
- `git status --short`

Confirm:

- only allowed docs were changed
- `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and `docs/MVP_EXECUTION_LEDGER.md` remain reconciled
- no app/source/assets were modified
- no visual artifacts were generated
- no staging or commit occurred

## Acceptance Criteria

The batch is complete only if:

- Candidate real places and spatial risks are explicit.
- Approved/deferred/omitted/fictionalized recommendations are clearly labeled as recommendations, not final Batu decisions.
- Source/copy/disclaimer constraints are ready for Batu/ChatGPT review.
- The next recommended task after the packet is explicit.
- The plan, current brief, and execution ledger are reconciled.

## Final Response Required

Report:

- files changed
- verification performed
- confirmation that no app/source/assets or visual artifacts were changed
- `git diff --stat`
- `git status --short`
- no commit
- no staging
