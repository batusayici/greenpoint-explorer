# Phase 3 Architecture Scaling Decision Surface

Status: Concise decision artifact for Batu review; not implementation approval
Date: 2026-06-04

## Decision

Recommend the hybrid Phase 3 path:

- Block/tile-scoped manifest.
- Raster-first scene plates/layers.
- Structured interaction and QA overlays.
- Reusable primitives for geometry, hotspots, masks, labels, provenance, and review.

This keeps the primary world art raster-first while avoiding a one-off larger image that cannot scale.

## Slice Bounds

Phase 3 starts with one connected exploration slice:

- From Greenpoint Ave / Manhattan Ave.
- To Greenpoint Ave / Franklin Ave.
- Stay on this one connected block until a later brief expands scope.

## Partition Direction

Use the first scaffold to prove the partition model, not production tiling.

- `scene`: one Phase 3 Greenpoint Ave exploration slice.
- `block`: the Manhattan-to-Franklin connected block.
- `tiles`: coarse review/load units that can later support culling. Avoid splitting through key storefronts or signs.
- `layers`: raster plate, optional future raster detail layers, interaction targets, labels, QA/provenance overlays, and debug boundaries.

The first batch can use one temporary tile for the full scaffold if it still records tile bounds explicitly.

## Coordinates / Pan / Zoom

Use stable stylized scene coordinates for the scaffold.

- Keep real-world coordinates, local geometry, and scene coordinates separate.
- Define scene-space bounds for the block, raster surface, hit targets, labels, and QA overlays.
- Keep pan/zoom bounded and fixed-view-angle.
- Use viewport clipping for offscreen scene area.
- Do not imply exact real-world placement from scene coordinates.

## Raster Surface Choice

First implementation should not invent primary world art in code.

Preferred order:

1. Use a Batu-supplied or approved review-only extended raster plate.
2. If Batu explicitly approves, use a clearly labeled review-only placeholder raster surface for scaffold mechanics only.
3. If neither exists, stop before app implementation and report the missing asset path/dimensions needed.

Placeholder approval would test loading, bounds, overlays, and interaction only. It would not test final visual quality.

## Minimum QA / Provenance Overlay

The first scaffold needs only the minimum overlay set:

- Block boundary.
- Tile boundary.
- Raster/layer id.
- Interaction target bounds.
- Source/status marker per target: `sourced`, `manual_draft`, `symbolic`, `unknown`, or `blocked`.
- Missing asset or unsupported-claim warning.

Normal mode should hide debug overlays except review-only/non-production labeling.

## Browser Assumptions

The first scaffold should be designed as if later scenes will be tiled, even if the first proof uses one raster.

- Do not plan to load all future block plates at once.
- Keep raster decode/memory bounded.
- Cull or hide offscreen overlays.
- Keep target and label counts small for the first scaffold.
- Verify desktop pan/zoom and mobile containment early.

## Risks To Watch

At 10 blocks:

- Monolithic rasters become slow to load, review, and revise.
- Manual hotspot/card placement becomes fragile.
- Style drift between plates becomes visible.
- Source/status review becomes the bottleneck.

At 50 blocks:

- Hand-authored hotspots and cards become untenable.
- Manual raster composition becomes too expensive.
- Tile/layer loading rules, review queues, and provenance QA become mandatory.
- Any unsupported exact-place/facade claims will multiply quickly.

Cross-cutting risks:

- Browser: large rasters plus overlays can create memory and interaction latency problems.
- Data/provenance: storefront order, facade cues, current business status, and exact address placement may be incomplete.
- Review burden: human source review and visual continuity review may dominate scaling work.

## Proposed First Implementation Batch

Goal: build the smallest visible Phase 3 scaffold that proves the hybrid architecture direction.

Expected scope after Batu approval:

- Add a Phase 3 review-only scene manifest or fixture for the Manhattan-to-Franklin slice.
- Load one approved extended raster plate or approved placeholder raster surface.
- Define pan/zoom bounds from manifest data.
- Render minimum block/tile/layer QA overlay.
- Carry forward minimal hover/click/card behavior from the locked MVP.
- Keep all Phase 3 content review-only and non-production.

Expected files:

- `src/data/scenes/...phase-3...json`
- `src/PlaceholderWorld.jsx`
- `src/App.jsx`
- `src/styles.css`
- Possibly one review-only raster asset, only if supplied/approved.

Verification:

- JSON parse.
- `npm run build`.
- Browser smoke: default load, pan/zoom, hover/click, QA overlay, mobile containment.
- `git diff --check`.
- `git status --short`.

## Stop Point

Stop before implementation until Batu approves:

- Hybrid direction.
- Allowed files.
- Whether to use an approved placeholder or supplied extended raster.
- Any manifest/schema/public-interface implications.
- Acceptance criteria for the first scaffold.

Current status: app/source implementation remains blocked by `docs/CURRENT_EXECUTION_BRIEF.md`.
