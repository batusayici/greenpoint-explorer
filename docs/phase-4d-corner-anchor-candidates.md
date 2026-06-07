# Phase 4D-5 Corner Anchor Candidates

Status: Batch 4D-5 review artifact, updated by Batch 4D-6 Franklin evidence intake
Date: 2026-06-07  
Scope: Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave only

## Purpose

This batch creates a narrow QA-only evidence-to-geometry anchor-candidate layer for corner evidence review.

It does not create authoritative storefront anchors, tenant frontage assignments, business identity claims, active-status claims, signage claims, entrance ownership claims, frontage width/order claims, material/color claims, exact facade truth, production cards, normal runtime rendering, new imagery, source expansion, or visual-system work.

## Outputs

- Anchor candidate fixture: `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-corner-anchor-candidates.v0.1.json`
- Verifier: `scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- QA-only inspector visibility in `src/Phase4BRuntimePreview.jsx`
- 4D-6 path/provenance verifier: `scripts/verify-phase-4d-corner-evidence-paths.mjs`

## Evidence Scope

4D-5 corrected the 4D-4 scope interpretation. 4D-6 reconciled the moved evidence folders and added Batu-supplied Franklin corner evidence.

- Manhattan evidence records are scoped to `manhattan_greenpoint`.
- Franklin evidence records are scoped only to `franklin_greenpoint`.
- No mid-corridor facade evidence exists or is inferred.

Evidence records by corner scope:

- `manhattan_greenpoint`: 11 records.
- `franklin_greenpoint`: 11 records.
- `unresolved_unknown`: 0 records.

## Geometry Coverage

Both corners have deterministic geometry containers:

- Manhattan Ave x Greenpoint Ave is represented by high-axis endpoint geometry containers from the existing manifest/runtime corridor guide, with 4D-1 confidence states recorded in the fixture.
- Franklin Ave x Greenpoint Ave is represented by 4D-1 `franklin-end-review-band` geometry containers, with confidence states recorded in the fixture.

Because the current evidence records do not prove a specific evidence-to-building/container match, no evidence record is force-linked to a geometry container. Geometry linking is deferred until after Batu reviews this reconciliation and opens a later batch.

## Anchor Candidate Shape

Every QA-only anchor candidate records:

- Stable anchor candidate ID.
- Corner scope.
- Evidence ID.
- Evidence path/reference.
- Candidate geometry container ID, currently `null` because association is unresolved.
- Side/order hint, currently `null` unless supportable later.
- Association status and confidence.
- Supported claim level from the 4D-2 ladder.
- Blocked claim levels.
- Blocked reasons.
- Provenance notes.
- Manual review notes.
- `qaOnly: true`.

## Current Result

- Linked anchor candidates: 0.
- Unresolved anchor candidates: 22.
- Anchor candidates by scope: `manhattan_greenpoint`: 11, `franklin_greenpoint`: 11.
- Blocked corner scopes: 0. Franklin now has repo-local Batu-supplied evidence, but remains unresolved QA-only rather than linked.
- Mid-corridor anchor candidates: 0.

The runtime QA inspector states: `Corner anchor candidate only. Not a storefront assignment.`

## Blocked Claims

Still blocked:

- Tenant-at-address promotion.
- Storefront/frontage claims.
- Entrance claims.
- Facade/signage promotion.
- Landmark/special-treatment claims.
- Business identity, active status, material, color, exact address placement, production cards, normal runtime rendering, and production/public readiness.

## Future Use

Future batches may link a record to a specific geometry container only after Batu accepts the relevant evidence and the association is manually reviewed. Franklin evidence is now present, but no Franklin evidence-to-geometry association is approved by 4D-6.
