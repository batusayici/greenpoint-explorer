# Docs Index And Authority Map

Status: Active docs authority guide
Date: 2026-06-05

## Purpose

Use this short index to avoid treating historical, review-only, or research files as current execution authority.

Current execution path:

```text
AGENTS.md
-> docs/CURRENT_EXECUTION_BRIEF.md
-> docs/PLAN.md
-> docs/phase-4-execution-roadmap.md
-> Phase 4A/4B supporting docs only as needed
```

If files conflict, use the source-of-truth order in `AGENTS.md`. Historical, review-only, archived, and research docs do not authorize current tasks.

## Read First

- `AGENTS.md`: repo operating contract and authority order.
- `docs/CURRENT_EXECUTION_BRIEF.md`: only next-task authority for Codex.
- `docs/PLAN.md`: roadmap authority.
- `docs/MVP_EXECUTION_LEDGER.md`: execution history and reconciliation ledger.
- `docs/DOCS_INDEX.md`: docs routing and stale-authority guardrail.

## Active Authority

- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/MVP_SCOPE.md`
- `docs/DECISION_LOG.md` for durable decisions, with older entries treated as historical unless current docs reaffirm them.
- `docs/AGENTIC_TOOLING.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/VISUAL_QA_CHECKLIST.md`

## Current Phase 4 Support

- `docs/phase-4-execution-roadmap.md`: primary Phase 4 operational roadmap.
- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/phase-3-closeout.md`
- Phase 3 corridor evidence docs may inform Phase 4 context, but they do not authorize new implementation.

## Stable Reference

- `docs/ARCHITECTURE.md`
- `docs/DATA_SOURCES.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/PLACE_SCHEMA.md`
- `docs/PROVENANCE_AND_QA.md`
- `docs/SCENE_MANIFEST_SCHEMA.md`
- `docs/DATA_FEASIBILITY.md`
- `docs/approved-reference-corpus/`
- `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`
- `docs/visual-artifacts/phase-6-review-prototype-translation-plan/`

These files are subordinate to active authority and do not open implementation, production assets, source integrations, public interfaces, or scope changes by themselves.

## Research / Reference

- `docs/research/`

Research can inform strategy and critique. It must not override MVP scope, source policy, architecture gates, production-readiness gates, or the current execution brief.

## Review-Only Evidence

- `docs/mvp-review/`
- `docs/review-screenshots/`
- `docs/phase3-reference-images/`
- `docs/phase-3-real-corridor-evidence-inventory.md`
- `docs/phase-3-brouwerij-source-retrieval-spike.md`
- `docs/phase-3-brouwerij-foursquare-credential-blocker.md`
- `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`

Review evidence preserves what happened or what was evaluated. It does not define current scope unless the current brief explicitly promotes it.

## Historical / Archive

- `docs/archive/`
- `docs/TASKS.md`
- `docs/AGENT_HANDOFF.md`
- `docs/PHASE_2_PLAN.md`
- `docs/PHASE_2_BACKLOG.md`
- `docs/PHASE_3_SCALE_TEST_PLAN.md`
- `docs/phase-3-architecture-scaling-decision-surface.md`

These files are useful history or background only. Do not use them to select the current task, approve implementation, expand scope, or move gates.

## Superseded / Unsafe Stale Authority Neutralized

The following files previously carried wording that could be mistaken for current task or phase authority and have been neutralized with current-source pointers:

- `docs/AGENT_HANDOFF.md`
- `docs/PHASE_2_PLAN.md`
- `docs/PHASE_2_BACKLOG.md`
- `docs/PHASE_3_SCALE_TEST_PLAN.md`
- `docs/ART_DIRECTION.md`

Recommended future cleanup, not performed in this batch: move older Phase 2/3 plans into `docs/archive/`, consolidate duplicate historical planning notes, and prune accidental duplicate review artifacts only after Batu approves the move/delete plan.
