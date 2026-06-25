# Phase 2DTR-4 - Exact Geometry Source Map + Target Scene Spec

Status: Complete for Batu review  
Date: 2026-06-03  
Artifact class: Review-only source-to-scene mapping packet

## Purpose

This packet is the first concrete artifact after Batu unblocked exact MVP review geometry. It maps visible Manhattan Ave / Greenpoint Ave scene elements to the evidence categories that can drive a true-to-life, review-only isometric MVP scene.

The packet defines exact review-coordinate placement requirements for:

- Grillpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway entrance/cues.

It remains review-only. It does not approve production/public exact-geometry claims, production assets, production asset pipeline, app source edits, package/tooling changes, live data, scraping, Google/Street View/3D Tiles extraction, or normal-mode raster replacement.

## Review Question

Does this source map and target scene spec give enough concrete structure to move from DTR packets into an automatic structured-scene-to-raster adapter?

## Files

- `generated/exact-geometry-source-map.json` - maps each visible scene element to NYC/open data, existing source evidence, supplied reference photos, manual review-coordinate interpretation, and unsupported gaps.
- `generated/target-scene-spec.json` - exact MVP review-coordinate placement requirements for the target scene.
- `generated/reproducibility-gap-list.json` - what is currently automatic, what still is not, and the recommended next implementation batch.
- `generated/exact-geometry-source-map-board.png` - visible review board with MVP-29E coordinate overlays, source categories, target requirements, and gaps.
- `SELF_AUDIT.md` - visual/self-audit for the packet.

## What This Proves

- The current MVP scene can now name exact review-coordinate placement requirements for all five target elements.
- Existing local evidence can drive business/place names, address context, candidate footprint context, target order, and review-coordinate placement.
- Supplied reference photos can be explicitly assigned to facade/order/sign/entrance/window/station-cue interpretation.
- The remaining automation gap is now specific: exact geometry fields need to move into a structured scene fixture and be consumed by a raster prompt/provenance adapter.

## What This Does Not Prove

- It does not prove the scene is automatically regenerated end-to-end yet.
- It does not parse reference photos automatically.
- It does not project exact address placement from GIS/open data.
- It does not verify exact Greenpoint G entrance coordinates from official station geometry.
- It does not make product/public factual claims.

## Recommended Next Batch

Phase 2DTR-5 - Exact Review Geometry Fixture To Raster Prompt Adapter.

Move the exact review placement requirements into a review-only structured scene fixture, then generate a deterministic raster prompt and provenance map from that fixture. Add a verifier that fails when a visible scene element lacks `sourceCategory`, `status`, and source path.
