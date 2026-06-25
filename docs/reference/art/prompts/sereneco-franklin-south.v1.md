# Sereneco Building — Franklin South Run (Kennaland → Threes corner) — Render Package (v1)

Status: **Render package — awaiting Batu's GPT render.** First render of the
**southern ~45 m of the BIN 3337033 Franklin (east) frontage** — the continuous
red-brick warehouse run that picks up immediately **south of Azure Gourmet**
(already drawn in `sereneco--corner.png`) and runs to the **Franklin × Kent
corner** (Threes Brewing).

- **Subject:** ONE building — BIN **3337033**, the 1931 red-brick warehouse the
  Sereneco corner sits on (Batu calls it "the Sereneco building"; it is — the
  Franklin frontage is ~57 m and this is its remaining length). **Two storeys**,
  aged industrial brick, one continuous parapet, with a distinctive **set-back
  Art-Deco rooftop pavilion** (gold stars in gabled diamonds). Ground floor =
  four tenants north→south: **Kennaland** (hair salon) → **Chama Mama**
  (Georgian restaurant) → **Madeline's** (bar) → **Threes Brewing** (corner pub).
- **Truth — likeness:** the 4 field photos in §3 (Batu's 2026-06-25 drop). Save
  them to `docs/reference/asset-reference/storefront/proof-set/sereneco-franklin-south/`.
- **Truth — geometry:** BIN **3337033**, `block-franklin-milton.nyc-open-geometry.v0.1.json`.
- **Approach:** **precision variant** of the Universal Hero Prompt
  (`HERO_PROMPT.md`) — chosen on purpose. This face is (a) **long and
  multi-tenant** (four storefronts the zero-fill-in prompt would compress) and
  (b) carries **singular architecture** (the rooftop Deco pavilion) that the
  generic prompt would drop or invent. Both are exactly the cases `HERO_PROMPT.md`
  and `render-prompt-photos-are-truth` route to the precision path. The photos
  stay the binding truth (count windows/bays/openings FROM them); the prose below
  only fixes the **order**, the **extent** (where this slice starts and stops),
  the **materials**, and the **rooftop pavilion**.

> **Why this is NOT a fresh building (Batu confirm):** Kennaland/Chama/Madeline's/
> Threes sit under the **same unbroken parapet and brick as Azure Gourmet** — one
> BIN, one structure. There is **no party wall** at the Azure seam; the left edge
> of this render is an **internal continuation cut** (Azure is already drawn).
> The building's real end is the **Kent St corner** at the right.

---

## 1. The building, left → right (north → south; read into the audit)

**Material / shell (whole run):** weathered, varied **red industrial brick**
(rougher and more aged than the clean Sereneco corner render), **segmental
(shallow-arch) brick heads** over the upper windows, a simple **corbelled brick
cornice with tile coping** at the roofline. **Two storeys.** Faded ghost-paint
and patching on the brick is in-character — keep it textured, not pristine.

**Upper floor (continuous across all four tenants):** a regular rhythm of **low,
wide, paired dark windows** set in segmental brick arches — **NOT** tall
double-hungs. Several carry **"KENNALAND"** vinyl lettering and a hanging black
**"HAIR / WE DO / THAT"** blade sign over Chama Mama's end. **Count the window
pairs from the photos**; do not regularize them taller or fewer.

**Roof: FLAT** (corrected by Batu, 2026-06-25). The building's own roof is a
plain flat parapet — **no rooftop pavilion**. The grey-stucco Art-Deco penthouse
with gold-star gables visible in the photos belongs to a **separate, taller
building set back BEHIND** this warehouse — it is a **neighbor, correctly
excluded** from the elevation. (My v2 prompt wrongly tried to re-add it; the
round-1 render's flat roof was right. v2 is superseded — see its header.)

**Ground-floor tenants, north→south:**
- **(a) Kennaland (hair salon):** a **narrow recessed dark entry** just south of
  Azure Gourmet, a small **red "KENNALAND"** sign/neon. Tucked between brick
  piers; modest.
- **(b) Chama Mama (Georgian restaurant):** a run of **warm wood-framed
  (orange-stained) glazed doors and windows** between brick piers, under a **long
  flat black awning** lettered **"chama mama"** in white lowercase; dark transom
  glass above. (Sidewalk café tables/chairs = street furniture — **don't draw**.)
- **(c) Madeline's (bar):** a **green-painted recessed storefront bay** set into
  the brick — a tall **green-framed black-glass window + upper transom**, a cream
  sign band with **"MADELINE'S"** in green serif, a green-painted base; a separate
  **dark service door** to its right. (The **green pergola dining parklet** in
  front is street furniture — **don't draw**.)
- **(d) Threes Brewing (corner pub):** **large black steel-framed industrial
  windows / folding glass** under a **flat black canopy with small can-lights**,
  exposed brick piers, a dark recessed entrance, **"THREES BREWING"** lettering in
  the glass. Sits at the **Franklin × Kent corner** — the right end of the run.
  (The red plywood dining parklet = street furniture — **don't draw**.)

**Extent (where the render STOPS):**
- **Left (north):** start at the **Kennaland entry**, immediately south of **Azure
  Gourmet** — Azure is already drawn, do **not** redraw it. (No party wall here —
  same building; this is just where the prior slice ended.)
- **Right (south):** the **Franklin × Kent corner pier** — the Threes Brewing
  storefront is the last bay; stop at the corner. (Do **not** wrap onto Kent St —
  Franklin face only this pass.)

---

## 2. The prompt to paste (LOCKED — single flat Franklin elevation)

Paste as-is; attach the photos in §3. Prose pins the **tenant order**, the
**extent**, the **brick/material**, and the **rooftop pavilion**; the photos are
truth for **counts and placement**.

> Redraw the building shown in the attached photos as a single, strictly
> **orthographic facade elevation**, in the hand-inked editorial style of the
> attached style reference (confident 1–4px linework, controlled hatching for
> shadow, muted warm palette, paper texture). Head-on flat projection: every
> vertical edge plumb — no 3/4 view, no perspective, no foreshortening, no
> leaning window columns.
>
> **THE SUBJECT — ONE continuous 2-storey red-brick warehouse, one unbroken
> parapet, FOUR ground-floor tenants side by side.** Draw the building's **FULL
> width** left to right in this exact order; do not crop to one shop, do not
> compress or drop a tenant:
>
> 1. **KENNALAND (left) — a hair salon:** a **narrow recessed dark entrance**
>    with a small **red "KENNALAND"** sign, tucked between brick piers.
> 2. **CHAMA MAMA — a restaurant:** a run of **warm wood-framed (orange) glazed
>    doors and display windows** between brick piers, under a **long flat black
>    awning** lettered **"chama mama"** in white lowercase, dark transom glass
>    above.
> 3. **MADELINE'S — a bar:** a **green-painted recessed storefront bay** set into
>    the brick — a tall **green-framed black-glass window** with an upper transom,
>    a cream sign band reading **"MADELINE'S"** in green serif, a green base, and
>    a separate **dark service door** to its right.
> 4. **THREES BREWING (right, the corner) — a pub:** **large black steel-framed
>    industrial windows / folding glass** under a **flat black canopy with small
>    can-lights**, exposed brick piers, a dark recessed entrance, **"THREES
>    BREWING"** lettering in the glass. This is the **corner** bay — the building
>    ends here.
>
> **UPPER FLOOR (one row, continuous over all four tenants):** a regular rhythm of
> **low, wide, PAIRED dark windows** set in **shallow segmental brick arches** —
> **NOT** tall double-hung windows. Some carry **"KENNALAND"** lettering; a black
> **"HAIR WE DO THAT"** blade sign hangs near the Chama Mama end. **Count the
> window pairs from the photos and draw exactly that many** — do not make them
> taller, fewer, or into single tall windows.
>
> **ROOFTOP PAVILION (draw it — it is set BACK on the roof, rising behind the main
> parapet, roughly centered):** a **grey stucco** Art-Deco rooftop structure with
> **two stepped triangular gable peaks**, each framing a **gold five-pointed star
> inside a raised diamond**, flanked by **fluted pilasters with gold caps**, with
> a **central raised cube and a band of small windows** between them. Draw it
> above and behind the brick parapet, smaller than and centered over the
> warehouse — do not omit it and do not spread it across the whole roofline.
>
> **SHELL:** weathered, varied **red industrial brick** (aged, patched, with
> faded ghost-paint — not pristine), a simple **corbelled brick cornice with tile
> coping** at the roofline, **two storeys only**.
>
> **READ FROM THE PHOTOS — DON'T INVENT, REGULARIZE, OR DROP A TENANT:**
> - All **four** storefronts are present, in order, each once; the upper window
>   row is **low paired windows**, count them from the photos.
> - **Two storeys only** — one upper window row, nothing higher except the
>   set-back rooftop pavilion.
> - This is **one building** under one parapet — there is **no party wall** inside
>   it; do not split it into separate buildings between tenants.
>
> **OUTPUT.** Facade only, full bleed. **No sky, no sidewalk, no people, no
> vehicles, no trees, and NO street furniture** (no café tables, chairs,
> pergolas, parklets, planters, string lights, umbrellas). Proportion the canvas
> to the building's own width and height. Keep the ground line, roofline, sign
> band, and cornice continuous across the whole run. Windows and doors tonally
> distinct from the wall — no wall-colored doors.
>
> **AUDIT BEFORE FINISHING:** (1) ONE building, all FOUR storefronts present in
> order (Kennaland → Chama Mama → Madeline's → Threes), no tenant dropped or
> merged, no party wall invented between them; (2) upper floor = **low paired
> windows in segmental arches**, count matches the photos, not tall double-hungs;
> (3) the **grey Art-Deco rooftop pavilion with two gold-star gables** is present,
> set back and centered; (4) two storeys only; (5) red aged industrial brick +
> corbelled cornice; (6) no trees, street furniture, people, or vehicles.
> Correct any failure before outputting.

---

## 3. Attach, in this order

1. `II-C-style-system-tile.png` (style) — `docs/reference/art/`
2. `II-assembled-mini-scene.png` (tone) — `docs/reference/art/`
3. Subject photos (saved 2026-06-25 to
   `docs/reference/asset-reference/storefront/proof-set/sereneco-franklin-south/`),
   in this order:
   - **`franklin-wide-azure-to-chama.jpeg`** — Azure Gourmet (left, the seam) →
     Kennaland → Chama Mama, **with the Deco rooftop pavilion** above. Establishes
     the LEFT extent (where Azure ends / this render begins).
   - **`franklin-wide-azure-to-madeline.jpeg`** — wider: Azure seam → Kennaland →
     Chama Mama → Madeline's in one shot. Extent + run order proof.
   - **`franklin-chama-to-madeline.jpeg`** — Chama Mama → Kennaland upper windows →
     Madeline's, rooftop pavilion. The middle of the run.
   - **`madeline-head-on.jpeg`** — Madeline's green storefront head-on + the
     KENNALAND upper windows + the Deco pavilion behind. Best storefront + pavilion
     detail.
   - **`threes-corner.jpeg`** — Threes Brewing at the Franklin × Kent corner
     (street sign visible). Establishes the RIGHT extent (where the building ends /
     turns the corner).
   - **`threes-storefront.jpeg`** — Threes Brewing storefront detail (black
     industrial glazing + canopy).

Frame the subject centered and dominant. Together these cover the full run
**Azure seam → Kent corner** and prove both ends, so the render neither spills
past the corner nor drops a tenant (the two framing failure modes in
`render-prompt-photos-are-truth`).

---

## 4. Audit the raw render against the photos (before shipping the PNG)

- ☐ **ONE building, all four tenants** — Kennaland, Chama Mama, Madeline's, Threes
  under one continuous parapet/brick; **no** party wall invented between them.
- ☐ **Extent correct** — starts at Kennaland (Azure **not** redrawn), ends at the
  Threes / Kent corner; no wrap onto Kent.
- ☐ **Upper floor = low paired windows in segmental arches**, count per the photos;
  not tall double-hungs, not over/under-multiplied.
- ☐ **Rooftop Deco pavilion** — grey stucco, **two gold-star gable peaks**, fluted
  pilasters, central cube; set back and centered; present and not spread.
- ☐ **Two storeys**, aged red industrial brick, corbelled cornice + tile coping.
- ☐ **Storefronts** — Kennaland red sign + recessed entry; Chama Mama wood frames +
  black "chama mama" awning; Madeline's green bay + cream sign + service door;
  Threes black industrial glazing + canopy + "THREES BREWING".
- ☐ **No** trees / street furniture (pergola, parklets, café seating) / people /
  vehicles / sky / sidewalk.
- ☐ Orientation reads L→R (awning + sign text not mirrored; Threes on the right).

Re-render only for content/structure (dropped tenant, missing rooftop pavilion,
wrong storey count, wrong window type, neighbor bleed, invented party wall) —
**never** for a few-percent placement; that's the derive step's job.

**Branding note (dev-stage, gated later):** the render bakes real signage
("KENNALAND", "chama mama", "MADELINE'S", "THREES BREWING"), consistent with
every prior hero. Per CLAUDE.md truth rules real names are fine in development; a
factual/branding review pass gates public release.

---

## 5. Geometry truth & registration (post-render — not for the prompt)

- **BIN 3337033** — 1931, class S2, footprint bbox ≈ 29.5 m × 59.7 m; **roof
  22.81 ft (≈6.9 m → two storeys)** (ignore PLUTO `numFloors: 6` — stale; the
  street facade is 2-storey, the "extra" mass is the set-back rooftop pavilion).
  Same BIN as the **Sereneco corner hero**; its Franklin (east) frontage is ~57 m.
- **This render covers the southern ~45 m** of that frontage — everything south of
  the Azure Gourmet seam (where `sereneco--corner.png`'s franklin slice,
  `coverMeters: 12`, `SERENECO_KINK=0.496`, ends) down to the Kent corner.
- **Registration path (mirror Sereneco's per-face override):** wire the new
  texture as a **second franklin slot** on the `sereneco` composite — the existing
  franklin slice keeps its `u0:0.496→1` cover at the Greenpoint end; the new
  `sereneco--franklin-south.png` covers the remaining frontage (its own
  `u0/u1` + `coverMeters` derived from the painted fold so the two Franklin
  textures meet at the Azure seam with no gap/overlap — the same trick the
  greenpoint face used). Single **flat** face (no corner unwrap) — mid-block-to-
  corner frontage, like Land of Barbers / Oak & Iron but long + multi-tenant.
- **Then:** `derive-facade-spec.mjs` on the FLAT texture → gate on a 2× overlay →
  recesses (4 storefronts + the low paired upper windows + the Deco pavilion as
  set-back geometry/`shape` tags) → one in-engine check on the Franklin face at
  **all four angles**. This is an **east-side-vs-west-side** check: Sereneco's
  Franklin frontage faces the street on the **east** — confirm which default angle
  it presents at before judging orientation.
- **Tenant click-targets:** the run spans four businesses → storefront sub-rects
  carry distinct `placeId`s (`kennaland`, `chama-mama`, `madelines`,
  `threes-brewing`), the same split-tenant trick Sereneco used for `azure-gourmet`
  (one building, several place cards).
- **Open follow-ups:** the Kent return at the Threes corner (separate pass if the
  pub wraps); per-tenant place cards; resolution check — if detail dies on a
  single ~45 m render (Astral lesson: a long single render ≈ low px/m), split into
  two segments (Kennaland+Chama / Madeline's+Threes) and wire as two franklin
  slots.
- After shipping, **append the per-building lesson to `HERO_FACADE_LOG.md`.**
