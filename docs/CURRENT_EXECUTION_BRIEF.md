# Current Execution Brief - Phase 2Y Real Data Vertical Slice Complete

Status: Phase 2Y real data vertical slice is complete. This brief records the latest implementation batch and does not open a further implementation batch by itself.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Phase 2Y Real Data Vertical Slice

- Batu authorized a one-corner source spike to prove real-data fixture to deterministic adapter to QA-mode scene integration without waiting for launch-grade provenance.
- Selected corner: Grillpoint Deli / NW corner.
- Added `src/data/real-data/manhattan-greenpoint-ave.nw-grillpoint.phase-2y.json` as a small canonical local real-data fixture.
- The fixture records source-backed Grillpoint name, address context, and category from existing reviewed source-evidence references.
- The fixture records human-prepared building/storefront samples, estimated-from-source frontage/address anchor, a generated-placeholder facade, and blocked exact entrance geometry.
- Extended `src/sceneManifest.js` with a real-data fixture validator and deterministic QA adapter that emits generated real-data QA entities.
- Wired the real-data fixture through `src/mvpPlaceData.js` so only Grillpoint receives the Phase 2Y real-data slice.
- Updated QA-mode rendering in `src/PlaceholderWorld.jsx` to visually distinguish source-backed, human-prepared, estimated-from-source, generated-placeholder, and blocked entities.
- Updated the selected-card QA inspector in `src/App.jsx` to show the real-data vertical slice and per-field statuses.
- Added `scripts/verify-real-data-scene-adapter.mjs` for targeted deterministic adapter verification.
- Normal mode remains raster-first and unchanged in product meaning.
- Strict promotion readiness remains unchanged; product-copy-ready targets remain 0.

## Post-Phase 2W Operating Model Correction

- Batu explicitly requested this docs/governance-only correction after Phase 2W was complete, verified, committed, and clean.
- Added the MVP Acceleration Rule to active governance: until the first working MVP scene is visually demoable, default to implementation over governance.
- Future batches must produce visible scene progress, real data ingestion/generation progress, interaction progress, or deploy/review progress unless Batu explicitly requests docs/governance-only work or implementation is blocked.
- Batch success is now measured by visible MVP progress, not documentation completeness.
- QA mode is recorded as the experimental product lab: render sourced, manual-draft, inferred, symbolic, and blocked fields aggressively when status is visible.
- Promotion gates, negative contract tests, and QA/product separation remain unchanged.

## Prior Completed Phase 2W Output

- Added structured draft fixture inputs for frontage/building edge, bay count, sign placement, and door/window pattern for the five active targets.
- Added a deterministic local draft-scene generator in the manifest adapter: draft fixture fields now produce QA-only generated scene entities before rendering.
- Generated QA entities include approximate footprint, storefront bay, facade panel, sign band, business label, door cue, window cues, bay divisions, anchor connector, status badges, and symbolic subway cue where applicable.
- QA mode renders generated entities over the raster plate for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- The selected-card QA inspector now lists generated QA scene entities and their field/status hooks in addition to raw draft field statuses.
- Real place names are shown in QA-mode sign panels/status cards near their current raster-plate cues.
- Subway overlay remains symbolic/blocked and visually distinguished from business storefronts.
- Normal-mode primary world art remains the approved review-only raster plate.
- Phase 2W is intentionally QA-mode-only: it optimizes for faster real-data-to-scene pipeline proof without changing product readiness or normal-mode product meaning.

## Latest QA Field-Status Callout Pass

- Added lightweight `qaOverlay.fieldStatusCallouts` hints to the draft scene fixture for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Extended the deterministic draft-scene generator to emit QA-only `field-status-callout` entities from those fixture hints.
- QA mode now draws small scene-level callouts near generated signs, facades, bays, door/window cues, anchors, and the symbolic subway cue so reviewers can see sourced/manual-draft/inferred/symbolic/blocked status directly in the scene.
- The Greenpoint G subway path now generates a blocked entrance cue in addition to the symbolic station cue.
- The selected-card QA inspector now summarizes generated callout entities as visible QA callouts.
- Normal mode remains raster-first and does not draw the generated draft overlay or callout labels.
- Strict promotion readiness remains unchanged; product-copy-ready targets remain 0.

## Phase 2X Generated QA Scene Skeleton Refinement

- Batu explicitly authorized the plan's first recommended item, refine the generated QA scene skeleton, as the next executable implementation task.
- The deterministic draft-scene generator now prefers QA overlay alignment hints for generated footprints, storefront bays, facade panels, sign bands, door cues, and window cues.
- QA-mode generated storefront geometry now reads as the primary overlay: storefront bays and signs are stronger, footprints/facades are quieter, and connector lines are less dominant.
- Detailed field-status callout text now appears only on hover/selection; compact status pins remain visible by default so field status stays inspectable without overwhelming the scene.
- QA inspector summaries now separate generated geometry counts from secondary callout counts.
- Greenpoint G remains symbolic/blocked and keeps the blocked entrance cue; no exact station or entrance geometry was promoted.
- Normal mode remains raster-first and unchanged in product meaning.
- Strict promotion readiness remains unchanged; product-copy-ready targets remain 0.

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

Latest Phase 2Y implementation changed:

- `src/data/real-data/manhattan-greenpoint-ave.nw-grillpoint.phase-2y.json`
- `src/mvpPlaceData.js`
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `scripts/verify-real-data-scene-adapter.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Prior Phase 2X implementation changed:

- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`

Prior QA field-status callout pass changed:

- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`

Post-Phase 2W operating-model update changed:

- `AGENTS.md`
- `docs/AGENTIC_TOOLING.md`
- `docs/MVP_SCOPE.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Prior Phase 2W implementation changed:

- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`

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

- Latest Phase 2Y verification: `node scripts/verify-real-data-scene-adapter.mjs` passed and confirmed the Grillpoint/NW real-data fixture validates, produces 10 deterministic QA entities, and does not attach to other active targets.
- Latest Phase 2Y build check passed with the existing Vite large-chunk warning.
- Latest Phase 2Y browser sanity check was attempted against `http://localhost:5173/` and `http://127.0.0.1:5173/`, but the in-app browser blocked both local URLs with `ERR_BLOCKED_BY_CLIENT`.
- Latest Phase 2X verification: generated output now reports 10 geometry entities and 5 secondary callouts for each storefront target, plus 4 geometry entities and 4 secondary callouts for Greenpoint G subway.
- Latest Phase 2X browser sanity check passed at `http://localhost:5173/`: QA mode shows the refined generated skeleton with compact status pins, while normal mode hides the generated QA skeleton and remains raster-first.
- Latest Phase 2X `npm run build` passed with the existing Vite large-chunk warning.
- Latest QA field-status callout pass verification: draft fixture validates with callout plans for 5 records; generated scene output now produces 5 QA field callouts each for Grillpoint Deli, McDonald's, Dunkin', and Citizens Bank, plus 4 for Greenpoint G subway.
- Latest `node scripts/verify-source-evidence-determinism.mjs` passed and confirmed source-evidence determinism remains stable.
- Latest `node scripts/verify-qa-inspector-source-evidence.mjs` passed and confirmed 5 target(s) match coverage readiness, 5 evidence record(s) match app QA visibility, and the Grillpoint contract remains blocked for facade/geometry.
- Latest `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true` passed and confirmed unsupported promotion attempts are rejected.
- Latest `npm run build` passed with the existing Vite large-chunk warning.
- Browser automation route was unavailable from the in-app browser session, so browser visual sanity could not be re-run in this batch.
- Post-Phase 2W operating-model update verification: `git diff --check` passed.
- `node scripts/verify-source-evidence-determinism.mjs` passed and confirmed regenerated source-evidence output remains stable and matches the committed generated fixture.
- `node scripts/verify-qa-inspector-source-evidence.mjs` passed and confirmed 5 target(s) match coverage readiness, 5 evidence record(s) match app QA visibility, and the Grillpoint contract remains blocked for facade/geometry.
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true` passed and confirmed unsupported promotion attempts are rejected.
- `npm run build` passed with the existing Vite large-chunk warning.
- Browser visual sanity check confirmed QA mode shows generated real-name/status/geometry overlays while normal mode hides the generated draft layer and keeps the raster-first presentation.
- Follow-up reconciliation confirmed the generated Phase 2W overlay path is gated by review/QA mode; normal mode does not draw draft storefront/facade/bay/sign/status overlays.

## Next State

- Future prompts should lead with: "Build the visible MVP proof. Preserve gates as constraints."
- The next executable task is pending Batu or a later explicit brief.
- Recommended next outcome-based sequence:
  1. Expand or replace the Phase 2Y one-corner real-data sample with stronger source-derived geometry if a practical lane is available.
  2. Create a demoable review scene coherent enough to show someone for feedback while remaining draft/review-only and not product-ready.
- No further prototype, visual, source-evidence, promotion, production, package/tooling, screenshot-QA, or demo-freeze work is opened by this brief.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Weakening promotion gates, source-evidence determinism checks, QA verifier checks, or negative contract tests.
- Marking any current record as `product_copy_ready` without satisfying all existing promotion-readiness prerequisites.
- Promoting exact storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, source-vendor decisions, package scripts, CI, package/tooling changes, production schemas, public APIs, or broad coverage.
- Editing raster assets, generating images, revising visual direction, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Replacing normal-mode raster-first primary world art with SVG, canvas, CSS, DOM-drawn buildings/storefronts/roads/signs, or other code-generated scene art.
