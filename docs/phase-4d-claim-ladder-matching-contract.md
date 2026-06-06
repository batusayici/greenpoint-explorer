# Phase 4D Claim Ladder And Matching Contract

Status: Batch 4D-2 review artifact
Date: 2026-06-06
Scope: Greenpoint Ave from Manhattan Ave toward Franklin Ave
Owner boundary: Batu owns claim promotion approval, source authority decisions, public representation, visual acceptance, and all later POI/facade/storefront gates. Codex may implement only inside approved future briefs.

## Purpose

This contract defines the evidence and claim rules for future POI, business, facade, storefront, entrance, signage, and landmark matching work.

It does not authorize adding POIs, businesses, facade imagery, storefront anchors, source expansion, runtime visual changes, tenant frontage matches, production claims, or public-ready place representation.

The core rule is:

```text
geometry can host review;
address can suggest candidates;
POI data can enrich candidates;
facade/frontage evidence must prove storefront placement;
Batu approval promotes claims.
```

## Claim States

Use these states consistently in future fixtures, reports, QA panels, and docs.

| State | Meaning | Runtime use |
| --- | --- | --- |
| `allowed_contextual` | Source supports contextual review, not public/product-ready truth. | May appear in QA and, where already approved, normal contextual massing. |
| `candidate_only` | Source suggests a possible match but cannot prove the claim alone. | QA only unless a later brief explicitly opens candidate display. |
| `manual_review_required` | Evidence is incomplete, ambiguous, stale, or conflicting. | QA only. Must not drive normal rendering. |
| `blocked_insufficient_evidence` | Required evidence is absent. | QA/report only. |
| `blocked_conflicting_evidence` | Sources disagree in a way that affects the claim. | QA/report only. |
| `blocked_address_ambiguity` | Address, parcel, building, or unit mapping is unresolved. | QA/report only. |
| `blocked_multi_tenant_ambiguity` | One building/address may contain multiple businesses or storefronts. | QA/report only. |
| `blocked_frontage_ambiguity` | Storefront order, width, entrance, or facade edge is unresolved. | QA/report only. |
| `blocked_restricted_source_contamination` | Claim depends on unapproved, restricted, or policy-blocked source material. | Must not render or be used for generation/promotion. |
| `approved_evidence_backed` | Batu-approved evidence supports the claim for the approved use. | May affect runtime only inside a later approved implementation batch. |

## Claim Ladder

| Level | Claim | Meaning | Allowed evidence | Disallowed evidence | Runtime effect | QA only | Blocked until Batu-approved evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Geometry container | A rendered mass can be used as a review container for later matching. It is not survey-grade truth. | Existing 4B manifest, existing geometry fixture, runtime builder, 4D-1 confidence report, NYC/Open footprint context. | POI coordinates, business names, address strings alone, facade imagery, synthetic facade cues. | Existing massing/context rendering only. Confidence labels are QA-only unless a later brief says otherwise. | Yes for confidence/gap status. | No for contextual geometry; yes for any exact geometry/public claim. |
| 2 | Address candidate | An address may be associated with a geometry container for review. | Official address/range records, MapPLUTO or equivalent city records, approved local records, manually reviewed source notes. | POI coordinates alone, business listing title, map pin placement, inferred storefront order, synthetic facade cues. | No normal rendering effect in this batch. Future candidate labels must be QA-only unless approved. | Yes. | Yes for exact address placement or public card use. |
| 3 | Parcel/building association | A parcel, tax lot, building footprint, or building ID may be associated with a rendered container. | Official city lot/building records, NYC/Open building footprints, MapPLUTO or equivalent, 4D-1 ambiguity status. | Business directories alone, POI pins alone, facade appearance, storefront signage. | May support existing geometry inspection. Must not prove business/storefront placement. | Yes for ambiguity and review status. | Yes for claims beyond contextual building/parcel association. |
| 4 | POI candidate | A business/place record may be considered a candidate for the corridor or an address/building. | Future approved Foursquare/local-directory/static source packet, official business website/profile, official agency/license/location records, documented public directories as secondary evidence. | Building footprints alone, address range alone, facade cue geometry, synthetic QA facade slice, unapproved scraping/API output. | No runtime effect until a later candidate overlay batch is approved. | Yes, if future batch opens it. | Yes for active status finality, cards, and placement beyond candidate status. |
| 5 | Tenant-at-address claim | A named business is associated with an address. This does not prove storefront/frontage. | Official business source, agency/license/location record, corroborated directory records, documented `lastVerified` review. | Footprint geometry alone, POI coordinates alone, facade appearance alone, stale or conflicting directories without review. | No runtime effect until later approved data/QA batch. | Yes for candidate or review-required status. | Yes for active/public representation if evidence is incomplete or stale. |
| 6 | Storefront/frontage claim | A tenant or place occupies a specific street-facing frontage, order, width, or storefront segment. | Batu-supplied/project-owned street-level imagery, field photos/manual observations, approved facade/frontage evidence packet, explicit manual review notes. | POI coordinates, address strings, building footprints, tax lots, geometry-only facade cues, synthetic QA facade modules, business names. | Must not affect runtime until later evidence-backed anchor batch is approved. | Yes for gaps and review notes only. | Yes. |
| 7 | Entrance claim | A specific entrance/door/location belongs to a tenant, building, or storefront. | Approved field photos, Batu-supplied imagery, official building/tenant plans if approved, manual review with provenance. | POI pins, address strings, footprints, facade rhythm placeholders, inferred doorway-like shapes. | No runtime effect until later approved evidence-backed implementation. | Yes for blocked/review-required notes. | Yes. |
| 8 | Facade/signage claim | A facade, sign, brand, awning, window/door layout, material, color, or visual identity corresponds to a real place. | Batu-supplied/project-owned facade evidence, approved field photos, approved official imagery, documented evidence packet with usage rights. | Synthetic QA facade slice, geometry-only cues, Google/Street View/3D Tiles unless separately approved by source-policy gate, POI data, business names alone. | No normal rendering effect until later approved evidence/art batch. | Yes for evidence review status only. | Yes. |
| 9 | Landmark/special-treatment claim | A building/place is eligible for special visual treatment due to verified landmark, transit, civic, historic, or neighborhood-significance evidence. | Official landmark/civic/transit records, Batu-approved reference/evidence packet, project-owned observations, documented manual review. | Visual prominence in the scene, map popularity, AI interpretation, business category alone, unsupported local-memory assumptions. | No runtime effect until later approved visual/product batch. | Yes for eligibility review only. | Yes for special art treatment and public claims. |

## Matching Rules

### Building Footprint To Address

- A footprint can be linked to address context only when official city/address/parcel records support the link.
- NYC/Open building footprints may support building massing, footprint ID, parcel/building context, and geometry-container review.
- NYC/Open building footprints must not prove tenant, storefront, frontage, entrance, signage, active business, exact address placement, or real facade claims.
- If a footprint has multiple possible addresses, missing address data, shared tax-lot context, or conflicting source records, mark `blocked_address_ambiguity` or `manual_review_required`.
- A geometry container marked `safe` in 4D-1 can host later address review; `safe` does not promote address truth.

### Address To POI Or Business

- An address can suggest a POI/business candidate only when a future approved source packet includes a place record and provenance.
- Official business sources or official public profiles outrank directory/map listings for business identity.
- Directories and map listings can corroborate candidate identity, address, category, and possible freshness, but they do not prove storefront placement or active-status finality alone.
- If address strings differ, unit/suite data is missing, the source is stale, or candidate records conflict, use `manual_review_required` or `blocked_conflicting_evidence`.
- Candidate POIs must remain semantic data and must not be baked into image pixels.

### POI Or Business To Storefront/Frontage

- POI/business records must not be matched to a storefront, frontage, entrance, sign, or facade from coordinates, business name, address string, category, building footprint, or tax-lot association alone.
- Storefront/frontage matching requires approved street-level evidence and explicit review of side, order, width/extent, entrance relationship, and ambiguity.
- Multi-tenant buildings default to `blocked_multi_tenant_ambiguity` until storefront evidence resolves tenant order and frontage.
- A future storefront anchor must reference both geometry confidence and facade/frontage evidence; it must not be silently inferred.

### Facade Cue To Rendered Geometry

- Geometry-only facade cues may align review planes, width/height/depth tiers, side, endpoint role, and block-break status to rendered geometry.
- Synthetic QA facade slice records may support non-factual street-feel review only.
- Neither geometry-only cues nor synthetic QA facade modules prove facade appearance, storefront order, tenant frontage, entrance, signage, material, window/door layout, exact address placement, or production readiness.
- Evidence-backed facade cues require Batu-supplied/project-owned or otherwise Batu-approved evidence with provenance and allowed uses.
- Any source with restricted or unapproved usage must trigger `blocked_restricted_source_contamination`.

### Landmark To Special-Treatment Eligibility

- Landmark/special treatment can be considered only after official or Batu-approved evidence identifies the object and the allowed visual treatment.
- Landmark eligibility does not automatically approve exact facade reproduction, signage, material, or production asset work.
- Transit/civic/landmark cues must distinguish exact geometry from symbolic/contextual representation.
- If a landmark source conflicts with geometry, address, or facade evidence, mark `blocked_conflicting_evidence` and stop promotion.

## Promotion Gates

Future work may promote claims only when all relevant gates pass:

1. Geometry gate: rendered container is `safe` or explicitly approved for manual review despite uncertainty.
2. Source gate: source is approved for storage, cache, display, attribution, and intended use.
3. Evidence gate: claim-specific evidence exists and supports the exact claim being made.
4. Ambiguity gate: address, parcel/building, tenant, frontage, entrance, and source conflicts are resolved or explicitly blocked.
5. Runtime gate: the current brief authorizes the claim to affect QA or normal rendering.
6. Batu gate: Batu approves any public/product, visual, exact, or special-treatment claim.

## Default Blocked States

Use these defaults unless a later approved brief gives a narrower rule:

- Missing approved source packet: `blocked_insufficient_evidence`.
- Single source with no corroboration for sensitive placement: `manual_review_required`.
- Conflicting address/business/source records: `blocked_conflicting_evidence`.
- Multi-address footprint or shared tax-lot uncertainty: `blocked_address_ambiguity`.
- Multi-tenant building without frontage evidence: `blocked_multi_tenant_ambiguity`.
- Business known only at address/building level: `blocked_frontage_ambiguity`.
- Any unapproved Google/Street View/3D Tiles, scraper, cached API, or terms-uncertain evidence in the claim path: `blocked_restricted_source_contamination`.

## 4D-2 Non-Authorization

This document does not authorize:

- Foursquare/local-directory/API/scraper/live-data calls.
- POI overlays or business records.
- Tenant-at-address fixtures.
- Storefront anchors or facade anchors.
- Facade imagery ingestion or generated/production assets.
- Runtime visual changes.
- New dependencies, package/tooling changes, backend services, CMS, persistence, deployment, or analytics.
- Public/product-ready claims.

## Next Review Question

Batu should review whether this ladder is strict enough to prevent accidental claim promotion while still allowing later QA-mode candidate work to move quickly.

If accepted, the next proposed batch remains `Batch 4D-3: Candidate POI overlay`, which must be separately authorized with source, terms/cache/display, fixture, and QA boundaries before any POI/business data is added.
