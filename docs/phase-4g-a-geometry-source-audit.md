# Phase 4G-A Geometry Source Audit

Status: Review-only audit artifact; candidate source is not approved for production use
Date: 2026-06-08
Scope: NYC 3D / CityGML / 3DCityDB geometry-confidence support for Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Purpose

4G-A evaluates whether NYC 3D / CityGML / 3DCityDB can support future review-only geometry-confidence work.

This audit does not access, download, cache, ingest, convert, render, extract, or productionize any source data. It reviews public documentation only.

## Sources Reviewed

| Source | Reviewed material | Audit role |
| --- | --- | --- |
| NYC 3D Building Model | NYC metadata PDF, NYC metadata index, NYC download listing, NYC Open Data public policies, NYC.gov Terms of Use | Candidate public geometry dataset and terms/use boundary. |
| CityGML | OGC CityGML standard page and linked 3.0/2.0 standard materials | Geometry exchange/model standard for interpreting possible future CityGML records. |
| 3DCityDB | 3DCityDB documentation and GitHub project README/license notes | Candidate tooling/database model for future CityGML storage/import/export review only. |

## Findings

NYC 3D is a plausible future geometry-confidence source for review-only building height, massing, roof-volume, block-gap, and geometry-container checks. NYC metadata describes a citywide 2014 building model, divided by community district, based on aerial survey material, with roof structure detail and building components separated across Rhino layers. The metadata also states use limitations and warranty disclaimers, so future data use needs explicit Batu terms acceptance before download, cache, conversion, fixture import, render use, or production use.

CityGML is a plausible standard lane for future geometry interpretation. OGC describes CityGML as a conceptual model and exchange format for virtual 3D city models, with building geometry, semantic structure, and levels of detail. For this project, CityGML may help normalize building/massing/roof/container questions, but it does not create facade, storefront, entrance, tenant, signage, active-business, exact-address, or business-assignment evidence.

3DCityDB is plausible as future tooling for CityGML storage/import/export review. Its documentation describes support for CityGML versions and spatial database storage, with Apache-2.0 licensing for the current software. It would introduce database/tooling architecture and likely dependencies if used beyond documentation review, so it remains blocked until a later Batu architecture and dependency gate.

## Candidate Claim Support

Allowed review-only geometry-confidence potential:

- building height confidence;
- massing confidence;
- roof volume confidence;
- block gap and party-wall confidence;
- geometry-container review;
- discrepancy notes against existing source-backed graybox records.

Blocked claim support:

- storefront frontage;
- storefront order;
- facade appearance;
- entrance location or ownership;
- tenant assignment;
- business identity;
- active status;
- signage;
- material or color;
- exact address placement;
- production asset readiness;
- normal-mode rendering;
- public/product exactness.

## Terms And Storage Boundary

Current 4G-A status:

- Public documentation review is not blocked.
- No source data was downloaded, cached, ingested, converted, rendered, or extracted.
- Future download/cache/ingestion/conversion must be separately approved by Batu.
- Future public republishing or application incorporation must preserve source/version/modification identification requirements where applicable.
- Future use must carry NYC disclaimer/quality limitations and source attribution requirements.
- 3DCityDB tooling use would require a later architecture/dependency gate even though the current software license appears permissive.

## Decision

4G-A result: pass for review-only geometry-confidence audit feasibility.

This is not source approval. NYC 3D / CityGML / 3DCityDB remain candidate geometry-confidence lanes only. They are not facade evidence, storefront evidence, business evidence, production assets, normal-mode inputs, or authoritative geometry truth.

## Unresolved Questions

- Whether Batu wants to approve a later narrow source-access batch for NYC 3D model download/cache/conversion.
- Whether a future batch should evaluate a no-new-dependency metadata-only path before any 3DCityDB/database work.
- Whether future geometry-container review should compare NYC 3D against the existing 4D geometry validation report or wait until facade evidence intake is complete.

## Reviewed Public URLs

- https://www.nyc.gov/assets/planning/download/pdf/data-maps/open-data/nyc-3d-model-metadata.pdf
- https://github.com/CityOfNewYork/nyc-geo-metadata
- https://maps.nyc.gov/download/3dmodel/
- https://cityofnewyork.github.io/opendatatsm/publicpolicies.html
- https://www.nyc.gov/main/terms-of-use
- https://www.ogc.org/standards/citygml/
- https://github.com/3dcitydb/3dcitydb
- https://3dcitydb-docs.readthedocs.io/en/latest/overview/license.html
