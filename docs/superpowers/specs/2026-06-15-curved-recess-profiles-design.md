# Curved recess profiles (arched + circular openings)

**Date:** 2026-06-15
**Status:** approved — ready for implementation plan
**Driver:** 144 Franklin (BIN 3064675) — 1895 Romanesque Revival — introduces giant
round-arch 2nd-floor windows, circular oculi at the 3rd floor, and rusticated
ground-floor arched openings. The facade recess system only models axis-aligned
rectangles, so these read as square recesses with flat lintels against the
inked artwork.

## Problem

Every opening in `facadeAssembly.js` is a rect `{x0,x1,y0,y1}`:
`rectMesh` drops a flat pane at `-recessM`, `addReveals` bridges the wall plane
to it with four straight jamb quads, and `complementRects` masks the wall as
everything that is *not* an opening rect.

Consequences for curved openings:
- An **arched window** recesses its full bounding rect — the spandrel corners
  above the arch get pushed back, and the top reveal is a flat lintel across the
  crown. The arch is only painted, never cut.
- An **oculus** recesses as a square.

144 Franklin needs two new opening profiles, on both the window and door render
paths: **round-arch** (rect body + arched cap) and **circle** (oculus).

## Decisions (locked)

- **Geometry approach:** curved recessed pane + flush corner/spandrel fillers,
  with **straight reveals only** (jambs + sill on the straight lower portion of
  an arch; none on the circle). No tessellated archivolt / oculus ring.
- **Accepted tradeoff:** the curve where the recessed pane meets the flush
  filler has no bridging soffit, so a thin seam may show at the recess depth
  (~0.12 m). Acceptable to ship and iterate. A curved ring is a clean follow-up.
- **Scope:** 2nd-floor round-arch windows, 3rd-floor oculi, and ground-floor
  arched openings (arch profile must work on the door path too).
- **Authoring:** all in one pass — geometry + spec fields + `?specdebug=1`
  overlay + recess-editor curve handles.
- **Default `springY`:** box midpoint `(y0+y1)/2` — a starting value the author
  drags onto the painted spring line in the editor.

## Spec schema — bump `facade-spec.v0.5` → `v0.6`

A window or door rect gains an optional `shape`:

| `shape`            | meaning                                              | extra fields        |
|--------------------|------------------------------------------------------|---------------------|
| `"rect"` (default) | current behavior, unchanged                          | —                   |
| `"arch"`           | rectangular body `y0..springY` + arched cap to `y1`  | `springY` (opt)     |
| `"circle"`         | oculus filling the bounding box                      | —                   |

- The bounding box `{x0,x1,y0,y1}` always defines the opening extent; `shape`
  reinterprets what is rendered inside it.
- **Arch cap** = half-ellipse in *face-coords*: center `((x0+x1)/2, springY)`,
  spanning to crown `y1`, semi-width `(x1-x0)/2`. Tessellating in face-coords
  (not world-meters) means the cap registers to *whatever arc the artwork
  painted* — round or segmental — because the painting, sampled by the same
  `(x,y)→u` UV mapping, defines what the eye reads. No forced geometric
  semicircle.
- `springY` defaults to `(y0+y1)/2` when omitted.
- Backward compatible: a rect with no `shape` is `"rect"`.

## Geometry — `facadeAssembly.js`

Deep, pure boundaries; curve math lives in exactly one place.

- **`openingProfile(rect)`** — pure. Returns the ordered silhouette points
  (face-coords, closed loop) plus the filler regions (arch: two spandrel
  triangles; circle: four corner regions). The only home for arc/ellipse math.
  Unit-testable in isolation.
- **`profileMesh(frame, profile, offset, material)`** — triangulated pane from a
  profile (generalizes `rectMesh`). UVs come from each vertex's `(x,y)` via the
  existing `u(x)` mapping, so the painted window registers on the recessed pane.
- **`fillerMeshes(frame, rect, profile, texture)`** — spandrel/corner regions
  rendered **flush at offset 0**, textured with the wall artwork, so the wall
  stays flush where the curve cuts in.
- **Reveals:** reuse `addReveals` for the straight edges only — arches get
  left/right jambs + sill spanning `y0..springY`; circles get none. The curved
  head/ring is pane-only (locked tradeoff).
- **Dispatch:** in the window and door loops, `rect.shape === "arch" | "circle"`
  routes through the profile path; absent/`"rect"` keeps the current path
  byte-for-byte.
- **`complementRects` is untouched** — it still masks the bounding rect as a
  hole; the flush fillers re-cover the corners. Arc tessellation segment count:
  a single module-level constant (start 20), tunable later.

## Overlay — `?specdebug=1`

The debug outline loop draws the actual profile polyline (arc/circle) for
shaped openings instead of a rect `LineLoop`, so registration against the
painted opening is checkable in 3D. Rects are unchanged.

## Recess editor — `?facadeedit=1` / Shift+E (`FacadeRecessEditor.jsx`, `facadeSpecPatch.js`)

- `listEditableRecesses` threads `shape` / `springY` onto window and door items
  (alongside the existing bounding rect; `rectOf` still supplies the drag box).
- Panel: a **shape selector** (rect / arch / circle) for the selected
  window/door, plus, for arches, a **spring-line control** — a draggable
  horizontal line inside the box and a numeric/slider fallback.
- Box overlay: render an SVG arc/circle inside the rect box so the curve is
  visible over the painted texture while dragging.
- New immutable helpers `patchShape` / `patchSpring`. `patchRecess` already
  preserves non-coordinate keys (it spreads `...node[i]`), so moving/resizing a
  shaped opening will not drop `shape`/`springY`.

## Testing

- **Unit (`openingProfile`):** closed loop; expected point counts per segment
  setting; arch crown at `y1` and tangent/spring at `springY`; a width = 2 ×
  cap-height arch yields a registered semicircular silhouette; circle symmetry
  about both axes; `"rect"`/absent shape returns the four rect corners with no
  fillers.
- **In-engine:** load 144 Franklin → `?specdebug=1` overlay + screenshot to
  confirm the arc/oculus outlines sit on the painted openings → recess-editor
  pass to register the arches/oculi to the texture → screenshot of the final
  recessed result.

## Out of scope (follow-ups)

- Curved archivolt soffit / annular oculus reveal ring (closes the seam).
- Pointed/Gothic or Tudor arch profiles (only round/segmental + circle now).
- `derive-facade-spec.mjs` auto-detection of curved openings.
