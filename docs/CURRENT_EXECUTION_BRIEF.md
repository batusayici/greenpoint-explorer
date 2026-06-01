# Current Execution Brief - Phase 2D Source Evidence Fixture Review Hold

Status: Phase 2D Source Evidence Fixture is complete for Batu review. This brief records the completed review-only source-evidence import spike and does not open ingestion scripts, scraping, external app-code API calls, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2D source-evidence fixture; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; source-authority decisions; and any later Phase 2 implementation gates.

## Completed Phase 2D Output

- Added a small review-only source-evidence fixture for Grillpoint Deli and Greenpoint Ave G station context.
- Kept raw/reviewed source-evidence records separate from the scene manifest and adapted them through the existing manifest loader.
- Validated evidence fixture schema, mapped target/place/source IDs, claim mappings, confidence, usage status, captured/reviewed dates, QA notes, and remaining gaps.
- Added minimal manifest links from the two supported places to the fixture records.
- Surfaced selected-target source-evidence records in the existing QA inspector, including evidence-backed claims and remaining approximate/missing fields.
- Kept the current review-only raster asset and existing React/Pixi scene interaction behavior unchanged.
- Kept the inspector review-only/development-oriented and tied to the existing QA mode.

## Files Changed

- `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `src/sceneManifest.js`
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/styles.css`
- `docs/review-screenshots/phase-2d-source-evidence-fixture/default-scene.jpg`
- `docs/review-screenshots/phase-2d-source-evidence-fixture/selected-grillpoint-source-evidence.jpg`
- `docs/review-screenshots/phase-2d-source-evidence-fixture/selected-greenpoint-g-source-evidence.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Visible In-App

- Per-selected-target source-evidence records where Phase 2D fixture data exists.
- Evidence source type, label, usage status, reviewed date, confidence, and confidence rationale.
- Evidence-backed claim mappings, including manifest path, claim type, claim value, support level, and mapping confidence.
- Remaining gaps from the evidence fixture, such as exact storefront frontage/address placement and exact station geometry.
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
- The source-evidence fixture is hand-authored review data, not a scraper, source normalization pipeline, production ingestion adapter, public runtime schema, public data API, or full Greenpoint data pipeline.
- The inspector is a lightweight review surface, not a polished product UI, admin system, public data API, or complete provenance/debug workbench.
- WGS84 coordinates, projected geometry, parcel/tax-lot IDs, building footprints, exact storefront segmentation, exact frontage/order, exact address placement, and exact Greenpoint G station geometry remain unresolved or blocked.
- No raster generation, art revision, production asset direction, production data claim, deployment, backend, CMS, analytics, accounts, persistence, routing, CI, or broad map coverage is opened.

## Verification State

Phase 2D verification completed:

- `npm run build`
- Browser preview at `http://127.0.0.1:5173/`
- Default scene screenshot
- Selected Grillpoint card with source-evidence fixture record visible
- Selected Greenpoint G card with evidence-backed context and remaining approximate/blocked fields visible
- `git diff --check`
- `git diff --cached --check`
- Active app/data legacy JPEG-extension reference check.
- Intentional-file staging review.

Screenshot evidence was captured under `docs/review-screenshots/phase-2d-source-evidence-fixture/`. This is a smoke/regression check for the source-evidence QA surface, not a full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2D source-evidence fixture and QA display.

If Batu accepts Phase 2D:

- Batu may open a later bounded Phase 2 task for normalized source-record expansion, geometry mapping, QA refinement, screenshot regression coverage, or a deliberately scoped ingestion spike.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Adding ingestion scripts, scraping, external app-code API calls, production source adapters, generated scene data beyond review fixtures, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the manifest or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
