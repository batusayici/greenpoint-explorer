# Storefront Sign System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make storefront names carry at the iso angle by replacing flat, coplanar sign bands with a per-category sign system (enlarged band + perpendicular blade signs), where signs default to **category labels** ("Barbershop", "Café") and only show real branding when a business is `claimed`.

**Architecture:** A new pure, Node-testable module `src/storefrontSigns.js` decides *what* signs each storefront gets and their face-local parameters (kind, label, position). A thin `buildStorefrontSigns` renderer inside `SceneView.jsx` maps those parameters to Three.js geometry, replacing the inline sign block. Hero buildings are untouched — they already render their real branding via the hero path and are excluded from the block storefront flow, so they remain the "claimed showcase" by construction.

**Tech Stack:** React 19 + Three.js (r0.184) + Vite. Tests: `node --test` with `node:test` + `node:assert/strict`, ESM `.test.mjs` files (see `src/groundLayer.test.mjs`).

**Spec:** `docs/superpowers/specs/2026-06-16-storefront-sign-system-design.md`

---

## File Structure

- **Create** `src/storefrontSigns.js` — pure module: `categoryLabel()`, `resolveSignLabel()`, `planStorefrontSigns()`. No Three.js import.
- **Create** `src/storefrontSigns.test.mjs` — unit tests for the pure module.
- **Modify** `src/SceneView.jsx`:
  - Add `buildStorefrontSigns(three, placements, faceFrameData, building)` renderer.
  - Replace the inline per-bay sign geometry (currently ~lines 1032–1061) with: `const placements = planStorefrontSigns({ bays: binBays, storeys }); buildStorefrontSigns(...)`.
  - Feed `makeStorefrontSignTexture` the resolved `label`, never `bay.name`.
  - Leave the existing awning strip (~lines 1063–1080) and U-flip UV exactly as-is.

### Key shapes

```js
// input bays (from assignStorefronts, already in SceneView): { bin, name, category, slotIndex, ... }
// optional future claim fields on a bay: { claimed?: boolean, brandName?: string }

// planStorefrontSigns({ bays, storeys }) -> SignPlacement[]
//   band:  { kind:'band',  bayName, label, claimed, cx, width, y0, y1, off }
//   blade: { kind:'blade', bayName, label, claimed, cx, mountY, panelHeightFrac, projectMeters, off }
```

`cx`, `mountY`, `y0`, `y1`, `panelHeightFrac` are **face-local fractions** (cx along the street edge 0→1; y values as fraction of building height). `projectMeters` is converted to world units by the renderer using `scene.projection.scale`. `off` stays `0.02` world units (proud of wall), matching today's band.

---

## Task 1: Category label map + claim resolution (pure)

**Files:**
- Create: `src/storefrontSigns.js`
- Test: `src/storefrontSigns.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// src/storefrontSigns.test.mjs
// Run: node --test src/storefrontSigns.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryLabel, resolveSignLabel } from "./storefrontSigns.js";

test("categoryLabel maps known OSM categories to title-case labels", () => {
  assert.equal(categoryLabel("hairdresser"), "Barbershop");
  assert.equal(categoryLabel("barber"), "Barbershop");
  assert.equal(categoryLabel("cafe"), "Café");
  assert.equal(categoryLabel("deli"), "Deli");
  assert.equal(categoryLabel("bar"), "Bar");
  assert.equal(categoryLabel("pub"), "Bar");
  assert.equal(categoryLabel("restaurant"), "Restaurant");
  assert.equal(categoryLabel("convenience"), "Corner Store");
  assert.equal(categoryLabel("clothes"), "Clothing");
  assert.equal(categoryLabel("interior_decoration"), "Home & Decor");
});

test("categoryLabel falls back to Shop for unknown/missing", () => {
  assert.equal(categoryLabel("unknown"), "Shop");
  assert.equal(categoryLabel(undefined), "Shop");
  assert.equal(categoryLabel(""), "Shop");
});

test("resolveSignLabel uses category label unless claimed with a brandName", () => {
  // unclaimed: never the real name, always the category label
  assert.equal(resolveSignLabel({ name: "Sereneco", category: "restaurant" }), "Restaurant");
  assert.equal(resolveSignLabel({ name: "Joe's", category: "hairdresser" }), "Barbershop");
  // claimed with brandName: real branding
  assert.equal(resolveSignLabel({ name: "Joe's", category: "hairdresser", claimed: true, brandName: "Joe's Cuts" }), "Joe's Cuts");
  // claimed but no brandName: still falls back to category (no name leak)
  assert.equal(resolveSignLabel({ name: "Joe's", category: "hairdresser", claimed: true }), "Barbershop");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: FAIL — cannot find module `./storefrontSigns.js`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/storefrontSigns.js
// Pure, Node-runnable sign-planning module (no Three.js). Decides which sign
// idioms each storefront bay gets and their face-local parameters. See
// docs/superpowers/specs/2026-06-16-storefront-sign-system-design.md.

// OSM category tag -> default sign label for UNCLAIMED storefronts. Signs never
// show a real business name unless that business is claimed (the monetization
// mechanic): unclaimed = generic, truthful-by-construction, and the product hook.
const CATEGORY_LABELS = {
  bar: "Bar",
  pub: "Bar",
  hairdresser: "Barbershop",
  barber: "Barbershop",
  cafe: "Café",
  deli: "Deli",
  restaurant: "Restaurant",
  convenience: "Corner Store",
  clothes: "Clothing",
  interior_decoration: "Home & Decor",
};

export function categoryLabel(category) {
  return CATEGORY_LABELS[category] ?? "Shop";
}

// Resolve the text shown on a bay's sign: real brand only when claimed AND a
// brandName is present; otherwise the generic category label. Never the raw
// roster name for an unclaimed bay.
export function resolveSignLabel(bay) {
  if (bay && bay.claimed && bay.brandName) return bay.brandName;
  return categoryLabel(bay && bay.category);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: PASS — 3 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/storefrontSigns.js src/storefrontSigns.test.mjs
git commit -m "feat(signs): category-label + claim resolution for storefront signs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Band placements (baseline, every commercial bay)

**Files:**
- Modify: `src/storefrontSigns.js`
- Test: `src/storefrontSigns.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// append to src/storefrontSigns.test.mjs
import { planStorefrontSigns } from "./storefrontSigns.js";

const bays = [
  { bin: "1", name: "Sereneco", category: "restaurant", slotIndex: 0 },
  { bin: "1", name: "Joe's",    category: "hairdresser", slotIndex: 1 },
];

test("every bay yields exactly one band placement with a resolved label", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  const bands = out.filter((p) => p.kind === "band");
  assert.equal(bands.length, 2);
  // labels are category labels, never the roster name
  assert.equal(bands.find((b) => b.bayName === "Sereneco").label, "Restaurant");
  assert.equal(bands.find((b) => b.bayName === "Joe's").label, "Barbershop");
});

test("band geometry params match the legacy band (per-storey, proud of wall)", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  const band = out.find((p) => p.kind === "band");
  const gy = 1 / 4;
  assert.equal(band.off, 0.02);
  assert.ok(Math.abs(band.y0 - gy * 0.55) < 1e-9);
  assert.ok(Math.abs(band.y1 - gy * 0.90) < 1e-9);
  // cx and width follow the per-bin slot layout
  assert.ok(band.cx > 0 && band.cx < 1);
  assert.ok(band.width > 0 && band.width <= 0.4);
});

test("no unclaimed band label equals its roster name", () => {
  const out = planStorefrontSigns({ bays, storeys: 3 });
  for (const p of out) {
    const bay = bays.find((b) => b.name === p.bayName);
    if (!(bay.claimed && bay.brandName)) assert.notEqual(p.label, bay.name);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: FAIL — `planStorefrontSigns` is not exported.

- [ ] **Step 3: Write minimal implementation**

Add to `src/storefrontSigns.js`:

```js
// Plan all sign placements for the bays of a single building.
// Returns face-local placement descriptors; the renderer maps them to world
// geometry. `bays` are the storefront bays assigned to one building (sharing a
// bin); `storeys` is that building's floor count.
export function planStorefrontSigns({ bays, storeys }) {
  const baysPerBin = Math.max(1, bays.length);
  const gy = 1 / Math.max(1, storeys); // one storey as a fraction of total height
  const placements = [];

  for (const bay of bays) {
    const cx = (bay.slotIndex + 0.5) / baysPerBin;
    const width = Math.min(0.4, 0.9 / baysPerBin);
    const label = resolveSignLabel(bay);
    const claimed = Boolean(bay.claimed && bay.brandName);

    // Baseline: a raised band on the upper portion of the ground storey.
    placements.push({
      kind: "band",
      bayName: bay.name,
      label,
      claimed,
      cx,
      width,
      y0: gy * 0.55,
      y1: gy * 0.90,
      off: 0.02,
    });
  }

  return placements;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: PASS — all tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/storefrontSigns.js src/storefrontSigns.test.mjs
git commit -m "feat(signs): planStorefrontSigns band placements (baseline)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Blade signs for the loud trades

**Files:**
- Modify: `src/storefrontSigns.js`
- Test: `src/storefrontSigns.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// append to src/storefrontSigns.test.mjs
test("loud-trade bays get a blade in addition to a band; others do not", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  const blades = out.filter((p) => p.kind === "blade");
  // 'hairdresser' is a loud trade -> one blade; 'restaurant' is not
  assert.equal(blades.length, 1);
  assert.equal(blades[0].bayName, "Joe's");
  assert.equal(blades[0].label, "Barbershop");
});

test("bar and pub are loud trades; cafe and deli are not", () => {
  const mk = (category) => planStorefrontSigns({
    bays: [{ bin: "1", name: "X", category, slotIndex: 0 }], storeys: 3,
  }).filter((p) => p.kind === "blade").length;
  assert.equal(mk("bar"), 1);
  assert.equal(mk("pub"), 1);
  assert.equal(mk("hairdresser"), 1);
  assert.equal(mk("cafe"), 0);
  assert.equal(mk("deli"), 0);
  assert.equal(mk("restaurant"), 0);
});

test("blade carries a positive projection and a mount within the ground storey", () => {
  const blade = planStorefrontSigns({
    bays: [{ bin: "1", name: "X", category: "bar", slotIndex: 0 }], storeys: 4,
  }).find((p) => p.kind === "blade");
  const gy = 1 / 4;
  assert.ok(blade.projectMeters > 0);
  assert.ok(blade.mountY > 0 && blade.mountY < gy);          // within ground storey
  assert.ok(blade.panelHeightFrac > 0 && blade.panelHeightFrac < gy);
  assert.equal(blade.off, 0.02);
});

test("no bay yields more than one band or more than one blade (no stacking)", () => {
  const out = planStorefrontSigns({ bays, storeys: 4 });
  for (const bay of bays) {
    assert.equal(out.filter((p) => p.kind === "band" && p.bayName === bay.name).length, 1);
    assert.ok(out.filter((p) => p.kind === "blade" && p.bayName === bay.name).length <= 1);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: FAIL — no blade placements produced.

- [ ] **Step 3: Write minimal implementation**

In `src/storefrontSigns.js`, add the loud-trade set near the top:

```js
// "Loud trades" earn a projecting blade sign — the idiom that actually beats
// iso occlusion (perpendicular to the wall, so a face catches every angle).
// Category-gated to ~1-in-4 shops so the block reads varied, not cluttered.
const LOUD_TRADES = new Set(["bar", "pub", "hairdresser", "barber"]);
```

Then, inside the `for (const bay of bays)` loop in `planStorefrontSigns`, after pushing the band:

```js
    if (LOUD_TRADES.has(bay.category)) {
      placements.push({
        kind: "blade",
        bayName: bay.name,
        label,
        claimed,
        cx,
        mountY: gy * 0.78,        // high on the ground storey
        panelHeightFrac: gy * 0.34,
        projectMeters: 1.1,       // real-world blade reach; renderer * scale
        off: 0.02,
      });
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: PASS — all tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/storefrontSigns.js src/storefrontSigns.test.mjs
git commit -m "feat(signs): category-gated blade signs for loud trades

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Wire the renderer in SceneView (replace inline sign block)

**Files:**
- Modify: `src/SceneView.jsx`

- [ ] **Step 1: Add the import**

At the top of `src/SceneView.jsx`, with the other local-module imports, add:

```js
import { planStorefrontSigns } from "./storefrontSigns.js";
```

- [ ] **Step 2: Add the `buildStorefrontSigns` renderer**

Add this function just above `buildBlockStorefronts` (near `SceneView.jsx:879`). It consumes the face frame already computed in the bay loop (`left`, `right`, `normal`, `building.height`) plus `scene` for the meter→unit scale:

```js
// Render planned storefront signs (band + blade) for one building's bays.
// `frame` carries the street face basis: { left, right, normal, height, point }
// where point(x, y, off) maps face-local coords to world (same helper used by
// the bay loop). Signs parent under `three` and inherit existing per-view
// culling because they sit on the building's street face.
function buildStorefrontSigns(three, placements, frame, scene) {
  const { left, right, normal, height, point } = frame;
  for (const pl of placements) {
    if (pl.kind === "band") {
      const positions = new Float32Array([
        ...point(pl.cx - pl.width / 2, pl.y0, pl.off),
        ...point(pl.cx + pl.width / 2, pl.y0, pl.off),
        ...point(pl.cx + pl.width / 2, pl.y1, pl.off),
        ...point(pl.cx - pl.width / 2, pl.y1, pl.off),
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      // U flipped so the label reads correctly from the street side (preserves
      // the 2026-06-15 mirror fix, commit 9f6ff2b).
      geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1,0, 0,0, 0,1, 1,1]), 2));
      geo.setIndex([0,1,2, 0,2,3]);
      three.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        map: makeStorefrontSignTexture(pl.label),
        transparent: true,
        side: THREE.DoubleSide,
      })));
    } else if (pl.kind === "blade") {
      // A panel perpendicular to the facade: vertical, spanning from the wall
      // (off) outward by projectMeters*scale along the face normal. Because its
      // face normal is parallel to the wall, a face catches every iso angle.
      const reach = pl.projectMeters * scene.projection.scale;
      const yTop = (pl.mountY + pl.panelHeightFrac / 2) * height;
      const yBot = (pl.mountY - pl.panelHeightFrac / 2) * height;
      // base point on the wall at cx, and the outboard end along the normal.
      const baseX = left.x + (right.x - left.x) * pl.cx + normal.x * pl.off;
      const baseZ = left.z + (right.z - left.z) * pl.cx + normal.z * pl.off;
      const outX = baseX + normal.x * reach;
      const outZ = baseZ + normal.z * reach;
      const positions = new Float32Array([
        baseX, yBot, baseZ,
        outX,  yBot, outZ,
        outX,  yTop, outZ,
        baseX, yTop, baseZ,
      ]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([1,0, 0,0, 0,1, 1,1]), 2));
      geo.setIndex([0,1,2, 0,2,3]);
      three.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        map: makeStorefrontSignTexture(pl.label),
        transparent: true,
        side: THREE.DoubleSide,   // readable from both flanks
      })));
      // Thin dark bracket arm along the top edge, wall -> panel.
      const armGeo = new THREE.BufferGeometry();
      armGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
        baseX, yTop, baseZ,
        outX,  yTop, outZ,
        outX,  yTop - 0.04 * height, outZ,
        baseX, yTop - 0.04 * height, baseZ,
      ]), 3));
      armGeo.setIndex([0,1,2, 0,2,3]);
      three.add(new THREE.Mesh(armGeo, new THREE.MeshBasicMaterial({
        color: II_PALETTE.ink, side: THREE.DoubleSide,
      })));
    }
  }
}
```

- [ ] **Step 3: Replace the inline per-bay sign geometry**

In `buildBlockStorefronts`, the inner `for (const bay of binBays)` loop currently builds the sign band inline (the block from `const cx = ...` through `three.add(signMesh);`, ~lines 1032–1061). Replace **only the sign-band portion** (leave the awning strip below it intact) with a single call after the loop. Concretely:

1. Delete the sign-band geometry block inside the bay loop (the `const cx`, `const w`, `const off`, `y0`/`y1`, `signPositions`, `signGeo`, `signMesh`, `three.add(signMesh)` lines). Keep the awning strip block.
2. Before the bay loop's awning work still needs `cx`, `w`, `off` — those are also used by the awning. So keep computing `cx`, `w`, `off` at the top of the bay loop; only remove the sign-band mesh lines.
3. After the `for (const bay of binBays)` loop closes, add:

```js
    // Planned signs (band + blade) for this building's bays. The pure planner
    // decides idioms + labels (category default, brand only if claimed); the
    // renderer maps face-local params to world geometry on the street face.
    const frame = {
      left, right, normal, height: building.height,
      point, // face-local (x in [0,1], y as height fraction, off) -> world
    };
    const placements = planStorefrontSigns({ bays: binBays, storeys });
    buildStorefrontSigns(three, placements, frame, scene);
```

Note: `left`, `right`, `normal`, `point`, `storeys`, and `building` are all already in scope in that block (`storeys` from `const storeys = Math.max(1, typology.storeyCount)`; `point` is the local helper defined at `SceneView.jsx:1024`).

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds (the existing 46MB bay-window GLB large-chunk warning is expected and unrelated). No new errors referencing `storefrontSigns` or `buildStorefrontSigns`.

- [ ] **Step 5: Run the pure tests again (regression)**

Run: `node --test src/storefrontSigns.test.mjs`
Expected: PASS — unchanged.

- [ ] **Step 6: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(signs): render band+blade via storefrontSigns; signs default to category

Replaces the inline coplanar sign band with the storefront sign system:
category-label signs by default (real branding only when claimed), plus
perpendicular blade signs for loud trades so names carry at the iso angle.
Awning strip and U-flip mirror fix preserved.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: In-engine four-angle verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Use the preview tooling (`preview_start`) against `npm run dev` (http://127.0.0.1:5173). Do not use raw Bash for the server.

- [ ] **Step 2: Confirm no console/runtime errors**

Use `preview_console_logs`. Expected: no errors referencing `storefrontSigns`, `buildStorefrontSigns`, `planStorefrontSigns`, or undefined `point`/`left`/`right`.

- [ ] **Step 3: Verify labels are category text, not real names**

Use `preview_snapshot` / `preview_screenshot` zoomed to the Franklin→Milton block. Expected: signs read "Restaurant", "Barbershop", "Bar", "Deli" etc. — NOT "Sereneco", "Elder Greene", "Vamos al Tequila". (Heroes Premier/Sonny's/Sereneco/Azure/144 Franklin still show their real branding — they render via the hero path, not this system.)

- [ ] **Step 4: Verify blade legibility across all four iso angles**

Rotate through all four angles (↺/↻ buttons or Q/E). At each angle, `preview_screenshot`. Expected: blade signs on loud-trade shops are readable (not edge-on) from at least one angle each, and visibly project past neighboring masses. Confirm blades are not mirrored (U-flip holds) and do not vanish at the angle revealing their street face (per-view culling inherited).

- [ ] **Step 5: Tune if needed**

If blades are too small/large or clip into neighbors at the iso zoom, adjust `projectMeters` (Task 3) and/or `panelHeightFrac`/`mountY`, re-run `node --test src/storefrontSigns.test.mjs` (loosen the range asserts only if a deliberate value moves out of range), rebuild, re-screenshot. Commit any tuning with message `tune(signs): blade reach/size for iso legibility`.

- [ ] **Step 6: Share proof**

Post before/after screenshots (one angle showing the old flat band vs. the new band+blade, plus a four-angle contact sheet) to the user.

---

## Task 6: Update plan + scaling log status

**Files:**
- Modify: `docs/SCALING_LOG.md`
- Modify: `docs/PLAN.md`

- [ ] **Step 1: Mark the sign-prominence finding resolved**

In `docs/SCALING_LOG.md`, under the Block A and Block B "Open craft / polish items", append a note that the sign-prominence finding is addressed by the storefront sign system (band + category-gated blade, category-label default), referencing this plan. Note awning-valance name + ghost lettering remain fast-follow.

- [ ] **Step 2: Note the claim model in PLAN.md**

In `docs/PLAN.md`, under Phase 4.2 ("Kit-ify what repeated"), add a line that storefront signage now defaults to category labels with a `claimed`-flag path for real branding (the monetization experiment), and that sign prominence (blade signs) is done. Leave OSM dedup as the remaining 4.2 polish item.

- [ ] **Step 3: Commit**

```bash
git add docs/SCALING_LOG.md docs/PLAN.md
git commit -m "docs(signs): mark sign-prominence resolved; note claim model in PLAN/SCALING_LOG

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** category-label default (Task 1), claim/brandName resolution (Task 1), band baseline (Task 2), category-gated blade (Task 3), renderer + U-flip preservation + awning untouched (Task 4), four-angle legibility + no-name-leak verification (Task 5), docs (Task 6). Awning-valance + ghost lettering are explicit non-goals in the spec and intentionally absent here.
- **Heroes = claimed showcase:** handled structurally — heroes are excluded from `buildBlockStorefronts` and render real branding via the hero path; no code change needed, called out in Task 5 Step 3.
- **Type consistency:** `planStorefrontSigns({ bays, storeys })`, placement fields (`kind/bayName/label/claimed/cx/width/y0/y1/off` for band; adds `mountY/panelHeightFrac/projectMeters` for blade), `resolveSignLabel(bay)`, `categoryLabel(category)`, `buildStorefrontSigns(three, placements, frame, scene)` are used identically across tasks.
- **No real-name leak** is asserted in both Task 1 and Task 2 tests and verified in-engine in Task 5.
