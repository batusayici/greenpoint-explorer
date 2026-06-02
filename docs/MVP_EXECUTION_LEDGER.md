# MVP Execution Ledger

Status: Active task ledger
Created: 2026-05-29
Last reconciled: 2026-06-02

## Purpose

This ledger records MVP execution batches and keeps `docs/PLAN.md` and `docs/CURRENT_EXECUTION_BRIEF.md` from drifting.

It is not a roadmap and does not authorize work by itself:

- `docs/PLAN.md` defines current phase and remaining MVP phases.
- `docs/CURRENT_EXECUTION_BRIEF.md` defines the next executable or proposed Codex task.
- This ledger records what happened, what changed, what was verified, and what pointer should be used next.

## Mandatory Reconciliation Rule

After every successful Codex batch, Codex must update all three documents before final response:

- `docs/PLAN.md`: update current phase, phase status, blockers, pending decisions, and next-task pointer only. Do not turn it into batch history.
- `docs/CURRENT_EXECUTION_BRIEF.md`: replace the completed task with the next approved/proposed executable task, or explicitly mark that the next task is pending Batu/ChatGPT approval.
- `docs/MVP_EXECUTION_LEDGER.md`: append one new entry with outcome, files changed, verification, unresolved decisions, and next pointer.

If these documents cannot be reconciled, Codex must stop and report the conflict instead of leaving stale instructions.

## Ledger Entry Template

Use this structure for future entries:

```markdown
### YYYY-MM-DD - Short Task Name

Status:
- Complete / Partial / Blocked / Proposed

Scope:
- Brief summary of authorized scope.

Files changed:
- `path`

Verification:
- Command or review performed.

Outcome:
- What changed and what did not change.

Unresolved decisions:
- Decision owner and pending decision.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to ...
```

## Current Control State

- Current phase: Phase 2V Draft Real-Data Scene Pipeline is complete for review. MVP-29E Narrow Corrective Pass remains complete for Batu review.
- Current next pointer: `docs/CURRENT_EXECUTION_BRIEF.md`.
- Current next state: `docs/CURRENT_EXECUTION_BRIEF.md` records Phase 2V complete for review and does not open a further implementation batch. Product-copy readiness, promotion weakening, raster asset edits, broader app refactor, scraping, external app-code API calls, package/tooling changes, package-script/CI additions, source-vendor decisions, full MVP-29G screenshot QA, and MVP-30 QA/demo freeze remain blocked unless a later brief explicitly opens them.
- Stable roadmap: `docs/PLAN.md`.
- Detailed MVP scope authority: `docs/MVP_SCOPE.md`.
- Legacy tracker: `docs/TASKS.md` is orientation only and must defer to the plan, scope, current brief, and this ledger.

## Entries

### 2026-06-02 - Phase 2V Draft Real-Data Scene Pipeline

Status:
- Complete for review.

Scope:
- Add a review/demo-only draft real-data scene lane for the current Manhattan Ave x Greenpoint Ave MVP scene.
- Preserve the strict source-evidence promotion/product-readiness lane unchanged while allowing prototype scene rendering from explicitly statused draft fields.
- Record Batu's decision shift: optimize now for proof-of-concept real-data-to-isometric-scene generation, not public/product readiness.

Files changed:
- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/sceneManifest.js`
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/verify-source-evidence-determinism.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Added a separate prototype-only draft scene fixture covering Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Each draft record includes statused fields for identity, address, category, approximate footprint, storefront bay, sign text, facade style, door/window placement, scene anchor, and station/intersection cues.
- App data flow can consume draft fields for prototype display and QA/debug visibility while strict source-evidence promotion remains unchanged.
- QA inspector now shows draft lane status counts and field-level statuses.
- QA mode can show draft sign/facade/bay labels on top of the raster plate; normal-mode primary world art remains raster-first.
- Strict generated source-evidence, Grillpoint product readiness, promotion gates, and negative contract behavior remained intact.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- The next executable task is pending Batu or a later explicit brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records Phase 2V complete and does not open a further implementation batch.

### 2026-06-02 - Phase 2U Promotion Readiness Contract

Status:
- Complete for review.

Scope:
- Add or strengthen the local machine-readable contract defining what must be true before source-evidence claims can move from review-only or blocked status toward allowed/product-copy-ready status.
- Keep the work contract/validation/readiness-focused and do not change visual rendering, source claims, promotion gate statuses, product-copy readiness, package scripts, CI, ingestion breadth, generated fixture output, source material, or external-source access.

Files changed:
- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`
- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/verify-source-evidence-determinism.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The Grillpoint promotion-readiness report now includes an explicit `promotionReadinessContract` describing product-copy-ready prerequisites, gate-promotion prerequisites, blocked-gate requirements, current blockers, and verifier rejection cases.
- The remaining Grillpoint `storefrontFacade` and `entranceFrontageGeometry` missing-evidence contracts now explicitly record that they are unsatisfied and why promotion remains blocked.
- The QA/source-evidence verifier now validates the contract fields and its negative self-test rejects guardrail removal, unsupported `product_copy_ready` promotion, and unsupported storefront/facade gate promotion.
- No committed generated fixture, raw source claim, coverage report, visual rendering, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- The next executable task is pending Batu or a later explicit brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records Phase 2U complete and does not open a further implementation batch.

### 2026-06-02 - Phase 2T Generated Fixture Determinism Check

Status:
- Complete for review.

Scope:
- Add a local verifier that confirms generated source-evidence fixture output is deterministic and reproducible from the current raw inputs and generator path.
- Keep the work fixture/determinism/readiness-focused and do not change visual rendering, source claims, promotion gates, product-copy readiness, package scripts, CI, raw source claims, ingestion breadth, source material, or external-source access.

Files changed:
- `scripts/verify-source-evidence-determinism.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/verify-source-evidence-determinism.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The new verifier regenerates the current combined source-evidence fixture twice, confirms repeated output is byte-identical, and confirms regenerated output matches the committed generated runtime fixture.
- Verifier failures now retain generated temporary outputs and report line/column mismatch diagnostics for repeated-generation or committed-fixture drift.
- Existing source-evidence / QA inspector verification and negative contract self-test behavior are preserved.
- No committed source-evidence fixture, raw source claim, coverage report, missing-evidence contract, visual rendering, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- The next executable task is pending Batu or a later explicit brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records Phase 2T complete and does not open a further implementation batch.

### 2026-06-02 - Phase 2S Fixture Metadata Readability Check

Status:
- Complete for review.

Scope:
- Improve local readability and auditability of generated source-evidence fixture metadata.
- Keep the work fixture/metadata/readability-focused and do not change visual rendering, source claims, promotion gates, package scripts, CI, production schemas, public APIs, source material, or external-source access.

Files changed:
- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The verifier now prints deterministic metadata lines for generator/input/output paths, active raw inputs, fixture ID/status/review date/record count, readiness counts, each generated evidence record, and Grillpoint missing-evidence contract status.
- Reviewers can now see which fixture/source records were generated, what paths produced/describe them, what evidence strength/readiness they carry, and what remains blocked or not product-copy-ready from one local verifier command.
- Existing negative contract self-test behavior is preserved.
- No committed source-evidence fixture, coverage report, missing-evidence contract, visual rendering, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- The next executable task is pending Batu or a later explicit brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records Phase 2S complete and does not open a further implementation batch.

### 2026-06-02 - Phase 2R Verifier Negative Smoke Check

Status:
- Complete under auto-advance.

Scope:
- Add a local negative self-test path to the QA/source-evidence verifier so it proves removal of a required Grillpoint must-not-claim guardrail is rejected.
- Keep the work review/QA-only and do not change visual rendering, source claims, promotion gates, package scripts, CI, production schemas, public APIs, or external-source access.

Files changed:
- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The verifier now supports an optional in-memory negative self-test that removes the `exact facade` guardrail from Grillpoint's storefront/facade `mustNotClaim` list.
- The negative self-test passes only when that mutated contract is rejected.
- No committed source-evidence fixture, coverage report, missing-evidence contract, visual rendering, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- Auto-advance may continue only while the next batch remains local, narrow, verified, and within the approved Phase 2 evidence/readiness direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 2S Fixture Metadata Readability Check as the next candidate batch.

### 2026-06-02 - Phase 2Q Missing-Evidence Contract Validation

Status:
- Complete under auto-advance.

Scope:
- Strengthen the local QA/source-evidence verifier so it validates the Grillpoint missing-evidence contract shape and guardrails.
- Keep the work review/QA-only and do not change visual rendering, source claims, promotion gates, package scripts, CI, production schemas, public APIs, or external-source access.

Files changed:
- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The verifier now checks Grillpoint report schema, partial-promotion outcome, review-only readiness, and product-copy-not-ready status.
- The verifier confirms missing-evidence contract keys cover blocked promotion gates and each blocked gate contract has required raw input types, minimum raw fields, and must-not-claim guardrails.
- The verifier preserves explicit must-not-claim checks for exact facade, production asset readiness, exact entrance position, exact address placement, and production placement readiness.
- No evidence, visual rendering, card copy readiness, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- Auto-advance may continue only while the next batch remains local, narrow, verified, and within the approved Phase 2 evidence/readiness direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 2R Verifier Negative Smoke Check as the next candidate batch.

### 2026-06-02 - Phase 2P Generated-Output Inspection Ergonomics

Status:
- Complete under auto-advance.

Scope:
- Add a local generated-output verifier that checks app-visible QA inspector readiness/blocker state against the generated source-evidence coverage report and Grillpoint missing-evidence contract.
- Keep the work review/QA-only and do not change visual rendering, source claims, promotion gates, package scripts, CI, production schemas, public APIs, or external-source access.

Files changed:
- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/verify-qa-inspector-source-evidence.mjs`
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- App-visible QA evidence record IDs, evidence strength, claim readiness, promotion gates, and promotion blockers are now locally checked against the generated coverage report.
- The Grillpoint missing-evidence contract is checked against the app-visible evidence record and remains `review_only`, product-copy-not-ready, and blocked for storefront/facade and entrance/frontage/geometry.
- No evidence, visual rendering, card copy readiness, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- Auto-advance may continue only while the next batch remains local, narrow, verified, and within the approved Phase 2 evidence/readiness direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 2Q Missing-Evidence Contract Validation as the next candidate batch.

### 2026-06-02 - Phase 2O QA Inspector Surfacing

Status:
- Complete under auto-advance.

Scope:
- Surface source-evidence quality, claim readiness, promotion gates, promotion blockers, and the existing Grillpoint missing-evidence contract in the app QA inspector.
- Keep the work review/QA-only and do not change visual rendering, source claims, promotion gates, package scripts, CI, production schemas, public APIs, or external-source access.

Files changed:
- `src/App.jsx`
- `src/styles.css`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `npm run build` passed with the existing Vite large-chunk warning.
- Manifest-loader inspector readiness assertion passed with a stubbed raster path.
- Grillpoint missing-evidence contract availability assertion passed.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The selected-card QA inspector now shows evidence strength, claim readiness, promotion gate statuses, non-allowed promotion blockers, and the Grillpoint missing-evidence contract status.
- Grillpoint remains `review_only`; storefront/facade and entrance/frontage/geometry remain blocked.
- No evidence, visual rendering, card copy readiness, package tooling, screenshots, or production-facing claims changed.

Unresolved decisions:
- Batu still owns source authority, production/public claims, exact facade/frontage/address/station geometry, visual acceptance, public-interface approval, and MVP-29E acceptance/revision/rejection.
- Auto-advance may continue only while the next batch remains local, narrow, verified, and within the approved Phase 2 evidence/readiness direction.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Phase 2P Generated-Output Inspection Ergonomics as the next candidate batch.

### 2026-06-02 - Phase 2N Grillpoint Promotion Spike

Status:
- Complete for Batu review.

Scope:
- Accept Phase 2M and open one bounded Phase 2 implementation batch.
- Test a single-place evidence promotion path for Grillpoint only.
- Add only repo-supported source evidence improvements without weakening the Phase 2M promotion gates.
- Preserve the rule that `product_copy_ready` requires all five promotion gates to be `allowed`.
- Keep all other targets unchanged except aggregate counts caused by Grillpoint's category improvement.
- Do not change visual rendering, external sources, package scripts, CI, production schemas, or public APIs.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 1 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5`
- Grillpoint Phase 2N missing-evidence report contract check.
- Grillpoint-only category promotion check confirming only `grillpoint-deli` has category/business-type `allowed` and all five targets still block storefront/facade and entrance/frontage/geometry.
- Expanded drift guard command with all three raw inputs, five expected evidence IDs, the Phase 2H runtime fixture, and Phase 2D reviewed reference.
- False-promotion expected-fail check that changed one record to `product_copy_ready`; it failed as intended because storefront/facade and entrance/frontage/geometry gates were still blocked.
- Existing expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, confirming the missing preserved gap is still reported.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Grillpoint now has an explicit generated `category-context` claim and its category/business-type gate is `allowed`.
- Grillpoint remains `review_only`; it is not product-copy-ready because storefront/facade and entrance/frontage/geometry remain blocked.
- The coverage report now shows 1 category/business-type allowed target, and the Grillpoint-only check confirms the other four targets did not change category gate status.
- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json` names the exact raw input types and minimum fields needed before Grillpoint facade or geometry gates can move.
- Phase 2D reviewed fixture, app visual rendering, package scripts, lockfiles, screenshots, and production-facing interfaces were not changed.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2N Grillpoint category promotion, additive parity behavior, missing-evidence contract, generated runtime fixture, and regenerated coverage report.
- Whether approved facade/reference raw-input provenance should be represented next, whether any field-photo reference may be used for promotion gates, whether promotion blockers should surface more directly in the app QA inspector, and whether source-authority/product-copy thresholds should be formalized remain blocked pending later approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, package scripts/CI, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2N Grillpoint promotion spike.
- If accepted, Batu may open a later bounded Phase 2 task for approved facade/reference raw-input provenance, app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, or a deliberately scoped source-evidence merge/review workflow.

### 2026-06-02 - Phase 2M Evidence Promotion Gates

Status:
- Complete for Batu review.

Scope:
- Accept Phase 2L and open one bounded Phase 2 implementation batch.
- Add conservative claim-level promotion gates so generated evidence records can explain which claim families are allowed, review-only, or blocked.
- Enforce that no record can become `product_copy_ready` unless identity/name, category/business-type, address/location, storefront/facade, and entrance/frontage/geometry gates are all `allowed`.
- Preserve Phase 2D reviewed parity behavior, Phase 2H generated runtime fixture direction, and Phase 2L record-level quality/readiness behavior.
- Do not change visual rendering, external sources, package scripts, CI, production schemas, or public APIs.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/sceneManifest.js`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 0 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5`
- Expanded drift guard command with all three raw inputs, five expected evidence IDs, the Phase 2H runtime fixture, and Phase 2D reviewed reference.
- False-promotion expected-fail check that changed one record to `product_copy_ready`; it failed as intended because category, facade, and geometry gates were not all `allowed`.
- Existing expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, confirming the missing preserved gap is still reported.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Raw and generated evidence records now include required `promotionGates`.
- `src/sceneManifest.js` validates promotion gates before app runtime data loads and rejects invalid `product_copy_ready` records.
- The coverage report now includes the promotion-gate definition, record-level gate counts, target-level gate counts, and per-target blockers.
- Current claim-level state is conservative: identity/name is allowed for 5 targets, category/business-type is review-only for 5 targets, address/location is allowed for 4 targets and review-only for Greenpoint G, storefront/facade is blocked for 5 targets, and entrance/frontage/geometry is blocked for 5 targets.
- Phase 2D reviewed fixture, app visual rendering, package scripts, lockfiles, screenshots, and production-facing interfaces were not changed.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2M promotion gates, product-copy promotion rule, generated runtime fixture, and regenerated coverage report.
- Whether any evidence can become `product_copy_ready`, whether promotion blockers should surface more directly in the app QA inspector, whether package scripts/CI should enforce this, and whether source-authority/product-copy thresholds should be formalized remain blocked pending later approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, package scripts/CI, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2M evidence promotion gates.
- If accepted, Batu may open a later bounded Phase 2 task for app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow.

### 2026-06-02 - Phase 2L Source Evidence Quality Tiering

Status:
- Complete for Batu review.

Scope:
- Accept Phase 2K and open one bounded Phase 2 implementation batch.
- Add conservative quality/readiness tiering so generated evidence coverage cannot be mistaken for product/runtime claim readiness.
- Classify the current five generated evidence records without inventing stronger source support.
- Keep the coverage report at 5/5 generated evidence coverage while separately reporting product/review readiness.
- Preserve Phase 2D reviewed parity behavior and do not change visual rendering, external sources, package scripts, CI, production schemas, or public APIs.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/sceneManifest.js`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0`
- Expanded drift guard command with all three raw inputs, five expected evidence IDs, the Phase 2H runtime fixture, and Phase 2D reviewed reference.
- Negative readiness check asserting 5 product-copy-ready targets; it failed as intended.
- Existing expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, confirming the missing preserved gap is still reported.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Raw and generated evidence records now include required `evidenceStrength` and `claimReadiness` fields.
- `src/sceneManifest.js` validates those fields before app runtime data loads.
- The coverage report now separates generated coverage from evidence strength and claim readiness.
- Current classification is conservative: 2 reviewed records, 3 official-location-only records, 0 product-copy-ready records, 5 review-only records, and 0 blocked records.
- A negative readiness check now catches the specific failure mode where complete generated coverage is treated as product-copy-ready source truth.
- Phase 2D reviewed fixture, app visual rendering, package scripts, lockfiles, screenshots, and production-facing interfaces were not changed.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2L quality tiers, readiness thresholds, generated runtime fixture, and regenerated coverage report.
- Whether any evidence can become `product_copy_ready`, whether quality/readiness should surface in the app QA inspector, whether package scripts/CI should enforce this, and whether source-authority/product-copy thresholds should be formalized remain blocked pending later approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, package scripts/CI, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2L source-evidence quality tiering.
- If accepted, Batu may open a later bounded Phase 2 task for app QA inspector surfacing of quality/readiness fields, fixture metadata refinement, generated-output inspection ergonomics, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow.

### 2026-06-02 - Phase 2K Raw Input Expansion

Status:
- Complete for Batu review.

Scope:
- Accept Phase 2J and open one bounded Phase 2 implementation batch.
- Add a first official-location raw-input slice for the three Phase 2J manifest-source-only targets: `mcdonalds`, `dunkin`, and `citizens-bank`.
- Use only source context already recorded in the scene manifest.
- Restrict new evidence records to review-only identity and address-context claims.
- Regenerate the app-loaded generated source-evidence fixture and regenerate the Phase 2J coverage report.
- Preserve the Phase 2D reviewed parity fixture unchanged and keep the drift guard effective through additive parity.
- Do not add external research, scraping/API calls, package scripts, CI, raster art, new places, production schemas, public APIs, exact geometry claims, or production claims.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0`
- Expanded drift guard command with all three raw inputs, five expected evidence IDs, the Phase 2H runtime fixture, and Phase 2D reviewed reference.
- Temp-output coverage verification with 5 expected targets with generated evidence and 0 expected targets without generated evidence.
- Existing expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, confirming the missing preserved gap is still reported.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The new `official-locations.phase-2k.raw.json` fixture adds review-only raw inputs for McDonald's, Dunkin', and Citizens Bank using already-recorded manifest source context.
- The generated runtime fixture now contains five source-evidence records, covering all current active targets.
- The regenerated coverage report now shows 5 of 5 targets with generated evidence and 0 manifest-source-only targets.
- The Phase 2D reviewed fixture remains unchanged and still guards the two reviewed reference records through additive parity.
- Package scripts, lockfiles, app imports, visual assets, screenshots, and production-facing interfaces were not changed.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2K raw-input expansion, additive parity behavior, expanded generated runtime fixture, and regenerated coverage report.
- Whether to refine fixture metadata, expose expanded evidence more clearly in the app QA inspector, add package scripts/CI, define a source-evidence merge workflow, or pursue external source access remains blocked pending later approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, package scripts/CI, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2K raw-input expansion.
- If accepted, Batu may open a later bounded Phase 2 task for fixture metadata refinement, generated-output inspection ergonomics, app QA inspector surfacing of expanded evidence, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow.

### 2026-06-02 - Phase 2J Source Evidence Coverage Inspector

Status:
- Complete for Batu review.

Scope:
- Move out of the accepted Phase 2I review hold and open one narrow Phase 2 implementation batch.
- Add a local review-only coverage inspector that joins the current scene manifest to the Phase 2H generated runtime source-evidence fixture.
- Generate a deterministic coverage report showing which current targets have linked generated evidence records and which remain manifest-source-only candidates.
- Preserve the Phase 2D reviewed parity fixture unchanged and preserve the Phase 2H generated fixture/runtime direction unchanged.
- Do not add package scripts, CI, scraping/API calls, raster art, new places, production schemas, public APIs, exact geometry claims, or production claims.

Files changed:
- `scripts/inspect-source-evidence-coverage.mjs`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

Verification:
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3`
- `node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output /tmp/source-evidence.coverage.phase-2j.verify.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3`
- Phase 2I drift guard command with the two current raw fixtures, Phase 2H runtime fixture, and Phase 2D reviewed reference.
- Existing expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, confirming the missing preserved gap is still reported.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The new coverage inspector reports 2 of 5 current targets with linked generated source-evidence records: `grillpoint-deli` and `greenpoint-g-subway`.
- The report identifies 3 of 5 current targets as manifest-source-only raw-input expansion candidates: `mcdonalds`, `dunkin`, and `citizens-bank`.
- The report carries forward manifest QA missing-data, ambiguity, blocked-claim, unprovenanced-claim, and hidden-manual-fix status.
- The Phase 2D reviewed fixture, Phase 2H runtime fixture, app runtime import, package scripts, and lockfiles were not changed.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2J coverage inspector and report.
- Which single manifest-source-only target should receive the next local raw-input fixture remains a Batu-owned or later-brief decision unless a future current brief explicitly delegates it.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, package scripts/CI, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2J source-evidence coverage inspector.
- If accepted, Batu may open a later bounded Phase 2 task for one new local raw-input fixture plus parity/coverage update for a single manifest-source-only target.

### 2026-06-01 - Phase 2I Source Evidence Drift Guard

Status:
- Complete for Batu review.

Scope:
- Add the smallest useful local verification guard for the generated Phase 2H runtime source-evidence fixture.
- Confirm the committed runtime fixture can be regenerated exactly from the current raw fixtures using a temp output path.
- Confirm the committed runtime fixture still passes full parity against the Phase 2D reviewed reference.
- Confirm the runtime fixture contains exactly `evidence-grillpoint-identity-address-review` and `evidence-greenpoint-g-station-context-review`.
- Do not replace or rewrite the runtime fixture during verification; do not add packages, lockfiles, package scripts, new places, raster art, scraping/API calls, or production claims.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2i.regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review`
- Existing expected-fail parity check with `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`, confirming the missing preserved gap is still reported.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The ingestion script now supports `--verify-runtime` for local drift guarding.
- The guard writes regenerated output to a temp path, compares it exactly with the committed Phase 2H runtime fixture, validates the exact evidence ID set, and checks runtime parity against the Phase 2D reviewed reference.
- The runtime fixture was not rewritten during guard verification.
- Package scripts and lockfiles remain unchanged.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2I source-evidence drift guard.
- Whether the guard should later become a package script or CI check, whether generated fixture metadata should be refined, whether generated output inspection artifacts should be added, and whether more local raw fixtures should be added remain blocked pending Batu approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2I source evidence drift guard.
- If accepted, Batu may open a later bounded Phase 2 task for generated fixture metadata refinement, package-script/CI discussion, generated-output inspection artifacts, raw-input expansion, fixture regression checks, or a deliberately scoped source-evidence merge/review workflow.

### 2026-06-01 - Phase 2H Generated Source Evidence Runtime Promotion

Status:
- Complete for Batu review.

Scope:
- Generate and commit a source-evidence fixture from the two local raw inputs.
- Switch the app/runtime import from the Phase 2D hand-authored fixture to the generated Phase 2H fixture.
- Keep the Phase 2D hand-authored fixture unchanged as the reviewed parity reference.
- Preserve loader validation and QA inspector behavior.
- Do not add new places, raster art, package changes, lockfile changes, scraping/API calls, production claims, or broader generated source data.

Files changed:
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/mvpPlaceData.js`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- Pre-switch full parity pass against `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`.
- Post-switch full parity pass against `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`.
- Expected failure from the Grillpoint-only command with `--require-all-expected true`, reporting missing runtime evidence ID `evidence-greenpoint-g-station-context-review`.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The app runtime now imports `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`.
- The generated runtime fixture contains exactly the two current reviewed evidence records: `evidence-grillpoint-identity-address-review` and `evidence-greenpoint-g-station-context-review`.
- The Phase 2D hand-authored fixture remains unchanged and committed as the reviewed parity reference.
- Raw fixtures remain local/manual inputs, not scraping output, API ingestion, production source adapters, or live data.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2H generated runtime fixture promotion.
- Whether generated fixture metadata should be refined, whether generated output inspection artifacts should be added, whether more local raw fixtures should be added, and whether parity checks should become a durable regression command remain blocked pending Batu approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2H generated source evidence runtime promotion.
- If accepted, Batu may open a later bounded Phase 2 task for generated fixture metadata refinement, generated-output inspection artifacts, raw-input expansion, fixture regression checks, or a deliberately scoped source-evidence merge/review workflow.

### 2026-06-01 - Phase 2G Complete Source Evidence Generation Parity

Status:
- Complete for Batu review.

Scope:
- Add the smallest useful expansion of the local ingestion/parity spike so generated output can include both current Phase 2D source-evidence records.
- Add one local raw Greenpoint Ave G input fixture.
- Extend full-set parity so it fails clearly when an expected runtime evidence ID is missing.
- Keep the Phase 2D hand-authored fixture valid and unchanged.
- Do not replace runtime imports, scrape, call external APIs, add packages, modify lockfiles, generate raster art, expand places, or make production claims.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2g.generated.json`
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --output /tmp/source-evidence.phase-2g.full-parity-pass.json`
- Expected failure from the Grillpoint-only command with `--require-all-expected true`, reporting missing runtime evidence ID `evidence-greenpoint-g-station-context-review`.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The local ingestion script now accepts repeated `--input` values and combines multiple raw fixtures into one review-only generated source-evidence fixture.
- The new Greenpoint G raw fixture generates `evidence-greenpoint-g-station-context-review` with the same review-critical fields as the Phase 2D runtime fixture.
- Full-set parity passes for the current two-record Phase 2D evidence set and fails clearly when an expected runtime evidence ID is absent from generated output.
- The app runtime still imports the unchanged Phase 2D hand-authored fixture.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2G complete current-evidence raw-input set, combined generation behavior, and full-set parity criteria.
- Whether generated records should later be merged into or replace the runtime review fixture, whether more local raw fixtures should be added, and whether parity checks should become a durable regression command remain blocked pending Batu approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2G complete source evidence generation parity step.
- If accepted, Batu may open a later bounded Phase 2 task for fixture generation/merge review, generated-output inspection artifacts, expanding local raw-input fixtures, refining source-record normalization, or adding focused fixture-level regression checks.

### 2026-06-01 - Phase 2F Source Evidence Generated Fixture Parity Check

Status:
- Complete for Batu review.

Scope:
- Add the smallest useful local parity check between generated source-evidence output and the existing app-loaded Phase 2D source-evidence fixture.
- Compare only matching evidence IDs and focus on schema-critical and review-critical fields.
- Include one expected-pass Grillpoint case and one expected-fail missing-gap case.
- Do not replace the runtime fixture, scrape, call external APIs, add packages, modify lockfiles, generate raster art, expand places, or make production claims.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/grillpoint.phase-2f.generated.json`
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --output /tmp/grillpoint.phase-2f.parity-pass.json`
- Expected failure from `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` reporting the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The Phase 2E ingestion script now has a local `--compare-to` mode that checks generated records against the app-loaded Phase 2D fixture by matching evidence ID.
- The comparison covers evidence ID, target IDs, place IDs, source title/name, source URL, evidence kind/category, usage status, supported claim mappings/copy fields, QA notes, and preserved uncertainty/gap fields.
- The Grillpoint Phase 2E raw fixture now generates the existing Phase 2D Grillpoint evidence and claim IDs, allowing a real parity pass case.
- The expected-fail fixture proves that a missing preserved uncertainty/gap field is reported clearly.
- The app runtime still imports the unchanged Phase 2D hand-authored fixture.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2F parity criteria, expected pass/fail behavior, and raw-input ID alignment.
- Whether generated records should later be merged into a complete review fixture, whether more local raw fixtures should be added, and whether parity checks should become a durable regression command remain blocked pending Batu approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2F source evidence generated fixture parity check.
- If accepted, Batu may open a later bounded Phase 2 task for complete fixture generation/merge review, expanding local raw-input fixtures, refining source-record normalization, or adding focused fixture-level regression checks.

### 2026-06-01 - Phase 2E Source Evidence Ingestion Spike

Status:
- Complete for Batu review.

Scope:
- Add the smallest useful local-only ingestion spike for one evidence fixture.
- Convert one local raw Grillpoint input fixture into the existing `source-evidence-fixture.v0.1` JSON shape.
- Keep the Phase 2D hand-authored fixture valid and unchanged.
- Do not scrape, call external APIs, add packages, modify package/lockfiles, generate raster art, expand places, or replace app-loaded data.

Files changed:
- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/grillpoint.phase-2e.generated.json`
- Deliberate missing-field failure for raw `source.url`.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The repo now has a local converter that reads a raw source-evidence fixture and writes the existing source-evidence JSON shape.
- The converter validates required raw evidence fields and checks converted target/place/source IDs against the current manifest.
- The generated output remains a review-only partial artifact and is not imported by app code.
- The existing Phase 2D hand-authored fixture remains valid and unchanged.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2E raw-input shape, converter behavior, and partial-output boundary.
- Whether converted records should later be merged into a complete review fixture, whether more local raw fixtures should be added, and whether any raw-input shape becomes durable remain blocked pending Batu approval.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, broader ingestion, and production architecture remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2E source evidence ingestion spike.
- If accepted, Batu may open a later bounded Phase 2 task for merging converted local records into a complete review fixture, expanding local raw-input fixtures, refining source-record normalization, or adding focused fixture regression checks.

### 2026-06-01 - Phase 2D Source Evidence Fixture

Status:
- Complete for Batu review.

Scope:
- Add a small review-only source-evidence fixture for the current MVP slice, focused on Grillpoint Deli and Greenpoint Ave G station context.
- Keep reviewed evidence records separate from the scene manifest, validate fixture-to-manifest mappings, and surface mapped evidence through the existing QA inspector.
- Preserve existing cards, selected state, hover/target affordances, pan/zoom, QA outlines, and review UI behavior.
- Do not add a production ingestion pipeline, scraping, external app-code API calls, new places, raster/art generation, package/tooling changes, exact-geometry claims, or broad refactors.

Files changed:
- `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `src/sceneManifest.js`
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/styles.css`
- `docs/review-screenshots/phase-2d-source-evidence-fixture/default-scene.jpg`
- `docs/review-screenshots/phase-2d-source-evidence-fixture/selected-grillpoint-source-evidence.jpg`
- `docs/review-screenshots/phase-2d-source-evidence-fixture/selected-greenpoint-g-source-evidence.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser preview at `http://127.0.0.1:5173/`
- Default scene screenshot
- Selected Grillpoint card with source-evidence fixture record visible
- Selected Greenpoint G card with evidence-backed context plus remaining approximate/blocked field visible
- `git diff --check`
- `git diff --cached --check`
- Active app/data legacy JPEG-extension reference check.
- Intentional-file staging review.

Outcome:
- The app now loads a separate review-only source-evidence fixture alongside the Phase 2B manifest.
- The manifest adapter validates evidence schema, target/place/source mappings, claim mappings, confidence, usage status, captured/reviewed dates, QA notes, and remaining gaps.
- The manifest links Grillpoint Deli and Greenpoint Ave G place records to source-evidence records without moving raw/reviewed evidence into the manifest.
- The selected-card QA inspector now shows source-evidence rows with evidence-backed claim mappings and remaining gaps while preserving Phase 2C manifest QA behavior.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2D fixture shape and QA display.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source authority, ingestion, and broader debug/provenance tooling remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2D source-evidence fixture.
- If accepted, Batu may open a later bounded Phase 2 task for normalized source-record expansion, geometry mapping, QA refinement, screenshot regression coverage, or a deliberately scoped ingestion spike.

### 2026-06-01 - Phase 2C Manifest QA Inspector

Status:
- Complete for Batu review.

Scope:
- Add a lightweight review-only in-app manifest QA/debug inspector for the current MVP slice.
- Surface selected-target provenance, confidence, manual overrides, missing-data fields, ambiguity flags, and QA notes from the already-loaded manifest path.
- Preserve existing cards, selected state, hover/target affordances, pan/zoom, QA outlines, and review UI behavior.
- Do not add ingestion, new places, raster/art generation, package/tooling changes, exact-geometry claims, or broad refactors.

Files changed:
- `src/sceneManifest.js`
- `src/App.jsx`
- `src/styles.css`
- `docs/review-screenshots/phase-2c-manifest-qa-inspector/default-scene.jpg`
- `docs/review-screenshots/phase-2c-manifest-qa-inspector/selected-qa-provenance.jpg`
- `docs/review-screenshots/phase-2c-manifest-qa-inspector/selected-qa-missing-manual.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser preview at `http://127.0.0.1:5173/`
- Default scene screenshot
- Selected Grillpoint card with manifest QA/provenance visible
- Selected Grillpoint card with manual override and missing/ambiguous fields visible
- `git diff --check`
- Active app/data legacy JPEG-extension reference check.
- Intentional-file staging review.

Outcome:
- The manifest adapter now exposes scene-level and per-target QA data without duplicating the manifest parser in the UI.
- The selected-card inspector shows manifest object id, scene/place status, confidence, scene point, corner/context, address geometry gaps, storefront status, reviewed source rows, related manual overrides, missing data, ambiguity, blocked claims, unprovenanced-claim count, hidden-fix count, and manifest verdict.
- The inspector remains review-only and subordinate to the current card UI; it opens with the existing QA mode.
- No manifest source data, app place set, raster asset, package files, lockfiles, or production claims were changed.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2C QA inspector.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source ingestion, and broader debug/provenance tooling remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2C manifest QA inspector.
- If accepted, Batu may open a later bounded Phase 2 task for normalized source-record work, source ingestion spike work, geometry mapping, QA refinement, or screenshot regression coverage.

### 2026-06-01 - Phase 2B Manifest-Driven Scene Foundation

Status:
- Complete for Batu review.

Scope:
- Create the smallest useful Phase 2 vertical slice: one review-only scene manifest for Manhattan Ave / Greenpoint Ave, a validation/adapter path, and minimal app integration that preserves the current MVP-29E interaction behavior.
- Do not generate or revise raster art, create ingestion scripts, introduce package/tooling changes, build a full data pipeline, expand beyond the current MVP slice, or make exact geometry/production claims.

Files changed:
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`
- `src/sceneManifest.js`
- `src/mvpPlaceData.js`
- `docs/review-screenshots/phase-2b-manifest-driven-scene-foundation/desktop-overview.jpg`
- `docs/review-screenshots/phase-2b-manifest-driven-scene-foundation/desktop-selected-grillpoint-card.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser preview at `http://127.0.0.1:5173/`
- Desktop overview screenshot
- Desktop selected Grillpoint card screenshot
- `git diff --check`
- Active app/data legacy JPEG-extension reference check.
- Intentional-file staging review.

Outcome:
- The current MVP scene can now be loaded from a manifest-backed path instead of a single hand-coded scene data module.
- The manifest records source/provenance metadata, initial place/business/address/storefront/building/parcel/transit/corner records, scene anchors/objects/assets, manual overrides, QA/missing-data/ambiguity reports, and review-only app target data.
- The existing React/Pixi renderer, raster asset, cards, selected state, hover/target affordances, pan/zoom, and review UI behavior are preserved.
- Active app/data legacy JPEG-extension reference paths were removed from the manifest-backed path; normalized JPG paths are used where local reference paths are listed.
- Browser smoke screenshots were captured for overview and selected-card states; this does not open full MVP-29G screenshot QA.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2B manifest boundary and adapter approach.
- Exact parcel/building/storefront/frontage/address/station geometry, production data/asset claims, public interface approval, source ingestion, and debug/provenance UI remain blocked pending later approval.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2B manifest-driven scene foundation.
- If accepted, Batu may open a later bounded Phase 2 task for provenance/debug inspection, normalized source-record work, screenshot regression evidence, or ingestion spike work.

### 2026-06-01 - Phase 2A Planning / Architecture Setup

Status:
- Complete for Batu review.

Scope:
- Create a docs-first Phase 2 setup for the Data-Driven Scene MVP.
- Define the data-to-scene architecture proof, canonical manifest planning contract, source hierarchy, provenance/QA loop, and high-level Phase 3 scale-test plan.
- Update only the allowed control docs for reconciliation.

Rationale:
- MVP-29E remains mostly manually authored and complete for Batu review.
- Batu opened Phase 2A so the existing MVP scene can be prepared for representation in a traceable manifest before any ingestion, app refactor, or scale work.
- The Phase 2 direction prioritizes operational discipline: source alignment, manifests, provenance, manual/generated diffs, human review loops, and consistency checks.

Files changed:
- `docs/PHASE_2_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/SCENE_MANIFEST_SCHEMA.md`
- `docs/DATA_SOURCES.md`
- `docs/PROVENANCE_AND_QA.md`
- `docs/PHASE_3_SCALE_TEST_PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Non-goals:
- No `src/` edits.
- No app refactor or new app components.
- No ingestion scripts.
- No generated scene data or mock data.
- No raster assets, generated images, screenshots, package files, or lockfiles.
- No MVP-29E implementation changes.
- No production architecture, public-interface, production data, production asset, live data, scraping, backend, CMS, analytics, deployment, CI, routing, accounts, persistence, or broad map coverage approval.

Verification:
- `git diff --check`
- `git status --short`
- Existing markdown/lint checks were not run because no such dependency or repo script was added or identified for this docs-only batch.

Outcome:
- Phase 2 is documented as the Data-Driven Scene MVP.
- Architecture flow is documented as source adapters -> normalized source records -> canonical scene manifest -> app rendering layer -> debug/provenance/QA layer.
- Manifest v0.1 planning contract records separate WGS84, local projected geometry, and stylized scene coordinate layers.
- Source hierarchy records LiveXYZ as preferred pending access, with Phase 2 starting open-data-first.
- Provenance/QA docs require source-data inspection, geometry overlays, business/address confidence, storefront evidence, generated/manual diffs, missing-data and ambiguity reports, override counts, screenshot regression expectations, and human approval checklists.
- Phase 3 is framed as high-level Neighborhood Scale Validation across representative Greenpoint block types.

Unresolved decisions:
- Batu must accept, revise, or reject the Phase 2A planning packet.
- Batu must explicitly open Phase 2B before a canonical scene manifest v0.1 task starts.
- MVP-29E acceptance, revision, or rejection remains pending.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the Phase 2A planning packet.
- Next recommended task before implementation: Phase 2B - Canonical Scene Manifest v0.1, if Batu accepts Phase 2A and opens that scope.
- Next recommended implementation task later in the sequence: Phase 2D - App Reads Manifest With Unchanged Visual Output, only after Phase 2B and Phase 2C are accepted and a later implementation brief approves source edits and public/runtime boundaries.

### 2026-06-01 - Open Phase 2A Docs-Only Planning Scope

Status:
- Complete.

Scope:
- Batu opened docs-only Phase 2 planning / architecture setup scope.
- Update only the execution-control docs so the next task can create Phase 2 planning docs.
- Do not change app/source files, raster assets, generated images, screenshots, package files, lockfiles, or existing MVP-29E implementation files.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git status --short`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now opens Phase 2A - Docs-Only Data-Driven Scene Architecture Setup.
- `docs/PLAN.md` now records the concise Phase 1 / Phase 2 / Phase 3 roadmap direction and points to the current brief for the next docs-only task.
- No app/source/raster assets were changed by this control-doc authorization update.

Unresolved decisions:
- Batu still owns MVP-29E acceptance, revision, or rejection.
- MVP-29E implementation changes, full MVP-29G screenshot QA, MVP-30 QA/demo freeze, production assets/data/architecture, public-interface approval, live data, scraping, backend, CMS, analytics, deployment, CI, routing, accounts, persistence, and broad map coverage remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to the Phase 2A planning / architecture setup that creates `docs/PHASE_2_PLAN.md`, `docs/ARCHITECTURE.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, `docs/DATA_SOURCES.md`, `docs/PROVENANCE_AND_QA.md`, and `docs/PHASE_3_SCALE_TEST_PLAN.md`.

### 2026-06-01 - MVP-29E Narrow Hover / Crosswalk / Subway Corrective Pass

Status:
- Complete for Batu review.

Scope:
- Fix only hover outline geometry, crosswalk geometry, and Citizens/Dunkin subway placement.
- Preserve the current four-corner scene concept, real business names/signage/logos, business set, UI structure, cards, labels, and overall visual direction.
- Do not redesign, replace the renderer, open new scope, rewrite copy, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-overview.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-selected-card.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-hotspot-qa-outline.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/mobile-selected-card-containment.jpg`
- `src/assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png`
- `src/mvpPlaceData.js`

Verification:
- Inspected the revised raster plate.
- Captured desktop overview, desktop selected-card, desktop QA/hotspot outline, and mobile selected-card containment screenshots.
- Browser console review during screenshot capture: no warnings or errors reported.
- `npm run build`
- `git diff --check`

Outcome:
- Hover/QA outline geometry was tightened around visible storefront/place geometry in the ARC-003 direction.
- Crosswalk striping was corrected toward the bird's-eye reference and prior generated target.
- Grillpoint subway remained in place, while Dunkin and Citizens subway cues moved to the Greenpoint Ave side.
- No business set, UI structure, cards, labels, renderer, or unrelated copy was intentionally changed.

Unresolved decisions:
- Batu must accept, revise, or reject the narrow MVP-29E corrective pass output.
- Full MVP-29G screenshot QA recovery, MVP-30 QA/demo freeze, production visual assets, exact geometry, production data, public-release claims, and production pipeline decisions remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the narrow MVP-29E corrective pass output and holds later work pending explicit approval.

### 2026-06-01 - MVP-29E Focused Geometry / Subway / Hover Revision

Status:
- Complete for Batu review.

Scope:
- Preserve the current MVP-29E direction, business set, product structure, raster-first approach, density, mood, mobile containment, and interaction model.
- Keep real business names/signage/logos moving forward per Batu's revision instruction.
- Revise only the intersection geometry, four crosswalk connections, Greenpoint G subway entrance cue placement, hotspot framing, hover/selected/QA outline styling, review packet, and required screenshot evidence.
- Do not open new MVP scope, replace the renderer, redesign the app, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/README.md`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-overview.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-selected-card.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-hotspot-qa-outline.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/mobile-selected-card-containment.jpg`
- `src/assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`

Verification:
- Inspected the revised raster plate.
- Captured desktop overview, desktop selected-card, desktop QA/hotspot outline, and mobile selected-card containment screenshots.
- Browser console review during screenshot capture: no warnings or errors reported.
- `npm run build`
- `git diff --check`

Outcome:
- The raster scene now reads as a cleaner perpendicular Manhattan Ave x Greenpoint Ave four-corner intersection with four crosswalks connecting corner-to-corner.
- Greenpoint G entrance cues now sit on the Greenpoint Ave side next to Grillpoint, Dunkin', and Citizens at review/demo scale.
- The app retains the existing interaction shell and active targets while updating marker/hotspot framing to the revised raster.
- Hover, selected, and QA states now use place-specific outline paths inspired by ARC-003 instead of generic rectangle-only callouts.
- Revised screenshots and the review packet record the geometry, crosswalk, subway, and hover-state pass.

Unresolved decisions:
- Batu must accept, revise, or reject the focused MVP-29E revised output.
- Batu owns whether any additional raster art pass is needed for exactness, visual taste, subway cue placement, or hotspot alignment.
- Full MVP-29G screenshot QA recovery, MVP-30 QA/demo freeze, production visual assets, exact geometry, production data, public-release claims, and production pipeline decisions remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of the focused MVP-29E revised output and holds later work pending explicit approval.

### 2026-06-01 - MVP-29E Four-Corner Raster Scene Production / App Integration

Status:
- Complete for Batu review.

Scope:
- Commit the accepted four-corner docs/reference reset before implementation.
- Produce one review-only raster-first Manhattan Ave x Greenpoint Ave four-corner scene.
- Integrate the scene into the existing app shell with hotspots/cards for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Preserve truth-safe cards, non-production claims, and blocked exactness limits.
- Capture basic review screenshots without opening the full MVP-29G screenshot QA phase.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/README.md`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-overview.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-selected-card.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/desktop-hotspot-qa-outline.jpg`
- `docs/review-screenshots/mvp-29e-four-corner-raster-scene-production/mobile-selected-card-containment.jpg`
- `src/assets/review-only/mvp-29e-four-corner-manhattan-greenpoint-review.png`
- `src/mvpPlaceData.js`

Verification:
- Pre-implementation reset commit: `f5bdd9d docs: reset MVP to four-corner reference path`.
- `npm run build`
- Local browser review at `http://127.0.0.1:5173/`
- Browser console review during screenshot capture: no warnings or errors reported.
- Basic desktop overview, selected-card, QA/hotspot outline, and mobile selected-card containment screenshots captured.
- `git diff --check`

Outcome:
- The app's active review scene now uses a four-corner raster plate instead of the MVP-22 single-corner plate.
- The active app targets are Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Cards use neutral source-backed review copy with source URLs, last verified dates, and unofficial-map disclaimers.
- SW Dunkin remains governed by Batu's narrow MVP-only exception; no SW Google-derived image was used as generation input.
- Greenpoint G SE cue is represented at review/demo scale, while exact station geometry and NW/SW exact cue placement remain blocked.
- MVP-29E basic screenshots exist, but full MVP-29G screenshot QA and MVP-30 QA/demo freeze remain unopened.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-29E raster/app output.
- Batu owns whether the raster needs another art pass for brand simplification, storefront specificity, sign readability, cue density, or visual taste.
- Batu owns whether the next task is a revision pass, full MVP-29G screenshot QA recovery, or another bounded gate.
- Production visual assets, exact geometry, production data, public-release claims, and production pipeline decisions remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review of MVP-29E and holds later work pending explicit approval.

### 2026-05-31 - MVP-29D Four-Corner Translation / Composition Brief

Status:
- Complete as docs-only translation/composition brief.

Scope:
- Record Batu's acceptance of MVP-29C as `proceed-to-mvp-29d-with-limits`.
- Translate the accepted MVP-29C reference verdict into a four-corner composition, truth-status map, candidate treatment rules, subway cue rules, Dunkin exception handling, and MVP-29E raster-boundary requirements.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, change app card copy, add screenshots, stage, commit, or open MVP-29E.

Files changed:
- `docs/mvp-review/mvp-29d-four-corner-translation-composition-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control docs reviewed.
- MVP-29A, MVP-29B, MVP-29C, MVP scope, art direction, visual artifact standards, place source policy, and place schema reviewed.
- `git diff --check`

Outcome:
- MVP-29D exit verdict is `proceed-to-mvp-29e-with-limits`.
- Four-corner composition is defined as NW Grillpoint Deli, NE McDonald's, SW Dunkin', SE Citizens Bank, plus Greenpoint G station cues.
- Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway remain `ready-with-limits`.
- Greenpoint G exact SE cue placement may be carried into MVP-29E boundary planning; NW/SW cues remain symbolic/context-only or blocked unless later verified.
- Dunkin remains governed by Batu's narrow MVP-only, non-production, stylized Google-derived reference exception.
- MVP-29E requirements now include exact raster output path decision, approved input references, label/sign treatment, file allowlist, card/marker/hotspot expectations, screenshot requirements, and unified-raster versus layered-export decision.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-29D limited proceed verdict before MVP-29E opens.
- MVP-29E must decide whether it remains boundary-only or explicitly opens raster production.
- MVP-29E must decide whether the first four-corner artifact is a single unified raster plate or a layered/sprite composition.
- Exact facade, frontage/order, address placement, station geometry, production use, public-release claims, and exact trademark/trade-dress reproduction remain blocked unless later evidence and Batu approval support them.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review/acceptance or revision of MVP-29D `proceed-to-mvp-29e-with-limits`, then MVP-29E Four-Corner Raster Scene Production / Integration Boundary.

### 2026-05-31 - MVP-29C Four-Corner Visual Reference Review

Status:
- Complete as docs-only visual-reference review.

Scope:
- Inspect the reconciled owned/approved/non-Google/MVP-exception reference inventory.
- Determine visual readiness for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway before MVP-29D.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, change app card copy, add screenshots, stage, commit, or open MVP-29D.

Files changed:
- `docs/mvp-review/mvp-29c-four-corner-visual-reference-completeness-gate/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required control docs reviewed.
- Reconciled JPG/JPEG/HEIF-wrapped inventory inspected with `file`.
- Readable references visually inspected with local image viewer.
- HEIF-wrapped NW references attempted and recorded as unsupported in this environment.
- `git diff --check`

Outcome:
- MVP-29C exit verdict is `proceed-to-mvp-29d-with-limits`.
- Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway are each `ready-with-limits` for MVP-29D planning.
- Dunkin readiness depends on Batu's narrow MVP-only SW Google-derived reference exception and remains non-production, stylized, non-extractive, and non-trade-dress-exact.
- Greenpoint G exact SE cue placement is eligible for MVP-29D planning from supplied/approved photos; NW and SW cues remain symbolic/context-only or blocked unless later verified.
- NW HEIF-wrapped facade/wide/subway files remain unavailable for visual review in this environment and must not support exact NW facade/frontage/cue claims.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-29C limited proceed verdict before MVP-29D opens.
- MVP-29D must define brand/trade-dress handling for McDonald's, Dunkin', Citizens Bank, and Grillpoint Deli.
- Exact facade, frontage/order, address placement, station geometry, production use, public-release claims, and exact trademark/trade-dress reproduction remain blocked unless later evidence and Batu approval support them.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu review/acceptance of MVP-29C `proceed-to-mvp-29d-with-limits`, then MVP-29D Four-Corner Translation / Composition Brief.

### 2026-05-31 - MVP-29C Reference Inventory Reconciliation

Status:
- Complete as docs-only reference-inventory reconciliation; no visual completeness verdict updated.

Scope:
- Reconcile newly supplied JPG exports, deleted/replaced `.jpeg` references, restored Citizens facade reference, and active MVP-29C reference paths before visual-reference review.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, change app card copy, add screenshots, stage, commit, or open MVP-29D.

Files changed:
- `docs/mvp-review/mvp-29c-four-corner-visual-reference-completeness-gate/README.md`
- `docs/mvp-review/mvp-29b-four-corner-evidence-business-validation-packet/README.md`
- `docs/mvp-review/parked-corner-reference-images/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Inventory reviewed for `docs/mvp-reference-images/`.
- Inventory reviewed for `docs/mvp-review/parked-corner-reference-images/`.
- Active MVP-29B/MVP-29C/control-doc reference paths searched.
- Basic image format check run with `file` for all active JPG/JPEG references.
- `git diff --check`
- Stale path search for deleted `.jpeg` filenames.

Outcome:
- `southeast-citizens-facadeA.jpeg` exists and is a readable JPEG, so Batu's restore is reflected in active docs.
- Replacement paths are recorded: `northeast-mcdonalds-facadeA.jpeg` -> `northeast-mcdonalds-facadeA.jpg`, `northeast-mcdonalds-wide.jpeg` -> `northeast-mcdonalds-wide.jpg`, `southeast-citizens-facadeB.jpeg` -> `southeast-citizens-facadeB.jpg`, `southeast-citizens-wide.jpeg` -> `southeast-citizens-wide.jpg`, and `southeast-subwayB.jpeg` -> `southeast-subwayB.jpg`.
- Active docs no longer point to the deleted replacement-source `.jpeg` files.
- NW facade/wide/subway files remain HEIF content with `.jpeg` extensions and should not be relied on for visual review unless the environment can inspect them or they are re-exported.
- SW Dunkin/subway files remain JPEGs governed by Batu's narrow MVP-only Google-derived reference exception.

Unresolved decisions:
- MVP-29C visual-reference review still needs to evaluate the reconciled JPG/JPEG inventory.
- Brand/trade-dress handling remains pending for McDonald's, Dunkin', and Citizens Bank.
- Exact facade, frontage/order, address placement, station geometry, production use, public-release claims, and exact trademark/trade-dress reproduction remain blocked unless later evidence and Batu approval support them.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` continues to point to MVP-29C JPG/JPEG visual-reference review before MVP-29D.

### 2026-05-31 - MVP-29C Batu Decision Revision

Status:
- Complete as docs-only revision; no implementation opened.

Scope:
- Record Batu's NW naming decision, SW Dunkin MVP-only visual-reference exception, Greenpoint G cue-placement rule, and JPG reference-review requirement.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, change app card copy, add screenshots, stage, commit, or open MVP-29D.

Files changed:
- `docs/mvp-review/mvp-29c-four-corner-visual-reference-completeness-gate/README.md`
- `docs/mvp-review/mvp-29b-four-corner-evidence-business-validation-packet/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/DECISION_LOG.md`
- `docs/DATA_FEASIBILITY.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/VISUAL_QA_CHECKLIST.md`
- `docs/TASKS.md`

Verification:
- Required control docs and active MVP-29B/MVP-29C packets reviewed.
- Local JPG reference exports checked for presence and file type.
- `git diff --check`
- Active-doc stale phrase search for the requested strings.

Outcome:
- MVP-29C revised verdict is `revise-after-jpg-reference-supply`.
- Active NW candidate remains `Grillpoint Deli`; `Greenpoint Deli` remains archival/prior conflicting language only.
- Dunkin is no longer blocked solely because SW references appear Google-derived; Batu's narrow MVP-only exception permits only human-reviewed, stylized, truth-safe, non-production review/demo-scale approximation.
- Greenpoint G exact cue placement may be used only where supplied/approved reference photos clearly verify the cue's corner/orientation relationship; otherwise the cue remains symbolic, context-only, omitted, or blocked.
- `docs/TASKS.md` is restored as a retired stub to avoid dangling active references.

Unresolved decisions:
- Batu must accept or revise the MVP-29C JPG reference review before MVP-29D opens.
- Brand/trade-dress handling remains pending for McDonald's, Dunkin', and Citizens Bank.
- Exact facade, frontage/order, address placement, station geometry, production use, public-release claims, and exact trademark/trade-dress reproduction remain blocked unless later evidence and Batu approval support them.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to JPG reference supply/review for MVP-29C before MVP-29D.

### 2026-05-31 - MVP-29C Four-Corner Visual Reference Completeness Gate

Status:
- Complete as docs-only visual-reference completeness gate.

Scope:
- Accept MVP-29B with Batu's naming revision: the active NW candidate label is `Grillpoint Deli`.
- Treat `Greenpoint Deli` as historical / archival / prior conflicting candidate language only.
- Review owned/approved/non-Google visual-reference completeness for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, change app card copy, add screenshots, stage, commit, or open implementation.

Files changed:
- `docs/mvp-review/mvp-29c-four-corner-visual-reference-completeness-gate/README.md`
- `docs/mvp-review/mvp-29b-four-corner-evidence-business-validation-packet/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/DECISION_LOG.md`
- `docs/DATA_FEASIBILITY.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, MVP-29B packet, and reference inventory reviewed.
- `docs/mvp-reference-images/` inventory checked with `find`, `file`, and image inspection where supported.
- HEIC files stored with `.jpeg` extensions checked with `sips` for dimensions and format.
- `git diff --check`

Outcome:
- Active NW label is now `Grillpoint Deli`.
- `Greenpoint Deli` remains archival/prior conflicting language only and is not the active public label.
- Historical MVP-29C initial verdict was `request-field-photos`, superseded by the MVP-29C Batu Decision Revision entry above.
- Grillpoint Deli is ready for true-to-life review/demo visual treatment planning, with exact claims and production use still blocked.
- McDonald's and Citizens Bank needed re-export/inspection and brand/trade-dress decisions before stronger treatment; later JPG exports are now recorded for review.
- Superseded by Batu decision: Dunkin is now `MVP-exception-allowed pending stylized/non-production handling` for the narrow SW reference gap.
- Superseded by Batu decision: Greenpoint G exact cue placement is allowed where supplied/approved photos clearly verify the cue; otherwise symbolic/context-only or blocked.

Unresolved decisions:
- Batu must accept or revise the MVP-29C reference-recovery verdict.
- Superseded by Batu decision: SW Dunkin has a narrow MVP-only exception for stylized/non-production handling; later field photos remain preferred but are not the sole path.
- Superseded by Batu decision: JPG re-exports are now the expected review inputs where supplied; undecodable HEICs should not be relied on.
- Brand/trade-dress treatment decisions remain pending for McDonald's, Dunkin', and Citizens Bank.
- Exact frontage, facade, address placement, station geometry, direct `in front of Grillpoint` subway claims, and public-release claims remain blocked unless evidence supports them and Batu approves.

Next pointer:
- Historical pointer only; superseded by `docs/CURRENT_EXECUTION_BRIEF.md` pointing to JPG reference supply/review for MVP-29C before MVP-29D.

### 2026-05-31 - Post-MVP-29B Docs Review / Stale Cleanup

Status:
- Complete as docs-only review and stale-doc cleanup.

Scope:
- Confirm MVP-29B is internally consistent with MVP-29A.
- Search active-orientation docs for stale one-corner MVP-22 QA/demo-freeze language.
- Add small supersession notes only where stale docs could create active confusion.
- Do not open MVP-29C, render, regenerate raster art, touch `src/`, add targets, add screenshots, stage, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/DECISION_LOG.md`
- `docs/ART_DIRECTION.md`
- `docs/VISUAL_QA_CHECKLIST.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/PLACE_SCHEMA.md`
- `docs/DATA_FEASIBILITY.md`

Verification:
- Reviewed MVP-29A and MVP-29B packets, current control docs, MVP scope, decision log, art direction, visual artifact standards, visual QA checklist, place source policy, place schema, and data feasibility docs.
- Root `README.md` was requested for review but does not exist in this repository.
- `git diff --check`

Outcome:
- MVP-29B is ready for Batu review.
- Superseded by MVP-29C: MVP-29C was the next recommended task at the time of this cleanup pass and has since been completed.
- Active-orientation docs now point readers back to MVP-29A/MVP-29B, `docs/PLAN.md`, `docs/MVP_SCOPE.md`, and `docs/CURRENT_EXECUTION_BRIEF.md` for the current four-corner target.
- Historical review artifacts were left intact unless they were active-orientation docs likely to confuse current execution.

Unresolved decisions:
- Superseded by MVP-29C: Batu accepted MVP-29B and resolved the NW active label as `Grillpoint Deli`.
- Exact frontage, facade, address placement, station geometry, branded true-to-life treatment, and public-release claims remain blocked unless evidence supports them and Batu approves.

Next pointer:
- Historical pointer only; superseded by `docs/CURRENT_EXECUTION_BRIEF.md` pointing to JPG reference supply/review for MVP-29C before MVP-29D.

### 2026-05-31 - MVP-29B Four-Corner Evidence + Business Validation Packet

Status:
- Complete as docs-only evidence validation packet.

Scope:
- Validate the active four-corner candidate set before visual-reference completeness, composition, raster work, app integration, screenshot QA, or demo freeze.
- Record source status, corner placement risks, treatment recommendations, visual-reference readiness, subway cue limits, and blocked exact claims.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, change card copy, add screenshots, stage, commit, or open implementation.

Files changed:
- `docs/mvp-review/mvp-29b-four-corner-evidence-business-validation-packet/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, prior four-corner evidence packets, source policy, place schema, and field-photo inventory reviewed.
- Official/current source URLs checked for McDonald's, Dunkin', Citizens Bank, Restaurantji Grillpoint Deli, MTA Greenpoint Av station context, and NYC source hierarchy.
- `git diff --check`

Outcome:
- MVP-29B verdict is `proceed-to-mvp-29c`.
- The active candidate set can be mapped to NW/NE/SW/SE plus Greenpoint G station context at review-planning level.
- Superseded by MVP-29C naming resolution: the active NW label is `Grillpoint Deli`; Greenpoint Deli is archival/prior conflicting language only.
- McDonald's, Dunkin', and Citizens have official business/address source support, but real cards, true-to-life branded treatment, exact frontage/facade/address placement, and exact building-unit relationships remain blocked pending later review.
- Greenpoint G subway context is source-supported. Superseded by the MVP-29C Batu decision revision: exact cue placement may be used only where supplied/approved photos clearly verify the cue; otherwise symbolic/context-only or blocked.
- `docs/MVP_SCOPE.md` was not updated because no direct contradiction or missing scope boundary was found.

Unresolved decisions:
- Superseded by MVP-29C: Batu accepted MVP-29B, opened MVP-29C, and resolved the NW active label as `Grillpoint Deli`.
- Exact frontage, facade, address placement, station geometry, branded true-to-life treatment, and public-release claims remain blocked unless evidence supports them and Batu approves.

Next pointer:
- Historical pointer only; superseded by `docs/CURRENT_EXECUTION_BRIEF.md` pointing to JPG reference supply/review for MVP-29C before MVP-29D.

### 2026-05-31 - MVP-29A Four-Corner MVP Scope Reset

Status:
- Complete as docs-only scope reset.

Scope:
- Record Batu's decision to reject the immediate one-corner MVP-29 QA/demo freeze path.
- Reframe MVP completion around the full Manhattan Ave x Greenpoint Ave four-corner authored diorama.
- Record MVP-22/MVP-22C as accepted one-corner proof evidence, not sufficient for revised MVP completion.
- Do not render, regenerate raster art, change app source, touch `src/`, add targets, perform QA/demo freeze, add screenshots, stage, or commit.

Files changed:
- `docs/mvp-review/mvp-29a-four-corner-mvp-scope-reset/README.md`
- `docs/MVP_SCOPE.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, and MVP scope docs read.
- `git diff --check`

Outcome:
- MVP completion target is now the full Manhattan Ave x Greenpoint Ave four-corner scene with NW/NE/SW/SE structure.
- Real labels, real cards, storefront/sign/facade treatment, and Greenpoint G subway cues require source-backed validation and owned/approved/non-Google references.
- Uncertainty must be handled with `verified`, `approximate`, `symbolic`, `context-only`, `omitted`, or `blocked` statuses.
- MVP-29 QA/demo freeze is no longer the next step; MVP-30 QA/demo freeze is future-only after the full four-corner scene exists.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-29A reset packet.
- Batu must decide whether to open MVP-29B Four-Corner Evidence + Business Validation Packet.
- Exact frontage, facade, address placement, station geometry, and public-release claims remain blocked unless evidence supports them and Batu approves.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-29B Four-Corner Evidence + Business Validation Packet as the next recommended task.

### 2026-05-31 - Prepare MVP-29 QA / Demo Freeze Brief

Status:
- Rejected as immediate next path by later Batu scope decision; historical proposed brief only.

Scope:
- Prepare the next current brief for MVP-29 QA / Demo Freeze after committing the accepted MVP-22/MVP-22C work.
- Limit the proposed scope to QA checklist, demo-readiness notes, accepted limitations, screenshot review references, truth-safety review, and interaction smoke-check review.
- Do not implement MVP-29, change source/app behavior, create assets, add dependencies, open production scope, or make production/public-release claims.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed MVP-22 closeout commit exists: `20ef75f Accept MVP-22 Grillpoint real-corner slice`.
- Prepared proposed brief scope and stop conditions only.

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now proposes `MVP-29 QA / Demo Freeze`.
- MVP-29 remained unimplemented and was later rejected as the immediate next path by Batu's MVP-29A four-corner scope reset decision.

Unresolved decisions:
- Superseded by MVP-29A: the next recommended task is MVP-29B Four-Corner Evidence + Business Validation Packet.
- Any direct `in front of Grillpoint` subway-entrance claim remains blocked until stronger field/photo evidence supports it and Batu approves the claim.

Next pointer:
- Historical pointer only; superseded by `docs/CURRENT_EXECUTION_BRIEF.md` pointing to MVP-29B after MVP-29A.

### 2026-05-31 - MVP-22C Acceptance And Sequence Closeout

Status:
- Complete.

Scope:
- Accept MVP-22C as complete and close the MVP-22 Grillpoint / Greenpoint Ave G real-corner vertical slice sequence.
- Preserve the MVP-22 raster asset, app asset copy, factual Grillpoint card data, Stage B / MVP-22C docs, screenshot QA folder, six PNG screenshots, and reconciled control docs.
- Do not open MVP-29 implementation, new visual production, new corners, raster regeneration, code-native storefront/sign/facade art, live data, scraping, backend, CMS, analytics, deployment, CI, broad map systems, or production/public-release claims.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`

Verification:
- Required governance, current brief, roadmap, and ledger read.
- Changed and untracked files reviewed as MVP-22/MVP-22C related only.
- Six screenshot PNG paths confirmed present.
- `file` confirmed the six screenshots are PNG image data.
- `git diff --check`
- `npm run build`
- `git status --short`

Outcome:
- MVP-22C is accepted as complete.
- The MVP-22 real-corner vertical slice sequence is closed.
- MVP-29 QA / Demo Freeze is identified as the next proposed brief only, not implemented.

Unresolved decisions:
- Batu must still open MVP-29 implementation from a later current brief.
- Any direct `in front of Grillpoint` subway-entrance claim remains blocked until stronger field/photo evidence supports it and Batu approves the claim.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` records MVP-22 closed and points to preparing MVP-29 QA / Demo Freeze as the next proposed brief.

### 2026-05-31 - MVP-22C Screenshot QA Blocker Recovery

Status:
- Complete for Batu review.

Scope:
- Investigate and resolve the MVP-22C screenshot QA blocker without changing product scope.
- Use existing browser binaries/dependencies and existing app controls first.
- Do not change raster image, app UI, card copy, hotspot data, styling, product dependencies, framework/tooling, MVP-29 gate state, staging, or commit.

Files changed:
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/desktop-overview.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/desktop-selected-grillpoint-card.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/desktop-hover-focus.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/qa-outline-hotspot.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/mobile-selected-card-containment.png`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/pan-zoom-stress.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, visual QA checklist, screenshot README, package tooling, and app controls read.
- Existing package/tooling inspected: Vite/React/Pixi only; local Playwright and Puppeteer are not installed.
- Existing browser binaries inspected: Google Chrome and Firefox are installed.
- Direct Chrome headless remained blocked before producing PNG output, including with `--no-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`, `--single-process`, and explicit temp `--user-data-dir` checks.
- Direct Firefox headless was also unavailable for screenshot output in the sandboxed command path.
- Vite served unchanged app on `http://127.0.0.1:5174/`; `curl -I` returned HTTP 200.
- Codex in-app browser successfully loaded the local app and captured six review states.
- Screenshot files were converted to true PNG format and checked with `file`.
- Visual spot-check performed for overview, selected card, hover/focus, QA outline, mobile containment, and pan/zoom stress screenshots.
- `npm run build`

Outcome:
- Required MVP-22C screenshots now exist in `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/`.
- The reliable capture path is the Codex in-app browser connected to the local Vite server, with viewport overrides for desktop and mobile review states.
- No app source, raster image, card copy, hotspot data, styling, dependencies, framework/tooling, production scope, or MVP-29 gate state was changed.

Unresolved decisions:
- Batu must accept, revise, or reject MVP-22C polish and recovered screenshot evidence.
- Any direct `in front of Grillpoint` subway-entrance claim remains blocked until stronger field/photo evidence supports it and Batu approves the claim.
- MVP-29 QA/demo freeze remains unopened.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-22C review with recovered screenshot evidence and still blocks MVP-29 QA/demo freeze until Batu opens a later task.

### 2026-05-31 - MVP-22C Acceptance Polish / Screenshot QA Recovery

Status:
- Complete for Batu review; screenshot QA blocked.

Scope:
- Accept MVP-22 Stage B as visually successful with minor revision required before QA/demo freeze.
- Preserve the final MVP-22 raster-first real-corner slice and non-readable deli sign cue.
- Do not regenerate the raster or use earlier malformed readable-sign candidates.
- Keep the app card label as `Grillpoint Deli`.
- Tighten visible factual card copy for product readability while preserving truth constraints.
- Keep Greenpoint Av G as nearby/adjacent transit context only.
- Verify there is only one active factual Grillpoint card for this slice.
- Check/tighten hotspot/card alignment.
- Attempt screenshot QA, record blocker if screenshot capture remains unavailable.
- Avoid MVP-29 QA/demo freeze, NE/SE/SW corners, code-native storefront/sign/facade art, production assets/claims, live data, scraping, backend, CMS, analytics, deployment, CI, broad map systems, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`
- `docs/review-screenshots/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `src/mvpPlaceData.js`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, current MVP-22 packet, and app data read.
- Confirmed the raster asset is preserved and no regeneration was performed.
- `src/mvpPlaceData.js` contains one active target, `grillpoint-deli`.
- `npm run build`
- `git diff --check`
- `git status --short`
- `git diff --stat`
- Screenshot QA attempted but blocked: local network permission is required for Vite; Vite ran on `http://127.0.0.1:5174/` because `5173` was already in use; `curl -I` returned HTTP 200; in-app browser route was unavailable previously; local Playwright is not installed; Google Chrome headless screenshot launch exited with `chrome_exit:134` before producing a screenshot.

Outcome:
- MVP-22C records Stage B as visually successful with minor revision applied before QA/demo freeze.
- Visible factual card copy is shorter and more product-readable while retaining source-backed address, disclaimer, and truth constraints.
- The active hotspot/QA outline is narrowed to the storefront/corner slice.
- Greenpoint Av G remains nearby/adjacent transit context only.
- The final non-readable-sign raster is preserved; malformed readable-sign candidates remain unused.
- Screenshot QA remains blocked and is not claimed as passed.

Unresolved decisions:
- Batu must accept, revise, or reject MVP-22C polish.
- Batu must decide whether screenshot QA must be recovered in another environment before MVP-29 QA/demo freeze.
- Any direct `in front of Grillpoint` subway-entrance claim remains blocked until stronger field/photo evidence supports it and Batu approves the claim.
- MVP-29 QA/demo freeze remains unopened.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-22C review and blocks MVP-29 QA/demo freeze until Batu opens a later task.

### 2026-05-31 - MVP-22 Stage B Raster-First Vertical Slice

Status:
- Complete for Batu review; screenshot QA blocked.

Scope:
- Open and execute MVP-22 Stage B after Batu approved the prepared brief.
- Generate one review-only raster-first NW Grillpoint / Greenpoint Ave G vertical-slice plate.
- Integrate the raster plate into the existing interaction shell.
- Use one factual `Grillpoint Deli` card with source URL, address, category, last verified date, and unofficial-map disclaimer.
- Treat Greenpoint Ave G only as nearby/adjacent transit context.
- Avoid app expansion to NE/SE/SW corners, code-native storefront/sign/facade/building/road/prop/texture art as primary world surface, exact facade/sign/address/station claims, live data, scraping, backend, CMS, analytics, deployment, CI, broad map systems, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png`
- `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png`
- `src/mvpPlaceData.js`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, visual artifact standards, and Stage B brief docs read.
- Approved NW reference and II-A / II-B paths checked; parked NE/SE/SW references excluded.
- Generated raster visually inspected.
- First readable-sign raster candidates rejected because they introduced text/address issues.
- Final raster uses a non-readable deli sign cue and keeps the factual `Grillpoint Deli` label in the app card.
- `npm run build`
- `curl -I http://127.0.0.1:5173/`
- Browser screenshot QA attempted but blocked: in-app browser route unavailable and local Playwright not installed.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created and integrated `mvp-22-grillpoint-real-corner-slice.png`.
- App primary world surface remains raster-first.
- App active target set is one `Grillpoint Deli` card for the NW Stage B slice.
- Factual card copy uses `Grillpoint Deli`, `Deli / food retail`, `903 Manhattan Ave, Brooklyn, NY 11222`, Restaurantji source URL, MTA supporting URLs, `lastVerified: 2026-05-30`, and the unofficial-map disclaimer.
- Greenpoint Ave G remains nearby/adjacent transit context only.
- No exact sign, exact facade, exact address placement, exact storefront frontage/order, exact station geometry, production asset, public-release, live data, scraping, backend, CMS, analytics, deployment, CI, or broad map system was introduced.

Unresolved decisions:
- Batu must accept, revise, or reject the Stage B visual/card integration.
- Batu must decide whether screenshot QA must be rerun in a working browser environment before any QA/demo freeze.
- Batu must decide whether the non-readable raster sign cue is acceptable or whether another raster pass is needed.
- Any direct `in front of Grillpoint` subway-entrance claim remains blocked until stronger field/photo evidence supports it and Batu approves the claim.
- Generic QA/demo freeze remains unopened.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-22 Stage B review and blocks QA/demo freeze until Batu opens a later task.

### 2026-05-30 - MVP-22 Stage A Approval / Stage B Brief

Status:
- Complete.

Scope:
- Close MVP-22 Stage A as approved-with-constraint.
- Record that Grillpoint identity/address/sign are supportable for Stage B planning.
- Record that Greenpoint Ave G may be used as nearby/adjacent transit context, but not as a direct `in front of Grillpoint` claim unless stronger field/photo evidence supports it.
- Prepare a Stage B brief naming exact raster path or generation/input path, public sign-label treatment, factual card copy/source URLs, allowed files, and screenshot QA requirements.
- Resolve repo state by committing MVP-21 and MVP-22 together with limited/fallback/gate status.
- Avoid app integration, raster generation, renderer work, visual production expansion, NE/SE/SW corners, code-native storefront/sign/facade art, live data, scraping, backend, CMS, analytics, broad map systems, and production claims.

Files changed:
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/STAGE_B_IMPLEMENTATION_BRIEF.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, place schema, and place source policy docs read.
- Confirmed the NW reference paths and II-A / II-B raster references exist.
- Parked NE/SE/SW references were listed but excluded from the Stage B input allowlist.
- `npm run build`
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- MVP-22 Stage A is recorded as `approved-with-constraint-for-stage-b-planning`.
- Stage B is allowed to open as a raster-first real-corner vertical slice, but implementation has not started.
- The Stage B brief names `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/generated/mvp-22-grillpoint-real-corner-slice.png` as the raster output/generation path and `src/assets/review-only/mvp-22-grillpoint-real-corner-slice.png` as the future app asset path only after approval.
- The public/card label is `Grillpoint Deli`; review-only stylized `GRILLPOINT DELI` sign text is constrained to no tracing, no exact facade reproduction, no texture extraction, and no production asset claim.
- The factual card copy, source URLs, allowed file list, screenshot QA requirements, and stop conditions are documented.
- No app integration was performed.

Unresolved decisions:
- Batu must explicitly open Stage B implementation from the prepared brief before Codex edits app/source integration.
- Batu must approve or revise the raster output, public sign-label treatment, factual card copy, and screenshot evidence after Stage B.
- Any direct `in front of Grillpoint` subway-entrance claim remains blocked until stronger field/photo evidence supports it and Batu approves the claim.
- Generic QA/demo freeze remains unopened.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-22 Stage A closed as approved-with-constraint and Stage B brief prepared; Stage B is next eligible but not started.

### 2026-05-30 - MVP-22 Grillpoint / Greenpoint Ave G Stage A

Status:
- Complete for Batu review.

Scope:
- Replace the generic QA/demo freeze next pointer with `MVP-22 Grillpoint / Greenpoint Ave G Real Corner Vertical Slice`.
- Produce a docs-first source/reference and composition packet for one NW corner only.
- Verify Grillpoint identity/address/sign and Greenpoint Ave G station-context relationship at planning confidence.
- Propose the most truthful diorama composition and stop before app implementation.
- Avoid NE/SE/SW corner additions, app/source integration, raster generation, renderer work, code-native storefront/sign/facade art, live data, scraping, backend, CMS, analytics, broad map systems, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-22-grillpoint-greenpoint-g-real-corner-vertical-slice/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, place schema, place source policy, MVP-19, MVP-20, and MVP-21 docs read.
- Reviewed public/source evidence for Grillpoint identity/address/category and Greenpoint Av G context.
- Reviewed the decodable NW Grillpoint field photo and prior MVP-19/20 reference inventory; parked NE/SE/SW references were not used.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created the MVP-22 Stage A source/reference and composition packet.
- Recorded Grillpoint identity/address/sign as supportable at planning confidence, pending Batu acceptance before any real-label art/card implementation.
- Recorded Greenpoint Ave G as adjacent/nearby transit context; exact `in front of Grillpoint` relationship remains unapproved unless Batu explicitly accepts the field-photo interpretation.
- Proposed `adjacent-corner-transit-context` as the truthful diorama composition.
- Proposed factual card copy with source URL, address, category, last verified date, and unofficial-map disclaimer for Stage B review.
- App integration remains blocked until Stage A is accepted or revised and a later brief opens Stage B.

Unresolved decisions:
- Batu must accept, revise, or reject the Stage A evidence/composition packet.
- Batu must decide whether exact `GRILLPOINT DELI` sign text may appear in review-only raster art.
- Batu must decide whether the proposed station-context relationship is truthful enough.
- Batu must open any Stage B raster-first art-directed scene/app integration and name the raster asset path, factual card copy, file allowlist, and screenshot requirements.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-22 Stage A review and blocks implementation until Batu opens Stage B.

### 2026-05-30 - MVP-21 Limited Fallback Acceptance

Status:
- Complete.

Scope:
- Record Batu acceptance of MVP-21 only as `approved-reviewable-limited-fallback`.
- Save the in-app browser screenshot into the MVP-21 review packet if possible.
- Update execution-control docs so the next eligible task is limited MVP QA/demo freeze, not another renderer pass.
- Avoid app/source changes, visual production expansion, code-native storefront/sign/facade art, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-21-one-corner-raster-integration/README.md`
- `docs/mvp-review/mvp-21-one-corner-raster-integration/mvp-21-accepted-limited-fallback.jpg`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, and ledger docs read.
- In-app browser at `http://127.0.0.1:5173/` used to capture the selected `Corner Deli` state.
- Screenshot saved to `docs/mvp-review/mvp-21-one-corner-raster-integration/mvp-21-accepted-limited-fallback.jpg`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- MVP-21 is now recorded as accepted only as `approved-reviewable-limited-fallback`.
- The accepted proof is narrow: one generalized/evidence-aware place card can attach to the raster world plate.
- The docs explicitly state MVP-21 does not prove final visual fidelity, real-place accuracy, address placement, facade translation, exact sign treatment, or production readiness.
- The next eligible task is limited MVP QA/demo freeze.
- Another renderer pass, visual production expansion, code-native storefront/sign/facade art, production assets, and broader real-corner integration remain blocked.

Unresolved decisions:
- Batu must open the limited MVP QA/demo freeze before Codex executes it.
- Batu still owns any future implementation-specific NW raster plate, exact sign/facade treatment, production assets, production place cards, public factual copy, and final MVP/demo approval.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to limited MVP QA/demo freeze as the next eligible task, not yet opened for execution.

### 2026-05-30 - MVP-21 One-Corner Raster Integration Implementation

Status:
- Complete for Batu review as a limited fallback.

Scope:
- Implement Batu-approved MVP-21 within the narrow source/data/card boundary for the NW target only.
- Preserve the existing app shell, pan/zoom, hover/click/tap selection, target rail, cards, markers, tethers, outlines, and review-only disclaimer/status behavior.
- Keep the primary world surface raster-first and avoid new renderer/framework/tooling, generated art, code-native primary scene art, parked NE/SE/SW reference use, production assets, exact sign/facade/address/station-geometry claims, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `docs/mvp-review/mvp-21-one-corner-raster-integration/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, scope, place-policy, MVP-19, MVP-20, MVP-21, and parked-reference docs read.
- Confirmed approved II-A / II-B raster reference files exist.
- `npm run build`
- Local browser screenshot captured in-session; repo PNG save was blocked by browser-runtime `EPERM`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- NW target visible title is generalized to `Corner Deli`.
- `GRILLPOINT DELI` is recorded as internal/source evidence only.
- MVP-21 source/card evidence rows preserve blocked exact sign, facade, address placement, active-status copy, storefront frontage/order, and station-geometry claims.
- Existing MVP-17 raster plate remains the app primary world surface because no separate implementation-specific NW raster plate, layered export, or raster sprite composition was supplied.
- Non-NW targets remain unchanged.
- Parked NE / SE / SW references remain unused.

Unresolved decisions:
- Batu must accept, revise, or reject the limited fallback.
- Batu must decide whether to supply or approve an implementation-specific NW raster plate, layered export, or raster sprite composition.
- Batu must decide whether exact `GRILLPOINT DELI` sign text may ever appear in later review-only art.
- Batu must decide whether to open MVP QA/demo freeze after reviewing MVP-21.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to pending MVP-21 review by Batu. MVP QA/demo freeze is not opened.

### 2026-05-30 - MVP-21 Raster Brief Finalization

Status:
- Complete.

Scope:
- Update the docs-only MVP-21 brief and control docs with Batu's exact approved raster references and label/sign treatment decisions.
- Keep MVP-21 NW-corner-only and still unopened for implementation.
- Avoid app/source implementation, renderer work, screenshots, visual generation, new raster creation, source data changes, package/tooling changes, parked-corner reference use, exact sign/facade/address/station-geometry claims, production asset claims, staging outside the approved docs, and production place-card claims.

Files changed:
- `docs/mvp-review/mvp-21-one-corner-raster-integration-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, and ledger docs read.
- Confirmed approved raster reference files exist in `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/`.
- `git status --short`
- `git diff --cached --check`

Outcome:
- Recorded `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-A-ui-world-integration.png` as the primary raster/world integration reference.
- Recorded `docs/archive/visual-artifacts/batch-13-survivor-direction-development/generated/II-B-place-card-marker-hover-state.png` as the UI/card/marker/hover-state reference.
- Recorded both references as review-only / non-production and not approval for exact facade, sign, address, station-geometry, production assets, or code-native primary world art.
- Recorded `GRILLPOINT DELI` as internal/source evidence label only.
- Recorded generalized/fictional-safe product-facing deli treatment, such as non-readable deli sign treatment or `Corner Deli`, as preferred.
- Recorded exact `GRILLPOINT DELI` sign reproduction as blocked unless explicitly approved later.
- Parked NE / SE / SW references remain blocked for MVP-21.
- No implementation, source, app, asset, visual generation, renderer, screenshot, scraping, live data, package/tooling, or production-claim work was performed.

Unresolved decisions:
- Batu must explicitly open MVP-21 implementation before source edits.
- Batu must confirm the implementation raster material path if it differs from the approved raster references.
- Batu must confirm or narrow the future source-file allowlist and screenshot/self-audit requirements.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to pending MVP-21 implementation approval with exact approved raster references recorded. MVP-21 implementation remains unopened.

### 2026-05-30 - MVP-21 One-Corner Raster Integration Brief

Status:
- Complete for Batu review.

Scope:
- Produce a docs-only implementation brief for a future one-corner raster integration / visual pass.
- Keep the brief tightly scoped to the NW 903 Manhattan Ave / Greenpoint Deli / `GRILLPOINT DELI` selected corner.
- Preserve truth-safety, raster-first visual governance, existing interaction-shell constraints, parked-corner exclusions, and MVP-20's one-corner boundary.
- Avoid app/source implementation, renderer work, raster integration, visual generation, visual polish, screenshots, new assets, scraping, live data, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-21-one-corner-raster-integration-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, place schema, place source policy, MVP-19 packet, MVP-20 packet, and parked-corner reference packet read.
- Confirmed the brief defines purpose, entry criteria, selected target, allowed/blocked references, primary raster material requirement, allowed future implementation scope, proposed file allowlist, blocked work, acceptance criteria, stop conditions, verdict, and next pointer.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created the MVP-21 implementation brief packet.
- Verdict is `ready-to-open-mvp-21-implementation-pending-batu-approval`.
- MVP-21 implementation remains unopened until Batu approves the brief, label/sign treatment, primary raster material, and allowed file list.
- The brief requires Codex to stop before source edits if approved primary raster material is missing.
- Parked NE / SE / SW references remain blocked for MVP-21.
- No implementation, source, app, asset, visual generation, renderer, screenshot, scraping, live data, staging, commit, or production-claim work was performed.

Unresolved decisions:
- Batu must approve, revise, or reject the MVP-21 implementation brief.
- Batu must decide the visible/product label treatment for Greenpoint Deli / `GRILLPOINT DELI`.
- Batu must decide whether exact `GRILLPOINT DELI` sign text may appear in review-only raster art.
- Batu must supply or approve the primary raster material and confirm or narrow the future file allowlist.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to pending MVP-21 implementation approval. MVP-21 is recommended but still unopened; no implementation task is approved.

### 2026-05-30 - MVP-20 Real-Corner Translation Boundary

Status:
- Complete for Batu review.

Scope:
- Produce a docs-only translation-boundary packet for the selected NW 903 Manhattan Ave corner.
- Reconcile MVP-18/MVP-19 evidence, supplied northwest field references, Place/Building/Storefront/MapAnchor relationships, allowed/blocked references, truth constraints, treatment recommendations, and a proposed downstream MVP-21 boundary.
- Avoid app/source implementation, renderer work, raster integration, visual generation, visual polish, screenshots, new assets, scraping, live data, Google/Street View/3D Tiles-derived imagery, LiveXYZ facade/art use, production claims, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-20-real-corner-translation-boundary/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, place schema, place source policy, MVP-18 packet, MVP-19 packet, and active source data read.
- Confirmed the packet includes selected corner confirmation, evidence-to-scene matrix, active scene/place set, approved/blocked references, Place/Building/Storefront/MapAnchor notes, truth constraints, treatment recommendations, downstream MVP-21 boundary proposal, and verdict.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created the MVP-20 review packet.
- MVP-20 verdict is `proceed-to-mvp-21`.
- The selected corner is NW 903 Manhattan Ave, with a required naming reconciliation because current app/data says Greenpoint Deli while supplied field-reference signage reads `GRILLPOINT DELI`.
- MVP-20 recommends a future one-corner raster integration / visual pass only after Batu accepts this boundary and opens a separate MVP-21 implementation brief.
- No implementation, source, app, asset generation, visual generation, renderer, screenshot, scraping, live data, staging, commit, or production-claim work was performed.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-20 `proceed-to-mvp-21` recommendation.
- Batu must decide whether to keep Greenpoint Deli, correct to `GRILLPOINT DELI`, or fictionalize/generalize the selected target.
- Batu must decide whether exact `GRILLPOINT DELI` sign text may appear in review-only raster art.
- Batu must decide what primary raster material and source-file boundary, if any, are approved for MVP-21.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to pending MVP-20 review. MVP-21 is recommended pending Batu approval; no implementation task is approved.

### 2026-05-30 - MVP-19 One-Corner Field Photo Supply Gate

Status:
- Complete for Batu review.

Scope:
- Produce a docs-only reference + repeatability/scalability packet for NW Greenpoint Deli / 903 Manhattan Ave.
- Use existing repo evidence and supplied corner reference photos in `docs/mvp-reference-images/`.
- Avoid app/source implementation, renderer work, raster integration, visual generation, visual polish, screenshots, new generated assets, scraping, live data, Google/Street View/3D Tiles-derived imagery, LiveXYZ facade/art use, production claims, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-19-one-corner-field-photo-supply-gate/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, ledger, MVP scope, place schema, place source policy, and MVP-18 packet read.
- Confirmed the packet includes selected target summary, reference inventory, status/frontage/facade findings, required evidence scalability rows, one-corner / 20 / 100 / 500 storefront scale readout, and MVP-20 readiness recommendation.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created the MVP-19 review packet.
- MVP-19 recommendation is `proceed-to-mvp-20`, pending Batu approval to open the docs-only translation boundary.
- Batu pointed Codex to newly supplied corner reference photos in `docs/mvp-reference-images/`; northwest deli files have Apple iPhone 15 Pro metadata dated 2026-05-30.
- The supplied photos support storefront frontage, entrance zone, facade cues, signage/awning treatment, adjacent storefront context, and subway entrance context for review-only translation planning.
- The supplied photos reveal a naming conflict: visible signage reads `GRILLPOINT DELI`, while prior docs/app data refer to Greenpoint Deli.
- The scalability readout finds official lot/address/building evidence is repeatable and one-corner field photos can unlock recognizable translation planning, while broader storefront recognition still requires field photography, provenance tracking, manual review, and Batu judgment.
- MVP-20 is recommended but not opened.
- No implementation, source, app, asset, visual generation, renderer, screenshot, scraping, live data, staging, commit, or production-claim work was performed.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-19 `proceed-to-mvp-20` recommendation.
- Batu must explicitly approve or reject the supplied northwest corner files as owned/non-Google review references.
- Batu must decide whether to keep Greenpoint Deli as the target label, correct it to `GRILLPOINT DELI`, choose a fallback target, or pause the real-corner path.
- Batu must approve any later MVP-20 Real-Corner Translation Boundary before implementation can be considered.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to pending MVP-19 review. MVP-20 is recommended pending Batu approval; no implementation task is approved.

### 2026-05-30 - MVP-19 Scalability Assessment Brief Patch

Status:
- Complete.

Scope:
- Patch the proposed MVP-19 brief so the next task requires a repeatability/scalability assessment, not only one-off photo/reference supply.
- Reconcile the roadmap and ledger pointer without opening MVP-19, MVP-20, implementation, visuals, assets, screenshots, scraping, live data, staging, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, current brief, roadmap, and ledger docs read.
- Checked that the brief includes the required scalability categories, evidence rows, 20/100/500 storefront scale readout, and stop conditions.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` keeps `MVP-19 One-Corner Field Photo Supply Gate` as the proposed next task pending Batu approval.
- MVP-19 is now explicitly a reference + scalability gate and cannot complete from photos alone.
- MVP-20 remains blocked until MVP-19 provides both a selected-corner reference packet and the repeatability/scalability readout, then Batu approves the translation boundary.
- No implementation, source, app, asset, visual generation, renderer, screenshot, scraping, live data, staging, commit, or production-claim work was performed.

Unresolved decisions:
- Batu must decide whether to open MVP-19.
- Batu must accept, revise, or reject the MVP-19 reference packet and scalability readout before MVP-20 can open.
- Batu must approve any later real-corner translation boundary before implementation can be considered.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to `MVP-19 One-Corner Field Photo Supply Gate` as a proposed docs/evidence reference + scalability gate pending Batu approval. No implementation task is approved.

### 2026-05-30 - MVP-19/20/21 Real-Corner Translation Sequencing Reconciliation

Status:
- Complete.

Scope:
- Reconcile the roadmap and governance docs so MVP-19 remains a supply/reference gate only.
- Insert MVP-20 Real-Corner Translation Boundary and MVP-21 One-Corner Raster Integration / Visual Pass before MVP QA/demo freeze.
- Keep the batch docs-only with no app/source implementation, visual assets, generated art, renderer work, screenshots, packages, config, backend, scraping, live data, staging, or commit.

Files changed:
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/MVP_SCOPE.md`
- `docs/ARCHITECTURE.md`
- `docs/PLACE_SCHEMA.md`
- `docs/PLACE_SOURCE_POLICY.md`

Verification:
- Required governance, roadmap, scope, architecture, place schema, and source policy docs read.
- Grep checks for `MVP QA And Demo Freeze`, `MVP-20`, `MVP-21`, and `MVP-19 One-Corner Field Photo Supply Gate`.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/PLAN.md` no longer jumps directly from MVP-19 to MVP QA/demo freeze.
- MVP-20 is documented as the docs-only real-corner translation boundary.
- MVP-21 is documented as the first possible one-corner raster integration / visual pass, still blocked until MVP-20 acceptance and a future current brief.
- `docs/CURRENT_EXECUTION_BRIEF.md` keeps MVP-19 as the proposed next task pending Batu approval and adds a later sequencing note for MVP-20 and MVP-21.
- Supporting governance docs now clarify that field photos/manual observations, MapAnchor/place/storefront linkage, translation boundaries, and raster integration remain distinct gates and do not approve implementation or production claims by themselves.
- No implementation, source, app, asset, package/config, renderer, screenshot, staging, or commit work was performed.

Unresolved decisions:
- Batu must decide whether to open MVP-19.
- Batu must accept, revise, or reject MVP-20 after MVP-19 if the real-corner path continues.
- Batu must decide which real-corner treatment is allowed for each active place: real card, context-only, fictionalized, omitted, blocked, or unresolved.
- Batu must decide whether to open MVP-21 after MVP-20 and which approved/supplied raster material, if any, is allowed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to `MVP-19 One-Corner Field Photo Supply Gate` as a proposed docs/evidence supply gate pending Batu approval. MVP-20 and MVP-21 are later gates before QA/demo freeze. No implementation task is approved.

### 2026-05-30 - MVP-18 Real Corner Evidence Recovery

Status:
- Complete for Batu review.

Scope:
- Produce a docs-only evidence recovery packet for the active Greenpoint Ave x Manhattan Ave scene/place set.
- Confirm current brief authorization and active source/data place set.
- Use allowed public/open/manual sources and existing repo evidence only.
- Avoid app/source implementation, visuals, generated art, screenshots, new assets, scraping, live data pipelines, Google/Street View/3D Tiles-derived stored imagery or extraction, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, scope, source-policy, schema, data-feasibility, visual-artifact, approved-reference-corpus, prior review, and active app/data files read.
- Manual public-source checks for candidate addresses, BBL/BIN/tax-lot evidence, and business identity/status.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Created `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md`.
- MVP-18 verdict is `revise`.
- The packet recommends a compact four-corner evidence boundary around Greenpoint Ave x Manhattan Ave:
  - NW Greenpoint Deli / 903 Manhattan Ave.
  - NE McDonald's / 904 Manhattan Ave within 900/902/904 Manhattan Ave lot/building.
  - SW Dunkin' / 893 Manhattan Ave within 893/895/897 Manhattan Ave lot/building.
  - SE Citizens Bank / 896 Manhattan Ave within 894/896/898 Manhattan Ave lot/building.
  - Greenpoint G subway as symbolic transit context only.
- The packet recommends northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target because it best supports local specificity and first-click value, but it is not ready for immediate real-facade art translation.
- Real-corner art translation remains blocked by missing approved owned/non-Google facade references, unresolved storefront/frontage evidence, and pending Batu approval.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-19 One-Corner Field Photo Supply Gate` as the proposed next task only, pending Batu approval.
- No implementation, visuals, screenshots, new assets, scraping, live data pipeline, staging, or commit were performed.

Unresolved decisions:
- Batu must accept, revise, or reject the MVP-18 `revise` verdict.
- Batu must approve, revise, or reject the four-corner evidence boundary.
- Batu must approve northwest Greenpoint Deli / 903 Manhattan Ave as the first field-photo target, choose a fallback, or defer real-corner representation.
- Batu must decide whether to open `MVP-19 One-Corner Field Photo Supply Gate`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-19 One-Corner Field Photo Supply Gate` as a proposed docs/evidence supply gate pending Batu approval. No implementation task is approved.

### 2026-05-30 - MVP-18 Real Corner Evidence Recovery Brief

Status:
- Complete.

Scope:
- Create the next current brief for evidence recovery only.
- Confirm the task is consistent with MVP scope and roadmap because `docs/MVP_SCOPE.md` allows one compact Manhattan Ave / Greenpoint Ave authored diorama, review-only source-of-truth validation packets, storefront evidence cards, and proceed/revise/cut recommendations before real-place usage.
- Keep the batch docs-only with no app/source implementation, visuals, screenshots, new assets, scraping, live data pipeline, renderer work, package/config/tooling changes, staging, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required governance, scope, source-policy, schema, data-feasibility, visual-artifact, plan, current-brief, and ledger docs read.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-18 Real Corner Evidence Recovery` as the approved next Codex task.
- The future MVP-18 task must produce `docs/mvp-review/mvp-18-real-corner-evidence-recovery/README.md` as a Level 0 text review packet.
- MVP-18 must answer the exact boundary, buildings/lots/storefronts, candidate addresses, business status, BBL/BIN/tax-lot evidence, storefront/frontage evidence, allowed/blocked facade references, recognizable representation plan, fictionalize/generalize/omit/defer plan, first-corner spike recommendation, and proceed/revise/cut verdict.
- MVP-17 remains accepted only as a raster-first interaction prototype baseline and is not accepted as a truthful or recognizable Greenpoint Ave x Manhattan Ave scene.
- No implementation, visuals, screenshots, assets, scraping, live data pipeline, renderer work, staging, or commit were performed.

Unresolved decisions:
- Batu must approve, revise, or reject the future MVP-18 evidence recovery verdict.
- Batu retains final approval over the exact intersection boundary, real-place representation, first-corner visual spike, and any later visual or implementation work.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-18 Real Corner Evidence Recovery` as the approved next docs-only task. No implementation task is approved.

### 2026-05-30 - MVP-17 Reconciliation Commit Scope Authorization

Status:
- Complete.

Scope:
- Authorize a future one-time `MVP-17 Hold-State Reconciliation Commit`.
- Keep the batch docs-only.
- Do not stage, commit, edit source, create screenshots, create or modify assets, run QA recovery, or open a new MVP batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now authorizes one future commit-only reconciliation task.
- The future task may stage and commit only already-existing accepted MVP workstream paths needed to preserve the MVP-17 accepted raster interaction prototype and its historical review/evidence trail.
- The ambiguous paths from the hold-state audit are explicitly resolved:
  - `docs/VISUAL_INTEGRATION_PROTOTYPE_PLANNING_BRIEF.md` is included as historical planning context only if it already exists in the dirty tree at commit time.
  - `docs/mvp-reference-images/` is included as historical/source-reference evidence only, not as approved production assets or facade/art sources.
  - Older `docs/mvp-review/mvp-08-place-evidence-packet-current-scene/` through `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/` folders are included as the documented review trail.
  - Older `docs/review-screenshots/mvp-04-interaction-integration/`, `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/`, and `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/` folders are included as relevant review evidence.
  - Approved-reference-corpus docs are included as part of the visual-governance/reconciliation trail.
  - `docs/VISUAL_ARTIFACT_STANDARDS.md` is included as part of the raster-first/visual-evidence governance trail.
- No implementation, screenshots, asset work, package/config/tooling/CI/deployment changes, staging, or commit were performed in this authorization batch.

Unresolved decisions:
- Batu must explicitly ask Codex to run the future reconciliation commit task before staging or committing.
- After that future commit, the repo remains in the MVP-17 hold state until Batu opens a later implementation, QA, documentation, production asset, public-interface, architecture, deployment, or next-phase brief.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to `MVP-17 Hold-State Reconciliation Commit` as the only approved next task. No implementation task or new MVP batch is approved.

### 2026-05-30 - MVP-17 Acceptance Recording

Status:
- Complete.

Scope:
- Record Batu acceptance of MVP-17 Product-Facing Raster Interaction Polish.
- Record that Batu accepted the missing mobile selected-state containment screenshot as an evidence gap.
- Reconcile the MVP-17 review packet and control docs.
- Avoid app/source changes, new implementation, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- MVP-17 is recorded as accepted by Batu as the product-facing raster interaction polish baseline.
- The supplied four desktop screenshots remain the recorded visual evidence.
- The missing mobile selected-state containment screenshot is recorded as an accepted evidence gap.
- No app/source files, package/config/tooling files, primary world art, generated assets, staging, or commits were changed by this batch.

Unresolved decisions:
- Batu must open any next MVP QA, demo-freeze, optional ambient, production asset direction, real-place treatment, public-interface, architecture, or next-phase work in a later current brief.
- Production asset direction, production assets, exact real facades, exact addresses, exact station geometry, live data, CI/deployment, and broad map/data work remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now states that no next implementation task is approved and the next task is pending Batu approval or a later brief update.

### 2026-05-30 - MVP-17 Supplied Screenshot Evidence Recording

Status:
- Partial / mobile containment screenshot missing.

Scope:
- Verify supplied MVP-17 screenshot files under `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/`.
- Update the MVP-17 review packet and control docs with screenshot paths and QA notes.
- Avoid app/source changes, new implementation, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed four supplied PNG files exist:
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-default-overview.png`
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-hover-focus-state.png`
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-store-card.png`
  - `docs/review-screenshots/mvp-17-product-facing-raster-interaction-polish/desktop-zoom-view.png`
- Confirmed the required mobile selected-state containment screenshot is not present in the supplied folder.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Recorded desktop overview, hover/focus, selected-card, and pan/zoom screenshot evidence in the MVP-17 review packet.
- Kept MVP-17 out of final ready-for-visual-verdict status because mobile selected-state containment evidence is missing.
- No app/source files, package/config/tooling files, primary world art, generated assets, staging, or commits were changed by this batch.

Unresolved decisions:
- Batu must decide whether to supply the missing mobile containment screenshot or accept visual review from the partial evidence set.
- Batu must decide whether MVP-17 is accepted, revised, or rejected after reviewing the available evidence.
- Any further implementation, optional ambient, production asset direction, real-place treatment, public-interface, architecture, or next-phase decision remains blocked until Batu opens it.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-17 mobile selected-state screenshot evidence completion, or Batu review only if Batu explicitly accepts the partial evidence gap. No new implementation phase is approved.

### 2026-05-29 - MVP-17 Product-Facing Raster Interaction Polish

Status:
- Partial / screenshot QA blocked.

Scope:
- Polish the accepted MVP-16B raster-first prototype so it feels less like an internal review board and more like a product-facing exploratory prototype.
- Preserve the approved raster as the primary world surface.
- Preserve existing pan/zoom, hover/select, target rail, cards, transparent hit regions, marker/tether/outline overlay model, and mobile containment.
- Avoid code-drawn scene art, new generated assets, package/config/tooling changes, staging, and commit.

Files changed:
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `src/styles.css`
- `docs/mvp-review/mvp-17-product-facing-raster-interaction-polish/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Active source scan for prior code-drawn scene renderer names.
- Browser screenshot QA attempted but blocked:
  - local Vite server cannot bind to localhost in the current sandbox (`EPERM` on `127.0.0.1:5173` and `::1:5173`);
  - in-app browser blocks direct `file://` preview of the built app by browser policy.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- Reduced the weight of default review chrome, top copy, scene note, target rail, controls, markers, tethers, outlines, and selected card treatment.
- The raster plate remains imported as-is and remains the primary world surface.
- No code-drawn storefronts, buildings, roads, sidewalks, props, textures, or signs were added.
- No new art, replacement raster, package/config/tooling changes, staging, or commit were performed.
- Required screenshot evidence is missing, so MVP-17 is not ready for visual verdict.

Unresolved decisions:
- Batu must review MVP-17 only after required screenshot evidence is captured.
- Batu must decide whether this product-facing polish is accepted, revised, or rejected.
- Any optional ambient, additional polish, production asset direction, real-place treatment, public-interface, architecture, or next-phase decision remains blocked until Batu opens it.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-17 screenshot QA completion only. No new implementation phase is approved.

### 2026-05-29 - MVP-16B Raster-First Prototype Recovery

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Replace the active code-drawn world art with the approved review-only raster plate.
- Preserve the existing interaction shell, cards, target rail, hover/select behavior, pan/zoom behavior, and responsive containment as much as possible.
- Add only transparent hit regions, markers, tethers, selected outlines, and UI overlays.
- Avoid production art claims, broad data/system scaling, package/config/tooling changes, staging, and commit.

Files changed:
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `docs/mvp-review/mvp-16b-raster-first-prototype-recovery/README.md`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-default-overview.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-hover-focus-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/desktop-selected-card-state.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/mobile-selected-state-containment.png`
- `docs/review-screenshots/mvp-16b-raster-first-prototype-recovery/pan-zoom-stress-view.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser render/screenshot QA against the local prototype.
- `git diff --check`
- `git status --short`
- `git diff --stat`

Outcome:
- The approved raster plate at `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` is now the active primary world surface.
- The previous code-drawn perspective street/building/storefront renderer was removed from the active world component.
- Five transparent hit regions are mapped onto the raster and attached to the existing target rail/card flow.
- Markers, tethers, hover outlines, selected outlines, and QA hotspot labels are overlay-only treatments.
- Real business identity remains in structured data, cards, rail labels, source links, and UI copy only.
- No package/config/tooling changes, staging, or commit were performed.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-16B as the raster-first recovery baseline.
- Batu/ChatGPT must decide whether a later brief opens raster-anchor revision, a replacement raster plate, visual polish, optional ambient, or another next phase.
- Production asset direction, production assets, exact real facades, exact addresses, exact station geometry, live data, CI/deployment, and broad map/data work remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to post-MVP-16B review. No next implementation task is approved.

### 2026-05-29 - MVP-16A Raster Plate Selection / Supply Gate

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Evaluate existing approved/review-only raster candidates for MVP-16B.
- Select a raster-first primary world plate or block future implementation with minimum supply requirements.
- Keep the batch docs-only with no app/source edits, no new art generation, no build, no staging, and no commit.

Files changed:
- `docs/mvp-review/mvp-16a-raster-plate-selection-supply-gate/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed candidate raster paths exist on disk.
- Confirmed current-scene source screenshots exist and are blocked as primary world art.
- `git diff --check`
- `git status --short`

Outcome:
- Selected `docs/visual-artifacts/phase-6-repeatable-assetization-proof/generated/street-slice-recombination-v1.png` as the recommended review-only MVP-16B primary world plate.
- Recorded non-selected alternatives: ARC-023, ARC-028, Phase 6 UI-integrated recombination, Phase 5.1 raster scene plate, and current-scene source screenshots.
- MVP-16B remains unrun and unapproved until Batu/ChatGPT accepts the selected plate or supplies/approves a replacement.
- No app/source files were modified by this batch.

Unresolved decisions:
- Batu/ChatGPT must approve or reject the selected Phase 6 street-slice recombination plate.
- Batu/ChatGPT must approve or revise MVP-16B Raster-First Prototype Recovery before implementation.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16B Raster-First Prototype Recovery as a proposed next task only, pending Batu/ChatGPT approval of the selected raster plate or an approved replacement.

### 2026-05-29 - MVP-15C Visual Failure Freeze And Raster-First Gate

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Freeze MVP-15B as visually rejected product-facing primary world art.
- Copy the supplied MVP-15B browser screenshot as rejected evidence without modifying pixels.
- Patch the primary-world-art loophole so future visual compliance requires raster-first material use, not only reference inspection.
- Prepare MVP-16 Raster-First Prototype Recovery as a proposed next task only.
- Avoid app/source implementation, MVP-16 execution, new generated art, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15c-visual-failure-freeze-raster-first-gate/README.md`
- `docs/mvp-review/mvp-15c-visual-failure-freeze-raster-first-gate/rejected-evidence/mvp-15b-rejected-diagrammatic-perspective.png`
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/VISUAL_ARTIFACT_STANDARDS.md`
- `docs/approved-reference-corpus/USAGE_RULES.md`

Verification:
- Confirmed supplied MVP-15B screenshot was accessible.
- Copied screenshot verbatim and confirmed matching SHA-256 hash.
- Inspected required governance, corpus, MVP-15A, MVP-15B, and reusable asset rules docs.
- `git diff --check`

Outcome:
- MVP-15B is now recorded as visually rejected as product-facing primary world art.
- MVP-15B remains salvageable only for interaction shell/data/card/target-rail behavior.
- Code-native Pixi/SVG/CSS/DOM/canvas storefronts, buildings, sidewalks, roads, props, textures, or signs are blocked as primary world art for any prototype evaluated against the approved visual direction.
- Future visual compliance now requires material use of an approved raster/reference plate or approved raster sprite/asset-kit composition.
- MVP-16 is proposed only and was not run.
- No app/source files were modified.

Unresolved decisions:
- Batu/ChatGPT must approve or revise MVP-16 Raster-First Prototype Recovery before implementation.
- Batu/ChatGPT must identify or approve the raster plate or raster sprite/asset-kit composition for the next normal-mode primary world surface.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16 Raster-First Prototype Recovery as a proposed next task only, pending Batu/ChatGPT approval and suitable raster-first primary world material.

### 2026-05-29 - MVP Execution-Control Reconciliation

Status:
- Complete.

Scope:
- Update `docs/PLAN.md` into a stable roadmap through MVP completion and testing.
- Create this MVP execution ledger.
- Replace the stale Phase 6.1 implementation brief with the next recommended MVP task.
- Add mandatory plan/brief/ledger reconciliation rules to `AGENTS.md`.
- Avoid app/source/asset changes, visual artifact generation, staging, and commits.

Files changed:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Documentation search for stale Phase 6.1 active-task pointers.
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/PLAN.md` is now phase-oriented rather than batch-history-oriented.
- `docs/MVP_EXECUTION_LEDGER.md` now records batch outcomes and reconciliation rules.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to a proposed MVP-01 docs-only prototype state review and gap brief instead of stale Phase 6.1 implementation.
- `AGENTS.md` now requires plan/brief/ledger reconciliation after every successful Codex batch.
- `docs/TASKS.md` is converted to legacy orientation so it does not contradict the current brief.

Unresolved decisions:
- Batu/ChatGPT must approve or revise the proposed MVP-01 task before Codex executes it.
- Batu/ChatGPT must review existing Phase 6.1/Phase 6.2 prototype evidence before it can unlock broader MVP implementation.
- Real-place cards, production assets, architecture/public interfaces, and production pipeline remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - MVP Scope And Roadmap Role Reconciliation

Status:
- Complete.

Scope:
- Make `docs/MVP_SCOPE.md` the detailed MVP scope authority.
- Reduce `docs/PLAN.md` scope content to a concise summary and pointer.
- Tighten remaining MVP phase sequencing while preserving the pre-MVP review gate and proposed MVP-01 next task.
- Keep the cleanup docs-only with no app/source/asset edits, visual generation, staging, or commit.

Files changed:
- `AGENTS.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/PLAN.md` now points to `docs/MVP_SCOPE.md` for detailed scope and focuses on roadmap, phase order, gates, blockers, and current state.
- `docs/MVP_SCOPE.md` now defines included scope, non-goals, demo-safe assets/data rules, Must-Have / Should-Have / Cuttable items, and MVP acceptance boundaries.
- At that time, remaining MVP phases were sequenced as MVP Gap Review, Place Truth Packet, Static MVP Data Contract, MVP Interaction Integration, Visual Polish / Optional Ambient, MVP QA And Demo Freeze, and MVP Completion / Post-MVP Parking. This sequencing was later superseded by the MVP-04 review sequence correction.
- Demo/static assets and data are explicitly allowed only as controlled review/demo-safe material, not as production/public-release asset or pipeline approval.
- `docs/CURRENT_EXECUTION_BRIEF.md` remains reconciled and still points to proposed MVP-01.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-01 before Codex executes it.
- Batu/ChatGPT must decide which Should-Have and Cuttable scope items survive after MVP Gap Review.
- Production/public-release assets, production asset pipeline, real-place production cards, public interfaces, architecture, deployment, and broad implementation remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - Archive Phase 5.1 Review-Only App Assets

Status:
- Complete.

Scope:
- Move lingering untracked Phase 5.1 review-only asset files out of `src/assets/review-only/` and into `docs/archive/` for historical preservation.
- Add archive README constraints.
- Avoid app/source code changes, visual generation, staging, and commits.

Files moved:
- `src/assets/review-only/ASSET_MANIFEST.md` to `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/ASSET_MANIFEST.md`
- `src/assets/review-only/phase-5-1-raster-scene-plate-review-only.png` to `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/phase-5-1-raster-scene-plate-review-only.png`

Files changed:
- `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/README.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`
- `find src/assets/review-only -maxdepth 2 -type f 2>/dev/null || true`
- `find docs/archive -path '*phase-5-1-raster-scene-plate*' -maxdepth 5 -type f`

Outcome:
- The two Phase 5.1 review-only files are no longer under `src/assets/review-only/`.
- The files are preserved under `docs/archive/review-only-assets/phase-5-1-raster-scene-plate/`.
- The archive README identifies them as historical review-only assets, not active app assets, production assets, production asset direction, or production asset pipeline approval.
- No app/source code changed.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-01 before Codex executes it.
- Any future active prototype assets still require authorization through `docs/CURRENT_EXECUTION_BRIEF.md`.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` remains the current next pointer and still points to MVP-01 Prototype State Review And MVP Gap Brief as a proposed next task pending approval.

### 2026-05-29 - MVP-01 Prototype State Review And Gap Brief

Status:
- Complete.

Scope:
- Review the current repository state and existing review-only prototype evidence.
- Produce a concise docs-only MVP gap brief.
- Reconcile the plan, current brief, ledger, and legacy task tracker.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Source and archived screenshot inventory review.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-01 review packet records current prototype evidence, proof limits, missing MVP requirements, blocker classification, stale pointer review, and recommended next batch.
- Current prototype evidence is treated as review-only: one Phase 6 raster, fictional targets, placeholder cards, pan/zoom, hover/click/tap selection, selected card, controls, and basic mobile containment.
- Archived Phase 6.1/6.2 screenshots are treated as review history, not active execution authority.
- Remaining MVP gap is now centered on truth-safe real-place selection, static data boundaries, and later approved MVP interaction integration.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-02 Place Truth Packet.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve or revise proposed MVP-02 before Codex executes it.
- Batu/ChatGPT must decide whether the current review-only prototype evidence is sufficient to proceed into place-truth review.
- Real-place representation, static data contract, public interfaces, production assets, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-02 Place Truth Packet as a proposed next task pending approval.

### 2026-05-29 - MVP-02 Place Truth Packet

Status:
- Complete.

Scope:
- Produce a docs-only place-truth packet for the compact Manhattan Ave / Greenpoint Ave MVP scene.
- Identify candidate real places, source evidence, spatial coherence risks, copy/disclaimer constraints, and approve/defer/omit/fictionalize recommendations for Batu/ChatGPT review.
- Reconcile the plan, MVP scope, current brief, ledger, and legacy task tracker.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/TASKS.md`

Verification:
- Existing repo docs and source-policy evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-02 truth packet records the candidate review set, spatial coherence read, manual-verification requirements, and recommended symbolic/defer/omit/fictionalize treatment for Greenpoint Av G station, Peter Pan, Sweetgreen, former Meserole Theater, Captured Record Shop, Polka Dot, Karczma, and Brouwerij Lane.
- Copy constraints, unofficial-map disclaimer requirements, source metadata requirements, and conceptual static field recommendations are ready for Batu/ChatGPT review.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-03 Static MVP Data Contract.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-02 candidate recommendations.
- Batu must decide which candidates receive manual verification, which are omitted or fictionalized, and whether Karczma requires westward scene expansion.
- Batu/ChatGPT must approve or revise proposed MVP-03 before Codex executes it.
- Real-place representation, static data implementation, public interfaces, production assets, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-03 Static MVP Data Contract as a proposed next task pending approval.

### 2026-05-29 - MVP-03 Static MVP Data Contract

Status:
- Complete.

Scope:
- Produce a docs-only static MVP data contract proposal grounded in `docs/PLACE_SCHEMA.md`, `docs/PLACE_SOURCE_POLICY.md`, and the MVP-02 truth packet.
- Define required conceptual fields for real places, symbolic anchors, context buildings, placeholders, omitted/deferred candidates, source references, card data, status vocabulary, and shared disclaimer handling.
- Reconcile the plan, MVP scope, current brief, and ledger.
- Avoid app/source/asset edits, visual generation, staging, and commits.

Files changed:
- `docs/mvp-review/mvp-03-static-mvp-data-contract/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Existing repo docs and source-policy evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-03 static data contract packet defines the docs-only static MVP data shape needed to preserve source metadata, verification status, placement uncertainty, manual-review flags, approval state, candidate outcomes, card constraints, and disclaimer requirements.
- The packet separates `Place`, `Building`, `Storefront`, and `MapAnchor` concepts so future integration does not flatten multi-tenant or uncertain storefront relationships into misleading public claims.
- The packet proposes a future static source-file boundary only as a review item, not as an approved app/source interface or implementation path.
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-04 MVP Interaction Integration.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must approve, revise, or reject the MVP-03 contract proposal before implementation.
- Batu/ChatGPT must approve the static MVP place-data implementation boundary and allowed app/source files before MVP-04 can execute.
- Batu must decide which candidates receive cards, symbolic treatment, placeholders, omission, deferral, manual verification, or public copy.
- Public interfaces, production assets, production data contracts, architecture, deployment, and MVP completion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-04 MVP Interaction Integration as a proposed next task pending Batu/ChatGPT approval of the MVP-03 contract proposal and implementation boundary.

### 2026-05-29 - MVP-04 MVP Interaction Integration

Status:
- Complete.

Scope:
- Execute the approved MVP-04 brief by integrating static local MVP data and final MVP interaction behavior into the review-only prototype.
- Use user-provided Manhattan Ave / Greenpoint Ave street-reference imagery as the primary review surface for the busy intersection stress test.
- Preserve fictional-safe, bounded, review/demo-safe treatment; avoid live data, production data contracts, broad map expansion, production assets, staging, and commits.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/review-screenshots/mvp-04-interaction-integration/desktop-default.png`
- `docs/review-screenshots/mvp-04-interaction-integration/desktop-selected-peter-pan.png`
- `docs/review-screenshots/mvp-04-interaction-integration/desktop-qa-hotspots.png`
- `docs/PLAN.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- Browser smoke check at `http://127.0.0.1:5173/`
- Browser click check for selected Peter Pan card.
- Browser control smoke check for zoom in, pan right, and reset.
- Browser QA hotspot screenshot check.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- The prototype now reads from a static local MVP data module with real candidates, symbolic/context treatment, a fictional density placeholder, deferred candidate records, source references, `lastVerified`, status notes, manual-review flags, and shared disclaimer text.
- The app now uses the supplied Manhattan Ave / Greenpoint Ave street-reference raster as the primary review surface for the MVP-04 stress-test scene.
- The place index, selected card, source links, disclaimer behavior, marker states, QA hotspot overlay, pan/zoom controls, and reset control remain functional in the browser smoke check.
- Review screenshots were captured under `docs/review-screenshots/mvp-04-interaction-integration/`.
- No production assets, production data contract, live data, broad map system, package/config/build/CI/deployment changes, staging, or commit were introduced.
- Later Batu/ChatGPT review found this output useful as a technical interaction baseline but not accepted as final visual/source-frame integration.

Unresolved decisions:
- Batu/ChatGPT must approve the MVP-05 Source-Of-Truth Validation Spike boundary.
- MVP-05 must determine which current Manhattan Ave / Greenpoint Ave storefronts/places can be used as real cards, context only, fictionalized, omitted, or blocked.
- The next implementation task after MVP-05 should be a corrective scene translation and data realignment pass, not Visual Polish / Optional Ambient.
- Visual Polish / Optional Ambient remains blocked until validation returns a proceed/revise/cut verdict and corrected scene/data implementation is reviewed.
- Final public-facing place copy, exact geometry, exact facades, exact storefront frontage/order, exact station geometry, production assets, production data contracts, architecture, deployment, and broad map expansion remain blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-05 Source-Of-Truth Validation Spike as a proposed next task pending Batu/ChatGPT approval of the validation-spike boundary.

### 2026-05-29 - MVP-04 Review Sequence Correction

Status:
- Complete.

Scope:
- Update control docs only to reflect Batu/ChatGPT review of MVP-04.
- Record that MVP-04 is useful as a technical interaction baseline but failed final visual/source-frame integration and requires place/data realignment.
- Redirect the next recommended task from Visual Polish / Optional Ambient to MVP-05 Source-Of-Truth Validation Spike.
- Keep app/source/assets, visuals, package/config/build/CI/deployment files, staging, and commits untouched.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-05 Source-Of-Truth Validation Spike as proposed/pending.
- `docs/PLAN.md` now sequences MVP-05 validation before corrective scene translation and data realignment.
- Visual Polish / Optional Ambient is blocked until MVP-05 returns a proceed/revise/cut verdict and the corrected scene/data implementation is reviewed.
- The docs now record that street/reference raster use as the visible world surface is not accepted as final translation into the approved Inked Indie / Compact Corner isometric direction.

Unresolved decisions:
- Batu/ChatGPT must approve or revise the MVP-05 validation-spike boundary before Codex executes it.
- MVP-05 must determine real card, context-only, fictionalized, omitted, or blocked treatment for current Manhattan Ave / Greenpoint Ave storefront/place candidates.
- Batu/ChatGPT must approve a later corrective scene translation and data realignment implementation boundary.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-05 Source-Of-Truth Validation Spike as a proposed next task pending Batu/ChatGPT approval.

### 2026-05-29 - MVP-05 Source-Of-Truth Validation Spike

Status:
- Complete.

Scope:
- Execute the approved MVP-05 docs/data-only validation spike for the current Manhattan Ave / Greenpoint Ave scene boundary.
- Produce one review artifact with 5-10 storefront evidence cards, confidence notes, provenance notes, manual-review flags, and a proceed/revise/cut verdict.
- Reconcile `docs/PLAN.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, and this ledger.
- Avoid app/source edits, visual asset edits or generation, screenshots, package/config/build/CI/deployment changes, live data, scraping, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Existing repo docs and project evidence reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-05 review packet records eight candidate evidence cards: Greenpoint Av G station, Peter Pan Donut & Pastry Shop, Sweetgreen Greenpoint, former Meserole Theater / 723-725 Manhattan Ave, Captured Record Shop, Polka Dot / 726 Manhattan Ave, Karczma, and Brouwerij Lane.
- The packet carries building/tax-lot linkage only where already present in project evidence and marks missing/blocked items explicitly.
- The packet marks current Google Maps / Google Street View-style scene images as blocked visual-reference evidence under the current brief and does not use them for facade claims.
- The packet verdict is `revise`: address/source data is useful, but owned/approved storefront-specific visual references and manual verification are insufficient for confident real-place usage before Visual Polish / Optional Ambient.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records no active Codex execution task and points to Batu/ChatGPT review of MVP-05.
- `docs/MVP_SCOPE.md` was not changed because MVP boundaries did not change.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-05 `revise` verdict.
- Batu/ChatGPT must approve or revise any MVP-06 Corrective Scene Translation And Data Realignment Brief before Codex executes further work.
- Batu must decide candidate treatments, approved non-Google visual references, and any manual public-representation overrides.
- Visual Polish / Optional Ambient remains blocked until MVP-05 is reviewed and any corrective scene/data realignment is approved and reviewed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now states that there is no active Codex execution task and recommends Batu/ChatGPT review of MVP-05 before any proposed MVP-06 corrective scene/data task.

### 2026-05-29 - MVP-05 Current-Scene Correction

Status:
- Complete.

Scope:
- Correct the MVP-05 review artifact and control docs so they refer to the actual current scene rather than stale previous-scene businesses.
- Replace the stale previous-scene set with Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Treat user-provided LiveXYZ links as identity/presence evidence only, not approved facade/art references.
- Avoid app/source edits, visual asset edits or generation, screenshots, package/config/build/CI/deployment changes, live data, scraping, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-05-source-of-truth-validation-spike/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/MVP_SCOPE.md`

Verification:
- Existing artifact, control docs, MVP scope, and `src/mvpPlaceData.js` inspected.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- Corrected MVP-05 now records five current-scene evidence cards: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Sweetgreen, Captured, Karczma, Polka Dot, Peter Pan, and former Meserole Theater are explicitly marked as previous-scene/stale references, not current pending-review businesses.
- LiveXYZ links are documented as useful identity/presence evidence only; they were not fetched, scraped, or treated as approved facade/art references.
- The final MVP-05 verdict remains `revise`, now grounded in the corrected current scene.
- `docs/MVP_SCOPE.md` now records the current candidate set and parks the previous-scene candidates outside the current MVP-05 validation set.
- No app/source/assets were modified.
- No visuals were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the corrected MVP-05 `revise` verdict.
- Batu/ChatGPT must decide current candidate treatments for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Batu/ChatGPT must approve any MVP-06 corrective scene/data implementation boundary, including allowed files and approved non-Google visual references.
- Visual Polish / Optional Ambient remains blocked until corrected MVP-05 is reviewed and any corrective scene/data realignment is approved and reviewed.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still states that there is no active Codex execution task and recommends Batu/ChatGPT review of corrected MVP-05 before any proposed MVP-06 corrective scene/data task.

### 2026-05-29 - MVP-06 Corrective Scene Translation Brief

Status:
- Complete as brief-writing batch.

Scope:
- Create a concise MVP-06 implementation brief after acceptance of the corrected MVP-05 `revise` verdict.
- Authorize only the minimum app/source/data changes needed to align the prototype with the corrected current scene boundary after the brief is accepted.
- Preserve Visual Polish / Optional Ambient as blocked.
- Avoid app/source/assets, screenshots, package/config/tooling/CI/deployment changes, staging, and commit in this brief-writing batch.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Requested MVP-05, control docs, MVP scope, and source files reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now contains the proposed MVP-06 Corrective Scene Translation And Data Realignment implementation brief.
- The brief limits implementation to `src/mvpPlaceData.js`, `src/App.jsx`, `src/PlaceholderWorld.jsx`, `src/styles.css`, MVP-06 review screenshots, MVP-06 self-audit, and required control-doc reconciliation.
- The brief requires current-scene data/UI for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway, removal of stale previous-scene active data/UI, review screenshots, and a self-audit mapping each visible place/card to MVP-05 evidence status.
- The brief keeps LiveXYZ as identity/presence evidence only and blocks Google/Street View-style imagery as facade evidence.
- `docs/PLAN.md` now points to MVP-06 as the proposed next implementation task and keeps Visual Polish / Optional Ambient blocked behind MVP-06.
- `docs/MVP_SCOPE.md` was not changed because the durable scope boundary already reflected the corrected current-scene set.
- No app/source/assets were modified.
- No visuals or screenshots were generated.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept or revise the proposed MVP-06 implementation brief before Codex executes implementation.
- Batu still owns candidate treatment decisions, branded-chain treatment decisions, public representation, exact geometry, and visual-reference approval.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is implemented, reviewed, and accepted.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to proposed MVP-06 Corrective Scene Translation And Data Realignment as the next implementation task pending acceptance.

### 2026-05-29 - Active Scene Confirmation Guardrail

Status:
- Complete.

Scope:
- Add a control-doc guardrail after the MVP-05 scene identity drift correction.
- Require future source validation, scene translation, visual polish, data alignment, and real-place implementation work to confirm the active scene/place set from current app/data files before making decisions.
- Keep the change docs-only with no app/source/assets, screenshots, package/config/tooling/CI/deployment changes, staging, or commit.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_SCOPE.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- `docs/MVP_SCOPE.md` now contains the durable Active Scene Confirmation Guardrail and records the current durable active scene/place set: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- `docs/PLAN.md` now carries a tight roadmap-level pointer to the guardrail.
- `docs/CURRENT_EXECUTION_BRIEF.md` now requires MVP-06 implementation to confirm and list the active app/data scene set before implementation and notes that this brief explicitly authorizes correcting the known stale app/data disagreement.
- Previous-scene entities remain archival/reference-only unless explicitly reactivated.

Unresolved decisions:
- Batu/ChatGPT must still accept or revise the proposed MVP-06 implementation brief before Codex executes implementation.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is implemented, reviewed, and accepted.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to proposed MVP-06 Corrective Scene Translation And Data Realignment as the next implementation task pending acceptance.

### 2026-05-29 - MVP-06 Corrective Scene Translation And Data Realignment

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Replace stale active app/data places with the corrected MVP-05 current scene set.
- Preserve MVP-04 interaction behavior.
- Keep LiveXYZ as identity/presence evidence only.
- Prevent the UI from implying approved facade/art accuracy, exact storefronts, exact addresses, exact station geometry, or production placement.
- Produce MVP-06 review screenshots and a self-audit.
- Reconcile control docs without staging or commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `src/styles.css`
- `docs/mvp-review/mvp-06-corrective-scene-translation-and-data-realignment/README.md`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/01-overview-corrected-active-scene.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/02-greenpoint-deli-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/03-mcdonalds-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/04-dunkin-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/05-citizens-bank-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/06-greenpoint-g-subway-card.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/07-qa-hotspots-corrected-set.png`
- `docs/review-screenshots/mvp-06-corrective-scene-translation-and-data-realignment/08-mobile-greenpoint-deli-card.png`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Active-scene confirmation completed. Known stale app/data mismatch was the authorized correction target; no second mismatch was found.
- `npm run build`
- Browser smoke check of corrected target rail.
- Browser selected-card checks for Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- QA hotspot outline screenshot.
- Mobile selected-card containment screenshot.
- Source scan confirmed stale previous-scene business names are absent from active app data/UI files.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- Active prototype now displays Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Peter Pan Donut & Pastry Shop, Sweetgreen Greenpoint, Former Meserole Theater Context, Captured Record Shop, Polka Dot, Karczma, Brouwerij Lane, and Corner Infill Placeholder were removed from active current-scene target/card/source data.
- Visible cards distinguish identity/presence evidence from facade/art-reference insufficiency.
- The existing raster is dimmed at runtime and labeled scaffold-only; no visual assets were modified or generated.
- MVP-04 interaction behavior remains intact.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-06 review state with no active Codex implementation task.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-06 output.
- Candidate treatment decisions remain reserved for Batu/ChatGPT, including whether any current business becomes a real card, context-only card, fictionalized card, omitted item, or blocked item.
- Approved non-Google storefront-specific visual references are still missing.
- Visual Polish / Optional Ambient remains blocked until MVP-06 is reviewed and accepted and a later brief opens that scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-06 output. No next implementation task is approved.

### 2026-05-29 - MVP-07 Reusable Place Evidence Pipeline Spike

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a concise docs-only MVP-07 review artifact proposing a reusable source/evidence pipeline for Greenpoint addresses, businesses, interactive scene data, and approved art-reference inputs.
- Test the pipeline against the current active scene: Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source/assets, screenshots, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-07-reusable-place-evidence-pipeline/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs and `src/mvpPlaceData.js` reviewed.
- Active scene confirmed from `src/mvpPlaceData.js`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-07 proposes a recommended source hierarchy, evidence status taxonomy, conceptual place record schema, facade/art-reference eligibility rules, manual vs automated steps, scaling risks, and recommended next task.
- The current scene pipeline test classifies all five active places as still requiring revision before real-inspired facade/art treatment or Visual Polish / Optional Ambient.
- The final verdict is `revise`: the workflow is viable as a repeatable review pipeline, but the current scene still lacks approved address/parcel/storefront and facade/art-reference evidence.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-07 review state and proposes MVP-08 Place Evidence Packet For Current Scene as the next docs-only task pending approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-07 is a review proposal, not yet a durable approved scope rule.
- No app/source/assets were modified.
- No screenshots or visuals were created.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-07 pipeline and `revise` verdict.
- Batu/ChatGPT must decide whether to authorize MVP-08 Place Evidence Packet For Current Scene.
- Batu must decide treatment for each current place, including real card, context-only, fictional-safe, omitted, or blocked.
- Approved non-Google storefront-specific visual references remain missing.
- Visual Polish / Optional Ambient remains blocked until place-evidence review is accepted and a later brief opens that scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-07 and a proposed MVP-08 docs-only current-scene evidence packet. No implementation task is approved.

### 2026-05-29 - MVP-08 Place Evidence Packet For Current Scene

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only evidence packet for the current active scene.
- Classify Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway using the MVP-07 taxonomy.
- Determine eligibility for real-inspired art translation, generic placeholder, fictional-safe treatment, or blocked status.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source/assets, screenshots, live scraping, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-08-place-evidence-packet-current-scene/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs and `src/mvpPlaceData.js` reviewed.
- Active scene confirmed from `src/mvpPlaceData.js`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-08 records one evidence packet per current active place.
- Greenpoint Deli, McDonald's, Dunkin', and Citizens Bank are identity/presence candidates only; address, parcel/building, storefront/frontage, and approved facade/art-reference evidence remain missing.
- Greenpoint G subway is supported as symbolic transit context only; exact access-point and station geometry remain unresolved.
- Final verdict is `revise`.
- No current business is eligible for real-inspired art translation yet.
- Greenpoint G subway is eligible only for symbolic transit cue treatment, not exact real-inspired station geometry.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-08 review state and proposes MVP-09 Current Scene Treatment Decision Brief as the next docs-only task pending approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-08 did not add or correct a durable scope rule.
- No app/source/assets were modified.
- No screenshots or visuals were created.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-08 evidence packet and `revise` verdict.
- Batu/ChatGPT must decide whether to authorize MVP-09 Current Scene Treatment Decision Brief.
- Batu must choose whether the current scene pursues evidence acquisition, fictional-safe translation, or cut/omit treatment before art translation or polish.
- Approved non-Google storefront-specific visual references remain missing.
- Visual Polish / Optional Ambient remains blocked until treatment decisions are accepted and a later brief opens that scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-08 and a proposed MVP-09 docs-only treatment decision brief. No implementation task is approved.

### 2026-05-29 - MVP-09 Current Scene Treatment Decision Brief

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only treatment decision brief for the current active scene.
- Evaluate evidence acquisition first, fictional-safe/generic translation now, cut/omit real businesses, and mixed treatment.
- Choose the fastest honest path toward an interactable Greenpoint Ave / Manhattan Ave scene while preserving truth-safety.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source/assets, screenshots, exact real-inspired facade authorization, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-09-current-scene-treatment-decision/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs and `src/mvpPlaceData.js` reviewed.
- Active scene confirmed from `src/mvpPlaceData.js`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-09 chooses mixed treatment with verdict `proceed`.
- The chosen path preserves current business identity/cards as identity/presence-only review data.
- Business visuals should use fictional-safe or generic storefront treatments.
- Greenpoint G subway should use symbolic transit cue treatment only.
- Exact real-inspired facade art, exact station geometry, Google/Street View-style facade evidence, and LiveXYZ-derived facade/art use remain blocked.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-09 review state and proposes MVP-10 Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary as the next task pending approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-09 did not add or correct a durable scope rule.
- No app/source/assets were modified.
- No screenshots or visuals were created.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-09 mixed treatment path and `proceed` verdict.
- Batu/ChatGPT must decide whether to authorize MVP-10 Fictional-Safe Current Scene Art Translation Brief / Implementation Boundary.
- Batu must decide whether MVP-10 opens implementation or remains a boundary-only brief.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.
- Visual Polish / Optional Ambient remains blocked until fictional-safe translation is reviewed and a later brief opens polish scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-09 and a proposed MVP-10 fictional-safe current scene art translation brief / implementation boundary. No implementation task is approved.

### 2026-05-29 - MVP-10 Fictional-Safe Current Scene Art Translation Brief

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only implementation boundary brief translating MVP-09 mixed treatment into a precise MVP-11 boundary.
- Define what MVP-11 may implement, what remains blocked, eligible scene elements, symbolic subway constraints, data/card copy constraints, acceptance criteria, stop conditions, and recommended next task.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source files, visual assets, screenshots, package/config files, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-10-fictional-safe-current-scene-art-translation-brief/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs reviewed.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-10 defines the chosen MVP-09 mixed-treatment boundary for the next implementation pass.
- The proposed MVP-11 pass may keep the five current targets, preserve existing interaction behavior, use fictional-safe/generic visuals for the four businesses, use symbolic subway cue treatment only, and preserve truth-safety constraints.
- Exact real-inspired facades, exact station geometry, blocked source use, new visual assets, screenshots, and app/source changes remain unperformed in this MVP-10 docs-only batch.
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-10 review state and proposes MVP-11 Current Scene Fictional-Safe Translation Pass as the next task pending explicit approval.
- `docs/MVP_SCOPE.md` was not changed because MVP-10 did not add or correct a durable scope rule.
- No app/source/assets/screenshots/package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-10 implementation boundary.
- Batu/ChatGPT must explicitly open MVP-11 before implementation.
- Batu must decide whether the proposed MVP-11 file scope and acceptance criteria are sufficient.
- Visual Polish / Optional Ambient remains blocked until fictional-safe translation is reviewed and a later brief opens polish scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-10 and a proposed MVP-11 Current Scene Fictional-Safe Translation Pass. No implementation task is approved.

### 2026-05-29 - MVP-11 Current Scene Fictional-Safe Translation Pass

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Implement the MVP-10 fictional-safe translation boundary in the current review-only prototype.
- Add 3-5 fictional-safe storefront/building treatments and one symbolic subway cue using the current in-code art system.
- Preserve existing hover, select, card, pan/zoom, target rail, QA hotspot, and responsive behavior.
- Produce a self-audit and reconcile control docs.
- Avoid exact real-inspired facades, exact subway geometry, blocked source imagery, scraping, new real-place evidence, image generation, production asset pipeline, package/config changes, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `docs/mvp-review/mvp-11-current-scene-fictional-safe-translation-pass/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- `git diff --check`
- Browser/screenshot attempt blocked by environment: Vite server listening failed with `EPERM` on `127.0.0.1`, `::1`, and `0.0.0.0`; in-app browser `file://` preview was blocked by browser policy.

Outcome:
- Active scene remains Greenpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G subway.
- Added code-native fictional-safe treatment metadata for current targets.
- Added a Pixi-drawn fictional-safe scene layer beneath existing markers.
- Four business targets now have generic category visual cues: deli/corner-store, quick-service, coffee/quick-service, and service/bank.
- Greenpoint G subway now has a symbolic G transit cue only.
- Card/source constraints remain identity/presence-only and facade/art-insufficient.
- Existing app interaction paths were preserved in source and build verification passed.
- No screenshots were created because local browser verification was blocked in this environment.
- No package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-11 fictional-safe translation.
- Screenshot/QA review should be retried in an environment where the local app can open before any visual polish decision.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.
- Visual Polish / Optional Ambient remains blocked until fictional-safe translation is reviewed and a later brief opens polish scope.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to Batu/ChatGPT review of MVP-11 and recommends screenshot/QA recovery review. No next implementation task is approved.

### 2026-05-29 - MVP-12 Screenshot / Visual QA Recovery Review

Status:
- Blocked for browser QA.

Scope:
- Attempt to recover browser-based visual QA for MVP-11.
- Try to render the local prototype and capture the required review screenshots.
- Avoid new art direction, additional storefronts, visual polish, image generation, exact real-inspired facades, exact subway geometry, data acquisition/scraping, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-12-screenshot-visual-qa-recovery-review/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `npm run build`
- `git diff --check`
- Attempted `npm run dev -- --port 5173`
- Attempted in-app browser `data:` preview probe
- Attempted elevated local server execution

Outcome:
- Build and diff checks passed.
- Local Vite server startup failed with `listen EPERM` on `127.0.0.1:5173`.
- Browser `data:` preview was blocked by Browser URL policy.
- Elevated local server execution was rejected by the session approval policy.
- No screenshots were captured.
- No app/source/assets/package/config files were modified during MVP-12.
- Visual QA verdict is `revise`, meaning browser QA remains unresolved rather than MVP-11 being visually rejected.
- Visual Polish / Optional Ambient remains blocked.

Unresolved decisions:
- Batu/ChatGPT must decide whether to retry browser QA in another environment or provide an approved preview URL.
- Batu/ChatGPT should not accept MVP-11 visually until screenshots/interaction QA can be reviewed, unless they explicitly accept the limitation.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to environment resolution for screenshot/interaction QA. No next implementation task is approved.

### 2026-05-29 - MVP-13 Four-Corner Scene Structure Repair

Status:
- Implemented in source; screenshot QA blocked.

Scope:
- Repair the failed MVP-11 single-screenshot/overlay approach.
- Replace the current scene with a simplified four-corner intersection structure.
- Anchor Greenpoint Deli to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- Preserve Greenpoint G subway as a symbolic intersection/transit cue only.
- Preserve existing hover, select, card, target rail, QA outline, pan/zoom, and responsive behavior.
- Avoid exact real-inspired facades, exact subway geometry, scraped/blocked imagery, image generation, broad visual polish, data pipeline work, package/config changes, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `docs/mvp-review/mvp-13-four-corner-scene-structure-repair/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed the four supplied corner reference screenshots exist in `docs/mvp-reference-images/`.
- `npm run build`
- `npm run dev -- --port 5173` attempted for screenshot QA and failed with `listen EPERM` on `127.0.0.1:5173`.
- `git diff --check`

Outcome:
- The active scene no longer imports or renders one corner screenshot as the primary scene surface.
- The scene now renders a code-native four-corner review composition with integrated storefront/building zones.
- Greenpoint Deli is anchored to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- In-scene storefront text is generic category language: `DELI`, `BITES`, `COFFEE`, and `SERVICE`.
- Real business identity remains limited to labels, cards, target rail, and source metadata.
- Greenpoint G subway remains a generic symbolic transit cue, not exact station geometry.
- Build verification passed.
- Diff whitespace verification passed.
- No screenshots were captured because the local server/browser environment is still blocked.
- No package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-13 after visual screenshots are available.
- Screenshot/browser QA should be retried in an environment where the local app can bind to localhost, or via an approved preview URL.
- Visual Polish / Optional Ambient remains blocked until MVP-13 is visually reviewed.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-14 Four-Corner Browser Screenshot QA as the recommended next step, pending Batu/ChatGPT review and environment resolution. No next implementation task is approved.

### 2026-05-29 - MVP-15 Perspective Scene Translation Repair

Status:
- Implemented in source; browser QA blocked.

Scope:
- Repair the MVP-13 flat diagram / board-game visual failure.
- Preserve four-corner logic while shifting the scene toward a stylized perspective street composition.
- Use four supplied corner screenshots only for broad corner identity, massing, street orientation, and urban-feel reference.
- Preserve Greenpoint Deli to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- Preserve Greenpoint G subway as a symbolic street-scene cue only.
- Preserve existing hover, select, card, target rail, QA outline, pan/zoom, and responsive behavior.
- Avoid exact real-inspired facades, exact subway geometry, scraped/blocked imagery, image generation, broad visual polish, data pipeline work, package/config changes, staging, and commit.

Files changed:
- `src/mvpPlaceData.js`
- `src/App.jsx`
- `src/PlaceholderWorld.jsx`
- `docs/mvp-review/mvp-15-perspective-scene-translation-repair/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed the four supplied corner reference screenshots exist in `docs/mvp-reference-images/`.
- Visually reviewed the four supplied corner reference screenshots for broad orientation/massing only.
- `npm run build`
- `npm run dev -- --port 5173` attempted for browser QA and failed with `listen EPERM` on `127.0.0.1:5173`.
- `git diff --check`

Outcome:
- The scene remains code-native and does not import/render the four screenshots as scene surfaces.
- The MVP-13 top-down/schematic intersection was replaced with receding road geometry, perspective sidewalks, crosswalk rhythm, background massing, and foreground/back-corner scale differences.
- The four business corners now use distinct scene-native building/storefront treatments rather than one repeated rectangular window/awning template.
- Greenpoint Deli is anchored to NW, McDonald's to NE, Dunkin' to SW, and Citizens Bank to SE.
- In-scene storefront text remains generic category language: `DELI`, `BITES`, `COFFEE`, and `SERVICE`.
- Real business identity remains limited to labels, cards, target rail, and source metadata.
- Greenpoint G subway remains a generic symbolic transit cue, not exact station geometry.
- Build verification passed.
- Diff whitespace verification passed.
- Browser QA is `qa-blocked` because the local server/browser environment is still blocked.
- No package/config files were modified.
- No staging or commit occurred.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after visual screenshots are available.
- Browser QA should be retried in an environment where the local app can bind to localhost, or via an approved preview URL.
- Visual Polish / Optional Ambient remains blocked until MVP-15 is visually reviewed.
- Exact real-inspired facade and station-geometry upgrades remain blocked until approved evidence exists.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16 Perspective Scene Browser QA as the recommended next step, pending Batu/ChatGPT review and environment resolution. No next implementation task is approved.

### 2026-05-29 - MVP-15A Visual Acceptance Contract / Failure Guardrails

Status:
- Complete for Batu/ChatGPT review.

Scope:
- Create a docs-only mandatory visual contract before the next implementation pass.
- Diagnose MVP-11 screenshot-overlay failure and MVP-13 top-down board-game/storefront-tile failure.
- Define banned visual patterns, required visual patterns, pre-code visual extraction requirements, renderer separation, QA screenshot rules, and next recommended task.
- Reconcile the plan, current brief, and ledger.
- Avoid app/source files, visual assets, scraping, image generation, browser screenshots, package/config files, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required review docs read.
- Checked for local MVP-13 rejected screenshots.
- Confirmed the four source corner screenshots exist in `docs/mvp-reference-images/`.
- `git diff --check`
- `git diff --stat`
- `git status --short`

Outcome:
- MVP-15A explicitly blocks top-down maps, board-game/grid diagrams, floating storefront tiles, repeated rectangle/window/awning templates, label-led category reads, UI-card buildings, overlay-layer storefronts, collapsed screenshot references, and screenshot backgrounds.
- MVP-15A requires oblique/isometric street-scene language, volumetric buildings, embedded storefronts, distinct corner massing, road/sidewalk/crosswalk/curb perspective, symbolic scene-native subway cue, and the correct NW/NE/SW/SE assignments.
- MVP-15A requires corner-by-corner visual extraction from the four source screenshots before any next implementation pass.
- MVP-15A requires browser screenshots before any visual verdict.
- Rejected MVP-13 browser screenshots were not found in the repository; the contract records the user-supplied rejected evidence description instead.
- No app/source files changed.
- No visuals, assets, screenshots, package/config files, staging, or commits were introduced.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the MVP-15A visual contract.
- Batu/ChatGPT must decide whether to approve MVP-15B Perspective Scene Renderer Replacement.
- Batu/ChatGPT must decide whether any pre-existing MVP-15 source changes are retained, revised, superseded, or reviewed against MVP-15A.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-15B Perspective Scene Renderer Replacement as the recommended next task, pending Batu/ChatGPT approval in a later current brief. No next implementation task is approved.

### 2026-05-29 - MVP-15 Perspective Repair Control Reconciliation

Status:
- Complete.

Scope:
- Reconcile control docs after the MVP-15 source implementation while preserving the MVP-15A guardrail artifact as supporting review context.
- Keep Visual Polish / Optional Ambient blocked.
- Avoid further app/source, package/config, visual asset, screenshot, staging, or commit work.

Files changed:
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- `git diff --check`

Outcome:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records post-MVP-15 source state.
- MVP-15 source status is `pending visual QA`.
- Browser QA status remains `qa-blocked`.
- MVP-15A remains documented as supporting guardrails, not as a visual acceptance decision for MVP-15.
- No next implementation task is approved.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after browser screenshots are available.
- Batu/ChatGPT must decide whether MVP-15A should become a mandatory checklist for future visual implementation passes.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-16 Perspective Scene Browser QA as the recommended next task in a browser-capable environment. No next implementation task is approved.

### 2026-05-29 - MVP-15A Approved Corpus Compliance Gate Patch

Status:
- Complete.

Scope:
- Patch MVP-15A so future visual implementation cannot pass merely by avoiding prior failure modes.
- Add mandatory approved-reference-corpus citation and inspection requirements before code changes.
- Add rejected screenshot evidence handling.
- Reconcile the current brief, plan, and ledger without modifying app/source files.
- Avoid new art, assets, scraping, image generation, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Required docs reviewed.
- Checked the MVP-15A folder for local rejected screenshots.
- Checked repository image paths for rejected MVP-13 evidence.
- `git diff --check`

Outcome:
- MVP-15A now requires future visual implementation passes to cite exact ARC IDs and paths before code changes.
- MVP-15A now requires ARC-023, ARC-028, ARC-016 or ARC-026, ARC-024, ARC-029, ARC-015, and ARC-031 to be inspected for the appropriate scene, storefront, UI, and cautionary roles.
- MVP-15A now requires a pre-code visual target table with reference used, visible traits to preserve, implementation implication, and risks/drift to avoid.
- MVP-15A now requires explicit comparison against ARC-015 and ARC-031 cautionary references.
- MVP-15A now states build success is not visual acceptance and keeps source implementation status separate from visual QA status.
- Rejected MVP-13 screenshots remain missing evidence; MVP-15A recommends adding them under `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/`.
- No app/source files changed.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after browser screenshots are available.
- Batu/ChatGPT must decide how the MVP-15A corpus gate should be applied to any review or revision of pre-existing MVP-15 source work.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-16 Perspective Scene Browser QA as the recommended next task in a browser-capable environment. No next implementation task is approved.

### 2026-05-29 - MVP-15B Perspective Scene Renderer Replacement

Status:
- Complete pending browser visual QA.

Scope:
- Complete the MVP-15A Approved Corpus Compliance Gate before source edits.
- Inspect required approved corpus references, rejected MVP-11/MVP-13 evidence, and four source corner screenshots.
- Create the MVP-15B pre-code packet.
- Replace the current diagrammatic scene renderer with a scene-native perspective renderer.
- Preserve cards, target rail, hover/select behavior, QA outlines, pan/zoom paths, and truth-safety copy.
- Avoid package/config changes, image generation, production asset pipeline, real-place data acquisition, deployment, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15b-perspective-scene-renderer-replacement/README.md`
- `src/PlaceholderWorld.jsx`
- `src/mvpPlaceData.js`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Completed MVP-15A compliance gate before app/source edits.
- Confirmed required approved corpus references were inspectable.
- Confirmed rejected MVP-11/MVP-13 evidence screenshots were inspectable.
- Confirmed four source corner screenshots in `docs/mvp-reference-images/` were inspectable.
- `npm run build`
- `git diff --check`

Outcome:
- MVP-15B README records the compliance table, rejected evidence table, four-corner source extraction, and renderer plan.
- Active scene source now identifies MVP-15B as the perspective scene renderer replacement.
- Renderer uses oblique road/sidewalk/crosswalk geometry, four distinct corner building masses, embedded storefronts, roof/parapet cues, side planes, facade texture, props, smaller secondary signs, and a symbolic scene-native G subway cue.
- Existing interaction/card behavior and truth-safety copy were preserved.
- Browser screenshots were not captured because local rendering is blocked.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15B after browser screenshots are available.
- No visual verdict is assigned without screenshots.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now records MVP-15B source status as `complete pending visual QA` and recommends browser screenshot capture plus interaction smoke QA in a browser-capable environment, pending Batu/ChatGPT approval.

### 2026-05-29 - MVP-15A.1 Approved Corpus Path Reconciliation

Status:
- Complete.

Scope:
- Fix approved reference corpus path integrity so the MVP-15A visual compliance gate can inspect required references.
- Locate current filesystem paths for required ARC references.
- Update approved corpus docs to point at existing archived paths.
- Clarify that archived storage does not reduce canonical status.
- Update MVP-15A to cite current manifest paths rather than hardcoded stale paths.
- Reconcile control docs.
- Avoid app/source files, image duplication, package/config changes, app build, staging, and commit.

Files changed:
- `docs/approved-reference-corpus/MANIFEST.md`
- `docs/approved-reference-corpus/README.md`
- `docs/approved-reference-corpus/REFERENCE_INDEX.md`
- `docs/approved-reference-corpus/USAGE_RULES.md`
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Located required ARC files under `docs/archive/visual-artifacts/`.
- Visually inspected required raster references for ARC-023, ARC-028, ARC-016, ARC-026, ARC-024, ARC-029, and ARC-015.
- Confirmed ARC-031 SVG cautionary artifacts are readable.
- Confirmed every manifest ARC path now resolves on disk, including the ARC-031 wildcard.
- `git diff --check`

Outcome:
- Required MVP-15A ARC references now point to inspectable archived paths in `docs/approved-reference-corpus/MANIFEST.md`.
- `README.md`, `REFERENCE_INDEX.md`, and `USAGE_RULES.md` now state that archive storage can be canonical preservation and future visual gates must use current manifest paths.
- MVP-15A now requires current manifest paths rather than hardcoded old `docs/visual-artifacts/` paths.
- No image files were duplicated or copied.
- No app/source files changed.
- App build was not run because source files did not change.
- MVP-15B is unblocked at the approved-corpus path level, but it must still complete the full MVP-15A gate before source edits.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject the next MVP-15B implementation output after browser screenshots are available.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` now points to MVP-15B Perspective Scene Renderer Replacement as the recommended next task. The MVP-15A gate remains mandatory before source edits.

### 2026-05-29 - MVP-15A Rejected Screenshot Evidence Reconciliation

Status:
- Complete.

Scope:
- Confirm rejected screenshot evidence now exists under the MVP-15A packet.
- Update MVP-15A so rejected screenshots are no longer marked as missing evidence.
- Record each screenshot path and the failure modes it documents.
- Reconcile control docs only as needed.
- Avoid app/source files, package/config changes, staging, and commit.

Files changed:
- `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/README.md`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

Verification:
- Confirmed rejected evidence files in `docs/mvp-review/mvp-15a-visual-acceptance-contract-failure-guardrails/rejected-evidence/`.
- Visually inspected the rejected evidence screenshots.
- `git diff --check`

Outcome:
- MVP-15A now lists `mvp-11-rejected-overlays.png` as evidence of screenshot-background composition with floating SVG-like storefront overlays.
- MVP-15A now lists `mvp-13-rejected-flat-storefronts.png` and `mvp-13-rejected-selected-card-flat-storefronts.png` as evidence of top-down board-game/grid intersection, flat generic storefront modules, label-driven category tiles, insufficient scene-native perspective, and correct quadrant anchoring with failed art direction.
- The Approved Corpus Compliance Gate remains intact.
- No app/source files changed.

Unresolved decisions:
- Batu/ChatGPT must accept, revise, or reject MVP-15 after browser screenshots are available.
- Batu/ChatGPT must decide how the MVP-15A corpus gate and rejected screenshot anti-references should be applied to any review or revision of pre-existing MVP-15 source work.
- Visual Polish / Optional Ambient remains blocked.

Next pointer:
- `docs/CURRENT_EXECUTION_BRIEF.md` still points to MVP-16 Perspective Scene Browser QA as the recommended next task in a browser-capable environment. No next implementation task is approved.
