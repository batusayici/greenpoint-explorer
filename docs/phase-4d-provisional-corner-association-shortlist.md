# Phase 4D-8 Provisional Corner Association Shortlist

Status: Batch 4D-8 review artifact
Date: 2026-06-07
Scope: Manhattan Ave x Greenpoint Ave and Franklin Ave x Greenpoint Ave evidence only

## Purpose

This batch turns the 4D-7 manual association review records into a QA-only provisional shortlist.

It gives each Manhattan and Franklin evidence record three primary provisional geometry-container candidates, so Batu can review likely container matches without starting from raw evidence paths or the full possible-container set.

It does not select, link, approve, or make any association authoritative. It does not create storefront anchors, tenant frontage assignments, business identity claims, active-status claims, signage claims, entrance claims, material/color claims, exact facade truth, exact address placement, production cards, normal runtime rendering, visual facade generation, new imagery, source expansion, or mid-corridor candidates.

## Outputs

- Shortlist fixture: `src/data/facade-evidence/greenpoint-ave-manhattan-to-franklin.phase-4d-provisional-corner-association-shortlist.v0.1.json`
- Verifier: `scripts/verify-phase-4d-provisional-corner-association-shortlist.mjs`

## Method

Inputs are limited to:

- Existing 4D-7 manual association review records.
- Existing deterministic 4D-7 possible geometry containers.
- Existing evidence IDs and repo-local evidence paths.

No image content was interpreted. No new external source, scraping, API, or rights-sensitive input was used.

For each evidence record, the shortlist:

- Keeps the original corner scope.
- Extracts a filename/direction label as a manual review hint only.
- Ranks same-corner geometry containers by deterministic endpoint proximity on `corridorAxisT`.
- Marks the nearest three containers as `primary_provisional_review_candidate`.
- Preserves the remaining five possible containers as deferred possible containers.

The primary marker means review priority only. It is not a selected, linked, approved, authoritative, storefront, tenant, facade, signage, entrance, material, color, active-status, address-placement, runtime, or production claim.

## Current Result

- Shortlist records: 22.
- `manhattan_greenpoint`: 11 evidence records.
- `franklin_greenpoint`: 11 evidence records.
- Primary provisional candidate entries: 66.
- Deferred possible container IDs: 110.
- Selected associations: 0.
- Approved associations: 0.
- Authoritative associations: 0.
- Authoritative anchors: 0.
- Storefront anchors: 0.
- Tenant frontage assignments: 0.
- Promoted claims: 0.
- Normal-mode records: 0.
- Mid-corridor candidates: 0.

Franklin remains scoped only to `franklin_greenpoint`. Mid-corridor evidence remains `blocked_insufficient_evidence`.

## Review Boundary

This packet can support the next geometry/visual validation discussion by reducing each evidence record to a small set of plausible review candidates.

Still requires Batu decision before any later batch can:

- Select one candidate container for an evidence record.
- Link or approve an evidence-to-geometry association.
- Create any authoritative anchor.
- Change normal runtime or product visuals.
- Promote facade, signage, entrance, material, color, active-status, exact address, production-card, or storefront/frontage claims.
