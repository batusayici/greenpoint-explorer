# Current Execution Brief - Phase 2E Source Evidence Ingestion Spike Review Hold

Status: Phase 2E Source Evidence Ingestion Spike is complete for Batu review. This brief records the completed local-only ingestion spike and does not open scraping, external app-code API calls, package/tooling changes, source-evidence replacement in the app runtime, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2E raw-input shape and converter behavior; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; source-authority decisions; and any later Phase 2 implementation gates.

## Completed Phase 2E Output

- Added a local-only converter script that reads one raw source-evidence input fixture and emits the existing `source-evidence-fixture.v0.1` JSON shape.
- Added one sample local raw Grillpoint input fixture.
- Kept the existing Phase 2D hand-authored fixture valid and unchanged.
- Kept the app runtime import path unchanged; the app still loads the Phase 2D review fixture directly.
- Added required-field validation for raw fixture metadata, record identity, target/place/source links, source details, confidence, claims, QA notes, and remaining gaps.
- Added manifest reference validation for converted target IDs, place IDs, and source record IDs.
- Verified a deliberate missing-field failure for `source.url`.

## Files Changed

- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Possible

- A local raw Grillpoint evidence record can be converted offline into the same source-evidence JSON shape used by the Phase 2D fixture.
- The converter can write generated output to a review path outside the app runtime, such as `/tmp/grillpoint.phase-2e.generated.json`.
- Missing required raw evidence fields fail with a specific error before output is written.
- Converted records are checked against the current manifest's app target IDs, place IDs, and source IDs.

## What Remains Hardcoded Or Blocked

- The Phase 2D hand-authored fixture remains the only source-evidence fixture imported by app code.
- The converter output is a review-only partial ingestion artifact, not a production ingestion pipeline, source normalization service, public runtime schema, public data API, or full Greenpoint data workflow.
- No scraping, browser automation, network/API calls, package changes, lockfile changes, generated app data replacement, raster generation, art revision, new places, backend, CMS, analytics, deployment, CI, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, and station geometry remain unresolved or blocked.

## Verification State

Phase 2E verification completed:

- Converter happy path from `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json` to `/tmp/grillpoint.phase-2e.generated.json`
- Deliberate missing-field failure for raw `source.url`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data-ingestion spike, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2E raw-input shape, converter behavior, and partial-output boundary.

If Batu accepts Phase 2E:

- Batu may open a later bounded Phase 2 task for merging converted local records into a complete review fixture, expanding the local raw-input fixture set, refining source-record normalization, or adding focused fixture-level regression checks.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Replacing the app-loaded Phase 2D fixture with generated output, adding merge behavior, adding ingestion coverage beyond the one local sample fixture, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, manifest, fixture, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
