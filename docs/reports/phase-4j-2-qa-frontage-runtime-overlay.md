# Phase 4J-2 QA Runtime Frontage Candidate Overlay

Status: 4J-2 QA runtime frontage candidate overlay complete.

## Scope

- Added QA-only runtime rendering for the 22 QA-only candidate records from 4J-1.
- Added candidate type filters for `frontage_band_candidate`, `bay_rhythm_candidate`, `corner_wrap_candidate`, and `setback_depth_candidate`.
- Added readouts for visible/total/normal counts, linked 4O scaffold anchor, QA-only status, and blocked claim categories.
- Kept visuals as generic guide bands/ticks/wrap/depth hints only.

## Runtime Readout

- 4J candidates: 22 visible / 22 QA / 0 normal.
- Normal-mode records: 0.
- Candidate records remain non-promoted.
- Blocked claims remain blocked.

## Preserved Boundaries

- No normal-mode exposure occurred.
- No business, tenant, exact storefront, exact frontage, facade, sign, entrance, exact address, exact height, roof, production, public, or product claim was added.
- No source access, download, cache, ingestion, conversion, imagery access, render use, source promotion, public interface, package/tooling change, dependency, renderer replacement, or architecture change occurred.

## Verification

- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4j-2-qa-frontage-runtime-overlay.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `node scripts/verify-phase-4o-19-qa-scaffold-preview-controls.mjs`
- `npm run build`
- `git diff --check`

## Next

Ready for 4J-3 readiness reporting only.
