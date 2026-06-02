# Current Execution Brief - Phase 2V Draft Real-Data Scene Pipeline Complete

Status: Phase 2V Draft Real-Data Scene Pipeline is complete for review. This brief records the completed local prototype-only draft scene lane and does not open a further implementation batch.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Completed Phase 2V Output

- Added `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json` as a review/demo-only draft scene fixture for the current Manhattan Ave x Greenpoint Ave MVP scene.
- Covered the active current place/cue set: Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Added major draft fields for real name, address text, category, approximate building footprint, approximate storefront bay, sign text, facade style, door/window placement, scene anchor, and station/intersection cues.
- Every major draft field carries a machine-readable status from `verified`, `sourced`, `inferred`, `manual_draft`, `symbolic`, `unknown`, or `blocked`.
- Extended the manifest loader with an optional draft-scene fixture input and validation path.
- Wired the app data flow so prototype targets can consume draft scene fields while strict source-evidence promotion remains separate.
- Added QA inspector surfacing for draft lane status counts and field-level draft statuses.
- Added QA-mode-only draft labels for sign/facade/bay status on top of the raster scene. Normal-mode primary world art remains the approved review-only raster plate.

## Current Strict Promotion Result

- The strict source-evidence fixture remains unchanged.
- Grillpoint remains `review_only`.
- Grillpoint `productCopyReady` remains `false`.
- Product-copy-ready targets remain 0.
- Storefront/facade and entrance/frontage/geometry promotion gates remain blocked for all five current targets.
- The local negative self-test still rejects unsupported product-copy promotion and unsupported blocked-gate promotion.

## Files Changed

- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/sceneManifest.js`
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
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
- `git diff --check` passed.
- No screenshots were required or captured. Phase 2V is a data-flow and QA/debug visibility batch, not MVP-29G screenshot recovery.

## Next State

- The next executable task is pending Batu or a later explicit brief.
- Safe candidate areas include Batu review of Phase 2V draft lane behavior, a later approved draft-field refinement pass, or a later approved visual/art/data gate.
- No further prototype, visual, source-evidence, promotion, production, package/tooling, screenshot-QA, or demo-freeze work is opened by this brief.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting exact storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing missing raster/reference primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
