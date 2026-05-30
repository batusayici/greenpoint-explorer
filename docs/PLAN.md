# MVP Roadmap

Status: Current MVP roadmap and phase-control document
Last reconciled: 2026-05-30
Creative/product/public-interface approval owner: Batu
Critical review/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Purpose

This file is the stable roadmap through MVP completion and testing. It should describe phases, gates, current state, and remaining work without becoming a batch-history dump.

Use `docs/MVP_SCOPE.md` for detailed MVP boundaries. Use `docs/MVP_EXECUTION_LEDGER.md` for batch-by-batch execution records. Use `docs/CURRENT_EXECUTION_BRIEF.md` for the next Codex task only. Codex executes directly from repo governance and current project docs; ChatGPT is reserved for critical planning, review, ambiguity, and gate-decision moments.

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
4. `docs/MVP_EXECUTION_LEDGER.md`
5. Topic-specific docs when the task touches their area

Topic-specific docs include `docs/MVP_SCOPE.md`, `docs/DECISION_LOG.md`, `docs/ART_DIRECTION.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/VISUAL_QA_CHECKLIST.md`, `docs/AGENTIC_TOOLING.md`, and current MVP/review artifact package docs.

`docs/TASKS.md` is deprecated and must not be used as an active source of truth unless `docs/CURRENT_EXECUTION_BRIEF.md` or this plan explicitly revives it.

## Current State Snapshot

- Current phase: MVP-18 Real Corner Evidence Recovery is complete for Batu review with a `revise` verdict; MVP-17 remains accepted only as the product-facing raster interaction polish baseline, with the missing mobile selected-state containment screenshot recorded as an accepted evidence gap; MVP-15B remains visually rejected as product-facing primary world art.
- Current Codex task pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next recommended task: `MVP-19 One-Corner Field Photo Supply Gate`, pending Batu approval. MVP-19 is now a reference + repeatability/scalability gate; it must supply or block owned/approved references and classify which evidence steps can scale versus which require fieldwork, manual desktop research, Batu judgment, or remain blocked. It does not authorize art translation, raster integration, real-place cards, UI claims, or demo freeze. No implementation phase, visual artifact generation, renderer work, new assets, screenshot work, scraping, live data pipeline, package/config/tooling change, staging, or commit is approved.
- Approved visual direction: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction, based on the reviewed Phase 4 proof and supported by the Phase 4.5 reusable-system scalability proof.
- Active visual reference source: `docs/approved-reference-corpus/`.
- Active reusable-system evidence: `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`.
- Active implementation evidence observed in the repository: review-only prototype source now uses corrected current-scene static data for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway; visible evidence-status cards; five interaction targets; source metadata; uncertainty notes; disclaimer behavior; MVP-06 review screenshots; and an MVP-06 self-audit. MVP-15B produced a code-native perspective street-scene composition, but MVP-15C freezes it as rejected product-facing visual evidence; it may be salvaged only as interaction shell/data/card/target-rail behavior. The working tree also contains an MVP-15A visual acceptance contract artifact with a mandatory Approved Corpus Compliance Gate and rejected MVP-11/MVP-13 anti-reference screenshots for future visual implementation passes. MVP-15A.1 reconciled approved corpus paths to current files under `docs/archive/visual-artifacts/`. MVP-15C adds the rejected MVP-15B screenshot as explicit evidence and converts future visual compliance from reference inspection to raster-first material use. MVP-16A selected `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` as the review-only raster plate for MVP-16B. MVP-16B now uses that approved raster as the active primary world surface, with five transparent hit regions and overlay-only markers/tethers/outlines around the preserved interaction shell. MVP-17 source polish reduces review chrome weight and makes overlays/cards/rail more product-facing; supplied desktop overview, hover/focus, selected-card, and zoom screenshots are recorded; Batu accepted the missing mobile selected-state containment screenshot as an evidence gap.
- Current blockers: no next implementation phase is approved; MVP-18 recommends a four-corner evidence boundary and northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target, but Batu has not approved the verdict, boundary, selected corner, or any owned/non-Google facade reference yet. MVP-19 can only supply or block owned/approved references and assess repeatability/scalability for the evidence method. MVP-20 Real-Corner Translation Boundary must be accepted before any real-corner raster integration can be considered. MVP-21 One-Corner Raster Integration / Visual Pass requires a separate current brief and approved implementation boundary. Production visual assets, production asset direction, production asset pipeline, real-place production cards, exact real facades, exact addresses, exact station geometry, final factual card copy, final architecture, live data, CI, deployment, backend/CMS/persistence/analytics, and broad map coverage remain blocked.
- Detailed MVP boundaries: `docs/MVP_SCOPE.md`.
- Active-scene guardrail: before source validation, scene translation, visual polish, data alignment, or real-place implementation work, Codex must confirm and list the active scene/place set from current app/data files; previous-scene entities are archival/reference-only unless explicitly reactivated; unresolved disagreement between control docs, review artifacts, and app/data files is a stop condition unless the current brief explicitly authorizes correcting it.
- Primary-world-art rule: For any prototype intended to represent the approved look and feel, the normal-mode world surface must be an approved raster/reference plate or an approved raster sprite/asset-kit composition. Code-native SVG/CSS/DOM/canvas/Pixi graphics may be used only for hidden blockouts, hit regions, debug/QA overlays, markers, tethers, selected outlines, cards, controls, and temporary alignment guides. A current brief may authorize code-native structure repair only when the result is explicitly labeled as a non-visual blockout and is not used as the product-facing normal-mode world surface. A current brief may not authorize code-native storefronts, buildings, sidewalks, roads, props, textures, or signs as the primary world art for a prototype being evaluated against the approved visual direction. If no approved raster plate or approved raster sprite/asset kit is available, Codex must stop before source edits.

## MVP Phase Roadmap

| Phase | Purpose | Entry Criteria | Exit Criteria | Current Status |
| --- | --- | --- | --- | --- |
| 0. Governance And Scope | Establish authority, workflow, source-of-truth order, and MVP boundaries. | Project needs operating constraints. | Governance docs block premature production work and define owner authority. | Complete. |
| 1. Visual Direction And Truth Feasibility | Decide whether the MVP has a viable visual direction and truth-safe representational approach. | Governance complete. | Batu approves visual direction; hybrid real-plus-placeholder truth approach is documented. | Complete. |
| 2. Reference Corpus And Assetization Evidence | Gather approved visual references and test whether the visual direction can be reused at proof scale. | Visual direction approved. | Approved reference corpus exists; Phase 6 proof identifies reusable rules and limits. | Complete as proof evidence; not production asset approval. |
| 3. Review-Only Prototype Evidence | Demonstrate the approved raster direction inside the interactive shell with fictional-safe targets. | Phase 6 translation plan exists and constrained implementation is approved. | Existing pan/zoom/hover/click/tap/card/mobile behavior is demonstrated with review screenshots and no production claims. | Evidence appears present; pending Batu review, with ChatGPT support optional. |
| 4. MVP Gap Review | Review current prototype evidence and identify the exact gap to MVP completion. | Review-only prototype evidence exists. | `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md` identifies current evidence, missing MVP work, blockers, and next implementation sequence. | Complete as docs-only review artifact; requires Batu review, with ChatGPT support optional. |
| 5. Place Truth Packet | Select candidate real places, source evidence, copy constraints, spatial risks, and omissions. | Batu approves moving from fictional placeholders toward real-place MVP data review. | Place truth packet lists recommended approved/deferred/omitted/fictionalized candidates with source URLs, source-review dates, truth status, and unresolved placement decisions. | Complete as docs-only review artifact; requires Batu review, with ChatGPT support optional. |
| 6. Static MVP Data Contract | Define the static local data shape needed for the MVP without approving live data or a production data platform. | Place Truth Packet is reviewed and the implementation boundary is approved. | Docs-only data contract or approved source file boundary defines fields, disclaimers, source metadata, and review rules. | Complete as docs-only proposal; requires Batu review before implementation, with ChatGPT support optional. |
| 7. MVP Interaction Integration | Integrate approved static data and final MVP interaction behavior into the prototype. | Static MVP Data Contract and implementation brief are approved. | Prototype demonstrates approved targets, cards, marker states, selected treatment, pan/zoom, hover/click/tap, and mobile containment with review screenshots. | Complete as review/demo-safe MVP-04 batch; pending Batu review, with ChatGPT support optional. |
| 8. Source-Of-Truth Validation Spike | Test the recommended open-data + owned/approved visual-reference + human-QA approach on the current block face before more polish. | MVP-04 output is reviewed enough to know the active scene/block face; validation-spike boundary is approved. | 5-10 review-only storefront evidence cards, confidence notes, provenance notes, manual-review flags, and a short scale-readiness verdict exist; no production pipeline or public claims. | Complete and accepted with corrected current set; verdict is `revise`. |
| 9. Corrective Scene Translation And Data Realignment | Align the prototype source/data/UI with corrected MVP-05 while preserving MVP-04 interaction behavior and avoiding facade-accuracy overclaims. | Corrected MVP-05 verdict is accepted; implementation boundary is approved. | Active prototype displays the current place set, stale previous-scene businesses are removed from active UI, review screenshots and self-audit exist, and no visual polish or new assets are introduced. | Complete for review. |
| 10. Reusable Place Evidence Pipeline Spike | Define a repeatable source/evidence workflow for turning Greenpoint addresses/businesses into validated interactive scene data and approved art-reference inputs. | MVP-06 current-scene correction exists and facade/art accuracy remains unresolved. | Review artifact proposes source hierarchy, evidence taxonomy, conceptual schema, facade/art eligibility, manual vs automated steps, scaling risks, next task, and verdict. | Complete for review; verdict is `revise`. |
| 11. Current-Scene Place Evidence Packet | Apply the reusable pipeline to each current active place and identify exact evidence gaps. | MVP-07 is reviewed and the docs-only evidence-packet boundary is approved. | One evidence card per current active place records identity, address, parcel/building, storefront/frontage, facade-reference provenance, treatment recommendation, and unresolved questions. | Complete for review; verdict is `revise`. |
| 12. Current Scene Treatment Decision Brief | Decide whether the current scene pursues evidence acquisition, fictional-safe translation, cut/omit treatment, or mixed treatment before art translation. | MVP-08 is reviewed and its place-by-place eligibility findings are accepted or revised. | A docs-only decision brief frames the next approved path without opening implementation by itself. | Complete for review; verdict is `proceed` with mixed treatment. |
| 13. Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary | Define the exact review-only implementation boundary for mixed treatment if Batu accepts MVP-09. | MVP-09 is reviewed and mixed treatment is accepted or revised. | A brief identifies allowed files, public-interface/module-boundary status, acceptance criteria, stop conditions, and truth-safety guardrails before implementation. | Complete for review; verdict is `proceed-to-mvp-11-boundary`. |
| 14. Current Scene Fictional-Safe Translation Pass | Implement the accepted MVP-10 boundary in the review-only prototype. | MVP-10 is reviewed and a later current brief explicitly opens MVP-11 implementation. | Prototype preserves five targets and interaction behavior while showing fictional-safe/generic business visuals, symbolic subway cues, screenshots, and self-audit. | Complete for review; screenshots blocked by local environment. |
| 15. Screenshot / QA Recovery Review | Capture and review MVP-11 screenshots and interaction checks in an environment where the local app can open. | MVP-11 implementation exists; current environment blocked local server/browser preview. | Desktop/mobile review screenshots and interaction smoke notes exist, or Batu accepts the limitation. | Blocked for browser QA; verdict is `revise`. |
| 16. Four-Corner Scene Structure Repair | Repair the failed MVP-11 single-screenshot/overlay approach with a four-corner current-scene structure. | MVP-12 blocks acceptance and Batu opens a corrective implementation pass. | Source uses a four-corner composition, targets are anchored NW/NE/SW/SE, subway remains symbolic, build passes, and review packet records screenshot status. | Implemented in source; screenshot/browser QA blocked. |
| 17. Visual Acceptance Contract / Failure Guardrails | Prevent repeat of the MVP-11 screenshot-overlay failure and MVP-13 board-game/diagram failure before or during the next implementation pass. | MVP-13 fails visual review despite correct four-corner anchoring. | A strict docs-only contract defines banned patterns, required scene-language patterns, Approved Corpus Compliance Gate, pre-code visual extraction, renderer separation, QA screenshot rules, and next recommended task. | Complete for review as MVP-15A supporting guardrails and mandatory future implementation gate. |
| 18. Approved Corpus Path Reconciliation | Repair stale approved-corpus manifest paths so the MVP-15A gate can inspect required references. | MVP-15B blocks because required ARC manifest paths are missing or path-conflicted. | Required ARC references point to existing inspectable paths; archive storage is documented as canonical preservation. | Complete as MVP-15A.1. |
| 19. Perspective Scene Renderer Replacement | Replace the placeholder/diagram approach with a scene-native perspective renderer governed by MVP-15A. | MVP-15A.1 path reconciliation is complete and the full MVP-15A gate is completed in the MVP-15B packet before source edits. | Source uses scene-native perspective world geometry, embedded storefronts, distinct corner massing, correct four-corner anchoring, symbolic subway cue, and no screenshot overlay. | Implemented in source but visually rejected by supplied screenshot; salvage interaction shell only. |
| 20. Visual Failure Freeze And Raster-First Gate | Freeze MVP-15B as failed/rejected visual evidence and patch the code-native primary-world-art loophole. | MVP-15B screenshot shows continued flat, diagrammatic, generic vector-isometric output. | Rejected screenshot evidence is copied, MVP-15B is marked visually rejected, and future visual compliance requires raster-first material use. | Complete for review as MVP-15C. |
| 21. Raster Plate Selection / Supply Gate | Select or block the raster-first primary world surface before any MVP-16B source edits. | MVP-15C freezes MVP-15B as visually rejected and requires raster-first primary world art. | A docs-only selection packet evaluates existing raster candidates, selects a review-only plate or blocks implementation with minimum asset requirements, and updates the next brief. | Complete for review as MVP-16A; selected `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`. |
| 22. Raster-First Prototype Recovery | Recover the prototype by using an approved raster/reference plate or approved raster sprite/asset-kit composition as the normal-mode primary world surface. | Batu approves MVP-16B current brief and the selected raster plate or an approved replacement. | Prototype preserves interaction shell/card/target behavior around raster-first world art; no code-native primary scene art. | Complete for review as MVP-16B; visual verdict pending. |
| 23. Visual Polish / Optional Ambient | Polish the contained MVP experience and add only approved ambient visual loops. | Raster-first prototype recovery is visually reviewed, and truth-safety decisions remain intact. | Review screenshots and notes show accepted visual polish, optional ambient loops or explicit cuts, and no production-asset claims. | Complete as MVP-17; accepted by Batu with mobile screenshot evidence gap noted. |
| 24. Real Corner Evidence Recovery | Recover the source-of-truth path for a real, recognizable Greenpoint Ave x Manhattan Ave corner before any real-corner art translation. | MVP-17 is accepted only as an interaction baseline and Batu opens evidence recovery. | Review packet identifies boundary, buildings/lots/storefronts, candidate addresses, business status, BBL/BIN/tax-lot evidence, allowed/blocked facade references, first-corner spike recommendation, and proceed/revise/cut verdict. | Complete for review as MVP-18; verdict is `revise`. |
| 25. One-Corner Field Photo Supply Gate | Supply or explicitly approve owned/non-Google facade references for the first real-corner target before art translation, and classify whether the one-corner evidence method can scale beyond a hand-authored exception. | Batu accepts or revises MVP-18 enough to open a supply/reference + scalability gate. | Owned/approved references, provenance, status/frontage notes, visual-use permissions, required evidence-row classifications, and scale readouts for 20, 100, and 500 storefronts are recorded, or the selected corner is blocked. Photos alone cannot complete MVP-19. This does not approve art translation, raster integration, real-place cards, UI claims, or implementation. | Proposed next task only; pending Batu approval. |
| 26. Real-Corner Translation Boundary | Convert accepted MVP-18 evidence and MVP-19 owned/approved reference inputs plus repeatability/scalability readout into a review-only translation brief for one real-corner target. | MVP-18 verdict and MVP-19 reference supply plus scalability assessment are accepted or revised enough to choose one target. | Docs-only boundary packet records selected-corner confirmation or blocked-corner verdict; evidence-to-scene matrix; active scene/place set; approved/blocked references; storefront/building/place and MapAnchor notes; verified/partial/symbolic/placeholder/omitted/blocked/manual-review-required status; allowed stylization and truth constraints; treatment recommendation for each active place; exact downstream implementation boundary proposal; and proceed/revise/cut verdict for one-corner raster integration. No rendering, source edits, assets, UI polish, screenshots, factual public card copy, production claims, Google/Street View/3D Tiles-derived extraction/reference storage, or implementation authorization. | Future-only; must be accepted before MVP-21 can be considered. |
| 27. One-Corner Raster Integration / Visual Pass | Integrate an approved/supplied raster plate, layered raster export, or approved raster sprite/asset-kit composition for one selected real-corner target while preserving interaction shell and truth-safe UI/card behavior. | MVP-18 supports the selected corner; MVP-19 provides owned/approved non-Google storefront/facade references or an approved equivalent; MVP-20 is accepted by Batu; a later current brief explicitly opens implementation; public interfaces/module boundaries and allowed files are documented and reviewed. | One-corner raster integration is reviewable; interaction shell/card/target behavior is preserved; real-place placement and card behavior remain tied to the truth layer; product-facing world surface remains raster-first; no code-native buildings/storefronts/roads/signs/props/textures become primary world art; no production asset/data, exact facade, exact address, exact frontage/order, or exact station-geometry claim is made; screenshots/self-audit/checklist exist only if the current brief explicitly requires them. | Future-only; blocked until MVP-20 and a future current brief approve it. |
| 28. MVP QA And Demo Freeze | Verify MVP behavior, truth policy, visual containment, and demo readiness. | MVP feature slice, validation verdict, polish pass, and any accepted real-corner evidence/reference/translation/integration verdicts exist. | MVP QA checklist, smoke-check report, accepted exceptions, and demo-freeze notes are complete. | Future-only. |
| 29. MVP Completion / Post-MVP Parking | Mark MVP complete or hold with explicit blockers, and keep expansion ideas parked. | MVP QA And Demo Freeze exits. | MVP completion note records final status; post-MVP ideas remain parked unless Batu promotes them. | Future-only. |

## Current Next Task

The current next pointer is documented in `docs/CURRENT_EXECUTION_BRIEF.md`:

- MVP-18 Real Corner Evidence Recovery is complete for review at `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`.
- MVP-18 verdict is `revise`: the four-corner address/lot structure is plausible, but real-corner art translation remains blocked by missing approved storefront/frontage and facade-reference evidence.
- Recommended next task is `MVP-19 One-Corner Field Photo Supply Gate`, pending Batu approval. MVP-19 only supplies or blocks owned/approved non-Google reference evidence and must include the required repeatability/scalability assessment.
- MVP-20 Real-Corner Translation Boundary must follow MVP-19 before any real-corner art translation or raster integration can be considered; it cannot open unless MVP-19 provides both the selected-corner reference packet and the repeatability/scalability readout.
- MVP-21 One-Corner Raster Integration / Visual Pass may only follow after MVP-20 acceptance and a separate current brief with approved implementation boundaries.
- MVP-17 remains accepted by Batu only as the product-facing raster interaction polish baseline around the active review-only raster plate at `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png`.
- MVP-17 is not accepted as a truthful or recognizable Greenpoint Ave x Manhattan Ave scene.
- No implementation, visual generation, visual polish, renderer work, screenshots, new assets, scraping, live data pipeline, production/public-release claim, staging, or commit is approved by this pointer.

## Locked Decisions

- The MVP is one authored interactive diorama scene, not a broad map product or game system.
- Batu owns creative direction, product direction, taste calls, public representation, public module/interface approval, and final approval of scope or gate changes.
- ChatGPT supports critique, decision-support framing, and brief drafting at critical planning, review, ambiguity, and gate-decision moments.
- Codex owns tactical execution of the current brief inside approved boundaries and should use repo docs instead of ChatGPT conversation memory when repo docs answer the question.
- `docs/CURRENT_EXECUTION_BRIEF.md` is the canonical source for Codex's next task.
- `docs/MVP_SCOPE.md` is the detailed MVP scope authority.
- `docs/MVP_EXECUTION_LEDGER.md` records batch outcomes and reconciliation status, but it does not authorize execution by itself.
- Every successful MVP/prototype batch must reconcile `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and `docs/MVP_EXECUTION_LEDGER.md` before final response.
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
- MVP-19 is a reference + scalability gate only and does not authorize art translation, raster integration, real-place cards, UI claims, or implementation.
- MVP-20 Real-Corner Translation Boundary must be accepted before any real-corner raster integration can be considered.
- MVP-21 One-Corner Raster Integration / Visual Pass requires a separate current brief and approved implementation boundary.
- Automated source-of-truth pipelines, broad storefront-unit databases, Live XYZ integration, and commercial data licensing remain blocked until a later architecture/legal gate.
- Real-place cards and production placement remain blocked by unresolved source/placement risks.
- Exact Greenpoint Av G station geometry, exact facade geometry, storefront widths, frontage/order, addresses, and active-business claims are not approved for production representation.
- Final architecture, public interfaces, production map implementation, live data, backend service, CMS, persistence, accounts, analytics, CI, deployment, and broader app implementation remain blocked until a later current brief explicitly opens that scope.
- Project-specific implementation skills, plugin installs, and broad tooling stacks remain blocked unless Batu approves them later.

## Pending Decisions

- Whether Batu accepts, revises, or rejects the MVP-18 `revise` verdict.
- Whether Batu approves the MVP-18 recommended four-corner evidence boundary.
- Whether Batu approves northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target, chooses the southeast Citizens Bank fallback, or revises the target.
- Whether Batu opens `MVP-19 One-Corner Field Photo Supply Gate` with the required repeatability/scalability assessment as a hard exit criterion.
- Whether Batu approves MVP-20 Real-Corner Translation Boundary after MVP-19.
- Which real-corner treatment is allowed for each active place: real card, context-only, fictionalized, omitted, blocked, or unresolved.
- Whether Batu opens MVP-21 One-Corner Raster Integration / Visual Pass after MVP-20.
- Which approved/supplied raster material, if any, is allowed for MVP-21.
- Whether a later brief should open additional raster-anchor revision, replacement raster selection, optional ambient, or another next phase.
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
- `docs/TASKS.md`: deprecated; not an active source of truth unless revived by this plan or the current brief.
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
