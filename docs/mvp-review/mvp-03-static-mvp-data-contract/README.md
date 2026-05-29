# MVP-03 Static MVP Data Contract

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Scope: Docs-only static MVP data contract proposal

## Purpose

This packet translates the MVP-02 place-truth findings into a reviewable static data shape for MVP place data.

It is a docs-only proposal. It does not create app/source files, TypeScript interfaces, runtime schemas, package/config/build changes, public module boundaries, production data contracts, production assets, live data, scraping, backend/CMS/persistence, deployment, or broad map coverage.

Any future app/source data file, import path, module boundary, public interface, real-place card implementation, map position, or visual integration still requires an approved implementation brief.

## Evidence Base

This packet uses existing repository evidence only:

- `docs/PLACE_SCHEMA.md`
- `docs/PLACE_SOURCE_POLICY.md`
- `docs/MVP_SCOPE.md`
- `docs/mvp-review/mvp-01-prototype-state-review-and-gap-brief/README.md`
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`

No new source lookup, scraping, app/source edits, visual generation, asset work, staging, or commit was performed.

## Contract Status

The MVP data contract should remain static, local, review/demo-safe, and truth-preserving.

This proposal may be used by Batu/ChatGPT to approve, revise, or reject the next implementation boundary. Until that happens:

- Field names below are conceptual.
- Example values are illustrative review examples, not production copy.
- No public interface is approved.
- No source-file path is approved.
- No real-place card copy is approved.
- No exact map position, storefront geometry, facade, frontage, entrance, stair, or elevator geometry is approved.

## Recommended Data Units

The MVP should separate four review concepts so uncertainty is not hidden:

| Unit | Purpose | MVP use |
| --- | --- | --- |
| `Place` | A real, placeholder, omitted, deferred, or symbolic point of interest that may be selected, listed, or reviewed. | Cards and interaction targets only after approval. |
| `Building` | A physical address or context structure that may contain one or more places/storefronts. | Needed for 723-725 Manhattan Ave / former Meserole Theater and any multi-tenant ambiguity. |
| `Storefront` | A tenant-facing position, frontage, or entrance relationship inside a building. | Needed when a real business location cannot safely be flattened into one facade claim. |
| `MapAnchor` | An authored scene-placement handle that is not a survey-accurate map claim. | Needed for symbolic anchors, placeholders, and approved interaction-target coordinates in a later implementation brief. |

For MVP implementation, a single future static source file may be enough, but the data shape should preserve these distinctions. Flattening them away would risk false adjacency, false storefront order, or unsupported public representation.

## Required Fields For Real Places

A real place candidate should carry these fields before it can be considered for MVP card use:

| Field | Required? | Purpose / constraint |
| --- | --- | --- |
| `id` | Yes | Stable internal identifier. Must not encode unapproved map position or status claims. |
| `kind` | Yes | `real-place`, `symbolic-anchor`, `context-building`, `placeholder`, `omitted`, or `deferred`. |
| `displayName` | Yes | Public name or approved placeholder label. |
| `category` | Yes | Broad neutral category only. |
| `address` | Yes for businesses/buildings; conditional for transit anchors | Source-facing address text or anchor description. Preserve source wording where useful. |
| `normalizedAddress` | Recommended | Review helper for comparing sources. Must not invent missing details or resolve conflicts silently. |
| `status` | Yes | `active`, `unknown`, `closed`, `placeholder`, `symbolic`, `omitted`, or `deferred`. |
| `candidateOutcome` | Yes | Review outcome from MVP-02 or later approval. |
| `sourceRefs` | Yes for real candidates | Link to reviewed source records with URL, label, claim supported, and access/review notes. |
| `lastVerified` | Yes for real candidates | Date sources were last manually reviewed. It is not a current-status guarantee. |
| `verificationStatus` | Yes | `verified`, `partial`, `unresolved`, or `manual-review-required`. |
| `placementConfidence` | Yes | `high`, `medium`, `low`, or `unresolved`. |
| `truthConstraints` | Yes | What cannot be approximated without misrepresentation. |
| `manualReviewRequired` | Yes | Boolean plus reason list. |
| `approvalStatus` | Yes | `unreviewed`, `proposed`, `approved`, `rejected`, or `deferred`. |
| `card` | Conditional | Only present when card treatment is approved. Must use neutral source-backed copy. |
| `disclaimerRef` | Yes for any real-place card | Points to shared unofficial-map disclaimer text. |
| `notes` | Recommended | Concise review notes, especially unresolved conflicts. |

## Fields For Symbolic Anchors

Symbolic anchors, such as the Greenpoint Av G station before exact access-point geometry is approved, should not pretend to be ordinary businesses.

Required fields:

- `id`
- `kind: symbolic-anchor`
- `displayName`
- `category`
- `anchorDescription`
- `sourceRefs`
- `lastVerified`
- `verificationStatus`
- `placementConfidence`
- `truthConstraints`
- `manualReviewRequired`
- `approvalStatus`
- `card`, only if Batu approves a transit-card treatment
- `disclaimerRef`, if public-facing copy is shown

Symbolic anchors should avoid exact stair, elevator, corner, or access-point claims unless manual verification and Batu approval clear those details.

## Fields For Context Buildings

Context buildings, such as former Meserole Theater / 723-725 Manhattan Ave, should preserve building-level evidence without implying an approved storefront card.

Required fields:

- `id`
- `kind: context-building`
- `displayName`
- `address`
- `normalizedAddress`
- `lotOrParcelId`, when source-supported
- `sourceRefs`
- `lastVerified`
- `verificationStatus`
- `truthConstraints`
- `manualReviewRequired`
- `approvalStatus`
- `linkedPlaceIds`, if any
- `storefrontReviewNotes`

Context-building data must not become public historical copy, facade geometry, or an exact footprint claim without later approval.

## Fields For Placeholders

Placeholders are allowed for review/demo-safe density only when they are clearly not real businesses.

Required fields:

- `id`
- `kind: placeholder`
- `displayName`
- `category`
- `status: placeholder`
- `fictional: true`
- `truthConstraints`
- `approvalStatus`
- `card`, if the placeholder has review-only card text

Placeholder labels must not use real business names and must not imply current real-world status.

## Fields For Omitted Or Deferred Candidates

Omitted and deferred candidates should remain visible in the review data so future batches do not accidentally reintroduce them as active places.

Required fields:

- `id`
- `kind: omitted` or `kind: deferred`
- `displayName`
- `reason`
- `sourceRefs`, if already reviewed
- `lastVerified`, if sources were reviewed
- `candidateOutcome`
- `approvalStatus`
- `reactivationConditions`

Examples:

- Polka Dot should be omitted as an active business unless status conflicts are resolved.
- Karczma should be deferred unless Batu approves westward Greenpoint Ave scene expansion.
- Brouwerij Lane should be omitted from the compact MVP scene unless a different or expanded Franklin/Greenpoint slice is approved.

## Source Reference Shape

Each source reference should describe what the source supports, not merely list a URL.

Conceptual fields:

- `id`
- `label`
- `url`
- `sourceType`: `official-business`, `official-agency`, `public-record`, `map-directory`, `local-reporting`, or `secondary-listing`
- `supports`: concise claim supported by this source
- `doesNotSupport`: optional note for common overreach risks
- `reviewedOn`
- `reviewNotes`

Recommended rule:

> A source URL proves only the specific claim recorded in `supports`.

This prevents a business address source from being misused as proof of storefront width, entrance position, active status, or adjacency.

## Status Vocabulary

Use a small status vocabulary and keep candidate outcome separate from business status.

Recommended `status` values:

- `active`: current status appears source-backed enough for review/demo-safe MVP consideration.
- `unknown`: current status is not confidently verified.
- `closed`: reliable public sources indicate closure.
- `placeholder`: fictional or generic stand-in.
- `symbolic`: transit/civic/context anchor, not an ordinary business listing.
- `omitted`: reviewed and intentionally excluded.
- `deferred`: plausible later candidate blocked by boundary, verification, or scope.

Recommended `candidateOutcome` values:

- `candidate-manual-review-required`
- `symbolic-anchor`
- `context-building-only`
- `omit-active-business`
- `defer-boundary-change-required`
- `omit-alternate-slice`
- `placeholder-density`

Recommended `approvalStatus` values:

- `unreviewed`
- `proposed`
- `approved`
- `rejected`
- `deferred`

Recommended `verificationStatus` values:

- `verified`
- `partial`
- `unresolved`
- `manual-review-required`

No candidate with `partial`, `unresolved`, `manual-review-required`, low placement confidence, conflicting status, or a manual override should be treated as final public representation.

## Card Data Requirements

Card data should be optional and withheld until the place is approved for card treatment.

Conceptual fields:

- `title`
- `subtitle` or `category`
- `description`
- `addressLine`
- `sourceLabel`
- `sourceUrl`
- `lastVerified`
- `disclaimerRef`
- `statusNote`, when uncertainty must be visible

Allowed card copy:

- public name;
- address;
- broad category;
- one small source-backed factual note;
- source label or URL;
- last verified date;
- unofficial-map disclaimer.

Blocked card copy:

- ratings;
- reviews;
- endorsements;
- partnership claims;
- quality/popularity claims;
- cultural-importance claims;
- ownership speculation;
- invented local color;
- unsupported facade, entrance, frontage, exact address-in-visual-placement, stair, elevator, or adjacency claims.

## Shared Disclaimer

Recommended shared disclaimer record:

```text
Unofficial authored prototype. Not an official map, directory, or real-time business listing. Details were manually source-reviewed on the listed date and may have changed.
```

Final wording remains reserved for Batu/ChatGPT review.

## Candidate Contract Read

| Candidate | Recommended contract treatment | Required before MVP card/integration |
| --- | --- | --- |
| Greenpoint Av G station | `symbolic-anchor` | Decide whether it receives a card; manually verify exact access-point geometry before drawing or copying exact stair/elevator claims. |
| Peter Pan Donut & Pastry Shop | `real-place` with `candidate-manual-review-required` | Manual review for storefront width, entrance, side-of-street depiction, and Sweetgreen adjacency. |
| Sweetgreen Greenpoint | `real-place` with `candidate-manual-review-required` | Manual review for 723/725 footprint, entrance, frontage, and adjacency implications. |
| Former Meserole Theater / 723-725 Manhattan Ave | `context-building` | Manual review for footprint/frontage; separate approval for any historical card or public copy. |
| Captured Record Shop | `deferred` or `real-place` with `candidate-manual-review-required` | Manual review for entrance, basement/storefront relationship, side-of-street placement, and adjacency. |
| Polka Dot / 726 Manhattan Ave | `omitted` for active-business use | Resolve status conflict before any real-name display; otherwise use fictional placeholder or unknown/closed treatment only after review. |
| Karczma | `deferred` | Batu approval for westward scene expansion before inclusion. |
| Brouwerij Lane | `omitted` / `omit-alternate-slice` | Different or expanded Franklin/Greenpoint slice approval before reactivation. |

## Proposed Future Source-File Boundary

If Batu/ChatGPT later approve implementation, the smallest reasonable source boundary is one static local MVP data module containing:

- candidates;
- source references;
- shared disclaimer text;
- review statuses;
- optional card copy only for approved card candidates.

This packet does not approve the file path, exported names, runtime format, public interface, or import relationship. A future implementation brief should approve those details before app/source changes.

Recommended future implementation constraints:

- No live fetch.
- No scraper.
- No automated refresh.
- No backend/CMS.
- No generated data pipeline.
- No production/public-release data claim.
- Keep source metadata and uncertainty visible in the static data.
- Keep authored map anchors separate from factual address/source claims.

## Decisions Reserved For Batu

Batu must decide or approve:

- Which MVP-02 candidate recommendations are accepted, revised, or rejected.
- Which candidates receive manual verification before MVP inclusion.
- Which candidates get public-facing cards.
- Whether the G station receives card treatment or remains symbolic context.
- Whether Captured Record Shop is worth manual verification for MVP.
- Whether Karczma requires westward scene expansion or remains deferred.
- Whether Polka Dot is omitted, fictionalized, or represented as unknown/closed after review.
- Final disclaimer wording.
- Any public-facing place copy.
- Any manual override or authored spatial compromise.
- Any implementation source-file path, public interface, module boundary, or app/source integration task.

## Recommended Next Task

Recommended next task:

> MVP-04 MVP Interaction Integration

Approval checkpoint:

MVP-04 should remain proposed/pending until Batu/ChatGPT approve this MVP-03 contract proposal and explicitly approve an implementation boundary for static MVP place data. MVP-04 will require app/source changes and likely active review screenshots, so it should not be auto-activated from this docs-only packet alone.

## Acceptance Status

MVP-03 is complete as a docs-only static MVP data contract proposal for Batu/ChatGPT review.

It does not approve app/source implementation, production data contracts, public interfaces, architecture, exact geometry, exact visual placement, real-place production cards, production assets, live data, scraping, backend/CMS/persistence, deployment, or MVP completion.
