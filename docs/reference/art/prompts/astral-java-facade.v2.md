# Render Package — Astral, FULL Java St (south) facade — v2 (PROJECTING corner oriel)

**Supersedes `astral-java-facade.v1.md`.** v1 produced a strong II-C elevation
(`astral-apartments--java-full.png`, 1774×887) — correct six storeys, correct
brick/brownstone, the COFFEE corner shop, central round-arch entrance pavilion,
stepped gables — **but it drew the Franklin-corner pavilion bay as a flat 2-window
pavilion**, not a projecting canted bay. Batu (2026-06-23) confirmed that
corner is a **projecting oriel**, so the engine's `oriel3` fold needs it drawn as
a **canted 3-facet tripartite window with three columns side-by-side in-plane**
(same contract Franklin v2 fixed — see `astral-full-facade.v2.md`). A flat
2-window pavilion cannot be folded into a projecting oriel: the side panes have
nothing to land on and read grey.

**Only the Franklin-corner pavilion bay changes.** Everything else v1 got right —
the six-storey count, brownstone arcade base, the COFFEE corner storefront, the
central round-arch entrance pavilion + gable + oculus, the flat punched-window
wings with fire escapes, the terracotta roundel, the photographed **asymmetry**
(do not mirror) — stays. Java's single projecting bay is the Franklin-corner one.

Produces `astral-apartments--java-full.png` (overwrite) — the entire Java (south)
elevation as one head-on orthographic flat texture, wired as one `3064408:java`
face.

## Why the corner oriel must be drawn a specific way (the engine contract)

The bay is NOT painted as a 3D projection — the texture stays a flat head-on
elevation. The engine carves depth (`bay.plan:"oriel3"`): it splits the oriel's
painted width into a centre facet + two angled return facets and folds the flat
artwork forward. For that fold to reconstruct a real oriel, the flat drawing must
already contain, within the oriel's width, per residential floor:

- a **centre window pane** (front facet), flanked by
- a **narrower window pane on each side** (the two angled return facets),
- with **mullions/piers between the three panes**, the side panes narrower and
  shaded a touch deeper (the foreshortening a canted bay shows seen straight on).

If the corner is a flat 2-window pavilion, the fold has no side panes to place on
the returns and reads grey. **Three columns in the oriel, mullions visible, side
panes shaded as projecting.**

## Orientation (locked — unchanged from v1)
- The Astral fills the Franklin block-front between **India St (NORTH)** and
  **Java St (SOUTH)**; rear on West St.
- The Java elevation is the **~41 m deep (E–W) short face**, ~21 m tall (6
  storeys), from the **Franklin↔Java corner pavilion** (LEFT edge — the projecting
  canted oriel + stepped gable, over the corner shop) across to the **Java↔West St
  corner** (RIGHT edge). Both canvas side-edges = the two building corners, drawn
  head-on; do NOT wrap the perpendicular returns (engine folds them).

## The counts — LOCKED (same six storeys as Franklin/India)
1. **Ground** — rusticated rock-faced **brownstone base**: round-arch openings, a
   **central grand round-arch entrance**, and the **corner storefront (COFFEE)** at
   the Franklin-corner (left) end — copy the shopfront + any legible signage, do
   not invent text.
2.–5. **FOUR floors of red brick**, **rectangular punched windows** (stone sills,
   brick hoods) on the **flat wings**, **fire-escape ironwork**, a **terracotta
   roundel medallion** where `java2.png` shows it; the **projecting canted oriel
   bay** at the Franklin-corner pavilion.
6. **Top floor** — **round-ARCHED windows** under a corbelled brick cornice.
→ **FIVE residential floors above the ground floor, top one arched. Five.**

**Two gabled pavilions:** (a) **central entrance pavilion** (mid-face) — brownstone
round-arch entrance → stacked tall round-arched windows → stepped brick gable with
a round-arch top window + terracotta cartouche above the cornice (this one is
flat/recessed entrance grammar, NOT a projecting bay); (b) **Franklin-corner
pavilion (LEFT edge) — the PROJECTING canted oriel**, drawn as the three-part bay
below, rising through storeys 2–5, crowned by its own stepped brick gable, over
the COFFEE shop.

**Roofline:** corbelled brick cornice + **iron parapet railing**; the two stepped
gables; terracotta cartouche/roundel medallions where photographed.

**Horizontal — copy the photos exactly, INCLUDING the asymmetry; do NOT mirror.**
Left edge = Franklin↔Java corner pavilion (projecting canted oriel + COFFEE shop);
then a regular grid of **flat punched-window axes with fire escapes**; the
**central round-arch entrance pavilion**; continuing to the **Java↔West St corner**
(right). Count the window axes off `java2.png` and reproduce exactly that many;
floors stack plumb, floor lines unbroken, except where the corner oriel and central
pavilion break the grid.

## Photos to attach (truth source — `docs/reference/hero-evidence/astral/`)
Re-orient upright first (`.jpeg` field shots EXIF-rotated 90°; `.png` refs upright).
- **Java elevation, near-straight-on (master — count floors AND axes):** `java2.png`
- **Franklin↔Java corner pavilion (the projecting canted bay + stepped gable):**
  `java1.png`
- **Ground floor — central arch entrance + COFFEE corner shop + brownstone base:**
  `java ground.png`
- **Franklin obliques catching the Java corner (corner-bay projection + shared
  cartouche grammar — NOT the Java face head-on):** `java.jpeg`, `java corner.jpeg`.
- **Shared brick/cornice/cartouche/arched-top/fire-escape grammar:** `IMG_0969`,
  `IMG_0970`, `IMG_0964`, `IMG_0962`.
- Plus II-C style tiles: `II-C-style-system-tile.png`, `II-assembled-mini-scene.png`.

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **Java Street side elevation** of the building in the attached photos
> — **The Astral, 184 Franklin Street, Brooklyn** (the red-brick-and-brownstone
> 1886 Queen Anne apartment block) — as ONE single, strictly orthographic, head-on
> architectural elevation in the attached hand-inked editorial illustration style
> (II-C system: confident 1–4 px linework, controlled hatching for shadow, muted
> warm red-brick + brownstone palette, paper texture). Flat projection only: every
> vertical plumb, every floor line dead horizontal, no 3/4 view, no perspective, no
> foreshortening of the wall. Draw the WHOLE width of this side in one image,
> corner pavilion to corner pavilion.
>
> **Draw ONE building only — The Astral.** Do not borrow windows, cornices,
> materials, or signage from any neighbor. This is the building's **south (Java
> Street) face**, shown in `java2.png` / `java ground.png`.
>
> **GET THE FLOOR COUNT RIGHT — SIX storeys:**
> 1. a ground floor of **rusticated rock-faced brownstone**: round-arch residential
>    openings, a **central grand round-arch entrance**, and a **corner storefront
>    (coffee shop)** at the left (Franklin-corner) end — copy the shopfront and any
>    legible signage exactly, do not invent words;
> 2–5. **FOUR floors of red brick with rectangular punched windows** (stone sills,
>    brick hoods), **fire-escape ironwork**, and a **terracotta roundel medallion**
>    where photographed;
> 6. a **top floor of ROUND-ARCHED windows** under a corbelled brick cornice.
> That is **FIVE residential floors above the ground floor — count them: 5 — the
> top one arched.** Do NOT draw four. Do NOT compress two floors into one.
>
> **THE FRANKLIN-CORNER PAVILION (LEFT EDGE) IS A PROJECTING CANTED ORIEL BAY —
> this is the most important fix.** At the left edge, above the corner coffee shop,
> draw a **projecting three-part canted oriel bay** rising unbroken through the four
> brick floors (storeys 2–5). Even though the view is head-on, draw the bay as
> **three window panes side by side per floor**: a wider **centre pane** with a
> **narrower angled side pane on its left and on its right** (a three-sided canted
> bay seen straight on), with **mullions/piers between the three panes**. Shade the
> two side panes and their piers a little deeper than the flat wall so the bay reads
> as **projecting toward the viewer**. Do NOT draw the corner as a flat two-window
> pavilion — it must be a three-part canted bay that bulges out. Crown it with its
> own **stepped brick gable** above the cornice.
>
> **The central entrance pavilion** (mid-face) is a separate, flat composition: the
> brownstone round-arch entrance → stacked tall round-arched windows → a stepped
> brick gable with a round-arch top window and terracotta cartouche above the
> cornice. It does NOT project — only the Franklin-corner bay projects.
>
> **The wings stay FLAT.** Between the corner oriel and the central pavilion, and
> on to the right corner, draw a regular grid of **single rectangular punched
> windows with fire escapes** — plain flat wall, no projecting bays. **Copy the
> photos exactly, INCLUDING the asymmetry; do NOT force a mirror.** Left edge =
> Franklin↔Java corner pavilion (projecting canted oriel + corner shop); then the
> flat punched-window grid; the central round-arch entrance pavilion; continuing to
> the **Java↔West Street corner** at the right edge. The left/right edges are the
> building's corners — draw head-on up to each corner pier; do NOT wrap the
> perpendicular Franklin or West-Street returns. **Count the window columns in the
> photo and reproduce exactly that many.** Floors stack plumb with unbroken floor
> lines except where the corner oriel and central pavilion break the grid.
>
> **The photos are the only source of architectural truth** — copy the brownstone
> base, the central arched entrance, the corner shopfront, the projecting canted
> corner oriel, the flat punched-window grid, the fire-escape ironwork, the
> terracotta roundel, the round-arched top floor, the corbelled cornice, the
> parapet railing, and the two stepped gables exactly as photographed. Materials:
> red brick body, rock-faced brownstone base. Do not invent, omit, simplify,
> regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored openings).
> **Facade only**, full bleed, no sky, no ground, no sidewalk, no cars, no people,
> no street furniture, no trees (draw the wall behind any street tree). Continuous
> datums: ground line along the bottom edge, cornice/parapet along the top edge.
> **Landscape elevation, about 2 : 1** (roughly 2300 × 1150 px or larger), the full
> Java face in one frame; do not crop the corners, do not letterbox, do not square
> it up.
>
> **Before finalizing, audit against the photos:** (1) The Astral's Java face only,
> red brick + brownstone; (2) **exactly FIVE residential floors above the ground
> floor, top floor round-arched** — recount and fix if you drew four; (3) ground
> floor rusticated brownstone with the central round-arch entrance AND the corner
> coffee shop; (4) **the Franklin-corner pavilion is a PROJECTING three-part canted
> oriel (three panes per floor, mullions between, side panes shaded as projecting)
> — NOT a flat two-window pavilion**; (5) the central entrance pavilion + the
> corner oriel each carry a stepped gable; the terracotta roundel, fire escapes,
> and window grid match the photos (asymmetric, not mirrored); (6) whole width
> corner to corner, windows plumb, floor lines unbroken; (7) nothing added that is
> not on The Astral. If any check fails, correct before outputting.

## After the render comes back (Phase C/E — I do this)
1. Audit the raw render against the photos — **first check: 5 residential floors +
   arched top + both gabled pavilions; then: the Franklin-corner pavilion is a
   three-part canted oriel (three columns + mullions), not a flat pavilion.**
   Re-render only for those truthfulness failures, never for placement.
2. Wire as bespoke side face `3064408:java` (Java end stops rendering typological
   brick, carries this texture across the Java chord; seed an `ASTRAL_JAVA_KINK`
   only if the Franklin-corner fold needs it).
3. Spec the openings on the FLAT texture. **Windows recessed, matching Franklin
   v2** (`recessM ~0.16`, `sill:false`) — the v1 "flush" note is superseded. Add
   one `bay.plan:"oriel3"` over the Franklin-corner pavilion's u-slice
   (`centerFraction` tuned so the facet breaks land on the painted mullions,
   `projectionM ~0.5–0.6`). Tag the central entrance, corner-bay arches, top-floor
   arcade, and roundel `shape:"arch"/"circle"`. Refine in `?facadeedit=1`.
4. Verify in-engine at all four angles; blank-box / cornice-notch / Franklin-corner
   seam checks. Append a HERO_FACADE_LOG entry. With Franklin + India + Java all
   built, flip `building-tiers` buildStatus→built + update `curationTiers.test.mjs`.

## Open decisions for Batu
- **Corner storefront signage / central-entrance number:** I'll copy what's legible
  in `java ground.png` (the coffee shop is a real tenant → place/story record +
  factual-review gate before public release; real names fine in dev).
- **Aspect:** ~2:1 from the ~41 m × ~21 m face; settles against the derive overlay.
