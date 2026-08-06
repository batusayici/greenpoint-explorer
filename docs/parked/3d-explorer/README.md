# Parked: 3D isometric Greenpoint Explorer

**Status: parked indefinitely as of 2026-07-22** (Batu's decision — see `docs/DECISION_LOG.md`, same date). The direction stays exciting and may be picked up later, but the project's sole goal now is real value / PMF via **Stoopwise Greenpoint** (named Greenpoint Life until 2026-08-06), the 2D map + feed.

This folder holds the 3D track's living docs, frozen where they stood:

- `ART_DIRECTION.md` — the approved II-C Inked Indie look. **Still partially live:** the II-C palette remains the source of truth for the 2D map style (`src/demand-test/iiMapStyle.js`) and any visual work.
- `COMPONENT_INVENTORY.md`, `CURATION_TIERS.md`, `SCALING_LOG.md` — facade kit, hero-tier, and block-scaling records.
- `reference/`, `mvp-reference-images/`, `visual-artifacts/` — art reference corpus, evidence photos, screenshots.

The code is parked in place on `main`: entry `explorer.html` → `src/main.jsx` (Three.js runtime, scene data under `src/data/`, textures under `assets/`). To resume: `npm run dev` then open `/explorer.html`; geometry verifiers run via `npm run verify`. Earlier history: `docs/archive/`.
