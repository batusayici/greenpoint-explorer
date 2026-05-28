# Agentic Tooling

Status: Active tooling policy  
Date: 2026-05-28
Creative direction owner: Batu  
Implementation owner: Codex

## Purpose

Agentic tooling exists to support disciplined preproduction. It may help agents audit documents, frame options, maintain decision records, preserve reference discipline, and define acceptance criteria.

Agentic tooling does not approve creative direction, product behavior, public interfaces, architecture boundaries, visual language, or scope changes. Those decisions remain reserved for Batu under `AGENTS.md`.

## Active Tooling

Current approved tooling:

- `AGENTS.md` governance and source-of-truth order.
- `docs/CURRENT_EXECUTION_BRIEF.md` as the canonical source for Codex's next executable task.
- Plan Mode for audits, strategy, and visual-test planning.
- Small docs/artifact batches.
- `docs/DECISION_LOG.md` for meaningful design and technical choices.
- This document as the detailed policy for agentic tooling.

The canonical handoff loop is defined in `AGENTS.md`: Codex produces an output packet, Batu brings it to ChatGPT, ChatGPT critiques and writes/updates the current brief, and Codex executes only that brief. `docs/CURRENT_EXECUTION_BRIEF.md` should stay concise and operational; it does not replace the policy, phase-state, task-tracking, or tooling-limit docs.

## Allowed Preproduction Use

Agents may use approved tooling to:

- Audit current docs for drift, contradictions, and unresolved requirements.
- Frame options and tradeoffs when the current execution brief asks for them.
- Draft or update decision-log entries after approval.
- Maintain reference discipline and flag unsupported claims.
- Define acceptance criteria for docs-only and lo-fi artifact batches.
- Preflight visual artifact work by stating the intended artifact class, supported decision, required output format, format rationale, and whether SVG is allowed.
- Summarize what changed, what did not change, verification results, and remaining review items.

## Agentic Game-Dev Operating Model

Use game-development practices only when they fit this web-first, map-mode-only diorama prototype.

- Use Plan Mode before edits when scope is unclear, multi-file, or likely to affect visual direction, product behavior, public interfaces, architecture, or scope.
- Work in small scoped batches with explicit acceptance criteria before implementation.
- Verify directly after edits using file checks, searches, or the fastest useful feedback loop available.
- Keep source-of-truth docs synchronized; do not leave stale planning text that contradicts current project state.
- Separate creative intent, location/data truth, rendering implementation, and interaction behavior.
- Use docs-only batches when planning, review framing, visual preproduction, or governance is the goal.
- Avoid premature engineering systems, automation stacks, implementation scaffolding, and broad game-creator workflows.
- Treat reviewable artifact entry and exit criteria as batch acceptance gates, not as game intro, menu, onboarding, or polish requirements.

## Verification Review Checklist

Use this checklist before reporting an agentic docs, planning, or visual-preproduction batch complete:

- Confirm project docs remain consistent with the source-of-truth order in `AGENTS.md`.
- Confirm the approved visual direction is recorded without prematurely claiming production asset paths, implementation gates, architecture boundaries, or public interfaces.
- Confirm no out-of-scope systems were introduced into MVP scope.
- Confirm referenced visual artifacts exist before citing them as evidence.
- Confirm every visual artifact's format matches its decision stage: SVG/ASCII/markdown for diagrams and blockouts only; PNG/JPG for high-fidelity style frames, raster production proofs, final visual-direction candidates, and art-direction approval artifacts unless Batu explicitly requests SVG.
- Confirm checklist compliance is not used to pass an artifact whose format is invalid for the intended decision.
- Confirm location truth, rendering responsibilities, UI cards, and markers remain separated.
- Confirm every adopted game-dev practice has a project-specific reason for this web-first, map-mode-only diorama prototype.
- Confirm deferred or rejected practices remain parked, blocked, or clearly labeled as future-only.

## Blocked Use

Agents must not use tooling to:

- Approve visual direction or production visual language; Batu has approved the current visual direction, but tooling must not create new approvals or expand it.
- Make product decisions or public-interface decisions.
- Define final architecture boundaries without review.
- Infer or continue work from prior chat context when `docs/CURRENT_EXECUTION_BRIEF.md` exists.
- Decide the next phase or rewrite the next task outside the ChatGPT-authored brief workflow.
- Submit SVG-only output as a style frame, raster production proof, final visual-direction candidate, or art-direction approval artifact unless Batu explicitly requests SVG for that purpose.
- Create app scaffolding, package tooling, React, Vite, PixiJS, source folders, or build configuration before gates clear.
- Create implementation-oriented skills before implementation gates clear.
- Install a broad plugin stack or add plugins without Batu approval.
- Treat Community Pixel Storefront, Batch 8 artifacts, or any older visual territory as final direction or as the active next task unless reactivated in `docs/CURRENT_EXECUTION_BRIEF.md`.

## Skills And Plugins Governance

Project-specific skills or plugins require Batu approval before creation or installation.

Before proposing a skill or plugin, agents must document:

- Purpose.
- Trigger.
- Authority limits.
- Files or workflows it may touch.
- Why existing docs and Plan Mode are not enough.

Any skill or plugin must preserve Batu's creative, product, public-interface, architecture, and scope authority.

## Future Optional Skills

The following preproduction-only Codex skills are proposed candidates only. They are not created and are not approved for use.

- `visual-direction-review`: would help structure visual artifact critique without approving a direction.
- `design-decision-log`: would help draft decision-log entries after Batu approval.
- `greenpoint-reference-discipline`: would help check that local place claims, adjacency, and visual references remain source-backed.

Create one of these only if repeated work proves the policy docs are not enough.

## Deferred Tooling

The following tooling is explicitly deferred:

- `isometric-map-implementation` skill.
- `frontend-game-prototype-qa` skill.
- GitHub PR review setup.
- GitHub Actions / CircleCI.
- Render.
- Remotion.
- Superpowers.
- CodeRabbit.
- Any broad plugin stack installation.

These may be reconsidered only after the relevant project gates are cleared and Batu approves the scope.
