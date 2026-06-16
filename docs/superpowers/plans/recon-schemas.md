# Schema Recon — Confirmed Field Names & Runtime Signatures

**Author:** Claude (recon run 2026-06-16)
**Purpose:** Source-of-truth binding doc for downstream procedural-block-scaling tasks.
All field names below are confirmed from live probes or local files — not guesses.

---

## 1. Existing Footprint Record Schema

**File:** `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json`

**Top-level array key:** `footprintRecords` (confirmed via `Object.keys(d)`)

**Top-level document keys:**
```
schemaVersion, fixtureId, supersedesFixtureId, sceneId, lane, status, reviewedOn,
reviewOnly, generatedFrom, corridorScope, sources, coverageSummary,
streetCenterlineRecords, sidewalkLineRecords, footprintRecords, blockedClaims
```

**Per-record top-level keys:**
```
id, source, coverageSegmentId, geometryStatus, sourceProperties,
wgs84Polygon, scenePolygon, sceneProjectionStatus, corridorT, crossAxisOffset, claimLimit
```

**`sourceProperties` keys (exact camelCase):**
```
bin, baseBbl, mapplutoBbl, doittId, constructionYear, heightRoof,
lastStatusType, geomSource, shapeArea, shapeLength
```

**Key field paths:**
| Field | Path | Example value |
|-------|------|---------------|
| BIN | `record.sourceProperties.bin` | `"3064904"` (string) |
| BBL (base) | `record.sourceProperties.baseBbl` | `"3025660036"` |
| BBL (PLUTO join) | `record.sourceProperties.mapplutoBbl` | `"3025660036"` |
| Roof height | `record.sourceProperties.heightRoof` | `"27.88"` (string, **feet**) |
| WGS84 polygon | `record.wgs84Polygon` | Array of `{lon, lat}` objects |
| Construction year | `record.sourceProperties.constructionYear` | `"1909"` (string) |

**WGS84 polygon format:** flat array of `{lon, lat}` objects (NOT GeoJSON ring — no `[lng, lat]` tuples).
Example vertex: `{"lon": -73.954666332564, "lat": 40.729334178131}`.

**Height unit confirmed:** `heightRoof` is in **feet** (the runtime converts: `heightFeet * FEET_TO_METERS`, `sceneFrame.js:61–62`).

---

## 2. Projection Basis Fields

**File:** `src/data/franklin-intersection/greenpoint-franklin.phase-4m-r10e-scene-geometry-root-cause.v0.1.json`

**Access path:** `fixture.sceneTruthModel.projectionBasis`

**sceneTruthModel keys:** `sourceHypothesisFromR10B, mappingDecision, correctionType, oldStylizedRuntimePlacementStatus, artificialOffsetsUsedForCorrection, projectionBasis, renderingRules`

**projectionBasis fields (confirmed from live node probe):**
```json
{
  "method": "wgs84_to_franklin_local_scene_projection",
  "scaleMetersToSceneUnits": 0.075,
  "originWgs84": {
    "lon": -73.95759551445,
    "lat": 40.729886989476,
    "source": "nyc-centerline-physicalid-47237.wgs84Line[0] / nyc-centerline-physicalid-47238.wgs84Line[1]"
  },
  "greenpointAxisWgs84": {
    "westPointWgs84": { "lon": -73.959244843819, "lat": 40.729729995886 },
    "eastPointWgs84": { "lon": -73.954246485005, "lat": 40.730205703344 }
  },
  "franklinStreetGeometry": {
    "status": "bounded_review_only_derived_cross_street_missing_source_centerline",
    "basis": "perpendicular_to_greenpoint_axis_through_shared_greenpoint_endpoint",
    "notProductionTruth": true
  }
}
```

**Key bindings for pull scripts:**
- Origin: `projectionBasis.originWgs84` → `{lon, lat}`
- Scale: `projectionBasis.scaleMetersToSceneUnits` → `0.075` (scene units per meter)
- Greenpoint axis: `projectionBasis.greenpointAxisWgs84.westPointWgs84` / `.eastPointWgs84`
- Franklin axis: **derived at runtime** as perpendicular to Greenpoint (`sceneFrame.js:41`)

---

## 3. Existing Runtime Function Signatures

### 3.1 `sceneFrame.js`

**`createProjection`** (line 10):
```js
export function createProjection(projectionBasis)
// Returns { scale, project(point) → {x, z}, metersToUnits(meters) → number }
// project() maps {lon, lat} → {x, z} in scene units
```

**`assembleFranklinScene`** (line 29):
```js
export function assembleFranklinScene({
  geometrySource,          // the phase-3b JSON (has .footprintRecords)
  sceneGeometryFixture,    // phase-4m-r10e JSON (has .sceneTruthModel.projectionBasis)
  wrapFixture,             // phase-4m-r10g JSON (has .placeMappings)
  contextRadiusMeters = 130,
  facadeGroupBins = {},
})
// Returns { projection, buildings, streets, greenpointAxis, franklinAxis }
```

**Footprint loading loop** (lines 49–81 of `sceneFrame.js`):
```js
for (const record of geometrySource.footprintRecords) {
  const polygon = projectPolygon(record.wgs84Polygon, projection);
  if (!polygon.length) continue;
  const centroid = getCentroid(polygon);
  if (Math.hypot(centroid.x, centroid.z) > contextRadiusUnits) continue;
  ...
  const heightFeet = Number.parseFloat(record.sourceProperties?.heightRoof);
  const heightUnits = projection.metersToUnits(
    (Number.isFinite(heightFeet) ? heightFeet : 30) * FEET_TO_METERS
  );
```

**Radius cull** (line 53):
```js
if (Math.hypot(centroid.x, centroid.z) > contextRadiusUnits) continue;
```
`contextRadiusUnits = projection.metersToUnits(contextRadiusMeters)` where `contextRadiusMeters` defaults to `130`.
This is a **distance from the intersection origin** (not from Greenpoint or Franklin axis).
Any new block's footprints that fall outside 130 m of the origin will be silently dropped.
**The pull script for new blocks must extend this radius, or `assembleFranklinScene` must accept a larger `contextRadiusMeters`.**

**`projectPolygon`** (line 249):
- Input: `record.wgs84Polygon` (array of `{lon, lat}`)
- Output: array of `{x, z}` in scene units

### 3.2 `SceneView.jsx`

**`CONTEXT_TREATMENT_RADIUS_UNITS`** (line 70):
```js
const CONTEXT_TREATMENT_RADIUS_UNITS = 0.075 * 48; // ~48 m at 0.075 units/m
```
Context buildings within 48 m of origin get typological brick/window treatment;
beyond that they stay cheap graybox. This is a separate, tighter radius from the 130 m cull.

**`II_PALETTE`** (lines 25–50) — confirmed keys:
```js
const II_PALETTE = {
  paper: 0xeae1ce,
  street: 0xcabfa7,
  asphalt: 0x6f6a60,
  concrete: 0xb8ae99,
  scoreLine: 0x9b9079,
  ink: 0x2a241c,
  context: [0xd9cdb4, 0xcfc0a6, 0xd4c5ad, 0xc8bba4],  // 4-entry rotation for context buildings
  heroes: {
    "premier-franklin-organic": 0xa04432,
    "sonnys-corner": 0x4a4039,
    sereneco: 0x9a7e58,
    "144-franklin": 0xa85a3c,
  },
}
```
Typological wall tones usable for new block context buildings: `II_PALETTE.context[0..3]`.
Hero tones live in `II_PALETTE.heroes` keyed by `placeId`.

**`buildBuildings`** (line 854):
```js
function buildBuildings(three, scene, requestRender, isActive = () => true, addCullable = () => ({}))
// Iterates scene.buildings; hero buildings branch to buildHeroBuilding()
// Context buildings within CONTEXT_TREATMENT_RADIUS_UNITS get decorateTypologicalWall()
```

**`footprintEdges`** (line 1213):
```js
function footprintEdges(polygon, centroid)
// polygon: [{x, z}, ...] (scene units)
// Returns: [{start, end, length, normal, midpoint}, ...]
// Computes outward normals — no street-role classification (context only)
```

**`decorateTypologicalWall`** (line 1238):
```js
function decorateTypologicalWall(target, edge, height, baseColorHex, scene, lit = false)
// target: THREE.Group to append to
// edge: one item from footprintEdges()
// height: building height in scene units
// baseColorHex: integer color (from II_PALETTE.context[])
// scene: the assembleFranklinScene() return value (needs scene.projection.scale)
// lit: true for MeshLambertMaterial (context), false for MeshBasicMaterial (heroes)
```

**How the scene knows the Greenpoint vs Franklin axis** (returned from `assembleFranklinScene`):
```js
// In sceneFrame.js:40-41:
const greenpointAxis = getAxis(projectionBasis.greenpointAxisWgs84, projection);
const franklinAxis = { x: -greenpointAxis.z, z: greenpointAxis.x };
// Returned as scene.greenpointAxis and scene.franklinAxis ({x, z} unit vectors)
```

---

## 4. NYC Open Data Live Field Names

### 4.1 Building Footprints

**Resource ID `qb5r-6dgf` is DEAD** — returns `dataset.missing`.
**Working resource ID: `5zhs-2jue`** (confirmed live, dataset type, Socrata).

**URL:** `https://data.cityofnewyork.us/resource/5zhs-2jue.json`

**Confirmed field names (from live probe):**
```
the_geom, bin, doitt_id, shape_area, base_bbl, objectid, construction_year,
feature_code, geom_source, ground_elevation, height_roof, last_edited_date,
last_status_type, mappluto_bbl, shape_length
```

**Key fields:**
| Field | Column name | Notes |
|-------|-------------|-------|
| BIN | `bin` | string |
| BBL (base) | `base_bbl` | string |
| BBL (PLUTO join) | `mappluto_bbl` | string |
| Roof height | `height_roof` | number, **feet** (matches local `heightRoof`) |
| Construction year | `construction_year` | number |
| Geometry | `the_geom` | GeoJSON, **MultiPolygon** |

**`the_geom` geometry shape:**
- Type: `MultiPolygon` (NOT Polygon — must handle `coordinates[0][0]` as the outer ring)
- Coordinate format: `[[[lon, lat], [lon, lat], ...]]` (GeoJSON standard `[lon, lat]` tuples)
- `the_geom` IS returned by default (no `$select` needed)

**Sample coordinates:**
```json
"the_geom": {
  "type": "MultiPolygon",
  "coordinates": [[[
    [-73.754164524217, 40.754204205626],
    [-73.754017233458, 40.754294188849],
    ...
  ]]]
}
```

**Note on local vs live coordinate format:** The local fixture stores `{lon, lat}` objects;
the live API returns `[lon, lat]` tuples inside a MultiPolygon ring.
The pull script must convert: outer ring = `the_geom.coordinates[0][0]`, map to `{lon: c[0], lat: c[1]}`.

### 4.2 PLUTO (MapPLUTO Tabular)

**Resource ID `64uk-42ks` is LIVE** — confirmed working.

**URL:** `https://data.cityofnewyork.us/resource/64uk-42ks.json`

**Confirmed field names relevant to this project:**
| Field | Column name | Example |
|-------|-------------|---------|
| Join key | `bbl` | `"3071930057.00000000"` (string with decimals) |
| Num floors | `numfloors` | `"2.0000000"` (string) |
| Year built | `yearbuilt` | `"1960"` |
| Building class | `bldgclass` | `"C0"` |
| Land use code | `landuse` | `"2"` |
| Commercial area (sf) | `comarea` | `"0"` |
| Residential area (sf) | `resarea` | `"2120"` |
| Borough | `borough` | present |
| Block | `block` | present |
| Lot | `lot` | present |

**`the_geom`:** NOT present in PLUTO — neither by default nor via `$select the_geom` (returns `undefined`).
PLUTO has `latitude` / `longitude` (lot centroid) and `xcoord` / `ycoord` (NY State Plane ft) but NO polygon geometry.
Use Building Footprints (`5zhs-2jue`) for polygon geometry; join PLUTO by `bbl`.

**BBL join key format warning:** PLUTO returns `bbl` as `"3071930057.00000000"` (floating-point string).
Local fixture stores `mapplutoBbl` as `"3025660036"` (plain integer string).
Join script must normalize: `parseInt(pluto_bbl)` or strip the `.00000000` suffix.

---

## 5. OSM Overpass Tags

**Primary Overpass endpoint:** `https://overpass-api.de/api/interpreter` was **busy/returning runtime error** during this probe run.
**Working alternative:** `https://maps.mail.ru/osm/tools/overpass/api/interpreter` — confirmed live, returns JSON correctly.

**Query pattern:**
```
[out:json][timeout:25];
(
  node["shop"](south,west,north,east);
  node["amenity"~"restaurant|cafe|bar"](south,west,north,east);
  way["shop"](south,west,north,east);
  way["amenity"~"restaurant|cafe|bar"](south,west,north,east);
);out 50 center;
```
Use `out center` to get a lat/lon center point for way-type elements.

**Node-type storefront tags seen in Greenpoint area (confirmed):**
```json
{
  "name": "C-Town",
  "shop": "supermarket",
  "addr:city": "Brooklyn",
  "addr:housenumber": "953",
  "addr:postcode": "11222",
  "addr:state": "NY",
  "addr:street": "Manhattan Avenue",
  "opening_hours": "08:00-21:00",
  "phone": "+1-718-349-3000",
  "website": "https://..."
}
```

**Way-type storefront tags seen in Greenpoint/Franklin area (confirmed):**
```json
{
  "name": "Standards Manual",
  "shop": "books",
  "addr:housenumber": "212",
  "addr:street": "Franklin Street"
}
{
  "name": "Oxomoco",
  "amenity": "restaurant",
  "addr:housenumber": "128",
  "addr:street": "Greenpoint Avenue"
}
```

**Way-type elements** come with `center: {lat, lon}` when queried with `out center`.

**Confirmed tag keys present:**
| Key | Coverage |
|-----|----------|
| `name` | Most nodes/ways |
| `shop` | Present on shop-type elements |
| `amenity` | Present on restaurants, cafes, etc. |
| `addr:housenumber` | Often present (~60–70% of stores) |
| `addr:street` | Often present alongside housenumber |
| `addr:city`, `addr:state`, `addr:postcode` | Less consistent |
| `opening_hours` | Sparse |
| `phone`, `website` | Sparse |

**Element types:** Both `node` and `way` carry storefronts. Ways need `out center` in the query.
The pull script must handle both types and use `element.center ?? {lat: element.lat, lon: element.lon}` for positioning.

---

## Corrections vs Plan

These are places where the spec/plan (`2026-06-16-procedural-block-scaling-design.md` / plan doc) assumed names that differ from confirmed reality:

1. **Building Footprints resource ID `qb5r-6dgf` is dead.**
   Working replacement: **`5zhs-2jue`**. All pull scripts must use `5zhs-2jue`.

2. **Live footprints field `height_roof` (snake_case) ≠ local `heightRoof` (camelCase).**
   The pull script normalizes to camelCase when writing local fixtures to match `sceneFrame.js`'s expectation of `record.sourceProperties.heightRoof`.

3. **`the_geom` is `MultiPolygon`, not `Polygon`.**
   The outer ring is at `the_geom.coordinates[0][0]`, not `the_geom.coordinates[0]`.
   Coordinate tuples are `[lon, lat]` (GeoJSON), not `{lon, lat}` objects (local format).
   Pull script must convert: `ring.map(c => ({ lon: c[0], lat: c[1] }))`.

4. **PLUTO has NO geometry field.**
   The plan implied PLUTO might supply lot polygons. It does not. Use only Building Footprints for geometry; PLUTO is tabular-only, joined by `bbl`.

5. **PLUTO `bbl` is a float-formatted string (`"3025660036.00000000"`).**
   Local `mapplutoBbl` is plain integer string (`"3025660036"`). Join must normalize with `parseInt()` or string truncation before matching.

6. **Overpass primary endpoint (`overpass-api.de`) may be busy.**
   Pull script should prefer `https://maps.mail.ru/osm/tools/overpass/api/interpreter` as primary, fall back to `overpass-api.de`. Both accept the same query syntax.

7. **OSM storefronts appear as both `node` and `way` types.**
   The plan may have assumed nodes only. Way elements need `out center` in the Overpass query to get a position. The pull script must union both and read `element.center` for ways.

8. **Radius cull in `assembleFranklinScene` defaults to 130 m from origin.**
   New blocks (e.g. the next block south on Franklin) may exceed this. `contextRadiusMeters` must be passed explicitly with a larger value (e.g. 300 m) when calling `assembleFranklinScene` with the expanded footprint dataset.
