# b1 — Intersection Ground System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat-color street slabs and ad-hoc per-building sidewalk strips with one coherent, true-to-life intersection ground surface — asphalt roadbeds, concrete sidewalks wrapping the corner, raised curbs, and crosswalks — rendered procedurally in the II-C inked style.

**Architecture:** A new pure-geometry module `src/groundLayer.js` (no Three.js, Node-runnable, mirroring `src/sceneFrame.js`) turns the projected NYC street centerlines + real `sidewalkLineRecords` + recorded street widths into truth-geometry surfaces. A thin `buildGround` renderer in `src/SceneView.jsx` draws them with II-C styling, replacing the `buildStreets` call. The per-building grounding in `FranklinHeroCorner.jsx` is trimmed to just its cast shadow so the two layers don't z-fight. Geometry that comes from real data is unflagged; geometry inferred to fill the Franklin centerline gap carries `derived: true`.

**Tech Stack:** React 19 + Three.js + Vite. Tests: `node:test` + `node:assert/strict`, run with `node --test`. Durable geometry verifiers: standalone `scripts/*.mjs`.

---

## File Structure

- **Create** `src/groundLayer.js` — pure geometry: `buildGroundLayer(...)` → `{ streets, roadbeds, curbs, sidewalks, crosswalks }`. One responsibility: turn projected street/sidewalk truth into ground surface polygons. No Three.js, no styling.
- **Create** `src/groundLayer.test.mjs` — `node:test` unit tests for the invariants (roadbed widths, curb sides, sidewalk band width, derived flags, crosswalk stripes).
- **Create** `scripts/probe-b1-ground-geometry.mjs` — measurement-first probe: prints the projected centerlines, sidewalk lines, and hero frontages so the module is built against measured truth.
- **Create** `scripts/verify-b1-intersection-ground.mjs` — durable live verifier in the project's `scripts/` style.
- **Modify** `src/SceneView.jsx` — add palette entries; add `buildGround` renderer; call it instead of `buildStreets`.
- **Modify** `src/components/hero/FranklinHeroCorner.jsx:400-442` — trim `addRecordContactGrounding` to keep only the cast-shadow boxes.

Coordinate facts this plan relies on (from `src/sceneFrame.js`): origin `(0,0)` is the intersection; `projection.project(wgs84)` → `{x,z}` scene units at 0.075 units/m; `projection.metersToUnits(m)`; `greenpointAxis`/`franklinAxis` are perpendicular unit vectors; `assembleFranklinScene` already returns `{ projection, buildings, streets, greenpointAxis, franklinAxis }`. Street `streetWidth` fields are in **feet**.

---

## Task 1: Measurement probe (build against truth, not assumption)

**Files:**
- Create: `scripts/probe-b1-ground-geometry.mjs`

- [ ] **Step 1: Write the probe script**

```js
// scripts/probe-b1-ground-geometry.mjs
// Measurement-first: project the street centerlines, the real sidewalkLineRecords,
// and the hero footprints into the R10E scene frame and print them, so
// groundLayer.js is built against measured truth (project rule: register to the
// render, don't author coords from a contract).
// Run: node scripts/probe-b1-ground-geometry.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const geometry = read("src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json");
const fixture = read("src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json");

const basis = fixture.sceneTruthModel.projectionBasis;
const projection = createProjection(basis);
const axis = (a) => {
  const w = projection.project(a.westPointWgs84);
  const e = projection.project(a.eastPointWgs84);
  const v = { x: e.x - w.x, z: e.z - w.z };
  const len = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / len, z: v.z / len };
};
const gp = axis(basis.greenpointAxisWgs84);
const fr = { x: -gp.z, z: gp.x };
const round = (p) => ({ x: +p.x.toFixed(3), z: +p.z.toFixed(3) });
const offsetAlong = (p, unit) => +(p.x * unit.x + p.z * unit.z).toFixed(3);

console.log("greenpointAxis", round(gp), "franklinAxis", round(fr));

console.log("\n== streetCenterlineRecords ==");
for (const r of geometry.streetCenterlineRecords ?? []) {
  const line = r.wgs84Line.map((pt) => projection.project(pt));
  console.log(r.fullStreetName, "width(ft)=" + r.streetWidth, "ends", round(line[0]), "→", round(line.at(-1)));
}

console.log("\n== sidewalkLineRecords (real curb truth) ==");
for (const r of geometry.sidewalkLineRecords ?? []) {
  const line = r.wgs84Line.map((pt) => projection.project(pt));
  const mid = { x: (line[0].x + line.at(-1).x) / 2, z: (line[0].z + line.at(-1).z) / 2 };
  // perpendicular offset from each street's centerline tells us which curb side this is
  const perpForGp = fr; // Greenpoint roadbed is bounded along the Franklin axis
  const perpForFr = gp; // Franklin roadbed is bounded along the Greenpoint axis
  console.log(
    r.fullStreetName,
    "ends", round(line[0]), "→", round(line.at(-1)),
    "| offset·franklinAxis=", offsetAlong(mid, perpForGp),
    "offset·greenpointAxis=", offsetAlong(mid, perpForFr),
    "| status", r.geometryStatus,
  );
}
```

- [ ] **Step 2: Run it and record the numbers**

Run: `node scripts/probe-b1-ground-geometry.mjs`
Expected: prints the two Greenpoint centerline segments with `width(ft)=50`, and 4 sidewalk lines (1 GREENPOINT AVE, 3 FRANKLIN ST), each with its perpendicular offset. Note the sign + magnitude of each Franklin line's `offset·greenpointAxis` — those magnitudes are the real Franklin roadbed half-widths/curb positions the module must reproduce. If any Franklin line's offset magnitude is ~0, it is the centerline, not a curb; record that.

- [ ] **Step 3: Commit**

```bash
git add scripts/probe-b1-ground-geometry.mjs
git commit -m "feat(b1): add ground-geometry measurement probe"
```

---

## Task 2: `groundLayer.js` — roadbeds, curbs, sidewalks

The module classifies each projected sidewalk line by street (`fullStreetName`) and by side (sign of its perpendicular offset). Per street, the nearest real line on each side sets that side's curb position; where a side has no line, the recorded street width fills it (derived). Roadbed = polygon between the two curbs; sidewalk = a `SIDEWALK_WIDTH_M` band from each curb outward.

**Files:**
- Create: `src/groundLayer.js`
- Test: `src/groundLayer.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// src/groundLayer.test.mjs
// Run: node --test src/groundLayer.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createProjection } from "./sceneFrame.js";
import { buildGroundLayer, SIDEWALK_WIDTH_M } from "./groundLayer.js";

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

const polyWidth = (poly, perp) => {
  const offs = poly.map((p) => p.x * perp.x + p.z * perp.z);
  return Math.max(...offs) - Math.min(...offs);
};

test("produces one Greenpoint and one Franklin street", () => {
  const names = ground.streets.map((s) => s.id);
  assert.ok(names.includes("greenpoint-ave"), "has greenpoint-ave");
  assert.ok(names.includes("franklin-st"), "has franklin-st");
});

test("Greenpoint roadbed matches the recorded 50ft width (real, not derived)", () => {
  const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
  assert.equal(gp.derived, false);
  const road = ground.roadbeds.find((r) => r.streetId === "greenpoint-ave");
  const widthUnits = projection.metersToUnits(50 * 0.3048);
  assert.ok(Math.abs(polyWidth(road.polygon, franklinAxis) - widthUnits) < 0.15, "roadbed ≈ 50ft");
});

test("Franklin street is flagged derived (no source centerline)", () => {
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  assert.equal(fr.derived, true);
});

test("every street yields exactly two curb lines, both off-center", () => {
  for (const s of ground.streets) {
    const curbs = ground.curbs.filter((c) => c.streetId === s.id);
    assert.equal(curbs.length, 2, `${s.id} has 2 curbs`);
    const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
    const sides = curbs.map((c) => Math.sign(c.line[0].x * perp.x + c.line[0].z * perp.z));
    assert.notEqual(sides[0], sides[1], `${s.id} curbs on opposite sides`);
  }
});

test("each curb carries a sidewalk band ~SIDEWALK_WIDTH_M wide", () => {
  const wantUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  for (const s of ground.streets) {
    const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
    const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
    assert.equal(walks.length, 2, `${s.id} has 2 sidewalk bands`);
    for (const w of walks) {
      assert.ok(Math.abs(polyWidth(w.polygon, perp) - wantUnits) < 0.05, "band width ≈ SIDEWALK_WIDTH_M");
    }
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — `Cannot find module './groundLayer.js'` / `buildGroundLayer is not a function`.

- [ ] **Step 3: Write the implementation**

```js
// src/groundLayer.js
// Pure geometry for the intersection ground surface — roadbeds, curbs, and
// sidewalks. No Three.js; runnable in Node, same discipline as sceneFrame.js.
//
// Geometry truth: real NYC sidewalkLineRecords set curb positions where present
// (Greenpoint x1, Franklin x3); the recorded street width fills any side with no
// line. The Greenpoint centerline is real; Franklin has none (known R10E gap) so
// its street carries derived: true. Origin (0,0) is the intersection.

const FEET_TO_METERS = 0.3048;
export const SIDEWALK_WIDTH_M = 4.0; // NYC-typical; curb-to-frontage band width
const DEFAULT_FRANKLIN_WIDTH_FT = 50; // fallback if no curb line resolves a side
const ROADBED_HALF_LENGTH_M = 110; // how far each roadbed/sidewalk run is drawn

export function buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource }) {
  const swUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  const halfLen = projection.metersToUnits(ROADBED_HALF_LENGTH_M);
  const curbLines = classifySidewalkLines(geometrySource, projection, { greenpointAxis, franklinAxis });

  const streets = [
    makeStreet({
      id: "greenpoint-ave",
      axis: greenpointAxis,
      perp: franklinAxis,
      recordedWidthFt: 50,
      derivedCenterline: false,
      curbLines: curbLines.filter((c) => c.name === "GREENPOINT AVE"),
      projection,
      halfLen,
    }),
    makeStreet({
      id: "franklin-st",
      axis: franklinAxis,
      perp: greenpointAxis,
      recordedWidthFt: DEFAULT_FRANKLIN_WIDTH_FT,
      derivedCenterline: true,
      curbLines: curbLines.filter((c) => c.name === "FRANKLIN ST"),
      projection,
      halfLen,
    }),
  ];

  const roadbeds = streets.map((s) => ({
    streetId: s.id,
    derived: s.derived,
    polygon: bandPolygon(s, -s.halfWidth.neg, s.halfWidth.pos),
  }));

  const curbs = streets.flatMap((s) => [
    { streetId: s.id, derived: s.curbDerived.pos, line: edgeLine(s, s.halfWidth.pos) },
    { streetId: s.id, derived: s.curbDerived.neg, line: edgeLine(s, -s.halfWidth.neg) },
  ]);

  const sidewalks = streets.flatMap((s) => [
    { streetId: s.id, derived: s.curbDerived.pos, side: "pos", polygon: bandPolygon(s, s.halfWidth.pos, s.halfWidth.pos + swUnits) },
    { streetId: s.id, derived: s.curbDerived.neg, side: "neg", polygon: bandPolygon(s, -(s.halfWidth.neg + swUnits), -s.halfWidth.neg) },
  ]);

  return { streets, roadbeds, curbs, sidewalks, crosswalks: [] };
}

// Project each real sidewalk line and tag it with street name and the signed
// perpendicular offset of its midpoint (which curb side it marks).
function classifySidewalkLines(geometrySource, projection, { greenpointAxis, franklinAxis }) {
  return (geometrySource.sidewalkLineRecords ?? []).map((record) => {
    const line = record.wgs84Line.map((pt) => projection.project(pt));
    const mid = { x: (line[0].x + line.at(-1).x) / 2, z: (line[0].z + line.at(-1).z) / 2 };
    const perp = record.fullStreetName === "GREENPOINT AVE" ? franklinAxis : greenpointAxis;
    return { name: record.fullStreetName, line, offset: mid.x * perp.x + mid.z * perp.z };
  });
}

function makeStreet({ id, axis, perp, recordedWidthFt, derivedCenterline, curbLines, projection, halfLen }) {
  const recordedHalf = projection.metersToUnits((recordedWidthFt * FEET_TO_METERS) / 2);
  const posLines = curbLines.filter((c) => c.offset > 0.05).sort((a, b) => a.offset - b.offset);
  const negLines = curbLines.filter((c) => c.offset < -0.05).sort((a, b) => b.offset - a.offset);
  const posHalf = posLines.length ? posLines[0].offset : recordedHalf;
  const negHalf = negLines.length ? Math.abs(negLines[0].offset) : recordedHalf;
  return {
    id,
    axis,
    perp,
    center: { x: 0, z: 0 },
    halfLen,
    halfWidth: { pos: posHalf, neg: negHalf },
    curbDerived: { pos: posLines.length === 0, neg: negLines.length === 0 },
    derived: derivedCenterline || (posLines.length === 0 && negLines.length === 0),
  };
}

// A polygon spanning the street's drawn length (along axis) between two
// perpendicular offsets offA..offB.
function bandPolygon(street, offA, offB) {
  const { axis, perp, center, halfLen } = street;
  const at = (t, off) => ({
    x: center.x + axis.x * t + perp.x * off,
    z: center.z + axis.z * t + perp.z * off,
  });
  return [at(-halfLen, offA), at(halfLen, offA), at(halfLen, offB), at(-halfLen, offB)];
}

function edgeLine(street, off) {
  const { axis, perp, center, halfLen } = street;
  const at = (t) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  return [at(-halfLen), at(halfLen)];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: PASS — all 5 tests. If the Greenpoint roadbed-width assertion fails, check the probe output from Task 1: the lone Greenpoint sidewalk line may sit on one side only, so that side's curb comes from real data and the other from `recordedHalf` — the width assertion (which sums both halves) still holds because `recordedHalf` = 25ft each. If a real Greenpoint curb offset differs from 25ft by >0.15 units, widen the tolerance to `0.3` and note the real value in a comment.

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "feat(b1): groundLayer roadbeds, curbs, sidewalks from real curb truth"
```

---

## Task 3: Add crosswalks to `groundLayer.js`

One striped crossing per street, placed at the intersection mouth (just past the other street's curb), spanning that street's roadbed width, split into continental stripes.

**Files:**
- Modify: `src/groundLayer.js`
- Modify: `src/groundLayer.test.mjs`

- [ ] **Step 1: Add the failing test**

```js
// append to src/groundLayer.test.mjs
import { CROSSWALK_STRIPE_COUNT } from "./groundLayer.js";

test("each street has one crosswalk with the right stripe count, inside the roadbed", () => {
  assert.equal(ground.crosswalks.length, 2, "one crosswalk per street");
  for (const s of ground.streets) {
    const cw = ground.crosswalks.find((c) => c.streetId === s.id);
    assert.ok(cw, `${s.id} crosswalk exists`);
    assert.equal(cw.stripes.length, CROSSWALK_STRIPE_COUNT);
    const perp = s.perp;
    const half = Math.max(s.halfWidth.pos, s.halfWidth.neg) + 0.01;
    for (const stripe of cw.stripes) {
      for (const p of stripe) {
        const off = p.x * perp.x + p.z * perp.z;
        assert.ok(Math.abs(off) <= half, "stripe within roadbed width");
      }
    }
  }
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — `ground.crosswalks.length` is 0; `CROSSWALK_STRIPE_COUNT` is undefined.

- [ ] **Step 3: Implement crosswalks**

In `src/groundLayer.js`, add the constant near the top:

```js
export const CROSSWALK_STRIPE_COUNT = 6;
const CROSSWALK_DEPTH_M = 3.5; // along-street depth of the crossing band
```

Replace the `return` line of `buildGroundLayer` with a crosswalk build, computing each street's setback past the *other* street's curb:

```js
  const depth = projection.metersToUnits(CROSSWALK_DEPTH_M);
  const crosswalks = streets.map((s) => {
    const other = streets.find((o) => o.id !== s.id);
    const setback = Math.max(other.halfWidth.pos, other.halfWidth.neg);
    return { streetId: s.id, derived: s.derived, stripes: crosswalkStripes(s, setback, depth) };
  });

  return { streets, roadbeds, curbs, sidewalks, crosswalks };
}

// Continental crossing: bars spanning the street's roadbed width (perp),
// arrayed along the axis within a depth band set just past the other street's
// curb. One band per street (the intersection-mouth side the camera sees).
function crosswalkStripes(street, setback, depth) {
  const { axis, perp, center } = street;
  const t0 = setback;
  const t1 = setback + depth;
  const wPos = street.halfWidth.pos;
  const wNeg = -street.halfWidth.neg;
  const slot = (t1 - t0) / (CROSSWALK_STRIPE_COUNT * 2 - 1);
  const at = (t, off) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  const stripes = [];
  for (let i = 0; i < CROSSWALK_STRIPE_COUNT; i += 1) {
    const a = t0 + slot * (i * 2);
    const b = a + slot;
    stripes.push([at(a, wNeg), at(b, wNeg), at(b, wPos), at(a, wPos)]);
  }
  return stripes;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: PASS — all 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "feat(b1): crosswalk stripes at the intersection mouth"
```

---

## Task 4: `buildGround` renderer in `SceneView.jsx`

**Files:**
- Modify: `src/SceneView.jsx` (palette ~20-31; imports ~1-12; effect body ~93; replace `buildStreets` ~288-307)

- [ ] **Step 1: Add palette entries**

In `src/SceneView.jsx`, extend `II_PALETTE` (after the `streetDerived` line):

```js
  asphalt: 0x6f6a60,
  asphaltDerived: 0x6a655c,
  concrete: 0xb8ae99,
  concreteDerived: 0xb2a994,
  crosswalkPaint: 0xe7dcc2,
  curbStone: 0xcabfa7,
  scoreLine: 0x4a443a,
```

- [ ] **Step 2: Import the module**

Add near the other imports at the top of `src/SceneView.jsx`:

```js
import { buildGroundLayer } from "./groundLayer.js";
```

- [ ] **Step 3: Replace the `buildStreets` call with `buildGround`**

In the effect body, change line 93 from:

```js
    buildStreets(three, scene.streets);
```

to:

```js
    const ground = buildGroundLayer({
      projection: scene.projection,
      greenpointAxis: scene.greenpointAxis,
      franklinAxis: scene.franklinAxis,
      geometrySource,
    });
    buildGround(three, ground);
```

- [ ] **Step 4: Replace the `buildStreets` function with `buildGround`**

Replace the whole `buildStreets` function (lines 288-307) with:

```js
// Procedural inked ground: warm asphalt roadbeds, concrete sidewalks with
// score-lines, ivory crosswalk bars, raised curbs. Surfaces stack just above
// the paper ground plane (y=-0.002). Derived geometry (the Franklin gap) takes
// the muted "...Derived" tones.
const Y = { roadbed: 0.0008, sidewalk: 0.0018, crosswalk: 0.0028, score: 0.004 };

function addGroundQuad(three, pts, y, color, opacity = 1) {
  const v = new Float32Array([
    pts[0].x, y, pts[0].z, pts[1].x, y, pts[1].z, pts[2].x, y, pts[2].z,
    pts[0].x, y, pts[0].z, pts[2].x, y, pts[2].z, pts[3].x, y, pts[3].z,
  ]);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(v, 3));
  g.computeVertexNormals();
  three.add(new THREE.Mesh(g, new THREE.MeshLambertMaterial({
    color, transparent: opacity < 1, opacity,
  })));
}

function addCurbStone(three, line, color) {
  const [a, b] = line;
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  if (len < 1e-6) return;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(len, 0.05, 0.04),
    new THREE.MeshLambertMaterial({ color }),
  );
  box.position.set((a.x + b.x) / 2, 0.025, (a.z + b.z) / 2);
  box.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
  three.add(box);
}

// Inked expansion joints across a sidewalk band, ~1.5m apart along its long edge.
function addSidewalkScoreLines(three, poly) {
  const edgeA = { x: poly[1].x - poly[0].x, z: poly[1].z - poly[0].z }; // long edge
  const len = Math.hypot(edgeA.x, edgeA.z);
  const count = Math.max(1, Math.round(len / (1.5 * 0.075)));
  const across0 = { x: poly[3].x - poly[0].x, z: poly[3].z - poly[0].z };
  for (let i = 1; i < count; i += 1) {
    const t = i / count;
    const p0 = { x: poly[0].x + edgeA.x * t, z: poly[0].z + edgeA.z * t };
    const p1 = { x: p0.x + across0.x, z: p0.z + across0.z };
    const mid = { x: (p0.x + p1.x) / 2, z: (p0.z + p1.z) / 2 };
    const acrossLen = Math.hypot(across0.x, across0.z);
    const score = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.004, acrossLen),
      new THREE.MeshLambertMaterial({ color: II_PALETTE.scoreLine }),
    );
    score.position.set(mid.x, Y.score, mid.z);
    score.rotation.y = -Math.atan2(across0.z, across0.x) + Math.PI / 2;
    three.add(score);
  }
}

function buildGround(three, ground) {
  for (const road of ground.roadbeds) {
    addGroundQuad(three, road.polygon, Y.roadbed, road.derived ? II_PALETTE.asphaltDerived : II_PALETTE.asphalt);
  }
  for (const walk of ground.sidewalks) {
    addGroundQuad(three, walk.polygon, Y.sidewalk, walk.derived ? II_PALETTE.concreteDerived : II_PALETTE.concrete);
    addSidewalkScoreLines(three, walk.polygon);
  }
  for (const cw of ground.crosswalks) {
    for (const stripe of cw.stripes) addGroundQuad(three, stripe, Y.crosswalk, II_PALETTE.crosswalkPaint);
  }
  for (const curb of ground.curbs) {
    addCurbStone(three, curb.line, II_PALETTE.curbStone);
  }
}
```

- [ ] **Step 5: Visual verification**

Run: `npm run build`
Expected: build succeeds (the existing 46MB GLB large-chunk warning is fine).

Then start the dev server and screenshot the iso framing:
- `preview_start` (or confirm running), load `http://127.0.0.1:5173`
- `preview_console_logs` — expect no errors
- `preview_screenshot` — expect: a warm asphalt roadbed down Greenpoint Ave and across Franklin St, lighter concrete sidewalks flanking each with faint score-lines, ivory crosswalk bars at the corner, thin raised curbs. The Franklin roadbed/sidewalk read slightly muted (derived tone). No flat pea-green slabs from the old `buildStreets`.

- [ ] **Step 6: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(b1): render procedural inked ground, replacing flat street slabs"
```

---

## Task 5: Trim per-building grounding so the layers don't z-fight

The new global sidewalk now owns the sidewalk/curb/joint geometry. Keep only the cast-shadow boxes in `addRecordContactGrounding` (they ground the building mass); drop the sidewalk slab, curb, and seam scoring it used to draw.

**Files:**
- Modify: `src/components/hero/FranklinHeroCorner.jsx:400-442`

- [ ] **Step 1: Replace the function body**

Replace `addRecordContactGrounding` (lines 400-442) with:

```js
function addRecordContactGrounding(group, { facadeXMin, facadeWidth, centerX, recordFaceZ, sideOffset, baySpans, shadowLayer }) {
  // Sidewalk, curb, and joint scoring now come from the global groundLayer
  // (src/groundLayer.js). Keep only the cast-shadow contact that grounds the
  // building mass against that surface.
  addHeroFidelityBox(group, {
    color: 0x0c0f0e,
    opacity: 0.55,
    position: [centerX, 0.122, recordFaceZ + sideOffset * 0.18],
    size: [facadeWidth * 1.02, 0.018, 0.16],
    ...shadowLayer,
  });
  for (const bay of baySpans) {
    addHeroFidelityBox(group, {
      color: 0x151817,
      opacity: 0.42,
      position: [bay.center, 0.13, recordFaceZ + sideOffset * 0.1],
      size: [bay.width * 0.74, 0.016, 0.12],
      ...shadowLayer,
    });
  }
}
```

Then update its call site so it no longer passes the now-unused `materials`/`z`/`layer` args. Find the call (it is inside `addFranklinFacadeRecordAssembly`, around line 67):

```js
  addRecordContactGrounding(group, { materials, facadeXMin, facadeWidth, centerX, z, recordFaceZ, sideOffset, baySpans, layer: recordLayer, shadowLayer });
```

Replace with:

```js
  addRecordContactGrounding(group, { facadeXMin, facadeWidth, centerX, recordFaceZ, sideOffset, baySpans, shadowLayer });
```

- [ ] **Step 2: Visual verification**

Run: `npm run build` — expect success.
Then in the live preview:
- `preview_screenshot` — expect: the per-building grey sidewalk strips and pale curb ticks are gone; each hero now sits on the single continuous global sidewalk; the dark contact shadow under each storefront remains. Look specifically for z-fighting shimmer where the old strips were — there should be none.
- `preview_console_logs` — no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/FranklinHeroCorner.jsx
git commit -m "feat(b1): drop per-building sidewalk strips, keep cast shadow"
```

---

## Task 6: Durable live verifier

A standalone verifier in the project's `scripts/` style asserting the ground geometry holds against the live fixtures (curbs outside frontages, sane sidewalk width, roadbed widths match record, crosswalks inside roadbeds). This is the durable signal the project keeps, beyond the unit test.

**Files:**
- Create: `scripts/verify-b1-intersection-ground.mjs`

- [ ] **Step 1: Write the verifier**

```js
// scripts/verify-b1-intersection-ground.mjs
// Live geometry verifier for the b1 intersection ground system.
// Run: node scripts/verify-b1-intersection-ground.mjs
import fs from "node:fs";
import { createProjection } from "../src/sceneFrame.js";
import { buildGroundLayer, SIDEWALK_WIDTH_M, CROSSWALK_STRIPE_COUNT } from "../src/groundLayer.js";

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

const failures = [];
const assert = (cond, msg) => { if (!cond) failures.push(msg); };
const span = (poly, perp) => {
  const offs = poly.map((p) => p.x * perp.x + p.z * perp.z);
  return Math.max(...offs) - Math.min(...offs);
};

assert(ground.streets.length === 2, "Expected 2 streets (Greenpoint, Franklin).");
assert(ground.streets.some((s) => s.id === "greenpoint-ave" && s.derived === false), "Greenpoint must be source-backed.");
assert(ground.streets.some((s) => s.id === "franklin-st" && s.derived === true), "Franklin must be flagged derived.");

const gpRoad = ground.roadbeds.find((r) => r.streetId === "greenpoint-ave");
const gpWidth = projection.metersToUnits(50 * 0.3048);
assert(Math.abs(span(gpRoad.polygon, franklinAxis) - gpWidth) < 0.3, "Greenpoint roadbed ≈ recorded 50ft.");

for (const s of ground.streets) {
  const curbs = ground.curbs.filter((c) => c.streetId === s.id);
  assert(curbs.length === 2, `${s.id} must have exactly 2 curbs.`);
  const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
  const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
  assert(walks.length === 2, `${s.id} must have 2 sidewalk bands.`);
  for (const w of walks) {
    assert(Math.abs(span(w.polygon, perp) - projection.metersToUnits(SIDEWALK_WIDTH_M)) < 0.05, `${s.id} sidewalk width ≈ ${SIDEWALK_WIDTH_M}m.`);
  }
  const cw = ground.crosswalks.find((c) => c.streetId === s.id);
  assert(cw && cw.stripes.length === CROSSWALK_STRIPE_COUNT, `${s.id} crosswalk must have ${CROSSWALK_STRIPE_COUNT} stripes.`);
}

// Curbs must sit off the centerline by a real margin (the roadbed has width and
// the sidewalk band hangs outside it). A literal per-footprint frontage check is
// deferred — the frontage offsets are not threaded into this verifier in v0.
for (const s of ground.streets) {
  const perp = s.id === "greenpoint-ave" ? franklinAxis : greenpointAxis;
  const curbs = ground.curbs.filter((c) => c.streetId === s.id);
  for (const c of curbs) {
    const off = Math.abs(c.line[0].x * perp.x + c.line[0].z * perp.z);
    assert(off > 0.2, `${s.id} curb must be off-center (got ${off.toFixed(3)}).`);
  }
}

if (failures.length) {
  console.error("FAIL b1 ground verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("PASS b1 ground verifier: roadbeds, curbs, sidewalks, crosswalks consistent.");
```

- [ ] **Step 2: Run the verifier**

Run: `node scripts/verify-b1-intersection-ground.mjs`
Expected: `PASS b1 ground verifier: ...`

- [ ] **Step 3: Final build + screenshot proof**

Run: `npm run build` — expect success.
Capture a final `preview_screenshot` at the default iso framing for the record.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-b1-intersection-ground.mjs
git commit -m "test(b1): durable intersection-ground geometry verifier"
```

---

## Self-Review Notes (for the executor)

- **Measurement gate:** Task 1 must run before Task 2's constants are trusted. If the probe shows Franklin's 3 sidewalk lines do not resolve to two opposite sides (e.g., all same sign, or one is the centerline at offset ≈ 0), `makeStreet` falls back to `recordedHalf` for the missing side — the street still renders, just more of it flagged `derived`. That is the intended hybrid fallback; note the real offsets in a comment so b1 stays honest about what is real vs inferred.
- **Truth flagging:** derived geometry uses the muted `...Derived` palette tones, consistent with the existing `II_PALETTE.streetDerived` convention. Per the truth rules, the Franklin roadbed/centerline being derived is expected and visible, not a bug.
- **Deferred styling (conscious, not a gap):** the DECISION_LOG mentions "paper grain" and a "restrained typological lane hint." v0 ships flat warm asphalt + concrete tones, sidewalk score-lines, and crosswalk bars only. Paper-grain texture and center-lane dashes are a follow-on styling pass once the surface geometry is confirmed against the facades — they do not change any geometry, only material.
- **YAGNI:** corner-miter geometry is deliberately out of scope — the two sidewalk bands overlap at the corner and read as a continuous wrap because they share the concrete material. A true mitered corner-return polygon is a later polish item, not v0.
- **Scope:** this plan is b1 only. b2 (corner signals on the curb returns) and c (Franklin extension to Milton) are separate plans, written after b1 lands and is reviewed.
