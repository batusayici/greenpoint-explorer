# Current Execution Brief - Phase 2U Promotion Readiness Contract Complete

Status: Phase 2U Promotion Readiness Contract is complete for review. This brief records the completed local promotion-readiness contract strengthening and does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, broader Greenpoint coverage, source-claim promotion, or product-copy readiness.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Completed Phase 2U Output

- Added an explicit `promotionReadinessContract` object to `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`.
- The contract now machine-records that `product_copy_ready` requires all five promotion gates to be `allowed`.
- The contract now machine-records gate-promotion prerequisites: non-empty supporting claims, satisfied missing-evidence contract, approved raw evidence input, and local verifier pass.
- The contract now records Grillpoint's current blocked promotion gates as `storefrontFacade` and `entranceFrontageGeometry`.
- The remaining Grillpoint missing-evidence contract entries now explicitly record `currentlySatisfied: false` and a promotion-blocked reason.
- Strengthened `scripts/verify-qa-inspector-source-evidence.mjs` to validate the new contract fields and reject unsupported promotion attempts during the existing negative self-test.
- Did not add package scripts, package tooling, CI, source claims, promotion changes, screenshots, visual rendering changes, raw input expansion, generated fixture changes, or external access.

## Current Promotion Readiness Result

- Grillpoint remains `review_only`.
- Grillpoint `productCopyReady` remains `false`.
- Grillpoint identity/name, category/business-type, and address/location gates remain `allowed`.
- Grillpoint storefront/facade remains `blocked` and explicitly unsatisfied.
- Grillpoint entrance/frontage/geometry remains `blocked` and explicitly unsatisfied.
- Product-copy-ready targets remain 0.
- All generated evidence records remain review-only.
- The local negative self-test now confirms unsupported product-copy promotion and unsupported storefront/facade gate promotion fail locally.

## Files Changed

- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`
- `scripts/verify-qa-inspector-source-evidence.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

## Verification Commands

```sh
node scripts/verify-source-evidence-determinism.mjs
```

```sh
node scripts/verify-qa-inspector-source-evidence.mjs
```

```sh
node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true
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

- `node scripts/verify-source-evidence-determinism.mjs` passed and confirmed regenerated output remains stable and matches the committed generated fixture.
- `node scripts/verify-qa-inspector-source-evidence.mjs` passed and validated the strengthened promotion-readiness contract.
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true` passed and confirmed guardrail removal plus unsupported promotion attempts are rejected.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check` passed.
- No screenshots were required or captured. This is a local promotion-readiness contract batch, not visual QA or MVP-29G screenshot recovery.

## Next State

- The next executable task is pending Batu or a later explicit brief.
- Safe candidate areas remain fixture metadata refinement, generated-output inspection ergonomics, missing-evidence contract validation, schema/report verification improvements, or narrow local verifier improvements, but no further batch is opened by this brief.

## Stop Conditions

Stop and write `NEEDS_BATU` before:

- Marking any current record as `product_copy_ready`.
- Promoting storefront/facade, entrance/frontage/geometry, exact address placement, exact station geometry, exact facade, or production card claims.
- Adding external source acquisition, scraping, browser automation for external evidence, APIs, package scripts, CI, source-vendor decisions, production schemas, public APIs, package/tooling changes, or broad coverage.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full MVP-29G/MVP-30 QA/demo freeze.
- Weakening promotion gates, inventing evidence, or treating review-only outputs as production-ready.
