# Phase 7 — Asset Kit Completion — Design

Date: 2026-06-18
Owner: Batu (taste, approvals) / Agent (execution)
Status: Approved scope, pending spec review
Plan refs: `docs/PLAN.md` Phase 7; consistency engine `docs/PLAN_6.2.md`; inventory
`docs/COMPONENT_INVENTORY.md`; art system `docs/ART_DIRECTION.md` (II-C sheet).

## Purpose

Today the inked component kit is **one material family (brick) × four components**
(`assets/inked/brick-{wall,window,cornice,ground}.v1.png`). Greenpoint is several
materials, and the II-C *Building & Storefront Library* defines more component layers
than the kit currently draws (notably **roll gates** and a **weathering/truth-texture**
layer). Phase 7 completes the asset kit so the neighborhood can be dressed without
per-building hand-tuning.

Phase 7 is an **asset/data-production phase**. It produces tintable-neutral component
PNGs, a canonical material taxonomy (as data + doc), a valid-cell matrix, a roof-tone
set, and a color-binding contract — and proves them against the 6.2.3 conformance gate.

## Scope boundary (the done-line)

**In scope (Phase 7):**
- Reference gathering for the components with no repo.
- Defining the canonical material taxonomy as a data artifact + doc.
- Generating, alpha-keying, and inventorying every valid (material × layer) component.
- Typological roof-tone set.
- The color-binding **contract** (spec) + palette structured for nearest-token snapping.
- Conformance: palette-clean, alpha-correct, composes in an isolation preview, no
  regression of existing renders.

**Out of scope (Phase 8 wiring):**
- Rewriting `buildingTypology.js` to *classify into* the new families.
- Wiring `selectTreatment` / compose / SceneView to *select and apply* the new assets.
- Authoring per-building color values and the dominant-color **derivation** pipeline.
- Re-rendering the spine with the new materials (Phase 8.1).

Rationale: the classifier today is a heuristic (storey count + land use) that defaults
to brick and does no real material detection. Defining the taxonomy and producing assets
is decoupled from making the classifier emit them; keeping them separate keeps Phase 7
shippable and gate-checkable on its own.

## Decisions (locked 2026-06-18)

1. **Reference gap → gather first, then full grid.** Awnings, storefronts, and roll
   gates have no reference repo. Phase 7 front-loads collecting them (7.0) before
   generating those columns. "Photos are truth" is preserved for every component.
   **Handoff: Batu supplies the photos; the agent builds the intake structure.** 7.0 is
   a "you supply / I structure" gate — the gather-dependent columns (bay frame, awning,
   roll gate) cannot generate until the photos land.
2. **Material taxonomy → reconcile to real Greenpoint materials.** One shared taxonomy;
   Phase 7 *defines* it, Phase 8 makes the classifier emit it.
3. **Done-line → assets/data only, no renderer wiring.**
4. **Color binding → contract only.** Define the rule and structure the palette; no
   per-building authoring, no derivation in Phase 7.
5. **Component columns → audited against the II-C library.** Roll gates and a
   weathering/truth-texture layer are added; they were missing from the first cut.
6. **Material rows → keep all 6.**
7. **Weathering/truth-texture layer → in** (minimal).

## The grid

Phase 7 is a **material (rows) × component-layer (columns)** grid, generated cell by cell
where the cell is real (sparse, not full).

### Rows — canonical material families (7.1)

Defined as a data artifact (e.g. `src/data/materials/material-families.v0.1.json`) + a
doc section. The classifier rewrite to emit these is Phase 8.

| Family | Status | Note |
|---|---|---|
| `brick` | v1 exists | the four current components |
| `clapboard` | new | wood-frame row houses — non-negotiable |
| `brownstone` | new | limited but present on the spine |
| `painted-masonry` | new | common Greenpoint infill (stucco/painted) |
| `modern-flat` | new | newer glass + panel construction |
| `warehouse` | new | industrial brick (Eberhard Faber, creek edge) |

### Columns — component layers (audited against the II-C 8-layer model)

| Layer (II-C) | Component(s) | Reference status |
|---|---|---|
| Facade shell | wall + parapet + **cornice** | ✅ have |
| Bay frame | storefront structure (columns, beams, transom) | ❌ gather (7.0) |
| Windows / Doors | window + sill ✅, door + stoop ✅ | ✅ have |
| Awning / Gate | awning ❌, **roll gate** ❌ | ❌ gather (7.0) |
| Weathering / truth | posters, stickers, grime, cracks (minimal) | author in-style |
| Roof tone | flat typological tone per material (7.3) | tone, not photo-detail |

Existing systems that are **not** regenerated here (already realized elsewhere): the sign
band (`storefrontSigns.js`), ground plane (`groundLayer.js`), and street props
(`streetFurniture.js`).

### Valid-cell matrix (7.2)

Author the matrix of which (material × component) cells are real, so we generate only
plausible combinations — e.g. no brownstone roll-gate, no masonry cornice on
`modern-flat`, no residential stoop/awning on `warehouse`. The matrix is a data artifact
consumed by the gate and (in Phase 8) by selection.

## Components — production pipeline (per cell)

Each component follows the proven inked-kit pipeline (from the 2026-06-16 spike):

1. **Generate** tintable-neutral: dark ink on warm grey, no baked-in chroma, so the
   compose-time tint fully controls color.
2. **Alpha-key**: GPT bakes a checker/opaque background — key it to clean alpha (the
   spike's known gotcha).
3. **Register** in `assets/inked/<family>-<component>.v1.png` and add the row to
   `COMPONENT_INVENTORY.md`.
4. **Isolation-preview compose**: render the component on a test quad via
   `inkedFacadeCompose.js` rects to prove it composes and tints — *without* wiring it into
   per-building selection.

## 7.3 — Typological roof tone

A flat, quiet, multi-angle-safe roof tone per material family (the four-angle camera
reveals rooftops). NOT detailed roofs — a tone + faint grain only, drawn from
`MASSING.roofCap`-class tokens. Closes the rotated-view rooftop gap.

## 7.4 — Color-binding contract (spec only)

Answers the requirement: *a building's tint must track its true real-life color, snapped
to the nearest in-palette token (a black building reads black-adjacent).*

Phase 7 delivers:
- A written **rule**: `trueColor → nearestPaletteToken(material, role)`, where the
  candidate token set is constrained to the building's material family and component role
  (so snapping can't jump out of the material's plausible range).
- **Palette structure** in `src/visualSystem/palette.js` to support nearest-token
  lookup (tokens grouped/indexed so a nearest-in-palette query is well-defined and
  every candidate is already a no-miss palette color).

Phase 7 does **not** author per-building color values or build the dominant-color
sampler — both are Phase 8.

## 7.5 — Conformance (the gate)

Every new component must:
- Be **palette-clean**: tintable-neutral, no out-of-token baked color (6.2.3 color check).
- Be **alpha-correct**: clean keyed alpha, no checker residue.
- **Compose** in the isolation preview (rects from `inkedFacadeCompose.js`).
- Leave existing renders **unregressed** (per-material regression screenshots stay green
  because nothing is wired into building selection yet).
- Be listed in `COMPONENT_INVENTORY.md` with module + color source.

## Deliverables

- `src/data/materials/material-families.v0.1.json` — the 6-row taxonomy + valid-cell matrix.
- Reference sets for awnings, storefronts, roll gates (evidence-library layout).
- `assets/inked/<family>-<component>.v1.png` — the generated, keyed component grid.
- Roof-tone tokens/assets per family.
- Color-binding contract section (this doc + palette.js structure).
- Updated `docs/COMPONENT_INVENTORY.md`.
- Isolation-preview harness for compose verification.

## Risks / watchouts

- **Style drift across families** — the spike's #1 risk. Mitigation: generate all
  families from one reference scaffold + the same tintable-neutral rule; gate each.
- **Sparse-grid temptation to over-generate** — the valid-cell matrix is the guard.
- **Weathering layer can dirty the palette** — keep it minimal and palette-clean; it is
  ink/grain, not new color.
- **Color contract over-reach** — explicitly contract-only; resist building derivation.
- **Taxonomy/classifier divergence until Phase 8** — the taxonomy exists as data before
  the classifier emits it; acceptable because Phase 7 ships no selection change.

## Open questions

None blocking. Per-building color authoring, the dominant-color sampler, the classifier
rewrite, and spine re-render are all explicitly Phase 8.
