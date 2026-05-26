# Agent Operating Contract

Status: Active  
Date: 2026-05-26  
Project: Greenpoint Isometric Explorer

## Project Status

The project is in documentation and visual preproduction only.

No app implementation exists yet. Do not initialize React, Vite, PixiJS, Three.js, package tooling, source folders, or build configuration until the gates below are cleared.

## Authority Model

Batu owns:

- Creative direction.
- Product direction.
- Public module and interface approval.
- Final approval of visual language, architecture boundaries, and scope changes.

Agents own:

- Tactical implementation inside approved boundaries.
- Clear options and tradeoff framing.
- Small, reviewable batches.
- Test, QA, and documentation updates for approved work.

When requirements are ambiguous, clarify before implementation. Do not make autonomous creative, product, architecture, or public-interface decisions.

## Required Workflow

Use this workflow for meaningful work:

1. Clarify the goal and unresolved requirements.
2. Plan the batch.
3. Wait for approval when the work changes scope, visual direction, product behavior, public interfaces, or module boundaries.
4. Implement one small batch.
5. Run the fastest useful feedback loop available.
6. Summarize what changed, what did not change, verification results, and remaining review items.

After the baseline repository commit, future batches must report `git status` and a `git diff --stat` summary.

## Future Implementation Preflight

Before coding, state:

- What public interfaces or module boundaries will change.
- What files will be touched.
- What feedback loop will verify the change.
- What decisions remain reserved for Batu.

If the batch does not change public interfaces or module boundaries, say that explicitly.

## Visual Governance

- No final visual direction is approved yet.
- The strongest current hybrid test path is Community Pixel Storefront.
- Visual approvals require concrete artifacts, not prose labels.
- Do not introduce new visual metaphors, palettes, marker systems, card styles, UI styles, or production visual language without Batu approval.
- Unapproved visual directions must be labeled as unapproved, exploratory, or historical.
- Lo-fi artifacts are decision aids only; they are not final art.
- Visual artifacts exist to enable Batu's creative decisions, not checklist completion.
- A visual artifact passes only if Batu can make the intended decision from the artifact itself without mentally imagining missing fidelity, storefront detail, UI detail, or emotional tone.
- Visual variants must be materially different in decision-relevant ways, not only color swaps or minor decoration changes.
- Codex must self-audit visual artifacts against `docs/VISUAL_ARTIFACT_STANDARDS.md` before delivery.
- If the self-audit fails, Codex must revise the artifact before reporting the batch complete.

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

- No React/Vite/Pixi implementation until an approved static style frame exists.
- No map implementation until the visual direction and architecture boundaries are approved.
- No public module/interface implementation until the proposed boundary and interface are documented and reviewed.
- No visual production work may treat Community Pixel Storefront, or any older territory, as approved final direction.

## Source Of Truth Order

When project documents conflict, use this order:

1. `AGENTS.md`
2. `docs/PLAN.md`
3. `docs/DECISION_LOG.md`
4. `docs/MVP_SCOPE.md`
5. `docs/ART_DIRECTION.md`
6. `docs/VISUAL_ARTIFACT_STANDARDS.md`
7. `docs/VISUAL_QA_CHECKLIST.md`
