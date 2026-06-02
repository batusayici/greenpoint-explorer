# Current Execution Brief - Phase 2W Draft Real-Data Scene Visual Proof Pass Complete

Status: Phase 2W Draft Real-Data Scene Visual Proof Pass is complete for review. This brief records the completed QA-mode visual proof pass and does not open a further implementation batch.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Completed Phase 2W Output

- Added lightweight `qaOverlay` hints to the Phase 2V draft scene fixture for each active target.
- Improved QA-mode draft overlays for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- QA mode now draws clearer approximate footprint, facade band, storefront bay, sign panel, door/window cue, anchor connector, and status-chip overlays from draft scene data.
- Real place names are shown in QA-mode sign panels/status cards near their current raster-plate cues.
- Subway overlay remains symbolic and explicitly blocked for exact entrance geometry.
- Existing selected-card QA inspector draft field statuses remain available.
- Normal-mode primary world art remains the approved review-only raster plate.

## Current Strict Promotion Result

- The strict source-evidence fixture remains unchanged.
- No target was marked `productCopyReady` or `product_copy_ready`.
- Product-copy-ready targets remain 0.
- Storefront/facade and entrance/frontage/geometry promotion gates remain blocked for all five current targets.
- The local negative self-test still rejects unsupported product-copy promotion and unsupported blocked-gate promotion.

## Files Changed

- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/sceneManifest.js`
- `src/PlaceholderWorld.jsx`
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
- Browser visual sanity check confirmed QA mode shows clearer real-name/status/geometry overlays while normal-mode raster art remains intact.

## Next State

- The next executable task is pending Batu or a later explicit brief.
- Safe candidate areas include Batu review of Phase 2W QA-mode visual proof, a later approved draft-overlay refinement pass, or a later approved visual/art/data gate.
- No further prototype, visual, source-evidence, promotion, production, package/tooling, screenshot-QA, or demo-freeze work is opened by this brief.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting exact storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
