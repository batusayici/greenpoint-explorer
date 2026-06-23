# Astral Apartments — Facade Grammar (Phase A)

**BIN 3064408 · 184 Franklin St · 1886 · 6 storeys · class C7 (walk-up apts over stores) · `heightRoof` 68.7 ft.**
Footprint: 60-vertex polygon, ~65 m (Franklin frontage, N–S) × ~41 m (depth, E–W). The 60 vertices are mostly the projecting oriel bays segmenting the Franklin wall (longest contiguous edge ~39 m). First **full-block hero** — all prior heroes were single corners.

Likeness truth = the 17 field photos in this folder (Batu, 2026-06-23). Geometry truth = NYC Open Data (above). Style = II-C inked, per `docs/ART_DIRECTION.md`. This doc is the source for the render package (Phase B) and the build (Phase C–E).

## The Franklin (west) elevation — read from the photos

Rhythmic Queen Anne worker housing (Charles Pratt, for Astral Oil Works employees). Composed of repeating modules, not 65 m of unique wall — this is the lever that lets us render at high resolution.

**Vertical (bottom → top):**
1. **Floor 1 — rusticated brownstone base.** Heavy rock-faced brownstone piers + ground-floor commercial (the "Vermut en Grifo / Aperitifs / Digestifs" vermouth bar, big shop windows, `A` grade placard) interleaved with residential entrances (dark double doors).
2. **Floors 2–5 — red brick body.** Punched windows + **projecting oriel bays** (square/canted, 2–3 facet) rising through these floors, each carrying a **fire escape** (IMG_0962, 0965).
3. **Floor 6 — round-arch arcade.** Top-floor windows are **round-arched** (IMG_0964, 0967), under a bracketed/corbelled brick cornice.
4. **Roofline — stepped brick gables** punctuated by **terracotta cartouche medallions** (diamond/oval scrollwork, IMG_0969, 0970).

**Horizontal (the module grammar):**
- **Center entrance pavilion** — the signature: a grand **rusticated round-arch entrance** ("No 184", brownstone voussoirs) under the carved **"THE ASTRAL"** stone sign band, gable + cartouche above (IMG_0966, 0967, 0973). This is the single most recognizable element → the vertical-slice segment.
- **Typical oriel-bay module** — projecting 3-facet bay + flanking punched windows + round-arch top + fire escape. Repeats ~5–7× across the frontage (IMG_0971 full-frontage).
- **End pavilions** — the frontage terminates in pavilions; one end shows a rounded/arched corner element (IMG_0957). Exact end count/condition: confirm against IMG_0971/0957 when cutting segment boundaries.

## Photo index (which shot proves which element)

| Element | Photos |
|---|---|
| Full frontage / rhythm | IMG_0971 (best oblique end-to-end), 0957, 0958, 0973 |
| Center entrance + "THE ASTRAL" + No 184 arch | IMG_0966, 0967, 0973 |
| Oriel bays + fire escapes | IMG_0962, 0965, 0971 |
| Round-arch top-floor windows / oculi | IMG_0964, 0967 |
| Terracotta gable cartouche | IMG_0969, 0970 |
| Rusticated brownstone base + entrances | IMG_0959, 0960, 0961 |
| Ground-floor commercial (vermouth bar) | IMG_0959, 0960, 0963 |

> Orientation note: phones captured these in portrait; several read rotated 90° (EXIF). Re-orient upright when building the render contact sheet (Phase B); evidence stored as-shot.

## Build approach (locked recommendation — see PLAN.md 2026-06-23 Track R)

**Texture: segmented high-res unwrap.** Split the ~65 m frontage into ~3 segments (left pavilion+bays / **center entrance pavilion** / right bays+pavilion), each ~16–22 m. At ~1536 px a segment is ~85 px/m (~3.6× sharper than one 65 m sheet at ~24 px/m) — enough to derive crisp recesses and hold terracotta detail. Stitch into one continuous Franklin elevation. Preserves real bay-to-bay variation (no mechanical tiling).

**Depth = geometry, never the texture** (texture stays flat; engine carves relief — all primitives exist):
- Projecting oriel bays → `oriel3` texture-fold (render each bay's 3 facets side-by-side; fold in-engine — proven on Premier).
- Round-arch windows + oculi → `shape:"arch"/"circle"` curved recesses (proven on 144 Franklin).
- Brownstone base + arched entrance → recess + stoop primitives.

**Vertical slice first:** build the **center entrance segment** end-to-end (render → derive on flat → wire composite + oriel3 + curved recesses → verify all four angles) before rendering the flanks.

## Registration path (per HERO_FACADE_LOG, the 144-Franklin pattern)
**Prerequisite (added 2026-06-23):** unlike 144 Franklin, Astral is **not** in the within-radius main packet — it lives only in the `block-franklin-north` extract, past the 130m cull. `sceneFrame.js` now promotes a `facadeGroupBins` BIN found in a block extract to a hero (classified edges + placeId); without that, registering Astral drops it. See design spec step 1b + `src/sceneFrame.heroPromotion.test.mjs`.

`FACADE_GROUP_BINS["3064408"]="astral-apartments"` → placeId + wall-by-wall hero build; vertex-snap flush skips it (no fixture entry). Then `FACADE_COMPOSITES["astral-apartments"]` (texture key + per-face u0/u1/leftEnd + `ASTRAL_KINK` if a corner fold), spec import → `FACADE_SPECS`/`SPEC_FILE_BY_FACE`, an `II_PALETTE.heroes` hue, flip `building-tiers` buildStatus→built, update `curationTiers.test.mjs`.

## Open items (resolve before the phase that needs them)
- **Camera-visible faces (Phase E):** confirm which of Astral's faces the four angles reveal. Likely Franklin (west, bespoke) + both cross-street ends (it occupies the Franklin block-front between Java & India). Ends/back are plainer brick → typological returns; blank-box check at all angles.
- **Exact segment boundaries + bay count:** finalize against IMG_0971 when cutting the render segments (Phase B).
- **Ground-floor tenancy truth:** the vermouth bar is a real tenant — needs a place/story record + the factual-review gate before public release (real names fine in dev).
