# b2 — Corner Signals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place restrained, typological NYC traffic + pedestrian signals at the four curb-return corners the b1 ground system produces, so the Franklin × Greenpoint intersection reads as a real signalized corner.

**Architecture:** A new pure-geometry module `src/streetFurniture.js` (no Three.js, Node-runnable, mirroring `groundLayer.js`) computes the four corner positions from the two streets' half-widths and axes and returns signal placements (each with a mast-arm direction reaching over the roadway). A thin `buildFurniture` renderer in `src/SceneView.jsx` draws each as restrained II-C massing: a dark ink pole, a mast arm, a three-light signal head, and a small pedestrian-signal box. Signals are flagged `typological: true` (placement is NYC-standard, not evidence-exact — the infill truth rule; exact placement is deferred to the pre-publish truth pass).

**Tech Stack:** React 19 + Three.js + Vite. Tests: `node:test` + `node:assert/strict` via `node --test`. Durable verifier: standalone `scripts/*.mjs`.

---

## Context the implementer needs

`src/groundLayer.js` exports `buildGroundLayer(...)` returning `{ streets, roadbeds, curbs, sidewalks, crosswalks }`. Each **street** is:
```
{ id: "greenpoint-ave" | "franklin-st", axis: {x,z}, perp: {x,z}, center: {x,z}, halfLen, halfWidth, derived }
```
`axis`/`perp` are perpendicular unit vectors; origin `(0,0)` is the intersection; ~0.075 scene units/m. Greenpoint half-width ≈ 0.572 units (50 ft), Franklin ≈ 0.457 units (40 ft). A point P decomposes as `g = P·greenpointAxis`, `f = P·franklinAxis`. The Greenpoint curbs sit at `f = ±gpHalf`; the Franklin curbs at `g = ±frHalf`. The four corners are where those meet: `(g, f) = (±frHalf, ±gpHalf)`, pushed outward onto the corner sidewalk by a small inset. The sidewalk band is `SIDEWALK_WIDTH_M` (4 m ≈ 0.3 units) wide outside each curb, so an inset of ~0.12 units keeps the pole on the corner sidewalk, clear of both roadway and building frontage.

`assembleFranklinScene` returns `greenpointAxis`/`franklinAxis`; `buildGroundLayer` is already called in `SceneView.jsx` producing `groundData`. b2 consumes `groundData.streets`.

Scale reference: a hero building is ~0.9 units tall (≈12 m). A ~5 m signal pole ≈ 0.38 units; keep heads small (~0.05 units) and the palette dark/muted per II-C restraint.

---

## File Structure

- **Create** `src/streetFurniture.js` — pure geometry: `buildStreetFurniture({ streets, greenpointAxis, franklinAxis }) → { signals }`. One responsibility: corner placement. No Three.js.
- **Create** `src/streetFurniture.test.mjs` — `node:test` unit tests (four corners, on sidewalk, typological flag, mast-arm direction).
- **Create** `scripts/verify-b2-corner-signals.mjs` — durable live verifier.
- **Modify** `src/SceneView.jsx` — add signal palette entries; add `buildFurniture` renderer; call it after `buildGround`.

---

## Task 1: `streetFurniture.js` — corner signal placement

**Files:**
- Create: `src/streetFurniture.js`
- Test: `src/streetFurniture.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// src/streetFurniture.test.mjs
// Run: node --test src/streetFurniture.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createProjection } from "./sceneFrame.js";
import { buildGroundLayer } from "./groundLayer.js";
import { buildStreetFurniture, SIGNAL_CORNER_INSET } from "./streetFurniture.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const geometrySource = read("src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json");
const fixture = read("src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json");
const basis = fixture.sceneTruthModel.projectionBasis;
const projection = createProjection(basis);
const axisOf = (a) => {
  const w = projection.project(a.westPointWgs84);
  const e = projection.project(a.eastPointWgs84);
  const v = { x: e.x - w.x, z: e.z - w.z };
  const len = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / len, z: v.z / len };
};
const greenpointAxis = axisOf(basis.greenpointAxisWgs84);
const franklinAxis = { x: -greenpointAxis.z, z: greenpointAxis.x };
const ground = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource });
const furniture = buildStreetFurniture({ streets: ground.streets, greenpointAxis, franklinAxis });

const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
const fr = ground.streets.find((s) => s.id === "franklin-st");

test("places exactly four corner signals, all typological", () => {
  assert.equal(furniture.signals.length, 4);
  for (const sig of furniture.signals) assert.equal(sig.typological, true);
});

test("each signal sits at a distinct corner, outside both roadbeds, on the sidewalk", () => {
  const seen = new Set();
  for (const sig of furniture.signals) {
    const g = sig.position.x * greenpointAxis.x + sig.position.z * greenpointAxis.z;
    const f = sig.position.x * franklinAxis.x + sig.position.z * franklinAxis.z;
    // outside the Franklin roadbed (|g| > frHalf) and the Greenpoint roadbed (|f| > gpHalf)
    assert.ok(Math.abs(g) > fr.halfWidth, "clear of Franklin roadbed");
    assert.ok(Math.abs(f) > gp.halfWidth, "clear of Greenpoint roadbed");
    // on the corner sidewalk (within the band, not past the frontage)
    assert.ok(Math.abs(g) < fr.halfWidth + 0.3 + 1e-9, "within Franklin sidewalk band");
    assert.ok(Math.abs(f) < gp.halfWidth + 0.3 + 1e-9, "within Greenpoint sidewalk band");
    seen.add(`${Math.sign(g)},${Math.sign(f)}`);
  }
  assert.equal(seen.size, 4, "four distinct corners");
});

test("mast arm reaches inward over the roadway (unit vector toward the intersection)", () => {
  for (const sig of furniture.signals) {
    const len = Math.hypot(sig.mastArmDir.x, sig.mastArmDir.z);
    assert.ok(Math.abs(len - 1) < 1e-6, "unit length");
    // points back toward origin: dot(position, mastArmDir) < 0
    const dot = sig.position.x * sig.mastArmDir.x + sig.position.z * sig.mastArmDir.z;
    assert.ok(dot < 0, "arm points inward");
  }
});

test("SIGNAL_CORNER_INSET is a small positive sidewalk inset", () => {
  assert.ok(SIGNAL_CORNER_INSET > 0 && SIGNAL_CORNER_INSET < 0.3);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test src/streetFurniture.test.mjs`
Expected: FAIL — `Cannot find module './streetFurniture.js'`.

- [ ] **Step 3: Write the implementation**

```js
// src/streetFurniture.js
// Pure geometry for corner street furniture — typological NYC signals at the
// four curb-return corners of the intersection. No Three.js; Node-runnable,
// same discipline as groundLayer.js. Placement is NYC-standard (typological),
// not evidence-exact; exact positions are deferred to the pre-publish truth
// pass. Origin (0,0) is the intersection.

export const SIGNAL_CORNER_INSET = 0.12; // units onto the corner sidewalk from the curb meet

// streets: groundLayer's two streets (greenpoint-ave, franklin-st), each with
// { axis, perp, halfWidth }. Corners are where the Franklin curb (g = ±frHalf)
// meets the Greenpoint curb (f = ±gpHalf), nudged onto the sidewalk by the inset.
export function buildStreetFurniture({ streets, greenpointAxis, franklinAxis }) {
  const gp = streets.find((s) => s.id === "greenpoint-ave");
  const fr = streets.find((s) => s.id === "franklin-st");
  if (!gp || !fr) return { signals: [] };

  const signals = [];
  for (const signG of [1, -1]) {
    for (const signF of [1, -1]) {
      const g = signG * (fr.halfWidth + SIGNAL_CORNER_INSET);
      const f = signF * (gp.halfWidth + SIGNAL_CORNER_INSET);
      const position = {
        x: greenpointAxis.x * g + franklinAxis.x * f,
        z: greenpointAxis.z * g + franklinAxis.z * f,
      };
      // Mast arm reaches inward over the roadway — unit vector toward the origin.
      const len = Math.hypot(position.x, position.z) || 1;
      const mastArmDir = { x: -position.x / len, z: -position.z / len };
      signals.push({
        id: `signal-${signG > 0 ? "gp+" : "gp-"}-${signF > 0 ? "fr+" : "fr-"}`,
        corner: { signG, signF },
        position,
        mastArmDir,
        typological: true,
      });
    }
  }
  return { signals };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test src/streetFurniture.test.mjs`
Expected: PASS — all 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/streetFurniture.js src/streetFurniture.test.mjs
git commit -m "feat(b2): corner signal placement from curb returns"
```

---

## Task 2: `buildFurniture` renderer in `SceneView.jsx`

**Files:**
- Modify: `src/SceneView.jsx` (palette ~II_PALETTE; import; effect body after `buildGround`; new renderer near `buildGround`)

- [ ] **Step 1: Add palette entries**

In `src/SceneView.jsx`, extend `II_PALETTE` after the `scoreLine` line:

```js
  signalPole: 0x2a241c,
  signalHead: 0x1d201e,
  signalRed: 0xb24a3a,
  signalAmber: 0xcc9a3b,
  signalGreen: 0x4f7d52,
  pedSignal: 0x26211a,
```

- [ ] **Step 2: Add the module import**

After `import { buildGroundLayer } from "./groundLayer.js";` add:

```js
import { buildStreetFurniture } from "./streetFurniture.js";
```

- [ ] **Step 3: Call the renderer after `buildGround`**

Find:

```js
    buildGround(three, groundData);
```

Add immediately after it:

```js
    const furniture = buildStreetFurniture({
      streets: groundData.streets,
      greenpointAxis: scene.greenpointAxis,
      franklinAxis: scene.franklinAxis,
    });
    buildFurniture(three, furniture);
```

- [ ] **Step 4: Add the `buildFurniture` renderer**

Immediately after the `buildGround` function (after its closing brace), add:

```js
// Restrained typological corner signals: a dark ink pole, a mast arm reaching
// over the roadway, a three-light head, and a small pedestrian-signal box. Sizes
// are in scene units (~0.075/m); a hero building is ~0.9 tall for reference.
const SIGNAL = { poleH: 0.4, poleR: 0.012, armLen: 0.34, armR: 0.009, head: 0.05, lamp: 0.013 };

function buildFurniture(three, furniture) {
  for (const sig of furniture.signals) {
    buildSignal(three, sig);
  }
}

function buildSignal(three, sig) {
  const { position, mastArmDir } = sig;
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(SIGNAL.poleR, SIGNAL.poleR, SIGNAL.poleH, 8),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.signalPole }),
  );
  pole.position.set(position.x, SIGNAL.poleH / 2, position.z);
  group.add(pole);

  // Mast arm: a horizontal bar from the pole top reaching inward over the road.
  const armMid = {
    x: position.x + mastArmDir.x * (SIGNAL.armLen / 2),
    z: position.z + mastArmDir.z * (SIGNAL.armLen / 2),
  };
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(SIGNAL.armLen, SIGNAL.armR * 2, SIGNAL.armR * 2),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.signalPole }),
  );
  arm.position.set(armMid.x, SIGNAL.poleH - SIGNAL.armR, armMid.z);
  arm.rotation.y = -Math.atan2(mastArmDir.z, mastArmDir.x);
  group.add(arm);

  // Signal head at the arm end.
  const headPos = {
    x: position.x + mastArmDir.x * SIGNAL.armLen,
    z: position.z + mastArmDir.z * SIGNAL.armLen,
  };
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(SIGNAL.head * 0.7, SIGNAL.head * 1.8, SIGNAL.head * 0.7),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.signalHead }),
  );
  const headY = SIGNAL.poleH - SIGNAL.armR - SIGNAL.head * 0.9;
  head.position.set(headPos.x, headY, headPos.z);
  group.add(head);

  // Three lamps (R/A/G), facing back toward the corner (−mastArmDir).
  const faceX = -mastArmDir.x * SIGNAL.head * 0.4;
  const faceZ = -mastArmDir.z * SIGNAL.head * 0.4;
  const lampColors = [II_PALETTE.signalRed, II_PALETTE.signalAmber, II_PALETTE.signalGreen];
  lampColors.forEach((color, i) => {
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(SIGNAL.lamp, 8, 8),
      new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.35 }),
    );
    lamp.position.set(headPos.x + faceX, headY + SIGNAL.head * (0.55 - i * 0.55), headPos.z + faceZ);
    group.add(lamp);
  });

  // Small pedestrian-signal box partway up the pole, facing inward.
  const ped = new THREE.Mesh(
    new THREE.BoxGeometry(SIGNAL.head * 0.6, SIGNAL.head * 0.7, SIGNAL.head * 0.35),
    new THREE.MeshLambertMaterial({ color: II_PALETTE.pedSignal }),
  );
  ped.position.set(
    position.x + mastArmDir.x * 0.02,
    SIGNAL.poleH * 0.62,
    position.z + mastArmDir.z * 0.02,
  );
  ped.rotation.y = -Math.atan2(mastArmDir.z, mastArmDir.x);
  group.add(ped);

  three.add(group);
}
```

- [ ] **Step 5: Visual verification (build only; controller does the screenshot)**

Run: `npm run build` — expect success (the ~46 MB GLB large-chunk warning is fine). If there is a real build error, fix it; if you cannot, report BLOCKED.

Self-review: `grep -n "buildFurniture\|buildStreetFurniture" src/SceneView.jsx` — expect the import, the call after `buildGround`, and the function definition. Confirm every `II_PALETTE.signal*`/`pedSignal` key used exists in the palette.

- [ ] **Step 6: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(b2): render restrained typological corner signals"
```

---

## Task 3: Durable live verifier

**Files:**
- Create: `scripts/verify-b2-corner-signals.mjs`

- [ ] **Step 1: Write the verifier**

```js
// scripts/verify-b2-corner-signals.mjs
// Live verifier for the b2 corner signals.
// Run: node scripts/verify-b2-corner-signals.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";
import { buildGroundLayer } from "../src/groundLayer.js";
import { buildStreetFurniture } from "../src/streetFurniture.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const geometrySource = read("src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json");
const fixture = read("src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json");
const basis = fixture.sceneTruthModel.projectionBasis;
const projection = createProjection(basis);
const axisOf = (a) => {
  const w = projection.project(a.westPointWgs84);
  const e = projection.project(a.eastPointWgs84);
  const v = { x: e.x - w.x, z: e.z - w.z };
  const len = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / len, z: v.z / len };
};
const greenpointAxis = axisOf(basis.greenpointAxisWgs84);
const franklinAxis = { x: -greenpointAxis.z, z: greenpointAxis.x };
const ground = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource });
const furniture = buildStreetFurniture({ streets: ground.streets, greenpointAxis, franklinAxis });

const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
const fr = ground.streets.find((s) => s.id === "franklin-st");
const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

assert(furniture.signals.length === 4, "Expected 4 corner signals.");
assert(furniture.signals.every((s) => s.typological === true), "All signals must be typological.");

const corners = new Set();
for (const sig of furniture.signals) {
  const g = sig.position.x * greenpointAxis.x + sig.position.z * greenpointAxis.z;
  const f = sig.position.x * franklinAxis.x + sig.position.z * franklinAxis.z;
  assert(Math.abs(g) > fr.halfWidth, "Signal must clear the Franklin roadbed.");
  assert(Math.abs(f) > gp.halfWidth, "Signal must clear the Greenpoint roadbed.");
  assert(Math.abs(g) < fr.halfWidth + 0.3, "Signal must stay within the Franklin sidewalk band.");
  assert(Math.abs(f) < gp.halfWidth + 0.3, "Signal must stay within the Greenpoint sidewalk band.");
  const dot = sig.position.x * sig.mastArmDir.x + sig.position.z * sig.mastArmDir.z;
  assert(dot < 0, "Mast arm must reach inward over the roadway.");
  corners.add(`${Math.sign(g)},${Math.sign(f)}`);
}
assert(corners.size === 4, "Signals must occupy four distinct corners.");

if (failures.length) {
  console.error("FAIL b2 corner-signals verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS b2 corner-signals verifier: four typological signals, on-sidewalk, arms inward.");
```

- [ ] **Step 2: Run it**

Run: `node scripts/verify-b2-corner-signals.mjs`
Expected: `PASS b2 corner-signals verifier: ...` and exit 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-b2-corner-signals.mjs
git commit -m "test(b2): durable corner-signals verifier"
```

---

## Self-Review Notes

- **Scope:** signals only. Hydrants, signs, trash baskets, and tree pits are explicitly deferred (DECISION_LOG 2026-06-15). Don't add them.
- **Typological, not exact:** every signal carries `typological: true`. Exact pole positions and which approaches are signalized are an evidence/Open-Data question deferred to the pre-publish truth pass — do not invent that exactness here.
- **Taste:** the signal massing is a deliberately restrained first pass for Batu's reaction (dark ink pole/head, muted lamp tones, small). Expect a look iteration after the screenshot — that's the working loop, not a defect.
- **Placement depends on b1:** corners derive from `groundLayer`'s street half-widths, so b2 stays consistent with the rendered curbs automatically.
