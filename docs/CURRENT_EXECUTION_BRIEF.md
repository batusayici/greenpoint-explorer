# Current Execution Brief

Status: Active handoff
Date: 2026-05-28
Purpose: Canonical next-task handoff from ChatGPT decision-support to Codex execution.

This file is operational only. It is the canonical source for Codex's next executable task. It does not replace `AGENTS.md`, `docs/PLAN.md`, `docs/TASKS.md`, `docs/DECISION_LOG.md`, `docs/ART_DIRECTION.md`, `docs/VISUAL_ARTIFACT_STANDARDS.md`, or `docs/AGENTIC_TOOLING.md`.

## Operating Handoff

Workflow:

1. Codex produces an output packet from this brief.
2. Batu pastes the Codex report and relevant artifacts into ChatGPT.
3. ChatGPT critiques the output, supports Batu's decision, and writes or updates this brief.
4. Codex reads this brief.
5. Codex executes only this brief.
6. Repeat.

Codex must not infer, continue, or expand work from prior chat context when this brief exists. If older docs, historical artifact packets, or previous chat context imply a different next action, Codex should treat this brief as controlling for execution and report the contradiction rather than resolving it by momentum.

Batu owns creative and product decisions. ChatGPT owns critique, decision-support framing, and next-brief authoring. Codex owns execution of this brief only.

## Current Phase

Phase 3.5 derivative visual proof status: `PROCEED_TO_BUILDABILITY_PLANNING`.

Batu/ChatGPT judged that the Phase 3.5 Inked Indie / Compact Corner derivative proof has enough repeatability evidence to begin buildability and scalability planning.

Why it passed:
- High-fidelity PNGs proved repeatability across one-bay, two-bay, and symbolic transit-edge cases.
- The proof showed that facade shell, storefront bay, sign band, openings, awning/roll-gate treatments, sidewalk texture, marker/card hierarchy, and symbolic transit cues can be tested as a repeatable visual system.
- The pass is limited to planning readiness only.

This does not approve:
- Final visual direction.
- Production visual language.
- Production assets.
- App implementation.
- Architecture setup.
- Package/build tooling.
- CI or deployment.
- Public interfaces.
- Real-place cards.
- Exact station geometry, facade geometry, addresses, or factual storefront claims.

Phase 4 architecture/prototype setup and Phase 5 implementation remain blocked.

## Current Objective

Create a docs-only Phase 3.6 buildability/scalability planning packet for the Inked Indie / Compact Corner direction.

The packet should answer:

> How could this visual language become a scalable map-mode asset system without losing its hand-drawn, Greenpoint-specific character?

## Key Constraints From Phase 3.5

- Cards and markers need UI refinement before any production path can be trusted.
- Real-place translation remains unproven; no factual card, facade, address, station, or adjacency claim is approved.
- Symbolic transit cues remain unresolved and must not be treated as station geometry.
- Visual richness must be controlled to avoid density overload.
- Phase 3.5 generated PNGs are proof artifacts only, not production assets or implementation-ready source material.

## Current Task

Phase 3.6 docs-only buildability/scalability planning.

This remains the next executable Codex task after the workflow-alignment pass. Do not advance to a technical-art proof, implementation, production assets, or Phase 4 unless a later ChatGPT-authored current brief explicitly opens that scope after Batu approval.

Create:
- `docs/visual-artifacts/phase-3-6-buildability-scalability-plan/README.md`
- `docs/visual-artifacts/phase-3-6-buildability-scalability-plan/MODULE_BREAKDOWN.md`
- `docs/visual-artifacts/phase-3-6-buildability-scalability-plan/SCALABILITY_RISKS.md`
- `docs/visual-artifacts/phase-3-6-buildability-scalability-plan/PRODUCTION_PIPELINE_OPTIONS.md`
- `docs/visual-artifacts/phase-3-6-buildability-scalability-plan/NEXT_PROOF_BRIEF.md`
- `docs/visual-artifacts/phase-3-6-buildability-scalability-plan/SELF_AUDIT.md`

The packet must:
- Break the visual language into reusable modules.
- Classify each module as reusable system component, hand-authored art, generated/reference-assisted art, source-verified real-place component, or unsafe to automate where applicable.
- Identify what remains hand-directed by Batu.
- Identify where Codex/AI can safely execute.
- Identify what requires real Greenpoint source verification before production use.
- Identify likely failure modes.
- Compare 2-3 plausible production approaches.
- Recommend one approach for the next proof without implementing it.
- Define the next proof as a bounded technical-art prototype, not an app build.

## Next Expected Batu/ChatGPT Decision

After Phase 3.6, Batu/ChatGPT should decide whether to authorize a bounded technical-art proof:

> Can one small storefront module be decomposed into reusable layers while preserving the Phase 3.5 visual character?

The expected decision should choose whether the recommended production approach is the right next proof path, what constraints apply, and whether any additional source-verification requirements must be satisfied before the proof begins.

Approval of the next proof would still not approve final visual direction, production assets, app implementation, public interfaces, real-place cards, or exact station/facade/address claims.

## Inputs To Read

Source docs:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/TASKS.md`
- `docs/DECISION_LOG.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/VISUAL_QA_CHECKLIST.md`
- `docs/AGENTIC_TOOLING.md`

Phase 3 gate evidence:
- `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/README.md`
- `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/STATIC_STYLE_FRAME_SPEC.md`
- `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/REVIEW_RUBRIC.md`
- `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/SELF_AUDIT.md`
- `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/inked-indie-compact-corner-style-frame-revision-a.png`

Phase 3.5 production-system proof:
- `docs/visual-artifacts/phase-3-5-production-system-proof/README.md`
- `docs/visual-artifacts/phase-3-5-production-system-proof/REVIEW.md`
- `docs/visual-artifacts/phase-3-5-production-system-proof/SELF_AUDIT.md`
- `docs/visual-artifacts/phase-3-5-production-system-proof/generated/example-a-narrow-fictional-service-bay.png`
- `docs/visual-artifacts/phase-3-5-production-system-proof/generated/example-b-two-bay-fictional-retail-pair.png`
- `docs/visual-artifacts/phase-3-5-production-system-proof/generated/example-c-symbolic-transit-edge-micro-corner.png`
- `docs/visual-artifacts/phase-3-5-production-system-proof/generated/phase-3-5-derivative-comparison-board.png`

## Acceptance Criteria

- Phase 3.5 status is recorded as `PROCEED_TO_BUILDABILITY_PLANNING`.
- The reason for passing is recorded as high-fidelity PNG repeatability across one-bay, two-bay, and symbolic transit-edge cases.
- Constraints are recorded for cards/markers, real-place translation, symbolic transit cues, and density control.
- The new Phase 3.6 packet is docs-only.
- The packet does not create app code, source folders, package/config/build tooling, architecture setup, CI, deployment, public interfaces, production assets, generated images, or SVG visual proofs.
- The packet does not approve final visual direction, production assets, real-place cards, exact station geometry, exact facade geometry, or address claims.
- The packet recommends a next proof as a bounded technical-art prototype only.
- The brief remains the canonical next-task source and preserves the Batu/ChatGPT/Codex handoff model.

## Stop Conditions

Stop and ask Batu before:
- Executing a task that is not in this current brief.
- Inferring the next task from prior chat context instead of this brief.
- Treating Phase 3 or Phase 3.5 approval as final visual direction approval.
- Claiming the direction is production-buildable or production-scalable before further proof.
- Opening Phase 4 architecture/prototype setup.
- Starting implementation or package/build tooling.
- Changing product behavior, scope, architecture boundaries, or public interfaces.
- Producing final production assets.
- Producing real-place cards or factual production representations.
- Producing generated images or SVG stand-ins as visual proof for Phase 3.6.
- Making exact real-place, exact station-geometry, facade, address, adjacency, or active-business claims.

## Report-Back Format

Report back with:
- Files created/modified.
- `git status` summary.
- `git diff --stat` summary.
- Whether any stop condition was triggered.
- Recommended next decision after Phase 3.6.
