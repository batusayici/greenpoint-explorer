# Phase 8.1d — Ground-Floor Completion + Frontage Accuracy for Kit/Inked Buildings

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

4. **Frontage is inaccurate — some street faces are blank wall.** The kit path
   picks a *single* `streetIndex` and puts windows only on that face and faces
   parallel to it; every perpendicular face is treated as a party wall and left
   blank (`SceneView.jsx:1480–1495`). Two failures result: (a) **corner lots**
   that genuinely front two streets (e.g. Franklin × a side street) show a blank
   brick wall on the second frontage; (b) **side-street buildings** whose true
   frontage is perpendicular to Franklin can have their openings land on the
   wrong face, presenting wall to the street. The hero (INKED_FACADE_REAL) path
   already solves the corner case — `inkedParams.corner` finds a second street
   edge (`inkedCornerSecondEdgeIndex`) and miters the cornice at the shared
   corner (`SceneView.jsx:1498–1513`) — but the kit path does not use it
   (`miter` is hardcoded `null`, the same gap as the deferred corner-connection
   issue).

## Decision

Give every kit/inked building a finished ground floor with two modes driven by
real land-use data:

- **Commercial → storefront.** Turn on the already-built storefront band for
  roster-matched commercial buildings.
- **Residential → recessed entry door + ground-floor windows**, mirroring the
  upper-floor bay rhythm.
- **Accurate frontage:** openings (windows + ground treatment) land on every
  face that truly fronts a street, including **both** frontages of a corner lot.

This pass is **kit/inked buildings only** (the `decorateInkedWall` path). Hero
buildings (spec-driven) and typological far-context buildings
(`decorateTypologicalWall`) are unchanged. Building **color** (every building
the same brick tone) is a known, separate issue out of scope here. The broad
**corner-connection** fix (the wall-skin offset gap at corners) also stays out
— *except* the cornice miter at a wrapped corner, which corner wrap requires and
this pass therefore includes.

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

### 4. Accurate frontage + corner wrap

Generalize the kit face-selection from one street face to the **set of faces
that front a street**, mirroring the machinery the hero path already uses:

- **Identify street frontages.** An exposed face is a street frontage when it
  faces a street centerline running parallel to it (the existing
  `pickStreetFrontEdge` test, now run over `scene.streets` — which since 8.1c
  includes the full corridor network, not just Franklin). A corner lot yields
  **two** such faces (e.g. one parallel to Franklin, one parallel to the side
  street); a mid-block lot yields one. The existing fallbacks
  (`inkedFrontEdgeIndex` → most-open exposed edge) remain for buildings no
  street parallels.
- **Windows wrap all street frontages.** Each street frontage gets the upper-
  floor window grid (and the ground-floor row from §3); faces parallel to a
  frontage keep windows as today; perpendicular non-street faces (true party /
  lot-line walls) stay blank.
- **Ground treatment on the primary frontage.** The entry door (residential) or
  storefront (commercial) goes on the **primary** frontage, chosen
  deterministically: the street frontage whose street has the greatest recorded
  width (`streetWidth`); ties broken by the longer exposed frontage length, then
  lower edge index. The secondary frontage gets windows only. One entrance per
  building this pass; a wrapped corner storefront is future polish.
- **Cornice miter at the wrapped corner.** When two frontages meet at a shared
  convex corner, compute the miter for both faces (reusing `sharedEndpoint` +
  the `miter = {start,end}` logic the hero path runs at `SceneView.jsx:1505–1511`)
  so the cornice closes across the corner instead of leaving the notch. This is
  the slice of the corner-connection issue that corner wrap forces; the broader
  wall-skin corner offset gap remains a separate pass and its seam may still be
  faintly visible until then.

This replaces the single-`streetIndex` selection (`SceneView.jsx:1480–1495`) with
a street-frontage **set** + per-face miter, structured like the hero branch
(`1498–1513`) rather than a parallel re-implementation.

### 5. Testing

- **Composer unit tests** (`src/inkedFacadeCompose.test.mjs`): the ground row
  emits `bays` openings with exactly one door bay and `bays − 1` windows; door
  bay is the designated bay; ground openings sit within the ground-storey band
  and don't overlap the cornice or upper rows.
- **Kit-params unit test**: a commercial building (roster unit present) yields
  `params.storefront.units`; a residential building yields `storefront: null`
  and is unaffected.
- **Mutual-exclusion test**: a commercial stoop-eligible family does not draw a
  stoop (existing `commercialGround` gate still holds).
- **Frontage selection test**: face-selection returns the correct street-frontage
  set — one face for a mid-block lot, two perpendicular faces for a corner lot,
  the primary frontage flagged for ground treatment, and a miter computed for
  each wrapped corner face. (Test the pure selection helper, not the renderer.)
- **Build + four-angle visual proof**: every kit building shows a door;
  residential ground windows are recessed and colored (match upper floors);
  commercial buildings show storefronts with category signs; no flat dark ground
  bands remain; **no kit building presents a blank wall to a street it fronts**,
  including Franklin-corner and side-street lots; wrapped-corner cornices close.

## Non-goals

- **Not** building color / material variation — deferred to its own pass
  pending a truthfulness discussion.
- **Not** the broad corner-connection fix (the wall-skin offset gap at every
  kit corner) — separate pass. *Exception:* the cornice miter at a wrapped
  street corner is included here because corner wrap requires it (§4).
- **Not** a wrapped-corner storefront — corner commercial lots get the storefront
  on the primary frontage + windows on the secondary; wrapping the shopfront
  around the corner is future polish.
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
- `src/SceneView.jsx` (kit branch of `buildBuildings`, ~1457–1495) — replace the
  single-`streetIndex` selection with a street-frontage **set** + per-face miter,
  reusing `pickStreetFrontEdge`, `inkedCornerSecondEdgeIndex`/`sharedEndpoint`,
  and the miter logic from the hero branch. Extract the street-frontage selection
  into a pure helper so it can be unit-tested without Three.js.
- Roster plumbing: pass the per-building storefront unit assignment from
  `assignStorefronts` into `buildKitFacadeParams` (or the kit call site).
- Tests: `src/inkedFacadeCompose.test.mjs`, kit-params test, frontage-selection
  helper test.
