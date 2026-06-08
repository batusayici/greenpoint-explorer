# Phase 4K-1 Recognizable Anchor Cue Contract + Fixture

Status: 4K-1 recognizable anchor cue contract + fixture complete.

## Scope

- Added 18 QA-only recognizable anchor cue records derived only from existing 4O scaffold anchors, 4J frontage/bay candidates, and existing 4E cue IDs where available.
- Covered 10 existing 4O building anchors across the Franklin endpoint, west corridor, mid corridor, east corridor, and Manhattan endpoint.
- Existing 4J candidate links: 18.
- Existing repo evidence references: 8 existing 4E cue IDs.
- Allowed cue categories only: `corner_composition_cue`, `sidewalk_street_cue`, `subway_or_street_furniture_cue`, `facade_rhythm_cue`, `material_color_family_cue`, `massing_silhouette_cue`, and `frontage_density_cue`.
- Cue records contain only cue ID, linked 4O anchor ID, linked 4J candidate ID, existing repo evidence reference, cue category, QA-only status, blocked claim categories, and a non-promotion flag.

## Counts

- Cue records: 18 QA-only records.
- Existing 4O building anchors covered: 10 of 10.
- Corner composition cues: 4.
- Sidewalk/street cues: 2.
- Subway or street-furniture cues: 1.
- Facade-rhythm cues: 2.
- Material/color-family cues: 2.
- Massing/silhouette cues: 3.
- Frontage-density cues: 4.
- Normal-mode records: 0.

## Preserved Boundaries

- No business, tenant, exact storefront, exact frontage, exact facade, sign, entrance, exact address, exact height, roof, production, public, or product claim was added.
- No external source access, download, cache, ingestion, conversion, imagery access, or render use occurred.
- No normal-mode exposure, public interface, module-boundary change, package/tooling change, dependency, source promotion, or claim promotion occurred.
- Evidence references are existing repo cue IDs only; 4K-1 does not add image paths, source paths, extracted facts, or new evidence intake.
- The fixture is not safe to promote.

## Verification

- `node scripts/verify-phase-4k-1-qa-recognizable-anchor-cues.mjs`
- `node scripts/verify-phase-4j-1-qa-frontage-candidates.mjs`
- `node scripts/verify-phase-4o-18-corridor-wide-qa-scaffold-preview-expansion.mjs`
- `git diff --check`

## Next

Ready for 4K-2 QA runtime overlay only.
