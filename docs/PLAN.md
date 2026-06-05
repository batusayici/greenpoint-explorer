# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-05
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

- Current phase: Phase 3 geometry-first corridor review pass complete pending Batu review for the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice.
- Current next task: Batu review of the app surface, deterministic screenshot evidence at `docs/mvp-review/phase-3-geometry-first-corridor-review/generated/phase-3-geometry-first-corridor-default.png`, and evidence inventory to decide whether the corridor reads as Greenpoint Ave from Manhattan toward Franklin with sourced west-anchor context, manual-draft mid-corridor massing, and blocked Franklin/Brouwerij markers. No further implementation batch is authorized until Batu approves the next refinement, source, facade, or missing-geometry step.
- The Phase 3 POI/business source ADR is complete and lives at `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`.
- Brouwerij Lane and any other non-west target still cannot be deepened until an approved deterministic source packet/access path or approved manual evidence packet exists and a later brief authorizes the one-target evidence batch.
- The locked MVP remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave. DTR-11 is the active review-only demo raster in the app, and the Vercel Preview is published behind protected shareable-link access.
- Phase 2DTR / MVP feedback demo is complete and locked for MVP-feedback purposes. Do not open DTR-12 unless later feedback makes that necessary and Batu explicitly approves it.
- Phase 3 scaffold direction is approved only for the first scaffold direction in `docs/phase-3-architecture-scaling-decision-surface.md`: block/tile-scoped manifest, raster-first plates/layers, structured interaction plus QA/provenance overlays, and reusable primitives for geometry, hotspots, masks, labels, cards, provenance, and review.
- Phase 3 implementation/source planning so far: first scaffold complete, west anchor sourced from existing reviewed MVP context, mid-corridor candidate/status layer complete, Franklin endpoint status layer complete, local-only evidence-deepening audit complete, Brouwerij Lane source-retrieval spike complete as blocked, Phase 3 POI/business source ADR complete, local-directory ADR amendment complete, Foursquare Brouwerij adapter contract complete, Foursquare credential/source blocker report complete, west-anchor source-independent QA/evidence overlay pass structurally complete, west-anchor spatial grounding pass complete but rejected as the Phase 3 product review surface, real corridor reset complete with the accepted DTR-11 west-anchor raster wired as the visual baseline, Phase 3 corridor NYC/Open geometry context packet complete with west-anchor geometry carried forward and mid-corridor/Franklin/Brouwerij geometry gaps explicitly blocked, geometry-first corridor review surface complete with manual-draft mid-corridor street/massing continuation plus blocked Franklin/Brouwerij markers, and deterministic screenshot evidence generated for Batu review.
- Brouwerij Lane remains a blocked future target, not the active critical path. Identity, address, category/business type, coordinates, freshness/status, and provenance cannot be deepened until Batu supplies or approves a deterministic source packet/access path.
- Batu approved the Phase 3 direction correction on 2026-06-04: users should eventually explore the real Greenpoint Ave corridor between Manhattan Ave and Franklin Ave using real geometry, real business addresses, real business information, and Batu-supplied/approved facade imagery. Arbitrary fictional storefront rasters and SVG/code-native diagramming are not acceptable as the Phase 3 product review surface.
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
4. Source-independent west-anchor QA/evidence overlay pass. Structurally complete; not acceptable as a product review surface while paired with arbitrary placeholder storefront art.
5. West-anchor spatial grounding pass. Complete as scaffold/debug work; rejected as the Phase 3 visual/product review target.
6. Real corridor reset: remove the arbitrary placeholder storefront raster from normal Phase 3 review, restore/anchor on the accepted Phase 2/DTR-11 Manhattan Ave / Greenpoint Ave raster, and represent mid-corridor/Franklin as real-data intake/blocked until sourced. Complete pending Batu review.
7. Build or ingest real corridor geometry evidence for Greenpoint Ave from Manhattan Ave to Franklin Ave. Initial repo-local NYC/Open geometry packet complete; missing mid-corridor and Franklin geometry source records remain blocked.
8. Geometry-first corridor review surface. Complete pending Batu review; the current app surface keeps DTR-11 as the west baseline, renders mid-corridor street/massing continuation as manual draft/contextual, and renders Franklin/Brouwerij as blocked markers.
9. Build or ingest real corridor business evidence: identity, addresses, categories, coordinates, provenance, and evidence status.
10. Add approved facade/frontage/entrance evidence path where Batu supplies or approves corridor facade imagery.
11. Join retrieved or manually approved POI data to NYC/open geometry context where supported.
12. Deepen one non-west target only after deterministic source/access or approved manual evidence exists.
13. Produce or approve corridor-specific review raster/surface.
14. Validate corridor interaction, QA overlays, cards, pan/zoom, and browser performance.
15. Run Phase 3 exit read: what scales, what is manual, what is blocked, and what source gaps dominate.

## Next Batch Requirements

No implementation batch is currently authorized. The next action is Batu review of the Phase 3 geometry-first corridor app surface, screenshot evidence, and `docs/phase-3-real-corridor-evidence-inventory.md`.

A later brief may authorize a narrow geometry refinement or real-corridor evidence intake batch. That batch would need either Batu feedback on the manual-draft corridor read, approved source/access material for missing mid-corridor/Franklin geometry, real businesses, addresses, categories, coordinates/freshness/status where available, or Batu-supplied or Batu-approved facade/reference imagery.

## Active Blockers

- Source/API strategy is no longer the main blocker; source access/material is. Brouwerij Lane cannot become a real corridor target until Batu supplies or approves deterministic source access/material and a later brief authorizes the one-target evidence packet. The Foursquare path is optional future enrichment and remains blocked by missing credential and repo-recorded terms/cache/display approval.
- Mid-corridor remains manual-draft/contextual for visual geometry review only, while Franklin and Brouwerij remain blocked/contextual markers; the current geometry packet documents that no repo-local NYC/Open geometry records cover those missing portions. They cannot be rendered as real storefronts or exact geometry until deterministic source records and Batu-approved facade/reference imagery exist.
- POI/business sources may support identity, address, category, coordinates, and possibly freshness/status, but they do not by themselves support facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry sources may support building/parcel/geometry context, but they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, or exact address placement.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material; POI data cannot infer it.
- A corridor-specific review raster/surface beyond the accepted west-anchor DTR-11 raster is still pending supplied/approved real evidence and facade imagery.
- Production visual assets, production asset pipeline, production architecture, public interfaces, production/public claims, broad live data, scraping, Google/Street View/3D Tiles extraction, full 3D, broad coverage, and major animation/aliveness systems remain blocked.

## Pending Decisions

- Batu review/acceptance of the Phase 3 geometry-first corridor surface: whether the Manhattan-to-Franklin corridor reads spatially before business/place overlays.
- Batu supply/approval of accurate facade imagery for Greenpoint Ave between Manhattan Ave and Franklin Ave.
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
