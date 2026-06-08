# Phase 4L-Prep Evidence Gap To Cue Intake Plan

Status: Planning-only 4L preparation packet.

Question: What evidence is needed before the 4K QA recognizability cues can become evidence-backed facade/corridor cues?

## Scope

This plan maps the current 4K recognizability gaps to required evidence types. It does not ingest evidence, access external sources, download files, link businesses, promote QA cues, alter runtime behavior, or expose normal mode.

Structured contract: `src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-prep-qa-evidence-eligibility-contract.v0.1.json`.

## Evidence Need Categories

- `mid_corridor_facade_evidence`: review-only facade references for mid-corridor anchors on both sides.
- `side_return_corner_wrap_recognition`: references that show side-return or corner-wrap relationships without exact frontage claims.
- `facade_depth_setback_specificity`: references that support broad depth, setback, or streetwall relationship cues without exact height, roof, or survey-grade geometry claims.
- `material_color_specificity`: references that support broad material/color families without exact material, exact color, logo, trade dress, or production-asset claims.
- `storefront_rhythm_specificity`: references that support coarse bay/rhythm/density only, without exact storefront order, frontage width, tenant assignment, or business identity.
- `street_furniture_sidewalk_grounding`: references that support sidewalk/street-edge or street-furniture grounding cues without exact fixture placement claims.
- `subway_entrance_specificity`: references that support retaining a subway/entrance-related cue without exact entrance, ownership, or operational claims.
- `distinct_evidence_records_per_facade_cue`: separate review records per facade/cue target so one evidence item is not overextended.

## Current 4K Gap Mapping

| 4K gap | Required evidence |
| --- | --- |
| `missing_mid_corridor_facade_evidence` | `mid_corridor_facade_evidence`, `distinct_evidence_records_per_facade_cue` |
| `weak_corner_wrap_recognition` | `side_return_corner_wrap_recognition`, `facade_depth_setback_specificity`, `distinct_evidence_records_per_facade_cue` |
| `weak_material_color_specificity` | `material_color_specificity`, `distinct_evidence_records_per_facade_cue` |
| `weak_storefront_rhythm_specificity` | `storefront_rhythm_specificity`, `mid_corridor_facade_evidence`, `distinct_evidence_records_per_facade_cue` |
| `missing_street_furniture_evidence` | `street_furniture_sidewalk_grounding`, `distinct_evidence_records_per_facade_cue` |
| `missing_subway_entrance_specificity` | `subway_entrance_specificity`, `street_furniture_sidewalk_grounding`, `distinct_evidence_records_per_facade_cue` |
| `missing_business_source_linkage` | `distinct_evidence_records_per_facade_cue`; business linkage remains blocked and is not required for facade/corridor cue eligibility. |
| `insufficient_local_landmark_signal` | `side_return_corner_wrap_recognition`, `material_color_specificity`, `street_furniture_sidewalk_grounding`, `distinct_evidence_records_per_facade_cue` |

## Evidence Lane Separation

- Batu-supplied repo-local evidence: may be referenced only through existing indexed records or existing cue IDs unless a later Batu packet opens new indexing.
- Future Batu-approved evidence: may become eligible only after a later packet defines source, rights, usage, and claim boundaries.
- Future external source candidates: remain candidate-only and blocked from access, download, cache, ingestion, conversion, render use, and source-record linkage.
- Blocked or insufficient evidence: may classify gaps only; it cannot promote QA cues or normal-mode output.

## 4L Readiness

Not ready for evidence-backed 4L QA corridor render. 4K improved QA recognizability, but the evidence base is still endpoint-biased and not distinct enough per cue/facade target to support an evidence-backed corridor render.
