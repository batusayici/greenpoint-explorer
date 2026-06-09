# Current Execution Brief - Phase 4L-Local-3 Open

Status: `Batch 4L-Local-2: Evidence-Backed QA Cue Enrichment` is complete and verified inside the approved 4L-Local packet.

Completed precondition:

- 4L-Prep is complete and verified.
- 4L-Local-1 is complete and verified.
- 4L-Local-2 is complete and verified.

Current executable batch: `Batch 4L-Local-3: QA Runtime Evidence Overlay`.

Pre-authorized queue: `Batch 4L-Local-4: Visual Review Gate Report`.

Self-advance allowed: yes, inside this 4L-Local packet only, if verification passes, docs are reconciled, intended files only are changed, and no hard stop condition intervenes.

Hard Batu gate: stop after 4L-Local-4.

Owner boundary: Batu owns visual/product acceptance, whether the pipeline justifies Mapillary/KartaView later, and whether any external source/evidence packet opens. Codex owns tactical implementation inside the approved 4L-Local packet only.

## Current Batch

### Batch 4L-Local-3: QA Runtime Evidence Overlay

Goal: Make the enriched local evidence-backed cues visibly useful in QA runtime.

Allowed inputs:

- 4L-Local-2 enriched QA cue fixture.
- Existing 4D repo-local Batu-supplied facade evidence records.
- Existing 4E evidence-informed QA facade cues.
- Existing 4J/4K/4O scaffold and cue lineage.

Scope:

- Connect enriched local evidence-backed cues to QA runtime only.
- Improve recognizability for Manhattan and Franklin endpoint corners.
- Keep mid-corridor generic unless existing repo-local evidence supports specific cue enrichment.
- Render features generically: facade rhythm blocks, bay rhythm, color/material families, awning/canopy/sign-band zones without text/logos, corner-wrap indications, depth/setback indications, and sidewalk/street grounding cues.
- Add QA readouts or labels distinguishing evidence-backed QA cue, gap-fill cue, blocked cue, and unsupported cue.
- Add verifier coverage and a concise report.
- Commit after verification passes.

## Packet Queue

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

- Added 22-record repo-local evidence cue eligibility fixture, verifier, and report.
- Mapped every existing 4D local evidence record to at least one QA-only cue category.

### Batch 4L-Local-2: Evidence-Backed QA Cue Enrichment

Completed output:

- Added `src/data/facade-cues/greenpoint-ave-manhattan-to-franklin.phase-4l-local-2-evidence-backed-qa-cue-enrichment.v0.1.json`.
- Added `docs/reports/phase-4l-local-2-evidence-backed-qa-cue-enrichment.md`.
- Added `scripts/verify-phase-4l-local-2-qa-cue-enrichment.mjs`.
- Added 6 QA-only enriched endpoint cue records citing all 22 existing repo-local evidence IDs.
- Kept external sources, new evidence files, normal-mode records, business/source linkage, and claim promotions at 0.
