# Current Execution Brief - Phase 2F Source Evidence Generated Fixture Parity Check Review Hold

Status: Phase 2F Source Evidence Generated Fixture Parity Check is complete for Batu review. This brief records the completed local-only parity verification step and does not open runtime fixture replacement, merge behavior, scraping, external app-code API calls, package/tooling changes, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2F parity criteria, raw-input ID alignment, expected pass/fail fixtures, and converter compare-mode behavior; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; source-authority decisions; and any later Phase 2 implementation gates.

## Completed Phase 2F Output

- Added a local compare mode to the Phase 2E source-evidence ingestion script.
- Compared generated output against the existing app-loaded Phase 2D source-evidence fixture for matching evidence IDs.
- Focused parity on review-critical fields: evidence ID, target IDs, place IDs, source title/name, source URL, evidence kind/category, usage status, supported claim mappings/copy fields, QA notes, and preserved uncertainty/gap fields.
- Updated the Grillpoint Phase 2E raw fixture so it generates the existing Phase 2D Grillpoint evidence and claim IDs.
- Added one expected-fail local raw fixture that intentionally omits a preserved uncertainty/gap field.
- Kept the Phase 2D hand-authored fixture valid and unchanged.
- Kept the app runtime import path unchanged; the app still loads the Phase 2D review fixture directly.

## Files Changed

- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Possible

- A generated local Grillpoint evidence record can be checked against the existing app-loaded Phase 2D fixture before any runtime fixture replacement is considered.
- The pass case confirms the converted Grillpoint evidence record preserves the schema-critical and review-critical fields from the Phase 2D fixture.
- The fail case confirms parity reports a clear mismatch when a preserved uncertainty/gap field is missing.

## What Remains Hardcoded Or Blocked

- The Phase 2D hand-authored fixture remains the only source-evidence fixture imported by app code.
- The converter output and parity checks are review-only local verification artifacts, not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- No scraping, browser automation, network/API calls, package changes, lockfile changes, generated app data replacement, raster generation, art revision, new places, backend, CMS, analytics, deployment, CI, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, and station geometry remain unresolved or blocked.

## Verification State

Phase 2F verification completed:

- Converter happy path from `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json` to `/tmp/grillpoint.phase-2f.generated.json`
- Parity expected-pass case comparing the generated Grillpoint record against `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`
- Parity expected-fail case using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data parity-check spike, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2F parity criteria, expected pass/fail behavior, and raw-input ID alignment.

If Batu accepts Phase 2F:

- Batu may open a later bounded Phase 2 task for complete fixture generation/merge review, expanding local raw-input fixtures, refining source-record normalization, or adding focused fixture-level regression checks.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Replacing the app-loaded Phase 2D fixture with generated output, adding merge behavior, adding ingestion/parity coverage beyond the current local samples, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, manifest, fixture, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
