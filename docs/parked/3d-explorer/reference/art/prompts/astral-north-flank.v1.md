# Render Package — Astral, Franklin NORTH flank segment (v1)

**Phase D / flank slice** for the Astral full-block hero (BIN 3064408). Produces `astral-apartments--franklin-north.png`, the second of 3 segments of the Franklin (west) elevation — the stretch from the **north end pavilion** down to the center entrance pavilion. See `docs/reference/hero-evidence/astral/FACADE_GRAMMAR.md` for the full grammar and `docs/reference/art/prompts/astral-center-segment.v1.md` for the already-shipped center segment this one tiles against.

**What's new vs the center segment:** the center was flat (only curved recesses). This flank carries the **projecting oriel bays + fire escapes** and the **north end pavilion**. Two new things to get right:
1. **Oriel bays are drawn FLATTENED into the elevation** (see the unrolled-bay rule below) — the engine folds them into 3 facets at build time (`oriel3`, proven on Premier). Do **not** draw them in 3/4 / projecting perspective.
2. The **outboard (north) edge is the real building end** — the end pavilion that turns the cross-street corner — **not** a seamless cut. The **inboard (south) edge IS a seamless cut** that must tile against the center segment.

## Mechanical fill-ins (from geometry, not from the photos)
- **Subject:** the **north flank** of **The Astral** (184 Franklin St) — from the north end pavilion to (but not including) the center "THE ASTRAL" entrance pavilion.
- **Segment extent (frontage chord):** chord runs north(0 m) → south(60.6 m); this segment is **0 m → ~21.35 m** (the center segment is 21.35–39.25). ~21.4 m of frontage.
- **Two different edges:**
  - **Outboard / NORTH edge (left of canvas) = the building END / end pavilion.** Draw the building terminating here as photographed (one end is a rounded/arched corner pavilion — confirm which end against IMG_0957/0971). This edge is the corner; the cross-street return is handled in-engine, so draw the Franklin face head-on up to the corner quoin/pier.
  - **Inboard / SOUTH edge (right of canvas) = a VERTICAL CUT LINE** through the red-brick wall at the brick pier just inboard of the last oriel bay before the center pavilion — **identical datum to the center segment's left cut** so the two tile seamlessly. NOT a party wall, no taper, no edge bay.
- **Face:** single flat orthographic elevation (no corner fold, no 3/4 view). Oriel bays flattened in-plane (see rule below).
- **Approx real size:** ~21.4 m wide × ~21 m tall (6 storeys, `heightRoof` ≈ 20.9 m). Aspect ~1.02:1 (near square). Exact placement is the derive pass's job, not the render's.
- **Output:** `astral-apartments--franklin-north.png`, PNG, long edge 2048 px (≈2048 × ~2010), strictly orthographic. Match the center segment's ~85 px/m scale and its ground-line / cornice / string-course heights exactly.

## Photos to attach (all in `docs/reference/hero-evidence/astral/`)
Re-orient upright first (several are EXIF-rotated 90°).
- **Full-frontage rhythm (count the bays from this) — primary:** IMG_0971, IMG_0973, IMG_0958
- **North end pavilion (rounded/arched corner):** IMG_0957
- **Oriel bays + fire escapes:** IMG_0962, IMG_0965, IMG_0971
- **Round-arch top-floor windows / oculi:** IMG_0964, IMG_0967
- **Terracotta gable cartouches at the roofline:** IMG_0969, IMG_0970
- **Rusticated brownstone base + residential entrances:** IMG_0959, IMG_0960, IMG_0961
- Plus the II-C style tiles: `II-C-style-system-tile.png` + `II-assembled-mini-scene.png` (in `docs/reference/art/`).

## The unrolled-bay rule (READ THIS — it's the whole trick)
The projecting oriel bays are NOT drawn as protruding boxes. The engine folds a FLAT painting into three facets, so the painting must already contain all three faces of each bay **laid out side-by-side, flattened into the wall plane**: the bay's wide center window in the middle, and its two narrow side windows immediately left and right of it, all at full width and all plumb — as if the bay were unrolled flat into the elevation. The engine compresses the two side panels onto the angled returns at build time. So: **draw every window of every oriel bay head-on and in-plane; no foreshortening, no perspective, no shadowed projecting box.**

## Prompt (image-to-image, GPT-5.5)

> Redraw the **north section** of the building in the attached photos as a single, strictly orthographic facade elevation in the attached hand-inked editorial illustration style (II-C system: confident 1–4 px linework, controlled hatching for shadow, muted warm red-brick + brownstone palette, paper texture). Head-on flat projection: every vertical edge plumb, no 3/4 view, no leaning window columns, no foreshortening.
>
> **Draw ONE building only — the subject: The Astral**, the red-brick-and-brownstone 1886 Queen Anne apartment block in the attached photos. This is the stretch of its Franklin Street frontage running from the **north end pavilion** up to — but **NOT including** — the central "THE ASTRAL" entrance pavilion. Do not borrow windows, cornices, materials, or signage from any differently-styled neighbor.
>
> **This is ONE SEGMENT of a longer continuous facade.** The two side edges are different:
> – The **LEFT edge is the building's NORTH END** — draw the building terminating in its end pavilion exactly as photographed (a rounded/arched corner pavilion). Stop the Franklin face at the corner pier; do not wrap the side street.
> – The **RIGHT edge is a VERTICAL CUT LINE** through the flat red brick (at the pier just past the last oriel bay before the center pavilion), NOT the end of the building. Draw the brickwork, ground line, every horizontal string course / sill band, and the top cornice running **straight off the right edge** so this segment tiles seamlessly against the center segment. Do NOT taper, round, or terminate the wall at the right edge, and do NOT draw a projecting bay at the right edge — stop at flat brick.
>
> **Oriel bays — flatten them, do not project them.** This frontage has repeated **projecting oriel bay windows** rising through the upper floors, each with a **fire escape**. Draw each oriel bay UNROLLED FLAT into the wall plane: its wide center window in the middle with its two narrow side windows immediately beside it, all head-on, full width, plumb — never as a 3/4 protruding box, never foreshortened, never in perspective. (The 3D fold is added later in the engine.)
>
> **The photos are the only source of architectural truth.** Read off and copy exactly:
> – the **number of oriel-bay modules** in this north stretch — count them in the full-frontage photos (IMG_0971/0973/0958) and draw exactly that many, no more, no fewer;
> – the **number of window rows** above the ground floor — draw exactly that many;
> – the **round-arched top-floor windows** (arched heads, not square) under the corbelled brick cornice;
> – the **terracotta gable cartouches** (carved diamond/oval scrollwork medallions) at the roofline where the photos show them;
> – the **north end pavilion** form (rounded/arched corner) as photographed;
> – the **rusticated brownstone base** with its residential double-door entrances and any ground-floor shop glazing as photographed;
> – sills, brick window hoods, corbelled cornice, and the **fire-escape ironwork** on the bays as photographed;
> – materials: red brick body, rock-faced brownstone base.
> Do not invent, omit, simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored openings). Facade only, full bleed, no sky, no sidewalk, no people, no street furniture, no trees (the photos have a street tree — draw the wall behind it). Continuous datums: ground line at the bottom edge, cornice/parapet at the top edge, sign-band and string-course heights consistent with the center segment across the full width. Output ~2048 × ~2010 px (near square, aspect ~1.02:1) — do not change the proportions.
>
> **Before finalizing, audit your draft against the photos:** (1) it is the Astral north stretch only, red brick + brownstone; (2) the oriel bays are present, flattened in-plane (no protruding boxes), with fire escapes, and the bay count matches the photos; (3) window-row count matches and top-floor windows are round-arched; (4) the north end pavilion terminates the LEFT edge as photographed; (5) the RIGHT edge is a clean vertical cut with brick, ground line, string courses and cornice running straight off it (no party wall, no taper, no edge bay); (6) gable cartouches present at the roofline; (7) nothing added that is not on the Astral in the photos. If any check fails, correct before outputting.

## After the render comes back (Phase E — I do this)
1. Audit the raw render against the photos (bay count, fire escapes, datums run off the inboard cut, end pavilion present) **before** deriving — re-render only for truthfulness failures, never placement.
2. Derive the spec on the FLAT texture (`derive-facade-spec.mjs`), gate on a 2× overlay. Tag round-arch top windows `shape:"arch"` + seed `springY`; register curves in `?facadeedit=1`.
3. Detect the oriel facet-runs from the polygon (`orielPlacementsFromPolygon`); add each bay as a `bay.plan:"oriel3"` fold over its u-slice, `centerFraction` tuned to the photo splay.
4. Add the segment to `composite.frontage.segments` (`key: astral-apartments--franklin-north`, `fromM: 0`, `toM: ~21.35`, `leftEnd: "north"`).
5. Verify in-engine at all four angles; blank-box / cornice-notch / seam-with-center checks per the hero log.
6. Append a HERO_FACADE_LOG entry.

## Open decisions for Batu (confirm before/at render time)
- **Exact inboard cut (toM):** seed 21.35 m to match the center's left edge; nudge to land on a real brick pier if the photos disagree (drawn fold wins, per the playbook).
- **Bay count in this stretch:** my read of IMG_0971 is ~2–3 oriel modules between the north pavilion and center — the render counts from the photo, but confirm the number you see so I can sanity-check the derive.
- **Which end is north:** is the rounded/arched corner pavilion (IMG_0957) the NORTH end or the SOUTH end? That decides whether IMG_0957 attaches here or to the south flank.
