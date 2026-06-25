# AI Inked Component Kit Spike — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove or kill the modular inked-component approach: generate a brick inked component set (wall/window/cornice/ground-floor) in tintable-neutral form, compose ONE building from them in-engine, and recolor it to 2 tint variants — judged against the reference boards.

**Architecture:** A throwaway, BIN-gated overlay. A pure `inkedFacadeCompose.js` returns face-local rects for the wall fill, window grid, cornice strip, and ground-floor band from a building's storeys/bays. A thin `buildInkedFacadeTest` renderer in `SceneView.jsx` maps those rects to world geometry with the component textures, each `MeshBasicMaterial({ map, color: tint })` so color is a shader multiply. The existing `decorateTypologicalWall` path is untouched. Image generation is an external GPT-5.5 render (manual gate). Verification: build + Node tests for the pure module + in-engine screenshot for the visual go/no-go.

**Tech Stack:** React 19 + Three.js + Vite; Node `--test` for the pure module; existing `footprintEdges` / `faceFrame` / `classifyBuilding` utilities; `THREE.RepeatWrapping` for the tiled wall.

**Spec:** `docs/superpowers/specs/2026-06-16-ai-inked-component-kit-spike-design.md`

---

## File Structure

- `docs/reference/art/prompts/inked-components-brick.v1.md` — **create**. Four component generation prompts (wall, window, cornice, ground floor) + canvas sizes + tiling/alpha requirements. Durable deliverable.
- `assets/inked/brick-wall.v1.png`, `brick-window.v1.png`, `brick-cornice.v1.png`, `brick-ground.v1.png` — **create (by Batu, manual gate)**.
- `src/inkedFacadeCompose.js` — **create**. Pure composition: storeys + bays + component set → face-local rects. Node-testable.
- `src/inkedFacadeCompose.test.mjs` — **create**. Tests.
- `src/SceneView.jsx` — **modify**. Add `buildInkedFacadeTest(three, scene)` renderer + one call site; gated by `INKED_FACADE_TEST` (empty = no-op).
- `docs/DECISION_LOG.md` — **modify**. Record decisions + spike result.

---

## Task 1: Author the four component generation prompts

**Files:**
- Create: `docs/reference/art/prompts/inked-components-brick.v1.md`

- [ ] **Step 1: Write the prompt scaffolds**

Create `docs/reference/art/prompts/inked-components-brick.v1.md`:

```markdown
# Inked Components — Brick System v1

Style anchors (attach to EVERY prompt): `docs/reference/art/II-C-style-system-tile.png`,
`docs/reference/art/inked-indie-compact-corner-style-frame-revision-a.png`,
`docs/reference/art/II-assembled-mini-scene.png`.

GLOBAL STYLE (prepend to each): "Hand-inked editorial illustration in the exact
style of the attached reference boards: confident dark ink outlines, hand-hatched
shadow, visible paper grain, flat orthographic elevation, no perspective.
TINTABLE NEUTRAL: render in dark ink on a light warm-grey fill ONLY — no saturated
color (color is applied later in-engine). No sky, no ground, no neighbors."

## 1. Wall — assets/inked/brick-wall.v1.png  (1024×1024)
"...a SEAMLESS TILING brick coursing swatch: running-bond brick with inked mortar
lines, subtle hatched weathering. Must tile cleanly on all four edges (top maps to
bottom, left maps to right). Brick only, no windows, no edges of a building."

## 2. Window — assets/inked/brick-window.v1.png  (512×768, TRANSPARENT background)
"...a single double-hung sash window for a brick rowhouse: inked frame, two-over-two
panes, a stone lintel above and a sill below, light hatching for glass reflection.
TRANSPARENT background (alpha) — draw ONLY the window unit and its lintel/sill, no
surrounding wall."

## 3. Cornice — assets/inked/brick-cornice.v1.png  (1024×256, TRANSPARENT background)
"...a horizontally-tileable bracketed wooden cornice strip for a brick rowhouse:
inked brackets/dentils with hatched undershadow. Tiles left-to-right seamlessly.
TRANSPARENT background above and below the cornice band."

## 4. Ground floor — assets/inked/brick-ground.v1.png  (1024×512)
"...a residential parlor-floor elevation for a brick rowhouse: a stoop with steps,
an entry door with transom, and one tall parlor window beside it, all inked. Brick
wall fills the rest. Opaque, full bay width, edge to edge."
```

- [ ] **Step 2: Commit**

```bash
git add docs/reference/art/prompts/inked-components-brick.v1.md
git commit -m "docs(art): inked brick component generation prompts v1"
```

---

## Task 2: MANUAL GATE — Batu renders the four components

**Files:**
- Create (by Batu): `assets/inked/brick-wall.v1.png`, `brick-window.v1.png`, `brick-cornice.v1.png`, `brick-ground.v1.png`

- [ ] **Step 1: Hand off the prompts**

Give Batu the four prompts + the three style attachments. Batu renders each in GPT-5.5.

- [ ] **Step 2: Receive the assets**

Batu saves all four to `assets/inked/`. Confirm before wiring:

Run: `ls -la assets/inked/brick-*.v1.png`
Expected: four files, non-zero size.

> Checkpoint, not an agent task. Do not proceed to Task 4 until the four PNGs
> exist. Task 3 (pure module) runs in parallel — it needs no assets.

---

## Task 3: Pure composition module

**Files:**
- Create: `src/inkedFacadeCompose.js`
- Test: `src/inkedFacadeCompose.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/inkedFacadeCompose.test.mjs`:

```javascript
// Run: node --test src/inkedFacadeCompose.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { composeInkedFacade } from "./inkedFacadeCompose.js";

test("returns wall, cornice, ground band, and a windows grid", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.ok(f.wall, "wall present");
  assert.ok(f.cornice, "cornice present");
  assert.ok(f.ground, "ground present");
  assert.ok(Array.isArray(f.windows), "windows array");
});

test("upper storeys each get `bays` windows (ground floor excluded)", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  // 3 upper storeys x 3 bays = 9 windows
  assert.equal(f.windows.length, 9);
});

test("all rects are within the 0..1 face square", () => {
  const f = composeInkedFacade({ storeys: 5, bays: 2 });
  const rects = [f.wall, f.cornice, f.ground, ...f.windows];
  for (const r of rects) {
    assert.ok(r.x0 >= 0 && r.x1 <= 1, "x in range");
    assert.ok(r.y0 >= 0 && r.y1 <= 1, "y in range");
    assert.ok(r.x1 > r.x0 && r.y1 > r.y0, "non-degenerate");
  }
});

test("ground band sits at the bottom, cornice at the top", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  assert.equal(f.ground.y0, 0);
  assert.ok(f.cornice.y1 === 1);
  assert.ok(f.ground.y1 <= f.windows[0].y0 + 1e-9, "windows above ground");
});

test("windows do not overlap the ground band", () => {
  const f = composeInkedFacade({ storeys: 4, bays: 3 });
  for (const w of f.windows) assert.ok(w.y0 >= f.ground.y1 - 1e-9);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/inkedFacadeCompose.test.mjs`
Expected: FAIL — module/function missing.

- [ ] **Step 3: Write minimal implementation**

Create `src/inkedFacadeCompose.js`:

```javascript
// src/inkedFacadeCompose.js
// Pure, Node-runnable facade composition for the inked component spike. No
// Three.js. Given a building's storey count and bay count, returns face-local
// rects (x0..x1, y0..y1 as 0..1 fractions of facade width/height) for the wall
// fill, a window grid (one per upper-storey bay), a cornice strip at the top,
// and a ground-floor band at the bottom. The renderer maps these to world geom.

export function composeInkedFacade({ storeys, bays }) {
  const s = Math.max(2, storeys);
  const b = Math.max(1, bays);

  const groundFrac = 1 / s;          // ground floor = one storey tall
  const corniceFrac = 0.06;          // thin cap at the very top
  const wall = { x0: 0, y0: 0, x1: 1, y1: 1 };
  const ground = { x0: 0, y0: 0, x1: 1, y1: groundFrac };
  const cornice = { x0: 0, y0: 1 - corniceFrac, x1: 1, y1: 1 };

  // Upper storeys occupy [groundFrac, 1 - corniceFrac]; split into (s-1) rows.
  const upperTop = 1 - corniceFrac;
  const upperBot = groundFrac;
  const rows = s - 1;
  const rowH = (upperTop - upperBot) / rows;

  // Window sizing: centered in each row/bay cell with margins.
  const cellW = 1 / b;
  const winWFrac = 0.5;   // window occupies 50% of its bay width
  const winHFrac = 0.55;  // and 55% of its row height
  const windows = [];
  for (let r = 0; r < rows; r += 1) {
    const cy0 = upperBot + r * rowH;
    for (let c = 0; c < b; c += 1) {
      const cx0 = c * cellW;
      const cxMid = cx0 + cellW / 2;
      const cyMid = cy0 + rowH / 2;
      windows.push({
        x0: cxMid - (cellW * winWFrac) / 2,
        x1: cxMid + (cellW * winWFrac) / 2,
        y0: cyMid - (rowH * winHFrac) / 2,
        y1: cyMid + (rowH * winHFrac) / 2,
      });
    }
  }

  return { wall, ground, cornice, windows };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/inkedFacadeCompose.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/inkedFacadeCompose.js src/inkedFacadeCompose.test.mjs
git commit -m "feat(spike): pure inked facade composition module + tests"
```

---

## Task 4: Inked facade renderer (gated, no-op until configured)

**Files:**
- Modify: `src/SceneView.jsx`

- [ ] **Step 1: Add the import and the config block**

At the top of `src/SceneView.jsx` with the other local imports:

```javascript
import { composeInkedFacade } from "./inkedFacadeCompose.js";
```

Near `buildBlockStorefronts`, add the spike config + renderer. `INKED_FACADE_TEST`
is empty by default (no-op); Task 5 fills it with `{ bin, tint }` entries.

```javascript
// SPIKE (2026-06-16): compose one brick building from inked components and tint
// it, to judge the modular inked-component approach. Throwaway; gated by
// INKED_FACADE_TEST (empty = no-op). Does NOT touch decorateTypologicalWall.
const INKED_FACADE_TEST = []; // e.g. [{ bin: "3071234567", tint: 0xb5664a }]

function loadInkedComponent(file, { repeat, transparent } = {}) {
  const tex = new THREE.TextureLoader().load(
    new URL(`../assets/inked/${file}`, import.meta.url).href,
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return new THREE.MeshBasicMaterial({ map: tex, transparent: !!transparent, side: THREE.DoubleSide });
}

function buildInkedFacadeTest(three, scene) {
  if (!INKED_FACADE_TEST.length) return;
  const byBin = new Map(scene.buildings.map((b) => [b.bin, b]));

  for (const { bin, tint } of INKED_FACADE_TEST) {
    const building = byBin.get(bin);
    if (!building || !building.polygon || !building.centroid) continue;
    const typ = classifyBuilding({ sourceProperties: building.sourceProperties ?? {} });
    const storeys = Math.max(2, typ.storeyCount ?? 4);
    const bays = 3;

    const edges = footprintEdges(building.polygon, building.centroid);
    if (!edges.length) continue;
    const edge = edges.slice().sort((a, b) => b.length - a.length)[0];
    const { left, right, normal } = faceFrame(edge, building.height, null, scene);
    const point = (x, y, off) => [
      left.x + (right.x - left.x) * x + normal.x * off,
      y * building.height,
      left.z + (right.z - left.z) * x + normal.z * off,
    ];
    const quad = (r, off, uvFlip = true) => {
      const positions = new Float32Array([
        ...point(r.x0, r.y0, off), ...point(r.x1, r.y0, off),
        ...point(r.x1, r.y1, off), ...point(r.x0, r.y1, off),
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const uv = uvFlip ? [1,0, 0,0, 0,1, 1,1] : [0,0, 1,0, 1,1, 0,1];
      geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
      geo.setIndex([0, 1, 2, 0, 2, 3]);
      return geo;
    };

    const f = composeInkedFacade({ storeys, bays });

    // Wall (tiled brick), tinted.
    const wallMat = loadInkedComponent("brick-wall.v1.png", { repeat: [bays, storeys] });
    wallMat.color.setHex(tint);
    three.add(new THREE.Mesh(quad(f.wall, 0.02), wallMat));

    // Ground floor band (opaque), tinted.
    const groundMat = loadInkedComponent("brick-ground.v1.png");
    groundMat.color.setHex(tint);
    three.add(new THREE.Mesh(quad(f.ground, 0.03), groundMat));

    // Cornice strip (alpha), tinted.
    const corniceMat = loadInkedComponent("brick-cornice.v1.png", { transparent: true });
    corniceMat.color.setHex(tint);
    three.add(new THREE.Mesh(quad(f.cornice, 0.04), corniceMat));

    // Windows (alpha), NOT tinted (frames read as painted trim).
    for (const w of f.windows) {
      const winMat = loadInkedComponent("brick-window.v1.png", { transparent: true });
      three.add(new THREE.Mesh(quad(w, 0.035), winMat));
    }
  }
}
```

- [ ] **Step 2: Call it from the scene build**

Find `buildBlockStorefronts(three, scene);` in `SceneView.jsx` and add after it:

```javascript
buildBlockStorefronts(three, scene);
buildInkedFacadeTest(three, scene); // SPIKE 2026-06-16
```

- [ ] **Step 3: Verify build is green (still a no-op)**

Run: `npm run build`
Expected: build succeeds (pre-existing large-GLB chunk warning is fine).

- [ ] **Step 4: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(spike): inked facade composer renderer (gated, no-op)"
```

---

## Task 5: Pick buildings, activate, compose + recolor, capture

**Files:**
- Modify: `src/SceneView.jsx` (the `INKED_FACADE_TEST` array only)

- [ ] **Step 1: Confirm assets exist (Task 2 gate)**

Run: `ls -la assets/inked/brick-*.v1.png`
Expected: four files. If missing, stop — Task 2 not done.

- [ ] **Step 2: Pick 1–2 brick buildings near the Franklin corner**

Run the dev server (`npm run dev`), open the preview, and in the console choose
~4-storey block buildings:

```javascript
window.__scene.buildings
  .filter(b => b.fromBlockExtract && b.sourceProperties)
  .map(b => ({ bin: b.bin, storeys: b.sourceProperties.NumFloors }))
  .filter(x => Math.round(x.storeys) >= 3 && Math.round(x.storeys) <= 5)
  .slice(0, 3)
```

- [ ] **Step 3: Fill `INKED_FACADE_TEST` with two tint variants**

Put the chosen BIN(s) in, with two tints to test recolor (one building per tint,
or the same bin twice is not valid — use two adjacent bins):

```javascript
const INKED_FACADE_TEST = [
  { bin: "<bin-A>", tint: 0xb5664a }, // warm brick red
  { bin: "<bin-B>", tint: 0x7d5a44 }, // muted brown
];
```

- [ ] **Step 4: Capture in-engine**

Reload the preview. Screenshot both buildings at the iso angles. Confirm:
- components compose (wall tiles, windows/cornice/ground placed), no fatal seams,
- the two tints read as the same inked brick recolored,
- no console errors (`preview_console_logs` level error → none).

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(spike): activate inked facade test on 2 brick buildings"
```

---

## Task 6: Decision gate + record

**Files:**
- Modify: `docs/DECISION_LOG.md`

- [ ] **Step 1: Present the comparison to Batu**

Show the in-engine screenshots side-by-side with the reference boards. Batu judges
against the success criteria: reads inked / composes seamlessly / recolor looks
right / holds at iso + zoom.

- [ ] **Step 2: Record decisions + spike result**

Prepend a `docs/DECISION_LOG.md` entry (newest first): (a) look gate decided — one
II-C inked language scene-wide; (b) non-hero facades = modular inked component kit,
not whole-building tiles; (c) tintable-neutral components + shader tint; (d)
technique #3 first, #1 NPR fallback; (e) the spike result (go → full component-kit
spec; no-go → #1 NPR spike). Use the actual outcome.

- [ ] **Step 3: Commit**

```bash
git add docs/DECISION_LOG.md
git commit -m "docs(decision): inked look + modular component kit; spike result"
```

- [ ] **Step 4: Next step depends on the verdict**

- **Go:** brainstorm the full inked component kit spec — the other 3 materials
  (clapboard/brownstone/modern), more component variants, typology-driven
  composition across the block, and the hero re-render track.
- **No-go:** brainstorm the #1 NPR post-pass spike.
- Either way, decide whether to keep or revert the throwaway spike wiring.

---

## Self-Review Notes

- **Spec coverage:** component prompts (Task 1) ✓; manual render gate (Task 2) ✓;
  pure composition module (Task 3) ✓; gated renderer with tint multiply + alpha
  components (Task 4) ✓; compose-one-building + 2-tint recolor + capture (Task 5)
  ✓; go/no-go + DECISION_LOG (Task 6) ✓. Three spike risks (look / composability /
  color) are all exercised by Tasks 4–5. Out-of-scope items untasked — correct.
- **Type consistency:** `composeInkedFacade({ storeys, bays })` → `{ wall, ground,
  cornice, windows[] }` used identically in Task 4. `INKED_FACADE_TEST` entries are
  `{ bin, tint }` in both Task 4 and Task 5.
- **Verification reality:** the pure module is unit-tested; the look/composability/
  recolor are judged visually (Task 6) — matches the spec (deliverable is a
  judgment). Alpha/seam/tint risks are explicitly the things the screenshot reveals.
- **Reversibility:** gated by empty `INKED_FACADE_TEST`; never edits
  `decorateTypologicalWall`; trivially removable.
