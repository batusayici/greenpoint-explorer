# Current Execution Brief - Phase 2I Source Evidence Drift Guard Review Hold

Status: Phase 2I Source Evidence Drift Guard is complete for Batu review. This brief records the completed local verification guard for the generated Phase 2H runtime source-evidence fixture and does not open scraping, external app-code API calls, package/tooling changes, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2I drift guard, generated runtime fixture workflow, parity workflow, and raw-input workflow; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; source-authority decisions; and any later Phase 2 implementation gates.

## Completed Phase 2I Output

- Added a local `--verify-runtime` guard mode to `scripts/ingest-source-evidence-fixture.mjs`.
- The guard regenerates source evidence from current raw fixtures to a temp output path and does not rewrite the committed runtime fixture.
- The guard compares regenerated output against `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`.
- The guard checks the runtime fixture has exactly the expected current evidence IDs:
  - `evidence-grillpoint-identity-address-review`
  - `evidence-greenpoint-g-station-context-review`
- The guard runs full parity between the runtime fixture and the Phase 2D reviewed reference fixture.
- Preserved the existing expected-fail parity fixture/check for the missing preserved-gap case.

## Files Changed

- `scripts/ingest-source-evidence-fixture.mjs`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## Verification Command

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2i.regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review
```

## What The Guard Fails On

- Regenerated output differs from the committed Phase 2H runtime fixture.
- Runtime fixture is missing an expected evidence ID.
- Runtime fixture contains an unexpected evidence ID.
- Runtime fixture contains duplicate evidence IDs.
- Runtime fixture parity against the Phase 2D reviewed reference fails.

## What Remains Hardcoded Or Blocked

- The generated fixture remains review/runtime data for the current local app only; it is not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- Raw fixtures remain local/manual input fixtures, not scraping output, API ingestion, production source adapters, or live data.
- No package script, package change, lockfile change, scraping, browser automation, network/API call, raster generation, art revision, new place, backend, CMS, analytics, deployment, CI, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, and station geometry remain unresolved or blocked.

## Verification State

Phase 2I verification completed:

- Drift guard command above passed.
- Expected-fail parity check using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data drift-guard batch, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2I source-evidence drift guard.

If Batu accepts Phase 2I:

- Batu may open a later bounded Phase 2 task for generated fixture metadata refinement, package-script/CI discussion, generated-output inspection artifacts, raw-input expansion, fixture regression checks, or a deliberately scoped source-evidence merge/review workflow.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Adding package scripts, CI, ingestion/parity coverage beyond the current local samples, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, drift guard, raw fixtures, generated fixture, manifest, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
