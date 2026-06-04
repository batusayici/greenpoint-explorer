# Current Execution Brief - Phase 3 POI/Business Source ADR + Narrow Source Spike

Status: Phase 2DTR / MVP feedback demo is complete and locked for MVP-feedback purposes. The review-only DTR-11 interactive demo remains the active locked MVP demo, and the Vercel Preview remains review-only behind protected shareable-link access. Phase 3 first scaffold direction is approved only as described in `docs/phase-3-architecture-scaling-decision-surface.md`. The Phase 3 corridor scaffold, west-anchor realness pass, mid-corridor candidate/status layer, Franklin endpoint status layer, one-target evidence-deepening audit, and Brouwerij Lane source-retrieval spike are complete. The Brouwerij spike showed that repo-local evidence and configured source access are insufficient to deepen Brouwerij Lane.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Next Authorized Batch

Phase 3 POI/business source ADR + narrow source spike.

Purpose:

- Make the source/API decision the next explicit Phase 3 batch.
- Decide which source lanes can support Phase 3 business/place evidence before Brouwerij Lane or any other non-west target is deepened.
- Produce a review-only ADR/source-spike packet that can unblock, or clearly block, a deterministic one-target Brouwerij Lane retrieval pass.

This batch is required before:

- Brouwerij Lane identity/address/category/coordinate/provenance fields are deepened.
- Any other non-west Phase 3 target is deepened.
- Any corridor-specific real target is promoted beyond candidate/blocked status.

## Authorized Work

Codex may create or update review-only docs needed for the ADR/source spike. The batch may:

- Compare Google Places, Foursquare Places, OSM/Overpass, NYC Open Data, LiveXYZ/local-directory path, and manual evidence packets.
- Distinguish what each source may support:
  - POI/business claims.
  - Building/parcel/geometry claims.
  - Facade/frontage/entrance claims.
  - Raster readiness.
- Evaluate coverage, freshness/status quality, address precision, coordinate precision, category quality, licensing/cache/display risk, provenance support, cost/rate limits, deterministic fixture fit, and review burden.
- Recommend primary, fallback, and cross-check source lanes.
- Define what credentials or access are needed.
- Define the normalized deterministic evidence record shape needed for later Phase 3 source-backed records.
- Identify whether a narrow live/source check is possible from already-approved/configured access.
- If no credential/source access is available for a narrow live check, produce a blocked credential/source report rather than pretending retrieval is available.

Expected output:

- A review-only ADR/source-spike artifact or packet.
- `docs/PLAN.md` and `docs/MVP_EXECUTION_LEDGER.md` reconciled after the batch.
- `docs/CURRENT_EXECUTION_BRIEF.md` updated to the next approved/proposed task or next blocker after the ADR/source spike.

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
- No source-vendor integration beyond the narrow ADR/source-spike analysis.
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
- POI/business data may support identity, address, category, coordinates, and possibly freshness/status; it must not be used to infer facade, frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry may support building/parcel/geometry context; it must not be used alone to infer tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material.

## Verification For This Docs-Only Reconciliation Batch

For the roadmap reconciliation batch that created this brief:

- Existing markdown/lint command: not available in `package.json`; no dedicated docs lint script identified.
- `npm run build`: not applicable because these docs are not imported into app behavior.
- `git diff --check`.
- `git status --short`.

## Verification For The Next ADR/Source Spike Batch

Expected checks for the next batch:

- Any generated/static ADR/source-spike JSON or fixture parses, if created.
- Any deterministic source-spike script/check runs, if added by the authorized brief.
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
