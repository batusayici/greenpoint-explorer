# Project Plan

Status: Current high-level orientation and phase/gate document
Date: 2026-05-28
Creative/product/public-interface approval owner: Batu
Critique/decision-support/brief-authoring support: ChatGPT
Execution owner inside approved boundaries: Codex

## Product Goal

Greenpoint Isometric Explorer should prove that a small authored Greenpoint scene can feel visually distinctive, locally specific, and worth clicking.

The MVP is not a full map product or game system. It is a polished, authored, interactive diorama that tests screenshot appeal, local specificity, and first-click interest.

## MVP Scope

Included:

- One compact isometric scene around Manhattan Ave / Greenpoint Ave.
- Desktop/tablet-primary web prototype with basic mobile containment.
- Pixel-inspired HD visual style after Batu approval.
- Bounded pan and zoom.
- Desktop hover and click.
- Touch tap highlight and card open.
- 4-6 source-backed real named places only if spatially coherent.
- Static local place data.
- Place cards with neutral factual copy, source URL, last verified date, and unofficial-map disclaimer.
- 2-4 ambient visual-only animation loops.

## Explicit Non-Goals

Out of scope for MVP:

- Avatar movement, pathfinding, routing, real map navigation, NPCs, interiors, quests, hidden objects, notebook/discovery log, accounts, persistence, live data, scraping, user submissions, CMS, business opt-in flows, broad neighborhood coverage, and phone-first optimization.
- Flyers, stoop sales, ambient street life, or other charm elements as product systems unless Batu explicitly promotes them later.

## Source-of-Truth Order

Use these in order when documents conflict:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/DECISION_LOG.md`
5. `docs/MVP_SCOPE.md`
6. `docs/ART_DIRECTION.md`
7. `docs/VISUAL_ARTIFACT_STANDARDS.md`
8. `docs/VISUAL_QA_CHECKLIST.md`

## Current State Snapshot

- Current phase: post-cleanup, post-reference-corpus, Phase 6 review / repeatable assetization proof.
- Current Codex task pointer: `docs/CURRENT_EXECUTION_BRIEF.md` is the only source for Codex's next executable task.
- `docs/PLAN.md` defines phase orientation only. It does not authorize Codex to execute tasks when `docs/CURRENT_EXECUTION_BRIEF.md` exists.
- Approved visual direction: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction, based on the reviewed Phase 4 proof and supported by Phase 4.5 reusable-system scalability evidence.
- Current approvals: Phase 2 selected a hybrid real-plus-placeholder composition; Phase 3 passed static style-frame evidence; Phase 3.5 through Phase 3.9 tested repeatability, buildability planning, layer decomposition, fidelity recovery, and map-scale integration; Phase 4 is complete and visual direction is approved; Phase 4.5 provides supporting evidence that the direction appears promising as a reusable storefront system; the approved reference corpus now governs future visual/reference alignment.
- Active visual reference source: `docs/approved-reference-corpus/`.
- Active Phase 6 package: `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`.
- Historical untracked visual-artifact and review-screenshot batches have been archived under `docs/archive/`. Archived artifacts are preserved reference/history only, not current execution authority unless explicitly promoted in a later Batu/ChatGPT-authored brief.
- Active blockers: production visual assets, production asset direction, production asset pipeline, broad app implementation, public-interface approval, real-place cards, exact station/facade/address claims, CI, deployment, and production scalability/buildability remain blocked.
- Current canonical execution brief: Phase 6.1 Constrained Raster Prototype Integration in `docs/CURRENT_EXECUTION_BRIEF.md`.
- Anti-drift rule: the project should stop looping on SVG/code-drawn style proofs. Future prototype work must use approved raster/reference assets or extracted/recombined Phase 6 asset-kit logic, not generic SVG-grade illustration or code-drawn scene art as primary world evidence.
- Production claims remain blocked until the app demonstrates the behavior under an approved implementation brief and review feedback loop.

## Phase Roadmap

- Phase 0 Governance: complete. Authority, workflow, source-of-truth order, visual governance, and hard implementation gates are documented.
- Phase 1 Broad Visual Exploration: complete as historical exploration. Prior visual batches provided evidence and process lessons.
- Phase 2 Location & Representational Truth Feasibility: gate outcome selected. The project uses a hybrid real-plus-placeholder composition; production placement and real-place cards remain blocked.
- Phase 3 Static Style Frame: passed as gate evidence. Revision A is approved as static style-frame evidence, not as production assets or implementation approval.
- Phase 3.5 Production-System Proof: repeatability evidence judged sufficient to proceed to buildability/scalability planning; buildability and scalability are not yet proven.
- Phase 3.6 Buildability / Scalability Planning: complete as docs-only planning evidence; did not approve production buildability or scalability.
- Phase 3.7 Storefront Layer Decomposition Proof: complete as a one-module technical-art proof; succeeded at decomposition but did not meet the prior raster fidelity bar.
- Phase 3.8 Fidelity Recovery + Multi-Module Stress Test: complete. Substantially recovered the high-fidelity raster storefront-art bar and showed the multi-module system appears promising; main caveat was visually disruptive truth-safe overlay labels. Not production approval.
- Phase 3.9 Map-Scale Integration Test: complete. Tested recovered modules in a small isometric street slice with hover/card UI pressure while remaining truth-safe and non-production.
- Phase 4 Fictional-Safe Storefront Identity + UI Integration Proof: complete. Batu approved the visual direction after review; production assets and implementation remain blocked.
- Phase 4.5 Reusable-System Scalability Proof: supporting proof complete. Direction appears promising as a reusable storefront system, but production scalability/buildability are not approved.
- Reference Corpus Alignment: complete as a docs-only corpus pass in `docs/approved-reference-corpus/`. The corpus is now the active visual reference source, not a production asset library.
- Phase 6 Repeatable Assetization Proof: active review stage. The package exists under `docs/visual-artifacts/phase-6-repeatable-assetization-proof/` and must now be reviewed for reusable asset/module rules and prototype translation limits.
- Prototype Translation Planning: current next milestone. The output should be a constrained implementation brief for a later source/app batch, not immediate source changes.
- Interactive Map Mode MVP: blocked until Phase 6 review and prototype translation planning exits and Batu/ChatGPT authorize a later implementation brief.
- QA / Polish / Shareable Preview: blocked until MVP behavior exists and QA targets are defined.
- Post-MVP Expansion Parking Lot: future-only. Expansion ideas stay parked unless Batu promotes them into approved scope.

## Phase Gates

| Phase | Entry Criteria | Exit Criteria | Proof Artifact | Approval Owner | Current Status |
| --- | --- | --- | --- | --- | --- |
| Phase 0 Governance | Project needs authority, workflow, and gate rules before production. | Governance docs exist and block premature implementation. | `AGENTS.md`, `docs/DECISION_LOG.md`, planning docs. | Batu for governance approval. | Complete. |
| Phase 1 Broad Visual Exploration | Governance and visual approval rules are explicit. | Batu has enough concrete visual evidence to choose a path for static style-frame work. | Visual-preproduction packets and review guides. | Batu for creative direction. | Complete / historical. |
| Phase 2 Location & Representational Truth Feasibility | Candidate slice and possible anchor places are identified. | Batu selects a truth-safe outcome with unresolved risks labeled. | `docs/DATA_FEASIBILITY.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/PLACE_SCHEMA.md`. | Batu for public representation and manual overrides. | Outcome selected: hybrid real-plus-placeholder. |
| Phase 3 Static Style Frame | Truth constraints permit a bounded static-frame review artifact. | Batu approves or rejects a high-fidelity raster static style frame as gate evidence. | Phase 3 raster PNG package and self-audit. | Batu for visual gate review. | Passed as gate evidence. |
| Phase 3.5 Production-System Proof | Phase 3 gate evidence is approved. | Batu/ChatGPT decide whether evidence is enough for buildability/scalability planning. | Phase 3.5 derivative PNG proof package. | Batu/ChatGPT for planning-readiness judgment. | `PROCEED_TO_BUILDABILITY_PLANNING`; not build/scale approval. |
| Phase 3.6 Buildability / Scalability Planning | Phase 3.5 evidence is sufficient for planning. | Batu/ChatGPT decide whether to authorize a bounded technical-art proof. | Phase 3.6 docs-only planning packet. | Batu/ChatGPT for next-proof authorization. | Complete; not production approval. |
| Phase 3.7 Storefront Layer Decomposition Proof | Phase 3.6 authorizes a bounded technical-art proof. | Batu/ChatGPT judge whether one module can be decomposed and recombined without losing visual character. | Phase 3.7 PNG proof packet. | Batu/ChatGPT for proof critique. | Complete; decomposition useful, fidelity below bar. |
| Phase 3.8 Fidelity Recovery + Multi-Module Stress Test | Phase 3.7 reveals fidelity gap. | Batu/ChatGPT judge whether fidelity is recovered and whether multiple fictional modules remain promising. | Phase 3.8 high-fidelity PNG proof packet. | Batu/ChatGPT for proof critique. | Complete; promising, non-production. |
| Phase 3.9 Map-Scale Integration Test | Phase 3.8 is promising but not map-scale tested. | Batu/ChatGPT judge whether recovered modules work in a small street-slice composition under hover/card UI pressure. | Phase 3.9 high-fidelity PNG proof packet. | Batu/ChatGPT for proof critique. | Complete; non-production. |
| Phase 4 Fictional-Safe Storefront Identity + UI Integration Proof | Phase 3.9 shows map-scale promise but needs stronger fictional-safe identity and UI integration. | Batu judges whether the visual direction is approved. | Phase 4 high-fidelity PNG proof packet. | Batu for visual direction approval. | Complete; visual direction approved. |
| Phase 4.5 Reusable-System Scalability Proof | Phase 4 direction needs a reuse stress test before implementation planning. | Batu/ChatGPT judge whether the direction appears promising as a reusable storefront system. | Phase 4.5 high-fidelity PNG proof packet. | Batu/ChatGPT for proof critique. | Complete; promising, not production scalability approval. |
| Reference Corpus Alignment | Approved visual direction needs canonical reference discipline before more visual/system work. | Corpus exists and is accepted as active visual reference source. | `docs/approved-reference-corpus/`. | Batu/ChatGPT for reference discipline acceptance. | Complete; protected reference source, not production assets. |
| Phase 6 Repeatable Assetization Proof | Reference corpus exists and Phase 4/4.5 evidence needs reusable-system translation. | Batu/ChatGPT review what is reusable, missing, risky, and safe to translate into a constrained prototype plan. | `docs/visual-artifacts/phase-6-repeatable-assetization-proof/`. | Batu/ChatGPT for proof critique and next-step framing. | Active review/planning stage. |
| Prototype Translation Planning | Phase 6 package exists and needs conversion into implementation boundaries. | A concrete next implementation brief exists for Batu/ChatGPT review, without source/app execution. | Updated `docs/CURRENT_EXECUTION_BRIEF.md` proposed implementation section and task notes. | Batu/ChatGPT for implementation-brief approval; Batu for public-interface/gate approval. | Current next milestone. |
| Constrained Prototype Integration | Prototype translation plan is approved in a later current brief. | Approved MVP interaction slice works using approved raster/reference assets or Phase 6 asset-kit logic. | Interactive prototype and review screenshots/smoke-check report. | Batu/ChatGPT for review of implementation result; Batu for further gate approval. | Blocked until later brief. |
| Interactive Map Mode MVP | Constrained prototype integration exits and further MVP behavior is approved. | Approved MVP interactions work against the approved scene and truth policy. | Interactive prototype and QA notes. | Batu for product/experience approval. | Blocked. |
| QA / Polish / Shareable Preview | MVP behavior exists. | Preview is stable within MVP scope. | QA checklist, polish notes, preview artifact. | Batu for shareable-preview approval. | Blocked. |
| Post-MVP Expansion Parking Lot | MVP scope remains protected. | None for MVP. | Parking-lot notes. | Batu for any promotion into scope. | Future-only. |

## Locked Decisions

- The MVP is one authored interactive diorama scene, not a broad map product or game system.
- Batu owns creative direction, product direction, taste calls, public representation, public module/interface approval, and final approval of scope or gate changes.
- ChatGPT owns critique, decision-support framing, and writing/updating `docs/CURRENT_EXECUTION_BRIEF.md` after Batu/ChatGPT review.
- Codex owns tactical execution of the current brief inside approved boundaries.
- `docs/CURRENT_EXECUTION_BRIEF.md` is the canonical source for Codex's next executable task.
- Meaningful visual approvals require concrete artifacts at the correct fidelity/output format, as defined in `docs/VISUAL_ARTIFACT_STANDARDS.md`.
- The Phase 2 gate outcome is hybrid real-plus-placeholder composition.
- Real places must not be moved onto incorrect streets, presented with false adjacency, or represented through unsupported active-business/card claims.
- Uncertainty must be documented as unresolved, placeholder, omitted, fictionalized, symbolic, or manual-review-required.
- Phase 3 Revision A is approved as static style-frame gate evidence.
- Phase 3.5 evidence is approved only for proceeding to buildability/scalability planning.
- Phase 3.8 remains historical non-production visual proof evidence: fidelity recovery was substantially achieved for storefront artwork, and the multi-module system appeared promising.
- Phase 4 is complete and the Inked Indie / Compact Corner fictional-safe storefront direction is approved as final visual direction.
- Phase 4.5 supports that the direction appears promising as a reusable storefront system, but it does not approve production scalability, production buildability, production assets, production asset direction, or a production pipeline.
- The approved reference corpus is the active visual reference source for future visual, prototype, and assetization work.
- Historical visual-artifact and review-screenshot folders under `docs/archive/` are preservation/reference history only. They are not current execution authority unless explicitly promoted in a later current brief.
- Future prototype work must use approved raster/reference assets or extracted/recombined Phase 6 asset-kit logic. Generic SVG-grade illustration, CSS/DOM/canvas-drawn scene art, or code-drawn storefronts must not substitute for primary visual evidence.
- App implementation starts only after Batu opens the relevant prototype implementation gate and public interfaces/module boundaries are documented and reviewed.

## Active Blockers

- Production visual assets, production asset direction, and production asset pipeline are unapproved.
- Phase 4.5 does not prove production buildability or production scalability.
- The current brief authorizes docs-only Phase 6 review and prototype translation planning; it does not authorize source/app changes, production assets, public interfaces, final architecture, real-place cards, live data, CI, deployment, or broad app implementation.
- Real-place cards and production placement remain blocked by unresolved source/placement risks.
- Exact Greenpoint Av G station geometry, exact facade geometry, storefront widths, frontage/order, addresses, and active-business claims are not approved for production representation.
- React/Vite/Pixi setup, app/source folders, package/build tooling, CI, deployment, final architecture, public interfaces, production map implementation, and broader app implementation remain blocked until a later current brief explicitly opens that scope.
- Project-specific implementation skills, plugin installs, and broad tooling stacks remain blocked unless Batu approves them later.

## Pending Decisions

- Whether Batu/ChatGPT should approve reusable asset/module rules after reviewing the Phase 6 repeatable assetization proof.
- What parts of the Phase 6 asset-kit logic can be safely translated into a constrained prototype implementation brief.
- Whether Batu/ChatGPT should approve a later implementation setup batch based on the Phase 6 review and prototype translation plan.
- Architecture boundaries and public interfaces for any future prototype beyond the narrow setup scaffold.
- Device/performance constraints and feedback loops for any future implementation phase.
- Whether the integrated paper/card UI treatment continues unchanged, is reduced, or is redesigned during future product/interaction planning.
- What production asset direction and production asset pipeline, if any, should be approved later.
- Which unresolved real-place candidates are omitted, treated as unknown/closed, used symbolically, fictionalized, or manually verified later.
- Whether Karczma and Brouwerij Lane remain outside the compact slice, require an expanded boundary, or are deferred to another slice.

## Delegated Docs

- `docs/CURRENT_EXECUTION_BRIEF.md`: next executable Codex task and operational handoff.
- `docs/TASKS.md`: backlog, current batch detail, task tracking, and historical task orientation.
- `docs/DECISION_LOG.md`: durable decision history and rationale.
- `docs/MVP_SCOPE.md`: detailed MVP scope and non-goals.
- `docs/ART_DIRECTION.md`: art-direction principles, reference handling, and historical visual context.
- `docs/VISUAL_ARTIFACT_STANDARDS.md`: fidelity ladder, artifact-format rules, and visual self-audit requirements.
- `docs/VISUAL_QA_CHECKLIST.md`: visual QA checklist.
- `docs/AGENTIC_TOOLING.md`: workflow/tooling policy, allowed tooling use, blocked tooling use, and skills/plugins governance.
- `docs/ARCHITECTURE.md`: future architecture boundaries after the architecture gate opens.
- `docs/DATA_FEASIBILITY.md`: location truth feasibility, Batch 8.5/8.5B source review, blocking factual uncertainties, and structural reference handling.
- `docs/PLACE_SOURCE_POLICY.md`: place-source hierarchy, verification policy, source conflicts, and staleness rules.
- `docs/PLACE_SCHEMA.md`: conceptual place-data shape and truth-status vocabulary; not an implementation interface until approved later.
