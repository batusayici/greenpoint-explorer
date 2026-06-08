# Phase 4J-1 Frontage Candidate Contract + Fixture

Status: 4J-1 frontage candidate contract + fixture complete.

## Scope

- Added 22 QA-only candidate records derived only from the existing 4O-18 building anchors.
- Covered 10 existing 4O building anchors across the Franklin endpoint, west corridor, mid corridor, east corridor, and Manhattan endpoint.
- Allowed candidate types only: `frontage_band_candidate`, `bay_rhythm_candidate`, `corner_wrap_candidate`, and `setback_depth_candidate`.
- Candidate records contain only candidate ID, linked 4O scaffold anchor ID, existing corridor side/section, candidate type, QA-only status, blocked claim categories, and a non-promotion flag.

## Counts

- Total candidate records: 22 QA-only candidate records.
- Unique linked 4O anchors: 10 existing 4O building anchors.
- Frontage-band candidates: 10.
- Bay-rhythm candidates: 4.
- Corner-wrap candidates: 4.
- Setback-depth candidates: 4.
- Normal-mode records: 0.

## Preserved Boundaries

- No business, tenant, storefront, facade, sign, entrance, exact address, exact frontage, exact height, roof, production, public, or product claim was added.
- No external source access, download, cache, ingestion, conversion, imagery access, or render use occurred.
- No normal-mode exposure, public interface, new module boundary, package/tooling change, dependency, source promotion, or claim promotion occurred.
- The fixture is not evidence-backed and is not safe to promote.

## Verification

- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `git diff --check`

## Next

Ready for 4J-2 QA runtime overlay only.
