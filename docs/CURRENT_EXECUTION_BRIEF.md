# Current Execution Brief

Status: Approved active MVP task
Date: 2026-05-29
Active task: MVP-04 MVP Interaction Integration

This file is the single next-task pointer for Codex. MVP-04 is approved as the active task inside the implementation boundary documented below.

## Active Task

MVP-04 MVP Interaction Integration.

## Approved Implementation Boundary

Batu/ChatGPT approve MVP-04 for execution inside the following bounded implementation scope:

- use the MVP-03 static data contract proposal as the review/demo-safe implementation basis;
- integrate approved static MVP place data and final MVP interaction behavior into the existing review-only prototype;
- keep the implementation local, static, authored, and review/demo-safe;
- preserve source metadata, verification status, spatial uncertainty, approval state, copy/disclaimer requirements, and manual-verification flags;
- keep authored map anchors separate from factual address/source claims;
- document any public interface or module-boundary detail before implementation and keep it limited to the approved MVP-04 integration boundary;
- treat real, symbolic, placeholder, omitted, and deferred candidates according to the approved static data and bounded MVP scope.

This approval does not approve production data contracts, production assets, production asset direction, a production asset pipeline, final architecture, deployment, live data, or broad implementation.

## Goal

Integrate approved static MVP place data and final MVP interaction behavior into the review-only prototype inside the approved MVP-04 boundary.

The integration should demonstrate approved targets, cards, marker states, selected treatment, pan/zoom, hover/click/tap, basic mobile containment, source metadata, `lastVerified`, and unofficial-map disclaimer behavior.

This active task is not production data work, live data, scraping, backend/CMS/persistence/analytics/deployment work, production asset work, broad map coverage, final architecture approval, production public-interface approval, or public-facing real-world completeness approval.

## Context

MVP-01 reviewed the current repository evidence and concluded that a review-only fictional-target prototype exists.

MVP-02 produced a docs-only place-truth packet identifying candidate real places, source evidence, spatial coherence risks, copy constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.

MVP-03 produced a docs-only static MVP data contract proposal that preserves source metadata, verification status, spatial uncertainty, approval state, copy/disclaimer requirements, and manual-verification flags.

Review packets:

- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`
- `docs/mvp-review/mvp-03-static-mvp-data-contract/README.md`

## Scene Decision

The prototype source frame should be based on the corner of Manhattan Avenue and Greenpoint Avenue.

This corner is intentionally chosen as a busy, mixed-condition intersection for stress-testing the prototype scene. The scene should reflect uneven and varied building forms, mixed storefront conditions, and the presence of the subway.

User-provided Google Street View and street reference images from multiple angles will be used as source references for scene interpretation. If the required user-provided references are not available to Codex during MVP-04 execution, Codex must stop before scene interpretation and report the missing reference assets or links, expected paths or filenames if applicable, required dimensions or aspect ratio if known, and how the references will be used once supplied.

The source frame and scene interpretation remain bounded and fictional-safe where required by `docs/MVP_SCOPE.md`: no exact real facades, exact storefront frontage/order claims, exact Greenpoint Ave G station geometry, active-business claims, or public-facing claims of real-world completeness may be introduced. Exact addresses in visual placement remain blocked unless manually verified and explicitly approved where the current MVP scope allows that exception.

## Allowed Files To Change

Approved for MVP-04 execution only:

- approved `src/` files needed for static data integration;
- approved review screenshot or QA documentation paths;
- `docs/MVP_EXECUTION_LEDGER.md`;
- `docs/CURRENT_EXECUTION_BRIEF.md`;
- `docs/PLAN.md`;
- `docs/MVP_SCOPE.md`, only if the batch clarifies detailed MVP boundaries;
- `docs/TASKS.md`, only if needed to prevent stale contradiction.

Do not modify files outside this boundary during MVP-04 execution.

## Files Off-Limits

Do not modify unless a later active brief explicitly allows it:

- package.json, lockfiles, build/config/CI files;
- generated images;
- `docs/approved-reference-corpus/`;
- original visual artifact proof images;
- `docs/archive/`;
- production assets;
- deployment files.

Do not stage or commit unless explicitly authorized.

## Reserved Decisions

Batu retains approval authority over:

- final creative direction, taste calls, public representation, and visual tradeoffs;
- any exact source-frame interpretation that would imply exact facade, frontage, station, entrance, stair, elevator, address, or adjacency claims;
- final public-facing place copy, disclaimer wording, and any manual override or authored spatial compromise;
- any expansion beyond the compact Manhattan Ave / Greenpoint Ave MVP scene;
- any production asset direction, production data contract, public interface, architecture, deployment, or broad map expansion.

## Public Interfaces And Module Boundaries

Approved only inside the MVP-04 integration boundary.

Codex must state before coding what public interfaces or module boundaries will change. If none will change, say that explicitly. Any new source-file path, export, import relationship, or public interface must remain limited to the static local MVP integration and must not become a production data contract, production architecture boundary, or broad map/data system.

## Verification Requirements

MVP-04 execution must run:

- `git diff --check`
- `git diff --stat`
- `git status --short`

It must also define and run the fastest useful app feedback loop available, plus any required review screenshots if app/source work changes visible behavior.

## Acceptance Criteria

MVP-04 acceptance criteria:

- approved static data is integrated without live data, scraping, backend/CMS, or production data claims;
- no production data contract expansion is introduced;
- no public-facing claims of real-world completeness are introduced;
- no broad map expansion or out-of-scope systems are introduced;
- source URLs, `lastVerified`, truth status, approval status, and disclaimer behavior remain visible where required;
- real-place uncertainty is not hidden by card copy, marker state, or visual placement;
- fictional-safe and bounded treatment rules from `docs/MVP_SCOPE.md` are preserved;
- existing approved art direction and primary raster/reference surface constraints are preserved;
- the source frame is based on the Manhattan Avenue / Greenpoint Avenue corner and stress-tests varied building forms, mixed storefront conditions, and subway presence using user-provided Google Street View or street-reference images from multiple angles;
- pan/zoom, hover/click/tap, selected card, controls, and basic mobile containment remain functional;
- review evidence is captured if required by the approved implementation brief;
- the plan, scope, current brief, and execution ledger are reconciled.

## Final Response Required

After MVP-04 is executed, report:

- files changed;
- verification performed;
- confirmation that no unauthorized app/source/assets or visual artifacts were changed;
- `git diff --stat`;
- `git status --short`;
- no commit unless explicitly authorized;
- no staging unless explicitly authorized.
