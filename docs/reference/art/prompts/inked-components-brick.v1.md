# Inked Components — Brick System v1

Style anchors (attach to EVERY prompt): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

GLOBAL STYLE (prepend to each): "Hand-inked editorial illustration in the exact
style of the attached reference boards: confident dark ink outlines, hand-hatched
shadow, visible paper grain, flat orthographic elevation, no perspective.
TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill (approximately #EDE8E0)
ONLY — no saturated color (color is applied later in-engine). No sky, no ground, no
neighbors."

**Prepend instruction:** When submitting any component prompt below, paste the full
GLOBAL STYLE text above at the very start of your prompt, immediately before the
component's quoted text. The `"..."` that opens each component prompt is the join
point — GLOBAL STYLE goes in place of those ellipsis dots. Do not omit this step; the
model will not apply the correct style without it.

## 1. Wall — assets/inked/brick-wall.v1.png  (1024×1024)
"...a SEAMLESS TILING brick coursing swatch: running-bond brick with inked mortar
lines, subtle hatched weathering. Must tile cleanly on all four edges (top maps to
bottom, left maps to right). Brick only, no windows, no edges of a building."

## 2. Window — assets/inked/brick-window.v1.png  (512×768, TRANSPARENT background)
"...a single double-hung sash window for a brick rowhouse: inked frame, two-over-two
panes, a stone lintel above and a sill below, light hatching for glass reflection.
TRANSPARENT background (alpha) — draw ONLY the window unit and its lintel/sill, no
surrounding wall."

## 3. Cornice — assets/inked/brick-cornice.v1.png  (1024×256, TRANSPARENT background)
"...a horizontally-tileable bracketed wooden cornice strip for a brick rowhouse:
inked brackets/dentils with hatched undershadow. Tiles left-to-right seamlessly.
TRANSPARENT background above and below the cornice band."

## 4. Ground floor — assets/inked/brick-ground.v1.png  (1024×512)
"...a residential parlor-floor elevation for a brick rowhouse: a stoop with steps,
an entry door with transom, and one tall parlor window beside it, all inked. Brick
wall fills the rest. Opaque, full bay width, edge to edge. Draw steps in flat
orthographic elevation filling the full image width; steps must NOT project below
the image base — the bottom edge of the image is the ground line and must be
fully opaque with no transparent or ragged area beneath the staircase."

---

## Post-generation QA

Run these checks on each rendered PNG before accepting it into the asset pipeline.

**Wall (`brick-wall.v1.png`)**
- Tile it 2×2 and confirm no visible seam at the top↔bottom join and the left↔right
  join.
- Confirm no brick is cut at one edge without a mirrored cut on the opposite edge.

**Window (`brick-window.v1.png`) and Cornice (`brick-cornice.v1.png`)**
- Open in an editor that shows the alpha channel and confirm the background is truly
  transparent (alpha = 0), not white or near-white.
- Confirm ink outlines and dentil/bracket profiles do not bleed past the intended
  alpha boundary into the transparent region.

**All components**
- Sample the fill color in several wall/background areas and confirm it reads as a
  neutral warm grey close to #EDE8E0 — no baked saturated color (red, yellow, blue
  tint). The fill must survive a color-multiply tint pass without shifting the hue.
