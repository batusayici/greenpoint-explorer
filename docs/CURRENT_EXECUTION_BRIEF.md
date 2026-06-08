# Current Execution Brief - Phase 4H-1 Facade Evidence Intake Workflow Contract Open

Status: `4G-A: Geometry Source Audit for NYC 3D / CityGML / 3DCityDB` and `4G-B: Facade Evidence Source Audit for Mapillary/KartaView` are complete and verified inside Batu's bounded Phase 4G follow-on packet.

Current executable batch: `4H-1: Facade Evidence Intake Workflow Contract`.

Pre-authorized queue: none.

Self-advance allowed: no further self-advance beyond 4H-1. Stop at packet end for Batu review.

Hard Batu gate: stop at the end of 4H-1, or earlier if any stop condition below is hit.

Owner boundary: Batu owns source approval, usage-rights acceptance, source promotion, claim-level promotion, production/public claims, geometry-confidence acceptance, facade/storefront/frontage/entrance evidence acceptance, exact business/storefront/frontage/entrance/address/signage/tenant claims, credential/API approval, architecture-boundary approval, visual-system/art-direction work, and final packet review. Codex owns review-only workflow-contract artifacts, verifier work, concise control-doc reconciliation, and batch-sized commits inside the approved packet.

## Packet Goal

Open and execute three source-safe batches:

1. `4G-A`: audit NYC 3D / CityGML / 3DCityDB as geometry-confidence candidates only. Complete.
2. `4G-B`: audit Mapillary/KartaView as candidate facade/storefront evidence lanes only. Complete.
3. `4H-1`: define the source-safe facade evidence intake workflow contract. Current.

All outputs are review-only and non-production.

## Completed 4G-A Result

What changed:

- Added `docs/phase-4g-a-geometry-source-audit.md`.
- Added `src/data/source-audits/greenpoint-ave-manhattan-to-franklin.phase-4g-a-geometry-source-audit.v0.1.json`.
- Added `scripts/verify-phase-4g-a-geometry-source-audit.mjs`.
- Reviewed public documentation only for NYC 3D, CityGML, 3DCityDB, NYC Open Data public policies, and NYC.gov terms.
- Recorded NYC 3D as a plausible future review-only geometry-confidence candidate for building heights, massing, roof volumes, block gaps, and geometry-container review.
- Recorded CityGML as a plausible standard/schema lane for interpreting future geometry records.
- Recorded 3DCityDB as a plausible future tooling path only, blocked behind later architecture/dependency approval.

Preserved boundaries:

- No source data download, cache, ingestion, conversion, extraction, render use, runtime use, normal-mode exposure, production use, new dependency, credential, paid API, or architecture change.
- No storefront, facade appearance, tenant, signage, entrance, active-business, business-assignment, exact-address, production, or normal-mode claims.
- NYC 3D / CityGML / 3DCityDB remain candidate geometry-confidence lanes only, not source approval.

Verification completed:

- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

## Completed 4G-B Result

What changed:

- Added `docs/phase-4g-b-facade-evidence-source-audit.md`.
- Added `src/data/source-audits/greenpoint-ave-manhattan-to-franklin.phase-4g-b-facade-evidence-source-audit.v0.1.json`.
- Added `scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`.
- Reviewed public documentation only for Mapillary and KartaView licensing, metadata, coverage, API, and attribution/display/cache feasibility.
- Recorded Mapillary and KartaView as plausible future review-only facade evidence lane candidates.
- Recorded Mapillary API/terms as incomplete in this audit environment because developer/API terms were login-gated.
- Recorded CC BY-SA attribution/share-alike considerations for future Batu acceptance before any source use.

Preserved boundaries:

- No imagery access, API call, download, cache, ingestion, extraction, render use, texture use, training use, runtime use, normal-mode exposure, production use, new dependency, credential, paid API, or architecture change.
- No business identity, active status, tenant frontage, storefront anchor approval, exact frontage/order, exact entrance ownership, exact sign text/logo/trade dress, material/color truth, exact-address, production, normal-mode, or public/product claims.
- Mapillary/KartaView remain candidate facade-evidence lanes only, not source approval.

Verification completed:

- `node scripts/verify-phase-4g-b-facade-evidence-source-audit.mjs`
- `node scripts/verify-phase-4g-a-geometry-source-audit.mjs`
- `node scripts/verify-phase-4g-source-policy-contract.mjs`
- `git diff --check`

## 4H-1 Scope

Allowed:

- Define the source-safe facade evidence intake workflow:
  - evidence record shape;
  - provenance fields;
  - allowed claim levels;
  - review statuses;
  - storage/cache/display rules;
  - blocked-claim behavior;
  - verifier requirements.
- Use 4G-A and 4G-B audit outputs as review-only context.
- Add docs, review-only fixture/contract records, and verifier checks as needed.

Blocked:

- No real imagery intake.
- No source promotion.
- No production use.
- No normal-mode exposure.
- No business linkage.
- No exact storefront, frontage, entrance, address, signage, tenant, or active-business claim.
- No source-derived textures.
- No model training.
- No credential, paid API, dependency, runtime, renderer, or architecture work.

## Global Packet Blocks

- No production use.
- No normal-mode exposure.
- No business linkage.
- No exact storefront, frontage, entrance, address, signage, tenant, or active-business claims.
- No source-derived textures.
- No model training.
- No Google Street View / Google 3D Tiles use beyond previously approved benchmark-only discussion.
- No Qwen/Oxen visual-system work.
- No new paid APIs or credentials.
- No renderer/runtime changes.

## Stop Conditions

Stop and report before continuing if:

- A source's terms are ambiguous or appear to block planned workflow-contract use.
- A batch would require downloading, caching, or ingesting real source data.
- A source would be promoted from audit candidate to approved evidence source.
- A claim class would be upgraded beyond review-only.
- Any exact business/storefront/frontage/entrance/address/signage/tenant claim would be made.
- A new dependency, credential, paid API, architecture change, or renderer/runtime change is needed.
- Verification/build fails and cannot be fixed cleanly inside scope.
- 4H-1 is complete, because the bounded packet then ends at a hard Batu review gate.

## Verification Expectations

For 4H-1:

- Run the new 4H-1 facade evidence intake workflow verifier.
- Run relevant prior source-policy verifiers.
- Run `git diff --check`.
- Run build only if runtime/source app files change.
- Report `git status --short` and `git diff --stat`.

## Documentation Reconciliation

After 4H-1, update:

- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Keep updates concise and stop for Batu review.
