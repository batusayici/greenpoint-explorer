# Operating Contract v3

Status: Active
Date: 2026-07-22
Project: Greenpoint Life (repo: greenpoint-explorer)
Supersedes: v2 (2026-06-11), which governed the now-parked 3D explorer track

## Product

**Greenpoint Life** — a hyperlocal 2D map + feed for Greenpoint, Brooklyn (events, openings, deals, memberships, news; verified and sourced). Sole goal: real value and PMF. The 3D isometric explorer is parked indefinitely (`docs/parked/3d-explorer/`, DECISION_LOG 2026-07-22); do not resume it without an explicit Batu decision.

## Roles

- **Batu owns:** product direction, taste, scope, verdicts, publish/deploy approvals, and sending every outbound message.
- **Agent owns:** the weekly PM/Design/PMM/Analyst loop — ingest, builds, drafts, readouts, verification, plan upkeep — and proposing options with tradeoffs when a taste call is needed.

## Working Loop

Weekly rhythm (ops plan `docs/launch/2026-07-21-pmf-ops-plan.md`): **Mon** `/ingest-newsletters` (review-gated) + analytics → **Tue** readout + top-3 proposals → **Wed–Fri** approved ships (TDD, preview-verified, gated deploy). Build → show → Batu reacts → iterate. Ask before changing scope.

## Truth Rules

- **Nothing invented, everything sourced.** Events, hours, deals, business status come from named sources (newsletters, org calendars, publishers) or don't ship. Cards are schema-valid (`cardSchema.js`), geocoded, and pass the review diff before deploy.
- **Coverage is never for sale, and no payer influences it** (`docs/growth/business-model.md`): every verified business gets on the map free; paid placement is labeled enhancement only, never admission, and never on news or community surfaces.
- Expired content disappears at render time (`eventWindow.js`); deals require `endsAt`.
- These rules are also the answer-engine citation-trust moat — they stay non-negotiable.

## Engineering Rules

- Verify with the fastest real signal: `npm test`, `npm run build`, browser preview of `/`.
- II-C palette on anything visual; out-of-palette color is a hard miss.
- Run `git status --short` before editing; report unrelated dirty files instead of editing around them.
- Commit when a coherent step lands and builds. **Never push without Batu — push = production deploy.**
- New dependencies are allowed when they serve the plan; name them in the commit message.
- Prefer deep modules, small batches, and refactoring over layered hacks.

## Docs

Living documents, kept short and current:

1. `docs/PLAN.md` — roadmap and current state
2. `docs/DECISION_LOG.md` — durable decisions, newest first
3. `docs/launch/` — launch kit, PMF ops plan, checkpoint scorecards
4. `.claude/skills/ingest-newsletters/SKILL.md` — the weekly content ritual

Parked 3D docs: `docs/parked/3d-explorer/` (its `ART_DIRECTION.md` remains the II-C palette source of truth). History: `docs/archive/`.
