# Recess editor: add / delete recess

**Date:** 2026-06-23
**Branch:** feat/inked-facade-look

## Goal

The facade recess editor (`?facadeedit=1`) can move, resize, re-depth, and
re-shape existing recesses, but cannot create a new one or remove an existing
one — those edits require hand-authoring the spec JSON. Add in-editor
**Add** and **Delete** for the two openings placed most often: windows and
doors.

## Scope

- **Add:** window, door only. Storefront / box / signBand / bay / cornice stay
  author-by-JSON (low frequency, special-case defaults).
- **Delete:** window, door only. Selecting any other kind shows no delete
  affordance and the Delete key is inert for it — cornice/bay can't be nuked.

## Data model (recap)

A face spec flattens (via `listEditableRecesses`) into items keyed by `path`:
- windows → `windows.rects[i]`, sharing one `windows.recessM`
- doors → `doors[i]`, each with its own `recessM`
- (storefronts/boxes/signBands arrays; bay/cornice singletons — out of scope)

## Design

### Pure functions — `src/dev/facadeSpecPatch.js`

`addRecess(faceSpec, kind) -> { spec, id }`
- `kind === "window"`: ensure `windows` object + `windows.rects` array exist
  (seed `recessM: 0.14` when creating `windows` fresh); push default rect
  `{ x0: 0.45, x1: 0.55, y0: 0.40, y1: 0.60 }`. New id `window-${newIndex}`.
- `kind === "door"`: ensure `doors` array exists; push grounded default
  `{ x0: 0.45, x1: 0.55, y0: 0, y1: 0.30, recessM: 0.12 }`. New id
  `door-${newIndex}`.
- Immutable (`structuredClone`); coords rounded to 3dp like the other patches.
- Returns the new item `id` so the editor auto-selects it.

`deleteRecess(faceSpec, path) -> spec`
- Navigates to the parent array of `path` and splices out the element.
- Acts only on array-backed paths (`["windows","rects",i]`, `["doors",i]`).
- For singleton paths (`["cornice"]`, `["bay"]`) returns the spec unchanged —
  defensive no-op so a stray Delete can't destroy them.
- Immutable.

### UI wiring — `src/components/dev/FacadeRecessEditor.jsx`

- **Add control** in the header row: `+ window` and `+ door` buttons. Click →
  `addRecess` → `updateSpec(next.spec)` (live-rebuilds the 3D via the existing
  `scheduleRebuild`) → `setSelected(next.id)`. The new box lands centered and
  is immediately draggable.
- **Delete affordances** for a selected window/door:
  - small `✕` on the box corner (only rendered when kind is window/door),
  - a `Delete` button beside the rect readout,
  - `Delete` / `Backspace` key — guarded so it fires only when the selected
    item's kind is window or door.
  - After delete → `setSelected(null)`.

## Testing — `src/dev/facadeEditor.test.mjs`

- add window into an empty face creates `windows.rects` + default `recessM`.
- add window into a face that already has windows appends (index/id correct).
- add door into empty / existing face; default grounded rect + `recessM`.
- returned `id` matches the new item's id from `listEditableRecesses`.
- add is immutable (original spec untouched).
- delete splices the correct index from `windows.rects` and from `doors`.
- delete on a singleton path (`["cornice"]`) returns spec unchanged.
- delete is immutable.

## Out of scope

- Adding/removing storefronts, boxes, sign bands, bay, cornice.
- Undo/redo (Revert already restores the last-saved spec).
