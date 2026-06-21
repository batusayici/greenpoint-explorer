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

## Fan-out — packets prepared 2026-06-20 (awaiting GPT generation)

Division of labor: the agent prepares the generation packet (recipe + exact photo
attachments + output filename + dims + QA) per family; Batu runs GPT-5.5 image-to-image
and drops the raw PNGs; the agent then runs the downstream pipeline (alpha-key → mechanical
gate → Gate A board → Gate B scene proof → register + ledger).

**Raw-PNG drop convention:** `.scratch/asset-kit-raw/<family>/<component>.png` (gitignored).

**Packets ready** (in `docs/reference/art/prompts/`):
- `inked-components-brownstone.v1.md` — 6 cells: wall, cornice, window, door-stoop, weathering, ground. Refs: 9-photo brownstone set + cornice/window/door-stoop/weathering folders.
- `inked-components-modern-flat.v1.md` — 4 cells: wall, window, weathering, ground (bay-frame/awning/roll-gate blocked on gather).
- `inked-components-brick-fill.v1.md` — 2 cells: door-stoop, weathering (extends shipped brick wall/cornice/window/ground; bay-frame/awning/roll-gate blocked).
- `inked-components-clapboard-shingle.v1.md` — 1 cell: shingle wall sub-type (carryover from the pilot).

**Generatable-now count:** 13 components across 4 packets. **Gather-blocked:** bay-frame,
awning, roll-gate for brick + modern-flat (+ painted-masonry, warehouse not yet packeted).

Order to generate (per Batu, 2026-06-20): clapboard-shingle + brick-fill → brownstone →
modern-flat.

### brick-fill — keyed + mechanical gate PASS 2026-06-20 (Gate A/B pending, batched)

- **brick-door-stoop.v1.png** — keyed at threshold 210 (58.5% cleared). Art strong (door +
  transom + stone surround + cheek-walled stoop). Gate-A note: GPT added flanking brick wall
  whose light mortar keyed ragged at the edges; core unit clean, composites fine. Regen
  "draw ONLY the unit, no flanking wall" if pristine edges wanted.
- **brick-weathering.v1.png** — **needed a fix.** GPT ignored "ink/grain on near-white" and
  returned a SOLID grey tile (0% transparent) → would paint a grey rectangle over the wall
  via the `transparent:true` overlay quad. Converted with a LUMINANCE-KEYED alpha ramp
  (whitePoint 210, blackPoint 150) → 83.6% transparent / 2.2% opaque, matching clapboard's
  overlay profile. **Recipe fix applied to brownstone + modern-flat weathering prompts:**
  demand PURE WHITE (#FFFFFF) bg with marks only; fall back to the luminance ramp if needed.
- Raws backed up at `.scratch/asset-kit/brick-{door-stoop,weathering}.raw.png`.

### brownstone — 5/6 keyed + mechanical gate PASS 2026-06-20 (weathering skipped; Gate A/B pending)

Generated from `inked-components-brownstone.v1.md`. Excellent set — the door-stoop (high
stoop, arched double door, brackets, newel posts) and window (hooded carved surround) are
textbook brownstone.
- **Naming fix on intake:** the two delivered "wall" files were mislabeled —
  `brownstone-wall.v1.png` was actually the CORNICE, `brownstone-wall.v1.png.png` was the
  ashlar wall. Re-mapped on stage-in (cornice ← the strip, wall ← the .png.png).
- **Keyed (236, alpha decals):** cornice (40.2% cleared), window (58.6%), door-stoop (50.1%,
  pure-white bg → flawless). No holes in the light stone (border-flood stops at the ink).
- **Opaque tiles (no key):** wall, ground.
- **Wall seam note (Gate A):** 2×2 tile shows a faint continuous horizontal mortar line at
  the top↔bottom join (running-bond offset doesn't fully carry); vertical join near-invisible.
  Mild + forgiving for ashlar — accept-or-regen decision at Gate A.
- **weathering:** skipped by Batu this pass — still PENDING.
- Raws backed up at `.scratch/asset-kit/brownstone-*.raw.png`.
