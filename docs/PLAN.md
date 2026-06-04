# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-04
Creative/product/public-interface approval owner: Batu
Critical review/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and Phase 3 review. It should stay short: current phase, next task, remaining path, blockers, pending decisions, and delegated-doc pointers.

Use `docs/MVP_SCOPE.md` for detailed MVP boundaries. Use `docs/MVP_EXECUTION_LEDGER.md` for batch records. Use `docs/CURRENT_EXECUTION_BRIEF.md` for the next Codex task only.

## Source-Of-Truth Order

Use these in order when documents conflict:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/MVP_EXECUTION_LEDGER.md`
5. Topic-specific docs when the task touches their area

`docs/TASKS.md` is deprecated and must not be used as an active source of truth unless `docs/CURRENT_EXECUTION_BRIEF.md` or this plan explicitly revives it.

## Current State

- Current phase: Phase 3 source-decision blocker for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice.
- Current next task: Phase 3 POI/business source ADR + narrow source spike.
- The ADR/source spike is required before Brouwerij Lane or any other non-west target can be deepened.
- The locked MVP remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave. DTR-11 is the active review-only demo raster in the app, and the Vercel Preview is published behind protected shareable-link access.
- Phase 2DTR / MVP feedback demo is complete and locked for MVP-feedback purposes. Do not open DTR-12 unless later feedback makes that necessary and Batu explicitly approves it.
- Phase 3 scaffold direction is approved only for the first scaffold direction in `docs/phase-3-architecture-scaling-decision-surface.md`: block/tile-scoped manifest, raster-first plates/layers, structured interaction plus QA/provenance overlays, and reusable primitives for geometry, hotspots, masks, labels, cards, provenance, and review.
- Phase 3 implementation so far: first scaffold complete, west anchor sourced from existing reviewed MVP context, mid-corridor candidate/status layer complete, Franklin endpoint status layer complete, local-only evidence-deepening audit complete, and Brouwerij Lane source-retrieval spike complete as blocked.
- Brouwerij Lane is now the active source-decision test target, but identity, address, category/business type, coordinates, and provenance cannot be deepened until the source lane, credential/access status, and deterministic evidence record shape are decided.

## Completed Work Pointers

- Detailed batch records: `docs/MVP_EXECUTION_LEDGER.md`
- Older batch history: `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- Detailed MVP scope and non-goals: `docs/MVP_SCOPE.md`
- Phase 2DTR review packets: `docs/mvp-review/phase-2dtr-*`
- MVP feedback demo package: `docs/mvp-review/mvp-feedback-demo-package/`
- Phase 3 architecture decision surface: `docs/phase-3-architecture-scaling-decision-surface.md`
- Brouwerij Lane source-retrieval blocker record: `docs/phase-3-brouwerij-source-retrieval-spike.md`

## Phase 3 Completion Roadmap

1. Phase 3 POI/business source ADR + source spike.
2. Choose primary/fallback/cross-check source lanes for business identity, address, category, coordinates, freshness/status, geometry context, facade/frontage/entrance evidence.
3. Define normalized deterministic evidence record shape.
4. Implement one-target Brouwerij Lane retrieval adapter or blocked credential/source report.
5. Join retrieved POI data to NYC/open geometry context where supported.
6. Add approved facade/frontage/entrance evidence path.
7. Deepen Brouwerij Lane as the first non-west real target.
8. Produce or approve corridor-specific review raster/surface.
9. Validate corridor interaction, QA overlays, cards, pan/zoom, and browser performance.
10. Run Phase 3 exit read: what scales, what is manual, what is blocked, and what source gaps dominate.

## Next Batch Requirements

The next authorized batch is Phase 3 POI/business source ADR + narrow source spike.

It must:

- Compare Google Places, Foursquare Places, OSM/Overpass, NYC Open Data, LiveXYZ/local-directory path, and manual evidence packets.
- Distinguish what each source may support: POI/business claims, building/parcel/geometry claims, facade/frontage/entrance claims, and raster readiness.
- Evaluate coverage, freshness/status quality, address precision, coordinate precision, category quality, licensing/cache/display risk, provenance support, cost/rate limits, deterministic fixture fit, and review burden.
- Recommend primary, fallback, and cross-check source lanes.
- Define what credentials or access are needed.
- Define the normalized deterministic evidence record shape needed before Brouwerij Lane is deepened.
- Produce a blocked credential/source report if no credential/source access is available for a narrow live check.

It must not:

- Implement broad API integration.
- Add scraping, generalized ingestion, backend services, CMS, persistence, analytics, CI, or package/tooling changes.
- Open production/public readiness, public schemas/interfaces, broad coverage, full 3D, major animation/aliveness systems, or source-vendor integration.
- Deepen Brouwerij Lane or any other non-west target beyond source-decision/spike evidence.

## Active Blockers

- Source/API strategy is the main Phase 3 blocker. Brouwerij Lane cannot become a real corridor target until the ADR/source spike chooses source lanes, records credential/access needs, and defines deterministic evidence records.
- POI/business sources may support identity, address, category, coordinates, and possibly freshness/status, but they do not by themselves support facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry sources may support building/parcel/geometry context, but they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, or exact address placement.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material; POI data cannot infer it.
- The placeholder Phase 3 raster remains scaffold mechanics only until a corridor-specific review raster/surface is supplied or approved.
- Production visual assets, production asset pipeline, production architecture, public interfaces, production/public claims, broad live data, scraping, Google/Street View/3D Tiles extraction, full 3D, broad coverage, and major animation/aliveness systems remain blocked.

## Pending Decisions

- Primary/fallback/cross-check source lanes for Phase 3 POI/business and geometry context.
- Credential/API key or static source access for the selected source path.
- Normalized deterministic evidence record shape and claim-support statuses.
- Whether Brouwerij Lane facade/frontage/entrance/raster fields remain blocked or receive separate approved evidence.
- Whether an approved corridor-specific review raster/surface should arrive before or after Brouwerij Lane data deepening.
- Phase 3 exit criteria for what scales, what remains manual, and what source gaps dominate.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable Codex task and operational handoff.
- `docs/MVP_SCOPE.md`: detailed MVP boundaries and non-goals.
- `docs/MVP_EXECUTION_LEDGER.md`: current ledger entries plus archived-history pointer.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/DATA_SOURCES.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/ARCHITECTURE.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, and `docs/PROVENANCE_AND_QA.md`: source/architecture background, subordinate to current execution controls.
- `docs/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`: strategic context only; not execution authorization.
- `docs/PHASE_2_PLAN.md`, `docs/AGENT_HANDOFF.md`, and `docs/PHASE_3_SCALE_TEST_PLAN.md`: historical/background only.
