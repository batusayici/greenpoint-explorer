# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-05
Creative/product/public-interface approval owner: Batu
Critical review/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and the Phase 3 to Phase 4 transition. It should stay short: current phase, next task, remaining path, blockers, pending decisions, and delegated-doc pointers.

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

- Current phase: Phase 3 is closed for planning purposes after the Phase 3D corridor style matte review package.
- Current next task: `Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference`, proposed unless repo docs already mark it approved.
- Phase 3 closeout: `docs/phase-3-closeout.md`.
- Phase 3D preserved review evidence: review-only matte at `src/assets/review-only/phase-3d-greenpoint-westward-corridor-matte-review-only.png`, screenshot evidence at `docs/mvp-review/phase-3d-corridor-style-matte-review/generated/phase-3d-corridor-style-matte-default.png`, reference inventory and self-audit in `docs/mvp-review/phase-3d-corridor-style-matte-review/`, and evidence inventory at `docs/phase-3-real-corridor-evidence-inventory.md`.
- Phase 3 conclusion: real geometry, source evidence, facade/reference material, and semantic interaction are required; patching the current manually guided corridor artifact is not scalable enough for production-shaped work.
- Phase 4A planning docs: `docs/phase-4a-workflow-spike-plan.md` and `docs/phase-4a-workflow-spike-decision-matrix.md`.
- Phase 4B planning docs: `docs/phase-4b-data-to-scene-workflow.md` and `docs/phase-4b-implementation-plan.md`. These are non-implementation planning docs only.
- The locked MVP remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave. DTR-11 and the Phase 3D matte remain review-only evidence, not production assets or public factual representations.
- Brouwerij Lane and any other non-west target still cannot be deepened until an approved deterministic source packet/access path or approved manual evidence packet exists and a later brief authorizes the one-target evidence batch.

## Completed Work Pointers

- Detailed batch records: `docs/MVP_EXECUTION_LEDGER.md`
- Older batch history: `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- Detailed MVP scope and non-goals: `docs/MVP_SCOPE.md`
- Phase 2DTR review packets: `docs/mvp-review/phase-2dtr-*`
- MVP feedback demo package: `docs/mvp-review/mvp-feedback-demo-package/`
- Phase 3 architecture decision surface: `docs/phase-3-architecture-scaling-decision-surface.md`
- Phase 3 closeout: `docs/phase-3-closeout.md`
- Phase 3D review package: `docs/mvp-review/phase-3d-corridor-style-matte-review/`
- Phase 3 real corridor evidence inventory: `docs/phase-3-real-corridor-evidence-inventory.md`
- Phase 3 POI/business source ADR: `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- Brouwerij Lane source-retrieval blocker record: `docs/phase-3-brouwerij-source-retrieval-spike.md`
- Foursquare Brouwerij one-target adapter contract: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- Foursquare Brouwerij credential/source blocker report: `docs/phase-3-brouwerij-foursquare-credential-blocker.md`

## Roadmap

1. Phase 3 closeout. Complete for planning purposes.
2. Phase 4A workflow spike. Proposed next task unless repo docs already mark it approved.
3. Phase 4A decision read. Decide core lane, reference lane, rejected/deferred lanes, smallest Phase 4B proof, and required approvals.
4. Phase 4B compiler-centered foundation. Planning-only until a later brief explicitly opens implementation.
5. Phase 4B exit read. Evaluate reproducibility, storefront anchoring, semantic interaction, art-kit viability, manual override burden, and source/reference blockers.

## Phase 4A Requirements

Phase 4A must compare the same Greenpoint Ave Manhattan-to-Franklin corridor across:

- Deterministic compiler lane.
- 3D map/export shortcut lane.
- Reality-capture/reference lane.

It must score semantic interaction, reproducibility, art direction, licensing/runtime risk, editability, stable IDs, and storefront-anchor support.

Default stance: the compiler lane is presumed core unless the spike disproves it. Export and reality-capture workflows may be reference or acceleration lanes only.

Phase 4A must not open full-neighborhood scope, PostGIS, dynamic spatial streaming, canonical splats/world models, Blender-as-layout-source, Phase 4B runtime implementation, schema files, compiler scripts, source fixtures, generated manifests, asset-kit files, or public interfaces.

## Phase 4B Planning Boundary

Phase 4B is `Reproducible Data-to-Scene + Storefront Anchor Foundation`.

The Phase 4B docs describe the later foundation conceptually:

- file-based source fixture;
- generated semantic scene manifest;
- explicit storefront anchors;
- stable ID rules;
- style recipe and asset registry contracts;
- versioned manual overrides;
- primitive Python spatial compiler;
- Node/schema verification;
- optional later browser manifest consumption only when implementation scope opens.

All Phase 4B schema/compiler/storefront/style/asset contracts are planning-only until Batu approves the architecture boundaries, public-interface implications, and executable scope in a later current brief.

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

- Batu approval of Phase 4A as the next executable workflow spike if it is not already approved in repo docs.
- Whether Phase 4A recommends deterministic compiler as core, export tools as acceleration/reference, and reality-capture outputs as reference/QA only.
- The smallest Phase 4B proof needed after Phase 4A.
- Phase 4B architecture boundaries, public-interface implications, source fixtures, compiler boundaries, storefront-anchor contract, style recipe contract, asset-kit contract, and runtime scope.
- Batu supply/approval of accurate facade imagery for Greenpoint Ave between Manhattan Ave and Franklin Ave if a later brief seeks exact facade/frontage/entrance extraction.
- Batu approval/supply of LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, another local-directory/community source access/export, Foursquare credential/export path, or another deterministic Brouwerij POI source packet if Brouwerij is reactivated later.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable Codex task and operational handoff.
- `docs/MVP_SCOPE.md`: detailed MVP boundaries and non-goals.
- `docs/MVP_EXECUTION_LEDGER.md`: current ledger entries plus archived-history pointer.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/DATA_SOURCES.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/ARCHITECTURE.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, and `docs/PROVENANCE_AND_QA.md`: source/architecture background, subordinate to current execution controls.
- `docs/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`: strategic context only; not execution authorization.
- `docs/PHASE_2_PLAN.md`, `docs/AGENT_HANDOFF.md`, and `docs/PHASE_3_SCALE_TEST_PLAN.md`: historical/background only.
