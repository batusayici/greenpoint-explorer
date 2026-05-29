# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-05-29
Creative/product/public-interface approval owner: Batu
Critique/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and testing. It should describe phases, gates, current state, and remaining work without becoming a batch-history dump.

Use `docs/MVP_SCOPE.md` for detailed MVP boundaries. Use `docs/MVP_EXECUTION_LEDGER.md` for batch-by-batch execution records. Use `docs/CURRENT_EXECUTION_BRIEF.md` for the next Codex task only.

## Product Goal

Greenpoint Isometric Explorer should prove that a small authored Greenpoint scene can feel visually distinctive, locally specific, and worth clicking.

The MVP is not a full map product or game system. It is a polished, authored, interactive diorama that tests screenshot appeal, local specificity, and first-click interest.

## MVP Scope Summary

The MVP is one polished, authored, interactive Greenpoint diorama scene that tests visual appeal, local specificity, and first-click interest.

Detailed scope, non-goals, must-have/should-have/cuttable items, and MVP acceptance boundaries live in `docs/MVP_SCOPE.md`.

`docs/PLAN.md` controls roadmap, phase order, and current state. `docs/MVP_SCOPE.md` controls detailed MVP boundaries. `docs/CURRENT_EXECUTION_BRIEF.md` can narrow scope for the active task but cannot expand MVP scope.

## Source-Of-Truth Order

Use these in order when documents conflict:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/MVP_SCOPE.md`
5. `docs/MVP_EXECUTION_LEDGER.md`
6. `docs/DECISION_LOG.md`
7. `docs/ART_DIRECTION.md`
8. `docs/VISUAL_ARTIFACT_STANDARDS.md`
9. `docs/VISUAL_QA_CHECKLIST.md`

`docs/TASKS.md` is legacy orientation only and must not override the plan, scope, ledger, or current brief.

## Current State Snapshot

- Current phase: MVP-05 Source-Of-Truth Validation Spike complete as a docs/data-only review artifact; pending Batu/ChatGPT review.
- Current Codex task pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next recommended task: no active Codex execution task; Batu/ChatGPT should review MVP-05 and approve or revise a proposed MVP-06 Corrective Scene Translation And Data Realignment Brief.
- Approved visual direction: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction, based on the reviewed Phase 4 proof and supported by the Phase 4.5 reusable-system scalability proof.
- Active visual reference source: `docs/approved-reference-corpus/`.
- Active reusable-system evidence: `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`.
- Active implementation evidence observed in the repository: review-only prototype source now uses a user-provided Manhattan Ave / Greenpoint Ave street-reference raster as the primary review surface, static local MVP data, five interaction targets, source metadata, `lastVerified`, uncertainty notes, disclaimer behavior, and fresh MVP-04 review screenshots under `docs/review-screenshots/mvp-04-interaction-integration/`.
- Current blockers: Batu/ChatGPT review of the corrected MVP-05 `revise` verdict for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway; approval of any corrective scene/data implementation boundary; approved non-Google storefront-specific visual references; production visual assets, production asset direction, production asset pipeline, real-place production cards, exact real facades, exact addresses, exact station geometry, final factual card copy, final architecture, live data, CI, deployment, backend/CMS/persistence/analytics, and broad map coverage.
- Detailed MVP boundaries: `docs/MVP_SCOPE.md`.
- Anti-drift rule: future prototype work must use approved raster/reference assets or reviewed asset-kit logic as the primary visual world surface. Generic SVG/CSS/DOM/canvas/code-drawn storefronts must not substitute for primary world evidence.

## MVP Phase Roadmap

| Phase | Purpose | Entry Criteria | Exit Criteria | Current Status |
| --- | --- | --- | --- | --- |
| 0. Governance And Scope | Establish authority, workflow, source-of-truth order, and MVP boundaries. | Project needs operating constraints. | Governance docs block premature production work and define owner authority. | Complete. |
| 1. Visual Direction And Truth Feasibility | Decide whether the MVP has a viable visual direction and truth-safe representational approach. | Governance complete. | Batu approves visual direction; hybrid real-plus-placeholder truth approach is documented. | Complete. |
| 2. Reference Corpus And Assetization Evidence | Gather approved visual references and test whether the visual direction can be reused at proof scale. | Visual direction approved. | Approved reference corpus exists; Phase 6 proof identifies reusable rules and limits. | Complete as proof evidence; not production asset approval. |
| 3. Review-Only Prototype Evidence | Demonstrate the approved raster direction inside the interactive shell with fictional-safe targets. | Phase 6 translation plan exists and constrained implementation is approved. | Existing pan/zoom/hover/click/tap/card/mobile behavior is demonstrated with review screenshots and no production claims. | Evidence appears present; pending Batu/ChatGPT review. |
| 4. MVP Gap Review | Review current prototype evidence and identify the exact gap to MVP completion. | Review-only prototype evidence exists. | `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md` identifies current evidence, missing MVP work, blockers, and next implementation sequence. | Complete as docs-only review artifact; requires Batu/ChatGPT review. |
| 5. Place Truth Packet | Select candidate real places, source evidence, copy constraints, spatial risks, and omissions. | Batu/ChatGPT approve moving from fictional placeholders toward real-place MVP data review. | Place truth packet lists recommended approved/deferred/omitted/fictionalized candidates with source URLs, source-review dates, truth status, and unresolved placement decisions. | Complete as docs-only review artifact; requires Batu/ChatGPT review. |
| 6. Static MVP Data Contract | Define the static local data shape needed for the MVP without approving live data or a production data platform. | Place Truth Packet is reviewed and the implementation boundary is approved. | Docs-only data contract or approved source file boundary defines fields, disclaimers, source metadata, and review rules. | Complete as docs-only proposal; requires Batu/ChatGPT review before implementation. |
| 7. MVP Interaction Integration | Integrate approved static data and final MVP interaction behavior into the prototype. | Static MVP Data Contract and implementation brief are approved. | Prototype demonstrates approved targets, cards, marker states, selected treatment, pan/zoom, hover/click/tap, and mobile containment with review screenshots. | Complete as review/demo-safe MVP-04 batch; pending Batu/ChatGPT review. |
| 8. Source-Of-Truth Validation Spike | Test the recommended open-data + owned/approved visual-reference + human-QA approach on the current block face before more polish. | MVP-04 output is reviewed enough to know the active scene/block face; validation-spike boundary is approved. | 5-10 review-only storefront evidence cards, confidence notes, provenance notes, manual-review flags, and a short scale-readiness verdict exist; no production pipeline or public claims. | Corrected as docs/data-only MVP-05 artifact for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway; verdict is `revise`; pending Batu/ChatGPT review. |
| 9. Visual Polish / Optional Ambient | Polish the contained MVP experience and add only approved ambient visual loops. | Core MVP interaction slice works, MVP-05 is reviewed, and any required corrective scene/data realignment is approved and reviewed. | Review screenshots and notes show accepted visual polish, optional ambient loops or explicit cuts, and no production-asset claims. | Blocked behind MVP-05 review and proposed corrective scene/data realignment boundary. |
| 10. MVP QA And Demo Freeze | Verify MVP behavior, truth policy, visual containment, and demo readiness. | MVP feature slice, validation verdict, and polish pass exist. | MVP QA checklist, smoke-check report, accepted exceptions, and demo-freeze notes are complete. | Blocked. |
| 11. MVP Completion / Post-MVP Parking | Mark MVP complete or hold with explicit blockers, and keep expansion ideas parked. | MVP QA And Demo Freeze exits. | MVP completion note records final status; post-MVP ideas remain parked unless Batu promotes them. | Future-only. |

## Current Next Task

The current next pointer is documented in `docs/CURRENT_EXECUTION_BRIEF.md`:

- No active Codex execution task.
- Batu/ChatGPT should review `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`.
- Recommended next task, if approved, is an MVP-06 Corrective Scene Translation And Data Realignment Brief.

The next active brief should define allowed files, current candidate treatments, approved non-Google visual references, implementation boundaries, and required checks before Codex performs any app/source, asset, screenshot, package/config/build/CI/deployment, staging, or commit work.

## Locked Decisions

- The MVP is one authored interactive diorama scene, not a broad map product or game system.
- Batu owns creative direction, product direction, taste calls, public representation, public module/interface approval, and final approval of scope or gate changes.
- ChatGPT owns critique, decision-support framing, and writing/updating `docs/CURRENT_EXECUTION_BRIEF.md` after Batu/ChatGPT review.
- Codex owns tactical execution of the current brief inside approved boundaries.
- `docs/CURRENT_EXECUTION_BRIEF.md` is the canonical source for Codex's next task.
- `docs/MVP_SCOPE.md` is the detailed MVP scope authority.
- `docs/MVP_EXECUTION_LEDGER.md` records batch outcomes and reconciliation status, but it does not authorize execution by itself.
- Every successful Codex batch must reconcile `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and `docs/MVP_EXECUTION_LEDGER.md` before final response.
- Meaningful visual approvals require concrete artifacts at the correct fidelity/output format, as defined in `docs/VISUAL_ARTIFACT_STANDARDS.md`.
- The Phase 2 gate outcome is hybrid real-plus-placeholder composition.
- Phase 4 is complete and the Inked Indie / Compact Corner fictional-safe storefront direction is approved as final visual direction.
- Phase 4.5 and Phase 6 support reuse confidence only at proof/review scale. They do not approve production scalability, production buildability, production assets, production asset direction, or a production pipeline.
- The Source-Of-Truth Validation Spike may test open-data, owned/approved visual-reference, and human-QA workflow at review scale only; it does not approve production data architecture, live refresh, or a production asset pipeline.
- Google/Street View/3D Tiles-derived extraction, training, generation, texture reuse, or stored visual-reference use remains blocked unless a later legal/architecture gate explicitly approves it.
- The approved reference corpus is the active visual reference source for future visual, prototype, and assetization work.
- Historical visual-artifact, review-screenshot, and review-only asset folders under `docs/archive/` are preservation/reference history only.
- App implementation beyond a current approved brief starts only after Batu opens the relevant implementation gate and public interfaces/module boundaries are documented and reviewed.

## Active Blockers

- Production visual assets, production asset direction, and production asset pipeline are unapproved.
- Production buildability and production scalability are unapproved.
- Automated source-of-truth pipelines, broad storefront-unit databases, Live XYZ integration, and commercial data licensing remain blocked until a later architecture/legal gate.
- Real-place cards and production placement remain blocked by unresolved source/placement risks.
- Exact Greenpoint Av G station geometry, exact facade geometry, storefront widths, frontage/order, addresses, and active-business claims are not approved for production representation.
- Final architecture, public interfaces, production map implementation, live data, backend service, CMS, persistence, accounts, analytics, CI, deployment, and broader app implementation remain blocked until a later current brief explicitly opens that scope.
- Project-specific implementation skills, plugin installs, and broad tooling stacks remain blocked unless Batu approves them later.

## Pending Decisions

- Whether Batu/ChatGPT accept, revise, or reject the corrected MVP-05 `revise` verdict for the current scene.
- Whether Batu/ChatGPT approve an MVP-06 Corrective Scene Translation And Data Realignment Brief before Visual Polish / Optional Ambient.
- Which non-Google, owned, or explicitly approved storefront-specific visual references are allowed for any corrective scene/data work.
- Whether Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway should be real cards, context only, fictionalized, omitted, or blocked.
- Which remaining MVP implementation sequence Batu wants after the gap review.
- Which MVP-02 real-place candidate recommendations and MVP-03 data-boundary recommendations need revision after MVP-04, including omissions, unknown/closed handling, symbolic treatment, fictionalization, manual verification, static source-file boundary, and disclaimer handling.
- Whether any Should-Have or Cuttable scope items in `docs/MVP_SCOPE.md` should be promoted, cut, or deferred.
- What public interfaces and module boundaries are approved for any future implementation phase.
- What production asset direction and production asset pipeline, if any, should be approved later.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable or proposed Codex task and operational handoff.
- `docs/MVP_EXECUTION_LEDGER.md`: append-style task ledger, reconciliation status, and next-pointer history.
- `docs/TASKS.md`: legacy task orientation only; must defer to the plan, scope, ledger, and current brief.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/MVP_SCOPE.md`: detailed MVP scope and non-goals.
- `docs/ART_DIRECTION.md`: art-direction principles, reference handling, and historical visual context.
- `docs/VISUAL_ARTIFACT_STANDARDS.md`: fidelity ladder, artifact-format rules, and visual self-audit requirements.
- `docs/VISUAL_QA_CHECKLIST.md`: visual QA checklist.
- `docs/AGENTIC_TOOLING.md`: workflow/tooling policy, allowed tooling use, blocked tooling use, and skills/plugins governance.
- `docs/ARCHITECTURE.md`: future architecture boundaries after the architecture gate opens.
- `docs/DATA_FEASIBILITY.md`: location truth feasibility, source review, blocking factual uncertainties, and structural reference handling.
- `docs/PLACE_SOURCE_POLICY.md`: place-source hierarchy, verification policy, source conflicts, and staleness rules.
- `docs/PLACE_SCHEMA.md`: conceptual place-data shape and truth-status vocabulary; not an implementation interface until approved later.
