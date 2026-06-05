# Phase 4A Workflow Spike Plan

Status: Proposed next task unless repo docs already mark it approved
Date: 2026-06-05
Name: Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference
Target corridor: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Goal

Compare three candidate workflow lanes on the same small corridor before committing Phase 4B implementation effort.

Phase 4A output is a decision document and supporting notes. It is not a production system, runtime implementation, schema-file batch, compiler-script batch, source-ingestion batch, asset-kit batch, or public-interface approval.

## Lanes To Evaluate

1. Deterministic compiler lane
   - Use a bounded NYC/Open or OSM-style footprint/source fixture already allowed by repo policy.
   - Evaluate whether source truth can become normalized records, stable IDs, primitive massing, semantic scene manifest shape, and inspectable interaction anchors.
   - A primitive browser preview is allowed only if a later brief explicitly opens it; otherwise Phase 4A stays docs/evidence only.

2. 3D map/export shortcut lane
   - Evaluate whether tools like 3D Mapper or similar exports can accelerate terrain, buildings, or GLB reference creation.
   - Assess structure preservation, stable IDs, editability, licensing clarity, reproducibility, and whether exported geometry can remain subordinate to source truth.

3. Reality-capture/reference lane
   - Evaluate whether reference photos, Google Photorealistic 3D Tiles, Marble/world-model outputs, Gaussian splats, or Street View/photo-to-3D workflows can improve facade, landmark, or corridor recognizability review.
   - Keep these outputs as reference/QA only. They must not become canonical truth, production textures, stored third-party imagery, training input, or exact facade/frontage evidence without later approval.

## Questions Phase 4A Must Answer

- Which lane becomes the core workflow?
- Which lane becomes a reference or acceleration lane?
- Which lane is rejected or deferred?
- Which lane supports semantic interaction and cards?
- Which lane supports reproducibility and stable IDs?
- Which lane supports art direction and modular assets?
- Which lane has licensing, cache, attribution, or runtime risk?
- What is the smallest proof needed before Phase 4B can begin?

## Success Criteria

- The same Manhattan-to-Franklin corridor is evaluated across all three lanes.
- The deterministic compiler lane is judged against shortcut/reference lanes rather than assumed in isolation.
- Storefront anchoring and business-to-storefront matching are evaluated as first-class risks.
- Art direction is evaluated as a modular style/asset-system problem, not only a color/material recipe.
- The result is a clear recommendation before Phase 4B implementation.
- No full-neighborhood scope, PostGIS, dynamic spatial streaming, canonical splats/world models, Blender-as-layout-source, or Phase 4B runtime work is opened by this spike.

## Default Stance

The compiler lane is presumed to become the core unless Phase 4A evidence disproves it. Export and reality-capture lanes may accelerate geometry/reference/fidelity review, but they must remain subordinate to source truth and semantic scene compilation.

Blender may be an asset foundry or offline renderer later. It must not become the canonical layout source.
