# Current Execution Brief - Phase 2J Source Evidence Coverage Inspector Review Hold

Status: Phase 2I Source Evidence Drift Guard was accepted by Batu for continuation, and Phase 2J Source Evidence Coverage Inspector is complete for Batu review. This brief records the completed local coverage inspector for the current scene manifest and Phase 2H generated runtime source-evidence fixture. It does not open scraping, external app-code API calls, package/tooling changes, raster/visual revisions, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2J coverage report, generated runtime fixture workflow, raw-input expansion priorities, source-authority decisions, creative/product/scope approval, public-interface approval, architecture-boundary approval, exact facade/frontage/address/station-geometry decisions, production/public claims, and any later Phase 2 implementation gates.

## Completed Phase 2J Output

- Added `scripts/inspect-source-evidence-coverage.mjs`.
- The inspector validates the current scene manifest through `validateSceneManifest`.
- The inspector validates the Phase 2H generated runtime source-evidence fixture through `validateSourceEvidenceFixture`.
- The inspector joins manifest targets, places, anchors, source refs, and generated source-evidence records.
- The inspector emits a deterministic review-only coverage report at `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`.
- The report shows that 2 of 5 current targets have linked generated source-evidence records:
  - `grillpoint-deli`
  - `greenpoint-g-subway`
- The report shows that 3 of 5 current targets remain manifest-source-only candidates for future raw-input expansion:
  - `mcdonalds`
  - `dunkin`
  - `citizens-bank`
- The report carries forward manifest QA missing-data, ambiguity, blocked-claim, unprovenanced-claim, and hidden-manual-fix status.
- Preserved the Phase 2D reviewed parity fixture unchanged.
- Preserved the Phase 2H generated fixture/runtime direction unchanged.

## Files Changed

- `scripts/inspect-source-evidence-coverage.mjs`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

## Verification Commands

```sh
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3
```

```sh
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output /tmp/source-evidence.coverage.phase-2j.verify.json --expect-targets-with-evidence 2 --expect-targets-without-evidence 3
```

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2j.drift-regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review
```

Expected-fail check:

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --output /tmp/source-evidence.phase-2j.expected-fail.json
```

## What The Coverage Inspector Fails On

- The scene manifest fails validation.
- The source-evidence fixture fails validation against the scene manifest.
- A generated source-evidence record is not linked to any current manifest target.
- Optional expected target-coverage counts do not match the report.

## What Remains Hardcoded Or Blocked

- The coverage report is review-only inspection data for the current local app scene; it is not a production ingestion pipeline, source normalization service, public runtime schema, public data API, fixture merge system, source-priority decision, or full Greenpoint data workflow.
- The Phase 2H generated runtime fixture remains the app-loaded source-evidence fixture.
- The Phase 2D hand-authored fixture remains the reviewed parity reference.
- Raw fixtures remain local/manual input fixtures, not scraping output, API ingestion, production source adapters, or live data.
- No package script, package change, lockfile change, CI, scraping, browser automation, network/API call, raster generation, art revision, new place, backend, CMS, analytics, deployment, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, and station geometry remain unresolved or blocked.

## Verification State

Phase 2J verification completed:

- Coverage inspector command above passed and wrote `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`.
- Temp-output coverage verification passed.
- Phase 2I drift guard still passed against the Phase 2H runtime fixture and Phase 2D reviewed reference.
- Expected-fail parity check using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` still fails on the omitted preserved uncertainty/gap field.
- `npm run build`
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data coverage-inspection batch, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2J source-evidence coverage inspector and report.

If Batu accepts Phase 2J:

- Batu may open a later bounded Phase 2 task for one of the manifest-source-only targets, most safely a single new local raw-input fixture plus parity/coverage update for `mcdonalds`, `dunkin`, or `citizens-bank`, using only already-recorded manifest source refs and without adding external access, scraping, production claims, or exact geometry.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Adding package scripts, CI, ingestion/parity coverage beyond one explicitly bounded target, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, drift guard, coverage inspector, raw fixtures, generated fixture, manifest, coverage report, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, or production asset direction.
