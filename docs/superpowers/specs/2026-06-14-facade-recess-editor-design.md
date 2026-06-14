# Facade Recess Editor — Design

Date: 2026-06-14
Status: Approved (Batu, 2026-06-14)

## Problem

Recess-to-texture alignment is an ongoing per-building chore. Building footprints
are irregular and AI renders shift painted openings around, so the geometric
recesses authored in a facade spec rarely land on the painted features on the
first pass. Today the only way to correct this is to re-derive or hand-edit
normalized coordinates in the spec JSON, re-render, and eyeball — a slow,
token-expensive iteration loop.

We want a direct-manipulation tool: drag a recess until it sits on the painted
opening, drag an edge to resize it, and have the change land back in the spec.

## Domain recap

A "recess" is an **opening rect** inside a facade face spec
(`src/data/facade-specs/*.json`, keyed `BIN:role` under `faces`). Each rect is
normalized face coordinates `{x0, x1, y0, y1}` where:

- `x: 0→1` runs left→right along the drawn elevation slice
- `y: 0→1` runs ground→roofline
- plus a depth (`recessM` / `projectionM`)

`buildFacadeAssembly` (`src/facadeAssembly.js`) reads these lists
(`windows.rects`, `storefronts`, `doors`, `cornice`, `awnings`, `bay`, …),
recesses/projects each one, and fills it with the same texture region. The face's
texture is a horizontal slice `[u0,u1] × [0,1]` of a shared composite PNG
(`FACADE_COMPOSITES` in `src/SceneView.jsx`); `faceFrame` carries `u0/u1/flip`.
`spec.skewX` (currently `0` on all faces) applies a linear `lean()` so a rect at
height `y` shifts by `skewX * y` to compensate for a 3/4 drawn lean.

## Goals

- Move a recess (translate all four edges together) to snap it onto the painted
  opening.
- Resize a recess by dragging any edge or corner.
- See the 3D scene re-snap live while dragging.
- Persist the corrected coords back to the spec JSON on disk.

## Non-goals (v1)

- Editing awnings or the bay (they carry extra depth params beyond a flat rect).
- Adding or deleting rects (only move/resize existing ones).
- Multi-select, undo history beyond simple in-session state.
- Any presence in the production build — this is a dev-only tool.

## Approach (chosen)

A **flat 2D overlay editor** with a **live 3D bridge** and **dev-endpoint file
write**. (Alternatives considered: in-scene 3D drag — rejected for iso-distortion
imprecision and picking/occlusion fiddliness; hybrid click-3D-then-2D — more to
build for marginal gain over the face-picker dropdown.)

### Component 1 — Edit surface & coordinate model

- Gated by `?facadeedit=1`. A panel rendered beside (not on top of) the 3D canvas.
- A **face picker** lists every editable face across the 3 hero specs as `BIN:role`.
- For the selected face, the panel draws the texture **cropped to `[u0,u1] × [0,1]`**
  (respecting `flip`) into a `<canvas>`, sourced from the THREE texture's `.image`
  that the scene already loaded — pixel-exact, no separate fetch / URL resolution.
- Each opening rect (`windows.rects`, `storefronts`, `doors`, and the `cornice`
  band as `{x0:0, x1:1, ...cornice}`) is overlaid as an absolutely-positioned box.
- **Move:** drag the box body → translate `x0,x1,y0,y1` together.
- **Resize:** 8 handles (4 edges + 4 corners) → move the dragged edge(s) only.
- **Mapping (pure function):** panel pixel ↔ normalized `x:0→1` across the slice,
  `y:0→1` bottom→top (inverted for screen space).
- **Skew:** boxes are *drawn* at the leaned position (`x += skewX * yMid`) so they
  sit on the painted opening, but stored coords stay **un-leaned**. Identity today
  (`skewX:0`) but kept correct for future re-lean.
- Fine control: arrow-key nudge of the selected rect + a live numeric coord readout.

### Component 2 — Live 3D bridge

- In `buildHeroBuilding` (`SceneView.jsx`), tag each facade assembly group with
  `userData.faceKey = "BIN:role"`.
- Register a per-face **rebuild closure** into a small runtime registry. The
  closure captures `frame`, `texture`, `unitsPerMeter`, `baseColor` and does:
  remove the tagged group → `buildFacadeAssembly(...)` with the supplied spec →
  add the new group → request a render.
- The editor calls `registry[faceKey](workingSpecFace)` on drag, **throttled to one
  rebuild per animation frame**.
- This is the only change inside the scene code, and it is **additive**: when the
  editor is off, nothing calls the registry and behavior is unchanged.

### Component 3 — Persistence

- A **dev-only Vite middleware** (configured in `vite.config`, guarded to
  `command === 'serve'`) exposes `POST /__facade-spec`.
- Payload: `{ file, faceKey, faceSpec }`. Handler reads the target
  `src/data/facade-specs/<file>.json`, replaces `faces[faceKey]` with the patched
  face, writes it back pretty-printed (stable key order / 2-space indent matching
  existing files).
- The endpoint does not exist in `vite build` output, so nothing ships to prod.
- Editor holds a React **working copy** of the spec; **Save** POSTs it; the
  JSON-import HMR reload then matches what is already on screen.

## Data flow

1. **Load:** editor reads the current face spec (from the imported JSON / passed
   in) into a working copy; reads `texture`, `u0`, `u1`, `flip` from the face's
   registry entry to draw the slice.
2. **Drag:** update working copy → call rebuild closure (live 3D, throttled) +
   redraw overlay boxes.
3. **Save:** `POST /__facade-spec` → file written on disk.

## Module boundaries

- `src/dev/facadeCoords.js` — pure pixel↔normalized mapping + skew lean/unlean.
  Unit-tested.
- `src/dev/facadeSpecPatch.js` — patch a face spec immutably (replace one rect in
  one list). Unit-tested. Shared by editor and (logically) the write endpoint.
- `src/components/dev/FacadeRecessEditor.jsx` — the panel: face picker, canvas,
  draggable boxes, save. Depends on the two pure modules + the scene registry.
- `src/dev/facadeFaceRegistry.js` — the runtime registry of per-face rebuild
  closures + texture/u-slice metadata; written by `SceneView`, read by the editor.
- `vite-plugin-facade-spec-writer.js` — dev middleware. Depends on `fs` only.
- `SceneView.jsx` — additive: tag groups, populate the registry.

## Testing

- **Unit:** `facadeCoords` (mapping round-trip, y-inversion, skew lean/unlean),
  `facadeSpecPatch` (replace correct rect, immutability, unrelated rects untouched).
- **Behavioral / manual via browser preview:** load `?facadeedit=1`, drag a box,
  confirm (a) the 3D face re-snaps live and (b) the spec JSON on disk changes after
  Save. Failures should be loud (endpoint errors surfaced in the panel).

## Risks / open questions

- Throttled live rebuild allocates a new assembly group per frame while dragging;
  acceptable for a dev tool but dispose old geometry/materials to avoid GPU leaks
  during a long session.
- Pretty-print format must match existing spec files closely enough that the
  written diff is minimal (no spurious whole-file reformat). Confirm against
  `premier-franklin-organic.v0.1.json` before wiring Save.

## Future extensions (not v1)

- Add/delete recesses; awning (drop/valance) and bay (3D volume) handles;
  click-in-3D-to-select face; undo/redo.
