# Phase 4I Corridor Facade Cue Expansion

Status: 4I-2 QA-only fixture expansion
Date: 2026-06-08
Scope: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

4I-2 expands the QA facade cue data surface from endpoint-only proof toward corridor review coverage. The fixture is review-only and QA-only. It does not approve sources, ingest imagery, create storefront anchors, link businesses, expose normal mode, or create production assets.

## Outputs

- Fixture: `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4i-corridor-qa-facade-cues.v0.1.json`
- Verifier: `scripts/verify-phase-4i-corridor-facade-cues.mjs`
- Plan: `docs/phase-4i-1-corridor-facade-cue-expansion-plan.md`

## Fixture Shape

The fixture contains three lanes:

- `endpoint_evidence_backed`: six existing 4E/4F endpoint records with repo-local Batu-supplied evidence references preserved as review-only inputs.
- `mid_corridor_insufficient_evidence`: 36 deterministic geometry-only corridor placeholders that may support QA rhythm, massing, streetwall relation, depth/setback tier, and non-claim bay cadence review.
- `blocked_no_evidence_gap`: 100 records that keep unselected, unsuitable, or evidence-missing geometry containers visible as blocked/no-evidence gaps.

## Preserved Boundaries

- No external source access, download, cache, ingestion, rendering, extraction, training, or source promotion.
- No business linkage.
- No authoritative storefront anchors.
- No exact frontage, entrance, address, signage, tenant, material, active-status, or business claims.
- No normal-mode exposure.
- No production assets.
- No 4J storefront bay/frontage candidate implementation.
- No 4K business/source linkage.
- No 4M visual-system/art-direction translation.

## Verification

The verifier checks QA-only policy, blocked normal/production use, deterministic IDs, stable scene/geometry references, endpoint evidence preservation, mid-corridor insufficient-evidence labeling, blocked gap reasons, source/claim prohibitions, and summary counts.

## 4I-3 Runtime Legibility Pass

4I-3 consumes this fixture in QA mode only to make corridor coverage legible while preserving normal mode unchanged.

What changed:

- Added a QA-only runtime layer for `mid_corridor_insufficient_evidence` records.
- Kept endpoint evidence-backed records visually primary through the existing opaque 4E/4F endpoint facade volumes.
- Rendered mid-corridor placeholders as subdued streetwall rhythm, massing, depth/setback, and non-claim bay-cadence bands.
- Kept `blocked_no_evidence_gap` records in QA summaries/inspector readouts instead of creating facade geometry.
- Added review-panel, QA-panel, legend, and inspector readouts for 4I lane/status/provenance.

Browser QA could not run in this environment because local server binding and built-file navigation were blocked. Build and deterministic verifiers passed.
