# Current Execution Brief - Phase 2G Complete Source Evidence Generation Parity Review Hold

Status: Phase 2G Complete Source Evidence Generation Parity is complete for Batu review. This brief records the completed local-only full current-evidence generation/parity step and does not open runtime fixture replacement, merge behavior, scraping, external app-code API calls, package/tooling changes, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2G two-record raw-input set, combined generation behavior, full-set parity criteria, expected pass/fail commands, and converter compare-mode behavior; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; source-authority decisions; and any later Phase 2 implementation gates.

## Completed Phase 2G Output

- Added a local raw input fixture for the Greenpoint Ave G station evidence record.
- Extended the local source-evidence ingestion script to combine repeated `--input` fixtures into one generated source-evidence fixture.
- Ensured generated output can include both current Phase 2D evidence records:
  - `evidence-grillpoint-identity-address-review`
  - `evidence-greenpoint-g-station-context-review`
- Extended parity mode with `--require-all-expected true` so it fails when an expected runtime evidence ID is missing from generated output.
- Preserved parity checks for target IDs, place IDs, source title/name, source URL, evidence kind/category, usage status, supported claim mappings/copy fields, QA notes, and preserved uncertainty/gap fields.
- Kept the Phase 2D hand-authored fixture valid and unchanged.
- Kept the app runtime import path unchanged; the app still loads the Phase 2D review fixture directly.

## Files Changed

- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Possible

- Local raw inputs can generate a two-record source-evidence fixture matching the complete current app-loaded Phase 2D evidence set.
- Full-set parity can confirm the generated fixture includes every runtime evidence ID currently present in the Phase 2D fixture.
- Full-set parity reports a clear failure when `evidence-greenpoint-g-station-context-review` or another expected runtime evidence ID is missing.

## What Remains Hardcoded Or Blocked

- The Phase 2D hand-authored fixture remains the only source-evidence fixture imported by app code.
- The converter output and parity checks are review-only local verification artifacts, not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- No scraping, browser automation, network/API calls, package changes, lockfile changes, generated app data replacement, raster generation, art revision, new places, backend, CMS, analytics, deployment, CI, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, and station geometry remain unresolved or blocked.

## Verification State

Phase 2G verification completed:

- Converter happy path from Grillpoint and Greenpoint G raw fixtures to `/tmp/source-evidence.phase-2g.generated.json`
- Full parity expected-pass case comparing the generated two-record fixture against `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`
- Full parity expected-fail case using only the Grillpoint raw fixture with `--require-all-expected true`, reporting the missing Greenpoint G runtime evidence ID
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data generation/parity-check spike, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2G complete current-evidence raw-input set, combined generation behavior, and full-set parity criteria.

If Batu accepts Phase 2G:

- Batu may open a later bounded Phase 2 task for fixture generation/merge review, generated-output inspection artifacts, expanding local raw-input fixtures, refining source-record normalization, or adding focused fixture-level regression checks.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Replacing the app-loaded Phase 2D fixture with generated output, adding merge behavior, adding ingestion/parity coverage beyond the current local samples, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, manifest, fixture, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
