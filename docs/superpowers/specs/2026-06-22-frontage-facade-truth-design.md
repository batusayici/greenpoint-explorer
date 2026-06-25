# Per-building facade truth for the Franklin frontage

**Date:** 2026-06-22
**Branch context:** `feat/inked-facade-look`
**Status:** design approved, pending spec review

## Problem

Non-hero buildings render with a *family stereotype*, not their real appearance. A local can't recognize them.

- **Material family** is a defensible guess for residential stock (`buildingTypology.js` infers `brick-prewar` for pre-1945, `painted-masonry` for post-1945) but the heuristic can only ever emit `brick` / `painted-masonry` / `warehouse`. It never asserts clapboard, brownstone, or modern-flat.
- **Color** is a family default: a kit building gets `tones[0]` — the *first* tone of its family's `MATERIAL_WALL_TONES` set in `palette.js`. Every inferred brick building renders the same brick. Window and door colors are not independent — they are mathematical darkenings of the wall tint (`darken2(0.3)` in `decorateInkedWall`). So a real "maroon brick with black window frames and door" is **currently impossible to encode**.

NYC Open Data has no facade/window/door color anywhere — it stays the material-family prior only.

## Goal

A local recognizes the ~30–50 buildings lining the **Franklin Street frontage** by their real material + facade/window/door color — captured by hand — *without the exact bespoke detail of hero buildings, and without leaving the II-C palette*.

## Scope

**In scope (now):** the Franklin frontage only — the buildings whose facades line the corridor a viewer reads as they move down the street (~30–50 BINs).

**Out of scope (for now):** the ~200 block-interior / back-lot fabric buildings. They keep the honest family-guess. The tool built here is the permanent path to extend into the fabric later if it ever matters.

## Design

### 1. Data — extend the override schema

`src/data/facade-overrides/greenpoint-corridor.v0.1.json` gains three optional per-BIN fields alongside the existing `family` / `tint` / `groundTint`:

- `windowTint` — frame/sash color, **independent** (not derived from wall)
- `doorTint` — door leaf color, **independent**

All color fields store **sanctioned palette tokens** (hex strings that exist in the palette), never raw sampled hex.

A BIN with none of the new fields renders exactly as today — zero regression risk to the ~200 fabric buildings. The schema-validation in `facadeFamily.js` (the override parser) extends to accept and pass through `windowTint` / `doorTint`, ignoring them when absent.

### 2. Palette — grow on purpose

In `src/visualSystem/palette.js`:

- Add a `TRIM_TONES` sanctioned set, seeded with the inked-appropriate trims reality demands: near-black, cream, forest, oxblood, slate (exact tokens decided during build, each an inked value — never raw white/pure black).
- Extend `MATERIAL_WALL_TONES` only where a real sampled wall color has no near token.
- Add `nearestTrimToken(hex)` beside the existing `nearestPaletteToken(hex, family)` (the `colorBinding.js` snapper). Trim snaps against `TRIM_TONES`; wall snaps against the family's `MATERIAL_WALL_TONES`.

**Every new token is a deliberate commit, visible in a diff.** The palette grows on purpose; it does not dissolve into photo-realism. The II-C "no-miss" rule (every facade color comes from the palette) stays intact.

### 3. Renderer — honor explicit trim, else fall back

In `src/SceneView.jsx` (`decorateInkedWall`) and `src/buildKitFacadeParams.js`:

- If `windowTint` is present on the resolved params, use it for the window frame/sash; otherwise keep the current `darken2(...)` derivation from the wall tint.
- Same for `doorTint` on the door leaf (currently `darken(groundTint, 0.72)` / `darken2(0.3)` fallback).
- The recess relief (head/sill/jamb shadows in `FACADE_RELIEF`) still derives **from the trim color** so carved depth reads correctly — i.e. relief multipliers apply to the explicit trim when set, to the derived color otherwise.

One conditional per color. Untruthed buildings are byte-identical to today's render.

### 4. Tool — eyedropper truthing in `?facadeedit=1`

Extend the existing dev editor (`src/components/dev/FacadeRecessEditor.jsx` and its host wiring in `SceneView.jsx`), **not a new app**. Add a per-building truth panel:

- **Material dropdown** — the 6 canonical families (brick, clapboard, brownstone, painted-masonry, modern-flat, warehouse).
- **Three color rows** — facade / window / door. Each row has:
  - a **screen eyedropper** button using the browser `EyeDropper` API — it samples *any* on-screen pixel, so the user points it at Street View (or any reference) open beside the app;
  - a swatch showing **raw sample → snapped token** side by side, so the user sees what will actually render;
  - an **"add as new token"** action, shown when no token is within a closeness threshold — appends a new sanctioned token to `TRIM_TONES` / `MATERIAL_WALL_TONES`.
- **Click a building** in-scene to load its BIN into the panel (reuse the existing click-to-load-face wiring).
- **Save** writes the per-BIN override entry (merging `family` / `tint` / `windowTint` / `doorTint`) to the override JSON.

### 5. Persistence — mirror the proven dev-save middleware

Add a `vite-plugin-facade-override-writer.js`, modeled exactly on `vite-plugin-facade-spec-writer.js`:

- `apply: "serve"` — excluded from the production build entirely.
- `POST /__facade-override { bin, override }` — merges `override` fields into `overrides[bin]` of `src/data/facade-overrides/greenpoint-corridor.v0.1.json`.
- Same guards: dir-scoped to `src/data/facade-overrides`, reject path separators / `..`, preserve trailing-newline style so the diff is only the changed fields.
- Registered in `vite.config.js` alongside the spec writer.

### Workflow

App + Street View side by side → click a frontage building → eyedrop facade/window/door + pick family → see it re-render live in-scene → Save. ~40 buildings in one sitting.

## Testing

- **Unit:** `nearestTrimToken` snaps to the closest `TRIM_TONES` entry; renderer uses explicit `windowTint`/`doorTint` when set and derives via `darken2` when absent; the override parser accepts the new fields and ignores them when absent.
- **Behavioral:** the override-writer endpoint merges a well-formed per-BIN entry without clobbering existing fields; a truthed BIN renders maroon wall + black trim while an untruthed neighbor renders unchanged.
- **Visual proof:** before/after screenshot of one frontage building rendered from sampled truth.

## Constraints & flags

- **Eyedropper needs Chromium** — `EyeDropper` API is Chrome/Edge/Arc, absent in Firefox/Safari. The tool is dev-only, so this is acceptable; the truthing pass is done in Chrome.
- **Family list is fixed at 6.** If a frontage building is a material none of the 6 captures (tile/terracotta, metal storefront), note it and decide later — it does not block the pass.
- **Trim tokens are inked values, not raw colors** — "black" trim is a near-black inked token, "white" trim a cream token, to stay in the II-C look. The eyedropper proposes; the palette governs.

## Affected files

- `src/data/facade-overrides/greenpoint-corridor.v0.1.json` — new fields (data)
- `src/visualSystem/palette.js` — `TRIM_TONES`, extended wall tones, `nearestTrimToken`
- `src/facadeFamily.js` — override parser accepts `windowTint`/`doorTint`
- `src/SceneView.jsx` — `decorateInkedWall` honors explicit trim; editor host wiring
- `src/buildKitFacadeParams.js` — pass explicit trim into params
- `src/components/dev/FacadeRecessEditor.jsx` — truth panel (material dropdown, eyedropper rows)
- `vite-plugin-facade-override-writer.js` — new dev-save middleware
- `vite.config.js` — register the override writer
