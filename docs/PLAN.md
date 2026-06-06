# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-06
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

- Current phase: Phase 4C Geometry-Only Facade Cue Work Packet is open.
- Docs authority routing: `docs/DOCS_INDEX.md`.
- Current Phase 4 control surface: `docs/phase-4-execution-roadmap.md`.
- Current next task: execute `Batch 4C-2: Geometry-only facade cue fixture and QA overlay`.
- Pre-authorized queue: `Batch 4C-3: Narrow geometry-only cue tuning pass`, conditionally available only if 4C-2 verification passes, no source/evidence uncertainty appears, no product/visual Batu decision is needed, changes remain geometry-only and deterministic, and final 4C-3 scope stays limited to small cue readability tuning.
- Hard review gate: stop after 4C-3, or earlier if a visual/product review need appears, verification fails, source evidence is missing/uncertain, scope would expand beyond geometry-only deterministic cues, or implementation commit behavior is needed without explicit Batu authorization.
- Phase 4 execution gate: agents may execute only the current batch named in `docs/CURRENT_EXECUTION_BRIEF.md` or the next batch already named in that brief's pre-authorized queue, must use `docs/phase-4-execution-roadmap.md` as the operating plan, and must stop at hard Batu review gates instead of inventing, skipping, or opening unqueued batches.
- Phase 3 is closed for planning purposes after the Phase 3D corridor style matte review package.
- Phase 3D preserved review evidence remains review-only/non-production: matte asset, app surface, screenshot evidence, reference inventory, self-audit, and evidence inventory.
- Phase 4A remains a decision workflow, not a production system.
- Phase 4B now has lean planning contracts, one minimal source fixture/verifier proof, one deterministic primitive compiler/generated semantic scene manifest, one deterministic interactive 3D graybox/isometric runtime preview, one Batu-approved runtime legibility revision, one Batu-accepted source-backed context building coverage expansion, one Batu-reviewed graybox recognizability QA pass with Partial pass result, and one Batu-reviewed 4B-6R corridor frame correction with CONDITIONAL PASS.
- Phase 4C now has a docs-only recognizable facade cue plan and a bounded work packet that opens only geometry-only cue fixture/verifier/runtime QA overlay work.
- Phase 4B visual-proof path is clarified: after an approved primitive compiler, the first visual proof must be a deterministic interactive 3D graybox/isometric corridor scene, not a static/raster/2D/manual/manifest-only substitute.

## Completed Work Pointers

- Detailed batch records: `docs/MVP_EXECUTION_LEDGER.md`
- Older batch history: `docs/archive/MVP_EXECUTION_LEDGER_HISTORY.md`
- Detailed MVP scope and non-goals: `docs/MVP_SCOPE.md`
- Docs authority index: `docs/DOCS_INDEX.md`
- Phase 4 execution roadmap: `docs/phase-4-execution-roadmap.md`
- Phase 4C recognizable facade cue plan: `docs/phase-4c-recognizable-facade-cue-plan.md`
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
3. Batch 4A-1: Workflow spike setup. Complete; Batu approved opening 4A-2.
4. Batch 4A-2: Deterministic compiler lane assessment. Complete; Batu approved opening 4A-3.
5. Batch 4A-3: 3D map/export shortcut assessment. Complete; Batu approved opening 4A-4.
6. Batch 4A-4: Reality-capture/reference lane assessment. Complete; Batu approved opening 4A-5.
7. Batch 4A-5: Decision gate. Complete; Batu approved opening 4B-1.
8. Batch 4B-1: Contract foundation. Complete; Batu approved opening 4B-2.
9. Batch 4B-2: Minimal source fixture + verifier. Complete; Batu approved opening 4B-3.
10. Batch 4B-3: Primitive compiler. Reviewed, approved, and closed.
11. Batch 4B-4: Runtime manifest preview. Technically complete as a runtime foundation; Batu requested a legibility revision before accepting it as a corridor-validation scene.
12. Batch 4B-4R: Runtime preview legibility pass. Batu-reviewed and approved as complete pending final repo verification.
13. Batch 4B-5: Context building coverage expansion. Batu-reviewed and accepted for purposes of opening 4B-6.
14. Batch 4B-6: Graybox corridor recognizability QA. Batu-reviewed with result: Partial pass.
15. Batch 4B-6R: Corridor frame and endpoint cue correction. Batu-reviewed with result: CONDITIONAL PASS.
16. Batch 4C-1: Recognizable facade cue planning. Complete as docs-only planning.
17. Phase 4C Geometry-Only Facade Cue Work Packet. Open; current executable batch is 4C-2, with 4C-3 conditionally queued.

## Active Blockers

- Storefront anchoring and business-to-storefront matching are framed by 4B-1 planning contracts and enforced as blocked/no-candidate claims in the 4B-2 source fixture; they remain unresolved first-class implementation problems until approved evidence exists.
- Source/API strategy is no longer the main blocker; source access/material is. Brouwerij Lane cannot become a real corridor target until Batu supplies or approves deterministic source access/material and a later brief authorizes the evidence packet.
- Foursquare remains optional future enrichment and blocked by missing credential plus repo-recorded terms/cache/display approval.
- Mid-corridor and Franklin have sourced/contextual NYC/Open street/building geometry, but sidewalk surfaces, stylized scene projection, real storefronts, exact frontage/order, entrances, facades, address placement, business identity, active status, and raster readiness remain blocked/manual as labeled.
- POI/business sources may support identity, address, category, coordinates, and possibly freshness/status, but they do not by themselves support facade, storefront/frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry sources may support building/parcel/geometry context, but they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, or exact address placement.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material; POI data cannot infer it.
- Geometry-only facade/corridor cues may improve review recognizability only as status-labeled review affordances; they do not prove facade, storefront, entrance, sign, material, address, business, or landmark identity.
- Production visual assets, production asset pipeline, production architecture, public interfaces, production/public claims, broad live data, scraping, Google/Street View/3D Tiles extraction, full-neighborhood scope, dynamic spatial streaming, and deployment remain blocked.

## Pending Decisions

- Batu review after the bounded 4C packet: 4C-2 may execute now; 4C-3 is conditionally pre-authorized only if 4C-2 passes verification and remains geometry-only/deterministic without Batu product/visual decisions.
- Conditional follow-up from 4B-6R: M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.
- Any scope change beyond the bounded 4C work packet, including source expansion beyond what existing manifest/geometry supports, generated manifest changes not required by the cue proof, renderer expansion beyond minimal Three.js inside the existing React + Vite shell, package dependencies without explicit authorization, screenshot tooling expansion, public/runtime interface expansion, production visual assets, business verification, new APIs/scraping, evidence-approved facade cues, anchor/facade/storefront semantics, art direction, 4B-7 camera tuning, 4C-4, or self-advancing beyond 4C-3.
- Batu supply/approval of accurate facade imagery for Greenpoint Ave between Manhattan Ave and Franklin Ave if a later brief seeks exact facade/frontage/entrance extraction.
- Batu approval/supply of LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, another local-directory/community source access/export, Foursquare credential/export path, or another deterministic Brouwerij POI source packet if Brouwerij is reactivated later.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable Codex task and operational handoff.
- `docs/phase-4-execution-roadmap.md`: primary Phase 4 operational roadmap.
- `docs/phase-4c-recognizable-facade-cue-plan.md`: Phase 4C cue taxonomy, evidence thresholds, fixture requirements, and manual review gates.
- `docs/MVP_SCOPE.md`: detailed MVP boundaries and non-goals.
- `docs/MVP_EXECUTION_LEDGER.md`: current ledger entries plus archived-history pointer.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/DATA_SOURCES.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/ARCHITECTURE.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, and `docs/PROVENANCE_AND_QA.md`: source/architecture background, subordinate to current execution controls.
- `docs/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`: strategic context only; not execution authorization.
- `docs/PHASE_2_PLAN.md`, `docs/AGENT_HANDOFF.md`, and `docs/PHASE_3_SCALE_TEST_PLAN.md`: historical/background only.
