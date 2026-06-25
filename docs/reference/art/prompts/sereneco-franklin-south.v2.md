# Sereneco Building — Franklin South Run (Kennaland → Threes) — Render Package (v2)

> ⛔ **SUPERSEDED / WRONG PREMISE (Batu, 2026-06-25).** v2 was built on a bad
> audit. The grey Art-Deco rooftop with gold stars is **a separate, taller
> building set back BEHIND** this warehouse — NOT part of it. This building's roof
> is **FLAT**, and the round-1 render (`sereneco--franklin-south.png`) correctly
> omitted the pavilion. The style was also fine. **The accepted render is the
> round-1 output; this v2 prompt is NOT to be used.** Kept only for the audit-trail
> lesson: a set-back, different-material rooftop mass can be a genuine neighbor —
> confirm with Batu before forcing it into the elevation.

Status: ~~Render package — awaiting Batu's GPT re-render.~~ **Superseded — see banner above.** Supersedes **v1**
after the round-1 render (`ChatGPT Image Jun 25 06_09_40 PM`) missed on two
content-level counts:

1. **Dropped the Art-Deco rooftop pavilion entirely** — the grey-stucco
   gold-star gables (the most recognizable feature) were excluded. Diagnosis:
   the neighbor-exclusion logic misfired — because the pavilion is set back and a
   *different material/color* (grey vs red brick), the model read it as a
   separate background building and cut it. **Fix (v2): pin the pavilion as PART
   of this building — explicitly NOT a neighbor.**
2. **Came out photorealistic, not hand-inked** — no paper, no II-C linework.
   (The same-session Elder Greene render WAS inked, so the style tiles work — they
   weren't attached here, or the photo sources dominated.) **Fix (v2): harden the
   style instruction — "an inked illustration, NOT a photograph."**

Everything else in round 1 was correct (aged red brick, two storeys, low paired
KENNALAND windows, the four storefronts in order, the HAIR-WE-DO-THAT blade sign,
no street furniture). §1, §3, §5 are unchanged from
[`sereneco-franklin-south.v1.md`](sereneco-franklin-south.v1.md) — only §2 (the
prompt) and §4 (audit) are revised here.

**Before re-rendering, confirm the attachments:** the two II-C style tiles MUST
be attached (round 1's photoreal output suggests they weren't), and the
pavilion-showing wides (`franklin-wide-azure-to-chama`,
`franklin-chama-to-madeline`, `madeline-head-on`) MUST be in the set.

---

## 2. The prompt to paste (v2 — pavilion + style hardened)

> Redraw the building shown in the attached photos as a single, strictly
> **orthographic facade elevation**. Render it as a **hand-inked editorial
> ILLUSTRATION on warm paper — in the style of the attached style reference, NOT
> a photograph and NOT a photorealistic render.** Visible confident 1–4px pen
> linework, controlled hatching for shadow, flat muted warm washes, paper grain
> and tooth. **If the result looks like a photo, it is wrong — it must read as a
> drawing.** Head-on flat projection: every vertical edge plumb — no 3/4 view, no
> perspective, no foreshortening, no leaning window columns.
>
> **THE SUBJECT — ONE continuous 2-storey red-brick warehouse, one unbroken
> parapet, FOUR ground-floor tenants side by side.** Draw the building's **FULL
> width**, starting at the **LEFT edge with KENNALAND** and ending at the **RIGHT
> edge with THREES BREWING**, in this exact order; do not crop to one shop, do not
> compress or drop a tenant:
>
> 1. **KENNALAND (far LEFT — start here) — a hair salon:** a **narrow recessed
>    dark entrance** with a small **red "KENNALAND"** sign, tucked between brick
>    piers. This is the leftmost storefront — draw it in full, do not crop it to a
>    sliver at the edge.
> 2. **CHAMA MAMA — a restaurant:** a run of **warm wood-framed (orange) glazed
>    doors and display windows** between brick piers, under a **long flat black
>    awning** lettered **"chama mama"** in white lowercase, dark transom glass
>    above.
> 3. **MADELINE'S — a bar:** a **green-painted recessed storefront bay** set into
>    the brick — a tall **green-framed black-glass window** with an upper transom,
>    a cream sign band reading **"MADELINE'S"** in green serif, a green base, and
>    a separate **dark service door** to its right.
> 4. **THREES BREWING (far RIGHT, the corner) — a pub:** **large black steel-framed
>    industrial windows / folding glass** under a **flat black canopy with small
>    can-lights**, exposed brick piers, a dark recessed entrance, **"THREES
>    BREWING"** lettering with a small triangle logo in the glass. This is the
>    **corner** bay — the building ends here.
>
> **UPPER FLOOR (one row, continuous over all four tenants):** a regular rhythm of
> **low, wide, PAIRED dark windows** set in **shallow segmental brick arches** —
> **NOT** tall double-hung windows. Some carry **"KENNALAND"** lettering; a black
> **"HAIR WE DO THAT"** blade sign hangs near the Chama Mama end. **Count the
> window pairs from the photos and draw exactly that many.**
>
> **ROOFTOP PAVILION — YOU MUST DRAW THIS; IT IS PART OF THIS BUILDING.** On the
> roof, set back behind the main brick parapet and roughly centered, sits a **grey
> stucco Art-Deco rooftop penthouse**: **two stepped triangular gable peaks**,
> each framing a **gold five-pointed star inside a raised diamond**, flanked by
> **fluted pilasters with gold caps**, with a **central raised cube and a band of
> small windows** between them. **This grey structure is THIS building's own
> rooftop pavilion — it is NOT a separate building behind it, NOT a neighbor, and
> must NOT be excluded or cropped out.** Draw it rising directly above and behind
> this building's red-brick parapet, smaller than and centered over the warehouse.
> Omitting it is a failure.
>
> **SHELL:** weathered, varied **red industrial brick** (aged, patched, with
> faded ghost-paint — not pristine), a simple **corbelled brick cornice with tile
> coping** at the roofline, **two storeys only** (plus the set-back rooftop
> pavilion above).
>
> **READ FROM THE PHOTOS — DON'T INVENT, REGULARIZE, OR DROP ANYTHING:**
> - All **four** storefronts present, in order, each once, KENNALAND at the far
>   left and THREES at the far right; the upper window row is **low paired
>   windows**, count from the photos.
> - The **grey rooftop pavilion with two gold-star gables is present** and belongs
>   to this building.
> - **Two storeys only** below the parapet — one upper window row.
> - This is **one building** under one parapet — **no party wall** inside it; do
>   not split it into separate buildings between tenants.
>
> **OUTPUT.** Facade only, full bleed, as an **inked illustration on paper**. No
> sky, no sidewalk, no people, no vehicles, no trees, and **NO street furniture**
> (no café tables, chairs, pergolas, parklets, planters, string lights,
> umbrellas). Proportion the canvas to the building's own width and height. Keep
> the ground line, roofline, sign band, and cornice continuous across the run.
> Windows and doors tonally distinct from the wall — no wall-colored doors.
>
> **AUDIT BEFORE FINISHING:** (1) it READS AS A HAND-INKED DRAWING on paper, not a
> photo; (2) ONE building, all FOUR storefronts in order (Kennaland far left →
> Chama Mama → Madeline's → Threes far right), none dropped/cropped/merged, no
> party wall invented; (3) the **grey Art-Deco rooftop pavilion with two gold-star
> gables IS present**, set back and centered (this was missed before — verify it);
> (4) upper floor = **low paired windows in segmental arches**, count matches;
> (5) two storeys, aged red industrial brick + corbelled cornice; (6) no trees,
> street furniture, people, or vehicles. Correct any failure before outputting.

---

## 4. Audit the raw render against the photos (v2 — pavilion + style added)

- ☐ **Reads as an INKED ILLUSTRATION on paper** — pen linework + paper grain, not
  a photo/photoreal render. *(Round-1 fail.)*
- ☐ **Rooftop Deco pavilion PRESENT** — grey stucco, **two gold-star gable peaks**,
  fluted pilasters, central cube; set back, centered, attached to this building.
  *(Round-1 fail — check this first.)*
- ☐ **ONE building, all four tenants** — Kennaland (far left) → Chama Mama →
  Madeline's → Threes (far right); no party wall invented, none cropped.
- ☐ **Extent** — starts at Kennaland in full (not a sliver), ends at Threes/corner.
- ☐ **Upper floor = low paired windows in segmental arches**, count per photos.
- ☐ **Two storeys**, aged red industrial brick, corbelled cornice + tile coping.
- ☐ **Storefronts** — Kennaland red sign; Chama Mama wood frames + black "chama
  mama" awning; Madeline's green bay + cream sign + service door; Threes black
  industrial glazing + canopy + "THREES BREWING".
- ☐ **No** trees / street furniture / people / vehicles / sky / sidewalk.
- ☐ Orientation reads L→R (awning + sign text not mirrored; Threes on the right).

Re-render only for content/structure (missing pavilion, photoreal not inked,
dropped tenant, wrong storey count, wrong window type) — **never** for a
few-percent placement; that's the derive step's job.

---

*§1 (building face-by-face), §3 (attach order), §5 (geometry / registration) are
unchanged — see [`sereneco-franklin-south.v1.md`](sereneco-franklin-south.v1.md).*
