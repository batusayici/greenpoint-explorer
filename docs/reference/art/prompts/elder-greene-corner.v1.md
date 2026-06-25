# Elder Greene — Corner Hero Render Package (v1)

> ⚠️ **SUPERSEDED by [`elder-greene-corner.v2.md`](elder-greene-corner.v2.md)**
> (2026-06-25 photo drop). v1 wrongly excluded BIN 3064539 (= Vamos al Tequila,
> 162 Franklin, part of the same building), had the Franklin/Kent face lengths
> backwards, and predated the full-extent photos. **Use v2.** Kept for history.

Status: **Render package — awaiting Batu's GPT render.** First R2 proof-set shop,
built as a **full bespoke corner hero** (Batu, 2026-06-25 — reverses the kit-path
decision in `2026-06-24-elder-greene-signature-design.md`; that file's signature
schema/resolver/tests stay as the *category-true text + token palette* source of
truth, but the facade is now a hand-rendered hero texture, not the kit brick path).

- **Subject:** Elder Greene, **160 Franklin St — Franklin × Kent corner**. 2-storey
  1924 red brick (BIN 3064538). Bar (COCKTAILS / COLD BEER).
- **Truth — likeness:** `docs/reference/asset-reference/storefront/proof-set/elder-greene/elder-greene-{1..4}.jpeg`.
- **Truth — geometry:** BIN 3064538, `block-franklin-milton.nyc-open-geometry.v0.1.json`.
- **Approach:** the Universal Hero Prompt (`HERO_PROMPT.md`) — Elder Greene is an
  ordinary brick corner, exactly its target — run as the **precision variant**: the
  universal prompt verbatim + the four Elder-Greene lines in §3 (exclude both
  neighbors, name the corner chamfer + awning wrap). Corner **unwrap**: both street
  faces + the chamfer onto one canvas. Fold/openings get **measured from the render**
  afterward (`derive-facade-spec.mjs`), never fed in here.

---

## 1. What the photos show (read these into the audit)

| Photo | Shows | Use for |
|---|---|---|
| `elder-greene-1.jpeg` | Wide corner from across the intersection — **both faces + corner + both party walls**. | The **extent** shot: where the building starts/ends, both neighbors. |
| `elder-greene-2.jpeg` | Head-on tight of the long storefront — black millwork, tall multipane bays, transom band, gold "COCKTAILS / COLD BEER", low brick spandrel. | Ground-floor glazing rhythm + transom text. |
| `elder-greene-3.jpeg` | Corner ¾ — chamfer entrance "ELDER GREENE Nº160", upper floor, **stepped parapet w/ diamond brick insets + curved central pediment**, window-AC. | Upper-floor + parapet + corner condition. |
| `elder-greene-4.jpeg` | ¾ along the storefront — full storefront length, corner entrance, navy awning wrapping the corner, upper windows. | Storefront length + **awning corner-wrap**. |

**Signature cues (recognition weight, from the design spec):** ① navy **scalloped**
awning wrapping the corner (thin light top edge) · ② black full-height glazed
storefront (charcoal millwork, transom band, low brick spandrel) · ③ gold serif
transom "COCKTAILS / COLD BEER" · ④ chamfered **corner entrance** ("ELDER GREENE
Nº160", oval blade) · ⑤ stepped parapet, diamond brick insets, curved central
pediment · ⑥ a window-AC unit upstairs. (Sage bistro chairs are **street furniture**
— NOT in the facade render; they ship via `streetFurniture.js`.)

---

## 2. The prompt to paste (Universal Hero Prompt + Elder-Greene precision lines)

Paste **the full Universal Hero Prompt from `HERO_PROMPT.md` verbatim**, then append
the four precision lines below before the attachments. (Kept as an append, not a
rewrite, so the universal prompt stays the single source.)

> **THIS SUBJECT — Elder Greene, a 2-storey red-brick CORNER building (Franklin ×
> Kent):**
> - **Unwrap both street faces + the cut corner onto one canvas.** The entrance sits
>   on a **chamfered (angled-cut) corner** — draw that chamfer as its **own narrow
>   vertical face** between the two street faces, with the recessed entrance door and
>   its small sign on it; do not flatten the corner into one plane and do not move the
>   entrance onto a flat face. Two storeys only — one row of upper windows above the
>   ground-floor storefront band, nothing higher.
> - **Stop at BOTH party walls — exclude both neighbors.** Beyond the long
>   storefront face, a **taller, separately-built red-brick building** abuts (more
>   floors, different windows) — do NOT continue into it or borrow its windows/cornice.
>   Beyond the shorter face, across the side street, is a **lighter grey/tan building**
>   — exclude it too. The subject is only the lower 2-storey red-brick corner mass
>   under its own continuous stepped parapet.
> - **Crown:** a **stepped brick parapet** with **diamond-shaped brick insets** and a
>   **curved central pediment** over the long face — draw it as photographed; it is the
>   silhouette cue. No flat cornice line.
> - **Storefront:** one continuous **black/charcoal full-height glazed storefront**
>   (tall multipane bays, a transom band carrying **gold serif "COCKTAILS / COLD BEER"**,
>   a low brick spandrel under the glass) running the long face and turning the corner,
>   under a single **navy scalloped (wavy-hem) awning that wraps from the long face
>   around the corner**, thin light piping along its top edge. Draw the awning and
>   glazing; **do not draw sidewalk chairs, tables, string lights, or planters.**

---

## 3. Attach, in this order

1. `II-C-style-system-tile.png` (style)
2. `II-assembled-mini-scene.png` (tone)
3. Subject photos in this order: **`elder-greene-1`** (extent — both faces + both
   party walls), **`elder-greene-3`** (upper floor + parapet + corner), **`elder-greene-4`**
   (storefront length + awning wrap), **`elder-greene-2`** (storefront glazing + transom).

Frame the subject centered and dominant; #1 is the edge-to-edge extent shot that tells
the model where the building ends at each party wall.

---

## 4. Audit the raw render against the photos (before you ship the PNG)

- ☐ **ONE building, both party walls** — the taller red-brick neighbor and the grey
  side-street building are **absent**; nothing borrowed from either.
- ☐ **Corner unwrap** — both street faces present, each at full length; the **chamfer
  is its own narrow face** with the entrance on it (not flattened, not relocated).
- ☐ **2 storeys** — exactly one upper window row above the storefront band.
- ☐ **Window columns per face** match the photos (count each face independently off
  `elder-greene-1`/`-3`; don't regularize).
- ☐ **Parapet** — stepped, diamond insets, curved central pediment present.
- ☐ **Storefront** — continuous black glazing, gold "COCKTAILS / COLD BEER" transom,
  navy **scalloped** awning wrapping the corner; low brick spandrel under the glass.
- ☐ **No** sidewalk furniture / people / vehicles / sky / sidewalk.
- ☐ Orientation reads L→R (transom text not mirrored).

Re-render only for content/structure (dropped face, wrong storey count, neighbor
bleed, flattened corner) — **never** for a few-percent placement; that's the derive
step's job.

---

## 5. Geometry truth (for post-render registration — not for the prompt)

- **BIN 3064538** — the corner mass. 1924, 2 floors, roof 22.57 ft (≈6.9 m), class S2.
  9-vertex footprint; edges (m): 3.01 · 2.29 · **12.97** · 6.94 · **8.13** · 5.07 ·
  2.06 · 3.93. The two long edges (**~13 m** and **~8 m**) are the two street
  frontages; the short 2–3 m edges are the **chamfer** + setbacks; the rest are party
  walls. Footprint bbox ≈ 16 m (E-W, Kent axis) × 8.8 m (N-S, Franklin axis).
- **Face assignment confirmed at registration**, not assumed here: Kent runs E-W,
  Franklin N-S ([[greenpoint-street-grid-geometry]]). Derive the fold from the painted
  render, then assign each painted face to the footprint edge whose axis matches
  (longer E-W edge → Kent; ~8 m N-S edge → Franklin) — the same "last-feature-on-a-face
  finds the fold" check used on Sereneco / 144.
- **Neighbor / party wall:** BIN **3064539** (same 1924 / 2-storey) **shares a
  4-vertex party-wall edge** with 3064538 and is **not** Elder Greene — it's the
  abutting mid-block building the render must stop at. (No merged-footprint carve
  needed here, unlike Verge: these are two separate footprints already.)
- **Registration path:** standalone hero via `FACADE_GROUP_BINS["3064538"]="elder-greene"`
  + `FACADE_COMPOSITES["elder-greene"]` corner unwrap (two faces + chamfer), texture in
  `assets/textures/franklin/`. Then derive → overlay-gate → recesses → one in-engine
  check at the Franklin × Kent corner, **all four angles**. Append the lesson to
  `HERO_FACADE_LOG.md`.
- **Then R2 reconciliation:** keep the `storefront-signatures.v0.1.json` `elder-greene`
  entry for the **category fix (restaurant→bar)**, gold transom text token, and sage
  seating (street furniture) — those still apply on top of the bespoke facade. Drop the
  kit-path awning/frame/parapet signals for Elder Greene (the render now carries them).
