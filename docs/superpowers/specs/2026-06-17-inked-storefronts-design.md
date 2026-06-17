# Inked Storefronts — Procedural Ground-Floor Treatment (Approach A)

**Date:** 2026-06-17
**Branch:** `feat/inked-facade-look`
**Status:** Approved design → implementation
**Related:** [[inked-component-kit-spike]], [[claim-monetization-model]], `2026-06-16-storefront-sign-system-design.md`

## Problem

The Franklin (Greenpoint→Milton) block's commercial ground floors currently render the
generic tinted inked stoop (`brick-ground.v1.png`) for every building. The block needs
look-alike storefronts for its real commercial tenants, drawn in the II-C inked style,
using **category labels only** (no real business names — claim/monetization rule).

## Decisions (locked with Batu, 2026-06-17)

- **Fidelity:** Hybrid — a typed, reusable inked storefront base tinted per building, plus
  1–2 per-tenant signature accents (awning color/presence, frame darkness) pulled from the
  field photos. Not 1:1 photo portraits.
- **Scope:** Storefronts on the three genuinely-commercial BINs only —
  **107 (vintage), 105 (bar), 99 (juice bar)**. **101 & 103 keep the residential ground
  floor** (existing tinted band — photos show no shop glazing). **97 corner deli is excluded**
  (bespoke hero, untouched).
- **Approach A (procedural):** No new rendered art. Storefront is composed from drawn
  quads + canvas textures (the pattern `makeSignBandTexture` already uses). A rendered base
  asset (Approach B) is a deferred upgrade path — geometry/params would not change.
- **Awning:** canvas-drawn with a scalloped inked valance edge (sells "awning" vs flat rect).
- **Sign band:** placed **above the awning, on the building** (legible at iso zoom,
  consistent across the three) — not printed on the awning valance.

## Architecture

A new function `decorateStorefront(target, edge, height, storefront, params, scene)` in
`src/SceneView.jsx`, called from inside `decorateInkedWall` **in place of** the existing
`quad(f.ground, 0.006, inkedTexture("brick-ground.v1.png"), { tint: params.tint })` line —
**only when** `params.storefront` is present. When absent, the existing generic ground band
is drawn unchanged. This keeps the change surgical: one branch in one function plus three
data entries. Residential BINs and the excluded corner are unaffected by construction.

`decorateStorefront` reuses `decorateInkedWall`'s `point()` / `quad()` helpers (same
wall-mesh path, normal-offset proud of the wall, parented under `target`, self-occluded by
opaque massing). All sub-element rects are **fractions of the `f.ground` band** so they
scale with `storeys`/`height` and register without floating-quad bleed.

## The storefront vocabulary

The `f.ground` rect (bottom `1/storeys` of the facade) is subdivided into inked sub-elements,
all `MeshBasicMaterial` quads — solid-tint or canvas-texture:

```
  ┌────────────────────────────┐  ← cornice/wall above (unchanged)
  │░░░░░  SIGN BAND  ░░░░░░░░░░│  canvas text, category label, ~12% of band height
  ├────────────────────────────┤
  │ ╱╲╱╲ awning (per-tenant) ╱╲ │  projecting quad, scalloped inked valance, tenant color
  │┌──────────┬──────────┐┌───┐│
  ││ transom strip (light)     ││  thin light band
  │├──────────┼──────────┤│ d ││
  ││          │          ││ o ││  glazing: dark inked panels + 2–3 hatch reflection lines;
  ││ glazing  │ glazing  ││ o ││  mullion between panels
  ││          │          ││ r ││  recessed entry (darker inset), door side L or R
  │├──────────┴──────────┤│   ││
  │▓ bulkhead (tinted brick) ▓▓││  masonry kickplate, reuses brick-ground tint
  └────────────────────────────┘
```

**Structural** vertical fractions of the band (top→bottom), summing to **1.0**:
`sign 0.16 · transom 0.10 · glazing 0.56 · bulkhead 0.18`. The **awning is NOT a structural
fraction** — it is a separate proud element offset forward in the `normal` direction,
spanning roughly the transom + top-of-glazing zone (≈ y `0.74`–`0.84` of the band), drawn
only when `awning.has`. Horizontal: glazing occupies the bay width minus a `~0.18`-wide
recessed entry column on the `door` side; a mullion splits glazing into 2 panels.

### Sub-element rendering
- **Bulkhead:** tinted `brick-ground.v1.png` (or a darker tint of `params.tint`) — keeps the
  masonry kickplate consistent with the kit.
- **Glazing:** dark solid quad (`frameTint` darkened) with 2–3 thin light diagonal hatch
  lines drawn via a small canvas texture so it reads as inked glass, not flat black.
- **Transom:** thin light solid band.
- **Entry door:** darker inset solid quad on the `door` side.
- **Sign band:** existing sign-band texture generator → category label.
- **Awning** (when `has`): tenant-color quad offset forward in `normal`, with a scalloped
  valance drawn via a small canvas texture (alpha-keyed bottom edge).
- **Frame:** thin dark verticals/horizontal at the storefront opening edges (`frameTint`).

## Per-tenant data

Add an optional `storefront` block to the three commercial entries in `INKED_FACADE_REAL`
(`src/SceneView.jsx`), grounded in the field photos
(`docs/mvp-reference-images/franklin-greenpoint-to-milton-block/`):

```js
"3064795": { …, storefront: { label: "VINTAGE",   awning: { has: true,  color: 0x2a2622 }, frameTint: 0x1c1714, door: "right" } }, // 107 Awoke — dark frame + awning
"3064796": { …, storefront: { label: "BAR",       awning: { has: false },                   frameTint: 0x241a15, door: "left"  } }, // 105 Broken Land — recessed dark wood
"3064799": { …, storefront: { label: "JUICE BAR", awning: { has: true,  color: 0xd98a2b }, frameTint: 0x3a2c20, door: "left"  } }, // 99 Juice's — orange awning
```

Category labels only — never the real names. Real branding only on a paid claim
([[claim-monetization-model]]).

## Data flow

`buildBuildings` → per Step-3 building → `decorateInkedWall(params)` (params now carries the
optional `storefront`). If `params.storefront` present → `decorateStorefront` draws the
vocabulary; else → the old generic ground band. No other pipeline stage changes.

## Testing & verification

- **Unit:** band-subdivision geometry helper (vertical fractions sum to 1.0, no overlapping
  ranges, horizontal split leaves a valid entry column) — colocated with
  `src/inkedFacadeCompose.test.mjs`.
- **In-engine (the real signal, not mockups):** SceneView block-view framing
  `?t=-1.05,0.5,3.5&f=4.4&a=0`; reload + a **second** `preview_resize` (different size) to
  force a full repaint; screenshot the three fronts. Confirm:
  1. sign band legible at iso zoom,
  2. awnings (107, 99) read as projecting; 105 has none,
  3. glazing reads dark/inked, not flat-black,
  4. no z-fighting with windows/wall/cornice,
  5. residential 101/103 unchanged; corner 97 unchanged.

## Out of scope / deferred

- Rendered storefront base asset (Approach B) — swap-in upgrade if procedural base reads flat.
- Per-tenant 1:1 photo portraits (Approach C) — rejected (contradicts reusable-hybrid, risks
  baking real signage).
- Storefronts beyond this block; other material kits.
