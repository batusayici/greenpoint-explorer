# Phase 3 Closeout

Status: Planning closeout / no new implementation approval
Date: 2026-06-05
Scope: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Closeout Finding

Phase 3 validated that real corridor geometry and business/source evidence matter, but it also exposed that artifact-specific rendering is not a scalable production workflow.

The project should stop trying to patch the current manually guided corridor artifact and move toward a production-shaped data-to-scene pipeline: source truth, deterministic semantic scene compilation, art-directed visual interpretation, and interactive browser presentation.

## Preserved Learnings

- Real geometry must drive building and corridor structure.
- Reference imagery remains important for local recognizability and facade fidelity review.
- Business data must remain semantic and inspectable, not baked into imagery.
- Hover, click, card, and QA states are core interaction requirements, not later decoration.
- The current Phase 3D matte is useful review evidence, but it is not reproducible enough to become the production workflow.
- Storefront anchoring is a first-class unresolved problem because one building footprint can contain multiple businesses and POI coordinates rarely identify storefront slots.
- Art direction must be systematized through style recipes and modular asset kits, not only prose prompts, color notes, or one-off raster repair.
- Manual overrides are allowed only when explicit, versioned, provenance-linked, and reviewable.

## Current Evidence To Preserve

- Phase 3D review matte: `src/assets/review-only/phase-3d-greenpoint-westward-corridor-matte-review-only.png`
- Phase 3D review package: `docs/mvp-review/phase-3d-corridor-style-matte-review/`
- Phase 3D deterministic screenshot: `docs/mvp-review/phase-3d-corridor-style-matte-review/generated/phase-3d-corridor-style-matte-default.png`
- Phase 3 real corridor evidence inventory: `docs/phase-3-real-corridor-evidence-inventory.md`
- Phase 3 POI/business source ADR: `docs/decisions/ADR-2026-06-04-phase-3-poi-business-source-selection.md`
- Foursquare Brouwerij contract/blocker docs: `docs/phase-3-foursquare-brouwerij-poi-adapter-contract.md`, `docs/phase-3-brouwerij-foursquare-credential-blocker.md`
- Phase 3 geometry-first corridor review package: `docs/mvp-review/phase-3-geometry-first-corridor-review/`

## Claim Discipline

This closeout does not promote Phase 3 artifacts into production assets, public factual claims, exact facades, exact addresses, exact storefront order, active business claims, or a production asset pipeline.

The Phase 3D matte remains review-only and non-production. Sourced NYC/Open geometry remains street/building context only. Brouwerij, business/POI, frontage, facade, entrance, signage, active-status, exact-storefront, and exact-address claims remain blocked unless later evidence gates explicitly clear them.

## Next Direction

The next useful step is `Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference`, proposed unless repo docs already mark it approved.

Phase 4A should compare candidate workflow lanes before Phase 4B implementation is opened. Phase 4B planning should remain non-implementation until Batu approves the architecture boundaries, public interfaces, and executable scope.
