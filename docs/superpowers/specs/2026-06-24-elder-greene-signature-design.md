# Elder Greene — Storefront Signature (R2 first build)

Status: **Design — building increment 1.** First proof-set shop; sets the
corridor-wide pattern. Parent alignment: `2026-06-24-r2-recognizable-storefronts-alignment.md`.
Photos (truth): `docs/reference/asset-reference/storefront/proof-set/elder-greene/elder-greene-{1..4}.jpeg`.

## What we're matching (from the photos)

Elder Greene, **160 Franklin St — Franklin × Kent corner**, 2-storey red brick.
Curation: `elder-greene`, visualTier typological, brick → **kit-routed**.
Storefront record: `block-franklin-milton-storefronts.v0.1.json:25`, category
currently `restaurant` (reads **bar** — COCKTAILS / COLD BEER).

Signature signals, ranked by recognition weight:
1. **Navy scalloped awning that wraps the corner** — continuous along Franklin +
   Kent, scalloped/wavy valance hem, thin light top edge. The headline cue.
2. **Black full-height glazed storefront** — charcoal millwork, tall multi-pane
   bays, transom band, low brick spandrel.
3. **Gold serif transom text** — "COCKTAILS" / "COLD BEER".
4. **Corner blade sign** (oval, gold-on-dark) at the chamfered corner door.
5. **Sage-green bistro chairs + café tables** on the sidewalk.
6. **Building signature:** stepped parapet w/ diamond brick insets + curved
   central pediment; a window-AC unit (variation note #3).

## Locked decisions (Batu, 2026-06-24)

- **Category-only / form-recognizable.** No real name. Recognition from form;
  transom carries generic-but-true text ("COCKTAILS / COLD BEER" is category, not
  a brand). No blade-sign brand text. → signal #4 becomes a *form* blade (shape +
  gold), not a name.
- **Full stack in v1:** storefront band + sidewalk seating + building signature +
  category fix.
- **Palette no-miss holds — every color has a token** (no new colors):
  navy awning `TRIM_TONES 0x2a313a` · black frame `0x1d1a16` · gold text
  `II_PALETTE.signalAmber 0xcc9a3b` · sage chairs `clapboard 0x9a9c86`.

## Architectural crux (resolved)

Elder Greene's brick walls/recesses are drawn by the **kit path**
(`decorateStorefront`, SceneView:3257); `buildBlockStorefronts` `continue`s for
kit families (SceneView:1557). The projecting-awning builder (`buildStorefrontAwnings`)
lives **only** in the block path → **kit buildings have no projecting awning today.**

**Decision:** signatures are a thin override the **kit storefront path reads** —
do NOT pull Elder Greene out into the block path (that would re-implement its brick
facade). Teach `decorateStorefront` (+ a new signature-awning builder it can call)
to accept an optional per-storefront `signature`. Absent → today's behavior,
byte-identical. This keeps one render path and matches the contract's
"present key wins, absent falls through" rule.

## Schema — per-storefront signature (keyed by curation key)

New file `src/data/facade-signatures/storefront-signatures.v0.1.json`, pure loader
`src/storefrontSignatures.js` (`signatureFor(key)` / `matchName` fallback). Keyed by
the **storefront identity** (`elder-greene`), not BIN — a building can hold several
shops, and the signature is the *shop's* band. (Building-level signals — parapet,
AC — use the BIN-keyed Lever-A `signatureContract.js` surface, increment 4.)

```jsonc
{
  "key": "elder-greene",
  "matchName": "elder greene",
  "category": "bar",                 // category fix rides here (was restaurant)
  "signature": {
    "awning":  { "profile": "scalloped", "tintToken": "slateBlueDark", "wrapCorner": true },
    "frame":   { "tintToken": "inkBlack" },
    "transom": { "text": "COCKTAILS · COLD BEER", "tintToken": "signalAmber" },
    "glazing": { "rhythm": "tall-multipane" },
    "blade":   { "shape": "oval", "tintToken": "signalAmber" },   // form only, no name
    "seating": { "kind": "bistro", "tintToken": "sage" }          // → streetFurniture
  }
}
```
Tokens are **names** resolved against `palette.js` at apply time (never raw hex in
data), so the conformance gate stays green and the data file is human-editable.

## Increments (each ends at a real signal)

1. **Data + resolver + tests (no renderer change — zero visual risk).** ← building now
   - signature JSON (elder-greene) + `storefrontSignatures.js` resolver.
   - token-name → palette resolution, asserted in-palette (no-miss).
   - `matchName`/`key` lookup; absent → null (falls through).
   - `.test.mjs` unit tests. Verify: `npm test` / `npm run verify` green.
2. **Wire the storefront band into the kit path.** `decorateStorefront` reads the
   signature; new signature-awning (scalloped, navy, corner-wrap) + black frame +
   gold transom text. Verify Elder Greene **in-engine at the Franklin × Kent corner,
   all four angles**.
3. **Sidewalk seating.** Sage bistro chairs/tables via `streetFurniture.js` at the
   storefront frontage. Verify in-engine.
4. **Building signature + category fix.** Parapet diamond insets + window-AC via the
   BIN-keyed Lever-A surface; flip the roster category restaurant→bar. Verify.

Interleave **P2 (texture caching)** once awning/valance textures start multiplying
across the four shops.
