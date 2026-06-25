# Phase 8.0 — Structural Depth Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give pilot buildings real extruded depth at the base (stoops) and upper front face (fire escapes), proven on the 4-BIN kit pilot and gated by Batu before the spine fans out.

**Architecture:** Two new pure, Node-runnable geometry modules (`stoopGeometry.js`, `fireEscapeGeometry.js`) emit meter-space quad specs; a tiny `facadeDepthGates.js` decides which families/heights qualify. A thin renderer extension inside `decorateInkedWall()` (SceneView.jsx) maps the specs through the existing `point()`/`quad3()` face-local frame — exactly the pattern the cornice already uses (proud `quad3` surfaces, occluded from behind by the solid extruded mass, so rotation behavior is inherited for free). Fire-escape literalism (shallow-relief vs full-lattice) is a build-time flag the gate resolves.

**Tech Stack:** React 19 + Three.js + Vite. Pure modules use no THREE import and are tested with `node:test`. Preview verification via the `preview_*` tools.

## Global Constraints

- Pure geometry modules (`src/*Geometry.js`, `src/facadeDepthGates.js`) MUST NOT import THREE and MUST be Node-runnable (matches `groundLayer.js`/`streetFurniture.js`/`sceneFrame.js`).
- Tests use `node:test` + `node:assert/strict`; run via `node --test src/<module>.test.mjs`; chained by `npm run test` (`node --test "src/**/*.test.mjs"`).
- All real-world sizing is in METERS; the renderer converts meters→scene units via `scene.projection.scale` (`upm`, ≈0.075 units/m). Never hardcode scene units in the pure modules.
- Color stays in the building's family palette: tints derive from `params.tint` via the existing `darken(hex, k)` helper (same idiom as cornice/seams). No raw out-of-palette hex.
- New depth geometry renders on the **street face only** and only for **kit (pilot) buildings** (`isKit`), never on storefront ground floors.
- `KIT_PILOT_BINS` stays the pilot gate; do NOT widen it in this plan. Fan-out (8.1) is a separate later plan.

## Face-local frame contract (provided by `decorateInkedWall`)

Inside `decorateInkedWall` (SceneView.jsx:2053) these are already in scope and are how the renderer steps draw:
- `point(x, y, off)` → world `[x,y,z]`. `x` ∈ 0..1 along the wall edge (left→right), `y` ∈ 0..1 fraction of building height, `off` = normal projection in **scene units**.
- `quad3(p0, p1, p2, p3, tex, { tint, transparent })` → adds a 4-corner mesh to the wall's decoration group `target`.
- `upm = scene.projection.scale` (meters→units). `frontM = edge.length / upm`. `heightM = height / upm`.
- `darken(hex, k)` → family-palette-safe darker tint.
- `streetFace` (bool), `isKit` (bool), `family` (string), `params` (carries `.tint`, `.storeys`, `.storefront`, optional `.fireEscapeVariant`).

**Pure-module output contract:** each module returns `{ quads: [{ role, corners: [[u,v,w]×4] }], ... }` where `u` = meters along the edge from its left end, `v` = meters above the sidewalk, `w` = meters projected out from the wall plane (0 = flush). The renderer maps each corner `[u,v,w]` → `point(u/frontM, v/heightM, w*upm)`.

---

### Task 1: Family/height gates (`facadeDepthGates.js`)

**Files:**
- Create: `src/facadeDepthGates.js`
- Test: `src/facadeDepthGates.test.mjs`

**Interfaces:**
- Produces: `wantsStoop(family) -> boolean`, `wantsFireEscape(family, storeys) -> boolean`. Consumed by the renderer in Tasks 3 and 5.

- [ ] **Step 1: Write the failing test**

```js
// src/facadeDepthGates.test.mjs
// Run: node --test src/facadeDepthGates.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { wantsStoop, wantsFireEscape } from "./facadeDepthGates.js";

test("residential rowhouse families get a stoop, modern + storefront do not", () => {
  assert.equal(wantsStoop("brick"), true);
  assert.equal(wantsStoop("clapboard"), true);
  assert.equal(wantsStoop("brownstone"), true);
  assert.equal(wantsStoop("modern-flat"), false);
  assert.equal(wantsStoop("warehouse"), false);
});

test("fire escapes only on prewar masonry at >=4 storeys", () => {
  assert.equal(wantsFireEscape("brownstone", 4), true); // pilot 3064541
  assert.equal(wantsFireEscape("brick", 4), true);
  assert.equal(wantsFireEscape("brick", 3), false);     // pilot 3064677 (low-rise)
  assert.equal(wantsFireEscape("clapboard", 5), false); // wood frame, rear escapes
  assert.equal(wantsFireEscape("modern-flat", 6), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/facadeDepthGates.test.mjs`
Expected: FAIL — `Cannot find module './facadeDepthGates.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// src/facadeDepthGates.js
// Pure predicates: which families/heights get a 3D stoop or front fire escape.
// No Three.js; Node-runnable. Thresholds are the tunable taste decision — change
// here, nowhere else.
const STOOP_FAMILIES = new Set(["brick", "clapboard", "brownstone"]);
const FIRE_ESCAPE_FAMILIES = new Set(["brick", "brownstone"]);
const FIRE_ESCAPE_MIN_STOREYS = 4;

export function wantsStoop(family) {
  return STOOP_FAMILIES.has(family);
}

export function wantsFireEscape(family, storeys) {
  return FIRE_ESCAPE_FAMILIES.has(family) && storeys >= FIRE_ESCAPE_MIN_STOREYS;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/facadeDepthGates.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/facadeDepthGates.js src/facadeDepthGates.test.mjs
git commit -m "feat(phase-8.0): facade depth gates (which families get stoop/fire-escape)"
```

---

### Task 2: Stoop geometry (`stoopGeometry.js`)

**Files:**
- Create: `src/stoopGeometry.js`
- Test: `src/stoopGeometry.test.mjs`

**Interfaces:**
- Produces: `buildStoopGeometry({ frontM, doorCenterM, widthM?, projectionM?, parlorHeightM?, stepCount?, cheekThickM?, groundReliefM? }) -> { quads: [{role, corners:[[u,v,w]×4]}], topV, uL, uR }`. Roles: `"tread"|"riser"|"cheek"|"platform"`. Consumed by Task 3.
- `groundReliefM` is the **Phase 8.5 basement hook** — extra base raise so the areaway mini-design slots underneath; default 0.

- [ ] **Step 1: Write the failing test**

```js
// src/stoopGeometry.test.mjs
// Run: node --test src/stoopGeometry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStoopGeometry } from "./stoopGeometry.js";

const base = { frontM: 8, doorCenterM: 4 };

test("emits steps, cheeks, and a platform", () => {
  const s = buildStoopGeometry({ ...base, stepCount: 7 });
  const roles = s.quads.map((q) => q.role);
  assert.equal(roles.filter((r) => r === "tread").length, 7);
  assert.equal(roles.filter((r) => r === "riser").length, 7);
  assert.ok(roles.includes("cheek"));
  assert.equal(roles.filter((r) => r === "platform").length, 1);
});

test("treads climb monotonically to the parlor floor", () => {
  const s = buildStoopGeometry({ ...base, parlorHeightM: 1.4, stepCount: 7 });
  const treadV = s.quads.filter((q) => q.role === "tread").map((q) => q.corners[0][1]);
  for (let i = 1; i < treadV.length; i++) assert.ok(treadV[i] > treadV[i - 1]);
  assert.ok(Math.abs(s.topV - 1.4) < 1e-9);
});

test("steps project out from the wall and recede toward it", () => {
  const s = buildStoopGeometry({ ...base, projectionM: 1.4, stepCount: 7 });
  const treads = s.quads.filter((q) => q.role === "tread");
  // bottom tread sits farthest out (w≈projection), top tread nearest the wall
  assert.ok(treads[0].corners[0][2] > treads[treads.length - 1].corners[0][2]);
});

test("door stays centered within the stoop width", () => {
  const s = buildStoopGeometry({ ...base, widthM: 1.3 });
  assert.ok(Math.abs((s.uL + s.uR) / 2 - 4) < 1e-9);
  assert.ok(Math.abs(s.uR - s.uL - 1.3) < 1e-9);
});

test("groundReliefM raises the parlor floor (8.5 basement hook)", () => {
  const s = buildStoopGeometry({ ...base, parlorHeightM: 1.3, groundReliefM: 0.6 });
  assert.ok(Math.abs(s.topV - 1.9) < 1e-9);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/stoopGeometry.test.mjs`
Expected: FAIL — `Cannot find module './stoopGeometry.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// src/stoopGeometry.js
// Pure geometry for a raised entry stoop. No Three.js; Node-runnable.
// Face-local meters: u = along the wall edge from its left end, v = height above
// the sidewalk, w = projection out from the wall plane (0 = flush). Each quad is
// 4 [u,v,w] corners + a role the renderer tints. Renderer maps [u,v,w] ->
// point(u/frontM, v/heightM, w*upm).
export function buildStoopGeometry({
  frontM,
  doorCenterM,
  widthM = 1.3,
  projectionM = 1.4,
  parlorHeightM = 1.3,
  stepCount = 7,
  cheekThickM = 0.18,
  groundReliefM = 0, // 8.5 areaway hook: extra base raise; stoop top rises with it
}) {
  const topV = parlorHeightM + groundReliefM;
  const uL = doorCenterM - widthM / 2;
  const uR = doorCenterM + widthM / 2;
  const quads = [];
  const stepRise = topV / stepCount;
  const stepRun = projectionM / stepCount;
  for (let i = 0; i < stepCount; i++) {
    const v0 = i * stepRise;
    const v1 = (i + 1) * stepRise;
    const wFront = projectionM - i * stepRun;       // outer edge of this tread
    const wBack = projectionM - (i + 1) * stepRun;  // where it meets the next riser
    quads.push({ role: "tread", corners: [
      [uL, v1, wFront], [uR, v1, wFront], [uR, v1, wBack], [uL, v1, wBack],
    ]});
    quads.push({ role: "riser", corners: [
      [uL, v0, wFront], [uR, v0, wFront], [uR, v1, wFront], [uL, v1, wFront],
    ]});
  }
  for (const side of [-1, 1]) {
    const uOut = side < 0 ? uL - cheekThickM : uR + cheekThickM;
    const uIn = side < 0 ? uL : uR;
    // Outer vertical face of the cheek wall (parapet flanking the steps).
    quads.push({ role: "cheek", corners: [
      [uOut, 0, projectionM], [uOut, 0, 0], [uOut, topV, 0], [uOut, topV, projectionM],
    ]});
    // Top cap of the cheek wall.
    quads.push({ role: "cheek", corners: [
      [uIn, topV, projectionM], [uOut, topV, projectionM], [uOut, topV, 0], [uIn, topV, 0],
    ]});
  }
  // Landing at the door: from the top step back to the wall plane.
  quads.push({ role: "platform", corners: [
    [uL, topV, projectionM / stepCount], [uR, topV, projectionM / stepCount], [uR, topV, 0], [uL, topV, 0],
  ]});
  return { quads, topV, uL, uR };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/stoopGeometry.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/stoopGeometry.js src/stoopGeometry.test.mjs
git commit -m "feat(phase-8.0): pure stoop geometry (steps/risers/cheeks/platform, basement-aware)"
```

---

### Task 3: Render the stoop in `decorateInkedWall`

**Files:**
- Modify: `src/SceneView.jsx` — imports near the other `src/*` imports at the top; new street-face block inside `decorateInkedWall` (the `if (streetFace) { ... }` block, SceneView.jsx:2122-2140).

**Interfaces:**
- Consumes: `wantsStoop` (Task 1), `buildStoopGeometry` (Task 2), and the in-scope `point`/`quad3`/`upm`/`frontM`/`heightM`/`darken`/`isKit`/`family`/`params`.
- Produces: a reusable local `drawMeterQuads(quads, tint)` helper (also used by Task 5).

- [ ] **Step 1: Add the imports**

At the top of `src/SceneView.jsx`, alongside the existing facade-module imports (e.g. the `inkedFacadeCompose` / `facadeFamily` imports), add:

```jsx
import { wantsStoop, wantsFireEscape } from "./facadeDepthGates.js";
import { buildStoopGeometry } from "./stoopGeometry.js";
import { buildFireEscapeGeometry } from "./fireEscapeGeometry.js";
```

(The `fireEscapeGeometry` import is unused until Task 5 — add it now so Task 5 touches only the render block. If the linter blocks unused imports in this repo, add it in Task 5 instead.)

- [ ] **Step 2: Add the meter-quad renderer + stoop block**

Inside `decorateInkedWall`, immediately after the `const darken = (hex, k) => ...` line (SceneView.jsx:2089), add the shared helper:

```jsx
  // Maps a pure module's face-local meter quads ([u,v,w]) into the wall frame.
  const drawMeterQuads = (quads, tint) => {
    for (const q of quads) {
      const [a, b, c, d] = q.corners.map(([u, v, w]) =>
        point(u / frontM, v / heightM, w * upm));
      quad3(a, b, c, d, null, { tint });
    }
  };
```

Then, inside the `if (streetFace) {` block, replace the entry `else` branch (SceneView.jsx:2126-2139, the `groundFile`/`door-stoop` selection) so a qualifying kit building draws a 3D stoop in front of its entry and suppresses the flat door-stoop PNG:

```jsx
    } else {
      const drewStoop = isKit && !params.storefront && wantsStoop(family);
      if (drewStoop) {
        const stoop = buildStoopGeometry({ frontM, doorCenterM: frontM / 2 });
        drawMeterQuads(stoop.quads, darken(params.tint, 0.72)); // family-tinted stone
        // Door panel set into the wall at the platform top (dark, recessed read).
        const doorWf = (stoop.uR - stoop.uL) / frontM;
        const doorTopV = (stoop.topV + 2.1) / heightM; // ~2.1m door leaf above landing
        quad({ x0: 0.5 - doorWf / 2, x1: 0.5 + doorWf / 2, y0: stoop.topV / heightM, y1: doorTopV },
          0.004, null, { tint: darken(params.tint, 0.45) });
      }
      const groundFile = kitFile(family, "ground");
      if (groundFile) {
        quad(f.ground, 0.006, inkedTexture(groundFile), { tint: params.tint });
      } else if (!drewStoop && isKit && params.components?.["door-stoop"] !== false && kitHas(family, "door-stoop")) {
        const hF = Math.min(0.34, f.ground.y1);
        const wF = (hF * heightM) * (1086 / 1448) / frontM;
        quad({ x0: 0.5 - wF / 2, x1: 0.5 + wF / 2, y0: 0, y1: hF }, 0.01, inkedTexture(kitFile(family, "door-stoop")), { transparent: true });
      }
    }
```

Note: families WITH a ground band (brick/brownstone) keep the painted ground band AND get the 3D stoop in front of it — the stoop projects forward of the painted entry, which reads correctly. Clapboard (no ground band) gets the 3D stoop + the door panel and skips the flat PNG.

- [ ] **Step 3: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds, no syntax/import errors.

- [ ] **Step 4: Verify in-engine (preview)**

- `preview_start` (or reuse a running server), load the scene.
- `preview_console_logs` → expect no new errors.
- `preview_screenshot` at the default angle framing the pilot cluster.
- Confirm: BIN 3064677 (brick), 3064605 (clapboard), 3064541 (brownstone) show a raised stepped stoop projecting from the sidewalk to the entry; BIN 3398449 (modern-flat) shows NO stoop.
- `preview_resize`/rotate through angles if needed to confirm the stoop is occluded (not floating) when viewed from the rear.

Expected: three stoops present + correct, modern building clean, no z-fighting at the base.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(phase-8.0): render 3D stoops on pilot rowhouses, suppress flat door-stoop"
```

---

### Task 4: Fire-escape geometry (`fireEscapeGeometry.js`)

**Files:**
- Create: `src/fireEscapeGeometry.js`
- Test: `src/fireEscapeGeometry.test.mjs`

**Interfaces:**
- Produces: `buildFireEscapeGeometry({ frontM, heightM, storeys, centerM?, widthM?, projectionM?, railHeightM?, variant? }) -> { quads: [{role, corners:[[u,v,w]×4]}], balconies: number[] }`. Roles: `"deck"|"rail"|"baluster"|"ladder"`. `variant` ∈ `"relief"` (default, few members) | `"lattice"` (dense balusters) — the 8.0.3 gate picks. Consumed by Task 5.

- [ ] **Step 1: Write the failing test**

```js
// src/fireEscapeGeometry.test.mjs
// Run: node --test src/fireEscapeGeometry.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFireEscapeGeometry } from "./fireEscapeGeometry.js";

const base = { frontM: 8, heightM: 14, storeys: 4 };

test("one balcony per upper storey, none on the ground floor or roof", () => {
  const fe = buildFireEscapeGeometry(base);
  assert.equal(fe.balconies.length, 3); // storeys 1,2,3 floor lines
  assert.ok(fe.balconies.every((v) => v > 0 && v < base.heightM));
  assert.equal(fe.quads.filter((q) => q.role === "deck").length, 3);
});

test("decks project out from the wall by the requested depth", () => {
  const fe = buildFireEscapeGeometry({ ...base, projectionM: 0.9 });
  const deck = fe.quads.find((q) => q.role === "deck");
  const maxW = Math.max(...deck.corners.map((c) => c[2]));
  assert.ok(Math.abs(maxW - 0.9) < 1e-9);
});

test("ladders connect consecutive balconies", () => {
  const fe = buildFireEscapeGeometry(base);
  assert.equal(fe.quads.filter((q) => q.role === "ladder").length, fe.balconies.length - 1);
});

test("relief variant has no balusters; lattice variant adds them", () => {
  const relief = buildFireEscapeGeometry({ ...base, variant: "relief" });
  const lattice = buildFireEscapeGeometry({ ...base, variant: "lattice" });
  assert.equal(relief.quads.filter((q) => q.role === "baluster").length, 0);
  assert.ok(lattice.quads.filter((q) => q.role === "baluster").length > 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/fireEscapeGeometry.test.mjs`
Expected: FAIL — `Cannot find module './fireEscapeGeometry.js'`

- [ ] **Step 3: Write minimal implementation**

```js
// src/fireEscapeGeometry.js
// Pure geometry for a front fire escape. No Three.js; Node-runnable.
// Face-local meters like stoopGeometry. One balcony per upper-storey floor line
// + a ladder connecting them. Geometry-only (no texture asset) — dark iron is a
// family-palette tint applied by the renderer. `variant` lets the 8.0.3 gate
// compare a cheap relief read against a dense lattice.
export function buildFireEscapeGeometry({
  frontM,
  heightM,
  storeys,
  centerM = frontM / 2,
  widthM = 2.4,
  projectionM = 0.9,
  railHeightM = 1.0,
  variant = "relief",
}) {
  const quads = [];
  const balconies = [];
  const storeyHm = heightM / storeys;
  const uL = centerM - widthM / 2;
  const uR = centerM + widthM / 2;
  const w = projectionM;
  for (let k = 1; k < storeys; k++) {
    const v = k * storeyHm; // floor line of storey k (skip ground k=0, skip roof k=storeys)
    balconies.push(v);
    quads.push({ role: "deck", corners: [
      [uL, v, w], [uR, v, w], [uR, v, 0], [uL, v, 0],
    ]});
    quads.push({ role: "rail", corners: [ // front guard
      [uL, v, w], [uR, v, w], [uR, v + railHeightM, w], [uL, v + railHeightM, w],
    ]});
    quads.push({ role: "rail", corners: [ // left side
      [uL, v, 0], [uL, v, w], [uL, v + railHeightM, w], [uL, v + railHeightM, 0],
    ]});
    quads.push({ role: "rail", corners: [ // right side
      [uR, v, w], [uR, v, 0], [uR, v + railHeightM, 0], [uR, v + railHeightM, w],
    ]});
    if (variant === "lattice") {
      const n = Math.max(2, Math.round(widthM / 0.18));
      for (let i = 1; i < n; i++) {
        const u = uL + (widthM * i) / n;
        const t = 0.02;
        quads.push({ role: "baluster", corners: [
          [u - t, v, w], [u + t, v, w], [u + t, v + railHeightM, w], [u - t, v + railHeightM, w],
        ]});
      }
    }
  }
  const lu = uR - 0.5; // ladder hugs the right end
  for (let j = 0; j < balconies.length - 1; j++) {
    quads.push({ role: "ladder", corners: [
      [lu, balconies[j], w], [lu + 0.4, balconies[j], w],
      [lu + 0.4, balconies[j + 1], w], [lu, balconies[j + 1], w],
    ]});
  }
  return { quads, balconies };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/fireEscapeGeometry.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/fireEscapeGeometry.js src/fireEscapeGeometry.test.mjs
git commit -m "feat(phase-8.0): pure fire-escape geometry (per-storey balconies + ladder, relief/lattice)"
```

---

### Task 5: Render the fire escape + shallow-vs-lattice spike

**Files:**
- Modify: `src/SceneView.jsx` — new street-face block inside `decorateInkedWall`, after the windows loop (`if (openingsFace) { ... }` ends at SceneView.jsx:2159) and before the cornice block.

**Interfaces:**
- Consumes: `wantsFireEscape` (Task 1), `buildFireEscapeGeometry` (Task 4), `drawMeterQuads` (Task 3), in-scope `frontM`/`heightM`/`storeys`/`isKit`/`family`/`params`/`darken`/`streetFace`.

- [ ] **Step 1: Add the fire-escape render block**

After the `if (openingsFace) { ... }` windows block closes (SceneView.jsx:2159), add:

```jsx
  // Front fire escape (street face only, prewar masonry >=4 storeys). Dark iron
  // as a family-palette tint; geometry-only, no texture asset. Projects proud of
  // the wall like the cornice, so the solid mass occludes it from rear angles.
  if (streetFace && isKit && wantsFireEscape(family, storeys)) {
    const variant = params.fireEscapeVariant ?? "relief";
    const fe = buildFireEscapeGeometry({ frontM, heightM, storeys, variant });
    drawMeterQuads(fe.quads, darken(params.tint, 0.32));
  }
```

- [ ] **Step 2: Wire the one-BIN spike flag**

For the gate, the brownstone pilot (BIN 3064541) renders the lattice variant while the default stays relief, so Batu compares both in one frame. In `FACADE_OVERRIDES` (the curated per-BIN override map referenced at SceneView.jsx:1382 — `resolveFacadeFamily(..., { overrides: FACADE_OVERRIDES })`), add a `fireEscapeVariant` to 3064541. Locate the `FACADE_OVERRIDES` object and add/extend the `"3064541"` entry:

```jsx
  "3064541": { /* ...existing keys if any... */ fireEscapeVariant: "lattice" },
```

If `params` does not currently thread `FACADE_OVERRIDES[bin]` fields into `decorateInkedWall`, confirm `buildKitFacadeParams(building, family, FACADE_OVERRIDES[building.bin])` copies `fireEscapeVariant` onto the returned params (add `fireEscapeVariant: ov.fireEscapeVariant` in `src/buildKitFacadeParams.js` next to the other `ov.*` passthroughs). This is the only place params are assembled.

- [ ] **Step 3: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Verify in-engine (preview)**

- `preview_start` / reload.
- `preview_console_logs` → no new errors.
- `preview_screenshot` framing BIN 3064541 (the only fire-escape building) from a 3/4 front angle.
- Confirm: 3 balconies stacked on the upper front face with a connecting ladder, rendered as the **lattice** variant (dense verticals). Confirm 3064677/3064605 (3-storey) and 3398449 (modern) carry NO fire escape.
- Rotate to a rear angle: confirm the fire escape is occluded by the building mass (not floating through it).

Expected: one correct fire escape, three correctly bare buildings, clean rotation.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx src/buildKitFacadeParams.js
git commit -m "feat(phase-8.0): render front fire escapes + lattice/relief gate spike on 3064541"
```

---

### Task 6: 8.0.3 gate package — four-angle pilot proof

**Files:**
- Create: `docs/reference/phase-8.0-depth-gate/` (screenshot output dir; not committed code, capture artifacts)

**Interfaces:**
- Consumes: the full scene with Tasks 3 + 5 landed. No new code unless a regression is found.

- [ ] **Step 1: Confirm the full test suite is green**

Run: `npm run test`
Expected: PASS — includes the 3 new pure-module test files (gates, stoop, fire escape) plus all prior tests.

- [ ] **Step 2: Confirm the full verify chain is green**

Run: `npm run verify`
Expected: PASS (conformance/visual/components/stories/kit-coverage/overrides) — the depth modules add no out-of-token colors (tints derive from `params.tint`).

- [ ] **Step 3: Capture the four-angle gate set**

- `preview_start` / reload.
- For each of the 4 camera angles (rotate via the in-scene ↺/↻ or `Q`/`E`), `preview_screenshot` framing the pilot cluster. Save 4 images named `pilot-depth-angle-{1..4}.png`.
- Each frame must show: 3 stoops (3064677/3064605/3064541), 1 fire escape (3064541, lattice), modern building (3398449) bare.

- [ ] **Step 4: Present to Batu (the gate)**

Surface the 4 screenshots and ask the two gate questions:
1. Does the depth read as the Brooklyn look from all four angles (the recognition bar)?
2. Fire escape: keep the **lattice** variant or fall back to **relief**? (Set the chosen default in `facadeDepthGates.js`/the render block and drop the spike override.)

Do NOT proceed to spine fan-out (8.1) until Batu approves. Record the verdict + chosen fire-escape variant in `docs/DECISION_LOG.md`.

- [ ] **Step 5: Commit the gate record**

```bash
git add docs/DECISION_LOG.md
git commit -m "docs(phase-8.0): structural depth gate verdict + chosen fire-escape variant"
```

---

## Self-Review

**1. Spec coverage** (against `docs/superpowers/specs/2026-06-21-structural-depth-pass-design.md`):
- 8.0.1 Fire-escape component (parametric, family/storey-gated, street face, per-view-correct) → Tasks 1, 4, 5. ✓
- 8.0.1 shallow-relief vs full-lattice build-time spike, gate picks → Task 5 (variant flag on 3064541) + Task 6 step 4. ✓
- 8.0.2 Stoop component (real depth, door-position keyed, residential families, mutually exclusive with storefront, basement-aware base) → Tasks 1, 2, 3; `groundReliefM` is the 8.5 hook. ✓
- 8.0.3 Gate (4 pilot BINs, all four angles) → Task 6. ✓
- Out of scope held: no fan-out (KIT_PILOT_BINS untouched), no basement geometry (only the hook param), no props. ✓

**2. Placeholder scan:** No TBD/TODO. Every code step shows complete code. The one conditional ("if the linter blocks unused imports…", "if params doesn't thread overrides…") names the exact file and the exact line to add — not a vague instruction.

**3. Type consistency:** `wantsStoop`/`wantsFireEscape` signatures identical across Tasks 1/3/5. `buildStoopGeometry`/`buildFireEscapeGeometry` return `{ quads:[{role,corners}], ... }`; `drawMeterQuads` (Task 3) consumes exactly that shape and is reused in Task 5. `corners` are `[u,v,w]` meters everywhere; renderer maps `point(u/frontM, v/heightM, w*upm)` consistently. `variant` values `"relief"`/`"lattice"` match between Task 4 module, Task 5 render, and Task 6 gate.

**Note on testability:** renderer tasks (3, 5) have no unit test — Three.js mesh output is verified in-engine via `preview_screenshot`, matching this repo's convention (pure geometry is unit-tested; rendering is screenshot-verified). All geometry math lives in the pure modules, which ARE unit-tested.
