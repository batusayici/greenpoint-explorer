# Franklin Block Punch-List — Phased Plan

> Source: Batu review feedback (2026-06-17) after the inked-storefronts v1 landed.
> Branch: `feat/inked-facade-look` (kept; not merged). Builds on the storefront kit.

This is a **phase-level** plan (approach + files + checkpoints per phase). Bite-sized
steps are detailed at the start of each phase as it's executed, with in-engine
verification between phases — several items are visual calibration, not one-shot code.

## Confirmed decisions (Batu, 2026-06-17)
- **99 (BIN 3064799)** splits into **two storefront units**: SANDWICH (Compton's, corner side) + JUICE BAR (Juice's). New multi-tenant capability on one footprint.
- **97 (BIN 3064800)** is the **corner bodega** ("97 Deli & Grill"); storefront **wraps both street faces**, entry at the corner. Was previously the generic stoop.
- Category labels only (BODEGA / SANDWICH / JUICE BAR / BAR / VINTAGE) — no real names.

## Corrected storefront map (from field photos)
| BIN | Addr | Treatment |
|-----|------|-----------|
| 3064800 | 97 (corner) | **BODEGA**, wraps both faces, corner entry |
| 3064799 | 99 | **SANDWICH + JUICE BAR** (split) |
| 3064798 | 101 | residential |
| 3064797 | 103 | residential |
| 3064796 | 105 | **BAR** (Broken Land) |
| 3064795 | 107 | **VINTAGE** (Awoke) |

---

## Phase A — Corrections (quick, low-risk)
**Items #7, #8.**

- **#7 Delete oversized flat fire escape.** Remove the fire-escape block in `decorateInkedWall` (`src/SceneView.jsx:1922–1933`) and the now-unused `fireEscape: true` flags in `INKED_FACADE_REAL` (3064795/3064797/3064799). Real fire escapes return later as proper geometry if wanted — the current flat one reads wrong.
- **#8 Sign letters must not stretch.** `makeStorefrontSignTexture` builds a fixed 512×128 (4:1) canvas; the sign quad is ~25:1 in world → letters distort. Fix: pass the sign quad's world aspect ratio into the generator and size the canvas to match (or letterbox the text), so the mapping is 1:1. Apply for every storefront label.

**Checkpoint:** screenshot a sign close-up; confirm undistorted letters, no fire escape.

---

## Phase B — Street-face awareness (foundational)
**Item #4** — "no windows on side facades unless corner."

- Bring hero-style edge classification to inked buildings. In `buildBuildings`, before decorating, classify each inked building's footprint edges against `scene.franklinAxis` / `greenpointAxis` (reuse/port `classifyHeroEdges`, `sceneFrame.js:206–225`) into `front` (street) / `side` / `rear`.
- Mark corner buildings (97) — a building with **two** street-aligned faces (or an explicit `corner: true` in `INKED_FACADE_REAL`).
- Pass `edgeRole` + `isCorner` into `decorateInkedWall` (currently called per-edge). Rule:
  - **Street face(s):** full treatment (windows, storefront, cornice).
  - **Side/rear faces, non-corner:** brick wall + cornice only — **no windows, no storefront**.
  - **Corner building:** both street faces get full treatment.

**Checkpoint:** rotate through the 4 iso angles (`?a=0..3`); confirm side walls are blank brick, street faces keep windows, 97 keeps windows on both faces.

---

## Phase C — Storefront expansion
**Item #3** — bodega + sandwich shop.

- **97 BODEGA (corner wrap):** add `storefront` to 3064800 with `corner: true`; render the bodega storefront on both street faces (depends on Phase B corner handling). Dark "BODEGA" awning + glazing + corner entry.
- **99 split (SANDWICH + JUICE BAR):** extend `composeStorefront` / `decorateStorefront` to accept an array of units that subdivide the frontage horizontally (e.g. `units: [{label:"SANDWICH", frac:0.5, …}, {label:"JUICE BAR", frac:0.5, awning:{has:true,color:0xd98a2b}, …}]`). Each unit gets its own glazing/sign/awning; they share the bulkhead line.
- Relabel: 3064799 becomes the two-unit frontage (sandwich corner-side, juice outer).

**Checkpoint:** screenshot 97 corner + 99 frontage; confirm bodega wraps, sandwich+juice read as two shops, labels correct.

---

## Phase D — Color truth
**Items #5, #2.**

- **#5 True per-building brick color.** Re-sample the dominant brick color from each field photo (script: average a clean brick region, EXIF-corrected) and update `tint` per BIN. Color is the main recognizability lever, so get it close to the photo.
- **#2 Cornice true color.** Today the cornice is `darken(tint, 0.55)` (reads as shadow). Greenpoint cornices are usually painted a distinct (often lighter/contrasting) color. Add a per-BIN `corniceColor` sampled from photos; default to a sensible painted tone rather than tint-shadow.

**Checkpoint:** side-by-side the block vs the photos; confirm each building's brick + cornice color is recognizable.

---

## Phase E — Size truth (procedural ↔ hero)
**Item #6** — consistent brick & window size.

- Measure a hero (e.g. Premier) for real-world brick course height and window dimensions (from its facade spec rects + the generated elevation, converted via `upm = 0.075 units/m`).
- Adjust the procedural side to match: the `brick-wall.v1.png` tiling (`[bays, storeys]`) so a brick course is the same world height as the hero's, and `composeInkedFacade`'s `winWFrac`/`winHFrac` so window world size matches. Where a building abuts a hero, the courses/windows should line up in scale.

**Checkpoint:** frame a procedural building next to Premier; confirm brick course + window sizes read consistent.

---

## Phase F — Depth: recesses & projections
**Item #9** — biggest geometry change; done last on a stable base.

- Inked windows/doors are flat quads. Rebuild them as **recessed** openings: window pane inset behind the wall plane with tinted reveals (jamb/lintel/sill), mirroring `facadeAssembly.js`'s hero recess (`recessM ≈ 0.14`) but built with `quad3` in the inked path.
- Add **projections:** proud cornice (already slightly proud — give it real projection), window sills/lintels, and storefront cornice/sign-band projection. Keep the storefront awnings already done.

**Checkpoint:** grazing-angle screenshot; confirm windows read as recessed and cornice/sills cast depth, no z-fighting.

---

## Sequencing rationale
A (quick wins) → B (face awareness, unlocks C's corner) → C (storefronts) → D (color) → E (size) → F (depth). D/E/F are calibration-heavy and iterate in-engine. Each phase ends green (build + storefront unit tests) and commits.
