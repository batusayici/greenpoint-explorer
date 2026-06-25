# Universal Hero Facade Prompt (GPT-5.5, image-to-image)

**Paste this prompt as-is. The only thing you change per building is the
attached photos.** GPT does not need the building's name, its neighbors, the
corner fold %, or a canvas size — the photos carry the subject's identity, and
the real fold/placement get measured from the render afterward
(`derive-facade-spec.mjs`), never fed in up front.

This supersedes the per-building fill-in scaffold for ordinary brick
corner/mid-block heroes. **Landmarks** (singular architecture — the church, the
Pencil Factory, Keramos Hall) are out of scope here; they get a bespoke prompt.

The reliability of a zero-fill-in prompt rides on **photo framing**: the photos
must show the subject from one party wall to the other, so the model can see
where the building actually starts and ends. Two failure modes both trace back
to framing — the render **spilling into a neighbor**, or **cropping the building
short** (dropping a same-building storefront, or truncating a corner face). The
escape hatch for either is one added line in the precision variant: name the
neighbor to exclude, or name the building's true extent / corner fold. Large
multi-tenant corner buildings sit at that boundary — see the caution by the
attachments.

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
> - Draw ONE building — but a single building often contains **several
>   ground-floor storefronts or tenants. Include ALL of them.** The subject is
>   the entire continuous structure: everything under one continuous
>   roofline / parapet and cornice, at consistent floor heights and in the same
>   brick / material, spanning from one true party wall to the other. Two
>   different shops, awnings, or signs under the same unbroken facade are the
>   SAME subject — do NOT crop down to a single storefront or tenant.
> - A **party wall** (the subject's edge) is where the STRUCTURE changes — a
>   break in building height, roofline, or cornice; a distinct construction or
>   brick; a clear vertical seam to a differently-built building. It is NOT
>   where a tenant, awning, sign, or storefront ends. NEIGHBORS are separate
>   structures beyond those party walls — including partially-shown buildings
>   cropped at the frame edges. Do NOT continue past a party wall, and do NOT
>   borrow a neighbor's windows, doors, cornice, materials, storefronts,
>   awnings, or signage.
> - Draw the building's **FULL width** — every storefront and every upper-floor
>   window bay between the two party walls. Do not stop at the first tenant or
>   trim the ends to make it fit.
> - If the subject wraps a street corner, **unwrap both street faces onto one
>   canvas** — each face drawn to its FULL length, from the corner out to its
>   far party wall. Count the window bays and storefronts on EACH face
>   independently from the photos and draw every one; never truncate, compress,
>   or sample a face to make it fit. If the corner is chamfered / cut (an angled
>   corner bay, often the entrance), draw that chamfer as its **own narrow
>   vertical face** between the two street faces and keep the entrance on it — do
>   not flatten the corner into a single plane. Keep the ground line, roofline,
>   sign band, and cornice continuous and at consistent heights across the
>   fold(s).
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
> bounded by its true party walls — **every** storefront and tenant under the
> continuous facade is included (not cropped to one shop), and no separate
> neighbor structure is included; (2) the building's **FULL width** is present —
> count the upper-floor window bays and the storefronts on EACH face in the
> photos and confirm none were dropped and no face was cut short; (3)
> window-row count matches; (4) window-column count per face matches; (5) every
> ground-floor opening appears exactly once, in order, and the corner condition
> (including any chamfer) matches; (6) nothing was added that is not on the
> subject. If any check fails, correct the draft before outputting.

**Attach, in this order:**
1. the II-C style tile — `II-C-style-system-tile.png` (this folder)
2. one assembled scene for tone — `II-assembled-mini-scene.png` (this folder)
3. the subject's photos — a wide shot of each street face showing the subject
   **from party wall to party wall**, plus a corner shot if it's a corner
   building. **Frame the subject centered and dominant; the more fully the
   photos show it edge-to-edge, the more accurate the elevation.**

> **For a large or multi-tenant building, the photos must establish where the
> building actually ENDS at both party walls** — otherwise the render crops it
> short (drops a same-building storefront) or truncates a corner face. If no
> single shot shows the whole building edge-to-edge, attach overlapping shots
> that together cover both ends and the full length of each street face. When
> the extent is genuinely ambiguous from photos alone, switch to the precision
> variant and state the extent / corner fold explicitly.

---

## After the render

The prompt is only step 1. Everything downstream is unchanged — follow the
registration playbook in [`GENERATION_KIT.md`](GENERATION_KIT.md): audit the raw
render against the photos, then **derive the spec from the render** (measure the
fold and openings from the painted pixels — never author them from a contract),
gate on the overlay, register into `src/data/facade-specs/`, wire into
`FACADE_COMPOSITES`, and one in-engine check. Append the per-building lesson to
`HERO_FACADE_LOG.md`.
