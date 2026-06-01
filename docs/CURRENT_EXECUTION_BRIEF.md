# Current Execution Brief - Phase 2C Manifest QA Inspector Review Hold

Status: Phase 2C Manifest QA Inspector is complete for Batu review. This brief records the completed review-only QA/debug surface and does not open ingestion scripts, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2C QA inspector; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; and any later Phase 2 implementation gates.

## Completed Phase 2C Output

- Added a lightweight selected-card manifest QA inspector.
- Exposed target-level manifest QA/provenance data from the existing manifest adapter.
- Surfaced source confidence, review/source metadata, scene status, scene anchor point, business status confidence, address geometry gaps, storefront status, manual overrides, missing-data notes, ambiguity notes, blocked claims, and manifest QA counts.
- Kept the current review-only raster asset and existing React/Pixi scene interaction behavior unchanged.
- Kept the inspector review-only/development-oriented and tied to the existing QA mode.

## Files Changed

- `src/sceneManifest.js`
- `src/App.jsx`
- `src/styles.css`
- `docs/review-screenshots/phase-2c-manifest-qa-inspector/default-scene.jpg`
- `docs/review-screenshots/phase-2c-manifest-qa-inspector/selected-qa-provenance.jpg`
- `docs/review-screenshots/phase-2c-manifest-qa-inspector/selected-qa-missing-manual.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Visible In-App

- Per-selected-target manifest object id, claim status, scene anchor status, scene point, and corner/context label.
- Place confidence and business status confidence.
- Address geometry gaps such as missing WGS84/local projected point data.
- Storefront frontage and entrance status, including `approximate` and `manual-review-required`.
- Reviewed source rows with source type, usage status, and reviewed date.
- Related manual overrides, including authored scene placement.
- Scene-level missing-data, ambiguity, blocked-claim, unprovenanced-claim, hidden-fix, and verdict fields.

## What Remains Hardcoded Or Blocked

- The bundled raster image import remains in app code so Vite can package the review-only asset.
- The React/Pixi renderer, camera behavior, card layout, hover/selected/QA affordances, and review UI remain existing app code.
- The inspector is a lightweight review surface, not a polished product UI, admin system, public data API, or complete provenance/debug workbench.
- No ingestion adapter, source normalization pipeline, production runtime schema, public data API, or full Greenpoint data pipeline exists.
- WGS84 coordinates, projected geometry, parcel/tax-lot IDs, building footprints, exact storefront segmentation, exact frontage/order, exact address placement, and exact Greenpoint G station geometry remain unresolved or blocked.
- No raster generation, art revision, production asset direction, production data claim, deployment, backend, CMS, analytics, accounts, persistence, routing, CI, or broad map coverage is opened.

## Verification State

Phase 2C verification completed:

- `npm run build`
- Browser preview at `http://127.0.0.1:5173/`
- Default scene screenshot
- Selected Grillpoint card with QA/provenance inspector visible
- Selected Grillpoint card with manual override and missing/ambiguous fields visible
- `git diff --check`
- Active app/data legacy JPEG-extension reference check.
- Intentional-file staging review.

Screenshot evidence was captured under `docs/review-screenshots/phase-2c-manifest-qa-inspector/`. This is a smoke/regression check for the manifest QA inspector, not a full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2C manifest QA inspector.

If Batu accepts Phase 2C:

- Batu may open a later bounded Phase 2 task for normalized source-record work, source ingestion spike work, geometry mapping, QA refinement, or screenshot regression coverage.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Adding ingestion scripts, source adapters, generated scene data, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the manifest or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
