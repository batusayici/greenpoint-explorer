# Curved Recess Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render arched and circular window/door openings on 144 Franklin as curved recessed panes with flush spandrel/corner fillers and straight reveals, authorable in the recess editor.

**Architecture:** A new pure module `src/facadeProfiles.js` computes opening silhouettes + filler regions in face-coords (no THREE, unit-testable). `facadeAssembly.js` triangulates those into recessed panes + flush fillers and dispatches on a new `shape` field. The `?specdebug=1` overlay draws the real profile. The recess editor (`?facadeedit=1` / Shift+E) gains a shape selector, an arch spring-line control, and an SVG curve preview.

**Tech Stack:** React 19, Three.js, Vite. Tests run with Node's built-in runner (`node --test path/to/file.test.mjs`) on pure `.test.mjs` modules — see `src/dev/facadeEditor.test.mjs` for the pattern.

---

## Background the engineer needs

- **Face coords:** every opening is `{x0,x1,y0,y1}` normalized to the elevation slice — `x` 0..1 left→right, `y` 0..1 ground→roofline. `facePoint(frame, x, y, offset)` converts to world; `offset` pushes along the face normal (negative = recessed behind the wall plane).
- **UVs:** `u(x) = frame.u0 + (frame.u1 - frame.u0) * x`, `v = y`. Sampling the painted texture at a vertex's own `(x,y)` is what makes geometry register to the drawing.
- **How a recess is built today** (`facadeAssembly.js`): `complementRects(openings)` masks the wall as everything *outside* each opening's bounding rect (leaving a rect-shaped hole); `rectMesh(frame, rect, -recess, mat)` drops the recessed pane into that hole; `addReveals(...)` bridges the wall plane to the pane with four straight jamb quads.
- **Key insight for curves:** keep `complementRects` masking the *bounding rect* (unchanged). Inside that hole, place a curved pane + **flush** (offset 0) filler polygons over the corners the curve doesn't reach. The wall stays flush at the corners; only the silhouette is recessed.
- **Convexity:** rect, ellipse, and the arch silhouette (rect body + elliptical cap) are all convex → a triangle fan from vertex 0 triangulates them. Each filler region is **star-shaped from its bbox corner** → a fan from that corner (returned as element `[0]`) triangulates it.
- Reference spec: `src/data/facade-specs/144-franklin.v0.1.json`. Reference design: `docs/superpowers/specs/2026-06-15-curved-recess-profiles-design.md`.

## File Structure

- **Create** `src/facadeProfiles.js` — pure silhouette + filler geometry (the only home for arc math). No THREE import.
- **Create** `src/facadeProfiles.test.mjs` — unit tests for the above.
- **Modify** `src/facadeAssembly.js` — thread `shape`/`springY` through `windowRects`; add `fanGeometry`, `profileMesh`, `fillerMeshes`; dispatch window + door loops on shape; draw real profiles in the `?specdebug=1` block.
- **Modify** `src/dev/facadeSpecPatch.js` — thread `shape`/`springY` onto items; add `patchShape` / `patchSpring`.
- **Modify** `src/components/dev/FacadeRecessEditor.jsx` — shape selector, spring-line handle, SVG curve preview.
- **Modify** `src/dev/facadeEditor.test.mjs` — tests for `patchShape` / `patchSpring`.
- **Modify** `src/data/facade-specs/144-franklin.v0.1.json` — add `shape`/`springY` to the arched + circular openings; bump `schemaVersion` to `facade-spec.v0.6`.

---

## Task 1: Pure opening-profile geometry

**Files:**
- Create: `src/facadeProfiles.js`
- Test: `src/facadeProfiles.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `src/facadeProfiles.test.mjs`:

```js
// Pure-geometry tests for opening profiles.
// Run: node --test src/facadeProfiles.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { openingProfile, springYOf } from "./facadeProfiles.js";

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const has = (pts, x, y, eps = 1e-9) =>
  assert.ok(pts.some((p) => Math.abs(p.x - x) < eps && Math.abs(p.y - y) < eps), `expected point (${x},${y})`);

test("rect (default) returns four corners and no fillers", () => {
  const { outline, fillers } = openingProfile({ x0: 0.2, x1: 0.4, y0: 0.1, y1: 0.5 });
  assert.equal(outline.length, 4);
  assert.equal(fillers.length, 0);
  has(outline, 0.2, 0.1); has(outline, 0.4, 0.1); has(outline, 0.4, 0.5); has(outline, 0.2, 0.5);
});

test("springYOf defaults to the box midpoint", () => {
  close(springYOf({ y0: 0.1, y1: 0.5 }), 0.3);
  close(springYOf({ y0: 0.1, y1: 0.5, springY: 0.42 }), 0.42);
});

test("arch silhouette: straight jambs to springY, crown at y1 center", () => {
  const rect = { x0: 0.2, x1: 0.4, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.4 };
  const { outline, fillers } = openingProfile(rect, 8);
  // base corners + jamb tops present
  has(outline, 0.2, 0.0); has(outline, 0.4, 0.0);
  has(outline, 0.4, 0.4); has(outline, 0.2, 0.4);
  // crown at center, top of box
  has(outline, 0.3, 0.6);
  // two spandrel fillers, each a fan with the bbox top corner first
  assert.equal(fillers.length, 2);
  close(fillers[0][0].y, 0.6); // apex on the top edge
  close(fillers[1][0].y, 0.6);
});

test("arch arc points stay within the bounding box", () => {
  const rect = { x0: 0.2, x1: 0.4, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.4 };
  const { outline } = openingProfile(rect, 16);
  for (const p of outline) {
    assert.ok(p.x >= 0.2 - 1e-9 && p.x <= 0.4 + 1e-9, `x in box: ${p.x}`);
    assert.ok(p.y >= 0.0 - 1e-9 && p.y <= 0.6 + 1e-9, `y in box: ${p.y}`);
  }
});

test("circle silhouette is symmetric and bbox-inscribed with four fillers", () => {
  const rect = { x0: 0.0, x1: 0.4, y0: 0.0, y1: 0.4, shape: "circle" };
  const { outline, fillers } = openingProfile(rect, 16);
  // axis extremes touch the bbox edge midpoints
  has(outline, 0.4, 0.2); has(outline, 0.0, 0.2);
  has(outline, 0.2, 0.4); has(outline, 0.2, 0.0);
  assert.equal(fillers.length, 4);
  // every filler apex is one of the four bbox corners
  const corners = [[0,0],[0.4,0],[0.4,0.4],[0,0.4]];
  for (const f of fillers) {
    assert.ok(corners.some((c) => Math.abs(c[0]-f[0].x) < 1e-9 && Math.abs(c[1]-f[0].y) < 1e-9), "apex is a bbox corner");
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/facadeProfiles.test.mjs`
Expected: FAIL — `Cannot find module './facadeProfiles.js'`.

- [ ] **Step 3: Write the implementation**

Create `src/facadeProfiles.js`:

```js
// Pure opening-profile geometry — no THREE, so it unit-tests in isolation.
//
// Every opening has a bounding rect {x0,x1,y0,y1} in face-coords. `shape`
// reinterprets what is rendered inside it:
//   "rect"   (default) — the four corners, no fillers.
//   "arch"   — rectangular body y0..springY + an elliptical cap to crown y1.
//   "circle" — an oculus inscribed in the bbox.
// `outline` is the recessed-pane silhouette (closed, convex → fan from [0]).
// `fillers` are the flush corner/spandrel regions the curve leaves uncovered;
// each is a fan whose apex (the bbox corner it sweeps from) is element [0].
// Tessellation is done in face-coords so the silhouette registers to the
// painted arc regardless of world aspect — the drawing defines the curve.

export const ARC_SEGMENTS = 20;

export function springYOf(rect) {
  return rect.springY ?? (rect.y0 + rect.y1) / 2;
}

export function openingProfile(rect, segments = ARC_SEGMENTS) {
  const shape = rect.shape ?? "rect";
  if (shape === "arch") return archProfile(rect, segments);
  if (shape === "circle") return circleProfile(rect, segments);
  return {
    outline: [
      { x: rect.x0, y: rect.y0 },
      { x: rect.x1, y: rect.y0 },
      { x: rect.x1, y: rect.y1 },
      { x: rect.x0, y: rect.y1 },
    ],
    fillers: [],
  };
}

function archProfile(rect, segments) {
  const { x0, x1, y0, y1 } = rect;
  const springY = springYOf(rect);
  const xc = (x0 + x1) / 2;
  const rx = (x1 - x0) / 2;
  const ry = y1 - springY;

  // Arc from the right jamb top (t=0) over the crown (t=π/2) to the left jamb
  // top (t=π). Endpoints land exactly on (x1,springY) and (x0,springY).
  const arc = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = (Math.PI * i) / segments;
    arc.push({ x: xc + rx * Math.cos(t), y: springY + ry * Math.sin(t) });
  }

  const outline = [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    ...arc, // (x1,springY) … crown … (x0,springY)
  ];

  // Left spandrel: fan from the top-left corner across the left half of the
  // arc (crown → left jamb top). Right spandrel: from the top-right corner
  // across the right half (right jamb top → crown). Apex first so a fan from
  // element [0] triangulates the star-shaped region.
  const mid = Math.floor(segments / 2);
  const right = [{ x: x1, y: y1 }, ...arc.slice(0, mid + 1)];
  const left = [{ x: x0, y: y1 }, ...arc.slice(mid)];
  return { outline, fillers: [left, right] };
}

function circleProfile(rect, segments) {
  const { x0, x1, y0, y1 } = rect;
  const xc = (x0 + x1) / 2;
  const yc = (y0 + y1) / 2;
  const rx = (x1 - x0) / 2;
  const ry = (y1 - y0) / 2;
  const n = segments * 2; // full revolution

  const outline = [];
  for (let i = 0; i < n; i += 1) {
    const t = (2 * Math.PI * i) / n;
    outline.push({ x: xc + rx * Math.cos(t), y: yc + ry * Math.sin(t) });
  }

  // Four corner fillers. Each fans from a bbox corner across the quarter arc
  // between the two adjacent axis points. Quarter k covers angles
  // [k·π/2, (k+1)·π/2]; its apex is the corner that quarter bulges toward.
  const corners = [
    { x: x1, y: y1 }, // quarter 0: +x→+y
    { x: x0, y: y1 }, // quarter 1: +y→-x
    { x: x0, y: y0 }, // quarter 2: -x→-y
    { x: x1, y: y0 }, // quarter 3: -y→+x
  ];
  const fillers = [];
  for (let k = 0; k < 4; k += 1) {
    const fan = [corners[k]];
    for (let i = 0; i <= segments; i += 1) {
      const t = (Math.PI / 2) * (k + i / segments);
      fan.push({ x: xc + rx * Math.cos(t), y: yc + ry * Math.sin(t) });
    }
    fillers.push(fan);
  }
  return { outline, fillers };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/facadeProfiles.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/facadeProfiles.js src/facadeProfiles.test.mjs
git commit -m "feat(facade): pure opening-profile geometry (arch + circle)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Render curved panes + flush fillers in the facade assembly

**Files:**
- Modify: `src/facadeAssembly.js`

- [ ] **Step 1: Import the profile module**

At the top of `src/facadeAssembly.js`, below `import * as THREE from "three";`, add:

```js
import { openingProfile, springYOf } from "./facadeProfiles.js";
```

- [ ] **Step 2: Thread `shape`/`springY` through `windowRects`**

In `buildFacadeAssembly`, the explicit-rects branch currently drops every key
but the four coords. Replace the line at `src/facadeAssembly.js:60`:

```js
        windowRects.push(lean({ x0: rect.x0, x1: rect.x1, y0: rect.y0, y1: rect.y1 }));
```

with:

```js
        windowRects.push(lean({ x0: rect.x0, x1: rect.x1, y0: rect.y0, y1: rect.y1, shape: rect.shape, springY: rect.springY }));
```

(`lean` spreads `...rect`, so the new keys survive. `storefronts`/`doors` already
go through `.map(lean)`, so door shapes pass through untouched.)

- [ ] **Step 3: Add geometry helpers**

In the `--- geometry helpers ---` region (after `rectMesh`, near
`src/facadeAssembly.js:388`), add:

```js
// Triangulate a convex/star-shaped face-coord polygon as a fan from points[0],
// at a constant normal offset, textured by each vertex's own (x,y) UV so the
// painted artwork registers. `points` are {x,y} in face-coords.
function fanGeometry(frame, points, offset, withUv) {
  const u = (x) => frame.u0 + (frame.u1 - frame.u0) * x;
  const position = [];
  const uv = [];
  for (const p of points) {
    position.push(...facePoint(frame, p.x, p.y, offset));
    if (withUv) uv.push(u(p.x), p.y);
  }
  const index = [];
  for (let i = 1; i < points.length - 1; i += 1) index.push(0, i, i + 1);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(position), 3));
  if (withUv) geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// A shaped opening (arch/circle): recessed silhouette pane + flush spandrel/
// corner fillers (textured wall, so the corners read flush) + straight reveals
// on the lower jambs/sill only (the curved head is pane-only — accepted seam).
function addShapedOpening(group, frame, rect, recess, texture) {
  const profile = openingProfile(rect);
  group.add(new THREE.Mesh(fanGeometry(frame, profile.outline, -recess, true), texturedMaterial(texture, 1)));
  for (const filler of profile.fillers) {
    group.add(new THREE.Mesh(fanGeometry(frame, filler, 0, true), texturedMaterial(texture, 1)));
  }
  if ((rect.shape ?? "rect") === "arch") {
    const lower = { x0: rect.x0, x1: rect.x1, y0: rect.y0, y1: springYOf(rect) };
    addReveals(group, frame, lower, 0, -recess, texture, { top: false });
  }
}
```

- [ ] **Step 4: Dispatch the window loop on shape**

Replace the window loop body at `src/facadeAssembly.js:95-106`. The current loop:

```js
  for (const rect of windowRects) {
    group.add(rectMesh(frame, rect, -windowRecess, texturedMaterial(texture, 1)));
    addReveals(group, frame, rect, 0, -windowRecess, texture);
    // Geometric sills only on request — the drawn elevations carry their
    // own stone sills, and duplicating them reads as floating white bars.
    if (spec.windows.sill === true) {
      const sill = { x0: rect.x0 - 0.004, x1: rect.x1 + 0.004, y0: rect.y0 - 0.008, y1: rect.y0 };
      group.add(rectMesh(frame, sill, meters(0.05), tintMaterial(REVEAL.bottom)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "bottom", tintMaterial(REVEAL.soffit)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "top", tintMaterial(REVEAL.bottom)));
    }
  }
```

becomes:

```js
  for (const rect of windowRects) {
    if (rect.shape && rect.shape !== "rect") {
      addShapedOpening(group, frame, rect, windowRecess, texture);
      continue;
    }
    group.add(rectMesh(frame, rect, -windowRecess, texturedMaterial(texture, 1)));
    addReveals(group, frame, rect, 0, -windowRecess, texture);
    // Geometric sills only on request — the drawn elevations carry their
    // own stone sills, and duplicating them reads as floating white bars.
    if (spec.windows.sill === true) {
      const sill = { x0: rect.x0 - 0.004, x1: rect.x1 + 0.004, y0: rect.y0 - 0.008, y1: rect.y0 };
      group.add(rectMesh(frame, sill, meters(0.05), tintMaterial(REVEAL.bottom)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "bottom", tintMaterial(REVEAL.soffit)));
      group.add(bridgeMesh(frame, sill, meters(0.05), 0, "top", tintMaterial(REVEAL.bottom)));
    }
  }
```

- [ ] **Step 5: Dispatch the door loop on shape**

Replace the door loop body at `src/facadeAssembly.js:228-232`. The current loop:

```js
  for (const door of doors) {
    const recess = meters(door.recessM ?? 0.12);
    group.add(rectMesh(frame, door, -recess, texturedMaterial(texture, 0.98)));
    addReveals(group, frame, door, 0, -recess, texture, { bottom: false });
  }
```

becomes:

```js
  for (const door of doors) {
    const recess = meters(door.recessM ?? 0.12);
    if (door.shape && door.shape !== "rect") {
      addShapedOpening(group, frame, door, recess, texture);
      continue;
    }
    group.add(rectMesh(frame, door, -recess, texturedMaterial(texture, 0.98)));
    addReveals(group, frame, door, 0, -recess, texture, { bottom: false });
  }
```

(Doors use a slightly brighter pane shade `0.98`; the shaped path uses `1` like
windows. Acceptable — the painted texture carries the tone. Keep it simple.)

- [ ] **Step 6: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds (the existing 46MB GLB large-chunk warning is normal). No new errors.

- [ ] **Step 7: Commit**

```bash
git add src/facadeAssembly.js
git commit -m "feat(facade): render arch + oculus openings as curved recessed panes

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Draw real profiles in the `?specdebug=1` overlay

**Files:**
- Modify: `src/facadeAssembly.js`

- [ ] **Step 1: Replace the debug rect outline with a profile outline**

In the `if (debug)` block, the loop at `src/facadeAssembly.js:332-340` draws a
4-point `LineLoop` per rect:

```js
    for (const rect of debugRects) {
      const points = [
        facePoint(frame, rect.x0, rect.y0, 0.03),
        facePoint(frame, rect.x1, rect.y0, 0.03),
        facePoint(frame, rect.x1, rect.y1, 0.03),
        facePoint(frame, rect.x0, rect.y1, 0.03),
      ].map((p) => new THREE.Vector3(...p));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.LineLoop(geometry, material));
    }
```

Replace with a profile-aware version (shaped openings trace their silhouette;
rects are unchanged because their profile is the four corners):

```js
    for (const rect of debugRects) {
      const { outline } = openingProfile(rect);
      const points = outline.map((p) => new THREE.Vector3(...facePoint(frame, p.x, p.y, 0.03)));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.LineLoop(geometry, material));
    }
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds, no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/facadeAssembly.js
git commit -m "feat(facade): trace curved silhouettes in the specdebug overlay

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Editor data — thread shape/springY + patch helpers

**Files:**
- Modify: `src/dev/facadeSpecPatch.js`
- Modify: `src/dev/facadeEditor.test.mjs`

- [ ] **Step 1: Write failing tests for the patch helpers**

In `src/dev/facadeEditor.test.mjs`, update the import line:

```js
import { listEditableRecesses, patchDepth, patchRecess } from "./facadeSpecPatch.js";
```

to:

```js
import { listEditableRecesses, patchDepth, patchRecess, patchShape, patchSpring } from "./facadeSpecPatch.js";
```

Then append these tests to the file:

```js
test("listEditableRecesses surfaces shape and springY on window items", () => {
  const spec = { windows: { recessM: 0.12, rects: [
    { x0: 0.1, x1: 0.2, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.4 },
    { x0: 0.3, x1: 0.4, y0: 0.7, y1: 0.9, shape: "circle" },
  ] } };
  const items = listEditableRecesses(spec);
  assert.equal(items[0].shape, "arch");
  close(items[0].springY, 0.4);
  assert.equal(items[1].shape, "circle");
});

test("patchShape sets shape and seeds springY midpoint when switching to arch", () => {
  const spec = { windows: { rects: [{ x0: 0.1, x1: 0.2, y0: 0.0, y1: 0.6 }] } };
  const next = patchShape(spec, ["windows", "rects", 0], "arch");
  assert.equal(next.windows.rects[0].shape, "arch");
  close(next.windows.rects[0].springY, 0.3);
  // original untouched (immutability)
  assert.equal(spec.windows.rects[0].shape, undefined);
});

test("patchShape back to rect drops shape and springY", () => {
  const spec = { windows: { rects: [{ x0: 0.1, x1: 0.2, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.3 }] } };
  const next = patchShape(spec, ["windows", "rects", 0], "rect");
  assert.equal(next.windows.rects[0].shape, undefined);
  assert.equal(next.windows.rects[0].springY, undefined);
});

test("patchSpring updates springY rounded to 3dp and preserves coords", () => {
  const spec = { windows: { rects: [{ x0: 0.1, x1: 0.2, y0: 0.0, y1: 0.6, shape: "arch", springY: 0.3 }] } };
  const next = patchSpring(spec, ["windows", "rects", 0], 0.41666);
  close(next.windows.rects[0].springY, 0.417);
  close(next.windows.rects[0].x0, 0.1);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/dev/facadeEditor.test.mjs`
Expected: FAIL — `patchShape`/`patchSpring` not exported.

- [ ] **Step 3: Thread shape/springY onto items**

In `src/dev/facadeSpecPatch.js`, the `mk(...)` helper builds each item. Add an
optional shape descriptor. Replace the window-rects mapping at
`src/dev/facadeSpecPatch.js:30-36`:

```js
  const rects = faceSpec.windows?.rects ?? [];
  rects.forEach((r, i) =>
    items.push(mk(`window-${i}`, `window ${i + 1}`, "window", ["windows", "rects", i], rectOf(r), {
      // windows share one recessM; depth edits the whole set.
      key: "recessM", path: ["windows", "recessM"], value: faceSpec.windows?.recessM,
    })),
  );
```

with (pass the source rect so `mk` can read shape/springY):

```js
  const rects = faceSpec.windows?.rects ?? [];
  rects.forEach((r, i) =>
    items.push(mk(`window-${i}`, `window ${i + 1}`, "window", ["windows", "rects", i], rectOf(r), {
      // windows share one recessM; depth edits the whole set.
      key: "recessM", path: ["windows", "recessM"], value: faceSpec.windows?.recessM,
    }, false, r)),
  );
```

And the doors mapping at `src/dev/facadeSpecPatch.js:40-42`:

```js
  (faceSpec.doors ?? []).forEach((r, i) =>
    items.push(mk(`door-${i}`, `door ${i + 1}`, "door", ["doors", i], rectOf(r), depthAt(r, "door", ["doors", i]))),
  );
```

with:

```js
  (faceSpec.doors ?? []).forEach((r, i) =>
    items.push(mk(`door-${i}`, `door ${i + 1}`, "door", ["doors", i], rectOf(r), depthAt(r, "door", ["doors", i]), false, r)),
  );
```

Then update `mk` (at `src/dev/facadeSpecPatch.js:58-72`):

```js
function mk(id, label, kind, path, rect, depthOverride, lockX = false) {
  const meta = DEPTH[kind];
  let depth = null;
  if (depthOverride) {
    depth = {
      key: depthOverride.key,
      path: depthOverride.path,
      sign: meta.sign,
      min: 0,
      max: meta.max,
      value: depthOverride.value ?? meta.def,
    };
  }
  return { id, label, kind, path, rect, depth, ...(lockX ? { lockX: true } : {}) };
}
```

to also carry the source rect's shape (only window/door pass `src`):

```js
function mk(id, label, kind, path, rect, depthOverride, lockX = false, src = null) {
  const meta = DEPTH[kind];
  let depth = null;
  if (depthOverride) {
    depth = {
      key: depthOverride.key,
      path: depthOverride.path,
      sign: meta.sign,
      min: 0,
      max: meta.max,
      value: depthOverride.value ?? meta.def,
    };
  }
  const shapeMeta = src ? { shape: src.shape ?? "rect", springY: src.springY } : {};
  return { id, label, kind, path, rect, depth, ...shapeMeta, ...(lockX ? { lockX: true } : {}) };
}
```

- [ ] **Step 4: Add `patchShape` and `patchSpring`**

Append to `src/dev/facadeSpecPatch.js`:

```js
// Set the opening shape at `path`. Switching to "arch" seeds springY at the
// box midpoint if absent; switching back to "rect" strips shape/springY so
// the saved spec stays clean.
export function patchShape(faceSpec, path, shape) {
  const clone = structuredClone(faceSpec);
  let node = clone;
  for (let k = 0; k < path.length - 1; k += 1) node = node[path[k]];
  const i = path[path.length - 1];
  const rect = node[i];
  if (shape === "rect") {
    const { shape: _s, springY: _y, ...rest } = rect;
    node[i] = rest;
  } else if (shape === "arch") {
    node[i] = { ...rect, shape, springY: rect.springY ?? round((rect.y0 + rect.y1) / 2) };
  } else {
    const { springY: _y, ...rest } = rect;
    node[i] = { ...rest, shape };
  }
  return clone;
}

// Set springY (arch spring line) at `path`, rounded to spec precision.
export function patchSpring(faceSpec, path, value) {
  const clone = structuredClone(faceSpec);
  let node = clone;
  for (let k = 0; k < path.length - 1; k += 1) node = node[path[k]];
  const i = path[path.length - 1];
  node[i] = { ...node[i], springY: round(value) };
  return clone;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test src/dev/facadeEditor.test.mjs`
Expected: PASS (existing 11 + 4 new).

- [ ] **Step 6: Commit**

```bash
git add src/dev/facadeSpecPatch.js src/dev/facadeEditor.test.mjs
git commit -m "feat(facade-editor): thread shape/springY + patchShape/patchSpring

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Editor UI — shape selector, spring line, curve preview

**Files:**
- Modify: `src/components/dev/FacadeRecessEditor.jsx`

- [ ] **Step 1: Import the patch helpers**

In `src/components/dev/FacadeRecessEditor.jsx`, update the import at line 3:

```js
import { listEditableRecesses, patchDepth, patchRecess } from "../../dev/facadeSpecPatch.js";
```

to:

```js
import { listEditableRecesses, patchDepth, patchRecess, patchShape, patchSpring } from "../../dev/facadeSpecPatch.js";
```

- [ ] **Step 2: Add shape/spring change handlers**

After the existing `setDepth` function (around `src/components/dev/FacadeRecessEditor.jsx:97-99`), add:

```js
  function setShape(item, shape) {
    updateSpec(patchShape(specRef.current, item.path, shape));
  }

  function setSpring(item, value) {
    updateSpec(patchSpring(specRef.current, item.path, value));
  }
```

- [ ] **Step 3: Draw the curve preview inside the box**

In the box `.map((item) => { ... })` render (around `src/components/dev/FacadeRecessEditor.jsx:242-264`),
add an SVG profile overlay for shaped windows/doors. Insert, immediately inside
the returned `<div>` (before the `{isSel && HANDLES...}` line):

```jsx
                {(item.shape === "arch" || item.shape === "circle") && (
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
                    {item.shape === "circle"
                      ? <ellipse cx="50" cy="50" rx="50" ry="50" fill="none" stroke={isSel ? "#ffcf3f" : "#5fd0ff"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                      : <ArchPath springFrac={springFrac(item)} selected={isSel} kind={item.kind} />}
                  </svg>
                )}
```

(Box-local SVG: `(0,0)` is the box's top-left, `(100,100)` its bottom-right —
note SVG y grows downward, opposite face-y, so the arch springs from the
*bottom*-relative position. `springFrac` converts.)

- [ ] **Step 4: Add the `ArchPath` component and `springFrac` helper**

Near the other small components at the bottom of the file (after `DepthControl`,
around `src/components/dev/FacadeRecessEditor.jsx:342`), add:

```jsx
// Fraction of the box height (from the bottom) where the arch springs.
// Face-y grows up; SVG-y grows down — so a spring at face springY sits at
// SVG y = (1 - (springY - y0)/(y1 - y0)) * 100.
function springFrac(item) {
  const sy = item.springY ?? (item.rect.y0 + item.rect.y1) / 2;
  return (sy - item.rect.y0) / (item.rect.y1 - item.rect.y0);
}

function ArchPath({ springFrac, selected, kind }) {
  const ySpring = (1 - springFrac) * 100; // SVG space
  const stroke = selected ? "#ffcf3f" : kind === "door" ? "#ff9b6b" : "#5fd0ff";
  // Jambs up to the spring line, then a semi-ellipse cap to the top.
  const d = `M 0 100 L 0 ${ySpring} A 50 ${ySpring} 0 0 1 100 ${ySpring} L 100 100`;
  return (
    <>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1={ySpring} x2="100" y2={ySpring} stroke={stroke} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
    </>
  );
}
```

- [ ] **Step 5: Add the shape control panel for the selected window/door**

After the `{selectedItem?.depth && <DepthControl .../>}` line (around
`src/components/dev/FacadeRecessEditor.jsx:276`), add a shape control:

```jsx
      {selectedItem && (selectedItem.kind === "window" || selectedItem.kind === "door") && (
        <ShapeControl item={selectedItem} onShape={setShape} onSpring={setSpring} />
      )}
```

Then add the `ShapeControl` component near `DepthControl`:

```jsx
// Shape selector for a window/door + an arch spring-line slider. The flat
// preview shows the curve; this picks the profile and tunes where it springs.
function ShapeControl({ item, onShape, onSpring }) {
  const shape = item.shape ?? "rect";
  const springY = item.springY ?? (item.rect.y0 + item.rect.y1) / 2;
  return (
    <div style={{ marginTop: 8, fontSize: 11 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ opacity: 0.85, minWidth: 64 }}>shape</span>
        {["rect", "arch", "circle"].map((s) => (
          <button key={s} onClick={() => onShape(item, s)}
            style={{
              flex: 1, padding: "4px 6px", borderRadius: 4, cursor: "pointer",
              fontFamily: "inherit", fontSize: 11,
              border: "1px solid #5a4d3e",
              background: shape === s ? "#d9a43b" : "#3a3228",
              color: shape === s ? "#241c10" : "#eae1ce",
              fontWeight: shape === s ? 700 : 400,
            }}>
            {s}
          </button>
        ))}
      </div>
      {shape === "arch" && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
          <span style={{ opacity: 0.85, minWidth: 64 }}>spring y</span>
          <input type="range" min={item.rect.y0} max={item.rect.y1} step={0.002} value={springY}
            onChange={(e) => onSpring(item, Number(e.target.value))}
            style={{ flex: 1, accentColor: "#d9a43b" }} />
          <span style={{ width: 44, textAlign: "right" }}>{springY.toFixed(3)}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds, no new errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/dev/FacadeRecessEditor.jsx
git commit -m "feat(facade-editor): shape selector, arch spring-line, SVG curve preview

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Author 144 Franklin shapes + in-engine verification

**Files:**
- Modify: `src/data/facade-specs/144-franklin.v0.1.json`

This task is authoring + visual verification, not TDD — the registration is
done by eye on the overlay/editor, exactly the existing hero workflow.

- [ ] **Step 1: Bump the schema version**

In `src/data/facade-specs/144-franklin.v0.1.json`, change:

```json
  "schemaVersion": "facade-spec.v0.5",
```

to:

```json
  "schemaVersion": "facade-spec.v0.6",
```

- [ ] **Step 2: Tag the curved openings with a shape**

The Greenpoint face `windows.rects` mixes 3rd-floor rect windows (`y0:0.42,
y1:0.54`) with the tall 2nd-floor openings (`y0:0.04, y1:0.3`). Per the design:
the tall 2nd-floor openings are round-arch, and the oculi are circular. For each
tall opening rect (the ones with `y0:0.04, y1:0.3`), add `"shape": "arch"` (leave
`springY` off — it defaults to the midpoint, which you'll drag in the editor).
Example — change:

```json
     {
      "x0": 0.035,
      "x1": 0.112,
      "y0": 0.04,
      "y1": 0.3,
      "recessM": 0.12
     },
```

to:

```json
     {
      "x0": 0.035,
      "x1": 0.112,
      "y0": 0.04,
      "y1": 0.3,
      "recessM": 0.12,
      "shape": "arch"
     },
```

Apply the same `"shape": "arch"` to the other tall openings. If the spec has no
distinct oculus rects yet, add `"shape": "circle"` to whichever 3rd-floor rects
the artwork draws as round (confirm against the texture in the editor before
committing); otherwise leave the oculi for the editor pass in Step 4. Apply
`"shape": "arch"` to any ground-floor `doors` entry the artwork draws as arched.

- [ ] **Step 3: Start the dev server and load the overlay**

Use the preview tooling:
- `preview_start` (dev server at `http://127.0.0.1:5173`).
- Navigate with `?specdebug=1` to overlay the profiles, framed on 144 Franklin.
- `preview_screenshot` — confirm the green silhouettes trace arches over the
  2nd-floor windows and circles over the oculi (not rectangles).

- [ ] **Step 4: Register the curves in the recess editor**

- Navigate with `?facadeedit=1` (or press Shift+E).
- Click 144 Franklin to load its faces; select each arched window, confirm
  `shape: arch`, and drag the **spring y** slider so the dashed spring line sits
  where the painted arch begins to curve. Set any remaining oculi to `circle`.
- `Save → JSON` writes the coords back to the spec file.
- `preview_screenshot` of the final recessed result (Scene mode, not debug) —
  confirm arched panes + flush spandrels and round oculi, and check the
  accepted curve seam reads acceptably at the fixed iso camera.

- [ ] **Step 5: Verify the build still passes**

Run: `npm run build`
Expected: build succeeds, no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/facade-specs/144-franklin.v0.1.json
git commit -m "feat(144-franklin): arched 2nd-floor windows + oculi via curved recesses

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review notes

- **Spec coverage:** schema `shape` field (T2/T4/T6), arch half-ellipse in face-coords (T1), circle (T1), `openingProfile`/`profileMesh`(=`fanGeometry`)/`fillerMeshes`(=`addShapedOpening` fillers) (T1–T2), straight reveals on arch lower body only + none on circle (T2), `complementRects` untouched (T2 — confirmed: openings still pushed as bounding rects at line 81), specdebug overlay (T3), editor shape selector + spring handle + SVG preview (T5), `patchShape`/`patchSpring` (T4), unit tests (T1/T4), in-engine verification (T6), default springY = midpoint (T1 `springYOf`, T4 `patchShape`). All covered.
- **Type consistency:** `openingProfile(rect, segments?)` returns `{ outline: {x,y}[], fillers: {x,y}[][] }` — used identically in T1 tests, T2 `addShapedOpening`, T3 overlay. `springYOf` used in T1 + T2. `patchShape(spec, path, shape)` / `patchSpring(spec, path, value)` signatures match across T4 (def + tests) and T5 (`setShape`/`setSpring`). `mk(..., src)` 8th arg threaded only for window/door.
- **No placeholders:** every code step shows full code; verification steps give exact commands + expected output.
```
