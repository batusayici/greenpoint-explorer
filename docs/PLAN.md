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
- Current next task: Batu review of Phase 2DTR-11 output; MVP feedback demo packaging is proposed next if Batu accepts the reference-image facade fidelity pass.
- MVP-29E remains the current manually composed four-corner raster baseline/reference, not the final proof of the pipeline.
- Phase 2DTR-1 now has a review packet at `docs/mvp-review/phase-2dtr-1-one-corner-real-data-to-raster-reproduction-slice/` with a structured Grillpoint/NW source object, deterministic raster/spec artifact, visual-instruction provenance map, and visible comparison board against MVP-29E.
- Phase 2DTR-2 now has a review packet at `docs/mvp-review/phase-2dtr-2-four-target-structured-facade-fixture/` with a four-target structured facade fixture, deterministic raster/spec index, visual-instruction provenance map, and visible comparison board.
- Phase 2DTR-3 now has a review packet at `docs/mvp-review/phase-2dtr-3-four-corner-regenerated-raster-attempt/` with a deterministic four-corner regenerated raster/spec attempt, visual-instruction provenance map, gap report, and visible comparison/spec board.
- Phase 2DTR-4 now has a review packet at `docs/mvp-review/phase-2dtr-4-exact-geometry-source-map-target-scene-spec/` with an exact geometry source map, target scene spec, reproducibility gap list, and visible source-map board.
- Phase 2DTR-5 now has a review packet at `docs/mvp-review/phase-2dtr-5-exact-review-geometry-fixture-to-raster-prompt-adapter/` with a structured exact review geometry fixture, deterministic raster prompt adapter spec, adapter provenance map, and raster prompt text.
- Phase 2DTR-6 now has a review packet at `docs/mvp-review/phase-2dtr-6-exact-review-geometry-raster-artifact-generation/` with a visually strong review-only raster attempt and QA/contact-sheet board, but Batu identified that it did not prove source-data-driven rendering from the Phase 2DTR-5 fixture.
- Phase 2DTR-7 now has a review packet at `docs/mvp-review/phase-2dtr-7-fixture-to-blueprint-scene-layout-validation/` with a deterministic black-and-white SVG blueprint and validation report generated from the Phase 2DTR-5 exact review geometry fixture.
- Phase 2DTR-8 now has a review packet at `docs/mvp-review/phase-2dtr-8-fixture-geometry-primitive-completion-for-styled-raster-readiness/` with completed review-only geometry primitives, a JSON-first styled-raster-ready adapter, a primitive blueprint, and a validation report with status `review-only-ready-for-dtr9`.
- Phase 2DTR-9 now has a review packet at `docs/mvp-review/phase-2dtr-9-controlled-styled-raster-from-geometry-first-adapter/` with a controlled review-only styled raster, QA comparison board, and machine-readable QA report generated from the DTR-8 geometry-first adapter.
- Phase 2DTR-10 now has a review packet at `docs/mvp-review/phase-2dtr-10-narrow-corrective-styled-raster-pass/` with a corrected styled raster, before/after QA board, and QA report marking it ready to package for external MVP feedback.
- Phase 2DTR-11 now has a review packet at `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/` with a reference-image-constrained facade raster, per-storefront facade extraction/spec records, crop boards, and a QA report marking reference fidelity materially improved but not full-fidelity deterministic reproduction.
- Batu has unblocked exact MVP review work for storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry, provided those fields stay evidence-backed, status-labeled, and review-only until later production/public approval.
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

1. Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice: complete and accepted as input to the following DTR slices; output proves a Grillpoint/NW structured source object can deterministically produce raster instructions and a source/status comparison packet.
2. Phase 2DTR-2 - Four-Target Structured Facade Fixture: complete and accepted as input to Phase 2DTR-3; output extends the structured facade/source fixture model to Grillpoint, McDonald's, Dunkin', Citizens, and Greenpoint G.
3. Phase 2DTR-3 - Four-Corner Regenerated Raster Attempt: complete for Batu review; output assembles the 2DTR-2 fixture into a deterministic four-corner raster/spec attempt and compares the instruction surface against MVP-29E evidence.
4. Phase 2DTR-4 - Exact Geometry Source Map + Target Scene Spec: complete for Batu review; output maps visible scene elements to NYC/open data, existing source evidence, supplied reference photos, manual review-coordinate interpretation, and unsupported gaps.
5. Phase 2DTR-5 - Exact Review Geometry Fixture To Raster Prompt Adapter: complete for Batu review; output moves the 2DTR-4 source map into a structured review-only scene fixture and deterministic raster prompt/provenance adapter.
6. Phase 2DTR-6 - Exact Review Geometry Raster Artifact Generation: complete for Batu review as a visual attempt, but insufficient as proof of source-data-driven scene reproduction; output should not be treated as proving the data-to-raster pipeline.
7. Phase 2DTR-7 - Fixture-To-Blueprint Scene Layout Validation: complete for Batu review; output deterministically renders the Phase 2DTR-5 fixture into a black-and-white layout blueprint and validation report, proving target placement while surfacing missing street/intersection primitives.
8. Phase 2DTR-8 - Fixture Geometry Primitive Completion For Styled Raster Readiness: complete for Batu review; output adds explicit road, curb, sidewalk, crosswalk, curb-cut, render-order, occlusion, address-label, and primary subway cue primitives/rules, plus a JSON-first geometry adapter for DTR-9.
9. Phase 2DTR-9 - Controlled Styled Raster From Geometry-First Adapter Output: complete for Batu review; output produced a meaningfully new review-only styled raster from the DTR-8 JSON adapter, plus a QA board/report that marks the result useful for MVP feedback but partial on facade/microtext precision.
10. Phase 2DTR-10 - Narrow Corrective Visual Pass From DTR-8 Overlay Mask: complete for Batu review; output made one constrained visual correction focused on facade/window/entrance/sign alignment and microtext cleanup, while preserving the DTR-8/DTR-9 geometry intent.
11. Phase 2DTR-11 - Reference-Image Facade Fidelity Pass: complete for Batu review; output made one narrow facade/sign/window/entrance pass using supplied real facade imagery while preserving DTR-10 geometry.
12. MVP Feedback Demo Packaging: proposed next direct step after Batu accepts DTR-11; package the corrected raster and QA evidence for external MVP feedback without another correction loop.

Phase 2 now has three lanes:

- Strict promotion lane: keeps product-copy readiness, promotion gates, determinism checks, and negative contract tests intact for future product/public use.
- Draft prototype scene lane: allows status-labeled real names, address/category facts, approximate geometry, storefront bays, facades, signs, and scene anchors before product-copy readiness.
- Data-to-raster proof lane: focuses draft/source/QA groundwork into review-only raster/spec regeneration evidence for the current four-corner MVP scene.

## Current Next Task

The current next pointer is documented in `docs/CURRENT_EXECUTION_BRIEF.md`:

- Batu review of Phase 2DTR-11 output is now the active hold.
- Review packet: `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/`.
- Proposed next task after Batu review: MVP Feedback Demo Packaging.
- The next implementation batch must remain review-only and must not begin demo packaging, app/source edits, public interfaces, package/tooling changes, normal-mode replacement, or production/public-readiness changes until the current brief explicitly opens that scope.

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
- Unsupported exact geometry claims remain blocked. Exact storefront/facade/frontage/order/entrance/window geometry, exact address placement, and exact Greenpoint G station/entrance geometry may now be pursued in MVP review artifacts when backed by source/reference evidence and explicit status labels.
- NYC Open Data/building footprints are scaffold geometry context only; they do not by themselves prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or station geometry.
- Normal-mode code-native primary world art, raster asset edits, full MVP-29G screenshot QA, MVP-30 QA/demo freeze, package/tooling changes, package-script/CI additions, source-vendor integration, live data, scraping, backend/CMS/persistence/analytics, deployment, and broad coverage remain blocked unless a later brief explicitly opens them.

## Pending Decisions

- Whether Batu accepts, revises, or rejects the focused MVP-29E raster/app integration output.
- Whether Batu accepts, revises, or rejects the Phase 2DTR-11 reference-image facade fidelity pass as ready to package for external MVP feedback.
- Whether the MVP-29E raster needs another art pass for intersection/crosswalk precision, subway cue exactness, storefront specificity, sign readability, cue density, or overall visual taste.
- Whether the MVP-29E hotspot/card alignment and mobile containment are sufficient for the next gate or need a separate revision pass.
- Whether Batu opens full MVP-29G screenshot QA recovery and what screenshot states are required.
- Whether Batu opens MVP feedback demo packaging after DTR-10.
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
