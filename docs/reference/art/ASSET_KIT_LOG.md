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

### modern-flat — 4/4 generatable-now keyed + mechanical gate PASS 2026-06-20 (Gate A/B pending)

Generated from `inked-components-modern-flat.v1.md`. wall, window, ground, weathering.
- **wall** (opaque) — vertical standing-seam cladding; 2×2 tile SEAMLESS (standing-seam is
  naturally vertical → trivially continuous top↔bottom).
- **window** (alpha decal) — needed threshold 224, not 236: the background margin sat ~235
  and border-flood stalled at 236, leaving a cream halo box around the unit. 224 cleared the
  margin (48% transparent), no holes (frame dark, glass mid-grey). **Lesson:** when the
  generated bg comes back ~235 instead of ≥240, drop the key threshold to ~224.
- **ground** (opaque) — flush door + storefront window at grade, no stoop (correct modern type).
- **weathering** (overlay) — the PURE-WHITE-bg recipe fix WORKED: keyed 98.9% transparent at
  236 with a plain border flood (no luminance ramp needed, unlike brick-weathering).
- **Blocked (no refs):** bay-frame, awning, roll-gate.
- Raws backed up at `.scratch/asset-kit/modern-flat-*.raw.png`.

### gap pieces — keyed + mechanical gate PASS 2026-06-20

- **clapboard-shingle-wall.v1.png** (opaque tile) — overlapping shingle courses, running
  offset, inked bottom edges + vertical breaks. 2×2 tile clean (left↔right seamless,
  top↔bottom courses flow). Closes the clapboard shingle sub-type carryover. (Matrix: a wall
  VARIANT within the clapboard family — no new family row; verifier treats it as a generated
  clapboard wall asset.)
- **brownstone-weathering.v1.png** (overlay) — pure-white-bg recipe → keyed 94.6% transparent
  at 236, plain border flood. Closes the brownstone family (now 6/6).
- Raws backed up at `.scratch/asset-kit/{clapboard-shingle-wall,brownstone-weathering}.raw.png`.

**All generatable-now components are now keyed + mechanical-gate PASS (21 OK).** Remaining
PENDING are gather-blocked only: brick/modern-flat bay-frame+awning+roll-gate,
painted-masonry (whole family), warehouse (whole family). Next: batched Gate A + Gate B.

### Gate A — APPROVED 2026-06-20 (Batu), with a VARIATION backlog

All four family boards approved. Approval came with 6 notes — these define the
**variation / recognizability layer** the single-component base kit doesn't yet cover.
Backlog for Phase 7+/8 (kit additions + signature layer), NOT blocking Gate B:

1. **Stoop is OPTIONAL.** Many Greenpoint entrances have a stoop, but not all — yet every
   current door-stoop asset bakes in a stoop (only modern-flat is stoopless). Need a
   **flush/low door variant** per family so ~some buildings sit at grade.
2. **Brick sub-types unaccounted for.** Real brick varies: mortar thickness (thick vs
   tight), coursing uniformity (uniform vs varied). One brick-wall tile ≠ the range. Need
   **2–3 brick wall variants**.
3. **Window AC units.** ~1 in 4 windows has a through-window AC unit — a recognizable
   Greenpoint signal. New small overlay/decal component, applied to a subset of windows.
4. **Dual-material facades.** ~1 in 10 buildings mixes materials (e.g. brick + clapboard).
   The `dual-material/` reference folder exists; needs a compose rule (two families on one
   facade, split by storey or bay).
5. **4–5 door + window TYPES per family.** Variation is load-bearing for recognizability;
   one door + one window per family reads repetitive at block scale. Generate a small set
   per family and vary by BIN.
6. **Fire escapes** are a MAJOR facade element, entirely missing from the kit. New component
   (front-mounted zig-zag fire escape overlay), applied to a large subset of street facades.

Implication: the base 6×9 grid is the floor, not the ceiling. Items 1/5 expand the door+
window columns; 2 expands the wall column; 3/6 are NEW component types; 4 is a compose rule.
Several of these (per-BIN door/window choice, fire escape placement, AC subset, dual-material
split) are exactly the **signature-layer** wiring deferred to Phase 8 — fold them in there.

### Gate B — isolation compose proof run 2026-06-20 (all 4 families)

Ran `?assetkit=<family>` (src/dev/AssetKitProof.js) for brick, brownstone, modern-flat,
clapboard — each composed+tinted onto the real-meter test panel beside the Premier hero
composite (tone reference). All four read convincingly in-scene and tone-match the hero:
- **brick** — red-brick wall, white-lintel windows, bracketed cornice, door-stoop at grade. ✓
- **brownstone** — chocolate ashlar, hooded windows, heavy cornice, high-stoop arched entry,
  faint spalling weathering. ✓ (strongest set)
- **modern-flat** — tan standing-seam cladding + flush windows; quiet by design. Cornice/door
  absent (modern has no cornice cell; its door is in the `ground` component, which the
  isolation harness doesn't composite — harness limitation, not an asset gap). ✓
- **clapboard** — grey-green lap, white double-hung, cornice, door+stoop, weathering. ✓
  (consistent with the 2026-06-19 pilot approval; shingle variant not composited by the
  harness, which uses `wall`.)

Proofs reviewed inline by Batu (not persisted to disk this run). **Harness real-meter
constants are clapboard-tuned** (lap 0.15 m, wood-frame repeat) — fine for a tone/legibility
proof, but per-family wall repeat (ashlar/coursing) would need tuning for a pixel-accurate
proof. Gate B verdict: pending Batu.

## Ground-floor regen — brick + brownstone (Phase 8.0 craft follow-up, `task_f39b0155`)

**Status:** SHIPPED 2026-06-21 (mechanical gate + Gate-B scene proof passed; final 8.0 look
re-gate pending Batu, also gated on the fire-escape ironwork follow-up). Packet:
`docs/reference/art/prompts/inked-components-ground-regen.v1.md`.

**Result (2026-06-21):** Batu ran both cells in GPT-5.5, raws → Downloads (staged at
`.scratch/asset-kit-raw/{brick,brownstone}/ground.png`). Both delivered at 1774×887 RGBA, no
painted stairs/door — correct. **One fix on intake:** GPT baked sepia chroma (brick
meanChroma 51.7, brownstone 34.0) above the tintable-neutral ceiling (≤29). Applied a
saturation pass (`ImageEnhance.Color`, factors 0.435 / 0.662) → 22.7 / 22.4, matching the
shipped kit (~22–23). Structure/ink untouched. Overwrote `assets/inked/{brick,brownstone}-ground.v1.png`.
- **Mechanical gate:** `verify-inked-component.mjs` → both OK (opaque fill, tintable-neutral).
  Full `npm run verify` GREEN (136 tests + conformance/visual/components/stories/coverage/overrides).
- **Gate B (in-engine):** framed the brownstone pilot (3064541) and brick pilot (3064677) at
  angle 2/4, zoomed to the base. Both: plain masonry ground band + parlor window, **3D stoop
  projects cleanly in front, NO double-stairs.** Console clean. The objective is met.
- **Lesson:** GPT bakes warm chroma into "warm-grey" ground fills (same class as the
  brick-weathering grey-tile lesson). Desaturate on intake to ~22–23 meanChroma; it's a
  legitimate tintable-neutral fix, not a regen. Recipe note added below.
- **Out of scope (unchanged by this task):** the stoop geometry reads boxy and the fire-escape
  rails read as solid shelves — both are the *other* 8.0 follow-ups / approved geometry, not
  the ground texture.

> GROUND-FILL CHROMA LESSON (2026-06-21): GPT-5.5 returns "dark ink on warm grey" ground/wall
> fills with too much baked sepia (meanChroma 34–52 vs the ≤29 kit ceiling). Fix on intake
> with a saturation scale-down to ~22–23 meanChroma (`ImageEnhance.Color(im).enhance(f)`),
> hue preserved, ink/structure intact. Apply to future opaque-fill regens before the gate.

**Why:** the 3D stoop (Phase 8.0) renders in front of the painted ground band, but the brick
+ brownstone ground textures bake in painted stairs + entry door → double-stairs. Batu's call
(DECISION_LOG 2026-06-21): regenerate the two ground textures **without painted stairs/door**
so the painted parlor wall and the 3D stoop coexist.

**Scope (Batu, 2026-06-21): minimal now, defer 8.5.** Each ground texture = parlor masonry +
parlor window(s) only. No stoop/door/railing/basement/areaway — the basement reference corpus
(`asset-reference/basement/`, 11 photos: high stoop + iron areaway + garden door + barred
basement window) is the **Phase 8.5** subject and stays deferred. Key constraints baked into
the packet: (1) the parlor window MUST stay — the window-decal grid covers upper storeys only
(`composeInkedFacade` starts windows at `groundFrac`), so the ground texture is the parlor
floor's only window; (2) the **central third stays plain wall** because the 3D entry is
centered (`doorCenterM = frontM/2`) — window(s) go to the side(s).

**Intake:** overwrite `{brick,brownstone}-ground.v1.png` (filename kept, no wiring change;
opaque tiles → no alpha key). Raws → `.scratch/asset-kit-raw/{brick,brownstone}/ground.png`.
Old painted-stairs files backed up at `.scratch/asset-kit/{brick,brownstone}-ground.painted-stairs.png`.

**Downstream (agent, after raws land):** no-entry QA → `verify-inked-component.mjs` → Gate B
scene proof on the pilot (brick 148 Franklin, brownstone 168 Franklin) confirming no
double-stairs → re-gate the 8.0 look → ledger + DECISION_LOG.
