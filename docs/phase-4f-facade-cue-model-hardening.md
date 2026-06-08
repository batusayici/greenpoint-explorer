# Phase 4F Facade Cue Model Hardening

Status: Batch 4F-1 approved by Batu; 4G contract batch opened
Date: 2026-06-07
Scope: QA-only facade cue model hardening for the existing six endpoint evidence-informed records

## Purpose

Batch 4F-1 hardens the QA-only facade cue model so future endpoint and corridor evidence can attach to stable facade plane, streetwall slot, side-return, depth/setback, ground-contact, and placeholder bay structures without creating storefront, entrance, business, production, or normal-mode claims.

## Outputs

- Hardened fixture/model: `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4e-evidence-informed-qa-facade-cues.v0.1.json`
- 4E visual-proof verifier: `scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- 4F model verifier: `scripts/verify-phase-4f-facade-cue-model.mjs`

## 4F-1 Model Additions

- Added top-level `facadeCueModelPolicy` for the QA-only 4F-1 model contract.
- Added per-record `qaFacadeModel` blocks with stable `facadePlaneId` values.
- Added streetwall slot/layout contracts with computed slot extents and minimum visual gaps.
- Formalized side return and corner-wrap fields separate from storefront/entrance claims.
- Formalized depth, setback, projection, and ground-contact fields.
- Added storefront bay placeholders only as `qa_non_claim_storefront_bay_placeholder`.
- Added confidence/status states that keep business linkage, frontage promotion, entrance promotion, normal runtime, and production promotion blocked.

## Preserved Boundaries

- No Mapillary/KartaView ingestion or coverage audit.
- No business linkage.
- No exact storefront, frontage, or entrance claims.
- No production assets.
- No normal-mode exposure.
- No full corridor expansion.
- No art-direction translation.

## Verification

- `node scripts/verify-phase-4e-evidence-informed-facade-cues.mjs`
- `node scripts/verify-phase-4f-facade-cue-model.mjs`
- Full existing 4D/4C/4B verifier chain.
- `npm run build`
- `git diff --check`

## Review Result

Batu approved 4F-1 and opened only `Batch 4G: External Source Policy And Coverage Audit Contract`. This approval does not approve 4G-A, 4G-B, source access, source expansion, business linkage, storefront/frontage/entrance claims, production assets, normal-mode exposure, or public/product claims.
