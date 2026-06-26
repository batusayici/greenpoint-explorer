# R2 — Generalized Signature Layer

Status: **Design — approved (Batu, 2026-06-25).** Next: implementation plan.
Track: R (Recognizability), PLAN.md. Parent: `2026-06-24-r2-recognizable-storefronts-alignment.md`
(Lever B). Supersedes the per-shop approach of `2026-06-24-elder-greene-signature-design.md`
for everything except Elder Greene itself (now a bespoke hero — see Scope).

## Intent

Generalize the dormant-but-wired storefront **signature layer** so storefronts read
as *specific real shops* by FORM — awnings, storefront layouts, colors, patterns —
from field photos, with **zero per-building bespoke geometry**. The Elder Greene
build proved one shop end-to-end; this turns that into a reusable **vocabulary** any
kit-routed storefront can compose from, data-only.

Hard constraints (Batu):
- **Replicate truth:** awnings, storefront layouts, colors, patterns are the
  load-bearing recognition cues.
- **No props.** The layer paints the *building's storefront* — never sidewalk
  objects (Elder Greene's bistro-chair `seating` concept is dropped).
- **Claim model holds:** recognition by form, never a real name unless claimed.
- **Palette no-miss holds:** colors are token NAMES resolved against the palette at
  apply time; **invent zero new colors** — snap to the nearest tone that already
  exists in the II-C palette.

## Scope

**Authored this pass (3 shops, all typological / kit-routed → the signature kit path
`decorateStorefront` → `resolveStorefrontUnit` fires for them):**

| Shop | Category | Recognition signals (from photos) | Evidence |
|---|---|---|---|
| **Dandelion Wine** | alcohol/wine | deep-green storefront frame · yellow door/accents · tall multipane bay · hanging blade · ornate brick lintels above | `hero-evidence/Dandelion/` |
| **Chinta Thai** | restaurant | maroon/oxblood storefront band · open glazing · brick above | `hero-evidence/chinta thai/` |
| **160 Franklin** | (roll-gate shop) | white painted-masonry base · **closed metal roll-gate** storefronts · dark frame · multipane windows + fire escape above | `hero-evidence/160 franklin/` |

**Out of scope:**
- **Elder Greene** — now a **bespoke texture hero** (`elder-greene.v0.1.json` + baked
  `elder-greene--corner.trim.png`, facade-spec path). The kit path no longer runs for
  it, so its `storefront-signatures.json` entry is **dead** → **retire it**. Dandelion
  / Chinta / 160 Franklin become the layer's real authored examples.
- **Naked Dog** — its signals (raw `wood-panel` base, carved decorative `band`) are
  *defined in the vocabulary but unauthored* this pass, proving the schema generalizes
  without building the shop.

## Architecture (unchanged spine, extended vocabulary)

One render path. The signature is a thin per-storefront override the kit storefront
path already reads: `signatureFor(key|name)` (`src/storefrontSignatures.js`) →
`resolveStorefrontUnit` (`src/storefrontUnitResolve.js`) → renderer seams in
`SceneView.jsx`. **Present key wins; absent key falls through, byte-stable.**

### Schema extensions (`storefront-signatures.v0.1.json`)

Current schema is awning-centric and assumes navy-awning/black-frame/gold-transom.
Generalize it to cover awnings, layouts, colors, patterns, and closure:

| Signal | Today | Generalized |
|---|---|---|
| `awning.profile` | scalloped/straight | + `box`, `none` (awning-less shops) |
| color | `frame` tint only | `frame` + `base` (bulkhead) + `accent` (door/trim) — each a token name |
| `baseMaterial` | implicit brick | `brick`\|`clapboard`\|`wood-panel`\|`painted-masonry` (brick default; anticipates Naked Dog + covers 160 Franklin white masonry) |
| `glazing.layout` | `rhythm` string (unconsumed) | `single-bay`\|`multipane`\|`divided` + optional bay count — **actually consumed** |
| `closure` | — | `open` (default) \| `roll-gate` (corrugated security gate — 160 Franklin; a strong Greenpoint cue, original variation note) |
| `band` | — | optional decorative storefront cornice/lintel band (defined; unauthored — Naked Dog) |
| `transom`, `blade` | exist | unchanged |
| `seating` | exists | **removed** (prop) |

All keys optional; absent → kit default.

### Colors — snap to nearest existing II-C tone (zero new colors)

The needed colors already live deeper in the palette (`TRIM_TONES`,
`MATERIAL_WALL_TONES`); they are simply not yet exposed as signature tokens.
Generalizing = **expose existing tones as named tokens** in `SIGNATURE_PALETTE`,
inventing nothing. No-miss conformance gate stays green.

| Need | Existing II-C tone | New token name |
|---|---|---|
| Dandelion green frame | `TRIM_TONES 0x4f5b48` (forest green, mid) | `forestGreen` |
| Dandelion yellow accent | `MATERIAL_WALL_TONES.clapboard 0xc4a85c` (muted ochre) | `ochre` |
| Chinta maroon band | `TRIM_TONES 0x6b2f28` (oxblood, mid) | `oxblood` |
| 160 Franklin white masonry | `MATERIAL_WALL_TONES["painted-masonry"] 0xe6dfce` (cream) | `paintedCream` |
| 160 Franklin roll-gate metal | `SIGNATURE_PALETTE.acGrey 0x8a8270` (warm mid-grey) | reuse `acGrey` |
| dark frame | `SIGNATURE_PALETTE.inkBlack` | reuse `inkBlack` |

(Final hue/shade per shop is tuned against the photo at authoring time, but only ever
to another *existing* palette tone.)

## Build order (TDD; each increment ends at a real, verifiable signal)

1. **Schema + tokens + resolver — no renderer change (zero visual risk).**
   - Expose new tokens in `SIGNATURE_PALETTE` (`forestGreen`, `ochre`, `oxblood`,
     `paintedCream`); assert all in-palette.
   - Extend the schema + `resolveStorefrontUnit` for `base`/`accent`/`baseMaterial`/
     `glazing.layout`/`closure`/`band`/`awning.profile=none`; drop `seating`.
   - Retire the `elder-greene` data entry.
   - Unit tests (`storefrontSignatures.test.mjs`, `storefrontUnitResolve.test.mjs`):
     present-key-wins, absent-falls-through byte-stable, token-name → in-palette.
   - Gate: `npm test` / `npm run verify` green.

2. **Renderer seams (`SceneView.jsx`).**
   - Awning builder honors `profile: none` (no canopy) and the profile set.
   - Consume `glazing.layout` (bay division/rhythm).
   - Apply `base`/`accent` tints + `baseMaterial`; render `closure: roll-gate`
     (corrugated grey shutter over the storefront opening).
   - Verify each of the 3 shops in-engine, **all four iso angles**.

3. **Author the 3 shops from photos; verify recognizability four angles.**
   - Interleave **P2 (texture caching)** as awning/valance/roll-gate CanvasTextures
     multiply across the corridor.

## Prep gaps to close (do not invent — truth rule)

- **Chinta Thai has no roster record** (like Verge before it). Need address/house
  number to place it on the Franklin frontage; add a `restaurant` entry, confirm it
  survives `dedupeByProximity`. *(Blocks increment 3 authoring only.)*
- **160 Franklin BIN identity.** The white-masonry roll-gate frontage is a *distinct*
  building from the bespoke Elder Greene corner (BINs 3064538/3064539, texture-routed).
  Identify the 160-Franklin BIN and confirm it is kit-routed and does **not** collide
  with the two bespoke BINs before authoring. *(Blocks increment 3 authoring only.)*
- **Color-snap confirmation** — green/ochre/oxblood/cream mappings above approved by
  Batu 2026-06-25.

## Out of scope / deferred

- Building-level Lever-A signals (parapet/cornice/AC via `signatureContract.js`) —
  fold in opportunistically only, not a goal of this pass.
- Naked Dog (`wood-panel`, `band`) — vocabulary defined, shop unauthored.
- Any sidewalk props (no-props constraint).
