# AI Inked Infill Tile — Feasibility Spike (Design)

Date: 2026-06-16
Status: Approved (design); spike not yet executed
Owner: Batu (taste/approval) / Agent (execution)
Branch: `feat/inked-facade-look`

## Context

The project's approved look is the **II-C Inked Indie Visual System** (hand-inked
editorial illustration — see `docs/ART_DIRECTION.md`). In practice the scene
drifted into the documented *fallback* look: heroes render as bespoke
**photo-real** GPT-5.5 textures, and non-hero buildings get a **flat-color
typological** treatment (`decorateTypologicalWall` in `SceneView.jsx`) — neither
of which is inked. The Phase 2.5 (NPR pass) and Phase 2.6 (look gate) steps were
never executed, so no single visual language governs the scene.

**Look gate decided (2026-06-16):** the whole scene speaks **one inked language**.
Heroes/landmarks get bespoke renders but in the inked style (re-rendered over
time); everything else is procedurally rendered in the II-C inked system. Heroes
and infill differ in *craft tier*, not in *style*. (To be recorded in
`DECISION_LOG.md` on spike completion.)

**Technique decision:** of the three candidate techniques —
1. NPR screen-space post pass (outline + paper grain + palette grade),
2. procedural canvas-drawn inked facade textures,
3. AI-generated inked facade tiles (image-to-image kit) —
Batu chose to **try #3 first; fall back to #1 if #3 doesn't satisfy.** This
document specs only the **feasibility spike** for #3, not a full system.

## Goal

Prove or kill technique #3: can the AI pipeline produce a **generic, reusable**
facade tile in the II-C inked language that, mapped onto typological massing,
reads as hand-inked in-engine and sits believably in the II-C aesthetic? Scope
is **one tile on one or two buildings.** Throwaway code; the durable output is
the go/no-go and the reusable inked-tile prompt scaffold.

## Success criteria (judged by Batu, against the reference boards)

- Reads as **hand-inked** — outline + hatching + warm-neutral palette + paper
  grain — not photographic, not flat-shaded.
- Holds up at the four fixed iso angles and at map-scale zoom.
- Does not clash so badly with the existing ground layer, signage, and the
  photo-real heroes that the direction is hopeless. (Heroes are expected to look
  off-style for now; that is a known, separate track.)

## Approach

A tight collaborative loop (image generation is an external GPT-5.5 render from a
prompt scaffold; the agent crafts the prompt and wires the result in):

1. **Inked-tile generation prompt (agent).** Author a prompt for a *generic*
   Greenpoint brick rowhouse facade module — one common typology: **4-storey,
   3-window-wide, ground-floor storefront.** Style-anchored to
   `docs/reference/art/II-C-style-system-tile.png` plus the two approved boards
   (`inked-indie-compact-corner-style-frame-revision-a.png`,
   `II-assembled-mini-scene.png`). This is **style-driven, not photo-driven**
   (no specific real building); the tile must read as one repeatable module.
   Reuse the GENERATION_KIT prompt-scaffold conventions where they apply
   (mechanical slots only; let the model draw the architecture in the inked
   style from the reference boards).
2. **Render (Batu).** Render externally; drop the PNG in `assets/`. The agent
   provides the exact prompt text and canvas size.
3. **Engine wiring (agent).** Map the tile onto 1–2 matching context buildings
   beside the Franklin corner, scaled to storeys/width, **replacing their flat
   `decorateTypologicalWall` treatment for the test only.** Minimal, reversible
   plumbing — not a new subsystem.
4. **In-engine capture (agent).** Screenshot at the iso angles, side-by-side
   with the reference boards.
5. **Decision (Batu).**
   - Tile look good → green-light the **full procedural AI-tile kit** (new spec).
   - Tile look misses → pivot to the **#1 NPR post-pass** as the next spike.

## Out of scope (YAGNI for the spike)

Multiple typologies; a tile *library*; hero re-rendering; seam/atlas management;
the NPR post pass itself; texture caching/atlasing. All deferred to whichever
full-system spec wins after the spike.

## Deliverables

1. A **go/no-go** decision on AI inked tiles.
2. The **reusable inked-tile prompt scaffold** (kept regardless of outcome).
3. Throwaway wiring on 1–2 buildings (removed or productionized depending on the
   decision).
4. A `DECISION_LOG.md` entry recording the look-gate decision and the spike
   result.

## Risks

- **Style drift / not-inked output:** the model may return a stylized-photo
  rather than true ink. Mitigation: anchor hard to the system tile; the success
  criteria are explicit; this is exactly what the spike exists to surface.
- **Tiling/scale mismatch:** a single tile won't fit every floor count.
  Mitigation: pick test buildings matching the tile's typology; per-storey
  scaling deferred to the full-system spec.
- **Heroes clash:** expected and accepted for the spike; the eventual unifier is
  either re-rendered inked heroes or the #1 NPR pass.
