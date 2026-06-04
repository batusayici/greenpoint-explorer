# Current Execution Brief - Phase 3 Brouwerij Lane Source Access / Fixture Gate

Status: Phase 2DTR / MVP feedback demo is complete and locked for MVP-feedback purposes. The review-only DTR-11 interactive demo remains the active locked MVP demo, and the Vercel Preview remains review-only behind protected shareable-link access. Phase 3 first scaffold direction is approved only as described in `docs/phase-3-architecture-scaling-decision-surface.md`. The Phase 3 corridor scaffold, west-anchor realness pass, mid-corridor candidate/status layer, Franklin endpoint status layer, one-target evidence-deepening audit, Brouwerij Lane source-retrieval spike, and Phase 3 POI/business source ADR are complete. The ADR recommends separate source lanes and keeps Brouwerij Lane blocked until Batu approves or supplies deterministic source access/fixture material.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Next Proposed / Blocked Batch

Phase 3 Brouwerij Lane deterministic POI evidence packet, pending Batu approval or supply of source access/material.

Purpose:

- Use the completed source ADR to normalize exactly one Brouwerij Lane POI/business evidence packet if Batu supplies or approves a deterministic source lane.
- Preferred path: LiveXYZ or Batu-approved local-directory/static export.
- Fallback path: Foursquare Places API or export, only after Batu approves credentials, terms, caching/storage/display limits, and a bounded one-target fixture/export path.
- Open cross-check path: OSM/static extract where useful for corroboration.
- Geometry/context path: NYC Open Data/official public records only for building/parcel/street/address-container context.
- Facade/frontage/entrance/raster path: Batu-supplied or Batu-approved manual evidence only.

This proposed batch remains blocked until Batu supplies or approves one of:

- LiveXYZ/local-directory static source packet or approved access path for Brouwerij Lane.
- Foursquare credential/export/response fixture path plus usage/caching/display approval.
- A different Batu-approved deterministic POI source packet for Brouwerij Lane.

If no source access/material is supplied, Brouwerij Lane remains `blocked_source_retrieval` and the next useful Phase 3 action is a Batu decision: provide source access/material, switch targets, or provide manual evidence packets.

## Authorized Work

Codex may create or update review-only docs needed to prepare the next bounded evidence packet only after Batu supplies or approves the source material/access above. A later execution brief must explicitly authorize any live request or fixture creation.

Allowed after source/access approval:

- Normalize exactly one Brouwerij Lane POI/business evidence record using the ADR shape in `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`.
- Record source id, provider id, retrieved/reviewed date, raw fixture path or hash, usage/caching/display status, attribution, fields requested, normalized identity/address/category/coordinates/freshness-status, confidence, cross-checks, and blocked claims.
- Preserve separate blocked fields for facade, frontage/order, entrance, geometry-context limits, and raster readiness.
- Update `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, and `docs/CURRENT_EXECUTION_BRIEF.md` after the batch.

Expected output if authorized:

- One review-only deterministic Brouwerij Lane POI evidence packet or a precise blocked credential/source report.
- No app behavior changes unless a later brief explicitly authorizes fixture consumption.

## Boundaries

- Review-only.
- No broad API integration.
- No scraping.
- No generalized ingestion.
- No production/public readiness.
- No public schemas/interfaces.
- No package/tooling/CI changes unless a later brief explicitly opens them.
- No backend services, CMS, persistence, analytics, broad coverage, full 3D, or major animation/aliveness systems.
- No Google/Street View/3D Tiles extraction or production use.
- No source-vendor integration beyond a later explicitly approved one-target source packet/retrieval fixture.
- Do not deepen Brouwerij Lane yet.
- Do not deepen any other non-west target.
- Do not replace the placeholder Phase 3 raster.
- Do not create or approve production visual assets, production asset direction, or a production asset pipeline.

## Context To Preserve

- Source-of-truth order remains `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, then topic-specific docs.
- The locked MVP is still one review-only, raster-first interactive four-corner diorama of Manhattan Ave x Greenpoint Ave.
- Phase 2DTR is complete and locked for MVP-feedback purposes; do not open DTR-12.
- Phase 3 remains the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice unless a later brief expands scope.
- The west anchor is sourced from existing reviewed MVP context.
- Mid-corridor, Franklin endpoint, and Brouwerij Lane remain candidate/blocked where evidence is missing.
- The Phase 3 POI/business ADR is `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`.
- ADR decision summary: primary POI lane is LiveXYZ/local-directory static export/access if Batu approves terms and deterministic fixture storage; fallback POI lane is Foursquare after credentials/terms approval; OSM is open corroboration; NYC Open Data is geometry/context only; manual evidence packets are required for facade/frontage/entrance/raster readiness.
- POI/business data may support identity, address, category, coordinates, and possibly freshness/status; it must not be used to infer facade, frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry may support building/parcel/geometry context; it must not be used alone to infer tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material.

## Verification For The Completed ADR/Source Spike Batch

- Required control-doc/source-doc reread: `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, `docs/DATA_SOURCES.md`, `docs/PROVENANCE_AND_QA.md`, `docs/SCENE_MANIFEST_SCHEMA.md`, `docs/DECISION_LOG.md`, and `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- No generated/static ADR JSON or fixture was created.
- Markdown/lint command search: no dedicated docs lint or markdown lint script is available in `package.json`.
- `npm run build` not applicable because this batch changed docs only and no app-imported behavior.
- `git diff --check`.
- `git status --short`.

## Verification For The Next Proposed Evidence Packet Batch

Expected checks for a later authorized source-material batch:

- JSON parse for any generated/static evidence packet or fixture.
- Raw fixture hash/check, if a source response/export is checked in.
- `git diff --check`.
- `git status --short`.
- `npm run build` only if app-imported docs/data/source behavior changes.

## Stop Conditions

Stop and report the blocker before:

- Implementing broad API integration, scraping, generalized ingestion, source-vendor integration, backend services, package tooling, public interfaces, or production architecture.
- Treating candidate source availability as approved credential/access.
- Claiming Brouwerij Lane identity/address/category/coordinates/provenance as sourced without an approved deterministic source response or adapter path.
- Using POI/business data to infer facade, frontage/order, entrance, exact geometry, or raster readiness.
- Weakening review-only status, promotion gates, source-evidence determinism checks, or production/public-readiness gates.
- Editing app/source files or unrelated review-package/audit files during this docs-only reconciliation batch.
