# Current Execution Brief

Status: Proposed next MVP task, pending Batu/ChatGPT approval
Date: 2026-05-29
Recommended task: MVP-03 Static MVP Data Contract

This file is the single next-task pointer for Codex. Because this brief is marked proposed, Codex should not execute it until Batu or ChatGPT explicitly approves it as the active task.

## Recommended Task

MVP-03 Static MVP Data Contract.

## Goal

Create a docs-only static data contract or approved source-file boundary proposal for MVP place data. The packet should translate MVP-02 truth findings into a reviewable data shape for static local MVP data, including source metadata, verification status, spatial uncertainty, approval state, copy/disclaimer requirements, and manual-verification flags.

This is not app/source implementation, production data work, live data, scraping, backend/CMS/persistence/analytics/deployment work, public-interface approval, architecture approval, production asset work, or broad map coverage.

## Context

MVP-01 reviewed the current repository evidence and concluded that a review-only fictional-target prototype exists.

MVP-02 produced a docs-only place-truth packet identifying candidate real places, source evidence, spatial coherence risks, copy constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.

Review packets:

- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`

## Allowed Files To Change

- `docs/mvp-review/` for a new MVP-03 static data contract packet
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`, only if the batch clarifies detailed MVP data boundaries
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

Answer from existing docs, source-policy evidence, `docs/PLACE_SCHEMA.md`, and the MVP-02 truth packet:

- What static place fields are required for MVP real places?
- What fields are required for symbolic anchors, placeholders, context buildings, or omitted/deferred candidates?
- How should source URLs, source labels, source notes, and `lastVerified` be represented?
- How should verification status, placement confidence, manual review, approval status, and candidate outcome labels be represented?
- How should copy and disclaimer constraints carry into place-card data?
- What should remain conceptual until Batu approves an implementation boundary?
- What decisions remain reserved for Batu?

## Public Interfaces And Module Boundaries

No app/source public interfaces or module boundaries may change.

Do not create or modify app/source data files in this batch. If an implementation boundary is proposed, keep it docs-only and explicitly mark it as pending Batu/ChatGPT approval.

## Verification Requirements

Before final response, run:

- `git diff --check`
- `git diff --stat`
- `git status --short`

Confirm:

- only allowed docs were changed
- `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/MVP_SCOPE.md`, and `docs/MVP_EXECUTION_LEDGER.md` remain reconciled
- no app/source/assets were modified
- no visual artifacts were generated
- no staging or commit occurred

## Acceptance Criteria

The batch is complete only if:

- Static MVP place fields are explicit and grounded in MVP-02.
- Truth status, source metadata, spatial uncertainty, manual review, approval state, and disclaimer requirements are explicit.
- The packet does not implement app/source data or approve public interfaces by itself.
- The next recommended task after the packet is explicit.
- The plan, scope, current brief, and execution ledger are reconciled.

## Final Response Required

Report:

- files changed
- verification performed
- confirmation that no app/source/assets or visual artifacts were changed
- `git diff --stat`
- `git status --short`
- no commit
- no staging
