# Inked Components — Brownstone System v1

Generation packet (Phase 7.2 fan-out). Ready to run: paste each component prompt
into GPT-5.5 image-to-image with the attachments listed, then hand the raw PNGs back
for alpha-key → mechanical gate → Gate A → Gate B → register.

Style anchors (attach to EVERY prompt): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

GLOBAL STYLE (prepend to each, in place of the leading `"...`): "Hand-inked editorial
illustration in the exact style of the attached reference boards: confident dark ink
outlines, hand-hatched shadow, visible paper grain, flat orthographic elevation, no
perspective. TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill
(approximately #EDE8E0) ONLY — no saturated color (color is applied later in-engine).
No sky, no ground, no neighbors."

Material truth (attach to EVERY brownstone prompt for color/texture, in addition to the
per-component structure refs): `facade material/brownstone/` — `IMG_0819`, `IMG_0825`,
`IMG_0834`, `IMG_0864`, `IMG_0865`, `IMG_0877`, `IMG_0878`, `IMG_0879` (pick the 3–4
clearest for each prompt). Brownstone signature: warm chocolate sandstone, rusticated
parlor base, HIGH stoop, tall round/segmental-arch parlor windows, heavy bracketed cornice.

## 1. Wall — assets/inked/brownstone-wall.v1.png  (1024×1024, seamless tile)
"...a SEAMLESS TILING ashlar brownstone coursing swatch: large rectangular dressed
sandstone blocks with fine inked joint lines, faint hand-hatched tooling/weathering on
the stone faces. Must tile cleanly on all four edges (top maps to bottom, left maps to
right). Stone only, no windows, no building edges."
Structure refs: brownstone material set (block coursing).

## 2. Cornice — assets/inked/brownstone-cornice.v1.png  (1024×256, FLAT-SOLID keyable bg)
"...a horizontally-tileable HEAVY bracketed cornice for a brownstone rowhouse: deep
projecting cornice with large paired brackets and a dentil course beneath, hand-hatched
undershadow, BOLD dark outlines. Tiles left-to-right seamlessly. Draw ONLY the cornice
band; leave above and below as flat near-white background (see background rule)."
Structure refs: `cornice/` — `IMG_0819` (brownstone cornice), `IMG_0703`, `IMG_0723`,
`IMG_0880`.

## 3. Window — assets/inked/brownstone-window.v1.png  (512×768, FLAT-SOLID keyable bg)
"...a single tall parlor-floor window for a brownstone: segmental-arched stone head with a
projecting hood/lintel and carved sill, one-over-one tall sashes, light hatching for glass
reflection. BOLD, DARK ink outlines on frame, hood, sill and muntin, with a noticeably
DARKER glass tone (mid-grey, not near-white) so it still reads as a window at ~120px tall.
Draw ONLY the window unit with its hood and sill, no surrounding wall."
Structure refs: `window/` — `IMG_0751` (carved surround), `IMG_0729` (scrolled stone
lintel), `IMG_0702` (arched + keystone), `IMG_0857`/`IMG_0858`.

## 4. Door + stoop — assets/inked/brownstone-door-stoop.v1.png  (768×1024, FLAT-SOLID keyable bg)
"...the iconic brownstone entry: a HIGH stoop of stone steps with side cheek-walls and
newel posts rising to a recessed double door under a bracketed/segmental-arched portico
hood, all inked, BOLD dark outlines, hand-hatched stair shadow. Draw ONLY the stoop + door
unit as an alpha decal; the area around it is flat near-white background. The bottom edge of
the image is the sidewalk line — the lowest step must sit ON it, fully opaque, not ragged."
Structure refs: `door:stoop/` — `IMG_0752` (carved door + terracotta surround), `IMG_0717`,
`IMG_0834`, `IMG_0878`, `IMG_0879`.

## 5. Weathering — assets/inked/brownstone-weathering.v1.png  (1024×1024, tileable overlay, ink/grain only)
"...a SEAMLESS TILING weathering overlay for brownstone on a PURE WHITE (#FFFFFF)
BACKGROUND: faint spalling/sugaring of the stone face, hairline cracks, soot streaking
below ledges drawn as dark marks ONLY — the background must be pure white, NOT warm grey,
NO solid grey fill (this overlays the tinted wall; clean areas must be white so they key to
transparent). Tiles cleanly on all four edges."

> WEATHERING LESSON (brick-fill v1, 2026-06-20): GPT returned a solid mid-grey tile (0%
> transparent) when asked for "warm-grey fill" — that paints a grey rectangle over the
> wall. Demand a PURE WHITE bg with marks only. If it still returns a grey field, key with a
> luminance ramp (whitePoint≈210, blackPoint≈150) instead of a border flood → ~80%+
> transparent overlay.
Structure refs: `weathering/` — `IMG_0749`, `IMG_0864`, `IMG_0865`, `IMG_0879`.

## 6. Ground floor — assets/inked/brownstone-ground.v1.png  (1024×512, opaque)
"...a brownstone parlor/garden-floor elevation: a RUSTICATED stone base (deep horizontal
banding) with a garden-level entry door and one tall window, the first run of the stoop
beginning at one side, all inked. Opaque, full bay width, edge to edge. Flat orthographic;
the bottom edge is the ground line and must be fully opaque with no transparent or ragged
area."
Structure refs: brownstone material set + `door:stoop/` `IMG_0834`.

---
## Background rule (cornice, window, door-stoop)
GPT-5.5 does not reliably output real alpha. Request a FLAT, UNIFORM near-white background
(single solid light tone, NO checkerboard/gradient/texture) behind the subject; we convert
to real alpha with `scripts/key_inked_alpha.py` (border-seeded flood, passable luminance
≥ ~236, stops at dark ink). This is why subjects need BOLD DARK outlines.

## Post-generation QA
- **Wall/weathering:** tile 2×2, confirm no seam at top↔bottom and left↔right; no block cut
  on one edge without a mirrored cut opposite.
- **Cornice/window/door-stoop:** after keying, confirm background alpha = 0 (not white); ink
  profiles don't bleed past the alpha boundary.
- **All:** sample fill in several areas — must read neutral warm grey ≈ #EDE8E0, no baked
  chroma; must survive a color-multiply tint without hue shift.

## Alpha-key thresholds (fill in after generation; default 236)
- wall: ___ · cornice: ___ · window: ___ · door-stoop: ___ · weathering: ___ · ground: ___
