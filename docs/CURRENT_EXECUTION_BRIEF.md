# Current Execution Brief - Phase 4L-Local-2 Open

Status: `Batch 4L-Local-1: Local Evidence Inventory + Cue Eligibility` is complete and verified. Batu approved the bounded 4L-Local packet after the completed 4L-Prep review gate to test the pipeline with existing repo-local evidence before Mapillary/KartaView or external evidence work.

Completed precondition:

- 4L-Prep is complete and verified.
- 4L-Local-1 is complete and verified.
- `git status --short` was clean before opening 4L-Local.

Current executable batch: `Batch 4L-Local-2: Evidence-Backed QA Cue Enrichment`.

Pre-authorized queue: `Batch 4L-Local-3: QA Runtime Evidence Overlay`; `Batch 4L-Local-4: Visual Review Gate Report`.

Self-advance allowed: yes, inside this 4L-Local packet only, if verification passes, docs are reconciled, intended files only are changed, and no hard stop condition intervenes.

Hard Batu gate: stop after 4L-Local-4.

Owner boundary: Batu owns visual/product acceptance, whether the pipeline justifies Mapillary/KartaView later, and whether any external source/evidence packet opens. Codex owns tactical implementation inside the approved 4L-Local packet only.

## Current Batch

### Batch 4L-Local-2: Evidence-Backed QA Cue Enrichment

Goal: Turn eligible local evidence into enriched QA-only cue data.

Allowed inputs:

- Existing 4D repo-local Batu-supplied facade evidence records.
- Existing 4E evidence-informed QA facade cues.
- Existing 4J/4K/4O scaffold and cue lineage.
- 4L-Local-1 cue eligibility fixture.

Scope:

- Add QA-only enriched cue records for eligible Manhattan/Greenpoint and Franklin/Greenpoint local evidence.
- Enrich only non-factual visual cue fields: broad massing recognizability, facade rhythm, palette family, storefront bay rhythm, awning/canopy/sign-band zone presence, window/glass rhythm, corner-wrap/side-return cue, setback/depth cue, sidewalk/street grounding cue, and subway/entrance cue where already supported.
- Cite existing repo-local evidence IDs only.
- Keep all records non-promoted and normal-mode blocked.
- Add verifier coverage and a concise report.
- Commit after verification passes.

## Packet Queue

### Batch 4L-Local-3: QA Runtime Evidence Overlay

Render the enriched local evidence-backed cues in QA mode only, improving endpoint recognizability with generic visual features and visible status/readouts. Preserve normal mode and all blocked claims.

### Batch 4L-Local-4: Visual Review Gate Report

Report what improved, what remains weak, whether the local-evidence pipeline justifies Mapillary/KartaView next, reconcile control docs, run the required verifier/build chain, commit, and stop at the Batu review gate.

## Hard Constraints

- Do not open Mapillary/KartaView work.
- Do not open 4L-External, 4M, 4P, or any future packet.
- Do not access external sources.
- Do not download, cache, ingest, or convert anything.
- Do not add new evidence files.
- Do not promote QA cues into production or factual claims.
- Do not expose anything in normal mode.
- Do not link businesses, tenants, signs, logos, POIs, or active status.
- Do not alter 4K behavior except through QA-only local evidence cue enrichment.
- Do not add dependencies, credentials, paid APIs, package tooling, renderer replacement, public interfaces, or architecture changes.

## Completed Packet Work

### Batch 4L-Local-1: Local Evidence Inventory + Cue Eligibility

Completed output:

- Added `src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-local-1-repo-local-evidence-cue-eligibility.v0.1.json`.
- Added `docs/reports/phase-4l-local-1-evidence-inventory-cue-eligibility.md`.
- Added `scripts/verify-phase-4l-local-1-evidence-cue-eligibility.mjs`.
- Inventoried 22 existing repo-local Batu-supplied evidence records: 11 Manhattan/Greenpoint and 11 Franklin/Greenpoint.
- Mapped every record to at least one QA-only visual cue category.
- Kept new evidence files, external sources, normal-mode records, and claim promotions at 0.
