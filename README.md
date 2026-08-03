# Greenpoint Life

A hyperlocal map + feed for Greenpoint, Brooklyn: the week's events, new openings, deals, memberships, and neighborhood news — verified, sourced, and mapped, in the II-C inked visual identity.

**Live:** https://greenpoint.life (canonical since the 2026-08-02 domain cutover; `greenpoint-explorer.vercel.app` keeps serving as the rollback path and the target of already-sent invite links)

## What it is

- A 2D MapLibre map + card feed (React + Vite, no backend). Cards are static JSON, refreshed through a scheduled newsletter-ingest ritual — nothing is invented, every card carries a source. Since 2026-08-02 routine updates ship themselves: a card ships only if a verbatim `sourceQuote` substantiates its claims (schema-checked, test-enforced) and its category follows from the source — anything unsourced or ambiguous is held for review. Roster additions, submissions, and code changes stay human-gated.
- Content covers only locally-owned Greenpoint businesses and community orgs. Coverage target: 100% of on-concept local events and openings.

## Quickstart

```bash
npm install
npm run dev    # http://127.0.0.1:5173 — app at /
npm test
```

Operating docs: [AGENTS.md](AGENTS.md) (contract) · [docs/PLAN.md](docs/PLAN.md) (roadmap) · [docs/DECISION_LOG.md](docs/DECISION_LOG.md) (decisions) · [docs/launch/](docs/launch/) (launch + PMF ops).

## Parked: 3D isometric prototype

This repo also contains the project's original direction — a lifelike, hand-inked, isometric 3D explorable Greenpoint (Three.js). It is **parked indefinitely** (2026-07-22) in favor of shipping real value with the 2D product, and stays runnable at `/explorer.html` in dev builds. Docs and art direction: [docs/parked/3d-explorer/](docs/parked/3d-explorer/).
