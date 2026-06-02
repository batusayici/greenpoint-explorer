# Current Execution Brief - Phase 2K Raw Input Expansion Review Hold

Status: Phase 2J Source Evidence Coverage Inspector was accepted by Batu for continuation, and Phase 2K Raw Input Expansion + First Evidence Ingestion Slice is complete for Batu review. This brief records the completed review-only raw-input expansion for the three Phase 2J manifest-source-only targets and the regenerated generated source-evidence fixture/coverage report. It does not open scraping, external app-code API calls, package/tooling changes, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2K official-location raw-input slice, expanded generated runtime fixture, additive parity behavior, coverage report, source-authority decisions, creative/product/scope approval, public-interface approval, architecture-boundary approval, exact facade/frontage/address/station-geometry decisions, production/public claims, and any later Phase 2 implementation gates.

## Completed Phase 2K Output

- Added `src/data/source-evidence/raw/official-locations.phase-2k.raw.json`.
- The new raw fixture uses only official-location source context already recorded in the scene manifest.
- Added one review-only identity/address evidence record each for:
  - `mcdonalds`
  - `dunkin`
  - `citizens-bank`
- Restricted all three new records to business/branch identity and address-context support for review-only card copy.
- Preserved explicit gaps for exact facade geometry, storefront frontage/order, entrance placement, address placement, production trade-dress/logo clearance, active/open-now status, hours, ratings, reviews, services, endorsement, partnership, promotions, and the Dunkin MVP-only visual exception boundary.
- Extended `scripts/ingest-source-evidence-fixture.mjs` with `--allow-additional-generated true` so the Phase 2D reviewed parity fixture can continue guarding the reviewed reference records while allowing additional generated records in the Phase 2H runtime fixture.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json` from the two existing raw inputs plus the new Phase 2K raw input.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`; coverage is now 5 of 5 current targets with linked generated source-evidence records and 0 manifest-source-only targets.
- Preserved `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json` unchanged as the reviewed parity reference.
- Preserved the generated runtime fixture direction at the existing app-loaded path.

## Files Changed

- `scripts/ingest-source-evidence-fixture.mjs`
- `scripts/inspect-source-evidence-coverage.mjs`
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
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0
```

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2k.drift-regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review --expected-id evidence-mcdonalds-identity-address-review --expected-id evidence-dunkin-identity-address-review --expected-id evidence-citizens-bank-identity-address-review
```

Expected-fail check:

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --output /tmp/source-evidence.phase-2k.expected-fail.json
```

## What The Phase 2K Guard Fails On

- Regenerated output differs from the committed generated runtime fixture.
- The runtime fixture is missing one of the five expected evidence IDs.
- The runtime fixture contains an unexpected evidence ID.
- The runtime fixture contains duplicate evidence IDs.
- The two Phase 2D reviewed reference records no longer match the regenerated/runtime fixture.
- The coverage report no longer has 5 current targets with generated evidence and 0 manifest-source-only targets.

## What Remains Hardcoded Or Blocked

- The new raw fixture is a local/manual review input built from already-recorded manifest source context; it is not scraping output, API ingestion, live data, a production source adapter, or a source-authority decision.
- The generated fixture remains review/runtime data for the current local app only; it is not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, or full Greenpoint data workflow.
- The Phase 2D hand-authored fixture remains the reviewed parity reference.
- No package script, package change, lockfile change, CI, scraping, browser automation, network/API call, raster generation, art revision, new place, backend, CMS, analytics, deployment, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, station geometry, current active/open status, hours, services, ratings, reviews, endorsement, partnership, promotions, production logo/trade-dress clearance, and official brand approval remain unresolved or blocked.

## Verification State

Phase 2K verification completed:

- Expanded generation command above passed and rewrote the generated runtime fixture with five records.
- Coverage regeneration command above passed with 5/5 targets linked to generated evidence and 0 manifest-source-only targets.
- Expanded drift guard command above passed against the generated runtime fixture and Phase 2D reviewed reference.
- Temp-output coverage verification passed with 5/5 targets linked to generated evidence and 0 manifest-source-only targets.
- Expected-fail parity check using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data raw-input/evidence-generation batch, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2K raw-input expansion, additive parity behavior, expanded generated runtime fixture, and regenerated coverage report.

If Batu accepts Phase 2K:

- Batu may open a later bounded Phase 2 task for fixture metadata refinement, generated-output inspection ergonomics, app QA inspector surfacing of expanded evidence, a narrow manual-input checklist, or a deliberately scoped source-evidence merge/review workflow. Package scripts, CI, external source access, production schema/API decisions, and source-authority decisions still require an explicit later brief.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Adding package scripts, CI, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, drift guard, coverage inspector, raw fixtures, generated fixture, manifest, coverage report, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, source authority, or production asset direction.
