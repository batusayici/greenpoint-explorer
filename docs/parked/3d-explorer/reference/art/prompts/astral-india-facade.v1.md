# Render Package — Astral, FULL India St (north) facade as ONE flat texture (v1)

**Sibling of `astral-full-facade.v1.md`** (the Franklin/west elevation). This package renders the **India Street (north) side elevation** of The Astral (BIN 3064408, 184 Franklin) as a single strictly-orthographic flat texture — the same single-continuous-sheet method that fixed the Franklin segment-drift/floor-count bug. The engine maps it across the India face's chord (a new bespoke side face; today the ends render as `decorateTypologicalWall` brick — this upgrades the India end to a hero face).

**Scope note (Batu, 2026-06-23):** originally scoped to "corner pavilion returns only," but the field photos show the India elevation is a fully articulated street face with its **own central entrance pavilion mid-wall** (not just corners). So this renders the **whole India street elevation, corner to corner**, including that central pavilion. Everything here is read off the attached photos — nothing invented. Trim to corners-only later if desired; the central pavilion is what makes this face recognizable.

Produces `astral-apartments--india-full.png` — the entire India (north) elevation as one head-on orthographic flat texture, wired as one `3064408:india` face segment.

## Orientation (locked)
- The Astral fills the Franklin block-front between **India St (NORTH end)** and **Java St (SOUTH end)**; rear on West St. (Batu confirmed India = north, 2026-06-23.)
- The India elevation is the building's **~41 m deep (E–W) short face**, ~21 m tall (6 storeys). It runs from the **Franklin↔India corner pavilion** (the rounded/canted corner that the Franklin frontage terminates into) across to the **India↔West St corner**.
- Both **side edges of the canvas = the two building corners** (the corner piers/pavilions), drawn head-on up to the corner — the perpendicular returns (onto Franklin / onto West St) are folded in-engine, so do NOT wrap them in the drawing. NOT seamless cuts: these are real building ends.

## The counts — LOCKED (same building, same six storeys as Franklin)

**Vertical — SIX storeys, bottom → top:**
1. **Ground floor** — rusticated, rock-faced **brownstone base**: a round-arch arcade of openings (residential entrances + any ground-floor windows), and the **central grand round-arch entrance** under a **carved stone sign band** (copy whatever lettering is legibly carved — do not invent text).
2.–5. **Four floors of red brick** with **rectangular punched windows** (stone sills, flat/segmental brick hoods), **fire-escape ironwork** on the brick wings as photographed.
6. **Top floor** — **round-ARCHED windows** beneath a corbelled brick cornice.

→ **FIVE residential floors above the ground floor, the top one arched. Five.** Do not draw four; do not merge two into one.

**Central entrance pavilion (mid-face, taller/richer — its own vertical composition, does NOT line up row-for-row with the wings):** the rusticated brownstone **round-arch entrance** → the **carved sign band** → a vertical stack of **tall windows / round-arched windows** rising through the brick → terminating in a **stepped brick gable** crowned with a **round-arch top window + terracotta cartouche / oculus medallion** above the main cornice (read it off `india.png`; `india.jpeg` — the Franklin center entrance — is a cross-ref for the shared arch grammar only).

**Roofline:** main corbelled brick cornice with an **iron parapet railing**; the **central stepped gable** over the pavilion; **terracotta cartouche medallions** where the photos show them.

**Horizontal — copy the straight-on photo (`india.png`) exactly.** The face reads **broadly symmetric** about the central pavilion: central pavilion → on each side a regular grid of **punched-window axes with fire escapes** → terminating in the **two corner pavilions**. Every residential floor shares the same strict vertical grid (windows stack dead-plumb, floor lines unbroken). **Count the window axes off `india.png` and reproduce exactly that many** — no more, no fewer.

## Photos to attach (truth source — all in `docs/reference/hero-evidence/astral/`)
Re-orient upright first (the `.jpeg` field shots are EXIF-rotated 90°; the `.png` web refs are upright).
- **Straight-on full India elevation (the master — read the central pavilion, floor count AND axes from this):** `india.png`
- **Shared entrance grammar cross-ref (NOT the India face):** `india.jpeg` is the **Franklin** center "THE ASTRAL" entrance (hash-verified = old IMG_0973). Use it only as a style exemplar for the rusticated round-arch / carved-band / gable language the entrances share — the India entrance's actual form comes from `india.png`.
- **Franklin↔India rounded corner pavilion (how the corner turns, round-arch base arcade):** `india corner2.jpeg`, `india corner.jpeg`
- **Cross-reference for shared grammar (brick, cornice, cartouches, arched top, fire escapes):** `IMG_0969`, `IMG_0970`, `IMG_0964`, `IMG_0962`
- Plus the II-C style tiles: `II-C-style-system-tile.png` + `II-assembled-mini-scene.png` (in `docs/reference/art/`).

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **India Street side elevation** of the building in the attached photos — **The Astral, 184 Franklin Street, Brooklyn** (the red-brick-and-brownstone 1886 Queen Anne apartment block) — as ONE single, strictly orthographic, head-on architectural elevation in the attached hand-inked editorial illustration style (II-C system: confident 1–4 px linework, controlled hatching for shadow, muted warm red-brick + brownstone palette, paper texture). Flat projection only: every vertical plumb, every floor line dead horizontal, no 3/4 view, no perspective, no foreshortening, no leaning columns. Draw the WHOLE width of this side of the building in one image, corner pavilion to corner pavilion.
>
> **Draw ONE building only — The Astral.** Do not borrow windows, cornices, materials, or signage from any neighbor. This is the building's **north (India Street) face**, shown straight-on in `india.png`.
>
> **GET THE FLOOR COUNT RIGHT — the building has SIX storeys:**
> 1. a ground floor of **rusticated rock-faced brownstone**: a round-arch arcade of residential entrances and ground-floor openings, with a **central grand round-arch entrance** under a **carved stone sign band** (copy any carved lettering exactly as it reads in the photo; if illegible, draw the blank carved band — do not invent words);
> 2–5. **FOUR floors of red brick with rectangular punched windows** (stone sills, brick hoods) and **fire-escape ironwork** on the wings;
> 6. a **top floor of ROUND-ARCHED windows** under a corbelled brick cornice.
> That is **FIVE residential floors above the ground floor — count them: 5 — the top one arched.** Do NOT draw four. Do NOT compress two floors into one.
>
> **The central entrance pavilion** (middle of this face) is taller and richer than the wings and does NOT line up row-for-row with them — draw it as its own vertical composition: the brownstone round-arch entrance, then the carved sign band, then a vertical stack of **tall round-arched windows**, then a **stepped brick gable** crowned by a **round-arch top window and a terracotta cartouche / round oculus medallion** above the main cornice.
>
> **Horizontal layout — copy the straight-on photo (`india.png`) exactly.** The face is broadly **symmetric** about the central pavilion: on each side a regular grid of **rectangular punched windows with fire escapes**, ending in the **two corner pavilions** (the left/right edges of the drawing are the building's corners — draw the face head-on up to each corner pier; do NOT wrap the perpendicular Franklin or West-Street returns). **Count the window columns in the photo and reproduce exactly that many.** Every residential floor uses the same strict grid: windows stack perfectly plumb, floor lines run unbroken across the full width.
>
> **The photos are the only source of architectural truth** — copy the brownstone arcade base, the central arched entrance and its sign band, the punched-window grid, the fire-escape ironwork, the round-arched top floor, the corbelled cornice, the parapet railing, the central gable + oculus, and the terracotta cartouches exactly as photographed. Materials: red brick body, rock-faced brownstone base. Do not invent, omit, simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored openings). **Facade only**, full bleed, no sky, no ground, no sidewalk, no cars, no people, no street furniture, no trees (draw the wall behind any street tree). Continuous datums: ground line along the bottom edge, cornice/parapet along the top edge. The drawing is a **landscape elevation** — output about **2 : 1** (roughly 2300 × 1150 px or larger), the full India face in one frame; do not crop the corners, do not letterbox, do not square it up.
>
> **Before finalizing, audit your draft against the photos:** (1) it is The Astral's India face only, red brick + brownstone; (2) **exactly FIVE residential floors above the ground floor, the top floor round-arched** — recount and fix if you drew four; (3) the ground floor is rusticated brownstone with the central round-arch entrance + carved sign band; (4) the central pavilion has the stacked tall arched windows and the stepped gable with a round oculus/cartouche on top; (5) the fire escapes and the symmetric window grid match the photo's count; (6) the whole width is drawn corner to corner, windows plumb and floor lines unbroken; (7) nothing added that is not on The Astral. If any check fails, correct before outputting.

## After the render comes back (Phase C/E — I do this)
1. Audit the raw render against the photos — **first check: exactly 5 residential floors + arched top + central gable/oculus.** Re-render only for truthfulness failures (wrong floor/axis count), never for placement.
2. Wire as a new bespoke side face `3064408:india` (the India end stops rendering typological brick and carries this texture across the India chord; the corner pavilion fold onto Franklin is handled where the India and Franklin chords meet — seed a kink like `ASTRAL_KINK` only if the corner needs it).
3. Spec the openings on the FLAT texture. **Match the Franklin face's flush decision:** this is a complete II-C illustration (it paints its own windows, sills, arches), so set `windows.flush: true` — author the rects for registration but let the painting render at the wall plane; do NOT carve procedural recesses + geometric sills over it (that was the clutter bug — see `window-decal-is-flush-not-recessed` and the astral frontage spec). Tag the central entrance, the top-floor arcade, and the gable oculus `shape:"arch"/"circle"` for any in-engine curved relief if later desired; refine in `?facadeedit=1`.
4. Verify in-engine at all four angles; blank-box / cornice-notch / corner-seam-with-Franklin checks. Append a HERO_FACADE_LOG entry.

## Open decisions for Batu
- **Carved sign-band text on the India entrance:** I'll copy only what's legible in `india.png` (the India entrance may or may not carry a carved band — don't assume it mirrors Franklin's "THE ASTRAL"). Tell me the exact lettering if you know it; do not let the model invent text.
- **Aspect:** seed ~2:1 from the ~41 m × ~21 m face; final proportion settles against the derive overlay (drawn fold wins, measured not assumed).
- **Corners-only fallback:** if you'd rather keep the central India pavilion procedural and only render the two corner-pavilion wraps, say so and I'll cut the prompt down — but the central pavilion is the recognizable element, so full-face is the recommendation.
