# Data Sources

Status: Docs-only source hierarchy / not ingestion approval
Date: 2026-06-01
Creative/product/public-interface approval owner: Batu
Execution owner inside approved boundaries: Codex

## Purpose

This document defines the Phase 2 source hierarchy and source-use warnings for the Data-Driven Scene MVP.

It does not approve ingestion scripts, scraping, live data, API clients, generated scene data, mock data, app source changes, production data use, or public-release claims.

## Approved Default Source Hierarchy

1. LiveXYZ - preferred pending access, not assumed available.
2. NYC open data - geometry and public records.
3. OSM - supplemental streets/POIs with attribution considerations.
4. Google/Street View/Places - fallback/reference only until licensing is resolved.
5. Manual/team evidence - allowed but must be provenance-tracked.

Use the strongest available source for the claim being made. A source that supports one claim does not automatically support another.

## LiveXYZ

LiveXYZ is the preferred future source pending access and usage review.

Use in Phase 2 only after Batu confirms:

- Access is available.
- Terms and allowed uses are understood.
- Export/storage rules are known.
- Attribution, caching, and public-display requirements are documented.
- The source can be represented in provenance records.

Until then, LiveXYZ remains a preferred direction, not an assumed dependency.

## NYC Open Data

NYC open data and official public records are the default open-data starting point for geometry and public-record context.

Likely claim support:

- Parcel/tax-lot references.
- Building footprints or public building records.
- Address context.
- Street/intersection geometry.

Known limits:

- Building footprints do not solve storefront segmentation.
- Public records may not prove current tenant identity.
- Address records do not prove entrance location.
- Official geometry does not automatically translate into stylized scene placement.

## OSM

OSM may supplement street, sidewalk, building, POI, and neighborhood context.

Use OSM with care:

- Preserve attribution requirements.
- Treat OSM POIs as supplemental unless corroborated.
- Do not use OSM alone for sensitive placement, business status, exact storefront order, or public card finality.
- Record OSM source ids and retrieval dates where used.

## Google / Street View / Places

Google/Street View/Places material is fallback/reference only until licensing is resolved.

Warnings:

- Imagery existence does not imply production usage rights.
- Google imagery must not be treated as freely reusable production input.
- Do not use Google-derived imagery for stored facade assets, extraction, tracing, texture reuse, generation input, training input, or exact trade-dress reproduction unless a later legal/architecture gate explicitly approves it.
- Batu's narrow MVP-only SW Dunkin exception remains limited, non-production, review/demo-scale, and does not generalize.

Potential allowed role before licensing resolution:

- Human-readable reference for unresolved review questions only when explicitly permitted by the current brief.
- Cross-checking identity or context only where policy allows.

## Manual / Team Evidence

Manual/team evidence can include owned field photos, Batu observations, approved reference photos, hand review notes, or explicit review decisions.

Manual evidence is allowed only if:

- It has provenance.
- It records owner/source.
- It records reviewed date.
- It records usage/licensing status.
- It records what claim it supports.
- It records what claim it does not support.

Manual evidence must not become a hidden correction. If it changes a generated result, it must be recorded as an explicit manual override.

## Claim Classes

### Geometry Claims

Examples:

- Parcel boundaries.
- Building footprints.
- Street segments.
- Intersections.
- Crosswalk/station context where supported.

Preferred sources:

- LiveXYZ when approved.
- NYC open data and official public records.
- OSM as supplemental.
- Manual review for unresolved authored placement.

### Place / Business Claims

Examples:

- Business name.
- Category.
- Address.
- Active/closed/unknown status.
- Card eligibility.

Preferred sources:

- Official business website/profile.
- Official branch/location/public agency records where available.
- Secondary public directories only as corroboration.
- Manual review for conflicts.

### Storefront / Entrance Claims

Examples:

- Tenant frontage.
- Entrance location.
- Storefront order.
- Multi-tenant relationship.

Preferred sources:

- Owned/approved field photos.
- Official public records where they actually support the claim.
- Manual review.

Known warning:

- Storefront segmentation is likely one of the hardest parts of Phase 2.

### Visual-Reference Claims

Examples:

- Sign cues.
- Facade cues.
- Station-cue visual relationship.
- Review-only raster reference.

Preferred sources:

- Owned field photos.
- Explicitly approved references.
- Non-Google public/official references where rights are clear.
- Restricted/fallback references only under explicit exception.

## Ambiguity Warnings

- Building footprints do not solve storefront segmentation.
- Address/business matching will be ambiguous.
- Imagery existence does not imply production usage rights.
- Google imagery must not be treated as freely reusable production input.
- A source URL may verify identity but not exact facade, entrance, or frontage.
- A source may verify a station exists but not exact stair alignment.
- A directory listing may be stale or wrong.
- A stylized scene coordinate is not real-world proof.

## Required Source Record Fields

Every source used in Phase 2 should be representable with:

- Source id.
- Source type.
- Title or label.
- URL or local path.
- Retrieved/reviewed date.
- Claim types supported.
- Claim types not supported.
- Usage/licensing status.
- Attribution requirement.
- Confidence notes.
- Conflict notes.

## Out Of Scope

- Scrapers.
- Live refresh jobs.
- Production data services.
- Backend services.
- Public business directory claims.
- Automated broad storefront matching.
- Full Greenpoint coverage.
- Google-derived production imagery or extracted facade data.
