# Elder Greene (160–162 Franklin) — Corner Hero Render Package (v2)

Status: **Render package — awaiting Batu's GPT render.** Supersedes **v1**, which was
wrong on three counts (corrected here after the 2026-06-25 photo drop): it excluded
BIN 3064539, which is **Vamos al Tequila (162 Franklin) — part of the same continuous
building**; it had the two face lengths backwards; and it predated the full-extent
Franklin + Kent photos.

First R2 proof-set shop, built as a **full bespoke corner hero** (Batu, 2026-06-25 —
reverses the kit-path decision in `2026-06-24-elder-greene-signature-design.md`; that
file's signature schema/resolver/tests stay as the category-true text + token-palette
source of truth, but the facade is now a hand-rendered hero texture).

- **Subject:** the whole **160–162 Franklin St** building — the **SW corner of
  Franklin (west) × Kent (south)**. One continuous 2-storey 1924 red-brick structure,
  one stepped parapet, **two ground-floor tenants**: **Vamos al Tequila** (162, Franklin
  north) + **Elder Greene** (160, Franklin south + the chamfered corner + the Kent face).
- **Truth — likeness:** `docs/reference/asset-reference/storefront/proof-set/elder-greene/`.
- **Truth — geometry:** BINs **3064538** (corner mass, Elder Greene) **+ 3064539**
  (north, Vamos al Tequila), `block-franklin-milton.nyc-open-geometry.v0.1.json`.
- **Approach:** the Universal Hero Prompt (`HERO_PROMPT.md`), **precision variant** —
  the universal prompt verbatim + the Elder-Greene lines in §2. Corner **unwrap**:
  Franklin face + chamfer + Kent face on one canvas. Fold/openings get **measured from
  the render** afterward (`derive-facade-spec.mjs`), never fed in here.

> **Scope note (Batu confirm):** the render covers the whole building **including
> Vamos al Tequila**, because the two shops sit under one unbroken facade/parapet and
> the Universal Hero rule is "include every tenant under the continuous facade; a party
> wall is a STRUCTURE change, not a tenant boundary." Cropping at the Elder/Vamos line
> would invent a false party wall mid-wall. Upside: both tenants get bespoke from one
> render. If you'd rather render Elder Greene's extent only, say so — but then the
> Franklin face stops mid-building and Vamos stays kit-drawn.

---

## 1. The building, face by face (read into the audit)

**Franklin face — WEST, ~18 m, two storefronts side by side (north→south):**
- **(a) Vamos al Tequila (162):** Mexican restaurant — dark recessed entry flanked by
  two display windows, low brick spandrel, a horizontal **red banner awning** over the
  transom. Two upper windows with **window-AC units**, a **diamond brick inset** above.
  (White sidewalk umbrellas are street furniture — DON'T draw.)
- **(b) Elder Greene (160) — STILL ON FRANKLIN, between Vamos and the corner:** black
  full-height glazed bar storefront, tall multipane bays, **navy scalloped (wavy-hem)
  awning**, transom band with **gold serif "COCKTAILS / COLD BEER"**, low brick
  spandrel. Two upper windows (left curtains, right blinds) + diamond inset.
  **This storefront + awning is on FRANKLIN — confirmed by `elder-greene-corner-zoom`,
  which shows COCKTAILS/COLD BEER head-on from Franklin St, with the corner entrance to
  its RIGHT.** The v2-render miss was skipping this and pushing it past the corner.

**Chamfered SW corner:** Elder Greene's **recessed corner entrance** (dark glazed door,
"ELDER GREENE Nº160" sign) on its own angled face, **curved central pediment** above —
sits to the SOUTH (right) of the bar storefront, at the end of the Franklin face.

**Kent face — SOUTH, ~16 m (Elder Greene wraps the corner):** the bar's glazing + navy
awning continues a short way past the corner (seating area, tan sail-shade — street
furniture, DON'T draw), then plain brick with a single **service / residential door**
toward the east end. **Upper floor: ~5 double-hung windows, several with window-AC
units** (kent-face + kent-east-end shots) — a long face; the v2-render drew too few.
The **stepped parapet with diamond insets** steps down to the east brick party wall.

**Party walls (where the render STOPS):** north on Franklin = a **grey concrete/painted
building** (taller, separate). East on Kent = a **plain brick wall** (kent-east-end
photo). Both separate structures — exclude them.

**Crown:** continuous **stepped brick parapet**, **diamond-shaped brick insets**,
**curved central pediment** over the corner/bar end.

---

## 2. The prompt to paste (LOCKED — single-canvas corner unwrap)

**Locked prompt** (2026-06-25, after two render rounds). Round-1 miss: ~9 Franklin
windows vs ~4 real + an invented right-hand storefront/"87" door past the corner.
Round-2 miss: **skipped the Elder Greene bar storefront + navy awning on Franklin**
(pushed COCKTAILS/COLD BEER past the corner onto Kent) and drew **too few Kent
windows**. This version pins the Franklin order (restaurant → bar → corner) and the
counts (Franklin ~4, Kent ~5). Paste as-is; attach the photos in §3.

> Redraw the building shown in the attached photos as a single, strictly **orthographic
> facade elevation**, in the hand-inked editorial style of the attached style reference
> (confident 1–4px linework, controlled hatching for shadow, muted warm palette, paper
> texture). Head-on flat projection: every vertical edge plumb — no 3/4 view, no
> perspective, no foreshortening.
>
> **THE SUBJECT — ONE building: 160–162 Franklin St, the corner of Franklin (the long
> face) × Kent (the side face). A 2-storey red-brick corner building, one continuous
> parapet, two ground-floor tenants.** Unwrap **both street faces and the cut corner onto
> one canvas**, left to right in this exact order:
>
> 1. **FRANKLIN FACE (long, left portion) — TWO storefronts side by side, BOTH must be
>    drawn:**
>    - **(a) North/leftmost — a Mexican restaurant:** a recessed dark-framed entry door
>      between **two display windows**, low brick spandrel, a **flat horizontal red banner
>      awning** across the transom. Upper floor above it: **exactly TWO double-hung windows
>      with window-AC units**; a **diamond brick inset** in the parapet.
>    - **(b) Immediately to its right — the bar (still on the Franklin face, BEFORE the
>      corner):** a **black/charcoal full-height glazed storefront**, tall multipane glass
>      bays, a transom band with **gold serif "COCKTAILS / COLD BEER"**, low brick
>      spandrel, under a **navy scalloped (wavy-hem) awning** with a thin light top edge.
>      Upper floor above it: **exactly TWO double-hung windows**; a **diamond brick inset**.
>      **DO NOT omit this bar storefront or its navy awning, and DO NOT place it past the
>      corner — it sits on the Franklin face, between the restaurant and the corner
>      entrance.**
> 2. **CHAMFERED CORNER (center)** — the corner is **cut at an angle**; draw it as its
>    **own narrow vertical face** between the two street faces, carrying the bar's
>    **recessed corner entrance door** with a small sign **"ELDER GREENE Nº160 FRANKLIN
>    ST"**, and the **curved central pediment** above it. Do NOT flatten the corner into
>    the wall plane; do NOT move this entrance.
> 3. **KENT FACE (side, right portion)** — the bar's dark glazing + navy awning
>    **continues a short way** past the corner, then the ground floor becomes **plain red
>    brick with a single dark service/residential door** toward the far (right) end.
>    **Upper floor: about FIVE double-hung windows in an even rhythm, several with
>    window-AC units** — this face is long; do not draw only two or three. The **stepped
>    parapet with diamond insets** runs along it and steps down toward the right end at the
>    brick party wall.
>
> **CROWN:** a continuous **stepped (crenellated) brick parapet** with **diamond-shaped
> brick insets** and a **curved central pediment** over the corner/bar end. No flat
> cornice line.
>
> **READ FROM THE PHOTOS — DON'T INVENT, REGULARIZE, OR DROP A STOREFRONT:**
> - Franklin upper floor = **~4 windows** (2 over the restaurant, 2 over the bar). Kent
>   upper floor = **~5 windows**. Do not over-multiply or under-count.
> - The **Franklin face carries BOTH the restaurant AND the bar storefront** — the bar
>   (COCKTAILS/COLD BEER, navy awning) must appear on Franklin, not only on Kent.
> - **STOP at both party walls:** beyond the Franklin face's left (north) end, a separate
>   **taller grey/painted building**; beyond the Kent face's right (east) end, a separate
>   **plain brick wall**. Exclude both — borrow nothing.
> - **Two storeys only** — one upper window row, nothing higher.
>
> **OUTPUT.** Facade only, full bleed. **No sky, no sidewalk, no people, no vehicles, and
> NO street furniture** (no umbrellas, sail-shades, chairs, tables, string lights,
> planters). Keep the ground line, roofline, sign band, and cornice continuous across the
> fold(s). Windows and doors tonally distinct from the wall — no wall-colored doors.
>
> **AUDIT BEFORE FINISHING:** (1) ONE building, BOTH Franklin storefronts present
> (restaurant AND bar) with no party wall between them; (2) the **bar storefront + navy
> awning is on the FRANKLIN face, between the restaurant and the corner entrance** — not
> skipped, not past the corner; (3) Franklin upper floor ≈4 windows, Kent upper floor ≈5
> windows; (4) chamfered corner is its own angled face with the Nº160 entrance + curved
> pediment; (5) Kent = short bar continuation → plain brick → one service door; (6)
> stepped parapet + diamond insets present; (7) no street furniture or neighbors. Correct
> any failure before outputting.

---

## 3. Attach, in this order

1. `II-C-style-system-tile.png` (style)
2. `II-assembled-mini-scene.png` (tone)
3. Subject photos (all under `…/proof-set/elder-greene/`), in this order:
   - **`elder-greene-franklin-wide.jpeg`** — the Franklin **extent** shot: both tenants,
     north party wall, edge-to-edge.
   - **`elder-greene-1.jpeg`** (corner extra-wide) — both faces + the corner + both ends.
   - **`elder-greene-corner-zoom.jpeg`** — clean corner: Elder Greene storefront, chamfer
     entrance, parapet diamond + curved pediment.
   - **`elder-greene-vamos-162.jpeg`** — the Vamos al Tequila (162) storefront + AC units.
   - **`elder-greene-kent-face.png`** — the Kent face (storefront wrap + parapet, full).
   - **`elder-greene-kent-east-end.png`** — Kent east end → the brick party wall.
   - **`elder-greene-2.jpeg`** — Elder Greene glazing/transom detail (gold lettering).

Frame the subject centered and dominant; the wide Franklin + the two Kent shots together
establish where the building ENDS at each party wall (the v1 failure mode).

---

## 4. Audit the raw render against the photos (before shipping the PNG)

- ☐ **ONE building, BOTH tenants** — Vamos (restaurant) AND Elder Greene (bar) under one
  continuous wall/parapet; **no** party wall invented between them.
- ☐ **Both party walls respected** — the grey north building and the east brick wall are
  **absent**; nothing borrowed.
- ☐ **Corner unwrap** — Franklin + chamfer + Kent all present at full length; **chamfer
  is its own narrow face** with the bar entrance on it.
- ☐ **2 storeys**, one upper window row; window-AC units present.
- ☐ **Window columns per face** match the photos (count each face independently; don't
  regularize).
- ☐ **Parapet** — stepped, diamond insets, curved central pediment.
- ☐ **Storefronts** — Vamos banner awning + recessed entry; Elder Greene black glazing,
  gold "COCKTAILS / COLD BEER", **navy scalloped** awning wrapping the corner onto Kent.
- ☐ **No** street furniture / people / vehicles / sky / sidewalk.
- ☐ Orientation reads L→R (transom + banner text not mirrored).

Re-render only for content/structure (dropped tenant or face, wrong storey count,
neighbor bleed, flattened corner, invented mid-wall party wall) — **never** for a
few-percent placement; that's the derive step's job.

**Branding note (dev-stage, gated later):** the render will bake real signage
("Vamos al Tequila", "Corona", "ELDER GREENE", "COCKTAILS/COLD BEER"), consistent with
every prior hero (Sonny's, Sereneco, Verge). Per CLAUDE.md truth rules real
names/likenesses are fine in development; a **factual/branding review pass gates public
release** (the claim model governs the procedural sign system, not bespoke hero
textures). "COCKTAILS/COLD BEER" is category-true and stays.

---

## 5. Geometry truth (for post-render registration — not for the prompt)

- **BIN 3064538** — corner mass (Elder Greene). 1924, 2 floors, roof 22.57 ft (≈6.9 m),
  class S2. Footprint bbox ≈ 16 m (E-W / Kent axis) × 8.8 m (N-S / Franklin axis): its
  Kent (south) frontage ≈ 16 m, its Franklin (west) frontage ≈ 8.8 m, plus the chamfer.
- **BIN 3064539** — Vamos al Tequila (162). Same 1924 / 2-storey. Sits **~6 m north** of
  3064538 (shares its north party-wall edge) and extends the Franklin frontage north by
  ≈ 9 m → **total Franklin face ≈ 18 m**. Mid-block on Franklin (NOT on Kent).
- **Face assignment confirmed at registration:** Kent runs E-W, Franklin N-S
  ([[greenpoint-street-grid-geometry]]). Derive the fold from the painted render, then
  assign each painted face to the footprint edge whose axis matches (E-W → Kent;
  N-S → Franklin) and put the fold after the last feature of each face
  (Sereneco / 144 method). Corner is the **SW** chamfer.
- **Registration path:** a **two-BIN** hero. `FACADE_GROUP_BINS["3064538"]="elder-greene"`
  **and `["3064539"]="elder-greene"`** so both footprints promote into one hero (or a
  block-extract chord if they read as one mass — confirm at build, cf. Astral's
  multi-edge frontage). `FACADE_COMPOSITES["elder-greene"]` = corner unwrap mapping the
  Franklin slice across BOTH footprints' west edges + the Kent slice across 3064538's
  south edge + the chamfer face. Texture in `assets/textures/franklin/`. Then derive →
  overlay-gate → recesses → one in-engine check at the Franklin × Kent corner, **all
  four angles**. Append the lesson to `HERO_FACADE_LOG.md`.
- **Tenant click-targets (registration):** the Franklin face spans two businesses, so
  the storefront sub-rects carry distinct `placeId`s — Vamos's bays → `vamos-al-tequila`,
  Elder Greene's bays + corner → `elder-greene` — the same split-tenant trick Sereneco
  used for AZURE GOURMET (one building, two place cards).
- **R2 reconciliation:** keep `storefront-signatures.v0.1.json` `elder-greene` for the
  gold transom token + sage seating (street furniture). Drop its kit-path
  awning/frame/parapet signals (the render carries them now). Vamos stays kit-drawn until
  it gets its own signature or rides this render.
