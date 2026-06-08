# Phase 4H-1 Facade Evidence Intake Workflow Contract

Status: Review-only workflow contract; no real imagery intake
Date: 2026-06-08
Scope: Source-safe facade evidence intake workflow for Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

4H-1 defines how future facade evidence records may be shaped, reviewed, stored, displayed, blocked, and verified.

This contract does not ingest real imagery, approve Mapillary/KartaView, approve NYC 3D / CityGML / 3DCityDB, promote evidence sources, promote claim levels, create storefront anchors, link businesses, expose normal mode, or authorize production use.

## Intake Principles

- Geometry confidence and facade evidence remain separate lanes.
- Evidence records are review-only until Batu approves a later source and claim-promotion gate.
- External imagery defaults to no download, no cache, no thumbnail storage, no file URL storage, no render use, no extraction, no training, and no production use.
- Batu-supplied/project-owned imagery may be indexed only inside a later approved batch and only with explicit usage boundaries.
- POI, business, address, and geometry records cannot infer storefront/frontage/entrance/signage truth by themselves.
- Every blocked claim must remain visible in QA/review artifacts.

## Evidence Record Shape

Every future facade evidence record must include:

- `evidenceRecordId`
- `evidenceBatch`
- `recordStatus`
- `sourceLane`
- `sourceCandidate`
- `sourceApprovalStatus`
- `termsReviewStatus`
- `usageRightsStatus`
- `sourceAccessStatus`
- `provenance`
- `corridorScope`
- `coverageScope`
- `storageCachePolicy`
- `displayPolicy`
- `attributionRequirement`
- `licenseOrTermsSummary`
- `allowedUses`
- `blockedUses`
- `claimSupportAllowed`
- `claimSupportBlocked`
- `reviewStatuses`
- `observedCueFields`
- `qualityReviewFields`
- `geometryAssociationPolicy`
- `businessLinkagePolicy`
- `normalModeExposure`
- `productionUsePolicy`
- `batuDecisionRequired`
- `unresolvedQuestions`

## Provenance Fields

Required provenance fields:

- `sourceOwner`
- `sourceSupplier`
- `sourceName`
- `sourceRecordReference`
- `sourceRecordReferenceStoragePolicy`
- `captureOrPublishDate`
- `retrievalOrReviewDate`
- `reviewer`
- `attributionText`
- `licenseName`
- `sourceVersion`
- `modificationsMade`
- `accessMethod`
- `accessWasPerformed`
- `imageryWasStored`
- `thumbnailWasStored`
- `fileUrlWasStored`

`accessWasPerformed`, `imageryWasStored`, `thumbnailWasStored`, and `fileUrlWasStored` must default to `false` for external candidate sources until a later Batu gate opens source-specific use.

## Allowed Claim Levels

Allowed future review-only claim levels:

- Level 6 storefront/frontage review candidate: may record that imagery appears to show a possible storefront/frontage cue, but must not claim exact width, order, tenant, or anchor.
- Level 7 entrance review candidate: may record that imagery appears to show a possible entrance cue, but must not claim exact location or ownership.
- Level 8 facade/signage review evidence: may record facade plane, sign-band, window/door rhythm, corner-wrap, and visual-cue visibility, but must not claim exact sign text, logo, trade dress, material/color truth, or production art readiness.

Blocked until later Batu approval:

- Tenant frontage assignment.
- Business identity from imagery.
- Active-business status.
- Exact storefront anchor.
- Exact frontage width/order.
- Exact entrance ownership.
- Exact sign text/logo/trade dress.
- Exact address placement.
- Material/color truth.
- Production asset generation.
- Normal-mode rendering.
- Public/product claims.

## Review Statuses

Allowed review statuses:

- `source_terms_pending`
- `source_access_blocked`
- `candidate_review_only`
- `manual_review_required`
- `blocked_insufficient_evidence`
- `blocked_conflicting_evidence`
- `blocked_restricted_source_contamination`
- `blocked_frontage_ambiguity`
- `blocked_multi_tenant_ambiguity`
- `eligible_for_batu_review`
- `approved_evidence_backed`

Only Batu may set or authorize `approved_evidence_backed`, and only inside a later approved batch.

## Storage Cache Display Rules

Default external-source rules:

- `imageStorageAllowed`: `false`
- `thumbnailStorageAllowed`: `false`
- `fileUrlStorageAllowed`: `false`
- `metadataStorageAllowed`: `false` until a later source-specific cache/display gate
- `renderUseAllowed`: `false`
- `textureUseAllowed`: `false`
- `trainingUseAllowed`: `false`
- `normalModeDisplayAllowed`: `false`
- `qaDisplayAllowed`: `false` until source-specific display rules and attribution are accepted

Default Batu-supplied/project-owned rules:

- Repo-local path indexing may be allowed only in a later approved evidence packet.
- Usage rights must remain `review_only_owner_confirmation_required_before_promotion` unless Batu approves more.
- Cropping, transforming, stylizing, tracing, texture use, generation input, production asset use, and normal-mode display remain blocked unless a later Batu gate opens them.

## Blocked Claim Behavior

Verifier and review artifacts must block promotion when:

- Terms or source approval is pending.
- Source access/download/cache/ingestion would be needed.
- Evidence quality is insufficient, stale, occluded, blurry, or angle-limited.
- Geometry association is unresolved.
- Multi-tenant frontage is unresolved.
- Business identity or active status would be inferred from imagery.
- Any exact storefront/frontage/entrance/address/signage/tenant claim would be made.
- Any Google Street View / Google 3D Tiles, Qwen/Oxen, restricted source, scraped source, cached API output, or unapproved derivative appears in the claim path.

## Verifier Requirements

Future verifiers must check:

- Required record/provenance fields exist.
- External source storage/cache/display flags remain false unless a later Batu gate changes them.
- Geometry confidence fields are not used as facade evidence.
- Facade evidence fields are not used as business identity, active-status, or exact storefront/frontage/entrance/address truth.
- All blocked uses and blocked claim levels are present.
- `approved_evidence_backed` is absent unless a later Batu-approved batch explicitly opens it.
- Normal-mode exposure and production use remain blocked.
- No real source URLs, file URLs, thumbnails, downloaded imagery, cached imagery, source-derived textures, or training inputs appear in review-only contract records unless a later gate explicitly allows them.

## 4H-1 Result

4H-1 defines the intake workflow contract only. It does not ingest evidence. It prepares the project for a later Batu decision on whether to open 4I corridor facade cue expansion, a narrow source terms gate, or a corrective intake-contract pass.
