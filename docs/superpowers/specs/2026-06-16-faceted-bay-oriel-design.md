# Faceted Bay Window (3-Facet Oriel) — Design

**Date:** 2026-06-16
**Status:** Approved (design), pending spec review
**Target:** Premier Organic Corp building, Greenpoint face. Built as a reusable, opt-in capability.

## Problem

Bay windows on the corridor are not rectangular boxes. A real oriel bay is a
**trapezoid in plan**: a flat center face projecting from the wall, flanked by
two angled return facets. Reference spec-sheets show the canonical proportions:
a wall opening split into three panels (side / center / side) where the side
facets splay back to the wall at ~27.5°, and the center facet is the only
plane parallel to the wall.

Today the Premier Greenpoint bay is modeled as a **flat rectangular box** pushed
out 0.6 m: one textured front quad plus four flat-tinted perpendicular return
faces (top/bottom/left/right cheeks). See `facadeAssembly.js` ~L250-260. It
reads as a billboard, not a bay — the side windows that the artwork paints onto
the bay never fold into 3D.

## Goal

Fold the existing flat bay into a true 3-facet oriel so the painted side
windows wrap onto the angled returns, with **no texture re-render** and **no
regression** to any bay that does not opt in.

## Decisions (locked)

1. **Texturing — fold the existing texture.** The painted elevation already
   contains the three window panels side-by-side. Each facet samples its own
   sub-range of the current `rectUv` mapping; foreshortening is purely
   geometric. No re-render.
2. **Geometry — reference proportions.** Center facet = `centerFraction` of the
   opening (default `0.36`), side facets split the remainder evenly. Splay angle
   is *emergent* from `centerFraction` + `projectionM` + face width — not
   specified directly. Premier keeps its existing `projectionM: 0.6`.
3. **Scope — reusable opt-in plan.** New `bay.plan: "oriel3"` flag in the facade
   spec. Absent `plan` → current flat-box path, unchanged.
4. **Caps — flat-tinted dark.** Trapezoidal top/bottom lids are solid dark tint
   (cornice-shadow / soffit), matching the current bay top/bottom. Not textured.

## Spec change

Extend the `bay` block in
`src/data/facade-specs/premier-franklin-organic.v0.1.json`:

```json
"bay": {
  "x0": 0.322, "x1": 0.479, "y0": 0.266, "y1": 0.895,
  "projectionM": 0.6,
  "plan": "oriel3",
  "centerFraction": 0.36
}
```

Both new fields are optional. `plan` omitted (or any value other than
`"oriel3"`) ⇒ existing flat-box rendering. `centerFraction` defaults to `0.36`
when `plan === "oriel3"` but unset.

## Geometry

All coordinates are face-local normalized `(x, y)` with a projection `offset`
along `frame.normal`, transformed by the existing `facePoint(frame, x, y, offset)`.

Let:
- `proj = meters(bay.projectionM ?? 0.5)`
- `c = bay.centerFraction ?? 0.36`
- `side = (1 - c) / 2`
- `xc0 = x0 + side * (x1 - x0)` — center facet left edge
- `xc1 = x1 - side * (x1 - x0)` — center facet right edge

Wall-opening corners sit at `offset = 0` (x0, x1). Front-facet corners sit at
`offset = proj`, inset to (xc0, xc1). This produces the trapezoid: wide at the
wall, narrow at the front.

### Facets (5 quads)

| Facet        | Corners (x @ offset)                                   | UV strip      | Material |
|--------------|--------------------------------------------------------|---------------|----------|
| Left return  | (x0 @0, y0)→(xc0 @proj, y0)→(xc0 @proj, y1)→(x0 @0, y1) | u[x0 … xc0]   | textured |
| Center front | (xc0 @proj)…(xc1 @proj), y0→y1                          | u[xc0 … xc1]  | textured |
| Right return | (xc1 @proj, y0)→(x1 @0, y0)→(x1 @0, y1)→(xc1 @proj, y1) | u[xc1 … x1]   | textured |
| Top cap      | trapezoid lid at y1: (x0@0, xc0@proj, xc1@proj, x1@0)   | —             | tint dark|
| Bottom cap   | trapezoid lid at y0: (x0@0, xc0@proj, xc1@proj, x1@0)   | —             | tint dark|

The old perpendicular left/right cheeks (`bridgeMesh … "left"/"right"`) are
**removed** for `oriel3` bays — the angled return facets replace them. Top and
bottom become trapezoidal caps (4-point quads, not the current edge bridges).

### UV mapping

Each textured facet uses the existing `rectUv`-style horizontal mapping:
`u(x) = frame.u0 + (frame.u1 - frame.u0) * x`, with `v = y`. Because each facet
samples a contiguous sub-range of the bay's texture strip and shares edge u
values at the seams (xc0, xc1), the painted artwork stays registered across the
fold — the side windows land on the returns, the center window on the front.

## Implementation surface

New code lives in `src/facadeAssembly.js`:

- A guard in the existing `if (bay)` block: `if (bay.plan === "oriel3")` →
  call a new `oriel3Meshes(frame, bay, projection, texture)` builder; else the
  current flat-box path (verbatim, untouched).
- `oriel3Meshes` returns the 5 meshes above, reusing `quadGeometry`,
  `facePoint`, `texturedMaterial`, `tintMaterial`. Top/bottom caps need a small
  helper for the 4-point trapezoid lid (or inline `quadGeometry` with the four
  facePoints; no UV).
- Tints reuse the current bay constants: caps `0x352c22` (top) /
  `REVEAL.soffit` (bottom).

Deep module: the bay's plan complexity is hidden behind the single
`plan: "oriel3"` flag + `centerFraction`. Callers (scene assembly) are
unaffected; the spec is the only interface.

## Edge cases / failure modes

- **`centerFraction` out of range** (≤0 or ≥1): clamp to a safe band (e.g.
  [0.1, 0.9]) so `side` stays positive and the trapezoid never inverts.
- **Texture absent**: textured facets fall back to tint (same as current
  `texturedMaterial` behavior when `texture` is null) — bay still reads as a
  solid faceted volume.
- **Z-fighting** at the wall seam (x0/x1 @ offset 0 coincide with the wall
  plane): the return facets share the wall-plane edge exactly; verify no
  flicker. If present, inset the wall edge by a hair of projection.
- **Normals / winding**: caps and returns must wind outward so back-face
  culling (active in Scene) keeps them visible from the iso angles. Verify
  with `computeVertexNormals` results at all 4 iso camera angles.
- **Other bays unchanged**: any spec without `plan: "oriel3"` must produce
  byte-identical geometry to today.

## Verification

1. Build passes (`npm run build`).
2. Scene mode, Premier Greenpoint face, all 4 iso camera angles:
   - bay reads as an angled oriel with visible side returns;
   - painted side windows land on the returns, center window on the front;
   - no z-fighting against the wall, no gaps at cornice/soffit;
   - back-face culling leaves no facet missing at any angle.
3. Regression: a building with a plain (non-oriel) bay renders unchanged.
4. Capture a Scene snapshot for the build log.

## Out of scope (YAGNI)

- Photo-measured Premier proportions (params are data; swap later).
- N-facet (5/7-sided) bays — only the 3-facet oriel.
- Applying `oriel3` to other buildings (capability exists; not wired here).
- Per-facet vent/fixed window modeling beyond what the texture already paints.
