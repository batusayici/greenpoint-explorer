# Project Plan

Status: Current project-state source of truth
Date: 2026-05-28
Creative direction owner: Batu
Implementation owner: Codex

## Product Goal

Greenpoint Isometric Explorer should prove that a small authored Greenpoint scene can feel visually distinctive, locally specific, and worth clicking.

The MVP is not a full map product or game system. It is a polished, authored, interactive diorama that tests screenshot appeal, local specificity, and first-click interest.

## MVP Scope

The MVP is one compact isometric scene around Manhattan Ave / Greenpoint Ave.

Included:

- Desktop/tablet-primary web prototype with basic mobile containment.
- Pixel-inspired HD visual style after Batu approval.
- One authored scene with bounded pan and zoom.
- Desktop hover and click.
- Touch tap highlight and card open.
- 4-6 source-backed real named places only if spatially coherent.
- Static local place data.
- Place cards with neutral factual copy, source URL, last verified date, and unofficial-map disclaimer.
- 2-4 ambient visual-only animation loops.

## Explicit Non-Goals

Out of scope for MVP:

- Avatar movement.
- Pathfinding.
- Routing.
- Real map navigation.
- NPCs.
- Interiors.
- Events.
- Flyers as a product system.
- Stoop sales.
- Hidden objects.
- Notebook or discovery log.
- Quests.
- Accounts.
- Persistence.
- Live data.
- Scraping.
- User submissions.
- CMS.
- Business opt-in flows.
- Broad neighborhood coverage.
- Phone-first optimization.

## Project Phases

Phase 0 - Governance + Creative Process Setup

Status: Complete.

Purpose: Establish authority, workflow, source-of-truth order, visual governance, and implementation gates before the project moves from idea into production.

Exit criteria:

- Repo-level agent instructions exist.
- Current-state planning docs exist.
- Creative, product, architecture, and implementation authority boundaries are explicit.
- Hard gates block premature app, map, and production visual work.

Major outputs:

- `AGENTS.md`
- `docs/PLAN.md`
- `docs/TASKS.md`
- Governance entries in `docs/DECISION_LOG.md`

Phase 1 - Visual Preproduction

Status: Started / incomplete / no final visual direction approved.

Purpose: Explore radically distinct visual worlds through concrete artifacts before final visual approval. The current process is no longer minor variants of one base composition; it is a game-studio-style concept sprint comparing different art-direction hypotheses.

Entry criteria:

- Governance and visual approval rules are explicit.
- Exploratory work is clearly labeled as lo-fi, exploratory, historical, or not final.
- Each visual batch states its intended decision and fidelity level from `docs/VISUAL_ARTIFACT_STANDARDS.md`.

Exit criteria:

- Batu has enough concrete visual evidence to approve a static style-frame direction.
- Visual artifacts pass the decision-usefulness standard; files existing is not enough.
- The chosen visual path does not depend on unresolved or false location/truth claims.
- Concept options are distinct enough to compare as different visual worlds, not palette, density, or iconography variants.

Major outputs:

- Batch 8 exploratory context-test artifacts.
- Batch 8B Community Pixel Storefront style-frame test package.
- Batch 10 curated-reference comparison, rejected as non-decision-grade.
- Batch 11 Radical Art Direction Concept Sprint.
- Batch 12 radical hero style frames as visual evidence for direction selection.
- Batch 13 survivor direction development package.
- Batch 14 production scalability spike definition.
- Batch 15 raster production proof.
- Batch 16 Inked Indie static style-frame gate brief.
- Reference boards, review guides, and visual QA notes.

Phase 1 is not complete. Visual direction is not approved.

Visual-preproduction batches are not complete merely because artifact files exist. They must pass `docs/VISUAL_ARTIFACT_STANDARDS.md` before Codex may call them review-ready or use them as gate-supporting evidence.

Phase 2 - Location & Representational Truth Feasibility

Status: Gate outcome selected; hybrid real-plus-placeholder composition.

Purpose: Prove whether the Manhattan Ave / Greenpoint Ave slice can truthfully support real businesses, buildings, addresses, source-backed place cards, and spatially coherent authored placement.

Selected outcome:

- Use a hybrid real-plus-placeholder composition.

Implications:

- The Manhattan Ave / Greenpoint Ave slice is not verified enough to proceed as-is.
- Peter Pan and the Greenpoint Av G station may continue as symbolic / exploratory anchors.
- Other businesses must remain placeholders, fictionalized storefronts, omitted, or unresolved until manual verification clears them.
- Real-place cards remain blocked.

Entry criteria:

- Candidate slice and likely anchor places are identified.
- Visual advancement depends on knowing which real-world relationships are safe, unresolved, placeholder-only, or omitted.

Exit criteria:

- 6-10 candidate places/buildings are evaluated.
- Address, source notes, verification status, and placement confidence are documented.
- No wrong-street placement, false adjacency, or unsupported active-business claim is allowed.
- Batu selects a Phase 2 gate outcome with unresolved risks explicitly labeled.

Major outputs:

- `docs/DATA_FEASIBILITY.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/PLACE_SCHEMA.md`
- Batch 8.5 / 8.5B task and decision-log updates.

Phase 3 - Static Style Frame

Status: Passed as gate evidence only / final visual direction not approved / implementation not approved.

Purpose: Produce and approve one concrete static frame that resolves the visual direction, composition, and truth-safe representation before implementation begins.

Entry criteria:

- Phase 2 clears enough location/truth constraints.
- Batu approves resuming Phase 1 toward a static style-frame production step. Approved on 2026-05-27 for one Inked Indie / Compact Corner Anchor review artifact only.
- Visual direction and composition are approved for a static frame. Approved only for one review artifact, not final visual direction or production assets.

Exit criteria:

- Batu approves the static style frame.
- The static style frame is a high-fidelity raster PNG/JPG review artifact. SVG diagrams may support the package, but they cannot satisfy Phase 3.
- The static style frame passes the decision-usefulness standard before it is treated as gate-supporting evidence.
- A checklist-compliant SVG is a format failure for Phase 3 unless Batu explicitly requests SVG for this phase.
- Phase 3 cannot pass without visual evidence that proves art direction, not just layout constraints.
- Visual QA issues are documented or resolved.
- Any real-place representation in the frame is source-backed or explicitly placeholder/symbolic.

Major outputs:

- `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/inked-indie-compact-corner-style-frame-revision-a.png`
- Revision A approved by Batu as Phase 3 static style-frame gate evidence only.
- Visual QA notes.
- Updated decision log.

Phase 3 approval means the Inked Indie / Compact Corner direction has promise. It does not approve final visual direction, production visual language, production assets, architecture, public interfaces, app implementation, package/build tooling, CI, deployment, or real-place cards. It also does not prove that the direction can be built or scaled.

Phase 3.5 - Production-System Proof

Status: Defined for Batu review / not implementation / buildability and scalability not proven.

Purpose: Break the approved Phase 3 style frame into repeatable visual rules and test whether the Inked Indie / Compact Corner direction can scale beyond one polished hero frame.

Entry criteria:

- Phase 3 static style-frame gate evidence is approved by Batu.
- Final visual direction, production assets, architecture, public interfaces, app implementation, and real-place cards remain blocked.

Exit criteria:

- Facade module rules, storefront bay construction rules, signage types, awning/window/door/roll-gate variants, prop categories, marker/card rules, texture and linework rules, density limits, and truth-handling rules are documented.
- Rules distinguish symbolic real-place anchors from fictional/placeholder storefronts.
- Constraints prevent exact real-place claims, exact station geometry claims, factual real-place cards, and production-asset claims.
- 2-3 smaller derivative storefront examples prove whether the style can become a repeatable system.
- Any proposed derivative visual artifact states artifact class, supported decision, required output format, and acceptance criteria before production.

Major outputs:

- `docs/visual-artifacts/phase-3-5-production-system-proof/README.md`
- Production-system proof rules.
- 3 proposed derivative storefront examples for Batu review.
- Updated decision log and current task tracker.

Phase 4 - Architecture + Prototype Setup

Status: Blocked.

Purpose: Define architecture boundaries, public interfaces, tooling, and the smallest prototype setup needed to build the approved experience.

Entry criteria:

- Phase 3.5 production-system proof exits, or Batu explicitly decides to skip it.
- Batu explicitly opens the architecture/prototype setup gate.
- Architecture boundaries and public interfaces are documented for Batu review.

Exit criteria:

- Batu approves architecture boundaries and public interfaces.
- Prototype tooling and feedback loops are established.

Major outputs:

- Architecture notes.
- Approved public interfaces / module boundaries.
- React/Vite/Pixi setup only after gates clear.

React/Vite/Pixi and app implementation remain blocked until Batu separately opens Phase 4 and architecture gates clear.

Phase 5 - Interactive Map Mode MVP

Status: Blocked.

Purpose: Build the approved authored interactive diorama with bounded pan/zoom, hover/click/tap behavior, static local place data, factual cards, and limited ambient visual loops.

Entry criteria:

- Phase 4 exits.
- Public interfaces, module boundaries, and feedback loops are approved.

Exit criteria:

- MVP interaction scope works against the approved scene.
- Source-backed place content is represented within the truth policy.
- Fast feedback loops pass.

Major outputs:

- Interactive MVP prototype.
- Static local place dataset.
- Place cards and interaction QA notes.

Phase 6 - QA / Polish / Shareable Preview

Status: Blocked.

Purpose: Stabilize the MVP into a polished preview that can be shared for feedback without expanding scope.

Entry criteria:

- Phase 5 MVP behavior is implemented.
- QA targets and preview expectations are defined.

Exit criteria:

- Visual, interaction, content, and representational-truth QA pass or have documented exceptions.
- Shareable preview is ready within MVP scope.

Major outputs:

- QA checklist updates.
- Polish fixes.
- Shareable preview build or equivalent review artifact.

Phase 7 - Post-MVP Expansion Parking Lot

Status: Not part of MVP.

Purpose: Preserve future ideas without pulling them into current MVP scope.

Entry criteria:

- MVP scope remains protected.
- Expansion ideas are clearly parked rather than planned as current work.

Exit criteria:

- None for MVP.

Major outputs:

- Parking-lot notes for future exploration.

## Current Phase

The project is in documentation and visual preproduction.

Governance hardening and the docs-only tooling policy are complete.

Visual preproduction has started but remains incomplete.

Phase 2 / Batch 8.5 selected a hybrid real-plus-placeholder composition as the gate outcome.

Location truth feasibility remains active and important because real-place cards, production placement, and truthful storefront relationships are still blocked.

The current lead visual direction is Inked Indie Graphic Novel after Batch 15 review.

The Phase 3 Inked Indie / Compact Corner Revision A raster package is approved as static style-frame gate evidence only. The earlier SVG output is preserved as supporting/planning evidence, not as the primary Phase 3 artifact.

The current Codex-executable task is defined only in `docs/CURRENT_EXECUTION_BRIEF.md`. At this alignment point, that task remains Phase 3.6 docs-only buildability/scalability planning.

## Latest Visual State

- No final visual direction is approved yet.
- Phase 1 remains incomplete because Batu has approved Phase 3 gate evidence only, not final visual direction or production visual language.
- Batch 13 survivor direction development is evidence only; it does not approve final visual language, production assets, app implementation, public interfaces, or real-place representation.
- Batch 14 production scalability spike includes generated SVG evidence, but the audit downgraded it to schematic/planning-grade rather than decision-grade evidence.
- Batch 15 raster production proof generated four high-fidelity raster artifacts visually comparable to Batch 13.
- Batu selected Inked Indie as the lead visual direction after Batch 15 review; this is not final production approval.
- Batch 16 translates the Inked Indie lead direction into a docs-only static style-frame gate brief.
- Batu approved Phase 3 static style-frame production for one Inked Indie / Compact Corner Anchor review artifact only.
- Batu approved the Phase 3 Revision A raster style frame as static style-frame gate evidence only; the earlier SVG is supporting/planning-grade evidence only.
- The approved frame proves that the Inked Indie / Compact Corner direction has promise, but it does not prove that the direction can be built or scaled.
- Phase 3.5 derivative visual proof has status `PROCEED_TO_BUILDABILITY_PLANNING`.
- Phase 3.6 docs-only buildability/scalability planning is the current Codex-executable task in `docs/CURRENT_EXECUTION_BRIEF.md`.
- Community Pixel Storefront remains historical/exploratory only, not final direction.
- Batch 8 context-test artifacts remain in the repo as useful intent scaffolding only.
- Batch 8 did not meet the fidelity threshold for creative-direction feedback and does not imply any approved direction.
- Batch 8B and later same-base comparison artifacts do not approve visual direction.
- Batch 10 is rejected as non-decision-grade because it did not diverge enough.
- Batch 11 and Batch 12 are historical inputs to the current Inked Indie lead-direction evidence, not final visual approval.
- Phase 2 / Batch 8.5 selected a hybrid real-plus-placeholder composition because the slice is not verified enough to proceed as-is.
- Exploratory visual work may continue only if it uses clearly labeled placeholder, symbolic, fictionalized, or unresolved geography.
- The next visual-production decision after Phase 3.6 is whether to authorize a bounded technical-art proof of one small storefront module decomposed into reusable layers.
- React/Vite/Pixi remains blocked.
- Production visual assets and real-place card production remain blocked.
- Older visual territories are historical references unless Batu explicitly reactivates one.

## Agentic Workflow Guardrails

The canonical Codex/ChatGPT/Batu handoff loop lives in `AGENTS.md`. `docs/CURRENT_EXECUTION_BRIEF.md` is the canonical source for Codex's next executable task. This plan records phase/state, decision gates, and project context; it should not be used to infer a different next Codex task when a current brief exists.

## Visual Fidelity Ladder

Visual decisions advance through concrete artifacts, not prose-only direction. Each rung must state the decision it supports, the fidelity level, the required output format, and what remains unresolved or reserved for Batu.

| Level | Artifact class | Purpose | Allowed formats | Can support | Cannot support |
| --- | --- | --- | --- | --- | --- |
| Level 0 | Text brief | Frame intent, constraints, unresolved questions, acceptance criteria, and decision options. | Markdown or plain text. | Scope, requirements, critique framing, governance alignment, and approval to make the next artifact. | Visual taste, art-direction approval, composition approval, style-frame approval, production asset approval. |
| Level 1 | Diagram/blockout | Show relationships, rough composition, truth status, spatial logic, or review flow. | SVG, ASCII, markdown diagrams, rough PNG/JPG sketches. | Layout planning, composition discussion, truth/governance review, and choosing what to refine. | Final visual direction, emotional tone, storefront detail, UI styling, style-frame approval, production proof. |
| Level 2 | Style tile/component proof | Test visual ingredients such as palette, line, texture, signage, marker/card treatment, storefront module, or asset handling. | PNG/JPG required for high-fidelity visual proof; SVG allowed only for schematic component diagrams or if Batu explicitly requests SVG. | Narrow art-direction questions about a component, material treatment, or style ingredient. | Whole-scene approval, Phase 3 static style-frame exit, final visual direction, production implementation approval. |
| Level 3 | Static style frame | Prove the whole scene's visual language, emotional volume, storefront rhythm, UI/world integration, local specificity, and screenshot appeal. | High-fidelity raster PNG/JPG. SVG only if Batu explicitly requests SVG, and then it must be labeled as an exception. | Phase 3 visual review, art-direction comparison, and deciding whether the direction can proceed. | App implementation approval by itself, production asset approval, unresolved truth claims, public-interface approval. |
| Level 4 | Production asset/prototype asset | Provide final or near-final assets after visual direction, truth constraints, and implementation boundaries are approved. | PNG/JPG or implementation-native asset formats approved for the production path; SVG only when the approved production asset pipeline calls for it. | Production asset review, prototype asset integration, and implementation-ready visual QA. | Opening blocked gates that have not been separately approved, changing visual direction, or bypassing truth/source review. |

SVG/ASCII/markdown artifacts are valid for Level 1 planning and governance review. High-fidelity visual-direction decisions require raster PNG/JPG evidence. Constraint checklist compliance is not enough if the artifact format is wrong.

Before generating any future visual artifact, Codex must state:

- Intended artifact class.
- Decision it supports.
- Required output format.
- Why that format is appropriate.
- Whether SVG is allowed or disallowed for the task.

## Locked Decisions

- The MVP is one authored scene, not a broad map product.
- Batu owns creative direction, product direction, and public module/interface approval.
- ChatGPT owns critique, decision-support framing, and next-brief authoring.
- Codex owns execution of the current brief inside approved boundaries.
- Meaningful visual approvals require concrete artifacts, not prose-only approval.
- Visual artifacts must be labeled lo-fi / exploratory / not final when they are decision aids.
- Business representation must use public factual information only.
- Real places must not be moved onto incorrect streets or presented with false adjacency.
- Codex must not silently resolve ambiguous real-world truth with guesses.
- Any uncertainty must be documented as unresolved, placeholder, omitted, or manual-review-required.
- App implementation starts only after Batu separately opens architecture/prototype setup, approves architecture boundaries and public interfaces, and all required preproduction risk gates are cleared.

## Pending Decisions

- Batu has selected the Phase 2 gate outcome: hybrid real-plus-placeholder composition.
- Batu selected Inked Indie as the lead visual direction after Batch 15 review.
- Batu approved `inked-indie-compact-corner-style-frame-revision-a.png` as Phase 3 static style-frame gate evidence only.
- Next Batu/ChatGPT decision after Phase 3.6: decide whether to authorize a bounded technical-art proof of one small storefront module decomposed into reusable layers.
- Which unresolved candidates are omitted, treated as unknown/closed, or allowed only as placeholders.
- Whether Karczma and Brouwerij Lane remain out of the compact slice, require a revised/expanded boundary, or are deferred to a later slice.
- The authoritative source hierarchy for buildings, lots, addresses, and businesses.
- The operational definition of spatially coherent authored placement.
- The app architecture boundaries and public interfaces.

## Current Blockers

- Final visual direction is unapproved.
- Phase 2 selected a hybrid real-plus-placeholder composition, but production placement is not cleared.
- Blocking factual uncertainties remain for:
  - 718 Manhattan Ave / Captured Record Shop entrance, storefront, and possible basement relationship.
  - 723/725 Manhattan Ave / Sweetgreen and former Meserole Theater footprint, frontage, and entrance relationship.
  - 726 Manhattan Ave / Polka Dot current status, side-of-street depiction, and storefront frontage.
  - 727 Manhattan Ave / Peter Pan storefront width, side-of-street depiction, and adjacency to Sweetgreen.
  - exact Greenpoint Av G station stair and elevator placement.
  - Peter Pan / Sweetgreen storefront order and whether simplified drawing would imply false adjacency or wrong frontage.
  - Karczma and Brouwerij Lane slice-boundary relevance.
- Phase 3 static style-frame gate evidence is approved only for Revision A.
- Phase 3.5 has enough repeatability evidence for buildability planning, but production buildability and scalability remain unapproved.
- React/Vite/Pixi implementation is blocked.
- Map implementation is blocked.
- Production visual assets are blocked.
- Real-place card production is blocked.
- App architecture is unapproved.
- Test/lint/typecheck commands do not exist because no app tooling exists.

## Completed Governance Batch

Completed docs-only governance work:

- Governance hardening only.
- Create root agent instructions.
- Create this current-state plan.
- Record the governance decision.
- Mark the old implementation plan as historical.
- Add an architecture stub.
- Add a compact task tracker.

No app code, build tooling, or visual assets were included in this batch.

## Batch 8.5 - Location & Representational Truth Feasibility Gate

Status: Gate outcome selected / hybrid real-plus-placeholder composition

Batch 8.5 remains a required truth record before final visual direction approval, React/Vite/Pixi implementation, production visual assets, or real-place card production.

Selected outcome:

- Use a hybrid real-plus-placeholder composition.

The gate does not clear production placement. Future visual artifacts may use Peter Pan and the G station as symbolic anchors only when unresolved businesses are treated as placeholders, fictionalized storefronts, omitted, or unresolved.

Exploratory visual work may continue only if it does not depend on unresolved real-world placement claims.

Allowed for future truth-safe visual exploration:

- Lo-fi or mid-fi visual exploration.
- Mood, palette, marker/card hierarchy, and emotional-volume tests.
- Clearly labeled placeholder or symbolic storefronts.
- Composition studies that explicitly mark unresolved geography.

Still forbidden after the Phase 2 outcome selection unless explicitly approved later:

- Approving final visual direction.
- Production visual assets.
- Real-place cards.
- Claims that a real business/building/street relationship is accurate.
- Any composition that silently relies on unresolved geography.

Purpose:

- Prove the first Greenpoint slice can accurately support real businesses, buildings, addresses, and source-backed place cards.
- Prevent visual direction from advancing around a fake or unsupported map substrate.
- Define what AI/Codex may infer versus what Batu must manually approve.

Required deliverables:

- `docs/DATA_FEASIBILITY.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/PLACE_SCHEMA.md`
- `docs/TASKS.md` updates
- `docs/DECISION_LOG.md` updates

Required decisions to capture:

- Authoritative source hierarchy for buildings, lots, addresses, and businesses.
- Likely source candidates, including NYC Open Data / MapPLUTO, OpenStreetMap, Google Places or equivalent manual lookup, business websites, and manual verification.
- Address normalization approach.
- Business-to-building/storefront relationship model.
- Multi-tenant building handling.
- Source conflict resolution rules.
- Stale or closed business handling.
- `lastVerified` protocol.
- What spatially coherent operationally means.
- What may be approximate in an authored isometric diorama.
- What cannot be approximated.
- What requires Batu approval.
- What must be labeled unknown, placeholder, or omitted.

Acceptance criteria:

- 6-10 candidate places/buildings from the Manhattan Ave / Greenpoint Ave slice are evaluated.
- Each candidate has an address, source notes, verification status, and placement confidence.
- Any uncertain placement is marked as unresolved, not silently guessed.
- No business is placed on the wrong street.
- No false adjacency is introduced.
- Any manual correction path is documented.
- Batu has selected the hybrid real-plus-placeholder composition outcome.

Revising the slice is not a failure. It is a valid preproduction outcome if the original slice cannot truthfully support the intended density or composition.

This gate does not approve final visual direction, static style-frame production, app architecture, public interfaces, React/Vite/Pixi, CI, deployment, plugins, implementation-oriented skills, production visual assets, or real-place card production.

## Structural Reference Handling

Cannoneyed Isometric NYC (`https://cannoneyed.com/projects/isometric-nyc`) must be reviewed during Batch 8.5 or the next visual-preproduction pass.

The project may learn from its handling of NYC density, authored isometric abstraction, block compression, and representational tradeoffs.

The project must not copy its visual style, assets, composition, or distinctive execution. Any takeaways must be recorded as structural lessons, not style approvals.

## Preproduction Risk Gates

These gates keep the MVP from advancing on unsupported assumptions. Batu owns creative direction, product direction, public representation approval, and final approval of manual overrides. Codex may propose policies, schemas, and feasibility findings, but may not silently resolve ambiguous real-world truth with guesses.

| Gate | When it happens | What it prevents | Proof artifact | Approval |
|---|---|---|---|---|
| Location & Representational Truth Feasibility Gate | Before static style-frame approval or further visual advancement around real places | Fake or unsupported map substrate, incorrect street placement, false adjacency, unsupported place cards | `docs/DATA_FEASIBILITY.md`, `docs/PLACE_SOURCE_POLICY.md`, `docs/PLACE_SCHEMA.md` | Batu approves feasibility and unresolved items |
| Scene Composition Truth Gate | Before approving a static style-frame composition | Moving real places to incorrect streets, compressing blocks into false adjacency, presenting placeholders as real | Annotated composition brief with truth/approximation notes | Batu approves composition truth |
| Interaction Value Gate | Before app implementation | Building clickable systems before the first-click value is clear | Interaction brief with target behaviors and card value criteria | Batu approves product value |
| Content/Copy Policy Gate | Before real-place card production | Unsupported claims, promotional tone, stale facts, unclear disclaimers | Content policy and sample card copy review | Batu approves public copy direction |
| Licensing/Reference Safety Gate | Before production visual assets | Unlicensed reference dependence, unclear derived-art risk, undocumented source use | Reference log and licensing notes | Batu approves reference safety |
| Performance/Device Constraint Gate | Before app architecture approval | Visual ambition that cannot fit the target prototype constraints | Device and performance constraint note | Batu approves target constraints |
| Manual Override Governance Gate | Before map or place-data implementation | Hidden manual corrections, unreviewed authored placement, undocumented exceptions | Manual override policy and approval log pattern | Batu approves override rules |

## Future Version-Control Guardrail

This is not required to complete Batch 8.5.

Before app implementation or production asset work, the project should have:

- Git initialized in the project directory.
- Branch and commit workflow defined.
- Decision-log and artifact versioning expectations.
- A clear rule for committing docs/artifacts in small batches.
- Verification commands that can actually run in the repo.

## Current Execution Handoff

Codex's next executable task is whatever is stated in `docs/CURRENT_EXECUTION_BRIEF.md`, not this plan's historical phase notes or prior chat context.

Current brief task at this alignment point:

- Phase 3.6 docs-only buildability/scalability planning for the Inked Indie / Compact Corner direction.

Expected Batu/ChatGPT decision after that task:

- Decide whether to authorize a bounded technical-art proof asking whether one small storefront module can be decomposed into reusable layers while preserving the Phase 3.5 visual character.

This handoff must not approve final visual direction, app architecture, implementation, production assets, real-place cards, public interfaces, package tooling, CI, or deployment unless Batu explicitly opens those later gates through a later current brief.

## Historical Batch 8B Acceptance Criteria

This section is preserved as historical context only. It is not the current next batch and does not reopen Community Pixel Storefront as the lead path.

The Batch 8B visual artifact package exists for review when:

- `docs/visual-artifacts/batch-8b-community-pixel-storefront-style-frame-test/` exists with README, review guide, reference log, reference board, three controlled variants, and comparison board.
- Batch 8B uses the compact Peter Pan + G station composition only.
- Batch 8B uses actual Greenpoint and OCCII references and records them explicitly.
- Exported PNG review artifacts render consistently without the Batch 8 palette bug.
- `docs/PLAN.md`, `docs/TASKS.md`, and `docs/DECISION_LOG.md` record Batch 8B as the latest visual-preproduction package.
- Batch 8 remains preserved and explicitly unapproved.
- No app code, package tooling, React/Vite/Pixi setup, implementation skills, plugin installs, CI, deployment, or production visual approval is created.

## Source Of Truth Files

Use these in order:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/DECISION_LOG.md`
5. `docs/MVP_SCOPE.md`
6. `docs/ART_DIRECTION.md`
7. `docs/VISUAL_ARTIFACT_STANDARDS.md`
8. `docs/VISUAL_QA_CHECKLIST.md`

## Agentic Tooling Strategy

Agentic tooling is a governed preproduction support layer, not a creative, product, architecture, or public-interface authority layer.

Detailed policy lives in `docs/AGENTIC_TOOLING.md`.

Adopted now:
- `AGENTS.md` governance.
- Plan Mode for audits, strategy, and visual-test planning.
- Small docs/artifact batches.
- Decision logging for meaningful choices.
- Docs-only tooling policy.

Optional future preproduction skills are documented but not created:
- `visual-direction-review`
- `design-decision-log`
- `greenpoint-reference-discipline`

Deferred:
- Implementation-oriented skills.
- Broad plugin stack installation.
- GitHub PR review setup.
- GitHub Actions / CircleCI.
- Render, Remotion, Superpowers, and CodeRabbit.

This tooling integration does not unblock visual approval, static style-frame production, React/Vite/Pixi, map implementation, architecture implementation, public module/interface implementation, CI, or deployment.
