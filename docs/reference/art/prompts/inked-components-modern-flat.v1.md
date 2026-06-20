# Inked Components — Modern / Flat System v1

Generation packet (Phase 7.2 fan-out). Covers only the cells whose references exist now:
**wall, window, weathering, ground.** The gather-dependent cells (`bay-frame`, `awning`,
`roll-gate`) stay blocked until photos land — see `phase-7-reference-intake.v0.1.json`.

Style anchors (attach to EVERY prompt): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

GLOBAL STYLE (prepend to each, in place of the leading `"...`): "Hand-inked editorial
illustration in the exact style of the attached reference boards: confident dark ink
outlines, hand-hatched shadow, visible paper grain, flat orthographic elevation, no
perspective. TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill
(approximately #EDE8E0) ONLY — no saturated color (color is applied later in-engine).
No sky, no ground, no neighbors."

Material truth (attach to EVERY modern-flat prompt): `facade material/modern flat/` —
`IMG_0698`, `IMG_0743`, `IMG_0744`, `IMG_0824`, `IMG_0826`, `IMG_0842`, `IMG_0849`.
Modern-flat signature: standing-seam / corrugated metal cladding, flat parapet (no
projecting cornice), large plain windows, minimal trim — the QUIET, recent infill type.

## 1. Wall — assets/inked/modern-flat-wall.v1.png  (1024×1024, seamless tile)
"...a SEAMLESS TILING standing-seam metal cladding swatch: evenly spaced vertical seam
lines with faint inked panel shadow and light grain. Must tile cleanly on all four edges.
Cladding only, no windows, no building edges. Keep it restrained — fewer, cleaner lines
than the masonry tiles."
Structure refs: `IMG_0743`, `IMG_0744`, `IMG_0826` (standing-seam), `IMG_0708`-family if present.

## 2. Window — assets/inked/modern-flat-window.v1.png  (512×768, FLAT-SOLID keyable bg)
"...a single large modern window: simple thin inked frame, one big fixed pane (optional
narrow operable sash), minimal trim, light hatching for glass reflection. BOLD enough dark
outline that it still reads at ~120px tall, with a DARKER glass tone (mid-grey). Draw ONLY
the window unit, no surrounding wall, no decorative lintel."
Structure refs: `window/` — `IMG_0698`, `IMG_0849`, `IMG_0842`.

## 3. Weathering — assets/inked/modern-flat-weathering.v1.png  (1024×1024, tileable overlay, ink/grain only)
"...a SEAMLESS TILING weathering overlay for painted metal on a PURE WHITE (#FFFFFF)
BACKGROUND: faint streaking, light oxidation/scuffing along seams drawn as dark marks ONLY
— background pure white, NOT warm grey, NO solid grey fill (clean areas must key to
transparent). VERY subtle (modern cladding weathers little). Tiles cleanly on all four
edges."

> WEATHERING LESSON (see brick-fill / brownstone packet): if GPT returns a grey field
> instead of marks-on-white, key with a luminance ramp (whitePoint≈210, blackPoint≈150),
> not a border flood.
Structure refs: `weathering/` — `IMG_0738`, `IMG_0739` (light streaking only; ignore brick).

## 4. Ground floor — assets/inked/modern-flat-ground.v1.png  (1024×512, opaque)
"...a modern ground-floor elevation: a flush entry door beside a large plain window in a
plain clad/metal surround, minimal trim, all inked. Opaque, full bay width, edge to edge.
Flat orthographic; the bottom edge is the ground line and must be fully opaque with no
transparent or ragged area."
Structure refs: modern-flat material set + `IMG_0748` (glass storefront, distance).

---
## Background rule (window)
Request a FLAT, UNIFORM near-white background (no checkerboard/gradient/texture); we key to
real alpha with `scripts/key_inked_alpha.py`. Subject needs BOLD DARK outlines.

## Post-generation QA
- **Wall/weathering:** tile 2×2, confirm seamless top↔bottom + left↔right.
- **Window:** after keying, alpha = 0 background, no ink bleed past boundary.
- **All:** fill reads neutral warm grey ≈ #EDE8E0, no baked chroma; survives multiply tint.

## Alpha-key thresholds (fill in after generation; default 236)
- wall: ___ · window: ___ · weathering: ___ · ground: ___

## Blocked (do NOT generate yet — no refs)
- bay-frame, awning, roll-gate — awaiting Batu-supplied photos (intake JSON).
