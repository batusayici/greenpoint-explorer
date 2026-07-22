# Greenpoint Life

A hyperlocal map + feed for Greenpoint, Brooklyn: the week's events, new openings, deals, memberships, and neighborhood news — verified, sourced, and mapped, in the II-C inked visual identity.

**Live:** https://greenpoint-explorer.vercel.app (consumer domain `greenpoint.life` pending checkpoint gate)

## What it is

- A 2D MapLibre map + card feed (React + Vite, no backend). Cards are static JSON, refreshed weekly through a review-gated newsletter-ingest ritual — nothing ships unreviewed, nothing is invented, every card carries a source.
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
