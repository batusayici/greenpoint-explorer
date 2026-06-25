# Render Package — Astral, Franklin center entrance segment (v1)

**Phase B / vertical slice** for the Astral full-block hero (BIN 3064408). Produces `astral-apartments--franklin-center.png`, the first of ~3 segments of the Franklin (west) elevation. See `docs/reference/hero-evidence/astral/FACADE_GRAMMAR.md` for the full grammar and the segmented-unwrap rationale.

**Why this segment first:** it's the single most recognizable stretch (the rusticated "No 184" round-arch entrance + the carved "THE ASTRAL" band + gable cartouche), and it is **flat** (in-plane) — flanked by, but not including, the projecting oriel bays. So the only hard primitive is the **curved recess** (round-arch entrance + round-arch top-floor windows), already proven on 144 Franklin. The `oriel3` bay folds are deferred to the flank segments — one new hard thing at a time.

## Mechanical fill-ins (from geometry, not from the photos)
- **Subject:** the center entrance pavilion of **The Astral** (184 Franklin St) — the section carrying the rusticated round-arch street door marked "No 184" under the carved "THE ASTRAL" stone band.
- **Segment, not a whole building:** this is ONE flat segment of a long continuous 6-storey brick frontage. Left/right edges are **vertical cut lines** at the brick pier flanking the entrance pavilion (just inboard of the projecting oriel bay on each side), **not party walls**.
- **Face:** single flat elevation (no corner, no fold).
- **Approx real size:** ~18 m wide × ~21 m tall (6 storeys, `heightRoof` ≈ 20.9 m). Aspect ~0.86:1. Exact placement is the derive pass's job, not the render's.
- **Output:** `astral-apartments--franklin-center.png`, PNG, long edge 2048 px (so ~2048 tall × ~1755 wide), strictly orthographic.

## Photos to attach (all in `docs/reference/hero-evidence/astral/`)
Re-orient upright first (several are EXIF-rotated 90°).
- **Entrance + sign + arch (primary truth):** IMG_0966, IMG_0967, IMG_0973
- **Round-arch top-floor windows:** IMG_0964, IMG_0967
- **Gable / terracotta cartouche above:** IMG_0969, IMG_0970
- **Rusticated brownstone base + door:** IMG_0959, IMG_0960, IMG_0961
- **Full-frontage context (where this segment sits in the rhythm):** IMG_0971, IMG_0957
- Plus the II-C style tiles: `II-C-style-system-tile.png` + `II-assembled-mini-scene.png` (in `docs/reference/art/`).

## Prompt (image-to-image, GPT-5.5)

> Redraw the center entrance section of the building in the attached photos as a single, strictly orthographic facade elevation in the attached hand-inked editorial illustration style (II-C system: confident 1–4 px linework, controlled hatching for shadow, muted warm red-brick + brownstone palette, paper texture). Head-on flat projection: every vertical edge plumb, no 3/4 view, no leaning window columns, no foreshortening.
>
> **Draw ONE building only — the subject: The Astral, its center entrance pavilion** (the bay with the rusticated round-arch street door marked "No 184" beneath the carved "THE ASTRAL" stone sign band). Render the brownstone-and-red-brick Astral only; do not borrow windows, cornices, materials, or signage from any differently-styled neighbor.
>
> **This is ONE SEGMENT of a longer continuous facade — not a freestanding building.** The left and right edges of the canvas are **vertical cut lines** through the red-brick wall (at the brick pier flanking the entrance pavilion), NOT the end of the building. Draw the brickwork, the ground line, every horizontal string course / sill band, and the top cornice running **straight off both side edges**, so this segment tiles seamlessly against the adjacent segments. Do NOT taper, round, or terminate the building at the side edges, and do NOT draw a projecting bay window at the edges — stop at the flat brick pier just before it.
>
> **The photos are the only source of architectural truth.** Read off from the photos and copy exactly:
> – the number of window rows above the ground floor — draw exactly that many, no more, no fewer;
> – the **rusticated brownstone round-arch entrance** ("No 184", radiating voussoirs, rock-faced stone) at the ground floor, with the carved **"THE ASTRAL"** stone sign band beside/above it as drawn lettering;
> – the **round-arched top-floor windows** exactly as photographed (arched heads, not square);
> – the **terracotta gable cartouche** (the carved diamond/oval scrollwork medallion) at the roofline where the photos show it;
> – sills, brick hoods, corbelled cornice, and any fire-escape ironwork as photographed;
> – materials: red brick body, rock-faced brownstone base and entrance arch.
> Do not invent, omit, simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored doors). Facade only, full bleed, no sky, no sidewalk, no people, no street furniture. Continuous datums: ground line at the bottom edge, cornice/parapet at the top edge, sign-band and string-course heights consistent across the full width. Output ~1755 × 2048 px (portrait, aspect ~0.86:1) — do not change the proportions.
>
> **Before finalizing, audit your draft against the photos:** (1) it is the Astral center entrance pavilion only, in red brick + brownstone; (2) the round-arch "No 184" entrance and the "THE ASTRAL" band are present and positioned as photographed; (3) window-row count matches and the top-floor windows are round-arched; (4) the gable cartouche is present at the roofline; (5) brick, ground line, string courses, and cornice run straight off BOTH side edges (no party wall, no taper, no edge bay window); (6) nothing added that is not on the Astral in the photos. If any check fails, correct before outputting.

## After the render comes back (Phase C — I do this)
1. Audit the raw render against the photos (row count, arched entrance present, datums run off both edges) **before** deriving — re-render only for truthfulness failures, never placement.
2. Derive the spec on the FLAT texture (`derive-facade-spec.mjs`), gate on a 2× overlay. Tag the round-arch entrance + top windows `shape:"arch"` and seed `springY`; register curves in the recess editor.
3. Register: `FACADE_GROUP_BINS["3064408"]="astral-apartments"`, `FACADE_COMPOSITES["astral-apartments"]` center-face entry (`key: astral-apartments--franklin-center`), spec import → `FACADE_SPECS`/`SPEC_FILE_BY_FACE`, `II_PALETTE.heroes` hue.
4. Verify in-engine at all four angles; blank-box / cornice-notch checks per the hero log.
5. Append a HERO_FACADE_LOG entry.
