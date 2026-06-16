# AI Inked Component Kit — Feasibility Spike (Design)

Date: 2026-06-16
Status: Approved (design); spike not yet executed
Owner: Batu (taste/approval) / Agent (execution)
Branch: `feat/inked-facade-look`
Supersedes: `2026-06-16-ai-inked-infill-tile-spike-design.md` (whole-building tile
approach — abandoned for the modular component kit below).

## Context

The project's approved look is the **II-C Inked Indie Visual System** (hand-inked
editorial illustration — see `docs/ART_DIRECTION.md`). In practice the scene
drifted into the documented *fallback*: heroes render as bespoke **photo-real**
GPT-5.5 textures, and non-hero buildings get a **flat-color typological**
treatment (`decorateTypologicalWall` in `SceneView.jsx`). Neither is inked.

**Look gate decided (2026-06-16):** the whole scene speaks **one II-C inked
language**. Heroes/landmarks get bespoke renders but in the inked style
(re-rendered over time); everything else is procedurally rendered in the inked
system. Heroes and infill differ in *craft tier*, not in *style*. (To be recorded
in `DECISION_LOG.md` on spike completion.)

**Scalability decision (2026-06-16):** non-hero facades are built from a **modular
inked component kit**, not whole-building tiles. Batu's domain fact: ~80% of
Greenpoint is **four facade systems** — brick, wood-frame/clapboard, brownstone,
modern — recolored and recombined. Whole-building tiles are combinatorially
explosive (system × color × storeys × width × ground-floor) and stretch wrong on
the next building. A small library of inked **components** (wall materials,
windows, cornices, doors/stoops, storefronts) recombines infinitely, driven by
`buildingTypology.js`, and reuses the existing `facadeAssembly.js` composition
architecture (which already assembles openings/cornices/awnings onto massing — we
swap flat/photo parts for inked parts).

**Color decision (2026-06-16):** components are generated in a **tintable neutral
form** (dark ink lines + light/grey fill); material color (brick red, clapboard
cream, brownstone) is applied as a **shader tint in-engine** (`MeshBasicMaterial.color`
multiplies the texture, preserving dark ink). This collapses "4 systems in many
colors" from dozens of renders to ~4 material renders + a color parameter.

**Technique decision:** of the three candidate render techniques — (1) NPR
screen-space post pass, (2) procedural canvas-drawn inked textures, (3) AI inked
assets — Batu chose **#3 first, with #1 as the fallback.** Modular components are
specifically what makes #3 worth it (generate once, recombine forever); a one-off
whole building would not justify AI. This document specs only the **feasibility
spike** for the modular #3 approach.

## Goal

Prove or kill the modular inked-component approach with the **minimum** test:
generate the inked component set for **one** material (brick), **compose one
building** from those components in-engine, and **recolor it to 2 tint variants**.
This single spike answers all three real risks at once:

1. Does the inked look hold up in-engine (look)?
2. Do GPT-generated components **compose seamlessly** into a facade (composability)?
3. Does **parametric shader tinting** of neutral inked components look right (color)?

Scope is one material on one building, two tints. Throwaway code; the durable
outputs are the go/no-go, the component prompt scaffolds, and the brick component
set.

## Success criteria (judged by Batu, against the reference boards)

- The composed facade reads as **hand-inked** — outline + hatching + warm palette
  + paper grain — not photographic, not flat-shaded.
- Components **compose without ugly seams**: wall tiles cleanly, windows/cornice/
  ground-floor sit believably, edges are clean.
- **Recolor looks right**: the two tint variants read as the same inked brick in
  different colors, with ink lines staying dark (tint multiplies, doesn't wash).
- Holds at the four fixed iso angles and at map-scale zoom.
- Does not fatally clash with the existing ground layer and signage. (Photo-real
  heroes are expected to look off-style for now — a known separate track.)

## Component set for the spike (brick only)

Generated in tintable neutral form. Four components, each its own asset:

1. **Wall** — `assets/inked/brick-wall.v1.png` — a **tileable** brick coursing
   swatch (seamless on all four edges; neutral grey + dark ink mortar lines).
2. **Window** — `assets/inked/brick-window.v1.png` — one double-hung window with
   inked lintel + sill, on a **transparent background** (alpha) so it overlays
   the wall.
3. **Cornice** — `assets/inked/brick-cornice.v1.png` — a horizontally-tileable
   bracketed/dentil cornice strip, transparent background.
4. **Ground floor** — `assets/inked/brick-ground.v1.png` — a residential parlor
   level: stoop + entry door + parlor window, full-bay-width, opaque.

## Approach

Collaborative loop (image generation is an external GPT-5.5 render from a prompt
scaffold; the agent authors prompts and wires results in):

1. **Component prompts (agent).** Author one prompt per component, all
   style-anchored to `docs/reference/art/II-C-style-system-tile.png` + the two
   approved boards, and to Batu's evidence photos of Greenpoint brick rowhouses.
   Each prompt specifies: inked II-C style, **tintable neutral** (ink + grey, no
   saturated color), the tiling/alpha requirement for that component, flat
   orthographic elevation.
2. **Render (Batu).** Render the four components externally; save to `assets/inked/`.
3. **Composition module (agent).** A pure module
   (`src/inkedFacadeCompose.js`, Node-testable) that, given a building's storeys,
   width-in-bays, and component set, returns the face-local rects for: the wall
   fill, the window grid (storeys × bays), the cornice strip, and the ground-floor
   band. No Three.js.
4. **Renderer (agent).** A thin `buildInkedFacadeTest(three, scene)` in
   `SceneView.jsx`, gated by a hardcoded BIN list, that maps the composed rects to
   world geometry: wall quad (brick texture, `RepeatWrapping` tuned to bays/
   storeys), window quads (alpha texture), cornice strip, ground-floor quad. Each
   mesh uses `MeshBasicMaterial({ map, color: tint })` so the **tint** recolors it.
   Leaves `decorateTypologicalWall` untouched.
5. **Compose + recolor (agent).** Apply to 1 building; render the same building (or
   an adjacent twin) at **two tint colors** (e.g. warm brick-red and a muted
   brown) to test recolor.
6. **In-engine capture (agent).** Screenshot at iso angles, side-by-side with the
   reference boards.
7. **Decision (Batu).**
   - Good → green-light the **full inked component kit** (new spec): the other 3
     materials, more component variants, typology-driven composition, hero
     re-render track.
   - Misses → pivot to the **#1 NPR post-pass** spike.

## Out of scope (YAGNI for the spike)

The other 3 materials (clapboard/brownstone/modern); additional component variants
(multiple cornice/window types); typology-driven auto-selection across the block;
seam/atlas optimization; hero re-rendering; the NPR post pass itself; texture
caching. All deferred to whichever full-system spec wins.

## Deliverables

1. A **go/no-go** on the modular inked-component approach.
2. The **component prompt scaffolds** (4) — durable regardless of outcome.
3. The **brick component set** in `assets/inked/`.
4. The pure **composition module** + tests (reusable if we proceed).
5. A `DECISION_LOG.md` entry: look-gate decision, modular + tint decisions, spike
   result.

## Risks

- **Alpha/transparency:** GPT may not return clean transparent backgrounds for
  windows/cornice. Mitigation: instruct explicitly; if it fails, a quick chroma-key
  script keys a flat background to alpha. Surfaced by the spike.
- **Tiling seams:** the wall swatch may not be truly seamless. Mitigation: request
  seamless explicitly; the spike's job is to reveal this.
- **Tint fidelity:** multiplying a neutral inked texture by a color may wash the
  ink or muddy the fill. Mitigation: keep components ink-dark on light-grey;
  judged in the spike's recolor step.
- **Heroes clash:** expected and accepted for the spike.
