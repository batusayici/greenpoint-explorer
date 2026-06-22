# Frontage Facade Truth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a local recognize the ~30–50 Franklin-frontage buildings by their real material + facade/window/door color, captured by hand with an in-scene eyedropper, while every color stays inside the II-C palette.

**Architecture:** Three independent color levers per building — wall `tint` (already exists), new `windowTint`, new `doorTint` — stored as sanctioned palette tokens in the per-BIN override JSON. Sampled pixels snap to palette token sets (`MATERIAL_WALL_TONES` for walls, a new `TRIM_TONES` for window/door). The renderer honors explicit trim tints when present and falls back to today's derived colors when absent, so untruthed buildings are byte-identical. A dev-only `?facadeedit=1` panel does the eyedropping and writes the override JSON via a dev-server middleware; the scene re-renders on HMR.

**Tech Stack:** React 19, Three.js (MeshBasicMaterial tinting), Vite (dev middleware), Node `node:test`/`node:assert` for unit tests, browser `EyeDropper` API for sampling.

## Global Constraints

- **Palette is a no-miss:** every facade color must resolve to a token in `src/visualSystem/palette.js`. No raw sampled hex reaches the renderer — the editor snaps before writing.
- **Color fields stored as strings** matching `/^0x[0-9a-fA-F]{6}$/` in the override JSON (consistent with existing `tint`/`groundTint`).
- **Untruthed buildings must not change:** any code path that adds trim color must no-op when the field is absent (byte-stable render).
- **Dev-only tooling:** the editor panel and its save middleware must never ship in the production build (`apply: "serve"`, query-param gate).
- **Canonical families (fixed at 6):** `brick`, `clapboard`, `brownstone`, `painted-masonry`, `modern-flat`, `warehouse` (from `src/materialFamilies.js` → `familyList()`).
- **Tests run with:** `node --test src/<file>.test.mjs` (style: `node:test` + `node:assert/strict`).

---

## File Structure

- `src/visualSystem/palette.js` — **modify**: add `TRIM_TONES` sanctioned set.
- `src/visualSystem/colorBinding.js` — **modify**: add `nearestTrimToken(hex)` beside `nearestPaletteToken`.
- `src/facadeFamily.js` — **modify**: `isValidFacadeOverride` accepts `windowTint`/`doorTint`.
- `src/buildKitFacadeParams.js` — **modify**: thread snapped `windowTint`/`doorTint` into params.
- `src/SceneView.jsx` — **modify**: renderer honors `params.windowTint`/`params.doorTint`; click→BIN wiring; host the truth panel.
- `src/dev/facadeTruthRegistry.js` — **create**: per-BIN truth registry (mirrors `facadeFaceRegistry.js`).
- `src/components/dev/FacadeTruthEditor.jsx` — **create**: the eyedropper truth panel.
- `vite-plugin-facade-override-writer.js` — **create**: dev-save middleware for the override JSON.
- `vite.config.js` — **modify**: register the override writer.
- Tests: `src/colorBinding.test.mjs`, `src/buildKitFacadeParams.test.mjs` (extend), `src/facadeFamily.test.mjs` (extend).

---

## Task 1: Palette trim tokens + nearest-trim snapper

**Files:**
- Modify: `src/visualSystem/palette.js` (after `MATERIAL_WALL_TONES`, ~line 64)
- Modify: `src/visualSystem/colorBinding.js`
- Test: `src/colorBinding.test.mjs` (create)

**Interfaces:**
- Produces: `TRIM_TONES` (array of hex numbers) in `palette.js`; `nearestTrimToken(trueColorHex: number): number` in `colorBinding.js`.

- [ ] **Step 1: Write the failing test**

Create `src/colorBinding.test.mjs`:

```javascript
// Run: node --test src/colorBinding.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestTrimToken } from "./visualSystem/colorBinding.js";
import { TRIM_TONES } from "./visualSystem/palette.js";

test("nearestTrimToken returns a sanctioned TRIM_TONES entry", () => {
  const out = nearestTrimToken(0x000000); // pure black -> nearest is the near-black trim
  assert.ok(TRIM_TONES.includes(out), `expected ${out.toString(16)} in TRIM_TONES`);
});

test("nearestTrimToken snaps to the closest token by RGB distance", () => {
  // A token snapped to itself must return itself (idempotent).
  for (const t of TRIM_TONES) assert.equal(nearestTrimToken(t), t);
});

test("near-black sample snaps to the darkest trim", () => {
  const darkest = TRIM_TONES.reduce((a, b) => {
    const lum = (h) => ((h >> 16) & 255) + ((h >> 8) & 255) + (h & 255);
    return lum(b) < lum(a) ? b : a;
  });
  assert.equal(nearestTrimToken(0x101010), darkest);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/colorBinding.test.mjs`
Expected: FAIL — `nearestTrimToken` is not exported / `TRIM_TONES` is undefined.

- [ ] **Step 3: Add `TRIM_TONES` to `palette.js`**

Insert after the `MATERIAL_WALL_TONES` block (after line 64):

```javascript
// Per-building TRIM tones (window frame/sash + door leaf) for frontage facade
// truth. Independent of wall tone: a maroon-brick building can carry black trim.
// All are inked II-C values (never pure #000/#fff). The truth editor snaps a
// sampled pixel to the nearest of these; genuinely-new trims are appended here
// as a deliberate commit, keeping the no-miss rule intact.
export const TRIM_TONES = [
  0x1d1a16, // near-black inked (dark painted trim — the "black" frame/door)
  0xcdbfa6, // warm cream (light painted trim; == MASSING.transomBand)
  0x2e3b32, // forest green (== bar awning tint)
  0x6b2f28, // oxblood / barn red
  0x3f4650, // slate blue-grey
  0x4a3a2c, // dark stained wood (== FACADE_RELIEF.joineryCheek family)
];
```

- [ ] **Step 4: Add `nearestTrimToken` to `colorBinding.js`**

Change the import line and append the function:

```javascript
import { MATERIAL_WALL_TONES, TRIM_TONES } from "./palette.js";
```

Append at end of file:

```javascript
// Snap a sampled window/door pixel to the nearest sanctioned trim token. Same
// Euclidean-RGB rule as nearestPaletteToken, against the family-agnostic
// TRIM_TONES set (trim color is not constrained by wall material).
export function nearestTrimToken(trueColorHex) {
  const [tr, tg, tb] = rgb(trueColorHex);
  let best = TRIM_TONES[0];
  let bestD = Infinity;
  for (const c of TRIM_TONES) {
    const [r, g, b] = rgb(c);
    const d = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test src/colorBinding.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/visualSystem/palette.js src/visualSystem/colorBinding.js src/colorBinding.test.mjs
git commit -m "feat(palette): TRIM_TONES + nearestTrimToken for per-building trim color"
```

---

## Task 2: Override schema accepts windowTint / doorTint

**Files:**
- Modify: `src/facadeFamily.js:30-44` (`isValidFacadeOverride`)
- Test: `src/facadeFamily.test.mjs` (extend)

**Interfaces:**
- Consumes: nothing new.
- Produces: `isValidFacadeOverride` returns `true` for objects carrying `windowTint`/`doorTint` as `0x`-hex strings, `false` for malformed ones.

- [ ] **Step 1: Write the failing test**

Append to `src/facadeFamily.test.mjs`:

```javascript
test("override accepts windowTint and doorTint as 0x-hex strings", () => {
  assert.equal(isValidFacadeOverride({ windowTint: "0x1d1a16", doorTint: "0x6b2f28" }), true);
});

test("override rejects malformed trint tints", () => {
  assert.equal(isValidFacadeOverride({ windowTint: "1d1a16" }), false); // missing 0x
  assert.equal(isValidFacadeOverride({ doorTint: "0x12345" }), false);  // 5 hex digits
  assert.equal(isValidFacadeOverride({ windowTint: 123 }), false);      // not a string
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/facadeFamily.test.mjs`
Expected: FAIL — `windowTint` currently passes through unvalidated, so the malformed-rejection assertions fail.

- [ ] **Step 3: Add validation lines**

In `src/facadeFamily.js`, inside `isValidFacadeOverride`, add after the `groundTint` check (line 35):

```javascript
  if ("windowTint" in obj && !(typeof obj.windowTint === "string" && /^0x[0-9a-fA-F]{6}$/.test(obj.windowTint))) return false;
  if ("doorTint" in obj && !(typeof obj.doorTint === "string" && /^0x[0-9a-fA-F]{6}$/.test(obj.doorTint))) return false;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/facadeFamily.test.mjs`
Expected: PASS (all, including the new two).

- [ ] **Step 5: Commit**

```bash
git add src/facadeFamily.js src/facadeFamily.test.mjs
git commit -m "feat(facade): override schema accepts windowTint/doorTint"
```

---

## Task 3: buildKitFacadeParams threads snapped trim tints

**Files:**
- Modify: `src/buildKitFacadeParams.js`
- Test: `src/buildKitFacadeParams.test.mjs` (extend)

**Interfaces:**
- Consumes: `nearestTrimToken` (Task 1), override `windowTint`/`doorTint` strings (Task 2).
- Produces: `buildKitFacadeParams(...)` sets `params.windowTint` / `params.doorTint` (snapped hex numbers) ONLY when the override provides them; leaves them `undefined` otherwise.

- [ ] **Step 1: Write the failing test**

Append to `src/buildKitFacadeParams.test.mjs` (import `nearestTrimToken` + `TRIM_TONES` at top if not present):

```javascript
import { nearestTrimToken } from "./visualSystem/colorBinding.js";

test("trim tints are absent without an override (byte-stable default)", () => {
  const p = buildKitFacadeParams({ bin: "1", sourceProperties: { yearBuilt: 1890 } }, "brick");
  assert.equal(p.windowTint, undefined);
  assert.equal(p.doorTint, undefined);
});

test("trim tints snap to TRIM_TONES when overridden", () => {
  const p = buildKitFacadeParams(
    { bin: "1", sourceProperties: { yearBuilt: 1890 } },
    "brick",
    { windowTint: "0x000000", doorTint: "0x6b2f28" },
  );
  assert.equal(p.windowTint, nearestTrimToken(0x000000));
  assert.equal(p.doorTint, nearestTrimToken(0x6b2f28));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/buildKitFacadeParams.test.mjs`
Expected: FAIL — `p.windowTint`/`p.doorTint` are `undefined` even when overridden.

- [ ] **Step 3: Implement the threading**

In `src/buildKitFacadeParams.js`, update the import (line 9):

```javascript
import { nearestPaletteToken, nearestTrimToken } from "./visualSystem/colorBinding.js";
```

Add after the existing `if (ov.fireEscapeVariant != null) ...` line (line 56), before `return params;`:

```javascript
  if (ov.windowTint != null) params.windowTint = nearestTrimToken(Number(ov.windowTint));
  if (ov.doorTint != null) params.doorTint = nearestTrimToken(Number(ov.doorTint));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/buildKitFacadeParams.test.mjs`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add src/buildKitFacadeParams.js src/buildKitFacadeParams.test.mjs
git commit -m "feat(facade): thread snapped windowTint/doorTint into kit params"
```

---

## Task 4: Renderer honors explicit window + door tint

**Files:**
- Modify: `src/SceneView.jsx` — `decorateInkedWall`, window draws (~line 2277, 2301-2325) and door draw (~line 2362-2366)

**Interfaces:**
- Consumes: `params.windowTint` / `params.doorTint` (Task 3).
- Produces: no new exports — renders explicit trim when set, today's derived colors when absent.

This task is Three.js render code; it is verified visually (Task 8), not by unit test. `quad`/`quad3` already forward `tint` and skip it when `null`/`undefined` (`SceneView.jsx:2169,2185,2258`), so passing `undefined` is byte-stable.

- [ ] **Step 1: Capture trim tints near the window setup**

In `decorateInkedWall`, just after `const winTex = inkedTexture(...)` (line 2277), add:

```javascript
  const winTint = params.windowTint; // undefined => window texture renders untinted (today's look)
```

- [ ] **Step 2: Tint the non-recessed window draw**

In `drawWindow` (line 2303), change:

```javascript
    if (recessProj <= 0) { quad(w, 0.008, winTex, { transparent: true }); return; }
```

to:

```javascript
    if (recessProj <= 0) { quad(w, 0.008, winTex, { transparent: true, tint: winTint }); return; }
```

- [ ] **Step 3: Tint the recessed window slices**

In the `slice` helper inside `drawWindow` (line 2320), change the `quad3` opts to include the tint:

```javascript
      quad3(point(xa, ya, off), point(xb, ya, off), point(xb, yb, off), point(xa, yb, off), winTex,
        { transparent: true, tint: winTint, uv: [ua, va, ub, va, ub, vb, ua, vb] });
```

- [ ] **Step 4: Honor doorTint on the door leaf**

In `drawDoor` (lines 2362-2366), change both branches:

```javascript
    if (doorFile) {
      quad(rect, D, inkedTexture(doorFile),
        { tint: params.doorTint != null ? params.doorTint : darken(groundTint, 0.72), transparent: true });
    } else {
      quad(rect, D, null, { tint: params.doorTint != null ? params.doorTint : darken2(0.3) }); // flat fallback leaf
    }
```

- [ ] **Step 5: Verify build + lint pass**

Run: `npm run build`
Expected: build succeeds, no errors referencing `winTint`/`params.doorTint`.

- [ ] **Step 6: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(facade): renderer honors explicit windowTint/doorTint, derives when absent"
```

---

## Task 5: Dev-save middleware for the override JSON

**Files:**
- Create: `vite-plugin-facade-override-writer.js`
- Modify: `vite.config.js`

**Interfaces:**
- Produces: `POST /__facade-override { bin, override }` — merges `override`'s fields into `overrides[bin]` of `src/data/facade-overrides/greenpoint-corridor.v0.1.json`, preserving other BINs and trailing-newline style. Returns `{ ok: true, bin }` or `{ ok: false, error }`.

- [ ] **Step 1: Create the middleware**

Create `vite-plugin-facade-override-writer.js` (modeled on `vite-plugin-facade-spec-writer.js`):

```javascript
// Dev-only middleware: merges a per-BIN facade override back into its JSON file.
//
// POST /__facade-override  { bin, override }
//   - bin: the building BIN key under the file's `overrides` object
//   - override: object of fields to merge (family, tint, windowTint, doorTint, ...)
//
// `apply: "serve"` keeps this out of the production build entirely.

import fs from "node:fs";
import path from "node:path";

const OVERRIDE_FILE = "src/data/facade-overrides/greenpoint-corridor.v0.1.json";

export default function facadeOverrideWriter() {
  return {
    name: "facade-override-writer",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__facade-override", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("method not allowed");
          return;
        }
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          try {
            const { bin, override } = JSON.parse(body);
            if (!bin || typeof bin !== "string") throw new Error("missing or invalid bin");
            if (bin.includes("/") || bin.includes("\\") || bin.includes("..")) throw new Error("invalid bin");
            if (!override || typeof override !== "object") throw new Error("missing override object");

            const full = path.resolve(process.cwd(), OVERRIDE_FILE);
            const original = fs.readFileSync(full, "utf8");
            const json = JSON.parse(original);
            if (!json.overrides || typeof json.overrides !== "object") json.overrides = {};

            json.overrides[bin] = { ...(json.overrides[bin] ?? {}), ...override };

            const eof = original.endsWith("\n") ? "\n" : "";
            fs.writeFileSync(full, `${JSON.stringify(json, null, 2)}${eof}`);

            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: true, bin }));
          } catch (error) {
            res.statusCode = 400;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ ok: false, error: String(error.message || error) }));
          }
        });
      });
    },
  };
}
```

- [ ] **Step 2: Register it in `vite.config.js`**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import facadeSpecWriter from "./vite-plugin-facade-spec-writer.js";
import facadeOverrideWriter from "./vite-plugin-facade-override-writer.js";

export default defineConfig({
  plugins: [react(), facadeSpecWriter(), facadeOverrideWriter()],
});
```

- [ ] **Step 3: Verify the endpoint round-trips (manual)**

Start the dev server, then in another shell:

```bash
curl -s -X POST http://127.0.0.1:5173/__facade-override \
  -H 'content-type: application/json' \
  -d '{"bin":"__test__","override":{"windowTint":"0x1d1a16"}}'
```

Expected: `{"ok":true,"bin":"__test__"}`. Confirm `src/data/facade-overrides/greenpoint-corridor.v0.1.json` now has a `__test__` entry, then remove it (and confirm pre-existing entries like `3064605` are untouched).

- [ ] **Step 4: Commit**

```bash
git add vite-plugin-facade-override-writer.js vite.config.js
git commit -m "feat(dev): facade-override writer middleware (per-BIN merge)"
```

---

## Task 6: Per-BIN truth registry + click→BIN wiring

**Files:**
- Create: `src/dev/facadeTruthRegistry.js`
- Modify: `src/SceneView.jsx` — populate registry per kit building; resolve clicked BIN

**Interfaces:**
- Produces (`facadeTruthRegistry.js`):
  - `registerBuildingTruth(bin: string, entry: { family: string, tint: number, windowTint?: number, doorTint?: number, addr?: string }): void`
  - `getBuildingTruth(bin): entry | null`
  - `buildingTruthBins(): string[]`
  - `subscribeBuildingTruth(fn): () => void`
- Produces (`SceneView.jsx`): a `selectedBin` state set when a building body (carrying `userData.bin`) is clicked in `?facadeedit=1` mode.

- [ ] **Step 1: Create the registry**

Create `src/dev/facadeTruthRegistry.js` (mirrors the subscribe pattern of `facadeFaceRegistry.js`):

```javascript
// Dev-only per-BIN facade-truth registry. The scene builder registers each
// kit-routed building's resolved family + current tints here so the truth editor
// (?facadeedit=1) can seed its controls without re-deriving. Cleared per rebuild.
const truth = new Map();
const listeners = new Set();

export function resetBuildingTruth() {
  truth.clear();
  listeners.forEach((fn) => fn());
}

export function registerBuildingTruth(bin, entry) {
  if (bin == null) return;
  truth.set(String(bin), entry);
  listeners.forEach((fn) => fn());
}

export function getBuildingTruth(bin) {
  return bin == null ? null : truth.get(String(bin)) ?? null;
}

export function buildingTruthBins() {
  return [...truth.keys()];
}

export function subscribeBuildingTruth(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
```

- [ ] **Step 2: Register each kit building during scene build**

In `src/SceneView.jsx`, import at top (near the other dev imports, ~line 19):

```javascript
import { registerBuildingTruth, resetBuildingTruth } from "./dev/facadeTruthRegistry.js";
```

At the start of the building loop that resolves kit params (just before the loop that contains line 1396), call `resetBuildingTruth();` once. Then immediately after `kitParams = buildKitFacadeParams(building, family, FACADE_OVERRIDES[building.bin]);` (line 1396), add:

```javascript
        registerBuildingTruth(building.bin, {
          family,
          tint: kitParams.tint,
          windowTint: kitParams.windowTint,
          doorTint: kitParams.doorTint,
          addr: building.address ?? building.sourceProperties?.address,
        });
```

(If `resetBuildingTruth` has no obvious single call site because the loop spans branches, place it immediately before the `for` loop over `scene.buildings` that assigns treatments. The registry is rebuilt fresh each scene build.)

- [ ] **Step 3: Resolve the clicked BIN**

In the raycast click handler, the helper at line 396 already returns `node.userData?.[key]`. After the existing `faceKey` resolution in `onPointerDown` (near line 444-450), add a BIN resolve using the same upward-walk helper. Locate the helper (the function around line 390-396 that walks `hit.object` up its parents looking up `userData[key]`); call it for `"bin"`:

```javascript
      // Facade-truth: a building-body click (userData.bin) selects that BIN.
      if (facadeEdit || editorOpen) {
        const clickedBin = findUserData(hit.object, "bin"); // same upward-walk helper used for faceKey
        if (clickedBin != null) setSelectedBin(String(clickedBin));
      }
```

Add the state near the other editor state (line 111-112):

```javascript
  const [selectedBin, setSelectedBin] = useState(null);
```

(Name the upward-walk helper `findUserData` if it is currently an inline arrow; otherwise call it by its existing name. Do not duplicate the walk logic.)

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/dev/facadeTruthRegistry.js src/SceneView.jsx
git commit -m "feat(dev): per-BIN facade-truth registry + click-to-BIN selection"
```

---

## Task 7: FacadeTruthEditor panel (material + eyedropper colors)

**Files:**
- Create: `src/components/dev/FacadeTruthEditor.jsx`
- Modify: `src/SceneView.jsx` — host the panel under `?facadeedit=1`

**Interfaces:**
- Consumes: `selectedBin` (Task 6), `getBuildingTruth`/`subscribeBuildingTruth` (Task 6), `nearestTrimToken`/`nearestPaletteToken` + `TRIM_TONES`/`MATERIAL_WALL_TONES` (Task 1), `familyList()` (`src/materialFamilies.js`), `POST /__facade-override` (Task 5).
- Produces: a self-contained dev panel; no exports consumed elsewhere.

- [ ] **Step 1: Create the panel component**

Create `src/components/dev/FacadeTruthEditor.jsx`:

```javascript
import { useEffect, useState } from "react";
import { familyList } from "../../materialFamilies.js";
import { getBuildingTruth, subscribeBuildingTruth } from "../../dev/facadeTruthRegistry.js";
import { nearestTrimToken, nearestPaletteToken } from "../../visualSystem/colorBinding.js";
import { TRIM_TONES, MATERIAL_WALL_TONES } from "../../visualSystem/palette.js";

const hex6 = (n) => "0x" + (n >>> 0).toString(16).padStart(6, "0").slice(-6);
const cssHex = (n) => "#" + (n >>> 0).toString(16).padStart(6, "0").slice(-6);

// Dev-only (?facadeedit=1) per-BIN facade-truth panel. Click a building to load
// its BIN; eyedrop facade/window/door from Street View open beside the app;
// each sample snaps to a sanctioned palette token; Save merges the override JSON.
export default function FacadeTruthEditor({ bin }) {
  const [, force] = useState(0);
  useEffect(() => subscribeBuildingTruth(() => force((n) => n + 1)), []);

  const entry = bin ? getBuildingTruth(bin) : null;
  const [family, setFamily] = useState(null);
  const [wall, setWall] = useState(null);   // snapped hex number or null
  const [win, setWin] = useState(null);
  const [door, setDoor] = useState(null);
  const [status, setStatus] = useState("");

  // Seed controls from the registered truth whenever the selected BIN changes.
  useEffect(() => {
    setFamily(entry?.family ?? null);
    setWall(entry?.tint ?? null);
    setWin(entry?.windowTint ?? null);
    setDoor(entry?.doorTint ?? null);
    setStatus("");
  }, [bin]); // eslint-disable-line react-hooks/exhaustive-deps

  const eyedropper = typeof window !== "undefined" && "EyeDropper" in window;

  async function sample(kind) {
    if (!eyedropper) { setStatus("EyeDropper needs Chrome/Edge/Arc"); return; }
    try {
      const { sRGBHex } = await new window.EyeDropper().open(); // "#rrggbb"
      const raw = parseInt(sRGBHex.slice(1), 16);
      if (kind === "wall") setWall(nearestPaletteToken(raw, family ?? "brick"));
      else if (kind === "win") setWin(nearestTrimToken(raw));
      else setDoor(nearestTrimToken(raw));
      setStatus("sampled → snapped");
    } catch {
      setStatus("sample cancelled");
    }
  }

  async function save() {
    if (!bin) return;
    const override = { family };
    if (wall != null) override.tint = hex6(wall);
    if (win != null) override.windowTint = hex6(win);
    if (door != null) override.doorTint = hex6(door);
    setStatus("saving…");
    try {
      const res = await fetch("/__facade-override", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bin, override }),
      });
      const json = await res.json();
      setStatus(json.ok ? "saved ✓ (HMR will re-render)" : `error: ${json.error}`);
    } catch (error) {
      setStatus(`error: ${error.message}`);
    }
  }

  return (
    <div style={shell}>
      <strong>Facade truth</strong>
      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
        {bin ? `BIN ${bin}${entry?.addr ? ` · ${entry.addr}` : ""}` : "click a building to load it"}
      </div>
      {bin && (
        <>
          <Row label="material">
            <select value={family ?? ""} onChange={(e) => setFamily(e.target.value)} style={select}>
              {familyList().map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Row>
          <ColorRow label="facade" value={wall} onSample={() => sample("wall")} tokens={MATERIAL_WALL_TONES[family] ?? []} />
          <ColorRow label="window" value={win} onSample={() => sample("win")} tokens={TRIM_TONES} />
          <ColorRow label="door" value={door} onSample={() => sample("door")} tokens={TRIM_TONES} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <button onClick={save} style={button}>Save → JSON</button>
            <span style={{ fontSize: 11, opacity: 0.85 }}>{status}</span>
          </div>
          {!eyedropper && <div style={{ fontSize: 11, color: "#e0a", marginTop: 6 }}>EyeDropper unavailable — use Chrome/Edge/Arc.</div>}
        </>
      )}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, fontSize: 11 }}>
      <span style={{ opacity: 0.85, minWidth: 56 }}>{label}</span>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onSample, tokens }) {
  return (
    <Row label={label}>
      <button onClick={onSample} style={button}>eyedrop</button>
      <span title="snapped token" style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #5a4d3e",
        background: value != null ? cssHex(value) : "transparent" }} />
      <code style={{ fontSize: 11, opacity: 0.85 }}>{value != null ? hex6(value) : "—"}</code>
      <span style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
        {tokens.map((t) => <span key={t} style={{ width: 12, height: 12, background: cssHex(t), borderRadius: 2,
          outline: t === value ? "2px solid #ffcf3f" : "none" }} />)}
      </span>
    </Row>
  );
}

const shell = {
  position: "absolute", top: 14, left: 14, width: 320, padding: 12,
  background: "rgba(28,24,18,0.94)", color: "#eae1ce",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12,
  borderRadius: 6, boxShadow: "0 6px 24px rgba(0,0,0,0.4)", zIndex: 50,
};
const select = { flex: 1, background: "#3a3228", color: "#eae1ce", border: "1px solid #5a4d3e", borderRadius: 4, padding: "3px 6px", fontFamily: "inherit", fontSize: 11 };
const button = { background: "#d9a43b", color: "#241c10", border: "none", borderRadius: 4, padding: "5px 9px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 11 };
```

- [ ] **Step 2: Host the panel in SceneView**

Import near line 19:

```javascript
import FacadeTruthEditor from "./components/dev/FacadeTruthEditor.jsx";
```

In the JSX, alongside the existing `<FacadeRecessEditor .../>` block (~line 584), render the truth panel whenever facade-edit mode is on:

```jsx
        {(facadeEdit || editorOpen) && <FacadeTruthEditor bin={selectedBin} />}
```

(`facadeEdit` is the memoized query-param flag at line 106; if it is named differently, use that name.)

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: build succeeds, no missing-import errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/dev/FacadeTruthEditor.jsx src/SceneView.jsx
git commit -m "feat(dev): FacadeTruthEditor panel — material dropdown + eyedropper trim colors"
```

---

## Task 8: Truth one real building + visual proof

**Files:**
- Modify (data): `src/data/facade-overrides/greenpoint-corridor.v0.1.json` (one real frontage BIN)

**Interfaces:** none — this is the end-to-end acceptance run.

- [ ] **Step 1: Start the dev server in Chrome**

Run: `npm run dev`, open `http://127.0.0.1:5173/?facadeedit=1` in Chrome/Edge/Arc.

- [ ] **Step 2: Truth one building**

Pick a real frontage building that is NOT a hero (e.g. a brick walk-up next to the maroon trio). Click it → confirm the Facade truth panel shows its BIN + resolved family. Open Street View for that address in a side window. Eyedrop facade, window, door; confirm each shows a snapped swatch + `0x` token. Set material if the family is wrong. Save.

- [ ] **Step 3: Confirm the override JSON**

Confirm `src/data/facade-overrides/greenpoint-corridor.v0.1.json` gained a `tint`/`windowTint`/`doorTint` (and `family`) entry for that BIN, and that the two pre-existing entries (`3064541`, `3064605`) are intact.

- [ ] **Step 4: Confirm the render**

After Save, confirm the scene re-renders (HMR). If HMR does not rebuild the scene from the JSON change, reload the page. Verify: the truthed building shows the sampled wall color + trim/door color; an untruthed neighbor is unchanged. Capture before/after screenshots (use the preview tooling).

- [ ] **Step 5: Run the full test + build gate**

```bash
node --test src/colorBinding.test.mjs src/facadeFamily.test.mjs src/buildKitFacadeParams.test.mjs
npm run build
```

Expected: all tests PASS, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/data/facade-overrides/greenpoint-corridor.v0.1.json
git commit -m "feat(facade): first hand-truthed frontage building (material + sampled color)"
```

---

## Self-Review

**Spec coverage:**
- Schema extension (`windowTint`/`doorTint`) → Task 2 (validation), Task 3 (params), Task 5 (persistence). ✓
- Palette grows on purpose (`TRIM_TONES`, `nearestTrimToken`) → Task 1. ✓
- Renderer honors explicit trim, else falls back → Task 4. ✓
- Eyedropper tool in `?facadeedit=1` (material dropdown, 3 color rows, raw→snapped, save) → Tasks 6+7. ✓
- Mirrored dev-save middleware → Task 5. ✓
- Click-to-load BIN → Task 6. ✓
- Testing (unit snapping, schema, params; visual proof) → Tasks 1,2,3 (unit) + Task 8 (visual). ✓
- Constraints flagged (Chromium-only eyedropper, fixed 6 families, inked trim tokens) → encoded in Task 7 (EyeDropper guard, `familyList()`, `TRIM_TONES` values). ✓

**Deviations from spec (within approved spirit):**
- The tool is a **sibling panel** (`FacadeTruthEditor`), not bolted into `FacadeRecessEditor` — the recess editor is hero-face-spec machinery and a wrong host for per-BIN color. Same `?facadeedit=1` dev mode, "not a new app." 
- **"add as new token"** affordance is deferred from the panel: when no token is close, the operator adds the value to `TRIM_TONES`/`MATERIAL_WALL_TONES` by editing `palette.js` (a deliberate commit, per the no-miss rule). The panel shows the token strip so the operator sees when nothing is close. This keeps Task 7 bounded and the palette diff-reviewable; an in-panel "add token" button is a clean follow-up if the manual step proves slow.
- **Live preview is Save→HMR**, not a bespoke per-BIN color rebuild — far lower risk; acceptance (Task 8) confirms the HMR loop and falls back to reload.

**Placeholder scan:** no TBD/TODO; every code step shows full code. ✓
**Type consistency:** `nearestTrimToken(number) → number`, override tints are `0x`-strings in JSON and snapped to numbers in params; `registerBuildingTruth(bin, {family,tint,windowTint,doorTint,addr})` consumed by `getBuildingTruth` in the panel; `hex6` converts params numbers back to `0x`-strings for save. Consistent across Tasks 1/3/6/7. ✓
