# Current Execution Brief - Phase 2M Evidence Promotion Gates Review Hold

Status: Phase 2L Source Evidence Quality Tiering was accepted by Batu for continuation, and Phase 2M Evidence Promotion Gates is complete for Batu review. This brief records the completed claim-level promotion gates for the current generated source-evidence fixture and coverage report. It does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2M promotion gates, product-copy promotion criteria, generated runtime fixture, coverage report, source-authority decisions, creative/product/scope approval, public-interface approval, architecture-boundary approval, exact facade/frontage/address/station-geometry decisions, production/public claims, and any later Phase 2 implementation gates.

## Completed Phase 2M Output

- Added required claim-level `promotionGates` to raw and generated source-evidence records for:
  - `identityName`
  - `categoryBusinessType`
  - `addressLocation`
  - `storefrontFacade`
  - `entranceFrontageGeometry`
- Defined gate statuses:
  - `allowed`
  - `review_only`
  - `blocked`
- Enforced the conservative promotion rule:
  - A record cannot be `product_copy_ready` unless all five promotion gates are `allowed`.
- Current conservative classifications:
  - identity/name: 5 allowed targets.
  - category/business-type: 5 review-only targets.
  - address/location: 4 allowed targets and 1 review-only target.
  - storefront/facade: 5 blocked targets.
  - entrance/frontage/geometry: 5 blocked targets.
  - product-copy-ready: zero current evidence records and zero current targets.
  - review-only: all five current evidence records and all five current targets.
- Updated `scripts/ingest-source-evidence-fixture.mjs` so raw inputs must include complete promotion gates and generated records preserve them.
- Updated `src/sceneManifest.js` so the app-loaded source-evidence fixture validates promotion gates and rejects invalid `product_copy_ready` records.
- Updated `scripts/inspect-source-evidence-coverage.mjs` so the coverage report includes the reusable promotion-gate definition, record-level gate counts, target-level gate counts, and per-target promotion blockers.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`.
- The coverage report still shows 5 of 5 current targets with generated evidence and 0 manifest-source-only targets.
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
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 0 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5
```

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2m.drift-regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review --expected-id evidence-mcdonalds-identity-address-review --expected-id evidence-dunkin-identity-address-review --expected-id evidence-citizens-bank-identity-address-review
```

Expected-fail false-promotion check:

```sh
node -e 'const fs=require("node:fs"); const fixture=JSON.parse(fs.readFileSync("src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json","utf8")); fixture.records[0].claimReadiness="product_copy_ready"; fs.writeFileSync("/tmp/source-evidence.phase-2m.expected-fail-product-ready.json", JSON.stringify(fixture,null,2)+"\n");' && node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence /tmp/source-evidence.phase-2m.expected-fail-product-ready.json --output /tmp/source-evidence.phase-2m.expected-fail-product-ready.coverage.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0
```

Expected-fail preserved-gap check:

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --output /tmp/source-evidence.phase-2m.expected-fail-missing-gap.json
```

## What The Phase 2M Guard Fails On

- Regenerated output differs from the committed generated runtime fixture.
- Raw/generated source-evidence records omit `promotionGates`.
- Raw/generated source-evidence records omit any required promotion claim key.
- Raw/generated source-evidence records use unsupported gate statuses.
- A `review_only` or `blocked` gate omits `neededEvidence`.
- A source-evidence record is marked `product_copy_ready` while any promotion gate remains `review_only` or `blocked`.
- The runtime fixture is missing one of the five expected evidence IDs.
- The two Phase 2D reviewed reference records no longer match the regenerated/runtime fixture.
- The coverage report no longer has 5 current targets with generated evidence and 0 manifest-source-only targets.
- The coverage report no longer has 0 product-copy-ready targets, 5 review-only targets, 5 storefront/facade blocked targets, and 5 entrance/frontage/geometry blocked targets.

## What Remains Hardcoded Or Blocked

- Promotion gates are conservative review-only safety checks for the current fixture; they are not production thresholds, public runtime schema approval, source-authority approval, product-copy approval, or final source hierarchy.
- Complete generated coverage still does not imply product-copy readiness.
- Category/business-type remains review-only for all five current targets until explicit category/service copy evidence or an approved manual review row exists.
- Storefront/facade and entrance/frontage/geometry claims remain blocked for all five current targets.
- The generated fixture remains review/runtime data for the current local app only; it is not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- No package script, package change, lockfile change, CI, scraping, browser automation, network/API call, raster generation, art revision, new place, backend, CMS, analytics, deployment, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, station geometry, current active/open status, hours, services, ratings, reviews, endorsement, partnership, promotions, production logo/trade-dress clearance, and official brand approval remain unresolved or blocked.

## Verification State

Phase 2M verification completed:

- Expanded generation command above passed and rewrote the generated runtime fixture with promotion gates.
- Coverage regeneration command above passed with 5/5 targets linked to generated evidence, 0 manifest-source-only targets, 0 product-copy-ready targets, 5 review-only targets, 5 identity/name allowed targets, 0 category/business-type allowed targets, 4 address/location allowed targets, 5 storefront/facade blocked targets, and 5 entrance/frontage/geometry blocked targets.
- Expanded drift guard command above passed against the generated runtime fixture and Phase 2D reviewed reference.
- False-promotion check above failed as intended when one record was manually changed to `product_copy_ready` while gates remained `review_only` or `blocked`.
- Expected-fail parity check using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` still fails on the omitted preserved uncertainty/gap field.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data promotion-gate batch, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2M promotion gates, product-copy gate rule, generated runtime fixture, and regenerated coverage report.

If Batu accepts Phase 2M:

- Batu may open a later bounded Phase 2 task for app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow. Product-copy readiness thresholds, package scripts, CI, external source access, production schema/API decisions, and source-authority decisions still require an explicit later brief.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Marking any current record as `product_copy_ready`.
- Treating any current category, facade, frontage, entrance, geometry, exact placement, or station cue as product-copy-ready.
- Adding package scripts, CI, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, drift guard, coverage inspector, quality/readiness tiers, promotion gates, raw fixtures, generated fixture, manifest, coverage report, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, source authority, product-copy approval, or production asset direction.
