# Render Package — Astral, FULL India St (north) facade — v2 (PROJECTING central oriel)

**Supersedes `astral-india-facade.v1.md`.** v1 produced a strong II-C elevation
(`astral-apartments--india-full.png`, 1774×887) — correct six storeys, correct
brick/brownstone, correct rhythm — **but it drew the central pavilion as a
RECESSED arched niche.** Batu (2026-06-23) confirmed the India centre is a
**projecting oriel pavilion**, not a recess. The engine's `oriel3` fold needs
that bay drawn as a **canted 3-facet tripartite window with its three columns
side-by-side in-plane** (the same contract Franklin v2 fixed — see
`astral-full-facade.v2.md` and HERO_FACADE_LOG "Premier Organic → 3-facet
oriel"). A recessed niche (or a flat group) cannot be folded into a projecting
oriel: the side panes have nothing to land on and read grey.

**Only the central pavilion changes.** Everything else v1 got right — the
six-storey count, the brownstone arcade base, the symmetric flat punched-window
wings with fire escapes, the two corner piers, the stepped centre gable +
oculus/cartouche — stays. The wings are **flat** (no oriels); India's single
projecting element is the centre pavilion.

Produces `astral-apartments--india-full.png` (overwrite) — the entire India
(north) elevation as one head-on orthographic flat texture, wired as one
`3064408:india` face.

## Why the centre oriel must be drawn a specific way (the engine contract)

The bay is NOT painted as a 3D projection — the texture stays a flat head-on
elevation. The engine carves the depth (`bay.plan:"oriel3"`): it takes the
oriel's painted width, splits it into a centre facet + two angled return facets,
and folds the flat artwork forward. For that fold to reconstruct a real oriel,
the flat drawing must already contain, within the oriel's width, per residential
floor:

- a **centre window pane** (front facet), flanked by
- a **narrower window pane on each side** (the two angled return facets),
- with **mullions/piers between the three panes**, the side panes drawn slightly
  narrower and shaded a touch deeper (the foreshortening a canted bay shows seen
  straight on).

If the centre is one wide window, or a recessed niche, the fold has no side panes
to place on the returns and reads grey. **Three columns in the oriel, mullions
visible, side panes shaded as projecting.**

## Orientation (locked — unchanged from v1)
- The Astral fills the Franklin block-front between **India St (NORTH)** and
  **Java St (SOUTH)**; rear on West St.
- The India elevation is the **~41 m deep (E–W) short face**, ~21 m tall (6
  storeys), from the **Franklin↔India corner pier** across to the **India↔West
  St corner**. Both canvas side-edges = the two building corners, drawn head-on;
  do NOT wrap the perpendicular returns (engine folds them).

## The counts — LOCKED (same six storeys as Franklin/Java)
1. **Ground** — rusticated rock-faced **brownstone base**: round-arch arcade of
   residential entrances + ground openings.
2.–5. **FOUR floors of red brick**, **rectangular punched windows** (stone sills,
   brick hoods) on the **flat wings**, **fire-escape ironwork** as photographed.
6. **Top floor** — **round-ARCHED windows** under a corbelled brick cornice.
→ **FIVE residential floors above the ground floor, top one arched. Five.**

**Central pavilion (mid-face, the ONE projecting oriel — its own taller vertical
composition):** the rusticated brownstone **round-arch entrance** at the base →
above it a **projecting canted 3-part oriel bay** rising through storeys 2–5
(three window panes per floor: a centre pane + a narrower canted pane each side,
mullions between, side panes shaded deeper so it reads as projecting toward the
viewer) → terminating in a **stepped brick gable** crowned by a **round-arch top
window + terracotta cartouche / round oculus** above the main cornice. Read its
proportion off `india.png`; the bay PROJECTS — do not recess it.

**Roofline:** corbelled brick cornice + **iron parapet railing**; central stepped
gable over the pavilion; terracotta cartouche medallions where photographed.

**Horizontal — copy `india.png` exactly.** Broadly **symmetric** about the
central oriel pavilion: each side a regular grid of **flat punched-window axes
with fire escapes**, ending in the **two corner piers**. Count the window axes off
`india.png` and reproduce exactly that many; floors stack dead-plumb, floor lines
unbroken, EXCEPT where the central oriel pavilion breaks the grid.

## Photos to attach (truth source — `docs/reference/hero-evidence/astral/`)
Re-orient upright first (`.jpeg` field shots are EXIF-rotated 90°; `.png` refs
upright).
- **Straight-on master (read centre pavilion, floor count, axes):** `india.png`
- **Centre-oriel projection cross-ref (shared canted-bay grammar):** the Franklin
  obliques `india corner.jpeg`, `india corner2.jpeg` show how the Astral's bays
  project — use for the canted-bay read.
- **Shared entrance grammar (NOT the India face):** `india.jpeg` = Franklin "THE
  ASTRAL" entrance — style exemplar only.
- **Shared brick/cornice/cartouche/arched-top/fire-escape grammar:** `IMG_0969`,
  `IMG_0970`, `IMG_0964`, `IMG_0962`.
- Plus II-C style tiles: `II-C-style-system-tile.png`, `II-assembled-mini-scene.png`.

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **India Street side elevation** of the building in the attached
> photos — **The Astral, 184 Franklin Street, Brooklyn** (the red-brick-and-
> brownstone 1886 Queen Anne apartment block) — as ONE single, strictly
> orthographic, head-on architectural elevation in the attached hand-inked
> editorial illustration style (II-C system: confident 1–4 px linework,
> controlled hatching for shadow, muted warm red-brick + brownstone palette,
> paper texture). Flat projection only: every vertical plumb, every floor line
> dead horizontal, no 3/4 view, no perspective, no foreshortening of the wall.
> Draw the WHOLE width of this side of the building in one image, corner pier to
> corner pier.
>
> **Draw ONE building only — The Astral.** Do not borrow windows, cornices,
> materials, or signage from any neighbor. This is the building's **north (India
> Street) face**, shown straight-on in `india.png`.
>
> **GET THE FLOOR COUNT RIGHT — SIX storeys:**
> 1. a ground floor of **rusticated rock-faced brownstone**: a round-arch arcade
>    of residential entrances and ground openings, with a **central grand
>    round-arch entrance**;
> 2–5. **FOUR floors of red brick with rectangular punched windows** (stone sills,
>    brick hoods) and **fire-escape ironwork** on the wings;
> 6. a **top floor of ROUND-ARCHED windows** under a corbelled brick cornice.
> That is **FIVE residential floors above the ground floor — count them: 5 — the
> top one arched.** Do NOT draw four. Do NOT compress two floors into one.
>
> **THE CENTRAL PAVILION IS A PROJECTING CANTED ORIEL BAY — this is the most
> important fix.** In the middle of this face, above the brownstone arch entrance,
> draw a **projecting three-part canted oriel bay** rising unbroken through the
> four brick floors (storeys 2–5). Even though the view is head-on, draw the bay
> as **three window panes side by side per floor**: a wider **centre pane** with a
> **narrower angled side pane on its left and on its right** (a three-sided canted
> bay seen straight on), with **mullions/piers between the three panes**. Shade
> the two side panes and their piers a little deeper than the flat wall so the bay
> reads as **projecting toward the viewer**. Do NOT draw the centre as a recessed
> niche, and do NOT draw it as a single flat window — it must be a three-part
> canted bay that bulges out. The pavilion is taller and richer than the wings
> and terminates in a **stepped brick gable crowned by a round-arch top window
> and a terracotta cartouche / round oculus** above the main cornice.
>
> **The wings stay FLAT.** On each side of the central oriel, draw a regular grid
> of **single rectangular punched windows with fire escapes** — plain flat wall,
> no projecting bays out here. Copy the straight-on photo (`india.png`): the face
> is broadly **symmetric** about the central oriel pavilion, ending in the **two
> corner piers** (the left/right edges of the drawing are the building's corners —
> draw head-on up to each corner pier; do NOT wrap the perpendicular Franklin or
> West-Street returns). **Count the window columns in the photo and reproduce
> exactly that many.** Every residential floor uses the same strict grid (windows
> plumb, floor lines unbroken) except where the central oriel pavilion breaks it.
>
> **The photos are the only source of architectural truth** — copy the brownstone
> arcade base, the central arched entrance, the projecting central oriel, the flat
> punched-window grid, the fire-escape ironwork, the round-arched top floor, the
> corbelled cornice, the parapet railing, and the central gable + oculus/cartouche
> exactly as photographed. Materials: red brick body, rock-faced brownstone base.
> Do not invent, omit, simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored
> openings). **Facade only**, full bleed, no sky, no ground, no sidewalk, no cars,
> no people, no street furniture, no trees (draw the wall behind any street tree).
> Continuous datums: ground line along the bottom edge, cornice/parapet along the
> top edge. **Landscape elevation, about 2 : 1** (roughly 2300 × 1150 px or
> larger), the full India face in one frame; do not crop the corners, do not
> letterbox, do not square it up.
>
> **Before finalizing, audit against the photos:** (1) The Astral's India face
> only, red brick + brownstone; (2) **exactly FIVE residential floors above the
> ground floor, top floor round-arched** — recount and fix if you drew four; (3)
> ground floor rusticated brownstone with the central round-arch entrance; (4)
> **the central pavilion is a PROJECTING three-part canted oriel (three panes per
> floor, mullions between, side panes shaded as projecting) — NOT a recessed niche
> and NOT a single flat window**; (5) the wings are flat single punched windows
> with fire escapes, the symmetric grid matches the photo's count; (6) the central
> gable + oculus/cartouche crowns the pavilion; (7) whole width corner to corner,
> windows plumb, floor lines unbroken; (8) nothing added that is not on The
> Astral. If any check fails, correct before outputting.

## After the render comes back (Phase C/E — I do this)
1. Audit the raw render against the photos — **first check: 5 residential floors +
   arched top + central gable/oculus; then: the centre pavilion is a three-part
   canted oriel (three columns + mullions), not a recess or a flat window.**
   Re-render only for those truthfulness failures, never for placement.
2. Wire as bespoke side face `3064408:india` (India end stops rendering
   typological brick, carries this texture across the India chord; seed an
   `ASTRAL_INDIA_KINK` only if the Franklin-corner fold needs it).
3. Spec the openings on the FLAT texture. **Windows recessed, matching Franklin
   v2** (`recessM ~0.16`, `sill:false`) — the v1 "flush" note is superseded.
   Add one `bay.plan:"oriel3"` over the central pavilion's u-slice (`centerFraction`
   tuned so the facet breaks land on the painted mullions, `projectionM ~0.5–0.6`).
   Tag the central entrance, top-floor arcade, and gable oculus
   `shape:"arch"/"circle"`. Refine in `?facadeedit=1`.
4. Verify in-engine at all four angles; blank-box / cornice-notch / Franklin-corner
   seam checks. Append a HERO_FACADE_LOG entry.

## Open decisions for Batu
- **Aspect:** ~2:1 from the ~41 m × ~21 m face; final settles against the derive
  overlay (drawn fold wins, measured not assumed).
- **Bay count on the India face:** v1 read one central oriel + flat wings. If the
  wings actually carry projecting bays too, say so and I'll add them to the prompt.
