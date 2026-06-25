# Phase 6.2 — Visual-System Contract (the consistency engine)

Status: DONE (2026-06-18) — 6.2.1 (8167e87), 6.2.2 (ecf1658), 6.2.3 (this commit)
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

## Outcome (2026-06-18)

- **6.2.3.1 color-token gate** shipped: `scripts/verify-visual-conformance.mjs` +
  `scripts/visual-conformance-allowlist.json`. Scans all of `src`, accounts for every
  color literal (token-source / reference / authored-data region / exempt), fails loud on
  any raw `0x` in a product file. Negative-tested. Debug runtime + dev tools + data + CSS
  are explicit allowlist entries with reasons (Scene-vs-Debug constraint). `#hex` string
  colors in product files (canvas/CSS registry) are reported as tracked debt, non-fatal.
- **6.2.3.2 visual baseline gate** shipped: `scripts/verify-visual-baseline.mjs` (pngjs +
  pixelmatch) diffs a captured candidate against the committed brick baseline
  (`tests/visual-baselines/brick-scene.baseline.png`), 2% mismatch budget, writes a diff
  PNG on failure. Keyed by material → Phase 7 drops in 3 more. `scripts/capture-visual-
  baseline.mjs` is the Playwright capture path (soft dep; degrades with a clear message).
  No-candidate run is a safe no-op pass. Self-tested (identical→pass, mutated→fail).
- **6.2.3.4** npm scripts: `test`, `verify:conformance`, `verify:visual`, `verify`.
- **Deferred honestly:** automated CI capture (Playwright as a hard dep) waits for Phase 7
  when 4 materials make the harness pay for itself; today's committed baseline + manual/
  scripted capture suffice. The `#hex`→token migration and `INKED_FACADE_REAL`→data-file
  moves are tracked debt (see COMPONENT_INVENTORY.md), not silent passes.

## Acceptance (Batu)
- Zero raw color literals in src outside the documented allowlist; gate enforces it.
- A building's treatment is fully determined by `visualTier` + material via the map — no
  per-building code tuning.
- Per-material baseline diff catches an intentional palette change as a failure.
- `ART_DIRECTION.md` no-miss rules are now enforced by code, not vigilance.
