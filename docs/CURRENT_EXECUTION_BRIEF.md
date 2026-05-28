# Current Execution Brief

Status: Active docs-only visual integration planning brief  
Date: 2026-05-28  
Purpose: Canonical next-task handoff for planning the next visual-integration implementation batch after the narrow placeholder prototype scaffold.

This file is operational only. It is the canonical source for Codex's next executable task. It does not replace `AGENTS.md`, `docs/PLAN.md`, `docs/TASKS.md`, `docs/DECISION_LOG.md`, `docs/ART_DIRECTION.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, `docs/AGENTIC_TOOLING.md`, or `docs/ARCHITECTURE.md`.

## Operating Handoff

Workflow:

1. Codex produces an output packet from this brief.
2. Batu pastes the Codex report and relevant artifacts into ChatGPT.
3. ChatGPT critiques the output, supports Batu's decision, and writes or updates this brief.
4. Codex reads this brief.
5. Codex executes only this brief.
6. Repeat.

Codex must not infer, continue, or expand work from prior chat context when this brief exists. If older docs, historical artifact packets, or previous chat context imply a different next action, Codex should treat this brief as controlling for execution and report the contradiction rather than resolving it by momentum.

Batu owns creative direction, product direction, public representation, public module/interface approval, and gate changes. ChatGPT owns critique, decision-support framing, and next-brief authoring. Codex owns execution of this brief only.

## Current Decision State

The narrow prototype setup batch is approved as a placeholder interaction scaffold.

This approval means:

- The minimal React + Vite + PixiJS/canvas scaffold is acceptable as an interaction proof.
- The placeholder authored scene is acceptable as schematic plumbing only.
- The bounded pan/zoom, hover/click/tap selected-state card, and basic mobile containment are accepted as smoke-test interaction evidence.

This approval does not mean:

- The prototype is approved as visual-direction-in-app evidence.
- The placeholder screenshots validate art direction.
- Production assets are approved.
- A production asset pipeline is approved.
- Real-place cards, factual copy, exact facades, exact addresses, exact station geometry, live data, final public interfaces, CI, deployment, or production scalability/buildability are approved.

The screenshots from the narrow prototype setup batch are smoke-test evidence only. They are not art-direction validation and must not be used to claim the approved Phase 4 Inked Indie / Compact Corner direction is working in-app.

Approved visual direction remains:

- Inked Indie / Compact Corner.
- Fictional-safe storefront identity.
- Integrated paper/card UI direction as a visual direction, with later product and interaction refinement still required.
- High-fidelity raster, storefront-led, Greenpoint-inspired isometric street-slice language shown in the Phase 4 proof.

Phase 4.5 Reusable-System Scalability Proof remains supporting evidence only. It does not approve production scalability, production buildability, production assets, production asset pipeline, real-place representation, or live data.

## Current Task

Create a docs-only Visual Integration Prototype Planning Brief.

Purpose:

Define how the next implementation batch should raise the in-app scene from schematic placeholder fidelity toward the approved Phase 4 Inked Indie / Compact Corner direction, without approving production assets or real-place cards.

Authorized scope:

- Modify documentation only.
- Create or update a planning brief that defines the next visual-integration implementation batch.
- Specify temporary visual-integration asset rules.
- Specify how existing Phase 4 and Phase 4.5 review images may be referenced visually without being imported as production assets.
- Specify where durable screenshots from the future visual-integration batch should be saved.
- Specify how temporary assets must be labeled as non-production.
- Specify the visual fidelity bar future in-app screenshots must meet.
- Specify which interaction behaviors from the placeholder scaffold must be preserved.
- Preserve all blocked production, truth, architecture, and deployment gates.

This brief authorizes planning only. It does not authorize implementation changes, asset creation, image generation, production asset work, real-place cards, factual copy, source verification, live data, CI, deployment, routing, broad map coverage, persistence, or public-interface design.

## Expected Planning Brief Contents

The docs-only planning brief must include:

- Decision recorded: the narrow placeholder prototype scaffold is approved only as an interaction scaffold.
- Visual evidence boundary: the scaffold screenshots are smoke-test evidence only and not art-direction validation.
- Temporary asset allowance: what kinds of temporary visual-integration assets a later implementation batch may use.
- Review-image reference rule: Phase 4 and Phase 4.5 images may be referenced visually for comparison, but may not be imported into the app as production or prototype assets unless a later brief explicitly approves a non-production reference workflow.
- Durable screenshot location: where future visual-integration screenshots should be saved for review.
- Non-production labeling rule: temporary assets and screenshots must be labeled clearly as non-production and review-only.
- Future screenshot fidelity bar: what the next in-app screenshots must show to support Batu/ChatGPT review.
- Interaction preservation rule: which scaffold behaviors must remain working while visual fidelity is raised.
- Blocked scope list: production assets, production asset pipeline, real-place cards, factual copy, final public interfaces, live data, CI, deployment, production scalability/buildability, and other blocked areas remain blocked.
- Acceptance criteria for the future implementation batch, without implementing that batch now.

## Temporary Visual-Integration Asset Rules To Specify

The planning brief should recommend temporary assets that are visibly closer to the approved direction while remaining non-production. Acceptable categories to define for later approval may include:

- Hand-authored rough raster or canvas-drawn storefront pieces used only as temporary integration materials.
- Simplified texture, ink-line, shadow, facade, awning, sign-shape, prop, and paper/card UI treatments that are clearly marked review-only.
- Fictional-safe storefront identities with invented names or non-word marks only if a later implementation brief explicitly allows readable placeholder text.
- No real business names, exact addresses, factual claims, exact real facades, exact station geometry, or active-business copy.

The planning brief must state that temporary visual-integration assets are not production assets, not production asset direction approval, and not proof of production scalability/buildability.

## Screenshot And Artifact Location Rules To Specify

The planning brief must define a durable review location for future screenshots, for example:

- `docs/review-screenshots/visual-integration-prototype/`

The planning brief should require future screenshots to include at minimum:

- Desktop selected-state view.
- Desktop hover or focus affordance view.
- Mobile selected-state containment view.
- One pan/zoom stress view if relevant to the batch.

Do not create this folder or any screenshots in the docs-only planning batch unless the planning brief explicitly chooses to create only a markdown document. This current task should not create visual assets or generated images.

## Future Visual Fidelity Bar To Specify

The planning brief must define the minimum review bar for the next in-app screenshots:

- The scene should read as an in-app step toward Inked Indie / Compact Corner rather than a schematic blockout.
- Storefront massing, inked outlines, color relationships, paper/card integration, prop density, and selected-state treatment should be decision-relevant.
- The scene may remain temporary and fictional-safe, but Batu should be able to judge whether the approved Phase 4 direction can begin to survive inside the actual app surface.
- The output must not claim final art direction validation, production asset approval, or production buildability.

## Interaction Behaviors To Preserve

The planning brief must require the future implementation batch to preserve:

- Existing local app run path.
- Placeholder/static/local data only.
- Desktop hover affordance on one target.
- Desktop click selection.
- Touch/tap selection on a mobile-sized viewport.
- One selected-state card that opens from the target.
- Close or deselect behavior.
- Bounded pan.
- Bounded zoom.
- Basic mobile containment.
- No blocking console/runtime errors.

## Verification Requirements

For this docs-only planning batch:

- Do not modify implementation files.
- Do not create assets.
- Do not generate images.
- Do not stage historical visual-artifact folders unless explicitly required.
- Run `git status --short`.
- Run `git diff --stat`.
- Confirm the diff is documentation-only.

## Acceptance Criteria

The docs-only planning batch is complete only if:

- `docs/CURRENT_EXECUTION_BRIEF.md` records the scaffold decision and its limits.
- The next executable task is a docs-only Visual Integration Prototype Planning Brief.
- The planning requirements cover temporary assets, review-image reference rules, durable screenshot location, non-production labeling, visual fidelity bar, preserved interactions, and blocked scope.
- No implementation files are modified.
- No assets are created.
- No images are generated.
- No historical visual-artifact folders are staged.
- `git status --short` and `git diff --stat` are reported.

## Stop Conditions

Stop and ask Batu before:

- Modifying implementation files.
- Creating visual assets or generated images.
- Importing Phase 4 or Phase 4.5 review images into the app.
- Treating review images as production or prototype assets.
- Creating production assets, production asset direction, or a production asset pipeline.
- Creating real-place cards, factual copy, exact real facades, exact addresses, exact station geometry, or live data.
- Creating public interfaces, formal schemas, broad architecture layers, or speculative abstractions.
- Adding routing, avatars, NPCs, interiors, quests, CMS, persistence, accounts, user submissions, broad map coverage, backend services, CI, deployment, analytics, or live data.
- Claiming production scalability, production buildability, final architecture approval, production asset approval, visual-direction-in-app approval, or public-interface approval.
- Changing creative direction, product scope, public representation policy, or source-of-truth order.

## Report-Back Format

Report back with:

- Files modified.
- Decision recorded.
- Summary of the next visual-integration planning brief.
- What remains blocked.
- `git status --short`.
- `git diff --stat`.
- Whether any stop condition was triggered.
- Exact current next action.
