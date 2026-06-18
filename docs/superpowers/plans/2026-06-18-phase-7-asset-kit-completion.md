# Phase 7 — Asset Kit Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the inked component kit from one material family (brick) to the full Greenpoint set — every valid (material × component-layer) cell generated tintable-neutral, alpha-keyed, inventoried, and passing the 6.2.3 conformance gate — plus a roof-tone set and a color-binding contract.

**Architecture:** Asset/data-production phase. Pure Node-importable data + loaders define the taxonomy, the valid-cell matrix, and the color contract (all TDD). Asset PNGs are GPT-generated tintable-neutral, alpha-keyed via the existing `scripts/key_inked_alpha.py`, then validated by a new headless component verifier. **No classifier rewrite, no renderer/selection wiring** — those are Phase 8.

**Tech Stack:** Node ESM (`node --test`), React 19 + Three.js + Vite (untouched here), GPT image generation, Python alpha-keying (`scripts/key_inked_alpha.py`), the 6.2.3 conformance gate (`scripts/verify-visual-conformance.mjs`).

## Global Constraints

- **Palette is a no-miss.** Every scene color must resolve to a token in `src/visualSystem/palette.js`. Out-of-token color is a hard fail (6.2.3). Components ship tintable-neutral (dark ink on warm grey), no baked chroma — color comes from compose-time tint only. (Source: `docs/ART_DIRECTION.md`, spec §Global.)
- **Photos are truth.** Gather-dependent components (bay frame/storefront, awning, roll gate) cannot be generated until reference photos exist. **Batu supplies the photos; the agent builds the intake structure** (spec decision 1).
- **Asset/data only — no wiring.** Do NOT modify `buildingTypology.js` classification logic, `treatmentMap.selectTreatment`, or SceneView selection/apply paths. Taxonomy exists as data before the classifier emits it (spec §Scope boundary).
- **Color contract is spec-only.** Define the rule + structure the palette for nearest-token snapping. Do NOT author per-building color values or build a dominant-color sampler (spec decision 4).
- **Six material families (all kept):** `brick`, `clapboard`, `brownstone`, `painted-masonry`, `modern-flat`, `warehouse` (spec decision 6).
- **Sparse grid.** Only generate (material × component) cells the valid-cell matrix marks real (spec §7.2).
- **Frequent commits**; every code/data task is TDD (`node --test`) and ends green. Run `npm run verify` before declaring the phase done.

---

## File Structure

**New (code/data):**
- `src/data/materials/material-families.v0.1.json` — the 6-row taxonomy + valid-cell matrix.
- `src/materialFamilies.js` — pure loader: family list, cell validity, component list.
- `src/materialFamilies.test.mjs` — loader tests.
- `src/visualSystem/colorBinding.js` — pure `nearestPaletteToken` contract.
- `src/visualSystem/colorBinding.test.mjs` — contract tests.
- `scripts/verify-inked-component.mjs` — headless per-PNG validator (alpha + neutrality + dims).
- `src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json` — 7.0 intake manifest (what Batu must supply).

**Modified:**
- `src/visualSystem/palette.js` — add `MATERIAL_WALL_TONES` (grouped, snap-candidate set) + `ROOF_TONES` per family.
- `scripts/visual-conformance-allowlist.json` — account for new palette consts / data files.
- `docs/COMPONENT_INVENTORY.md` — new material/component rows + roof tone + color contract note.
- `package.json` — add `verify:components` script; chain into `verify`.

**Generated assets (procedure, gated on 7.0 photos):**
- `assets/inked/<family>-<component>.v1.png` for every valid cell.

---

## Task 1: Material-family taxonomy + valid-cell matrix (data + loader)

**Files:**
- Create: `src/data/materials/material-families.v0.1.json`
- Create: `src/materialFamilies.js`
- Test: `src/materialFamilies.test.mjs`

**Interfaces:**
- Produces: `loadMaterialFamilies() -> { families: string[], components: string[], cells: Record<string, string[]> }`; `familyList(): string[]`; `componentList(): string[]`; `isValidCell(family, component): boolean`; `validCells(): Array<{family, component}>`.
- Consumes: nothing (pure data).

- [ ] **Step 1: Write the data file**

`src/data/materials/material-families.v0.1.json`:

```json
{
  "_doc": "Phase 7.1 — canonical Greenpoint material families + valid (material x component) matrix. DATA ONLY. buildingTypology.js classifying INTO these is Phase 8.",
  "version": "0.1",
  "families": ["brick", "clapboard", "brownstone", "painted-masonry", "modern-flat", "warehouse"],
  "components": ["wall", "cornice", "window", "door-stoop", "bay-frame", "awning", "roll-gate", "weathering", "ground"],
  "cells": {
    "brick":           ["wall", "cornice", "window", "door-stoop", "bay-frame", "awning", "roll-gate", "weathering", "ground"],
    "clapboard":       ["wall", "cornice", "window", "door-stoop", "weathering"],
    "brownstone":      ["wall", "cornice", "window", "door-stoop", "weathering", "ground"],
    "painted-masonry": ["wall", "cornice", "window", "door-stoop", "bay-frame", "awning", "roll-gate", "weathering", "ground"],
    "modern-flat":     ["wall", "window", "bay-frame", "awning", "roll-gate", "weathering", "ground"],
    "warehouse":       ["wall", "window", "door-stoop", "roll-gate", "weathering", "ground"]
  }
}
```

- [ ] **Step 2: Write the failing test**

`src/materialFamilies.test.mjs`:

```js
// Run: node --test src/materialFamilies.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { familyList, componentList, isValidCell, validCells } from "./materialFamilies.js";

test("exposes the six canonical families", () => {
  assert.deepEqual(familyList(), [
    "brick", "clapboard", "brownstone", "painted-masonry", "modern-flat", "warehouse",
  ]);
});

test("every family's cells reference only declared components", () => {
  const comps = new Set(componentList());
  for (const c of validCells()) assert.ok(comps.has(c.component), `${c.component} declared`);
});

test("known sparse cells are excluded", () => {
  assert.equal(isValidCell("clapboard", "roll-gate"), false);
  assert.equal(isValidCell("modern-flat", "cornice"), false);
  assert.equal(isValidCell("warehouse", "awning"), false);
});

test("known real cells are included", () => {
  assert.equal(isValidCell("brick", "cornice"), true);
  assert.equal(isValidCell("clapboard", "wall"), true);
  assert.equal(isValidCell("warehouse", "roll-gate"), true);
});

test("isValidCell is false for unknown family or component", () => {
  assert.equal(isValidCell("nope", "wall"), false);
  assert.equal(isValidCell("brick", "nope"), false);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test src/materialFamilies.test.mjs`
Expected: FAIL — `Cannot find module './materialFamilies.js'`.

- [ ] **Step 4: Write the loader**

`src/materialFamilies.js`:

```js
// Phase 7.1 — pure loader for the canonical material taxonomy + valid-cell matrix.
// Node-importable, zero-dependency. DATA ONLY: this does not classify buildings
// (that is buildingTypology.js, rewired in Phase 8); it only answers what the
// kit may legally draw.
import data from "./data/materials/material-families.v0.1.json" with { type: "json" };

export function loadMaterialFamilies() {
  return { families: data.families, components: data.components, cells: data.cells };
}
export function familyList() {
  return [...data.families];
}
export function componentList() {
  return [...data.components];
}
export function isValidCell(family, component) {
  return Boolean(data.cells[family]?.includes(component));
}
export function validCells() {
  return data.families.flatMap((family) =>
    (data.cells[family] ?? []).map((component) => ({ family, component })),
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test src/materialFamilies.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/materials/material-families.v0.1.json src/materialFamilies.js src/materialFamilies.test.mjs
git commit -m "feat(7.1): canonical material taxonomy + valid-cell matrix (data + loader)"
```

---

## Task 2: Color-binding contract — `nearestPaletteToken` (spec-only, pure)

**Files:**
- Modify: `src/visualSystem/palette.js` (add `MATERIAL_WALL_TONES`)
- Create: `src/visualSystem/colorBinding.js`
- Test: `src/visualSystem/colorBinding.test.mjs`

**Interfaces:**
- Consumes: `MATERIAL_WALL_TONES` from `palette.js`.
- Produces: `nearestPaletteToken(trueColorHex: number, family: string) -> number` — returns the in-palette token closest (RGB Euclidean) to the true color, restricted to that family's candidate set. Throws on unknown family.

**Note:** This is the contract that makes "a black building reads black-adjacent" real and checkable. It is pure and NOT wired into any renderer (Phase 8).

- [ ] **Step 1: Add the snap-candidate token group to palette.js**

Add to `src/visualSystem/palette.js` (after `TYPOLOGY_PALETTE`):

```js
// Phase 7.4 — color-binding candidate sets. Per material family, the in-palette
// wall tones a building's TRUE color may snap to. nearestPaletteToken (colorBinding.js)
// picks the closest of these; every entry is already a no-miss palette tone, so
// snapping can never leave the palette. Spec-only: NOT applied by the renderer (Phase 8).
export const MATERIAL_WALL_TONES = {
  brick: [0xb5664a, 0x9c5a3c, 0x7d5a44, 0x6f4a39],
  clapboard: [0xc8c2b2, 0x9a9c86, 0x6f7a6a, 0x4a4f44],
  brownstone: [0x8a5a3c, 0x6f4632, 0x5a3a28],
  "painted-masonry": [0xc8c2b2, 0xa8a090, 0x7c766a, 0x46443f],
  "modern-flat": [0xcabfa7, 0x968b78, 0x46443f, 0x1d201e],
  warehouse: [0x968b78, 0x7d5a44, 0x5a564c, 0x2a241c],
};
```

- [ ] **Step 2: Write the failing test**

`src/visualSystem/colorBinding.test.mjs`:

```js
// Run: node --test src/visualSystem/colorBinding.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestPaletteToken } from "./colorBinding.js";
import { MATERIAL_WALL_TONES } from "./palette.js";

test("a near-black true color snaps to the darkest in-family token", () => {
  const tok = nearestPaletteToken(0x050505, "modern-flat");
  assert.equal(tok, 0x1d201e); // black-adjacent, still in palette
});

test("a red-brick true color snaps to a warm brick token", () => {
  const tok = nearestPaletteToken(0xb05030, "brick");
  assert.ok(MATERIAL_WALL_TONES.brick.includes(tok));
  assert.equal(tok, 0xb5664a);
});

test("result is always a member of the family candidate set", () => {
  for (const fam of Object.keys(MATERIAL_WALL_TONES)) {
    const tok = nearestPaletteToken(0x808080, fam);
    assert.ok(MATERIAL_WALL_TONES[fam].includes(tok), `${fam} stays in palette`);
  }
});

test("throws on an unknown family", () => {
  assert.throws(() => nearestPaletteToken(0x000000, "nope"), /unknown family/i);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test src/visualSystem/colorBinding.test.mjs`
Expected: FAIL — `Cannot find module './colorBinding.js'`.

- [ ] **Step 4: Write the contract**

`src/visualSystem/colorBinding.js`:

```js
// Phase 7.4 — color-binding CONTRACT (spec-only, pure). Rule:
//   trueColor -> nearestPaletteToken(family): the building's real-life color,
//   snapped to the nearest in-palette wall tone for its material family.
// Candidate sets are constrained per family so a snap can never leave the
// material's plausible range, and every candidate is already a no-miss palette
// color. NOT wired into the renderer; per-building authoring + a dominant-color
// sampler are Phase 8.
import { MATERIAL_WALL_TONES } from "./palette.js";

const rgb = (hex) => [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];

export function nearestPaletteToken(trueColorHex, family) {
  const candidates = MATERIAL_WALL_TONES[family];
  if (!candidates) throw new Error(`unknown family: ${family}`);
  const [tr, tg, tb] = rgb(trueColorHex);
  let best = candidates[0];
  let bestD = Infinity;
  for (const c of candidates) {
    const [r, g, b] = rgb(c);
    const d = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test src/visualSystem/colorBinding.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 6: Keep conformance green (new palette const is in the token source)**

Run: `npm run verify:conformance`
Expected: PASS — `palette.js` is the token source, so `MATERIAL_WALL_TONES` literals are accounted for; no new violations.

- [ ] **Step 7: Commit**

```bash
git add src/visualSystem/palette.js src/visualSystem/colorBinding.js src/visualSystem/colorBinding.test.mjs
git commit -m "feat(7.4): color-binding contract — nearestPaletteToken (spec-only, pure)"
```

---

## Task 3: Roof-tone tokens per material family

**Files:**
- Modify: `src/visualSystem/palette.js` (add `ROOF_TONES`)
- Test: `src/materialFamilies.test.mjs` (extend — roof tone exists for every family)

**Interfaces:**
- Produces: `ROOF_TONES: Record<family, number>` in `palette.js` — one flat, quiet, multi-angle-safe roof tone per family.

- [ ] **Step 1: Add roof tones to palette.js**

Add to `src/visualSystem/palette.js` (after `MATERIAL_WALL_TONES`):

```js
// Phase 7.3 — typological roof TONE per family (flat + quiet, multi-angle-safe).
// NOT detailed roofs — a tone the four-angle camera can show without noise.
// Darker/cooler than walls; sits in the MASSING.roofCap family.
export const ROOF_TONES = {
  brick: 0x46443f,
  clapboard: 0x4a4f44,
  brownstone: 0x3f3a33,
  "painted-masonry": 0x4a473f,
  "modern-flat": 0x3a3a36,
  warehouse: 0x3c3a34,
};
```

- [ ] **Step 2: Write the failing test**

Append to `src/materialFamilies.test.mjs`:

```js
import { ROOF_TONES } from "./visualSystem/palette.js";

test("every material family has a roof tone", () => {
  for (const fam of familyList()) {
    assert.equal(typeof ROOF_TONES[fam], "number", `${fam} roof tone`);
  }
});
```

- [ ] **Step 3: Run test to verify it fails then passes**

Run: `node --test src/materialFamilies.test.mjs`
Expected: first FAIL (`ROOF_TONES[fam]` undefined) if step 1 skipped; with step 1 done → PASS (6 tests).

- [ ] **Step 4: Keep conformance green**

Run: `npm run verify:conformance`
Expected: PASS (new const in token source).

- [ ] **Step 5: Commit**

```bash
git add src/visualSystem/palette.js src/materialFamilies.test.mjs
git commit -m "feat(7.3): typological roof-tone tokens per material family"
```

---

## Task 4: Headless component verifier (`verify-inked-component.mjs`)

**Files:**
- Create: `scripts/verify-inked-component.mjs`
- Modify: `package.json` (add `verify:components`, chain into `verify`)

**Interfaces:**
- Produces: a CLI that, given the asset dir + the valid-cell matrix, checks each EXISTING `assets/inked/<family>-<component>.v1.png` is (a) present, (b) alpha-keyed (has a transparent region — not fully opaque), (c) tintable-neutral (mean chroma below a threshold — no baked color), and reports missing valid cells as PENDING (non-fatal until 7.0 photos land). Exit 1 only on a present-but-invalid asset.

**Note:** Uses the PNG decoder already available via the repo's Python tooling path is avoided — implement in Node with a minimal PNG reader using `zlib`. Keep it dependency-free to match repo conventions.

- [ ] **Step 1: Write the verifier**

`scripts/verify-inked-component.mjs`:

```js
#!/usr/bin/env node
// Phase 7.5 — headless inked-component verifier. For each VALID (family x component)
// cell, if the asset exists it must be: PNG with an alpha channel that contains
// transparency (keyed), and tintable-neutral (low chroma — no baked color). Missing
// valid cells are reported PENDING (non-fatal) until 7.0 reference photos land and
// the cell is generated. A present-but-invalid asset is a hard fail.
import { readFileSync, existsSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validCells } from "../src/materialFamilies.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetPath = (f, c) => join(ROOT, "assets/inked", `${f}-${c}.v1.png`);

// Minimal PNG reader: returns { width, height, channels, pixels:Uint8Array(RGBA) }.
function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let pos = 8, width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`unsupported PNG (bitDepth=${bitDepth} colorType=${colorType}); need 8-bit RGB/RGBA`);
  }
  const channels = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = new Uint8Array(width * height * 4);
  let prev = new Uint8Array(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = new Uint8Array(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev[i];
      const c = i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 0xff;
    }
    for (let x = 0; x < width; x++) {
      const s = x * channels, d = (y * width + x) * 4;
      out[d] = cur[s]; out[d + 1] = cur[s + 1]; out[d + 2] = cur[s + 2];
      out[d + 3] = channels === 4 ? cur[s + 3] : 255;
    }
    prev = cur;
  }
  return { width, height, channels, pixels: out };
}

function analyze(png) {
  let transparent = 0, chromaSum = 0, opaque = 0;
  for (let i = 0; i < png.pixels.length; i += 4) {
    const [r, g, b, a] = [png.pixels[i], png.pixels[i + 1], png.pixels[i + 2], png.pixels[i + 3]];
    if (a < 16) { transparent++; continue; }
    opaque++;
    chromaSum += Math.max(r, g, b) - Math.min(r, g, b);
  }
  return {
    keyed: transparent > 0,
    meanChroma: opaque ? chromaSum / opaque : 0,
  };
}

const CHROMA_MAX = 28; // tintable-neutral: dark ink on warm grey, low saturation
const results = { ok: [], pending: [], fail: [] };

for (const { family, component } of validCells()) {
  const p = assetPath(family, component);
  if (!existsSync(p)) { results.pending.push(`${family}-${component}`); continue; }
  try {
    const png = readPng(readFileSync(p));
    const a = analyze(png);
    if (!a.keyed) results.fail.push(`${family}-${component}: not alpha-keyed (no transparency)`);
    else if (a.meanChroma > CHROMA_MAX)
      results.fail.push(`${family}-${component}: baked color (meanChroma ${a.meanChroma.toFixed(1)} > ${CHROMA_MAX})`);
    else results.ok.push(`${family}-${component}`);
  } catch (e) {
    results.fail.push(`${family}-${component}: ${e.message}`);
  }
}

console.log("Inked component verifier (7.5)\n");
console.log(`  OK       : ${results.ok.length}`);
console.log(`  PENDING  : ${results.pending.length} (valid cell, asset not generated yet)`);
if (results.pending.length) console.log("    " + results.pending.join(", "));
if (results.fail.length) {
  console.error(`\n✖ FAIL — ${results.fail.length} present-but-invalid asset(s):`);
  for (const f of results.fail) console.error("    " + f);
  process.exit(1);
}
console.log("\n✓ PASS — every generated component is keyed + tintable-neutral.");
```

- [ ] **Step 2: Run it against the existing brick assets**

Run: `node scripts/verify-inked-component.mjs`
Expected: PASS. Existing `brick-wall/window/cornice/ground` report OK; all other valid cells report PENDING; exit 0.

(If an existing brick asset fails the chroma threshold, raise `CHROMA_MAX` to the lowest value that passes the current shipped brick set and note it in the commit — the threshold must admit what already ships.)

- [ ] **Step 3: Wire into package.json**

In `package.json` scripts, add `verify:components` and chain it:

```json
    "verify:components": "node scripts/verify-inked-component.mjs",
    "verify": "npm run test && npm run verify:conformance && npm run verify:visual && npm run verify:components",
```

- [ ] **Step 4: Run the full gate**

Run: `npm run verify`
Expected: PASS (tests + conformance + visual baseline + components).

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-inked-component.mjs package.json
git commit -m "feat(7.5): headless inked-component verifier (keyed + tintable-neutral) + verify chain"
```

---

## Task 5: Reference intake structure for 7.0 (Batu supplies photos)

**Files:**
- Create: `src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json`

**Interfaces:**
- Produces: a manifest enumerating exactly which reference photos Batu must supply for the gather-dependent components, structured like the existing evidence-intake contract.

**Note:** This task builds the structure only. It does NOT generate assets — generation is gated on Batu filling these slots (spec decision 1 / handoff).

- [ ] **Step 1: Write the intake manifest**

`src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json`:

```json
{
  "_doc": "Phase 7.0 reference intake. Batu supplies photos into the slots below; the agent generates the gather-dependent component columns (bay-frame, awning, roll-gate) only once a slot's photos are present. Photos-are-truth gate.",
  "version": "0.1",
  "status": "awaiting-batu-supply",
  "components": {
    "bay-frame": {
      "applies_to": ["brick", "painted-masonry", "modern-flat"],
      "need": "storefront bay structure: columns/piers, transom band, bulkhead. Front-on + 3/4.",
      "min_refs_per_family": 2,
      "supplied": []
    },
    "awning": {
      "applies_to": ["brick", "painted-masonry", "modern-flat"],
      "need": "fixed storefront awnings: straight-drop + canopy, fabric + frame. Side profile readable.",
      "min_refs_per_family": 2,
      "supplied": []
    },
    "roll-gate": {
      "applies_to": ["brick", "painted-masonry", "modern-flat", "warehouse"],
      "need": "closed + open security roll gates: slat texture, side housing, lock box.",
      "min_refs_per_family": 2,
      "supplied": []
    }
  }
}
```

- [ ] **Step 2: Verify it parses**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json','utf8')); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json
git commit -m "feat(7.0): reference-intake manifest for gather-dependent components (awaiting supply)"
```

- [ ] **Step 4: HANDOFF CHECKPOINT — STOP**

Notify Batu: "7.0 intake structure is ready. Please supply reference photos for **bay-frame, awning, roll-gate** (≥2 per applicable family) into the evidence-intake folder, then update each component's `supplied[]` list. Asset generation for those columns (Tasks 7–8) is blocked until then. The have-refs columns (wall, cornice, window, door-stoop — Task 6) and roof tone proceed now."

---

## Task 6: Generate the have-refs component grid (wall, cornice, window, door-stoop)

**Files:**
- Create: `assets/inked/<family>-<component>.v1.png` for each valid have-refs cell (per `material-families.v0.1.json`), excluding the four brick assets that already ship.
- Modify: `docs/COMPONENT_INVENTORY.md`

**Interfaces:**
- Consumes: `validCells()` (Task 1), `scripts/key_inked_alpha.py` (existing), `scripts/verify-inked-component.mjs` (Task 4), and the existing reference repo (windows+sills, doors+stoops, cornices, wall material) the user already holds.

**Note:** This is an ASSET-PRODUCTION task, not a code TDD loop. It uses GPT image generation + the existing alpha-keying tool. Follow the generation playbook in `docs/reference/art/GENERATION_KIT.md` and the `hero-facade-build-loop` memory. Generate per family from ONE shared reference scaffold to suppress style drift (spec §Risks).

- [ ] **Step 1: Enumerate the target cells**

Run: `node -e "import('./src/materialFamilies.js').then(m=>console.log(m.validCells().filter(c=>['wall','cornice','window','door-stoop'].includes(c.component)).map(c=>c.family+'-'+c.component).join('\n')))"`
Expected: the list of have-refs cells. Brick's four already exist — skip those.

- [ ] **Step 2: Generate each component tintable-neutral**

For each target cell, follow `docs/reference/art/GENERATION_KIT.md`: generate the component as dark ink on warm grey (NO baked color), isolated subject, on a keyable background. Save the raw GPT output to a scratch path (outside `assets/`).

- [ ] **Step 3: Alpha-key each**

Run (per file): `python scripts/key_inked_alpha.py <scratch>.png assets/inked/<family>-<component>.v1.png`
Expected: a clean alpha-keyed PNG in `assets/inked/`.

- [ ] **Step 4: Validate each against the component verifier**

Run: `node scripts/verify-inked-component.mjs`
Expected: each new cell moves PENDING → OK. Any `baked color` failure → regenerate that cell more neutral (Step 2). Any `not alpha-keyed` failure → re-key (Step 3).

- [ ] **Step 5: Inventory the new rows**

In `docs/COMPONENT_INVENTORY.md`, under "Kit components × material × module", add rows for the new (material × component) assets with their color source (`MATERIAL_WALL_TONES` / `FACADE_RELIEF`), mirroring the existing brick rows. Update the "Material coverage" cells from "brick (others Phase 7)" to list the now-realized families.

- [ ] **Step 6: Run the full gate**

Run: `npm run verify`
Expected: PASS — conformance clean (no new code literals), component verifier green for the new cells.

- [ ] **Step 7: Commit**

```bash
git add assets/inked/ docs/COMPONENT_INVENTORY.md
git commit -m "feat(7.2): generate have-refs component grid (wall/cornice/window/door-stoop) across families"
```

---

## Task 7: Generate the gather-dependent columns (bay-frame, awning, roll-gate)

> **BLOCKED until Task 5 handoff is satisfied** (Batu supplied photos; `phase-7-reference-intake.v0.1.json` slots filled).

**Files:**
- Create: `assets/inked/<family>-{bay-frame,awning,roll-gate}.v1.png` for each valid cell.
- Modify: `docs/COMPONENT_INVENTORY.md`; `src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json` (`status` → `supplied`).

**Interfaces:**
- Consumes: the supplied reference photos, `scripts/key_inked_alpha.py`, `scripts/verify-inked-component.mjs`, `validCells()`.

**Note:** ASSET-PRODUCTION task. Same pipeline as Task 6, now grounded in the newly supplied photos (photos-are-truth restored for these three components).

- [ ] **Step 1: Confirm references present**

Run: `node -e "const d=require('./src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json'); for(const[k,v]of Object.entries(d.components)) if(v.supplied.length<1) throw new Error('missing refs: '+k); console.log('refs present')"`
Expected: `refs present`. If it throws, STOP — references not yet supplied.

- [ ] **Step 2: Generate, key, validate (per cell)**

For each valid bay-frame/awning/roll-gate cell: generate tintable-neutral from the supplied photos (`docs/reference/art/GENERATION_KIT.md`), key via `scripts/key_inked_alpha.py`, then `node scripts/verify-inked-component.mjs` until the cell is OK.

- [ ] **Step 3: Inventory + flip intake status**

Add the new rows to `docs/COMPONENT_INVENTORY.md`. Set the intake manifest `status` to `supplied`.

- [ ] **Step 4: Run the full gate**

Run: `npm run verify`
Expected: PASS — all valid cells now OK (zero PENDING), conformance clean.

- [ ] **Step 5: Commit**

```bash
git add assets/inked/ docs/COMPONENT_INVENTORY.md src/data/facade-evidence-intake/phase-7-reference-intake.v0.1.json
git commit -m "feat(7.2): generate gather-dependent columns (bay-frame/awning/roll-gate) from supplied refs"
```

---

## Task 8: Weathering / truth-texture layer (minimal)

> May run in parallel with Task 7 (independent component).

**Files:**
- Create: `assets/inked/<family>-weathering.v1.png` for each valid cell.
- Modify: `docs/COMPONENT_INVENTORY.md`

**Interfaces:**
- Consumes: `scripts/key_inked_alpha.py`, `scripts/verify-inked-component.mjs`, `validCells()`.

**Note:** ASSET-PRODUCTION. The weathering layer is INK/GRAIN only — posters, stickers, grime, cracks — NOT new color (spec §Risks: "keep it minimal and palette-clean"). It must pass the same tintable-neutral chroma check as every other component.

- [ ] **Step 1: Generate each weathering overlay tintable-neutral**

For each valid `*-weathering` cell, generate a sparse ink/grain overlay (dark ink on transparent/warm grey, low chroma) per `docs/reference/art/GENERATION_KIT.md`. Keep it restrained — it is the "truth texture" that makes gates/infill read real, not a decorative layer.

- [ ] **Step 2: Key + validate**

Run (per file): `python scripts/key_inked_alpha.py <scratch>.png assets/inked/<family>-weathering.v1.png` then `node scripts/verify-inked-component.mjs`.
Expected: each weathering cell OK (keyed + low chroma).

- [ ] **Step 3: Inventory**

Add the weathering rows to `docs/COMPONENT_INVENTORY.md` (color source: ink/grain only, no color token).

- [ ] **Step 4: Run the full gate**

Run: `npm run verify`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add assets/inked/ docs/COMPONENT_INVENTORY.md
git commit -m "feat(7.2): minimal weathering/truth-texture layer across families"
```

---

## Task 9: Phase close — inventory reconcile + plan/docs update

**Files:**
- Modify: `docs/COMPONENT_INVENTORY.md` (gaps section), `docs/PLAN.md` (Phase 7 status), `docs/DECISION_LOG.md` (Phase 7 decisions entry).

**Interfaces:** none (docs).

- [ ] **Step 1: Reconcile the inventory gaps section**

In `docs/COMPONENT_INVENTORY.md`, update "Gaps tracked for later phases": material families 2–6 + roof tone are now realized as assets; the remaining gaps (classifier emitting families, selection wiring, `INKED_FACADE_REAL`→data, per-building color authoring/derivation) are explicitly **Phase 8**.

- [ ] **Step 2: Mark Phase 7 done in PLAN.md**

In `docs/PLAN.md` Phase 7 section, mark 7.1–7.5 complete (assets + data + contract + gate), and record the explicit Phase-8 carryover (classifier rewrite, wiring, color authoring/derivation, spine re-render).

- [ ] **Step 3: Add a DECISION_LOG entry**

Add a newest-first entry: the seven Phase-7 decisions (gather-first, reconciled 6-family taxonomy, asset/data-only done-line, color-contract-only, II-C-audited columns incl. roll gates + weathering, keep all 6 rows, weathering in).

- [ ] **Step 4: Final full gate**

Run: `npm run verify`
Expected: PASS — tests, conformance, visual baseline, components all green; zero PENDING cells.

- [ ] **Step 5: Commit**

```bash
git add docs/COMPONENT_INVENTORY.md docs/PLAN.md docs/DECISION_LOG.md
git commit -m "docs(7): close Phase 7 — kit complete, Phase-8 carryover recorded"
```

---

## Self-Review

**Spec coverage:**
- 7.0 reference gather (Batu supplies / agent structures) → Task 5 (+ handoff checkpoint), consumed by Task 7. ✓
- 7.1 canonical taxonomy as data → Task 1. ✓
- 7.2 component grid + valid-cell matrix → Task 1 (matrix) + Tasks 6/7/8 (assets). ✓
- 7.2 roll gates + weathering (II-C audit additions) → Task 7 (roll-gate) + Task 8 (weathering). ✓
- 7.3 roof tone → Task 3. ✓
- 7.4 color contract (spec-only) + palette structuring → Task 2. ✓
- 7.5 conformance (keyed + tintable-neutral + no regression + inventory) → Task 4 (verifier) + Tasks 6–8 (gate runs) + Task 9 (close). ✓
- Scope boundary (no classifier/wiring/derivation) → enforced in Global Constraints + Task 9 carryover. ✓

**Placeholder scan:** No TBD/TODO; all code steps carry full code; asset-production steps name exact tools/commands (`key_inked_alpha.py`, `verify-inked-component.mjs`) and the playbook doc rather than inventing image content (correct — pixels can't be literal'd, but the procedure + gate are exact). ✓

**Type consistency:** `validCells()`/`familyList()`/`componentList()`/`isValidCell()` used identically in Tasks 1, 4, 6, 7, 8. `nearestPaletteToken(hex, family)` defined and tested in Task 2 only. `MATERIAL_WALL_TONES`/`ROOF_TONES` defined in `palette.js` (Tasks 2/3), consumed in Tasks 2/4. Asset path convention `assets/inked/<family>-<component>.v1.png` consistent across Tasks 4, 6, 7, 8. ✓
