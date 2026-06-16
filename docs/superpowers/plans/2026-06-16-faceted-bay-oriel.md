# Faceted Bay Window (3-Facet Oriel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fold the Premier Organic Corp Greenpoint bay from a flat rectangular box into a true 3-facet oriel (angled return facets carry the painted side windows), opt-in and backward-compatible.

**Architecture:** A pure function `oriel3Plan(bay)` computes the trapezoidal plan in face-coords (center facet + two angled returns) with clamping. A thin builder `oriel3Meshes(frame, bay, projection, texture)` turns that plan into 3 textured facet quads + 2 flat-tinted trapezoidal caps, reusing the existing `facePoint`/`quadGeometry`/`texturedMaterial`/`tintMaterial` helpers. The bay block in `buildFacadeAssembly` branches on `bay.plan === "oriel3"`; absent/other ⇒ the current flat-box path, untouched.

**Tech Stack:** React 19 + Three.js + Vite. No test framework — verification is standalone `node scripts/verify-*.mjs` scripts (assert/failures/`process.exit(1)`), matching the repo convention (e.g. `scripts/verify-b1-intersection-ground.mjs`). THREE imports fine under node ESM.

---

## File Structure

- **Modify** `src/facadeAssembly.js` — add exported `oriel3Plan`, internal `oriel3Meshes`, and branch the `if (bay)` block (lines 253-260). All other geometry helpers reused as-is.
- **Create** `scripts/verify-oriel3-bay.mjs` — pure-math + smoke verifier.
- **Modify** `src/data/facade-specs/premier-franklin-organic.v0.1.json` — add `plan` + `centerFraction` to the `bay` block (lines ~85-91).

Coordinate convention (existing): face-local `(x,y)` normalized, projected to 3D by `facePoint(frame, x, y, offset)` where `offset` is units along `frame.normal`. Materials are `MeshBasicMaterial` with `side: THREE.DoubleSide` (no per-face culling, no lighting — winding/normals do not affect visibility).

---

### Task 1: Pure `oriel3Plan` + verifier

**Files:**
- Modify: `src/facadeAssembly.js` (add exported function near the other helpers, e.g. after `rectUv` ~line 382)
- Create: `scripts/verify-oriel3-bay.mjs`

- [ ] **Step 1: Write the failing verifier**

Create `scripts/verify-oriel3-bay.mjs`:

```js
// scripts/verify-oriel3-bay.mjs
// Verifier for the 3-facet oriel bay plan + mesh builder.
// Run: node scripts/verify-oriel3-bay.mjs
import { oriel3Plan, oriel3Meshes } from "../src/facadeAssembly.js";

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

// --- oriel3Plan: trapezoid inset math (Premier bay, centerFraction 0.36) ---
const bay = { x0: 0.322, x1: 0.479, y0: 0.266, y1: 0.895, centerFraction: 0.36 };
const plan = oriel3Plan(bay);
const width = bay.x1 - bay.x0;           // 0.157
const side = (1 - 0.36) / 2;             // 0.32
assert(near(plan.xc0, bay.x0 + side * width), `xc0 expected ${bay.x0 + side * width}, got ${plan.xc0}`);
assert(near(plan.xc1, bay.x1 - side * width), `xc1 expected ${bay.x1 - side * width}, got ${plan.xc1}`);
assert(near(plan.xc1 - plan.xc0, 0.36 * width), "center facet width must equal centerFraction * opening");

// symmetry: insets equal on both sides
assert(near(plan.xc0 - bay.x0, bay.x1 - plan.xc1), "side insets must be symmetric");

// three textured facets, seams continuous (returns meet center at xc0 / xc1)
assert(plan.facets.length === 3, `expected 3 facets, got ${plan.facets.length}`);
const [left, center, right] = plan.facets;
assert(near(left.quad[1][0], plan.xc0) && near(center.quad[0][0], plan.xc0), "left return must meet center at xc0");
assert(near(center.quad[1][0], plan.xc1) && near(right.quad[0][0], plan.xc1), "right return must meet center at xc1");
// returns start at the wall plane (depth 0), front edges at depth 1
assert(left.quad[0][1] === 0 && left.quad[1][1] === 1, "left return: wall edge depth 0, front edge depth 1");
assert(center.quad[0][1] === 1 && center.quad[1][1] === 1, "center facet: both edges at front (depth 1)");
assert(right.quad[0][1] === 1 && right.quad[1][1] === 0, "right return: front edge depth 1, wall edge depth 0");

// --- clamping: centerFraction outside [0.1, 0.9] must not invert the trapezoid ---
const tooBig = oriel3Plan({ x0: 0, x1: 1, centerFraction: 1.5 });
assert(tooBig.xc1 > tooBig.xc0, "centerFraction>1 must clamp, not invert");
const tooSmall = oriel3Plan({ x0: 0, x1: 1, centerFraction: -1 });
assert(tooSmall.xc0 < tooSmall.xc1 && tooSmall.xc0 > 0, "centerFraction<0 must clamp to a positive inset");

// default centerFraction when unset
const dflt = oriel3Plan({ x0: 0, x1: 1 });
assert(near(dflt.xc1 - dflt.xc0, 0.36), "default centerFraction must be 0.36");

// --- oriel3Meshes: smoke test with a minimal fake frame, no texture ---
const frame = { left: { x: 0, z: 0 }, right: { x: 10, z: 0 }, normal: { x: 0, z: 1 }, height: 20, u0: 0.478, u1: 1 };
const meshes = oriel3Meshes(frame, bay, 0.6, null);
assert(meshes.length === 5, `expected 5 meshes (3 facets + 2 caps), got ${meshes.length}`);
assert(meshes.every((m) => m.isMesh), "every returned object must be a THREE.Mesh");
assert(meshes.every((m) => m.geometry.getAttribute("position").count === 4), "every facet/cap quad has 4 vertices");

if (failures.length) {
  console.error("FAIL oriel3 bay verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS oriel3 bay verifier: plan math, seams, clamping, mesh count.");
```

- [ ] **Step 2: Run the verifier to confirm it fails**

Run: `node scripts/verify-oriel3-bay.mjs`
Expected: FAIL — import error / `oriel3Plan is not a function` (not yet exported).

- [ ] **Step 3: Implement `oriel3Plan`**

In `src/facadeAssembly.js`, add after `rectUv` (~line 382):

```js
// 3-facet oriel bay plan in face-coords. A trapezoid: wide at the wall
// (x0..x1 @ depth 0), narrowing to a center front facet (xc0..xc1 @ depth 1)
// flanked by two angled return facets. `centerFraction` is the center facet's
// share of the opening; clamped to keep the trapezoid from inverting. Each
// facet's `quad` is its two vertical edges as [x, depthMul] (0 = wall, 1 = front).
export function oriel3Plan(bay) {
  const cf = Math.min(0.9, Math.max(0.1, bay.centerFraction ?? 0.36));
  const side = (1 - cf) / 2;
  const span = bay.x1 - bay.x0;
  const xc0 = bay.x0 + side * span;
  const xc1 = bay.x1 - side * span;
  return {
    xc0,
    xc1,
    facets: [
      { id: "left", quad: [[bay.x0, 0], [xc0, 1]] },
      { id: "center", quad: [[xc0, 1], [xc1, 1]] },
      { id: "right", quad: [[xc1, 1], [bay.x1, 0]] },
    ],
  };
}
```

- [ ] **Step 4: Implement `oriel3Meshes`**

In `src/facadeAssembly.js`, add directly below `oriel3Plan`:

```js
// Build the 3-facet oriel: 3 textured facet quads (returns + center, each
// sampling its own slice of the bay's texture strip so the painted side
// windows fold onto the angled returns) + 2 flat-tinted trapezoidal caps
// (top in cornice shadow, bottom soffit). `projection` is units along normal.
function oriel3Meshes(frame, bay, projection, texture) {
  const plan = oriel3Plan(bay);
  const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
  const depth = (mul) => mul * projection;
  const meshes = [];

  for (const facet of plan.facets) {
    const [a, b] = facet.quad; // [x, depthMul]
    const uv = texture
      ? [u(a[0]), bay.y0, u(b[0]), bay.y0, u(b[0]), bay.y1, u(a[0]), bay.y1]
      : undefined;
    const geometry = quadGeometry(
      facePoint(frame, a[0], bay.y0, depth(a[1])),
      facePoint(frame, b[0], bay.y0, depth(b[1])),
      facePoint(frame, b[0], bay.y1, depth(b[1])),
      facePoint(frame, a[0], bay.y1, depth(a[1])),
      uv,
    );
    meshes.push(new THREE.Mesh(geometry, texturedMaterial(texture, 1)));
  }

  // Trapezoidal caps close the plan at top (y1) and bottom (y0): wall corners
  // at depth 0, front corners at full projection. Flat-tinted, no texture.
  const cap = (y) => quadGeometry(
    facePoint(frame, bay.x0, y, 0),
    facePoint(frame, plan.xc0, y, projection),
    facePoint(frame, plan.xc1, y, projection),
    facePoint(frame, bay.x1, y, 0),
  );
  meshes.push(new THREE.Mesh(cap(bay.y1), tintMaterial(0x352c22)));     // top: under-cornice shadow
  meshes.push(new THREE.Mesh(cap(bay.y0), tintMaterial(REVEAL.soffit))); // bottom: soffit

  return meshes;
}
```

Also export `oriel3Meshes` for the verifier — change its declaration to:

```js
export function oriel3Meshes(frame, bay, projection, texture) {
```

- [ ] **Step 5: Run the verifier to confirm it passes**

Run: `node scripts/verify-oriel3-bay.mjs`
Expected: `PASS oriel3 bay verifier: plan math, seams, clamping, mesh count.`

- [ ] **Step 6: Commit**

```bash
git add src/facadeAssembly.js scripts/verify-oriel3-bay.mjs
git commit -m "feat(facade): 3-facet oriel bay plan + mesh builder

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Branch the bay block on `plan === "oriel3"`

**Files:**
- Modify: `src/facadeAssembly.js:253-260`

- [ ] **Step 1: Replace the bay block**

Replace lines 253-260 (the `if (bay) { ... }` block) with:

```js
  if (bay) {
    const projection = meters(bay.projectionM ?? 0.5);
    if (bay.plan === "oriel3") {
      // Faceted oriel: angled returns carry the painted side windows.
      for (const mesh of oriel3Meshes(frame, bay, projection, texture)) group.add(mesh);
    } else {
      // Flat box: textured front, dark wood cheeks, dark roof under the cornice.
      group.add(rectMesh(frame, bay, projection, texturedMaterial(texture, 1)));
      group.add(bridgeMesh(frame, bay, projection, 0, "top", tintMaterial(0x352c22)));
      group.add(bridgeMesh(frame, bay, projection, 0, "bottom", tintMaterial(REVEAL.soffit)));
      group.add(bridgeMesh(frame, bay, projection, 0, "left", tintMaterial(0x4a3a2c)));
      group.add(bridgeMesh(frame, bay, projection, 0, "right", tintMaterial(0x4a3a2c)));
    }
  }
```

- [ ] **Step 2: Re-run the verifier (still green) and build**

Run: `node scripts/verify-oriel3-bay.mjs && npm run build`
Expected: verifier PASS; build completes (the 46MB bay-window GLB large-chunk warning is expected and unrelated).

- [ ] **Step 3: Commit**

```bash
git add src/facadeAssembly.js
git commit -m "feat(facade): branch bay assembly to oriel3 when spec opts in

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Opt Premier's Greenpoint bay into `oriel3`

**Files:**
- Modify: `src/data/facade-specs/premier-franklin-organic.v0.1.json` (bay block, ~lines 85-91)

- [ ] **Step 1: Read the current bay block**

Run: `node -e "const s=require('./src/data/facade-specs/premier-franklin-organic.v0.1.json'); console.log(JSON.stringify(s.bay,null,2))"`
Expected: `{ "x0": 0.322, "x1": 0.479, "y0": 0.266, "y1": 0.895, "projectionM": 0.6 }` (confirm exact keys/values before editing).

- [ ] **Step 2: Add `plan` and `centerFraction`**

Edit the `bay` object so it reads:

```json
"bay": {
  "x0": 0.322,
  "x1": 0.479,
  "y0": 0.266,
  "y1": 0.895,
  "projectionM": 0.6,
  "plan": "oriel3",
  "centerFraction": 0.36
}
```

(Match the file's existing indentation. Keep any other keys that were already present in the block.)

- [ ] **Step 3: Validate JSON + verifier still green**

Run: `node -e "require('./src/data/facade-specs/premier-franklin-organic.v0.1.json'); console.log('json ok')" && node scripts/verify-oriel3-bay.mjs`
Expected: `json ok` then verifier PASS.

- [ ] **Step 4: Commit**

```bash
git add src/data/facade-specs/premier-franklin-organic.v0.1.json
git commit -m "feat(premier): opt Greenpoint bay into 3-facet oriel plan

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: In-engine visual verification

**Files:** none (verification only — uses the dev server + preview tools).

- [ ] **Step 1: Start the dev server / preview**

Use `preview_start` (dev server at `http://127.0.0.1:5173`). If already running, `preview_eval: window.location.reload()`.

- [ ] **Step 2: Check console for errors**

Use `preview_console_logs` and `preview_logs`. Expected: no Three.js geometry/NaN errors, no exceptions from `buildFacadeAssembly`.

- [ ] **Step 3: Frame the Premier Greenpoint bay and snapshot all four iso angles**

Navigate Scene mode to the Premier Organic Corp building, Greenpoint face. For each of the 4 isometric camera angles, capture `preview_screenshot`. Confirm visually:
  - the bay reads as an angled oriel with two visible side return facets (not a flat billboard);
  - the painted **side** windows land on the angled returns; the **center** window stays on the flat front facet;
  - the top/bottom caps appear as dark trapezoidal lids in cornice/soffit shadow;
  - no z-fighting flicker at the wall seam; no gap at cornice or sidewalk.

- [ ] **Step 4: Regression — confirm a non-oriel bay is unchanged**

Identify another building whose spec has a `bay` without `plan` (grep `src/data/facade-specs/` for `"bay"`). Snapshot it; confirm it renders exactly as before (flat box). If no other bay exists, note that in the build log and rely on the code branch being a pure addition.

- [ ] **Step 5: If issues found**

- Side windows misregistered on returns → re-check the UV slice in `oriel3Meshes` (each facet samples `u(a.x)..u(b.x)`); confirm Premier `skewX` (if any) is applied via `lean` before `oriel3Plan` (it is — `bay = lean(spec.bay)`).
- Front facet too narrow/wide → tune `centerFraction` in the spec (data-only, no code change); re-snapshot.
- z-fighting at wall seam → inset the return wall edge by a hair of projection in `oriel3Meshes` (e.g. start returns at `depth(0.02)` instead of `0`) per the spec's failure-mode note.

- [ ] **Step 6: Capture a final Scene snapshot for the record and append a HERO_FACADE_LOG note**

Save one representative `preview_screenshot`. Append a short lesson to `docs/HERO_FACADE_LOG.md` (oriel fold: texture-partition approach, chosen `centerFraction`, any seam fix). Commit:

```bash
git add docs/HERO_FACADE_LOG.md
git commit -m "docs(facade): log Premier oriel bay fold result

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Spec change (plan + centerFraction, backward-compat) → Task 3 + the branch in Task 2. ✓
- Decision 1 (fold texture) → Task 1 `oriel3Meshes` per-facet UV slice. ✓
- Decision 2 (reference proportions, emergent angle) → `centerFraction` default 0.36, `projectionM` from spec. ✓
- Decision 3 (reusable opt-in) → `bay.plan === "oriel3"` branch, default path untouched. ✓
- Decision 4 (flat-tinted dark caps) → `cap()` uses `tintMaterial(0x352c22)` / `tintMaterial(REVEAL.soffit)`. ✓
- Geometry table (5 quads, removed perpendicular cheeks) → Task 1 facets + caps; cheeks only in the `else` branch. ✓
- Edge cases: centerFraction clamp → Task 1 clamp + test; texture absent → `texturedMaterial(texture,1)` + uv guard, tested with `null`; z-fighting → Task 4 Step 5 fix; other bays unchanged → Task 4 Step 4. ✓
- Verification (build, 4 angles, regression, snapshot) → Task 4. ✓

**Placeholder scan:** none — every code/command step is concrete.

**Type consistency:** `oriel3Plan(bay)` returns `{ xc0, xc1, facets: [{ id, quad: [[x,depthMul],...] }] }`; consumed identically in the verifier and `oriel3Meshes`. `oriel3Meshes(frame, bay, projection, texture)` signature matches the call site in Task 2 and the verifier in Task 1. `facePoint`, `quadGeometry`, `texturedMaterial`, `tintMaterial`, `REVEAL.soffit` all exist in `facadeAssembly.js`. ✓
