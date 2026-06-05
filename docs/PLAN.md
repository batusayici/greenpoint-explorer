# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-05
Creative/product/public-interface approval owner: Batu
Critical review/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and the Phase 3 to Phase 4 transition. It should stay short: current phase, next task, remaining path, blockers, pending decisions, and delegated-doc pointers.

Use `docs/DOCS_INDEX.md` to route the docs tree. Use `docs/phase-4-execution-roadmap.md` as the primary Phase 4 control surface. Use `docs/MVP_SCOPE.md` for detailed MVP boundaries. Use `docs/MVP_EXECUTION_LEDGER.md` for batch records. Use `docs/CURRENT_EXECUTION_BRIEF.md` for the next Codex task only.

## Source-Of-Truth Order

Use these in order when documents conflict:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/MVP_EXECUTION_LEDGER.md`
5. Topic-specific docs when the task touches their area

`docs/TASKS.md` is deprecated and must not be used as an active source of truth unless `docs/CURRENT_EXECUTION_BRIEF.md` or this plan explicitly revives it.

## Current State

- Current phase: Docs authority audit complete pending review; Phase 4A workflow spike setup remains the proposed next task.
- Docs authority routing: `docs/DOCS_INDEX.md`.
- Current Phase 4 control surface: `docs/phase-4-execution-roadmap.md`.
- Current next task: `Batch 4A-1: Workflow spike setup`, proposed unless repo docs already mark it approved.
- Phase 3 is closed for planning purposes after the Phase 3D corridor style matte review package.
- Phase 3D preserved review evidence remains review-only/non-production: matte asset, app surface, screenshot evidence, reference inventory, self-audit, and evidence inventory.
- Phase 4A remains a decision workflow, not a production system.
- Phase 4B remains post-spike and non-implementation until a later brief explicitly opens implementation.

## Completed Work Pointers

- Detailed batch records: `docs/MVP_EXECUTION_LEDGER.md`
- Older batch history: `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- Detailed MVP scope and non-goals: `docs/MVP_SCOPE.md`
- Docs authority index: `docs/DOCS_INDEX.md`
- Phase 4 execution roadmap: `docs/phase-4-execution-roadmap.md`
- Phase 4A supporting docs: `docs/phase-4a-workflow-spike-plan.md`, `docs/phase-4a-workflow-spike-decision-matrix.md`
- Phase 4B supporting docs: `docs/phase-4b-data-to-scene-workflow.md`, `docs/phase-4b-implementation-plan.md`
- Phase 3 closeout: `docs/phase-3-closeout.md`
- Phase 3D review package: `docs/mvp-review/phase-3d-corridor-style-matte-review/`
- Phase 3 real corridor evidence inventory: `docs/phase-3-real-corridor-evidence-inventory.md`
- Phase 3 POI/business source ADR: `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- Brouwerij Lane source-retrieval blocker record: `docs/phase-3-brouwerij-source-retrieval-spike.md`
- Foursquare Brouwerij one-target adapter contract: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- Foursquare Brouwerij credential/source blocker report: `docs/phase-3-brouwerij-foursquare-credential-blocker.md`

## Roadmap

1. Phase 3 closeout. Complete for planning purposes.
2. Phase 4 roadmap consolidation. Complete pending review.
3. Batch 4A-1: Workflow spike setup. Proposed next task unless repo docs already mark it approved.
4. Phase 4A lane assessments and decision gate.
5. Phase 4B compiler-centered foundation only after Phase 4A recommendation and Batu approval.

## Active Blockers

- Storefront anchoring and business-to-storefront matching are unresolved first-class architecture problems.
- Source/API strategy is no longer the main blocker; source access/material is. Brouwerij Lane cannot become a real corridor target until Batu supplies or approves deterministic source access/material and a later brief authorizes the evidence packet.
- Foursquare remains optional future enrichment and blocked by missing credential plus repo-recorded terms/cache/display approval.
- Mid-corridor and Franklin have sourced/contextual NYC/Open street/building geometry, but sidewalk surfaces, stylized scene projection, real storefronts, exact frontage/order, entrances, facades, address placement, business identity, active status, and raster readiness remain blocked/manual as labeled.
- POI/business sources may support identity, address, category, coordinates, and possibly freshness/status, but they do not by themselves support facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry sources may support building/parcel/geometry context, but they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, or exact address placement.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material; POI data cannot infer it.
- Production visual assets, production asset pipeline, production architecture, public interfaces, production/public claims, broad live data, scraping, Google/Street View/3D Tiles extraction, full-neighborhood scope, dynamic spatial streaming, and deployment remain blocked.

## Pending Decisions

- Batu approval of Batch 4A-1 as the next executable workflow-spike setup if it is not already approved in repo docs.
- Whether Phase 4A recommends deterministic compiler as core, export tools as acceleration/reference, and reality-capture outputs as reference/QA only.
- The smallest Phase 4B proof needed after Phase 4A.
- Phase 4B architecture boundaries, public-interface implications, source fixtures, compiler boundaries, storefront-anchor contract, style recipe contract, asset-kit contract, and runtime scope.
- Batu supply/approval of accurate facade imagery for Greenpoint Ave between Manhattan Ave and Franklin Ave if a later brief seeks exact facade/frontage/entrance extraction.
- Batu approval/supply of LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, another local-directory/community source access/export, Foursquare credential/export path, or another deterministic Brouwerij POI source packet if Brouwerij is reactivated later.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable Codex task and operational handoff.
- `docs/phase-4-execution-roadmap.md`: primary Phase 4 operational roadmap.
- `docs/MVP_SCOPE.md`: detailed MVP boundaries and non-goals.
- `docs/MVP_EXECUTION_LEDGER.md`: current ledger entries plus archived-history pointer.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/DATA_SOURCES.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/ARCHITECTURE.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, and `docs/PROVENANCE_AND_QA.md`: source/architecture background, subordinate to current execution controls.
- `docs/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`: strategic context only; not execution authorization.
- `docs/PHASE_2_PLAN.md`, `docs/AGENT_HANDOFF.md`, and `docs/PHASE_3_SCALE_TEST_PLAN.md`: historical/background only.
