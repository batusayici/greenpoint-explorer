# Current Execution Brief - Auto-Advance Phase 2Q Missing-Evidence Contract Validation

Status: Auto-advance is active for local Phase 2 implementation batches. Phase 2Q Missing-Evidence Contract Validation is complete and the next candidate batch is Phase 2R Verifier Negative Smoke Check. This brief does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, or broader Greenpoint coverage.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later non-local Phase 2 or MVP gates. Codex may continue only across narrow, verified, local Phase 2 evidence/readiness batches that stay within the auto-advance authorization.

## Completed Phase 2Q Output

- Strengthened `scripts/verify-qa-inspector-source-evidence.mjs` with missing-evidence contract validation.
- Verified the Grillpoint report schema, partial-promotion outcome, review-only readiness, and product-copy-not-ready status.
- Verified that Grillpoint missing-evidence contract keys cover the currently blocked promotion gates.
- Verified that blocked gate contract entries have `requiredForGateStatus`, matching `currentStatus`, non-empty `requiredRawInputTypes`, non-empty `minimumRawFields`, and non-empty `mustNotClaim` guardrails.
- Verified that the storefront/facade contract preserves required must-not-claim guardrails for exact facade and production asset readiness.
- Verified that the entrance/frontage/geometry contract preserves required must-not-claim guardrails for exact entrance position, exact address placement, and production placement readiness.
- Did not add package scripts, package tooling, CI, source claims, promotion changes, screenshots, visual rendering changes, or external access.

## Current Claim-Level Result

- Generated evidence coverage remains 5 of 5 current targets.
- Product-copy-ready targets remain 0.
- Review-only targets remain 5.
- Identity/name allowed targets remain 5.
- Category/business-type allowed targets remain 1: `grillpoint-deli`.
- Address/location allowed targets remain 4.
- Storefront/facade blocked targets remain 5.
- Entrance/frontage/geometry blocked targets remain 5.
- The app QA inspector, generated coverage report, and Grillpoint missing-evidence contract now share a local consistency verifier with contract-shape checks.

## Files Changed

- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

## Verification Commands

```sh
node scripts/verify-qa-inspector-source-evidence.mjs
```

```sh
npm run build
```

Additional pre-commit checks:

```sh
git diff --check
git status --short
git diff --stat
```

## Verification State

- `node scripts/verify-qa-inspector-source-evidence.mjs` passed with 5 targets and 5 evidence records matched, and Grillpoint contract shape validated.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check` passed.
- No screenshots were required or captured. This is a local missing-evidence contract validation batch, not visual QA or MVP-29G screenshot recovery.

## Next Candidate Batch

Phase 2R - Verifier Negative Smoke Check:

- Keep the work review/QA-only.
- Improve confidence that the local verifier fails when a contract guardrail is removed, without changing generated claim status, visual rendering, package scripts, production schema/API boundaries, source authority, or source material.
- Candidate scope: add a focused expected-fail command or temporary-fixture smoke check that removes one Grillpoint `mustNotClaim` guardrail and confirms the verifier rejects it.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Marking any current record as `product_copy_ready`.
- Promoting storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, package scripts, CI, source-vendor decisions, production schemas, public APIs, package/tooling changes, or broad coverage.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Weakening promotion gates, inventing evidence, or treating review-only outputs as production-ready.
