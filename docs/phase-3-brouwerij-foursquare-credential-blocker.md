# Phase 3 Brouwerij Lane Foursquare Credential Blocker

Status: Review-only blocked credential/source report
Date: 2026-06-04
Target: Brouwerij Lane only
Source lane: Foursquare Places API

## Purpose

This report records the attempted Phase 3 one-target Brouwerij Lane POI evidence batch using the approved Foursquare source path.

The batch did not call the Foursquare API because the required credential and repo-recorded terms/cache/display approval gates are missing. No raw fixture, normalized evidence output, scene fixture deepening, app behavior change, or production/public claim was created.

## Contract Checked

- Contract doc: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`
- Contract/stub script: `scripts/prepare-foursquare-brouwerij-poi-evidence.mjs`
- Raw fixture path reserved by contract: `src/data/source-evidence/raw/foursquare/brouwerij-lane.phase-3.foursquare.raw.json`
- Normalized evidence output path reserved by contract: `src/data/source-evidence/phase-3/brouwerij-lane.foursquare.poi-evidence.v0.1.json`

The contract permits only identity, address, category, coordinates, freshness/status when source-supported, provenance, and cache/hash policy fields. It keeps facade, frontage, entrance, and raster readiness blocked.

## Readiness Result

Command:

```bash
node scripts/prepare-foursquare-brouwerij-poi-evidence.mjs --check-readiness
```

Result:

```text
FAIL Foursquare Brouwerij adapter readiness: 5 missing/invalid gate(s).
```

Missing gates:

- `FOURSQUARE_API_KEY` or `FSQ_API_KEY`
- `FOURSQUARE_TERMS_APPROVED_AT`
- `FOURSQUARE_TERMS_APPROVED_BY`
- `FOURSQUARE_FIXTURE_STORAGE_APPROVED=true`
- `FOURSQUARE_REVIEW_ONLY_ACK=review-only`

Repo approval search:

- No separate repo-recorded Foursquare terms/cache/display approval was found.
- The existing contract documents required approval fields, but it is not itself approval to retrieve or store a response.

## Blocked Output

The following outputs were intentionally not created:

- `src/data/source-evidence/raw/foursquare/brouwerij-lane.phase-3.foursquare.raw.json`
- `src/data/source-evidence/phase-3/brouwerij-lane.foursquare.poi-evidence.v0.1.json`

The following claims remain blocked:

- Foursquare source-backed Brouwerij identity.
- Foursquare source-backed Brouwerij address.
- Foursquare source-backed Brouwerij category.
- Foursquare source-backed Brouwerij coordinates.
- Foursquare source-backed Brouwerij freshness/status.
- Foursquare source-backed provenance/hash/cache policy.
- Facade.
- Frontage/order.
- Entrance.
- Raster readiness.

## Required To Unblock

Before a later batch may retrieve and normalize the Foursquare evidence packet, Batu must provide or approve:

- `FOURSQUARE_API_KEY` or `FSQ_API_KEY` in the environment.
- `FOURSQUARE_TERMS_APPROVED_AT` as an ISO date.
- `FOURSQUARE_TERMS_APPROVED_BY`.
- `FOURSQUARE_FIXTURE_STORAGE_APPROVED=true`.
- `FOURSQUARE_REVIEW_ONLY_ACK=review-only`.
- Confirmation that the requested fields match the contract and that any raw response storage or hash-only storage policy is allowed.

If these are not available, the next useful Phase 3 path remains a deterministic LiveXYZ, North Brooklyn Chamber, Shop Small Greenpoint, other Batu-approved local-directory/community packet, or a Batu-approved manual evidence packet.
