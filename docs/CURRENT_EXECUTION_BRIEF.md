# Current Execution Brief - Phase 2H Generated Source Evidence Runtime Promotion Review Hold

Status: Phase 2H Generated Source Evidence Runtime Promotion is complete for Batu review. This brief records the completed runtime switch from the Phase 2D hand-authored source-evidence fixture to the generated Phase 2H fixture and does not open scraping, external app-code API calls, package/tooling changes, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2H generated runtime fixture, runtime promotion, parity workflow, and raw-input workflow; creative/product/scope approval; public-interface approval; architecture-boundary approval; exact facade/frontage/address/station-geometry decisions; production/public claims; source-authority decisions; and any later Phase 2 implementation gates.

## Completed Phase 2H Output

- Generated and committed `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json` from the two local raw fixtures:
  - `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
  - `src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json`
- Switched the app/runtime source-evidence import in `src/mvpPlaceData.js` from the Phase 2D hand-authored fixture to the generated Phase 2H fixture.
- Kept `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json` unchanged as the reviewed parity reference.
- Preserved loader validation and QA inspector behavior.
- Verified the generated runtime fixture still has exactly the current two evidence records:
  - `evidence-grillpoint-identity-address-review`
  - `evidence-greenpoint-g-station-context-review`
- Ran full parity against the Phase 2D reviewed fixture before and after the runtime switch.
- Preserved the missing-expected-ID failure path through `--require-all-expected true`.

## Files Changed

- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/mvpPlaceData.js`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`

## What Is Now Runtime-Loaded

- The app now loads `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json` as its source-evidence fixture.
- The generated fixture currently contains the same two reviewed evidence records as the Phase 2D reference fixture.
- The Phase 2D fixture remains committed and unchanged as the reviewed parity reference.
- The raw fixtures remain local/manual input fixtures, not scraping output, API ingestion, production source adapters, or live data.

## What Remains Hardcoded Or Blocked

- The generated fixture is review/runtime data for the current local app only; it is not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- No scraping, browser automation, network/API calls, package changes, lockfile changes, raster generation, art revision, new places, backend, CMS, analytics, deployment, CI, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, and station geometry remain unresolved or blocked.

## Verification State

Phase 2H verification completed:

- Generator happy path from Grillpoint and Greenpoint G raw fixtures to `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- Full parity pass against `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json` before the runtime switch
- Full parity pass against `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json` after the runtime switch
- Expected-fail parity check using only the Grillpoint raw fixture with `--require-all-expected true`, reporting the missing Greenpoint G runtime evidence ID
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data promotion/parity-check batch, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2H generated runtime fixture promotion.

If Batu accepts Phase 2H:

- Batu may open a later bounded Phase 2 task for generated fixture metadata refinement, generated-output inspection artifacts, raw-input expansion, fixture regression checks, or a deliberately scoped source-evidence merge/review workflow.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Adding ingestion/parity coverage beyond the current local samples, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, raw fixtures, generated fixture, manifest, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
