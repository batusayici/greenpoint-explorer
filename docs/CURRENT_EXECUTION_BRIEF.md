# Current Execution Brief - Phase 2T Generated Fixture Determinism Check Complete

Status: Phase 2T Generated Fixture Determinism Check is complete for review. This brief records the completed local determinism verifier and does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, broader Greenpoint coverage, source-claim promotion, or product-copy readiness.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, exact facade/frontage/address/station-geometry decisions, production/public claims, visual acceptance, and any later Phase 2 or MVP gates.

## Completed Phase 2T Output

- Added `scripts/verify-source-evidence-determinism.mjs` as a local verifier for generated source-evidence fixture reproducibility.
- The verifier regenerates the current combined source-evidence fixture twice from the active raw inputs and scene manifest.
- The verifier compares the two regenerated outputs byte-for-byte to confirm repeated generation is stable.
- The verifier compares regenerated output against the committed generated runtime fixture at `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`.
- The verifier keeps generated temporary outputs only on failure and prints line/column mismatch diagnostics for determinism or committed-fixture drift failures.
- The verifier reuses the existing generator path and reviewed Phase 2D parity reference instead of adding package scripts, CI, new ingestion paths, source claims, promotion changes, screenshots, visual rendering changes, or external access.

## Current Determinism Result

- Repeated generation from the active raw inputs is byte-identical.
- Regenerated output matches the committed generated runtime fixture.
- The active generator remains `scripts/ingest-source-evidence-fixture.mjs`.
- The active raw inputs remain:
  - `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
  - `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
  - `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`
- The active scene manifest remains `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`.
- Product-copy-ready targets remain 0.
- All generated evidence records remain review-only.
- Storefront/facade and entrance/frontage/geometry promotion blockers remain unchanged.

## Files Changed

- `scripts/verify-source-evidence-determinism.mjs`
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

- `node scripts/verify-source-evidence-determinism.mjs` passed and confirmed regenerated output is stable across repeated runs and matches the committed generated fixture.
- `node scripts/verify-qa-inspector-source-evidence.mjs` passed and preserved the source-evidence / QA inspector contract.
- `node scripts/verify-qa-inspector-source-evidence.mjs --self-test-negative-contract true` passed and preserved the negative guardrail behavior.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check` passed.
- No screenshots were required or captured. This is a local generated-fixture determinism batch, not visual QA or MVP-29G screenshot recovery.

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
