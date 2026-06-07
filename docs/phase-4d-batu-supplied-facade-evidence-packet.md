# Phase 4D-4 Batu-Supplied Facade Evidence Packet

Status: Batch 4D-4 review artifact, updated by Batch 4D-6 path/provenance reconciliation
Date: 2026-06-07  
Scope: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

This packet defines the facade evidence shape and indexes eligible repo-local Batu-supplied/project-owned reference material for future facade/frontage review.

4D-5 correction: evidence must be treated as corner-scoped, not corridor-wide.

4D-6 reconciliation: Manhattan evidence now resolves to `docs/mvp-reference-images/greenpoint manhattan corner/`. Franklin evidence supplied by Batu now resolves to `docs/mvp-reference-images/greenpoint franklin  corner/` and is indexed with `cornerScope: franklin_greenpoint`. Franklin evidence is corner-only and not corridor-wide.

It does not authorize facade imagery generation, storefront anchors, tenant-frontage assignment, exact entrance placement, exact facade/signage/material/color claims, production assets, normal runtime rendering, source expansion, scraping, live APIs, or visual-system work.

## Evidence Packet Shape

Every evidence record must include:

- Stable evidence ID.
- Source owner / supplier.
- File path or reference.
- Capture/provenance notes.
- Allowed use.
- Disallowed use.
- Usage rights status.
- Associated corridor side or geometry container, if known.
- Confidence/review status.
- Claim levels supported from the 4D-2 ladder.
- Blocked claim levels.
- Notes for manual review.

The 4D-4 fixture is:

- `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-batu-supplied-facade-evidence.v0.1.json`

The verifier is:

- `scripts/verify-phase-4d-facade-evidence.mjs`

## Ingestion Result

Repo-local evidence was ingested as a deterministic review-only index.

The indexed records are local field-photo references from the two approved corner folders whose prior repo docs or Batu's 4D-6 supply note describe them as Batu-supplied or project-owned/repo-local references. The packet intentionally excludes exception-only or restricted-source material.

Evidence counts after 4D-6:

- `manhattan_greenpoint`: 11 records in `docs/mvp-reference-images/greenpoint manhattan corner/`.
- `franklin_greenpoint`: 11 records in `docs/mvp-reference-images/greenpoint franklin  corner/`.
- `unresolved_unknown`: 0 records.
- Stale flat evidence paths: 11 before 4D-6 reconciliation, 0 after.

Every indexed record now carries:

- `cornerScope.scopeId`
- `cornerScope.label`
- `cornerScope.notCorridorWideEvidence`

Valid scope IDs are `manhattan_greenpoint`, `franklin_greenpoint`, or `unresolved_unknown`.

The packet does not crop, transform, stylize, generate, copy, or render the image files. It records paths, provenance notes, use boundaries, claim boundaries, and manual review status only.

## Usage Boundaries

Allowed:

- Facade evidence review.
- Provenance review.
- Future manual review input if Batu accepts this packet and opens a later batch.

Disallowed:

- Normal runtime rendering.
- Production asset use.
- Asset generation input.
- Texture extraction or tracing.
- Storefront anchor creation.
- Tenant frontage assignment.
- Exact facade, sign, color, material, entrance, frontage, address-placement, active-status, or production-readiness claims.

Usage rights status is `review_only_owner_confirmation_required_before_promotion` for every record.

No record is attached to a Phase 4D geometry container in this packet. 4D-5/4D-6 may create QA-only unresolved anchor candidates, but authoritative storefront anchors remain blocked. Geometry linking is deferred until Batu reviews and approves a later batch.

## Claim Boundaries

Supported, review-only:

- Level 8: facade/signage evidence review, with `manual_review_required` status.

Blocked:

- Level 6: storefront/frontage claims.
- Level 7: entrance claims.
- Level 8 promotion: exact facade/signage/material/color claims.
- Level 9: landmark/special-treatment claims.

The packet also blocks active-status finality, exact address placement, production asset readiness, storefront segmentation, and tenant-frontage assignment.

## Future Use

Future batches may use this packet only after Batu accepts it and opens a new implementation boundary. Before anchors or visual work can begin, Batu must approve:

- Which evidence records are eligible for the intended use.
- Whether usage rights are sufficient beyond review-only indexing.
- Which geometry containers, if any, the evidence may be manually associated with.
- Whether any exact or stylized facade/frontage/entrance/signage treatment is allowed.
- Whether the claim level can move beyond review-only evidence.

Until those approvals exist, all facade/frontage/entrance/signage and production visual claims remain blocked.
