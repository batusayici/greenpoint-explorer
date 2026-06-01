# Current Execution Brief - Phase 2A Planning Packet Review Hold

Status: Phase 2A Docs-Only Data-Driven Scene Architecture Setup is complete for Batu review. MVP-29E remains complete for Batu review; this brief does not reopen MVP-29E implementation, raster revision, app integration, full screenshot QA, QA/demo freeze, or production work.

Owner boundary: Batu owns acceptance, revision, or rejection of the MVP-29E raster/app output; acceptance, revision, or rejection of the Phase 2A planning packet; creative/product/scope approval; public-interface approval; architecture-boundary approval; production/public claims; exact facade/frontage/address/station-geometry decisions; brand/trade-dress decisions; and any later MVP-29G/full QA or demo-freeze gate.

Codex must not start Phase 2B, source implementation, app refactor, ingestion scripts, generated scene data, raster/visual revisions, package/tooling changes, public-interface changes, or production architecture unless Batu explicitly opens that next scope.

## Purpose

Record completion of the docs-only Phase 2A planning / architecture setup and hold the next task for Batu review.

Phase 2A created a planning packet for the next major direction:

- Phase 2 is a data-to-scene architecture proof.
- Phase 2 succeeds when the existing MVP scene can be represented and eventually regenerated from a traceable scene manifest.
- LiveXYZ is preferred pending access, but Phase 2 starts open-data-first.
- Generated truth and manual overrides must remain separate.

## Completed Phase 2A Output

- `docs/PHASE_2_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/SCENE_MANIFEST_SCHEMA.md`
- `docs/DATA_SOURCES.md`
- `docs/PROVENANCE_AND_QA.md`
- `docs/PHASE_3_SCALE_TEST_PLAN.md`

## What Phase 2A Did

- Defined Phase 2 as the Data-Driven Scene MVP.
- Defined the architecture flow: source adapters -> normalized source records -> canonical scene manifest -> app rendering layer -> debug/provenance/QA layer.
- Defined four truth layers: geometry truth, place/business truth, visual-reference truth, and scene truth.
- Defined the v0.1 scene manifest planning contract.
- Defined the source hierarchy and source-use warnings.
- Defined provenance, debug, manual override, and QA requirements.
- Defined high-level Phase 3 Neighborhood Scale Validation.

## What Phase 2A Did Not Do

- No `src/` edits.
- No app refactor.
- No new app components.
- No ingestion scripts.
- No generated scene data.
- No mock data files.
- No package or lockfile changes.
- No raster or visual revisions.
- No generated images.
- No screenshots.
- No MVP-29E implementation changes.
- No production architecture or public-interface approval.

## Verification State

Phase 2A verification completed:

- `git diff --check`
- `git status --short`

No markdown/lint dependency was added.

## MVP-29E Review Hold

MVP-29E remains complete for Batu review with:

- One review-only raster-first Manhattan Ave x Greenpoint Ave four-corner scene.
- NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens Bank, and Greenpoint G subway context.
- Corrective pass completed for hover outline geometry, crosswalk geometry, and Citizens/Dunkin subway placement.
- Existing app interaction shell preserved.
- Basic review screenshots captured.

The completed review packet remains:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/README.md`

MVP-29E acceptance, revision, rejection, full screenshot QA, and demo-freeze decisions remain Batu-owned and are not resolved by the Phase 2A docs-only planning setup.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Editing `src/` or app source files.
- Editing raster assets, generated images, screenshots, package files, lockfiles, or MVP-29E implementation files.
- Creating ingestion scripts, generated scene data, mock data files, app components, or implementation modules.
- Starting Phase 2B or treating the Phase 2A packet as approved production architecture.
- Treating the scene manifest planning contract as an implemented public interface.
- Making production/public-release claims.
- Treating the MVP-29E raster as production art, approved production asset direction, exact real-world representation, or MVP completion.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2A planning packet.

If Batu accepts Phase 2A:

- Batu may open Phase 2B - Canonical Scene Manifest v0.1 as a docs/data-boundary task.

If Batu requests revision:

- The next brief must name the specific Phase 2 planning, architecture, schema, source, provenance/QA, Phase 3 scale-test, roadmap, or ledger changes allowed.

## Still Blocked

- Phase 2B until Batu opens it.
- Source implementation, app refactor, ingestion scripts, generated scene data, mock data files, public runtime schemas, package/tooling changes, or production architecture.
- MVP-29E raster/app revision unless Batu opens a specific revision scope.
- MVP-29G full screenshot QA unless Batu opens it.
- MVP-30 QA/demo freeze before Batu accepts the four-corner raster/app output and opens any required QA recovery.
- Final MVP completion claim.
- Production visual assets, production asset direction, or production asset pipeline.
- Exact facade, exact frontage/order, exact address placement, exact branch/ATM placement, exact station geometry, ratings, reviews, `open now`, endorsement, partnership, official collaboration, or public-release claims.
- Live data, scraping, backend, CMS, analytics, deployment, CI, broad map coverage, accounts, persistence, or routing.
