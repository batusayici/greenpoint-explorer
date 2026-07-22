# Inked Components — Clapboard SHINGLE sub-type v1

Generation packet. The shipped clapboard slice covers horizontal-lap siding; this adds the
**shingle wall sub-type** (the one carryover cell from the pilot). Shingle reuses the
clapboard family's window / cornice / door-stoop / weathering — only the WALL differs, so
this packet is a single component.

Naming: ship as `assets/inked/clapboard-shingle-wall.v1.png` (a wall variant within the
clapboard family). When pixels land, add a `wall` variant note in the component inventory;
no new family row.

Style anchors (attach): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

GLOBAL STYLE (prepend in place of the leading `"...`): "Hand-inked editorial illustration
in the exact style of the attached reference boards: confident dark ink outlines,
hand-hatched shadow, visible paper grain, flat orthographic elevation, no perspective.
TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill (approximately #EDE8E0)
ONLY — no saturated color. No sky, no ground, no neighbors."

## 1. Shingle wall — assets/inked/clapboard-shingle-wall.v1.png  (1024×1024, seamless tile)
"...a SEAMLESS TILING wood-shingle siding swatch: overlapping rows of wooden shingles with
inked bottom edges and faint vertical breaks between shingles, light hand-hatched
weathering. Offset the joints row to row (running pattern). Must tile cleanly on all four
edges (top maps to bottom, left maps to right). Shingles only, no windows, no building
edges."
Structure refs: `facade material/clapboard (wood-frame)/` — `shingle_0745`, `shingle_0746`,
`shingle_0750` (scalloped fish-scale), `shingle_0731`.

> Optional second variant: `shingle_0750` is SCALLOPED fish-scale — if a decorative
> Victorian shingle is wanted later, generate a separate `clapboard-fishscale-wall.v1.png`
> from `shingle_0750` alone. Out of scope for this pass unless requested.

---
## Background rule
N/A (wall is opaque, full-bleed — no keying needed beyond the tintable-neutral check).

## Post-generation QA
- Tile 2×2 → no seam at top↔bottom and left↔right; shingle courses align across the join.
- Fill reads neutral warm grey ≈ #EDE8E0, no baked chroma; survives multiply tint.

## Alpha-key threshold
- shingle-wall: opaque tile, no key (run `verify-inked-component.mjs` for the neutral check).
