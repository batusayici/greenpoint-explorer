# Greenpoint Explorer — Plan v2

Status: Active roadmap
Reset date: 2026-06-11
Owner: Batu (taste, product, approvals) / Agent (execution)

## Product Goal

A 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike: every building and business is located exactly where it is in real life and is recognizably itself. Art-directed and stylized — not hyperrealistic.

- **Primary look:** II-C Inked Indie Visual System (hand-inked editorial illustration). See `docs/ART_DIRECTION.md`.
- **Fallback look:** GPT-5.5 photo-render fidelity (the Premier Organic benchmark image) if II-C proves infeasible in-engine. Decided at the Phase 2 gate.
- **Geometry truth:** NYC Open Data (footprints, BINs). **Likeness truth:** field photos in `src/data/facade-evidence/`.

## Locked Decisions (2026-06-11)

Recorded in `docs/DECISION_LOG.md`:

1. Audience: public community demo. Real names/likenesses used freely in development; factual-claims review happens at publish time.
2. Likeness bar: heroes exact (corners, landmarks, storefronts), infill typological (correct massing, floors, material family, rhythm).
3. Production means: agent-built procedural/parametric kit + AI asset generation. The code-built-art prohibition is retired.
4. Camera: fixed isometric + pan/zoom (possibly 2–4 rotation steps). Free-cam is debug-only.
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

3.1 Full street layer: sidewalk slabs, curbs, crosswalks, corner props per II-C library
3.2 Hero facade completion: all visible faces, corner wraps, exact signage/awnings
3.3 Lighting, shadow shapes, and composition pass
3.4 Interaction v0: hover/select highlight + paper place card (II-C sections 8–9)
3.5 **Acceptance (Batu):** would a Greenpoint local recognize this corner instantly? Does it hold against the reference boards?

### Phase 4: MVP Scene — Greenpoint x Manhattan Ave + corridor

4.1 Second intersection built entirely through the pipeline; measure hours-per-corner and what needed hand-tuning
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
