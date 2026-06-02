# Current Execution Brief - Phase 2AB Official Geometry Source Lane Complete

Status: Phase 2AB official geometry source lane is complete. This brief records the latest implementation batch and does not open a further implementation batch by itself.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Phase 2AB Official Geometry Source Lane

- Batu approved opening the recommended true geometry source lane after the Phase 2 status checkpoint.
- Added `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json` as a small review-only NYC Open Data Building Footprints sample for the Manhattan Ave x Greenpoint Ave current MVP intersection.
- The fixture records official footprint polygons, BIN/BBL/building metadata, retrieval/query metadata, projection notes, and blocked claim guardrails.
- The batch uses NYC Open Data building footprints as a geometry-context source only. It does not treat building footprints as tenant-frontage, storefront-order, entrance-location, facade-appearance, active-business, exact-address, station-geometry, product/public, or production-map evidence.
- Candidate footprint relationships are attached only to Grillpoint Deli, McDonald's, Dunkin', and Citizens Bank as `candidate_match` QA comparisons.
- Greenpoint G subway receives no building-footprint match; exact station and entrance geometry remain blocked.
- Extended `src/sceneManifest.js` with a geometry-source fixture validator, target index, deterministic WGS84-to-scene QA projection, and generated QA footprint candidate entities.
- Wired the fixture through `src/mvpPlaceData.js`.
- QA mode now draws official building-footprint candidate outlines over the authored raster/draft overlay for comparison.
- Selected-card QA now lists the official geometry source lane, BIN/BBL metadata, candidate-match status, and blocked claims.
- Normal mode remains raster-first and unchanged in product meaning.
- Strict promotion readiness remains unchanged; product-copy-ready targets remain 0.
- No exact parcel/tax-lot footprint, exact building footprint, exact storefront frontage/order, exact entrance, exact facade, exact address placement, exact station geometry, production/public claim, package/tooling change, source-vendor integration, live refresh, backend, CI, or broad coverage was promoted.

## Prior Phase 2AA Source Precision Upgrade

- Batu authorized replacing the highest-value available estimated/human-prepared geometry with stronger source-derived geometry where local evidence supports it.
- Added `scripts/generate-real-data-source-precision.mjs` as a deterministic local transform from the Phase 2Z fixture plus the review manifest into the Phase 2AA precision fixture.
- Added `src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json` and wired the app to load it.
- Upgraded McDonald's and Citizens Bank `geometry.frontageSegment.status` from `estimated_from_source` to `source_backed` for QA frontage alignment only, based on review-manifest storefront confidence and official address context.
- Upgraded McDonald's and Citizens Bank `geometry.buildingSample.status` from `human_prepared` to `estimated_from_source`, because the visible envelope is now derived from review-manifest address/building/storefront links plus raster alignment.
- Left Grillpoint Deli and Dunkin' geometry unchanged because local manifest geometry confidence remains low.
- Left Greenpoint G symbolic/blocked; exact station/entrance geometry remains unsupported.
- QA inspector now surfaces source-precision metadata and rationale for upgraded records.
- No exact parcel/tax-lot footprint, exact building footprint, exact frontage/order, exact entrance, exact facade, production/public claim, or product-copy-ready status was promoted.
- Normal mode remains raster-first and unchanged in product meaning.
- Strict promotion readiness remains unchanged; product-copy-ready targets remain 0.

## Prior Real-Data Draft Lane State

- Phase 2V added a separate draft prototype lane with field-level statuses and QA/debug surfacing without changing strict promotion readiness.
- Phase 2W made the draft lane visibly useful in QA mode by generating approximate storefront/facade/bay/sign/door/window/status entities from structured draft fixture fields.
- The post-Phase 2W operating model correction established that future implementation batches should build visible MVP proof first while preserving gates as constraints.
- The QA field-status callout pass added scene-level status callouts near generated storefront/facade/bay/sign/door/window and symbolic subway cues.
- Phase 2X refined the generated QA scene skeleton so generated storefront geometry reads as the primary QA overlay while compact status pins remain visible by default and detailed callouts appear on hover/selection.
- Phase 2Y added a one-corner Grillpoint/NW real-data fixture and deterministic adapter.
- Phase 2Z expanded that fixture/adapter pattern to all five active targets and kept Greenpoint G symbolic/blocked.

## Generated From Fixture Fields

- `buildingFootprint.value.sceneBounds` generates approximate footprint entities.
- `storefrontBay.value.sceneBounds` and `storefrontBay.value.bayCount` generate storefront bays and bay divisions.
- `facadeStyle`, `frontage`, and deterministic geometry rules generate facade panels.
- `signText` and `signPlacement` generate sign bands and real-name labels.
- `doorWindowPlacement` generates door/window cues.
- `sceneAnchor` generates anchor connectors.
- `stationIntersectionCues` plus symbolic anchor data generate the Greenpoint G symbolic/blocked subway cue.
- `realDataFixture.records` generate QA-only source-backed/human-prepared/estimated/generated-placeholder/blocked real-data entities.
- `geometrySourceFixture.records` generate QA-only official building-footprint candidate comparison outlines.

## Still Manual / Inferred / Blocked

- Approximate footprints, frontage edges, storefront bay dimensions/counts, sign placement, facade panels, and door/window placement remain `manual_draft` for business targets unless a stronger field-level status is explicitly recorded.
- NYC building footprints support official building-geometry context only; they do not solve storefront segmentation, tenant frontage, entrance location, facade appearance, exact address placement, or active business status.
- Geometry-source target relationships are `candidate_match` only.
- Scene anchors and intersection context remain `inferred` unless explicitly sourced.
- The Greenpoint G subway representation remains symbolic; exact stair/elevator/entrance/station geometry remains blocked.
- True source-backed storefront/entrance/station geometry still needs reviewed non-restricted geometry/evidence and Batu approval before any product/public claim.

## Current Strict Promotion Result

- The strict source-evidence fixture remains unchanged.
- No target was marked `productCopyReady` or `product_copy_ready`.
- Product-copy-ready targets remain 0.
- Storefront/facade and entrance/frontage/geometry promotion gates remain blocked for all five current targets.
- The local negative self-test still rejects unsupported product-copy promotion and unsupported blocked-gate promotion.

## Files Changed

Latest Phase 2AB implementation changed:

- `src/data/geometry-source/manhattan-greenpoint-ave.nyc-building-footprints.phase-2ab.json`
- `src/mvpPlaceData.js`
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `scripts/verify-real-data-scene-adapter.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Prior Phase 2AA implementation changed:

- `src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json`
- `src/mvpPlaceData.js`
- `src/sceneManifest.js`
- `src/App.jsx`
- `scripts/generate-real-data-source-precision.mjs`
- `scripts/verify-real-data-scene-adapter.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## Verification Commands

```sh
node scripts/verify-real-data-scene-adapter.mjs
```

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

- Latest Phase 2AB `node scripts/verify-real-data-scene-adapter.mjs` passed and confirmed the active-target real-data fixture still validates, geometry source records total 4, source-precision upgrades remain limited to McDonald's/Citizens Bank, official footprint entities are generated as `candidate_match`, and Greenpoint G receives no building-footprint match.
- Latest `node scripts/verify-source-evidence-determinism.mjs` passed and confirmed source-evidence determinism remains stable.
- Latest `node scripts/verify-qa-inspector-source-evidence.mjs` passed and confirmed 5 target(s) match coverage readiness, 5 evidence record(s) match app QA visibility, and the Grillpoint contract remains blocked for facade/geometry.
- Latest `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true` passed and confirmed unsupported promotion attempts are rejected.
- Latest `npm run build` passed with the existing Vite large-chunk warning.
- Browser sanity check passed at `http://127.0.0.1:5173/`: the app loaded, normal controls were present, QA mode opened, and the selected McDonald's QA panel exposed BIN `3064733`, candidate-match status, and official-footprint language.

## Next State

- Future prompts should lead with: "Build the visible MVP proof. Preserve gates as constraints."
- The next executable task is pending Batu or a later explicit brief.
- Recommended next outcome-based sequence:
  1. Review the Phase 2AB QA footprint comparison and decide whether the current candidate footprint projection is useful enough for the next demoable scene pass.
  2. If useful, create a demoable review scene pass that makes the current draft/real-data/official-geometry lanes coherent enough to show for feedback while remaining review-only and not product-ready.
  3. If not useful, perform one narrow geometry-alignment correction pass with supplied or approved stronger address/lot/storefront evidence.
- No further prototype, visual, source-evidence, promotion, production, package/tooling, screenshot-QA, or demo-freeze work is opened by this brief.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting exact storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, exact parcel/building footprint, or production card claims.
- Treating NYC building footprints as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or exact station geometry.
- Adding external source acquisition beyond a narrow approved sample, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
