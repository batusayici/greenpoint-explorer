# Phase 4D Candidate POI QA Fixture

Status: Batch 4D-3 review artifact
Date: 2026-06-06
Scope: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

This batch adds a candidate-only POI/business review layer for QA workflow evaluation.

It does not add real POIs, real businesses, authoritative business overlays, production place cards, tenant/storefront/frontage assignments, facade imagery, storefront anchors, entrance anchors, active-status claims, or visual-system changes.

## Fixture

Fixture path:

- `src/data/candidate-pois/greenpoint-ave-manhattan-to-franklin.phase-4d-candidate-pois.v0.1.json`

Verifier:

- `scripts/verify-phase-4d-candidate-pois.mjs`

The fixture is generated deterministically from the existing 4D-1 geometry validation report. It contains six synthetic/manual placeholder candidate records, selected across `safe`, `uncertain`, and `blocked` geometry containers for QA review coverage.

## Fixture Shape

Each candidate contains:

- Stable candidate ID.
- Source type.
- Source provenance.
- Source access method.
- Cache/display permission status.
- Address string.
- Optional coordinate field, currently `null`.
- Category.
- Candidate confidence.
- Claim level and claim state from the 4D-2 ladder.
- Blocked reasons.
- `lastVerified`, currently `null`.
- Explicit verification status: `unknown_not_verified_synthetic_placeholder`.
- Notes for manual review.
- QA-only review placement near an existing rendered geometry object.

## Source / Cache / Display Boundary

4D-3 uses only `synthetic_manual_placeholder` records.

- Live API called: no.
- Scraping attempted: no.
- Google, Street View, or 3D Tiles used: no.
- Terms-uncertain material used: no.
- Real business truth claimed: no.
- Active status claimed: no.
- Cache permission: `local-review-placeholder-only`.
- Display permission: `qa-only-placeholder-labels`.

The fixture intentionally avoids real source records because real source access, storage/cache, display, attribution, and freshness rules still require separate Batu approval.

## QA Runtime Behavior

- Candidate markers are visible only when QA mode is enabled.
- Normal mode does not show candidate POIs.
- Candidate markers are not pickable business/storefront objects.
- Inspector text labels candidates as `candidate_only`, `manual_review_required`, or blocked.
- Inspector text explicitly states: `Not a storefront assignment.`

## Blocked Claims

Candidate records block:

- Storefront assignment.
- Tenant frontage.
- Storefront order.
- Frontage width.
- Entrance location.
- Facade or signage location.
- Active business status.
- Production place cards.
- Business truth from POI data.
- Restricted-source usage.

## Next Review Question

Batu should review whether the synthetic candidate fixture and QA-only overlay are enough to evaluate the candidate-POI workflow before any real source packet or candidate data is authorized.

If accepted, the next proposed batch remains source/evidence dependent and must not self-open: either a real source readiness packet for candidate POIs or a different Batu-authorized 4D batch.
