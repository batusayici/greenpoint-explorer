# Current Execution Brief

Status: Proposed next MVP task, pending Batu/ChatGPT approval
Date: 2026-05-29
Recommended task: MVP-04 MVP Interaction Integration

This file is the single next-task pointer for Codex. Because this brief is marked proposed, Codex should not execute it until Batu or ChatGPT explicitly approves it as the active task.

## Recommended Task

MVP-04 MVP Interaction Integration.

## Approval Needed Before Execution

Batu/ChatGPT must approve or revise:

- the MVP-03 static data contract proposal;
- the static MVP place-data implementation boundary;
- any app/source files that may be changed;
- any public interface or module-boundary details needed for the integration;
- which real, symbolic, placeholder, omitted, or deferred candidates may appear in the integration pass.

Until those approvals are recorded, this brief is proposed/pending and must not be executed.

## Goal

Integrate approved static MVP place data and final MVP interaction behavior into the review-only prototype after the data contract and implementation boundary are approved.

The future integration should demonstrate approved targets, cards, marker states, selected treatment, pan/zoom, hover/click/tap, basic mobile containment, source metadata, `lastVerified`, and unofficial-map disclaimer behavior.

This proposed task is not production data work, live data, scraping, backend/CMS/persistence/analytics/deployment work, production asset work, broad map coverage, final architecture approval, or production public-interface approval.

## Context

MVP-01 reviewed the current repository evidence and concluded that a review-only fictional-target prototype exists.

MVP-02 produced a docs-only place-truth packet identifying candidate real places, source evidence, spatial coherence risks, copy constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.

MVP-03 produced a docs-only static MVP data contract proposal that preserves source metadata, verification status, spatial uncertainty, approval state, copy/disclaimer requirements, and manual-verification flags.

Review packets:

- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`
- `docs/mvp-review/mvp-03-static-mvp-data-contract/README.md`

## Allowed Files To Change

Pending approval. Do not execute until Batu/ChatGPT approve the implementation boundary and allowed files.

Likely future categories may include:

- approved `src/` files needed for static data integration;
- approved review screenshot or QA documentation paths;
- `docs/MVP_EXECUTION_LEDGER.md`;
- `docs/CURRENT_EXECUTION_BRIEF.md`;
- `docs/PLAN.md`;
- `docs/MVP_SCOPE.md`, only if the batch clarifies detailed MVP boundaries;
- `docs/TASKS.md`, only if needed to prevent stale contradiction.

## Files Off-Limits

Do not modify unless a later active brief explicitly allows it:

- package.json, lockfiles, build/config/CI files;
- generated images;
- `docs/approved-reference-corpus/`;
- original visual artifact proof images;
- `docs/archive/`;
- production assets;
- deployment files.

Do not stage or commit unless explicitly authorized.

## Required Review Questions

Before activation, Batu/ChatGPT should answer:

- Which MVP-03 fields and status vocabularies are accepted, revised, or rejected?
- Which real candidates may be integrated as real-place cards, symbolic anchors, placeholders, omitted records, or deferred records?
- What exact static source-file path and module boundary may Codex use?
- What app/source files may change?
- What visual asset path, if any, is approved as the primary world surface?
- What review screenshots or smoke checks are required?
- What decisions remain reserved for Batu?

## Public Interfaces And Module Boundaries

Not approved yet.

No app/source public interfaces or module boundaries may change until Batu/ChatGPT approve a specific implementation boundary in an active brief.

## Verification Requirements

Pending approval. At minimum, any future active MVP-04 brief should require:

- `git diff --check`
- `git diff --stat`
- `git status --short`

It should also define the fastest useful app feedback loop and any required review screenshots if app/source work is approved.

## Acceptance Criteria

Pending approval. Future MVP-04 acceptance criteria should include:

- approved static data is integrated without live data, scraping, backend/CMS, or production data claims;
- source URLs, `lastVerified`, truth status, approval status, and disclaimer behavior remain visible where required;
- real-place uncertainty is not hidden by card copy, marker state, or visual placement;
- existing approved art direction and primary raster/reference surface constraints are preserved;
- pan/zoom, hover/click/tap, selected card, controls, and basic mobile containment remain functional;
- review evidence is captured if required by the approved implementation brief;
- the plan, scope, current brief, and execution ledger are reconciled.

## Final Response Required

If this proposed task is later approved and executed, report:

- files changed;
- verification performed;
- confirmation that no unauthorized app/source/assets or visual artifacts were changed;
- `git diff --stat`;
- `git status --short`;
- no commit unless explicitly authorized;
- no staging unless explicitly authorized.
