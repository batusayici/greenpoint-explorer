# AI Inked Infill Tile Spike — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove or kill technique #3 (AI-generated inked facade tiles) by rendering one generic inked tile and mapping it onto 1–2 Franklin context buildings in-engine, judged against the reference boards.

**Architecture:** A throwaway, flag-gated overlay. A new pure helper picks/places a textured quad on a building's street facade; a thin renderer in `SceneView.jsx` draws the tile for a hardcoded list of test BINs, leaving the existing `decorateTypologicalWall` path untouched for every other building. Image generation is an external GPT-5.5 render (manual gate). Verification is build + in-engine screenshot, not unit tests, because the deliverable is a visual go/no-go.

**Tech Stack:** React 19 + Three.js + Vite; Node `--test` for the one pure helper; existing `footprintEdges` / `faceFrame` / `classifyBuilding` utilities in the codebase.

**Spec:** `docs/superpowers/specs/2026-06-16-ai-inked-infill-tile-spike-design.md`

---

## File Structure

- `docs/reference/art/prompts/inked-infill-tile.v1.md` — **create**. The reusable inked-tile generation prompt scaffold + canvas size. Durable deliverable.
- `assets/inked-infill-tile-v1.png` — **create (by Batu, manual gate)**. The rendered tile.
- `src/inkedTilePlacement.js` — **create**. Pure helper: given a building's street edge + storeys, returns the quad corners (face-local) for the tile, and the chosen test BINs. Node-testable.
- `src/inkedTilePlacement.test.mjs` — **create**. Tests for the helper.
- `src/SceneView.jsx` — **modify**. Add `buildInkedTileTest(three, scene)` renderer + one call site; gated by `INKED_TILE_TEST_BINS` (empty = no-op).
- `docs/DECISION_LOG.md` — **modify**. Record look-gate decision + spike result.

---

## Task 1: Author the inked-tile generation prompt

**Files:**
- Create: `docs/reference/art/prompts/inked-infill-tile.v1.md`

- [ ] **Step 1: Write the prompt scaffold**

Create `docs/reference/art/prompts/inked-infill-tile.v1.md` with this content:

```markdown
# Inked Infill Tile — Generation Prompt v1

Canvas: 1024 × 1536 px (portrait; 2 wide : 3 tall ≈ one rowhouse facade).
Style anchors (attach all three): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

PROMPT:
"A single Greenpoint Brooklyn brick rowhouse facade, drawn in the exact
hand-inked editorial illustration style of the attached reference boards:
confident dark ink outlines on every edge, hand-hatched shadow under sills and
cornice, a tight warm-neutral palette (brick red, warm grey, cream), visible
paper-grain texture, flat orthographic elevation (no perspective, no sky, no
ground, no neighbors — facade only, edge to edge).

Structure: 4 storeys. Upper 3 storeys each have 3 evenly-spaced double-hung
windows with simple inked lintels and sills. Ground floor is a storefront: a
recessed shop window with a transom, a narrow entry door, and a plain awning
band above (no text). A modest inked cornice caps the roofline.

It must read as ONE repeatable module: the left and right edges are clean
vertical brick so copies can sit side by side. Illustration, not a photograph."
```

- [ ] **Step 2: Commit**

```bash
git add docs/reference/art/prompts/inked-infill-tile.v1.md
git commit -m "docs(art): inked infill tile generation prompt v1"
```

---

## Task 2: MANUAL GATE — Batu renders the tile

**Files:**
- Create (by Batu): `assets/inked-infill-tile-v1.png`

- [ ] **Step 1: Hand off the prompt**

Give Batu the prompt from `docs/reference/art/prompts/inked-infill-tile.v1.md`
and the three attachments. Batu renders in GPT-5.5.

- [ ] **Step 2: Receive the asset**

Batu saves the render to `assets/inked-infill-tile-v1.png`. Confirm the file
exists before proceeding:

Run: `ls -la "assets/inked-infill-tile-v1.png"`
Expected: file present, non-zero size.

> This is a checkpoint, not an agent task. Do not proceed to Task 4 wiring until
> the PNG exists. (Task 3 can run in parallel — it needs no asset.)

---

## Task 3: Pure placement helper + choose test BINs

**Files:**
- Create: `src/inkedTilePlacement.js`
- Test: `src/inkedTilePlacement.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/inkedTilePlacement.test.mjs`:

```javascript
// Run: node --test src/inkedTilePlacement.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { tileQuadFaceLocal } from "./inkedTilePlacement.js";

test("returns 4 face-local corners spanning the full facade width and height", () => {
  const q = tileQuadFaceLocal({ off: 0.02 });
  assert.equal(q.length, 4);
  // [x, y, off] triples; x in {0,1}, y in {0,1}
  const xs = q.map((c) => c[0]).sort();
  const ys = q.map((c) => c[1]).sort();
  assert.deepEqual(xs, [0, 0, 1, 1]);
  assert.deepEqual(ys, [0, 1, 0, 1].sort());
  for (const c of q) assert.equal(c[2], 0.02);
});

test("winding is CCW from bottom-left so the inked face points outward", () => {
  const q = tileQuadFaceLocal({ off: 0 });
  assert.deepEqual(q[0], [0, 0, 0]); // bottom-left first
  assert.deepEqual(q[1], [1, 0, 0]); // bottom-right
  assert.deepEqual(q[2], [1, 1, 0]); // top-right
  assert.deepEqual(q[3], [0, 1, 0]); // top-left
});

test("off defaults to a small proud offset when omitted", () => {
  const q = tileQuadFaceLocal({});
  assert.ok(q[0][2] > 0 && q[0][2] < 0.1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/inkedTilePlacement.test.mjs`
Expected: FAIL — `tileQuadFaceLocal` not exported / module missing.

- [ ] **Step 3: Write minimal implementation**

Create `src/inkedTilePlacement.js`:

```javascript
// src/inkedTilePlacement.js
// Pure, Node-runnable placement for the inked-tile spike. No Three.js.
// Returns the four face-local corners of a quad covering a building's whole
// street facade (x and y are 0..1 fractions of facade width/height; off is the
// outward normal offset in scene units). The renderer maps these to world
// coords with the same face `point(x, y, off)` helper used elsewhere.

// Hardcoded list of context-building BINs to overlay with the inked tile for
// this throwaway spike. Empty by default so the build is a no-op until Task 5
// fills it from the Task 3 investigation. Example: ["3071234567"].
export const INKED_TILE_TEST_BINS = [];

export function tileQuadFaceLocal({ off = 0.02 }) {
  return [
    [0, 0, off], // bottom-left
    [1, 0, off], // bottom-right
    [1, 1, off], // top-right
    [0, 1, off], // top-left
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/inkedTilePlacement.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Investigate and record candidate test BINs**

Find 1–2 context buildings near the Franklin corner whose typology matches the
tile (≈4 storeys). Run this in the project root:

```bash
node -e '
const fs=require("fs");
const blocks=["franklin-milton","greenpoint-east"];
const { classifyBuilding } = await import("./src/buildingTypology.js");
for (const b of blocks) {
  const d=JSON.parse(fs.readFileSync("src/data/blocks/"+b+".block.json","utf8"));
  // print bin + storeyCount for commercial-ish buildings to eyeball 4-storey ones
  console.log(b, Object.keys(d));
}
' 2>&1 | head
```

If the block JSON does not carry per-building PLUTO inline, instead read the
chosen BINs off the live scene in the browser console:

Run the dev server (`npm run dev`), open the preview, and in the console:

```javascript
window.__scene.buildings
  .filter(b => b.fromBlockExtract && b.sourceProperties)
  .map(b => ({ bin: b.bin, storeys: b.sourceProperties.NumFloors }))
  .filter(x => Math.round(x.storeys) === 4)
  .slice(0, 3)
```

Record the 1–2 chosen BINs in the commit message. (They get pasted into
`INKED_TILE_TEST_BINS` in Task 5.)

- [ ] **Step 6: Commit**

```bash
git add src/inkedTilePlacement.js src/inkedTilePlacement.test.mjs
git commit -m "feat(spike): pure inked-tile placement helper + test bin list"
```

---

## Task 4: Render the inked tile onto the test buildings

**Files:**
- Modify: `src/SceneView.jsx`

- [ ] **Step 1: Add the tile renderer**

In `src/SceneView.jsx`, add this function near `buildBlockStorefronts` (it reuses
the same `footprintEdges`, `faceFrame`, `dist`, and `THREE` already imported in
this file). Add the import at the top with the other local imports:

```javascript
import { INKED_TILE_TEST_BINS, tileQuadFaceLocal } from "./inkedTilePlacement.js";
```

Then add the renderer:

```javascript
// SPIKE (2026-06-16): overlay one AI inked tile on a few context buildings to
// judge technique #3. Throwaway; gated by INKED_TILE_TEST_BINS (empty = no-op).
// Does NOT touch decorateTypologicalWall — it draws a textured quad a hair proud
// of the chosen buildings' street facade.
function buildInkedTileTest(three, scene) {
  if (!INKED_TILE_TEST_BINS.length) return;
  const bins = new Set(INKED_TILE_TEST_BINS);
  const tex = new THREE.TextureLoader().load(
    new URL("../assets/inked-infill-tile-v1.png", import.meta.url).href,
  );
  tex.colorSpace = THREE.SRGBColorSpace;

  for (const building of scene.buildings) {
    if (!bins.has(building.bin) || !building.polygon || !building.centroid) continue;
    const edges = footprintEdges(building.polygon, building.centroid);
    if (!edges.length) continue;
    // Street face = longest edge (good enough for the spike).
    const edge = edges.slice().sort((a, b) => b.length - a.length)[0];
    const { left, right, normal } = faceFrame(edge, building.height, null, scene);
    const point = (x, y, off) => [
      left.x + (right.x - left.x) * x + normal.x * off,
      y * building.height,
      left.z + (right.z - left.z) * x + normal.z * off,
    ];
    const quad = tileQuadFaceLocal({ off: 0.03 });
    const positions = new Float32Array(quad.flatMap((c) => point(c[0], c[1], c[2])));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // U flipped to read from the street side (matches the sign mirror fix 9f6ff2b).
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1,0, 0,0, 0,1, 1,1]), 2));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    three.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })));
  }
}
```

- [ ] **Step 2: Call it from the scene build**

Find where `buildBlockStorefronts(three, scene)` is called in `SceneView.jsx`
(grep: `buildBlockStorefronts(`). Add the spike call immediately after it:

```javascript
buildBlockStorefronts(three, scene);
buildInkedTileTest(three, scene); // SPIKE 2026-06-16
```

- [ ] **Step 3: Verify the build is green (still a no-op — bins empty)**

Run: `npm run build`
Expected: build succeeds (the large-GLB chunk warning is pre-existing and fine).

- [ ] **Step 4: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(spike): inked-tile overlay renderer (gated, no-op until bins set)"
```

---

## Task 5: Activate the test bins and capture in-engine

**Files:**
- Modify: `src/inkedTilePlacement.js`

- [ ] **Step 1: Fill in the chosen BINs**

Paste the 1–2 BINs recorded in Task 3 Step 5 into `INKED_TILE_TEST_BINS` in
`src/inkedTilePlacement.js`, e.g.:

```javascript
export const INKED_TILE_TEST_BINS = ["3071234567"]; // from Task 3 investigation
```

- [ ] **Step 2: Confirm the tile asset exists (Task 2 gate)**

Run: `ls -la "assets/inked-infill-tile-v1.png"`
Expected: present. If missing, stop — Task 2 is not done.

- [ ] **Step 3: Run dev server and capture**

Start the dev server, open the preview, and screenshot the chosen building(s) at
the iso angles. Confirm:
- the tile renders on the street facade (not blank, not z-fighting badly),
- no console errors (`preview_console_logs` level error → none).

- [ ] **Step 4: Commit**

```bash
git add src/inkedTilePlacement.js
git commit -m "feat(spike): activate inked-tile test bins"
```

---

## Task 6: Decision gate + record

**Files:**
- Modify: `docs/DECISION_LOG.md`

- [ ] **Step 1: Present the comparison to Batu**

Show the in-engine screenshot side-by-side with the reference boards. Batu judges
against the success criteria (reads inked / holds at iso + zoom / doesn't fatally
clash).

- [ ] **Step 2: Record the look-gate decision and spike result**

Prepend an entry to `docs/DECISION_LOG.md` (newest first) recording: (a) the
look gate is decided — one II-C inked language scene-wide, heroes bespoke-but-
inked over time, infill procedural-inked; (b) technique #3 tried first; (c) the
spike result (go → full AI-tile kit spec; no-go → pivot to #1 NPR post-pass
spike). Use the actual outcome.

- [ ] **Step 3: Commit**

```bash
git add docs/DECISION_LOG.md
git commit -m "docs(decision): inked look gate decided; inked-tile spike result"
```

- [ ] **Step 4: Next step depends on the verdict**

- **Go:** brainstorm the full procedural AI-tile kit (new spec) — multi-typology
  tiles, per-storey scaling, seam/atlas handling, hero re-render track.
- **No-go:** brainstorm the #1 NPR post-pass spike (outline + paper grain +
  palette grade) as the next feasibility test.
- Either way, decide whether to keep or revert the throwaway overlay wiring.

---

## Self-Review Notes

- **Spec coverage:** prompt scaffold (Task 1) ✓; manual render gate (Task 2) ✓;
  engine wiring on 1–2 buildings replacing-for-test-only via gate (Tasks 3–5) ✓;
  in-engine capture vs boards (Task 5–6) ✓; go/no-go + DECISION_LOG (Task 6) ✓;
  out-of-scope items (multi-typology, library, hero re-render, NPR pass) are not
  tasked — correct.
- **Verification reality:** only the pure placement helper is unit-tested; the
  look itself is judged visually (Task 6). This matches the spec — the spike's
  deliverable is a judgment, not an assertion.
- **Reversibility:** wiring is gated by `INKED_TILE_TEST_BINS` (empty = no-op)
  and never edits `decorateTypologicalWall`, so the spike is trivially removable.
