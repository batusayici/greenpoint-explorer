# Current Execution Brief - Phase 2W QA-Mode Real-Data Scene Generation Proof Complete

Status: Phase 2W QA-mode real-data scene generation proof is complete for review. This brief records the completed QA-mode-only generation pass and does not open a further implementation batch.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Completed Phase 2W Output

- Added structured draft fixture inputs for frontage/building edge, bay count, sign placement, and door/window pattern for the five active targets.
- Added a deterministic local draft-scene generator in the manifest adapter: draft fixture fields now produce QA-only generated scene entities before rendering.
- Generated QA entities include approximate footprint, storefront bay, facade panel, sign band, business label, door cue, window cues, bay divisions, anchor connector, status badges, and symbolic subway cue where applicable.
- QA mode renders generated entities over the raster plate for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- The selected-card QA inspector now lists generated QA scene entities and their field/status hooks in addition to raw draft field statuses.
- Real place names are shown in QA-mode sign panels/status cards near their current raster-plate cues.
- Subway overlay remains symbolic/blocked and visually distinguished from business storefronts.
- Normal-mode primary world art remains the approved review-only raster plate.
- Phase 2W is intentionally QA-mode-only: it optimizes for faster real-data-to-scene pipeline proof without changing product readiness or normal-mode product meaning.

## Generated From Fixture Fields

- `buildingFootprint.value.sceneBounds` generates approximate footprint entities.
- `storefrontBay.value.sceneBounds` and `storefrontBay.value.bayCount` generate storefront bays and bay divisions.
- `facadeStyle`, `frontage`, and deterministic geometry rules generate facade panels.
- `signText` and `signPlacement` generate sign bands and real-name labels.
- `doorWindowPlacement` generates door/window cues.
- `sceneAnchor` generates anchor connectors.
- `stationIntersectionCues` plus symbolic anchor data generate the Greenpoint G symbolic/blocked subway cue.

## Still Manual / Inferred / Blocked

- Approximate footprints, frontage edges, storefront bay dimensions/counts, sign placement, facade panels, and door/window placement remain `manual_draft` for business targets.
- Scene anchors and intersection context remain `inferred` unless explicitly sourced.
- The Greenpoint G subway representation remains symbolic; exact stair/elevator/entrance/station geometry remains blocked.
- True source-backed geometry still needs reviewed non-restricted geometry/evidence for exact frontage, facade, entrance, station placement, and Batu approval before any product/public claim.

## Current Strict Promotion Result

- The strict source-evidence fixture remains unchanged.
- No target was marked `productCopyReady` or `product_copy_ready`.
- Product-copy-ready targets remain 0.
- Storefront/facade and entrance/frontage/geometry promotion gates remain blocked for all five current targets.
- The local negative self-test still rejects unsupported product-copy promotion and unsupported blocked-gate promotion.

## Files Changed

- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## Verification Commands

```sh
node scripts/verify-source-evidence-determinism.mjs
```

```sh
node scripts/verify-qa-inspector-source-evidence.mjs
```

```sh
node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true
```

```sh
npm run build
```

Additional pre-commit checks:

```sh
git diff --check
git status --short
git diff --stat
```

## Verification State

- `node scripts/verify-source-evidence-determinism.mjs` passed and confirmed regenerated source-evidence output remains stable and matches the committed generated fixture.
- `node scripts/verify-qa-inspector-source-evidence.mjs` passed and confirmed 5 target(s) match coverage readiness, 5 evidence record(s) match app QA visibility, and the Grillpoint contract remains blocked for facade/geometry.
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true` passed and confirmed unsupported promotion attempts are rejected.
- `npm run build` passed with the existing Vite large-chunk warning.
- Browser visual sanity check confirmed QA mode shows generated real-name/status/geometry overlays while normal mode hides the generated draft layer and keeps the raster-first presentation.
- Follow-up reconciliation confirmed the generated Phase 2W overlay path is gated by review/QA mode; normal mode does not draw draft storefront/facade/bay/sign/status overlays.

## Next State

- The next executable task is pending Batu or a later explicit brief.
- Safe candidate areas include Batu review of the Phase 2W QA-mode generation proof, a later approved draft-scene generation refinement pass, or a later approved visual/art/data gate.
- No further prototype, visual, source-evidence, promotion, production, package/tooling, screenshot-QA, or demo-freeze work is opened by this brief.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting exact storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
