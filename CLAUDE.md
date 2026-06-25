# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://127.0.0.1:5173
npm run build     # production build to dist/
npm run preview   # preview production build
node scripts/verify-phase-4m-r10g-franklin-corner-frontage-wrap.mjs   # live Franklin geometry verifier (also r10b, r10e, r10f)
node scripts/derive-facade-spec.mjs <texture.png> --face "BIN:role=u0:u1"  # measure rendered facade -> spec rects + overlay PNG (see docs/reference/art/GENERATION_KIT.md playbook)
```

## Read First

1. `AGENTS.md` — one-page operating contract (roles, working loop, truth rules)
2. `docs/PLAN.md` — active roadmap, phases, current state
3. `docs/DECISION_LOG.md` — durable decisions, newest first (the 2026-06-11 reset entry defines the current regime)
4. `docs/ART_DIRECTION.md` — the approved II-C Inked Indie look + reference corpus paths

Everything in `docs/archive/` and `scripts/archive/` is history, not authority.

## Project Goal

A 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike: buildings/businesses exactly where they are in real life, recognizably themselves, rendered in the approved hand-inked II-C style (fallback: GPT-5.5 photo-render look). Geometry truth = NYC Open Data; likeness truth = evidence photos.

## Architecture

**Stack:** React 19 + Three.js + Vite. Fixed isometric camera (free-cam is debug-only). No router, no state library.

**Entry:** `src/main.jsx` → `src/App.jsx` → `src/Phase4BRuntimePreview.jsx` (active runtime: canvas, scene assembly, mode switching, UI overlays). Scene building in `src/phase4bRuntimeScene.js`; fixture→runtime mapping in `src/sceneManifest.js`.

**Pipeline spine:** NYC footprints (BIN-mapped WGS84) → local scene frame projection (proven in the 4M-R10 series) → extruded massing + facade planes → AI-generated II-style facade textures (heroes bespoke from photos, infill kit) → prop/ground layer → NPR post pass → DOM paper-card UI.

**Key data** (`src/data/`):
- `franklin-intersection/` — Franklin x Greenpoint projected geometry truth (the proven spine)
- `facade-evidence/` — field photos = likeness source for hero treatment
- `corridor-scaffold/` — corridor fixtures, typological input data
- `geometry-source/` — source footprint records

**Assets** (`assets/`): generated facade textures. (The 46MB QA-only bay-window GLB was removed 2026-06-18 — it was never loaded in production.)

## Key Constraints

- **Scene vs Debug mode:** Scene is the product; Debug holds truth overlays and unverified data. Debug-only data never ships in Scene.
- **Truth rules:** don't invent real-world facts (tenants, hours, active status); derive from sources or mark unverified. Real names/likenesses are fine in development; a factual review pass gates public release.
- **Look:** II-C system rules in `docs/ART_DIRECTION.md` (palette, line weights, density zones, card UI). No new visual metaphors without Batu approval.
- Run `git status --short` before editing; report unrelated dirty files.
- Commit when a coherent step lands and builds; never push without Batu.
