# Phase 2DTR-5 - Exact Review Geometry Fixture To Raster Prompt Adapter

Status: Complete for Batu review
Date: 2026-06-03
Scope: Review-only MVP artifact data, not production geometry or production art direction

## Purpose

This packet turns the Phase 2DTR-4 exact-geometry source map and target scene spec into machine-readable data that can directly drive a raster-generation pass for the Manhattan Ave / Greenpoint Ave MVP slice.

The output is intentionally review-only. It may use exact storefront, frontage, entrance, window, address, and Greenpoint G station-cue review geometry because Batu unblocked those categories for MVP review artifacts. It does not approve production/public exact-geometry claims, production assets, production asset pipeline, live data, Google/Street View/3D Tiles extraction, or normal-mode use.

## Generated Artifacts

- `generated/exact-review-geometry-fixture.json` - Structured fixture for Grillpoint Deli, McDonald's, Dunkin', Citizens Bank, and Greenpoint G station/entrance cues.
- `generated/raster-prompt-adapter-spec.json` - Deterministic adapter output that converts the fixture into a prompt/spec for a true-to-life review-only isometric scene.
- `generated/adapter-provenance-map.json` - Field-level provenance map for business/place identity, visible text cues, and geometry fields.
- `generated/raster-prompt.txt` - Human-readable raster prompt derived from the adapter spec.

## Fixture Field Shape

Each target contains:

- `businessOrPlace` - Real business/place name, category, and address/context cue where available.
- `evidenceInputs` - Existing source evidence, NYC/open-data scaffold references, and supplied reference photos.
- `visibleTextCues` - Sign and address/context text that should be visible or available to the raster prompt.
- `geometry` - Review-coordinate placement data for building mass, frontage, storefront bounds, sign panel, entrance, window cues, address anchors, or station cues.
- `adapterDirectives` - Target-specific raster-generation instructions.
- `unsupportedFields` - Items that must remain labeled unresolved, unsupported, symbolic, or review-only.

Every field created by the adapter carries:

- `value`
- `sourceCategory`
- `sourceCategories`
- `status`
- `sourceIds`
- `sourcePaths`
- `notes`

## Provenance Categories

- `nyc_open_data` - Building scaffold context only. It does not support tenant frontage, facade appearance, active-business status, address placement, or station entrance geometry by itself.
- `existing_source_evidence` - Existing checked-in evidence fixtures and review packets.
- `reference_photo_derived` - Review-only interpretation from supplied reference photos.
- `manual_review_only_interpretation` - Human-prepared review-coordinate placement for the MVP proof.
- `unsupported_or_unresolved` - Not reproducible yet or intentionally not claimed.

## Remaining Unsupported Gaps

- Automatic reference-photo facade parsing is not implemented.
- Automatic storefront frontage/order measurement is not implemented.
- Automatic exact address-to-scene projection is not implemented.
- Exact Greenpoint G entrance geometry is still review-only and manually interpreted.
- Production/public exact-geometry claims remain blocked.
- The adapter does not generate a raster image yet; it generates deterministic fixture and prompt/spec inputs for the next raster pass.

## Generator

Run:

```sh
node scripts/generate-phase-2dtr-5-exact-review-raster-prompt.mjs
```

Optional deterministic output directory:

```sh
node scripts/generate-phase-2dtr-5-exact-review-raster-prompt.mjs --output-dir /tmp/phase-2dtr-5-check
```
