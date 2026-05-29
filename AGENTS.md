# Agent Operating Contract

Status: Active  
Date: 2026-05-28
Project: Greenpoint Isometric Explorer

## Project Status

The project has an approved visual direction and remains pre-production.

Prototype implementation may proceed only when `docs/CURRENT_EXECUTION_BRIEF.md` explicitly opens that scope. Do not initialize new frameworks, package tooling, source folders, build configuration, map systems, or production architecture unless the current brief explicitly authorizes them and the required architecture boundaries and public interfaces are documented and reviewed.

## Creative Authority Model

Batu owns:

- Creative direction.
- Product direction.
- Taste calls and visual tradeoff decisions.
- Public module and interface approval.
- Final approval of visual language, architecture boundaries, and scope changes.

ChatGPT owns:

- Critique of Codex output packets.
- Decision-support framing for Batu.
- Writing or updating `docs/CURRENT_EXECUTION_BRIEF.md` after Batu/ChatGPT review.
- Preserving constraints, unresolved questions, and next-step criteria in the brief.

Codex owns:

- Tactical implementation inside approved boundaries.
- Producing the output packet requested by the current execution brief.
- Clear options and tradeoff framing when the current brief asks for them.
- Artifacts, verification, and documentation for Batu/ChatGPT review.
- Small, reviewable batches.
- Test, QA, and documentation updates for the current brief only.

When requirements are ambiguous, clarify before implementation. Codex must mark assumptions and unresolved decisions. Do not make autonomous creative, product, architecture, or public-interface decisions, and do not silently convert suggestions, recommendations, or exploratory artifacts into approved decisions.

Visual direction cannot be approved from prose-only labels, recommendations, or taste descriptions. It requires concrete artifacts and Batu approval.

## Required Workflow

Canonical operating loop:

1. Codex produces an output packet from the current brief.
2. Batu pastes the Codex report and relevant artifacts into ChatGPT.
3. ChatGPT critiques the output, supports Batu's decision, and writes or updates `docs/CURRENT_EXECUTION_BRIEF.md`.
4. Codex reads `docs/CURRENT_EXECUTION_BRIEF.md`.
5. Codex executes only the current brief.
6. Repeat.

`docs/CURRENT_EXECUTION_BRIEF.md` is the canonical source for Codex's next executable task. When it exists, Codex must not infer, continue, or expand work from prior chat context, older task trackers, historical artifact docs, or unstated phase momentum. If another doc appears to suggest a different next action, Codex should follow the current brief for execution and preserve the conflict as an unresolved review item unless the brief explicitly asks Codex to resolve it.

Codex must not autonomously decide the next phase, open a blocked gate, or convert recommendations into approved direction. ChatGPT owns critique and next-brief authoring; Batu owns creative, product, scope, public-interface, architecture, and final approval decisions; Codex owns execution of the current brief only.

Batch execution workflow:

Use this workflow for meaningful work:

1. Clarify the goal and unresolved requirements.
2. Plan the batch with reviewable artifact entry and exit criteria.
3. Wait for approval when the work changes scope, visual direction, product behavior, public interfaces, or module boundaries.
4. Implement one small batch.
5. Run the fastest useful feedback loop available.
6. Verify the batch against its acceptance criteria.
7. Summarize what changed, what did not change, verification results, and remaining review items.

Reviewable artifact entry and exit criteria are batch acceptance gates only. They do not imply game intro, menu, onboarding, or product-polish work.

After the baseline repository commit, future batches must report `git status` and a `git diff --stat` summary.

## Plan Reconciliation

After every successful Codex batch, Codex must reconcile the MVP execution-control documents before final response:

- Update `docs/PLAN.md` so it reflects the current MVP phase, remaining MVP phases, blockers, pending decisions, and next-task pointer. Keep it as a stable roadmap, not a batch-history dump.
- Update `docs/MVP_SCOPE.md` only when the batch changes or clarifies detailed MVP boundaries, non-goals, must-have/should-have/cuttable items, or MVP acceptance boundaries.
- Update `docs/CURRENT_EXECUTION_BRIEF.md` so it no longer points to a completed or stale task. It must contain the next approved/proposed executable task, or explicitly state that the next task is pending Batu/ChatGPT approval.
- Update `docs/MVP_EXECUTION_LEDGER.md` with one concise entry recording the batch outcome, files changed, verification, unresolved decisions, and next pointer.
- Update `docs/TASKS.md` only when leaving it unchanged would create a direct contradiction with the plan, current brief, or ledger.

If the plan, current brief, and ledger cannot be reconciled, Codex must stop and report the conflict instead of silently choosing a next phase, widening scope, or leaving stale task instructions.

Plan reconciliation does not authorize scope expansion. Batu still owns creative, product, public-interface, architecture-boundary, and final scope approvals; ChatGPT still owns critique and next-brief authoring support; Codex still executes only inside the current approved brief.

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
- Current lead directions, test paths, and next tasks must be read from `docs/CURRENT_EXECUTION_BRIEF.md` and current project-state docs; older visual territories remain historical unless Batu/ChatGPT explicitly reactivates them in the current brief.
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
4. `docs/MVP_SCOPE.md`
5. `docs/MVP_EXECUTION_LEDGER.md`
6. `docs/DECISION_LOG.md`
7. `docs/ART_DIRECTION.md`
8. `docs/VISUAL_ARTIFACT_STANDARDS.md`
9. `docs/VISUAL_QA_CHECKLIST.md`
