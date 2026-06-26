# R2 Generalized Signature Layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generalize the wired-but-single-shop storefront signature layer into a reusable vocabulary (awning profiles incl. `none`, base/accent colors, base material, glazing layout, roll-gate closure) and author three real shops — Dandelion Wine, Chinta Thai, 160 Franklin — through it, data-only.

**Architecture:** One render path. A per-storefront signature (`signatureFor`) resolves to a per-bay unit (`resolveStorefrontUnit`), which becomes `kitParams.storefront.units`, drawn by `decorateStorefront` → `drawUnit` → `composeStorefront` in `SceneView.jsx`. We extend the pure functions (unit-tested) and the renderer seam (in-engine verified). Present signature key wins; absent falls through byte-stable.

**Tech Stack:** React 19 + Three.js + Vite. Pure logic in plain `.js` modules with `node:test` (`*.test.mjs`). Renderer in `src/SceneView.jsx`. Colors are token names resolved against `SIGNATURE_PALETTE` in `src/visualSystem/palette.js`.

## Global Constraints

- **Palette no-miss:** every color is a token NAME resolved against `SIGNATURE_PALETTE` at apply time. Invent ZERO new colors — new tokens must equal a tone that already exists elsewhere in the II-C palette (`TRIM_TONES` / `MATERIAL_WALL_TONES`).
- **No props:** the layer paints the building's storefront only — never sidewalk objects. The `seating` concept is removed entirely.
- **Claim model:** recognition by FORM, never a real brand name unless claimed. Transom/sign text stays category-true.
- **Truth rule:** do not invent addresses/BINs/tenants. Tasks 7–8 are gated on Batu supplying Chinta Thai's address and confirming 160 Franklin's BIN.
- **Blade signs are NOT rendered** (dropped idiom — didn't read at iso scale, `SceneView.jsx:1366`). `blade` stays optional form-data; no projecting geometry.
- **Absent signature must stay byte-stable** — every new resolver/compose branch is gated on a present key; existing tests for the default path must keep passing untouched.
- **Verification reality:** pure functions are unit-tested (`node --test`); Three.js renderer changes are verified in-engine via the preview tools at all four iso angles (no node test for `SceneView.jsx`).

---

## File Structure

- `src/visualSystem/palette.js` — MODIFY: add 4 tokens to `SIGNATURE_PALETTE`.
- `src/data/facade-signatures/storefront-signatures.v0.1.json` — MODIFY: retire `elder-greene`; extend schema; add 3 shops (Tasks 6–8).
- `src/storefrontSignatures.js` — unchanged (token set auto-derives from palette).
- `src/storefrontSignatures.test.mjs` — MODIFY: retarget off `elder-greene`; assert new tokens.
- `src/storefrontUnitResolve.js` — MODIFY: consume `base`/`accent`/`baseMaterial`/`closure`, and `awning.profile === "none"`.
- `src/storefrontUnitResolve.test.mjs` — MODIFY: add cases.
- `src/storefrontCompose.js` — MODIFY: consume `glazing.layout`.
- `src/storefrontCompose.test.mjs` — MODIFY: add cases.
- `src/SceneView.jsx` — MODIFY: `drawUnit` awning-`none`/base/accent/baseMaterial/roll-gate; remove seating call + builder + import (Task 2b).
- `src/storefrontSeating.js`, `src/storefrontSeating.test.mjs` — DELETE (Task 2b).
- `src/data/places/block-franklin-*-storefronts.v0.1.json` — MODIFY: add Chinta Thai record (Task 7, gated).

---

## Task 1: Palette tokens (zero new colors)

**Files:**
- Modify: `src/visualSystem/palette.js` (the `SIGNATURE_PALETTE` block, currently lines ~241–248)
- Test: `src/storefrontSignatures.test.mjs`

**Interfaces:**
- Produces: 4 new `SIGNATURE_PALETTE` keys — `forestGreen` (`0x4f5b48`), `ochre` (`0xc4a85c`), `oxblood` (`0x6b2f28`), `paintedCream` (`0xe6dfce`). `SIGNATURE_TOKEN_NAMES` (in `storefrontSignatures.js`) auto-includes them (it is `new Set(Object.keys(SIGNATURE_PALETTE))`).

- [ ] **Step 1: Write the failing test**

Append to `src/storefrontSignatures.test.mjs`:

```javascript
test("R2 generalized tokens exist and equal their existing II-C tones (no new colors)", () => {
  assert.equal(tokenColor("forestGreen"), 0x4f5b48); // TRIM_TONES forest green (mid)
  assert.equal(tokenColor("ochre"), 0xc4a85c);       // clapboard muted ochre/mustard
  assert.equal(tokenColor("oxblood"), 0x6b2f28);     // TRIM_TONES oxblood (mid)
  assert.equal(tokenColor("paintedCream"), 0xe6dfce); // painted-masonry cream
  for (const t of ["forestGreen", "ochre", "oxblood", "paintedCream"]) {
    assert.ok(SIGNATURE_TOKEN_NAMES.has(t), `${t} must be a declared signature token`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/storefrontSignatures.test.mjs`
Expected: FAIL — `tokenColor("forestGreen")` returns `undefined`, not `0x4f5b48`.

- [ ] **Step 3: Add the tokens**

In `src/visualSystem/palette.js`, inside `SIGNATURE_PALETTE`, after the `acGrey` line, add:

```javascript
  forestGreen: 0x4f5b48, // green storefront frame (== TRIM_TONES forest green, mid)
  ochre: 0xc4a85c, // mustard/ochre accent (== MATERIAL_WALL_TONES.clapboard ochre)
  oxblood: 0x6b2f28, // maroon storefront band (== TRIM_TONES oxblood, mid)
  paintedCream: 0xe6dfce, // white-painted masonry base (== MATERIAL_WALL_TONES painted-masonry)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/storefrontSignatures.test.mjs`
Expected: PASS (all tests, including existing elder-greene ones — still present at this point).

- [ ] **Step 5: Run the conformance gate**

Run: `npm run verify`
Expected: green (new tones already exist in the palette, so no-miss holds).

- [ ] **Step 6: Commit**

```bash
git add src/visualSystem/palette.js src/storefrontSignatures.test.mjs
git commit -m "feat(facade): expose forestGreen/ochre/oxblood/paintedCream signature tokens

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2a: Retire the Elder Greene signature entry

Elder Greene is now a bespoke texture hero (`elder-greene.v0.1.json`); the kit signature path no longer runs for it, so its data entry is dead. Remove it and retarget the resolver tests onto a synthetic fixture so they don't depend on authored data.

**Files:**
- Modify: `src/data/facade-signatures/storefront-signatures.v0.1.json`
- Modify: `src/storefrontSignatures.test.mjs`

**Interfaces:**
- Produces: `storefront-signatures.v0.1.json` with an empty `storefronts: []` (vocabulary doc retained), so `signatureFor("elder-greene")` returns `null`.

- [ ] **Step 1: Rewrite the signature tests to not depend on elder-greene data**

Replace the `elder-greene`-dependent tests in `src/storefrontSignatures.test.mjs` (the "resolves Elder Greene by curation key", "resolves by matchName", "tintTokens resolve...", "every tintToken used in the data..." tests) with data-independent equivalents:

```javascript
test("returns null for any unknown shop (data-independent)", () => {
  assert.equal(signatureFor("no-such-shop"), null);
  assert.equal(signatureFor(null), null);
  assert.equal(signatureFor(undefined), null);
  assert.equal(signatureFor(""), null);
});

test("every tintToken referenced in the data file is a declared SIGNATURE_PALETTE name (no-miss)", () => {
  for (const entry of DATA.storefronts ?? []) {
    const tokens = [];
    const sig = entry.signature ?? {};
    for (const part of [sig.awning, sig.frame, sig.base, sig.accent, sig.transom, sig.blade]) {
      if (part && part.tintToken) tokens.push(part.tintToken);
    }
    if (sig.building?.parapet?.tintToken) tokens.push(sig.building.parapet.tintToken);
    for (const t of tokens) {
      assert.ok(SIGNATURE_TOKEN_NAMES.has(t), `${entry.key}: ${t} must be a declared signature token`);
      assert.equal(typeof tokenColor(t), "number", `${entry.key}: ${t} must resolve to a color`);
    }
  }
});
```

Add the data import at the top of the test file (next to the other imports):

```javascript
import DATA from "./data/facade-signatures/storefront-signatures.v0.1.json" with { type: "json" };
```

Keep the existing "tokenColor returns undefined for an unknown token name" and the Task-1 token test.

- [ ] **Step 2: Run tests to verify the elder-greene ones are gone and the rest pass**

Run: `node --test src/storefrontSignatures.test.mjs`
Expected: PASS (no test references `elder-greene` anymore; the data-loop test passes vacuously while `storefronts` still has elder-greene).

- [ ] **Step 3: Empty the authored data (retire elder-greene)**

In `src/data/facade-signatures/storefront-signatures.v0.1.json`, set `"storefronts"` to `[]` and update `_doc` to note the schema additions. Replace the file body with:

```json
{
  "_doc": "Per-storefront SIGNATURE layer (R2 — recognizable storefronts). Keyed by the storefront's curation key (building-tiers.*.json) with a matchName fallback. A thin, evidence-bound override that makes a specific shop read as itself by FORM — never by real name (claim model: text stays category-true). Colors are token NAMES resolved against SIGNATURE_PALETTE at apply time (no raw hex; no-miss gate holds). Application rule: a present key wins over the kit default; absent keys fall through, byte-stable. Vocabulary keys: awning {profile: scalloped|straight|box|none, stripe, tintToken, wrapCorner}; frame/base/accent {tintToken}; baseMaterial: brick|clapboard|wood-panel|painted-masonry; glazing {layout: single-bay|multipane|divided}; closure: open|roll-gate; transom {text, tintToken}; blade {shape, tintToken} (FORM-DATA ONLY — projecting blades are not rendered); band (decorative storefront cornice — defined, unauthored). Building-level signals use signatureContract.js, not this file. Elder Greene retired here — it is now a bespoke texture hero.",
  "version": "0.1",
  "storefronts": []
}
```

- [ ] **Step 4: Run tests + verify**

Run: `node --test src/storefrontSignatures.test.mjs && npm run verify`
Expected: PASS / green.

- [ ] **Step 5: Commit**

```bash
git add src/data/facade-signatures/storefront-signatures.v0.1.json src/storefrontSignatures.test.mjs
git commit -m "refactor(facade): retire Elder Greene signature entry (now bespoke hero); doc vocabulary

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2b: Remove the seating prop (no-props constraint)

The only signature signal that emitted a sidewalk prop was `seating` (Elder Greene bistro chairs). With Elder Greene retired, the seating builder is dead and violates the no-props constraint. Remove it.

**Files:**
- Modify: `src/SceneView.jsx` (remove import line 46, call site line 319, and the `buildStorefrontSeating` function at ~1854–1924)
- Delete: `src/storefrontSeating.js`, `src/storefrontSeating.test.mjs`

**Interfaces:**
- Produces: no `seating` rendering anywhere; `planStorefrontSeating` no longer imported.

- [ ] **Step 1: Remove the call site**

In `src/SceneView.jsx`, delete the line (currently ~319):

```javascript
      buildStorefrontSeating(three, scene, baysByBin, storefrontPointByName);
```

- [ ] **Step 2: Remove the function**

Delete the entire `buildStorefrontSeating` function (currently ~1854–1924, from the `// planStorefrontSeating, this maps it to world...` comment through its closing brace at the `for (const t of tables) buildBistroSet(...)` block).

- [ ] **Step 3: Remove the import**

In `src/SceneView.jsx`, delete the line (currently 46):

```javascript
import { planStorefrontSeating } from "./storefrontSeating.js";
```

- [ ] **Step 4: Delete the module + its test**

```bash
git rm src/storefrontSeating.js src/storefrontSeating.test.mjs
```

- [ ] **Step 5: Verify no dangling references**

Run: `grep -rn "Seating\|planStorefrontSeating\|buildBistroSet" src/`
Expected: no matches.

- [ ] **Step 6: Build to confirm nothing broke**

Run: `npm run build`
Expected: build succeeds (no missing-import error).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(facade): remove storefront seating prop (no-props constraint)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Resolver — base/accent/baseMaterial/closure + awning `none`

Extend `resolveStorefrontUnit` so a signed shop can be awning-LESS (the load-bearing fix — currently a signed awning is always forced on), and can carry base/accent colors, a base material, and a roll-gate closure. All gated on present keys; absent stays byte-stable.

**Files:**
- Modify: `src/storefrontUnitResolve.js`
- Test: `src/storefrontUnitResolve.test.mjs`

**Interfaces:**
- Consumes: `tokenColor` from `storefrontSignatures.js`; signature shape from the schema.
- Produces: on the returned `unit`, optional fields — `baseTint` (number), `accentTint` (number), `baseMaterial` (string), `closure` (string). `awning.has === false` when `signature.awning.profile === "none"`. `awning.profile` passes through (`scalloped|straight|box`).

- [ ] **Step 1: Write failing tests**

Append to `src/storefrontUnitResolve.test.mjs`:

```javascript
test("signature awning profile 'none' suppresses the awning (even for a food trade)", () => {
  const sig = { awning: { profile: "none" } };
  const u = resolveStorefrontUnit({ bay: food, index: 0, params: {}, count: 1, signature: sig });
  assert.equal(u.awning.has, false);
  assert.equal(u.awning.profile, undefined);
});

test("signature base + accent tints resolve from tokens", () => {
  const sig = { base: { tintToken: "forestGreen" }, accent: { tintToken: "ochre" } };
  const u = resolveStorefrontUnit({ bay, index: 0, params: {}, count: 1, signature: sig });
  assert.equal(u.baseTint, 0x4f5b48);   // forestGreen
  assert.equal(u.accentTint, 0xc4a85c); // ochre
});

test("signature baseMaterial + closure pass through", () => {
  const sig = { baseMaterial: "painted-masonry", closure: "roll-gate" };
  const u = resolveStorefrontUnit({ bay, index: 0, params: {}, count: 1, signature: sig });
  assert.equal(u.baseMaterial, "painted-masonry");
  assert.equal(u.closure, "roll-gate");
});

test("absent signature leaves all new fields undefined (byte-stable)", () => {
  const u = resolveStorefrontUnit({ bay: food, index: 0, params: {}, count: 1 });
  assert.equal(u.baseTint, undefined);
  assert.equal(u.accentTint, undefined);
  assert.equal(u.baseMaterial, undefined);
  assert.equal(u.closure, undefined);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/storefrontUnitResolve.test.mjs`
Expected: FAIL — `u.baseTint` etc. are `undefined`; the `none` test fails because the current code forces `has = true` whenever `sig.awning` is present.

- [ ] **Step 3: Implement the resolver changes**

In `src/storefrontUnitResolve.js`, replace the awning branch inside the `if (signature && typeof signature === "object")` block and add the new keys. The awning branch becomes:

```javascript
    if (sig.awning) {
      if (sig.awning.profile === "none") {
        has = false; // an explicitly awning-less signed shop (overrides food default)
      } else {
        has = true;                                  // a signed awning is always on
        const c = tokenColor(sig.awning.tintToken);
        if (c != null) color = c;
        if (sig.awning.profile) unit.profile = sig.awning.profile;
        if (sig.awning.stripe) unit.stripe = sig.awning.stripe; // fabric style (e.g. "pinstripe")
        if (sig.awning.wrapCorner != null) unit.wrapCorner = sig.awning.wrapCorner;
      }
    }
```

Then, after the existing `if (sig.transom) {...}` block (still inside the signature block), add:

```javascript
    if (sig.base) {
      const bc = tokenColor(sig.base.tintToken);
      if (bc != null) unit.baseTint = bc;            // storefront bulkhead/frame base color
    }
    if (sig.accent) {
      const ac = tokenColor(sig.accent.tintToken);
      if (ac != null) unit.accentTint = ac;          // door/trim accent color
    }
    if (typeof sig.baseMaterial === "string") unit.baseMaterial = sig.baseMaterial;
    if (typeof sig.closure === "string") unit.closure = sig.closure; // "open" | "roll-gate"
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/storefrontUnitResolve.test.mjs`
Expected: PASS (including the pre-existing default and elder-greene-fixture tests — they use inline fixtures, not data).

- [ ] **Step 5: Commit**

```bash
git add src/storefrontUnitResolve.js src/storefrontUnitResolve.test.mjs
git commit -m "feat(facade): signature awning 'none' + base/accent/baseMaterial/closure on resolved unit

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Compose — glazing layout

Make `composeStorefront` honor a `layout` option so a shop can read as a single tall multipane bay (`single-bay`) instead of the default two-panel split. `divided`/`multipane` keep the current two-panel rects (the default), so this is purely additive.

**Files:**
- Modify: `src/storefrontCompose.js`
- Test: `src/storefrontCompose.test.mjs`

**Interfaces:**
- Consumes: a `layout` field on the unit passed to `composeStorefront`.
- Produces: when `layout === "single-bay"`, `glazing` is a single full-width pane (one rect) and `mullion` is `[]`; otherwise unchanged (two panes + mullion).

- [ ] **Step 1: Write failing tests**

Append to `src/storefrontCompose.test.mjs`:

```javascript
test("layout single-bay yields one full-width glazing pane and no mullion", () => {
  const s = composeStorefront({ door: "left", layout: "single-bay" });
  assert.equal(s.glazing.length, 1);
  // one pane spanning from the door edge to the far edge (no center split)
  assert.ok(s.glazing[0].x1 - s.glazing[0].x0 > 0.5, "single pane should span most of the bay");
  assert.deepEqual(Array.isArray(s.mullion) ? s.mullion : [s.mullion], []);
});

test("default layout still yields two panes + a mullion (byte-stable)", () => {
  const s = composeStorefront({ door: "left" });
  assert.equal(s.glazing.length, 2);
  assert.ok(s.mullion && !Array.isArray(s.mullion));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/storefrontCompose.test.mjs`
Expected: FAIL — `composeStorefront` ignores `layout`; single-bay still returns 2 panes.

- [ ] **Step 3: Implement layout in compose**

In `src/storefrontCompose.js`, change the signature to accept `layout` and branch the non-center (left/right) glazing. Update the function header:

```javascript
export function composeStorefront({ door = "left", awning, layout } = {}) {
```

Then, in the left/right branch, replace the `glazing`/`mullion` definitions (currently the two-pane split + single mullion) with:

```javascript
  const glazeMid = (glazeX0 + glazeX1) / 2;
  const singleBay = layout === "single-bay";
  const glazing = singleBay
    ? [{ x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeX1, y1: GLAZE_TOP }]
    : [
        { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeMid - MULLION_W / 2, y1: GLAZE_TOP },
        { x0: glazeMid + MULLION_W / 2, y0: BULKHEAD_TOP, x1: glazeX1, y1: GLAZE_TOP },
      ];
  const mullion = singleBay
    ? []
    : { x0: glazeMid - MULLION_W / 2, y0: BULKHEAD_TOP, x1: glazeMid + MULLION_W / 2, y1: GLAZE_TOP };
```

(The renderer already handles `mullion` as either an array or a single rect: `Array.isArray(s.mullion) ? s.mullion : [s.mullion]` at `SceneView.jsx:3842`, so `[]` draws nothing.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/storefrontCompose.test.mjs`
Expected: PASS (default-path tests unchanged).

- [ ] **Step 5: Commit**

```bash
git add src/storefrontCompose.js src/storefrontCompose.test.mjs
git commit -m "feat(facade): composeStorefront single-bay glazing layout (additive)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Renderer seams — awning `none`, base/accent tints, roll-gate

Teach `drawUnit` (inside `decorateStorefront`, `SceneView.jsx`) to honor the new unit fields. Pure-logic is already tested in Tasks 3–4; this is the Three.js seam, verified in-engine. There is no node test for `SceneView.jsx` — the gate is a clean build plus in-engine inspection. (Full recognizability verification happens per-shop in Tasks 6–8; this task proves the seam renders without breaking the default path.)

**Files:**
- Modify: `src/SceneView.jsx` — `drawUnit` (currently ~3810–3894) and pass `layout` into `composeStorefront`.

**Interfaces:**
- Consumes: `unit.baseTint`, `unit.accentTint`, `unit.baseMaterial`, `unit.closure`, `unit.layout`, `unit.awning.has`.
- Produces: rendered storefront band honoring those fields; absent → identical to today.

- [ ] **Step 1: Pass layout into compose**

In `drawUnit` (`SceneView.jsx` ~3811), change:

```javascript
    const s = composeStorefront(unit);
```
to:
```javascript
    const s = composeStorefront({ ...unit, layout: unit.layout });
```

(`unit.layout` is set when the signature provides `glazing.layout`; see Step 6 wiring note below.)

- [ ] **Step 2: Apply base/accent tints**

In `drawUnit`, the bulkhead and frame currently use `frameTint` (~3817). Add a base tint for the bulkhead and an accent tint for the door. After the existing `const frameTint = unit.frameTint ?? dark(tint, 0.45);` line, add:

```javascript
    const baseTint = unit.baseTint ?? frameTint;     // bulkhead / storefront base color
    const accentTint = unit.accentTint ?? frameTint; // door / trim accent color
```

Change the bulkhead draw (~3820) from `{ tint: frameTint }` to `{ tint: baseTint }`. In the non-entrance door block (~3853), change the recessed door leaf tint `dark(frameTint, 0.55)` to `dark(accentTint, 0.55)` (leaving the reveal shadows as `frameTint` so only the leaf takes the accent color).

- [ ] **Step 3: Honor awning `none`**

The awning already only draws when `s.awning` is truthy and `composeStorefront` returns `awning: null` when `awning.has` is false. Confirm: with `unit.awning.has === false`, `composeStorefront` sets `awningRect = null` (it tests `!!(awning && awning.has)`), so the `if (s.awning && !suppressAwning)` block (~3869) is skipped. No code change needed — add a one-line comment at ~3869 noting `profile:"none"` flows through as `awning.has=false`.

- [ ] **Step 4: Render roll-gate closure**

In `drawUnit`, after the awning block (~3893, before the closing `}` of `drawUnit`), add a roll-gate overlay that covers the glazing+door zone with a corrugated grey shutter when `unit.closure === "roll-gate"`:

```javascript
    // Roll-gate closure: a corrugated security shutter drawn proud of the glass,
    // covering the shopfront opening (a strong Greenpoint "closed shop" cue).
    if (unit.closure === "roll-gate") {
      const gate = map({ x0: 0, y0: 0, x1: 1, y1: GLAZE_TOP_FRAC });
      const gateTex = makeRollGateTexture(SIGNATURE_PALETTE.acGrey);
      quad(gate, 0.012, gateTex, {}); // proud of the glass, just behind the frame face
    }
```

Add `GLAZE_TOP_FRAC` near the top of `decorateStorefront` (mirror `composeStorefront`'s `GLAZE_TOP = 0.74`):

```javascript
  const GLAZE_TOP_FRAC = 0.74; // matches storefrontCompose GLAZE_TOP — gate height
```

- [ ] **Step 5: Add the roll-gate texture helper**

Near `makeAwningTexture` (`SceneView.jsx` ~4186), add a corrugated-shutter canvas texture:

```javascript
// Corrugated roll-gate (security shutter) texture: horizontal slats in a single
// metal-grey tone with thin darker score lines, so a closed shopfront reads as a
// rolled-down gate at iso scale. Built per tint (cached by the caller if needed).
function makeRollGateTexture(tintHex) {
  const c = document.createElement("canvas");
  c.width = 16; c.height = 64;
  const g = c.getContext("2d");
  const base = new THREE.Color(tintHex);
  g.fillStyle = `#${base.getHexString()}`;
  g.fillRect(0, 0, c.width, c.height);
  const dark = base.clone().multiplyScalar(0.7);
  g.strokeStyle = `#${dark.getHexString()}`;
  g.lineWidth = 1;
  for (let y = 2; y < c.height; y += 5) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(c.width, y); g.stroke(); // slat seams
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
```

(Ensure `SIGNATURE_PALETTE` is imported in `SceneView.jsx` — it imports from `./visualSystem/palette.js` already; add `SIGNATURE_PALETTE` to that import if absent. Verify with `grep -n "SIGNATURE_PALETTE" src/SceneView.jsx`.)

- [ ] **Step 6: Wire `layout` from signature → unit**

In `src/storefrontUnitResolve.js`, inside the signature block, after the `closure` line from Task 3, add:

```javascript
    if (sig.glazing?.layout) unit.layout = sig.glazing.layout;
```

(Add a quick test in `storefrontUnitResolve.test.mjs`: a signature with `glazing: { layout: "single-bay" }` yields `unit.layout === "single-bay"`; absent → `undefined`.)

- [ ] **Step 7: Build + in-engine smoke (default path unbroken)**

Run: `npm run build` (expect success), then start the preview and confirm the corridor still renders with no console errors and existing storefronts look unchanged (no shop is signed yet, so every storefront takes the default path).

- [ ] **Step 8: Commit**

```bash
git add src/SceneView.jsx src/storefrontUnitResolve.js src/storefrontUnitResolve.test.mjs
git commit -m "feat(facade): renderer seams for awning-none, base/accent tint, single-bay, roll-gate

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Author Dandelion Wine

First real generalized-layer shop. Dandelion Wine is in the roster (`block-franklin-north-storefronts.v0.1.json:51`, `category: "alcohol"`, point-only) and is kit-routed, so the signature fires. Recognition: deep-green storefront frame, ochre/yellow door accent, single tall multipane bay, no fabric awning.

**Files:**
- Modify: `src/data/facade-signatures/storefront-signatures.v0.1.json`
- Verify: in-engine (preview, four angles)

**Interfaces:**
- Consumes: the schema + resolver/compose/renderer from Tasks 1–5.

- [ ] **Step 1: Add the Dandelion signature entry**

Set `storefronts` to contain (tune exact tokens against `hero-evidence/Dandelion/` at verify time, but only ever to existing palette tones):

```json
{
  "key": "dandelion-wine",
  "matchName": "dandelion wine",
  "category": "alcohol",
  "evidence": "docs/reference/asset-reference/hero-evidence/Dandelion/",
  "signature": {
    "awning": { "profile": "none" },
    "frame": { "tintToken": "forestGreen" },
    "base": { "tintToken": "forestGreen" },
    "accent": { "tintToken": "ochre" },
    "baseMaterial": "brick",
    "glazing": { "layout": "single-bay" },
    "transom": { "text": "NATURAL WINE", "tintToken": "ochre" }
  }
}
```

- [ ] **Step 2: Run the data-conformance test**

Run: `node --test src/storefrontSignatures.test.mjs && npm run verify`
Expected: PASS / green (all tokens declared + in-palette).

- [ ] **Step 3: Verify in-engine at four angles**

Start the preview, locate Dandelion Wine on Franklin (north block). Confirm: green storefront frame + bulkhead, ochre door + transom text, a single wide glazing pane (no center mullion), no projecting awning. Capture a screenshot at each of the four iso angles. Compare against `hero-evidence/Dandelion/`. Adjust tokens (within the palette) if the read is off, re-verify.

- [ ] **Step 4: Commit**

```bash
git add src/data/facade-signatures/storefront-signatures.v0.1.json
git commit -m "feat(facade): Dandelion Wine storefront signature (green frame, ochre, single-bay)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Author Chinta Thai (prep-gated: needs address)

**GATE:** Chinta Thai has no roster record. Before this task, Batu must supply its address/house number. Do not invent it.

**Files:**
- Modify: a `block-franklin-*-storefronts.v0.1.json` roster (the block matching its address)
- Modify: `src/data/facade-signatures/storefront-signatures.v0.1.json`
- Verify: in-engine

**Interfaces:**
- Consumes: Tasks 1–5; the placement-by-house-number path.

- [ ] **Step 1: Add the roster record**

In the block roster matching the supplied address, add (filling the real `houseNumber`/`addrStreet`/`point` from Batu):

```json
{
  "name": "Chinta Thai",
  "category": "restaurant",
  "houseNumber": "<from Batu>",
  "addrStreet": "Franklin Street",
  "point": null,
  "sourceId": "manual:chinta-thai",
  "confidence": "address-only",
  "activeStatus": "unverified"
}
```

- [ ] **Step 2: Confirm placement survives dedupe**

Start the preview; confirm the Chinta Thai bay appears on the Franklin frontage at the right house number and is not dropped by `dedupeByProximity` (`src/storefrontRoster.js:75`). If dropped, adjust per the roster's dedupe rules and re-check.

- [ ] **Step 3: Add the signature entry**

Append to `storefronts` (tune tokens against `hero-evidence/chinta thai/`):

```json
{
  "key": "chinta-thai",
  "matchName": "chinta thai",
  "category": "restaurant",
  "evidence": "docs/reference/asset-reference/hero-evidence/chinta thai/",
  "signature": {
    "awning": { "profile": "none" },
    "frame": { "tintToken": "oxblood" },
    "base": { "tintToken": "oxblood" },
    "baseMaterial": "brick",
    "glazing": { "layout": "divided" },
    "transom": { "text": "THAI", "tintToken": "paintedCream" }
  }
}
```

- [ ] **Step 4: Verify in-engine at four angles**

Confirm the maroon/oxblood storefront band, open glazing, brick above; compare to evidence; capture four angles.

- [ ] **Step 5: Run tests + verify + commit**

```bash
node --test src/storefrontSignatures.test.mjs && npm run verify
git add src/data/places/ src/data/facade-signatures/storefront-signatures.v0.1.json
git commit -m "feat(facade): Chinta Thai roster record + oxblood storefront signature

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Author 160 Franklin roll-gate shop (prep-gated: needs BIN)

**GATE:** The white-masonry roll-gate frontage at 160 Franklin is a distinct building from the bespoke Elder Greene corner (BINs 3064538/3064539, texture-routed). Before this task, Batu must confirm the 160-Franklin BIN, that it is kit-routed (not texture-routed), and that it does not collide with the two bespoke BINs. Do not assume.

**Files:**
- Modify: a `block-franklin-*-storefronts.v0.1.json` roster (if the bay needs a record)
- Modify: `src/data/facade-signatures/storefront-signatures.v0.1.json`
- Possibly modify: `src/data/facade-overrides/greenpoint-corridor.v0.1.json` (set the building wall to a painted-masonry family/cream tone if not already)
- Verify: in-engine

**Interfaces:**
- Consumes: Tasks 1–5; the roll-gate render seam.

- [ ] **Step 1: Confirm the bay identity**

With the BIN confirmed by Batu, find the storefront bay at 160 Franklin in the rosters. If no bay exists, add a roster record (category reflecting the shop if known; otherwise a generic `retail` with `activeStatus: "unverified"`, name carrying the address only — no invented tenant). Note its `name`/key for the signature lookup.

- [ ] **Step 2: Ensure the building wall reads as white painted-masonry**

If the 160-Franklin BIN's kit family is not already `painted-masonry`, add a per-BIN override in `greenpoint-corridor.v0.1.json` setting `family: "painted-masonry"` (and a cream `tint` from `MATERIAL_WALL_TONES["painted-masonry"]`) so the wall reads white/cream above the storefront. Verify the building tints correctly.

- [ ] **Step 3: Add the roll-gate signature entry**

Append to `storefronts` (key/matchName bound to the Step-1 bay name):

```json
{
  "key": "<160-franklin-bay-key>",
  "matchName": "<160 franklin bay name>",
  "evidence": "docs/reference/asset-reference/hero-evidence/160 franklin/",
  "signature": {
    "awning": { "profile": "none" },
    "frame": { "tintToken": "inkBlack" },
    "base": { "tintToken": "inkBlack" },
    "baseMaterial": "painted-masonry",
    "closure": "roll-gate"
  }
}
```

- [ ] **Step 4: Verify in-engine at four angles**

Confirm: corrugated grey roll-gate over the storefront opening, dark frame, white/cream masonry wall above with multipane windows + fire escape. Compare to `hero-evidence/160 franklin/IMG_1043.jpeg`. Capture four angles.

- [ ] **Step 5: Run tests + verify + commit**

```bash
node --test src/storefrontSignatures.test.mjs && npm run verify
git add src/data/
git commit -m "feat(facade): 160 Franklin roll-gate storefront signature + painted-masonry wall

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Schema extensions (awning none/profiles, base/accent, baseMaterial, glazing layout, closure roll-gate, band defined-unauthored) → Tasks 2a (doc), 3, 4, 5; `band` documented in 2a, intentionally unauthored.
- Colors snap to existing tones, zero new colors → Task 1 (asserts each token equals an existing II-C tone).
- No props → Task 2b removes seating entirely.
- Retire Elder Greene → Task 2a.
- Three authored shops (Dandelion, Chinta, 160 Franklin) → Tasks 6, 7, 8.
- Prep gaps (Chinta address, 160 BIN) → explicit GATEs on Tasks 7, 8.
- Blade not rendered → stated in Global Constraints; schema keeps it as form-data only.

**Placeholder scan:** The `<from Batu>` / `<160-franklin-bay-key>` tokens in Tasks 7–8 are gated, not placeholders — they require external truth Batu must supply and are flagged as GATEs. All code steps contain real code.

**Type consistency:** `baseTint`/`accentTint`/`baseMaterial`/`closure`/`layout` named identically across resolver (Task 3/5.6), compose (`layout`, Task 4), and renderer (Task 5). `GLAZE_TOP_FRAC` (renderer) mirrors `GLAZE_TOP` (compose) = 0.74. `makeRollGateTexture` defined (5.5) and called (5.4) with `SIGNATURE_PALETTE.acGrey`.
