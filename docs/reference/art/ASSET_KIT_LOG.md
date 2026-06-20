# Asset Kit Build Log

Per-family ledger for the inked component kit (recognizable-silhouette model).
Doctrine (from `hero-facade-build-loop`): read this AND the spec before a family;
append an entry after. Each family makes the next cheaper.

## Shared reference scaffold (THE consistency anchor — reuse verbatim per family)

Every family is generated from this one recipe so style does not drift. Only the
material noun and the attached source photos change between families.

**Per component, generate tintable-neutral:**
> Redraw the [COMPONENT] of a Greenpoint [FAMILY] building in the attached
> hand-inked editorial illustration style (II-C system: confident 1–4px linework,
> controlled hatching for shadow, paper texture). Draw it in DARK INK ON WARM GREY
> ONLY — no baked color, no chroma; the color is applied later by tint. Isolated
> subject, centered, on a flat near-white keyable background, no scene, no
> neighbors, no sky. Copy the structure from the attached reference photos exactly
> — proportions, joinery, profile — do not invent or regularize.

Attach: (1) the II-C system tile `docs/reference/art/II-C-style-system-tile.png`,
(2) the component's reference photos from `docs/reference/asset-reference/`.

**Gate order per component:** mechanical (`verify-inked-component.mjs`) →
Gate A board → Gate B scene proof.

## Anchor family: clapboard

**Status:** SHIPPED. Vertical-slice pilot. Both taste gates passed (Batu-approved 2026-06-19/20).

**Components shipped (5):**
- `assets/inked/clapboard-wall.v1.png` — horizontal-lap siding tile, tintable-neutral
- `assets/inked/clapboard-cornice.v1.png` — bracketed cornice strip, tintable-neutral
- `assets/inked/clapboard-window.v1.png` — double-hung window, alpha decal
- `assets/inked/clapboard-door-stoop.v1.png` — door + stoop unit, alpha decal
- `assets/inked/clapboard-weathering.v1.png` — paint-wear/grain overlay, ink/grain only (no tint)

**Alpha-key thresholds (scripts/key_inked_alpha.py):**
- wall, cornice, window, weathering: default 236
- door-stoop: 210 (background was warm cream below the default threshold; 210 caught it cleanly)

All 5 pass `node scripts/verify-inked-component.mjs` (keyed + tintable-neutral). Full `npm run verify` GREEN (110 tests).

**Sub-type note:** clapboard has two sub-types — horizontal lap (what the pilot wall uses) and shingle. Shingle is a future variant; the pilot covers horizontal-lap only.

**Proportion lesson (the main iteration cost):**
The isolation harness `src/dev/AssetKitProof.js` initially sized the proof by arbitrary fractions. The wall tile rendered as a stretched giant lap and openings looked undersized. Fix: size by REAL METERS — representative 6 m × 8.5 m 3-storey rowhouse; clapboard lap ~0.15 m tiled; bracketed cornice ~0.8 m; double-hung windows ~1.05 m × tall; door+stoop ~2.8 m. With real-meter dimensions, the art read correctly.

**Iteration count:** ~1 GPT generation pass + 1 alpha-key threshold retune (door-stoop) + 1 proportion fix in the harness.

**Weathering refs gap:** the reference corpus (`docs/reference/asset-reference/`) had paint-on-masonry weathering photos only; used as grain/texture ref. Clapboard-specific peeling-paint weathering is add-as-we-go.

**Gate A:** contact-sheet board `docs/visual-artifacts/asset-kit-boards/clapboard-board.png` — approved by Batu.
**Gate B:** isolation scene proof `docs/visual-artifacts/asset-kit-boards/clapboard-scene-proof.jpg` — approved after the proportion fix.

**One-line lesson:** Generate tintable-neutral from photos, but tune the in-scene COMPOSE ratios to real meters or the kit reads wrong even when the art is right.
