# Phase 4G-B Facade Evidence Source Audit

Status: Review-only audit artifact; candidate sources are not approved evidence sources
Date: 2026-06-08
Scope: Mapillary/KartaView facade evidence lane feasibility for Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

4G-B evaluates whether Mapillary and KartaView could support future review-only facade/storefront evidence intake.

This audit does not access imagery, download imagery, cache imagery, ingest imagery, render imagery, texture from imagery, extract features from imagery, train on imagery, or productionize imagery. It reviews public documentation only.

## Sources Reviewed

| Source | Reviewed material | Audit role |
| --- | --- | --- |
| Mapillary | Help-center licensing, introduction, map-feature, dictionary, and API visibility pages | Candidate street-level imagery and metadata lane. |
| KartaView | Terms page snippets, API response/photo/sequence documentation snippets, and public API documentation pages | Candidate street-level imagery and metadata lane. |

## Findings

Mapillary is a plausible future candidate for review-only facade/frontage evidence because public docs describe crowdsourced street-level imagery, image keys, sequence keys, EXIF/GPS/capture-time metadata, and computer-vision map features. Public help docs state Mapillary imagery is shared under CC BY-SA with attribution. However, the developer API documentation and terms page were login-gated in this audit environment, so any future API use, credential use, cache/display rule, bulk query, image download, thumbnail use, extraction, or production use remains blocked until Batu accepts the full applicable terms.

KartaView is a plausible future candidate for review-only facade/frontage evidence because public docs describe street-level photo and sequence APIs with fields such as latitude, longitude, heading, field of view, processing status, sequence ID, sequence bounds, device name, and file URL. Public terms snippets state that street images and 3D spatial data are licensed under CC BY-SA and require credit to Grab and contributors. Any future image download, cache, display, API use, extraction, or production use remains blocked until Batu accepts the full applicable terms and source-specific storage/display rules.

Neither source proves business identity, active status, tenant frontage, exact storefront order, exact frontage width, exact entrance ownership, exact sign text/logo/trade dress, exact address placement, production asset readiness, normal-mode rendering, or public/product claims.

## Candidate Review Claims

Allowed future review-only potential:

- imagery coverage availability;
- facade-plane visibility;
- storefront-bay visibility;
- entrance-cue visibility;
- sign-band visibility;
- window/door rhythm visibility;
- corner-wrap or side-return visibility;
- occlusion, blur, recency, and angle sufficiency;
- attribution/display/cache feasibility notes.

Blocked claim support:

- business identity;
- active-business status;
- tenant frontage assignment;
- storefront anchor approval;
- exact frontage width or order;
- exact entrance ownership;
- exact sign text, logo, or trade dress;
- material/color truth;
- exact address placement;
- production asset generation;
- normal-mode rendering;
- public/product exactness.

## Terms And Storage Boundary

Current 4G-B status:

- Public documentation review is not blocked.
- No imagery or image-derived data was accessed, downloaded, cached, ingested, rendered, extracted, or used.
- Mapillary API/terms review is incomplete because the API documentation and terms page were login-gated in this audit environment.
- KartaView public snippets indicate CC BY-SA licensing for street images/3D spatial data with credit requirements, but full future use still needs Batu acceptance.
- Future display must carry attribution and license information if Batu later approves source use.
- Future cache/storage policy must be explicit before any imagery, thumbnail, file URL, sequence, or metadata record is saved.
- Automated image extraction and model training remain blocked.

## Decision

4G-B result: pass for review-only facade evidence lane feasibility, with source-specific terms/API acceptance still required before any real source access, imagery use, cache, ingestion, extraction, display, or production step.

This is not source approval. Mapillary and KartaView remain candidate facade-evidence lanes only. They are not business evidence sources, production sources, normal-mode inputs, approved imagery stores, or sources of exact storefront/frontage/entrance truth.

## Unresolved Questions

- Whether Batu wants a later terms-review gate using authenticated Mapillary developer/API terms.
- Whether future coverage checks may record source metadata only, or whether even metadata storage needs a stricter source-specific cache/display policy.
- Whether future review evidence should link out to source pages instead of storing image URLs or thumbnails.
- Whether CC BY-SA share-alike requirements create product-design constraints for any future display or derivative review artifact.

## Reviewed Public URLs

- https://help.mapillary.com/hc/en-us/articles/115001770409-CC-BY-SA-license-for-open-data
- https://help.mapillary.com/hc/en-us/articles/115001770269-An-Introduction-to-Mapillary
- https://help.mapillary.com/hc/en-us/articles/115002332165-Map-features
- https://help.mapillary.com/hc/en-us/articles/115001754885-The-Mapillary-Dictionary
- https://www.mapillary.com/developer/api-documentation/
- https://www.mapillary.com/terms
- https://kartaview.org/terms
- https://kartaview.org/doc/photos
- https://kartaview.org/doc/sequences
- https://kartaview.org/doc/api-response
