# Inked Storefronts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic tinted inked stoop on the three commercial BINs of the Franklin (Greenpoint→Milton) block with procedural, category-labeled inked storefronts (vintage / bar / juice bar).

**Architecture:** A pure, Node-runnable `composeStorefront()` returns band-local rects for each storefront sub-element (bulkhead, glazing, transom, door, sign, frame, awning). A new `decorateStorefront()` in `SceneView.jsx` maps those rects into face-local coords, assigns inked materials (solid tints + canvas textures), and draws them through `decorateInkedWall`'s existing `quad()` helper — same wall-mesh registration path, no floating quads. A one-line branch in `decorateInkedWall` routes commercial BINs (those whose `INKED_FACADE_REAL` entry has a `storefront` block) to the new path; everything else keeps the old ground band.

**Tech Stack:** React 19 + Three.js (r0.184) + Vite. Tests via `node --test` on pure `.mjs` modules. In-engine verification via the SceneView preview.

---

## File Structure

- **Create:** `src/storefrontCompose.js` — pure geometry: `composeStorefront({ door, awning })` → named band-local rects. No Three.js.
- **Create:** `src/storefrontCompose.test.mjs` — unit tests for the band subdivision.
- **Modify:** `src/SceneView.jsx`
  - add `makeInkedGlazingTexture()` and `makeAwningTexture(tintHex)` canvas helpers (near the other `make*Texture` fns, ~line 2071),
  - add `decorateStorefront(quad, band, storefront, params)` (after `decorateInkedWall`, ~line 1912),
  - branch inside `decorateInkedWall` (line 1888) to call it when `params.storefront` is present,
  - add `storefront` blocks to three `INKED_FACADE_REAL.buildings` entries (lines 1030/1031/1034).

---

## Task 1: Pure storefront composition + tests

**Files:**
- Create: `src/storefrontCompose.js`
- Test: `src/storefrontCompose.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/storefrontCompose.test.mjs`:

```js
// Run: node --test src/storefrontCompose.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { composeStorefront } from "./storefrontCompose.js";

test("returns all sub-element rects", () => {
  const s = composeStorefront({ door: "left", awning: { has: true } });
  assert.ok(s.bulkhead, "bulkhead");
  assert.ok(Array.isArray(s.glazing) && s.glazing.length === 2, "two glazing panels");
  assert.ok(s.mullion, "mullion");
  assert.ok(s.transom, "transom");
  assert.ok(s.door, "door");
  assert.ok(s.sign, "sign");
  assert.ok(Array.isArray(s.frame) && s.frame.length === 4, "four frame borders");
});

test("structural bands tile the band [0,1] vertically with no gap or overlap", () => {
  const s = composeStorefront({ door: "left" });
  assert.equal(s.bulkhead.y0, 0, "bulkhead starts at 0");
  assert.equal(s.bulkhead.y1, s.glazing[0].y0, "bulkhead → glazing");
  assert.equal(s.glazing[0].y1, s.transom.y0, "glazing → transom");
  assert.equal(s.transom.y1, s.sign.y0, "transom → sign");
  assert.equal(s.sign.y1, 1, "sign ends at 1");
});

test("door column sits on the chosen side and glazing does not overlap it", () => {
  const left = composeStorefront({ door: "left" });
  assert.equal(left.door.x0, 0, "left door at x0=0");
  assert.ok(left.glazing[0].x0 >= left.door.x1 - 1e-9, "glazing right of left door");

  const right = composeStorefront({ door: "right" });
  assert.equal(right.door.x1, 1, "right door at x1=1");
  assert.ok(right.glazing[1].x1 <= right.door.x0 + 1e-9, "glazing left of right door");
});

test("all rects are within 0..1 and non-degenerate", () => {
  const s = composeStorefront({ door: "right", awning: { has: true } });
  const rects = [s.bulkhead, ...s.glazing, s.mullion, s.transom, s.door, s.sign, ...s.frame, s.awning];
  for (const r of rects) {
    assert.ok(r.x0 >= 0 && r.x1 <= 1, "x in range");
    assert.ok(r.y0 >= 0 && r.y1 <= 1, "y in range");
    assert.ok(r.x1 > r.x0 && r.y1 > r.y0, "non-degenerate");
  }
});

test("awning is null without one and proud (above glazing) with one", () => {
  assert.equal(composeStorefront({ awning: { has: false } }).awning, null, "no awning");
  const s = composeStorefront({ awning: { has: true } });
  assert.ok(s.awning.y0 >= s.glazing[0].y1 - 1e-9, "awning sits at/above glazing top");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/storefrontCompose.test.mjs`
Expected: FAIL — `Cannot find module './storefrontCompose.js'`.

- [ ] **Step 3: Write the implementation**

Create `src/storefrontCompose.js`:

```js
// src/storefrontCompose.js
// Pure, Node-runnable storefront composition for the inked kit. No Three.js.
// Given a tenant's storefront params, returns BAND-LOCAL rects (x0..x1, y0..y1
// as 0..1 fractions of the ground band) for each inked sub-element. The renderer
// maps these into face-local coords and assigns materials. Geometry only —
// colors/labels live in the params and are applied at draw time.

const BULKHEAD_TOP = 0.18; // masonry kickplate height (band fraction)
const GLAZE_TOP = 0.74;    // top of the display glass
const TRANSOM_TOP = 0.84;  // top of the light transom band; sign = [TRANSOM_TOP, 1]
const DOOR_W = 0.18;       // recessed entry column width
const MULLION_W = 0.02;    // divider between the two glazing panels
const FRAME_W = 0.015;     // thin storefront frame border

export function composeStorefront({ door = "left", awning } = {}) {
  const hasAwning = !!(awning && awning.has);
  const doorLeft = door === "left";

  // Horizontal: entry column on `door` side; glazing fills the remainder.
  const glazeX0 = doorLeft ? DOOR_W : 0;
  const glazeX1 = doorLeft ? 1 : 1 - DOOR_W;
  const doorRect = doorLeft
    ? { x0: 0, y0: 0, x1: DOOR_W, y1: TRANSOM_TOP }
    : { x0: 1 - DOOR_W, y0: 0, x1: 1, y1: TRANSOM_TOP };

  const glazeMid = (glazeX0 + glazeX1) / 2;
  const glazing = [
    { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeMid - MULLION_W / 2, y1: GLAZE_TOP },
    { x0: glazeMid + MULLION_W / 2, y0: BULKHEAD_TOP, x1: glazeX1, y1: GLAZE_TOP },
  ];
  const mullion = { x0: glazeMid - MULLION_W / 2, y0: BULKHEAD_TOP, x1: glazeMid + MULLION_W / 2, y1: GLAZE_TOP };

  const bulkhead = { x0: 0, y0: 0, x1: 1, y1: BULKHEAD_TOP };
  const transom = { x0: glazeX0, y0: GLAZE_TOP, x1: glazeX1, y1: TRANSOM_TOP };
  const sign = { x0: 0, y0: TRANSOM_TOP, x1: 1, y1: 1 };

  // Thin border around the glazing+transom opening (door-side seam, outer
  // jamb, head, sill). Reads as the storefront frame.
  const frame = [
    { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeX0 + FRAME_W, y1: TRANSOM_TOP },   // inner vertical (door-side seam)
    { x0: glazeX1 - FRAME_W, y0: BULKHEAD_TOP, x1: glazeX1, y1: TRANSOM_TOP },   // outer vertical
    { x0: glazeX0, y0: TRANSOM_TOP - FRAME_W, x1: glazeX1, y1: TRANSOM_TOP },    // head
    { x0: glazeX0, y0: BULKHEAD_TOP, x1: glazeX1, y1: BULKHEAD_TOP + FRAME_W },  // sill
  ];

  // Awning: proud canopy over the transom zone, full width (drawn forward of the
  // wall by the renderer). Null when the tenant has none.
  const awningRect = hasAwning ? { x0: 0, y0: GLAZE_TOP, x1: 1, y1: 0.92 } : null;

  return { bulkhead, glazing, mullion, transom, door: doorRect, sign, frame, awning: awningRect };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/storefrontCompose.test.mjs`
Expected: PASS — 5 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/storefrontCompose.js src/storefrontCompose.test.mjs
git commit -m "feat(inked): pure composeStorefront band-subdivision + tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Inked canvas textures (glazing + awning)

**Files:**
- Modify: `src/SceneView.jsx` (add two helpers after `makeStorefrontValanceTexture`, ~line 2071)

No unit test — these produce DOM `CanvasTexture`s and are verified in-engine in Task 5. Keep them small and self-contained.

- [ ] **Step 1: Add a module-level glazing-texture cache**

Near the other module-level caches (search for `__inkedTexCache` ~line 1844), add below it:

```js
let __glazingTex = null; // shared inked-glass texture (built once)
```

- [ ] **Step 2: Add the two texture helpers**

Insert after `makeStorefrontValanceTexture` (ends ~line 2071), before `makeRoofTexture`:

```js
// Inked display glass: dark warm-grey pane with a few cream diagonal reflection
// strokes so the glazing reads as inked glass rather than flat black. Built once
// and shared across every storefront panel.
function makeInkedGlazingTexture() {
  if (__glazingTex) return __glazingTex;
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#2b2f31"; ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(239, 231, 214, 0.16)"; ctx.lineWidth = 10;
  for (let i = -1; i < 4; i += 1) {
    ctx.beginPath(); ctx.moveTo(i * 80, 256); ctx.lineTo(i * 80 + 170, 0); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  __glazingTex = tex;
  return tex;
}

// Inked awning: a solid-fabric canopy in the tenant's category color with a
// scalloped valance hem. Scallop gaps and the area below the hem are left
// transparent (alpha 0) so the canopy edge reads as rounded fabric, not a
// rectangle. `tintHex` is the category fabric color.
function makeAwningTexture(tintHex) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  const ctx = c.getContext("2d");
  const tint = new THREE.Color(tintHex);
  ctx.fillStyle = `#${tint.getHexString()}`;
  const hemY = 90;
  ctx.fillRect(0, 0, 256, hemY);               // canopy body
  const n = 8, w = 256 / n;
  for (let i = 0; i < n; i += 1) {              // scalloped valance (lower semicircles)
    ctx.beginPath(); ctx.arc(i * w + w / 2, hemY, w / 2, 0, Math.PI); ctx.fill();
  }
  ctx.strokeStyle = "rgba(239, 231, 214, 0.5)"; ctx.lineWidth = 4; // hem line
  ctx.beginPath(); ctx.moveTo(0, hemY); ctx.lineTo(256, hemY); ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
```

- [ ] **Step 3: Verify the build is clean**

Run: `npm run build`
Expected: build succeeds (the 46MB bay-window GLB large-chunk warning is expected and unrelated).

- [ ] **Step 4: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(inked): inked glazing + scalloped awning canvas textures

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: decorateStorefront + wire into decorateInkedWall

**Files:**
- Modify: `src/SceneView.jsx` (add import, add `decorateStorefront` after `decorateInkedWall` ~line 1912, branch at line 1888)

- [ ] **Step 1: Import composeStorefront**

`src/SceneView.jsx` line 26 reads:

```js
import { composeInkedFacade } from "./inkedFacadeCompose.js";
```

Add immediately after it:

```js
import { composeStorefront } from "./storefrontCompose.js";
```

- [ ] **Step 2: Replace the generic ground-band line with a branch**

In `decorateInkedWall`, line 1888 currently reads:

```js
  quad(f.ground, 0.006, inkedTexture("brick-ground.v1.png"), { tint: params.tint });
```

Replace it with:

```js
  // Commercial BINs carry a `storefront` block → draw the inked storefront
  // vocabulary in the ground band. Everything else keeps the generic stoop.
  if (params.storefront) {
    decorateStorefront(quad, f.ground, params.storefront, params);
  } else {
    quad(f.ground, 0.006, inkedTexture("brick-ground.v1.png"), { tint: params.tint });
  }
```

- [ ] **Step 3: Add decorateStorefront**

Insert immediately after the closing brace of `decorateInkedWall` (~line 1912), before `pointInPolygon`:

```js
// Draw the inked storefront vocabulary into the ground band of a commercial
// building. `quad` is decorateInkedWall's face-local quad helper; `band` is the
// face-local ground rect (f.ground). composeStorefront returns BAND-LOCAL rects,
// which we map into the band before drawing. Offsets stay just proud of the wall
// (0.006–0.011) except the awning, which projects forward (0.030).
function decorateStorefront(quad, band, storefront, params) {
  const s = composeStorefront(storefront);
  const bw = band.x1 - band.x0;
  const bh = band.y1 - band.y0;
  const map = (r) => ({
    x0: band.x0 + r.x0 * bw, x1: band.x0 + r.x1 * bw,
    y0: band.y0 + r.y0 * bh, y1: band.y0 + r.y1 * bh,
  });
  const dark = (hex, k) => new THREE.Color(hex).multiplyScalar(k).getHex();
  const tint = params.tint;
  const frameTint = storefront.frameTint ?? dark(tint, 0.45);

  // Masonry kickplate: tinted brick-ground, matches the building's brick tone.
  quad(map(s.bulkhead), 0.006, inkedTexture("brick-ground.v1.png"), { tint });
  // Display glass: shared inked-glazing texture (self-contained dark glass).
  const glazeTex = makeInkedGlazingTexture();
  for (const g of s.glazing) quad(map(g), 0.008, glazeTex, {});
  // Mullion, transom, door, frame: solid inked tints.
  quad(map(s.mullion), 0.009, null, { tint: frameTint });
  quad(map(s.transom), 0.009, null, { tint: 0xcdbfa6 });          // light transom band
  quad(map(s.door), 0.009, null, { tint: dark(frameTint, 0.7) }); // recessed entry, darker
  for (const fr of s.frame) quad(map(fr), 0.011, null, { tint: frameTint });
  // Category sign band: paper ground + uppercase serif label (no real names).
  quad(map(s.sign), 0.010, makeStorefrontSignTexture(storefront.label), {});
  // Awning: proud scalloped canopy in the category color.
  if (s.awning) {
    const aw = makeAwningTexture(storefront.awning.color ?? 0x2a2622);
    quad(map(s.awning), 0.030, aw, { transparent: true });
  }
}
```

- [ ] **Step 4: Verify the build is clean**

Run: `npm run build`
Expected: build succeeds (only the expected GLB large-chunk warning).

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(inked): decorateStorefront — inked storefront vocabulary on the ground band

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Per-tenant storefront data

**Files:**
- Modify: `src/SceneView.jsx` (three entries in `INKED_FACADE_REAL.buildings`, lines 1030/1031/1034)

- [ ] **Step 1: Add storefront blocks to the three commercial BINs**

In `INKED_FACADE_REAL.buildings`, append a `storefront` key to these three entries (labels are CATEGORY names only — never the real business names, per the claim/monetization rule). Leave 3064797 (103), 3064798 (101) and 3064800 (97 corner) untouched.

Line 1030 — `3064795` (107 Awoke Vintage): add `storefront: { label: "VINTAGE", awning: { has: true, color: 0x2a2622 }, frameTint: 0x1c1714, door: "right" },`

Line 1031 — `3064796` (105 Broken Land): add `storefront: { label: "BAR", awning: { has: false }, frameTint: 0x241a15, door: "left" },`

Line 1034 — `3064799` (99 Juice's): add `storefront: { label: "JUICE BAR", awning: { has: true, color: 0xd98a2b }, frameTint: 0x3a2c20, door: "left" },`

The resulting entries read, e.g.:

```js
    "3064795": { tint: 0xc4724a, storeys: 4, bays: 2, addr: "107 Awoke Vintage", fireEscape: true, storefront: { label: "VINTAGE", awning: { has: true, color: 0x2a2622 }, frameTint: 0x1c1714, door: "right" } },
    "3064796": { tint: 0x86504a, storeys: 3, bays: 2, addr: "105 Broken Land", storefront: { label: "BAR", awning: { has: false }, frameTint: 0x241a15, door: "left" } },
    ...
    "3064799": { tint: 0xb0644a, storeys: 5, bays: 2, addr: "99 Juice's", fireEscape: true, storefront: { label: "JUICE BAR", awning: { has: true, color: 0xd98a2b }, frameTint: 0x3a2c20, door: "left" } },
```

- [ ] **Step 2: Verify the build is clean**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(inked): per-tenant storefront params for 107/105/99 (category labels)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: In-engine verification

**Files:** none (verification only)

This is the real signal — the unit test only covers geometry. Use the SceneView preview.

- [ ] **Step 1: Start the dev server**

Use `preview_start` (or confirm one is running with `preview_list`). Dev server: `http://127.0.0.1:5173`.

- [ ] **Step 2: Navigate to the block-view framing**

`preview_eval`: `window.location.href = "http://127.0.0.1:5173/?t=-1.05,0.5,3.5&f=4.4&a=0"`
Then force a full repaint: `preview_resize` to one size, then `preview_resize` to a *different* size (SceneView renders on-demand; the first paint after a reload often half-paints).

- [ ] **Step 3: Check the console for errors**

`preview_console_logs` — expected: no errors (the GLB chunk warning is build-time only, not console).

- [ ] **Step 4: Screenshot the three fronts and confirm the checklist**

`preview_screenshot`. Confirm against the spec:
1. Sign band legible at iso zoom (VINTAGE / BAR / JUICE BAR).
2. Awnings present on 107 + 99 (read as projecting); 105 has none.
3. Glazing reads dark/inked (with reflection strokes), not flat-black.
4. No z-fighting with windows / wall / cornice.
5. Residential 101 & 103 unchanged (generic stoop); corner 97 unchanged.

Cross-reference the field photos in `docs/mvp-reference-images/franklin-greenpoint-to-milton-block/` for awning color/door-side sanity.

- [ ] **Step 5: Tune if needed**

If any sub-element mis-registers or reads flat, adjust the band fractions in `src/storefrontCompose.js` (re-run `node --test src/storefrontCompose.test.mjs`) or the tints/textures in `decorateStorefront` / the canvas helpers, rebuild, and re-screenshot. Commit any tuning with a `fix(inked):` message.

- [ ] **Step 6: Send the user the proof screenshot**

Use `SendUserFile` with the final block-view screenshot so Batu can judge the look against the photos.

---

## Notes for the implementer

- **Truth rule:** sign bands carry CATEGORY labels only. Never bake the real business names (Awoke Vintage, Broken Land, Juice's). Real branding is gated on a paid "claim" — out of scope here.
- **Registration model:** never add storefront quads to the scene root. They go through `decorateInkedWall`'s `quad()` so they sit proud of the wall and are self-occluded by the opaque massing — the same fix that killed the earlier floating-quad bleed.
- **On-demand render gotcha:** after any reload, fire a second `preview_resize` (different dimensions) to force a full repaint before screenshotting.
- **Do not touch** the corner heroes (Premier, 97 deli) or the residential BINs (101/103).
