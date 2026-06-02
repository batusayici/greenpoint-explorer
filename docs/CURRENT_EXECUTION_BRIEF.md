# Current Execution Brief - Auto-Advance Phase 2P Generated-Output Inspection Ergonomics

Status: Auto-advance is active for local Phase 2 implementation batches. Phase 2P Generated-Output Inspection Ergonomics is complete and the next candidate batch is Phase 2Q Missing-Evidence Contract Validation. This brief does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, or broader Greenpoint coverage.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later non-local Phase 2 or MVP gates. Codex may continue only across narrow, verified, local Phase 2 evidence/readiness batches that stay within the auto-advance authorization.

## Completed Phase 2P Output

- Added `scripts/verify-qa-inspector-source-evidence.mjs`, a local verifier for generated-output inspection ergonomics.
- The verifier loads the committed scene manifest, generated source-evidence fixture, generated coverage report, and Grillpoint Phase 2N missing-evidence contract.
- It reconstructs app-visible QA data through `loadMvpSceneFromManifest` with a stubbed raster asset path.
- It verifies that app-visible QA evidence record IDs, evidence strength, claim readiness, promotion gates, and promotion blockers match the generated coverage report.
- It verifies that the Grillpoint missing-evidence contract remains app-inspectable, remains `review_only`, and keeps storefront/facade plus entrance/frontage/geometry blocked.
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
- The app QA inspector and generated coverage report now have a local consistency verifier.

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

- `node scripts/verify-qa-inspector-source-evidence.mjs` passed with 5 targets and 5 evidence records matched.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check` passed.
- No screenshots were required or captured. This is a local generated-output/readiness verifier batch, not visual QA or MVP-29G screenshot recovery.

## Next Candidate Batch

Phase 2Q - Missing-Evidence Contract Validation:

- Keep the work review/QA-only.
- Improve local validation of the Grillpoint missing-evidence contract without changing generated claim status, visual rendering, package scripts, production schema/API boundaries, source authority, or source material.
- Candidate scope: add a small local validation path or focused assertions that verify missing-evidence contract fields cover the blocked promotion gates and preserve the must-not-claim constraints.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Marking any current record as `product_copy_ready`.
- Promoting storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, package scripts, CI, source-vendor decisions, production schemas, public APIs, package/tooling changes, or broad coverage.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Weakening promotion gates, inventing evidence, or treating review-only outputs as production-ready.
