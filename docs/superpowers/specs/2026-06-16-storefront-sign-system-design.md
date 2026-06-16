# Storefront Sign System — Design

Date: 2026-06-16
Status: Approved (Batu), ready for implementation plan
Phase context: Phase 4.2 kit-hardening / scaling polish debt. Addresses the
#1 recurring finding in `docs/SCALING_LOG.md` (Block A + Block B): storefront
names do not carry at iso zoom.

## Problem

Storefront signs are currently flat painted bands **coplanar with the facade**
(`SceneView.jsx` ~lines 1032–1061): a ~0.35-storey band sitting 0.02 units proud
of the wall, on the ground storey. At the fixed isometric angle a wall-parallel
band is seen nearly edge-on and is routinely occluded by neighboring masses, so
names — the thing that actually makes a block recognizable — read weakly or not
at all. This is kit debt: it affects all 92 current buildings and every future
scaled block.

## Goal

A storefront **sign system** that assigns sign idioms per storefront by a
believable category rule, so an extended block reads varied and alive (not one
repeated treatment, not cluttered), and names carry from all four iso angles.

This batch ships the two highest-leverage idioms. Two more are designed here as
fast-follow.

## Idiom palette (full system)

| Idiom | Role | This batch? |
|---|---|---|
| **Raised/enlarged flat band** | Baseline — every commercial bay | YES |
| **Projecting blade sign** | Perpendicular panel; the occlusion fix | YES |
| Awning-valance name | Name on the sloped awning flap (food trades) | Fast-follow |
| Ghost upper-wall lettering | Faded painted wall sign, heroes/landmarks only | Fast-follow |

## Assignment rule (anti-clutter engine)

Category-driven, mirroring how real streets self-organize. Blade and awning are
mutually exclusive, so no shop stacks every idiom.

| Storefront category | Idioms (this batch) |
|---|---|
| every commercial bay | raised band |
| bar / pub / barber / hairdresser | raised band **+ blade** |
| cafe / deli / restaurant / convenience | raised band (awning-name = fast-follow) |
| hero / landmark building | raised band (ghost = fast-follow) |

Result this batch: ~1-in-4 shops carry a blade (the "loud trades"); the rest
carry an upgraded band. Density is self-limiting by category, not by a tuning
pass.

Category source: the storefront's OSM category / `storefrontRoster` tag, same
field that already drives `AWNING_TINT` in `SceneView.jsx`.

## Architecture

### New module: `src/storefrontSigns.js` (pure, Node-runnable)

Same idiom as `groundLayer.js` / `buildingTypology.js`: data in, plain geometry
descriptors out, **no Three.js import**, fully unit-testable.

```
planStorefrontSigns({ building, bays, faceFrame, classification, isHero, scale })
  -> SignPlacement[]

SignPlacement =
  | { kind: 'band',  name, cx, width, y0, y1, off }
  | { kind: 'blade', name, cx, mountY, project, panelW, panelH, off, faceFrame }
```

- `band`: the existing flat-band rect, enlarged (taller type, bolder) and given
  real depth at render time (proud box vs. a single quad).
- `blade`: a double-sided panel perpendicular to the facade. Mounted at
  `mountY ≈ 0.85` of the ground storey, projecting `project ≈ 0.4–0.5` scene
  units into the street, with a thin ink bracket arm back to the wall. Because
  the panel normal is parallel to the wall (perpendicular to the facade plane),
  at least one face catches every iso angle and the panel pokes past neighbors.

The module receives the already-chosen street `faceFrame` (the nearest-edge
logic at `SceneView.jsx:995–1021` stays where it is — sign planning consumes its
output, it does not re-derive the street face).

### Thin renderer: `buildStorefrontSigns(three, placements)` in `SceneView.jsx`

Replaces the inline sign geometry (~lines 1032–1061). Walks placements:
- `band` → proud box (or quad + thin side faces) with `makeStorefrontSignTexture(name)`, U-flipped exactly as today (the 2026-06-15 mirror fix, commit `9f6ff2b`, must be preserved).
- `blade` → two opposed textured quads (double-sided panel) + a thin dark bracket arm; reuses `makeStorefrontSignTexture`.

II-C flat-inked material (`MeshBasicMaterial`, transparent, as today). Sign
meshes parent under the building/wall group so they inherit the existing
per-view culling (no new culling logic).

## Data flow

```
storefrontRoster (bays + category)            existing
  + building classification (buildingTypology) existing
  + chosen street faceFrame                     existing (nearest-edge logic)
        │
        ▼
planStorefrontSigns()                           NEW pure module
        │  SignPlacement[]
        ▼
buildStorefrontSigns(three, placements)         NEW thin renderer
        │
        ▼  meshes parented under building group → inherit per-view culling
```

## Testing

- Unit tests for `planStorefrontSigns` (Node, no Three.js):
  - every commercial bay yields exactly one `band`.
  - a bar/barber bay additionally yields one `blade`; a cafe/deli does not (this batch).
  - blade `project` and `mountY` within expected ranges; blade `faceFrame`
    normal is perpendicular to the band's plane.
  - no bay yields more than one of {blade, awning} (mutual exclusion).
  - non-commercial bays yield no signs.
- In-engine verification: rotate through all four iso angles; confirm blade
  names are readable and not edge-on; confirm the U-flip fix still holds (names
  not mirrored). Screenshot proof at ≥2 angles.
- `npm run build` green.

## Non-goals (explicit)

- Awning-valance name printing and ghost upper-wall lettering — designed above,
  deferred to a fast-follow batch.
- Re-deriving which edge is the street face — unchanged.
- Sign content/truth (names come from the existing roster; truth pass is Phase 5.4).
- The OSM dedup-by-proximity finding — separate scaling-debt item.

## Risks

- **Blade clutter at dense commercial runs.** Mitigated by category gating
  (~1-in-4). If still busy, the gate is a one-line category-set change.
- **Blade vs. awning z-fighting / overlap** where a shop is both food and a
  loud trade — prevented by mutual exclusion in the assignment rule.
- **Per-view culling** must include blades; since they parent under the building
  group this is inherited, but verify blades don't vanish at the angle that
  reveals their street face.
