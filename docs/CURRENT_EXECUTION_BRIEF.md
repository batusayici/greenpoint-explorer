# Current Execution Brief - Phase 3 West Anchor Spatial Grounding Review

Status: Phase 2DTR / MVP feedback demo is complete and locked for MVP-feedback purposes. The review-only DTR-11 interactive demo remains the active locked MVP demo, and the Vercel Preview remains review-only behind protected shareable-link access. Phase 3 first scaffold direction is approved only as described in `docs/phase-3-architecture-scaling-decision-surface.md`. The Phase 3 corridor scaffold, west-anchor realness pass, mid-corridor candidate/status layer, Franklin endpoint status layer, Brouwerij Lane source-retrieval spike, Phase 3 POI/business source ADR, local-directory ADR amendment, Foursquare Brouwerij adapter contract, Foursquare credential/source blocker report, source-independent west-anchor QA/evidence overlay pass, and west-anchor spatial grounding pass are complete. The west anchor now has a review-only spatial grounding overlay for Manhattan Ave / Greenpoint Ave that shows approximate street relationship, corner orientation, contextual building massing, active storefront cue placement, DTR-11 facade cues, and symbolic/blocked subway context.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, and any later Phase 2, Phase 3, or MVP gates.

## Completed Authorized Batch

Phase 3 west-anchor spatial grounding pass for Manhattan Ave / Greenpoint Ave only.

Purpose:

- Make the west anchor visually reviewable as the real Manhattan Ave / Greenpoint Ave location before asking Batu to evaluate cards, QA overlays, facade evidence, or claim status.
- Use existing reviewed business/place metadata, NYC/open geometry context, DTR-11/reference-photo-derived facade evidence status, and the existing placeholder/scaffold renderer.
- Preserve evidence lanes as supporting UI and keep mid-corridor, Franklin, and Brouwerij Lane candidate/blocked.

Completed output:

- The Phase 3 scaffold fixture now exposes a west-anchor `spatialGrounding` packet with manual-draft Manhattan Ave and Greenpoint Ave axes, crosswalk context, four corner pads/masses, active storefront cue blocks for Grillpoint Deli, McDonald's, Dunkin', and Citizens Bank, and a symbolic Greenpoint Av G station-area cue.
- The existing placeholder renderer now draws the spatial grounding packet as a review-only scaffold overlay on default load and preserves QA/evidence overlays in review mode.
- The selected west-anchor card now shows a compact Spatial Grounding section before the existing evidence lanes, geometry context, facade evidence, real-place context, and source pointers.
- Visible labels distinguish manual-draft/approximate contextual geometry and symbolic transit treatment from exact tenant frontage, exact entrances, exact geometry, station geometry, raster readiness, or production/public claims.
- The placeholder raster remains scaffold mechanics only.
- No live Foursquare request was attempted.
- Brouwerij Lane, Franklin, and mid-corridor targets were not deepened.

## Next State

Batu review / approval pending.

Purpose:

- Decide whether the current review-only spatial grounding overlay is enough for a reviewer familiar with the intersection to say: "I can tell what part of Greenpoint this is supposed to be, even if still draft."
- Decide whether the next executable task should refine this spatial grounding, add an approved facade/frontage/entrance evidence path, prepare a corridor-specific review raster/surface, or pause Phase 3 implementation pending a later gate review.

Expected output:

- Batu/ChatGPT review notes or an updated current execution brief from Batu authorizing the next small implementation batch.
- No further source edits are authorized by this brief until Batu accepts, redirects, or replaces the next-task pointer.

Foursquare remains optional future enrichment only. It is not the blocking source of truth for MVP proof progress.

## Boundaries

- Review-only.
- No live Foursquare retrieval.
- No broad API integration.
- No scraping.
- No generalized ingestion.
- No production/public readiness.
- No public schemas/interfaces.
- No package/tooling/CI changes unless a later brief explicitly opens them.
- No backend services, CMS, persistence, analytics, broad coverage, full 3D, or major animation/aliveness systems.
- No Google/Street View/3D Tiles extraction or production use.
- Do not deepen Brouwerij Lane yet.
- Do not deepen Franklin or mid-corridor targets yet.
- Do not implement broad corridor coverage.
- Do not replace the placeholder Phase 3 raster.
- Do not create a final raster replacement.
- Do not create or approve production visual assets, production asset direction, or a production asset pipeline.

## Context To Preserve

- Source-of-truth order remains `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, then topic-specific docs.
- The locked MVP is still one review-only, raster-first interactive four-corner diorama of Manhattan Ave x Greenpoint Ave.
- Phase 2DTR is complete and locked for MVP-feedback purposes; do not open DTR-12 unless later feedback makes that necessary and Batu explicitly approves it.
- Phase 3 remains the Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave exploration slice unless a later brief expands scope.
- The west anchor is sourced from existing reviewed MVP context and now visibly carries separate evidence/status lanes.
- Evidence overlays are downstream of spatial recognizability. The current proof now attempts to make the base scene recognizable as the Manhattan Ave / Greenpoint Ave location through a review-only overlay; Batu still owns whether it passes.
- Mid-corridor, Franklin endpoint, and Brouwerij Lane remain candidate/blocked where evidence is missing.
- The Phase 3 POI/business ADR is `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`.
- The Foursquare one-target adapter contract is `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`; it remains blocked unless explicit credentials and repo-recorded terms/cache/display/review-only approvals exist.
- The Foursquare credential/source blocker report is `docs/phase-3-brouwerij-foursquare-credential-blocker.md`; it records that no API call, raw fixture, or normalized evidence output was created.
- POI/business data may support identity, address, category, coordinates, and possibly freshness/status; it must not be used to infer facade, frontage/order, entrance, exact geometry, or raster readiness.
- NYC/Open geometry may support building/parcel/geometry context; it must not be used alone to infer tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Facade/frontage/entrance evidence requires Batu-supplied or Batu-approved reference/source material.

## Verification For The Completed Spatial Grounding Batch

Completed checks:

- JSON parse for `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`.
- `npm run build`.
- Browser smoke: default load, visual west-anchor recognition, card click, and QA overlay visible. Mobile containment could not be viewport-smoked because the in-app browser surface did not expose viewport resizing and the repo does not include local Playwright.
- Visual self-audit against the spatial recognizability goal: the west anchor now visibly shows Manhattan Ave / Greenpoint Ave street relationship, four corner masses, active storefront cues, crosswalks, and symbolic subway context before evidence-card review.
- `git diff --check`.
- `git status --short`.

## Stop Conditions

Stop and report the blocker before:

- Implementing broad API integration, scraping, generalized ingestion, source-vendor integration, backend services, package tooling, public interfaces, or production architecture.
- Treating Foursquare or any candidate source as approved credential/access.
- Claiming Brouwerij Lane identity/address/category/coordinates/provenance as sourced without an approved deterministic source response or adapter path.
- Using POI/business data to infer facade, frontage/order, entrance, exact geometry, or raster readiness.
- Treating NYC/Open geometry context as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Treating evidence-card completeness as visual feedback readiness before the base scene is recognizable.
- Weakening review-only status, promotion gates, source-evidence determinism checks, or production/public-readiness gates.
- Editing unrelated review-package/audit files unless a later task explicitly requires it.
