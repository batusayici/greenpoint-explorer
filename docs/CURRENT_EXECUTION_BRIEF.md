# Current Execution Brief - Phase 2N Grillpoint Promotion Spike Review Hold

Status: Phase 2M Evidence Promotion Gates was accepted by Batu for continuation, and Phase 2N Single-Place Evidence Promotion Spike for Grillpoint is complete for Batu review. This brief records the completed Grillpoint-only category/business-type promotion and the remaining machine-readable missing-evidence contract for storefront/facade and entrance/frontage/geometry. It does not open visual rendering changes, external source acquisition, scraping, package/tooling changes, production data, production assets, full MVP-29G screenshot QA, CI, package scripts, source-vendor decisions, or broader Greenpoint coverage.

Owner boundary: Batu owns acceptance, revision, or rejection of the Phase 2N Grillpoint promotion spike, missing-evidence contract, additive parity behavior, generated runtime fixture, coverage report, source-authority decisions, creative/product/scope approval, public-interface approval, architecture-boundary approval, exact facade/frontage/address/station-geometry decisions, production/public claims, and any later Phase 2 implementation gates.

## Completed Phase 2N Output

- Inspected the current Grillpoint raw input, generated source-evidence record, coverage report, manifest source metadata, and promotion gates.
- Added the smallest supported raw-input improvement for Grillpoint:
  - New raw claim: `claim-grillpoint-category-context`
  - Claim type: `category-context`
  - Manifest path: `places.place-grillpoint-deli.category`
  - Value: `Deli / food retail`
  - Source support already in repo: `restaurantji-grillpoint` records `category-context` support in the scene manifest source metadata.
- Promoted only Grillpoint's `categoryBusinessType` gate from `review_only` to `allowed`.
- Preserved Grillpoint `claimReadiness` as `review_only`.
- Preserved the rule that `product_copy_ready` requires all five promotion gates to be `allowed`.
- Kept storefront/facade and entrance/frontage/geometry blocked for Grillpoint and all other current targets.
- Added `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`, a machine-readable missing-evidence contract naming the required raw input types and minimum fields still needed for Grillpoint storefront/facade and entrance/frontage/geometry promotion.
- Updated additive Phase 2D parity behavior so reviewed claim mappings must still be present while additive generated claim mappings can be added in `--allow-additional-generated true` mode.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`.
- Regenerated `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`.

## Current Claim-Level Result

- Generated evidence coverage remains 5 of 5 current targets.
- Product-copy-ready targets remain 0.
- Review-only targets remain 5.
- Identity/name allowed targets remain 5.
- Category/business-type allowed targets are now 1: `grillpoint-deli`.
- Address/location allowed targets remain 4.
- Storefront/facade blocked targets remain 5.
- Entrance/frontage/geometry blocked targets remain 5.

## Files Changed

- `scripts/ingest-source-evidence-fixture.mjs`
- `src/data/source-evidence/raw/grillpoint.phase-2e.raw.json`
- `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json`
- `src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json`
- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/AGENT_HANDOFF.md`

## Verification Commands

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true
```

```sh
node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --output src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0 --expect-product-copy-ready-targets 0 --expect-review-only-targets 5 --expect-blocked-targets 0 --expect-identity-name-allowed-targets 5 --expect-category-business-type-allowed-targets 1 --expect-address-location-allowed-targets 4 --expect-storefront-facade-blocked-targets 5 --expect-entrance-frontage-geometry-blocked-targets 5
```

```sh
node -e 'const report=require("./src/data/source-evidence/grillpoint.promotion-readiness.phase-2n.json"); if(report.targetId!=="grillpoint-deli") throw new Error("wrong target"); if(report.currentPromotionGates.categoryBusinessType.status!=="allowed") throw new Error("category gate not allowed"); if(report.currentPromotionGates.storefrontFacade.status!=="blocked") throw new Error("facade gate not blocked"); if(report.currentPromotionGates.entranceFrontageGeometry.status!=="blocked") throw new Error("geometry gate not blocked"); if(!report.missingEvidenceContract.storefrontFacade.minimumRawFields.length) throw new Error("missing facade contract"); console.log("PASS Grillpoint Phase 2N report contract");'
```

```sh
node -e 'const coverage=require("./src/data/source-evidence/manhattan-greenpoint-ave.coverage.phase-2j.json"); const allowed=coverage.targets.filter(t=>t.promotionGates.categoryBusinessType.status==="allowed").map(t=>t.targetId); if(JSON.stringify(allowed)!==JSON.stringify(["grillpoint-deli"])) throw new Error(`unexpected category allowed targets: ${allowed.join(",")}`); const blockedFacade=coverage.targets.filter(t=>t.promotionGates.storefrontFacade.status==="blocked").length; const blockedGeometry=coverage.targets.filter(t=>t.promotionGates.entranceFrontageGeometry.status==="blocked").length; if(blockedFacade!==5 || blockedGeometry!==5) throw new Error("facade/geometry blockers changed"); console.log("PASS Grillpoint-only category promotion check");'
```

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2e.raw.json --input src/data/source-evidence/raw/greenpoint-g.phase-2g.raw.json --input src/data/source-evidence/raw/official-locations.phase-2k.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --output /tmp/source-evidence.phase-2n.drift-regenerated.json --verify-runtime src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --require-all-expected true --allow-additional-generated true --expected-id evidence-grillpoint-identity-address-review --expected-id evidence-greenpoint-g-station-context-review --expected-id evidence-mcdonalds-identity-address-review --expected-id evidence-dunkin-identity-address-review --expected-id evidence-citizens-bank-identity-address-review
```

Expected-fail false-promotion check:

```sh
node -e 'const fs=require("node:fs"); const fixture=JSON.parse(fs.readFileSync("src/data/source-evidence/manhattan-greenpoint-ave.generated.phase-2h.json","utf8")); fixture.records[0].claimReadiness="product_copy_ready"; fs.writeFileSync("/tmp/source-evidence.phase-2n.expected-fail-product-ready.json", JSON.stringify(fixture,null,2)+"\n");' && node scripts/inspect-source-evidence-coverage.mjs --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --evidence /tmp/source-evidence.phase-2n.expected-fail-product-ready.json --output /tmp/source-evidence.phase-2n.expected-fail-product-ready.coverage.json --expect-targets-with-evidence 5 --expect-targets-without-evidence 0
```

Expected-fail preserved-gap check:

```sh
node scripts/ingest-source-evidence-fixture.mjs --input src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json --manifest src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json --compare-to src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json --allow-additional-generated true --output /tmp/source-evidence.phase-2n.expected-fail-missing-gap.json
```

## What The Phase 2N Guard Fails On

- The generated runtime fixture no longer matches regeneration output.
- The Phase 2D reviewed claim mappings disappear from the generated Grillpoint record.
- Grillpoint's category/business-type gate is not the only category/business-type target gate promoted to `allowed`.
- Grillpoint storefront/facade or entrance/frontage/geometry becomes unblocked without the required raw evidence contract being satisfied.
- A source-evidence record is marked `product_copy_ready` while any promotion gate remains `review_only` or `blocked`.
- The runtime fixture is missing one of the five expected evidence IDs.
- The two Phase 2D reviewed reference records no longer preserve required parity.
- The coverage report no longer has 5 current targets with generated evidence and 0 manifest-source-only targets.

## What Remains Hardcoded Or Blocked

- Phase 2N improves only Grillpoint category/business-type readiness; it does not promote Grillpoint to `product_copy_ready`.
- Complete generated coverage still does not imply product-copy readiness.
- Grillpoint storefront/facade and entrance/frontage/geometry remain blocked.
- The new Grillpoint missing-evidence report is a review-only contract, not a production schema, public API, source-authority decision, or approval to use field photos.
- No other target changed promotion status except the aggregate category/business-type count reflecting Grillpoint's category improvement.
- No package script, package change, lockfile change, CI, scraping, browser automation, network/API call, raster generation, art revision, new place, backend, CMS, analytics, deployment, or broad map coverage is opened.
- Exact storefront frontage, sign geometry, entrance position, address placement, parcel/tax-lot geometry, building-footprint geometry, station geometry, current active/open status, hours, services, ratings, reviews, endorsement, partnership, promotions, production logo/trade-dress clearance, and official brand approval remain unresolved or blocked.

## Verification State

Phase 2N verification completed:

- Expanded generation command above passed and rewrote the generated runtime fixture with the Grillpoint category-context claim.
- Coverage regeneration command above passed with 5/5 targets linked to generated evidence, 0 manifest-source-only targets, 0 product-copy-ready targets, 5 review-only targets, 5 identity/name allowed targets, 1 category/business-type allowed target, 4 address/location allowed targets, 5 storefront/facade blocked targets, and 5 entrance/frontage/geometry blocked targets.
- Grillpoint missing-evidence report contract check passed.
- Grillpoint-only category promotion check passed.
- Expanded drift guard command above passed against the generated runtime fixture and Phase 2D reviewed reference.
- False-promotion check above failed as intended when one record was manually changed to `product_copy_ready` while storefront/facade and entrance/frontage/geometry gates remained blocked.
- Expected-fail parity check using `src/data/source-evidence/raw/grillpoint.phase-2f.expected-fail-missing-gap.raw.json` still fails on the omitted preserved uncertainty/gap field.
- `npm run build` passed with the existing Vite large-chunk warning.
- `git diff --check`
- `git diff --cached --check`
- `git status --short`
- `git diff --stat`

No screenshots were required or captured. This is a local data promotion-readiness spike, not a visual or full MVP-29G screenshot QA pass.

## Next Actual Work

Next recommended state:

- Batu review/acceptance, revision, or rejection of the Phase 2N Grillpoint category promotion, additive parity behavior, missing-evidence contract, generated runtime fixture, and regenerated coverage report.

If Batu accepts Phase 2N:

- Batu may open a later bounded Phase 2 task for a source-evidence raw-input shape that can represent approved facade/reference provenance, app QA inspector surfacing of promotion blockers, fixture metadata refinement, generated-output inspection ergonomics, or a deliberately scoped source-evidence merge/review workflow. Product-copy readiness, package scripts, CI, external source access, production schema/API decisions, source-authority decisions, and approval to use any field-photo reference still require an explicit later brief.

## Stop Conditions

Stop and ask Batu to open or revise the brief before:

- Marking any current record as `product_copy_ready`.
- Promoting Grillpoint storefront/facade or entrance/frontage/geometry without approved raw evidence and provenance inputs.
- Treating any current facade, frontage, entrance, geometry, exact placement, or station cue as product-copy-ready.
- Adding package scripts, CI, scraping, external app-code API calls, production source adapters, public runtime schemas, package/tooling changes, or production architecture.
- Editing raster assets, generating images, revising visual direction, adding screenshots, or opening full QA/demo freeze.
- Treating the converter, parity mode, drift guard, coverage inspector, quality/readiness tiers, promotion gates, missing-evidence report, raw fixtures, generated fixture, manifest, coverage report, or inspector as production data, a public API, exact geometry, exact address/frontage/station placement, source authority, product-copy approval, or production asset direction.
