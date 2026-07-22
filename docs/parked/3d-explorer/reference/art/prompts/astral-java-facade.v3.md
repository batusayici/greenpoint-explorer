# Render Package — Astral, TRUE Java St (south) frontage ~19.6m — v3 (scope fix)

**Supersedes `astral-java-facade.v2.md`.** v2 rendered a full ~41m corner-to-
corner Java face with two corner pavilions. **The footprint (NYC Open Data,
59-vertex polygon) says the real Java Street street wall is only ~19.6m** — the
**Franklin-corner (southwest) section** of the block. East of there the south
side steps ~10m back (north), behind interior light courts, and is NOT street-
facing. So the Java frontage is ONE pavilion + the entrance, not two pavilions
over 41m. (Verified in-engine 2026-06-23: `greenpoint`-role chord = 19.6m;
India by contrast runs the full 38m. Batu confirmed: re-render to the true wall.)

**The fix:** render only the real ~19.6m Java frontage, at its true aspect
(~19.6m wide × ~21m tall ≈ **1 : 1, essentially square / very slightly tall**),
NOT a 2:1 landscape. Keep the v2 oriel fix (projecting 3-window canted bay).

Produces `astral-apartments--java-full.png` (overwrite) — the ~19.6m Java street
frontage as one head-on orthographic flat texture, wired as `3064408:java`.

## What is actually on the ~19.6m wall (read from the photos, left→right)
1. **Franklin-corner pavilion (LEFT edge):** a **projecting canted oriel bay**
   rising through storeys 2–5, crowned by a **stepped brick gable** with
   round-arch top windows; at its base the **corner COFFEE shop** (storefront +
   signage, `java ground.png`, `java1.png`).
2. **Brownstone base + brick bays:** a short run of **rectangular punched
   windows with fire escapes** over the rusticated brownstone base.
3. **Central round-arch residential entrance:** the brownstone **round-arch
   doorway** (`java ground.png`), roughly center-right, with the building's
   stacked windows / a modest gable above as photographed.
4. **Right edge = a plain brick return / pier**, NOT a second grand pavilion —
   this is where the building steps back off Java St. Do not draw a West-St
   corner pavilion; it is set back and not on this street.

## Why the corner oriel must be drawn a specific way (engine contract — unchanged)
The texture stays a flat head-on elevation; the engine carves depth
(`bay.plan:"oriel3"`) by folding the bay's painted width into a centre facet +
two angled returns. So within the corner oriel's width, per residential floor,
draw **three window panes side by side**: a wider **centre pane** + a **narrower
canted pane on each side**, **mullions between**, side panes shaded a touch
deeper so the bay reads as **projecting toward the viewer**. A flat single/double
window has no side panes to fold and reads grey.

## The counts — SIX storeys (unchanged)
1. Ground: rusticated **brownstone base** — the COFFEE corner shop (left) + the
   central round-arch entrance + brownstone-framed openings.
2.–5. **FOUR floors of red brick**, rectangular punched windows (stone sills,
   brick hoods), fire-escape ironwork; the **projecting canted oriel** at the
   Franklin-corner pavilion. A **terracotta roundel** if `java2.png` shows it on
   this section.
6. **Top floor of round-ARCHED windows** under a corbelled brick cornice.
→ **FIVE residential floors above the ground floor, top one arched.**

## Photos to attach (truth source — `docs/reference/hero-evidence/astral/`)
Re-orient upright first (`.jpeg` EXIF-rotated 90°; `.png` upright).
- **Master (this ~20m section, count axes + floors):** `java2.png`
- **Franklin-corner pavilion (the projecting canted bay + stepped gable):** `java1.png`
- **Ground floor — COFFEE corner shop + central round-arch entrance + brownstone base:** `java ground.png`
- **Shared brick/cornice/cartouche/arched-top/fire-escape grammar:** `IMG_0969`, `IMG_0964`, `IMG_0962`.
- Plus II-C style tiles: `II-C-style-system-tile.png`, `II-assembled-mini-scene.png`.

## Prompt (image-to-image, GPT-5.5 / paste verbatim)

> Redraw the **Java Street frontage** of **The Astral, 184 Franklin Street,
> Brooklyn** (the 1886 red-brick-and-brownstone Queen Anne apartment block) as
> ONE single, strictly orthographic, head-on architectural elevation in the
> attached hand-inked editorial illustration style (II-C system: confident
> 1–4 px linework, controlled hatching for shadow, muted warm red-brick +
> brownstone palette, paper texture). Flat projection only: every vertical plumb,
> every floor line dead horizontal, no 3/4 view, no perspective, no foreshortening
> of the wall.
>
> **Draw ONLY the ~20-metre Franklin-corner section of the Java face — NOT the
> whole block.** This is a fairly NARROW, almost SQUARE elevation (about as tall
> as it is wide): one corner pavilion plus the entrance, six storeys tall. Do NOT
> draw a long 2:1 wall, and do NOT draw a second corner pavilion at the right.
>
> **Draw ONE building only — The Astral.** Do not borrow from neighbors.
>
> **SIX storeys:** (1) a ground floor of **rusticated rock-faced brownstone** with
> a **corner COFFEE shop** at the left (Franklin-corner) end and a **central
> round-arch residential entrance** — copy the shopfront and signage as legible,
> do not invent words; (2–5) **FOUR floors of red brick** with rectangular punched
> windows (stone sills, brick hoods) and **fire-escape ironwork**; (6) a **top
> floor of ROUND-ARCHED windows** under a corbelled brick cornice. **Five
> residential floors above the ground floor, the top one arched — count them: 5.**
>
> **LEFT edge = the Franklin-corner pavilion, drawn as a PROJECTING canted oriel
> bay.** Above the corner COFFEE shop, draw a **projecting three-part canted oriel
> bay** rising unbroken through storeys 2–5: per floor, **three window panes side
> by side** — a wider **centre pane** with a **narrower angled side pane left and
> right**, **mullions between**, the side panes shaded deeper so the bay **bulges
> toward the viewer**. Crown the pavilion with its own **stepped brick gable** and
> round-arch top windows. Do NOT draw this corner as a flat one- or two-window
> pavilion.
>
> **Then, to the right of the corner pavilion:** a short run of **flat rectangular
> punched windows with fire escapes** over the brownstone base, and the **central
> brownstone round-arch entrance** (with the stacked windows / modest gable above
> it as photographed). **The right edge is a plain brick pier / return where the
> building ends — NOT another grand pavilion.**
>
> **Copy the photos exactly** (`java2.png`, `java1.png`, `java ground.png`):
> the brownstone base, the COFFEE corner shop, the projecting canted corner oriel,
> the central arched entrance, the punched-window grid, the fire escapes, any
> terracotta roundel, the round-arched top floor, the corbelled cornice, the iron
> parapet railing, and the corner pavilion's stepped gable. Materials: red brick
> body, rock-faced brownstone base. Do not invent, omit, simplify, regularize, or
> add width that is not there.
>
> Keep windows and doors tonally distinct from the wall. **Facade only**, full
> bleed, no sky, no ground, no sidewalk, no cars, no people, no street furniture,
> no trees (draw the wall behind any tree). Continuous datums: ground line along
> the bottom edge, cornice/parapet along the top edge. **Output roughly SQUARE —
> about 1 : 1 (e.g. ~1150 × 1200 px), very slightly taller than wide** — the
> ~20 m Java frontage in one frame. Do NOT make it a wide 2:1 banner; do NOT crop
> the corner pavilion; do NOT letterbox.
>
> **Before finalizing, audit against the photos:** (1) The Astral's Java face only;
> (2) a NARROW, near-square ~20 m section — one corner pavilion + the entrance,
> NOT a 41 m two-pavilion wall; (3) **exactly FIVE residential floors above the
> ground floor, top floor round-arched**; (4) the ground floor has the COFFEE
> corner shop AND the central round-arch entrance over rusticated brownstone; (5)
> **the Franklin-corner pavilion is a PROJECTING three-part canted oriel (three
> panes per floor, mullions, side panes shaded as projecting) crowned by a stepped
> gable**; (6) the right edge is a plain brick return, not a second pavilion; (7)
> nothing added that is not on this ~20 m of The Astral. Correct before output.

## After the render comes back (Phase C/E — I do this)
1. Audit vs photos — **first: it is the NARROW ~20 m section (one pavilion +
   entrance, near-square), 5 residential floors + arched top; then: the corner
   pavilion is a projecting three-part canted oriel.** Re-render only for those.
2. Wire `3064408:java` on the 19.6m Java chord (already built — `composite.sides`
   greenpoint role, `leftEnd:"west"` puts the corner pavilion at the Franklin
   end). Set `segments.toM ≈ 19.6` so the texture maps 1:1.
3. Spec openings on the FLAT texture — **windows recessed** (`recessM ~0.16`,
   `sill:false`), `shape:"arch"/"circle"` on the arched top + entrance + roundel,
   one `bay.plan:"oriel3"` over the corner pavilion's u-slice (`projectionM
   ~0.5–0.6`, `centerFraction` on the painted mullions). Refine in `?facadeedit=1`.
4. Verify four angles; blank-box / cornice-notch / Franklin-corner seam. Append a
   HERO_FACADE_LOG entry.

## Note on India
India (north) is the FULL ~38m wall (role "other"), so its v2 render scope holds
— India does NOT have this 20m problem. Build India after Java.
