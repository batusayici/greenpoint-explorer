# Street-Network-Driven Ground Extent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ground layer's fixed 130m radius circle with a per-street real-centerline extent model so pavement tracks every placed building along the loaded corridor.

**Architecture:** Each street is paved along its real projected centerline as an asymmetric along-axis span `{ tMin, tMax }` (no circle, no fixed run-length). The spine (Greenpoint/Franklin) and cross-streets unify into one centerline-driven builder. Missing corridor streets (Huron/Freeman/India + Franklin) are sourced via a new descriptor-driven LION pull and merged into the centerline records the ground layer reads. The building cull in `sceneFrame.js` is left untouched — ground decouples only.

**Tech Stack:** Node 24 (ESM `.mjs`), `node:test`, React 19 + Three.js + Vite, NYC Open Data Socrata (LION Centerline resource `inkn-q76z`).

## Global Constraints

- **Pure geometry, Node-runnable:** `groundLayer.js` stays free of Three.js — same discipline as `sceneFrame.js`. (Source: spec §1; `groundLayer.js:1-4`.)
- **Source-backed truth:** street geometry comes from real LION centerlines, never derived/grid-inferred, except Franklin's *extent* (its centerline may be absent — R10E gap). A real record sets `derived: false`; a derived extent keeps `derived: true`. (Source: DECISION_LOG 2026-06-22, scope (c).)
- **Ground-only decouple:** do NOT change the building cull in `sceneFrame.js`. (Source: DECISION_LOG 2026-06-22, scope (b).)
- **Coordinate convention:** scene points are `{ x, z }`; projection from `createProjection(basis)` in `sceneFrame.js`; `projection.metersToUnits(m)` and `projection.project({lon,lat}) → {x,z}`. Feet→meters = `0.3048`.
- **Tests:** `npm run test` runs `node --test "src/**/*.test.mjs"`. Full gate: `npm run verify`.
- **Commit frequently** — one commit per task minimum; end PR-less (no push without Batu).

---

## File Structure

- `src/groundLayer.js` — **modified.** Core geometry change: `{ tMin, tMax }` span model, unified `buildStreets` builder, radius removal. One responsibility (pure ground geometry) preserved.
- `src/groundLayer.test.mjs` — **modified.** Old radius/Java-exclusion tests replaced with extent-from-centerline tests.
- `scripts/pull-street-centerlines.mjs` — **created.** Descriptor-driven LION pull, modeled on `scripts/pull-footprints.mjs`.
- `src/data/geometry-source/descriptors/franklin-north-streets.descriptor.json` — **created.** Pull bbox descriptor.
- `src/data/geometry-source/block-franklin-north.street-centerlines.v0.1.json` — **created** (by the pull script).
- `src/SceneView.jsx` — **modified** (~11, ~222-232, ~861 region): merge corridor centerlines into the source passed to `buildGroundLayer`; remove the radius-coupling comment.
- `scripts/verify-b1-intersection-ground.mjs` — **modified.** Live verifier updated to the new model (count, extents, no radius).

---

## Task 1: Per-street span model + radius removal (the core refactor)

Replace symmetric `halfLen` and the 130m circle with an asymmetric along-axis span `{ tMin, tMax }` derived from each street's real projected centerline endpoints. Cross-streets keep their full real extent instead of being circle-clamped (so Java, previously excluded by radius, now appears). The `axisSegments` signature changes from `(halfLen, gaps)` to `(tMin, tMax, gaps)`.

**Files:**
- Modify: `src/groundLayer.js`
- Test: `src/groundLayer.test.mjs`

**Interfaces:**
- Consumes: `createProjection(basis)`, `projection.project`, `projection.metersToUnits` (from `sceneFrame.js`); `geometrySource.streetCenterlineRecords` (records carry `fullStreetName`, `streetWidth`, `wgs84Line: [{lon,lat}]`).
- Produces:
  - `buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource })` → `{ streets, roadbeds, curbs, sidewalks, crosswalks }`. **No `contextRadiusMeters` param.**
  - Each `street`: `{ id, name?, derived, center: {x,z}, axis: {x,z}, perp: {x,z}, halfWidth, tMin, tMax }`. (`tMin/tMax` replace `halfLen`.)
  - `axisSegments(tMin, tMax, gaps)` → ordered `[[t0,t1], …]` spans within `[tMin, tMax]` minus `gaps`.
  - Exports unchanged: `SIDEWALK_WIDTH_M`, `CROSSWALK_STRIPE_COUNT`.

- [ ] **Step 1: Write the failing tests** — replace the three radius-coupled tests in `src/groundLayer.test.mjs` (currently lines ~131-159: "includes source-backed crossers within the context radius", "cross-streets are derived:false and centered on the Franklin line", "cross-street reach is clamped to the context circle") with the block below, and update the two `axisSegments` tests to the new signature.

```javascript
// Java is no longer excluded — there is no radius. All three crossers appear.
test("street list includes every source-backed crosser (no radius exclusion)", () => {
  const ids = ground.streets.map((s) => s.id);
  assert.ok(ids.includes("greenpoint-ave") && ids.includes("franklin-st"), "spine present");
  for (const id of ["cross-kent-st", "cross-milton-st", "cross-java-st"])
    assert.ok(ids.includes(id), `${id} present (no radius gate)`);
});

test("cross-streets are derived:false and centered on the Franklin line", () => {
  for (const id of ["cross-kent-st", "cross-milton-st", "cross-java-st"]) {
    const s = ground.streets.find((x) => x.id === id);
    assert.equal(s.derived, false, `${id} is source-backed`);
    const offFromFranklin = s.center.x * greenpointAxis.x + s.center.z * greenpointAxis.z;
    assert.ok(Math.abs(offFromFranklin) < 0.5, `${id} center on Franklin line`);
    assert.ok(Math.abs(s.axis.x * greenpointAxis.x + s.axis.z * greenpointAxis.z) > 0.9, `${id} parallel to Greenpoint`);
  }
});

test("each street carries a tMin/tMax span and no halfLen", () => {
  for (const s of ground.streets) {
    assert.ok(typeof s.tMin === "number" && typeof s.tMax === "number", `${s.id} has tMin/tMax`);
    assert.ok(s.tMax > s.tMin, `${s.id} span is non-empty`);
    assert.equal(s.halfLen, undefined, `${s.id} no legacy halfLen`);
  }
});

// A cross-street's paved extent equals the projected span of its real centerline
// endpoints about its Franklin crossing (not a circle chord).
test("cross-street extent matches its real centerline endpoint span", () => {
  const recs = geometrySource.streetCenterlineRecords.filter((r) => r.fullStreetName === "KENT ST");
  const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  const s = ground.streets.find((x) => x.id === "cross-kent-st");
  const ts = pts.map((p) => (p.x - s.center.x) * s.axis.x + (p.z - s.center.z) * s.axis.z);
  assert.ok(Math.abs(s.tMin - Math.min(...ts)) < 0.5, "tMin ≈ nearest real endpoint");
  assert.ok(Math.abs(s.tMax - Math.max(...ts)) < 0.5, "tMax ≈ farthest real endpoint");
});
```

Update the two existing `axisSegments` tests to the new `(tMin, tMax, gaps)` signature:

```javascript
test("axisSegments subtracts multiple gaps and returns ordered spans", () => {
  const segs = axisSegments(-10, 10, [{ t0: -6, t1: -4 }, { t0: 1, t1: 3 }]);
  assert.deepEqual(segs, [[-10, -6], [-4, 1], [3, 10]]);
});

test("axisSegments with no gaps returns the full span", () => {
  assert.deepEqual(axisSegments(-10, 10, []), [[-10, 10]]);
});

test("axisSegments clamps gaps to the run and drops empty spans", () => {
  assert.deepEqual(axisSegments(-5, 5, [{ t0: -9, t1: -5 }, { t0: 5, t1: 9 }]), [[-5, 5]]);
  assert.deepEqual(axisSegments(-5, 5, [{ t0: -1, t1: 1 }]), [[-5, -1], [1, 5]]);
  assert.deepEqual(axisSegments(-5, 5, [{ t0: -6, t1: 6 }]), []);
});
```

Also update the `ground` construction at the top of the test file (line ~23) to drop any radius arg (it already passes none — confirm no `contextRadiusMeters`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — `cross-java-st` missing (still radius-excluded), `s.halfLen` still defined, `axisSegments` arity mismatch.

- [ ] **Step 3: Implement the span model in `src/groundLayer.js`**

(a) Change `axisSegments` to take an explicit range:

```javascript
// The along-axis spans remaining after removing each crossing interval from a
// full [tMin, tMax] run. `gaps` is an array of { t0, t1 } (unordered ok).
export function axisSegments(tMin, tMax, gaps) {
  const merged = [...gaps]
    .map((g) => ({ t0: Math.max(tMin, Math.min(g.t0, g.t1)), t1: Math.min(tMax, Math.max(g.t0, g.t1)) }))
    .filter((g) => g.t1 > g.t0)
    .sort((a, b) => a.t0 - b.t0);
  const spans = [];
  let cursor = tMin;
  for (const g of merged) {
    if (g.t0 > cursor) spans.push([cursor, g.t0]);
    cursor = Math.max(cursor, g.t1);
  }
  if (cursor < tMax) spans.push([cursor, tMax]);
  return spans;
}
```

(b) `bandPolygon` / `edgeLine` default to the street's span:

```javascript
function bandPolygon(street, offA, offB, tMin = street.tMin, tMax = street.tMax) {
  const { axis, perp, center } = street;
  const at = (t, off) => ({
    x: center.x + axis.x * t + perp.x * off,
    z: center.z + axis.z * t + perp.z * off,
  });
  return [at(tMin, offA), at(tMax, offA), at(tMax, offB), at(tMin, offB)];
}

function edgeLine(street, off, tMin = street.tMin, tMax = street.tMax) {
  const { axis, perp, center } = street;
  const at = (t) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  return [at(tMin), at(tMax)];
}
```

(c) In `buildGroundLayer`, delete `contextRadiusMeters` from the signature and `contextRadiusUnits`/`halfLen` locals. Replace `crossingGaps`'s bound check and the crosswalk loop's bound check from `Math.abs(t) > s.halfLen` to `t < s.tMin || t > s.tMax`. Replace the three `axisSegments(s.halfLen, gaps)` calls with `axisSegments(s.tMin, s.tMax, gaps)`. New signature line:

```javascript
export function buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource }) {
  const swUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  // (no halfLen, no contextRadiusUnits)
```

(d) Update `crossingGaps` and the crosswalk `t` bound checks:

```javascript
    if (t < s.tMin || t > s.tMax) continue; // crossing is off this street's drawn run
```

(e) Rewrite `buildCrossStreets` to drop the radius and derive `tMin/tMax` from real endpoints. The crossing point with Franklin is the `center`; the projected endpoints set the span:

```javascript
function buildCrossStreets({ geometrySource, projection, franklinAxis }) {
  const records = geometrySource.streetCenterlineRecords ?? [];
  const byName = new Map();
  for (const r of records) {
    const n = r.fullStreetName;
    if (n === "GREENPOINT AVE" || n === "FRANKLIN ST") continue; // spine handled separately
    if (!byName.has(n)) byName.set(n, []);
    byName.get(n).push(r);
  }
  const origin = { x: 0, z: 0 }; // Franklin passes through the intersection origin
  const out = [];
  for (const [name, recs] of byName) {
    const [a, b] = projectStreetEndpoints(recs, projection);
    const v = { x: b.x - a.x, z: b.z - a.z };
    const len = Math.hypot(v.x, v.z) || 1;
    const axis = { x: v.x / len, z: v.z / len };
    const center = lineIntersect(a, axis, origin, franklinAxis);
    if (!center) continue; // parallel to Franklin — does not cross the spine
    const tA = (a.x - center.x) * axis.x + (a.z - center.z) * axis.z;
    const tB = (b.x - center.x) * axis.x + (b.z - center.z) * axis.z;
    const widthFt = Number.parseFloat(recs[0].streetWidth ?? String(DEFAULT_STREET_WIDTH_FT));
    out.push({
      id: slug(name),
      name,
      derived: false,
      center,
      axis,
      perp: { x: -axis.z, z: axis.x },
      halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
      tMin: Math.min(tA, tB),
      tMax: Math.max(tA, tB),
    });
  }
  return out.sort((s1, s2) => s1.id.localeCompare(s2.id));
}
```

(f) For now keep the spine (`greenpoint-ave`, `franklin-st`) building via `makeStreet`, but give it a `tMin/tMax` instead of `halfLen`. Temporarily span the spine ±150m so this task is self-contained (Task 2 replaces this with real/derived extents):

```javascript
function makeStreet({ id, axis, perp, widthFt, derived, projection, tMin, tMax }) {
  return {
    id, axis, perp,
    center: { x: 0, z: 0 },
    tMin, tMax,
    halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
    derived,
  };
}
```

In `buildGroundLayer`, build the spine with a temporary symmetric span:

```javascript
  const SPINE_REACH = projection.metersToUnits(150); // TEMP: Task 2 replaces with real/derived extent
  const spine = [
    makeStreet({ id: "greenpoint-ave", axis: greenpointAxis, perp: franklinAxis,
      widthFt: streetWidthFt(geometrySource, "GREENPOINT AVE", 50), derived: false,
      projection, tMin: -SPINE_REACH, tMax: SPINE_REACH }),
    makeStreet({ id: "franklin-st", axis: franklinAxis, perp: greenpointAxis,
      widthFt: streetWidthFt(geometrySource, "FRANKLIN ST", DEFAULT_STREET_WIDTH_FT), derived: true,
      projection, tMin: -SPINE_REACH, tMax: SPINE_REACH }),
  ];
  const crosses = buildCrossStreets({ geometrySource, projection, franklinAxis });
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/groundLayer.test.mjs`
Expected: PASS (all, including the unchanged width/curb/sidewalk/crosswalk tests — `cross-java-st` now present, spans present, `axisSegments` new arity).

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "refactor(ground): per-street tMin/tMax span model, remove 130m radius

Cross-streets now paved to their real centerline endpoint span instead of
a circle chord; Java no longer radius-excluded. axisSegments takes (tMin,
tMax, gaps). Spine extent is a temporary 150m placeholder (Task 2).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Unify spine + cross-streets; real Greenpoint extent, derived Franklin extent

Fold the hand-built spine into the centerline-driven path. Greenpoint's extent comes from its real centerline endpoints (a record exists). Franklin's extent is derived from the span of cross-streets it crosses (no centerline record yet — R10E gap), plus a margin — replacing the temporary 150m placeholder.

**Files:**
- Modify: `src/groundLayer.js`
- Test: `src/groundLayer.test.mjs`

**Interfaces:**
- Consumes: same `geometrySource.streetCenterlineRecords`.
- Produces: `greenpoint-ave` extent = projected real-centerline span; `franklin-st` extent = `[min(crossingT) - margin, max(crossingT) + margin]` where margin = `projection.metersToUnits(FRANKLIN_END_MARGIN_M)` and `FRANKLIN_END_MARGIN_M = 25`. Street object shape unchanged from Task 1.

- [ ] **Step 1: Write the failing tests** — add to `src/groundLayer.test.mjs`:

```javascript
test("Greenpoint extent matches its real centerline endpoint span", () => {
  const recs = geometrySource.streetCenterlineRecords.filter((r) => r.fullStreetName === "GREENPOINT AVE");
  const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
  const ts = pts.map((p) => (p.x - gp.center.x) * gp.axis.x + (p.z - gp.center.z) * gp.axis.z);
  assert.ok(Math.abs(gp.tMin - Math.min(...ts)) < 0.5, "tMin ≈ nearest real endpoint");
  assert.ok(Math.abs(gp.tMax - Math.max(...ts)) < 0.5, "tMax ≈ farthest real endpoint");
});

test("Franklin extent spans all of its crossings plus a margin", () => {
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  const crossers = ground.streets.filter((s) => s.id.startsWith("cross-"));
  // t of each crosser's center projected onto Franklin's axis (Franklin center is origin)
  const crossTs = crossers.map((c) => c.center.x * fr.axis.x + c.center.z * fr.axis.z);
  const margin = projection.metersToUnits(25);
  assert.ok(fr.tMin <= Math.min(...crossTs) - margin + 1e-6, "covers southernmost crossing + margin");
  assert.ok(fr.tMax >= Math.max(...crossTs) + margin - 1e-6, "covers northernmost crossing + margin");
});

test("Franklin is still flagged derived (no source centerline in this packet)", () => {
  const fr = ground.streets.find((s) => s.id === "franklin-st");
  assert.equal(fr.derived, true);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — Greenpoint still uses the ±150m placeholder, not its real span; Franklin uses ±150m, not crossing-derived.

- [ ] **Step 3: Implement** — in `src/groundLayer.js`:

(a) Add the margin constant near the top:

```javascript
const FRANKLIN_END_MARGIN_M = 25; // how far Franklin's roadbed runs past its outermost crossing
```

(b) Build Greenpoint from its real centerline. Add a helper that returns center+axis+span for a named real street through the origin:

```javascript
// A spine street that runs through the origin along a known axis, with its
// extent taken from its real centerline endpoints projected onto that axis.
function spineFromCenterline({ id, name, axis, perp, widthFt, geometrySource, projection }) {
  const recs = (geometrySource.streetCenterlineRecords ?? []).filter((r) => r.fullStreetName === name);
  const center = { x: 0, z: 0 };
  let tMin = -projection.metersToUnits(150), tMax = projection.metersToUnits(150);
  if (recs.length) {
    const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
    const ts = pts.map((p) => (p.x - center.x) * axis.x + (p.z - center.z) * axis.z);
    tMin = Math.min(...ts); tMax = Math.max(...ts);
  }
  return {
    id, name, axis, perp, center, tMin, tMax,
    halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
    derived: false,
  };
}
```

(c) In `buildGroundLayer`, replace the placeholder spine with: Greenpoint via `spineFromCenterline`, cross-streets via `buildCrossStreets`, then Franklin derived from the crossings. Order matters — Franklin needs the crossers first:

```javascript
  const greenpoint = spineFromCenterline({
    id: "greenpoint-ave", name: "GREENPOINT AVE", axis: greenpointAxis, perp: franklinAxis,
    widthFt: streetWidthFt(geometrySource, "GREENPOINT AVE", 50), geometrySource, projection,
  });
  const crosses = buildCrossStreets({ geometrySource, projection, franklinAxis });

  // Franklin: if a real centerline exists, use its span; else derive extent from
  // the crossings it must reach (R10E gap — no Franklin centerline in the packet).
  const franklin = buildFranklin({ geometrySource, projection, greenpointAxis, franklinAxis, crosses });

  const streets = [greenpoint, franklin, ...crosses];
```

(d) Add `buildFranklin`:

```javascript
function buildFranklin({ geometrySource, projection, greenpointAxis, franklinAxis, crosses }) {
  const hasReal = (geometrySource.streetCenterlineRecords ?? []).some((r) => r.fullStreetName === "FRANKLIN ST");
  const widthFt = streetWidthFt(geometrySource, "FRANKLIN ST", DEFAULT_STREET_WIDTH_FT);
  if (hasReal) {
    return spineFromCenterline({
      id: "franklin-st", name: "FRANKLIN ST", axis: franklinAxis, perp: greenpointAxis,
      widthFt, geometrySource, projection,
    });
  }
  // Derived extent: span the crossings (their center projected onto Franklin's axis) + margin.
  const center = { x: 0, z: 0 };
  const margin = projection.metersToUnits(FRANKLIN_END_MARGIN_M);
  const crossTs = crosses.map((c) => (c.center.x - center.x) * franklinAxis.x + (c.center.z - center.z) * franklinAxis.z);
  const lo = crossTs.length ? Math.min(...crossTs, 0) : -projection.metersToUnits(150);
  const hi = crossTs.length ? Math.max(...crossTs, 0) : projection.metersToUnits(150);
  return {
    id: "franklin-st", name: "FRANKLIN ST", axis: franklinAxis, perp: greenpointAxis,
    center, tMin: lo - margin, tMax: hi + margin,
    halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
    derived: true,
  };
}
```

(e) Delete the now-unused `makeStreet` and the `SPINE_REACH` placeholder block from Task 1.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/groundLayer.test.mjs`
Expected: PASS (all). The existing "produces one Greenpoint and one Franklin street", width, curb, sidewalk, and crosswalk tests still hold.

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "refactor(ground): unify spine + cross-streets; real Greenpoint, derived Franklin extent

Greenpoint extent from its real centerline endpoints; Franklin extent
derived from the span of its crossings + 25m margin (R10E: no Franklin
centerline yet). Removes the makeStreet placeholder.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Descriptor-driven LION street-centerline pull

Add a pull script (modeled on `scripts/pull-footprints.mjs`) that fetches NYC LION Centerline geometry for a bbox and writes a packet in the `streetCenterlineRecords` shape the ground layer already reads. Produce the Franklin-north corridor packet.

**Files:**
- Create: `scripts/pull-street-centerlines.mjs`
- Create: `src/data/geometry-source/descriptors/franklin-north-streets.descriptor.json`
- Create (by running the script): `src/data/geometry-source/block-franklin-north.street-centerlines.v0.1.json`

**Interfaces:**
- Consumes: a descriptor `{ id, label, bbox: { minLon, minLat, maxLon, maxLat } }`.
- Produces: a packet `{ schemaVersion, blockId, bbox, source, recordCount, streetCenterlineRecords: [{ id, source, physicalid, fullStreetName, streetWidth, wgs84Line: [{lon,lat}] }] }`. Record shape matches the existing phase-3b packet so `groundLayer.js` needs no new parsing.
- LION resource: `inkn-q76z`. Columns used: `physicalid`, `full_stree`, `st_width`, `the_geom` (MultiLineString of `[lon,lat]`). Socrata bbox filter: `within_box(the_geom, maxLat, minLon, minLat, maxLon)`.

- [ ] **Step 1: Write the descriptor**

Create `src/data/geometry-source/descriptors/franklin-north-streets.descriptor.json`. The bbox covers the Franklin-north corridor (Greenpoint Ave → Huron, spanning the cross-streets); reuse the `franklin-north` block descriptor's bbox if one exists under `scripts/` or `src/data/blocks/` — otherwise these bounds:

```json
{
  "id": "franklin-north",
  "label": "Franklin Ave corridor streets, Greenpoint Ave → Huron St",
  "bbox": { "minLon": -73.9595, "minLat": 40.7290, "maxLon": -73.9520, "maxLat": 40.7360 }
}
```

> Implementer note: confirm/adjust the bbox against `src/data/blocks/franklin-north.block.json` (or its source descriptor) so the street pull covers exactly the building span. Use the building extract's bbox if present.

- [ ] **Step 2: Write the pull script**

Create `scripts/pull-street-centerlines.mjs`:

```javascript
#!/usr/bin/env node
/**
 * pull-street-centerlines.mjs
 * Usage: node scripts/pull-street-centerlines.mjs <descriptor.json>
 *
 * Pulls NYC LION Street Centerline (inkn-q76z) for a bbox and writes a packet
 * in the streetCenterlineRecords shape the ground layer reads.
 * Columns: physicalid, full_stree, st_width, the_geom (MultiLineString [lon,lat]).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const LION_URL = "https://data.cityofnewyork.us/resource/inkn-q76z.json";

async function fetchJson(url, label) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Fetch failed [${label}] HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function main() {
  const descriptorPath = process.argv[2];
  if (!descriptorPath) {
    console.error("Usage: node scripts/pull-street-centerlines.mjs <descriptor.json>");
    process.exit(1);
  }
  const descriptor = JSON.parse(readFileSync(resolve(descriptorPath), "utf8"));
  const { id, label, bbox } = descriptor;
  const { minLon, minLat, maxLon, maxLat } = bbox;

  console.log(`\nPulling LION centerlines for "${id}" …`);
  const whereClause = `within_box(the_geom,${maxLat},${minLon},${minLat},${maxLon})`;
  const url = `${LION_URL}?$where=${encodeURIComponent(whereClause)}&$limit=5000`;
  const raw = await fetchJson(url, "lion");
  console.log(`  → ${raw.length} raw centerline segments returned`);

  const records = [];
  for (const r of raw) {
    const geom = r.the_geom;
    if (!geom || !geom.coordinates) continue;
    const name = (r.full_stree ?? "").trim().toUpperCase();
    if (!name) continue;
    // MultiLineString → flatten to a single ordered polyline (one segment per LION row)
    const lines = geom.type === "MultiLineString" ? geom.coordinates : [geom.coordinates];
    for (const line of lines) {
      const wgs84Line = line.map((c) => ({ lon: c[0], lat: c[1] }));
      if (wgs84Line.length < 2) continue;
      records.push({
        id: `nyc-centerline-physicalid-${r.physicalid ?? "unknown"}-${records.length}`,
        source: "nyc-open-data-street-centerline-inkn-q76z",
        physicalid: r.physicalid != null ? String(r.physicalid) : null,
        fullStreetName: name,
        streetWidth: r.st_width != null ? String(r.st_width) : null,
        wgs84Line,
      });
    }
  }

  const namesSeen = [...new Set(records.map((r) => r.fullStreetName))].sort();
  console.log(`  → ${records.length} centerline records across ${namesSeen.length} streets:`);
  console.log("   ", namesSeen.join(", "));

  const outDir = join(PROJECT_ROOT, "src/data/geometry-source");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `block-${id}.street-centerlines.v0.1.json`);
  const output = {
    schemaVersion: "block-street-centerlines.v0.1",
    blockId: id,
    bbox,
    source: { lion: LION_URL, pulledFor: label },
    recordCount: records.length,
    streetCenterlineRecords: records,
  };
  const jsonStr = JSON.stringify(output, null, 2);
  JSON.parse(jsonStr);
  writeFileSync(outPath, jsonStr, "utf8");
  console.log(`\nWrote ${outPath} (${records.length} records)`);
}

main().catch((err) => { console.error("\nFATAL:", err.message); process.exit(1); });
```

- [ ] **Step 3: Run the pull and verify the output**

Run: `node scripts/pull-street-centerlines.mjs src/data/geometry-source/descriptors/franklin-north-streets.descriptor.json`
Expected: prints a street-name list that **includes at least** `FRANKLIN ST`, `HURON ST`, `FREEMAN ST`, `INDIA ST`, `KENT ST`, `JAVA ST`, `MILTON ST`, `GREENPOINT AVE`, and writes `block-franklin-north.street-centerlines.v0.1.json`.

> Implementer note: if the printed columns differ (e.g. `st_width` empty or `full_stree` named differently), inspect one raw row by temporarily logging `raw[0]` and adjust the three field reads. Do not invent widths — if `st_width` is absent for a street, leave `streetWidth: null` (the ground layer falls back to `DEFAULT_STREET_WIDTH_FT`).

- [ ] **Step 4: Sanity-check the packet shape with a quick assertion**

Run:
```bash
node -e "const d=require('./src/data/geometry-source/block-franklin-north.street-centerlines.v0.1.json'); const n=new Set(d.streetCenterlineRecords.map(r=>r.fullStreetName)); ['FRANKLIN ST','HURON ST','GREENPOINT AVE'].forEach(s=>{if(!n.has(s))throw new Error('missing '+s)}); console.log('OK',d.recordCount,'records,',n.size,'streets');"
```
Expected: `OK <n> records, <m> streets` (no throw).

- [ ] **Step 5: Commit**

```bash
git add scripts/pull-street-centerlines.mjs src/data/geometry-source/descriptors/franklin-north-streets.descriptor.json src/data/geometry-source/block-franklin-north.street-centerlines.v0.1.json
git commit -m "feat(data): LION street-centerline pull + Franklin-north corridor packet

Descriptor-driven pull of NYC LION Centerline (inkn-q76z); corridor packet
adds Franklin + Huron/Freeman/India centerlines in the existing record shape.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Wire the corridor centerlines into the scene + decouple the call site

Merge the corridor centerline records into the source passed to `buildGroundLayer` (deduped against the existing phase-3b records), and remove the radius-coupling comment/argument at the call site.

**Files:**
- Modify: `src/SceneView.jsx` (import near line 11; call site ~222-232)
- Test: `src/groundLayer.test.mjs` (add a merge-driven extent test using the new packet)

**Interfaces:**
- Consumes: `block-franklin-north.street-centerlines.v0.1.json` (`streetCenterlineRecords`), existing phase-3b `geometrySource`.
- Produces: a merged `geometrySource` whose `streetCenterlineRecords` = phase-3b ∪ corridor, deduped by `physicalid` (corridor wins on collision; records lacking `physicalid` keyed by `fullStreetName + first point`). `sidewalkLineRecords` unchanged (width fallback intact).

- [ ] **Step 1: Write the failing test** — add to `src/groundLayer.test.mjs`, loading the merged source the same way SceneView will:

```javascript
import corridorStreets from "./data/geometry-source/block-franklin-north.street-centerlines.v0.1.json" with { type: "json" };

test("merged corridor source paves Huron and Franklin gets a real centerline", () => {
  const merged = {
    ...geometrySource,
    streetCenterlineRecords: [
      ...geometrySource.streetCenterlineRecords,
      ...corridorStreets.streetCenterlineRecords,
    ],
  };
  const g = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource: merged });
  const ids = g.streets.map((s) => s.id);
  assert.ok(ids.includes("cross-huron-st"), "Huron paved from corridor pull");
  const fr = g.streets.find((s) => s.id === "franklin-st");
  assert.equal(fr.derived, false, "Franklin now source-backed (real centerline present)");
});
```

> Note: if the corridor pull did NOT return a `FRANKLIN ST` centerline, change the last assertion to `assert.equal(fr.derived, true)` and confirm Franklin's derived extent still spans every crosser — the design explicitly allows the derived fallback.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — `cross-huron-st` absent (corridor records not yet merged in the test's `geometrySource`)... actually this test builds its own merged source, so it should pass IF the packet has Huron. Run it; if it already passes, that confirms the geometry layer needs no change — the remaining work is purely the SceneView wiring in Step 3. If it fails, the packet/merge is wrong — fix before proceeding.

- [ ] **Step 3: Wire and decouple in `src/SceneView.jsx`**

(a) Add the import near line 11 (next to the existing `geometrySource` import):

```javascript
import corridorStreetCenterlines from "./data/geometry-source/block-franklin-north.street-centerlines.v0.1.json";
```

(b) Build the merged source once (near where `geometrySource` is first used, before the `buildGroundLayer` call). Dedup by `physicalid`, falling back to name+first-point:

```javascript
const centerlineKey = (r) =>
  r.physicalid != null ? `pid:${r.physicalid}` : `nm:${r.fullStreetName}:${r.wgs84Line?.[0]?.lon},${r.wgs84Line?.[0]?.lat}`;
const mergedGeometrySource = (() => {
  const byKey = new Map();
  for (const r of geometrySource.streetCenterlineRecords ?? []) byKey.set(centerlineKey(r), r);
  for (const r of corridorStreetCenterlines.streetCenterlineRecords ?? []) byKey.set(centerlineKey(r), r); // corridor wins
  return { ...geometrySource, streetCenterlineRecords: [...byKey.values()] };
})();
```

(c) Update the `buildGroundLayer` call (~222-232): pass `mergedGeometrySource`, and delete the multi-line radius-coupling comment + any `contextRadiusMeters` argument:

```javascript
      const groundData = buildGroundLayer({
        projection: scene.projection,
        greenpointAxis: scene.greenpointAxis,
        franklinAxis: scene.franklinAxis,
        geometrySource: mergedGeometrySource,
      });
```

> If `geometrySource` at line ~142 (the other consumer) should also see the corridor streets, leave it as-is — that path feeds building assembly, not ground, and is out of scope (ground-only decouple).

- [ ] **Step 4: Run the full test suite + build**

Run: `npm run test`
Expected: PASS (all suites).

Run: `npm run build`
Expected: build completes, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx src/groundLayer.test.mjs
git commit -m "feat(ground): pave the full corridor; decouple ground extent from the building cull

Merge corridor LION centerlines into the ground source (dedup by physicalid);
remove the 130m radius-coupling comment + arg. Ground now follows the real
street network out to Huron, matching the placed buildings.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Live verifier update + four-angle visual proof

Bring the live geometry verifier in line with the new model and capture visual proof that no bare-ground buildings remain along the corridor.

**Files:**
- Modify: `scripts/verify-b1-intersection-ground.mjs`

**Interfaces:**
- Consumes: merged geometry source (build the same merge as SceneView, or read both packets and concat).
- Produces: pass/fail report asserting extent-from-centerline and full-corridor coverage; no radius assertions.

- [ ] **Step 1: Update the verifier** — in `scripts/verify-b1-intersection-ground.mjs`:

(a) Load and merge the corridor centerlines (mirror the SceneView merge):

```javascript
const corridor = read("src/data/geometry-source/block-franklin-north.street-centerlines.v0.1.json");
const merged = {
  ...geometrySource,
  streetCenterlineRecords: [
    ...(geometrySource.streetCenterlineRecords ?? []),
    ...(corridor.streetCenterlineRecords ?? []),
  ],
};
const ground = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource: merged });
```

(b) Replace the `ground.streets.length === 2` assertion and any radius/`halfLen` checks with:

```javascript
assert(ground.streets.length >= 6, "Expected the spine + corridor cross-streets (>=6).");
assert(ground.streets.some((s) => s.id === "cross-huron-st"), "Huron paved from corridor pull.");
for (const s of ground.streets) {
  assert(typeof s.tMin === "number" && s.tMax > s.tMin, `${s.id} has a non-empty tMin/tMax span.`);
  assert(s.halfLen === undefined, `${s.id} carries no legacy halfLen.`);
}
// every cross-street's extent matches its real endpoint span (±tolerance)
for (const s of ground.streets.filter((x) => x.id.startsWith("cross-"))) {
  const recs = merged.streetCenterlineRecords.filter((r) => `cross-${r.fullStreetName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}` === s.id);
  const pts = recs.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  const ts = pts.map((p) => (p.x - s.center.x) * s.axis.x + (p.z - s.center.z) * s.axis.z);
  assert(Math.abs(s.tMin - Math.min(...ts)) < 1.0 && Math.abs(s.tMax - Math.max(...ts)) < 1.0, `${s.id} extent ≈ real endpoints.`);
}
```

Keep the existing curb/sidewalk/crosswalk-within-roadbed checks (they reference `s.halfWidth`, not `halfLen` — unaffected).

- [ ] **Step 2: Run the verifier**

Run: `node scripts/verify-b1-intersection-ground.mjs`
Expected: prints PASS / no failures; lists the corridor streets including Huron.

- [ ] **Step 3: Run the full verification gate**

Run: `npm run verify`
Expected: all suites + conformance + visual + components + stories + kit-coverage + overrides PASS.

- [ ] **Step 4: Four-angle visual proof**

Start the dev server (`preview_start` if not running), then capture screenshots at all four iso rotation steps focused on the Franklin-north corridor (Greenpoint Ave → Huron). Confirm: pavement runs continuously under the corridor buildings; cross-streets (Huron/Freeman/India) are paved; crosswalk bands land at the new intersections; no building stands on bare ground. Read source + diagnose if any gap remains.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-b1-intersection-ground.mjs
git commit -m "test(ground): live verifier for corridor-wide street-network extent

Merges the corridor centerlines; asserts tMin/tMax spans match real endpoints
and Huron/Franklin-north streets are paved. No radius assertions.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Spec §1 (per-street span, radius removal) → Task 1. ✓
- Spec §2 (unify spine + cross; real Greenpoint, derived/real Franklin) → Task 2. ✓
- Spec §3 (LION pull, corridor packet, no new parsing) → Task 3. ✓
- Spec §4 (merge into source, decouple call site, cull untouched) → Task 4. ✓
- Spec §5 (Node verifier + four-angle screenshots) → Task 5. ✓
- Non-goals (cull semantics, neighborhood-wide, pavement detail) → respected; cull untouched (Task 4 note), scope limited to loaded corridor.

**Placeholder scan:** No "TBD"/"handle edge cases". Two flagged implementer decisions are conditional-but-concrete (bbox confirmation against the block extract; Franklin real-vs-derived branch already coded both ways). The `derived` assertion in Task 4 Step 1 has an explicit both-branches note because the LION return for FRANKLIN ST is data-dependent — the code handles both deterministically.

**Type consistency:** `axisSegments(tMin, tMax, gaps)` used consistently (Tasks 1, helpers). Street object `{ id, name, derived, center, axis, perp, halfWidth, tMin, tMax }` consistent across `buildCrossStreets`, `spineFromCenterline`, `buildFranklin`. `centerlineKey` defined once (Task 4) and reused. Packet field names (`fullStreetName`, `streetWidth`, `wgs84Line`, `physicalid`) match the existing phase-3b shape and the pull-script output.
