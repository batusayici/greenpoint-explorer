# Track V — Spatial Demand Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A standalone, independently deployable 2D real-map page — "July in Greenpoint + G-Train Support" — in the II-C inked identity, with ~15 static seed cards (discovery + events + G-train support), filters, and signup/submission CTAs. Zero Three.js.

**Architecture:** Second Vite entry (`july.html` → `src/demand-test/`) so the page shares the repo/palette but never imports the 3D runtime. MapLibre GL JS renders OpenFreeMap vector tiles through a custom II-C style built from `palette.js` tokens. Cards are static JSON (`GreenpointMapCard` shape from the seed doc); coordinates are **derived** via a Nominatim geocode script (truth rule: never invent), cached as evidence. React components stay thin; all logic (schema validation, filtering, pin classification, style generation) lives in pure Node-testable modules.

**Tech Stack:** React 19 · Vite 8 (multi-page input) · MapLibre GL JS (new dep) · OpenFreeMap tiles (no API key) · `node --test` (existing suite glob `src/**/*.test.mjs`).

## Global Constraints

- **II-C palette is a no-miss** — every map/pin/UI color resolves from `src/visualSystem/palette.js` tokens (new `MAP_PALETTE` group added there, derived from existing anchors only — no new hues). CSS files are conformance-exempt but must mirror token values, commented.
- **Zero Three.js / Pixi in the `july.html` module graph.** Never import from `src/Phase4BRuntimePreview.jsx`, `src/SceneView.jsx`, or `src/phase4bRuntimeScene.js`.
- **Static JSON only** — no backend, no DB, no schema reconciliation with `PlaceStory`/`Landmark` (documented follow-up).
- **Truth rules:** all cards attribute their source (SSG newsletter 2026-07-01 or MTA); coordinates derived via geocoder, never hand-invented; civic content stays informational, not partisan.
- **Card content source of truth:** `docs/context/2026-07-02-ssg-july-seed.md` **plus the spec's hidden-business-engagement addendum** (Dandelion Wine same-day tasting exemplar, Falu House Tinned Fish Club). Card shape: the `GreenpointMapCard` type extended per the addendum — `"subscription"` category, `"join"` action type, optional `startsAt`/`endsAt` ISO datetimes on dated cards — plus two v1 view extensions: `filters: string[]` (authored filter membership) and `venues: []` (multi-venue event cluster).
- **Filter bar (spec addendum):** New · Food & Drink · Shopping · Services · Arts/Culture · Family/Kids · Events · **Clubs & Signups** · G-Train Support, plus a **Today/This-week toggle** (simple lens on dated cards, not a calendar UI).
- **Seed size (spec addendum):** 17 cards = 8 discovery + 4 events (incl. the Dandelion Wine Jul 2 tasting micro-event) + 1 subscription (Falu House Tinned Fish Club; a second only if easily sourced) + 4 G-train.
- **Never push or deploy without Batu.** Deploy task is gated.
- `npm run verify` must stay green after every task (145+ tests, conformance gate, visual baseline).
- Run `git status --short` before editing; commit per task with the repo's `feat:`/`docs:` style.
- Dev URL for this page: `http://127.0.0.1:5173/july.html`.

## File structure

```
july.html                                    # new Vite entry (repo root)
vite.config.js                               # modified: MPA rollup input
src/visualSystem/palette.js                  # modified: + MAP_PALETTE token group
src/visualSystem/mapPalette.test.mjs         # new: MAP_PALETTE token tests
src/demand-test/main.jsx                     # entry: mounts JulyApp
src/demand-test/JulyApp.jsx                  # page shell + state (filter, selection)
src/demand-test/MapView.jsx                  # MapLibre map + pins (thin)
src/demand-test/CardPanel.jsx                # filter chips, card list/detail, CTAs (thin)
src/demand-test/iiMapStyle.js                # pure: II-C MapLibre style JSON
src/demand-test/iiMapStyle.test.mjs
src/demand-test/cardSchema.js                # pure: GreenpointMapCard validation
src/demand-test/cardSchema.test.mjs
src/demand-test/filterCards.js               # pure: FILTERS, matchesFilter, pinKind
src/demand-test/filterCards.test.mjs
src/demand-test/julyCards.test.mjs           # seed-data validation (loads JSON via fs)
src/demand-test/july.css                     # page styles (conformance-exempt, token-mirrored)
src/data/demand-test/july-2026-cards.json    # the 15-card seed
src/data/demand-test/geocode-cache.json      # raw Nominatim responses (evidence)
scripts/geocode-demand-cards.mjs             # coordinate derivation script
```

---

### Task 1: Standalone entry scaffold (`july.html` + Vite MPA)

**Files:**
- Create: `july.html`
- Create: `src/demand-test/main.jsx`
- Create: `src/demand-test/JulyApp.jsx` (stub)
- Create: `src/demand-test/july.css` (stub)
- Modify: `vite.config.js`

**Interfaces:**
- Produces: `/july.html` route served by `npm run dev` and emitted by `npm run build`; `JulyApp` default-export React component that later tasks flesh out.

- [ ] **Step 1: Check working tree**

Run: `git status --short` — expect clean (report anything dirty, don't edit around it).

- [ ] **Step 2: Create `july.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>July in Greenpoint — G-Train Support</title>
    <meta
      name="description"
      content="New spots, what's on, and how to support Greenpoint businesses through the July G-train closures — mapped."
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/demand-test/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Add MPA input to `vite.config.js`**

Replace the whole file with:

```js
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import facadeSpecWriter from "./vite-plugin-facade-spec-writer.js";
import facadeOverrideWriter from "./vite-plugin-facade-override-writer.js";

export default defineConfig({
  plugins: [react(), facadeSpecWriter(), facadeOverrideWriter()],
  build: {
    rollupOptions: {
      input: {
        // 3D explorer (existing product)
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        // Track V demand test — standalone 2D map page, zero Three.js
        july: fileURLToPath(new URL("./july.html", import.meta.url)),
      },
    },
  },
});
```

- [ ] **Step 4: Create `src/demand-test/main.jsx`**

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import JulyApp from "./JulyApp.jsx";
import "./july.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JulyApp />
  </React.StrictMode>,
);
```

- [ ] **Step 5: Create stub `src/demand-test/JulyApp.jsx`**

```jsx
import React from "react";

// Track V — "July in Greenpoint + G-Train Support" page shell.
// Standalone 2D demand-test page; must never import the 3D runtime.
export default function JulyApp() {
  return (
    <div className="july-shell">
      <header className="july-header">
        <span className="july-kicker">Greenpoint Explorer</span>
        <h1>July in Greenpoint</h1>
      </header>
    </div>
  );
}
```

- [ ] **Step 6: Create stub `src/demand-test/july.css`**

```css
/* Track V demand-test page. CSS is conformance-exempt, but every color below
   mirrors a palette.js token (noted inline) — the II-C no-miss rule holds. */
:root {
  --paper: #eae1ce; /* II_PALETTE.paper */
  --ink: #2a241c; /* II_PALETTE.ink */
}

.july-shell {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
}
```

- [ ] **Step 7: Verify build emits both pages**

Run: `npm run build && ls dist/july.html dist/index.html`
Expected: both files listed, build exits 0.

- [ ] **Step 8: Verify no 3D module in the july graph**

Run: `npx vite build 2>/dev/null >/dev/null; grep -rl "three" dist/assets/ | xargs -I{} sh -c 'grep -l "{}" dist/july.html || true'`
Simpler deterministic check: `grep -o 'assets/[^"]*\.js' dist/july.html` then confirm the referenced chunk(s) do **not** contain `THREE.` — run `grep -L "THREE" $(grep -o 'assets/[^"]*\.js' dist/july.html | sed 's|^|dist/|')`
Expected: every july chunk listed (i.e., none contain THREE).

- [ ] **Step 9: Verify existing suite still green**

Run: `npm run test`
Expected: all existing tests PASS.

- [ ] **Step 10: Commit**

```bash
git add july.html vite.config.js src/demand-test/
git commit -m "feat(track-v): standalone july.html entry — 2D demand-test page scaffold, zero Three.js"
```

---

### Task 2: `MAP_PALETTE` tokens in palette.js

**Files:**
- Modify: `src/visualSystem/palette.js` (append before `DEBUG_PALETTE`)
- Test: `src/visualSystem/mapPalette.test.mjs`

**Interfaces:**
- Produces: `export const MAP_PALETTE = { land, water, park, roadMinor, roadMajor, roadCasing, building, buildingLine, label, labelHalo, gLine, pinInk, pinPaper }` — 24-bit ints, importable from Node and the browser.

- [ ] **Step 1: Write the failing test** — `src/visualSystem/mapPalette.test.mjs`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { II_PALETTE, MAP_PALETTE } from "./palette.js";

test("MAP_PALETTE exists with all required map tokens", () => {
  const required = [
    "land", "water", "park", "roadMinor", "roadMajor", "roadCasing",
    "building", "buildingLine", "label", "labelHalo", "gLine", "pinInk", "pinPaper",
  ];
  for (const key of required) {
    assert.equal(typeof MAP_PALETTE[key], "number", `missing token: ${key}`);
    assert.ok(MAP_PALETTE[key] >= 0 && MAP_PALETTE[key] <= 0xffffff, `${key} not 24-bit`);
  }
});

test("map tokens reuse II-C anchors (no new hues)", () => {
  assert.equal(MAP_PALETTE.land, II_PALETTE.paper);
  assert.equal(MAP_PALETTE.roadMinor, II_PALETTE.crosswalkPaint);
  assert.equal(MAP_PALETTE.roadMajor, II_PALETTE.street);
  assert.equal(MAP_PALETTE.roadCasing, II_PALETTE.scoreLine);
  assert.equal(MAP_PALETTE.building, II_PALETTE.context[0]);
  assert.equal(MAP_PALETTE.label, II_PALETTE.ink);
  assert.equal(MAP_PALETTE.gLine, II_PALETTE.signalGreen);
  assert.equal(MAP_PALETTE.pinInk, II_PALETTE.ink);
});

test("water and park are paper-lifted (lighter than their anchors)", () => {
  const lum = (h) => (((h >> 16) & 255) + ((h >> 8) & 255) + (h & 255)) / 3;
  assert.ok(lum(MAP_PALETTE.water) > lum(0x52647a), "water lifted toward paper");
  assert.ok(lum(MAP_PALETTE.park) > lum(II_PALETTE.signalGreen), "park lifted toward paper");
  assert.ok(lum(MAP_PALETTE.water) < lum(II_PALETTE.paper), "water still reads against land");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/visualSystem/mapPalette.test.mjs`
Expected: FAIL — `MAP_PALETTE` is not exported.

- [ ] **Step 3: Implement** — append to `src/visualSystem/palette.js` just above the `DEBUG_PALETTE` block:

```js
// Track V — 2D demand-test real-map tokens ("July in Greenpoint" page).
// II-C identity off the 3D runtime. Every tone is an existing II-C token, or an
// existing anchor lifted toward paper with the same _mix discipline as the wall
// ramps — no new hues. 0x52647a is the clapboard slate-blue anchor (East River
// water reads as a muted paper-washed slate, never a bright map blue).
export const MAP_PALETTE = {
  land: II_PALETTE.paper,
  water: _mix(0x52647a, TONE_PAPER, 0.38),
  park: _mix(II_PALETTE.signalGreen, TONE_PAPER, 0.62),
  roadMinor: II_PALETTE.crosswalkPaint,
  roadMajor: II_PALETTE.street,
  roadCasing: II_PALETTE.scoreLine,
  building: II_PALETTE.context[0],
  buildingLine: II_PALETTE.scoreLine,
  label: II_PALETTE.ink,
  labelHalo: II_PALETTE.paper,
  gLine: II_PALETTE.signalGreen,
  pinInk: II_PALETTE.ink,
  pinPaper: TONE_PAPER,
};
```

(`_mix` and `TONE_PAPER` are already defined mid-file; the append point is after them, so no reordering needed.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/visualSystem/mapPalette.test.mjs` → PASS.
Then: `npm run verify:conformance` → still green (palette.js is the token source; new literals there are legal).

- [ ] **Step 5: Commit**

```bash
git add src/visualSystem/palette.js src/visualSystem/mapPalette.test.mjs
git commit -m "feat(track-v): MAP_PALETTE — II-C map tokens derived from existing anchors"
```

---

### Task 3: II-C MapLibre style (`iiMapStyle.js`)

**Files:**
- Create: `src/demand-test/iiMapStyle.js`
- Test: `src/demand-test/iiMapStyle.test.mjs`

**Interfaces:**
- Produces: `cssHex(token: number): string` (e.g. `0x2a241c → "#2a241c"`), `buildIIMapStyle(): StyleSpecification`, `GREENPOINT_CENTER: [lng, lat]`, `GREENPOINT_MAX_BOUNDS: [[w,s],[e,n]]`. Consumed by `MapView.jsx` (Task 7).

- [ ] **Step 1: Write the failing test** — `src/demand-test/iiMapStyle.test.mjs`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { MAP_PALETTE } from "../visualSystem/palette.js";
import { cssHex, buildIIMapStyle, GREENPOINT_CENTER } from "./iiMapStyle.js";

test("cssHex formats 24-bit tokens as #rrggbb", () => {
  assert.equal(cssHex(0x2a241c), "#2a241c");
  assert.equal(cssHex(0x000f0f), "#000f0f");
});

test("style has the required skeleton", () => {
  const style = buildIIMapStyle();
  assert.equal(style.version, 8);
  assert.ok(style.glyphs.includes("openfreemap.org/fonts"));
  assert.equal(style.sources.openfreemap.type, "vector");
  const ids = style.layers.map((l) => l.id);
  for (const id of ["background", "water", "park", "road-casing", "road", "building", "road-label", "place-label"]) {
    assert.ok(ids.includes(id), `missing layer: ${id}`);
  }
});

test("every style color resolves from MAP_PALETTE (no-miss)", () => {
  const allowed = new Set(Object.values(MAP_PALETTE).map(cssHex));
  const style = buildIIMapStyle();
  const colors = [];
  const walk = (v, path) => {
    if (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)) colors.push([path, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
  };
  walk(style, "style");
  assert.ok(colors.length >= 8, "style should declare colors");
  for (const [path, hex] of colors) {
    assert.ok(allowed.has(hex.toLowerCase()), `out-of-palette color ${hex} at ${path}`);
  }
});

test("center is inside Greenpoint", () => {
  const [lng, lat] = GREENPOINT_CENTER;
  assert.ok(lat > 40.71 && lat < 40.745 && lng > -73.98 && lng < -73.93);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/demand-test/iiMapStyle.test.mjs` → FAIL (module not found).

- [ ] **Step 3: Implement `src/demand-test/iiMapStyle.js`**

```js
// Track V — II-C MapLibre style. Pure module (Node-importable, no maplibre
// import): builds the style JSON from MAP_PALETTE tokens so the 2D real map
// carries the inked identity. Tiles: OpenFreeMap (OpenMapTiles schema, no key).
import { MAP_PALETTE } from "../visualSystem/palette.js";

export const cssHex = (token) => `#${token.toString(16).padStart(6, "0")}`;

export const GREENPOINT_CENTER = [-73.9538, 40.7295];
// Hard pan limit: Greenpoint + a comfortable margin (never lets the tester get lost).
export const GREENPOINT_MAX_BOUNDS = [
  [-74.005, 40.705],
  [-73.905, 40.755],
];

const c = Object.fromEntries(
  Object.entries(MAP_PALETTE).map(([k, v]) => [k, cssHex(v)]),
);

export function buildIIMapStyle() {
  return {
    version: 8,
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    sources: {
      openfreemap: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": c.land } },
      {
        id: "park",
        type: "fill",
        source: "openfreemap",
        "source-layer": "landcover",
        filter: ["in", ["get", "class"], ["literal", ["grass", "wood", "park", "recreation_ground"]]],
        paint: { "fill-color": c.park },
      },
      {
        id: "landuse-park",
        type: "fill",
        source: "openfreemap",
        "source-layer": "landuse",
        filter: ["in", ["get", "class"], ["literal", ["park", "cemetery", "pitch", "playground", "stadium"]]],
        paint: { "fill-color": c.park },
      },
      {
        id: "water",
        type: "fill",
        source: "openfreemap",
        "source-layer": "water",
        paint: { "fill-color": c.water },
      },
      {
        id: "road-casing",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"]]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.roadCasing,
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            12, 1.2,
            15, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 9, ["secondary", "tertiary"], 7, 4.5],
            17, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 22, ["secondary", "tertiary"], 17, 11],
          ],
        },
      },
      {
        id: "road",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"]]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary"], c.roadMajor, c.roadMinor],
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            12, 0.8,
            15, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 7, ["secondary", "tertiary"], 5.4, 3.2],
            17, ["match", ["get", "class"], ["motorway", "trunk", "primary"], 18, ["secondary", "tertiary"], 14, 8.5],
          ],
        },
      },
      {
        id: "building",
        type: "fill",
        source: "openfreemap",
        "source-layer": "building",
        minzoom: 13.5,
        paint: {
          "fill-color": c.building,
          "fill-outline-color": c.buildingLine,
          "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13.5, 0, 14.2, 1],
        },
      },
      {
        id: "road-label",
        type: "symbol",
        source: "openfreemap",
        "source-layer": "transportation_name",
        layout: {
          "symbol-placement": "line",
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 17, 14],
          "text-letter-spacing": 0.08,
          "text-transform": "uppercase",
        },
        paint: {
          "text-color": c.label,
          "text-halo-color": c.labelHalo,
          "text-halo-width": 1.4,
        },
      },
      {
        id: "place-label",
        type: "symbol",
        source: "openfreemap",
        "source-layer": "place",
        filter: ["in", ["get", "class"], ["literal", ["suburb", "neighbourhood", "quarter"]]],
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 13,
          "text-letter-spacing": 0.22,
          "text-transform": "uppercase",
        },
        paint: {
          "text-color": c.label,
          "text-halo-color": c.labelHalo,
          "text-halo-width": 1.6,
        },
      },
    ],
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/demand-test/iiMapStyle.test.mjs` → PASS.
Run: `npm run verify:conformance` → green (module contains no color literals — only token references).

- [ ] **Step 5: Commit**

```bash
git add src/demand-test/iiMapStyle.js src/demand-test/iiMapStyle.test.mjs
git commit -m "feat(track-v): II-C MapLibre style from MAP_PALETTE tokens (OpenFreeMap tiles)"
```

---

### Task 4: Card schema validation (`cardSchema.js`)

**Files:**
- Create: `src/demand-test/cardSchema.js`
- Test: `src/demand-test/cardSchema.test.mjs`

**Interfaces:**
- Produces: `CATEGORIES`, `AUDIENCES`, `ACTION_TYPES`, `EVIDENCE_LEVELS`, `FILTER_IDS`, `GREENPOINT_BBOX = {latMin,latMax,lngMin,lngMax}`, `inGreenpoint({lat,lng}): boolean`, `validateCard(card): {ok, errors: string[]}`. Consumed by `julyCards.test.mjs` (Task 5) and the geocode script.

- [ ] **Step 1: Write the failing test** — `src/demand-test/cardSchema.test.mjs`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { validateCard, inGreenpoint, FILTER_IDS } from "./cardSchema.js";

const good = {
  id: "test-card",
  title: "Test Card",
  category: "new_business",
  filters: ["new", "food_drink"],
  sourceCampaign: "shop_small_greenpoint_july_2026",
  locationName: "Test Spot",
  address: "1 Test St",
  lat: 40.7295,
  lng: -73.9538,
  corridor: "manhattan-ave",
  summary: "A test.",
  audience: ["resident"],
  actions: [{ label: "Visit", type: "visit" }],
  sourceLinks: [{ title: "SSG July 2026", publisher: "Shop Small Greenpoint", date: "2026-07-01" }],
  evidenceStrength: "medium_high",
  monetizationRelevance: "direct",
  partnerRelevance: "high",
  createdAt: "2026-07-02",
  updatedAt: "2026-07-02",
};

test("a complete card validates", () => {
  const r = validateCard(good);
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});

test("rejects unknown category, filter, action type, audience", () => {
  assert.equal(validateCard({ ...good, category: "nope" }).ok, false);
  assert.equal(validateCard({ ...good, filters: ["nope"] }).ok, false);
  assert.equal(validateCard({ ...good, actions: [{ label: "x", type: "nope" }] }).ok, false);
  assert.equal(validateCard({ ...good, audience: ["nope"] }).ok, false);
});

test("rejects coordinates outside Greenpoint", () => {
  assert.equal(validateCard({ ...good, lat: 40.5, lng: -73.9538 }).ok, false);
  assert.ok(inGreenpoint({ lat: 40.7295, lng: -73.9538 }));
  assert.ok(!inGreenpoint({ lat: 40.7295, lng: -73.8 }));
});

test("a card with no coords but geocoded venues validates", () => {
  const cluster = {
    ...good,
    id: "cluster",
    category: "event",
    filters: ["events"],
    lat: null,
    lng: null,
    address: null,
    venues: [{ name: "Bar A", address: "2 Test St", lat: 40.731, lng: -73.955 }],
  };
  assert.equal(validateCard(cluster).ok, true);
});

test("rejects a card with neither coords nor venues", () => {
  assert.equal(validateCard({ ...good, lat: null, lng: null, venues: [] }).ok, false);
});

test("requires at least one action and a source link", () => {
  assert.equal(validateCard({ ...good, actions: [] }).ok, false);
  assert.equal(validateCard({ ...good, sourceLinks: [] }).ok, false);
});

test("FILTER_IDS matches the spec's filter bar (incl. Clubs & Signups)", () => {
  assert.deepEqual(FILTER_IDS, [
    "new", "food_drink", "shopping", "services",
    "arts_culture", "family_kids", "events", "clubs_signups", "g_train",
  ]);
});

test("dated cards: valid ISO window accepted, malformed or inverted rejected", () => {
  const dated = { ...good, startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  assert.equal(validateCard(dated).ok, true);
  assert.equal(validateCard({ ...good, startsAt: "not-a-date" }).ok, false);
  assert.equal(
    validateCard({ ...good, startsAt: "2026-07-10T00:00:00-04:00", endsAt: "2026-07-02T00:00:00-04:00" }).ok,
    false,
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/demand-test/cardSchema.test.mjs` → FAIL (module not found).

- [ ] **Step 3: Implement `src/demand-test/cardSchema.js`**

```js
// Track V — GreenpointMapCard validation. Disposable v1 shape (per the 2026-07-02
// spec) with canonical discipline: enums locked, coordinates must be derived and
// inside Greenpoint, every card carries an attributed source. Two v1 view
// extensions over the seed-doc type: `filters` (authored filter-bar membership)
// and `venues` (multi-venue event cluster, e.g. the World Cup bars).
export const CATEGORIES = [
  "new_business", "food_drink", "shopping", "service", "event",
  "arts_culture", "family_kids", "job", "shopkeeper_profile",
  "g_train_support", "civic_action", "discount", "support_local",
  "subscription", // hidden-engagement addendum: memberships/clubs (Falu House pattern)
];

export const AUDIENCES = [
  "resident", "business", "visitor", "creator", "family", "job_seeker", "civic_actor",
];

export const ACTION_TYPES = [
  "visit", "learn_more", "rsvp", "buy_gift_card", "order", "apply",
  "signup", "file_complaint", "share", "submit_update",
  "join", // hidden-engagement addendum: one-tap membership/club signup
];

export const EVIDENCE_LEVELS = ["high", "medium_high", "medium", "low"];

// Filter-bar ids, in display order (spec + addendum: New · Food & Drink ·
// Shopping · Services · Arts/Culture · Family/Kids · Events · Clubs & Signups ·
// G-Train Support). The Today lens is a separate toggle, not a filter id.
export const FILTER_IDS = [
  "new", "food_drink", "shopping", "services",
  "arts_culture", "family_kids", "events", "clubs_signups", "g_train",
];

// Generous Greenpoint envelope (Newtown Creek → McCarren, East River → BQE).
export const GREENPOINT_BBOX = {
  latMin: 40.712, latMax: 40.744,
  lngMin: -73.975, lngMax: -73.93,
};

export const inGreenpoint = ({ lat, lng }) =>
  typeof lat === "number" && typeof lng === "number" &&
  lat >= GREENPOINT_BBOX.latMin && lat <= GREENPOINT_BBOX.latMax &&
  lng >= GREENPOINT_BBOX.lngMin && lng <= GREENPOINT_BBOX.lngMax;

const str = (v) => typeof v === "string" && v.trim().length > 0;

export function validateCard(card) {
  const errors = [];
  const err = (m) => errors.push(`${card?.id ?? "?"}: ${m}`);

  if (!str(card.id)) err("missing id");
  if (!str(card.title)) err("missing title");
  if (!str(card.locationName)) err("missing locationName");
  if (!str(card.summary)) err("missing summary");
  if (!CATEGORIES.includes(card.category)) err(`unknown category "${card.category}"`);

  if (!Array.isArray(card.filters) || card.filters.length === 0) err("missing filters");
  else for (const f of card.filters) if (!FILTER_IDS.includes(f)) err(`unknown filter "${f}"`);

  if (!Array.isArray(card.audience) || card.audience.length === 0) err("missing audience");
  else for (const a of card.audience) if (!AUDIENCES.includes(a)) err(`unknown audience "${a}"`);

  if (!Array.isArray(card.actions) || card.actions.length === 0) err("needs at least one action");
  else for (const a of card.actions) {
    if (!str(a.label)) err("action missing label");
    if (!ACTION_TYPES.includes(a.type)) err(`unknown action type "${a.type}"`);
  }

  if (!Array.isArray(card.sourceLinks) || card.sourceLinks.length === 0) {
    err("needs an attributed source (truth rule)");
  } else for (const s of card.sourceLinks) if (!str(s.title)) err("sourceLink missing title");

  // Hidden-engagement addendum: optional event window for the Today lens.
  for (const key of ["startsAt", "endsAt"]) {
    if (card[key] != null && Number.isNaN(Date.parse(card[key]))) err(`${key} is not ISO datetime`);
  }
  if (card.startsAt && card.endsAt && Date.parse(card.startsAt) > Date.parse(card.endsAt)) {
    err("startsAt after endsAt");
  }

  if (!EVIDENCE_LEVELS.includes(card.evidenceStrength)) err("bad evidenceStrength");
  if (!["direct", "indirect", "none"].includes(card.monetizationRelevance)) err("bad monetizationRelevance");
  if (!["high", "medium", "low"].includes(card.partnerRelevance)) err("bad partnerRelevance");
  if (!str(card.createdAt) || !str(card.updatedAt)) err("missing created/updated dates");

  const venues = Array.isArray(card.venues) ? card.venues : [];
  const hasCoords = card.lat != null || card.lng != null;
  if (hasCoords && !inGreenpoint(card)) err(`coords outside Greenpoint (${card.lat}, ${card.lng})`);
  for (const v of venues) {
    if (!str(v.name)) err("venue missing name");
    if (v.lat != null && !inGreenpoint(v)) err(`venue "${v.name}" outside Greenpoint`);
  }
  if (!hasCoords && venues.length === 0) err("needs coords or venues to appear on the map");

  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/demand-test/cardSchema.test.mjs` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/demand-test/cardSchema.js src/demand-test/cardSchema.test.mjs
git commit -m "feat(track-v): GreenpointMapCard schema validation (enums, bbox, source attribution)"
```

---

### Task 5: Seed data + geocode derivation

**Files:**
- Create: `src/data/demand-test/july-2026-cards.json` (15 cards, coords `null`)
- Create: `scripts/geocode-demand-cards.mjs`
- Create: `src/data/demand-test/geocode-cache.json` (written by the script)
- Test: `src/demand-test/julyCards.test.mjs`

**Interfaces:**
- Produces: the seed JSON `{ version, sourceCampaign, cards: GreenpointMapCard[] }` consumed by `JulyApp.jsx`; every card ends geocoded (or its venues do, with card coords = venue centroid).
- Consumes: `validateCard`, `inGreenpoint`, `GREENPOINT_BBOX` from Task 4.

- [ ] **Step 1: Write the failing test** — `src/demand-test/julyCards.test.mjs`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateCard, inGreenpoint } from "./cardSchema.js";

const seed = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/demand-test/july-2026-cards.json", import.meta.url)), "utf8"),
);

test("seed has exactly 17 cards across the four layers", () => {
  assert.equal(seed.cards.length, 17);
  const count = (pred) => seed.cards.filter(pred).length;
  assert.equal(count((c) => c.filters.includes("new")), 8, "8 discovery cards");
  assert.equal(count((c) => c.category === "event"), 4, "4 event cards (incl. Dandelion Wine micro-event)");
  assert.equal(count((c) => c.category === "subscription"), 1, "1 subscription card (Falu House)");
  assert.equal(count((c) => ["g_train_support", "civic_action", "support_local"].includes(c.category)), 4, "4 G-train layer cards");
});

test("the hidden-engagement addendum cards carry their contract", () => {
  const tasting = seed.cards.find((c) => c.id === "dandelion-wine-tasting");
  assert.ok(tasting, "Dandelion Wine micro-event exists");
  assert.ok(tasting.startsAt && tasting.endsAt, "tasting has a Today-lens window");
  const club = seed.cards.find((c) => c.id === "falu-tinned-fish-club");
  assert.ok(club, "Falu House Tinned Fish Club exists");
  assert.ok(club.filters.includes("clubs_signups"));
  assert.ok(club.actions.some((a) => a.type === "join"), "club has a one-tap join action");
});

test("every card validates", () => {
  for (const card of seed.cards) {
    const r = validateCard(card);
    assert.deepEqual(r.errors, [], `card ${card.id}`);
  }
});

test("every card is geocoded inside Greenpoint (run scripts/geocode-demand-cards.mjs)", () => {
  for (const card of seed.cards) {
    assert.ok(inGreenpoint(card), `${card.id} has no derived coords`);
  }
});

test("world-cup cluster carries geocoded venues", () => {
  const wc = seed.cards.find((c) => c.id === "world-cup-watch");
  assert.ok(wc, "world-cup-watch card exists");
  assert.ok(wc.venues.length >= 6, "at least 6 of the 10 bars resolved");
  for (const v of wc.venues) assert.ok(inGreenpoint(v), `venue ${v.name}`);
});

test("ids are unique", () => {
  assert.equal(new Set(seed.cards.map((c) => c.id)).size, seed.cards.length);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/demand-test/julyCards.test.mjs` → FAIL (seed file missing).

- [ ] **Step 3: Author the seed** — `src/data/demand-test/july-2026-cards.json`

All content transcribed from `docs/context/2026-07-02-ssg-july-seed.md`; all `lat`/`lng` start `null` (the geocode script derives them — truth rule). Full file:

```json
{
  "version": "2026-07-02",
  "sourceCampaign": "shop_small_greenpoint_july_2026",
  "cards": [
    {
      "id": "sailor-and-siren",
      "title": "Sailor + Siren",
      "category": "new_business",
      "filters": ["new", "food_drink", "g_train"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Sailor + Siren",
      "address": "817 Manhattan Ave, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "New seafood bar bringing lobster rolls to Manhattan Ave. Grand opening July 3–5.",
      "whyItMatters": "Opening straight into a G-shutdown month — early local support decides whether a debut like this sticks.",
      "audience": ["resident", "visitor"],
      "actions": [
        { "label": "Stop by opening weekend (Jul 3–5)", "type": "visit" },
        { "label": "Buy a gift card for closure weekends", "type": "buy_gift_card" }
      ],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "core-press",
      "title": "Core Press",
      "category": "service",
      "filters": ["new", "services"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Core Press",
      "address": "211 Franklin St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "franklin-st",
      "summary": "Reformer Pilates studio with a juice bar, new on Franklin St.",
      "audience": ["resident"],
      "actions": [
        { "label": "Check it out", "type": "visit" },
        { "label": "Book a first class", "type": "rsvp" }
      ],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "poochs-parlor",
      "title": "Pooch's Parlor",
      "category": "service",
      "filters": ["new", "services"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Pooch's Parlor",
      "address": "128 India St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "india-st",
      "summary": "Appointment-only pet grooming with a big brand personality, new on India St.",
      "audience": ["resident"],
      "actions": [{ "label": "Book an appointment", "type": "rsvp" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "giggles-and-wiggles",
      "title": "Giggles & Wiggles",
      "category": "shopping",
      "filters": ["new", "shopping", "family_kids"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Giggles & Wiggles",
      "address": "42 West St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "west-st",
      "summary": "Children's shoes and toys in the West St building — entrance on Noble St.",
      "audience": ["resident", "family"],
      "actions": [{ "label": "Visit (entrance on Noble)", "type": "visit" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "medium",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "cookies-n-cream",
      "title": "Cookies N' Cream",
      "category": "food_drink",
      "filters": ["new", "food_drink", "family_kids"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Cookies N' Cream",
      "address": "963 Manhattan Ave, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "Late-night cookies, milkshakes, and sundaes at the north end of Manhattan Ave.",
      "audience": ["resident", "family", "visitor"],
      "actions": [{ "label": "Late-night sweets run", "type": "visit" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "medium",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "sotteatery",
      "title": "Sotteatery",
      "category": "food_drink",
      "filters": ["new", "food_drink", "g_train"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Sotteatery",
      "address": "685 Manhattan Ave, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "Plant-based Dominican-Caribbean seafood — dine-in, takeout, delivery, and catering.",
      "whyItMatters": "Delivery and takeout keep a new kitchen earning even on shutdown weekends.",
      "audience": ["resident", "visitor"],
      "actions": [
        { "label": "Dine in", "type": "visit" },
        { "label": "Order pickup or delivery", "type": "order" }
      ],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "socceria",
      "title": "Socceria",
      "category": "food_drink",
      "filters": ["new", "food_drink", "events"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Socceria",
      "address": "46 Norman Ave, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "norman-ave",
      "summary": "Soccer sports cantina on Norman Ave — a World Cup home base through Jul 19.",
      "audience": ["resident", "visitor"],
      "actions": [{ "label": "Catch a match", "type": "visit" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "medium",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "dreams-on-command",
      "title": "Dreams on Command",
      "category": "arts_culture",
      "filters": ["new", "arts_culture"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Dreams on Command",
      "address": "42 West St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "west-st",
      "summary": "Contemporary art gallery (Suite 105) with a social and political focus.",
      "audience": ["resident", "visitor", "creator"],
      "actions": [{ "label": "See the current show", "type": "visit" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "indirect",
      "partnerRelevance": "medium",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "world-cup-watch",
      "title": "Watch the World Cup",
      "category": "event",
      "filters": ["events", "food_drink"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "10 bars across Greenpoint",
      "address": null,
      "lat": null,
      "lng": null,
      "corridor": "greenpoint",
      "summary": "Through Jul 19 — the neighborhood's watch cluster: Broken Land, Panzón, Rounders, Greenpoint Palace, Threes Brewing, Box House Hotel, Zum Schneider, Socceria, Warsaw, and Good Bar.",
      "whyItMatters": "One event, ten doors — the map shows the whole cluster at a glance; a list can't.",
      "audience": ["resident", "visitor"],
      "actions": [{ "label": "Pick a bar near you", "type": "visit" }],
      "venues": [
        { "name": "Broken Land", "address": "105 Franklin St, Brooklyn, NY 11222", "lat": null, "lng": null },
        { "name": "Panzón", "address": null, "lat": null, "lng": null },
        { "name": "Rounders", "address": null, "lat": null, "lng": null },
        { "name": "Greenpoint Palace", "address": null, "lat": null, "lng": null },
        { "name": "Threes Brewing Greenpoint", "address": "113 Franklin St, Brooklyn, NY 11222", "lat": null, "lng": null },
        { "name": "Box House Hotel", "address": "77 Box St, Brooklyn, NY 11222", "lat": null, "lng": null },
        { "name": "Zum Schneider", "address": null, "lat": null, "lng": null },
        { "name": "Socceria", "address": "46 Norman Ave, Brooklyn, NY 11222", "lat": null, "lng": null },
        { "name": "Warsaw", "address": "261 Driggs Ave, Brooklyn, NY 11222", "lat": null, "lng": null },
        { "name": "Good Bar", "address": null, "lat": null, "lng": null }
      ],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "indirect",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "yoseka-sticker-buffet",
      "title": "Sticker Buffet at Yoseka Land",
      "category": "event",
      "filters": ["events", "shopping", "family_kids"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Yoseka Land",
      "address": null,
      "geocodeQuery": "Yoseka Stationery, Greenpoint, Brooklyn, NY",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "Jul 4–12 — Yoseka's sticker buffet retail event.",
      "audience": ["resident", "family", "creator"],
      "actions": [{ "label": "Go sticker hunting (Jul 4–12)", "type": "visit" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "indirect",
      "partnerRelevance": "medium",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "threes-summer-guest-series",
      "title": "Summer Guest Series at Threes Brewing",
      "category": "event",
      "filters": ["events", "food_drink"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Threes Brewing Greenpoint",
      "address": "113 Franklin St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "franklin-st",
      "summary": "From Jul 6 — guest takeovers: Dante + NYC Cocktail Co (Jul 6), The Irish Exit Pub (Jul 13), Nom Wah (Jul 20).",
      "audience": ["resident", "visitor"],
      "actions": [{ "label": "Catch a takeover night", "type": "visit" }],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "indirect",
      "partnerRelevance": "medium",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "g-closure-greenpoint-av",
      "title": "Greenpoint Av — G closed Jul 10–13 + overnights",
      "category": "g_train_support",
      "filters": ["g_train"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Greenpoint Av station",
      "address": null,
      "geocodeQuery": "Greenpoint Avenue Station, Brooklyn, NY",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "No G trains Fri Jul 10 9:45 PM → Mon Jul 13 5 AM, then overnight closures (9:45 PM–5 AM) Mon Jul 13–Fri Jul 17. Court Sq ↔ Bedford–Nostrand segment. Free T403 shuttle bus runs the route.",
      "whyItMatters": "Weekend foot traffic is what carries the Manhattan Ave corridor — when the G stops, the shops feel it immediately.",
      "audience": ["resident", "visitor", "business"],
      "actions": [
        { "label": "MTA service alerts", "type": "learn_more", "url": "https://new.mta.info/alerts" },
        { "label": "Share the closure dates", "type": "share" }
      ],
      "sourceLinks": [
        { "title": "MTA G-line 2026 service changes", "publisher": "MTA" },
        { "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }
      ],
      "evidenceStrength": "high",
      "monetizationRelevance": "none",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "g-closure-nassau-av",
      "title": "Nassau Av — G closed Jul 10–13 + overnights",
      "category": "g_train_support",
      "filters": ["g_train"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Nassau Av station",
      "address": null,
      "geocodeQuery": "Nassau Avenue Station, Brooklyn, NY",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "Same closure window as Greenpoint Av: full weekend Jul 10–13, overnights Jul 13–17. Free T403 shuttle replaces service.",
      "audience": ["resident", "visitor", "business"],
      "actions": [
        { "label": "MTA service alerts", "type": "learn_more", "url": "https://new.mta.info/alerts" },
        { "label": "Share the closure dates", "type": "share" }
      ],
      "sourceLinks": [
        { "title": "MTA G-line 2026 service changes", "publisher": "MTA" },
        { "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }
      ],
      "evidenceStrength": "high",
      "monetizationRelevance": "none",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "adopt-a-business",
      "title": "Adopt a business for shutdown weekends",
      "category": "support_local",
      "filters": ["g_train"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Manhattan Ave corridor",
      "address": null,
      "geocodeQuery": "Manhattan Avenue and Meserole Avenue, Brooklyn, NY",
      "lat": null,
      "lng": null,
      "corridor": "manhattan-ave",
      "summary": "SSG's ask for closure weekends: commit to spending locally, post about your visits, and encourage friends to \"adopt\" a favorite shop. Can't make it? Order pickup/delivery or buy a gift card — immediate cash flow is what carries small shops through.",
      "audience": ["resident", "business"],
      "actions": [
        { "label": "Pick a shop to adopt this weekend", "type": "visit" },
        { "label": "Post about your visit", "type": "share" }
      ],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "indirect",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "g-advocacy-mta",
      "title": "Weigh in on how the G closures are run",
      "category": "civic_action",
      "filters": ["g_train"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Shop Small Greenpoint",
      "address": "141 India St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "india-st",
      "summary": "What SSG is asking the MTA for: non-consecutive weekend closures, overnight-only work where possible, better shuttle frequency, clearer signage, and recognition of the retail-corridor impact. You can file a complaint or write to the electeds who represent Greenpoint (Restler, Gallagher, González).",
      "whyItMatters": "Closures are recurring (more weekends reported for Aug–Dec) — how they're scheduled is still an open question.",
      "audience": ["resident", "business", "civic_actor"],
      "actions": [
        { "label": "File an MTA complaint", "type": "file_complaint", "url": "https://contact.mta.info/s/customer-feedback" },
        { "label": "Find your representatives", "type": "learn_more", "url": "https://www.mygovnyc.org" }
      ],
      "sourceLinks": [{ "title": "Shop Small Greenpoint — July 2026 newsletter", "publisher": "Shop Small Greenpoint", "date": "2026-07-01" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "none",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    }
  ]
}
```

**Plus two addendum cards** (append to the `cards` array; these bring the total to 17 — 8 discovery + 4 events + 1 subscription + 4 G-train):

```json
    {
      "id": "dandelion-wine-tasting",
      "title": "Tasting tonight: The New American Sparkling Wine",
      "category": "event",
      "filters": ["events", "food_drink"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Dandelion Wine",
      "address": "153 Franklin St, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "franklin-st",
      "summary": "Free in-store tasting, Thu Jul 2, 6–8 PM — the founder pours new American sparkling wines, with Mongers Palate cheese, She Wolf bread, vinyl on the turntable, and scratch-offs.",
      "whyItMatters": "Announced only to Dandelion's email list — the kind of same-day, around-the-corner event no listing site surfaces.",
      "audience": ["resident"],
      "startsAt": "2026-07-02T18:00:00-04:00",
      "endsAt": "2026-07-02T20:00:00-04:00",
      "actions": [{ "label": "Drop in tonight, 6–8 PM", "type": "visit" }],
      "sourceLinks": [{ "title": "Dandelion Wine email newsletter", "publisher": "Dandelion Wine", "date": "2026-07-02" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    },
    {
      "id": "falu-tinned-fish-club",
      "title": "Falu House Tinned Fish Club",
      "category": "subscription",
      "filters": ["clubs_signups", "food_drink"],
      "sourceCampaign": "shop_small_greenpoint_july_2026",
      "locationName": "Falu House",
      "address": "34 Norman Ave, Brooklyn, NY 11222",
      "lat": null,
      "lng": null,
      "corridor": "norman-ave",
      "summary": "A curated monthly tinned-fish membership box from the Norman Ave shop — a standing relationship with the store, not a one-time visit.",
      "whyItMatters": "It lives only on Falu's website and Instagram — invisible unless you already follow them.",
      "audience": ["resident"],
      "actions": [
        { "label": "Join the Tinned Fish Club", "type": "join" },
        { "label": "Visit the shop", "type": "visit" }
      ],
      "sourceLinks": [{ "title": "Falu House website / Instagram", "publisher": "Falu House" }],
      "evidenceStrength": "medium_high",
      "monetizationRelevance": "direct",
      "partnerRelevance": "high",
      "createdAt": "2026-07-02",
      "updatedAt": "2026-07-02"
    }
```

During execution, WebSearch for the Falu House Tinned Fish Club signup URL and set it on the `join` action (`"url": "…"`); if it can't be confirmed, leave the action URL-less and flag it in the Batu report — never invent a link. Also add Today-lens windows to the three SSG events while here: `world-cup-watch` gets `"endsAt": "2026-07-19T23:59:00-04:00"`; `yoseka-sticker-buffet` gets `"startsAt": "2026-07-04T00:00:00-04:00", "endsAt": "2026-07-12T23:59:00-04:00"`; `threes-summer-guest-series` gets `"startsAt": "2026-07-06T00:00:00-04:00", "endsAt": "2026-07-20T23:59:00-04:00"` (last listed takeover).

**Count check:** sailor-and-siren, core-press, poochs-parlor, giggles-and-wiggles, cookies-n-cream, sotteatery, socceria, dreams-on-command (8 discovery) + world-cup-watch, yoseka-sticker-buffet, threes-summer-guest-series, dandelion-wine-tasting (4 events) + falu-tinned-fish-club (1 subscription) + g-closure-greenpoint-av, g-closure-nassau-av, adopt-a-business, g-advocacy-mta (4 G-train) = **17 total**.

- [ ] **Step 4: Write `scripts/geocode-demand-cards.mjs`**

```js
#!/usr/bin/env node
// Track V — derive card coordinates from Nominatim (truth rule: coordinates
// are derived from a source, never invented). Fills lat/lng on the seed JSON
// in place; caches raw responses to geocode-cache.json as evidence.
//
// Usage: node scripts/geocode-demand-cards.mjs [--force]
//   --force  re-query entries that already have coords
//
// Respects the Nominatim usage policy: 1 req/s, identifying User-Agent,
// one-shot batch (~25 queries). Results outside the Greenpoint bbox are
// treated as misses (Nominatim sometimes lands in the wrong borough).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARDS_PATH = join(ROOT, "src/data/demand-test/july-2026-cards.json");
const CACHE_PATH = join(ROOT, "src/data/demand-test/geocode-cache.json");
const UA = "greenpoint-explorer-track-v/0.1 (contact: bsayici@gmail.com)";
const FORCE = process.argv.includes("--force");

// Keep in sync with cardSchema.GREENPOINT_BBOX (script must stay runnable
// standalone, so the bbox is duplicated here deliberately).
const BBOX = { latMin: 40.712, latMax: 40.744, lngMin: -73.975, lngMax: -73.93 };
const inBbox = (lat, lng) =>
  lat >= BBOX.latMin && lat <= BBOX.latMax && lng >= BBOX.lngMin && lng <= BBOX.lngMax;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, "utf8")) : {};

async function geocode(query) {
  if (cache[query] && !FORCE) return cache[query];
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1" +
    "&viewbox=-73.975,40.744,-73.93,40.712&bounded=1" +
    `&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`nominatim ${res.status} for "${query}"`);
  const hits = await res.json();
  cache[query] = { query, fetchedAt: new Date().toISOString(), hit: hits[0] ?? null };
  await sleep(1100);
  return cache[query];
}

const queryFor = (entry) =>
  entry.geocodeQuery ?? entry.address ?? `${entry.name ?? entry.locationName}, Greenpoint, Brooklyn, NY`;

async function fill(entry, label) {
  if (entry.lat != null && !FORCE) return true;
  const { hit } = await geocode(queryFor(entry));
  if (hit && inBbox(+hit.lat, +hit.lon)) {
    entry.lat = Math.round(+hit.lat * 1e6) / 1e6;
    entry.lng = Math.round(+hit.lon * 1e6) / 1e6;
    console.log(`  ok   ${label} → ${entry.lat}, ${entry.lng}`);
    return true;
  }
  console.warn(`  MISS ${label} (query: "${queryFor(entry)}")`);
  return false;
}

const seed = JSON.parse(readFileSync(CARDS_PATH, "utf8"));
const misses = [];

for (const card of seed.cards) {
  const venues = card.venues ?? [];
  if (venues.length > 0) {
    for (const v of venues) if (!(await fill(v, `${card.id} / ${v.name}`))) misses.push(`${card.id}/${v.name}`);
    const ok = venues.filter((v) => v.lat != null);
    if (ok.length > 0) {
      // Cluster card anchors at the centroid of its resolved venues.
      card.lat = Math.round((ok.reduce((s, v) => s + v.lat, 0) / ok.length) * 1e6) / 1e6;
      card.lng = Math.round((ok.reduce((s, v) => s + v.lng, 0) / ok.length) * 1e6) / 1e6;
    }
    // Unresolved venues stay in the data with null coords (rendered nowhere,
    // listed in the card) — they are follow-ups, not silent drops.
  } else if (!(await fill(card, card.id))) {
    misses.push(card.id);
  }
}

writeFileSync(CARDS_PATH, JSON.stringify(seed, null, 2) + "\n");
writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
console.log(misses.length ? `\n${misses.length} unresolved: ${misses.join(", ")}` : "\nall entries geocoded");
process.exit(misses.length > 4 ? 1 : 0); // tolerate a few name-only bar misses; card-level misses are fixed by hand below
```

- [ ] **Step 5: Run the geocoder**

Run: `node scripts/geocode-demand-cards.mjs`
Expected: `ok` lines for all address-backed entries (~30s: 1.1s/query); possible `MISS` lines for name-only bars (Panzón, Rounders, Greenpoint Palace, Zum Schneider, Good Bar) and Yoseka.

- [ ] **Step 6: Resolve misses**

For each MISS: retry with a better `geocodeQuery` (e.g. add `Bar` to the name, or find the street address via WebSearch and set `address`), re-run the script. A venue that still can't be resolved stays with `null` coords (it renders nowhere and is reported to Batu at the end of the task — never invent a location). **Card-level** entries must all resolve — the seed test requires it.

- [ ] **Step 7: Run tests to verify they pass**

Run: `node --test src/demand-test/julyCards.test.mjs` → PASS (15 cards, all validated, all geocoded, ≥6 venues resolved).

- [ ] **Step 8: Commit**

```bash
git add src/data/demand-test/ scripts/geocode-demand-cards.mjs src/demand-test/julyCards.test.mjs
git commit -m "feat(track-v): 15-card SSG July seed + Nominatim geocode derivation (coords cached as evidence)"
```

---

### Task 6: Filter logic (`filterCards.js`)

**Files:**
- Create: `src/demand-test/filterCards.js`
- Test: `src/demand-test/filterCards.test.mjs`

**Interfaces:**
- Consumes: `FILTER_IDS` from `cardSchema.js`.
- Produces: `FILTERS: Array<{id, label}>` (with leading `{id:"all", label:"Everything"}`), `matchesFilter(card, filterId): boolean`, `isActiveOn(card, date): boolean` (Today lens — undated cards always pass), `pinKind(card): "business"|"event"|"gtrain"|"club"`. Consumed by `JulyApp.jsx` and `MapView.jsx`.

- [ ] **Step 1: Write the failing test** — `src/demand-test/filterCards.test.mjs`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { FILTERS, matchesFilter, isActiveOn, pinKind } from "./filterCards.js";
import { FILTER_IDS } from "./cardSchema.js";

test("FILTERS = 'all' + the spec's nine, in order, with display labels", () => {
  assert.equal(FILTERS[0].id, "all");
  assert.deepEqual(FILTERS.slice(1).map((f) => f.id), FILTER_IDS);
  assert.equal(FILTERS.find((f) => f.id === "g_train").label, "G-Train Support");
  assert.equal(FILTERS.find((f) => f.id === "food_drink").label, "Food & Drink");
  assert.equal(FILTERS.find((f) => f.id === "clubs_signups").label, "Clubs & Signups");
});

test("matchesFilter: 'all' passes everything; others check authored membership", () => {
  const card = { filters: ["new", "food_drink"] };
  assert.ok(matchesFilter(card, "all"));
  assert.ok(matchesFilter(card, "new"));
  assert.ok(matchesFilter(card, "food_drink"));
  assert.ok(!matchesFilter(card, "g_train"));
});

test("isActiveOn: undated cards always pass; dated cards pass only inside their window", () => {
  const jul2 = new Date("2026-07-02T12:00:00-04:00");
  const jul8 = new Date("2026-07-08T12:00:00-04:00");
  const undated = {};
  const tasting = { startsAt: "2026-07-02T18:00:00-04:00", endsAt: "2026-07-02T20:00:00-04:00" };
  const openEnded = { endsAt: "2026-07-19T23:59:00-04:00" };
  assert.ok(isActiveOn(undated, jul2));
  assert.ok(isActiveOn(tasting, jul2), "same-day event active on its day (even before start time)");
  assert.ok(!isActiveOn(tasting, jul8), "past event inactive");
  assert.ok(isActiveOn(openEnded, jul8), "running series active before endsAt");
  assert.ok(!isActiveOn(openEnded, new Date("2026-07-25T12:00:00-04:00")), "series over");
});

test("pinKind maps categories to the four pin treatments", () => {
  assert.equal(pinKind({ category: "new_business" }), "business");
  assert.equal(pinKind({ category: "service" }), "business");
  assert.equal(pinKind({ category: "event" }), "event");
  assert.equal(pinKind({ category: "subscription" }), "club");
  assert.equal(pinKind({ category: "g_train_support" }), "gtrain");
  assert.equal(pinKind({ category: "civic_action" }), "gtrain");
  assert.equal(pinKind({ category: "support_local" }), "gtrain");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/demand-test/filterCards.test.mjs` → FAIL (module not found).

- [ ] **Step 3: Implement `src/demand-test/filterCards.js`**

```js
// Track V — filter-bar model, Today lens, pin classification. Filter membership
// is AUTHORED on each card (card.filters), not inferred: deterministic, testable,
// and editable without touching logic.
import { FILTER_IDS } from "./cardSchema.js";

const LABELS = {
  new: "New",
  food_drink: "Food & Drink",
  shopping: "Shopping",
  services: "Services",
  arts_culture: "Arts & Culture",
  family_kids: "Family & Kids",
  events: "Events",
  clubs_signups: "Clubs & Signups",
  g_train: "G-Train Support",
};

export const FILTERS = [
  { id: "all", label: "Everything" },
  ...FILTER_IDS.map((id) => ({ id, label: LABELS[id] })),
];

export const matchesFilter = (card, filterId) =>
  filterId === "all" || (card.filters ?? []).includes(filterId);

// Today lens (hidden-engagement addendum): a dated card is active on `date` if
// its window touches that calendar day. Undated cards (shops, advocacy) always
// pass — the lens narrows events, it doesn't empty the map.
export function isActiveOn(card, date) {
  if (card.startsAt == null && card.endsAt == null) return true;
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
  if (card.startsAt != null && Date.parse(card.startsAt) > dayEnd.getTime()) return false;
  if (card.endsAt != null && Date.parse(card.endsAt) < dayStart.getTime()) return false;
  return true;
}

const GTRAIN_CATEGORIES = new Set(["g_train_support", "civic_action", "support_local"]);

export function pinKind(card) {
  if (GTRAIN_CATEGORIES.has(card.category)) return "gtrain";
  if (card.category === "event") return "event";
  if (card.category === "subscription") return "club";
  return "business";
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/demand-test/filterCards.test.mjs` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/demand-test/filterCards.js src/demand-test/filterCards.test.mjs
git commit -m "feat(track-v): filter-bar model + pin classification (authored membership)"
```

---

### Task 7: Map view with pins (`MapView.jsx` + maplibre-gl)

**Files:**
- Modify: `package.json` (add `maplibre-gl`)
- Create: `src/demand-test/MapView.jsx`
- Modify: `src/demand-test/JulyApp.jsx` (wire map + state)
- Modify: `src/demand-test/july.css` (map + pin styles)

**Interfaces:**
- Consumes: `buildIIMapStyle`, `GREENPOINT_CENTER`, `GREENPOINT_MAX_BOUNDS` (Task 3); `pinKind` (Task 6); seed JSON (Task 5).
- Produces: `<MapView cards selectedId onSelect />` — renders one pin per geocoded card, one small dot per cluster venue; click selects; selection eases the camera to the card.

- [ ] **Step 1: Install maplibre-gl**

Run: `npm install maplibre-gl`
Expected: added to `dependencies` (v5.x). Name the new dependency in the commit message (AGENTS.md rule).

- [ ] **Step 2: Implement `src/demand-test/MapView.jsx`**

```jsx
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildIIMapStyle, GREENPOINT_CENTER, GREENPOINT_MAX_BOUNDS } from "./iiMapStyle.js";
import { pinKind } from "./filterCards.js";

// Track V — the 2D II-C map. Thin component: style comes from iiMapStyle.js,
// pin classification from filterCards.js; markers are DOM elements styled in
// july.css. No Three.js, no app state beyond props.
export default function MapView({ cards, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildIIMapStyle(),
      center: GREENPOINT_CENTER,
      zoom: 14.1,
      minZoom: 12.8,
      maxZoom: 17.5,
      maxBounds: GREENPOINT_MAX_BOUNDS,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Sync markers with the filtered card set + selection.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    const addMarker = (lngLat, el) => {
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(lngLat)
        .addTo(map);
      markersRef.current.push(marker);
    };

    for (const card of cards) {
      for (const v of card.venues ?? []) {
        if (v.lat == null) continue; // unresolved venue: listed on the card, not mapped
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "ii-venue-dot";
        dot.setAttribute("aria-label", `${v.name} (${card.title})`);
        dot.addEventListener("click", (e) => { e.stopPropagation(); onSelect(card.id); });
        addMarker([v.lng, v.lat], dot);
      }
      if (card.lat == null) continue;
      const el = document.createElement("button");
      el.type = "button";
      el.className = `ii-pin ii-pin--${pinKind(card)}${card.id === selectedId ? " is-selected" : ""}`;
      el.setAttribute("aria-label", card.locationName);
      el.addEventListener("click", (e) => { e.stopPropagation(); onSelect(card.id); });
      const label = document.createElement("span");
      label.className = "ii-pin-label";
      label.textContent = card.locationName;
      el.appendChild(label);
      addMarker([card.lng, card.lat], el);
    }
  }, [cards, selectedId, onSelect]);

  // Ease to the selected card.
  useEffect(() => {
    const card = cards.find((c) => c.id === selectedId);
    if (card?.lat != null) {
      mapRef.current?.easeTo({ center: [card.lng, card.lat], duration: 500 });
    }
  }, [selectedId, cards]);

  return <div ref={containerRef} className="july-map" aria-label="Map of Greenpoint" />;
}
```

- [ ] **Step 3: Wire into `JulyApp.jsx`** (replace the stub)

```jsx
import React, { useMemo, useState, useCallback } from "react";
import seed from "../data/demand-test/july-2026-cards.json";
import { FILTERS, matchesFilter } from "./filterCards.js";
import MapView from "./MapView.jsx";

// Track V — "July in Greenpoint + G-Train Support". Standalone 2D demand-test
// page; must never import the 3D runtime.
export default function JulyApp() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(
    () => seed.cards.filter((c) => matchesFilter(c, filter)),
    [filter],
  );

  const onFilter = useCallback((id) => {
    setFilter(id);
    setSelectedId((sel) => {
      const still = seed.cards.find((c) => c.id === sel && matchesFilter(c, id));
      return still ? sel : null;
    });
  }, []);

  return (
    <div className="july-shell">
      <header className="july-header">
        <div className="july-header-text">
          <span className="july-kicker">Greenpoint Explorer</span>
          <h1>July in Greenpoint</h1>
          <p>New spots, what&rsquo;s on, and how to support local through the G-train closures &mdash; mapped.</p>
        </div>
      </header>
      <div className="july-gbanner" role="status">
        <span className="july-gbadge">G</span>
        <span>
          <strong>No G trains</strong> Fri Jul 10 9:45 PM &rarr; Mon Jul 13 5 AM, plus overnights Jul 13&ndash;17
          &middot; Greenpoint Av + Nassau Av &middot; free T403 shuttle
        </span>
      </div>
      <main className="july-main">
        {/* CardPanel lands in Task 8; filters render here so the map is testable now */}
        <nav className="july-filters" aria-label="Filter the map">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`july-chip${filter === f.id ? " is-active" : ""}`}
              onClick={() => onFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </nav>
        <MapView cards={filtered} selectedId={selectedId} onSelect={setSelectedId} />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Add map/pin styles to `july.css`** (append)

```css
/* --- layout --- */
.july-main {
  position: relative;
  height: calc(100vh - var(--chrome-h, 132px));
  min-height: 480px;
}

.july-map {
  position: absolute;
  inset: 0;
}

/* --- pins (DOM markers) --- */
/* colors mirror palette tokens: ink #2a241c, paper #ece3cf, signalGreen #4f7d52,
   signalAmber #cc9a3b, brick hero #a04432 */
.ii-pin {
  position: relative;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 2px solid #2a241c;
  border-radius: 50%;
  background: #ece3cf;
  box-shadow: 0 2px 0 rgba(42, 36, 28, 0.35);
  cursor: pointer;
}

.ii-pin--business { background: #ece3cf; }
.ii-pin--event { background: #cc9a3b; }
.ii-pin--gtrain { background: #4f7d52; }
.ii-pin--club { background: #a04432; } /* premier-franklin-organic hero brick */

.ii-pin.is-selected {
  z-index: 3;
  transform: scale(1.35);
  background: #2a241c;
  border-color: #2a241c;
  box-shadow: 0 0 0 4px rgba(42, 36, 28, 0.22);
}

.ii-pin-label {
  position: absolute;
  top: -6px;
  left: 22px;
  display: none;
  padding: 3px 7px;
  border: 1px solid #2a241c;
  border-radius: 3px;
  background: #ece3cf;
  color: #2a241c;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.ii-pin:hover .ii-pin-label,
.ii-pin.is-selected .ii-pin-label {
  display: block;
}

.ii-venue-dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 1.5px solid #2a241c;
  border-radius: 50%;
  background: #cc9a3b;
  cursor: pointer;
}
```

- [ ] **Step 5: Verify in the browser (preview tools)**

If `.claude/launch.json` doesn't exist, create it:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "greenpoint-dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 5173 }
  ]
}
```

Then: `preview_start` → navigate to `http://127.0.0.1:5173/july.html` (preview_eval `window.location.href = ".../july.html"`), check `preview_console_logs` for errors, `preview_snapshot` for pins, and — critically — **verify pin registration**: zoom in on each pin and confirm it sits on the right street/block against the map's own street labels (e.g. Sailor + Siren on Manhattan Ave between Calyer and Greenpoint Av). A pin on the wrong block = geocode miss → fix the card's `geocodeQuery`, re-run the script.

- [ ] **Step 6: Run the whole suite + build**

Run: `npm run test && npm run build`
Expected: all PASS; build emits `dist/july.html`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/demand-test/ .claude/launch.json
git commit -m "feat(track-v): II-C MapLibre map with card pins + filters (new dep: maplibre-gl)"
```

---

### Task 8: Card panel, actions, CTAs (`CardPanel.jsx`)

**Files:**
- Create: `src/demand-test/CardPanel.jsx`
- Modify: `src/demand-test/JulyApp.jsx` (move filters into panel, add panel to layout)
- Modify: `src/demand-test/july.css` (panel styles)

**Interfaces:**
- Consumes: `FILTERS`, `matchesFilter`, `isActiveOn` (Task 6); card objects (Task 5 shape).
- Produces: `<CardPanel cards filter onFilter todayOnly onToday selectedId onSelect />` — filter chips + **Today/This-week toggle**, scrollable card list, expanded detail for the selected card (summary, whyItMatters, event window, actions, SSG attribution), signup + submission CTAs. `JulyApp` owns `todayOnly` state and applies `isActiveOn(card, new Date())` to the filtered set when it's on.

- [ ] **Step 1: Implement `src/demand-test/CardPanel.jsx`**

```jsx
import React from "react";
import { FILTERS } from "./filterCards.js";

const SIGNUP_MAILTO =
  "mailto:bsayici@gmail.com?subject=Weekly%20Greenpoint%20updates&body=Sign%20me%20up%20for%20the%20weekly%20map.";
const SUBMIT_MAILTO =
  "mailto:bsayici@gmail.com?subject=Add%20to%20the%20Greenpoint%20map&body=Business%20%2F%20event%20%2F%20offer%20%2F%20update%3A%0A%0AName%3A%0AAddress%3A%0AWhat%20should%20the%20card%20say%3F%3A";

function ActionLink({ action }) {
  const cls = "july-action";
  if (action.type === "share") {
    const onShare = async () => {
      const data = { title: "July in Greenpoint", url: window.location.href };
      if (navigator.share) await navigator.share(data).catch(() => {});
      else await navigator.clipboard.writeText(window.location.href);
    };
    return (
      <button type="button" className={cls} onClick={onShare}>
        {action.label}
      </button>
    );
  }
  if (action.url) {
    return (
      <a className={cls} href={action.url} target="_blank" rel="noreferrer">
        {action.label} ↗
      </a>
    );
  }
  return <span className={`${cls} july-action--static`}>{action.label}</span>;
}

function CardDetail({ card }) {
  return (
    <div className="july-detail">
      <p className="july-detail-summary">{card.summary}</p>
      {card.whyItMatters && <p className="july-detail-why">{card.whyItMatters}</p>}
      {(card.venues ?? []).length > 0 && (
        <p className="july-detail-venues">
          {card.venues.map((v) => v.name).join(" · ")}
        </p>
      )}
      <div className="july-actions">
        {card.actions.map((a) => (
          <ActionLink key={a.label} action={a} />
        ))}
      </div>
      <p className="july-source">
        Source: {card.sourceLinks.map((s) => s.title).join(" · ")}
      </p>
    </div>
  );
}

export default function CardPanel({ cards, filter, onFilter, todayOnly, onToday, selectedId, onSelect }) {
  return (
    <aside className="july-panel">
      <nav className="july-filters" aria-label="Filter the map">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`july-chip${filter === f.id ? " is-active" : ""}`}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          className={`july-chip july-chip--today${todayOnly ? " is-active" : ""}`}
          aria-pressed={todayOnly}
          onClick={() => onToday(!todayOnly)}
        >
          {todayOnly ? "Today" : "This week"}
        </button>
      </nav>
      <ol className="july-list">
        {cards.map((card) => {
          const open = card.id === selectedId;
          return (
            <li key={card.id} className={`july-card${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="july-card-head"
                aria-expanded={open}
                onClick={() => onSelect(open ? null : card.id)}
              >
                <span className="july-card-title">{card.title}</span>
                <span className="july-card-loc">{card.locationName}</span>
              </button>
              {open && <CardDetail card={card} />}
            </li>
          );
        })}
        {cards.length === 0 && <li className="july-empty">Nothing in this layer yet.</li>}
      </ol>
      <footer className="july-ctas">
        <a className="july-cta july-cta--primary" href={SIGNUP_MAILTO}>
          Get weekly Greenpoint updates
        </a>
        <a className="july-cta" href={SUBMIT_MAILTO}>
          Add your business or event
        </a>
      </footer>
    </aside>
  );
}
```

(v1 CTAs are mailto links — functional with zero backend; swapping to a form URL later is a one-line constant change.)

- [ ] **Step 2: Update `JulyApp.jsx`** — remove the inline `<nav className="july-filters">` block from Task 7 and render the panel beside the map:

```jsx
      <main className="july-main">
        <CardPanel
          cards={visible}
          filter={filter}
          onFilter={onFilter}
          todayOnly={todayOnly}
          onToday={setTodayOnly}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <MapView cards={visible} selectedId={selectedId} onSelect={setSelectedId} />
      </main>
```

with `import CardPanel from "./CardPanel.jsx";` added at the top, the now-unused `FILTERS` import removed from JulyApp, the import line changed to `import { matchesFilter, isActiveOn } from "./filterCards.js";`, and the state/derivation updated to apply the Today lens:

```jsx
  const [todayOnly, setTodayOnly] = useState(false);

  const visible = useMemo(() => {
    const now = new Date();
    return seed.cards
      .filter((c) => matchesFilter(c, filter))
      .filter((c) => !todayOnly || isActiveOn(c, now));
  }, [filter, todayOnly]);
```

(The `filtered` name from Task 7 becomes `visible`; the selection-clearing in `onFilter` keys off `matchesFilter` as before.) Also append the toggle affordance to `july.css`:

```css
.july-chip--today {
  margin-left: auto;
  border-style: dashed;
}
```

- [ ] **Step 3: Full page styles** — replace `july.css` with the complete sheet:

```css
/* Track V demand-test page. CSS is conformance-exempt, but every color mirrors
   a palette.js token (noted inline) — the II-C no-miss rule holds.
   paper #eae1ce · paper-lift #ece3cf (TONE_PAPER) · ink #2a241c · ink @64%
   line/score #9b9079 · signalGreen #4f7d52 · signalAmber #cc9a3b · street #cabfa7 */
:root {
  --paper: #eae1ce;
  --paper-lift: #ece3cf;
  --ink: #2a241c;
  --ink-soft: rgba(42, 36, 28, 0.64);
  --ink-faint: rgba(42, 36, 28, 0.14);
  --line: #9b9079;
  --g-green: #4f7d52;
  --amber: #cc9a3b;
  --street: #cabfa7;
  --chrome-h: 132px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }
body { margin: 0; }

.july-shell {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
}

/* --- header --- */
.july-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 18px 22px 12px;
  border-bottom: 1px solid var(--ink);
}

.july-kicker {
  display: inline-block;
  margin-bottom: 4px;
  font-size: 0.66rem;
  font-weight: 850;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.july-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 850;
  letter-spacing: -0.015em;
}

.july-header p {
  margin: 4px 0 0;
  max-width: 52ch;
  font-size: 0.86rem;
  color: var(--ink-soft);
}

/* --- G banner --- */
.july-gbanner {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 22px;
  border-bottom: 1px solid var(--ink);
  background: var(--g-green);
  color: var(--paper-lift);
  font-size: 0.82rem;
}

.july-gbadge {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: none;
  border: 2px solid var(--paper-lift);
  border-radius: 50%;
  font-weight: 850;
  font-size: 0.8rem;
}

/* --- main split --- */
.july-main {
  position: relative;
  display: grid;
  grid-template-columns: 400px 1fr;
  height: calc(100vh - var(--chrome-h));
  min-height: 480px;
}

.july-map { position: relative; grid-column: 2; }

/* --- panel --- */
.july-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--ink);
  background: var(--paper);
}

.july-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--ink-faint);
}

.july-chip {
  padding: 4px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}

.july-chip.is-active {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--paper-lift);
}

.july-list {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.july-card { border-bottom: 1px solid var(--ink-faint); }

.july-card-head {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.july-card-head:hover { background: rgba(42, 36, 28, 0.05); }
.july-card.is-open { background: var(--paper-lift); box-shadow: inset 3px 0 0 var(--ink); }

.july-card-title { font-size: 0.95rem; font-weight: 800; }
.july-card-loc { font-size: 0.74rem; color: var(--ink-soft); }

.july-detail { padding: 0 16px 14px; }
.july-detail-summary { margin: 0 0 6px; font-size: 0.84rem; line-height: 1.45; }
.july-detail-why {
  margin: 0 0 6px;
  padding-left: 10px;
  border-left: 2px solid var(--amber);
  font-size: 0.8rem;
  font-style: italic;
  color: var(--ink-soft);
}
.july-detail-venues { margin: 0 0 8px; font-size: 0.74rem; color: var(--ink-soft); }

.july-actions { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }

.july-action {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid var(--ink);
  border-radius: 4px;
  background: var(--paper-lift);
  color: var(--ink);
  font-size: 0.74rem;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
}

.july-action:hover { background: var(--ink); color: var(--paper-lift); }
.july-action--static { cursor: default; }
.july-action--static:hover { background: var(--paper-lift); color: var(--ink); }

.july-source {
  margin: 4px 0 0;
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.july-empty { padding: 18px 16px; font-size: 0.84rem; color: var(--ink-soft); }

/* --- CTAs --- */
.july-ctas {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--ink);
}

.july-cta {
  padding: 9px 12px;
  border: 1px solid var(--ink);
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
  color: var(--ink);
  background: var(--paper-lift);
}

.july-cta--primary { background: var(--ink); color: var(--paper-lift); }

/* --- responsive: map on top, panel below --- */
@media (max-width: 760px) {
  .july-main {
    display: flex;
    flex-direction: column;
    height: auto;
  }
  .july-map { position: relative; height: 46vh; min-height: 320px; }
  .july-panel {
    border-right: 0;
    border-top: 1px solid var(--ink);
    max-height: none;
  }
  .july-list { max-height: 44vh; }
  .july-header p { display: none; }
}

/* keep the pin styles from Task 7 below this line */
```

(Keep the `.ii-pin*` / `.ii-venue-dot` rules from Task 7 at the end of the file.)

- [ ] **Step 4: Verify interactions in the preview**

Reload `/july.html`. Check with preview tools: click a filter chip → list and pins both shrink (preview_click on `.july-chip`, then preview_snapshot); click a pin → its card opens in the panel and the map eases (preview_click on `.ii-pin`, preview_snapshot shows `.july-card.is-open`); click a card → pin highlights; the two CTAs render at panel bottom; `preview_console_logs` clean.

- [ ] **Step 5: Run suite + build**

Run: `npm run test && npm run build` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/demand-test/
git commit -m "feat(track-v): card panel — filter chips, detail cards, actions, signup/submission CTAs"
```

---

### Task 9: Design + responsive polish, verification pass

**Files:**
- Modify: `src/demand-test/july.css`, `src/demand-test/*.jsx` (as findings dictate)

**Interfaces:** none new — this task tightens what exists. Judge against the spec bar: *"value proposition obvious in under 10 seconds; easy to screenshot"* and the II-C identity ("feels spatial and recognizably II-C, or it fails to test the hypothesis").

- [ ] **Step 1: Four-state visual review**

Using preview tools, capture and inspect: desktop (1280×800) default view · desktop with a G-train card selected · mobile (375×812) default · mobile with the events filter active. `preview_resize` between states, `preview_screenshot` each.

- [ ] **Step 2: Run the design critique**

Run the `design_crit` skill on the page (tiered critique: legibility → craft). Apply mechanical fixes (contrast, spacing rhythm, type hierarchy); apply craft proposals that don't fight the II-C system. Anti-generic check: if the page reads as a default map-with-sidebar SaaS template, push the inked identity harder (paper texture tint on the panel, heavier ink rules, editorial header) — but no new visual metaphors without Batu.

- [ ] **Step 3: Hygiene checks**

- `preview_console_logs` level=error → empty.
- Map still interactive at 375px; chips wrap, don't overflow.
- Keyboard: tab reaches chips, cards, pins (they're all `<button>`/`<a>`).
- All copy tone: informational, not partisan (re-read the G-train cards).

- [ ] **Step 4: Full verify + commit**

Run: `npm run verify` (full suite: tests + conformance + visual baseline + the rest).
Expected: green. If the conformance census flags `src/demand-test/july.css` hex strings: CSS is exempt by the existing allowlist (`.css` glob) — confirm in the census output, don't add exceptions for JS files (they must stay token-only).

```bash
git add -A src/demand-test/
git commit -m "polish(track-v): II-C editorial pass on the july page — hierarchy, mobile, a11y"
```

- [ ] **Step 5: Send Batu the screenshots**

Share the four screenshots from Step 1 (post-polish re-captures) with a one-paragraph state summary — this is the show step of the build→show→react loop.

---

### Task 10: Docs + wrap-up

**Files:**
- Modify: `docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md` (status line)
- Modify: `docs/PLAN.md` (only if state changed materially — it already reads "Now: Track V")

- [ ] **Step 1: Update the spec status line**

Change `Status: **Design approved (Batu, 2026-07-02) · not yet started** — build begins in a fresh thread.` to `Status: **Design approved (Batu, 2026-07-02) · v1 built — in visual review with Batu.** Dev URL: /july.html · plan: docs/superpowers/plans/2026-07-02-track-v-spatial-demand-test.md`

- [ ] **Step 2: Final full check**

Run: `npm run verify && npm run build`
Expected: everything green, `dist/july.html` + `dist/index.html` both emitted.

- [ ] **Step 3: Commit**

```bash
git add docs/
git commit -m "docs(track-v): spec status — v1 built, in review"
```

- [ ] **Step 4: Report to Batu**

Summarize: what's live at `/july.html`, card/venue resolution stats (any unresolved venues named), what needs his eye (pin placement spot-check, copy tone, look), and the two gated follow-ups below.

---

### Task 11 (GATED — needs Batu's explicit go): Deploy preview to Vercel

Do **not** run without Batu's approval in this or a later session (deployment discipline: approval does not persist across actions).

- [ ] Confirm with Batu: deploy target (new Vercel project vs existing), URL naming.
- [ ] `npm run build`, then `npx vercel deploy` (preview, not `--prod`) from the repo root — interactive login/link may be needed (Vercel MCP is unauthenticated in this session).
- [ ] Smoke-test the deployed URL (`/july.html` loads, tiles render, pins present) before sharing.
- [ ] Share the URL with Batu for the 10–20-person test cohort + Perri. Public sharing beyond the cohort requires the factual review gate (trust rules).

---

## Self-review notes

- **Spec coverage:** standalone route ✓ (T1) · real 2D II-C map, MapLibre lead pick ✓ (T2–T3, Leaflet fallback stays available if vector styling fights us — decision point at T7 Step 5 if tiles/styling fail) · ~15 seed cards: 8 discovery + 3 events + 4 G-train ✓ (T5) · filters ✓ (T6/T8) · CTAs ✓ (T8) · SSG attribution on cards ✓ (schema-enforced, T4) · G-train actions incl. file-complaint ✓ (T5) · <10s value prop + screenshotability ✓ (T9) · shareable URL ✓ (T11, gated) · schema graduate-able, no PlaceStory reconciliation ✓ (T4 note) · trust rules ✓ (geocode derivation, informational tone check T9).
- **Known judgment calls recorded:** CTAs are mailto (no backend allowed); world-cup cluster = one card + venue dots + centroid anchor; name-only bars may stay unresolved (reported, never invented); MAP_PALETTE lives in palette.js because that file is the declared single source of truth for scene color.
- **Type consistency:** `matchesFilter(card, filterId)`, `pinKind(card)`, `validateCard(card)`, `buildIIMapStyle()`, `cssHex(token)` used identically across tasks; card fields match the seed-doc `GreenpointMapCard` type + `filters`/`venues`/`geocodeQuery` extensions defined in T4/T5.
