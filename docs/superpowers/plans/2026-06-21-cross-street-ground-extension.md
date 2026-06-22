# Cross-Street Ground Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add source-backed cross-streets (Kent, Java, Milton) off Greenpoint Ave — with roadbed, curbs, and sidewalk — so buildings showcased along the spine have ground beneath their street frontage for alignment and completeness validation.

**Architecture:** Generalize the pure module `src/groundLayer.js` from two origin-crossing streets to an N-street list built from real projected centerlines, with multi-gap corner clipping and context-radius reach clamping. A prerequisite data step promotes the cross-street sidewalk records from the raw NYC packet into the processed geometry-source file. Three.js rendering in `SceneView.jsx` is untouched — it already loops over the ground arrays.

**Tech Stack:** JavaScript ES modules, `node --test` (node:test), Three.js (downstream only), Vite dev server for visual verification.

## Global Constraints

- **Truth rule:** geometry derives from NYC Open Data only. Do NOT invent streets. Streets absent from the source packet (Oak/Calyer/Noble) stay absent.
- **Pure module:** `src/groundLayer.js` must stay Three.js-free and Node-runnable.
- **Scene units:** projection scale is `0.075` units/m; `metersToUnits(m) = m * 0.075`. Context radius default `130m` → `9.75` units.
- **Test command:** `node --test src/groundLayer.test.mjs` (subset) / `npm test` (full).
- **Recorded widths (ft):** Greenpoint 50, Franklin 40, Kent/Java/Milton 30. Convert via `FEET_TO_METERS = 0.3048`.
- **Coordinate convention:** a street is `{ id, name, derived, center:{x,z}, axis:{x,z}, perp:{x,z}, halfWidth, halfLen }`. Param `t` runs along `axis` from `center`; `perp = { x: -axis.z, z: axis.x }`.

---

### Task 1: Promote cross-street sidewalk records into the processed geometry source

The processed file `…context.phase-3b.json` currently holds `sidewalkLineRecords` for only GREENPOINT AVE and FRANKLIN ST. The raw packet holds Kent/Java/Milton/West/Manhattan too. This task copies the Kent/Java/Milton records (the ones that land within the context radius) into the processed file, in the processed schema shape, tagging them source-backed. West/Manhattan are intentionally left out — they fall outside the 130m radius and are not needed.

**Files:**
- Modify: `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json` (extend `sidewalkLineRecords`)
- Read: `src/data/geometry-source/raw/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry.phase-3b.raw.json`
- Test: `src/groundLayer.test.mjs` (add a data-presence test)

**Interfaces:**
- Produces: `sidewalkLineRecords` entries with `{ id, source, physicalid, fullStreetName, streetWidth, wgs84Line:[{lon,lat}…], geometryStatus:"source_backed_contextual", claimLimit }` for KENT ST, JAVA ST, MILTON ST. Consumed by Task 3.

- [ ] **Step 1: Write the failing test**

Add to `src/groundLayer.test.mjs`:

```javascript
test("processed geometry source carries Kent/Java/Milton sidewalk centerlines", () => {
  const names = new Set(geometrySource.sidewalkLineRecords.map((r) => r.fullStreetName));
  for (const n of ["KENT ST", "JAVA ST", "MILTON ST"]) assert.ok(names.has(n), `${n} present`);
  for (const r of geometrySource.sidewalkLineRecords) {
    if (["KENT ST", "JAVA ST", "MILTON ST"].includes(r.fullStreetName)) {
      assert.ok(Array.isArray(r.wgs84Line) && r.wgs84Line.length >= 2, `${r.fullStreetName} has wgs84Line`);
      assert.ok(typeof r.wgs84Line[0].lon === "number", "wgs84 point has lon");
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — "KENT ST present" assertion throws (records not yet promoted).

- [ ] **Step 3: Generate the records from the raw packet**

Run this one-off script (writes the merged file in place; uses only the raw NYC packet):

```bash
node --input-type=module -e '
import fs from "node:fs";
const ctxPath = "src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json";
const raw = JSON.parse(fs.readFileSync("src/data/geometry-source/raw/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry.phase-3b.raw.json","utf8"));
const ctx = JSON.parse(fs.readFileSync(ctxPath,"utf8"));
const want = new Set(["KENT ST","JAVA ST","MILTON ST"]);
const existing = new Set(ctx.sidewalkLineRecords.map(r=>r.physicalid));
const flatten = (coords) => (Array.isArray(coords[0][0]) ? coords.flat() : coords);
for (const r of raw.responses.sidewalkLine) {
  const name = (r.full_stree||"").trim();
  if (!want.has(name) || existing.has(String(r.physicalid))) continue;
  ctx.sidewalkLineRecords.push({
    id: `nyc-sidewalk-line-physicalid-${r.physicalid}`,
    source: "nyc-open-data-sidewalk-line-planimetrics",
    physicalid: String(r.physicalid),
    fullStreetName: name,
    streetWidth: r.st_width,
    wgs84Line: flatten(r.the_geom.coordinates).map(([lon,lat]) => ({ lon, lat })),
    geometryStatus: "source_backed_contextual",
    claimLimit: "Official geometry context only; traces street centerline, not curb edge or tenant frontage.",
  });
  existing.add(String(r.physicalid));
}
fs.writeFileSync(ctxPath, JSON.stringify(ctx, null, 2) + "\n");
console.log("sidewalkLineRecords now:", ctx.sidewalkLineRecords.length);
'
```

Expected: prints `sidewalkLineRecords now: 7` (4 existing + Kent + Java + Milton).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: the new test PASSES (existing tests still pass).

- [ ] **Step 5: Commit**

```bash
git add src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json src/groundLayer.test.mjs
git commit -m "data(ground): promote Kent/Java/Milton sidewalk centerlines into context packet

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Multi-gap `axisSegments`

Generalize the single-gap clipper to subtract any number of crossing intervals.

**Files:**
- Modify: `src/groundLayer.js:113-116` (`axisSegments`)
- Test: `src/groundLayer.test.mjs`

**Interfaces:**
- Produces: `axisSegments(halfLen, gaps)` where `gaps` is an array of `{ t0, t1 }` intervals; returns an ordered array of `[t0, t1]` spans covering `[-halfLen, halfLen]` minus the gaps. Consumed by Tasks 4 and 5.

- [ ] **Step 1: Write the failing test**

Add to `src/groundLayer.test.mjs` (import `axisSegments` — it must be exported):

```javascript
import { buildGroundLayer, axisSegments, SIDEWALK_WIDTH_M, CROSSWALK_STRIPE_COUNT } from "./groundLayer.js";

test("axisSegments subtracts multiple gaps and returns ordered spans", () => {
  const segs = axisSegments(10, [{ t0: -6, t1: -4 }, { t0: 1, t1: 3 }]);
  assert.deepEqual(segs, [[-10, -6], [-4, 1], [3, 10]]);
});

test("axisSegments with no gaps returns the full span", () => {
  assert.deepEqual(axisSegments(10, []), [[-10, 10]]);
});

test("axisSegments clamps gaps to the run and drops empty spans", () => {
  assert.deepEqual(axisSegments(5, [{ t0: -9, t1: -5 }, { t0: 5, t1: 9 }]), []);
  assert.deepEqual(axisSegments(5, [{ t0: -1, t1: 1 }]), [[-5, -1], [1, 5]]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — `axisSegments` is not exported / old signature returns wrong shape.

- [ ] **Step 3: Replace `axisSegments`**

In `src/groundLayer.js`, replace the existing function (lines ~113-116) with:

```javascript
// The along-axis spans remaining after removing each crossing interval from a
// full [-halfLen, halfLen] run. `gaps` is an array of { t0, t1 } (unordered ok).
// Returns ordered [t0, t1] spans; empty spans are dropped.
export function axisSegments(halfLen, gaps) {
  const merged = [...gaps]
    .map((g) => ({ t0: Math.max(-halfLen, Math.min(g.t0, g.t1)), t1: Math.min(halfLen, Math.max(g.t0, g.t1)) }))
    .filter((g) => g.t1 > g.t0)
    .sort((a, b) => a.t0 - b.t0);
  const spans = [];
  let cursor = -halfLen;
  for (const g of merged) {
    if (g.t0 > cursor) spans.push([cursor, g.t0]);
    cursor = Math.max(cursor, g.t1);
  }
  if (cursor < halfLen) spans.push([cursor, halfLen]);
  return spans;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: the three new `axisSegments` tests PASS. (Other tests may now FAIL because callers still pass the old `gap` scalar — fixed in Task 4. That is expected mid-refactor.)

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "feat(ground): multi-gap axisSegments

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Build the street list from projected centerlines (cross-streets included)

Add the geometry that turns sidewalk centerline records into positioned cross-streets and assembles the full street list.

**Files:**
- Modify: `src/groundLayer.js` (new helpers + rework the `streets` array in `buildGroundLayer`)
- Test: `src/groundLayer.test.mjs`

**Interfaces:**
- Consumes: `geometrySource.sidewalkLineRecords` (Task 1), `projection`, `greenpointAxis`, `franklinAxis`, `contextRadiusMeters` (new optional arg, default 130).
- Produces: each street object now carries `center`, `axis`, `perp`, `halfWidth`, `halfLen`, `derived`. Cross-streets ids are `cross-<slug>` (e.g. `cross-kent-st`). Consumed by Task 4/5.

- [ ] **Step 1: Write the failing test**

Add to `src/groundLayer.test.mjs`:

```javascript
test("street list includes source-backed crossers within the context radius", () => {
  const ids = ground.streets.map((s) => s.id);
  assert.ok(ids.includes("greenpoint-ave") && ids.includes("franklin-st"), "spine present");
  for (const id of ["cross-kent-st", "cross-java-st", "cross-milton-st"]) {
    assert.ok(ids.includes(id), `${id} present`);
  }
});

test("cross-streets are marked derived:false and centered on the Greenpoint line", () => {
  for (const id of ["cross-kent-st", "cross-java-st", "cross-milton-st"]) {
    const s = ground.streets.find((x) => x.id === id);
    assert.equal(s.derived, false, `${id} is source-backed`);
    // center lies on the Greenpoint centerline (through origin along greenpointAxis):
    const perpOff = s.center.x * franklinAxis.x + s.center.z * franklinAxis.z;
    assert.ok(Math.abs(perpOff) < 0.2, `${id} center on Greenpoint line`);
  }
});

test("cross-street reach is clamped to the context circle", () => {
  const R = projection.metersToUnits(130);
  for (const id of ["cross-kent-st", "cross-java-st", "cross-milton-st"]) {
    const s = ground.streets.find((x) => x.id === id);
    const d = Math.hypot(s.center.x, s.center.z);
    assert.ok(Math.abs(s.halfLen - Math.sqrt(R * R - d * d)) < 0.05, `${id} halfLen = sqrt(R^2 - d^2)`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — no `cross-kent-st` in the street list yet.

- [ ] **Step 3: Add helpers and build cross-streets**

In `src/groundLayer.js`, add these helpers near the other pure functions:

```javascript
// Merge a street's (possibly multi-segment) sidewalk centerline records into a
// single projected polyline, then reduce to the two furthest-apart endpoints.
function projectStreetEndpoints(records, projection) {
  const pts = records.flatMap((r) => r.wgs84Line.map((p) => projection.project(p)));
  let best = [pts[0], pts[1]];
  let bestD = -1;
  for (let i = 0; i < pts.length; i += 1)
    for (let j = i + 1; j < pts.length; j += 1) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z);
      if (d > bestD) { bestD = d; best = [pts[i], pts[j]]; }
    }
  return best;
}

// Intersection of line P (point p0, dir dp) with line Q (point q0, dir dq).
// Returns the point, or null if near-parallel.
function lineIntersect(p0, dp, q0, dq) {
  const denom = dp.x * dq.z - dp.z * dq.x;
  if (Math.abs(denom) < 1e-6) return null;
  const t = ((q0.x - p0.x) * dq.z - (q0.z - p0.z) * dq.x) / denom;
  return { x: p0.x + dp.x * t, z: p0.z + dp.z * t };
}

const slug = (name) => "cross-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Source-backed cross-streets off Greenpoint, within the context radius, each
// positioned at its real intersection with the Greenpoint centerline and
// reach-clamped to the context circle.
function buildCrossStreets({ geometrySource, projection, greenpointAxis, contextRadiusUnits }) {
  const records = geometrySource.sidewalkLineRecords ?? [];
  const byName = new Map();
  for (const r of records) {
    const n = r.fullStreetName;
    if (n === "GREENPOINT AVE" || n === "FRANKLIN ST") continue; // spine handled separately
    if (!byName.has(n)) byName.set(n, []);
    byName.get(n).push(r);
  }
  const gpOrigin = { x: 0, z: 0 }; // Greenpoint passes through the intersection origin
  const out = [];
  for (const [name, recs] of byName) {
    const [a, b] = projectStreetEndpoints(recs, projection);
    const v = { x: b.x - a.x, z: b.z - a.z };
    const len = Math.hypot(v.x, v.z) || 1;
    const axis = { x: v.x / len, z: v.z / len };
    const center = lineIntersect(a, axis, gpOrigin, greenpointAxis);
    if (!center) continue; // near-parallel to Greenpoint — no usable crossing
    const d = Math.hypot(center.x, center.z);
    if (d >= contextRadiusUnits) continue; // outside the build boundary
    const widthFt = Number.parseFloat(recs[0].streetWidth ?? String(DEFAULT_STREET_WIDTH_FT));
    out.push({
      id: slug(name),
      name,
      derived: false,
      center,
      axis,
      perp: { x: -axis.z, z: axis.x },
      halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
      halfLen: Math.sqrt(contextRadiusUnits * contextRadiusUnits - d * d),
    });
  }
  return out.sort((s1, s2) => s1.id.localeCompare(s2.id));
}
```

Update `makeStreet` to record `center` and `perp` explicitly (the spine streets pass through the origin):

```javascript
function makeStreet({ id, axis, perp, widthFt, derived, projection, halfLen }) {
  return {
    id,
    axis,
    perp,
    center: { x: 0, z: 0 },
    halfLen,
    halfWidth: projection.metersToUnits((widthFt * FEET_TO_METERS) / 2),
    derived,
  };
}
```

In `buildGroundLayer`, accept the new arg and append cross-streets to the list. Change the signature and the `streets` assembly:

```javascript
export function buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource, contextRadiusMeters = 130 }) {
  const swUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  const halfLen = projection.metersToUnits(ROADBED_HALF_LENGTH_M);
  const contextRadiusUnits = projection.metersToUnits(contextRadiusMeters);

  const spine = [
    makeStreet({ id: "greenpoint-ave", axis: greenpointAxis, perp: franklinAxis,
      widthFt: streetWidthFt(geometrySource, "GREENPOINT AVE", 50), derived: false, projection, halfLen }),
    makeStreet({ id: "franklin-st", axis: franklinAxis, perp: greenpointAxis,
      widthFt: streetWidthFt(geometrySource, "FRANKLIN ST", DEFAULT_STREET_WIDTH_FT), derived: true, projection, halfLen }),
  ];
  const crosses = buildCrossStreets({ geometrySource, projection, greenpointAxis, contextRadiusUnits });
  const streets = [...spine, ...crosses];
  // ... rest reworked in Task 4
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: the three new Task-3 tests PASS. (Roadbed/curb/sidewalk/crosswalk tests still fail until Task 4 — expected.)

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "feat(ground): build source-backed cross-streets from projected centerlines

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Rework roadbeds, curbs, and sidewalks for N streets with multi-gap clipping

Replace the single-crosser clipping with per-street crossing detection so the spine gets a gap at every crosser and each crosser gets a gap at Greenpoint.

**Files:**
- Modify: `src/groundLayer.js:45-77` (roadbeds, curbs, sidewalks blocks)
- Test: `src/groundLayer.test.mjs` (update existing curb/sidewalk tests to N streets)

**Interfaces:**
- Consumes: `streets` (Task 3), `axisSegments(halfLen, gaps)` (Task 2).
- Produces: `roadbeds`, `curbs`, `sidewalks` arrays keyed by `streetId` for all streets. `crossingGaps(street, streets)` helper returns the `{ t0, t1 }` gaps along a street.

- [ ] **Step 1: Write the failing test**

Update the existing curb/sidewalk count tests to not assume two streets, and add a crossing-gap test. Replace the `"every street yields exactly two curb lines…"` and `"each curb carries a sidewalk band…"` tests' hard-coded `perp` selection with the street's own `perp`, and add:

```javascript
test("Greenpoint sidewalk is split into a segment per crossing gap", () => {
  const crossers = ground.streets.filter((s) => s.id.startsWith("cross-"));
  const gp = ground.streets.find((s) => s.id === "greenpoint-ave");
  const walk = ground.sidewalks.find((w) => w.streetId === "greenpoint-ave");
  // one gap at Franklin (origin) + one per cross-street ⇒ at least crossers+2 segments
  assert.ok(walk.segments.length >= crossers.length + 1, "greenpoint sidewalk split at each crossing");
  // every segment stays clear of each crosser's roadbed half-width along greenpoint
  for (const seg of walk.segments) {
    for (const p of seg) {
      const t = (p.x - gp.center.x) * gp.axis.x + (p.z - gp.center.z) * gp.axis.z;
      for (const c of [...crossers, ground.streets.find((s) => s.id === "franklin-st")]) {
        const tc = (c.center.x - gp.center.x) * gp.axis.x + (c.center.z - gp.center.z) * gp.axis.z;
        assert.ok(Math.abs(t - tc) >= c.halfWidth - 1e-6, "greenpoint sidewalk clear of crossing");
      }
    }
  }
});
```

Also update the existing `"each curb carries a sidewalk band…"` and `"every street yields exactly two curb lines…"` tests to use `s.perp` (already on the street) instead of the `id === "greenpoint-ave" ? franklinAxis : greenpointAxis` ternary:

```javascript
test("every street yields exactly two curb lines, both off-center on opposite sides", () => {
  for (const s of ground.streets) {
    const curbs = ground.curbs.filter((c) => c.streetId === s.id);
    assert.equal(curbs.length, 2, `${s.id} has 2 curbs`);
    const sides = curbs.map((c) => Math.sign(c.segments[0]?.[0].x * s.perp.x + c.segments[0]?.[0].z * s.perp.z));
    assert.notEqual(sides[0], sides[1], `${s.id} curbs on opposite sides`);
  }
});

test("each curb carries a sidewalk band ~SIDEWALK_WIDTH_M wide", () => {
  const wantUnits = projection.metersToUnits(SIDEWALK_WIDTH_M);
  for (const s of ground.streets) {
    const walks = ground.sidewalks.filter((w) => w.streetId === s.id);
    assert.equal(walks.length, 2, `${s.id} has 2 sidewalk bands`);
    for (const w of walks)
      for (const seg of w.segments)
        assert.ok(Math.abs(polyWidth(seg, s.perp) - wantUnits) < 0.05, "band width ≈ SIDEWALK_WIDTH_M");
  }
});
```

Delete the old `"sidewalks never intrude past the cross street's roadbed"` test (it assumes a single `other` street); the new Greenpoint-split test supersedes it.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — current code still uses `otherHalf`/scalar gaps; Greenpoint has only the single Franklin gap.

- [ ] **Step 3: Rework the roadbed/curb/sidewalk blocks**

In `src/groundLayer.js`, replace the `otherHalf`/`curbs`/`sidewalks` blocks (lines ~55-77) with crossing-aware versions:

```javascript
  // Every street that this street crosses within its own extent contributes a
  // gap (centered at the crossing, as wide as the crossed street's roadbed).
  const crossingGaps = (s) => {
    const gaps = [];
    for (const o of streets) {
      if (o === s) continue;
      const cross = lineIntersect(s.center, s.axis, o.center, o.axis);
      if (!cross) continue;
      const t = (cross.x - s.center.x) * s.axis.x + (cross.z - s.center.z) * s.axis.z;
      if (Math.abs(t) > s.halfLen) continue; // crossing is off this street's drawn run
      gaps.push({ t0: t - o.halfWidth, t1: t + o.halfWidth });
    }
    return gaps;
  };

  const roadbeds = streets.map((s) => ({
    streetId: s.id,
    derived: s.derived,
    polygon: bandPolygon(s, -s.halfWidth, s.halfWidth),
  }));

  const curbs = streets.flatMap((s) => {
    const gaps = crossingGaps(s);
    return [s.halfWidth, -s.halfWidth].map((off) => ({
      streetId: s.id,
      derived: s.derived,
      segments: axisSegments(s.halfLen, gaps).map(([t0, t1]) => edgeLine(s, off, t0, t1)),
    }));
  });

  const sidewalks = streets.flatMap((s) => {
    const gaps = crossingGaps(s);
    const bands = [
      { side: "pos", a: s.halfWidth, b: s.halfWidth + swUnits },
      { side: "neg", a: -(s.halfWidth + swUnits), b: -s.halfWidth },
    ];
    return bands.map(({ side, a, b }) => ({
      streetId: s.id,
      derived: s.derived,
      side,
      segments: axisSegments(s.halfLen, gaps).map(([t0, t1]) => bandPolygon(s, a, b, t0, t1)),
    }));
  });
```

`lineIntersect` is already defined (Task 3). `bandPolygon`/`edgeLine` already accept `(street, …, tMin, tMax)` and use `street.center` + `street.axis`, so off-origin cross-streets work unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: all curb/sidewalk tests including the new Greenpoint-split test PASS. Crosswalk test still fails until Task 5.

- [ ] **Step 5: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "feat(ground): multi-gap roadbed/curb/sidewalk clipping for N streets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Crosswalks at every real intersection

Emit a crosswalk band per street-pair crossing instead of one per street at the origin.

**Files:**
- Modify: `src/groundLayer.js:79-83` (crosswalks block) and `crosswalkStripes` (lines ~138-153)
- Test: `src/groundLayer.test.mjs` (update the crosswalk test)

**Interfaces:**
- Consumes: `streets`, `lineIntersect`.
- Produces: `crosswalks` array of `{ streetId, derived, atStreetId, stripes }`, one entry per (street, crossed-street) pair. `crosswalkStripes(street, tCenter, setback, depth)` now takes the along-axis center of the crossing.

- [ ] **Step 1: Write the failing test**

Replace the existing crosswalk test with:

```javascript
test("a crosswalk band sits at every real street crossing, inside the roadbed", () => {
  // Each crosser crosses Greenpoint and Greenpoint crosses each crosser+Franklin,
  // so there are at least 2 * (#crossers + 1) bands.
  const crossers = ground.streets.filter((s) => s.id.startsWith("cross-")).length;
  assert.ok(ground.crosswalks.length >= 2 * (crossers + 1) - 1, "a band per crossing approach");
  for (const cw of ground.crosswalks) {
    const s = ground.streets.find((x) => x.id === cw.streetId);
    assert.equal(cw.stripes.length, CROSSWALK_STRIPE_COUNT);
    const half = s.halfWidth + 0.01;
    for (const stripe of cw.stripes)
      for (const p of stripe) {
        const off = (p.x - s.center.x) * s.perp.x + (p.z - s.center.z) * s.perp.z;
        assert.ok(Math.abs(off) <= half, "stripe within roadbed width");
      }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/groundLayer.test.mjs`
Expected: FAIL — `ground.crosswalks` still has exactly 2 entries.

- [ ] **Step 3: Rework crosswalks and `crosswalkStripes`**

Replace the crosswalks block:

```javascript
  const depth = projection.metersToUnits(CROSSWALK_DEPTH_M);
  const crosswalks = [];
  for (const s of streets) {
    for (const o of streets) {
      if (o === s) continue;
      const cross = lineIntersect(s.center, s.axis, o.center, o.axis);
      if (!cross) continue;
      const t = (cross.x - s.center.x) * s.axis.x + (cross.z - s.center.z) * s.axis.z;
      if (Math.abs(t) > s.halfLen) continue;
      crosswalks.push({
        streetId: s.id,
        atStreetId: o.id,
        derived: s.derived,
        stripes: crosswalkStripes(s, t, o.halfWidth, depth),
      });
    }
  }
```

Replace `crosswalkStripes` to center on the crossing `tCenter` rather than the origin. The band is set just past the crossed street's curb on the approach toward the crossing (sign points back toward `center`):

```javascript
function crosswalkStripes(street, tCenter, setback, depth) {
  const { axis, perp, center } = street;
  const dir = tCenter >= 0 ? 1 : -1;       // approach band on the origin-facing side of the crossing
  const inner = tCenter - dir * setback;   // just past the crossed street's curb
  const t0 = inner - dir * depth;
  const lo = Math.min(t0, inner);
  const hi = Math.max(t0, inner);
  const wPos = street.halfWidth;
  const wNeg = -street.halfWidth;
  const slot = (hi - lo) / (CROSSWALK_STRIPE_COUNT * 2 - 1);
  const at = (t, off) => ({ x: center.x + axis.x * t + perp.x * off, z: center.z + axis.z * t + perp.z * off });
  const stripes = [];
  for (let i = 0; i < CROSSWALK_STRIPE_COUNT; i += 1) {
    const a = lo + slot * (i * 2);
    const b = a + slot;
    stripes.push([at(a, wNeg), at(b, wNeg), at(b, wPos), at(a, wPos)]);
  }
  return stripes;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/groundLayer.test.mjs`
Expected: all tests in the file PASS.

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: PASS (the ground tests are the only ones touching this module; confirm no regressions elsewhere).

- [ ] **Step 6: Commit**

```bash
git add src/groundLayer.js src/groundLayer.test.mjs
git commit -m "feat(ground): crosswalk band at every real street crossing

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Wire the context radius through and verify in Scene

Ensure `buildGroundLayer` receives the same `contextRadiusMeters` the scene uses for culling, then visually verify the cross-streets render under the showcased buildings.

**Files:**
- Modify: the call site of `buildGroundLayer` (search for it; likely `src/sceneFrame.js` or `src/phase4bRuntimeScene.js`)
- Verify: browser via preview tools

**Interfaces:**
- Consumes: `buildGroundLayer({ …, contextRadiusMeters })`.

- [ ] **Step 1: Find the call site**

Run: `grep -rn "buildGroundLayer" src/`
Expected: one production call site (plus the test). Note its file and surrounding `contextRadiusMeters`/`contextRadiusUnits` variable.

- [ ] **Step 2: Pass the context radius**

Add `contextRadiusMeters` to the `buildGroundLayer({ … })` call, using the same value the scene culls with (default `130`). If the surrounding scope only has `contextRadiusUnits`, pass `contextRadiusMeters` from the same config that produced it. Example edit:

```javascript
const ground = buildGroundLayer({ projection, greenpointAxis, franklinAxis, geometrySource, contextRadiusMeters });
```

- [ ] **Step 3: Run the full suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Start the dev server and verify visually**

- Start the preview server (`preview_start`, dev server at `http://127.0.0.1:5173`).
- Reload, check `preview_console_logs` for errors.
- `preview_screenshot` in Scene mode. Confirm: roads + sidewalks now run up Kent/Java/Milton off Greenpoint; showcased buildings on those streets sit on sidewalk, not bare ground; no concrete painted across the Greenpoint roadway at the new corners; crosswalks appear at the new intersections.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ground): wire context radius into cross-street ground build + verify in scene

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** source-backed only (Task 1 promotes only Kent/Java/Milton; never invents) ✓; all source-backed crossers within radius (Task 3 selection rule; West/Manhattan auto-excluded at d > R) ✓; reach = sqrt(R²−d²) (Task 3) ✓; multi-gap clipping (Tasks 2,4) ✓; crosswalks per intersection (Task 5) ✓; downstream untouched (Task 6 only adds an arg) ✓; TDD throughout ✓.
- **Type consistency:** `axisSegments(halfLen, gaps[])` defined Task 2, used Tasks 4-5; `lineIntersect`, `projectStreetEndpoints`, `slug`, `buildCrossStreets` defined Task 3, used Tasks 4-5; street shape `{id,name,derived,center,axis,perp,halfWidth,halfLen}` consistent across tasks; `crosswalkStripes(street, tCenter, setback, depth)` signature matched between definition and caller in Task 5.
- **Known near-miss:** West St (d≈10.5u) sits ~0.8u beyond the 9.75u radius and is excluded by design. To include it later, raise `contextRadiusMeters` to ~145 — no code change needed.
