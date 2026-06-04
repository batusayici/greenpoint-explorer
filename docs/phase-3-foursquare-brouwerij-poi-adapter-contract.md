# Phase 3 Foursquare Brouwerij Lane POI Evidence Adapter Contract

Status: Review-only adapter contract / no live retrieval performed
Date: 2026-06-04
Target: Brouwerij Lane only

## Purpose

This contract prepares the practical near-term Foursquare path for exactly one Phase 3 POI/business evidence packet: Brouwerij Lane. It does not retrieve live data, deepen the scene fixture, create production/public interfaces, or approve broad Foursquare integration.

Foursquare remains the practical near-term implementation lane only when no deterministic local-directory/community source is available. Strategic local-directory/community sources remain preferred when Batu supplies or approves deterministic access.

## Local Paths

Raw Foursquare fixture path:

```text
src/data/source-evidence/raw/foursquare/brouwerij-lane.phase-3.foursquare.raw.json
```

Normalized evidence output path:

```text
src/data/source-evidence/phase-3/brouwerij-lane.foursquare.poi-evidence.v0.1.json
```

Contract/stub script:

```text
scripts/prepare-foursquare-brouwerij-poi-evidence.mjs
```

These paths are contract paths only. The raw fixture and normalized output should not be created until a later batch has approved credentials, terms/cache/display handling, and source retrieval scope.

## Required Environment

| Env var | Required value | Purpose |
| --- | --- | --- |
| `FOURSQUARE_API_KEY` or `FSQ_API_KEY` | Non-empty | Credential for the approved bounded Foursquare Places request. |
| `FOURSQUARE_TERMS_APPROVED_AT` | `YYYY-MM-DD` | Date Batu approved Foursquare terms/cache/display use for this review fixture. |
| `FOURSQUARE_TERMS_APPROVED_BY` | Non-empty | Reviewer/owner who approved the bounded terms use. |
| `FOURSQUARE_FIXTURE_STORAGE_APPROVED` | `true` | Confirms a bounded raw response fixture or hash may be stored for review-only use. |
| `FOURSQUARE_REVIEW_ONLY_ACK` | `review-only` | Confirms the adapter must not produce production/public claims. |

If any required variable is missing or invalid, the stub must fail clearly and make no live request.

## Allowed Fields

Allowed Foursquare-derived fields for the first Brouwerij POI packet:

- Provider id: `fsq_id` or `fsq_place_id`.
- Name.
- Category ids and labels.
- Address fields: formatted address, street address, locality, region, postal code, country.
- WGS84 coordinates from the provider geocode.
- Provider freshness/status field where available, such as refreshed/closed status fields.
- Provider place URL/link where terms allow recording it.

Blocked Foursquare-derived fields for this packet:

- Photos.
- Tips.
- Reviews.
- Ratings.
- Open-now/hour claims.
- Popularity.
- Facade, frontage, entrance, or raster-readiness claims.

POI point coordinates must not be treated as entrance placement, storefront frontage, exact tenant geometry, or raster readiness.

## Cache / Hash Policy

- A raw response fixture must be bounded to the single Brouwerij Lane target.
- The raw fixture must be stored only if terms/cache/display approval is recorded.
- Any normalized output must include the raw fixture SHA-256 hash.
- The normalized output must preserve unsupported claims as blocked.
- If terms allow hash-only storage but not raw fixture storage, the normalized evidence packet must record that policy and avoid storing restricted raw content.
- No Foursquare photos, ratings, reviews, tips, popularity, or open-now claims should be stored in this Phase 3 packet.

## Stub Usage

Print the deterministic contract:

```bash
node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --print-contract
```

Check credential/terms readiness without calling the API:

```bash
node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --check-readiness
```

Hash a future approved raw fixture:

```bash
node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --hash-raw-fixture
```

## Source References

- Foursquare Places API docs: <https://docs.foursquare.com/data-products/docs/places-api>
- Foursquare Places API product page: <https://foursquare.com/products/places-api/>
- Foursquare Places OS schema orientation: <https://docs.foursquare.com/data-products/docs/places-os-data-schema>
- Foursquare Places overview: <https://docs.foursquare.com/data-products/docs/places-overview>
- Foursquare categories: <https://docs.foursquare.com/data-products/docs/categories>

## Next Step

The next retrieval batch remains blocked until Batu records Foursquare terms/cache/display approval and provides/configures the required credential. If those are not available, the project should continue to prefer a deterministic LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, other local-directory/community packet, or a Batu-approved manual evidence packet.
