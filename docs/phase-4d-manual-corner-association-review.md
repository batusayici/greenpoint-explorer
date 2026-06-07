# Phase 4D-7 Manual Corner Association Review

Status: Batch 4D-7 review artifact
Date: 2026-06-07
Scope: Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave evidence only

## Purpose

This batch prepares a QA-only manual review packet for possible evidence-to-geometry association at the two supplied evidence corners.

It does not approve any evidence-to-geometry link. It does not create authoritative storefront anchors, tenant frontage assignments, business identity claims, active-status claims, signage claims, entrance ownership claims, frontage width/order claims, material/color claims, exact facade truth, exact address placement, production cards, runtime rendering, visual facade cues, new imagery, source expansion, or mid-corridor candidates.

## Outputs

- Association review fixture: `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-manual-corner-association-review.v0.1.json`
- Verifier: `scripts/verify-phase-4d-manual-corner-associations.mjs`

## Evidence Scope

Evidence records are inherited from the 4D-4/4D-6 facade evidence packet:

- `manhattan_greenpoint`: 11 records.
- `franklin_greenpoint`: 11 records.
- `unresolved_unknown`: 0 records.

Franklin evidence remains scoped only to `franklin_greenpoint`. It is not corridor-wide evidence.

## Geometry Scope

Possible geometry containers are inherited from the deterministic 4D-5 corner geometry coverage:

- `manhattan_greenpoint`: 8 possible corner containers.
- `franklin_greenpoint`: 8 possible corner containers.
- `mid_corridor`: 0 possible containers, still `blocked_insufficient_evidence`.

Every evidence record receives the possible container set for its corner scope only. This is a review convenience, not an evidence-specific match.

## Fixture Shape

Every review record includes:

- Stable association review ID.
- Corner scope.
- Evidence ID and evidence path.
- Usage-rights status from the evidence packet.
- Possible geometry containers for the same corner scope.
- `selectedGeometryContainerId: null`.
- `approvedGeometryContainerId: null`.
- `associationStatus: provisional_unresolved_review_only`.
- Supported review-only claim level.
- Blocked claim levels and blocked reasons.
- Review-only / QA-only status.
- Normal-mode use set to `not-rendered`.
- Manual review notes.

## Current Result

- Review records: 22.
- Provisional records: 22.
- Selected associations: 0.
- Approved associations: 0.
- Linked associations: 0.
- Authoritative anchors: 0.
- Storefront anchors: 0.
- Tenant frontage assignments: 0.
- Promoted claims: 0.
- Normal-mode records: 0.
- Mid-corridor candidates: 0.

## Review Boundary

This packet may help Batu decide whether a later batch should attempt manual evidence-to-container selection. That later selection would still require explicit Batu authorization.

Blocked until later approval:

- Selecting a specific geometry container.
- Approving a geometry association.
- Creating an authoritative storefront anchor.
- Assigning tenants/frontages.
- Promoting facade, signage, entrance, material, color, active-status, exact address, production-card, runtime-rendering, or visual-facade claims.
