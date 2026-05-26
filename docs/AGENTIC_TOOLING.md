# Agentic Tooling

Status: Active tooling policy  
Date: 2026-05-26  
Creative direction owner: Batu  
Implementation owner: Codex

## Purpose

Agentic tooling exists to support disciplined preproduction. It may help agents audit documents, frame options, maintain decision records, preserve reference discipline, and define acceptance criteria.

Agentic tooling does not approve creative direction, product behavior, public interfaces, architecture boundaries, visual language, or scope changes. Those decisions remain reserved for Batu under `AGENTS.md`.

## Active Tooling

Current approved tooling:

- `AGENTS.md` governance and source-of-truth order.
- Plan Mode for audits, strategy, and visual-test planning.
- Small docs/artifact batches.
- `docs/DECISION_LOG.md` for meaningful design and technical choices.
- This document as the detailed policy for agentic tooling.

## Allowed Preproduction Use

Agents may use approved tooling to:

- Audit current docs for drift, contradictions, and unresolved requirements.
- Frame options and tradeoffs for Batu review.
- Draft or update decision-log entries after approval.
- Maintain reference discipline and flag unsupported claims.
- Define acceptance criteria for docs-only and lo-fi artifact batches.
- Summarize what changed, what did not change, verification results, and remaining review items.

## Blocked Use

Agents must not use tooling to:

- Approve visual direction or production visual language.
- Make product decisions or public-interface decisions.
- Define final architecture boundaries without review.
- Create app scaffolding, package tooling, React, Vite, PixiJS, source folders, or build configuration before gates clear.
- Create implementation-oriented skills before implementation gates clear.
- Install a broad plugin stack or add plugins without Batu approval.
- Treat Community Pixel Storefront, Batch 8 artifacts, or any older visual territory as final direction.

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

