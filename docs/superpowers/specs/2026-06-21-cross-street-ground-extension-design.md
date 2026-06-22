# Cross-Street Ground Extension — Design

**Date:** 2026-06-21
**Branch:** feat/inked-facade-look
**Status:** Approved (design phase)

## Goal

Extend the ground layer beyond the Franklin × Greenpoint "X" by adding the
source-backed cross-streets that run off Greenpoint Ave, so that buildings
showcased along the spine have road, curb, and sidewalk beneath their
street-facing frontage. This unblocks two things:

1. **Facade-to-curb alignment validation** — confirm each building's
   street-facing facade sits correctly on its sidewalk band (not floating, not
   bleeding into asphalt).
2. **Visual scene completeness** — the corridor reads as a connected block grid
   instead of two crossing roads with buildings on bare ground.

## Truth & scope decisions (locked)

- **Source-backed only.** Build cross-streets only from geometry present in the
  current NYC Open Data packet. Streets not in the data window (Oak St, Calyer
  St, Noble St — including the 137 Oak "Haunted House") are **omitted, not
  invented**. No derived stubs for them this pass.
- **Include all source-backed crossers** within reach — narrow streets (Kent,
  Java, Milton) and wide avenues (West St, Manhattan Ave) alike. Completeness is
  free and stays truthful.
- **Reach matches the context radius (~130m).** No asphalt extends past where
  buildings are already culled.

## Data foundation

Confirmed in
`src/data/geometry-source/raw/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry.phase-3b.raw.json`:

- `responses.streetCenterline` — 2 records, both GREENPOINT AVE (the only true
  centerline records).
- `responses.sidewalkLine` — 13 records carrying `MultiLineString` geometry,
  `full_stree`, and `st_width` for: GREENPOINT AVE, FRANKLIN ST, MILTON ST,
  WEST ST, MANHATTAN AVE, KENT ST, JAVA ST (block-segmented; multiple records
  per street).

**Verified:** a GREENPOINT sidewalkLine vertex
`[-73.9575942, 40.7298787]` matches the GREENPOINT centerline vertex
`[-73.9575955, 40.7298869]` to ~1m. The `sidewalkLine` records **trace street
centerlines**, not curb edges (consistent with the existing comment in
`groundLayer.js`). Therefore cross-streets can be positioned and oriented
directly from their projected `sidewalkLine` geometry.

## The core change

Today `buildGroundLayer` (`src/groundLayer.js:20`) is hardwired to exactly two
streets that cross at the origin. The corner-clipping model assumes a single
crosser:

- `otherHalf(s)` = `streets.find(o => o.id !== s.id).halfWidth`
- `axisSegments(halfLen, gap)` removes exactly one gap at `t ≈ 0`.

The change generalizes this to an N-street list with real positions and
multi-gap clipping. Franklin folds from a special case into a normal (still
`derived: true`) list member.

### 1. Streets become a general, real-positioned list

A street goes from "axis through origin" to a positioned segment:

```
{ id, name, derived, center, axis, perp, halfWidth, halfLen }
```

- **Greenpoint** and **Franklin**: built as today (Greenpoint from its real
  centerline; Franklin derived through the origin).
- **Cross-streets**: for each unique `full_stree` in `sidewalkLineRecords`
  other than Greenpoint/Franklin:
  - Project and merge its block segments into a single polyline.
  - `axis` = projected line direction; `perp` = normal.
  - `center` = the street's intersection point with Greenpoint's centerline.
  - `halfWidth` = `metersToUnits(st_width_ft * FEET_TO_METERS / 2)` from the
    real recorded width.

### 2. Selection rule (truth + scope)

Include a cross-street iff:

- it is source-backed (present in `sidewalkLineRecords`), **and**
- its intersection with Greenpoint's centerline lies within the context radius
  (`contextRadiusMeters`, default 130m) of the origin.

A street whose centerline does not intersect Greenpoint within the scene, or
whose width record is missing, is skipped (logged, not invented).

### 3. Reach clamped to the context circle

For a cross-street whose Greenpoint intersection is distance `d` (units) from
the origin, set:

```
halfLen = sqrt(contextRadiusUnits² − d²)
```

so the street exits exactly where the context-culling circle ends. No floating
asphalt past the build boundary. (Greenpoint and Franklin keep their existing
`ROADBED_HALF_LENGTH_M` reach.)

### 4. Corner-clipping: single-gap → multi-gap

Generalize the gap subtraction:

```
axisSegments(halfLen, gaps[])  // gaps = [{ t0, t1 }, ...]
```

Subtract every crossing roadbed interval from `[−halfLen, halfLen]`, returning
the remaining ordered segments (N crossings → up to N+1 segments). Applied to
both sidewalks and curbs.

- **Greenpoint** now has a gap at each cross-street intersection (was: one gap
  at Franklin).
- **Each cross-street** has one gap where it meets Greenpoint.
- The crossing interval for a street pair is derived from the other street's
  `halfWidth` projected onto this street's axis at the intersection.

### 5. Crosswalks at every real intersection

`crosswalks` emits one stripe band per real street-pair intersection on the
appropriate approach side, instead of only at the origin. Stripe geometry
(`crosswalkStripes`) is unchanged; only the set of emission points grows.

### 6. Downstream untouched

`buildGround()` in `src/SceneView.jsx` already iterates
`ground.roadbeds / sidewalks / curbs / crosswalks` arrays — more entries simply
render. Y-layering (`Y.roadbed/sidewalk/crosswalk/score`), the II palette
(`asphalt/concrete/curbStone/crosswalkPaint`), and `addSidewalkScoreLines` are
unchanged. Derived streets continue to use `*Derived` palette tones and the
slightly-lower roadbed Y.

## Module boundaries

All new logic lives in `src/groundLayer.js` (pure, no Three.js, Node-runnable).
`sceneFrame.js` already projects geometry and supplies `projection`,
`greenpointAxis`, `franklinAxis`, and `geometrySource`; it gains the projected
cross-street centerlines in the `geometrySource` it passes (or `groundLayer`
reads `sidewalkLineRecords` directly, mirroring how it already reads them for
Franklin's width). Preference: keep projection in `sceneFrame`/`groundLayer`
exactly as today — no new module.

## Testing (TDD, Node)

`groundLayer.js` is pure, so each piece is unit-testable against a fixture:

1. **Street list** — from a fixture packet, the expected set of source-backed
   crossers within radius is produced; out-of-window streets are absent.
2. **Selection rule** — a street intersecting Greenpoint beyond the context
   radius is excluded; a width-less record is skipped.
3. **Reach clamp** — `halfLen` equals `sqrt(contextR² − d²)` for a known `d`.
4. **Multi-gap segments** — `axisSegments(halfLen, [g1, g2])` yields the
   correct 3 ordered spans; degenerate/overlapping gaps collapse safely.
5. **Intersection projection** — a cross-street's `center` lands on Greenpoint's
   centerline within tolerance.

Existing single-crosser tests are **updated to the generalized form** (e.g.
`axisSegments` now takes a gap list), not special-cased.

## Risks

- **Multi-gap refactor ripples into existing tests.** Mitigation: update the
  existing `groundLayer` tests to the generalized signatures in the same pass.
- **sidewalkLine block-segment merging.** Streets appear as multiple records;
  must merge into one ordered polyline before deriving axis/intersection.
  Mitigation: covered by the street-list test.
- **Near-parallel intersection** (a crosser nearly parallel to Greenpoint).
  Mitigation: selection rule requires a real intersection within radius;
  near-parallel lines fail the within-extent check and are skipped.

## Out of scope

- Pulling Oak/Calyer/Noble (widening the NYC Open Data fetch) — a separate
  data-acquisition pass.
- Any change to building placement, facade classification, or culling radius.
- Mid-block driveways, street furniture, lane markings beyond crosswalks.
