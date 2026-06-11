# Operating Contract v2

Status: Active
Date: 2026-06-11
Project: Greenpoint Explorer
Supersedes: the v1 multi-party batch/gate contract (archived in git history)

## Roles

- **Batu owns:** creative and product direction, look approval, scope, phase gates, publish decisions.
- **Agent owns:** implementation, asset generation, verification, plan upkeep, and proposing options with tradeoffs when a taste call is needed.

## Working Loop

Build → show (screenshots or live preview) → Batu reacts → iterate. Phases come from `docs/PLAN.md`. The agent works freely inside the current phase and asks before opening the next phase or changing scope.

## Truth Rules

- Geometry comes from NYC Open Data; likeness comes from evidence photos. Do not invent "real" facts (tenants, addresses, hours, active status) — derive them from sources or mark them as unverified.
- Real business names and likenesses are fair game during development. A factual-claims review pass happens before anything ships publicly.
- **Scene** mode is the product; **Debug** mode holds truth overlays and unverified data. Debug-only data never ships in Scene.

## Engineering Rules

- Verify with the fastest real signal: `npm run build`, the live Franklin verifiers in `scripts/`, and visual review screenshots.
- Run `git status --short` before editing; report unrelated dirty files instead of editing around them.
- Commit when a coherent step lands and builds. Never push without Batu.
- New dependencies are allowed when they serve the plan; name them in the commit message.
- Prefer deep modules, small batches, and refactoring over layered hacks.

## Docs

Three living documents, kept short and current:

1. `docs/PLAN.md` — roadmap, phases, current state
2. `docs/DECISION_LOG.md` — durable decisions, newest first
3. `docs/ART_DIRECTION.md` — the approved look and reference paths

Everything else belongs in `docs/archive/`. No per-batch briefs, ledgers, or reconciliation loops.
