# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-06-03
Creative/product/public-interface approval owner: Batu
Critical review/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and testing. It should stay short: current phase, next task, remaining path, blockers, pending decisions, and delegated-doc pointers.

Use `docs/MVP_SCOPE.md` for detailed MVP boundaries. Use `docs/MVP_EXECUTION_LEDGER.md` for batch records. Use `docs/CURRENT_EXECUTION_BRIEF.md` for the next Codex task only.

## Product Goal

Greenpoint Isometric Explorer should prove that a small authored Greenpoint scene can feel visually distinctive, locally specific, worth clicking, and reproducible from traceable real-world inputs.

## MVP Scope Pointer

The MVP remains one review-only, raster-first, interactive four-corner diorama of Manhattan Ave x Greenpoint Ave. Its detailed boundaries, non-goals, must-have/should-have/cuttable items, and acceptance rules live in `docs/MVP_SCOPE.md`.

## Source-Of-Truth Order

Use these in order when documents conflict:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/MVP_EXECUTION_LEDGER.md`
5. Topic-specific docs when the task touches their area

`docs/TASKS.md` is deprecated and must not be used as an active source of truth unless `docs/CURRENT_EXECUTION_BRIEF.md` or this plan explicitly revives it.

## Current State Snapshot

- Current phase: Phase 2DTR - Data-to-Raster MVP Proof is the active Phase 2 sub-track.
- Current next task: Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.
- MVP-29E remains the current manually composed four-corner raster baseline/reference, not the final proof of the pipeline.
- Phase 2A through Phase 2AC are completed exploratory/source/QA groundwork. They established manifest, source-evidence, draft-scene, QA, and official-footprint comparison lanes, but they do not complete the MVP proof.
- Approved visual direction: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction.
- Active visual reference source: `docs/approved-reference-corpus/`.
- Active reusable-system evidence: `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`.
- Current implementation evidence: normal mode uses the MVP-29E review-only raster plate; QA mode can surface generated draft-scene entities, active-target source/status records, official-footprint candidate comparisons, selected-card evidence/status rows, and layer controls. See the ledger and archived ledger history for batch detail.

## Roadmap Summary

| Area | Status | Current meaning |
| --- | --- | --- |
| Governance and scope | Complete | Authority, source-of-truth order, review-only status, and production gates are documented. |
| Visual direction | Complete | Inked Indie / Compact Corner is approved as visual direction only, not production asset approval. |
| Review-only prototype baseline | Mostly complete | MVP-29E is the current manually composed four-corner raster/app baseline for review. |
| Phase 2A-2AC data groundwork | Complete as groundwork | Useful manifest/source/QA evidence exists, but it remains review-only and not production schema/pipeline approval. |
| Phase 2DTR data-to-raster proof | Active | The MVP must now prove structured real-world inputs can reproduce or improve the four-corner raster/spec output. |
| Phase 3 Neighborhood Scale Validation | Future | Reserved for later scale testing after the current intersection proof is accepted. |
| MVP QA/demo freeze | Future | Blocked until Batu accepts sufficient four-corner output and opens the QA/demo freeze. |

## Phase 2DTR Outcome Plan

1. Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice: prove the pipeline on Grillpoint/NW by generating a fresh review-only raster scene spec/art prompt from structured data rather than hand-authored prose/manual composition.
2. Phase 2DTR-2 - Four-Target Structured Facade Fixture: extend the structured facade/source fixture model to Grillpoint, McDonald's, Dunkin', Citizens, and Greenpoint G.
3. Phase 2DTR-3 - Four-Corner Regenerated Raster Attempt: generate a new four-corner raster/spec attempt from the structured scene manifest and compare it against MVP-29E.
4. Phase 2DTR-4 - QA Acceptance / Gap Report: decide what is source-backed, inferred, blocked, photo/vendor-dependent, and good enough for MVP demo.

Phase 2 now has three lanes:

- Strict promotion lane: keeps product-copy readiness, promotion gates, determinism checks, and negative contract tests intact for future product/public use.
- Draft prototype scene lane: allows status-labeled real names, address/category facts, approximate geometry, storefront bays, facades, signs, and scene anchors before product-copy readiness.
- Data-to-raster proof lane: focuses draft/source/QA groundwork into review-only raster/spec regeneration evidence for the current four-corner MVP scene.

## Current Next Task

The current next pointer is documented in `docs/CURRENT_EXECUTION_BRIEF.md`:

- Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice.
- Required output: structured one-corner source object, deterministic generated raster/spec artifact, provenance/status mapping from visual instructions back to source fields, and comparison against MVP-29E.
- The next implementation batch must produce visible pipeline evidence, not only overlays, clearer explanation, verifier-only work, or governance cleanup.

## Locked Decisions

- The MVP is one authored interactive diorama scene, not a broad map product or game system.
- `docs/MVP_SCOPE.md` is the detailed MVP scope authority.
- `docs/CURRENT_EXECUTION_BRIEF.md` is the canonical source for Codex's next task.
- `docs/MVP_EXECUTION_LEDGER.md` records batch outcomes and reconciliation status, but it does not authorize execution by itself.
- Phase 2DTR stays inside Phase 2 and does not approve production schemas, public interfaces, production assets, live source acquisition, or public readiness.
- Batu-supplied reference photos are approved only as MVP review/source facade imagery for Phase 2DTR-style review generation and facade-field extraction. They are not production assets, training input, texture sources, or a general source-policy approval.
- Google/Street View/3D Tiles extraction, third-party image scraping, production reuse, training, texture extraction, and production/public claims remain blocked unless a later explicit approval gate opens them.
- The approved reference corpus is the active visual reference source for future visual, prototype, and assetization work.

## Active Blockers

- Product-copy readiness, exact/public claims, promotion gates, determinism checks, and negative contract tests must not be weakened.
- Production visual assets, production asset direction, production asset pipeline, production buildability, and production scalability are unapproved.
- Exact facade geometry, storefront widths, frontage/order, exact address placement, exact station geometry, parcel/tax-lot/building footprint claims, and active-business claims are not approved for production representation.
- NYC Open Data/building footprints are scaffold geometry context only; they do not prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or station geometry.
- Normal-mode code-native primary world art, raster asset edits, full MVP-29G screenshot QA, MVP-30 QA/demo freeze, package/tooling changes, package-script/CI additions, source-vendor integration, live data, scraping, backend/CMS/persistence/analytics, deployment, and broad coverage remain blocked unless a later brief explicitly opens them.

## Pending Decisions

- Whether Batu accepts, revises, or rejects the focused MVP-29E raster/app integration output.
- Whether Batu accepts, revises, or rejects the Phase 2DTR-1 one-corner reproduction output once implemented.
- Whether the MVP-29E raster needs another art pass for intersection/crosswalk precision, subway cue exactness, storefront specificity, sign readability, cue density, or overall visual taste.
- Whether the MVP-29E hotspot/card alignment and mobile containment are sufficient for the next gate or need a separate revision pass.
- Whether Batu opens full MVP-29G screenshot QA recovery and what screenshot states are required.
- Whether the Phase 2DTR-1 output proves enough of the source-to-raster path to extend to the four-target structured facade fixture.
- Which structured facade/source fields should influence normal-mode scene rendering versus QA/debug-only overlays as Phase 2DTR matures.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable or proposed Codex task and operational handoff.
- `docs/MVP_SCOPE.md`: detailed MVP scope and non-goals.
- `docs/MVP_EXECUTION_LEDGER.md`: current ledger entries plus archived-history pointer.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/ART_DIRECTION.md`: art-direction principles, reference handling, and historical visual context.
- `docs/VISUAL_ARTIFACT_STANDARDS.md`: fidelity ladder, artifact-format rules, and visual self-audit requirements.
- `docs/VISUAL_QA_CHECKLIST.md`: visual QA checklist.
- `docs/AGENTIC_TOOLING.md`: workflow/tooling policy and skills/plugins governance.
- `docs/PHASE_2_PLAN.md`: historical stub only.
- `docs/AGENT_HANDOFF.md`: historical auto-advance stub only.
- `docs/ARCHITECTURE.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, `docs/DATA_SOURCES.md`, and `docs/PROVENANCE_AND_QA.md`: Phase 2A-era planning background; subordinate to the current DTR controls.
- `docs/PHASE_3_SCALE_TEST_PLAN.md`: future Neighborhood Scale Validation plan.
- `docs/TASKS.md`: deprecated unless revived by this plan or the current brief.
