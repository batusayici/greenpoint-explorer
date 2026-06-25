# Structural Depth Pass — Sequencing Design

Date: 2026-06-21
Status: Design — pending Batu spec review
Topic: When/where to address fire-escape depth, stoop depth, basement areaways, and props relative to spine fan-out (Phase 8.1).

## Problem

Four field-logged items (Batu, 2026-06-21) need a home in the roadmap *before* the spine fans out:

1. **Fire escapes** — must have depth, not flat. Key to the Brooklyn look.
2. **Stoops** — must have depth (texture surface is fine on real geometry). Key to the 3D feel.
3. **Basement floors / areaways** — half-stairs descending to a basement or side door under the stoop, abundant in Greenpoint. Reference to be supplied.
4. **Props** — important, but a separate plan step.

## Decision (locked with Batu, 2026-06-21)

- **Kit-first, gated on the pilot.** Fire escapes + stoops are parametric kit components (build-once, instance-everywhere). Build their depth into the kit, prove on the 4-BIN pilot, Batu-gate from all four angles, *then* fan out. The spine never renders flat; zero retrofit. (Rationale: their own anti-entropy principle — retrofitting depth across 50+ already-placed buildings is the expensive path — plus these *are* the recognition bar, so a flat spine fails the four-angle acceptance test.)
- **Basement is its own ref-gated mini-design.** It touches the building↔ground interface (`groundLayer.js` + base massing), not just the facade plane. It gets a separate design once reference photos arrive, and does **not** block fire escapes/stoops.
- **Fire-escape depth approach decided at build time.** Prototype shallow-relief-plus-inked-lattice vs. full-3D-lattice on one pilot BIN during the pass; the gate picks. (Shallow relief is the a-priori favorite for the II-C flat-inked idiom + draw-call budget, but not locked.)
- **Props stay out of this work** — untouched, separate track (Phase 9-era). `streetFurniture.js` already exists from Phase 3.1.

## Roadmap insertion

### Phase 8.0 — Structural Depth Signature Pass (NEW, kit-first, gates 8.1)

Inserted before the 8.1 fan-out. Widens the existing 4-BIN pilot's job to include depth, rather than fanning out flat.

- **8.0.1 Fire-escape component.** Extruded depth standing proud of the front face, keyed to family + floor count: prewar-brick / brownstone families above a storey threshold only; front street frontage; never on storefront ground floor or modern/flat families. Inherits the existing per-view culling so it disappears correctly when the camera rotates behind the wall. **Sub-spike:** prototype shallow-relief vs. full-lattice on one BIN; gate picks the approach.
- **8.0.2 Stoop component.** Real depth geometry — raised platform + steps + cheek walls — keyed to door position + residential families (rowhouse / brownstone / brick). Mutually exclusive with storefront ground floor (per the kit-facade-face rule). The flat clapboard `door-stoop` texture becomes the *surface* on real geometry, not a substitute for it. Base is authored **basement-aware** so 8.5 can slot an areaway underneath without re-cutting the stoop.
- **8.0.3 Gate (Batu).** The 4 pilot BINs rendered with depth, judged from all four angles against the Brooklyn-look bar. Proceed to 8.1 only on pass.

**Pilot adequacy (verified 2026-06-21):** the existing `KIT_PILOT_BINS` already exercise both elements with a negative control — 3064677 (3-st brick rowhouse, stoop), 3064605 (3-st clapboard rowhouse, classic wood stoop), 3064541 (4-st 1896 brownstone — the fire-escape exerciser + stoop), 3398449 (4-st 2014 modern-flat — negative control, no stoop/escape). Gap: no 5–6-storey tenement (the prototypical fire-escape building); the brownstone is a sufficient first exerciser. No pilot swap needed.

### Phase 8.1 — Spine fan-out (UNCHANGED, now inherits depth)

No edit to scope. Because depth lands in the kit at 8.0, every building the spine places inherits fire escapes/stoops automatically — the entire payoff of kit-first.

### Phase 8.5 — Basement / Areaway mini-design (NEW, ref-gated, non-blocking)

Its own deep-module change: half-stairs descending below grade, areaway under the stoop, side door — touching `groundLayer.js` and base massing. **Blocked on Batu's reference photos.** Does not block 8.0 or 8.1; lands as a fast-follow. Slots under the basement-aware stoop base authored in 8.0.2.

## Out of scope (this design)

- **Props** — deferred/separate track (Phase 9-era).
- Roof detail, pavement/sidewalk detail — already in the LATER bucket.
- The geometry/material implementation detail of each component — authored at build time (8.0) and for basements after reference arrives (8.5); this doc fixes only sequencing + scope boundaries.

## Why this ordering serves the thesis

Mirrors the locked roadmap principle — "don't fill the neighborhood and then add content; dress the spine with craft and content at once." Structural depth is craft that *is* the recognition layer; building it into the kit before fan-out keeps container and craft from competing, exactly where the spine's landmarks and stories will live.
