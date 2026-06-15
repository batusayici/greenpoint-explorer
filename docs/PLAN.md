# Greenpoint Explorer — Plan v2

Status: Active roadmap
Reset date: 2026-06-11
Owner: Batu (taste, product, approvals) / Agent (execution)

## Product Goal

A 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike: every building and business is located exactly where it is in real life and is recognizably itself. Art-directed and stylized — not hyperrealistic.

- **Multi-angle (firm requirement):** the scene is viewable from **all four orthogonal isometric angles** (90° rotation steps), with pan/zoom. A single fixed angle shows only two of every building's four sides, structurally hiding ~half of all street frontages — and the businesses on them. Four rotations make every street frontage visible from at least one angle. This is not free-cam (which stays debug-only); it is four discrete, composed iso viewpoints. **Implication:** a building's street frontages must be treated for whichever angle(s) reveal them, and scene completeness is judged from all four angles, not one.
- **Primary look:** II-C Inked Indie Visual System (hand-inked editorial illustration). See `docs/ART_DIRECTION.md`.
- **Fallback look:** GPT-5.5 photo-render fidelity (the Premier Organic benchmark image) if II-C proves infeasible in-engine. Decided at the Phase 2 gate.
- **Geometry truth:** NYC Open Data (footprints, BINs). **Likeness truth:** field photos in `src/data/facade-evidence/`.

## Locked Decisions (2026-06-11)

Recorded in `docs/DECISION_LOG.md`:

1. Audience: public community demo. Real names/likenesses used freely in development; factual-claims review happens at publish time.
2. Likeness bar: heroes exact (corners, landmarks, storefronts), infill typological (correct massing, floors, material family, rhythm).
3. Production means: agent-built procedural/parametric kit + AI asset generation. The code-built-art prohibition is retired.
4. Camera: isometric + pan/zoom with **four fixed 90° rotation steps (firm — see Product Goal)**. Free-cam is debug-only. (Revised 2026-06-15: the rotation steps are a requirement, not optional, so no street frontage is permanently hidden.)
5. Real-faithful supersedes fictional-safe storefront identity.

## Architecture Spine

```
NYC footprints (BIN-mapped, WGS84)
  → local scene frame projection            [proven: R10E/R10G]
  → extruded massing + facade planes
  → II-style facade textures                [AI image-to-image from evidence photos;
                                             heroes bespoke, infill from kit]
  → II prop/ground layer                    [sidewalks, crosswalks, street furniture]
  → NPR post pass                           [outline, paper grain, palette grade]
  → DOM paper-card UI                       [II-C marker states + place cards]
```

Stack stays React + Three.js + Vite. No renderer replacement. PixiJS retained only if the 2D overlay earns its keep.

## Phases

### Phase 1: Reset & Clean Baseline — DONE (this commit)

1.1 Plan v2 (this file)
1.2 AGENTS.md rewritten as one-page contract
1.3 Decision log updated with the five reversals
1.4 ART_DIRECTION.md rewritten around II-C system + fallback
1.5 CLAUDE.md updated
1.6 Repo cleanup: phase docs and stale verifiers archived, capture middleware reverted

### Phase 2: Style Feasibility Spike (Franklin x Greenpoint)

Goal: prove the II-C inked look is achievable in real-time 3D — or fall back deliberately.

2.1 Runtime simplification: collapse QA-mode maze to **Scene** (fixed-iso art view) and **Debug** (free-cam truth overlays, footprint IDs)
2.2 Style anchor kit: assemble II-C reference boards + per-corner evidence photos into a generation prompt scaffold
2.3 Generate II-style facade textures for the three heroes (Premier/Franklin Organic, Sonny's Corner, Sereneco) via image-to-image from evidence photos
2.4 Apply to the proven Franklin geometry: facade planes, ground tiles, 2–3 props, fixed-iso camera
2.5 NPR post pass v0: outline, paper grain, palette grade
2.6 **Gate (Batu):** side-by-side — II-C in-engine vs II-C reference boards vs GPT-render fallback. Pick the look.

Known risks this phase exists to answer: AI texture style drift between buildings; seam/perspective artifacts; whether 3D massing shading and 2D inked textures unify or fight.

### Phase 3: Vertical Slice — Franklin corner at full quality (chosen style)

MVP corner (Premier, Sonny's, Sereneco heroes) facades/massing/cornices/awnings: **DONE**. Remaining: the ground layer and corner props (3.1), then composition/interaction.

**3.1 Street layer + corner props** — design + decisions in `DECISION_LOG.md` (2026-06-15). Procedural inked, in-engine. New deep modules `groundLayer.js` / `streetFurniture.js` (pure geometry, Node-runnable like `sceneFrame.js`) + thin `buildGround` / `buildFurniture` renderers in `SceneView.jsx`, replacing the ad-hoc per-building strips in `addRecordContactGrounding`.

  **b1 — Intersection ground system**
  - 3.1b1.1 `groundLayer.js`: project `sidewalkLineRecords` (Greenpoint ×1, Franklin ×3) into the R10E frame → real curb edges. Greenpoint roadbed from real centerline ± width (50); reconstruct Franklin curb edges + derived centerline from its sidewalk-line pair. Output `{ roadbeds, sidewalks, crosswalks, curbs, derived[] }`. Fallback: frontage-offset-by-width if projection noisy.
  - 3.1b1.2 Sidewalk polygon between frontage and curb, wrapping the corner return; crosswalk bands at the intersection mouth; thin raised curb lip catching II-C edge-ink + cast shadow.
  - 3.1b1.3 `buildGround(three, groundLayer)` renderer: asphalt + paper grain + restrained typological lane hint; concrete sidewalk with inked slab score-lines; ivory crosswalk stripes. Remove per-building sidewalk strips. Derived geometry uses `II_PALETTE.streetDerived`.
  - 3.1b1.4 Node verifier: curbs outside frontages, sidewalk width ∈ ~3–6 m, crosswalks inside curb returns, roadbed widths match recorded widths. + `npm run build` + iso screenshot.

  **b2 — Corner signals**
  - 3.1b2.1 `streetFurniture.js`: `placeCornerSignals({ curbReturns })` → mast-arm traffic + pedestrian signals at curb-return points, marked typological.
  - 3.1b2.2 `buildFurniture` renderer: restrained II-C massing (dark ink poles, small signal heads, muted R/A/G). Hydrant/signs/tree-pits deferred.
  - 3.1b2.3 Verifier: signal count + within-curb placement. + screenshot.

  **Status:** b1 (ground) and b2 (corner signals) **DONE** — merged to `main`, modules `groundLayer.js` / `streetFurniture.js` + verifiers. Signal look is a typological first pass (refine later).

**Remaining Phase-3 order:** ~~3.15 (business cards)~~ → ~~3.2 (camera)~~ → **3.3 (all-angle) → 3.4 (lighting) → 3.5 (interaction generalize) → 3.6 (acceptance).**

**3.15 Hero Business Cards (feedback vehicle) — DONE (2026-06-15).** Merged to `main`. Place cards for Premier/Sonny's/Sereneco: sourced JSON data (`franklin-greenpoint-heroes.v0.1.json`), `placeData.js` loader, `PlaceCard.jsx` paper card, click-to-select with gold teardrop pin + SVG tether anchored at storefront level. Truth-gated via `scripts/verify-place-data.mjs`; all records `approvalStatus: "proposed"` (Batu approval required before public demo). 14/14 tests passing.

**3.2 Multi-angle camera rig (the enabler) — DONE (2026-06-15).** Four fixed iso rotation steps (90°) with eased animated snap, keeping pan/zoom; free-cam stays debug-only. Contained to `SceneView.jsx`: `currentAzimuth` tweens between four steps; pan axes recompute from it; rotate via on-screen ↺/↻ buttons + Q/E (or `[`/`]`/arrow) keys, with an "angle N/4" indicator. **Found + handled (plan hadn't anticipated):** the hero back-face cull was azimuth-locked at build time, which would leave see-through holes once the camera rotated behind a building. Fixed by building every wall and toggling visibility per current view via its outward normal (real back-face culling that follows the camera) — no geometry change, no rebuild, NE view byte-identical. Verified by rotating through all four angles (build green, 14/14 tests). **Known gap → 3.3.1:** Premier is a multi-BIN *facade flat* with no rear walls, so it vanishes from the full-rear angle; the solid heroes (Sonny's, Sereneco) stay clean from all four. **Acceptance met:** rotates through all four; framing and pan stay coherent at each.

**3.3 All-angle corner completion** (raises the corner to the multi-angle bar — what 3.2 exposes):
  - 3.3.1 Hero non-street faces: party walls, rears, and exposed sides for Premier, Sonny's, Sereneco get at least typological treatment (brick party wall, sparse rear windows) so rotated views are never blank boxes.
  - 3.3.2 The other intersection corners: bring the currently-rough corner buildings up to street-frontage treatment (hero-exact where a corner carries a notable storefront, typological otherwise) so every frontage revealed by rotation reads as a real building.
  - 3.3.3 Corner wraps + exact signage/awnings on the heroes (the old 3.2 scope), now validated from all four angles.

3.4 Lighting, shadow shapes, and composition pass — composed at each of the four angles.
3.5 Interaction v0: hover/select highlight + paper place card (II-C sections 8–9).
3.6 **Acceptance (Batu):** would a Greenpoint local recognize this corner instantly, **from any of the four angles**? Does it hold against the reference boards?

### Phase 4: MVP Scene — Greenpoint x Manhattan Ave + corridor

**4.1 (c) Franklin block-face extension — Greenpoint Ave → Milton St**, typological massing (correct floors/height/material family, no hero facades). Heroes deferred. Proves the b1 ground system generalizes beyond the corner. **Comes after 3.2–3.3** so it inherits the multi-angle camera and a complete all-angle corner template; block faces get frontage treatment on the sides revealed by rotation, not just one.
  - 4.1c.0 **Data pull (prerequisite):** the Greenpoint→Milton Franklin block is not in the current footprint set (existing 291 records are a Greenpoint-Ave buffer; `crossAxisOffset` ≈ 0). Pull those footprints from NYC Open Data and project into the R10E frame.
  - 4.1c.1 Extrude typological massing for the pulled footprints along the Franklin axis.
  - 4.1c.2 Extend `groundLayer.js`'s Franklin sidewalk/roadbed run to cover the block to the Milton corner.
  - 4.1c.3 Verifier: footprints at real positions, ground extends without gaps. + iso screenshot.

4.1b Second intersection built entirely through the pipeline; measure hours-per-corner and what needed hand-tuning
4.2 Kit-ify what repeated: texture prompt templates, prop placement rules, facade parameter schema
4.3 Corridor infill v0: typological block faces connecting the two corners
4.4 **MVP review (Batu)**

### Phase 5: Block → Neighborhood → Publish

5.1 Typological infill kit driven by NYC data (massing, floors, material family)
5.2 Batch generation workflow + texture caching/atlasing
5.3 Performance pass (instancing, draw-call budget, zoom-range texture resolution)
5.4 **Pre-launch truth pass:** verify names/placements, fix misattributions, optional goodwill outreach to featured businesses
5.5 Public community demo

## Deferred (vision-compatible, not in scope)

Dynamic life (people, pets, vehicles — sprites/cel-shaded fit the II look), ambient audio, business interaction features.

## Known Data Gaps

- Franklin Ave centerline missing from the source packet (R10E finding); current cross-street slab is derived, review-only.
- Footprint confidence classes from 4D-1: 126 safe / 14 uncertain / 2 blocked across the 142 corridor buildings.

## What Survives From v1

- Franklin-local scene frame projection + BIN target mapping (R10B/R10E/R10G fixtures + verifiers in `scripts/`)
- Evidence photo library (`src/data/facade-evidence/`)
- Corridor scaffold fixtures (`src/data/corridor-scaffold/`) as typological input data
- Approved reference corpus (`docs/reference/approved-reference-corpus/`) and II-C reference boards (paths in `docs/ART_DIRECTION.md`)
- QA/Debug vs Scene mode separation principle
