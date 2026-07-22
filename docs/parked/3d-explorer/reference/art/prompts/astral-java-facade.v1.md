# Render Package — Astral, FULL Java St (south) facade as ONE flat texture (v1)

**Sibling of `astral-full-facade.v1.md`** (Franklin/west) and `astral-india-facade.v1.md` (India/north). This package renders the **Java Street (south) side elevation** of The Astral (BIN 3064408, 184 Franklin) as a single strictly-orthographic flat texture — same single-continuous-sheet method as the Franklin face. The engine maps it across the Java face's chord (a new bespoke side face; today the ends render as `decorateTypologicalWall` brick — this upgrades the Java end to a hero face).

**Scope note (Batu, 2026-06-23):** originally scoped to "corner pavilion returns only," but the Java photos show a fully articulated street face — a **central round-arch entrance**, a **corner storefront (coffee shop)**, a **canted corner oriel bay**, and a **terracotta roundel** — so this renders the **whole Java street elevation, corner to corner**. Everything is read off the attached photos; nothing invented. Note the Java face is **less strictly symmetric than India** (corner shop + corner bay on the Franklin side) — copy the photographed asymmetry, do not force a mirror.

Produces `astral-apartments--java-full.png` — the entire Java (south) elevation as one head-on orthographic flat texture, wired as one `3064408:java` face segment.

## Orientation (locked)
- The Astral fills the Franklin block-front between **India St (NORTH)** and **Java St (SOUTH end)**; rear on West St. (Batu confirmed Java = south, 2026-06-23.)
- The Java elevation is the building's **~41 m deep (E–W) short face**, ~21 m tall (6 storeys). It runs from the **Franklin↔Java corner pavilion** (rounded/canted corner with a stepped gable, `java1.png`) across to the **Java↔West St corner**.
- Both **side edges of the canvas = the two building corners.** Draw the Java face head-on up to each corner pier; the perpendicular returns (onto Franklin / onto West St) fold in-engine — do NOT wrap them. These are real building ends, not seamless cuts.

## The counts — LOCKED (same building, same six storeys as Franklin/India)

**Vertical — SIX storeys, bottom → top:**
1. **Ground floor** — rusticated, rock-faced **brownstone base**: round-arch openings, a **central grand round-arch residential entrance** (brownstone voussoirs, `java ground.png`), and a **corner storefront** at the Franklin↔Java corner (the coffee shop — big shop windows, copy any signage exactly as legible, do not invent text).
2.–5. **Four floors of red brick** with **rectangular punched windows** (stone sills, brick hoods); a **projecting canted/rounded oriel bay** rising at the Franklin-corner pavilion (`java1.png`, `java2.png`); **fire-escape ironwork** as photographed; **terracotta cartouche / roundel medallions** (the building's shared ornament grammar) drawn where `java2.png` shows them on the Java face.
6. **Top floor** — **round-ARCHED windows** beneath a corbelled brick cornice.

→ **FIVE residential floors above the ground floor, the top one arched. Five.** Do not draw four; do not merge two into one.

**Central entrance pavilion (mid-face):** the rusticated brownstone **round-arch entrance** rising into a vertical stack of windows, terminating in a **stepped brick gable** with a **round-arch top window + terracotta cartouche** above the main cornice (`java2.png`).

**Franklin↔Java corner pavilion (LEFT edge):** a **rounded/canted corner bay** projecting through the upper floors, crowned by its own **stepped brick gable** with round-arch top windows (`java1.png`), over the corner storefront.

**Roofline:** main corbelled brick cornice with an **iron parapet railing**; **stepped brick gables** (the central one + the corner-pavilion one) and **terracotta cartouche medallions** where the photos show them.

**Horizontal — copy the photos exactly, including the asymmetry.** Left edge = Franklin↔Java corner pavilion (canted bay + corner shop); then the regular grid of **punched-window axes with fire escapes**; the **central round-arch entrance pavilion**; continuing to the **Java↔West St corner**. **Count the window axes off `java2.png` and reproduce exactly that many** — every residential floor shares the strict vertical grid (windows stack dead-plumb, floor lines unbroken) except where the corner bay and central pavilion break it as photographed.

## Photos to attach (truth source — all in `docs/reference/hero-evidence/astral/`)
Re-orient upright first (the `.jpeg` field shots are EXIF-rotated 90°; the `.png` web/Street-View refs are upright).
- **Java elevation, near-straight-on (the master — count floors AND axes from this):** `java2.png`
- **Franklin↔Java corner pavilion (rounded/canted bay + stepped gable):** `java1.png`
- **Ground floor — central round-arch entrance + corner coffee shop + brownstone base:** `java ground.png`
- **Franklin obliques that catch the Java corner (corner pavilion + shared base/cartouche grammar — NOT the Java elevation head-on):** `java.jpeg` (= old IMG_0957) and `java corner.jpeg` (= old IMG_0958) are Franklin-frontage obliques renamed by the corner they look toward (hash-verified; see FACADE_GRAMMAR rename map). Use for the corner pavilion read and the shared terracotta-cartouche grammar; the Java elevation proper comes from `java2.png` / `java ground.png`.
- **Cross-reference for shared grammar (brick, cornice, cartouches, arched top, fire escapes):** `IMG_0969`, `IMG_0970`, `IMG_0964`, `IMG_0962`
- Plus the II-C style tiles: `II-C-style-system-tile.png` + `II-assembled-mini-scene.png` (in `docs/reference/art/`).

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **Java Street side elevation** of the building in the attached photos — **The Astral, 184 Franklin Street, Brooklyn** (the red-brick-and-brownstone 1886 Queen Anne apartment block) — as ONE single, strictly orthographic, head-on architectural elevation in the attached hand-inked editorial illustration style (II-C system: confident 1–4 px linework, controlled hatching for shadow, muted warm red-brick + brownstone palette, paper texture). Flat projection only: every vertical plumb, every floor line dead horizontal, no 3/4 view, no perspective, no foreshortening, no leaning columns. Draw the WHOLE width of this side of the building in one image, corner pavilion to corner pavilion.
>
> **Draw ONE building only — The Astral.** Do not borrow windows, cornices, materials, or signage from any neighbor. This is the building's **south (Java Street) face**, shown in `java2.png` / `java ground.png`.
>
> **GET THE FLOOR COUNT RIGHT — the building has SIX storeys:**
> 1. a ground floor of **rusticated rock-faced brownstone**: round-arch residential openings, a **central grand round-arch entrance**, and a **corner storefront (coffee shop)** at the left (Franklin-corner) end — copy the shopfront and any signage exactly as legible, do not invent words;
> 2–5. **FOUR floors of red brick with rectangular punched windows** (stone sills, brick hoods), a **projecting canted corner oriel bay** at the Franklin-corner pavilion, **fire-escape ironwork**, and a **terracotta roundel medallion** set in the brick where photographed;
> 6. a **top floor of ROUND-ARCHED windows** under a corbelled brick cornice.
> That is **FIVE residential floors above the ground floor — count them: 5 — the top one arched.** Do NOT draw four. Do NOT compress two floors into one.
>
> **Two gabled pavilions, drawn as their own vertical compositions:** (a) the **central entrance pavilion** — brownstone round-arch entrance → stacked tall round-arched windows → stepped brick gable with a round-arch top window and terracotta cartouche above the cornice; (b) the **Franklin-corner pavilion at the left edge** — a rounded/canted projecting corner bay rising through the upper floors, crowned by its own stepped brick gable, over the corner shop.
>
> **Horizontal layout — copy the photos exactly, INCLUDING the asymmetry; do NOT force a mirror.** Left edge = the Franklin↔Java corner pavilion (canted bay + corner storefront); then a regular grid of **rectangular punched windows with fire escapes**; the **central round-arch entrance pavilion**; continuing to the **Java↔West Street corner** at the right edge. The left/right edges are the building's corners — draw the face head-on up to each corner pier; do NOT wrap the perpendicular Franklin or West-Street returns. **Count the window columns in the photo and reproduce exactly that many.** Residential floors stack plumb with unbroken floor lines except where the corner bay and central pavilion break the grid as photographed.
>
> **The photos are the only source of architectural truth** — copy the brownstone base, the central arched entrance, the corner shopfront, the canted corner bay, the punched-window grid, the fire-escape ironwork, the terracotta roundel, the round-arched top floor, the corbelled cornice, the parapet railing, and the stepped gables exactly as photographed. Materials: red brick body, rock-faced brownstone base. Do not invent, omit, simplify, regularize, or rearrange anything.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored openings). **Facade only**, full bleed, no sky, no ground, no sidewalk, no cars, no people, no street furniture, no trees (draw the wall behind any street tree). Continuous datums: ground line along the bottom edge, cornice/parapet along the top edge. The drawing is a **landscape elevation** — output about **2 : 1** (roughly 2300 × 1150 px or larger), the full Java face in one frame; do not crop the corners, do not letterbox, do not square it up.
>
> **Before finalizing, audit your draft against the photos:** (1) it is The Astral's Java face only, red brick + brownstone; (2) **exactly FIVE residential floors above the ground floor, the top floor round-arched** — recount and fix if you drew four; (3) the ground floor is rusticated brownstone with the central round-arch entrance AND the corner coffee shop; (4) both gabled pavilions present — the central entrance pavilion and the canted Franklin-corner bay — each with its stepped gable; (5) the terracotta roundel, fire escapes, and window grid match the photos (asymmetric, not mirrored); (6) the whole width is drawn corner to corner, windows plumb, floor lines unbroken; (7) nothing added that is not on The Astral. If any check fails, correct before outputting.

## After the render comes back (Phase C/E — I do this)
1. Audit the raw render against the photos — **first check: exactly 5 residential floors + arched top + both gabled pavilions.** Re-render only for truthfulness failures (wrong floor/axis count), never for placement.
2. Wire as a new bespoke side face `3064408:java` (the Java end stops rendering typological brick and carries this texture across the Java chord; the corner pavilion fold onto Franklin is handled where the Java and Franklin chords meet — seed a kink only if the corner needs it). The canted corner bay can later become a `bay` fold if the flat read isn't enough.
3. Spec the openings on the FLAT texture. **Match the Franklin face's flush decision:** complete II-C illustration → set `windows.flush: true` (author rects for registration, render the painting at the wall plane; do NOT carve procedural recesses + geometric sills — that was the clutter bug, see `window-decal-is-flush-not-recessed`). Tag the central entrance, the corner-bay arches, the top-floor arcade, and the roundel `shape:"arch"/"circle"` for any later curved relief; refine in `?facadeedit=1`.
4. Verify in-engine at all four angles; blank-box / cornice-notch / corner-seam-with-Franklin checks. Append a HERO_FACADE_LOG entry. With both India + Java + Franklin built, flip `building-tiers` buildStatus→built + update `curationTiers.test.mjs`.

## Open decisions for Batu
- **Corner storefront signage / central-entrance number:** I'll copy what's legible in `java ground.png`; the coffee shop is a real ground-floor tenant → needs a place/story record + the factual-review gate before public release (real names fine in dev). Tell me the exact lettering if you know it (don't let the model invent).
- **Aspect:** seed ~2:1 from the ~41 m × ~21 m face; settle against the derive overlay.
- **Corners-only fallback:** if you'd rather keep the central Java pavilion procedural and render only the corner-pavilion wrap, say so and I'll trim — but the central entrance + corner bay are the recognizable elements, so full-face is the recommendation.
