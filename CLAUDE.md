# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://127.0.0.1:5173 — the product serves at /
npm test          # unit tests — TZ-pinned to America/New_York (day-grouping tests are zone-sensitive; the cloud routine runs UTC)
npm run test:dom  # rendering tests (vitest + jsdom, `.test.jsx`) — SEPARATE runner from `npm test`, which stays pure-logic `.test.mjs` under node --test. Only for invariants a DOM is required to check; today that means one: a failing map must never empty the page (2026-08-13). `npm run verify` runs both.
npm run build     # production build to dist/
npm run preview   # preview production build
npm run ingest:geocode  # geocode new cards (Nominatim → geocode-cache.json)
```

Content refresh runs as claude.ai cloud routines (Mon full + daily thin + Wed Greenpointers, via the `/ingest-newsletters` skill). **Since 2026-08-02 routine updates auto-ship** — push to `main` = production. Cards are triaged **per card**: one that is substantiated (carries a verbatim `sourceQuote`) and mechanically categorized ships; one that is unsourced, ambiguously categorized, inferred, or source-conflicted is **held in a review PR — never shipped, never silently dropped**. Roster/sender additions, business submissions, and code changes are always human-gated. Truth rules are unchanged; `sourceQuote` is schema-checked and a dated test fails any card created on/after 2026-08-02 without one.

## Read First

1. `AGENTS.md` — operating contract v3 (roles, weekly loop, truth rules)
2. `docs/PLAN.md` — active roadmap and current state
3. `docs/DECISION_LOG.md` — durable decisions, newest first (the 2026-07-22 entry defines the current regime)
4. `docs/launch/2026-07-21-pmf-ops-plan.md` — the launch → PMF operating plan
5. `docs/growth/growth-engine.md` — growth strategy of record (loops, experiment rules, staging)
6. `docs/growth/business-model.md` — business model of record, **constraints only**

**Strategy docs are split by sensitivity (DECISION_LOG 2026-07-28):** the repo carries rules; all pricing, revenue targets, prospect detail, and partner assessments live in the **gitignored `docs/private/`** and must never be committed. When the model changes, update both — rules in the repo copy, numbers in the private copy. Never move a figure into a committed doc to make it read better; if a task seems to need the numbers, ask Batu.

Everything in `docs/archive/`, `docs/parked/`, and `scripts/archive/` is history or parked work, not current authority.

## Project Goal

**Stoopwise Greenpoint** — a hyperlocal 2D map + feed for Greenpoint, Brooklyn: the week's events, new openings, deals, memberships, and neighborhood news, verified and sourced, in the II-C inked visual identity. Sole goal: real value and PMF.

**Naming (2026-08-06):** the parent brand is **Stoopwise**; this edition is **Stoopwise Greenpoint**, and future neighborhoods take the same shape (Stoopwise Astoria). Canonical domain `stoopwise.com`. `greenpoint.life` redirects here (308, now also version-controlled in `vercel.json`); `greenpoint-explorer.vercel.app` deliberately does NOT redirect — it serves a byte-identical copy as the rollback origin and the live-invite target (DECISION_LOG L7), with the canonical tag pointing dupes at stoopwise.com. Repo keeps the `greenpoint-explorer` name. **"Greenpoint" is not in the brand any more, so every title, meta, and machine surface must carry it explicitly** — that keyword is what search and answer engines match on.

## Architecture

**Stack:** React 19 + MapLibre GL + Vite. No router, no state library, no backend — cards are static JSON refreshed weekly through a review-gated ingest ritual.

**Entry:** `index.html` → `src/demand-test/main.jsx` (analytics wiring: Vercel Analytics pageviews + PostHog custom events via `trackEvents.js`/`posthogTransport.js`; `?src=` channel tags) → `JulyApp.jsx` (root) → `MapView.jsx` (MapLibre map, II-C style from `iiMapStyle.js`) + `CardPanel.jsx` (feed).

**Logic modules** (each with a sibling `.test.mjs`): `cardSchema.js` (card model incl. place-graph fields `relatedCardIds`/`timeline`/`trustRisk`), `filterCards.js`, `eventWindow.js` (Today lens, dated/ongoing/expiry), `cardActions.js`, `postValue.js` (post-value email prompt), `gtrainBanner.js`.

**Data** (`src/data/demand-test/`): `cards.json` (live feed — renamed from `july-2026-cards.json` 2026-07-27), `geocode-cache.json`, `ingest-ledger.json` (ingest run state + sender registry).

**Old `/july.html` URL** redirects to `/` via `vercel.json` (query params preserved — live invite links depend on this).

## Key Constraints

- **Truth rules:** nothing invented, everything sourced. Events/hours/deals/status come from named sources or don't ship; cards are schema-valid, geocoded, review-gated. **Coverage is never for sale** — every verified business is on the map free; paid placement is labeled enhancement only and never touches news or community surfaces (`docs/growth/business-model.md`).
- **Look:** every color from the II-C palette (source of truth: `docs/parked/3d-explorer/ART_DIRECTION.md`, applied via `iiMapStyle.js`). Out-of-palette is a hard miss.
- **Source allowlist:** `.claude/settings.json` holds `WebFetch(domain:…)` allow rules for verified Greenpoint content sources. When a new business/source is verified, add its domain there in the same change. **It must be the tracked `.claude/settings.json` — `.claude/settings.local.json` is gitignored globally (`~/.config/git/ignore`), so a domain added there works locally and silently never reaches the repo or the cloud ingest routine** (2026-08-06, Eventbrite). Note: this only gates Claude Code's own `WebFetch` tool in an interactive session — it does **not** govern raw subprocess network calls (`curl`, `node fetch`, Playwright) that `scripts/fetch-sources.mjs` makes when the ingest cloud routine runs. If a scheduled run reports every source unreachable (not just newly-added ones), the cause is the cloud sandbox's network egress, not this file — see `docs/DECISION_LOG.md` 2026-07-28.
- **Always invoke the ingest scripts through `npm run` (2026-08-10).** Node's global `fetch` ignores `HTTPS_PROXY` unless the process is *started* with `NODE_USE_ENV_PROXY=1`, which the `ingest:fetch` / `ingest:geocode` scripts set. Run `node scripts/fetch-sources.mjs` bare in a proxied environment and every plain/feed/json source egresses direct — which the sandbox *intercepts*, so you get mangled bodies and phantom diffs, not honest failures. The script now refuses to start in that state; don't work around it by unsetting `HTTPS_PROXY`. See `docs/DECISION_LOG.md` 2026-08-10.
- **Environmental dependencies are enumerated, not discovered (2026-08-13):** `docs/environmental-dependencies.md` lists every browser capability the product assumes (WebGL, storage, matchMedia, Intl…), what the reader sees without it, and what proves it. Adding a dependency means adding its row **in the same change**, same rule as a new source domain in `.claude/settings.json`. This exists because a design crit can only judge states it can *reach* — no reviewer's browser could produce "no WebGL", so that state went unseen until a reader lost the whole product to it.
- Run `git status --short` before editing; report unrelated dirty files.
- Commit when a coherent step lands and builds; **never push `main` without Batu — a `main` push = production deploy** (Vercel-linked).
- **Design batches stage first (2026-08-08):** major or batch design/UX changes go on a feature branch pushed to origin — Vercel builds a preview deployment (branch push ≠ prod) — Batu reviews the preview URL, then merge to `main`. Content-refresh routines keep auto-shipping per 2026-08-02.

## Parked: 3D isometric explorer

The original 3D explorable Greenpoint (Three.js, II-C facade textures, Franklin spine) is **parked indefinitely** as of 2026-07-22 — do not work on it unless Batu explicitly reopens it. It stays runnable: entry `explorer.html` → `src/main.jsx`; the bulk of `src/`, `assets/` (~88MB textures), and `scripts/verify-*` belong to it (`npm run verify` covers its checks). Docs: `docs/parked/3d-explorer/`.
