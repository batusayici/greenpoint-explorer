# Phase 2DTR-8 - Fixture Geometry Primitive Completion For Styled Raster Readiness

Status: Complete for Batu review
Date: 2026-06-03
Scope: Review-only geometry/spec artifacts, not polished raster art or production/public exact geometry

## Purpose

DTR-8 completes the hard layout primitives that DTR-7 showed were missing. The goal is to make DTR-9 consume structured geometry instead of prose-only prompt interpretation.

No polished raster, AI image generation, live scraping, Google/Street View/3D Tiles extraction, app source edit, package/tooling change, normal-mode replacement, or production/public exact-geometry claim was introduced.

## Dirty State Reconciliation

Before this batch, the repository already had one dirty visual artifact:

- `docs/mvp-review/mvp-29e-four-corner-raster-scene-production/generated/four-corner-manhattan-greenpoint-review.png`

It remains dirty and out of scope. DTR-8 does not restore it or commit it because this batch is a geometry/spec completion packet, not prior visual artifact cleanup.

## Deliverables

- `generate-geometry-primitives.mjs` - Packet-local deterministic generator.
- `generated/geometry-primitive-fixture.json` - Derived structured fixture with road, pedestrian, storefront/building, policy, render-order, and occlusion primitives.
- `generated/styled-raster-ready-geometry-adapter.json` - JSON-primary DTR-9 adapter output.
- `generated/geometry-primitive-blueprint.svg` - Black-and-white deterministic blueprint proving the primitives are represented.
- `generated/geometry-primitive-validation-report.json` - Machine-readable validation report.
- `generated/styled-raster-geometry-prompt.txt` - Secondary prompt text, subordinate to the JSON adapter.

No PNG was generated.

## What DTR-8 Completes

- Road geometry: Manhattan Ave road band, Greenpoint Ave road band, intersection overlap polygon, street-name placement zones, and orientation cues.
- Pedestrian/corner geometry: sidewalks, curbs, crosswalks, curb cuts, corner zones, and sidewalk-to-storefront relationships.
- Storefront/building primitives: building mass bounds, storefront bounds, facade/frontage bounds, sign panel bounds, entrance bounds, window bounds, address anchors, render order, z-order, and occlusion rules.
- Address-label policy: in-scene address text is disabled for styled raster; exact addresses are QA-only to prevent another Dunkin `893` vs `993` text drift.
- Greenpoint G subway cue policy: one primary Greenpoint G cue is defined; extra G circles/signs/entrance hints are omitted unless explicitly marked `secondary_symbolic` or `context_only`.
- Geometry-first adapter: JSON is the source of truth for DTR-9; prose is secondary and may not replace the structured spec.

## What Remains Unresolved

- The primitives remain review-coordinate geometry, not GIS/survey geometry.
- Road, sidewalk, curb, crosswalk, and curb-cut primitives are manually derived review geometry, not source-projected public geometry.
- Automatic reference-photo facade parsing remains unsupported.
- Production/public exact-geometry claims remain blocked.
- DTR-9 still needs visual judgment: the styled raster must follow supplied reference imagery and the approved art direction without inventing layout, addresses, or extra subway cues.

## DTR-9 Readiness Verdict

Ready for DTR-9.

The validation report status is `review-only-ready-for-dtr9`. All required primitives exist, the address-label policy exists, the single primary Greenpoint G cue policy exists, render order/occlusion rules exist, and no polished raster was generated.

## Exact DTR-9 Recommendation

Phase 2DTR-9 should be: Controlled Styled Raster From Geometry-First Adapter Output.

DTR-9 should:

- Use `generated/styled-raster-ready-geometry-adapter.json` and `generated/geometry-primitive-fixture.json` as the layout source of truth.
- Use supplied reference imagery only for facade styling cues after geometry placement is locked.
- Produce one controlled review-only styled raster and one QA comparison board.
- Keep address text QA-only unless Batu explicitly reopens in-scene address labels.
- Render one primary Greenpoint G cue only.
- Preserve review-only/provenance labels and avoid production/public exact-geometry claims.

## Self-Audit

- Intended decision: Batu can decide whether DTR-9 may proceed directly to controlled styled raster generation from structured geometry.
- Fidelity level: Level 1 diagram/blockout plus JSON spec.
- Required output format: JSON and SVG.
- SVG status: Allowed because this is a deterministic layout/spec blueprint, not a high-fidelity art-direction raster.
- Visual evidence: The SVG shows road bands, intersection overlap, sidewalks, curbs, crosswalks, curb cuts, storefronts, sign panels, entrances, address policy, and one primary subway cue.
- Truth handling: All primitives are review-only; unsupported claims remain omitted/listed.
- Missing fidelity: No texture, lighting, art direction, or final facade rendering is tested here.
- Pass/fail: Pass for styled-raster readiness; DTR-9 can proceed under JSON-first adapter constraints.
