# Procedural Block Scaling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a replicable, data-driven recipe that renders a block of Greenpoint beyond the Franklin corner — data-differentiated typological massing plus truthful (OSM-sourced) storefront signage — proven by Block A (Franklin→Milton) building the recipe and Block B (east-Greenpoint) running it with near-zero new code.

**Architecture:** A 7-stage pipeline parameterized by a thin per-block descriptor. New pure, Node-runnable modules (`buildingTypology.js`, `storefrontRoster.js`) match the existing `sceneFrame.js` pattern (deterministic, verifier-backed). Reproducible fetch scripts pull footprints (NYC Open Data + PLUTO) and storefronts (OSM Overpass) into committed extracts. The live runtime (`SceneView.jsx` / `sceneFrame.js`) gains block-bbox gating, a typology-aware wall treatment, and a truthful-storefront renderer. A scorecard (`SCALING_LOG.md`) captures the replicability signal.

**Tech Stack:** React 19 + Three.js + Vite. Node ESM scripts (`.mjs`) for data/verification. NYC Open Data (Building Footprints + PLUTO via Socrata), OSM Overpass API.

**Spec:** `docs/superpowers/specs/2026-06-16-procedural-block-scaling-design.md`

---

## File Structure

| Responsibility | File | New/Edit |
|---|---|---|
| Per-block descriptor | `src/data/blocks/franklin-milton.block.json`, `src/data/blocks/greenpoint-east.block.json` | new |
| Schema recon notes | `docs/superpowers/plans/recon-schemas.md` | new (Phase 0) |
| Footprint+PLUTO pull | `scripts/pull-footprints.mjs` | new |
| Committed footprint extracts | `src/data/geometry-source/block-*.nyc-open-geometry.v0.1.json` | new (data) |
| Building typology classifier | `src/buildingTypology.js` | new |
| Classifier verifier | `scripts/verify-building-typology.mjs` | new |
| Storefront pull (OSM) | `scripts/pull-storefronts.mjs` | new |
| Committed storefront rosters | `src/data/places/block-*-storefronts.v0.1.json` | new (data) |
| Storefront→bay assignment | `src/storefrontRoster.js` | new |
| Assignment verifier | `scripts/verify-storefront-roster.mjs` | new |
| Block-bbox gating | `src/sceneFrame.js` (assembly) | edit |
| Typology-aware wall + storefront renderer | `src/SceneView.jsx` | edit |
| Ground extension (data only) | `src/groundLayer.js` inputs | reuse |
| Scorecard tool | `scripts/score-block-build.mjs` | new |
| Scaling log | `docs/SCALING_LOG.md` | new |

**Decomposition note:** Pure logic (classify, assign, project-gating) lives in Node-runnable modules with unit tests (TDD). Renderer integration is verified by `npm run build` + 4-angle screenshots, not unit tests — Three.js scene output isn't unit-testable here, matching the existing project pattern.

---

## Phase 0 — Schema reconnaissance (do this first; downstream tasks depend on it)

### Task 0: Confirm real field names and existing signatures

The plan references NYC Open Data, PLUTO, and OSM field names plus existing runtime functions. Confirm the **actual** names before coding so later tasks bind to truth, not guesses.

**Files:**
- Create: `docs/superpowers/plans/recon-schemas.md`

- [ ] **Step 1: Inspect the existing footprint record schema**

Run:
```bash
cd "/Users/batusayici/Projects/Greenpoint Explorer"
node -e "const d=require('./src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json'); const r=(d.footprintRecords||d.records||d.features||[])[0]; console.log(JSON.stringify(Object.keys(d),null,2)); console.log('---first record---'); console.log(JSON.stringify(r,null,2).slice(0,2000));"
```
Record in `recon-schemas.md`: the top-level array key (e.g. `footprintRecords`), and the exact path to BIN, WGS84 polygon, `heightRoof`, and any BBL field.

- [ ] **Step 2: Confirm the projection basis fields**

Run:
```bash
node -e "const d=require('./src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json'); console.log(JSON.stringify(d.sceneTruthModel?.projectionBasis ?? d.projectionBasis ?? d, null, 2).slice(0,1500));"
```
Record the exact path to `originWgs84`, axis points, and `scaleMetersToSceneUnits`.

- [ ] **Step 3: Quote the existing functions the renderer tasks will touch**

Run:
```bash
grep -n "export function createProjection\|export function assembleFranklinScene\|projectPolygon\|CONTEXT_TREATMENT_RADIUS_UNITS\|contextRadiusUnits" src/sceneFrame.js
grep -n "function decorateTypologicalWall\|function footprintEdges\|function buildBuildings\|CONTEXT_TREATMENT_RADIUS_UNITS" src/SceneView.jsx
```
In `recon-schemas.md`, paste the signature lines for `assembleFranklinScene`, `decorateTypologicalWall`, `footprintEdges`, and note where the radius cull happens and what params each function takes.

- [ ] **Step 4: Probe NYC Open Data live field names (footprints + PLUTO)**

Run:
```bash
curl -s "https://data.cityofnewyork.us/resource/qb5r-6dgf.json?\$limit=1" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.stringify(Object.keys(JSON.parse(s)[0]),null,2)))"
curl -s "https://data.cityofnewyork.us/resource/64uk-42ks.json?\$limit=1" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.stringify(Object.keys(JSON.parse(s)[0]),null,2)))"
```
(`qb5r-6dgf` = Building Footprints; `64uk-42ks` = PLUTO. If a resource id 404s, search https://data.cityofnewyork.us for "Building Footprints" / "PLUTO" and update the id.)
Record the real column names for: BIN, BBL (`base_bbl`/`mpluto_bbl`), `heightroof`, the_geom; and PLUTO `numfloors`, `yearbuilt`, `bldgclass`, `landuse`, `comarea`, `resarea`.

- [ ] **Step 5: Probe OSM Overpass for the block area**

Run:
```bash
curl -s "https://overpass-api.de/api/interpreter" --data-urlencode 'data=[out:json][timeout:25];node["shop"](40.7290,-73.9560,40.7320,-73.9530);out 3;' | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log(JSON.stringify(j.elements?.[0]?.tags ?? 'no shop nodes in test bbox',null,2))})"
```
Record the tag keys present (`name`, `shop`, `amenity`, `addr:housenumber`, `addr:street`) and whether storefronts appear as `node` or `way`.

- [ ] **Step 6: Commit the recon notes**

```bash
git add docs/superpowers/plans/recon-schemas.md
git commit -m "docs(scaling): schema recon — confirmed footprint/PLUTO/OSM field names + runtime signatures"
```

> **Downstream rule:** Wherever a later task uses a field name (e.g. `record.sourceProperties.heightRoof`, `tags['addr:housenumber']`), bind it to the name confirmed in `recon-schemas.md`. If they differ, the recon doc wins.

---

## Phase 1 — Block descriptor + footprint acquisition

### Task 1: Block descriptor for Franklin→Milton

**Files:**
- Create: `src/data/blocks/franklin-milton.block.json`

- [ ] **Step 1: Author the descriptor**

Determine the bbox from the Milton St / Franklin Ave and Greenpoint Ave / Franklin Ave corners (read `recon-schemas.md` origin; Milton is one block north of Greenpoint Ave along Franklin). Use a generous bbox covering the block face.

```json
{
  "id": "franklin-milton",
  "label": "Franklin Ave — Greenpoint Ave to Milton St",
  "bbox": { "minLon": -73.9565, "minLat": 40.7300, "maxLon": -73.9540, "maxLat": 40.7322 },
  "streetSegments": [
    { "name": "Franklin Ave", "from": "Greenpoint Ave", "to": "Milton St" }
  ]
}
```
(Adjust the numbers using the real corner coordinates from `recon-schemas.md`; the values above are a starting estimate to be tightened in Task 3 when footprints are pulled and visually checked.)

- [ ] **Step 2: Commit**

```bash
git add src/data/blocks/franklin-milton.block.json
git commit -m "data(scaling): Franklin→Milton block descriptor"
```

### Task 2: Footprint+PLUTO pull script

**Files:**
- Create: `scripts/pull-footprints.mjs`

- [ ] **Step 1: Write the fetch script**

```js
// scripts/pull-footprints.mjs
// Usage: node scripts/pull-footprints.mjs src/data/blocks/franklin-milton.block.json
// Pulls NYC Building Footprints in the descriptor bbox, joins PLUTO on BBL,
// writes src/data/geometry-source/block-<id>.nyc-open-geometry.v0.1.json
import { readFile, writeFile } from "node:fs/promises";

const FOOTPRINTS = "https://data.cityofnewyork.us/resource/qb5r-6dgf.json"; // confirm id via recon
const PLUTO = "https://data.cityofnewyork.us/resource/64uk-42ks.json";     // confirm id via recon

const descriptorPath = process.argv[2];
if (!descriptorPath) throw new Error("Usage: node scripts/pull-footprints.mjs <descriptor.json>");

const descriptor = JSON.parse(await readFile(descriptorPath, "utf8"));
const { minLon, minLat, maxLon, maxLat } = descriptor.bbox;

// Socrata: filter footprints whose centroid intersects the bbox using within_box on the_geom.
const where = `within_box(the_geom, ${maxLat}, ${minLon}, ${minLat}, ${maxLon})`;
const fpUrl = `${FOOTPRINTS}?$where=${encodeURIComponent(where)}&$limit=2000`;
const footprints = await (await fetch(fpUrl)).json();
if (!Array.isArray(footprints)) throw new Error(`Footprint fetch failed: ${JSON.stringify(footprints).slice(0,300)}`);

// Collect BBLs (field name confirmed in recon — default base_bbl) and pull PLUTO for them.
const bblField = "base_bbl"; // ← replace with confirmed field from recon-schemas.md
const bbls = [...new Set(footprints.map((f) => f[bblField]).filter(Boolean))];
const plutoByBbl = new Map();
for (let i = 0; i < bbls.length; i += 50) {
  const chunk = bbls.slice(i, i + 50).map((b) => `'${b}'`).join(",");
  const pUrl = `${PLUTO}?$where=bbl in (${encodeURIComponent(chunk)})&$limit=500`;
  const rows = await (await fetch(pUrl)).json();
  if (Array.isArray(rows)) for (const r of rows) plutoByBbl.set(String(r.bbl), r);
}

const records = footprints.map((f) => {
  const pluto = plutoByBbl.get(String(f[bblField])) ?? {};
  return {
    bin: f.bin ?? f.base_bin ?? null,                 // confirm field
    bbl: f[bblField] ?? null,
    wgs84Polygon: f.the_geom?.coordinates?.[0]?.[0] ?? null, // MultiPolygon → outer ring; confirm shape
    sourceProperties: {
      heightRoof: f.heightroof != null ? Number(f.heightroof) : null,
      numFloors: pluto.numfloors != null ? Number(pluto.numfloors) : null,
      yearBuilt: pluto.yearbuilt != null ? Number(pluto.yearbuilt) : null,
      bldgClass: pluto.bldgclass ?? null,
      landUse: pluto.landuse ?? null,
      comArea: pluto.comarea != null ? Number(pluto.comarea) : null,
      resArea: pluto.resarea != null ? Number(pluto.resarea) : null,
    },
  };
}).filter((r) => r.wgs84Polygon && r.bin);

const out = {
  schemaVersion: "block-geometry-source.v0.1",
  blockId: descriptor.id,
  bbox: descriptor.bbox,
  source: { footprints: FOOTPRINTS, pluto: PLUTO, pulledFor: descriptor.label },
  recordCount: records.length,
  footprintRecords: records,
};
const outPath = `src/data/geometry-source/block-${descriptor.id}.nyc-open-geometry.v0.1.json`;
await writeFile(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${records.length} footprint records → ${outPath}`);
```

- [ ] **Step 2: Commit the script (before running — keep code and data commits separate)**

```bash
git add scripts/pull-footprints.mjs
git commit -m "feat(scaling): footprint+PLUTO pull script (NYC Open Data → committed extract)"
```

### Task 3: Pull Block A footprints and sanity-check

**Files:**
- Create (generated): `src/data/geometry-source/block-franklin-milton.nyc-open-geometry.v0.1.json`

- [ ] **Step 1: Run the pull**

```bash
node scripts/pull-footprints.mjs src/data/blocks/franklin-milton.block.json
```
Expected: `Wrote N footprint records → ...` with N roughly 10–40. If N is 0, widen the bbox in the descriptor (Task 1) or fix the `within_box` arg order / confirmed field names, then re-run.

- [ ] **Step 2: Sanity-check the extract**

```bash
node -e "const d=require('./src/data/geometry-source/block-franklin-milton.nyc-open-geometry.v0.1.json'); console.log('records',d.recordCount); const wp=d.footprintRecords.filter(r=>r.sourceProperties.numFloors!=null).length; console.log('with PLUTO floors:',wp); console.log('sample',JSON.stringify(d.footprintRecords[0],null,2).slice(0,600));"
```
Expected: most records have a polygon and BIN; a majority carry PLUTO `numFloors`. Note the PLUTO hit-rate (feeds the scorecard).

- [ ] **Step 3: Commit the data extract**

```bash
git add src/data/geometry-source/block-franklin-milton.nyc-open-geometry.v0.1.json
git commit -m "data(scaling): Franklin→Milton footprint+PLUTO extract"
```

---

## Phase 2 — Building typology classifier (pure module, TDD)

### Task 4: `buildingTypology.js` — classifyBuilding

**Files:**
- Create: `src/buildingTypology.js`
- Test: `scripts/verify-building-typology.mjs`

- [ ] **Step 1: Write the failing verifier**

```js
// scripts/verify-building-typology.mjs
import assert from "node:assert";
import { classifyBuilding } from "../src/buildingTypology.js";

let passed = 0;
function check(name, fn) { fn(); passed++; console.log("ok -", name); }

// 1-story commercial taxpayer with PLUTO commercial area → commercial-storefront + commercial ground floor
check("taxpayer commercial", () => {
  const t = classifyBuilding({ bin: 1, wgs84Polygon: [], sourceProperties: { heightRoof: 18, numFloors: 1, yearBuilt: 1955, bldgClass: "K1", landUse: "05", comArea: 4000, resArea: 0 } });
  assert.equal(t.massingClass, "taxpayer");
  assert.equal(t.materialFamily, "commercial-storefront");
  assert.equal(t.groundFloorUse, "commercial");
  assert.equal(t.storeyCount, 1);
  assert.equal(t.confidence.storeyCount, "source-backed");
});

// Pre-war 3-story residential rowhouse → brick-prewar, residential ground floor
check("prewar rowhouse", () => {
  const t = classifyBuilding({ bin: 2, wgs84Polygon: [], sourceProperties: { heightRoof: 34, numFloors: 3, yearBuilt: 1910, bldgClass: "C0", landUse: "01", comArea: 0, resArea: 3000 } });
  assert.equal(t.massingClass, "rowhouse");
  assert.equal(t.materialFamily, "brick-prewar");
  assert.equal(t.groundFloorUse, "residential");
});

// 5-story mixed-use walkup with ground commercial → walkup + commercial ground floor
check("mixed-use walkup", () => {
  const t = classifyBuilding({ bin: 3, wgs84Polygon: [], sourceProperties: { heightRoof: 52, numFloors: 5, yearBuilt: 1925, bldgClass: "S5", landUse: "04", comArea: 1200, resArea: 5000 } });
  assert.equal(t.massingClass, "walkup");
  assert.equal(t.groundFloorUse, "commercial");
});

// No PLUTO floors → estimate from heightRoof, mark estimated
check("height fallback", () => {
  const t = classifyBuilding({ bin: 4, wgs84Polygon: [], sourceProperties: { heightRoof: 40, numFloors: null, yearBuilt: null, bldgClass: null, landUse: null, comArea: null, resArea: null } });
  assert.equal(t.storeyCount, 4); // round(40/10)
  assert.equal(t.confidence.storeyCount, "estimated");
  assert.equal(t.confidence.materialFamily, "fallback");
});

// No height at all → fallback storeyCount 2
check("total fallback", () => {
  const t = classifyBuilding({ bin: 5, wgs84Polygon: [], sourceProperties: {} });
  assert.equal(t.storeyCount, 2);
  assert.equal(t.confidence.storeyCount, "fallback");
});

console.log(`\n${passed}/5 typology checks passed`);
```

- [ ] **Step 2: Run to verify it fails**

Run: `node scripts/verify-building-typology.mjs`
Expected: FAIL — `Cannot find module '../src/buildingTypology.js'` (or `classifyBuilding is not a function`).

- [ ] **Step 3: Implement the classifier**

```js
// src/buildingTypology.js
// Pure, Node-runnable. footprint record → typology descriptor.
// Truth rule: every field is a typological INFERENCE carrying a confidence level.

const FEET_PER_STOREY = 10;

export function classifyBuilding(record) {
  const p = record?.sourceProperties ?? {};
  const confidence = {};

  // storeyCount
  let storeyCount;
  if (Number.isFinite(p.numFloors) && p.numFloors > 0) {
    storeyCount = Math.round(p.numFloors);
    confidence.storeyCount = "source-backed";
  } else if (Number.isFinite(p.heightRoof) && p.heightRoof > 0) {
    storeyCount = Math.max(1, Math.round(p.heightRoof / FEET_PER_STOREY));
    confidence.storeyCount = "estimated";
  } else {
    storeyCount = 2;
    confidence.storeyCount = "fallback";
  }

  // groundFloorUse
  const landUse = p.landUse != null ? String(p.landUse) : null;
  const commercialLandUse = landUse ? ["04", "05", "11"].includes(landUse) : false; // mixed/commercial/misc-commercial
  const hasComArea = Number.isFinite(p.comArea) && p.comArea > 0;
  const groundFloorUse = (commercialLandUse || hasComArea) ? "commercial" : "residential";
  confidence.groundFloorUse = (landUse != null || hasComArea) ? "source-backed" : "fallback";

  // materialFamily
  let materialFamily;
  const cls = p.bldgClass ? String(p.bldgClass)[0] : null;
  if (cls === "F" || cls === "G" || cls === "T" || cls === "W") {
    materialFamily = "warehouse"; // industrial/transport/utility families
    confidence.materialFamily = "source-backed";
  } else if (storeyCount === 1 && groundFloorUse === "commercial") {
    materialFamily = "commercial-storefront";
    confidence.materialFamily = "source-backed";
  } else if (Number.isFinite(p.yearBuilt) && p.yearBuilt > 0 && p.yearBuilt < 1945) {
    materialFamily = "brick-prewar";
    confidence.materialFamily = "source-backed";
  } else if (Number.isFinite(p.yearBuilt) && p.yearBuilt >= 1945) {
    materialFamily = "painted-masonry";
    confidence.materialFamily = "estimated";
  } else {
    materialFamily = "brick-prewar"; // safest Greenpoint default
    confidence.materialFamily = "fallback";
  }

  // massingClass
  let massingClass;
  if (storeyCount <= 1) massingClass = "taxpayer";
  else if (storeyCount <= 4) massingClass = "rowhouse";
  else if (storeyCount <= 6) massingClass = "walkup";
  else massingClass = "midrise";

  return { storeyCount, massingClass, materialFamily, groundFloorUse, palette: paletteFor(materialFamily), confidence };
}

// II-C palette keys per material family. Resolve to actual II_PALETTE entries in the renderer.
export function paletteFor(materialFamily) {
  switch (materialFamily) {
    case "warehouse": return "typological.warehouse";
    case "commercial-storefront": return "typological.commercial";
    case "painted-masonry": return "typological.painted";
    case "brick-prewar":
    default: return "typological.brick";
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node scripts/verify-building-typology.mjs`
Expected: `5/5 typology checks passed`.

- [ ] **Step 5: Commit**

```bash
git add src/buildingTypology.js scripts/verify-building-typology.mjs
git commit -m "feat(scaling): buildingTypology classifier (massing/material/use + confidence)"
```

### Task 5: Classify the Block A extract and report coverage

**Files:**
- Modify: `scripts/verify-building-typology.mjs` (append a real-data coverage report)

- [ ] **Step 1: Append a coverage report to the verifier**

Add at the bottom of `scripts/verify-building-typology.mjs`:

```js
// --- real-data coverage report (Block A) ---
import { readFile } from "node:fs/promises";
try {
  const path = "src/data/geometry-source/block-franklin-milton.nyc-open-geometry.v0.1.json";
  const data = JSON.parse(await readFile(path, "utf8"));
  const tallies = { massingClass: {}, materialFamily: {}, groundFloorUse: {}, storeyConfidence: {} };
  for (const rec of data.footprintRecords) {
    const t = classifyBuilding(rec);
    tallies.massingClass[t.massingClass] = (tallies.massingClass[t.massingClass] ?? 0) + 1;
    tallies.materialFamily[t.materialFamily] = (tallies.materialFamily[t.materialFamily] ?? 0) + 1;
    tallies.groundFloorUse[t.groundFloorUse] = (tallies.groundFloorUse[t.groundFloorUse] ?? 0) + 1;
    tallies.storeyConfidence[t.confidence.storeyCount] = (tallies.storeyConfidence[t.confidence.storeyCount] ?? 0) + 1;
  }
  console.log("\nBlock A typology coverage:", JSON.stringify(tallies, null, 2));
} catch (e) { console.log("\n(skipped coverage report:", e.message, ")"); }
```

- [ ] **Step 2: Run and record the distribution**

Run: `node scripts/verify-building-typology.mjs`
Expected: `5/5` plus a coverage block. Confirm the block isn't all one class (if it is, the classifier or data needs a look). Note the `source-backed` storey-confidence share for the scorecard.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-building-typology.mjs
git commit -m "test(scaling): typology coverage report over Block A extract"
```

---

## Phase 3 — Storefront roster (truth layer; pure assignment is TDD)

### Task 6: Storefront pull script (OSM Overpass)

**Files:**
- Create: `scripts/pull-storefronts.mjs`

- [ ] **Step 1: Write the script**

```js
// scripts/pull-storefronts.mjs
// Usage: node scripts/pull-storefronts.mjs src/data/blocks/franklin-milton.block.json
// Pulls OSM commercial POIs in the bbox → src/data/places/block-<id>-storefronts.v0.1.json
import { readFile, writeFile } from "node:fs/promises";

const OVERPASS = "https://overpass-api.de/api/interpreter";
const descriptorPath = process.argv[2];
if (!descriptorPath) throw new Error("Usage: node scripts/pull-storefronts.mjs <descriptor.json>");
const descriptor = JSON.parse(await readFile(descriptorPath, "utf8"));
const { minLon, minLat, maxLon, maxLat } = descriptor.bbox;
const bbox = `${minLat},${minLon},${maxLat},${maxLon}`;

const query = `[out:json][timeout:30];
( node["shop"](${bbox});
  way["shop"](${bbox});
  node["amenity"~"cafe|restaurant|bar|pub|fast_food|pharmacy|bank"](${bbox});
  way["amenity"~"cafe|restaurant|bar|pub|fast_food|pharmacy|bank"](${bbox});
);
out center tags;`;

const res = await fetch(OVERPASS, { method: "POST", body: "data=" + encodeURIComponent(query) });
const json = await res.json();
if (!json.elements) throw new Error(`Overpass failed: ${JSON.stringify(json).slice(0,300)}`);

const records = json.elements
  .filter((el) => el.tags?.name)
  .map((el) => ({
    name: el.tags.name,
    category: el.tags.shop ?? el.tags.amenity ?? "unknown",
    houseNumber: el.tags["addr:housenumber"] ?? null,
    addrStreet: el.tags["addr:street"] ?? null,
    point: el.lat != null ? { lon: el.lon, lat: el.lat } : (el.center ? { lon: el.center.lon, lat: el.center.lat } : null),
    sourceId: `osm:${el.type}/${el.id}`,
    confidence: el.tags["addr:housenumber"] ? "address-backed" : "point-only",
    activeStatus: "unverified",
  }));

const out = {
  schemaVersion: "block-storefront-roster.v0.1",
  blockId: descriptor.id,
  source: { provider: "OSM Overpass", query: query.replace(/\s+/g, " ").trim() },
  recordCount: records.length,
  storefronts: records,
};
const outPath = `src/data/places/block-${descriptor.id}-storefronts.v0.1.json`;
await writeFile(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${records.length} storefronts → ${outPath}`);
```

- [ ] **Step 2: Commit the script**

```bash
git add scripts/pull-storefronts.mjs
git commit -m "feat(scaling): storefront pull script (OSM Overpass → committed roster)"
```

- [ ] **Step 3: Run it for Block A and commit the roster**

```bash
node scripts/pull-storefronts.mjs src/data/blocks/franklin-milton.block.json
node -e "const d=require('./src/data/places/block-franklin-milton-storefronts.v0.1.json'); console.log('storefronts',d.recordCount,'address-backed',d.storefronts.filter(s=>s.confidence==='address-backed').length); console.log(d.storefronts.slice(0,5).map(s=>s.name+' ['+s.category+'] '+(s.houseNumber||'?')))"
git add src/data/places/block-franklin-milton-storefronts.v0.1.json
git commit -m "data(scaling): Franklin→Milton OSM storefront roster (unverified)"
```
Expected: a handful of named storefronts. If 0, the block may have sparse OSM coverage — widen the bbox slightly or note the gap (Block A still proceeds; storefronts without data render as generic-commercial).

### Task 7: `storefrontRoster.js` — assignStorefronts (pure, TDD)

**Files:**
- Create: `src/storefrontRoster.js`
- Test: `scripts/verify-storefront-roster.mjs`

- [ ] **Step 1: Write the failing verifier**

```js
// scripts/verify-storefront-roster.mjs
import assert from "node:assert";
import { assignStorefronts } from "../src/storefrontRoster.js";

let passed = 0;
function check(name, fn) { fn(); passed++; console.log("ok -", name); }

// Two commercial frontages along an axis, two address-backed storefronts → assigned by house number order
check("address-ordered assignment", () => {
  const buildings = [
    { bin: "A", groundFloorUse: "commercial", frontage: { houseNumberHint: 100, from: { x: 0, z: 0 }, to: { x: 2, z: 0 } } },
    { bin: "B", groundFloorUse: "commercial", frontage: { houseNumberHint: 110, from: { x: 2, z: 0 }, to: { x: 4, z: 0 } } },
  ];
  const roster = [
    { name: "Deli", houseNumber: "108", confidence: "address-backed" },
    { name: "Cafe", houseNumber: "101", confidence: "address-backed" },
  ];
  const bays = assignStorefronts(buildings, roster, { axis: "x" });
  const deli = bays.find((b) => b.name === "Deli");
  const cafe = bays.find((b) => b.name === "Cafe");
  assert.equal(cafe.bin, "A");           // 101 → first frontage
  assert.equal(deli.bin, "B");           // 108 → nearer second frontage
  assert.equal(cafe.confidence, "address-backed");
});

// Residential-only buildings → no assignment, storefront dropped to unassigned
check("no commercial frontage", () => {
  const buildings = [{ bin: "R", groundFloorUse: "residential", frontage: { houseNumberHint: 5, from: { x: 0, z: 0 }, to: { x: 1, z: 0 } } }];
  const roster = [{ name: "Ghost", houseNumber: "5", confidence: "address-backed" }];
  const bays = assignStorefronts(buildings, roster, { axis: "x" });
  assert.equal(bays.length, 0);
});

// More storefronts than frontages → overflow marked low confidence, still placed in nearest bay
check("overflow fallback", () => {
  const buildings = [{ bin: "A", groundFloorUse: "commercial", frontage: { houseNumberHint: 100, from: { x: 0, z: 0 }, to: { x: 4, z: 0 } } }];
  const roster = [
    { name: "One", houseNumber: "100", confidence: "address-backed" },
    { name: "Two", houseNumber: "102", confidence: "address-backed" },
  ];
  const bays = assignStorefronts(buildings, roster, { axis: "x" });
  assert.equal(bays.length, 2);
  assert.ok(bays.every((b) => b.bin === "A"));
  assert.equal(bays[1].slotIndex, 1); // second bay slot on the same frontage
});

console.log(`\n${passed}/3 roster checks passed`);
```

- [ ] **Step 2: Run to verify it fails**

Run: `node scripts/verify-storefront-roster.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement assignment**

```js
// src/storefrontRoster.js
// Pure: map an OSM roster to ground-floor commercial bay slots along a street axis.
// Confidence-gated: callers render unassigned/low-confidence bays as generic-commercial.

export function assignStorefronts(buildings, roster, { axis = "x" } = {}) {
  const commercial = buildings
    .filter((b) => b.groundFloorUse === "commercial" && b.frontage)
    .map((b) => ({ ...b, _hint: b.frontage.houseNumberHint ?? frontageMid(b.frontage, axis) }))
    .sort((a, b) => a._hint - b._hint);

  if (commercial.length === 0) return [];

  const slotCounter = new Map(); // bin → next slot index
  const bays = [];

  const ordered = [...roster]
    .filter((s) => s.name)
    .sort((a, b) => num(a.houseNumber) - num(b.houseNumber));

  for (const store of ordered) {
    const target = nearestByHouseNumber(commercial, num(store.houseNumber));
    if (!target) continue;
    const slotIndex = slotCounter.get(target.bin) ?? 0;
    slotCounter.set(target.bin, slotIndex + 1);
    bays.push({
      bin: target.bin,
      name: store.name,
      category: store.category ?? "unknown",
      slotIndex,
      sourceId: store.sourceId ?? null,
      confidence: slotIndex === 0 ? (store.confidence ?? "point-only") : "overflow",
      activeStatus: store.activeStatus ?? "unverified",
    });
  }
  return bays;
}

function num(h) { const n = parseInt(String(h ?? ""), 10); return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER; }
function frontageMid(f, axis) { return ((f.from?.[axis] ?? 0) + (f.to?.[axis] ?? 0)) / 2; }
function nearestByHouseNumber(commercial, target) {
  if (!Number.isFinite(target)) return commercial[0];
  let best = commercial[0], bestD = Infinity;
  for (const b of commercial) {
    const d = Math.abs(b._hint - target);
    if (d < bestD) { bestD = d; best = b; }
  }
  return best;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node scripts/verify-storefront-roster.mjs`
Expected: `3/3 roster checks passed`.

- [ ] **Step 5: Commit**

```bash
git add src/storefrontRoster.js scripts/verify-storefront-roster.mjs
git commit -m "feat(scaling): storefrontRoster assignment (house-number ordered, confidence-gated)"
```

---

## Phase 4 — Runtime integration (block-bbox gating + typology-aware treatment + storefront render)

> These tasks edit `src/sceneFrame.js` and `src/SceneView.jsx`. Bind every name to `recon-schemas.md`. Verification is `npm run build` + 4-angle screenshots (no unit tests for Three.js scene output). Read the current function bodies before editing.

### Task 8: Load the block extract and gate by bbox in scene assembly

**Files:**
- Modify: `src/sceneFrame.js` (the footprint-loading / radius-cull path identified in recon Step 3)

- [ ] **Step 1: Read the current assembly + cull**

```bash
grep -n "contextRadiusUnits\|CONTEXT_TREATMENT_RADIUS\|footprintRecords\|centroid\|require(\|import " src/sceneFrame.js | head -40
```
Identify (a) where footprint records are read, and (b) the distance/radius test that currently keeps/drops a footprint.

- [ ] **Step 2: Add the block extract as an additional input source**

In `assembleFranklinScene` (or its caller), after the existing 291-record load, also concat the Block A records. Follow the existing record shape from recon. Example shape of the change (adapt to the real loop):

```js
// near the top of the assembly module, alongside existing geometry imports:
import blockFranklinMilton from "./data/geometry-source/block-franklin-milton.nyc-open-geometry.v0.1.json";

// where footprint records are gathered:
const blockRecords = (blockFranklinMilton.footprintRecords ?? []).map(normalizeBlockRecord);
const allRecords = dedupeByBin([...existingFootprintRecords, ...blockRecords]);
```

Add helpers in `sceneFrame.js`:

```js
function dedupeByBin(records) {
  const seen = new Set();
  return records.filter((r) => {
    const bin = String(r.bin ?? r.sourceProperties?.bin ?? "");
    if (!bin || seen.has(bin)) return seen.has(bin) ? false : (seen.add(bin), true);
    seen.add(bin);
    return true;
  });
}

// Map the block extract's record into the same shape assembleFranklinScene expects.
// Adjust field paths to match recon-schemas.md (existing record shape).
function normalizeBlockRecord(r) {
  return {
    bin: r.bin,
    wgs84Polygon: r.wgs84Polygon,
    sourceProperties: r.sourceProperties,
    fromBlockExtract: true,
  };
}
```

- [ ] **Step 3: Replace the single radius cull with bbox-OR-radius gating**

Where the radius test drops far footprints, keep a footprint if it is within the corner radius **or** inside any loaded block bbox. Add:

```js
const BLOCK_BBOXES = [blockFranklinMilton.bbox];

function withinAnyBlockBbox(wgs84Point) {
  return BLOCK_BBOXES.some((b) =>
    wgs84Point.lon >= b.minLon && wgs84Point.lon <= b.maxLon &&
    wgs84Point.lat >= b.minLat && wgs84Point.lat <= b.maxLat);
}
```

In the keep/drop decision, change `if (withinRadius) keep` to `if (withinRadius || withinAnyBlockBbox(centroidWgs84)) keep`. (Compute the WGS84 centroid before projection, or test the projected centroid against a projected bbox — use whichever the existing code already has access to.)

- [ ] **Step 4: Verify the build and that block footprints appear**

```bash
npm run build
```
Expected: build green. Then start the dev server and confirm new massing appears north along Franklin toward Milton:
```bash
npm run dev
```
Use the preview tools: load `http://127.0.0.1:5173`, screenshot the default angle, confirm the block of new buildings is present (graybox/typological is fine at this task).

- [ ] **Step 5: Commit**

```bash
git add src/sceneFrame.js
git commit -m "feat(scaling): load Block A extract + bbox gating (new footprints survive the cull)"
```

### Task 9: Typology-aware wall treatment

**Files:**
- Modify: `src/SceneView.jsx` (`decorateTypologicalWall` + its call sites + an II-C palette map)

- [ ] **Step 1: Read the current treatment + palette**

```bash
grep -n "function decorateTypologicalWall\|II_PALETTE\|function buildBuildings\|footprintEdges\|decorateTypologicalWall(" src/SceneView.jsx
```
Note `decorateTypologicalWall`'s current signature and where buildings get classified/treated.

- [ ] **Step 2: Classify each block building at build time**

Import and apply the classifier where buildings are assembled:

```js
import { classifyBuilding } from "./buildingTypology.js";
// when building a non-hero footprint that came from a block extract (building.fromBlockExtract):
const typology = classifyBuilding({ sourceProperties: building.sourceProperties });
```

- [ ] **Step 3: Add a palette resolver and extend the wall treatment**

Add near `II_PALETTE` a mapping from `paletteFor()` keys to real palette entries (use existing II-C tones; pick distinct but restrained values):

```js
const TYPOLOGY_PALETTE = {
  "typological.brick":      II_PALETTE.contextBrick ?? "#8a6f63",
  "typological.painted":    "#b8b0a4",
  "typological.commercial": "#7f7468",
  "typological.warehouse":  "#6f6a61",
};
function resolveTypologyColor(paletteKey) { return TYPOLOGY_PALETTE[paletteKey] ?? TYPOLOGY_PALETTE["typological.brick"]; }
```

Extend `decorateTypologicalWall` to accept an optional `typology` arg and vary: base color (`resolveTypologyColor(typology.palette)`), window rows (`typology.storeyCount`), and a commercial ground-floor band when `typology.groundFloorUse === "commercial"`. Keep the existing flat-inked window/score-line idiom; only parameterize counts/colors. Preserve the current call sites (pass `undefined` typology → identical behavior to today for the existing context buildings).

- [ ] **Step 4: Verify build + visual differentiation**

```bash
npm run build
```
Expected: green. Dev server + screenshot: the new block should show varied wall tones and storey counts (not one uniform brick), and commercial-classified buildings show a ground-floor band. Compare against the prior task's screenshot.

- [ ] **Step 5: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(scaling): typology-aware wall treatment (palette/storeys/ground-floor band)"
```

### Task 10: Truthful storefront renderer (sign band + awning, no card)

**Files:**
- Modify: `src/SceneView.jsx` (storefront render + roster wiring)

- [ ] **Step 1: Wire the roster + assignment at build time**

```js
import blockStorefronts from "./data/places/block-franklin-milton-storefronts.v0.1.json";
import { assignStorefronts } from "./storefrontRoster.js";
// build a {bin → frontage} from the block buildings' Franklin-facing commercial edges (reuse footprintEdges + the
// street-axis already known to the scene), then:
const storefrontBays = assignStorefronts(blockBuildingsForRoster, blockStorefronts.storefronts, { axis: franklinAxisKey });
const baysByBin = groupBy(storefrontBays, (b) => b.bin);
```
(Provide `blockBuildingsForRoster` as `{ bin, groundFloorUse, frontage }` objects, where `frontage` is the commercial street edge with a `houseNumberHint` — derive the hint from the building's projected position along the axis if no real number exists.)

- [ ] **Step 2: Render a sign band + awning per assigned bay**

For each commercial block building, for each assigned bay (`baysByBin.get(bin)`), draw along the ground-floor commercial edge:
- a glazed base rectangle (existing storefront-base idiom if one exists; else a simple inset dark panel),
- a category-tinted awning strip,
- a **sign band with the real name** drawn to a canvas texture (II-C flat-inked: paper-tone panel, dark ink text), mapped onto a thin plane above the base.

Helper for the legible sign (canvas → texture):

```js
function makeSignTexture(name) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#efe7d6"; ctx.fillRect(0, 0, c.width, c.height);      // II-C paper
  ctx.strokeStyle = "#23201c"; ctx.lineWidth = 6; ctx.strokeRect(8, 8, c.width - 16, c.height - 16);
  ctx.fillStyle = "#23201c";
  ctx.font = "700 56px Georgia, serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(name).toUpperCase().slice(0, 18), c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 8; return tex;
}
```

Unassigned / low-confidence (`confidence === "overflow"` and no real `houseNumber`) bays: render the generic-commercial base + awning **without** a sign band (name stays in data only). **Do not wire any click handler / PlaceCard** for these bays — selection stays hero-only.

- [ ] **Step 3: Verify build + the storefronts read truthfully**

```bash
npm run build
```
Expected: green. Dev server + screenshots from all four angles: named storefronts appear on the Franklin commercial frontage; names are legible; no card opens on click (heroes still open theirs). Note how many bays got real signs vs. generic (assignment hit-rate) for the scorecard.

- [ ] **Step 4: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(scaling): truthful storefront renderer (OSM sign band + awning, no card)"
```

### Task 11: Extend the ground layer to the Milton corner

**Files:**
- Modify: scene assembly inputs to `buildGroundLayer` (data/segment extension; `src/groundLayer.js` only if a gap shows)

- [ ] **Step 1: Feed the new Franklin segment length**

Locate where `buildGroundLayer` is called and how the Franklin run length is bounded. Extend the Franklin sidewalk/roadbed run to reach the Milton corner (use the block descriptor's `streetSegments` end or the northernmost block-building extent along the Franklin axis). Greenpoint segment unchanged for Block A.

- [ ] **Step 2: Verify no ground gap**

```bash
npm run build
```
Dev server + screenshot down the Franklin axis toward Milton: sidewalk/curb/roadbed extend continuously to the block end with no gap or overshoot. If a gap appears, that's a `groundLayer.js` change (extend the run bound); otherwise data-only.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(scaling): extend Franklin ground run to the Milton corner"
```

---

## Phase 5 — Measurement (the deliverable)

### Task 12: Scorecard tool + first Block A entry

**Files:**
- Create: `scripts/score-block-build.mjs`
- Create: `docs/SCALING_LOG.md`

- [ ] **Step 1: Tag the Block A baseline**

```bash
git tag block-a-start fef5f57   # the spec commit, i.e. before Block A code; adjust to the commit just before Task 1
```
(If `block-a-start` should mark the pre-implementation point, tag the commit immediately before Task 1's first commit.)

- [ ] **Step 2: Write the scorecard tool**

```js
// scripts/score-block-build.mjs
// Usage: node scripts/score-block-build.mjs <blockId> <sinceRef>
// Prints a markdown scorecard row: data coverage + code delta since <sinceRef>.
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { classifyBuilding } from "../src/buildingTypology.js";

const [blockId, sinceRef] = process.argv.slice(2);
if (!blockId || !sinceRef) throw new Error("Usage: node scripts/score-block-build.mjs <blockId> <sinceRef>");

const geo = JSON.parse(await readFile(`src/data/geometry-source/block-${blockId}.nyc-open-geometry.v0.1.json`, "utf8"));
let sourceBacked = 0;
for (const r of geo.footprintRecords) if (classifyBuilding(r).confidence.storeyCount === "source-backed") sourceBacked++;

let stores = { recordCount: 0, addressBacked: 0 };
try {
  const s = JSON.parse(await readFile(`src/data/places/block-${blockId}-storefronts.v0.1.json`, "utf8"));
  stores = { recordCount: s.recordCount, addressBacked: s.storefronts.filter((x) => x.confidence === "address-backed").length };
} catch { /* no roster */ }

const diff = execSync(`git diff --shortstat ${sinceRef} HEAD`).toString().trim();
const filesChanged = execSync(`git diff --name-only ${sinceRef} HEAD`).toString().trim().split("\n").filter(Boolean);
const codeFiles = filesChanged.filter((f) => f.startsWith("src/") && (f.endsWith(".js") || f.endsWith(".jsx")));

console.log(`\n## Block: ${blockId}\n`);
console.log(`- Buildings: ${geo.recordCount} (storey source-backed: ${sourceBacked}/${geo.recordCount}, ${Math.round(100*sourceBacked/Math.max(1,geo.recordCount))}%)`);
console.log(`- Storefronts: ${stores.recordCount} (address-backed: ${stores.addressBacked})`);
console.log(`- Code files changed since ${sinceRef}: ${codeFiles.length} (${codeFiles.join(", ") || "none"})`);
console.log(`- Diff: ${diff}`);
console.log(`- Manual interventions: <fill in>  |  Wall-clock: <fill in>  |  4-angle screenshots: <paths>`);
```

- [ ] **Step 3: Generate the Block A entry**

```bash
node scripts/score-block-build.mjs franklin-milton block-a-start
```
Copy the output into a new `docs/SCALING_LOG.md` under a title, and fill the `<...>` fields (manual interventions count = number of times you hand-edited beyond running the recipe; wall-clock estimate; screenshot paths under `docs/review-screenshots/`).

- [ ] **Step 4: Write `docs/SCALING_LOG.md` header + Block A entry**

```markdown
# Scaling Log

Per-block scorecard for the procedural block recipe. The key signal is **new code for block N+1**:
Block B should require near-zero new module code — only a descriptor + data extracts.

<paste the Block A scorecard here, fields filled>
```

- [ ] **Step 5: Commit**

```bash
git add scripts/score-block-build.mjs docs/SCALING_LOG.md
git commit -m "feat(scaling): block scorecard tool + Block A entry"
git tag block-a-done
```

---

## Phase 6 — Block B (the replication test: run the recipe, write near-zero new code)

> Success = no edits to `buildingTypology.js`, `storefrontRoster.js`, the pull scripts, or the renderers. Only a new descriptor, new data extracts, and the two import/bbox-list lines. Every code edit here is a finding to record in the scaling log.

### Task 13: Block B descriptor + data pull

**Files:**
- Create: `src/data/blocks/greenpoint-east.block.json`
- Create (generated): `src/data/geometry-source/block-greenpoint-east.nyc-open-geometry.v0.1.json`, `src/data/places/block-greenpoint-east-storefronts.v0.1.json`

- [ ] **Step 1: Author the descriptor** (east-Greenpoint block; bbox east of the intersection along Greenpoint Ave)

```json
{
  "id": "greenpoint-east",
  "label": "Greenpoint Ave — Franklin St to Manhattan Ave (east face)",
  "bbox": { "minLon": -73.9540, "minLat": 40.7300, "maxLon": -73.9512, "maxLat": 40.7318 },
  "streetSegments": [
    { "name": "Greenpoint Ave", "from": "Franklin Ave", "to": "east" }
  ]
}
```
(Tighten the bbox to the real east block using the corner coordinates from `recon-schemas.md`.)

- [ ] **Step 2: Run both pulls**

```bash
node scripts/pull-footprints.mjs src/data/blocks/greenpoint-east.block.json
node scripts/pull-storefronts.mjs src/data/blocks/greenpoint-east.block.json
```
Expected: two new committed-ready extracts. No script edits — if a script needs changing, that's a recipe-generality finding for the log.

- [ ] **Step 3: Commit data**

```bash
git add src/data/blocks/greenpoint-east.block.json src/data/geometry-source/block-greenpoint-east.nyc-open-geometry.v0.1.json src/data/places/block-greenpoint-east-storefronts.v0.1.json
git commit -m "data(scaling): east-Greenpoint block descriptor + footprint/storefront extracts"
```

### Task 14: Register Block B in the runtime (the only expected code change)

**Files:**
- Modify: `src/sceneFrame.js` (add the import + bbox), `src/SceneView.jsx` (add roster import + assignment for the block)

- [ ] **Step 1: Add Block B to the loaded sources**

In `sceneFrame.js`: import `block-greenpoint-east...json`, add its records to the concat, add its bbox to `BLOCK_BBOXES`. In `SceneView.jsx`: import the east storefront roster and run `assignStorefronts` for the east commercial frontages (mirror Task 10's wiring; ideally factor Task 10's wiring into a small `buildBlockStorefronts(blockBuildings, roster, axis)` helper during this task so both blocks call it — note the refactor in the log).

- [ ] **Step 2: Verify build + all-angle review**

```bash
npm run build && npm run dev
```
Expected: green. Screenshots from all four angles: east-Greenpoint block shows differentiated typological massing + truthful storefronts + continuous ground, same quality bar as Block A.

- [ ] **Step 3: Commit**

```bash
git add src/sceneFrame.js src/SceneView.jsx
git commit -m "feat(scaling): register east-Greenpoint block (recipe replication)"
```

### Task 15: Block B scorecard + verdict

**Files:**
- Modify: `docs/SCALING_LOG.md`

- [ ] **Step 1: Score Block B against Block A's completion**

```bash
node scripts/score-block-build.mjs greenpoint-east block-a-done
```
The `code files changed since block-a-done` count is the replication result. Append the entry to `docs/SCALING_LOG.md`, fill the manual-fields.

- [ ] **Step 2: Write the verdict**

Add a short "Verdict" paragraph to `SCALING_LOG.md`: did Block B hit near-zero new module code? What needed hand-tuning (assignment misses, classifier gaps, ground bounds)? These become the backlog for the kit-ification in `PLAN.md` 4.2.

- [ ] **Step 3: Update `docs/PLAN.md`**

Mark Phase 4.1c progressed and link the scaling log. Note any newly discovered constraints under "Known Data Gaps."

- [ ] **Step 4: Commit**

```bash
git add docs/SCALING_LOG.md docs/PLAN.md
git commit -m "docs(scaling): Block B replication scorecard + verdict; PLAN update"
```

---

## Self-Review (completed against the spec)

- **Spec coverage:** Acquire→Task 2/3/6; Project+gating→Task 8; Classify→Task 4/5; Storefront roster→Task 6/7; Treat (walls)→Task 9; Treat (storefront)→Task 10; Ground→Task 11; Measure→Task 12/15; descriptor→Task 1/13; Block B replication→Phase 6. Truth-rule stance (confidence + `activeStatus:"unverified"` + no cards) implemented in Tasks 6/7/10. ✓
- **Schema honesty:** Phase 0 grounds all guessed field names; downstream tasks defer to `recon-schemas.md`. ✓
- **Placeholders:** the `<fill in>` items in the scorecard are runtime-observed values (manual-intervention count, wall-clock, screenshot paths) by design, not unspecified code. No code step is left as TBD. ✓
- **Type consistency:** `classifyBuilding` returns `{ storeyCount, massingClass, materialFamily, groundFloorUse, palette, confidence }` — consumed with those names in Tasks 5/9/12. `assignStorefronts(buildings, roster, {axis})` → bays `{ bin, name, category, slotIndex, confidence, activeStatus }` — consumed with those names in Tasks 7/10. ✓
- **Known soft spots (flagged, not hidden):** Task 8's keep/drop edit and Task 10's frontage-hint derivation depend on the real `sceneFrame.js`/`SceneView.jsx` internals — each task says read first and adapt. The block bbox numbers in Tasks 1/13 are estimates to tighten after the first pull.
