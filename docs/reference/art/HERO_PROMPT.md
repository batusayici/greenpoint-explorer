# Universal Hero Facade Prompt (GPT-5.5, image-to-image)

**Paste this prompt as-is. The only thing you change per building is the
attached photos.** GPT does not need the building's name, its neighbors, the
corner fold %, or a canvas size — the photos carry the subject's identity, and
the real fold/placement get measured from the render afterward
(`derive-facade-spec.mjs`), never fed in up front.

This supersedes the per-building fill-in scaffold for ordinary brick
corner/mid-block heroes. **Landmarks** (singular architecture — the church, the
Pencil Factory, Keramos Hall) are out of scope here; they get a bespoke prompt.

The reliability of a zero-fill-in prompt rides on **photo framing**: the subject
must be the centered, most-fully-shown building, ideally party wall to party
wall. Frame the shots that way and the rules below do the rest. If one stubborn
building still spills into a neighbor, the escape hatch is a single added line
naming that neighbor to exclude — but that's the exception, not the routine.

---

## The prompt

> Redraw the building shown in the attached photos as a single, strictly
> orthographic facade elevation, in the hand-inked editorial style of the
> attached style reference (confident 1–4px linework, controlled hatching for
> shadow, muted warm palette, paper texture). Head-on flat projection: every
> vertical edge plumb — no 3/4 view, no perspective, no foreshortening, no
> leaning window columns.
>
> **WHAT TO DRAW**
> - Draw ONE building: the single building that is **centered and most fully
>   shown** across the photos. That is the subject.
> - The photos are a continuous streetscape. Buildings touching the subject —
>   partially shown, cropped at the frame edges, or set off by a vertical
>   **party-wall seam** where the brick / cornice / roofline change — are
>   NEIGHBORS, not the subject.
> - Bound the elevation by the subject's two party walls: start at one seam, end
>   at the other. Do NOT continue the facade past a party wall, and do NOT
>   borrow a neighbor's windows, doors, cornice, materials, storefronts,
>   awnings, or signage — a sign or shopfront on an adjacent building is not the
>   subject's, even though it appears in the photos.
> - If the subject wraps a street corner (two street faces are visible),
>   **unwrap both faces onto one canvas**, left face then right face, meeting at
>   the corner fold. Keep the ground line, roofline, sign band, and cornice
>   continuous and at consistent heights across the fold.
>
> **READ EVERYTHING FROM THE PHOTOS — DON'T INVENT.** Within the subject's party
> walls, copy from the photos exactly:
> – the number of window rows above the ground floor — draw exactly that many,
>   no more, no fewer; the storefront/commercial band is the ground floor ONLY,
>   below all of those rows;
> – the number and rhythm of window columns on each face;
> – every ground-floor opening (door, display window, storefront) in
>   left-to-right order, each exactly once;
> – the corner condition as photographed — if the entrance sits on a
>   chamfered/cut corner, draw it there at the fold; never relocate it onto a
>   flat face or merge tenants into one continuous shopfront;
> – materials, cornice, sills/hoods, awnings, fire escapes, projecting bays, and
>   signage lettering, all as drawn. A projecting bay window is drawn as its
>   real panes side by side, in-plane — never as a flat strip.
> Do not invent, omit, simplify, regularize, or rearrange anything.
>
> **OUTPUT.** Facade only, full bleed. No sky, no sidewalk, no people, no
> vehicles, no street furniture. Proportion the canvas to the building's own
> width and height (not the photo's). Keep windows and doors tonally distinct
> from the wall — no wall-colored doors.
>
> **AUDIT BEFORE YOU FINISH** (against the photos): (1) it is ONE building,
> bounded by its party walls — no neighbor facade, windows, doors, or signage;
> (2) window-row count matches; (3) window-column count per face matches; (4)
> every ground-floor opening appears exactly once, in order, and the corner
> condition matches; (5) nothing was added that is not on the subject in the
> photos. If any check fails, correct the draft before outputting.

**Attach, in this order:**
1. the II-C style tile — `II-C-style-system-tile.png` (this folder)
2. one assembled scene for tone — `II-assembled-mini-scene.png` (this folder)
3. the subject's photos — a wide shot of each street face showing the subject
   **from party wall to party wall**, plus a corner shot if it's a corner
   building. **Frame the subject centered and dominant; the more fully the
   photos show it edge-to-edge, the more accurate the elevation.**

---

## After the render

The prompt is only step 1. Everything downstream is unchanged — follow the
registration playbook in [`GENERATION_KIT.md`](GENERATION_KIT.md): audit the raw
render against the photos, then **derive the spec from the render** (measure the
fold and openings from the painted pixels — never author them from a contract),
gate on the overlay, register into `src/data/facade-specs/`, wire into
`FACADE_COMPOSITES`, and one in-engine check. Append the per-building lesson to
`HERO_FACADE_LOG.md`.
