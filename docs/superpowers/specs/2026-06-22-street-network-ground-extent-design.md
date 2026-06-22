# Phase 8.1c — Street-Network-Driven Ground Extent

Date: 2026-06-22
Owner: Batu (taste/approval) / Agent (execution)
Status: Design approved — implementation plan pending

## Problem

Side streets and parts of Franklin Ave are unpaved even where buildings (BINs)
are already placed. Two structural causes:

1. **The ground layer is capped at a fixed 130m radius circle** centered on the
   Franklin × Greenpoint intersection origin. `buildGroundLayer` paves spine
   streets for a fixed `ROADBED_HALF_LENGTH_M = 150` and clamps every
   cross-street's reach to `contextRadiusMeters = 130`
   (`groundLayer.js:18,20,173,183`). Buildings from **block extracts bypass the
   matching cull entirely** (`sceneFrame.js:132`, no distance check), so the
   `franklin-north` block places 160 buildings extending ~620m to Huron St —
   far past the asphalt circle. Result: buildings standing on bare ground.

2. **No street geometry exists for the corridor north of Milton.** Only four
   cross-streets have LION centerlines today (Greenpoint Ave, Java, Kent,
   Milton). Huron / Freeman / India — and Franklin's own centerline (the
   long-standing R10E gap) — are absent, so even within range they could never
   be paved.

The 130m radius was a stand-in for "where the scene is" written before a real
street network existed; it borrowed the building cull's circle. The 8.1b
Franklin-north expansion (block extracts, always cull-exempt) shipped after the
ground layer and broke the shared-radius assumption.

## Decision

Pave by the **real street network**, not a shape. Each street is paved along its
real LION centerline for its full loaded extent. No circle, no fixed run-length.
The regional data pull defines the scene boundary; paving follows the grid and
degrades gracefully into the neighborhood's true shape (water, parks) as it
scales. Chosen over a building-bounding-box or an enlarged-circle model because
a neighborhood is a network, not a rectangle — Greenpoint is bounded by Newtown
Creek / Bushwick Inlet / the East River and broken by McGolrick & Transmitter
parks, which a box or circle would pave over. Scaling becomes a data pull, not a
geometry-logic change (the H5 repeatability story).

## Design

### 1. Core change: symmetric radius → per-street real span

Replace each street's single symmetric `halfLen` (and the circle clamp) with an
**asymmetric along-axis span `{ tMin, tMax }`** derived from the projected
centerline endpoints (`projectStreetEndpoints` already exists, `groundLayer.js:127`).

- Each street carries `{ tMin, tMax }` (real endpoints projected onto its axis)
  instead of `halfLen`.
- Generalize `bandPolygon`, `edgeLine`, `axisSegments`, the crossing-gap helper,
  and the crosswalk loop to use `[tMin, tMax]` instead of `[-halfLen, halfLen]`.
  The crossing-gap logic is already generic across all streets — it only needs
  the new bounds.
- **Delete `contextRadiusMeters`, `contextRadiusUnits`, the radius gate
  (`groundLayer.js:173`), and the circle clamp (`groundLayer.js:183`)
  entirely.** No circle anywhere in the ground layer.

This is the heart of the change; the rest is data and plumbing.

### 2. Unify spine + cross-streets into one centerline-driven builder

Greenpoint + Franklin are currently hand-built as `spine` (`groundLayer.js:25–44`)
while cross-streets come from records (`buildCrossStreets`, line 154). Under the
new model both are the same object: a street with a real centerline and a real
extent. Generalize into one `buildStreets` consuming all
`streetCenterlineRecords`, preserving two special cases:

- **Greenpoint Ave** stays the perpendicular reference axis (real record exists).
- **Franklin** is the spine through origin. If the LION pull (§3) returns a real
  Franklin centerline, it becomes an ordinary real street and the R10E
  "Franklin has no centerline" gap closes (approved: close it opportunistically).
  If not, Franklin stays `derived: true` and its extent is derived from the span
  of cross-streets it intersects (southernmost to northernmost crossing + a
  margin) rather than a fixed 150m.

### 3. Data: scripted LION pull for the corridor

Follow the proven building-pull pattern (descriptor → scripted LION `inkn-q76z`
pull → intake into a geometry-source packet):

- One new pull over the Franklin-north corridor bbox (Greenpoint Ave → Huron)
  returning Huron, Freeman, India, Kent, Java, Milton, Greenpoint **and
  Franklin** centerlines.
- Intake into a geometry-source packet the ground layer reads, extending the
  existing `streetCenterlineRecords` shape so `groundLayer.js` needs no new
  parsing. Multi-segment records split east/west of Franklin are already merged
  by `projectStreetEndpoints` — no new geometry handling required.

### 4. Decouple from the building cull — explicitly

Remove the coupling comment + shared default at the call site
(`SceneView.jsx:222–232`). The building cull in `sceneFrame.js` is **left
untouched** (approved: ground-only decouple this pass) — block extracts already
bypass it, so buildings render regardless; the ground now matches them because
it follows the same regional street network, not a circle. The two systems are
no longer secretly coupled. Whether the cull radius should also grow is a
separate, later decision.

### 5. Testing

- **Node verifier** (extend the existing ground verifier): every loaded
  cross-street appears as a roadbed; each street's paved span matches its
  projected centerline endpoints (±tolerance); crossing gaps land at real
  intersections; no pavement extends past a street's real ends; curbs stay
  outside frontages.
- **Build + four-angle screenshots**: no bare-ground buildings remain along the
  corridor; crosswalks land at the new intersections.

## Non-goals

- **Not** changing the building-cull *semantics* — heroes/context still cull by
  radius; only the ground decouples.
- **Not** neighborhood-wide — scope is the currently-loaded corridor (the three
  blocks: franklin-milton, greenpoint-east, franklin-north). The model *enables*
  neighborhood scale; this task only paves what's loaded.
- **Not** pavement/sidewalk detail, water/park boundary clipping, or roof detail
  — all remain deferred per the locked roadmap.

## Affected surfaces

- `src/groundLayer.js` — core geometry change (span model, unified builder,
  radius removal).
- `src/SceneView.jsx` (~222–232) — call-site cleanup; decouple comment removed.
- `scripts/pull-*.mjs` (new corridor street-centerline pull, descriptor-driven).
- `src/data/geometry-source/` — new/extended centerline packet.
- Ground verifier script + ground-layer tests.
