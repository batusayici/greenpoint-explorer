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

- Current phase: Phase 3 west-anchor spatial grounding for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice.
- Current next task: Phase 3 west-anchor spatial grounding pass for Manhattan Ave / Greenpoint Ave.
- The Phase 3 POI/business source ADR is complete and lives at `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`.
- Brouwerij Lane and any other non-west target still cannot be deepened until an approved deterministic source packet/access path or approved manual evidence packet exists and a later brief authorizes the one-target evidence batch.
- The locked MVP remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave. DTR-11 is the active review-only demo raster in the app, and the Vercel Preview is published behind protected shareable-link access.
- Phase 2DTR / MVP feedback demo is complete and locked for MVP-feedback purposes. Do not open DTR-12 unless later feedback makes that necessary and Batu explicitly approves it.
- Phase 3 scaffold direction is approved only for the first scaffold direction in `docs/phase-3-architecture-scaling-decision-surface.md`: block/tile-scoped manifest, raster-first plates/layers, structured interaction plus QA/provenance overlays, and reusable primitives for geometry, hotspots, masks, labels, cards, provenance, and review.
- Phase 3 implementation/source planning so far: first scaffold complete, west anchor sourced from existing reviewed MVP context, mid-corridor candidate/status layer complete, Franklin endpoint status layer complete, local-only evidence-deepening audit complete, Brouwerij Lane source-retrieval spike complete as blocked, Phase 3 POI/business source ADR complete, local-directory ADR amendment complete, Foursquare Brouwerij adapter contract complete, Foursquare credential/source blocker report complete, and west-anchor source-independent QA/evidence overlay pass structurally complete but not yet visually feedback-ready.
- Brouwerij Lane remains a blocked future target, not the active critical path. Identity, address, category/business type, coordinates, freshness/status, and provenance cannot be deepened until Batu supplies or approves a deterministic source packet/access path.
- The west anchor now structurally combines existing reviewed business/place metadata, NYC/Open geometry context, DTR-11/reference-photo-derived facade evidence status, separated evidence lanes, and interactive card/QA overlay behavior. Batu review found the current corridor is not yet visually feedback-ready because the base scene does not resemble the real Manhattan Ave / Greenpoint Ave location closely enough to support meaningful review. The overlay is blocked from meaningful Batu review until the base scene is recognizable as Manhattan Ave / Greenpoint Ave.
- Selected source strategy: the strategic local-directory/community-validation lane includes LiveXYZ, North Brooklyn Chamber member directory, Shop Small Greenpoint directory, and other Batu-approved local business lists if Batu approves access, terms, caching, attribution, and fixture storage; Foursquare remains the practical near-term POI implementation lane after credential/terms approval when no deterministic local-directory source is available; OSM is the open cross-check lane; NYC Open Data is the geometry/context lane; manual evidence packets are required for facade/frontage/entrance/raster readiness.

## Completed Work Pointers

- Detailed batch records: `docs/MVP_EXECUTION_LEDGER.md`
- Older batch history: `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- Detailed MVP scope and non-goals: `docs/MVP_SCOPE.md`
- Phase 2DTR review packets: `docs/mvp-review/phase-2dtr-*`
- MVP feedback demo package: `docs/mvp-review/mvp-feedback-demo-package/`
- Phase 3 architecture decision surface: `docs/phase-3-architecture-scaling-decision-surface.md`
- Brouwerij Lane source-retrieval blocker record: `docs/phase-3-brouwerij-source-retrieval-spike.md`
- Phase 3 POI/business source ADR: `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- Foursquare Brouwerij one-target adapter contract: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- Foursquare Brouwerij credential/source blocker report: `docs/phase-3-brouwerij-foursquare-credential-blocker.md`

## Phase 3 Completion Roadmap

1. Phase 3 POI/business source ADR + source spike. Complete.
2. Choose primary/fallback/cross-check source lanes for business identity, address, category, coordinates, freshness/status, geometry context, facade/frontage/entrance evidence. Complete.
3. Define normalized deterministic evidence record shape. Complete as review-only ADR shape, not a public/runtime interface.
4. Source-independent west-anchor QA/evidence overlay pass. Structurally complete; visually not yet feedback-ready.
5. West-anchor spatial grounding pass: make the base scene recognizable as Manhattan Ave / Greenpoint Ave using available geometry context, plausible intersection/corner logic, building massing, storefront placement, and visible reference-photo/DTR-11 facade cues.
6. Pending Batu review/approval of the spatially grounded west-anchor visible proof.
7. Add approved facade/frontage/entrance evidence path where Batu supplies or approves evidence.
8. Join retrieved or manually approved POI data to NYC/open geometry context where supported.
9. Deepen one non-west target only after deterministic source/access or approved manual evidence exists.
10. Produce or approve corridor-specific review raster/surface.
11. Validate corridor interaction, QA overlays, cards, pan/zoom, and browser performance.
12. Run Phase 3 exit read: what scales, what is manual, what is blocked, and what source gaps dominate.

## Next Batch Requirements

The next batch is the Phase 3 west-anchor spatial grounding pass. It should keep moving visible MVP proof work without treating Foursquare as a critical-path dependency.

It should:

- Prioritize west-anchor spatial recognizability over additional metadata/evidence-lane work. A reviewer should be able to tell what real intersection this represents before being asked to evaluate cards, QA overlays, facade evidence, or claim status.
- Preserve the west-anchor evidence lanes and claim limits now visible in the demo, but treat them as supporting UI until the base scene is recognizable.
- Prefer a bounded visible improvement: Manhattan Ave / Greenpoint Ave street relationship, approximate building massing from available geometry context, plausible corner/storefront placement, and visible reference-photo/DTR-11 facade cues in the scene itself.
- Keep all spatial, facade, frontage, entrance, geometry, and raster-readiness claims conservative and visibly status-labeled.
- Keep Brouwerij Lane, Franklin, and mid-corridor as candidate/blocked unless Batu supplies approved source/reference material and a later brief authorizes deepening.
- Keep facade/frontage/order/entrance/raster readiness blocked unless separate Batu-approved evidence supports them.
- Treat Foursquare as optional future enrichment only unless credentials and repo-recorded terms/cache/display/review-only approvals exist.

It must not:

- Implement broad API integration.
- Add scraping, generalized ingestion, backend services, CMS, persistence, analytics, CI, or package/tooling changes.
- Open production/public readiness, public schemas/interfaces, broad coverage, full 3D, major animation/aliveness systems, or source-vendor integration.
- Deepen Brouwerij Lane, Franklin, or any other non-west target without approved source/reference material and a later brief.
- Treat the current evidence overlay as feedback-ready before the base scene is recognizable as Manhattan Ave / Greenpoint Ave.

## Active Blockers

- Source/API strategy is no longer the main blocker; source access/material is. Brouwerij Lane cannot become a real corridor target until Batu supplies or approves deterministic source access/material and a later brief authorizes the one-target evidence packet. The Foursquare path is optional future enrichment and remains blocked by missing credential and repo-recorded terms/cache/display approval.
- The west-anchor evidence overlay is structurally useful but visually not yet feedback-ready; meaningful Batu review is blocked until the base scene reads as the real Manhattan Ave / Greenpoint Ave location.
- POI/business sources may support identity, address, category, coordinates, and possibly freshness/status, but they do not by themselves support facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry sources may support building/parcel/geometry context, but they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, or exact address placement.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material; POI data cannot infer it.
- The placeholder Phase 3 raster remains scaffold mechanics only until a corridor-specific review raster/surface is supplied or approved.
- Production visual assets, production asset pipeline, production architecture, public interfaces, production/public claims, broad live data, scraping, Google/Street View/3D Tiles extraction, full 3D, broad coverage, and major animation/aliveness systems remain blocked.

## Pending Decisions

- Batu review/acceptance of the west-anchor spatial grounding pass once the base scene is recognizable enough to support meaningful feedback.
- Batu choice/approval of any follow-up evidence-lane, facade, or non-west target progression after spatial recognizability is established.
- Batu approval/supply of LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, another local-directory/community source access/export, Foursquare credential/export path, or another deterministic Brouwerij POI source packet if Brouwerij is reactivated later.
- Whether a later brief authorizes a one-target Brouwerij source packet/retrieval batch after access/material is available.
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
