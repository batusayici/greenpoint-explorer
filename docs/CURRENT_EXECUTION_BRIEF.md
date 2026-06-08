# Current Execution Brief - Phase 4G-B Facade Evidence Source Audit Open

Status: `4G-A: Geometry Source Audit for NYC 3D / CityGML / 3DCityDB` is complete and verified inside Batu's bounded Phase 4G follow-on packet.

Current executable batch: `4G-B: Facade Evidence Source Audit for Mapillary/KartaView`.

Pre-authorized queue:

1. `4H-1: Facade Evidence Intake Workflow Contract`

Self-advance allowed: yes, only from 4G-B to 4H-1, and only when 4G-B stays within scope, verification passes, docs are reconciled, no source-policy conflict is found, and no critical Batu decision gate is hit.

Hard Batu gate: stop at the end of 4H-1, or earlier if any stop condition below is hit.

Owner boundary: Batu owns source approval, usage-rights acceptance, source promotion, claim-level promotion, production/public claims, geometry-confidence acceptance, facade/storefront/frontage/entrance evidence acceptance, exact business/storefront/frontage/entrance/address/signage/tenant claims, credential/API approval, architecture-boundary approval, visual-system/art-direction work, and final packet review. Codex owns review-only audit artifacts, fixture/report/verifier work, concise control-doc reconciliation, and batch-sized commits inside the approved packet.

## Packet Goal

Open and execute three source-safe batches:

1. `4G-A`: audit NYC 3D / CityGML / 3DCityDB as geometry-confidence candidates only. Complete.
2. `4G-B`: audit Mapillary/KartaView as candidate facade/storefront evidence lanes only. Current.
3. `4H-1`: define the source-safe facade evidence intake workflow contract. Queued.

All outputs are review-only and non-production.

## Packet Allowed Scope

- Audit public documentation, schemas, file formats, metadata fields, licensing/terms pages, and feasibility notes.
- Create docs, fixtures, verifier scripts, and audit reports as needed.
- Evaluate whether each source can support approved claim classes.
- Keep geometry confidence separate from facade/storefront/business evidence.
- Add verifier checks that enforce allowed/prohibited source use.
- Commit after each successful batch if verification passes and the working tree contains only intended files for that batch.

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

## 4G-A Scope

Allowed:

- Evaluate NYC 3D / CityGML / 3DCityDB only for geometry-confidence support:
  - building heights;
  - massing;
  - roof volumes;
  - block gaps;
  - geometry-container review.
- Document terms, attribution, format/schema, metadata, feasibility, claim support, blocked claims, and unresolved questions.
- Add verifier checks for geometry-only lane separation.

Blocked:

- No storefront, facade, tenant, signage, entrance, active-business, business-assignment, exact-address, production, or normal-mode claims.
- No source download/cache/ingestion/conversion/render use unless a later Batu gate explicitly approves it.

## 4G-B Scope

Allowed:

- Evaluate Mapillary/KartaView only as candidate facade/storefront evidence lanes:
  - coverage availability;
  - image metadata usefulness;
  - attribution/display/cache constraints;
  - whether imagery can support facade, frontage, entrance, sign, or storefront review claims.

Blocked:

- No real imagery ingestion, cache, download, texturing, rendering, training, productionization, business linkage, exact storefront/frontage/entrance/address/signage/tenant claim, or normal-mode exposure unless a later Batu gate explicitly approves it.

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

Blocked:

- No real imagery intake, source promotion, production use, normal-mode exposure, business linkage, exact storefront/frontage/entrance/address/signage/tenant claim, source-derived textures, model training, or credential/API work unless a later Batu gate explicitly approves it.

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
- No renderer/runtime changes unless the current batch explicitly requires a QA-only inspector/report view.

## Stop Conditions

Stop and report before continuing if:

- A source's terms are ambiguous or appear to block planned use.
- A batch would require downloading, caching, or ingesting real source data.
- A source would be promoted from audit candidate to approved evidence source.
- A claim class would be upgraded beyond review-only.
- Any exact business/storefront/frontage/entrance/address/signage/tenant claim would be made.
- A new dependency, credential, paid API, architecture change, or renderer/runtime change is needed outside an explicitly opened QA-only inspector/report view.
- Verification/build fails and cannot be fixed cleanly inside scope.
- The bounded packet reaches the end of `4H-1`.

## Verification Expectations

For every batch:

- Run relevant new and existing verifiers.
- Run `git diff --check`.
- Run build only if runtime/source app files change.
- Report `git status --short` and `git diff --stat`.

Current 4G-B verification target:

- New 4G-B facade evidence source audit verifier.
- Relevant prior source-policy verifiers.
- `git diff --check`.

## Documentation Reconciliation

After each successful batch, update:

- `docs/CURRENT_EXECUTION_BRIEF.md`
- `docs/PLAN.md`
- `docs/MVP_EXECUTION_LEDGER.md`
- `docs/phase-4-execution-roadmap.md`

Keep updates concise and do not rewrite the whole control surface.
