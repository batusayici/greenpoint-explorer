# Phase 2DTR-1 - One-Corner Real-Data-to-Raster Reproduction Slice

Status: Complete for Batu review  
Date: 2026-06-03  
Scope: Review-only Grillpoint/NW data-to-raster-spec proof packet

## Purpose

This packet starts Phase 2DTR-1 by proving the first narrow path from structured source fields to deterministic raster instructions for one corner:

```text
source inputs
-> structured one-corner source object
-> deterministic raster/spec artifact
-> visual-instruction provenance map
-> visible comparison against MVP-29E
```

The target is `Grillpoint Deli` on the NW corner. This does not create a new production asset, does not edit the app, and does not promote any exact facade/frontage/address/station claims.

## Outputs

- Structured one-corner source object: `structured-source-object.json`
- Deterministic generated raster/spec artifact: `generated/raster-spec.json`
- Visual-instruction provenance/status mapping: `generated/visual-instruction-provenance.json`
- Visible comparison board: `generated/grillpoint-nw-dtr-comparison-board.png`
- MVP-29E NW crop used by the comparison: `generated/mvp-29e-nw-grillpoint-crop.png`
- Preview crop from supplied Grillpoint facade reference: `generated/reference-grillpoint-facade-preview.png`
- Preview crop from supplied Grillpoint closeup reference: `generated/reference-grillpoint-closeup-preview.png`
- Preview crop from supplied NW subway/context reference: `generated/reference-nw-subway-context-preview.png`
- Self-audit: `SELF_AUDIT.md`

## Artifact Class

- Intended artifact class: Level 1/Level 2 review evidence for a data-to-raster pipeline proof.
- Decision supported: whether the one-corner source/status model and generated raster instructions are strong enough to extend to Phase 2DTR-2.
- Required output format: JSON for deterministic source/spec/provenance artifacts; PNG/JPG for visible comparison evidence.
- SVG status: SVG is disallowed for primary world art. This packet uses only existing raster/photo inputs for visible comparison and does not create code-native primary world art.

## Source Discipline

Used existing local sources only:

- `src/data/real-data/manhattan-greenpoint-ave.active-targets.phase-2aa.json`
- `src/data/draft-scenes/manhattan-greenpoint-ave.phase-2v.json`
- `src/data/source-evidence/manhattan-greenpoint-ave.phase-2d.json`
- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg`
- `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg`
- `docs/mvp-reference-images/northwest-subwayA.jpg`
- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`
- `docs/approved-reference-corpus/MANIFEST.md`

No live scraping, live API calls, browser source acquisition, Google/Street View/3D Tiles extraction, texture extraction, tracing, new package tooling, app source edits, data fixture edits, or script edits were introduced.

## Review Read

The most important review question is not whether this packet is prettier than MVP-29E. It is whether each proposed raster instruction is now traceable to a structured source field and status:

- `sourced`: business name/category/address/sign-label support.
- `manual_draft`: scene envelope, storefront bay, layout, material/color density.
- `inferred`: approximate frontage/anchor guidance.
- `symbolic`: nearby Greenpoint G context.
- `blocked`: exact facade, exact tenant frontage/order, exact entrance/window geometry, exact address placement, exact station geometry, production/public claims.

## Comparison Against MVP-29E

MVP-29E remains the manually composed four-corner raster baseline/reference. This packet compares the NW Grillpoint slice against MVP-29E by extracting the current NW crop and placing it beside the field/source references and the generated instruction/status summary.

MVP-29E is not treated as proof that the data-to-raster pipeline is complete. It is the comparison target.

## Outcome

This batch completes the first 2DTR-1 packet:

- The one-corner source object exists.
- The deterministic raster/spec artifact exists.
- The visual-instruction provenance map exists.
- The comparison evidence exists.
- Normal-mode app behavior and source fixtures are unchanged.

## Unresolved Decisions

Batu still owns:

- Whether this 2DTR-1 source/spec structure is accepted, revised, or rejected.
- Whether to generate a fresh Grillpoint raster from this spec in a later approved visual generation pass.
- Whether Phase 2DTR-2 should extend this structure to McDonald's, Dunkin', Citizens, and Greenpoint G.
- Any approval of public schemas, public interfaces, exact facade/frontage/address/station claims, production visual assets, or production/public readiness.
