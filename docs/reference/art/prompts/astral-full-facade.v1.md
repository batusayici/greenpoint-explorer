# Render Package — Astral, FULL Franklin facade as ONE flat texture (v1)

**Supersedes the 3-segment packages** (`astral-center-segment.v1.md`, `astral-north-flank.v1.md`, `astral-south-flank.v1.md`) for the texture step. Reason (Batu, 2026-06-23): three separately-rendered segments don't align — floor lines, string courses and bay rhythm drift across cuts, and the segment renders silently **dropped a residential floor**. One continuous flat elevation guarantees alignment; we trade per-segment sharpness for a correct, seamless whole.

Produces `astral-apartments--franklin-full.png` — the entire Franklin (west) elevation of The Astral (BIN 3064408, 184 Franklin) as a single strictly-orthographic flat texture. The engine maps it across the whole frontage chord (one `composite.frontage.segments` entry, `fromM 0 → toM 60.6`).

## The counts — these are LOCKED (the renders kept getting them wrong)

**Vertical — SIX storeys, read bottom → top:**
1. **Ground floor** — rusticated, rock-faced **brownstone base**. Round-arched openings: residential double-door entrances, the **central grand entrance arch** ("No 184") under the carved **"THE ASTRAL"** stone sign band, and ground-floor shopfronts (the vermouth bar, big shop windows).
2.–5. **Four floors of red brick** (storeys 2,3,4,5) with **rectangular punched windows** (stone sills, flat/segmental brick hoods) and **projecting oriel bay windows** carrying **fire escapes**.
6. **Top floor (storey 6)** — **round-ARCHED windows** (an arcade of arched heads) beneath a corbelled brick cornice.

→ That is **5 residential floors above the ground floor** (storeys 2–6), the **top one arched**. Do not draw 4. Do not merge two into one. **Five.**

**Center pavilion (does NOT line up row-for-row with the flanks — draw it as its own vertical composition):** the grand brownstone entrance arch → the "THE ASTRAL" band → a vertical stack of **tall round-arched windows** (the tripartite arched windows) → a recessed **two-arch loggia** (paired round arches on a central stone colonette) → a stepped brick **gable** crowned with a **round oculus / cartouche medallion**. That **oculus is the roof-level window at the center** — above the main cornice.

**Roofline:** flat roof with an **iron parapet railing**; small **stepped brick gablets / piers with terracotta cartouche medallions** spaced along the top; the **central tall stepped gable** over the loggia.

**Horizontal — match the straight-on photo exactly.** The facade is **symmetric** about the center entrance pavilion: central pavilion → on each side a regular rhythm of **projecting 3-part oriel bays (each with a fire escape) alternating with flat single-window bays** → terminating in **end pavilions**, one of which carries a small **rounded/arched corner niche with a lamp** (top corner, see `java.jpeg` + the existing center render). **Count the window axes and the number of oriel bays directly off the attached straight-on elevation photo and reproduce that exact count** — every residential floor shares the same strict vertical grid of window axes (windows stack dead-plumb).

## Photos to attach (truth source — all in `docs/reference/hero-evidence/astral/` unless noted)
Re-orient upright first (several are EXIF-rotated 90°).
- **Straight-on full frontage (the master — count floors AND bays from this):** the clear bare-tree frontal elevation photo (Batu's web ref) + `india corner.jpeg`, `java corner.jpeg`, `india.jpeg` (these are the original Franklin obliques, renamed 2026-06-23 by the corner they look toward — see the rename note in FACADE_GRAMMAR.md)
- **Center entrance + "THE ASTRAL" + No 184 arch + loggia + gable oculus:** IMG_0966, IMG_0967, `india.jpeg`
- **Round-arch top-floor arcade:** IMG_0964, IMG_0967
- **Oriel bays + fire escapes:** IMG_0962, IMG_0965, `india corner.jpeg`
- **Terracotta gable cartouche medallions:** IMG_0969, IMG_0970
- **Brownstone base + entrances + shopfronts:** IMG_0959, IMG_0960, IMG_0961, IMG_0963
- **End pavilion / rounded corner niche:** `java.jpeg`
- Plus the II-C style tiles: `II-C-style-system-tile.png` + `II-assembled-mini-scene.png` (in `docs/reference/art/`).

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **entire street facade** of the building in the attached photos — **The Astral, 184 Franklin Street, Brooklyn** — as ONE single, strictly orthographic, head-on architectural elevation in the attached hand-inked editorial illustration style (II-C system: confident 1–4 px linework, controlled hatching for shadow, muted warm red-brick + brownstone palette, paper texture). Flat projection only: every vertical plumb, every floor line dead horizontal, no 3/4 view, no perspective, no foreshortening, no leaning columns. Draw the WHOLE width of the building in one image, end pavilion to end pavilion.
>
> **Draw ONE building only — The Astral**, an 1886 red-brick-and-brownstone Queen Anne apartment block. Do not borrow windows, cornices, materials, or signage from any neighbor.
>
> **GET THE FLOOR COUNT RIGHT — this is the most important instruction. The building has SIX storeys:**
> 1. a ground floor of **rusticated rock-faced brownstone**: round-arched residential entrances, the central grand round-arch entrance marked **"No 184"** under a carved **"THE ASTRAL"** stone sign band, and ground-floor shopfronts;
> 2–5. **FOUR floors of red brick with rectangular punched windows** (stone sills, brick hoods) and projecting **oriel bay windows with fire escapes**;
> 6. a **top floor of ROUND-ARCHED windows** under a corbelled brick cornice.
> That is **FIVE residential floors above the ground floor — count them: 5 — the top one arched.** Do NOT draw four floors. Do NOT compress two floors into one. Five residential floors plus the ground floor = six storeys total.
>
> **The center entrance pavilion** is taller and richer than the side bays and does NOT line up row-for-row with them — draw it as its own vertical composition: the brownstone "No 184" entrance arch, then the "THE ASTRAL" band, then a vertical stack of **tall round-arched windows**, then a recessed **two-arch loggia** (paired round arches on a central stone colonette), then a stepped brick **gable** crowned by a **round oculus window** — that oculus is the topmost, roof-level window, above the main cornice.
>
> **Horizontal layout — copy the attached straight-on photo exactly.** The facade is **symmetric** about the center pavilion: on each side, a regular rhythm of **projecting three-part oriel bay windows (each carrying a fire escape) alternating with flat single-window bays**, ending in **end pavilions** — the corner pavilion has a small **rounded arched niche with a lamp** near the top. **Count the window columns and the number of oriel bays in the photo and reproduce exactly that many** — no more, no fewer. Every residential floor uses the same strict grid: windows stack perfectly plumb, floor lines run unbroken across the full width.
>
> **The photos are the only source of architectural truth** — copy the brownstone base, the arched entrances, the oriel bays, the fire-escape ironwork, the round-arched top floor, the terracotta gable cartouches, the parapet railing, and the central gable + oculus exactly as photographed. Materials: red brick body, rock-faced brownstone base. Do not invent, omit, simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored openings). **Facade only**, full bleed, no sky, no ground, no sidewalk, no cars, no people, no street furniture, no trees (draw the wall behind any street tree). Continuous datums: ground line along the bottom edge, cornice/parapet along the top edge. The drawing is a **wide horizontal elevation strip** — output a wide landscape image about **2.9 : 1** (roughly 2912 × 1024 px or larger), the full building width in one frame; do not crop the ends, do not letterbox, do not change to a square.
>
> **Before finalizing, audit your draft against the photos:** (1) it is The Astral only, red brick + brownstone; (2) **exactly FIVE residential floors above the ground floor, the top floor round-arched** — recount and fix if you drew four; (3) the ground floor is rusticated brownstone with the "No 184" / "THE ASTRAL" central arch; (4) the center pavilion has the stacked tall arched windows, the two-arch loggia, and the gable with a round oculus on top; (5) the oriel bays and their fire escapes are present and the bay count matches the photo; (6) the whole width is drawn, symmetric, end pavilion to end pavilion, windows plumb and floor lines unbroken; (7) nothing added that is not on The Astral. If any check fails, correct before outputting.

## After the render comes back (Phase C/E — I do this)
1. Audit the raw render against the photos — **first check: exactly 5 residential floors + arched top + center oculus.** Re-render for truthfulness failures (wrong floor/bay count), never for placement.
2. Derive the spec on the FLAT texture (`derive-facade-spec.mjs`), gate on a 2× overlay. Tag the round-arch entrance, the top-floor arcade, and the center stacked arches `shape:"arch"` + seed `springY`; refine in `?facadeedit=1`.
3. Wire as **one** `composite.frontage.segments` entry: `{ key: "astral-apartments--franklin-full", fromM: 0, toM: 60.6, leftEnd: "north" }`. Retire the `franklin-center` segment.
4. (Optional, later) detect oriel facet-runs (`orielPlacementsFromPolygon`) and add `bay.plan:"oriel3"` folds over each bay's u-slice — the single texture already holds every bay in-plane, so folding is a pure geometry add.
5. Verify in-engine at all four angles; blank-box / cornice-notch checks. Append a HERO_FACADE_LOG entry; flip `building-tiers` buildStatus→built + update `curationTiers.test.mjs`.

## Tradeoff noted (so we remember why)
The original segmented plan existed for resolution (~85 px/m vs ~24 px/m on one 65 m sheet). At ~2912 px wide this single sheet is ~48 px/m — softer than a segment but enough for the II-C inked look, and it **eliminates the stitch/alignment/floor-count failure** that segmenting introduced. Alignment correctness > per-segment sharpness for recognizability. A very wide (2.9:1) image may take a couple of attempts for the model to honor the aspect + the strict grid — re-roll if it squares-up or distorts the window rhythm.
