# Agent Operating Contract

Status: Active  
Date: 2026-05-29
Project: Greenpoint Isometric Explorer

## Project Status

The project has an approved visual direction and remains pre-production.

Prototype implementation may proceed only when `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens that scope as the current executable batch or as a pre-authorized queued batch. Do not initialize new frameworks, package tooling, source folders, build configuration, map systems, or production architecture unless the current brief explicitly authorizes them and the required architecture boundaries and public interfaces are documented and reviewed.

## Creative Authority Model

Batu owns:

- Creative direction.
- Product direction.
- Taste calls and visual tradeoff decisions.
- Public module and interface approval.
- Final approval of visual language, architecture boundaries, and scope changes.

ChatGPT supports:

- Critique at major planning, review, ambiguity, and gate-decision moments.
- Decision-support framing for Batu when a decision needs outside critique.
- Drafting or revising `docs/CURRENT_EXECUTION_BRIEF.md` when Batu asks for that support.
- Preserving constraints, unresolved questions, and next-step criteria when participating in a review.

Codex owns:

- Tactical implementation inside approved boundaries.
- Producing the output packet requested by the current execution brief.
- Clear options and tradeoff framing when the current brief asks for them.
- Artifacts, verification, and documentation for Batu review, with ChatGPT review used only when Batu or the repo governance calls for it.
- Small, reviewable batches.
- Test, QA, and documentation updates for the current brief only.

When requirements are ambiguous, clarify before implementation. Codex must mark assumptions and unresolved decisions. Do not make autonomous creative, product, architecture, or public-interface decisions, and do not silently convert suggestions, recommendations, or exploratory artifacts into approved decisions.

Visual direction cannot be approved from prose-only labels, recommendations, or taste descriptions. It requires concrete artifacts and Batu approval.

## Product / Research Context

For strategic product signals around digital neighborhoods, isometric city maps, GeoAI, tile generation, Fractal Paris, Edushi, Google 3D Tiles, local-recognizability criteria, and neighborhood-memory positioning, read:

- `docs/reference/research/DIGITAL_NEIGHBORHOODS_SIGNAL_LOG.md`

Use this document as strategic context only. Do not treat it as authorization to change MVP scope, source policy, architecture boundaries, implementation gates, visual direction, production-readiness claims, source integrations, or current execution scope. Active execution authority remains with `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and the source-of-truth order in this file.

## Required Workflow

Codex executes directly from repo governance and current project docs. ChatGPT is a support tool for critical planning, review, ambiguity, and gate-decision moments; it is not a required handoff step for every Codex batch.

Before each batch, Codex must always read:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md`
3. `docs/PLAN.md`
4. `docs/MVP_EXECUTION_LEDGER.md`

Read topic-specific docs only when the task touches that area:

- `docs/MVP_SCOPE.md` for scope boundaries, MVP eligibility, or production-vs-review status.
- `docs/DECISION_LOG.md` for checking or recording durable decisions.
- `docs/ART_DIRECTION.md` for visual language, style, or raster/art decisions.
- `docs/VISUAL_ARTIFACT_STANDARDS.md` for creating or evaluating visual artifacts.
- `docs/VISUAL_QA_CHECKLIST.md` for screenshots or visual review evidence.
- `docs/AGENTIC_TOOLING.md` for workflow, automation, tooling, or Codex operating behavior.
- Current MVP/review artifact package docs when continuing, reviewing, or modifying that package.

`docs/CURRENT_EXECUTION_BRIEF.md` is the active gate for Codex's next executable task and any explicitly pre-authorized queued tasks. If it does not explicitly authorize source edits, prototype implementation, visual asset work, framework/tooling changes, public-interface changes, or queue-based gate movement, Codex must stop before making those changes.

For Phase 4 work, Codex must execute only the current batch named in `docs/CURRENT_EXECUTION_BRIEF.md` or the next batch already named in that brief's pre-authorized queue, using `docs/phase-4-execution-roadmap.md` as the operating plan. Codex may update `docs/CURRENT_EXECUTION_BRIEF.md` and related execution docs to move from the completed current batch into the next batch only when that next batch is already named in the pre-authorized queue, the prior batch completed within scope, required verification passed or failures are documented as non-blocking, the docs are updated to mark the prior batch complete, and no hard Batu review gate intervenes. Codex must never invent a new batch, rename a batch, expand scope, skip a batch, or continue past a hard Batu review gate.

Codex must not rely on ChatGPT conversation memory when repo docs answer the question. When project documents conflict, use the source-of-truth order in this file. If the conflict affects source edits, scope, visual direction, production claims, commit behavior, approval states, architecture boundaries, or public interfaces, Codex must stop and ask Batu to resolve or update the control docs.

Codex must not autonomously decide the next phase, open a blocked gate, or convert recommendations into approved direction. A pre-authorized queue is not a blank check: it is only an ordered list of already-approved narrow batches, and Codex must stop when the current batch, queue, roadmap, or brief names a hard Batu review gate. Batu owns creative, product, scope, public-interface, architecture, visual direction, and final approval decisions. Codex owns execution inside the current approved boundaries.

Phase 4 execution states:

- Current executable batch: the batch Codex may implement now.
- Pre-authorized queue: an ordered list of batches Codex may self-open and execute after completing the current batch, only if the next batch is already listed and no hard Batu review gate intervenes.
- Hard Batu review gate: a stop point where Codex must return results and must not self-open the next batch or continue until Batu explicitly approves the next executable batch or queue.

## Phase 4 Operating Model

Approval governs boundaries, not every action.

Batu approval defines the active work packet, allowed scope, hard stop conditions, truth gates, verification expectations, commit behavior, and final review gate. Codex executes inside those boundaries and stops when a boundary, truth gate, verification failure, dirty-tree issue, or unresolved ambiguity is hit.

Bounded work packets:

- A packet may contain one to four small sequential batches.
- The packet must name allowed files or work areas where possible.
- The packet must define explicit stop conditions.
- Codex may self-advance inside the packet only when the next batch is explicitly authorized inside that packet, the prior batch completed cleanly, required verification passed, docs are reconciled, and no hard stop condition intervenes.
- Codex must stop at the end of the packet for Batu review.

Truth gates remain strict:

- No real business, storefront, tenant, facade, frontage, entrance, signage, active-status, exact-address, or public/product-ready claims without approved evidence.
- No source expansion without approval.
- No claim-level escalation without approval.
- No new packet, new phase, public interface, architecture boundary, production asset direction, or new claim class without Batu approval.

Execution gates are lighter inside an approved packet:

- If a change is geometry-only, deterministic, verified, and inside an approved packet, Codex should proceed.
- If a change is QA-only, status-labeled, non-factual, verified, and inside an approved packet, Codex should proceed.
- Codex should not ask for approval after every small valid execution step inside an approved packet.

Commit behavior is packet-scoped:

- Codex may commit after each successful batch only when the packet explicitly allows commit-after-batch behavior, only allowed files changed, verification passes, final status is clean except intended changes, and the commit message clearly names the batch.
- Without explicit packet commit permission, do not commit implementation.

QA mode is the experimental product lab:

- QA mode may contain draft, non-factual, status-labeled approximations.
- Normal mode must remain protected.
- QA mode may move faster than evidence-backed production layers.
- QA output must visibly carry statuses such as `manual_draft`, `fictional_safe`, `not_verified`, or equivalent.

Implementation packets must produce at least one of:

- A visible scene improvement.
- A data or fixture improvement.
- An interaction or review improvement.
- A verifier or report improvement.
- A deploy or review improvement.

Pure governance, docs-only, reconciliation-only, or next-pointer-only batches should happen only when Batu explicitly requests them or when a real gate/next-pointer blocker prevents implementation.

After implementation batches, keep docs concise: update only the brief, ledger, roadmap, and next pointer as needed. Do not rewrite the whole control surface or create docs-only reconciliation loops.

Before editing, run `git status --short`. If the tree is dirty and those changes are not explicitly part of the authorized packet, stop and report the exact files. Do not edit around unrelated dirty state.

Codex must stop and return results when the current batch says "stop at review gate", visual review by Batu is required, product/strategy judgment is required, source expansion is proposed, business verification is proposed, facade/storefront semantics are proposed for the first time, art direction is proposed, package/dependency addition is proposed, or the next step is not already in the pre-authorized queue.

Batch execution workflow:

Use this workflow for meaningful work:

1. Clarify the goal and unresolved requirements.
2. Plan the batch with reviewable artifact entry and exit criteria.
3. Wait for Batu approval when the work changes scope, visual direction, product behavior, public interfaces, module boundaries, approval states, or architecture gates.
4. Implement one small batch.
5. Run the fastest useful feedback loop available.
6. Verify the batch against its acceptance criteria.
7. Summarize what changed, what did not change, verification results, and remaining review items.

Reviewable artifact entry and exit criteria are batch acceptance gates only. They do not imply game intro, menu, onboarding, or product-polish work.

After the baseline repository commit, future batches must report `git status` and a `git diff --stat` summary.

## MVP Acceleration Rule

Until the first working MVP scene is visually demoable, default to implementation over governance.

Build the visible MVP proof. Preserve gates as constraints.

Every implementation batch must produce at least one of:

- A visible scene improvement.
- A real data ingestion/generation improvement.
- A working interaction improvement that helps evaluate the scene.
- A deploy/review improvement that helps others see the MVP.

Docs-only, reconciliation-only, verifier-only, and governance-only batches are not allowed unless Batu explicitly requests them or a real blocker prevents implementation.

Batch success is measured by visible MVP progress, not documentation completeness. A batch is invalid if it only updates docs, comments, tests, or governance files without improving the working scene, data-to-scene generation path, interaction, or deploy/review loop, unless Batu explicitly requested that docs/governance-only batch.

QA mode is the experimental product lab. It may use sourced, manual-draft, inferred, symbolic, and blocked fields as long as their status is visible. Normal mode remains protected. Do not confuse "not product-ready" with "do not render": render draft data aggressively in QA mode, label its status clearly, and keep promotion gates unchanged.

Prefer approximate, status-labeled QA-mode implementation over waiting for perfect source-backed geometry. Future implementation prompts should lead with "Build the visible MVP proof. Preserve gates as constraints," not "Preserve gates first, then maybe build if safe."

## Plan Reconciliation

After every successful MVP/prototype batch, Codex must reconcile the MVP execution-control documents before final response:

- Update `docs/PLAN.md` so it reflects the current MVP phase, remaining MVP phases, blockers, pending decisions, and next-task pointer. Keep it as a stable roadmap, not a batch-history dump.
- Update `docs/MVP_SCOPE.md` only when the batch changes or clarifies detailed MVP boundaries, non-goals, must-have/should-have/cuttable items, or MVP acceptance boundaries.
- Update `docs/CURRENT_EXECUTION_BRIEF.md` so it no longer points to a completed or stale task. It must contain the next approved/proposed executable task, an explicit pre-authorized queue if one exists, and the next hard Batu review gate; or explicitly state that the next task is pending Batu approval or a later gate review.
- Update `docs/MVP_EXECUTION_LEDGER.md` with one concise entry recording the batch outcome, files changed, verification, unresolved decisions, and next pointer.
- Do not update `docs/archive/governance/TASKS.md` unless `docs/CURRENT_EXECUTION_BRIEF.md` or `docs/PLAN.md` explicitly revives it.

If the plan, current brief, and ledger cannot be reconciled, Codex must stop and report the conflict instead of silently choosing a next phase, widening scope, or leaving stale task instructions.

Plan reconciliation does not authorize scope expansion. Batu still owns creative, product, public-interface, architecture-boundary, visual-direction, and final scope approvals; ChatGPT may support critique and next-brief drafting at critical review moments; Codex still executes only inside the current approved brief.

## Future Implementation Preflight

Before coding, state:

- What public interfaces or module boundaries will change.
- What files will be touched.
- What feedback loop will verify the change.
- What decisions remain reserved for Batu.

If the batch does not change public interfaces or module boundaries, say that explicitly.

## Visual Governance

- Final visual direction is approved: Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction, based on the reviewed Phase 4 visual proof and supported by the Phase 4.5 reusable-system scalability proof.
- This approval is visual-direction approval only. It does not approve production assets, production asset direction, production asset pipeline, architecture boundaries, public interfaces, real-place cards, exact real facades, exact addresses, exact station geometry, factual card copy, live data, or deployment.
- Current lead directions, test paths, and next tasks must be read from `docs/CURRENT_EXECUTION_BRIEF.md` and current project-state docs; older visual territories remain historical unless Batu explicitly reactivates them in the current brief.
- Do not introduce new visual metaphors, palettes, marker systems, card styles, UI styles, or production visual language without Batu approval.
- Unapproved visual directions must be labeled as unapproved, exploratory, or historical.
- Lo-fi artifacts are decision aids only; they are not final art.
- Visual artifacts exist to enable Batu's creative decisions, not checklist completion.
- A visual artifact passes only if Batu can make the intended decision from the artifact itself without mentally imagining missing fidelity, storefront detail, UI detail, or emotional tone.
- Visual variants must be materially different in decision-relevant ways, not only color swaps or minor decoration changes.
- Codex must self-audit visual artifacts against `docs/VISUAL_ARTIFACT_STANDARDS.md` before delivery.
- If the self-audit fails, Codex must revise the artifact before reporting the batch complete.

## Visual Artifact Fidelity Gate

Codex must match artifact format to the decision stage.

- SVG, ASCII, and markdown diagrams are acceptable for blockouts, composition planning, and governance review.
- High-fidelity visual-direction decisions require raster PNG/JPG artifacts.
- SVG-only output is invalid for style frames, raster production proofs, final visual-direction candidates, or art-direction approval artifacts unless Batu explicitly requests SVG.
- Constraint checklist compliance is not enough if the artifact format is wrong.
- Before generating any future visual artifact, Codex must state the intended artifact class, the decision it supports, the required output format, why that format fits the decision, and whether SVG is allowed or disallowed for the task.

## Visual Asset Responsibility Rule

Codex must not create primary art-direction evidence or primary browsable world surfaces through SVG, canvas, CSS illustration, emoji, icon assemblage, DOM drawing, or primitive code-drawn scene art.

For any task where visual fidelity materially affects acceptance, Codex must use a supplied raster/reference asset as the primary visual surface. Codex may wire visuals into the prototype, but it may not invent the primary visual world surface.

If no suitable raster/reference asset exists at the path required by the current brief, Codex must stop before implementation and report:

- The missing asset.
- The expected path and filename.
- The required dimensions or aspect ratio, if known.
- How the asset will be integrated once supplied.

Codex may create interaction overlays, hotspot regions, labels, cards, layout chrome, and responsive behavior around a supplied visual asset. Codex may not replace a missing raster/reference asset with SVG, canvas, CSS, DOM-drawn storefronts, or other code-generated scene art.

Review-only raster assets must be labeled non-production and must not be described as production assets, factual Greenpoint representations, exact facades, exact addresses, or approved production asset direction.

## Engineering Governance

- Work in small batches.
- Prefer TDD, or use the fastest available feedback loop when TDD is not practical.
- Document interface and module-boundary changes before implementation.
- Prefer deep modules with simple public interfaces and hidden complexity.
- Avoid shallow wrappers, file sprawl, speculative abstractions, and large code dumps.
- Keep decisions and rationale documented as the project evolves.

## Skills / Plugins Governance

- Project-specific skills or plugins require Batu approval before creation or installation.
- Skills and plugins may support audits, review framing, decision logging, reference discipline, and acceptance criteria.
- Skills and plugins must not make final creative, product, public-interface, architecture, or scope decisions.
- Implementation-oriented skills and plugin stacks are blocked until the relevant implementation gates are cleared.
- Detailed tooling policy lives in `docs/AGENTIC_TOOLING.md`, subordinate to this contract.

## Current Hard Gates

- The static style-frame and final visual-direction gates are cleared.
- Prototype implementation is allowed only inside the scope explicitly opened by `docs/CURRENT_EXECUTION_BRIEF.md`.
- No new framework, renderer, map system, routing system, package tooling, architecture boundary, or public module/interface may be introduced unless the current brief explicitly opens that scope and the proposed boundary/interface is documented and reviewed.
- No production visual assets, production asset pipeline, or production asset direction until Batu explicitly approves them in a later review.
- No production map implementation, real-place system, exact-address system, factual place-copy system, live data, backend service, CMS, persistence, accounts, analytics, CI, deployment, or broad coverage until a later brief explicitly opens that scope.
- No visual production work may treat Community Pixel Storefront, or any older territory, as approved final direction.

## Source Of Truth Order

When project documents conflict, use this order:

1. `AGENTS.md`
2. `docs/CURRENT_EXECUTION_BRIEF.md` for Codex's next executable task only
3. `docs/PLAN.md`
4. `docs/MVP_EXECUTION_LEDGER.md`
5. Topic-specific docs when the task touches their area

Topic-specific docs include `docs/MVP_SCOPE.md`, `docs/DECISION_LOG.md`, `docs/ART_DIRECTION.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/VISUAL_QA_CHECKLIST.md`, `docs/AGENTIC_TOOLING.md`, and current MVP/review artifact package docs.

`docs/archive/governance/TASKS.md` is deprecated and must not be used as an active source of truth unless `docs/CURRENT_EXECUTION_BRIEF.md` or `docs/PLAN.md` explicitly revives it.
