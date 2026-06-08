# Current Execution Brief - Phase 4O-9 Open After 4O-8

Status: `Batch 4O-8: Deterministic Scaffold Input Fixture` is complete and verified. `Batch 4O-9: QA-Only Scaffold Input Inspector` is the current executable batch.

4O-1 accepted by Batu on 2026-06-08.

4O-2 accepted by Batu on 2026-06-08.

4O-3 is complete and verified.

4O-4 is complete and verified.

4O-5 is complete and verified.

4O-6 is complete and verified.

4O-6 accepted by Batu on 2026-06-08.

4O-7 is complete and verified.

4O-8 is complete and verified.

Current executable batch: `Batch 4O-9: QA-Only Scaffold Input Inspector`.

Completed batch: `Batch 4O-8: Deterministic Scaffold Input Fixture`.

Target corridor: Greenpoint Ave from Manhattan Ave to Franklin Ave.

Pre-authorized queue: none.

Self-advance allowed: no. Stop after 4O-9 for Batu review.

Hard Batu gate: stop after 4O-9. Stop earlier for verification failure, dirty-tree issue, source/claim boundary issue, dependency/tooling need, runtime rendering, public-interface change, module-boundary change, real source access/download/cache/ingestion/conversion/render use, exact business/sign/entrance/facade/tenant frontage/address/active-status claim, claim promotion, normal-mode exposure, production/public claim, or unresolved ambiguity.

Owner boundary: Batu owns 4O-8 acceptance, 4O-9 packet-end acceptance, whether to open first real source fixture ingestion or another corrective offline batch, source access and usage-rights acceptance, spatial recognizability acceptance, source promotion, claim-level promotion, production/public claims, facade/storefront/frontage/entrance evidence acceptance, exact business/storefront/frontage/entrance/address/signage/tenant/material/active-status claims, credential/API approval, architecture-boundary approval, Blender/GLB override use, Mapillary/street-level metadata use, art-direction translation timing, and any later MVP gates.

## Completed Batch

### 4O-8 Deterministic Scaffold Input Fixture

What changed:

- Added `src/data/corridor-scaffold/greenpoint-ave-manhattan-to-franklin.phase-4o-8-deterministic-scaffold-input-fixture.v0.1.json`.
- Added `scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`.
- Added the smallest deterministic scaffold-input fixture derived from 4O-7.
- Included building/container inputs, grounding inputs, and height/massing inputs.
- Kept the fixture separate from the 4O-4 placeholder scaffold manifest and explicitly marked it test-only/offline-only.

## Current Batch

### 4O-9 QA-Only Scaffold Input Inspector

Authorized scope:

- Add a QA-only non-rendering inspector/report or minimal review artifact that makes scaffold-input records easy to evaluate.
- The inspector may be JSON, Markdown, console output, or another repo-local review artifact.
- Do not add 3D rendering, public UI, runtime scene integration, or normal-mode exposure.
- Add verifier if useful.

## Preserved Boundaries

- 4O-8 changes no public interfaces and no module boundaries.
- No external data download, cache, ingestion, conversion, render use, source access, source promotion, runtime rendering, procedural scaffold rendering, Blender/GLB asset work, or Mapillary automation occurred.
- No package/tooling changes, new dependencies, source app changes, production data pipeline, production visual pipeline, runtime consumer, or public interface were added.
- No business linkage, POI linkage, sign linkage, entrance linkage, authoritative storefront anchors, storefront bay/frontage candidates, exact storefront, frontage, tenant frontage, entrance, address, sign, tenant, material, active-status, facade, height, roof, production, public, or product claims.
- No normal-mode exposure and no normal-mode facade/corridor promotion.
- Truth-first order remains: spatial scaffold first, facade recognizability second, art direction third.

## Verification Completed

- `git status --short` before edits: clean.
- `node scripts/verify-phase-4o-8-deterministic-scaffold-input-fixture.mjs`
- `node scripts/verify-phase-4o-7-offline-adapter-normalization.mjs`
- `node scripts/verify-phase-4o-6-offline-source-adapter-fixture.mjs`
- `node scripts/verify-phase-4o-5-source-adapter-boundary.mjs`
- `node scripts/verify-phase-4o-4-placeholder-scaffold-manifest.mjs`
- `node scripts/verify-phase-4o-3-scaffold-generation-contract.mjs`
- `node scripts/verify-phase-4o-2-corridor-fixture-stub.mjs`
- `node scripts/verify-phase-4o-1-truth-first-corridor-data-contract.mjs`
- `git diff --check`

## Unresolved Decisions For Batu

- Whether to accept 4O-8 as the correct deterministic scaffold-input fixture.
- Whether 4O-9 inspector is sufficient for Batu review or needs a corrective non-rendering report pass.
- Whether to open first real source fixture ingestion after 4O-9, request another corrective offline pass, or pause 4O.
- Which 4O source-access/download/cache/conversion/render-use boundaries, if any, are approved.
