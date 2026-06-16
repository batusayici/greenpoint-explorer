# Procedural Block Scaling — Design Spec

Date: 2026-06-16
Status: Approved (design) — pending implementation plan
Owner: Batu (direction/approval) / Agent (execution)
Relates to: `docs/PLAN.md` Phase 4 (4.1c Franklin block extension, 4.1b/4.2/4.3 corridor)

## Problem

The current scene (Franklin × Greenpoint corner) is locally recognizable and approved as a
prototype/demo. Before polishing further, we want to **test and learn a replicable, efficient
way to scale procedurally** beyond the single corner:

- **Block A — Franklin toward Milton St** (one block face)
- **Block B — Greenpoint Ave toward the east** (one block face)

This is a *test-and-learn* phase. The primary deliverable is **the repeatable recipe + tooling**,
proven by the two blocks. The blocks are evidence that the recipe works; the recipe is the product.

## What already generalizes (from pipeline audit, 2026-06-16)

Most of the spine is reusable today:

- **Projection** `src/sceneFrame.js` `createProjection()` — fixed, data-driven WGS84→scene
  transform (R10E basis, origin at the intersection, `scaleMetersToSceneUnits: 0.075`). Any
  footprint can be run through it; it is not hand-fit to the current buildings.
- **Typological wall treatment** `decorateTypologicalWall()` + `footprintEdges()` in
  `SceneView.jsx` — works for any footprint+height; currently applied to context buildings within
  `CONTEXT_TREATMENT_RADIUS_UNITS`.
- **Ground layer** `groundLayer.js` `buildGroundLayer()` — data-driven from centerline / sidewalk
  records; already handles a missing centerline via a derived fallback.

What is hand-fit is **only the 4 heroes** (Premier, Sonny's, Sereneco, 144 Franklin): bespoke
photo textures, `FACADE_COMPOSITES`, `FACADE_SPECS`, per-BIN kink values, recess profiles. None of
that is needed for typological infill.

## Real blockers (not rendering)

1. **Footprint data gap.** The current 291 footprint records are a Greenpoint-Ave-axis buffer with
   `crossAxisOffset ≈ 0` — there is **no Franklin-toward-Milton or east-Greenpoint coverage** to
   extrude. New footprints must be pulled from NYC Open Data.
2. **Storefront truth.** Franklin and Greenpoint are real commercial strips. Facades must be
   **truthful** — a local should recognize *which* businesses are there — but there is no
   per-storefront identity data for the new blocks, and the hero method (field photos + local
   knowledge) does not scale to ~20 bays per block.
3. **Franklin centerline missing** from the R10E packet — the derived slab stays review-only
   (no regression; new block extends the same derived geometry).

## Decisions (locked in brainstorming, 2026-06-16)

- **Primary aim:** the repeatable recipe + tooling; blocks are the test bed.
- **Infill fidelity:** typological *and data-differentiated* massing (real heights + a
  material/use classifier), **no bespoke photo-heroes** for the new blocks.
- **Storefront truth:** **real signage rendered** — each commercial ground-floor bay shows the
  real business name/sign + awning in II-C typological style (recognizable, but not a photo-hero).
  **Business info/cards stay disconnected** — clicking a new-block storefront does nothing; cards
  remain hero-only for now.
- **Storefront truth source:** **online listings (OSM Overpass; Google Places optional
  enrichment)** — name + category + address, reproducible per block. `activeStatus` marked
  `unverified` (listings go stale) until the Phase 5.4 pre-publish truth pass.
- **Data pull:** automated, reproducible fetch script (footprints + storefronts), committed
  extracts. The same script pulls the next block.
- **Sequencing:** **Block A (Franklin→Milton) first** — it builds the recipe and stresses the
  harder derived-centerline ground path. **Block B (east-Greenpoint) second** — the replication
  confirmation, on a real centerline; its *new-code count is the experiment's pass/fail signal*.

## Truth-rule stance

- New massing/material is a **typological inference** (allowed for infill per the likeness bar),
  carrying per-field `confidence`.
- New storefront names/categories are **sourced from OSM**, carry `confidence` +
  `activeStatus: "unverified"`, and are Debug-inspectable. Rendering real names in Scene during
  development is within the rules (`AGENTS.md`: real names fair game in development; factual review
  before publish). These records **feed the Phase 5.4 pre-publish truth pass**.
- New-block buildings make **no card-connected, interactive claims** — heroes remain the only
  photo-exact, card-connected buildings. We do not invent tenant/active/hours facts; absent data is
  marked, not fabricated.

## Architecture — the 7-stage block recipe

Each block is described by a thin descriptor and run through the same seven stages. Borrowing one
idea from a declarative approach without building a full engine: a per-block descriptor
parameterizes the recipe; we discover what actually varies on Block A before extracting more config.

**Block descriptor** — `src/data/blocks/<name>.block.json`:
```json
{
  "label": "Franklin Ave — Greenpoint Ave to Milton St",
  "bbox": { "minLon": ..., "minLat": ..., "maxLon": ..., "maxLat": ... },
  "streetSegments": [
    { "name": "Franklin Ave", "from": "Greenpoint Ave", "to": "Milton St" }
  ]
}
```

### Stage 1 — Acquire footprints  *(new: `scripts/pull-footprints.mjs <bbox>`)*
- Hits NYC Open Data **Building Footprints**; joins **PLUTO on BBL** (footprints carry the
  PLUTO BBL). Commits a new extract under `src/data/geometry-source/` in the existing
  R10E-compatible schema **plus** classifier fields: `numFloors, yearBuilt, bldgClass, landUse,
  comArea, resArea`.
- Dedups by BIN against the existing 291 records.
- Reproducible: re-runnable per bbox for the next block.

### Stage 2 — Project + assemble  *(edit: scene assembly gating)*
- Reuse `createProjection()` + `sceneFrame.js`. Replace the single `CONTEXT_TREATMENT_RADIUS_UNITS`
  cull (which silently drops far footprints) with **block-bbox gating** so new-block footprints are
  kept and treated.

### Stage 3 — Classify typology  *(new: `src/buildingTypology.js`, pure/Node-runnable)*
`classifyBuilding(record) → { storeyCount, massingClass, materialFamily, groundFloorUse, palette, confidence }`
- **storeyCount** ← PLUTO `numFloors`; fallback `round(heightRoof / 10ft)`.
- **massingClass** ← storeys + footprint width: `rowhouse | walkup | midrise | taxpayer`
  (1-story commercial).
- **materialFamily** ← `yearBuilt + bldgClass + landUse`: `brick-prewar | painted-masonry |
  commercial-storefront | warehouse` → maps to an II-C palette entry.
- **groundFloorUse** ← `landUse` / `comArea > 0` → toggles a glazed commercial base band.
- **confidence** ← `source-backed | estimated | fallback`, per field.
- First-pass granularity is deliberately **coarse (4 × 4)** — enough to read as differentiated,
  cheap to validate. Refine later if blocks look repetitive.

### Stage 4 — Storefront roster  *(new: `scripts/pull-storefronts.mjs <bbox>` + `src/storefrontRoster.js`)*
The truth layer.
- **Acquire:** OSM Overpass (`shop=*`, `amenity=cafe|restaurant|bar|…`, `name`,
  `addr:housenumber`) for the block bbox. Output roster records
  `{ name, category, houseNumber, point?, sourceId, confidence, activeStatus: "unverified" }`.
- **Assign** (`assignStorefronts(buildings, roster, axis) → bays[]`, pure module): map each listing
  to a ground-floor commercial bay. Order commercial frontages along the street by address,
  distribute storefronts by house-number interpolation, project to a bay slot. Each assignment
  carries a confidence.
- **Fallback:** low-confidence assignment → render generic-commercial **without a name** and hold
  the name in the data layer (no false placement). The scorecard tracks assignment hit-rate.

### Stage 5 — Treat  *(edit: two renderers)*
- **Massing walls:** extend `decorateTypologicalWall` to consume the typology descriptor — vary
  palette (`materialFamily`), window rhythm (storeyCount × width), commercial ground-floor band
  (`groundFloorUse`). Keeps the flat-inked II-C idiom; no new visual metaphor.
- **Truthful storefront:** for each assigned bay — glazed base + category-tinted awning + a **sign
  band rendering the real name legibly** in flat-inked II-C style (canvas-texture sign panel, not a
  bespoke photo-hero). **No PlaceCard wired.**

### Stage 6 — Ground extend  *(reuse `buildGroundLayer`)*
- Feed the new Franklin→Milton and east-Greenpoint street segments from the block descriptor.
  Greenpoint has a real centerline (clean); Franklin stays on the derived/frontage-offset fallback
  (already accepted, review-only). Likely no code change — data only.

### Stage 7 — Measure  *(new: `scripts/score-block-build.mjs` + `docs/SCALING_LOG.md`)*
The deliverable of a test-and-learn phase. Per block, append a scorecard to a new
`docs/SCALING_LOG.md` (sibling to `HERO_FACADE_LOG.md`):
- buildings rendered; % source-backed vs estimated vs fallback height
- storefronts assigned vs fallback (assignment hit-rate)
- **new files / LOC changed** for this block (git diff between a `block-a` tag and `block-b`) — the
  replicability number
- count of manual interventions / overrides
- rough wall-clock / agent-time
- 4-angle screenshots

**Pass condition for the experiment:** Block B requires **near-zero new module code** — only a new
descriptor + data extracts. That delta is the result.

## Module boundaries / files

| Stage | File | New/Edit |
|---|---|---|
| Descriptor | `src/data/blocks/franklin-milton.block.json`, `greenpoint-east.block.json` | new |
| 1 Acquire footprints | `scripts/pull-footprints.mjs` + committed extract | new |
| 2 Assemble | scene assembly gating in `sceneFrame.js` / `SceneView.jsx` | edit |
| 3 Classify | `src/buildingTypology.js` + `scripts/verify-building-typology.mjs` | new |
| 4 Storefront roster | `scripts/pull-storefronts.mjs`, `src/storefrontRoster.js` + verifier | new |
| 5 Treat | `decorateTypologicalWall` + truthful-storefront renderer in `SceneView.jsx` | edit |
| 6 Ground | `groundLayer.js` (data only, likely no code) | reuse |
| 7 Measure | `scripts/score-block-build.mjs`, `docs/SCALING_LOG.md` | new |

Each new pure module (`buildingTypology.js`, `storefrontRoster.js`) is Node-runnable with a
verifier, matching the `sceneFrame.js` pattern.

## Verification

- Node verifiers per stage: new footprints project inside the frame; classifier outputs valid
  descriptors with confidence; storefront assignment within frontages; ground extends gap-free.
- `npm run build` green.
- 4-angle screenshots (the multi-angle requirement) for each block.
- Block B built primarily by *running the recipe*; new-code count recorded.

## Top risks

1. **Address → bay assignment** (Stage 4) — stale/imprecise listings, multi-tenant buildings.
   Mitigated by confidence-gated fallback (generic-commercial, name held in data) + hit-rate
   tracking.
2. **PLUTO join misses** (new construction, garages) — fallback classification from height+area;
   counts against source-backed %.
3. **The `crossAxisOffset ≈ 0` cull** must be replaced by block-bbox gating, or new footprints get
   dropped silently.
4. **Franklin centerline** stays derived — new block extends the same review-only slab (no
   regression).
5. **Over-abstraction** — resist building a declarative block engine before Block A reveals what
   actually varies (YAGNI). Extract more config only in Block C+.

## Out of scope

- Bespoke photo-heroes for new blocks (deferred; typological + truthful signage only).
- Interactive place cards / business-info panels for new-block storefronts (disconnected for now).
- Active-status / hours verification (Phase 5.4 pre-publish truth pass).
- Dynamic life, audio, instancing/perf passes (later phases).
```
