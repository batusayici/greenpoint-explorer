# Inked Components — Brick System, fill components v1

Generation packet (Phase 7.2 fan-out). Extends the shipped brick set
(`wall, cornice, window, ground`) with the two remaining cells whose references exist now:
**door-stoop, weathering.** Brick's `bay-frame / awning / roll-gate` stay blocked on
gather (intake JSON). Use the same anchors / GLOBAL STYLE / background rule as
`inked-components-brick.v1.md` — repeated here for a self-contained run.

Style anchors (attach to EVERY prompt): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

GLOBAL STYLE (prepend in place of the leading `"...`): "Hand-inked editorial illustration
in the exact style of the attached reference boards: confident dark ink outlines,
hand-hatched shadow, visible paper grain, flat orthographic elevation, no perspective.
TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill (approximately #EDE8E0)
ONLY — no saturated color. No sky, no ground, no neighbors."

Material truth: `facade material/brick/` (red + buff Greenpoint brick; `IMG_0715` red,
`IMG_0714` buff, `IMG_0707` grey-roman, `IMG_0716` weathered swatches).

## 1. Door + stoop — assets/inked/brick-door-stoop.v1.png  (768×1024, FLAT-SOLID keyable bg)
"...a brick-rowhouse entry: a low-to-medium stoop of steps with side cheek-walls rising to
a panelled door with a transom, simple brick or stone surround, all inked, BOLD dark
outlines, hand-hatched stair shadow. Draw ONLY the stoop + door unit as an alpha decal;
around it is flat near-white background. The bottom edge is the sidewalk line — the lowest
step sits ON it, fully opaque, not ragged."
Structure refs: `door:stoop/` — `IMG_0717`, `IMG_0734` (classic rowhouse stoops),
`IMG_0746` (door + canopy), `IMG_0700`.

## 2. Weathering — assets/inked/brick-weathering.v1.png  (1024×1024, tileable overlay, ink/grain only)
"...a SEAMLESS TILING weathering overlay for brick: efflorescence haze, faint mortar
erosion, soot streaking below sills/ledges, occasional spalled face — INK AND GRAIN ONLY,
very low contrast, NO fill color and NO solid shapes (multiplies over the tinted wall).
Tiles cleanly on all four edges."
Structure refs: `weathering/` — `IMG_0738`, `IMG_0739`, `IMG_0749` (peeling/streaked on
brick), `IMG_0705`/`IMG_0706` (stucco spalled to brick).

---
## Background rule (door-stoop)
FLAT UNIFORM near-white background (no checkerboard/gradient/texture); key with
`scripts/key_inked_alpha.py`. BOLD DARK outlines required.

## Post-generation QA
- **Weathering:** tile 2×2 → seamless top↔bottom + left↔right; ink/grain only, no fill.
- **Door-stoop:** after keying, alpha = 0 background, no ink bleed; base fully opaque.
- **Both:** fill reads neutral warm grey ≈ #EDE8E0, survives multiply tint.

## Alpha-key thresholds (fill in after generation; default 236)
- door-stoop: ___ · weathering: ___

## Blocked (no refs)
- bay-frame, awning, roll-gate — awaiting Batu-supplied photos.
