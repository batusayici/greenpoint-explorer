# Phase 4G External Source Policy And Coverage Audit Contract

Status: Batch 4G review artifact; accepted by Batu
Date: 2026-06-08
Scope: Future external source policy and review-only coverage audit contracts for Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

Batch 4G defines the contract for future external source work before any source is accessed, downloaded, cached, ingested, audited, extracted, rendered, or used as evidence.

The core rule is:

```text
geometry sources can improve geometry confidence;
facade imagery can support facade/frontage evidence review;
neither lane proves business/storefront truth alone;
Batu approval is required before access, audit execution, claim promotion, or production use.
```

This document does not authorize 4G-A, 4G-B, 4H, source access, source expansion, benchmark execution, imagery use, business linkage, storefront anchors, exact frontage/entrance claims, normal-mode exposure, production assets, visual-system work, or public/product claims.

## Source Lanes

| Lane | Future candidate sources | Candidate role | Must not support | Future batch |
| --- | --- | --- | --- | --- |
| Geometry confidence | NYC 3D, CityGML, 3DCityDB | Building height, massing, roof volume, block gap, and review-only geometry-container confidence checks. | Storefront frontage, entrance, tenant, signage, facade appearance, business assignment, active status, production asset readiness, or public/product exactness. | 4G-A only after Batu opens it. |
| Facade evidence | Mapillary, KartaView | Review-only facade, storefront, frontage, entrance, sign-band, window/door, and visual-cue evidence candidate coverage checks. | Business identity proof by itself, active status, tenant-frontage promotion by itself, geometry survey truth, production asset approval, or normal-mode rendering. | 4G-B only after Batu opens it. |
| Benchmark or narrow exception | Google 3D Tiles, Google Street View | Benchmark-only or separately approved narrow-exception comparison material. | Source of truth, stored facade reference, extracted geometry, texture source, training input, generation input, production visual pipeline, or default evidence lane. | Later source-policy exception only. |
| Visual-system acceleration | Qwen, Oxen | Deferred 4M visual-system acceleration from owned/approved references, deterministic cue blueprints, and Batu-approved style targets. | Evidence, source of truth, extraction from restricted imagery, claim promotion, storefront/frontage verification, or production asset approval by itself. | 4M only after Batu opens it. |

## Allowed And Prohibited Uses

All uses are blocked until a later current brief explicitly opens the relevant batch. The matrix below defines what a later brief must decide before execution.

| Use category | 4G-A geometry candidates: NYC 3D / CityGML / 3DCityDB | 4G-B facade candidates: Mapillary / KartaView | Google 3D Tiles / Street View | Qwen / Oxen |
| --- | --- | --- | --- | --- |
| Access | Blocked in 4G; future 4G-A must document terms, attribution, retrieval path, and allowed scope before access. | Blocked in 4G; future 4G-B must document terms, attribution, retrieval path, and allowed scope before access. | Blocked in 4G; later exception must document exact purpose and rights. | Blocked until 4M. |
| Attribution | Must be recorded before any future audit output is saved. | Must be recorded before any future audit output is saved. | Must be recorded for any later benchmark/exception note. | Must be recorded for model/tool and input/reference provenance. |
| Storage/cache | Future 4G-A may store only metadata or source excerpts explicitly allowed by terms and brief. | Future 4G-B may store only metadata, coverage notes, or evidence records explicitly allowed by terms and brief; imagery storage remains blocked unless separately approved. | Stored imagery, extracted geometry, textures, and reusable facade references remain blocked unless a narrow exception says otherwise. | Tool outputs and training/reference sets remain blocked until 4M source-safe rules exist. |
| Derivative use | May derive review-only geometry-confidence notes if terms and brief allow. | May derive review-only facade/frontage evidence notes if terms and brief allow. | Derivative geometry, textures, traces, training data, and facade assets remain blocked. | May derive visual-system outputs only from owned/approved references after 4M approval. |
| Extraction | Geometry extraction/conversion is blocked in 4G and requires 4G-A approval. | Automated image extraction is blocked in 4G and requires 4G-B approval plus claim-specific limits. | Geometry extraction, texture extraction, tracing, and facade extraction remain blocked. | Extraction from restricted sources remains blocked. |
| Benchmark use | Future 4G-A may compare geometry confidence only if allowed. | Future 4G-B may compare coverage/evidence suitability only if allowed. | Benchmark-only comparison may be considered by later brief; no storage or extraction by default. | Not applicable as evidence; 4M may benchmark visual-system workflow only. |
| Render use | May not render source geometry directly in normal mode; future output must remain review-only unless promoted later. | May not render imagery or image-derived facade truth in normal mode; future output must remain review-only unless promoted later. | Render use is blocked except for a separately approved narrow exception. | Render use is blocked until 4M and cannot imply evidence truth. |
| Training/generation use | Blocked. | Blocked. | Blocked. | Blocked until 4M; allowed inputs must be owned/approved references, deterministic cue blueprints, and Batu-approved style targets only. |
| Production use | Blocked. | Blocked. | Blocked. | Blocked. |

## Claim Boundaries

### Geometry Confidence Lane

Future NYC 3D / CityGML / 3DCityDB work may only evaluate:

- building height confidence;
- massing confidence;
- roof volume confidence;
- block gap and party-wall confidence;
- review-only geometry-container fit;
- discrepancy notes against existing source-backed graybox records.

It must not evaluate or promote:

- storefront frontage;
- storefront order;
- entrance location;
- tenant assignment;
- business identity;
- active status;
- signage;
- facade appearance;
- material or color;
- exact address placement;
- production asset readiness;
- public/product exactness.

### Facade Evidence Lane

Future Mapillary/KartaView work may only evaluate whether coverage appears suitable for later review-only facade/frontage evidence intake. It may not make the claim itself unless a later batch opens evidence intake and the source terms support the use.

Potential future evidence classes:

- facade-plane visibility;
- storefront-bay visibility;
- entrance-cue visibility;
- sign-band visibility;
- window/door rhythm visibility;
- corner-wrap/side-return visibility;
- occlusion, blur, recency, and angle sufficiency;
- terms/attribution/storage suitability.

Blocked by default:

- storefront anchor creation;
- tenant frontage assignment;
- active-business status;
- exact frontage width/order;
- exact entrance ownership;
- exact sign text/logo/trade dress;
- production art use;
- normal-mode rendering;
- public/product claims.

## Review-Only Coverage Audit Contract

Future 4G-A and 4G-B coverage audit records should be review-only JSON or markdown records, not runtime data, unless a later brief explicitly opens a fixture. Each record must be traceable, status-labeled, and non-promotional.

Required common fields:

- `auditRecordId`
- `auditBatch`
- `sourceLane`
- `candidateSource`
- `sourceAccessStatus`
- `termsReviewStatus`
- `retrievalOrReviewDate`
- `reviewer`
- `corridorScope`
- `coverageScope`
- `allowedUses`
- `blockedUses`
- `attributionRequirement`
- `storageCachePolicy`
- `derivativeUsePolicy`
- `renderUsePolicy`
- `trainingUsePolicy`
- `productionUsePolicy`
- `claimSupportAllowed`
- `claimSupportBlocked`
- `normalModeExposure`
- `qaOnly`
- `reviewOnly`
- `unresolvedQuestions`
- `batuDecisionRequired`

4G-A geometry audit fields:

- `geometryCoverageStatus`
- `heightConfidencePotential`
- `massingConfidencePotential`
- `roofVolumeConfidencePotential`
- `blockGapConfidencePotential`
- `containerAssociationPotential`
- `geometryDiscrepancyNotes`
- `facadeEvidenceSupport` with value `blocked_not_facade_evidence`
- `businessStorefrontSupport` with value `blocked_not_business_or_storefront_evidence`

4G-B facade audit fields:

- `imageryCoverageStatus`
- `facadePlaneVisibility`
- `storefrontBayVisibility`
- `entranceCueVisibility`
- `signBandVisibility`
- `windowDoorRhythmVisibility`
- `cornerWrapVisibility`
- `occlusionStatus`
- `recencyStatus`
- `imageStorageAllowed`
- `imageExtractionAllowed`
- `facadeEvidencePotential`
- `geometryConfidenceSupport` with value `blocked_not_geometry_confidence_source`
- `businessIdentitySupport` with value `blocked_not_business_identity_source`

## Acceptance Criteria For Future Audit Opening

A later 4G-A or 4G-B brief may open audit execution only if it states:

- exact source lane and source names;
- access method and whether network/browser/API/download use is allowed;
- terms, attribution, storage/cache, display, extraction, derivative, render, training, and production boundaries;
- allowed files/work areas;
- record shape and required statuses;
- verifier or review checklist;
- stop conditions;
- whether commit-after-batch behavior is allowed;
- the next hard Batu review gate.

If any source terms are unclear, required access would expand beyond the approved lane, or the audit would need to store imagery/geometry beyond the approved policy, the future batch must stop as `blocked_terms_or_access_unresolved`.

## 4G Non-Authorization

Batch 4G does not authorize:

- NYC 3D / CityGML / 3DCityDB access, download, cache, ingestion, conversion, audit execution, or render use;
- Mapillary/KartaView access, download, cache, ingestion, extraction, audit execution, imagery use, or render use;
- Google 3D Tiles / Street View benchmark execution, imagery storage, geometry extraction, texture use, training use, generation use, or production visual pipeline;
- Qwen/Oxen work;
- business linkage;
- exact storefront, frontage, entrance, address, signage, tenant, facade, material, color, or active-status claims;
- production assets;
- normal-mode exposure;
- public/product claims;
- source expansion beyond this contract.

## Batu Review Questions

- Is the geometry-confidence lane strict enough to prevent NYC 3D / CityGML / 3DCityDB from becoming facade, storefront, or business evidence?
- Is the facade-evidence lane strict enough to prevent Mapillary/KartaView from implying business identity, active status, exact storefront claims, or production art use?
- Are Google 3D Tiles / Street View correctly limited to benchmark-only or narrow-exception material?
- Is Qwen/Oxen correctly deferred to 4M as visual-system acceleration only?
- Are the coverage-audit fields sufficient for Batu to decide whether to open 4G-A, 4G-B, a corrective 4G pass, or no source-access work?
