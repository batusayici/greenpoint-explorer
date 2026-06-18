# Phase 6.2 — Visual-System Contract (the consistency engine)

Status: Proposed (awaiting Batu approval)
Parent: `docs/PLAN.md` → Phase 6 → 6.2
Date: 2026-06-18

## Goal

Convert `ART_DIRECTION.md` from prose into **machine-checkable law** before scaling.
Phase 7 multiplies the kit by 4 material families; Phase 8 multiplies by N buildings.
Whatever drift exists now gets multiplied. 6.2 makes drift a build failure instead of a
review-time catch (the white-sign-panel / white-window class of miss).

This is consolidation + enforcement over things that already half-exist:
- `II_PALETTE` exists but is trapped inside `SceneView.jsx` (not importable by Node or kit).
- ~68 raw `0x` literals in `SceneView.jsx`, 11 in `facadeAssembly.js`, more elsewhere.
- `visualTier` exists in the registry but nothing reads it to pick treatment.

## Locked decisions (Batu, 2026-06-18)

1. **Gate scope = all src color literals.** Every `0x`/hex in `src` must resolve to a
   token. Intentional exemptions go in an explicit, documented allowlist — no silent passes.
2. **Visual gate = committed baseline + pixel diff.** Per-material baseline PNGs committed;
   CI fails on diff beyond threshold. Baselines re-approved deliberately on intended changes.
3. **Tier binding = declarative map, code reads it.** `tier × material → {components, params}`
   table; `SceneView`/kit look it up instead of branching inline.
4. **Two token registries.** 3D scene tokens (`0x`, `palette.js`) and UI/CSS tokens
   (CSS variables) are parallel sets, not forced into one module.
5. **Dead files deleted, not tokenized.** `PlaceholderWorld.jsx` + `placeholderScene.js`
   verified unreferenced → removed (shrinks gate surface honestly).

## Execution

### 6.2.1 — Palette token module
- 6.2.1.1 Create `src/visualSystem/palette.js` — Node-importable, zero-dep. Move `II_PALETTE`
  out of `SceneView.jsx`; every scene color named once.
- 6.2.1.2 UI token set: CSS variables for DOM chrome (buttons, cards, rgba) sourced from the
  II-C palette tile — parallel registry, documented alongside scene tokens.
- 6.2.1.3 Delete `src/PlaceholderWorld.jsx` + `src/placeholderScene.js` (verified unreferenced).
- 6.2.1.4 Migrate the scene-render path to import tokens: `SceneView.jsx`, `facadeAssembly.js`,
  kit modules, then `Phase4BRuntimePreview.jsx` and `FranklinHeroCorner.jsx`. No raw literals
  remain except allowlisted dev-only (`FacadeRecessEditor.jsx`).
- 6.2.1.5 Tests: token module unit tests; `npm run build` green; in-engine render unchanged
  (byte-compare or visual check NE view).

### 6.2.2 — Component inventory + tier binding
- 6.2.2.1 Document the inventory: kit pieces × material family × variant × tier, each mapped to
  the module that renders it (`docs/COMPONENT_INVENTORY.md` or a data table).
- 6.2.2.2 Declarative treatment map (`src/visualSystem/treatmentMap.js` or `.json`):
  `tier × material → {components, params}`.
- 6.2.2.3 Wire `SceneView`/kit to read `visualTier` from `curationTiers.js` and resolve
  treatment via the map (absorbs the deferred 6.1 wiring). Removes inline treatment branching.
- 6.2.2.4 Tests: tier resolution unit tests; in-engine parity for the 11 heroes + typological default.

### 6.2.3 — Conformance gate
- 6.2.3.1 Color-token check (`scripts/verify-visual-conformance.mjs`): scan `src`, fail on any
  color literal not resolving to a token; honor the documented allowlist. Loud failure output.
- 6.2.3.2 Per-material baseline harness: render each material family to a canonical building,
  commit baseline PNGs, fail on pixel diff > threshold. Brick baseline now; designed for 4 families.
- 6.2.3.3 Assert all rendering routes through the kit (no ad-hoc per-building color/treatment).
- 6.2.3.4 Wire into the verify flow; document the re-baseline procedure.

## Sequencing
- 6.2.1 must fully land before 6.2.3.1 is meaningful (gate is only true once tokens are the
  single source).
- 6.2.2 may overlap 6.2.1's tail.
- 6.2.3 last.

## Acceptance (Batu)
- Zero raw color literals in src outside the documented allowlist; gate enforces it.
- A building's treatment is fully determined by `visualTier` + material via the map — no
  per-building code tuning.
- Per-material baseline diff catches an intentional palette change as a failure.
- `ART_DIRECTION.md` no-miss rules are now enforced by code, not vigilance.
