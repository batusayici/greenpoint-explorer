# Current Execution Brief - Phase 2L Source Evidence Quality Tiering Review Hold

Status: Phase 2K Raw Input Expansion was accepted by Batu for continuation, and Phase 2L Source Evidence Confidence/Quality Tiering is complete for Batu review. This brief records the completed evidence-strength and claim-readiness tiering for the current generated source-evidence fixture and coverage report. It does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2L quality tiers, readiness thresholds, generated runtime fixture, coverage report, source-authority decisions, creative/product/scope approval, public-interface approval, architecture-boundary approval, exact facade/frontage/address/station-geometry decisions, production/public claims, and any later Phase 2 implementation gates.

## Completed Phase 2L Output

- Added required review-only quality fields to raw and generated source-evidence records:
  - `evidenceStrength`
  - `claimReadiness`
- Conservative current classifications:
  - `reviewed`: Grillpoint Deli and Greenpoint G subway.
  - `official_location_only`: McDonald's, Dunkin', and Citizens Bank.
  - `review_only`: all five current evidence records.
  - `product_copy_ready`: zero current evidence records.
  - `blocked`: zero current evidence records.
- Updated `scripts/ingest-source-evidence-fixture.mjs` so raw inputs must include allowed quality/readiness values and generated records preserve them.
- Updated `src/sceneManifest.js` so the app-loaded source-evidence fixture validates quality/readiness fields and exposes them through target QA data.
- Updated `scripts/inspect-source-evidence-coverage.mjs` so the coverage report separates generated evidence coverage from evidence strength and claim readiness.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`.
- The coverage report still shows 5 of 5 current targets with generated evidence and 0 manifest-source-only targets.
- The coverage report now also shows 0 product-copy-ready targets, 5 review-only targets, and 0 blocked targets.
- Preserved `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json` unchanged as the reviewed parity reference.

## Files Changed

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

## Verification Commands

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true
```

```sh
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0
```

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2l.drift-regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review --expected-id evidence-mcdonalds-identity-address-review --expected-id evidence-dunkin-identity-address-review --expected-id evidence-citizens-bank-identity-address-review
```

Negative readiness check:

```sh
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output /tmp/source-evidence.coverage.phase-2l.expected-fail-product-ready.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 5 --expect-review-only-targets 0 --expect-blocked-targets 0
```

Expected-fail preserved-gap check:

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --output /tmp/source-evidence.phase-2l.expected-fail-missing-gap.json
```

## What The Phase 2L Guard Fails On

- Regenerated output differs from the committed generated runtime fixture.
- Raw/generated source-evidence records omit `evidenceStrength` or `claimReadiness`.
- Raw/generated source-evidence records use an unsupported strength or readiness value.
- The runtime fixture is missing one of the five expected evidence IDs.
- The two Phase 2D reviewed reference records no longer match the regenerated/runtime fixture.
- The coverage report no longer has 5 current targets with generated evidence and 0 manifest-source-only targets.
- The coverage report no longer has 0 product-copy-ready targets, 5 review-only targets, and 0 blocked targets.

## What Remains Hardcoded Or Blocked

- Quality tiers are conservative review-only labels for the current fixture; they are not production thresholds, public runtime schema approval, source-authority approval, or product-copy approval.
- Complete generated coverage does not imply product-copy readiness.
- The generated fixture remains review/runtime data for the current local app only; it is not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- No package script, package change, lockfile change, CI, scraping, browser automation, network/API call, raster generation, art revision, new place, backend, CMS, analytics, deployment, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, station geometry, current active/open status, hours, services, ratings, reviews, endorsement, partnership, promotions, production logo/trade-dress clearance, and official brand approval remain unresolved or blocked.

## Verification State

Phase 2L verification completed:

- Expanded generation command above passed and rewrote the generated runtime fixture with quality/readiness fields.
- Coverage regeneration command above passed with 5/5 targets linked to generated evidence, 0 manifest-source-only targets, 0 product-copy-ready targets, 5 review-only targets, and 0 blocked targets.
- Expanded drift guard command above passed against the generated runtime fixture and Phase 2D reviewed reference.
- Negative readiness check above failed as intended when asserting 5 product-copy-ready targets.
- Expected-fail parity check using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data quality/readiness-tiering batch, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2L quality tiers, readiness thresholds, generated runtime fixture, and regenerated coverage report.

If Batu accepts Phase 2L:

- Batu may open a later bounded Phase 2 task for app QA inspector surfacing of quality/readiness fields, fixture metadata refinement, generated-output inspection ergonomics, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow. Product-copy readiness thresholds, package scripts, CI, external source access, production schema/API decisions, and source-authority decisions still require an explicit later brief.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Marking any current record as `product_copy_ready`.
- Adding package scripts, CI, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, drift guard, coverage inspector, quality/readiness tiers, raw fixtures, generated fixture, manifest, coverage report, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, source authority, product-copy approval, or production asset direction.
