# Phase 3 Brouwerij Lane Source Retrieval Spike

Status: Review-only blocked source-retrieval spike
Date: 2026-06-04
Target: Brouwerij Lane only

## Purpose

This spike tests whether the first non-west Phase 3 corridor target can be populated through source retrieval rather than manual repo-only evidence.

## Finding

Retrieval is blocked. The repo contains historical Brouwerij Lane notes, but it does not contain an approved configured source adapter, checked-in source response, endpoint contract, or credential/API key for deterministic Brouwerij Lane retrieval.

No live retrieval, scraping, browser automation for external evidence, Google/Street View/3D Tiles extraction, or broad ingestion was performed.

## Approved Source Path Review

- `docs/DATA_SOURCES.md` names LiveXYZ as the preferred future source pending access and usage review, but LiveXYZ is not assumed available.
- `docs/PLACE_SOURCE_POLICY.md` allows public factual research only with provenance and strong claim limits; public directories alone do not clear exact placement, facade, frontage, entrance, production card, or public-readiness claims.
- Existing source-evidence scripts convert and verify checked-in static fixtures. They are not live source adapters.
- No Brouwerij Lane LiveXYZ link, static source export, source adapter, endpoint contract, or source credential was found in repo configuration or local environment.

## Field Status

| Field | Status | Notes |
| --- | --- | --- |
| Identity | `blocked_source_retrieval` | Brouwerij Lane is the scoped spike target label, not a newly retrieved source-backed identity claim. |
| Address | `blocked_source_retrieval` | Historical notes mention 78 Greenpoint Ave, but no approved source response was retrieved or normalized in this spike. |
| Category/business type | `blocked_source_retrieval` | No approved source response exists. |
| Coordinates | `blocked_source_retrieval` | No approved geocoder, POI response, or checked-in coordinate payload exists. |
| Source provenance | `blocked_source_retrieval` | No retrieved payload, source id, retrieval timestamp, attribution record, or adapter output exists. |
| Storefront/frontage/order | `blocked` | POI/address data would not prove storefront order or tenant frontage. |
| Facade/source imagery | `blocked` | No Batu-supplied or approved facade/reference imagery exists for this target. |
| Entrance | `blocked` | No approved entrance evidence exists. |
| Raster readiness | `blocked` | No corridor-specific raster/reference surface or Brouwerij visual evidence exists. |

## Local Historical Evidence Reviewed

- `docs/DATA_FEASIBILITY.md`: records Brouwerij Lane as an alternate-slice candidate near Franklin/Greenpoint, with earlier public-listing support for 78 Greenpoint Ave and an official contact page that was not text-readable in that pass.
- `docs/mvp-review/mvp-02-place-truth-packet/README.md`: parks Brouwerij Lane as possible later-slice research and requires manual verification if reactivated.
- `docs/MVP_SCOPE.md`: lists Brouwerij Lane / Franklin-Greenpoint only as possible later expansion if a later slice or boundary is approved.

These notes support why Brouwerij Lane is a plausible spike target, but they do not satisfy this batch's source-retrieval goal.

## Missing To Unblock

- Batu-approved source for Brouwerij Lane identity, address, category/business type, coordinates, and provenance retrieval.
- A checked-in static source response or deterministic adapter contract for that source.
- Any required credential/API key or exported source payload, with usage, storage, attribution, and review limits documented.
- Separate Batu-supplied/approved reference imagery or field evidence for facade, storefront/frontage/order, entrance, and raster-readiness claims.

## Fixture Update

The Phase 3 scaffold now links this spike as a Brouwerij Lane source-retrieval-blocked candidate under the Franklin Ave endpoint. The fixture does not promote historical Brouwerij notes into sourced business data.
