# Current Execution Brief - Phase 2B Manifest-Driven Scene Foundation Review Hold

Status: Phase 2B Manifest-Driven Scene Foundation is complete for Batu review. This brief records the completed vertical slice and does not open Phase 2C, ingestion scripts, raster/visual revisions, full provenance/debug UI, full screenshot QA, production data, production assets, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2B manifest boundary and app-integration approach; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; and any later Phase 2C/2D/2E implementation gates.

## Completed Phase 2B Output

- Added the first review-only canonical scene manifest for the Manhattan Ave / Greenpoint Ave MVP slice.
- Added a small manifest validation and adapter path.
- Wired the existing app data module to load the current MVP scene from the manifest while preserving the existing React/Pixi interaction shell.
- Kept the current review-only raster asset unchanged.
- Removed stale active legacy JPEG-extension reference paths from the app/manifest path; normalized active references use JPG paths where local reference paths are listed.

## Files Changed

- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `src/sceneManifest.js`
- `src/mvpPlaceData.js`
- `docs/review-screenshots/phase-2b-manifest-driven-scene-foundation/desktop-overview.jpg`
- `docs/review-screenshots/phase-2b-manifest-driven-scene-foundation/desktop-selected-grillpoint-card.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Manifest-Driven

- App-facing source records and reviewed source metadata.
- Initial place, business, address, storefront, building, parcel, transit-context, and corner records for the current MVP slice.
- Scene-local anchors, objects, target metadata, marker positions, bounds, outline paths, and reviewed card/evidence copy.
- Review-only raster plate metadata and usage limits.
- Manual override records for authored scene placement and the SW Dunkin MVP-only visual exception.
- QA/missing-data/ambiguity/blocked-claim report fields.

## What Remains Hardcoded Or Blocked

- The bundled raster image import remains in app code so Vite can package the review-only asset.
- The React/Pixi renderer, camera behavior, card layout, hover/selected/QA affordances, and review UI remain existing app code.
- No ingestion adapter, source normalization pipeline, debug inspector, production runtime schema, public data API, or full Greenpoint data pipeline exists.
- WGS84 coordinates, projected geometry, parcel/tax-lot IDs, building footprints, exact storefront segmentation, exact frontage/order, exact address placement, and exact Greenpoint G station geometry remain unresolved or blocked.
- No raster generation, art revision, production asset direction, production data claim, deployment, backend, CMS, analytics, accounts, persistence, routing, CI, or broad map coverage is opened.

## Verification State

Phase 2B verification completed:

- `npm run build`
- Browser preview at `http://127.0.0.1:5173/`
- Desktop overview screenshot
- Desktop selected Grillpoint card screenshot
- `git diff --check`
- Active app/data legacy JPEG-extension reference check.
- Intentional-file staging review.

Screenshot evidence was captured under `docs/review-screenshots/phase-2b-manifest-driven-scene-foundation/`. This is a smoke/regression check for the manifest-backed scene load, not a full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2B manifest-driven scene foundation.

If Batu accepts Phase 2B:

- Batu may open a later bounded Phase 2 task for provenance/debug inspection, normalized source-record work, screenshot regression evidence, or ingestion spike work.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Changing the manifest boundary beyond review-only Phase 2B fields.
- Adding ingestion scripts, source adapters, generated scene data, debug inspector UI, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the manifest as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
