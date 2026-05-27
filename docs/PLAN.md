# Project Plan

Status: Current project-state source of truth
Date: 2026-05-26
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

Status: Blocked.

Purpose: Produce and approve one concrete static frame that resolves the visual direction, composition, and truth-safe representation before implementation begins.

Entry criteria:

- Phase 2 clears enough location/truth constraints.
- Batu approves resuming Phase 1 toward a static style-frame production step.
- Visual direction and composition are approved for a static frame.

Exit criteria:

- Batu approves the static style frame.
- The static style frame passes the decision-usefulness standard before it is treated as gate-supporting evidence.
- Visual QA issues are documented or resolved.
- Any real-place representation in the frame is source-backed or explicitly placeholder/symbolic.

Major outputs:

- Approved static style frame.
- Visual QA notes.
- Updated decision log.

Phase 4 - Architecture + Prototype Setup

Status: Blocked.

Purpose: Define architecture boundaries, public interfaces, tooling, and the smallest prototype setup needed to build the approved experience.

Entry criteria:

- Phase 3 exits.
- Architecture boundaries and public interfaces are documented for Batu review.

Exit criteria:

- Batu approves architecture boundaries and public interfaces.
- Prototype tooling and feedback loops are established.

Major outputs:

- Architecture notes.
- Approved public interfaces / module boundaries.
- React/Vite/Pixi setup only after gates clear.

React/Vite/Pixi and app implementation remain blocked until Phase 3 exits and architecture gates clear.

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

The current visual-development evidence is Batch 13 survivor direction materials.

## Latest Visual State

- No final visual direction is approved yet.
- Phase 1 is incomplete and cannot exit until Batu approves a static style-frame direction from concrete visual evidence.
- Batch 13 survivor direction development is evidence only; it does not approve final visual language, production assets, app implementation, public interfaces, or real-place representation.
- Community Pixel Storefront remains historical/exploratory only, not final direction.
- Batch 8 context-test artifacts remain in the repo as useful intent scaffolding only.
- Batch 8 did not meet the fidelity threshold for creative-direction feedback and does not imply any approved direction.
- Batch 8B and later same-base comparison artifacts do not approve visual direction.
- Batch 10 is rejected as non-decision-grade because it did not diverge enough.
- Batch 11 and Batch 12 are historical inputs to the current survivor-development evidence, not final visual approval.
- Phase 2 / Batch 8.5 selected a hybrid real-plus-placeholder composition because the slice is not verified enough to proceed as-is.
- Exploratory visual work may continue only if it uses clearly labeled placeholder, symbolic, fictionalized, or unresolved geography.
- The next visual decision must treat current artifacts as evidence to review, not as a pre-approved direction.
- Static style frame remains blocked.
- React/Vite/Pixi remains blocked.
- Production visual assets and real-place card production remain blocked.
- Older visual territories are historical references unless Batu explicitly reactivates one.

## Agentic Workflow Guardrails

Current agentic workflow guardrails live in `docs/AGENTIC_TOOLING.md`. This plan records phase/state, decision gates, and next project decisions.

## Visual Validation Ladder

Visual decisions advance through concrete artifacts, not prose-only direction.

1. References / moodboard.
2. Divergent style frames.
3. Decision-grade comparison board.
4. Greybox interaction prototype.
5. High-fidelity slice.
6. MVP implementation.

Prose direction alone is not decision-grade. Each rung must state the decision it supports, the fidelity level, and what remains unresolved or reserved for Batu.

## Locked Decisions

- The MVP is one authored scene, not a broad map product.
- Batu owns creative direction, product direction, and public module/interface approval.
- Codex owns tactical implementation inside approved boundaries.
- Meaningful visual approvals require concrete artifacts, not prose-only approval.
- Visual artifacts must be labeled lo-fi / exploratory / not final when they are decision aids.
- Business representation must use public factual information only.
- Real places must not be moved onto incorrect streets or presented with false adjacency.
- Codex must not silently resolve ambiguous real-world truth with guesses.
- Any uncertainty must be documented as unresolved, placeholder, omitted, or manual-review-required.
- App implementation starts only after static style-frame approval and all required preproduction risk gates are cleared.

## Pending Decisions

- Batu has selected the Phase 2 gate outcome: hybrid real-plus-placeholder composition.
- Next Batu decision: review current survivor-development visual evidence and decide whether any direction advances toward prototype visual-system exploration.
- Which unresolved candidates are omitted, treated as unknown/closed, or allowed only as placeholders.
- Whether Karczma and Brouwerij Lane remain out of the compact slice, require a revised/expanded boundary, or are deferred to a later slice.
- Whether any previous Community Pixel Storefront energy should survive as one input inside a more divergent concept sprint.
- Which radical concept territories should advance to decision-grade raster/image style frames.
- The static style-frame composition after a visual world is chosen.
- The authoritative source hierarchy for buildings, lots, addresses, and businesses.
- The operational definition of spatially coherent authored placement.
- Whether a later proposed static style-frame production pass is justified after Batch 8B review.
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
- Static style-frame production is unapproved.
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

Batch 8.5 remains a required truth record before static style-frame approval, final visual direction approval, React/Vite/Pixi implementation, production visual assets, or real-place card production.

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
- Approving static style-frame production.
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

## Next Proposed Batch

Review the Batch 13 survivor direction development evidence and decide whether Soft Pixel, Inked Indie, both, or neither should advance toward prototype visual-system exploration.

Batch 13 is evidence only; this review must not approve final visual direction, app architecture, implementation, or production visual assets.

## Batch 8B Acceptance Criteria

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
2. `docs/PLAN.md`
3. `docs/DECISION_LOG.md`
4. `docs/MVP_SCOPE.md`
5. `docs/ART_DIRECTION.md`
6. `docs/VISUAL_QA_CHECKLIST.md`

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
