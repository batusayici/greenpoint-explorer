# Phase 4D-6 Corner Evidence Folder Reconciliation

Status: Batch 4D-6 review artifact
Date: 2026-06-07
Scope: Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave evidence paths/provenance only

## Purpose

This batch reconciles the moved repo-local evidence folders and intakes Batu-supplied Franklin corner evidence as review-only / QA-only material.

It does not authorize geometry linking, authoritative storefront anchors, tenant frontage assignment, exact facade/signage/entrance/material/color/active-status claims, production cards, visual facade cues, normal runtime rendering changes, new imagery, external sources, or corridor-wide Franklin evidence.

## Folder Result

- Manhattan folder: `docs/mvp-reference-images/greenpoint manhattan corner/`
- Franklin folder: `docs/mvp-reference-images/greenpoint franklin  corner/`
- Manhattan evidence records: 11.
- Franklin evidence records: 11.
- Stale flat evidence paths: 11 before reconciliation, 0 after reconciliation.

The 4D-4 evidence packet now fails verification if any referenced repo-local evidence path is missing or still points at the old flat folder layout.

## Anchor Candidate Result

- Manhattan QA-only unresolved candidates: 11.
- Franklin QA-only unresolved candidates: 11.
- Linked candidates: 0.
- Blocked corner scopes: 0.
- Mid-corridor candidates: 0.
- Mid-corridor evidence status remains `blocked_insufficient_evidence`.

Franklin evidence is scoped only to `franklin_greenpoint`. It is not treated as corridor-wide evidence.

## Deferred Work

Geometry linking is deferred until after Batu reviews this batch and explicitly opens a later batch.

Before anchors or visual work can begin, Batu must approve:

- Which evidence records are eligible for the intended use.
- Whether usage rights are sufficient beyond review-only indexing.
- Which geometry containers, if any, the evidence may be manually associated with.
- Whether any exact or stylized facade/frontage/entrance/signage treatment is allowed.
- Whether the claim level can move beyond review-only evidence.

## Verification

- `scripts/verify-phase-4d-facade-evidence.mjs`
- `scripts/verify-phase-4d-corner-anchor-candidates.mjs`
- `scripts/verify-phase-4d-corner-evidence-paths.mjs`
