# Phase 8.1d — Ground-Floor Completion for Kit/Inked Buildings

Date: 2026-06-22
Owner: Batu (taste/approval) / Agent (execution)
Status: Design approved — implementation plan pending

## Problem

Procedurally-rendered kit/inked buildings have an unfinished street level. Three
reported defects all trace to the same ground-band code path in
`decorateInkedWall` (`src/SceneView.jsx`):

1. **Some buildings have no door.** The non-stoop residential branch
   (`SceneView.jsx:2420–2431`) draws a flat ground texture if a `ground` asset
   exists, else a flat door-stoop PNG if that asset exists, else **nothing**.
   Families without a `door-stoop` asset that also don't qualify for a 3D stoop
   (e.g. `modern-flat`) fall through and render no entry at all.
2. **Ground-floor windows aren't colored and have no recess.** The composer
   (`src/inkedFacadeCompose.js:20`) only emits windows for *upper* storeys
   (`rows = storeys − 1`); the ground floor is a single flat band. Non-stoop
   residential families therefore show a flat textured/dark band instead of the
   recessed, white-framed windows the upper floors get.
3. **Storefronts are missing.** `buildKitFacadeParams` hardcodes
   `storefront: null` (`src/buildKitFacadeParams.js:50`), so the existing
   `decorateStorefront` band renderer (`SceneView.jsx:2526`) never runs.
   Commercial buildings get only a floating sign + awning from the separate
   block-storefront system, sitting on a blank ground band — the flat dark
   rectangle seen in the field.

The stoop path (4+ storey brick, `SceneView.jsx:2376–2419`) already does the
right thing: a 3D stoop, a recessed entry door (`drawDoor`), and parlor windows
in the bay rhythm. The gap is everything that is *not* a stoop building.

## Decision

Give every kit/inked building a finished ground floor with two modes driven by
real land-use data:

- **Commercial → storefront.** Turn on the already-built storefront band for
  roster-matched commercial buildings.
- **Residential → recessed entry door + ground-floor windows**, mirroring the
  upper-floor bay rhythm.

This pass is **kit/inked buildings only** (the `decorateInkedWall` path). Hero
buildings (spec-driven) and typological far-context buildings
(`decorateTypologicalWall`) are unchanged. Building **color** (every building
the same brick tone) and **corner/cornice connection** are known, separate
issues explicitly out of scope here.

## Design

### 1. Commercial-vs-residential decision (data-driven, truthful)

A kit building's ground floor is **commercial** when the existing typology marks
it so — `classifyBuilding(...).groundFloorUse === "commercial"` already drives
`params.commercialGround` (`buildKitFacadeParams.js:43`) — **and** the storefront
roster (`assignStorefronts`, `src/storefrontRoster.js:103`) assigned it tenant
unit(s). Otherwise the ground floor is **residential**.

Ground treatment is applied only on the street / `openingsFace` (the 8.1 Task 9
exposed-face rule); party/lot-line walls stay blank. No land-use is invented —
commercial status follows the same data the sign system already uses.

**Edge case:** if a building is `commercialGround` but the roster assigned it no
tenant units (no match), it falls back to the **residential** treatment (§3) so
it still gets a finished ground floor rather than a blank band. Storefront mode
requires at least one roster unit.

### 2. Commercial ground → storefront (wire the existing renderer)

`decorateStorefront(ctx, band, storefront, params)` already renders a complete
shopfront from `storefront.units`: painted bulkhead, inked display glazing,
mullion, transom, a **recessed** door with shaded reveals, frame, and a
**category sign** in cream serif on the trim color (II-C palette). It is fully
built; it is simply never invoked because `params.storefront` is `null`.

Change: for roster-matched commercial kit buildings, populate
`params.storefront = { units }` from the roster assignment (the same per-building
unit data the block sign/awning system already consumes). `decorateStorefront`
then draws the band; the existing sign + awning systems continue to sit on top,
now over a real shopfront instead of a blank wall. Upper floors keep their
residential windows → natural mixed-use (retail base, apartments above).

**Truth:** signage stays **category labels only** ("DELI", "BAR", "PIZZA") from
the land-use/roster data — the sign renderer already does this. No invented
brand names (per the claim-monetization model: real branding only on a paid
claim).

### 3. Residential ground → composed recessed window row + entry door

Extend `composeInkedFacade` (pure, Node-testable) to emit a **ground-floor
opening row** alongside the existing `wall`/`ground`/`cornice`/`windows`:

- A row of windows in the **same bay columns** as the upper floors, sized to the
  ground-storey cell (reusing the existing `winWFrac`/`winHFrac` rhythm).
- **One bay** designated the **door bay**, carrying a door rect instead of a
  window. The door bay is deterministic: the bay whose center is nearest the
  horizontal center of the face (ties → the lower-index bay).

The renderer's non-stoop residential branch consumes this row: `drawWindow` for
each ground window and `drawDoor` for the door bay — the same true-recess code
(reveals + projecting sill) used for upper floors and the stoop path. This
**replaces** the flat `ground`-texture / flat `door-stoop`-PNG / draw-nothing
branches (`SceneView.jsx:2420–2431`) for residential kit buildings.

Because the door is now part of the composed row, **every** residential kit
building gets a recessed entry regardless of whether its family has a
`door-stoop` art asset — this is what fixes defect #1, including `modern-flat`.

**Stoop families unchanged.** Buildings that already draw a 3D stoop + parlor
windows (4+ storey brick, `wantsStoop(family) && !commercialGround`) keep that
working path. The storefront-vs-stoop mutual exclusion (`commercialGround` gates
out the stoop) is preserved.

### 4. Testing

- **Composer unit tests** (`src/inkedFacadeCompose.test.mjs`): the ground row
  emits `bays` openings with exactly one door bay and `bays − 1` windows; door
  bay is the designated bay; ground openings sit within the ground-storey band
  and don't overlap the cornice or upper rows.
- **Kit-params unit test**: a commercial building (roster unit present) yields
  `params.storefront.units`; a residential building yields `storefront: null`
  and is unaffected.
- **Mutual-exclusion test**: a commercial stoop-eligible family does not draw a
  stoop (existing `commercialGround` gate still holds).
- **Build + four-angle visual proof**: every kit building shows a door;
  residential ground windows are recessed and colored (match upper floors);
  commercial buildings show storefronts with category signs; no flat dark ground
  bands remain along the corridor.

## Non-goals

- **Not** building color / material variation (#4) — deferred to its own pass
  pending a truthfulness discussion.
- **Not** corner/cornice connection (#3) — separate geometry fix (port the hero
  miter logic to kit buildings).
- **Not** reworking the storefront *appearance* — the existing storefront system
  is reused as-is; a detail-polish pass on shopfronts is future work.
- **Not** the typological far-context path or hero buildings.
- **Not** new storefront/door **art assets** — this pass wires and composes
  existing renderers; it does not generate textures.

## Affected surfaces

- `src/inkedFacadeCompose.js` — emit the ground-floor opening row (windows +
  door bay). Pure module; gets unit tests.
- `src/buildKitFacadeParams.js` — populate `params.storefront = { units }` for
  roster-matched commercial buildings (replacing the hardcoded `null`).
- `src/SceneView.jsx` (`decorateInkedWall`, ~2368–2433) — residential non-stoop
  branch consumes the composed ground row via `drawWindow`/`drawDoor`; commercial
  branch already calls `decorateStorefront` once `params.storefront` is set.
- Roster plumbing: pass the per-building storefront unit assignment from
  `assignStorefronts` into `buildKitFacadeParams` (or the kit call site).
- Tests: `src/inkedFacadeCompose.test.mjs`, kit-params test.
