# Per-BIN Facade Structural Toggles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make six structural per-BIN facade edits (cornice on/off, storefront awning add/remove, door awning, door alignment, fire escape add/remove + variant) authorable through the existing per-BIN override JSON + click-to-edit truth editor, with no asset regeneration.

**Architecture:** Six optional fields land in the override JSON. `buildKitFacadeParams` merges them onto resolved params field-by-field (mirroring the existing color fields). `decorateInkedWall` (and the kit storefront wiring) gate existing draw sites on those params, with precedence **explicit override → existing heuristic/allowlist default**. The truth editor gains toggle/segmented controls that write the same fields through the existing `/__facade-override` endpoint.

**Tech Stack:** React 19, Three.js, Vite, Node test runner (`node --test`, `*.test.mjs`).

## Global Constraints

- No asset regeneration — every edit is render-tuning over family defaults (per the override file `_doc`).
- Absent field → `undefined` → renderer keeps today's heuristic/byte-stable behavior. INKED_FACADE_REAL params (no `family`) are never touched.
- Colors snap to sanctioned tokens via `nearestPaletteToken`/`nearestTrimToken`; structural toggles are booleans/enums (no color snapping).
- Pure logic stays Node-testable (`buildKitFacadeParams.js` imports no Three.js).
- Run `git status --short` before editing; commit when a coherent step lands and builds. Never push.
- Tests run with `node --test src/<file>.test.mjs`.

---

### Task 1: Override schema fields in `buildKitFacadeParams`

Add the six fields as passthrough params. This is the contract every downstream task consumes.

**Files:**
- Modify: `src/buildKitFacadeParams.js`
- Test: `src/buildKitFacadeParams.test.mjs`

**Interfaces:**
- Consumes: `buildKitFacadeParams(building, family, override)` (existing).
- Produces: `params.hasCornice` (`boolean|undefined`), `params.storefrontAwning` (`false | true | number | undefined`), `params.doorAwning` (`boolean|undefined`), `params.doorAlign` (`"left"|"center"|"right"|undefined`), `params.fireEscape` (`false | "standard" | "lattice" | true | undefined`).

- [ ] **Step 1: Write the failing test**

Add to `src/buildKitFacadeParams.test.mjs`:

```js
test("structural toggles fall through to undefined when absent", () => {
  const p = buildKitFacadeParams(BLDG, "brick", {});
  assert.equal(p.hasCornice, undefined);
  assert.equal(p.storefrontAwning, undefined);
  assert.equal(p.doorAwning, undefined);
  assert.equal(p.doorAlign, undefined);
  assert.equal(p.fireEscape, undefined);
});

test("structural toggles pass through verbatim when set", () => {
  const p = buildKitFacadeParams(BLDG, "brick", {
    hasCornice: false,
    storefrontAwning: 0x27314d,
    doorAwning: true,
    doorAlign: "center",
    fireEscape: "lattice",
  });
  assert.equal(p.hasCornice, false);
  assert.equal(p.storefrontAwning, 0x27314d);
  assert.equal(p.doorAwning, true);
  assert.equal(p.doorAlign, "center");
  assert.equal(p.fireEscape, "lattice");
});
```

(`BLDG` is the existing fixture in this test file — reuse it. If none exists, use `{ sourceProperties: {} }`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/buildKitFacadeParams.test.mjs`
Expected: FAIL — `p.hasCornice` etc. are `undefined` on the "set" test (assertion mismatch), or property missing.

- [ ] **Step 3: Add the passthrough block**

In `src/buildKitFacadeParams.js`, after the existing `if (ov.corniceTint != null) ...` line (currently line 64), before `return params;`:

```js
  // Structural per-BIN toggles (Phase 8 facade-truth). Each is absent-means-
  // fall-through: undefined leaves today's heuristic/allowlist default intact.
  // booleans/enums — NOT colors — so no token snapping.
  if (ov.hasCornice != null) params.hasCornice = ov.hasCornice;
  if (ov.doorAwning != null) params.doorAwning = ov.doorAwning;
  if (ov.doorAlign != null) params.doorAlign = ov.doorAlign;
  // storefrontAwning: false=suppress, true=default fabric, hex number=color.
  if (ov.storefrontAwning != null) {
    params.storefrontAwning = typeof ov.storefrontAwning === "string"
      ? Number(ov.storefrontAwning)        // "0xRRGGBB" → number
      : ov.storefrontAwning;               // boolean or number, verbatim
  }
  // fireEscape: false=off, "standard"|"lattice"=on+variant, true=on(default).
  if (ov.fireEscape != null) params.fireEscape = ov.fireEscape;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/buildKitFacadeParams.test.mjs`
Expected: PASS (all tests, including pre-existing).

- [ ] **Step 5: Commit**

```bash
git add src/buildKitFacadeParams.js src/buildKitFacadeParams.test.mjs
git commit -m "feat(facade-truth): per-BIN structural toggle params (cornice/awning/door/fire-escape)"
```

---

### Task 2: Cornice on/off gate

`hasCornice` overrides the cornice draw. The draw already honors `components.cornice !== false`; fold `hasCornice` in as the higher-priority signal.

**Files:**
- Modify: `src/SceneView.jsx:2634` (the `if (openingsFace && kitHas(family, "cornice") && ...)` gate inside `decorateInkedWall`)
- Test: `src/buildKitFacadeParams.test.mjs` (resolution helper — see Step 1)

**Interfaces:**
- Consumes: `params.hasCornice` from Task 1.
- Produces: exported pure helper `resolveHasCornice(params)` so the gate decision is Node-testable without Three.js.

- [ ] **Step 1: Write the failing test**

Create `src/facadeToggleResolve.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHasCornice } from "./facadeToggleResolve.js";

test("hasCornice wins when set", () => {
  assert.equal(resolveHasCornice({ hasCornice: false }), false);
  assert.equal(resolveHasCornice({ hasCornice: true }), true);
});

test("falls back to components.cornice when hasCornice absent", () => {
  assert.equal(resolveHasCornice({ components: { cornice: false } }), false);
  assert.equal(resolveHasCornice({ components: {} }), true);
  assert.equal(resolveHasCornice({}), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/facadeToggleResolve.test.mjs`
Expected: FAIL — `Cannot find module './facadeToggleResolve.js'`.

- [ ] **Step 3: Create the resolver and wire the gate**

Create `src/facadeToggleResolve.js`:

```js
// Pure resolution of structural facade toggles → render decisions. No Three.js,
// Node-testable. Precedence: explicit per-BIN field → existing default.

export function resolveHasCornice(params) {
  if (params?.hasCornice != null) return params.hasCornice;
  return params?.components?.["cornice"] !== false;
}

// fireEscape: returns { on, variant } where variant is the geometry term
// ("relief" | "lattice"). `auto` is the heuristic result (wantsFireEscape).
export function resolveFireEscape(params, auto) {
  const fe = params?.fireEscape;
  if (fe === false) return { on: false, variant: "relief" };
  if (fe == null) return { on: auto, variant: "relief" };
  if (fe === "lattice") return { on: true, variant: "lattice" };
  return { on: true, variant: "relief" }; // true | "standard"
}
```

In `src/SceneView.jsx`, add the import near the other facade imports (e.g. beside the `facadeDepthGates` import at line 35):

```js
import { resolveHasCornice, resolveFireEscape } from "./facadeToggleResolve.js";
```

Change the cornice gate at line 2634 from:

```js
  if (openingsFace && kitHas(family, "cornice") && params.components?.["cornice"] !== false) {
```

to:

```js
  if (openingsFace && kitHas(family, "cornice") && resolveHasCornice(params)) {
```

- [ ] **Step 4: Run tests + build**

Run: `node --test src/facadeToggleResolve.test.mjs && npm run build`
Expected: PASS, then build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/facadeToggleResolve.js src/facadeToggleResolve.test.mjs src/SceneView.jsx
git commit -m "feat(facade-truth): hasCornice per-BIN gate on cornice draw"
```

---

### Task 3: Fire escape on/off + variant pass-through

Gate the auto fire-escape on `params.fireEscape` and pass the resolved variant into the geometry (closing the latent gap where the variant was never forwarded).

**Files:**
- Modify: `src/SceneView.jsx:2608-2609` (fire-escape gate + `buildFireEscapeGeometry` call inside `decorateInkedWall`)
- Test: `src/facadeToggleResolve.test.mjs` (extend)

**Interfaces:**
- Consumes: `params.fireEscape` (Task 1), `resolveFireEscape` (Task 2), `wantsFireEscape(family, storeys)` (existing), `buildFireEscapeGeometry({ frontM, heightM, storeys, variant })` (existing; `variant` defaults to `"relief"`).
- Produces: fire escape drawn iff `resolveFireEscape(params, auto).on`, with the resolved `variant` forwarded.

- [ ] **Step 1: Write the failing test**

Add to `src/facadeToggleResolve.test.mjs`:

```js
import { resolveFireEscape } from "./facadeToggleResolve.js";

test("fireEscape false suppresses even when heuristic wants it", () => {
  assert.deepEqual(resolveFireEscape({ fireEscape: false }, true), { on: false, variant: "relief" });
});
test("fireEscape absent defers to heuristic", () => {
  assert.equal(resolveFireEscape({}, true).on, true);
  assert.equal(resolveFireEscape({}, false).on, false);
});
test("fireEscape string forces on + selects variant", () => {
  assert.deepEqual(resolveFireEscape({ fireEscape: "lattice" }, false), { on: true, variant: "lattice" });
  assert.deepEqual(resolveFireEscape({ fireEscape: "standard" }, false), { on: true, variant: "relief" });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/facadeToggleResolve.test.mjs`
Expected: FAIL only if `resolveFireEscape` from Task 2 is missing/incorrect; if Task 2 landed it, these pass — in that case proceed (the renderer wiring below is the real deliverable, build-verified in Step 4).

- [ ] **Step 3: Wire the gate + variant**

In `src/SceneView.jsx`, replace the gate at line 2608:

```js
  if (streetFace && !plainEntry && isKit && wantsFireEscape(family, storeys)) {
    const fe = buildFireEscapeGeometry({ frontM, heightM, storeys });
```

with:

```js
  const feDecision = resolveFireEscape(params, isKit && wantsFireEscape(family, storeys));
  if (streetFace && !plainEntry && feDecision.on) {
    const fe = buildFireEscapeGeometry({ frontM, heightM, storeys, variant: feDecision.variant });
```

(Note: `wantsFireEscape` already encodes the prewar-masonry/storeys rule; gating its result with `isKit` preserves today's behavior for the auto path while letting an explicit `fireEscape` string force one on a non-auto building.)

- [ ] **Step 4: Run tests + build**

Run: `node --test src/facadeToggleResolve.test.mjs && npm run build`
Expected: PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx src/facadeToggleResolve.test.mjs
git commit -m "feat(facade-truth): per-BIN fireEscape on/off + variant pass-through"
```

---

### Task 4: Storefront awning + door alignment (left/right) from params

Source the kit storefront units' `awning` and `door` from per-BIN params instead of the `isFoodTrade`/alternating defaults. `"center"` is deferred to Task 6 (needs `composeStorefront` support) — clamp to left/right here.

**Files:**
- Modify: `src/SceneView.jsx:1475-1483` (the `kitParams.storefront.units` builder)
- Test: `src/storefrontUnitResolve.test.mjs` (new pure helper)

**Interfaces:**
- Consumes: `params.storefrontAwning`, `params.doorAwning` (unused here — door awning is Task 7), `params.doorAlign`, `isFoodTrade(category)` (existing).
- Produces: exported `resolveStorefrontUnit({ bay, index, params })` → `{ label, door, awning, widthFrac }` matching the shape `decorateStorefront`/`composeStorefront` consume (`door` is `"left"|"right"`; `awning` is `{ has, color? }`).

- [ ] **Step 1: Write the failing test**

Create `src/storefrontUnitResolve.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveStorefrontUnit } from "./storefrontUnitResolve.js";

const bay = { category: "retail" };
const food = { category: "restaurant" }; // isFoodTrade true

test("defaults: alternating door, awning follows food trade", () => {
  const u0 = resolveStorefrontUnit({ bay: food, index: 0, params: {}, count: 2 });
  assert.equal(u0.door, "left");
  assert.equal(u0.awning.has, true);
  const u1 = resolveStorefrontUnit({ bay, index: 1, params: {}, count: 2 });
  assert.equal(u1.door, "right");
  assert.equal(u1.awning.has, false);
});

test("storefrontAwning false suppresses a food awning", () => {
  const u = resolveStorefrontUnit({ bay: food, index: 0, params: { storefrontAwning: false }, count: 1 });
  assert.equal(u.awning.has, false);
});

test("storefrontAwning color sets has+color", () => {
  const u = resolveStorefrontUnit({ bay, index: 0, params: { storefrontAwning: 0x27314d }, count: 1 });
  assert.equal(u.awning.has, true);
  assert.equal(u.awning.color, 0x27314d);
});

test("doorAlign overrides; center clamps to left", () => {
  assert.equal(resolveStorefrontUnit({ bay, index: 1, params: { doorAlign: "left" }, count: 2 }).door, "left");
  assert.equal(resolveStorefrontUnit({ bay, index: 0, params: { doorAlign: "center" }, count: 1 }).door, "left");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/storefrontUnitResolve.test.mjs`
Expected: FAIL — `Cannot find module './storefrontUnitResolve.js'`.

- [ ] **Step 3: Create the helper + wire it**

Create `src/storefrontUnitResolve.js`:

```js
// Pure per-bay storefront unit resolution. Precedence: per-BIN params →
// today's defaults (alternating door, awning on food trades). `composeStorefront`
// supports door "left"|"right" only — "center" is clamped here until Task 6.
import { isFoodTrade } from "./buildingTypology.js";

export function resolveStorefrontUnit({ bay, index, params = {}, count = 1 }) {
  let door = index % 2 === 0 ? "left" : "right";
  if (params.doorAlign === "left" || params.doorAlign === "right") door = params.doorAlign;
  else if (params.doorAlign === "center") door = "left"; // clamp until Task 6

  let has = isFoodTrade(bay.category);
  let color;
  const sa = params.storefrontAwning;
  if (sa === false) has = false;
  else if (sa === true) has = true;
  else if (typeof sa === "number") { has = true; color = sa; }

  const awning = color != null ? { has, color } : { has };
  return { door, awning, widthFrac: 1 / count };
}
```

> If `isFoodTrade` is not exported from `buildingTypology.js`, add `export` to its declaration (it is already imported into `SceneView.jsx`, so it exists there).

In `src/SceneView.jsx`, replace the units builder at lines 1476-1481:

```js
            units: binBays.map((bay, k) => ({
              label: resolveSignLabel(bay),
              door: k % 2 === 0 ? "left" : "right",
              awning: { has: isFoodTrade(bay.category) },
              widthFrac: 1 / binBays.length,
            })),
```

with:

```js
            units: binBays.map((bay, k) => ({
              label: resolveSignLabel(bay),
              ...resolveStorefrontUnit({ bay, index: k, params: kitParams, count: binBays.length }),
            })),
```

Add the import near the top of `SceneView.jsx` (beside the other `./` imports):

```js
import { resolveStorefrontUnit } from "./storefrontUnitResolve.js";
```

- [ ] **Step 4: Run tests + build**

Run: `node --test src/storefrontUnitResolve.test.mjs && npm run build`
Expected: PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/storefrontUnitResolve.js src/storefrontUnitResolve.test.mjs src/SceneView.jsx src/buildingTypology.js
git commit -m "feat(facade-truth): storefront awning + door align (L/R) from per-BIN params"
```

---

### Task 5: Truth editor UI — toggle + segmented controls

Add the structural toggles to the `?facadeedit=1` panel and persist them through the existing `/__facade-override` endpoint.

**Files:**
- Modify: `src/components/dev/FacadeTruthEditor.jsx`
- Modify: `src/SceneView.jsx:1463-1470` (the `registerBuildingTruth` payload — add the new fields so the panel seeds from current state)
- Modify: `src/dev/facadeTruthRegistry.js` (no code change needed — it stores arbitrary entry objects — but confirm)

**Interfaces:**
- Consumes: registry entry fields `hasCornice`, `storefrontAwning`, `doorAwning`, `doorAlign`, `fireEscape`; existing `save()` POST shape `{ bin, override }`.
- Produces: override JSON gains the structural fields when set.

- [ ] **Step 1: Extend the registry payload**

In `src/SceneView.jsx`, the `registerBuildingTruth(building.bin, {...})` call (line 1463) — add the resolved toggle values so the editor reflects current state:

```js
        registerBuildingTruth(building.bin, {
          family,
          tint: kitParams.tint,
          windowTint: kitParams.windowTint,
          doorTint: kitParams.doorTint,
          corniceColor: kitParams.corniceColor,
          hasCornice: kitParams.hasCornice,
          storefrontAwning: kitParams.storefrontAwning,
          doorAwning: kitParams.doorAwning,
          doorAlign: kitParams.doorAlign,
          fireEscape: kitParams.fireEscape,
          addr: building.address ?? building.sourceProperties?.address,
        });
```

- [ ] **Step 2: Add state + seeding in the editor**

In `src/components/dev/FacadeTruthEditor.jsx`, add state beside the existing `cornice` state (line 41):

```js
  const [hasCornice, setHasCornice] = useState(null);
  const [storefrontAwning, setStorefrontAwning] = useState(null); // null | false | true
  const [doorAwning, setDoorAwning] = useState(null);
  const [doorAlign, setDoorAlign] = useState(null);
  const [fireEscape, setFireEscape] = useState(null); // null | false | "standard" | "lattice"
```

In the seeding `useEffect` (line 49 block), add:

```js
    setHasCornice(entry?.hasCornice ?? null);
    setStorefrontAwning(entry?.storefrontAwning ?? null);
    setDoorAwning(entry?.doorAwning ?? null);
    setDoorAlign(entry?.doorAlign ?? null);
    setFireEscape(entry?.fireEscape ?? null);
```

and append the new deps to the dependency array on the same `useEffect`:

```js
  }, [bin, entry?.family, entry?.tint, entry?.windowTint, entry?.doorTint, entry?.corniceColor,
      entry?.hasCornice, entry?.storefrontAwning, entry?.doorAwning, entry?.doorAlign, entry?.fireEscape]); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 3: Add the controls + save payload**

Add a small segmented-control component at the bottom of the file (beside `Row`/`ColorRow`):

```jsx
function Seg({ label, value, options, onPick }) {
  return (
    <Row label={label}>
      {options.map((opt) => (
        <button
          key={String(opt.v)}
          onClick={() => onPick(value === opt.v ? null : opt.v)}
          style={{ ...button, opacity: value === opt.v ? 1 : 0.5 }}
        >{opt.t}</button>
      ))}
    </Row>
  );
}
```

In the JSX, after the cornice `ColorRow` (line 118), add:

```jsx
          <Seg label="cornice" value={hasCornice} onPick={setHasCornice}
               options={[{ v: true, t: "on" }, { v: false, t: "off" }]} />
          <Seg label="storefront awning" value={storefrontAwning} onPick={setStorefrontAwning}
               options={[{ v: true, t: "on" }, { v: false, t: "off" }]} />
          <Seg label="door awning" value={doorAwning} onPick={setDoorAwning}
               options={[{ v: true, t: "on" }, { v: false, t: "off" }]} />
          <Seg label="door" value={doorAlign} onPick={setDoorAlign}
               options={[{ v: "left", t: "L" }, { v: "center", t: "C" }, { v: "right", t: "R" }]} />
          <Seg label="fire escape" value={fireEscape} onPick={setFireEscape}
               options={[{ v: false, t: "none" }, { v: "standard", t: "std" }, { v: "lattice", t: "lattice" }]} />
```

In `save()` (line 74 block), after the existing `if (cornice != null) override.corniceTint = hex6(cornice);` line, add:

```js
    if (hasCornice != null) override.hasCornice = hasCornice;
    if (storefrontAwning != null) override.storefrontAwning = storefrontAwning;
    if (doorAwning != null) override.doorAwning = doorAwning;
    if (doorAlign != null) override.doorAlign = doorAlign;
    if (fireEscape != null) override.fireEscape = fireEscape;
```

- [ ] **Step 4: Build + manual verify**

Run: `npm run build`
Expected: build succeeds.

Then manual (the established gate loop): `npm run dev`, open `http://127.0.0.1:5173/?facadeedit=1`, click a kit BIN, toggle cornice off / fire escape lattice / door R / storefront awning off → **Save → JSON** → confirm the scene re-renders with the change and the field appears in `src/data/facade-overrides/greenpoint-corridor.v0.1.json`.

- [ ] **Step 5: Commit**

```bash
git add src/components/dev/FacadeTruthEditor.jsx src/SceneView.jsx
git commit -m "feat(facade-truth): structural toggle controls in the truth editor"
```

---

### Task 6: Center door support in `composeStorefront`

Lets `doorAlign: "center"` produce a centered entry column with glazing on both sides.

**Files:**
- Modify: `src/storefrontCompose.js:15-53` (`composeStorefront`)
- Modify: `src/storefrontUnitResolve.js` (drop the center→left clamp)
- Test: `src/storefrontCompose.test.mjs` (extend), `src/storefrontUnitResolve.test.mjs` (update clamp test)

**Interfaces:**
- Consumes: `composeStorefront({ door, awning })` where `door` now also accepts `"center"`.
- Produces: when `door === "center"`, `glazing` is an array of two rects (left + right of the centered door); `door` rect is centered. Existing `"left"`/`"right"` return shape is unchanged.

- [ ] **Step 1: Write the failing test**

Add to `src/storefrontCompose.test.mjs`:

```js
test("center door: glazing flanks a centered door column", () => {
  const c = composeStorefront({ door: "center" });
  const doors = Array.isArray(c.door) ? c.door : [c.door];
  const d = doors[0];
  const mid = (d.x0 + d.x1) / 2;
  assert.ok(Math.abs(mid - 0.5) < 1e-9, "door centered");
  const glaze = Array.isArray(c.glazing) ? c.glazing : [c.glazing];
  assert.equal(glaze.length, 2, "glazing on both sides");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/storefrontCompose.test.mjs`
Expected: FAIL — `composeStorefront` throws `RangeError: door must be "left" or "right"`.

- [ ] **Step 3: Implement center**

In `src/storefrontCompose.js`, change the guard (line 16) to allow `"center"`:

```js
  if (door !== "left" && door !== "right" && door !== "center") {
    throw new RangeError(`composeStorefront: door must be "left", "right", or "center", got ${JSON.stringify(door)}`);
  }
```

Add a center branch before the existing left/right horizontal layout (after the guard). When `door === "center"`, build a centered door rect and two glazing rects, then return the same object shape with `glazing` and `door` as arrays; keep all other rects (`bulkhead`, `transom`, `sign`, `awning`) spanning the full width as today. Use the existing `DOOR_W`, `BULKHEAD_TOP`, `GLAZE_TOP`, `TRANSOM_TOP`, `FRAME_W` constants:

```js
  if (door === "center") {
    const dx0 = 0.5 - DOOR_W / 2;
    const dx1 = 0.5 + DOOR_W / 2;
    const doorRect = { x0: dx0, y0: 0, x1: dx1, y1: GLAZE_TOP };
    const glazing = [
      { x0: 0, y0: BULKHEAD_TOP, x1: dx0, y1: GLAZE_TOP },
      { x0: dx1, y0: BULKHEAD_TOP, x1: 1, y1: GLAZE_TOP },
    ];
    const mullion = [
      { x0: dx0 - FRAME_W, y0: BULKHEAD_TOP, x1: dx0, y1: TRANSOM_TOP },
      { x0: dx1, y0: BULKHEAD_TOP, x1: dx1 + FRAME_W, y1: TRANSOM_TOP },
    ];
    const transom = { x0: 0, y0: GLAZE_TOP, x1: 1, y1: TRANSOM_TOP };
    const bulkhead = { x0: 0, y0: 0, x1: 1, y1: BULKHEAD_TOP };
    const sign = { x0: 0, y0: TRANSOM_TOP, x1: 1, y1: 1 };
    const frame = [
      { x0: 0, y0: BULKHEAD_TOP, x1: FRAME_W, y1: TRANSOM_TOP },
      { x0: 1 - FRAME_W, y0: BULKHEAD_TOP, x1: 1, y1: TRANSOM_TOP },
    ];
    const awningRect = hasAwning ? { x0: 0, y0: GLAZE_TOP, x1: 1, y1: TRANSOM_TOP } : null;
    return { bulkhead, glazing, mullion, transom, door: doorRect, sign, frame, awning: awningRect };
  }
```

> Verify the consumer in `SceneView.jsx`'s `decorateStorefront` path iterates `glazing`/`frame`/`mullion` as arrays. The left/right branch already returns single rects for `glazing`/`transom`/`door` and arrays for `mullion`/`frame`; if `decorateStorefront` does not already normalize singletons-vs-arrays, wrap reads with `Array.isArray(x) ? x : [x]` at the consume sites in `SceneView.jsx` (search `decorateStorefront` body for `.glazing`, `.door`, `.transom`). Add a unit test for the consumer normalization only if you change it.

Remove the clamp in `src/storefrontUnitResolve.js`:

```js
  if (params.doorAlign === "left" || params.doorAlign === "right" || params.doorAlign === "center") door = params.doorAlign;
```

and delete the `else if (params.doorAlign === "center") door = "left";` line. Update the `storefrontUnitResolve.test.mjs` clamp test to assert `"center"` passes through:

```js
test("doorAlign center passes through", () => {
  assert.equal(resolveStorefrontUnit({ bay, index: 0, params: { doorAlign: "center" }, count: 1 }).door, "center");
});
```

- [ ] **Step 4: Run tests + build**

Run: `node --test src/storefrontCompose.test.mjs src/storefrontUnitResolve.test.mjs && npm run build`
Expected: PASS, build succeeds.

- [ ] **Step 5: Manual verify + commit**

Manual: in `?facadeedit=1`, set door = C on a storefront BIN, Save, confirm the centered door renders with glazing on both sides.

```bash
git add src/storefrontCompose.js src/storefrontUnitResolve.js src/storefrontCompose.test.mjs src/storefrontUnitResolve.test.mjs src/SceneView.jsx
git commit -m "feat(facade-truth): center door layout for storefronts"
```

---

### Task 7: Door awning canopy (new geometry)

A standalone canopy over an entry door for buildings **without** a storefront (residential/recessed-entry kit families), driven by `params.doorAwning`. Storefront buildings already get awnings via Task 4, so this targets the non-storefront door path.

**Files:**
- Create: `src/doorAwningGeometry.js`
- Test: `src/doorAwningGeometry.test.mjs`
- Modify: `src/SceneView.jsx` (the non-storefront door branch — the `else` of `if (params.storefront && !plainEntry)` at line 2536; draw the canopy when `params.doorAwning === true`)

**Interfaces:**
- Consumes: `params.doorAwning` (Task 1), door center in face-local metres (`frontM / 2`, matching `buildStoopGeometry`'s `doorCenterM`).
- Produces: `buildDoorAwningGeometry({ frontM, heightM, doorCenterM, doorTopM, widthM, projectionM })` → `{ quads: [{ role, corners: [[u,v,w],...] }] }` in the same face-local `[u(m), v(m), w(m)]` convention as `buildFireEscapeGeometry`/`buildStoopGeometry` (roles: `"top"`, `"valance"`, `"side"`).

- [ ] **Step 1: Write the failing test**

Create `src/doorAwningGeometry.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDoorAwningGeometry } from "./doorAwningGeometry.js";

test("builds a canopy centered over the door, projecting outward", () => {
  const g = buildDoorAwningGeometry({ frontM: 8, heightM: 12, doorCenterM: 4, doorTopM: 2.2, widthM: 1.6, projectionM: 0.8 });
  assert.ok(g.quads.length >= 3, "top + valance + sides");
  const top = g.quads.find((q) => q.role === "top");
  // centered: u spans doorCenter ± width/2
  const us = top.corners.map((c) => c[0]);
  assert.ok(Math.min(...us) >= 3.19 && Math.max(...us) <= 4.81);
  // projects: some w > 0
  assert.ok(top.corners.some((c) => c[2] > 0));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/doorAwningGeometry.test.mjs`
Expected: FAIL — `Cannot find module './doorAwningGeometry.js'`.

- [ ] **Step 3: Implement the geometry**

Create `src/doorAwningGeometry.js`:

```js
// Pure geometry for a small canopy over an entry door (non-storefront kit
// buildings). Face-local metres [u, v, w] like stoopGeometry/fireEscapeGeometry:
// u along the facade, v up, w out from the wall. The renderer tints + textures.
export function buildDoorAwningGeometry({
  frontM,
  heightM,                  // unused in layout but kept for call-site symmetry
  doorCenterM = frontM / 2,
  doorTopM = 2.2,           // ~door head height
  widthM = 1.6,
  projectionM = 0.8,
  dropM = 0.35,             // valance skirt height
}) {
  const uL = doorCenterM - widthM / 2;
  const uR = doorCenterM + widthM / 2;
  const yWall = doorTopM + 0.25;       // canopy springs just above the door head
  const yLip = doorTopM;               // sloped down to the front lip
  const w = projectionM;
  const quads = [];
  // Sloped top: from the wall down to the projecting front lip.
  quads.push({ role: "top", corners: [
    [uL, yWall, 0], [uR, yWall, 0], [uR, yLip, w], [uL, yLip, w],
  ]});
  // Valance: vertical skirt at the front edge (street-facing, iso-legible).
  quads.push({ role: "valance", corners: [
    [uL, yLip, w], [uR, yLip, w], [uR, yLip - dropM, w], [uL, yLip - dropM, w],
  ]});
  // Side closers so it reads solid, not a floating flap.
  for (const su of [uL, uR]) {
    quads.push({ role: "side", corners: [
      [su, yWall, 0], [su, yLip, w], [su, yLip - dropM, w],
    ]});
  }
  return { quads };
}
```

In `src/SceneView.jsx`, inside the `else` branch of `if (params.storefront && !plainEntry)` (the residential/recessed-entry path beginning at line 2538), after the stoop/door is drawn, add — using the existing `point`, `quad3`, `frontM`, `heightM`, `upm`, and an awning tint from the palette (reuse `II_PALETTE.ink` or a trade tint; door awnings have no category, so use a neutral fabric — `II_PALETTE.ink`):

```js
        if (params.doorAwning === true && (streetFace || plainEntry === false)) {
          const da = buildDoorAwningGeometry({ frontM, heightM, doorCenterM: frontM / 2, doorTopM: 2.2 });
          for (const q of da.quads) {
            const [a, b, c, d] = q.corners.map(([u, v, w]) => point(u / frontM, v / heightM, w * upm));
            const tint = q.role === "side" ? FACADE_RELIEF.soffit : II_PALETTE.ink;
            if (d) quad3(a, b, c, d, null, { tint, transparent: false });
            else quad3(a, b, c, a, null, { tint }); // 3-corner side closer
          }
        }
```

> The side closers are triangles (3 corners). If `quad3` requires 4 corners, follow the fire-escape precedent at line 2616-2624 which maps `q.corners` and branches on `q.role`; mirror that triangle handling (it builds a 3-index geometry for stringers). Match whatever `quad3` / the fire-escape loop already does for 3-corner quads rather than inventing a new path.

Add the import:

```js
import { buildDoorAwningGeometry } from "./doorAwningGeometry.js";
```

- [ ] **Step 4: Run tests + build**

Run: `node --test src/doorAwningGeometry.test.mjs && npm run build`
Expected: PASS, build succeeds.

- [ ] **Step 5: Manual verify + commit**

Manual: in `?facadeedit=1`, pick a residential (non-storefront) kit BIN, toggle **door awning on**, Save, confirm a canopy renders over the entry door.

```bash
git add src/doorAwningGeometry.js src/doorAwningGeometry.test.mjs src/SceneView.jsx
git commit -m "feat(facade-truth): door awning canopy for non-storefront entries"
```

---

## Self-Review Notes

- **Spec coverage:** (a) cornice → Task 2; (b) storefront awning add → Task 4; (c) door awning → Task 7; (d) awning remove → Task 4 (`storefrontAwning: false`); (e) door L/C/R → Task 4 (L/R) + Task 6 (center); (f) fire escape add/remove + variant → Task 3. Schema → Task 1. Editor parity → Task 5. All six covered.
- **Independence:** Tasks 1-5 ship the four cheap gates and are independently useful. Tasks 6-7 (new/extended geometry) are isolated and can be deferred without breaking 1-5 (door C clamps to L; door awning simply does nothing until Task 7).
- **Type consistency:** `resolveHasCornice`/`resolveFireEscape` (Task 2) consumed in Tasks 2-3; `resolveStorefrontUnit` (Task 4) returns `{door,awning,widthFrac}` matching `composeStorefront`'s `{door,awning}` input; `buildDoorAwningGeometry` mirrors `buildFireEscapeGeometry`'s `{quads:[{role,corners}]}` shape.
- **Verification dependencies flagged:** Task 6 and Task 7 contain "verify the consumer normalizes arrays / handles 3-corner quads" checks because the exact `decorateStorefront` / `quad3` internals must be confirmed at implementation time against the live code — both reference the existing precedent to follow rather than guessing.

---

## Addendum (2026-06-22, round 2) — Tasks 8-9

Two further per-BIN toggles, same loop. Both build on the Task 1/2/5 plumbing
(`buildKitFacadeParams` passthrough, `facadeToggleResolve.js` resolver, the
truth editor + `registerBuildingTruth` payload).

### Task 8: Stoop on/off

`hasStoop` overrides the `wantsStoop(family)` heuristic. `false` → the existing
`else` path already draws the standard recessed door (so "off replaces with
standard door" needs no new geometry); `true` forces a stoop on a family the
heuristic skips.

**Files:**
- Modify: `src/buildKitFacadeParams.js` (passthrough `hasStoop`)
- Modify: `src/facadeToggleResolve.js` (add `resolveHasStoop`)
- Modify: `src/SceneView.jsx:2546` (`drewStoop` gate) + the `registerBuildingTruth` payload
- Modify: `src/components/dev/FacadeTruthEditor.jsx` (a `Seg` control)
- Test: `src/buildKitFacadeParams.test.mjs`, `src/facadeToggleResolve.test.mjs`

**Interfaces:**
- Consumes: `params.hasStoop` (`boolean|undefined`), `wantsStoop(family)` (existing).
- Produces: `resolveHasStoop(params, auto)` → `boolean`.

- [ ] **Step 1: Failing tests**

Add to `src/buildKitFacadeParams.test.mjs` (extend the existing toggle tests):

```js
test("hasStoop passes through", () => {
  assert.equal(buildKitFacadeParams(rec, "brownstone", { hasStoop: false }).hasStoop, false);
  assert.equal(buildKitFacadeParams(rec, "brownstone", {}).hasStoop, undefined);
});
```

(Use the same fixture variable the other tests in this file use — it is `rec`.)

Add to `src/facadeToggleResolve.test.mjs`:

```js
import { resolveHasStoop } from "./facadeToggleResolve.js";

test("hasStoop wins when set; else defers to heuristic", () => {
  assert.equal(resolveHasStoop({ hasStoop: false }, true), false);
  assert.equal(resolveHasStoop({ hasStoop: true }, false), true);
  assert.equal(resolveHasStoop({}, true), true);
  assert.equal(resolveHasStoop({}, false), false);
});
```

- [ ] **Step 2: Run, verify fail**

Run: `node --test src/buildKitFacadeParams.test.mjs src/facadeToggleResolve.test.mjs`
Expected: FAIL (`resolveHasStoop` not exported; `hasStoop` undefined on the set case).

- [ ] **Step 3: Implement**

In `src/buildKitFacadeParams.js`, beside the other structural passthroughs (after `if (ov.doorAlign != null) ...`):

```js
  if (ov.hasStoop != null) params.hasStoop = ov.hasStoop;
```

In `src/facadeToggleResolve.js`, add:

```js
export function resolveHasStoop(params, auto) {
  if (params?.hasStoop != null) return params.hasStoop;
  return auto;
}
```

In `src/SceneView.jsx`, change the `drewStoop` line (2546) from:

```js
      const drewStoop = isKit && wantsStoop(family) && !params.commercialGround && !plainEntry;
```

to:

```js
      const drewStoop = isKit && resolveHasStoop(params, wantsStoop(family)) && !params.commercialGround && !plainEntry;
```

Add `resolveHasStoop` to the existing `facadeToggleResolve.js` import in `SceneView.jsx`.

- [ ] **Step 4: Run + build**

Run: `node --test src/buildKitFacadeParams.test.mjs src/facadeToggleResolve.test.mjs && npm run build`
Expected: PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/buildKitFacadeParams.js src/facadeToggleResolve.js src/SceneView.jsx src/buildKitFacadeParams.test.mjs src/facadeToggleResolve.test.mjs
git commit -m "feat(facade-truth): per-BIN stoop on/off (off => standard door)"
```

(The editor `Seg` control + registry payload field for `hasStoop` ride along
in Task 10's editor pass below — keep this task render-focused.)

---

### Task 9: Fire escape color

`fireEscapeColor` tints the iron, snapped to `TRIM_TONES`. Deck stays the
brighter face: `iron = darken(color, 0.7)`, `deck = color`.

**Files:**
- Modify: `src/buildKitFacadeParams.js` (passthrough `fireEscapeColor`, snapped)
- Modify: `src/SceneView.jsx:2633-2634` (IRON/IRON_DECK from `params.fireEscapeColor`)
- Test: `src/buildKitFacadeParams.test.mjs`

**Interfaces:**
- Consumes: `params.fireEscapeColor` (`number|undefined`), local `darken(hex,k)` (line 2389), `nearestTrimToken` (already imported in buildKitFacadeParams).
- Produces: `params.fireEscapeColor` (a TRIM token number) when set.

- [ ] **Step 1: Failing test**

Add to `src/buildKitFacadeParams.test.mjs`:

```js
test("fireEscapeColor snaps to a trim token; absent => undefined", () => {
  const set = buildKitFacadeParams(rec, "brick", { fireEscapeColor: "0x3a1f1a" });
  assert.equal(typeof set.fireEscapeColor, "number");
  assert.equal(buildKitFacadeParams(rec, "brick", {}).fireEscapeColor, undefined);
});
```

- [ ] **Step 2: Run, verify fail**

Run: `node --test src/buildKitFacadeParams.test.mjs`
Expected: FAIL (`fireEscapeColor` undefined on the set case).

- [ ] **Step 3: Implement**

In `src/buildKitFacadeParams.js`, beside the other trim-snapped colors (after the `corniceTint` line):

```js
  if (ov.fireEscapeColor != null) params.fireEscapeColor = nearestTrimToken(Number(ov.fireEscapeColor));
```

In `src/SceneView.jsx`, change lines 2633-2634 from:

```js
    const IRON = II_PALETTE.fireEscapeIron;        // stringers, treads, ladder, handrails
    const IRON_DECK = II_PALETTE.fireEscapeIronDeck; // platform floor, a hair lifted so its edge reads
```

to:

```js
    // Per-BIN painted-iron override (snapped to TRIM_TONES); deck stays the
    // brighter face so the platform edge still reads. Falls back to the neutral
    // near-black iron palette when unset (byte-stable).
    const IRON = params.fireEscapeColor != null ? darken(params.fireEscapeColor, 0.7) : II_PALETTE.fireEscapeIron;
    const IRON_DECK = params.fireEscapeColor != null ? params.fireEscapeColor : II_PALETTE.fireEscapeIronDeck;
```

- [ ] **Step 4: Run + build**

Run: `node --test src/buildKitFacadeParams.test.mjs && npm run build`
Expected: PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/buildKitFacadeParams.js src/SceneView.jsx src/buildKitFacadeParams.test.mjs
git commit -m "feat(facade-truth): per-BIN fire escape color (trim-snapped iron tint)"
```

---

### Task 10: Editor controls for stoop + fire escape color

Add the two new controls to the truth editor and seed them from the registry,
matching the Task 5 pattern.

**Files:**
- Modify: `src/SceneView.jsx` (`registerBuildingTruth` payload: add `hasStoop`, `fireEscapeColor` from kitParams)
- Modify: `src/components/dev/FacadeTruthEditor.jsx`

- [ ] **Step 1: Registry payload**

In `src/SceneView.jsx`, extend the `registerBuildingTruth(building.bin, {...})` payload with:

```js
          hasStoop: kitParams.hasStoop,
          fireEscapeColor: kitParams.fireEscapeColor,
```

- [ ] **Step 2: Editor state + seeding**

In `src/components/dev/FacadeTruthEditor.jsx`, add state beside the other toggles:

```js
  const [hasStoop, setHasStoop] = useState(null);
  const [fireEscapeColor, setFireEscapeColor] = useState(null);
```

Seed in the existing `useEffect`:

```js
    setHasStoop(entry?.hasStoop ?? null);
    setFireEscapeColor(entry?.fireEscapeColor ?? null);
```

and append `entry?.hasStoop, entry?.fireEscapeColor` to that effect's dependency array.

- [ ] **Step 3: Controls + save**

In the JSX, add a `Seg` for stoop beside the other toggles and a `ColorRow`
for the fire-escape color (it is a trim color, so reuse `ColorRow` + `TRIM_TONES`,
mirroring the cornice color row):

```jsx
          <Seg label="stoop" value={hasStoop} onPick={setHasStoop}
               options={[{ v: true, t: "on" }, { v: false, t: "off" }]} />
          <ColorRow label="fire escape" value={fireEscapeColor}
               onSample={() => sample("fireEscape")} onPick={setFireEscapeColor} tokens={TRIM_TONES} />
```

Extend the eyedropper `sample()` kind handling so `"fireEscape"` snaps via
`nearestTrimToken` (mirror the `"cornice"` case):

```js
      else if (kind === "fireEscape") setFireEscapeColor(nearestTrimToken(raw));
```

In `save()`, after the other toggle writes:

```js
    if (hasStoop != null) override.hasStoop = hasStoop;
    if (fireEscapeColor != null) override.fireEscapeColor = hex6(fireEscapeColor);
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx src/components/dev/FacadeTruthEditor.jsx
git commit -m "feat(facade-truth): editor controls for stoop on/off + fire escape color"
```

---

### Addendum self-review
- **Coverage:** stoop on/off → Task 8 (render) + Task 10 (editor); fire escape color → Task 9 (render) + Task 10 (editor). Both schema fields land in `buildKitFacadeParams` (Tasks 8/9).
- **Type consistency:** `resolveHasStoop(params, auto)` mirrors `resolveFireEscape`'s `(params, auto)` shape; `fireEscapeColor` is a trim-token number like `windowTint`/`doorTint`/`corniceColor`; `darken` is the local helper at SceneView.jsx:2389, in scope at the 2633 fire-escape draw.
- **Byte-stable:** both fields absent → `resolveHasStoop` returns `auto` (today's `wantsStoop`), IRON/IRON_DECK fall back to the palette constants — unchanged render.
