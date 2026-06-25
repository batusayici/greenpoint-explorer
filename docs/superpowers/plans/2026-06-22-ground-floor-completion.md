# Ground-Floor Completion + Frontage Accuracy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every kit/inked building a finished street level — residential entry door + recessed ground-floor windows, commercial storefronts — landing on the true street frontage(s) including both sides of a corner lot.

**Architecture:** A pure composer (`inkedFacadeCompose.js`) gains a ground-floor opening row; the renderer (`decorateInkedWall`) consumes it for residential ground floors. A pure frontage helper (`streetFaceSelect.js`) returns the set of faces that front a street + the primary; the kit branch of `buildBuildings` uses it to wrap openings onto all frontages, put the entrance on the primary, and miter the cornice at wrapped corners (reusing the hero corner machinery). Commercial buildings get `params.storefront` wired from the existing storefront roster, with the block sign system suppressed for kit buildings to avoid double signage.

**Tech Stack:** React 19 + Three.js + Vite; pure geometry modules tested with `node --test` (`node:test`).

## Global Constraints

- **Pure modules stay Node-runnable, no Three.js:** `src/inkedFacadeCompose.js` and `src/streetFaceSelect.js` import no Three.js. (Source: existing module headers.)
- **Scope = kit/inked path only:** only the `decorateInkedWall` / `inkedKit` treatment path changes. Hero (INKED_FACADE_REAL) and typological (`decorateTypologicalWall`) paths stay behavior-identical. (Source: spec, Decision.)
- **Truth — signage:** storefront signs show **category labels only** unless a bay is claimed; use the existing `resolveSignLabel(bay)` (`src/storefrontSigns.js:39`). Never the raw roster business name on an unclaimed bay. (Source: spec §2; claim-monetization model.)
- **Out of scope:** building color/material variation; the broad wall-skin corner gap (only the cornice miter at wrapped corners is in scope); wrapped-corner storefronts (corner commercial gets the storefront on the primary frontage only); new art assets. (Source: spec Non-goals.)
- **Coordinate / sizing conventions:** facade composition is in face-local fractions `x0..x1, y0..y1` ∈ [0,1]; `projection.scale` is units-per-meter (`upm`). (Source: `inkedFacadeCompose.js`, `decorateInkedWall`.)
- **Tests:** `npm run test` runs `node --test "src/**/*.test.mjs"`. Full gate: `npm run verify`. Build: `npm run build`.
- **Commit frequently** — one commit per task minimum; end PR-less (no push without Batu).

---

## File Structure

- `src/inkedFacadeCompose.js` — **modified.** Add a ground-floor opening row (`groundWindows`, `door`, `doorBay`) to the composed facade. Pure.
- `src/inkedFacadeCompose.test.mjs` — **created/modified.** Tests for the ground row.
- `src/streetFaceSelect.js` — **modified.** Add `pickStreetFrontages` (the frontage *set* + primary) beside the existing single-face `pickStreetFrontEdge`. Pure.
- `src/streetFaceSelect.test.mjs` — **created/modified.** Tests for `pickStreetFrontages`.
- `src/SceneView.jsx` — **modified.** (a) `decorateInkedWall`: residential ground branch consumes the composed row; add an `isFrontage` window gate. (b) kit branch of `buildBuildings`: multi-frontage selection + corner miter. (c) lift storefront bays-by-bin to a shared step; set `params.storefront` for commercial kit buildings; suppress the block sign system for kit-routed bins.

---

## Task 1: Compose the ground-floor opening row

Extend the pure facade composer to emit a ground-floor row of window rects plus one door rect, in the same bay columns as the upper floors. The door bay is the bay nearest the horizontal center of the face.

**Files:**
- Modify: `src/inkedFacadeCompose.js`
- Test: `src/inkedFacadeCompose.test.mjs`

**Interfaces:**
- Consumes: nothing new.
- Produces: `composeInkedFacade({ storeys, bays, corniceFrac?, winWFrac?, winHFrac?, doorHFrac? })` now also returns `groundWindows: Array<{x0,y0,x1,y1}>`, `door: {x0,y0,x1,y1} | null`, and `doorBay: number` (the bay index holding the door). Existing `wall`, `ground`, `cornice`, `windows` are unchanged.

- [ ] **Step 1: Write the failing tests** — add to `src/inkedFacadeCompose.test.mjs` (create the file if absent; if present, append). Use the existing import style.

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { composeInkedFacade } from "./inkedFacadeCompose.js";

test("ground row: one door bay + a window in every other bay", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.equal(f.doorBay, 1, "3 bays -> middle bay is the door bay");
  assert.equal(f.groundWindows.length, 2, "remaining bays get a ground window");
  assert.ok(f.door, "a door rect is emitted");
});

test("ground row: door bay nearest center, ties to lower index", () => {
  const f = composeInkedFacade({ storeys: 3, bays: 4 });
  assert.equal(f.doorBay, 1, "4 bays -> bays 1 and 2 tie; lower index wins");
});

test("ground openings sit inside the ground-storey band", () => {
  const storeys = 5;
  const f = composeInkedFacade({ storeys, bays: 4 });
  const groundFrac = 1 / storeys;
  for (const w of f.groundWindows) {
    assert.ok(w.y0 >= 0 && w.y1 <= groundFrac + 1e-9, "ground window within [0, groundFrac]");
  }
  assert.equal(f.door.y0, 0, "door meets the sidewalk");
  assert.ok(f.door.y1 <= groundFrac + 1e-9, "door stays within the ground storey");
});

test("upper window grid is unchanged by the ground row", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.equal(f.windows.length, (4 - 1) * 3, "upper windows = (storeys-1) * bays");
});

test("single-bay building: the only bay is the door bay, no ground windows", () => {
  const f = composeInkedFacade({ storeys: 3, bays: 1 });
  assert.equal(f.doorBay, 0);
  assert.equal(f.groundWindows.length, 0);
  assert.ok(f.door);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test src/inkedFacadeCompose.test.mjs`
Expected: FAIL — `f.doorBay`/`f.groundWindows`/`f.door` are `undefined`.

- [ ] **Step 3: Implement the ground row** in `src/inkedFacadeCompose.js`. Change the signature to accept `doorHFrac` and append the ground-row computation before the `return`.

Replace the signature line:

```javascript
export function composeInkedFacade({ storeys, bays, corniceFrac = 0.06, winWFrac = 0.5, winHFrac = 0.55 }) {
```

with:

```javascript
export function composeInkedFacade({ storeys, bays, corniceFrac = 0.06, winWFrac = 0.5, winHFrac = 0.55, doorHFrac = 0.82 }) {
```

Then replace the final `return { wall, ground, cornice, windows };` with:

```javascript
  // Ground-floor opening row: a window in each bay column (same rhythm as the
  // upper floors), except the door bay — the bay whose center is nearest the
  // horizontal center of the face (ties -> lower index) — which carries the
  // entry door. Door meets the sidewalk (y0 = 0); windows are centered in the
  // ground band.
  let doorBay = 0;
  let bestD = Infinity;
  for (let c = 0; c < b; c += 1) {
    const d = Math.abs((c + 0.5) / b - 0.5);
    if (d < bestD - 1e-9) { bestD = d; doorBay = c; } // strict < keeps the lower index on ties
  }
  const groundWindows = [];
  let door = null;
  const gMid = groundFrac / 2;
  for (let c = 0; c < b; c += 1) {
    const cxMid = c * cellW + cellW / 2;
    if (c === doorBay) {
      door = {
        x0: cxMid - (cellW * winWFrac) / 2,
        x1: cxMid + (cellW * winWFrac) / 2,
        y0: 0,
        y1: groundFrac * doorHFrac,
      };
    } else {
      groundWindows.push({
        x0: cxMid - (cellW * winWFrac) / 2,
        x1: cxMid + (cellW * winWFrac) / 2,
        y0: gMid - (groundFrac * winHFrac) / 2,
        y1: gMid + (groundFrac * winHFrac) / 2,
      });
    }
  }

  return { wall, ground, cornice, windows, groundWindows, door, doorBay };
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test src/inkedFacadeCompose.test.mjs`
Expected: PASS (all, including the unchanged upper-window test).

- [ ] **Step 5: Commit**

```bash
git add src/inkedFacadeCompose.js src/inkedFacadeCompose.test.mjs
git commit -m "feat(facade): compose a ground-floor opening row (windows + door bay)

composeInkedFacade now emits groundWindows + a door rect (door bay nearest
the face center, ties to lower index). Upper window grid unchanged.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Render the residential ground floor (recessed windows + entry door)

Replace the flat ground-band branch for non-stoop residential kit buildings with the composed recessed window row + recessed door, reusing the existing `drawWindow`/`drawDoor` true-recess code. This fixes the "no door" (#1) and "flat/uncolored ground windows" (#2) defects for residential buildings.

**Files:**
- Modify: `src/SceneView.jsx` (`decorateInkedWall`, the non-stoop `else` branch at ~2420–2431)

**Interfaces:**
- Consumes: `f.groundWindows`, `f.door` from Task 1 (`f = composeInkedFacade(...)`, already in scope at `SceneView.jsx:2213`); existing `drawWindow(rect)` and `drawDoor(x0, x1, y0Frac, y1Frac)` helpers (defined within `decorateInkedWall`; `drawDoor` already falls back to a flat leaf when the family has no door art, `SceneView.jsx:2361–2366`).
- Produces: no new exports.

- [ ] **Step 1: Make the change.** In `src/SceneView.jsx`, replace the non-stoop residential branch. Current code (~2420–2431):

```javascript
      } else {
        const groundFile = kitFile(groundFamily, "ground");
        if (groundFile) {
          // Modern/flat: door + storefront are baked flush in the ground texture
          // (correct for a flat-front building); only the upper windows recess.
          quad(f.ground, 0.006, inkedTexture(groundFile), { tint: groundTint });
        } else if (isKit && params.components?.["door-stoop"] !== false && kitHas(groundFamily, "door-stoop")) {
          const hF = Math.min(0.34, f.ground.y1);
          const wF = (hF * heightM) * (1086 / 1448) / frontM;
          quad({ x0: 0.5 - wF / 2, x1: 0.5 + wF / 2, y0: 0, y1: hF }, 0.01, inkedTexture(kitFile(groundFamily, "door-stoop")), { transparent: true });
        }
      }
```

Replace with:

```javascript
      } else {
        // Residential non-stoop: recessed ground-floor windows + one recessed
        // entry door, mirroring the upper-floor rhythm (replaces the old flat
        // ground-band texture / flat door-stoop PNG / draw-nothing paths). The
        // door is part of the composed row, so EVERY residential building gets
        // an entry regardless of whether its family has door-stoop art.
        for (const w of f.groundWindows) drawWindow(w);
        if (f.door) drawDoor(f.door.x0, f.door.x1, f.door.y0, f.door.y1);
      }
```

- [ ] **Step 2: Build to verify no errors**

Run: `npm run build`
Expected: build completes, no errors.

- [ ] **Step 3: Full test suite (no regressions)**

Run: `npm run test`
Expected: PASS (all suites — this change is renderer-only; the composer test from Task 1 covers the data).

- [ ] **Step 4: Visual spot-check** (renderer change; pure unit tests can't cover Three.js draw calls)

Start the dev server (`preview_start`), focus a non-stoop residential kit building (e.g. a `modern-flat` or short-`brick` lot), and confirm: the ground floor shows recessed, colored windows in the bay rhythm and a recessed entry door — no flat dark band, no doorless building. Read source + fix if a building still shows a flat band.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(facade): residential ground floor renders recessed windows + entry door

Non-stoop kit residential buildings now draw the composed ground-row windows
and a recessed door (via drawWindow/drawDoor) instead of a flat ground band.
Fixes doorless buildings and uncolored/flat ground windows.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Street-frontage selection helper (the set, not one face)

Add a pure helper that returns every exposed face fronting a street plus the primary frontage (where the entrance/storefront goes). Models on the existing `pickStreetFrontEdge` scoring but returns the full set, and chooses the primary by street width.

**Files:**
- Modify: `src/streetFaceSelect.js`
- Test: `src/streetFaceSelect.test.mjs`

**Interfaces:**
- Consumes: `edges` (each `{ tangent:{x,z}, normal:{x,z}, midpoint:{x,z}, length }`, unit tangent/normal), `exposed: boolean[]`, `streets: Array<{ a:{x,z}, b:{x,z}, width?:number }>`.
- Produces: `pickStreetFrontages(edges, exposed, streets, minParallel = 0.6)` → `{ indices: number[], primary: number }`. `indices` = every exposed edge that fronts a parallel street (each scored > 0), sorted ascending. `primary` = the frontage facing the widest street (tie → longer edge.length → lower index), or `-1` if `indices` is empty.

- [ ] **Step 1: Write the failing tests** — add to `src/streetFaceSelect.test.mjs` (create if absent; otherwise append).

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickStreetFrontages } from "./streetFaceSelect.js";

// A unit square footprint centered at origin, edges with outward normals.
// edge 0: south side (normal -z), edge 1: east (normal +x),
// edge 2: north (normal +z), edge 3: west (normal -x).
const SQUARE = [
  { tangent: { x: 1, z: 0 }, normal: { x: 0, z: -1 }, midpoint: { x: 0, z: -1 }, length: 2 },
  { tangent: { x: 0, z: 1 }, normal: { x: 1, z: 0 }, midpoint: { x: 1, z: 0 }, length: 2 },
  { tangent: { x: 1, z: 0 }, normal: { x: 0, z: 1 }, midpoint: { x: 0, z: 1 }, length: 2 },
  { tangent: { x: 0, z: 1 }, normal: { x: -1, z: 0 }, midpoint: { x: -1, z: 0 }, length: 2 },
];

test("corner lot: two perpendicular frontages, primary is the wider street", () => {
  // A street parallel to the south edge (runs along x) below it, width 50;
  // a street parallel to the east edge (runs along z) to its right, width 30.
  const streets = [
    { a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 50 }, // south frontage (edge 0)
    { a: { x: 3, z: -5 }, b: { x: 3, z: 5 }, width: 30 },   // east frontage (edge 1)
  ];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.deepEqual(r.indices, [0, 1], "both perpendicular street faces are frontages");
  assert.equal(r.primary, 0, "primary = the wider (50ft) street face");
});

test("mid-block lot: one frontage", () => {
  const streets = [{ a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 40 }];
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], streets);
  assert.deepEqual(r.indices, [0]);
  assert.equal(r.primary, 0);
});

test("a blocked (non-exposed) frontage is not selected", () => {
  const streets = [{ a: { x: -5, z: -3 }, b: { x: 5, z: -3 }, width: 40 }];
  const r = pickStreetFrontages(SQUARE, [false, true, true, true], streets);
  assert.deepEqual(r.indices, [], "south face fronts the street but is party-walled");
  assert.equal(r.primary, -1);
});

test("no parallel street: empty result", () => {
  const r = pickStreetFrontages(SQUARE, [true, true, true, true], []);
  assert.deepEqual(r.indices, []);
  assert.equal(r.primary, -1);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test src/streetFaceSelect.test.mjs`
Expected: FAIL — `pickStreetFrontages` is not exported.

- [ ] **Step 3: Implement** `pickStreetFrontages` in `src/streetFaceSelect.js`. Add at the end of the file (it reuses the file's existing `nearestOnLine`).

```javascript
// Among EXPOSED edges, every one that fronts a parallel street (the multi-
// frontage generalization of pickStreetFrontEdge: a corner lot returns two
// perpendicular frontages). Each frontage records the width of the street it
// faces so a primary can be chosen. Returns { indices, primary } where primary
// = the frontage on the widest street (tie -> longer edge -> lower index), or
// -1 when nothing fronts a street.
export function pickStreetFrontages(edges, exposed, streets, minParallel = 0.6) {
  const found = []; // { i, width }
  for (let i = 0; i < edges.length; i += 1) {
    if (!exposed[i]) continue;
    const e = edges[i];
    let score = 0;
    let width = 0;
    for (const st of streets) {
      let sdx = st.b.x - st.a.x;
      let sdz = st.b.z - st.a.z;
      const sl = Math.hypot(sdx, sdz) || 1;
      sdx /= sl; sdz /= sl;
      const parallel = Math.abs(e.tangent.x * sdx + e.tangent.z * sdz);
      if (parallel < minParallel) continue;
      const np = nearestOnLine(e.midpoint, st);
      const tx = np.x - e.midpoint.x;
      const tz = np.z - e.midpoint.z;
      const dist = Math.hypot(tx, tz) || 1e-6;
      const facing = (e.normal.x * tx + e.normal.z * tz) / dist;
      if (facing <= 0.2) continue; // edge must point toward the street
      const s = (parallel * facing) / dist;
      if (s > score) { score = s; width = st.width ?? 0; }
    }
    if (score > 0) found.push({ i, width });
  }
  const indices = found.map((f) => f.i);
  let primary = -1;
  if (found.length) {
    let best = found[0];
    for (const f of found) {
      const bw = best.width, fw = f.width;
      if (fw > bw + 1e-9) best = f;
      else if (Math.abs(fw - bw) <= 1e-9) {
        if (edges[f.i].length > edges[best.i].length + 1e-9) best = f; // tie -> longer edge
        // (further ties resolve to the lower index, which is already `best`)
      }
    }
    primary = best.i;
  }
  return { indices, primary };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test src/streetFaceSelect.test.mjs`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add src/streetFaceSelect.js src/streetFaceSelect.test.mjs
git commit -m "feat(facade): pickStreetFrontages — the street-frontage set + primary

Multi-frontage generalization of pickStreetFrontEdge: returns every exposed
face fronting a parallel street (both sides of a corner lot) and the primary
frontage (widest street, tie -> longer edge -> lower index).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Wire multi-frontage + corner miter into the kit branch

Replace the single-`streetIndex` selection in the kit branch of `buildBuildings` with the frontage set: windows wrap every street frontage (and faces parallel to one), ground treatment goes on the primary frontage, and the cornice is mitered at wrapped corners (reusing the hero `sharedEndpoint`/miter logic). Add an `isFrontage` window gate to `decorateInkedWall` so a secondary (perpendicular) frontage still gets windows.

**Files:**
- Modify: `src/SceneView.jsx` (`decorateInkedWall` window gate ~2349–2350; kit branch of `buildBuildings` ~1456–1495)

**Interfaces:**
- Consumes: `pickStreetFrontages` (Task 3); existing `sharedEndpoint(edgeA, edgeB)` (`SceneView.jsx:1829`), `inkedFrontEdgeIndex`, `mostOpenExposedEdge`, `edgeClearance`.
- Produces: `decorateInkedWall(..., streetNormal = null, isFrontage = streetFace)` — new trailing param. `isFrontage` forces window/cornice treatment on a designated frontage even when it is perpendicular to `streetNormal`.

- [ ] **Step 1: Add the `isFrontage` gate to `decorateInkedWall`.** Change the signature (`SceneView.jsx:2141`) by appending `isFrontage`:

Current:
```javascript
function decorateInkedWall(target, edge, height, params, scene, streetFace = true, requestRender, miter = null, openingsFace = streetFace, exposedRanges = null, streetNormal = null) {
```
New:
```javascript
function decorateInkedWall(target, edge, height, params, scene, streetFace = true, requestRender, miter = null, openingsFace = streetFace, exposedRanges = null, streetNormal = null, isFrontage = streetFace) {
```

Then update the `windowFace` computation (`SceneView.jsx:2349–2350`). Current:
```javascript
  const windowFace = openingsFace && (streetFace || !streetNormal ||
    Math.abs(edge.normal.x * streetNormal.x + edge.normal.z * streetNormal.z) > 0.5);
```
New (a designated frontage always gets windows; otherwise the existing street-parallel rule):
```javascript
  const windowFace = openingsFace && (streetFace || isFrontage || !streetNormal ||
    Math.abs(edge.normal.x * streetNormal.x + edge.normal.z * streetNormal.z) > 0.5);
```

This is behavior-preserving for the hero path (which never passes `isFrontage`, so it defaults to `streetFace`).

- [ ] **Step 2: Rewrite the kit branch selection** in `buildBuildings`. Replace the block at `SceneView.jsx:1480–1495` (from `let streetIndex = pickStreetFrontEdge(...)` through the `inkedEdges.forEach(... decorateInkedWall ...)` call) with:

```javascript
        const frontages = pickStreetFrontages(oriented, exposed, streetSegs.map((s, k) => ({ ...s, width: scene.streets[k]?.halfWidth ?? 0 })));
        let streetSet = new Set(frontages.indices);
        let primary = frontages.primary;
        if (streetSet.size === 0) {
          // No exposed edge fronts a parallel street — fall back to the Franklin-
          // oriented front, then the most-open exposed edge (single frontage).
          const frontIdx = inkedFrontEdgeIndex(inkedEdges, building.centroid, scene);
          primary = exposed[frontIdx] ? frontIdx : -1;
          if (primary < 0) {
            const sibPts = siblings.map((o) => o.centroid);
            const clearance = inkedEdges.map((e) => edgeClearance(e, sibPts));
            primary = mostOpenExposedEdge(inkedEdges, exposed, clearance);
          }
          if (primary >= 0) streetSet.add(primary);
        }
        // Outward normals of the chosen frontages — a face parallel to any
        // frontage (e.g. the rear wall) still carries windows; perpendicular
        // non-frontage faces stay blank party walls.
        const frontageNormals = [...streetSet].map((i) => inkedEdges[i].normal);
        const primaryNormal = primary >= 0 ? inkedEdges[primary].normal : null;
        inkedEdges.forEach((edge, i) => {
          // Miter the cornice where this frontage meets another frontage at a
          // shared corner, so the cornice closes across the corner.
          let miter = null;
          if (streetSet.has(i)) {
            for (const j of streetSet) {
              if (j === i) continue;
              const c = sharedEndpoint(inkedEdges[i], inkedEdges[j]);
              if (c) {
                const near = (p) => Math.hypot(p.x - c.x, p.z - c.z) < 0.02;
                miter = { start: near(edge.start), end: near(edge.end) };
                break;
              }
            }
          }
          const openings = exposed[i] && (
            streetSet.has(i) ||
            frontageNormals.some((n) => Math.abs(edge.normal.x * n.x + edge.normal.z * n.z) > 0.5)
          );
          decorateInkedWall(
            deco, edge, building.height, inkedParams, scene,
            i === primary, requestRender, miter, openings, exposedRanges[i],
            primaryNormal, streetSet.has(i),
          );
        });
```

> Implementer note: keep the lines just above this block — `oriented` (the edges with `tangent`, `SceneView.jsx:1476–1479`), `streetSegs` (`1475`), `exposed`/`exposedRanges` (`1465–1470`), `siblings` (`1461–1464`) — unchanged; they are the inputs used here. The `import { pickStreetFrontEdge } from "./streetFaceSelect.js"` line must also import `pickStreetFrontages` (add it to the existing import).

- [ ] **Step 3: Build + full test suite**

Run: `npm run build`
Expected: build completes, no errors.

Run: `npm run test`
Expected: PASS (all suites — Task 3's helper test covers the selection; this task is renderer wiring).

- [ ] **Step 4: Visual proof (four angles)** — start the dev server, capture the corridor at all four iso rotations. Confirm: no kit building presents a blank brick wall to a street it fronts (check Franklin-corner lots and side-street buildings specifically); corner lots show windows on BOTH street faces; the entry/ground treatment is on one (primary) frontage; wrapped-corner cornices close across the corner. Read source + fix if any building still shows wall-only frontage.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(facade): kit buildings wrap openings onto every street frontage

Replace the single-street-face selection with pickStreetFrontages: windows on
all frontages (both sides of a corner lot) + parallel rears, ground treatment
on the primary frontage (widest street), cornice mitered at wrapped corners.
Adds an isFrontage window gate to decorateInkedWall. Fixes blank-wall street
frontage on side-street and Franklin-corner lots.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Lift storefront bays-by-bin to a shared step

Refactor: compute the storefront roster assignment (`assignStorefronts` → bays grouped by BIN) once, before `buildBuildings`, and thread the result into both `buildBuildings` (so kit params can read a building's bays) and `buildBlockStorefronts` (which currently computes it itself). Behavior-preserving — the block sign/awning system must render exactly as before.

**Files:**
- Modify: `src/SceneView.jsx` (extract a `computeStorefrontBays(scene)` helper near `buildBlockStorefronts`; call it once at the scene-assembly site that calls `buildBuildings`/`buildBlockStorefronts`, ~244–245; thread the `baysByBin` Map as a new parameter to both)

**Interfaces:**
- Consumes: existing `assignStorefronts` (`src/storefrontRoster.js`), `BLOCK_STOREFRONT_ROSTERS`, `classifyBuilding`, `scene.projection`, `scene.buildings` — all already used inside `buildBlockStorefronts` (~1249–1322).
- Produces: `computeStorefrontBays(scene) → Map<bin, Array<bay>>` (bay shape `{bin, name, category, slotIndex, sourceId, confidence, activeStatus}`). `buildBuildings(..., baysByBin)` and `buildBlockStorefronts(..., baysByBin)` accept the Map.

- [ ] **Step 1: Extract `computeStorefrontBays`.** In `src/SceneView.jsx`, move the bays computation (currently inside `buildBlockStorefronts`: the `blockCommercial` filter, `roster` construction, `assignStorefronts` call ~1309, and the `baysByBin` grouping ~1318–1322) into a standalone function:

```javascript
// Roster assignment, computed once and shared by the kit storefront wiring and
// the block sign/awning system so both agree on which tenant sits where.
function computeStorefrontBays(scene) {
  const blockCommercial = scene.buildings
    .filter((b) => b.fromBlockExtract && b.sourceProperties)
    .map((b) => ({ b, t: classifyBuilding({ sourceProperties: b.sourceProperties }) }))
    .filter((x) => x.t.groundFloorUse === "commercial")
    .map((x) => ({ bin: x.b.bin, groundFloorUse: "commercial", frontage: { scenePoint: x.b.centroid } }));
  const roster = BLOCK_STOREFRONT_ROSTERS.flatMap((r) => r.storefronts).map((s) => ({
    name: s.name, category: s.category, houseNumber: null,
    scenePoint: s.point ? scene.projection.project(s.point) : null,
    sourceId: s.sourceId ?? null, confidence: s.confidence, activeStatus: s.activeStatus,
  }));
  const bays = assignStorefronts(blockCommercial, roster, { axis: "x" });
  const baysByBin = new Map();
  for (const bay of bays) {
    if (!baysByBin.has(bay.bin)) baysByBin.set(bay.bin, []);
    baysByBin.get(bay.bin).push(bay);
  }
  return baysByBin;
}
```

> Implementer note: match the `roster` field mapping to what `buildBlockStorefronts` currently builds (read its existing roster construction ~1296–1308 and copy the exact field names/projection — `s.point` vs `s.scenePoint`, etc.). The block sign system uses a `pointByName` map keyed on storefront `name`; leave that inside `buildBlockStorefronts`, only the bays computation moves out.

- [ ] **Step 2: Thread the Map.** At the scene-assembly call site (~244–245, where `buildBuildings(...)` and `buildBlockStorefronts(...)` are called), compute it once and pass it to both:

```javascript
  const baysByBin = computeStorefrontBays(scene);
  buildBuildings(three, scene, requestRender, isActive, addCullable, baysByBin);
  buildBlockStorefronts(three, scene, baysByBin);
```

In `buildBlockStorefronts`, replace its internal bays computation with the passed-in `baysByBin` parameter (delete the now-extracted `blockCommercial`/`roster`/`assignStorefronts`/grouping lines; keep `pointByName` and everything from "render sign + awning for each bay" onward). Add `baysByBin` to its parameter list. Add `baysByBin` to `buildBuildings`' parameter list (unused until Task 6 — fine; the build must stay green).

> Implementer note: confirm the exact parameter lists of `buildBuildings` and `buildBlockStorefronts` and their call sites before editing; append `baysByBin` as the last parameter so positional call order stays valid.

- [ ] **Step 3: Build + full test suite**

Run: `npm run build`
Expected: build completes, no errors.

Run: `npm run test`
Expected: PASS (all suites — `storefrontRoster`/`storefrontSigns` tests still green; this is a behavior-preserving move).

- [ ] **Step 4: Visual regression check** — start the dev server; confirm commercial buildings still show the same signs + awnings as before (this refactor must not change the rendered output yet). Read source + fix if signs changed or disappeared.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "refactor(storefront): lift bays-by-bin into a shared computeStorefrontBays

Roster assignment computed once and threaded to both buildBuildings (for the
kit storefront wiring, next) and buildBlockStorefronts. Behavior-preserving:
block signs/awnings render unchanged.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Turn on commercial storefronts (and suppress double signage)

Set `params.storefront = { units }` for commercial kit buildings from their assigned bays, with truthful category-label signs. Suppress the block sign/awning system for kit-routed bins so a building doesn't get two signs. This fixes the "storefronts missing" defect (#5).

**Files:**
- Modify: `src/SceneView.jsx` (kit-params construction at the `buildKitFacadeParams` call site ~1394–1396; the block-storefront render loop in `buildBlockStorefronts`)

**Interfaces:**
- Consumes: `baysByBin` (Task 5); `resolveSignLabel(bay)` and `isFoodTrade(category)` from `src/storefrontSigns.js` (import them); the existing `decorateStorefront` which reads `storefront.units` with per-unit fields `{ label, door, awning:{has,color?}, frameTint?, signColor?, widthFrac? }` (`SceneView.jsx:2538–2606`); `resolveFacadeFamily` + `familyHasKit` (already used at the call site).
- Produces: commercial kit buildings carry `params.storefront = { units }`; `buildBlockStorefronts` skips kit-routed bins.

- [ ] **Step 1: Build the units + set `params.storefront`.** At the kit-params call site (`SceneView.jsx:1394–1396`), after `kitParams = buildKitFacadeParams(...)`, attach storefront units when the building has assigned bays:

```javascript
      if (familyHasKit(family)) {
        kitParams = buildKitFacadeParams(building, family, FACADE_OVERRIDES[building.bin]);
        const binBays = baysByBin.get(building.bin);
        if (binBays && binBays.length) {
          // Truthful category-label signs (real brand only on a claimed bay);
          // food trades get an awning. One unit per assigned tenant bay.
          kitParams.storefront = {
            units: binBays.map((bay, k) => ({
              label: resolveSignLabel(bay),
              door: k % 2 === 0 ? "left" : "right",
              awning: { has: isFoodTrade(bay.category) },
              widthFrac: 1 / binBays.length,
            })),
          };
        }
      }
```

Add to the existing `storefrontSigns` import (or create one):
```javascript
import { resolveSignLabel, isFoodTrade } from "./storefrontSigns.js";
```

> Implementer note: `buildKitFacadeParams` itself does not need to change — it keeps returning `storefront: null`; the call site overrides it for commercial buildings. (Setting it here keeps the per-building roster data, which `buildKitFacadeParams` has no access to, out of that pure module.) Verify `baysByBin` is in scope at this call site (passed as the Task-5 parameter to `buildBuildings`).

- [ ] **Step 2: Suppress block signs for kit-routed bins** (avoid double signage). In `buildBlockStorefronts`, skip any bin that is kit-routed (its storefront is now drawn by `decorateStorefront`). At the top of the per-bin render loop (`for (const [bin, binBays] of baysByBin)`), add a guard:

```javascript
  for (const [bin, binBays] of baysByBin) {
    const building = byBin.get(bin);
    if (!building) continue;
    // Kit-routed commercial buildings draw their own shopfront + category sign
    // via decorateStorefront; skip the block sign/awning here to avoid doubles.
    if (building.fromBlockExtract && building.sourceProperties) {
      const { family } = resolveFacadeFamily(building, { overrides: FACADE_OVERRIDES, pilotBins: KIT_PILOT_BINS });
      if (familyHasKit(family)) continue;
    }
    // ... existing sign + awning rendering ...
  }
```

> Implementer note: confirm `resolveFacadeFamily`, `familyHasKit`, `FACADE_OVERRIDES`, `KIT_PILOT_BINS` are in scope in `buildBlockStorefronts` (they are module-level in `SceneView.jsx`); match the exact kit-eligibility test used at the `buildBuildings` call site (`SceneView.jsx:1394–1396`) so the two paths agree on which bins are kit-routed.

- [ ] **Step 3: Build + full test suite**

Run: `npm run build`
Expected: build completes, no errors.

Run: `npm run test`
Expected: PASS (all suites).

- [ ] **Step 4: Full verification gate**

Run: `npm run verify`
Expected: all gates PASS (tests + conformance + visual + components + stories + kit-coverage + overrides).

- [ ] **Step 5: Visual proof (four angles)** — start the dev server, capture the corridor at all four iso rotations. Confirm: commercial kit buildings show a storefront band (glass + recessed door + mullions + frame) with a single **category-label** sign (no real brand on unclaimed bays, no double signs); residential buildings show doors + ground windows; no flat dark ground bands remain. Read source + fix if a commercial building shows a blank band, a double sign, or a real brand name on an unclaimed bay.

- [ ] **Step 6: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(storefront): wire commercial storefronts on kit buildings

Commercial kit buildings get params.storefront from their roster bays
(category-label signs via resolveSignLabel, awnings for food trades), drawn by
decorateStorefront. Block sign/awning system suppressed for kit-routed bins to
avoid double signage. Fixes missing storefronts.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Spec §1 (commercial-vs-residential from typology + roster) → Tasks 5–6 (bays drive commercial; absence → residential). ✓
- Spec §2 (commercial storefront via existing `decorateStorefront`, category labels) → Task 6 (`resolveSignLabel`, double-sign suppression). ✓
- Spec §3 (residential composed recessed window row + entry door; stoop path unchanged) → Tasks 1–2. ✓ (Stoop branch at `2376–2419` is untouched.)
- Spec §4 (accurate frontage; corner wrap; ground on primary; cornice miter at wrapped corners) → Tasks 3–4. ✓
- Spec §5 (composer/kit-params/frontage tests + build + four-angle visual) → Task 1 (composer test), Task 3 (frontage test), Tasks 2/4/6 (build + visual). Note: the kit-params/mutual-exclusion behaviors are verified via build + visual rather than a unit test, because the wiring lives at the renderer call site (`commercialGround` already gates the stoop and is unchanged). ✓
- Non-goals (color, broad corner gap, wrapped storefront, art assets, typological/hero paths) → respected; only the cornice miter slice of the corner issue is touched (Task 4). ✓

**Placeholder scan:** No "TBD"/"handle edge cases"/"similar to". Implementer notes point at exact line ranges to confirm against (parameter lists, roster field names) — these are verification cues, not deferred work; the code to write is given in full.

**Type consistency:** `composeInkedFacade` returns `groundWindows`/`door`/`doorBay` (Task 1) consumed by name in Task 2. `pickStreetFrontages` returns `{ indices, primary }` (Task 3) consumed in Task 4. `decorateInkedWall`'s new trailing `isFrontage` param (Task 4) is passed positionally after `streetNormal` at the kit call site. `baysByBin: Map<bin, bay[]>` (Task 5) consumed in Task 6. Bay shape and `resolveSignLabel`/`isFoodTrade` match `src/storefrontSigns.js`. Storefront `unit` fields match `decorateStorefront`'s reads.
