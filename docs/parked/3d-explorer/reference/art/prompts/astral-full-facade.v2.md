# Render Package — Astral, FULL Franklin facade with PROJECTING ORIEL BAYS (v2)

**Supersedes `astral-full-facade.v1.md` for the texture step.** Reason (Batu,
2026-06-23): v1 produced a correct floor count and overall composition, but it
**drew the projecting oriel bays as flat punched windows** (flat wall + Juliet
balconies + fire escapes — no projecting tripartite bays). The engine's `oriel3`
fold needs each bay drawn as a **canted 3-facet tripartite window with its three
columns side-by-side in-plane** (the Premier-oriel property — see
HERO_FACADE_LOG "Premier Organic — Greenpoint bay → 3-facet oriel"). Folding a
flat single-window slice would smear it into grey returns. v2 fixes ONLY the
bay treatment + resolution; everything else (six storeys, arched top floor,
center pavilion, symmetry) is carried over verbatim from v1 and stays LOCKED.

Produces `astral-apartments--franklin-full-v2.png` — the entire Franklin (west)
elevation of The Astral (BIN 3064408, 184 Franklin) as a single strictly-
orthographic flat texture. The engine maps it across the whole frontage chord
(one `composite.frontage.segments` entry, `fromM 0 → toM 60.6`).

## Why the oriels must be drawn a specific way (the engine contract)

The bays are NOT painted as 3D projections — the texture stays a flat head-on
elevation. The engine carves the depth (`bay.plan:"oriel3"`): it takes each
bay's horizontal texture slice, splits it into left / center / right thirds, and
**folds the two outer thirds backward** to the wall so they become the bay's
angled returns. For that fold to reconstruct a real oriel, the flat drawing must
already contain, within each oriel's width:

- a **center window pane** (front facet), flanked by
- a **narrower window pane on each side** (the two angled return facets),
- with **clear mullions / pier lines between the three**, drawn head-on so the
  three columns sit side-by-side in the plane (the outer two appear narrower, as
  a canted bay does when viewed straight on).

If a bay is drawn as a single flat window (as v1 did), the fold has nothing to
land on the returns and reads grey. **Three columns per oriel, mullions visible,
is the one new hard requirement.**

## The counts — LOCKED (unchanged from v1)

**Vertical — SIX storeys, bottom → top:**
1. **Ground floor** — rusticated rock-faced **brownstone base**: round-arched
   residential entrances, the **central grand entrance arch** ("No 184") under
   the carved **"THE ASTRAL"** stone sign band, and ground-floor shopfronts
   (the vermouth bar, big shop windows).
2.–5. **FOUR floors of red brick** (storeys 2,3,4,5): rectangular punched
   windows (stone sills, brick hoods) **interleaved with projecting oriel bay
   windows carrying fire escapes**.
6. **Top floor (storey 6)** — **round-ARCHED windows** (an arcade of arched
   heads) beneath a corbelled brick cornice.

→ **FIVE residential floors above the ground floor (storeys 2–6), the top one
arched.** Do not draw four. Do not merge two into one. **Five.**

**Center pavilion (its own vertical composition, does NOT line up row-for-row
with the flanks):** the grand brownstone "No 184" entrance arch → the "THE
ASTRAL" band → a vertical stack of **tall round-arched windows** → a recessed
**two-arch loggia** (paired round arches on a central stone colonette) → a
stepped brick **gable** crowned with a **round oculus / cartouche medallion**
(the roof-level window above the main cornice).

**Roofline:** flat roof with an **iron parapet railing**; small **stepped brick
gablets / piers with terracotta cartouche medallions** spaced along the top; the
**central tall stepped gable** over the loggia.

**Horizontal — symmetric about the center pavilion:** central pavilion → on each
side a regular rhythm of **projecting canted 3-facet oriel bays (each with a
fire escape) alternating with flat single-window bays** → terminating in **end
pavilions**, one carrying a small **rounded/arched corner niche with a lamp**.
**Count the window axes and the number of oriel bays off the straight-on
elevation photo and reproduce that exact count.** Every residential floor shares
the same strict vertical grid; the oriels rise unbroken through storeys 2–5 and
stack dead-plumb.

## Photos to attach (truth source — `docs/reference/hero-evidence/astral/`)
Re-orient upright first (several are EXIF-rotated 90°).
- **Straight-on full frontage (master — count floors AND bays):** the clear
  bare-tree frontal elevation (Batu's web ref) + `india corner.jpeg`,
  `java corner.jpeg`, `india.jpeg` (Franklin obliques, renamed by the corner
  they look toward — see FACADE_GRAMMAR rename note).
- **Oriel bays + fire escapes (CRITICAL for v2 — shows the 3-part bay form):**
  IMG_0962, IMG_0965, `india corner.jpeg`
- **Center entrance + "THE ASTRAL" + No 184 arch + loggia + gable oculus:**
  IMG_0966, IMG_0967, `india.jpeg`
- **Round-arch top-floor arcade:** IMG_0964, IMG_0967
- **Terracotta gable cartouche medallions:** IMG_0969, IMG_0970
- **Brownstone base + entrances + shopfronts:** IMG_0959, IMG_0960, IMG_0961, IMG_0963
- **End pavilion / rounded corner niche:** `java.jpeg`
- Plus II-C style tiles: `II-C-style-system-tile.png` + `II-assembled-mini-scene.png`
  (in `docs/reference/art/`).

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **entire street facade** of the building in the attached photos —
> **The Astral, 184 Franklin Street, Brooklyn** — as ONE single, strictly
> orthographic, head-on architectural elevation in the attached hand-inked
> editorial illustration style (II-C system: confident 1–4 px linework,
> controlled hatching for shadow, muted warm red-brick + brownstone palette,
> paper texture). Flat projection only: every vertical plumb, every floor line
> dead horizontal, no 3/4 view, no perspective, no foreshortening of the wall,
> no leaning columns. Draw the WHOLE width in one image, end pavilion to end
> pavilion.
>
> **Draw ONE building only — The Astral**, an 1886 red-brick-and-brownstone
> Queen Anne apartment block. Do not borrow windows, cornices, materials, or
> signage from any neighbor.
>
> **GET THE FLOOR COUNT RIGHT — most important instruction. SIX storeys:**
> 1. a ground floor of **rusticated rock-faced brownstone**: round-arched
>    residential entrances, the central grand round-arch entrance **"No 184"**
>    under a carved **"THE ASTRAL"** stone sign band, and ground-floor shopfronts;
> 2–5. **FOUR floors of red brick** with rectangular punched windows (stone
>    sills, brick hoods) and projecting **oriel bay windows with fire escapes**;
> 6. a **top floor of ROUND-ARCHED windows** under a corbelled brick cornice.
> That is **FIVE residential floors above the ground floor — count them: 5 — the
> top one arched.** Do NOT draw four. Do NOT compress two floors into one.
>
> **DRAW THE PROJECTING ORIEL BAY WINDOWS AS THREE-PART CANTED BAYS — this is
> the second most important instruction, and v1 got it wrong.** Along each side
> of the center pavilion the facade alternates between (a) flat wall with a
> single punched window, and (b) a **projecting canted oriel bay**. Draw each
> oriel bay, even though the view is head-on, as **three window panes side by
> side** separated by slim vertical mullions/piers: a **wider center pane** with
> a **narrower angled side pane on its left and on its right** (a three-sided
> canted bay seen straight on). Shade the two side panes and their piers a little
> deeper than the flat wall so the bay reads as **projecting toward the viewer**,
> and let the **fire escape hang on the bay's center pane**. The oriel rises
> unbroken through the four brick floors (storeys 2–5). Do NOT draw the oriels as
> a single flat window — they must show three distinct columns with mullions
> between them. The flat single-window bays between the oriels stay as one plain
> punched window each.
>
> **The center entrance pavilion** is taller and richer and does NOT line up
> row-for-row with the side bays — draw it as its own vertical composition: the
> brownstone "No 184" entrance arch, then the "THE ASTRAL" band, then a vertical
> stack of **tall round-arched windows**, then a recessed **two-arch loggia**
> (paired round arches on a central stone colonette), then a stepped brick
> **gable** crowned by a **round oculus window** (the topmost, roof-level window,
> above the main cornice).
>
> **Horizontal layout — copy the straight-on photo exactly.** The facade is
> **symmetric** about the center pavilion: on each side, a regular rhythm of
> **projecting three-part oriel bays (each carrying a fire escape) alternating
> with flat single-window bays**, ending in **end pavilions** — the corner
> pavilion has a small **rounded arched niche with a lamp** near the top.
> **Count the window columns and the number of oriel bays in the photo and
> reproduce exactly that many** — no more, no fewer. Every residential floor uses
> the same strict grid: windows stack perfectly plumb, floor lines run unbroken,
> the oriels run unbroken up storeys 2–5.
>
> **The photos are the only source of architectural truth** — copy the
> brownstone base, the arched entrances, the three-part oriel bays, the fire-
> escape ironwork, the round-arched top floor, the terracotta gable cartouches,
> the parapet railing, and the central gable + oculus exactly as photographed.
> Materials: red brick body, rock-faced brownstone base. Do not invent, omit,
> simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored
> openings). **Facade only**, full bleed, no sky, no ground, no sidewalk, no
> cars, no people, no street furniture, no trees (draw the wall behind any street
> tree). Continuous datums: ground line along the bottom edge, cornice/parapet
> along the top edge. Output a wide horizontal elevation strip about **2.9 : 1**
> (roughly **4096 × 1408 px** or larger), the full building width in one frame;
> do not crop the ends, do not letterbox, do not change to a square.
>
> **Before finalizing, audit your draft against the photos:** (1) it is The
> Astral only, red brick + brownstone; (2) **exactly FIVE residential floors
> above the ground floor, the top floor round-arched** — recount and fix if you
> drew four; (3) the ground floor is rusticated brownstone with the "No 184" /
> "THE ASTRAL" central arch; (4) the center pavilion has the stacked tall arched
> windows, the two-arch loggia, and the gable with a round oculus on top; (5)
> **every projecting oriel bay is drawn as a three-part canted bay (three panes,
> mullions between, side panes shaded as projecting), not as a single flat
> window**, and the oriel count matches the photo; (6) the whole width is drawn,
> symmetric, end pavilion to end pavilion, windows plumb and floor lines
> unbroken; (7) nothing added that is not on The Astral. If any check fails,
> correct before outputting.

## After the render comes back (Phase 2/3 — I do this)
1. **Audit the raw render against the photos** — first checks: exactly 5
   residential floors + arched top + center oculus; **then: every oriel is a
   three-part canted bay (three columns + mullions), not a flat window.**
   Re-render only for these truthfulness/structure failures, never for a
   few-percent placement drift.
2. **Derive the spec on the FLAT texture** (`derive-facade-spec.mjs`), gate on a
   2× overlay. Tag the round-arch entrance, the top-floor arcade, and the center
   stacked arches `shape:"arch"` + seed `springY`; refine in `?facadeedit=1`.
   Recessed windows: explicit `windows.rects`, `recessM ~0.14`, **`sill:false`**
   (the drawn elevation carries its own stone sills — a geometric sill would
   float). Remove the `windows.flush:true` flag from the current spec.
3. **Wire as ONE** `composite.frontage.segments` entry: `{ key:
   "astral-apartments--franklin-full-v2", fromM: 0, toM: 60.6, leftEnd:
   "north" }`. Delete the old `astral-apartments--franklin-full.png` from
   `assets/textures/franklin/` (the `import.meta.glob` loader bundles every PNG —
   a superseded render ships dead weight; HERO_FACADE_LOG 144-Franklin gotcha).
4. **Add `bay.plan:"oriel3"` folds** over each oriel's u-slice: one `bay` entry
   per oriel, `centerFraction` tuned so the two facet breaks land on the painted
   mullions (Premier default 0.36; adjust to the drawn center-pane width),
   `projectionM ~0.5–0.6`. The single flat texture now holds every bay's three
   columns in-plane, so each fold is a pure geometry add.
5. **Verify in-engine at all four angles** (blank-box / cornice-notch / grey-
   return checks at zoom). Append a HERO_FACADE_LOG entry; flip `building-tiers`
   buildStatus→built + update `curationTiers.test.mjs`.

## Tradeoffs noted (so we remember why)
- **One sheet, not segments:** v1 chose one continuous sheet over 3 segments to
  guarantee floor-line / bay-rhythm alignment (segments silently dropped a
  floor). v2 keeps that, and bumps the request to ~4096 px wide (~67 px/m vs
  v1's ~34) to hold the three-part oriel detail and let `derive-facade-spec.mjs`
  read crisp mullions. A very wide (2.9:1) image may need a couple of attempts
  for the model to honor the aspect + the strict grid + the three-part oriels —
  re-roll if it squares up, flattens the oriels, or distorts the rhythm.
- **Depth is geometry, never the texture:** the texture stays a flat orthographic
  elevation; the three-part oriels are drawn in-plane so the engine can FOLD them
  (`oriel3`), it does not draw them already-projected. Same doctrine as every
  prior hero (HERO_FACADE_LOG "a faceted projection is a texture fold, not new
  artwork").
